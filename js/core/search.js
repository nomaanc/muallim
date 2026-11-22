// @ts-check

/**
 * Muallim ul-Qur'an — Full-Text Search Engine (v6.0)
 * Searches 12,685 search-index entries plus loaded unit translations in 4 languages.
 */

import { store } from './store.js';

/**
 * Normalize Arabic & Latin strings for search matching.
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
    .replace(/[-_.,;:'"`’‘!?()[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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
   * @param {(unit: number, lesson: number) => Promise<void>} onJumpToLesson
   */
  constructor(onJumpToLesson) {
    this.onJumpToLesson = onJumpToLesson;
    /** @type {Array<{s: number, l: number, ar: string, tr: string, en: string, ur: string, root: string}> | null} */
    this._indexData = null;
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
        const data = await res.json();
        this._indexData = Array.isArray(data) ? data : [];
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
   * @param {string} rawQuery
   */
  async performSearch(rawQuery) {
    const mount = document.getElementById('search-results-mount');
    const statusLine = document.getElementById('search-status-line');
    if (!mount) return;

    const query = String(rawQuery || '').trim();
    const qNorm = normalizeQuery(query);

    if (query.length < 2 && qNorm.length < 2) {
      if (statusLine) statusLine.textContent = '12,685 indexed entries across Units 1–7';
      mount.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">Search the Curriculum</div>
          <p class="empty-state-desc">Enter at least 2 characters in Arabic, transliteration, English, Hinglish, Urdu, or Hindi.</p>
        </div>
      `;
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

    /** @type {Array<{s: number, l: number, ar: string, tr: string, gloss: string, tag: string}>} */
    const results = [];
    const seen = new Set();
    const qCompact = qNorm.replace(/\s+/g, '');

    for (let i = 0; i < index.length; i++) {
      const item = index[i];
      const arNorm = normalizeQuery(item.ar);
      const trNorm = normalizeQuery(item.tr);
      const enNorm = normalizeQuery(item.en);
      const urNorm = normalizeQuery(item.ur);
      const rootNorm = normalizeQuery(item.root);

      let tag = '';
      if (item.ar && (item.ar.includes(query) || arNorm.includes(qNorm))) tag = 'Arabic';
      else if (trNorm && trNorm.includes(qNorm)) tag = 'Translit';
      else if (enNorm && enNorm.includes(qNorm)) tag = 'English';
      else if (urNorm && urNorm.includes(qNorm)) tag = 'Urdu';
      else if (rootNorm && rootNorm.replace(/\s+/g, '').includes(qCompact)) tag = 'Root';

      if (tag) {
        const key = `${item.s}_${item.l}_${item.ar}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({
            s: item.s,
            l: item.l,
            ar: item.ar,
            tr: item.tr || '',
            gloss: item.en || item.ur || '',
            tag
          });
        }
      }
      if (results.length >= 120) break;
    }

    // Also match loaded units (Hinglish & Hindi translations)
    for (const uStr of Object.keys(store.unitsCache)) {
      const u = Number(uStr);
      for (const lesson of store.unitsCache[u]) {
        for (const sec of (lesson.sections || [])) {
          for (const it of ((sec.data && sec.data.items) || [])) {
            const trText = store.getTranslation(it);
            const hiText = it.hinglish || '';
            const hindiText = (it.translations && it.translations.hi) || '';
            const hay = normalizeQuery(`${hiText} ${hindiText} ${trText}`);
            if (hay.includes(qNorm) || trText.toLowerCase().includes(query.toLowerCase())) {
              const key = `${u}_${lesson.lesson_id}_${it.arabic}`;
              if (!seen.has(key)) {
                seen.add(key);
                results.push({
                  s: u,
                  l: lesson.lesson_id,
                  ar: it.arabic,
                  tr: '',
                  gloss: trText || hiText,
                  tag: store.lang.toUpperCase()
                });
              }
            }
          }
        }
      }
    }

    if (statusLine) {
      statusLine.textContent = results.length > 50
        ? `Showing top 50 of ${results.length} matches`
        : `${results.length} match(es) found`;
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

    mount.innerHTML = results.slice(0, 50).map(r => `
      <button type="button" class="search-result-item" data-jump-unit="${r.s}" data-jump-lesson="${r.l}">
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
    `).join('');

    mount.querySelectorAll('[data-jump-unit]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const u = Number(btn.getAttribute('data-jump-unit'));
        const l = Number(btn.getAttribute('data-jump-lesson'));
        /** @type {HTMLDialogElement | null} */ (document.getElementById('search-dialog'))?.close();
        await this.onJumpToLesson(u, l);
      });
    });
  }
}
