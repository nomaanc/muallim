import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

function createMockLocalStorage() {
  const map = new Map();
  return {
    getItem(key) { return map.has(key) ? map.get(key) : null; },
    setItem(key, val) { map.set(String(key), String(val)); },
    removeItem(key) { map.delete(String(key)); },
    clear() { map.clear(); }
  };
}
globalThis.localStorage = createMockLocalStorage();

const { store } = await import('../../js/core/store.js');
const { extractMorphChallenge } = await import('../../js/core/quiz.js');

function loadLessonItems(code) {
  const raw = JSON.parse(
    fs.readFileSync(new URL(`../../data/lessons/${code}.json`, import.meta.url), 'utf8')
  );
  const items = [];
  for (const sec of raw.lesson.sections || []) {
    for (const it of sec.data?.items || []) {
      items.push(it);
    }
  }
  return items;
}

describe('quiz.js — extractMorphChallenge() Units 5-7 edge cases', () => {
  beforeEach(() => {
    store.lang = 'hinglish';
  });

  it('extracts multi-word pronoun + root challenge from U5L9 (أَنْتُمْ مُسْلِمُونَ)', () => {
    const items = loadLessonItems('s5l9');
    const item = items.find(it => it.id === 's5l9_w_1');
    assert.ok(item);
    const ch = extractMorphChallenge(item);
    assert.ok(ch);
    assert.equal(ch.prefix, 'أَنْتُمْ ');
    assert.equal(ch.root, 'مُسْلِمُونَ');
    assert.equal(ch.suffix, '');
    assert.equal(ch.target, 'أَنْتُمْ مُسْلِمُونَ');
    assert.equal(ch.baseHint, 'مُسْلِمُونَ');
  });

  it('extracts demonstrative + root challenge from U5L17 (أُولَائِكَ أَصْحَابُ)', () => {
    const items = loadLessonItems('s5l17');
    const item = items.find(it => it.id === 's5l17_s1_1');
    assert.ok(item);
    const ch = extractMorphChallenge(item);
    assert.ok(ch);
    assert.equal(ch.prefix, 'أُولَائِكَ ');
    assert.equal(ch.root, 'أَصْحَابُ');
    assert.equal(ch.target, 'أُولَائِكَ أَصْحَابُ');
  });

  it('extracts affix+root+affix multi-word challenge from U5L19 (مَا هٰذَا إِلَّا)', () => {
    const items = loadLessonItems('s5l19');
    const item = items.find(it => it.id === 's5l19_s1_2');
    assert.ok(item);
    const ch = extractMorphChallenge(item);
    assert.ok(ch);
    assert.equal(ch.prefix, 'مَا ');
    assert.equal(ch.root, 'هٰذَا');
    assert.equal(ch.suffix, ' إِلَّا');
    assert.equal(ch.target, 'مَا هٰذَا إِلَّا');

    // Also every nonroot item in U5L19 produces a challenge
    const withNonroot = items.filter(it => (it.arabic_markup || '').includes('nonroot'));
    assert.ok(withNonroot.length > 10);
    for (const it of withNonroot) {
      assert.ok(extractMorphChallenge(it), `Expected challenge for ${it.id}`);
    }
  });

  it('extracts root + nonroot tamyeez phrase from U5L22 (أَشَدُّ بَطْشًا)', () => {
    const items = loadLessonItems('s5l22');
    const item = items.find(it => it.id === 's5l22_ph_1');
    assert.ok(item);
    const ch = extractMorphChallenge(item);
    assert.ok(ch);
    assert.equal(ch.prefix, '');
    assert.equal(ch.root, 'أَشَدُّ');
    assert.equal(ch.suffix, ' بَطْشًا');
    assert.equal(ch.target, 'أَشَدُّ بَطْشًا');
  });

  it('extracts slash-segmented preposition + noun from U5L23 (شِرْكٌ / مِنْ شِرْكٍ)', () => {
    const items = loadLessonItems('s5l23');
    const item = items.find(it => it.id === 's5l23_pairs_1');
    assert.ok(item);
    const ch = extractMorphChallenge(item);
    assert.ok(ch);
    assert.equal(ch.prefix, 'مِنْ ');
    assert.equal(ch.root, 'شِرْكٍ');
    assert.equal(ch.target, 'مِنْ شِرْكٍ');
    assert.equal(ch.baseHint, 'شِرْكٌ');
  });

  it('extracts nonroot + nonroot particle phrase from U6L17 (أَنْ يَغْفِرَ)', () => {
    const items = loadLessonItems('s6l17');
    const item = items.find(it => it.id === 's6l17_grid_w1');
    assert.ok(item);
    const ch = extractMorphChallenge(item);
    assert.ok(ch);
    assert.equal(ch.prefix, 'أَنْ ');
    assert.equal(ch.root, 'يَغْفِرَ');
    assert.equal(ch.suffix, '');
    assert.equal(ch.target, 'أَنْ يَغْفِرَ');
    assert.equal(ch.baseHint, 'يَغْفِرُ');
  });

  it('handles intra-word affixes and returns null when nonroot is absent', () => {
    const intra = extractMorphChallenge({
      arabic_markup: '<span class="nonroot">يَ</span><span class="arabic-root">عْبُدُ</span><span class="nonroot">ونَ</span>',
      hinglish: 'Woh sab ibadat karte hain'
    });
    assert.deepEqual(intra, {
      prefix: 'يَ',
      root: 'عْبُدُ',
      suffix: 'ونَ',
      target: 'يَعْبُدُونَ',
      baseHint: '',
      meaning: 'Woh sab ibadat karte hain',
      ref: ''
    });

    assert.equal(extractMorphChallenge({ arabic_markup: '<span class="arabic-root">كِتَابٌ</span>' }), null);
    assert.equal(extractMorphChallenge(null), null);
  });
});
