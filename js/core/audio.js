// @ts-check

/**
 * Muallim ul-Qur'an — Qari Audio & Web Speech TTS Fallback Engine (v6.0)
 * Streams verified Surah:Ayah recitations from EveryAyah (Alafasy 128kbps)
 * and falls back directly to Web Speech TTS (ar-SA) when offline or unreferenced.
 */

const EVERYAYAH_BASE = 'https://everyayah.com/data/Alafasy_128kbps/';

/**
 * Parse a surah:ayah or range ref (e.g. "2:102" or "50:12-13") and build audio URL
 * using ONLY the first ayah for ranges.
 * @param {string | null | undefined} ref
 * @returns {{surah: number, ayah: number, label: string, url: string} | null}
 */
export function parseRefAudio(ref) {
  if (!ref || typeof ref !== 'string') return null;
  const match = ref.trim().match(/^(\d{1,3}):(\d{1,3})/);
  if (!match) return null;
  const surah = parseInt(match[1], 10);
  const ayah = parseInt(match[2], 10);
  if (!surah || surah < 1 || surah > 114 || !ayah || ayah < 1) return null;
  const sPad = String(surah).padStart(3, '0');
  const aPad = String(ayah).padStart(3, '0');
  return {
    surah,
    ayah,
    label: ref.trim(),
    url: `${EVERYAYAH_BASE}${sPad}${aPad}.mp3`
  };
}

class AudioPlayer {
  constructor() {
    /** @type {HTMLAudioElement | null} */
    this._audio = null;
    /** @type {HTMLElement | null} */
    this._activeBtn = null;
    /** @type {string | null} */
    this._activeKey = null;
    /** @type {number} */
    this._rate = 1.0;
    /** @type {number} */
    this._playToken = 0;
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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {
        console.warn('[Audio] Speech cancel error:', err);
      }
    }
    this._clearButtonState();
    this._activeKey = null;
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
    if (this._activeKey && this._activeKey === playKey && (this._audio || (window.speechSynthesis && window.speechSynthesis.speaking))) {
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

    const parsedRef = parseRefAudio(opts.ref);
    const isOnline = typeof navigator === 'undefined' ? true : navigator.onLine !== false;

    if (parsedRef && isOnline && typeof Audio !== 'undefined') {
      this._setButtonState(this._activeBtn, 'loading');
      const ok = await this._tryPlayStream(parsedRef.url, token);
      if (token !== this._playToken) return 'stopped';
      if (ok) {
        return 'qari';
      }
      // Network/stream failure -> automatic TTS fallback
      if (opts.onNotify) {
        opts.onNotify(`Qari stream unavailable for ${parsedRef.label}. Using device Arabic voice.`);
      }
    }

    const ttsResult = this.speakTTS(opts.arabic, token, opts.buttonEl || null, opts.onNotify);
    return ttsResult ? 'tts' : 'unavailable';
  }

  /**
   * @param {string} url
   * @param {number} token
   * @returns {Promise<boolean>}
   */
  _tryPlayStream(url, token) {
    return new Promise((resolve) => {
      let settled = false;
      const finish = (ok) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        resolve(ok);
      };

      const audio = new Audio(url);
      audio.preload = 'none';
      audio.playbackRate = this._rate;
      this._audio = audio;

      const timeoutId = setTimeout(() => {
        if (token === this._playToken && !settled) {
          try { audio.pause(); audio.src = ''; } catch (err) { console.warn('[Audio] Timeout abort:', err); }
          finish(false);
        }
      }, 6500);

      audio.addEventListener('playing', () => {
        if (token !== this._playToken) return;
        this._setButtonState(this._activeBtn, 'playing');
        finish(true);
      }, { once: true });

      audio.addEventListener('ended', () => {
        if (token === this._playToken) {
          this._clearButtonState();
          this._activeKey = null;
          this._audio = null;
        }
      }, { once: true });

      audio.addEventListener('error', () => {
        finish(false);
      }, { once: true });

      audio.play().catch(() => {
        finish(false);
      });
    });
  }

  /**
   * Speak Arabic via Web Speech Synthesis (ar-SA).
   * @param {string} text
   * @param {number} [token]
   * @param {HTMLElement | null} [buttonEl]
   * @param {(msg: string) => void} [onNotify]
   * @returns {boolean}
   */
  speakTTS(text, token = this._playToken, buttonEl = null, onNotify) {
    const clean = String(text || '').replace(/[﴿﴾]/g, '').trim();
    if (!clean) return false;

    if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      this._clearButtonState();
      this._activeKey = null;
      if (onNotify) onNotify('Audio recitation requires internet for Qari MP3 or browser speech support.');
      return false;
    }

    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(clean);
      utter.lang = 'ar-SA';
      utter.rate = this._rate;
      this._setButtonState(buttonEl, 'playing');

      utter.onend = () => {
        if (token === this._playToken) {
          this._clearButtonState();
          this._activeKey = null;
        }
      };
      utter.onerror = () => {
        if (token === this._playToken) {
          this._clearButtonState();
          this._activeKey = null;
        }
      };

      window.speechSynthesis.speak(utter);
      return true;
    } catch (err) {
      console.warn('[Audio] TTS error:', err);
      this._clearButtonState();
      this._activeKey = null;
      if (onNotify) onNotify('Could not start Arabic speech output. Tap again to retry.');
      return false;
    }
  }
}

export const audioPlayer = new AudioPlayer();
