// @ts-check

/**
 * Muallim ul-Qur'an — Core State Store & Schema Migration (v6.0)
 * Manages localStorage persistence, unit JSON fetching, progress, streaks, and subscribers.
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
  favs: 'muallim_favs',
  customTranslations: 'muallim_custom_translations',
  legacyCustomAnswers: 'muallim_custom_answers',
  bookmark: 'muallim_bookmark',
  srs: 'muallim_srs_state',
  completedLessons: 'muallim_completed_lessons',
  streak: 'muallim_streak',
  studyLog: 'muallim_study_log',
  lastSession: 'muallim_last_session',
  examHistory: 'muallim_exam_history',
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

    /** @type {Array<{key: string, arabic: string, hinglish: string, stage: number, lesson: number, ref?: string}>} */
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

    /** @type {any} */
    this.metadata = null;
    /** @type {Record<number, Array<any>>} */
    this.unitsCache = {};
    /** @type {Record<number, Promise<Array<any>>>} */
    this._unitPromises = {};

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
   * Load and migrate existing localStorage schema from v2-v5 keys.
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

    const rawFavs = lsGetJson(STORE_KEYS.favs, []);
    this.favs = Array.isArray(rawFavs) ? rawFavs.filter(f => f && typeof f.key === 'string') : [];

    // Migrate legacy muallim_custom_answers -> muallim_custom_translations
    const hasNewCustom = lsGet(STORE_KEYS.customTranslations, null);
    const oldCustom = lsGetJson(STORE_KEYS.legacyCustomAnswers, null);
    if (hasNewCustom) {
      const parsed = lsGetJson(STORE_KEYS.customTranslations, {});
      this.customNotes = typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } else if (oldCustom && typeof oldCustom === 'object' && !Array.isArray(oldCustom)) {
      this.customNotes = oldCustom;
      lsSet(STORE_KEYS.customTranslations, JSON.stringify(oldCustom));
    } else {
      this.customNotes = {};
    }

    const rawBm = lsGetJson(STORE_KEYS.bookmark, null);
    this.bookmark = rawBm && typeof rawBm === 'object' ? rawBm : null;

    const rawSrs = lsGetJson(STORE_KEYS.srs, {});
    this.srs = typeof rawSrs === 'object' && !Array.isArray(rawSrs) ? rawSrs : {};

    const rawCompleted = lsGetJson(STORE_KEYS.completedLessons, {});
    this.completedLessons = typeof rawCompleted === 'object' && !Array.isArray(rawCompleted) ? rawCompleted : {};

    const rawStreak = lsGetJson(STORE_KEYS.streak, null);
    if (rawStreak && typeof rawStreak === 'object') {
      this.streak = {
        current: Number(rawStreak.current) || 0,
        longest: Number(rawStreak.longest) || 0,
        lastStudyDate: typeof rawStreak.lastStudyDate === 'string' ? rawStreak.lastStudyDate : null
      };
      this._reconcileStreakDecay();
    }

    const rawLog = lsGetJson(STORE_KEYS.studyLog, {});
    this.studyLog = typeof rawLog === 'object' && !Array.isArray(rawLog) ? rawLog : {};

    const rawSession = lsGetJson(STORE_KEYS.lastSession, null);
    this.lastSession = rawSession && typeof rawSession === 'object' ? rawSession : null;
  }

  _reconcileStreakDecay() {
    if (!this.streak.lastStudyDate || this.streak.current === 0) return;
    const today = toLocalDateKey();
    const yesterday = toLocalDateKey(new Date(Date.now() - 86400000));
    if (this.streak.lastStudyDate !== today && this.streak.lastStudyDate !== yesterday) {
      this.streak.current = 0;
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
    const lessons = this.unitsCache[unitNum];
    if (!lessons) return null;
    return lessons.find(l => Number(l.lesson_id) === Number(lessonId)) || lessons[0] || null;
  }

  /**
   * @param {number} unitNum
   * @param {number} lessonId
   * @param {string} title
   */
  setCurrentPosition(unitNum, lessonId, title = '') {
    this.currentUnit = unitNum;
    this.currentLesson = lessonId;
    this.lastSession = {
      stage: unitNum,
      lesson: lessonId,
      title: title || `Unit ${unitNum} Lesson ${lessonId}`,
      updatedAt: Date.now()
    };
    lsSet(STORE_KEYS.lastSession, JSON.stringify(this.lastSession));
  }

  /**
   * @param {string} theme
   */
  setTheme(theme) {
    const next = normalizeTheme(theme);
    this.theme = next;
    lsSet(STORE_KEYS.theme, next);
    document.documentElement.setAttribute('data-theme', next);
    const metaTheme = document.getElementById('meta-theme-color');
    if (metaTheme) {
      const metaColors = { parchment: '#FAF7F2', sepia: '#F2E7D5', night: '#161922' };
      metaTheme.setAttribute('content', metaColors[next] || '#FAF7F2');
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
    document.documentElement.setAttribute('data-mode', next);
    this.emit('mode', false);
  }

  /**
   * @param {string} lang
   */
  setLang(lang) {
    const next = normalizeLang(lang);
    this.lang = next;
    lsSet(STORE_KEYS.lang, next);
    document.documentElement.setAttribute('data-lang', next);
    this.emit('lang', true);
  }

  /**
   * @param {number} size
   */
  setArabicScale(size) {
    const clamped = Math.min(42, Math.max(18, Number(size) || 26));
    this.arabicScale = clamped;
    lsSet(STORE_KEYS.arScale, String(clamped));
    document.documentElement.style.setProperty('--arabic-scale', `${clamped}px`);
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
    let starred = false;
    if (idx >= 0) {
      this.favs = [...this.favs.slice(0, idx), ...this.favs.slice(idx + 1)];
    } else {
      this.favs = [...this.favs, entry];
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
    if (trimmed) {
      next[key] = trimmed;
    } else {
      delete next[key];
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
    if (this.bookmark && this.bookmark.itemId === itemInfo.itemId) {
      this.bookmark = null;
      try {
        localStorage.removeItem(STORE_KEYS.bookmark);
      } catch (err) {
        console.warn('[Store] Failed to remove bookmark:', err);
      }
      this.emit('bookmark', true);
      return false;
    }
    this.bookmark = { ...itemInfo, savedAt: Date.now() };
    lsSet(STORE_KEYS.bookmark, JSON.stringify(this.bookmark));
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
    let isDone = false;
    if (next[lKey]) {
      delete next[lKey];
    } else {
      next[lKey] = { completedAt: Date.now() };
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
    const yesterday = toLocalDateKey(new Date(Date.now() - 86400000));
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
    this.srs = { ...srsMap };
    lsSet(STORE_KEYS.srs, JSON.stringify(this.srs));
    this.emit('srs', true);
  }

  /**
   * Build JSON export payload.
   * @returns {string}
   */
  exportBackupJson() {
    const payload = {
      version: '6.0.0',
      exported_at: new Date().toISOString(),
      favourites: this.favs,
      customTranslations: this.customNotes,
      srs: this.srs,
      completedLessons: this.completedLessons,
      streak: this.streak,
      studyLog: this.studyLog,
      bookmark: this.bookmark
    };
    return JSON.stringify(payload, null, 2);
  }

  /**
   * Merge backup JSON non-destructively into current state.
   * @param {string} rawText
   * @returns {{favCount: number, noteCount: number, completedCount: number}}
   */
  importBackupJson(rawText) {
    const parsed = JSON.parse(rawText);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Backup file is not a valid JSON object.');
    }
    let favCount = 0;
    let noteCount = 0;
    let completedCount = 0;

    if (Array.isArray(parsed.favourites)) {
      const nextFavs = [...this.favs];
      for (const item of parsed.favourites) {
        if (item && item.key && !nextFavs.some(f => f.key === item.key)) {
          nextFavs.push({
            key: String(item.key),
            arabic: String(item.arabic || ''),
            hinglish: String(item.hinglish || ''),
            stage: Number(item.stage) || 1,
            lesson: Number(item.lesson) || 1
          });
          favCount++;
        }
        if (item && item.key && item.custom_answer && !this.customNotes[item.key]) {
          this.customNotes[item.key] = String(item.custom_answer);
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
          nextNotes[k] = v.trim();
          noteCount++;
        }
      }
      this.customNotes = nextNotes;
      lsSet(STORE_KEYS.customTranslations, JSON.stringify(this.customNotes));
    }

    if (parsed.completedLessons && typeof parsed.completedLessons === 'object' && !Array.isArray(parsed.completedLessons)) {
      const nextComp = { ...this.completedLessons };
      for (const [k, v] of Object.entries(parsed.completedLessons)) {
        if (!nextComp[k]) {
          nextComp[k] = v;
          completedCount++;
        }
      }
      this.completedLessons = nextComp;
      lsSet(STORE_KEYS.completedLessons, JSON.stringify(this.completedLessons));
    }

    if (parsed.srs && typeof parsed.srs === 'object' && !Array.isArray(parsed.srs)) {
      this.srs = { ...this.srs, ...parsed.srs };
      lsSet(STORE_KEYS.srs, JSON.stringify(this.srs));
    }

    this.emit('import', true);
    return { favCount, noteCount, completedCount };
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
