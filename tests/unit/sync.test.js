import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

function createMockLocalStorage() {
  const map = new Map();
  return {
    getItem(key) { return map.has(key) ? map.get(key) : null; },
    setItem(key, val) { map.set(String(key), String(val)); },
    removeItem(key) { map.delete(String(key)); },
    clear() { map.clear(); },
    get length() { return map.size; },
    key(i) { return Array.from(map.keys())[i] ?? null; }
  };
}

globalThis.localStorage = createMockLocalStorage();

const { store, STORE_KEYS } = await import('../../js/core/store.js');
const { cloudSync } = await import('../../js/core/sync.js');

function resetState() {
  globalThis.localStorage.clear();
  store.init();
  cloudSync.user = null;
  cloudSync._db = null;
  cloudSync._fs = null;
}

function mockCloudPull(cloudPayload) {
  cloudSync.user = { uid: 'test-user-1', email: 'learner@example.com', name: 'Learner' };
  cloudSync._db = { kind: 'mock-db' };
  cloudSync._fs = {
    doc: (db, col, uid) => ({ db, col, uid }),
    getDoc: async () => ({
      exists: () => true,
      data: () => cloudPayload
    })
  };
}

describe('sync.js — timestamp SRS merge & deletion tombstones', () => {
  beforeEach(() => {
    resetState();
  });

  afterEach(() => {
    resetState();
  });

  it('merges SRS per-card using Math.max(local.lastReview || 0, cloud.lastReview || 0) and normalizes legacy keys', async () => {
    store.saveSrsState({
      S1L1_num_s1l1_g1_w1: { box: 4, reps: 5, lapses: 0, lastReview: 5000, nextReview: 90000 },
      S2L1_num_s2l1_1: { box: 1, reps: 1, lapses: 0, lastReview: 1000, nextReview: 2000 }
    });

    mockCloudPull({
      srs: {
        // Older than local -> local must win
        S1L1_num_s1l1_g1_w1: { box: 2, reps: 2, lapses: 1, lastReview: 3000, nextReview: 4000 },
        // Newer than local -> cloud must win
        S2L1_num_s2l1_1: { box: 3, reps: 4, lapses: 0, lastReview: 8000, nextReview: 99000 },
        // Legacy cloud key -> normalized to canonical S5L6_num_...
        S5L6_s5l6_w_1: { box: 2, reps: 2, lapses: 0, lastReview: 4000, nextReview: 12000 }
      }
    });

    await cloudSync.pullFromCloud();

    assert.equal(store.srs.S1L1_num_s1l1_g1_w1.box, 4);
    assert.equal(store.srs.S1L1_num_s1l1_g1_w1.lastReview, 5000);
    assert.equal(store.srs.S2L1_num_s2l1_1.box, 3);
    assert.equal(store.srs.S2L1_num_s2l1_1.lastReview, 8000);
    assert.equal(store.srs.S5L6_s5l6_w_1, undefined);
    assert.equal(store.srs.S5L6_num_s5l6_w_1.box, 2);
  });

  it('preserves deletedItems tombstones across sync for starredItems, customTranslations, completedLessons, and weakWords', async () => {
    // 1. Local deletions recorded at t = 2000 for fav, note, lesson, weakWord
    store.deletedItems = {
      'fav:S1L1_num_s1l1_g1_w1': 2000,
      'note:S1L2_num_s1l2_1': 2000,
      'lesson:S1L3': 2000,
      'weak:S5L6_num_s5l6_w_1': 2000
    };
    // Also a local item that was deleted in cloud at t = 6000
    store.favs = [{ key: 'S2L1_num_keep_del', arabic: 'مِنْ', hinglish: 'Se', stage: 2, lesson: 1, starredAt: 3000 }];
    // And an item re-starred locally at t = 9000 AFTER cloud deletion at t = 6000
    store.favs.push({ key: 'S2L2_num_restarred', arabic: 'عَلَى', hinglish: 'Par', stage: 2, lesson: 2, starredAt: 9000 });

    mockCloudPull({
      deletedItems: {
        'fav:S2L1_num_keep_del': 6000,
        'fav:S2L2_num_restarred': 6000
      },
      // Older cloud entries (ts = 1000 < local deletion ts = 2000) must NOT resurrect!
      starredItems: [
        { key: 'S1L1_num_s1l1_g1_w1', arabic: 'الْإِسْلَام', hinglish: 'Islam', stage: 1, lesson: 1, starredAt: 1000 }
      ],
      customTranslations: {
        S1L2_num_s1l2_1: 'Old deleted note',
        S1L2_num_s1l2_2: 'Kept cloud note'
      },
      fieldUpdatedAt: {
        'note:S1L2_num_s1l2_1': 1000,
        'note:S1L2_num_s1l2_2': 4000
      },
      completedLessons: {
        S1L3: { completedAt: 1000 },
        S1L4: { completedAt: 4000 }
      },
      weakWords: {
        S5L6_num_s5l6_w_1: { key: 'S5L6_num_s5l6_w_1', arabic: 'رَبٌّ', stage: 5, lesson: 6, misses: 2, lastMissed: 1000 },
        S5L6_num_s5l6_w_2: { key: 'S5L6_num_s5l6_w_2', arabic: 'حِسَابٌ', stage: 5, lesson: 6, misses: 1, lastMissed: 4000 }
      }
    });

    await cloudSync.pullFromCloud();

    // Tombstoned items stayed deleted
    assert.equal(store.favs.some(f => f.key === 'S1L1_num_s1l1_g1_w1'), false);
    assert.equal(store.favs.some(f => f.key === 'S2L1_num_keep_del'), false);
    // Re-starred item with starredAt (9000) > deletion (6000) survived
    assert.equal(store.favs.some(f => f.key === 'S2L2_num_restarred'), true);

    // Custom translations
    assert.equal(store.customNotes.S1L2_num_s1l2_1, undefined);
    assert.equal(store.customNotes.S1L2_num_s1l2_2, 'Kept cloud note');

    // Completed lessons
    assert.equal(store.completedLessons.S1L3, undefined);
    assert.equal(store.completedLessons.S1L4?.completedAt, 4000);

    // Weak words
    assert.equal(store.weakWords.S5L6_num_s5l6_w_1, undefined);
    assert.equal(store.weakWords.S5L6_num_s5l6_w_2?.arabic, 'حِسَابٌ');

    // Tombstones themselves survive in store + localStorage
    assert.equal(store.deletedItems['fav:S1L1_num_s1l1_g1_w1'], 2000);
    assert.equal(store.deletedItems['fav:S2L1_num_keep_del'], 6000);
    const savedDeleted = JSON.parse(localStorage.getItem(STORE_KEYS.deletedItems) || '{}');
    assert.equal(savedDeleted['note:S1L2_num_s1l2_1'], 2000);
  });
});
