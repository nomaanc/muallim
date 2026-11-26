// @ts-check

/**
 * Muallim ul-Qur'an — Qari Audio, CacheStorage & Web Speech TTS Engine (v7.0)
 * Streams verified Surah:Ayah recitations from EveryAyah (Alafasy 128kbps),
 * chains range refs ("50:12-13") and multi-refs ("2:39; 2:82"), caches MP3s
 * in CacheStorage (`muallim-audio-v1`, max 150 entries), supports continuous
 * lesson queue playback, and falls back to Web Speech TTS (ar-SA).
 */

const EVERYAYAH_BASE = 'https://everyayah.com/data/Alafasy_128kbps/';
const AUDIO_CACHE_NAME = 'muallim-audio-v1';
const AUDIO_CACHE_MAX = 150;

/**
 * Parse a surah:ayah, range ref ("50:12-13"), or semicolon multi-ref ("2:39; 2:82")
 * into an ordered list of EveryAyah audio entries.
 * @param {string | null | undefined} ref
 * @returns {Array<{surah: number, ayah: number, label: string, url: string}>}
 */
export function parseRefAudioList(ref) {
  if (!ref || typeof ref !== 'string') return [];
  const parts = ref.split(';').map(p => p.trim()).filter(Boolean);
  /** @type {Array<{surah: number, ayah: number, label: string, url: string}>} */
  const list = [];

  for (const part of parts) {
    const match = part.match(/^(\d{1,3}):(\d{1,3})(?:\s*[-–—]\s*(\d{1,3}))?/);
    if (!match) continue;
    const surah = parseInt(match[1], 10);
    const startAyah = parseInt(match[2], 10);
    const endAyahRaw = match[3] ? parseInt(match[3], 10) : startAyah;
    if (!surah || surah < 1 || surah > 114 || !startAyah || startAyah < 1) continue;
    const endAyah = endAyahRaw >= startAyah ? Math.min(endAyahRaw, startAyah + 20) : startAyah;
    const sPad = String(surah).padStart(3, '0');
    for (let ayah = startAyah; ayah <= endAyah; ayah++) {
      const aPad = String(ayah).padStart(3, '0');
      list.push({
        surah,
        ayah,
        label: `${surah}:${ayah}`,
        url: `${EVERYAYAH_BASE}${sPad}${aPad}.mp3`
      });
    }
  }
  return list;
}

/**
 * Parse a surah:ayah or range ref returning the first ayah entry.
 * @param {string | null | undefined} ref
 * @returns {{surah: number, ayah: number, label: string, url: string} | null}
 */
export function parseRefAudio(ref) {
  const list = parseRefAudioList(ref);
  if (list.length === 0) return null;
  return {
    ...list[0],
    label: String(ref || '').trim()
  };
}

class AudioPlayer {
  constructor() {
    /** @type {HTMLAudioElement | null} */
    this._audio = null;
    /** @type {string | null} */
    this._objectUrl = null;
    /** @type {HTMLElement | null} */
    this._activeBtn = null;
    /** @type {string | null} */
    this._activeKey = null;
    /** @type {number} */
    this._rate = 1.0;
    /** @type {number} */
    this._playToken = 0;
    /** @type {boolean} */
    this._isQueuePlaying = false;
    /** @type {((state: {playing: boolean, index: number, total: number, key?: string}) => void) | null} */
    this._queueStateCb = null;
    this._warnedNoArVoice = false;
  }

  /**
   * @param {number} rate
   */
  setRate(rate) {
    this._rate = Math.min(1.5, Math.max(0.5, Number(rate) || 1.0));
    if (this._audio) {
      this._audio.playbackRate = this._rate;
    }
  }

  _revokeObjectUrl() {
    if (this._objectUrl) {
      try {
        URL.revokeObjectURL(this._objectUrl);
      } catch (_) {
        // ignore revoke failures
      }
      this._objectUrl = null;
    }
  }

  stop() {
    this._playToken++;
    if (this._audio) {
      try {
        this._audio.pause();
        this._audio.src = '';
      } catch (err) {
        console.warn('[Audio] Cleanup error:', err);
      }
      this._audio = null;
    }
    this._revokeObjectUrl();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {
        console.warn('[Audio] Speech cancel error:', err);
      }
    }
    this._clearButtonState();
    this._activeKey = null;

    if (this._isQueuePlaying) {
      this._isQueuePlaying = false;
      const cb = this._queueStateCb;
      this._queueStateCb = null;
      if (cb) cb({ playing: false, index: 0, total: 0 });
    }
  }

  _clearButtonState() {
    if (this._activeBtn) {
      this._activeBtn.classList.remove('is-playing', 'is-loading');
      this._activeBtn.removeAttribute('aria-busy');
      this._activeBtn.setAttribute('aria-pressed', 'false');
      this._activeBtn = null;
    }
  }

  /**
   * @param {HTMLElement | null} btn
   * @param {'loading' | 'playing' | 'idle'} state
   */
  _setButtonState(btn, state) {
    if (!btn) return;
    if (state === 'loading') {
      btn.classList.add('is-loading');
      btn.classList.remove('is-playing');
      btn.setAttribute('aria-busy', 'true');
      btn.setAttribute('aria-pressed', 'true');
    } else if (state === 'playing') {
      btn.classList.remove('is-loading');
      btn.classList.add('is-playing');
      btn.removeAttribute('aria-busy');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove('is-loading', 'is-playing');
      btn.removeAttribute('aria-busy');
      btn.setAttribute('aria-pressed', 'false');
    }
  }

  /**
   * Read a cached MP3 response from `muallim-audio-v1`.
   * @param {string} url
   * @returns {Promise<Blob | null>}
   */
  async _getCachedAudioBlob(url) {
    if (typeof caches === 'undefined') return null;
    try {
      const cache = await caches.open(AUDIO_CACHE_NAME);
      const match = await cache.match(url);
      if (!match || !match.ok) return null;
      const blob = await match.blob();
      return blob.size > 0 ? blob : null;
    } catch (_) {
      return null;
    }
  }

  /**
   * Cache a valid streamed MP3 response in `muallim-audio-v1` (FIFO/LRU capped at 150 entries).
   * @param {string} url
   */
  async _cacheAudioUrl(url) {
    if (typeof caches === 'undefined') return;
    try {
      const cache = await caches.open(AUDIO_CACHE_NAME);
      const existing = await cache.match(url);
      if (existing) {
        // Refresh LRU order
        await cache.delete(url);
        await cache.put(url, existing);
        return;
      }
      const resp = await fetch(url);
      if (!resp.ok) return;
      const probe = await resp.clone().blob();
      if (probe.size === 0) return;
      const keys = await cache.keys();
      if (keys.length >= AUDIO_CACHE_MAX) {
        const overflow = keys.length - AUDIO_CACHE_MAX + 1;
        for (let i = 0; i < overflow; i++) {
          await cache.delete(keys[i]);
        }
      }
      await cache.put(url, resp);
    } catch (_) {
      // Cache write skipped (offline or cross-origin CORS restriction)
    }
  }

  /**
   * Play a single MP3 URL (from CacheStorage if present, else network stream) and
   * resolve once it either fails to start or finishes playing (`ended`).
   * @param {string} url
   * @param {number} token
   * @param {boolean} isOnline
   * @param {() => void} [onPlaying]
   * @returns {Promise<'ended' | 'stopped' | 'failed'>}
   */
  async _playUrlToEnd(url, token, isOnline, onPlaying) {
    if (token !== this._playToken) return 'stopped';
    const cachedBlob = await this._getCachedAudioBlob(url);
    if (token !== this._playToken) return 'stopped';

    if (!cachedBlob && !isOnline) return 'failed';
    if (typeof Audio === 'undefined') return 'failed';

    let src = url;
    if (cachedBlob) {
      this._revokeObjectUrl();
      this._objectUrl = URL.createObjectURL(cachedBlob);
      src = this._objectUrl;
    }

    return new Promise((resolve) => {
      let settled = false;
      let started = false;
      const finish = (/** @type {'ended' | 'stopped' | 'failed'} */ result) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        if (this._audio === audio) {
          this._audio = null;
        }
        this._revokeObjectUrl();
        resolve(result);
      };

      const audio = new Audio(src);
      audio.preload = 'none';
      audio.playbackRate = this._rate;
      this._audio = audio;

      const timeoutId = setTimeout(() => {
        if (!started && !settled) {
          try { audio.pause(); audio.src = ''; } catch (_) { /* ignore */ }
          finish(token === this._playToken ? 'failed' : 'stopped');
        }
      }, 6500);

      audio.addEventListener('playing', () => {
        if (token !== this._playToken) {
          try { audio.pause(); audio.src = ''; } catch (_) { /* ignore */ }
          finish('stopped');
          return;
        }
        started = true;
        clearTimeout(timeoutId);
        if (onPlaying) onPlaying();
        if (!cachedBlob) {
          this._cacheAudioUrl(url);
        }
      }, { once: true });

      audio.addEventListener('ended', () => {
        finish(token === this._playToken ? 'ended' : 'stopped');
      }, { once: true });

      audio.addEventListener('error', () => {
        finish(token === this._playToken ? 'failed' : 'stopped');
      }, { once: true });

      audio.play().catch(() => {
        finish(token === this._playToken ? 'failed' : 'stopped');
      });
    });
  }

  /**
   * Chain playback across all ayahs in a ref list.
   * Resolves `'qari'` as soon as the first ayah begins playing while continuing the
   * remaining ayahs in the background (or awaits full completion if `awaitEnd` is true).
   * @param {Array<{surah: number, ayah: number, label: string, url: string}>} refs
   * @param {number} token
   * @param {boolean} isOnline
   * @param {boolean} awaitEnd
   * @returns {Promise<'qari' | 'stopped' | 'failed'>}
   */
  _playRefSequence(refs, token, isOnline, awaitEnd = false) {
    return new Promise((resolve) => {
      let startedOnce = false;
      let resolvedEarly = false;

      const run = async () => {
        for (let i = 0; i < refs.length; i++) {
          if (token !== this._playToken) {
            if (!resolvedEarly) resolve('stopped');
            return;
          }
          const res = await this._playUrlToEnd(refs[i].url, token, isOnline, () => {
            if (token !== this._playToken) return;
            this._setButtonState(this._activeBtn, 'playing');
            if (!startedOnce) {
              startedOnce = true;
              if (!awaitEnd && !resolvedEarly) {
                resolvedEarly = true;
                resolve('qari');
              }
            }
          });

          if (res === 'stopped' || token !== this._playToken) {
            if (!resolvedEarly) resolve('stopped');
            return;
          }
          if (res === 'failed') {
            if (!startedOnce) {
              if (!resolvedEarly) {
                resolvedEarly = true;
                resolve('failed');
              }
              return;
            }
            // If an intermediate ayah fails after first started, stop gracefully
            break;
          }
        }

        if (token === this._playToken) {
          this._clearButtonState();
          this._activeKey = null;
        }
        if (!resolvedEarly) {
          resolve(startedOnce ? 'qari' : 'failed');
        }
      };

      run();
    });
  }

  /**
   * Play Qari recitation (mode='qari', default when ref exists) or device Web Speech TTS (mode='tts').
   * @param {{
   *   arabic: string,
   *   ref?: string | null,
   *   key?: string,
   *   mode?: 'qari' | 'tts',
   *   buttonEl?: HTMLElement | null,
   *   onNotify?: (msg: string) => void
   * }} opts
   * @returns {Promise<'qari' | 'tts' | 'stopped' | 'unavailable'>}
   */
  async play(opts) {
    const mode = opts.mode || (opts.ref ? 'qari' : 'tts');
    const playKey = `${opts.key || opts.ref || opts.arabic}:${mode}`;
    // Clicking the currently active button toggles playback off
    if (this._activeKey && this._activeKey === playKey && (this._audio || (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking))) {
      this.stop();
      return 'stopped';
    }

    this.stop();
    const token = ++this._playToken;
    this._activeKey = playKey;
    this._activeBtn = opts.buttonEl || null;

    if (mode === 'tts') {
      const ttsResult = this.speakTTS(opts.arabic, token, opts.buttonEl || null, opts.onNotify);
      return ttsResult ? 'tts' : 'unavailable';
    }

    const refs = parseRefAudioList(opts.ref);
    const isOnline = typeof navigator === 'undefined' ? true : navigator.onLine !== false;

    if (refs.length > 0 && typeof Audio !== 'undefined') {
      this._setButtonState(this._activeBtn, 'loading');
      const seqResult = await this._playRefSequence(refs, token, isOnline, false);
      if (seqResult === 'stopped' || token !== this._playToken) return 'stopped';
      if (seqResult === 'qari') return 'qari';

      if (opts.onNotify) {
        opts.onNotify(`Qari stream unavailable for ${String(opts.ref || refs[0].label)}. Using device Arabic voice.`);
      }
    }

    const ttsResult = this.speakTTS(opts.arabic, token, opts.buttonEl || null, opts.onNotify);
    return ttsResult ? 'tts' : 'unavailable';
  }

  /**
   * Sequentially play all items in a lesson with focus/state hooks for continuous audio mode.
   * @param {Array<{key: string, arabic: string, ref?: string, buttonEl?: HTMLElement | null}>} items
   * @param {{
   *   onCardFocus?: (key: string, index: number, item: any) => void,
   *   onStateChange?: (state: {playing: boolean, index: number, total: number, key?: string}) => void,
   *   onNotify?: (msg: string) => void
   * }} [hooks]
   */
  async playLessonQueue(items, hooks = {}) {
    const queue = Array.isArray(items) ? items.filter(it => it && (it.arabic || it.ref)) : [];
    if (queue.length === 0) {
      hooks.onNotify?.('No playable Arabic items found in this lesson.');
      return;
    }

    this.stop();
    const token = ++this._playToken;
    this._isQueuePlaying = true;
    this._queueStateCb = hooks.onStateChange || null;
    hooks.onStateChange?.({ playing: true, index: 0, total: queue.length, key: queue[0].key });

    for (let i = 0; i < queue.length; i++) {
      if (token !== this._playToken) return;
      const entry = queue[i];
      this._activeKey = `queue_${entry.key}`;
      this._activeBtn = entry.buttonEl || null;
      hooks.onCardFocus?.(entry.key, i, entry);
      hooks.onStateChange?.({ playing: true, index: i, total: queue.length, key: entry.key });

      const refs = parseRefAudioList(entry.ref);
      const isOnline = typeof navigator === 'undefined' ? true : navigator.onLine !== false;
      let played = false;

      if (refs.length > 0 && typeof Audio !== 'undefined') {
        this._setButtonState(this._activeBtn, 'loading');
        const seqRes = await this._playRefSequence(refs, token, isOnline, true);
        if (seqRes === 'stopped' || token !== this._playToken) return;
        played = seqRes === 'qari';
      }

      if (!played) {
        await this._speakTTSAsync(entry.arabic, token, entry.buttonEl || null, hooks.onNotify);
      }
      if (token !== this._playToken) return;

      if (i + 1 < queue.length) {
        await new Promise(r => setTimeout(r, 250));
      }
    }

    if (token === this._playToken) {
      this._isQueuePlaying = false;
      this._queueStateCb = null;
      this._clearButtonState();
      this._activeKey = null;
      hooks.onStateChange?.({ playing: false, index: queue.length, total: queue.length });
    }
  }

  /**
   * @param {string} text
   * @param {number} token
   * @param {HTMLElement | null} buttonEl
   * @param {(msg: string) => void} [onNotify]
   * @returns {Promise<boolean>}
   */
  _speakTTSAsync(text, token, buttonEl, onNotify) {
    return new Promise((resolve) => {
      const ok = this.speakTTS(text, token, buttonEl, onNotify, () => resolve(true));
      if (!ok) resolve(false);
    });
  }

  /**
   * Speak Arabic via Web Speech Synthesis (ar-SA).
   * Strips clause markers (`/`, `//`) and ayah medallions (`﴿`, `﴾`), and checks for `ar*` voice.
   * @param {string} text
   * @param {number} [token]
   * @param {HTMLElement | null} [buttonEl]
   * @param {(msg: string) => void} [onNotify]
   * @param {() => void} [onFinish]
   * @returns {boolean}
   */
  speakTTS(text, token = this._playToken, buttonEl = null, onNotify, onFinish) {
    const clean = String(text || '')
      .replace(/\/\/|\/|[﴿﴾]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!clean) {
      if (onFinish) onFinish();
      return false;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      this._clearButtonState();
      this._activeKey = null;
      if (onNotify) onNotify('Audio recitation requires internet for Qari MP3 or browser speech support.');
      if (onFinish) onFinish();
      return false;
    }

    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(clean);
      utter.lang = 'ar-SA';
      utter.rate = this._rate;

      if (typeof window.speechSynthesis.getVoices === 'function') {
        const voices = window.speechSynthesis.getVoices() || [];
        const arVoice = voices.find(v => String(v.lang || '').toLowerCase().startsWith('ar'));
        if (arVoice) {
          utter.voice = arVoice;
        } else if (voices.length > 0 && !this._warnedNoArVoice) {
          this._warnedNoArVoice = true;
          if (onNotify) {
            onNotify('No Arabic (ar) voice is installed on this device; speech output may use your default voice.');
          }
        }
      }

      this._setButtonState(buttonEl, 'playing');

      utter.onend = () => {
        if (token === this._playToken) {
          this._clearButtonState();
          this._activeKey = null;
        }
        if (onFinish) onFinish();
      };
      utter.onerror = () => {
        if (token === this._playToken) {
          this._clearButtonState();
          this._activeKey = null;
        }
        if (onFinish) onFinish();
      };

      window.speechSynthesis.speak(utter);
      return true;
    } catch (err) {
      console.warn('[Audio] TTS error:', err);
      this._clearButtonState();
      this._activeKey = null;
      if (onNotify) onNotify('Could not start Arabic speech output. Tap again to retry.');
      if (onFinish) onFinish();
      return false;
    }
  }
}

export const audioPlayer = new AudioPlayer();
