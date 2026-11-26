// @ts-check

/**
 * Muallim ul-Qur'an — Core State Store & Schema Migration (v7.0)
 * Manages localStorage persistence, per-lesson chunk & unit JSON fetching,
 * progress, streaks, weakWords, examHistory, tombstones, and subscribers.
 */

export const VALID_THEMES = /** @type {const} */ (['parchment', 'night', 'sepia']);
export const VALID_LANGS = /** @type {const} */ (['hinglish', 'en', 'ur', 'hi']);

const THEME_MIGRATION = {
  light: 'parchment',
  dark: 'night',
  parchment: 'parchment',
  night: 'night',
  sepia: 'sepia'
};

const LANG_MIGRATION = {
  hinglish: 'hinglish',
  en: 'en',
  ur: 'ur',
  hi: 'hi',
  bn: 'en',
  ko: 'en',
  zh: 'en',
  es: 'en'
};

export const STORE_KEYS = {
  theme: 'muallim_theme',
  mode: 'muallim_mode',
  lang: 'muallim_lang',
  arScale: 'muallim_ar_scale',
  audioSpeed: 'muallim_audio_speed',
  showHints: 'muallim_show_hints',
  favs: 'muallim_favs',
  customTranslations: 'muallim_custom_translations',
  legacyCustomAnswers: 'muallim_custom_answers',
  bookmark: 'muallim_bookmark',
  srs: 'muallim_srs_state',
  completedLessons: 'muallim_completed_lessons',
  streak: 'muallim_streak',
  studyLog: 'muallim_study_log',
  lastSession: 'muallim_last_session',
  weakWords: 'muallim_weak_words',
  examHistory: 'muallim_exam_history',
  deletedItems: 'muallim_deleted_items',
  fieldUpdatedAt: 'muallim_field_updated_at',
  deviceId: 'muallim_device_id',
  studentName: 'muallim_student_name',
  authOptIn: 'muallim_auth_opt_in'
};

/**
 * Safe localStorage read with explicit warning on storage restriction.
 * @param {string} key
 * @param {string | null} [fallback]
 * @returns {string | null}
 */
export function lsGet(key, fallback = null) {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? val : fallback;
  } catch (err) {
    console.warn(`[Store] Could not read "${key}":`, err);
    return fallback;
  }
}

/**
 * Safe localStorage write.
 * @param {string} key
 * @param {string} value
 * @returns {boolean}
 */
export function lsSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    console.warn(`[Store] Could not write "${key}":`, err);
    return false;
  }
}

/**
 * Safe localStorage JSON parse.
 * @template T
 * @param {string} key
 * @param {T} fallback
 * @returns {T}
 */
function lsGetJson(key, fallback) {
  const raw = lsGet(key, null);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    console.warn(`[Store] Invalid JSON for "${key}", using fallback:`, err);
    return fallback;
  }
}

/**
 * Local calendar YYYY-MM-DD string.
 * @param {Date} [date]
 * @returns {string}
 */
export function toLocalDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * DST-safe local calendar YYYY-MM-DD string for yesterday.
 * @returns {string}
 */
export function yesterdayLocalDateKey() {
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return toLocalDateKey(y);
}

/**
 * Normalize theme value (mapping legacy light/dark).
 * @param {string | null | undefined} raw
 * @returns {'parchment' | 'night' | 'sepia'}
 */
export function normalizeTheme(raw) {
  const key = String(raw || 'parchment').toLowerCase();
  return /** @type {'parchment' | 'night' | 'sepia'} */ (THEME_MIGRATION[key] || 'parchment');
}

/**
 * Normalize language value (dropping bn, ko, zh, es).
 * @param {string | null | undefined} raw
 * @returns {'hinglish' | 'en' | 'ur' | 'hi'}
 */
export function normalizeLang(raw) {
  const key = String(raw || 'hinglish').toLowerCase();
  return /** @type {'hinglish' | 'en' | 'ur' | 'hi'} */ (LANG_MIGRATION[key] || 'hinglish');
}

/**
 * Standardize SRS keys on canonical `S{u}L{l}_num_{id}` format.
 * @param {string} key
 * @returns {string}
 */
export function normalizeSrsKey(key) {
  const k = String(key || '');
  const m = k.match(/^(S\d+L\d+)_(?!num_)(.+)$/);
  return m ? `${m[1]}_num_${m[2]}` : k;
}

class AppStore {
  constructor() {
    /** @type {number} */
    this.currentUnit = 1;
    /** @type {number} */
    this.currentLesson = 1;
    /** @type {'parchment' | 'night' | 'sepia'} */
    this.theme = 'parchment';
    /** @type {'teacher' | 'student'} */
    this.mode = 'teacher';
    /** @type {'hinglish' | 'en' | 'ur' | 'hi'} */
    this.lang = 'hinglish';
    /** @type {number} */
    this.arabicScale = 26;
    /** @type {number} */
    this.audioSpeed = 1.0;
    /** @type {boolean} */
    this.showHints = false;

    /** @type {Array<{key: string, arabic: string, hinglish: string, stage: number, lesson: number, ref?: string, starredAt?: number}>} */
    this.favs = [];
    /** @type {Record<string, string>} */
    this.customNotes = {};
    /** @type {{stage: number, lesson: number, itemId: string, arabic: string, savedAt: number} | null} */
    this.bookmark = null;
    /** @type {Record<string, {box: number, reps: number, lapses: number, lastReview: number, nextReview: number}>} */
    this.srs = {};
    /** @type {Record<string, {completedAt: number}>} */
    this.completedLessons = {};
    /** @type {{current: number, longest: number, lastStudyDate: string | null}} */
    this.streak = { current: 0, longest: 0, lastStudyDate: null };
    /** @type {Record<string, number>} */
    this.studyLog = {};
    /** @type {{stage: number, lesson: number, title: string, updatedAt: number} | null} */
    this.lastSession = null;
    /** @type {Record<string, {key: string, arabic: string, stage: number, lesson: number, misses: number, lastMissed: number}>} */
    this.weakWords = {};
    /** @type {Array<{examId: string, mode: string, score: number, total: number, pct: number, completedAt: number}>} */
    this.examHistory = [];
    /** @type {Record<string, number>} */
    this.deletedItems = {};
    /** @type {Record<string, number>} */
    this.fieldUpdatedAt = {};

    /** @type {any} */
    this.metadata = null;
    /** @type {Record<number, Array<any>>} */
    this.unitsCache = {};
    /** @type {Record<string, any>} */
    this.lessonsCache = {};
    /** @type {Record<number, Promise<Array<any>>>} */
    this._unitPromises = {};
    /** @type {Record<string, Promise<any>>} */
    this._lessonPromises = {};

    /** @type {Set<(reason: string) => void>} */
    this._listeners = new Set();
    /** @type {(() => void) | null} */
    this._syncHook = null;
  }

  /**
   * Subscribe to store state mutations.
   * @param {(reason: string) => void} fn
   * @returns {() => void}
   */
  subscribe(fn) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  /**
   * Register optional sync callback when user state changes.
   * @param {() => void} fn
   */
  setSyncHook(fn) {
    this._syncHook = fn;
  }

  /**
   * @param {string} reason
   * @param {boolean} [shouldSync]
   */
  emit(reason, shouldSync = false) {
    this._listeners.forEach(fn => {
      try {
        fn(reason);
      } catch (err) {
        console.warn('[Store] Subscriber error:', err);
      }
    });
    if (shouldSync && this._syncHook) {
      this._syncHook();
    }
  }

  /**
   * Persist per-field timestamp while keeping map strictly <= 45 entries
   * (below Firestore's 50-entry fieldUpdatedAt rule limit).
   * @param {string} key
   * @param {number} [ts]
   */
  _setFieldTimestamp(key, ts = Date.now()) {
    const next = { ...this.fieldUpdatedAt, [key]: ts };
    const keys = Object.keys(next);
    if (keys.length > 45) {
      const noteKeys = keys.filter(k => k.startsWith('note:')).sort((a, b) => (next[a] || 0) - (next[b] || 0));
      for (const nk of noteKeys) {
        if (Object.keys(next).length <= 45) break;
        delete next[nk];
      }
    }
    this.fieldUpdatedAt = next;
    lsSet(STORE_KEYS.fieldUpdatedAt, JSON.stringify(next));
  }

  /**
   * @param {string} tombstoneKey
   * @param {number} [ts]
   */
  _recordDeletion(tombstoneKey, ts = Date.now()) {
    const next = { ...this.deletedItems, [tombstoneKey]: ts };
    const keys = Object.keys(next);
    if (keys.length > 1000) {
      keys.sort((a, b) => (next[a] || 0) - (next[b] || 0));
      for (let i = 0; i < keys.length - 1000; i++) {
        delete next[keys[i]];
      }
    }
    this.deletedItems = next;
    lsSet(STORE_KEYS.deletedItems, JSON.stringify(next));
  }

  /**
   * @param {string} tombstoneKey
   */
  _clearDeletion(tombstoneKey) {
    if (!Object.prototype.hasOwnProperty.call(this.deletedItems, tombstoneKey)) return;
    const next = { ...this.deletedItems };
    delete next[tombstoneKey];
    this.deletedItems = next;
    lsSet(STORE_KEYS.deletedItems, JSON.stringify(next));
  }

  /**
   * Load and migrate existing localStorage schema from v2-v6 keys.
   */
  init() {
    this.theme = normalizeTheme(lsGet(STORE_KEYS.theme, 'parchment'));
    lsSet(STORE_KEYS.theme, this.theme);

    const rawMode = lsGet(STORE_KEYS.mode, 'teacher');
    this.mode = rawMode === 'student' ? 'student' : 'teacher';

    this.lang = normalizeLang(lsGet(STORE_KEYS.lang, 'hinglish'));
    lsSet(STORE_KEYS.lang, this.lang);

    const parsedScale = parseInt(lsGet(STORE_KEYS.arScale, '26') || '26', 10);
    this.arabicScale = Number.isFinite(parsedScale) ? Math.min(42, Math.max(18, parsedScale)) : 26;

    const parsedSpeed = parseFloat(lsGet(STORE_KEYS.audioSpeed, '1.0') || '1.0');
    this.audioSpeed = Number.isFinite(parsedSpeed) ? Math.min(1.5, Math.max(0.5, parsedSpeed)) : 1.0;

    const rawHints = lsGet(STORE_KEYS.showHints, '0');
    this.showHints = rawHints === '1' || rawHints === 'true';

    const rawFavs = lsGetJson(STORE_KEYS.favs, []);
    this.favs = Array.isArray(rawFavs) ? rawFavs.filter(f => f && typeof f.key === 'string') : [];

    // Migrate legacy muallim_custom_answers -> muallim_custom_translations
    const hasNewCustom = lsGet(STORE_KEYS.customTranslations, null);
    const oldCustom = lsGetJson(STORE_KEYS.legacyCustomAnswers, null);
    if (hasNewCustom) {
      const parsed = lsGetJson(STORE_KEYS.customTranslations, {});
      this.customNotes = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } else if (oldCustom && typeof oldCustom === 'object' && !Array.isArray(oldCustom)) {
      this.customNotes = oldCustom;
      lsSet(STORE_KEYS.customTranslations, JSON.stringify(oldCustom));
    } else {
      this.customNotes = {};
    }

    const rawBm = lsGetJson(STORE_KEYS.bookmark, null);
    this.bookmark = rawBm && typeof rawBm === 'object' ? rawBm : null;

    // Migrate legacy S{u}L{l}_{id} SRS keys -> canonical S{u}L{l}_num_{id}
    const rawSrs = lsGetJson(STORE_KEYS.srs, {});
    const srsObj = rawSrs && typeof rawSrs === 'object' && !Array.isArray(rawSrs) ? rawSrs : {};
    /** @type {Record<string, any>} */
    const migratedSrs = {};
    let srsMigrated = false;
    for (const [k, card] of Object.entries(srsObj)) {
      if (!card || typeof card !== 'object') continue;
      const canon = normalizeSrsKey(k);
      if (canon !== k) srsMigrated = true;
      const existing = migratedSrs[canon];
      if (!existing || (Number(card.lastReview) || 0) >= (Number(existing.lastReview) || 0)) {
        migratedSrs[canon] = card;
      }
    }
    this.srs = migratedSrs;
    if (srsMigrated) {
      lsSet(STORE_KEYS.srs, JSON.stringify(this.srs));
    }

    const rawCompleted = lsGetJson(STORE_KEYS.completedLessons, {});
    this.completedLessons = rawCompleted && typeof rawCompleted === 'object' && !Array.isArray(rawCompleted) ? rawCompleted : {};

    const rawStreak = lsGetJson(STORE_KEYS.streak, null);
    if (rawStreak && typeof rawStreak === 'object') {
      this.streak = {
        current: Number(rawStreak.current) || 0,
        longest: Number(rawStreak.longest) || 0,
        lastStudyDate: typeof rawStreak.lastStudyDate === 'string' ? rawStreak.lastStudyDate : null
      };
      this._reconcileStreakDecay();
    } else {
      this.streak = { current: 0, longest: 0, lastStudyDate: null };
    }

    const rawLog = lsGetJson(STORE_KEYS.studyLog, {});
    this.studyLog = rawLog && typeof rawLog === 'object' && !Array.isArray(rawLog) ? rawLog : {};

    const rawSession = lsGetJson(STORE_KEYS.lastSession, null);
    this.lastSession = rawSession && typeof rawSession === 'object' ? rawSession : null;

    const rawWeak = lsGetJson(STORE_KEYS.weakWords, {});
    this.weakWords = rawWeak && typeof rawWeak === 'object' && !Array.isArray(rawWeak) ? rawWeak : {};

    const rawExams = lsGetJson(STORE_KEYS.examHistory, []);
    this.examHistory = Array.isArray(rawExams) ? rawExams.filter(e => e && typeof e === 'object') : [];

    const rawDeleted = lsGetJson(STORE_KEYS.deletedItems, {});
    this.deletedItems = rawDeleted && typeof rawDeleted === 'object' && !Array.isArray(rawDeleted) ? rawDeleted : {};

    const rawFieldTs = lsGetJson(STORE_KEYS.fieldUpdatedAt, {});
    this.fieldUpdatedAt = rawFieldTs && typeof rawFieldTs === 'object' && !Array.isArray(rawFieldTs) ? rawFieldTs : {};
  }

  _reconcileStreakDecay() {
    if (!this.streak.lastStudyDate || this.streak.current === 0) return;
    const today = toLocalDateKey();
    const yesterday = yesterdayLocalDateKey();
    if (this.streak.lastStudyDate !== today && this.streak.lastStudyDate !== yesterday) {
      this.streak = { ...this.streak, current: 0 };
      lsSet(STORE_KEYS.streak, JSON.stringify(this.streak));
    }
  }

  /**
   * @returns {Promise<any>}
   */
  async loadMetadata() {
    if (this.metadata) return this.metadata;
    const res = await fetch('./data/metadata.json');
    if (!res.ok) throw new Error(`Failed to load curriculum index (HTTP ${res.status})`);
    this.metadata = await res.json();
    return this.metadata;
  }

  /**
   * Fetch a single per-lesson chunk (`./data/lessons/s{u}l{l}.json`), falling back
   * to full `./data/unit{u}.json` if the chunk is missing or fails to load.
   * @param {number} unitNum
   * @param {number} lessonId
   * @returns {Promise<any>}
   */
  async loadLessonChunk(unitNum, lessonId) {
    const u = Math.min(7, Math.max(1, Number(unitNum) || 1));
    const l = Math.max(1, Number(lessonId) || 1);
    const cacheKey = `s${u}l${l}`;

    if (this.lessonsCache[cacheKey]) return this.lessonsCache[cacheKey];

    if (this.unitsCache[u]) {
      const existing = this.unitsCache[u].find(x => Number(x.lesson_id) === l);
      if (existing) {
        this.lessonsCache[cacheKey] = existing;
        return existing;
      }
    }

    if (this._lessonPromises[cacheKey]) return this._lessonPromises[cacheKey];

    this._lessonPromises[cacheKey] = (async () => {
      try {
        const res = await fetch(`./data/lessons/${cacheKey}.json`);
        if (res.ok) {
          const data = await res.json();
          const lesson = (data && typeof data === 'object' && data.lesson) ? data.lesson : data;
          if (lesson && typeof lesson === 'object') {
            this.lessonsCache[cacheKey] = lesson;
            return lesson;
          }
        }
      } catch (err) {
        console.warn(`[Store] Chunk ${cacheKey} fetch failed, falling back to unit${u}.json:`, err);
      }

      const lessons = await this.loadUnit(u);
      const found = lessons.find(x => Number(x.lesson_id) === l) || lessons[0] || null;
      if (found) {
        this.lessonsCache[`s${u}l${found.lesson_id}`] = found;
        this.lessonsCache[cacheKey] = found;
      }
      return found;
    })();

    try {
      return await this._lessonPromises[cacheKey];
    } finally {
      delete this._lessonPromises[cacheKey];
    }
  }

  /**
   * @param {number} unitNum
   * @returns {Promise<Array<any>>}
   */
  async loadUnit(unitNum) {
    const u = Math.min(7, Math.max(1, Number(unitNum) || 1));
    if (this.unitsCache[u]) return this.unitsCache[u];
    if (this._unitPromises[u]) return this._unitPromises[u];

    this._unitPromises[u] = (async () => {
      const res = await fetch(`./data/unit${u}.json`);
      if (!res.ok) throw new Error(`Failed to load Unit ${u} (HTTP ${res.status})`);
      const data = await res.json();
      const lessons = Array.isArray(data.lessons) ? data.lessons : [];
      this.unitsCache[u] = lessons;

      for (const l of lessons) {
        if (l && l.lesson_id !== undefined) {
          this.lessonsCache[`s${u}l${Number(l.lesson_id)}`] = l;
        }
      }

      // Sync metadata lessonCount & titles with loaded unit JSON (e.g. Unit 4 has 18 lessons)
      if (this.metadata && Array.isArray(this.metadata.units)) {
        const entry = this.metadata.units[u - 1];
        if (entry) {
          entry.lessonCount = lessons.length;
          entry.lessons = lessons.map(l => ({
            number: l.lesson_id,
            title: l.title,
            title_i18n: l.title_i18n || null
          }));
        }
      }
      return lessons;
    })();

    try {
      return await this._unitPromises[u];
    } finally {
      delete this._unitPromises[u];
    }
  }

  /**
   * @param {number} unitNum
   * @returns {number}
   */
  getUnitLessonCount(unitNum) {
    if (this.unitsCache[unitNum]) return this.unitsCache[unitNum].length;
    const uMeta = this.metadata?.units?.[unitNum - 1];
    if (uMeta) return uMeta.lessonCount || (Array.isArray(uMeta.lessons) ? uMeta.lessons.length : 1);
    const fallbackCounts = [19, 13, 10, 18, 23, 21, 10];
    return fallbackCounts[unitNum - 1] || 10;
  }

  /**
   * @param {number} unitNum
   * @param {number} lessonId
   * @returns {any | null}
   */
  getLesson(unitNum, lessonId) {
    const u = Math.min(7, Math.max(1, Number(unitNum) || 1));
    const l = Math.max(1, Number(lessonId) || 1);
    const chunk = this.lessonsCache[`s${u}l${l}`];
    if (chunk) return chunk;
    const lessons = this.unitsCache[u];
    if (!lessons) return null;
    return lessons.find(item => Number(item.lesson_id) === l) || lessons[0] || null;
  }

  /**
   * @param {number} unitNum
   * @param {number} lessonId
   * @param {string} [title]
   * @param {boolean} [recordSyncTs]
   */
  setCurrentPosition(unitNum, lessonId, title = '', recordSyncTs = true) {
    this.currentUnit = unitNum;
    this.currentLesson = lessonId;
    const now = Date.now();
    this.lastSession = {
      stage: unitNum,
      lesson: lessonId,
      title: title || `Unit ${unitNum} Lesson ${lessonId}`,
      updatedAt: now
    };
    lsSet(STORE_KEYS.lastSession, JSON.stringify(this.lastSession));
    if (recordSyncTs) {
      this._setFieldTimestamp('position', now);
    }
  }

  /**
   * @param {string} theme
   */
  setTheme(theme) {
    const next = normalizeTheme(theme);
    this.theme = next;
    lsSet(STORE_KEYS.theme, next);
    this._setFieldTimestamp('theme');
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', next);
      const metaTheme = document.getElementById('meta-theme-color');
      if (metaTheme) {
        const metaColors = { parchment: '#FAF7F2', sepia: '#F2E7D5', night: '#161922' };
        metaTheme.setAttribute('content', metaColors[next] || '#FAF7F2');
      }
    }
    this.emit('theme', true);
  }

  /**
   * @param {'teacher' | 'student'} mode
   */
  setMode(mode) {
    const next = mode === 'student' ? 'student' : 'teacher';
    this.mode = next;
    lsSet(STORE_KEYS.mode, next);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-mode', next);
    }
    this.emit('mode', false);
  }

  /**
   * @param {string} lang
   */
  setLang(lang) {
    const next = normalizeLang(lang);
    this.lang = next;
    lsSet(STORE_KEYS.lang, next);
    this._setFieldTimestamp('preferredLang');
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-lang', next);
    }
    this.emit('lang', true);
  }

  /**
   * @param {number} size
   */
  setArabicScale(size) {
    const clamped = Math.min(42, Math.max(18, Number(size) || 26));
    this.arabicScale = clamped;
    lsSet(STORE_KEYS.arScale, String(clamped));
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--arabic-scale', `${clamped}px`);
    }
    this.emit('scale', false);
  }

  /**
   * @param {number} speed
   */
  setAudioSpeed(speed) {
    const clamped = Math.min(1.5, Math.max(0.5, Number(speed) || 1.0));
    this.audioSpeed = Math.round(clamped * 20) / 20;
    lsSet(STORE_KEYS.audioSpeed, String(this.audioSpeed));
    this.emit('audioSpeed', false);
  }

  /**
   * Toggle Root & Transliteration hints on lesson cards.
   * @param {boolean} bool
   */
  setShowHints(bool) {
    this.showHints = Boolean(bool);
    lsSet(STORE_KEYS.showHints, this.showHints ? '1' : '0');
    this.emit('hints', false);
  }

  /**
   * Resolve localized translation string for an item/section object.
   * @param {any} item
   * @param {'hinglish' | 'en' | 'ur' | 'hi'} [langOverride]
   * @returns {string}
   */
  getTranslation(item, langOverride) {
    if (!item) return '';
    if (typeof item === 'string') return item;
    const active = langOverride || this.lang;
    const tr = item.translations;
    if (tr && typeof tr === 'object') {
      if (tr[active]) return String(tr[active]);
      if (active !== 'hinglish' && tr.hinglish) return String(tr.hinglish);
      if (tr.en) return String(tr.en);
    }
    if (active === 'ur' && item.urdu) return String(item.urdu);
    if (active === 'en' && item.english) return String(item.english);
    return String(item.hinglish || item.hinglish_meaning || '');
  }

  /**
   * Canonical key anchored on immutable item.id.
   * @param {number} stage
   * @param {number} lessonId
   * @param {any} item
   * @param {number} sIdx
   * @param {number} iIdx
   * @returns {string}
   */
  getItemKey(stage, lessonId, item, sIdx, iIdx) {
    const idPart = item && item.id !== undefined && item.id !== null ? item.id : `s${sIdx}_${iIdx}`;
    return `S${stage}L${lessonId}_num_${idPart}`;
  }

  /**
   * @param {string} key
   * @param {string} [legacyKey]
   * @returns {boolean}
   */
  isStarred(key, legacyKey) {
    return this.favs.some(f => f.key === key || (legacyKey && f.key === legacyKey));
  }

  /**
   * @param {{key: string, arabic: string, hinglish: string, stage: number, lesson: number, ref?: string}} entry
   * @param {string} [legacyKey]
   * @returns {boolean} new starred state
   */
  toggleStar(entry, legacyKey) {
    const idx = this.favs.findIndex(f => f.key === entry.key || (legacyKey && f.key === legacyKey));
    const now = Date.now();
    let starred = false;
    if (idx >= 0) {
      const removed = this.favs[idx];
      this.favs = [...this.favs.slice(0, idx), ...this.favs.slice(idx + 1)];
      this._recordDeletion(`fav:${removed.key}`, now);
      if (entry.key !== removed.key) {
        this._recordDeletion(`fav:${entry.key}`, now);
      }
    } else {
      this._clearDeletion(`fav:${entry.key}`);
      if (legacyKey) this._clearDeletion(`fav:${legacyKey}`);
      this.favs = [...this.favs, { ...entry, starredAt: now }];
      starred = true;
    }
    lsSet(STORE_KEYS.favs, JSON.stringify(this.favs));
    this.emit('favs', true);
    return starred;
  }

  /**
   * @param {string} key
   * @param {string} [legacyKey]
   * @returns {string}
   */
  getCustomNote(key, legacyKey) {
    if (this.customNotes[key]) return this.customNotes[key];
    if (legacyKey && this.customNotes[legacyKey]) return this.customNotes[legacyKey];
    return '';
  }

  /**
   * @param {string} key
   * @param {string} text
   */
  saveCustomNote(key, text) {
    const trimmed = String(text || '').trim();
    const next = { ...this.customNotes };
    const now = Date.now();
    if (trimmed) {
      next[key] = trimmed;
      this._clearDeletion(`note:${key}`);
      this._setFieldTimestamp(`note:${key}`, now);
    } else {
      delete next[key];
      this._recordDeletion(`note:${key}`, now);
    }
    this.customNotes = next;
    lsSet(STORE_KEYS.customTranslations, JSON.stringify(next));
    this.emit('notes', true);
  }

  /**
   * @param {{stage: number, lesson: number, itemId: string, arabic: string}} itemInfo
   * @returns {boolean} true if set, false if cleared
   */
  toggleBookmark(itemInfo) {
    const now = Date.now();
    if (this.bookmark && this.bookmark.itemId === itemInfo.itemId) {
      this.bookmark = null;
      try {
        localStorage.removeItem(STORE_KEYS.bookmark);
      } catch (err) {
        console.warn('[Store] Failed to remove bookmark:', err);
      }
      this._setFieldTimestamp('lastBookmark', now);
      this.emit('bookmark', true);
      return false;
    }
    this.bookmark = { ...itemInfo, savedAt: now };
    lsSet(STORE_KEYS.bookmark, JSON.stringify(this.bookmark));
    this._setFieldTimestamp('lastBookmark', now);
    this.emit('bookmark', true);
    return true;
  }

  /**
   * @param {number} stage
   * @param {number} lessonId
   * @returns {boolean}
   */
  isLessonCompleted(stage, lessonId) {
    return Boolean(this.completedLessons[`S${stage}L${lessonId}`]);
  }

  /**
   * Toggle completion for a lesson and update daily study streak.
   * @param {number} stage
   * @param {number} lessonId
   * @returns {boolean}
   */
  toggleLessonComplete(stage, lessonId) {
    const lKey = `S${stage}L${lessonId}`;
    const next = { ...this.completedLessons };
    const now = Date.now();
    let isDone = false;
    if (next[lKey]) {
      delete next[lKey];
      this._recordDeletion(`lesson:${lKey}`, now);
    } else {
      next[lKey] = { completedAt: now };
      this._clearDeletion(`lesson:${lKey}`);
      isDone = true;
      this.recordStudyActivity(1, false);
    }
    this.completedLessons = next;
    lsSet(STORE_KEYS.completedLessons, JSON.stringify(next));
    this.emit('progress', true);
    return isDone;
  }

  /**
   * Record study activity for today and advance streak counters.
   * @param {number} [amount]
   * @param {boolean} [shouldEmit]
   */
  recordStudyActivity(amount = 1, shouldEmit = true) {
    const today = toLocalDateKey();
    const yesterday = yesterdayLocalDateKey();
    const nextLog = { ...this.studyLog, [today]: (this.studyLog[today] || 0) + amount };

    // Keep studyLog within Firestore 400-entry limit
    const keys = Object.keys(nextLog).sort();
    if (keys.length > 400) {
      for (let i = 0; i < keys.length - 400; i++) {
        delete nextLog[keys[i]];
      }
    }
    this.studyLog = nextLog;
    lsSet(STORE_KEYS.studyLog, JSON.stringify(nextLog));

    let current = this.streak.current || 0;
    if (this.streak.lastStudyDate === today) {
      current = Math.max(1, current);
    } else if (this.streak.lastStudyDate === yesterday) {
      current += 1;
    } else {
      current = 1;
    }
    const longest = Math.max(this.streak.longest || 0, current);
    this.streak = { current, longest, lastStudyDate: today };
    lsSet(STORE_KEYS.streak, JSON.stringify(this.streak));

    if (shouldEmit) {
      this.emit('streak', true);
    }
  }

  /**
   * @param {number} unitNum
   * @returns {{completed: number, total: number, pct: number}}
   */
  getUnitMastery(unitNum) {
    const total = this.getUnitLessonCount(unitNum);
    const prefix = `S${unitNum}L`;
    let completed = 0;
    for (const key of Object.keys(this.completedLessons)) {
      if (key.startsWith(prefix)) completed++;
    }
    const clamped = Math.min(completed, total);
    const pct = total > 0 ? Math.round((clamped / total) * 100) : 0;
    return { completed: clamped, total, pct };
  }

  /**
   * @param {Record<string, any>} srsMap
   */
  saveSrsState(srsMap) {
    /** @type {Record<string, any>} */
    const normalized = {};
    for (const [k, v] of Object.entries(srsMap || {})) {
      if (!v || typeof v !== 'object') continue;
      normalized[normalizeSrsKey(k)] = v;
    }
    this.srs = normalized;
    lsSet(STORE_KEYS.srs, JSON.stringify(this.srs));
    this.emit('srs', true);
  }

  /**
   * Record a missed item from Quiz, Morphology, or Model Exam into Weak Words.
   * @param {{key: string, arabic: string, stage: number, lesson: number, misses?: number, lastMissed?: number}} entry
   */
  recordWeakWord(entry) {
    const key = String(entry?.key || '').trim();
    if (!key) return null;
    const now = Number(entry.lastMissed) || Date.now();
    const prev = this.weakWords[key];
    const nextEntry = {
      key,
      arabic: String(entry.arabic || prev?.arabic || ''),
      stage: Number(entry.stage ?? prev?.stage) || 1,
      lesson: Number(entry.lesson ?? prev?.lesson) || 1,
      misses: prev ? (prev.misses || 0) + 1 : (Number(entry.misses) || 1),
      lastMissed: now
    };
    this._clearDeletion(`weak:${key}`);
    this.weakWords = { ...this.weakWords, [key]: nextEntry };
    lsSet(STORE_KEYS.weakWords, JSON.stringify(this.weakWords));
    this._setFieldTimestamp('weakWords', now);
    this.emit('weakWords', true);
    return nextEntry;
  }

  /**
   * Clear a mastered item from Weak Words.
   * @param {string} key
   * @returns {boolean}
   */
  clearWeakWord(key) {
    const k = String(key || '').trim();
    if (!k || !this.weakWords[k]) return false;
    const next = { ...this.weakWords };
    delete next[k];
    const now = Date.now();
    this.weakWords = next;
    lsSet(STORE_KEYS.weakWords, JSON.stringify(next));
    this._recordDeletion(`weak:${k}`, now);
    this._setFieldTimestamp('weakWords', now);
    this.emit('weakWords', true);
    return true;
  }

  /**
   * Append a completed quiz or model exam attempt to examHistory.
   * @param {{examId: string, mode?: string, score: number, total: number, pct?: number, completedAt?: number}} attempt
   */
  recordExamAttempt(attempt) {
    const score = Number(attempt?.score) || 0;
    const total = Number(attempt?.total) || 0;
    const pct = Number.isFinite(Number(attempt?.pct))
      ? Number(attempt.pct)
      : (total > 0 ? Math.round((score / total) * 100) : 0);
    const completedAt = Number(attempt?.completedAt) || Date.now();
    const entry = {
      examId: String(attempt?.examId || 'quiz'),
      mode: String(attempt?.mode || 'untimed'),
      score,
      total,
      pct,
      completedAt
    };
    const next = [...this.examHistory, entry].slice(-200);
    this.examHistory = next;
    lsSet(STORE_KEYS.examHistory, JSON.stringify(next));
    this._setFieldTimestamp('examHistory', completedAt);
    this.emit('examHistory', true);
    return entry;
  }

  /**
   * Build JSON export payload.
   * @returns {string}
   */
  exportBackupJson() {
    const payload = {
      version: '7.0.0',
      exported_at: new Date().toISOString(),
      preferences: {
        theme: this.theme,
        mode: this.mode,
        lang: this.lang,
        arabicScale: this.arabicScale,
        audioSpeed: this.audioSpeed,
        showHints: this.showHints
      },
      favourites: this.favs,
      customTranslations: this.customNotes,
      srs: this.srs,
      completedLessons: this.completedLessons,
      streak: this.streak,
      studyLog: this.studyLog,
      bookmark: this.bookmark,
      weakWords: this.weakWords,
      examHistory: this.examHistory,
      deletedItems: this.deletedItems,
      fieldUpdatedAt: this.fieldUpdatedAt
    };
    return JSON.stringify(payload, null, 2);
  }

  /**
   * Trigger browser JSON backup download and revoke temporary ObjectURL cleanly.
   * @param {string} [filename]
   */
  downloadBackupJson(filename = 'muallim_backup_v7.json') {
    const json = this.exportBackupJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => {
      try {
        URL.revokeObjectURL(url);
      } catch (err) {
        console.warn('[Store] Failed to revoke backup ObjectURL:', err);
      }
    }, 1000);
  }

  /**
   * Merge backup JSON non-destructively into current state with zero data loss.
   * @param {string} rawText
   * @returns {{favCount: number, noteCount: number, completedCount: number, srsCount: number, weakCount: number, examCount: number}}
   */
  importBackupJson(rawText) {
    const parsed = JSON.parse(rawText);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Backup file is not a valid JSON object.');
    }
    let favCount = 0;
    let noteCount = 0;
    let completedCount = 0;
    let srsCount = 0;
    let weakCount = 0;
    let examCount = 0;

    if (Array.isArray(parsed.favourites)) {
      const nextFavs = [...this.favs];
      for (const item of parsed.favourites) {
        if (item && item.key && !nextFavs.some(f => f.key === item.key)) {
          nextFavs.push({
            key: String(item.key),
            arabic: String(item.arabic || ''),
            hinglish: String(item.hinglish || ''),
            stage: Number(item.stage) || 1,
            lesson: Number(item.lesson) || 1,
            ...(item.ref ? { ref: String(item.ref) } : {}),
            ...(item.starredAt ? { starredAt: Number(item.starredAt) } : {})
          });
          favCount++;
        }
        if (item && item.key && item.custom_answer && !this.customNotes[item.key]) {
          this.customNotes = { ...this.customNotes, [item.key]: String(item.custom_answer) };
          noteCount++;
        }
      }
      this.favs = nextFavs;
      lsSet(STORE_KEYS.favs, JSON.stringify(this.favs));
    }

    const srcNotes = parsed.customTranslations || parsed.customAnswers || parsed.muallim_custom_translations;
    if (srcNotes && typeof srcNotes === 'object' && !Array.isArray(srcNotes)) {
      const nextNotes = { ...this.customNotes };
      for (const [k, v] of Object.entries(srcNotes)) {
        if (typeof v === 'string' && v.trim()) {
          if (!nextNotes[k]) noteCount++;
          nextNotes[k] = v.trim();
        }
      }
      this.customNotes = nextNotes;
      lsSet(STORE_KEYS.customTranslations, JSON.stringify(this.customNotes));
    }

    if (parsed.completedLessons && typeof parsed.completedLessons === 'object' && !Array.isArray(parsed.completedLessons)) {
      const nextComp = { ...this.completedLessons };
      for (const [k, v] of Object.entries(parsed.completedLessons)) {
        if (!v || typeof v !== 'object') continue;
        if (!nextComp[k]) {
          nextComp[k] = { completedAt: Number(v.completedAt) || Date.now() };
          completedCount++;
        } else if ((Number(v.completedAt) || 0) > (Number(nextComp[k].completedAt) || 0)) {
          nextComp[k] = { completedAt: Number(v.completedAt) };
        }
      }
      this.completedLessons = nextComp;
      lsSet(STORE_KEYS.completedLessons, JSON.stringify(this.completedLessons));
    }

    if (parsed.srs && typeof parsed.srs === 'object' && !Array.isArray(parsed.srs)) {
      const nextSrs = { ...this.srs };
      for (const [rawKey, impCard] of Object.entries(parsed.srs)) {
        if (!impCard || typeof impCard !== 'object') continue;
        const canonKey = normalizeSrsKey(rawKey);
        const existing = nextSrs[canonKey];
        const existingTs = Number(existing?.lastReview) || 0;
        const impTs = Number(impCard.lastReview) || 0;
        if (!existing || impTs > existingTs) {
          nextSrs[canonKey] = impCard;
          srsCount++;
        }
      }
      this.srs = nextSrs;
      lsSet(STORE_KEYS.srs, JSON.stringify(this.srs));
    }

    if (parsed.studyLog && typeof parsed.studyLog === 'object' && !Array.isArray(parsed.studyLog)) {
      const nextLog = { ...this.studyLog };
      for (const [day, cnt] of Object.entries(parsed.studyLog)) {
        nextLog[day] = Math.max(Number(nextLog[day]) || 0, Number(cnt) || 0);
      }
      const keys = Object.keys(nextLog).sort();
      if (keys.length > 400) {
        for (let i = 0; i < keys.length - 400; i++) {
          delete nextLog[keys[i]];
        }
      }
      this.studyLog = nextLog;
      lsSet(STORE_KEYS.studyLog, JSON.stringify(this.studyLog));
    }

    if (parsed.streak && typeof parsed.streak === 'object') {
      const impDate = typeof parsed.streak.lastStudyDate === 'string' ? parsed.streak.lastStudyDate : null;
      const curDate = this.streak.lastStudyDate || '';
      const longest = Math.max(this.streak.longest || 0, Number(parsed.streak.longest) || 0);
      let current = this.streak.current || 0;
      let lastStudyDate = this.streak.lastStudyDate;
      if (impDate && impDate > curDate) {
        current = Number(parsed.streak.current) || 0;
        lastStudyDate = impDate;
      } else if (impDate && impDate === curDate) {
        current = Math.max(current, Number(parsed.streak.current) || 0);
      }
      this.streak = { current, longest, lastStudyDate };
      this._reconcileStreakDecay();
      lsSet(STORE_KEYS.streak, JSON.stringify(this.streak));
    }

    if (parsed.bookmark && typeof parsed.bookmark === 'object') {
      const impSaved = Number(parsed.bookmark.savedAt) || 0;
      const curSaved = Number(this.bookmark?.savedAt) || 0;
      if (!this.bookmark || impSaved > curSaved) {
        this.bookmark = parsed.bookmark;
        lsSet(STORE_KEYS.bookmark, JSON.stringify(this.bookmark));
      }
    }

    if (parsed.weakWords && typeof parsed.weakWords === 'object' && !Array.isArray(parsed.weakWords)) {
      const nextWeak = { ...this.weakWords };
      for (const [k, imp] of Object.entries(parsed.weakWords)) {
        if (!imp || typeof imp !== 'object') continue;
        const cur = nextWeak[k];
        if (!cur) {
          nextWeak[k] = {
            key: String(imp.key || k),
            arabic: String(imp.arabic || ''),
            stage: Number(imp.stage) || 1,
            lesson: Number(imp.lesson) || 1,
            misses: Number(imp.misses) || 1,
            lastMissed: Number(imp.lastMissed) || Date.now()
          };
          weakCount++;
        } else {
          nextWeak[k] = {
            ...cur,
            misses: Math.max(cur.misses || 0, Number(imp.misses) || 0),
            lastMissed: Math.max(cur.lastMissed || 0, Number(imp.lastMissed) || 0)
          };
        }
      }
      this.weakWords = nextWeak;
      lsSet(STORE_KEYS.weakWords, JSON.stringify(this.weakWords));
    }

    if (Array.isArray(parsed.examHistory)) {
      const seen = new Set(this.examHistory.map(e => `${e.examId}:${e.completedAt}:${e.score}:${e.total}`));
      const nextHistory = [...this.examHistory];
      for (const item of parsed.examHistory) {
        if (!item || typeof item !== 'object') continue;
        const sig = `${item.examId}:${item.completedAt}:${item.score}:${item.total}`;
        if (!seen.has(sig)) {
          seen.add(sig);
          nextHistory.push({
            examId: String(item.examId || 'quiz'),
            mode: String(item.mode || 'untimed'),
            score: Number(item.score) || 0,
            total: Number(item.total) || 0,
            pct: Number(item.pct) || 0,
            completedAt: Number(item.completedAt) || 0
          });
          examCount++;
        }
      }
      nextHistory.sort((a, b) => a.completedAt - b.completedAt);
      this.examHistory = nextHistory.slice(-200);
      lsSet(STORE_KEYS.examHistory, JSON.stringify(this.examHistory));
    }

    if (parsed.deletedItems && typeof parsed.deletedItems === 'object' && !Array.isArray(parsed.deletedItems)) {
      const nextDeleted = { ...this.deletedItems };
      for (const [k, ts] of Object.entries(parsed.deletedItems)) {
        nextDeleted[k] = Math.max(Number(nextDeleted[k]) || 0, Number(ts) || 0);
      }
      this.deletedItems = nextDeleted;
      lsSet(STORE_KEYS.deletedItems, JSON.stringify(this.deletedItems));
    }

    if (parsed.fieldUpdatedAt && typeof parsed.fieldUpdatedAt === 'object' && !Array.isArray(parsed.fieldUpdatedAt)) {
      const nextTs = { ...this.fieldUpdatedAt };
      for (const [k, ts] of Object.entries(parsed.fieldUpdatedAt)) {
        nextTs[k] = Math.max(Number(nextTs[k]) || 0, Number(ts) || 0);
      }
      this.fieldUpdatedAt = nextTs;
      lsSet(STORE_KEYS.fieldUpdatedAt, JSON.stringify(this.fieldUpdatedAt));
    }

    if (parsed.preferences && typeof parsed.preferences === 'object') {
      const p = parsed.preferences;
      if (p.theme) {
        this.theme = normalizeTheme(p.theme);
        lsSet(STORE_KEYS.theme, this.theme);
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', this.theme);
        }
      }
      if (p.mode) {
        this.mode = p.mode === 'student' ? 'student' : 'teacher';
        lsSet(STORE_KEYS.mode, this.mode);
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-mode', this.mode);
        }
      }
      if (p.lang) {
        this.lang = normalizeLang(p.lang);
        lsSet(STORE_KEYS.lang, this.lang);
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-lang', this.lang);
        }
      }
      if (p.arabicScale !== undefined) {
        const clamped = Math.min(42, Math.max(18, Number(p.arabicScale) || 26));
        this.arabicScale = clamped;
        lsSet(STORE_KEYS.arScale, String(clamped));
        if (typeof document !== 'undefined') {
          document.documentElement.style.setProperty('--arabic-scale', `${clamped}px`);
        }
      }
      if (p.audioSpeed !== undefined) {
        const clamped = Math.min(1.5, Math.max(0.5, Number(p.audioSpeed) || 1.0));
        this.audioSpeed = Math.round(clamped * 20) / 20;
        lsSet(STORE_KEYS.audioSpeed, String(this.audioSpeed));
      }
      if (p.showHints !== undefined) {
        this.showHints = Boolean(p.showHints);
        lsSet(STORE_KEYS.showHints, this.showHints ? '1' : '0');
      }
    }

    this.emit('import', true);
    return { favCount, noteCount, completedCount, srsCount, weakCount, examCount };
  }

  /**
   * @returns {string}
   */
  getDeviceId() {
    let id = lsGet(STORE_KEYS.deviceId, null);
    if (!id) {
      id = typeof crypto !== 'undefined' && crypto.randomUUID
        ? `dev_${crypto.randomUUID()}`
        : `dev_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      lsSet(STORE_KEYS.deviceId, id);
    }
    return id;
  }
}

export const store = new AppStore();
