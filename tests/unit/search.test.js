import { describe, it, beforeEach, afterEach } from 'node:test';
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

const { normalizeQuery, SearchController } = await import('../../js/core/search.js');

const realSearchIndexText = fs.readFileSync(
  new URL('../../data/search-index.json', import.meta.url),
  'utf8'
);

function setupSearchDom() {
  const mount = {
    innerHTML: '',
    querySelectorAll() { return []; },
    querySelector() { return null; }
  };
  const statusLine = { textContent: '' };
  globalThis.document = /** @type {any} */ ({
    getElementById(id) {
      if (id === 'search-results-mount') return mount;
      if (id === 'search-status-line') return statusLine;
      return null;
    }
  });
  return { mount, statusLine };
}

function extractRenderedResultIds(html) {
  const matches = [...html.matchAll(/data-jump-unit="(\d+)"\s+data-jump-lesson="(\d+)"(?:\s+data-jump-item="([^"]+)")?/g)];
  return matches.map(m => ({
    s: Number(m[1]),
    l: Number(m[2]),
    itemKey: m[3] || ''
  }));
}

describe('search.js — pre-normalization, Hinglish/Hindi search, ranking, getByRoot & getItemMeta', () => {
  const origFetch = globalThis.fetch;
  const origDoc = globalThis.document;

  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  afterEach(() => {
    globalThis.fetch = origFetch;
    globalThis.document = origDoc;
  });

  it('normalizes Arabic diacritics, alif/taa-marbootah, sun-letter hyphens, and doubled Hinglish vowels', () => {
    assert.equal(normalizeQuery('الْكِتَابُ'), 'الكتاب');
    assert.equal(normalizeQuery('صَلَاةٌ'), 'صلاه');
    assert.equal(normalizeQuery('as-salaah'), 'assalah');
    assert.equal(normalizeQuery('al-kitaab'), 'alkitab');
    assert.equal(normalizeQuery('subhaan'), 'subhan');
    assert.equal(normalizeQuery('zakaat'), 'zakat');
    assert.equal(normalizeQuery('Kareem'), 'karim');
    assert.equal(normalizeQuery('Ghafoor'), 'ghafur');
  });

  it('ranks exact (100) > prefix (75) > word-boundary (55) > substring (30)', async () => {
    const { mount } = setupSearchDom();
    const syntheticIndex = [
      { id: 'sub', s: 1, l: 4, ar: 'د', tr: '', hn: '', en: 'unbookish', ur: '', hi: '', root: '' },
      { id: 'wb', s: 1, l: 3, ar: 'ج', tr: '', hn: '', en: 'open book now', ur: '', hi: '', root: '' },
      { id: 'pre', s: 1, l: 2, ar: 'ب', tr: '', hn: '', en: 'bookshelf', ur: '', hi: '', root: '' },
      { id: 'ex', s: 1, l: 1, ar: 'أ', tr: '', hn: '', en: 'book', ur: '', hi: '', root: '' }
    ];

    globalThis.fetch = async () => /** @type {any} */ ({
      ok: true,
      json: async () => syntheticIndex
    });

    const ctrl = new SearchController();
    await ctrl.performSearch('book');

    const ranked = extractRenderedResultIds(mount.innerHTML);
    assert.deepEqual(
      ranked.map(r => r.itemKey),
      ['S1L1_num_ex', 'S1L2_num_pre', 'S1L3_num_wb', 'S1L4_num_sub']
    );
  });

  it('loads real 14,956-entry search-index.json and resolves vowel-collapsed Hinglish & Devanagari Hindi queries', async () => {
    const { mount, statusLine } = setupSearchDom();
    globalThis.fetch = async () => /** @type {any} */ ({
      ok: true,
      json: async () => JSON.parse(realSearchIndexText)
    });

    const ctrl = new SearchController();
    const loaded = await ctrl.ensureIndexLoaded();
    assert.equal(loaded.length, 14956);

    for (const q of ['kitab', 'namaz', 'subhan', 'zakat']) {
      await ctrl.performSearch(q);
      const hits = extractRenderedResultIds(mount.innerHTML);
      assert.ok(hits.length > 0, `Expected search hits for "${q}", got 0 (${statusLine.textContent})`);
    }

    // Devanagari Hindi query
    await ctrl.performSearch('किताब');
    const hiHits = extractRenderedResultIds(mount.innerHTML);
    assert.ok(hiHits.length > 0, 'Expected Devanagari Hindi hits for "किताब"');
    assert.ok(mount.innerHTML.includes('الْكِتَاب') || mount.innerHTML.includes('كِتَاب'));

    // getByRoot() & getItemMeta()
    const rootRes = ctrl.getByRoot('ك ت ب');
    assert.ok(rootRes.matches.length > 0, 'Expected root matches for ك ت ب');

    const meta = ctrl.getItemMeta(1, 4, 'S1L4_num_s1l4_g1_w10');
    assert.ok(meta, 'Expected item meta for s1l4_g1_w10');
    assert.ok(meta.tr.includes('kitab'));
    assert.equal(meta.hn, 'Kitaab');
  });
});
