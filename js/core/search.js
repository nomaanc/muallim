// @ts-check

/**
 * Muallim ul-Qur'an — Full-Text Search & Root Index Engine (v7.0)
 * Pre-normalizes 14,956 entries across Arabic, transliteration, Hinglish,
 * English, Urdu, Hindi, and triliteral roots, scoring all matches before
 * returning top 50 results.
 */

import { store } from './store.js';

/**
 * Normalize Arabic & Latin strings for search matching:
 * - Collapses sun-letter / definite-article hyphens (al-, as-, ash-, ar-, an-, at-, etc.)
 * - Collapses repeated vowel runs (aa->a, ee->i, oo->u, ii->i, uu->u)
 * - Strips Arabic harakat and normalizes alif / alif-maqsura / taa-marbootah
 * @param {string} val
 * @returns {string}
 */
export function normalizeQuery(val) {
  if (!val) return '';
  return String(val)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[\u0622\u0623\u0625\u0671]/g, 'ا')
    .replace(/\u0649/g, 'ي')
    .replace(/\u0629/g, 'ه')
    .replace(/(^|\s)(a(?:l|s|sh|r|z|t|d|n|th|dh)|u(?:l|s|sh|r|z|t|d|n|th|dh))-/g, '$1$2')
    .replace(/a{2,}/g, 'a')
    .replace(/e{2,}/g, 'i')
    .replace(/o{2,}/g, 'u')
    .replace(/i{2,}/g, 'i')
    .replace(/u{2,}/g, 'u')
    .replace(/[-_.,;:'"`’‘!?()[\]/\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Score a normalized field against a normalized query.
 * Exact === 100, prefix === 75, word-boundary === 55, substring === 30.
 * @param {string} fieldNorm
 * @param {string} qNorm
 * @returns {number}
 */
function scoreMatch(fieldNorm, qNorm) {
  if (!fieldNorm || !qNorm) return 0;
  if (fieldNorm === qNorm) return 100;
  if (fieldNorm.startsWith(qNorm)) return 75;
  const words = fieldNorm.split(' ');
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (w === qNorm || w.startsWith(qNorm)) return 55;
  }
  if (fieldNorm.includes(qNorm)) return 30;
  return 0;
}

/**
 * @param {string} val
 * @returns {string}
 */
function esc(val) {
  return String(val || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export class SearchController {
  /**
   * @param {(unit: number, lesson: number, itemKey?: string) => Promise<void>} [onJumpToLesson]
   */
  constructor(onJumpToLesson = async () => {}) {
    this.onJumpToLesson = onJumpToLesson;
    /** @type {Array<{id?: any, s: number, l: number, ar: string, tr: string, hn: string, en: string, ur: string, hi: string, root: string, arNorm: string, trNorm: string, hnNorm: string, enNorm: string, urNorm: string, hiNorm: string, rootNorm: string, rootCompact: string}> | null} */
    this._indexData = null;
    /** @type {Map<string, any>} */
    this._metaById = new Map();
    /** @type {Map<string, Array<any>>} */
    this._byRootMap = new Map();
    /** @type {Promise<any> | null} */
    this._indexPromise = null;
    this._loadError = '';
    this._debounceTimer = 0;
  }

  bind() {
    const input = /** @type {HTMLInputElement | null} */ (document.getElementById('search-input'));
    const clearBtn = /** @type {HTMLButtonElement | null} */ (document.getElementById('search-clear-btn'));
    if (!input) return;

    input.addEventListener('input', () => {
      if (clearBtn) clearBtn.hidden = input.value.trim().length === 0;
      clearTimeout(this._debounceTimer);
      this._debounceTimer = window.setTimeout(() => {
        this.performSearch(input.value);
      }, 120);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.hidden = true;
        this.performSearch('');
        input.focus();
      });
    }
  }

  open() {
    const dlg = /** @type {HTMLDialogElement | null} */ (document.getElementById('search-dialog'));
    const input = /** @type {HTMLInputElement | null} */ (document.getElementById('search-input'));
    if (!dlg) return;
    if (!dlg.open) dlg.showModal();
    if (input) {
      input.focus();
      this.performSearch(input.value);
    }
    this.ensureIndexLoaded();
  }

  async ensureIndexLoaded() {
    if (this._indexData) return this._indexData;
    if (this._indexPromise) return this._indexPromise;
    this._loadError = '';
    this._indexPromise = (async () => {
      try {
        const res = await fetch('./data/search-index.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.json();
        const list = Array.isArray(raw) ? raw : [];

        const metaById = new Map();
        const byRootMap = new Map();
        const preNormalized = new Array(list.length);

        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          const arNorm = normalizeQuery(item.ar);
          const trNorm = normalizeQuery(item.tr);
          const hnNorm = normalizeQuery(item.hn || '');
          const enNorm = normalizeQuery(item.en);
          const urNorm = normalizeQuery(item.ur);
          const hiNorm = normalizeQuery(item.hi || '');
          const rootNorm = normalizeQuery(item.root);
          const rootCompact = rootNorm.replace(/\s+/g, '');

          const enriched = {
            ...item,
            hn: item.hn || '',
            hi: item.hi || '',
            arNorm,
            trNorm,
            hnNorm,
            enNorm,
            urNorm,
            hiNorm,
            rootNorm,
            rootCompact
          };
          preNormalized[i] = enriched;

          if (item.id !== undefined && item.id !== null) {
            metaById.set(`${item.s}:${item.l}:${item.id}`, enriched);
          }
          if (rootCompact) {
            let bucket = byRootMap.get(rootCompact);
            if (!bucket) {
              bucket = [];
              byRootMap.set(rootCompact, bucket);
            }
            bucket.push(enriched);
          }
        }

        this._metaById = metaById;
        this._byRootMap = byRootMap;
        this._indexData = preNormalized;
        return this._indexData;
      } catch (err) {
        this._loadError = err instanceof Error ? err.message : 'Network error';
        console.warn('[Search] Could not load search-index.json:', err);
        return [];
      } finally {
        this._indexPromise = null;
      }
    })();
    return this._indexPromise;
  }

  /**
   * Look up metadata (`{ tr, root, ... }`) for a curriculum item by unit, lesson, and itemId.
   * Requires `ensureIndexLoaded()` to have completed for populated data.
   * @param {number} unit
   * @param {number} lesson
   * @param {string | number} itemId
   * @returns {{id?: any, tr: string, root: string, ar: string, hn: string, en: string, ur: string, hi: string, matches: Array<any>} | null}
   */
  getItemMeta(unit, lesson, itemId) {
    if (!this._indexData) return null;
    const rawId = String(itemId ?? '').replace(/^S\d+L\d+_num_/, '');
    const hit = this._metaById.get(`${Number(unit)}:${Number(lesson)}:${rawId}`);
    if (!hit) return null;
    const rootMatches = hit.rootCompact ? (this._byRootMap.get(hit.rootCompact) || []) : [];
    return {
      id: hit.id,
      tr: hit.tr || '',
      root: hit.root || '',
      ar: hit.ar || '',
      hn: hit.hn || '',
      en: hit.en || '',
      ur: hit.ur || '',
      hi: hit.hi || '',
      matches: rootMatches
    };
  }

  /**
   * Return all indexed curriculum occurrences matching a root (`{ tr, root, matches }`).
   * Requires `ensureIndexLoaded()` to have completed.
   * @param {string} root
   * @returns {{tr: string, root: string, matches: Array<any>}}
   */
  getByRoot(root) {
    const cleanRoot = String(root || '').trim();
    const qCompact = normalizeQuery(cleanRoot).replace(/\s+/g, '');
    if (!qCompact || !this._indexData) {
      return { tr: '', root: cleanRoot, matches: [] };
    }
    const exact = this._byRootMap.get(qCompact);
    if (exact && exact.length > 0) {
      return {
        tr: exact[0].tr || '',
        root: exact[0].root || cleanRoot,
        matches: exact
      };
    }
    /** @type {Array<any>} */
    const partial = [];
    for (const [rKey, entries] of this._byRootMap.entries()) {
      if (rKey.includes(qCompact) || qCompact.includes(rKey)) {
        for (const e of entries) partial.push(e);
      }
    }
    return {
      tr: partial[0]?.tr || '',
      root: partial[0]?.root || cleanRoot,
      matches: partial
    };
  }

  /**
   * @param {any} item
   * @returns {string}
   */
  _pickGloss(item) {
    const lang = store.lang;
    if (lang === 'ur' && item.ur) return item.ur;
    if (lang === 'hi' && item.hi) return item.hi;
    if (lang === 'hinglish' && item.hn) return item.hn;
    return item.en || item.hn || item.ur || item.hi || '';
  }

  /**
   * @param {string} rawQuery
   */
  async performSearch(rawQuery) {
    const mount = document.getElementById('search-results-mount');
    const statusLine = document.getElementById('search-status-line');
    if (!mount) return;

    const query = String(rawQuery || '').trim();
    const qNorm = normalizeQuery(query);

    if (query.length < 2 && qNorm.length < 2) {
      if (statusLine) {
        statusLine.textContent = this._indexData
          ? `${this._indexData.length.toLocaleString()} indexed entries across Units 1–7`
          : 'Loading curriculum search index across Units 1–7...';
      }
      mount.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">Search the Curriculum</div>
          <p class="empty-state-desc">Enter at least 2 characters in Arabic, transliteration, English, Hinglish, Urdu, or Hindi.</p>
        </div>
      `;
      if (!this._indexData) {
        this.ensureIndexLoaded().then((loaded) => {
          const curInput = /** @type {HTMLInputElement | null} */ (document.getElementById('search-input'));
          if (statusLine && loaded.length > 0 && (!curInput || curInput.value.trim().length < 2)) {
            statusLine.textContent = `${loaded.length.toLocaleString()} indexed entries across Units 1–7`;
          }
        });
      }
      return;
    }

    if (!this._indexData) {
      mount.innerHTML = `
        <div class="lesson-skeleton" aria-busy="true">
          <div class="skeleton-block" style="height:74px"></div>
          <div class="skeleton-block" style="height:74px"></div>
          <div class="skeleton-block" style="height:74px"></div>
        </div>
      `;
    }

    const index = await this.ensureIndexLoaded();
    if (this._loadError && index.length === 0) {
      mount.innerHTML = `
        <div class="error-banner">
          <div class="error-banner-title">Search index failed to load</div>
          <p class="error-banner-desc">Check your connection or offline cache (${esc(this._loadError)}) and retry.</p>
          <button type="button" class="btn-primary btn-sm" id="search-retry-btn">Retry Search</button>
        </div>
      `;
      mount.querySelector('#search-retry-btn')?.addEventListener('click', () => {
        this._loadError = '';
        this.performSearch(query);
      });
      return;
    }

    /** @type {Map<string, {s: number, l: number, id?: any, ar: string, tr: string, gloss: string, tag: string, score: number}>} */
    const bestByKey = new Map();
    const qCompact = qNorm.replace(/\s+/g, '');

    for (let i = 0; i < index.length; i++) {
      const item = index[i];
      let bestScore = 0;
      let tag = '';

      let sAr = 0;
      if (item.ar === query) sAr = 100;
      else if (item.ar && item.ar.startsWith(query)) sAr = 75;
      else if (item.ar && item.ar.includes(query)) sAr = 55;
      sAr = Math.max(sAr, scoreMatch(item.arNorm, qNorm));
      if (sAr > bestScore) { bestScore = sAr; tag = 'Arabic'; }

      const sTr = scoreMatch(item.trNorm, qNorm);
      if (sTr > bestScore) { bestScore = sTr; tag = 'Translit'; }

      const sHn = scoreMatch(item.hnNorm, qNorm);
      if (sHn > bestScore) { bestScore = sHn; tag = 'Hinglish'; }

      const sEn = scoreMatch(item.enNorm, qNorm);
      if (sEn > bestScore) { bestScore = sEn; tag = 'English'; }

      const sUr = scoreMatch(item.urNorm, qNorm);
      if (sUr > bestScore) { bestScore = sUr; tag = 'Urdu'; }

      const sHi = scoreMatch(item.hiNorm, qNorm);
      if (sHi > bestScore) { bestScore = sHi; tag = 'Hindi'; }

      const sRoot = scoreMatch(item.rootCompact, qCompact);
      if (sRoot > bestScore) { bestScore = sRoot; tag = 'Root'; }

      if (bestScore > 0) {
        const key = `${item.s}_${item.l}_${item.id ?? item.ar}`;
        const prev = bestByKey.get(key);
        if (!prev || bestScore > prev.score) {
          bestByKey.set(key, {
            s: item.s,
            l: item.l,
            id: item.id,
            ar: item.ar,
            tr: item.tr || '',
            gloss: this._pickGloss(item),
            tag,
            score: bestScore
          });
        }
      }
    }

    // Also match loaded units (in case user has lessons loaded with richer local strings)
    for (const uStr of Object.keys(store.unitsCache)) {
      const u = Number(uStr);
      for (const lesson of store.unitsCache[u]) {
        for (const sec of (lesson.sections || [])) {
          for (const it of ((sec.data && sec.data.items) || [])) {
            const trText = store.getTranslation(it);
            const hiText = it.hinglish || '';
            const hindiText = (it.translations && it.translations.hi) || '';
            const hay = normalizeQuery(`${hiText} ${hindiText} ${trText}`);
            const sc = scoreMatch(hay, qNorm) || (trText.toLowerCase().includes(query.toLowerCase()) ? 30 : 0);
            if (sc > 0) {
              const key = `${u}_${lesson.lesson_id}_${it.id ?? it.arabic}`;
              if (!bestByKey.has(key)) {
                bestByKey.set(key, {
                  s: u,
                  l: lesson.lesson_id,
                  id: it.id,
                  ar: it.arabic,
                  tr: '',
                  gloss: trText || hiText,
                  tag: store.lang.toUpperCase(),
                  score: sc
                });
              }
            }
          }
        }
      }
    }

    const results = Array.from(bestByKey.values()).sort((a, b) =>
      (b.score - a.score) || (a.s - b.s) || (a.l - b.l)
    );

    if (statusLine) {
      statusLine.textContent = results.length > 50
        ? `Showing top 50 of ${results.length.toLocaleString()} matches (across ${index.length.toLocaleString()} entries)`
        : `${results.length} match(es) found across ${index.length.toLocaleString()} entries`;
    }

    if (results.length === 0) {
      mount.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">No matching entries</div>
          <p class="empty-state-desc">No items matched "${esc(query)}". Try a simpler root, transliteration, or English word.</p>
          <button type="button" class="btn-secondary btn-sm" id="search-empty-clear">Clear Search</button>
        </div>
      `;
      mount.querySelector('#search-empty-clear')?.addEventListener('click', () => {
        const input = /** @type {HTMLInputElement | null} */ (document.getElementById('search-input'));
        if (input) {
          input.value = '';
          this.performSearch('');
          input.focus();
        }
      });
      return;
    }

    mount.innerHTML = results.slice(0, 50).map(r => {
      const itemKey = r.id !== undefined && r.id !== null ? `S${r.s}L${r.l}_num_${r.id}` : '';
      return `
        <button type="button" class="search-result-item" data-jump-unit="${r.s}" data-jump-lesson="${r.l}" ${itemKey ? `data-jump-item="${esc(itemKey)}"` : ''}>
          <div style="flex:1; min-width:0;">
            <div class="search-result-meta">
              <span class="search-result-unit tabular-nums">Unit ${r.s} · Lesson ${r.l}</span>
              <span class="search-result-tag">${esc(r.tag)}</span>
            </div>
            <div class="search-result-ar">${esc(r.ar)}</div>
            <div class="search-result-gloss">
              ${r.tr ? `<em>[${esc(r.tr)}]</em> ` : ''}${esc(r.gloss)}
            </div>
          </div>
          <span aria-hidden="true">→</span>
        </button>
      `;
    }).join('');

    mount.querySelectorAll('[data-jump-unit]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const u = Number(btn.getAttribute('data-jump-unit'));
        const l = Number(btn.getAttribute('data-jump-lesson'));
        const itemKey = btn.getAttribute('data-jump-item') || undefined;
        /** @type {HTMLDialogElement | null} */ (document.getElementById('search-dialog'))?.close();
        await this.onJumpToLesson(u, l, itemKey);
      });
    });
  }
}

export const searchCtrl = new SearchController();
