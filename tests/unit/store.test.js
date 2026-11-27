import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

function createMockLocalStorage() {
  const map = new Map();
  return {
    getItem(key) {
      return map.has(key) ? map.get(key) : null;
    },
    setItem(key, val) {
      map.set(String(key), String(val));
    },
    removeItem(key) {
      map.delete(String(key));
    },
    clear() {
      map.clear();
    },
    get length() {
      return map.size;
    },
    key(i) {
      return Array.from(map.keys())[i] ?? null;
    }
  };
}

globalThis.localStorage = createMockLocalStorage();

const {
  store,
  STORE_KEYS,
  normalizeTheme,
  normalizeLang,
  normalizeSrsKey,
  toLocalDateKey,
  yesterdayLocalDateKey
} = await import('../../js/core/store.js');

function resetStoreAndStorage() {
  globalThis.localStorage.clear();
  store.currentUnit = 1;
  store.currentLesson = 1;
  store.theme = 'parchment';
  store.mode = 'teacher';
  store.lang = 'hinglish';
  store.arabicScale = 26;
  store.audioSpeed = 1.0;
  store.showHints = false;
  store.favs = [];
  store.customNotes = {};
  store.bookmark = null;
  store.srs = {};
  store.completedLessons = {};
  store.streak = { current: 0, longest: 0, lastStudyDate: null };
  store.studyLog = {};
  store.lastSession = null;
  store.weakWords = {};
  store.examHistory = [];
  store.deletedItems = {};
  store.fieldUpdatedAt = {};
}

describe('store.js — v7.0 migrations, backup round-trip & DST-safe streak math', () => {
  beforeEach(() => {
    resetStoreAndStorage();
  });

  afterEach(() => {
    resetStoreAndStorage();
  });

  it('migrates v2-v6 themes (light->parchment, dark->night) and drops retired languages (bn/ko/zh/es->en)', () => {
    assert.equal(normalizeTheme('light'), 'parchment');
    assert.equal(normalizeTheme('dark'), 'night');
    assert.equal(normalizeTheme('sepia'), 'sepia');
    assert.equal(normalizeTheme('unknown'), 'parchment');

    for (const retired of ['bn', 'ko', 'zh', 'es']) {
      assert.equal(normalizeLang(retired), 'en');
    }
    assert.equal(normalizeLang('hinglish'), 'hinglish');
    assert.equal(normalizeLang('ur'), 'ur');
    assert.equal(normalizeLang('hi'), 'hi');

    localStorage.setItem(STORE_KEYS.theme, 'dark');
    localStorage.setItem(STORE_KEYS.lang, 'ko');
    localStorage.setItem(STORE_KEYS.legacyCustomAnswers, JSON.stringify({ S1L1_num_s1l1_g1_w1: 'My note' }));
    store.init();

    assert.equal(store.theme, 'night');
    assert.equal(localStorage.getItem(STORE_KEYS.theme), 'night');
    assert.equal(store.lang, 'en');
    assert.equal(localStorage.getItem(STORE_KEYS.lang), 'en');
    assert.equal(store.customNotes.S1L1_num_s1l1_g1_w1, 'My note');
    assert.ok(localStorage.getItem(STORE_KEYS.customTranslations)?.includes('My note'));

    localStorage.setItem(STORE_KEYS.theme, 'light');
    localStorage.setItem(STORE_KEYS.lang, 'bn');
    store.init();
    assert.equal(store.theme, 'parchment');
    assert.equal(store.lang, 'en');
  });

  it('migrates legacy SRS S{u}L{l}_{id} keys to canonical S{u}L{l}_num_{id} on init()', () => {
    assert.equal(normalizeSrsKey('S5L6_s5l6_w_1'), 'S5L6_num_s5l6_w_1');
    assert.equal(normalizeSrsKey('S5L6_num_s5l6_w_1'), 'S5L6_num_s5l6_w_1');

    localStorage.setItem(STORE_KEYS.srs, JSON.stringify({
      S1L1_s1l1_g1_w1: { box: 2, reps: 3, lapses: 0, lastReview: 1000, nextReview: 5000 },
      S5L6_s5l6_w_1: { box: 1, reps: 1, lapses: 1, lastReview: 500, nextReview: 1000 },
      S5L6_num_s5l6_w_1: { box: 4, reps: 6, lapses: 0, lastReview: 2500, nextReview: 9000 },
      S3L2_num_s3l2_1: { box: 3, reps: 4, lapses: 0, lastReview: 2000, nextReview: 7000 }
    }));

    store.init();

    assert.equal(store.srs.S1L1_s1l1_g1_w1, undefined);
    assert.deepEqual(store.srs.S1L1_num_s1l1_g1_w1, {
      box: 2, reps: 3, lapses: 0, lastReview: 1000, nextReview: 5000
    });
    // Newer lastReview wins when both legacy and canonical keys exist
    assert.equal(store.srs.S5L6_num_s5l6_w_1.box, 4);
    assert.equal(store.srs.S5L6_num_s5l6_w_1.lastReview, 2500);
    assert.equal(store.srs.S3L2_num_s3l2_1.box, 3);

    const persisted = JSON.parse(localStorage.getItem(STORE_KEYS.srs) || '{}');
    assert.equal(persisted.S1L1_s1l1_g1_w1, undefined);
    assert.ok(persisted.S1L1_num_s1l1_g1_w1);
  });

  it('exportBackupJson() and importBackupJson() perform full lossless round-trip and timestamp-merge SRS', () => {
    const today = toLocalDateKey();
    store.setTheme('sepia');
    store.setMode('student');
    store.setLang('ur');
    store.setArabicScale(34);
    store.setAudioSpeed(1.25);
    store.setShowHints(true);

    store.toggleStar({
      key: 'S2L1_num_s2l1_1',
      arabic: 'فِي',
      hinglish: 'Mein',
      stage: 2,
      lesson: 1,
      ref: '2:2'
    });
    store.saveCustomNote('S2L1_num_s2l1_1', 'Inside / In');
    store.toggleBookmark({ stage: 2, lesson: 1, itemId: 'S2L1_num_s2l1_1', arabic: 'فِي' });
    store.completedLessons = { S1L1: { completedAt: 1700000000000 } };
    store.streak = { current: 5, longest: 12, lastStudyDate: today };
    store.studyLog = { [today]: 4 };
    store.recordWeakWord({ key: 'S5L6_num_s5l6_w_1', arabic: 'رَبٌّ', stage: 5, lesson: 6, lastMissed: 1700000001000 });
    store.recordExamAttempt({ examId: 'vol1', mode: 'exam', score: 45, total: 50, pct: 90, completedAt: 1700000002000 });
    store.saveSrsState({
      S2L1_num_s2l1_1: { box: 3, reps: 4, lapses: 0, lastReview: 10000, nextReview: 90000 },
      S3L1_num_s3l1_1: { box: 2, reps: 2, lapses: 1, lastReview: 5000, nextReview: 50000 }
    });

    const exported = store.exportBackupJson();
    const parsedExport = JSON.parse(exported);
    assert.equal(parsedExport.version, '7.0.0');

    // Wipe store and seed conflicting SRS timestamps before importing
    resetStoreAndStorage();
    store.saveSrsState({
      // Newer local card must NOT be overwritten by older backup card
      S2L1_num_s2l1_1: { box: 5, reps: 9, lapses: 0, lastReview: 20000, nextReview: 999999 },
      // Older local card MUST be updated by newer backup card
      S3L1_num_s3l1_1: { box: 1, reps: 1, lapses: 0, lastReview: 1000, nextReview: 2000 }
    });

    const stats = store.importBackupJson(exported);
    assert.equal(stats.favCount, 1);
    assert.equal(stats.noteCount, 1);
    assert.equal(stats.completedCount, 1);
    assert.equal(stats.srsCount, 1);
    assert.equal(stats.weakCount, 1);
    assert.equal(stats.examCount, 1);

    // Preferences restored
    assert.equal(store.theme, 'sepia');
    assert.equal(store.mode, 'student');
    assert.equal(store.lang, 'ur');
    assert.equal(store.arabicScale, 34);
    assert.equal(store.audioSpeed, 1.25);
    assert.equal(store.showHints, true);

    // Progress, bookmark, weakWords, examHistory, streak, studyLog restored
    assert.deepEqual(store.streak, { current: 5, longest: 12, lastStudyDate: today });
    assert.equal(store.studyLog[today], 4);
    assert.equal(store.bookmark?.itemId, 'S2L1_num_s2l1_1');
    assert.equal(store.weakWords.S5L6_num_s5l6_w_1?.arabic, 'رَبٌّ');
    assert.equal(store.examHistory.length, 1);
    assert.equal(store.examHistory[0].score, 45);

    // Timestamp-merged SRS
    assert.equal(store.srs.S2L1_num_s2l1_1.box, 5);
    assert.equal(store.srs.S2L1_num_s2l1_1.lastReview, 20000);
    assert.equal(store.srs.S3L1_num_s3l1_1.box, 2);
    assert.equal(store.srs.S3L1_num_s3l1_1.lastReview, 5000);
  });

  it('computes DST-safe yesterdayLocalDateKey() and streak boundary transitions', (t) => {
    // 1. Verify calendar date subtraction across month boundary (March 1 -> Feb 28 / Feb 29)
    t.mock.timers.enable({ apis: ['Date'], now: new Date(2026, 2, 1, 0, 30, 0).getTime() });
    assert.equal(toLocalDateKey(), '2026-03-01');
    assert.equal(yesterdayLocalDateKey(), '2026-02-28');

    // Leap year check: 2024-03-01 -> 2024-02-29
    t.mock.timers.setTime(new Date(2024, 2, 1, 1, 15, 0).getTime());
    assert.equal(toLocalDateKey(), '2024-03-01');
    assert.equal(yesterdayLocalDateKey(), '2024-02-29');

    // 2. Streak continuation from yesterday -> increments current and updates longest
    t.mock.timers.setTime(new Date(2026, 5, 10, 12, 0, 0).getTime());
    const today = toLocalDateKey();
    const yesterday = yesterdayLocalDateKey();
    assert.equal(today, '2026-06-10');
    assert.equal(yesterday, '2026-06-09');

    store.streak = { current: 4, longest: 4, lastStudyDate: yesterday };
    store.recordStudyActivity(1, false);
    assert.deepEqual(store.streak, { current: 5, longest: 5, lastStudyDate: today });

    // Same-day activity keeps current streak at 5
    store.recordStudyActivity(2, false);
    assert.deepEqual(store.streak, { current: 5, longest: 5, lastStudyDate: today });
    assert.equal(store.studyLog[today], 3);

    // 3. Missed a day -> init() decays current streak to 0 while preserving longest
    localStorage.setItem(STORE_KEYS.streak, JSON.stringify({
      current: 5,
      longest: 9,
      lastStudyDate: '2026-06-07'
    }));
    store.init();
    assert.deepEqual(store.streak, { current: 0, longest: 9, lastStudyDate: '2026-06-07' });

    t.mock.timers.reset();
  });

  it('getTranslation() returns item.hinglish in hinglish mode when translations.hinglish is deduplicated', () => {
    const item = {
      id: 's5l2_pairs_1',
      arabic: 'الْمُشْرِكُونَ / الْمُشْرِكِينَ',
      hinglish: 'shirk karne wale',
      translations: {
        en: 'The polytheists',
        ur: 'شرک کرنے والے',
        hi: 'शिर्क करने वाले'
      }
    };
    store.lang = 'hinglish';
    assert.equal(store.getTranslation(item), 'shirk karne wale');
    assert.equal(store.getTranslation(item, 'en'), 'The polytheists');
    assert.equal(store.getTranslation(item, 'ur'), 'شرک کرنے والے');
    assert.equal(store.getTranslation(item, 'hi'), 'शिर्क करने वाले');
  });
});
