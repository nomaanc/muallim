// @ts-check

/**
 * Muallim ul-Qur'an — Leitner 5-Box SRS Flashcard Drill Engine (v7.0)
 * Owns #drill-dialog UI, Mistakes drill, Prompt Direction selector, and Leitner scheduling.
 */

import { store } from './store.js';
import { audioPlayer } from './audio.js';
import { AudioFX } from '../audio-fx.js';

const SRS_INTERVALS_MS = [
  0,
  3 * 86400000,
  7 * 86400000,
  14 * 86400000,
  30 * 86400000
];

const ICON_PLAY = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;
const ICON_SPEAK = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;

/**
 * Fisher-Yates shuffle returning a new array.
 * @template T
 * @param {Array<T>} arr
 * @returns {Array<T>}
 */
function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Escape HTML special characters safely.
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

/**
 * Extract numeric/suffix idPart from a canonical or legacy item key.
 * @param {string} key
 * @returns {string}
 */
function extractIdFromKey(key) {
  const m = String(key || '').match(/^S\d+L\d+_(?:num_)?(.+)$/i);
  return m ? m[1] : '';
}

export class SrsController {
  /**
   * @param {{
   *   onNotify: (msg: string) => void,
   *   onClose?: () => void,
   *   searchCtrl?: any
   * }} opts
   */
  constructor(opts) {
    this.onNotify = opts.onNotify;
    this.searchCtrl = opts.searchCtrl || null;
    /** @type {'srs' | 'starred' | 'mistakes' | 'lessons'} */
    this.activeTab = 'srs';
    /** @type {'setup' | 'card' | 'complete'} */
    this.view = 'setup';
    /** @type {'ar-to-mean' | 'mean-to-ar' | 'audio-to-mean'} */
    this.promptDir = 'ar-to-mean';
    /** @type {boolean} */
    this.clearWeakOnPass = true;
    /** @type {Array<{key: string, arabic: string, gloss: string, custom: string, ref?: string, stage: number, lesson: number, isWeak?: boolean}>} */
    this.pool = [];
    this.index = 0;
    this.revealed = false;
    this.reviewedCount = 0;
    /** @type {Set<string>} */
    this.selectedLessons = new Set();
    /** @type {Set<number>} */
    this.openUnits = new Set([1]);
    this.isLoadingUnits = false;
  }

  /**
   * Open the drill dialog and reset to setup view.
   * @param {'srs' | 'starred' | 'mistakes' | 'lessons'} [initialTab]
   */
  open(initialTab = 'srs') {
    const dlg = /** @type {HTMLDialogElement | null} */ (document.getElementById('drill-dialog'));
    if (!dlg) return;
    this.activeTab = initialTab;
    this.view = 'setup';
    this.openUnits = new Set([store.currentUnit]);
    this.render();
    if (!dlg.open) dlg.showModal();
  }

  /**
   * Flip the active flashcard if drill dialog is open on card view.
   * @returns {boolean} true if handled
   */
  handleSpaceFlip() {
    const dlg = /** @type {HTMLDialogElement | null} */ (document.getElementById('drill-dialog'));
    if (!dlg || !dlg.open || this.view !== 'card' || this.pool.length === 0) return false;
    this.toggleReveal();
    return true;
  }

  /**
   * @returns {{boxes: number[], due: number, total: number}}
   */
  computeStats() {
    const now = Date.now();
    const boxes = [0, 0, 0, 0, 0];
    let due = 0;
    let total = 0;
    for (const item of Object.values(store.srs || {})) {
      if (!item || typeof item !== 'object') continue;
      total++;
      const b = Math.min(5, Math.max(1, Number(item.box) || 1));
      boxes[b - 1]++;
      if ((Number(item.nextReview) || 0) <= now) due++;
    }
    return { boxes, due, total };
  }

  /**
   * Update Leitner box for a card key.
   * @param {string} key
   * @param {'again' | 'hard' | 'good' | 'easy'} rating
   */
  rateCard(key, rating) {
    const now = Date.now();
    const prev = store.srs[key] || { box: 1, reps: 0, lapses: 0, lastReview: 0, nextReview: now };
    let box = prev.box || 1;
    let lapses = prev.lapses || 0;
    let nextReview = now;

    if (rating === 'again') {
      box = 1;
      lapses += 1;
      nextReview = now + 10 * 60 * 1000;
    } else if (rating === 'hard') {
      nextReview = now + 86400000;
    } else if (rating === 'good') {
      box = Math.min(5, box + 1);
      nextReview = now + (SRS_INTERVALS_MS[box - 1] || 86400000);
    } else if (rating === 'easy') {
      box = Math.min(5, box + 2);
      nextReview = now + (SRS_INTERVALS_MS[box - 1] || 3 * 86400000);
    }

    const updated = {
      ...store.srs,
      [key]: {
        box,
        reps: (prev.reps || 0) + 1,
        lapses,
        lastReview: now,
        nextReview
      }
    };
    store.saveSrsState(updated);
    store.recordStudyActivity(1);

    if (
      this.clearWeakOnPass &&
      (rating === 'good' || rating === 'easy') &&
      store.weakWords &&
      store.weakWords[key] &&
      typeof store.clearWeakWord === 'function'
    ) {
      store.clearWeakWord(key);
    }

    AudioFX.play(rating === 'again' ? 'whoosh' : 'pop');
    this.reviewedCount++;

    if (this.index + 1 < this.pool.length) {
      this.index += 1;
      this.revealed = false;
      this.render();
    } else {
      this.view = 'complete';
      this.render();
    }
  }

  toggleReveal() {
    this.revealed = !this.revealed;
    this.render();
  }

  async _ensureUnitsLoaded(unitNums) {
    const missing = unitNums.filter(u => !store.unitsCache[u]);
    if (missing.length === 0) return;
    this.isLoadingUnits = true;
    this.render();
    try {
      await Promise.all(missing.map(u => store.loadUnit(u)));
    } finally {
      this.isLoadingUnits = false;
    }
  }

  /**
   * Resolve active-language gloss and canonical key from loaded lessons/units or search index.
   * @param {number} stage
   * @param {number} lessonId
   * @param {string} rawKey
   * @param {string} arabic
   * @param {string} fallbackGloss
   * @returns {{key: string, gloss: string, ref: string}}
   */
  _resolveDynamicItem(stage, lessonId, rawKey, arabic, fallbackGloss) {
    const idPart = extractIdFromKey(rawKey);
    const lesson = store.getLesson(stage, lessonId) || store.lessonsCache?.[`s${stage}l${lessonId}`] || null;
    if (lesson && Array.isArray(lesson.sections)) {
      for (let sIdx = 0; sIdx < lesson.sections.length; sIdx++) {
        const sec = lesson.sections[sIdx];
        const items = (sec.data && sec.data.items) || [];
        for (let iIdx = 0; iIdx < items.length; iIdx++) {
          const it = items[iIdx];
          const itemKey = store.getItemKey(stage, lessonId, it, sIdx, iIdx);
          const legacyKey = `S${stage}L${lessonId}_${it.id ?? `${sIdx}_${iIdx}`}`;
          if (
            itemKey === rawKey ||
            legacyKey === rawKey ||
            (idPart && String(it.id ?? '') === idPart) ||
            (arabic && it.arabic === arabic)
          ) {
            return {
              key: itemKey,
              gloss: store.getTranslation(it) || fallbackGloss,
              ref: it.ref || ''
            };
          }
        }
      }
    }

    if (this.searchCtrl && typeof this.searchCtrl.getItemMeta === 'function') {
      const meta = this.searchCtrl.getItemMeta(stage, lessonId, idPart || rawKey);
      if (meta) {
        const langMap = {
          hinglish: meta.hn || fallbackGloss,
          en: meta.en || meta.hn || fallbackGloss,
          ur: meta.ur || meta.hn || fallbackGloss,
          hi: meta.hi || meta.hn || fallbackGloss
        };
        const resolved = langMap[store.lang] || fallbackGloss;
        if (resolved) {
          return { key: rawKey, gloss: resolved, ref: '' };
        }
      }
    }

    return { key: rawKey, gloss: fallbackGloss, ref: '' };
  }

  /**
   * Build deck from Smart SRS due items + fresh items from current/loaded lessons.
   */
  async startSrsDeck() {
    await this._ensureUnitsLoaded([store.currentUnit]);
    const now = Date.now();
    /** @type {Array<{card: any, nextReview: number}>} */
    const due = [];
    /** @type {Array<any>} */
    const fresh = [];

    const unitOrder = [store.currentUnit, ...[1, 2, 3, 4, 5, 6, 7].filter(u => u !== store.currentUnit)];
    for (const u of unitOrder) {
      const lessons = store.unitsCache[u] || [];
      for (const lesson of lessons) {
        const lid = Number(lesson.lesson_id);
        for (let sIdx = 0; sIdx < (lesson.sections || []).length; sIdx++) {
          const sec = lesson.sections[sIdx];
          const items = (sec.data && sec.data.items) || [];
          for (let iIdx = 0; iIdx < items.length; iIdx++) {
            const it = items[iIdx];
            const gloss = store.getTranslation(it);
            if (!it.arabic || !gloss || String(it.arabic).includes('----')) continue;
            const itemKey = store.getItemKey(u, lid, it, sIdx, iIdx);
            const legacyKey = `S${u}L${lid}_${it.id ?? `${sIdx}_${iIdx}`}`;
            const card = {
              key: itemKey,
              arabic: it.arabic,
              gloss,
              custom: store.getCustomNote(itemKey, legacyKey),
              ref: it.ref || '',
              stage: u,
              lesson: lid,
              isWeak: Boolean(store.weakWords && (store.weakWords[itemKey] || store.weakWords[legacyKey]))
            };
            const entry = store.srs[itemKey] || store.srs[legacyKey];
            if (entry) {
              if ((entry.nextReview || 0) <= now) {
                due.push({ card, nextReview: entry.nextReview || 0 });
              }
            } else {
              if (u === store.currentUnit && lid === store.currentLesson) {
                fresh.unshift(card);
              } else {
                fresh.push(card);
              }
            }
          }
        }
      }
    }

    due.sort((a, b) => a.nextReview - b.nextReview);
    const deck = due.map(d => d.card);
    if (deck.length < 20 && fresh.length > 0) {
      const currentFresh = fresh.filter(c => c.stage === store.currentUnit && c.lesson === store.currentLesson);
      const otherFresh = shuffle(fresh.filter(c => !(c.stage === store.currentUnit && c.lesson === store.currentLesson)));
      const needed = 20 - deck.length;
      deck.push(...shuffle(currentFresh).concat(otherFresh).slice(0, needed));
    }

    if (deck.length === 0) {
      this.onNotify('All tracked cards are up to date.');
      return;
    }

    this.pool = deck.slice(0, 25);
    this.index = 0;
    this.reviewedCount = 0;
    this.revealed = false;
    this.view = 'card';
    this.render();
  }

  /**
   * Build deck from starred items, resolving active-language translations dynamically.
   */
  async startStarredDeck() {
    if (store.favs.length === 0) {
      this.onNotify('Star items in a lesson first to drill them here.');
      return;
    }

    // Ensure search index or needed lesson chunks are loaded when non-Hinglish is active
    const neededPairs = new Map();
    for (const f of store.favs) {
      const u = Number(f.stage) || 1;
      const l = Number(f.lesson) || 1;
      const hasLesson = Boolean(store.getLesson(u, l) || store.lessonsCache?.[`s${u}l${l}`]);
      if (!hasLesson) {
        neededPairs.set(`s${u}l${l}`, [u, l]);
      }
    }

    if (neededPairs.size > 0) {
      this.isLoadingUnits = true;
      this.render();
      try {
        if (this.searchCtrl && typeof this.searchCtrl.ensureIndexLoaded === 'function') {
          await this.searchCtrl.ensureIndexLoaded();
        }
        if (typeof store.loadLessonChunk === 'function') {
          await Promise.all(
            [...neededPairs.values()].map(([u, l]) => store.loadLessonChunk(u, l).catch(() => null))
          );
        }
      } finally {
        this.isLoadingUnits = false;
      }
    }

    this.pool = shuffle(store.favs.map(f => {
      const stage = Number(f.stage) || 1;
      const lesson = Number(f.lesson) || 1;
      const resolved = this._resolveDynamicItem(stage, lesson, f.key, f.arabic, f.hinglish || '');
      return {
        key: resolved.key,
        arabic: f.arabic,
        gloss: resolved.gloss,
        custom: store.getCustomNote(resolved.key, f.key),
        ref: f.ref || resolved.ref || '',
        stage,
        lesson,
        isWeak: Boolean(store.weakWords && (store.weakWords[resolved.key] || store.weakWords[f.key]))
      };
    }));
    this.index = 0;
    this.reviewedCount = 0;
    this.revealed = false;
    this.view = 'card';
    this.render();
  }

  /**
   * Build deck from missed quiz, morphology, and model exam items.
   */
  async startMistakesDeck() {
    const entries = Object.values(store.weakWords || {});
    if (entries.length === 0) {
      this.onNotify('No missed items to drill right now.');
      return;
    }

    const neededPairs = new Map();
    for (const w of entries) {
      const u = Number(w.stage) || 1;
      const l = Number(w.lesson) || 1;
      if (!store.getLesson(u, l) && !store.lessonsCache?.[`s${u}l${l}`]) {
        neededPairs.set(`s${u}l${l}`, [u, l]);
      }
    }
    if (neededPairs.size > 0 && typeof store.loadLessonChunk === 'function') {
      this.isLoadingUnits = true;
      this.render();
      try {
        await Promise.all(
          [...neededPairs.values()].map(([u, l]) => store.loadLessonChunk(u, l).catch(() => null))
        );
      } finally {
        this.isLoadingUnits = false;
      }
    }

    const sorted = [...entries].sort((a, b) => (Number(b.lastMissed) || 0) - (Number(a.lastMissed) || 0));
    this.pool = sorted.slice(0, 30).map(w => {
      const stage = Number(w.stage) || 1;
      const lesson = Number(w.lesson) || 1;
      const resolved = this._resolveDynamicItem(stage, lesson, w.key, w.arabic, w.gloss || '');
      return {
        key: resolved.key || w.key,
        arabic: w.arabic || '',
        gloss: resolved.gloss || w.gloss || 'Review this expression in lesson context',
        custom: store.getCustomNote(resolved.key, w.key),
        ref: w.ref || resolved.ref || '',
        stage,
        lesson,
        isWeak: true
      };
    });
    this.index = 0;
    this.reviewedCount = 0;
    this.revealed = false;
    this.view = 'card';
    this.render();
  }

  async startCustomLessonDeck() {
    if (this.selectedLessons.size === 0) {
      this.onNotify('Select at least one lesson to drill.');
      return;
    }
    const unitSet = new Set();
    for (const k of this.selectedLessons) {
      const m = k.match(/^S(\d+)L/);
      if (m) unitSet.add(Number(m[1]));
    }
    await this._ensureUnitsLoaded([...unitSet]);

    const deck = [];
    for (const u of unitSet) {
      for (const lesson of (store.unitsCache[u] || [])) {
        const lid = Number(lesson.lesson_id);
        const lKey = `S${u}L${lid}`;
        if (!this.selectedLessons.has(lKey)) continue;
        for (let sIdx = 0; sIdx < (lesson.sections || []).length; sIdx++) {
          const sec = lesson.sections[sIdx];
          const items = (sec.data && sec.data.items) || [];
          for (let iIdx = 0; iIdx < items.length; iIdx++) {
            const it = items[iIdx];
            const gloss = store.getTranslation(it);
            if (!it.arabic || !gloss || String(it.arabic).includes('----')) continue;
            const itemKey = store.getItemKey(u, lid, it, sIdx, iIdx);
            const legacyKey = `${lKey}_${it.id ?? `${sIdx}_${iIdx}`}`;
            deck.push({
              key: itemKey,
              arabic: it.arabic,
              gloss,
              custom: store.getCustomNote(itemKey, legacyKey),
              ref: it.ref || '',
              stage: u,
              lesson: lid,
              isWeak: Boolean(store.weakWords && (store.weakWords[itemKey] || store.weakWords[legacyKey]))
            });
          }
        }
      }
    }

    if (deck.length === 0) {
      this.onNotify('No drillable vocabulary items found in selected lessons.');
      return;
    }
    this.pool = shuffle(deck).slice(0, 30);
    this.index = 0;
    this.reviewedCount = 0;
    this.revealed = false;
    this.view = 'card';
    this.render();
  }

  render() {
    const body = document.getElementById('drill-dialog-body');
    if (!body) return;

    if (this.isLoadingUnits) {
      body.innerHTML = `
        <div class="lesson-skeleton" aria-busy="true">
          <div class="skeleton-block" style="height:44px"></div>
          <div class="skeleton-block" style="height:180px"></div>
          <div class="skeleton-block" style="height:44px"></div>
        </div>
      `;
      return;
    }

    if (this.view === 'card') {
      this._renderCardView(body);
      return;
    }

    if (this.view === 'complete') {
      body.innerHTML = `
        <div class="quiz-scorecard">
          <div class="scorecard-ring tabular-nums">${this.reviewedCount}</div>
          <h3 class="empty-state-title">Session Complete</h3>
          <p class="empty-state-desc">Reviewed <strong class="tabular-nums">${this.reviewedCount}</strong> flashcard(s). Your Leitner schedule and daily streak are updated.</p>
          <div class="lesson-action-group">
            <button type="button" class="btn-secondary" id="drill-back-setup">Back to Decks</button>
            <button type="button" class="btn-primary" id="drill-close-done">Done</button>
          </div>
        </div>
      `;
      body.querySelector('#drill-back-setup')?.addEventListener('click', () => {
        this.view = 'setup';
        this.render();
      });
      body.querySelector('#drill-close-done')?.addEventListener('click', () => {
        /** @type {HTMLDialogElement | null} */ (document.getElementById('drill-dialog'))?.close();
      });
      return;
    }

    this._renderSetupView(body);
  }

  /**
   * @param {HTMLElement} body
   */
  _renderSetupView(body) {
    const stats = this.computeStats();
    const weakCount = Object.keys(store.weakWords || {}).length;
    const intervals = ['1d', '3d', '7d', '14d', '30d'];
    const boxCells = stats.boxes.map((count, i) => `
      <div class="srs-box-cell">
        <div class="srs-box-num tabular-nums">${count}</div>
        <div class="srs-box-lbl">Box ${i + 1} (${intervals[i]})</div>
      </div>
    `).join('');

    const dirControlHtml = `
      <div class="drill-dir-section" style="margin-bottom:14px">
        <label class="field-label" for="drill-direction-select">Card Prompt Direction</label>
        <select id="drill-direction-select" class="select-input">
          <option value="ar-to-mean" ${this.promptDir === 'ar-to-mean' ? 'selected' : ''}>Arabic → Meaning</option>
          <option value="mean-to-ar" ${this.promptDir === 'mean-to-ar' ? 'selected' : ''}>Meaning → Arabic</option>
          <option value="audio-to-mean" ${this.promptDir === 'audio-to-mean' ? 'selected' : ''}>Audio → Meaning</option>
        </select>
      </div>
    `;

    let panelHtml = '';
    if (this.activeTab === 'srs') {
      panelHtml = `
        <div class="srs-boxes-grid">${boxCells}</div>
        <p class="search-status-line tabular-nums">
          ${stats.due > 0
            ? `${stats.due} card(s) due for review · ${stats.total} tracked`
            : `${stats.total} card(s) tracked · Ready to introduce cards from Unit ${store.currentUnit} Lesson ${store.currentLesson}`}
        </p>
        ${dirControlHtml}
        <button type="button" class="btn-primary" style="width:100%" id="btn-start-srs">Start Smart SRS Review</button>
      `;
    } else if (this.activeTab === 'starred') {
      if (store.favs.length === 0) {
        panelHtml = `
          <div class="empty-state">
            <div class="empty-state-title">No starred items yet</div>
            <p class="empty-state-desc">Tap the star icon on any Arabic word or ayah while reading to build your personal deck.</p>
            <button type="button" class="btn-primary" id="btn-switch-srs-fallback">Use Smart SRS Instead</button>
          </div>
        `;
      } else {
        panelHtml = `
          <p class="search-status-line tabular-nums">${store.favs.length} starred item(s) ready to review.</p>
          ${dirControlHtml}
          <button type="button" class="btn-primary" style="width:100%" id="btn-start-starred">Start Starred Drill</button>
        `;
      }
    } else if (this.activeTab === 'mistakes') {
      if (weakCount === 0) {
        panelHtml = `
          <div class="empty-state">
            <div class="empty-state-title">No missed items recorded</div>
            <p class="empty-state-desc">Questions missed in Practice Quizzes, Morphology Builder, or Model Exams will appear here for focused drilling.</p>
            <button type="button" class="btn-primary" id="btn-switch-srs-fallback">Use Smart SRS Instead</button>
          </div>
        `;
      } else {
        panelHtml = `
          <p class="search-status-line tabular-nums">${weakCount} missed item(s) waiting for review.</p>
          ${dirControlHtml}
          <label class="drill-checkbox-row" style="display:flex; align-items:center; gap:8px; margin-bottom:12px; font-size:0.86rem; cursor:pointer;">
            <input type="checkbox" id="chk-clear-weak-pass" ${this.clearWeakOnPass ? 'checked' : ''}>
            <span>Mark cleared from Mistakes when answered Good or Easy</span>
          </label>
          <button type="button" class="btn-primary" style="width:100%" id="btn-start-mistakes">Start Mistakes Drill</button>
        `;
      }
    } else {
      let accHtml = '';
      for (let u = 1; u <= 7; u++) {
        const count = store.getUnitLessonCount(u);
        const isOpen = this.openUnits.has(u);
        let selInUnit = 0;
        let pills = '';
        for (let l = 1; l <= count; l++) {
          const lKey = `S${u}L${l}`;
          const isSel = this.selectedLessons.has(lKey);
          if (isSel) selInUnit++;
          pills += `<button type="button" class="lesson-pill ${isSel ? 'selected' : ''}" data-lkey="${lKey}">L${l}</button>`;
        }
        accHtml += `
          <div class="accordion-unit">
            <button type="button" class="accordion-head" data-unit-toggle="${u}" aria-expanded="${isOpen}">
              <span>Unit ${u}</span>
              <span class="tabular-nums">${selInUnit}/${count} ${isOpen ? '▾' : '▸'}</span>
            </button>
            <div class="accordion-body ${isOpen ? 'open' : ''}">${pills}</div>
          </div>
        `;
      }
      panelHtml = `
        <div class="lesson-action-group" style="margin-bottom:10px; justify-content:space-between;">
          <span class="search-status-line tabular-nums" style="margin:0">${this.selectedLessons.size} lesson(s) selected</span>
          <div class="lesson-action-group">
            <button type="button" class="btn-ghost btn-sm" id="btn-drill-clear">Clear</button>
            <button type="button" class="btn-secondary btn-sm" id="btn-drill-current">Current Lesson</button>
          </div>
        </div>
        <div style="max-height:220px; overflow-y:auto; margin-bottom:12px;">${accHtml}</div>
        ${dirControlHtml}
        <button type="button" class="btn-primary" style="width:100%" id="btn-start-custom" ${this.selectedLessons.size === 0 ? 'disabled' : ''}>Start Selected Drill</button>
      `;
    }

    body.innerHTML = `
      <div class="segmented-tabs" role="tablist" style="margin-bottom:14px">
        <button type="button" class="seg-tab ${this.activeTab === 'srs' ? 'active' : ''}" data-drill-tab="srs">Smart SRS</button>
        <button type="button" class="seg-tab ${this.activeTab === 'starred' ? 'active' : ''}" data-drill-tab="starred">Starred (${store.favs.length})</button>
        <button type="button" class="seg-tab ${this.activeTab === 'mistakes' ? 'active' : ''}" data-drill-tab="mistakes">Mistakes (${weakCount})</button>
        <button type="button" class="seg-tab ${this.activeTab === 'lessons' ? 'active' : ''}" data-drill-tab="lessons">By Lesson</button>
      </div>
      ${panelHtml}
    `;

    body.querySelectorAll('[data-drill-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeTab = /** @type {any} */ (btn.getAttribute('data-drill-tab'));
        this.render();
      });
    });

    body.querySelector('#drill-direction-select')?.addEventListener('change', (e) => {
      this.promptDir = /** @type {any} */ (/** @type {HTMLSelectElement} */ (e.currentTarget).value);
    });

    body.querySelector('#chk-clear-weak-pass')?.addEventListener('change', (e) => {
      this.clearWeakOnPass = /** @type {HTMLInputElement} */ (e.currentTarget).checked;
    });

    body.querySelector('#btn-start-srs')?.addEventListener('click', () => this.startSrsDeck());
    body.querySelector('#btn-start-starred')?.addEventListener('click', () => this.startStarredDeck());
    body.querySelector('#btn-start-mistakes')?.addEventListener('click', () => this.startMistakesDeck());
    body.querySelector('#btn-switch-srs-fallback')?.addEventListener('click', () => {
      this.activeTab = 'srs';
      this.render();
    });
    body.querySelector('#btn-start-custom')?.addEventListener('click', () => this.startCustomLessonDeck());
    body.querySelector('#btn-drill-clear')?.addEventListener('click', () => {
      this.selectedLessons.clear();
      this.render();
    });
    body.querySelector('#btn-drill-current')?.addEventListener('click', () => {
      this.selectedLessons.add(`S${store.currentUnit}L${store.currentLesson}`);
      this.render();
    });
    body.querySelectorAll('[data-unit-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const u = Number(btn.getAttribute('data-unit-toggle'));
        if (this.openUnits.has(u)) this.openUnits.delete(u);
        else this.openUnits.add(u);
        this.render();
      });
    });
    body.querySelectorAll('[data-lkey]').forEach(btn => {
      btn.addEventListener('click', () => {
        const k = btn.getAttribute('data-lkey');
        if (!k) return;
        if (this.selectedLessons.has(k)) this.selectedLessons.delete(k);
        else this.selectedLessons.add(k);
        this.render();
      });
    });
  }

  /**
   * @param {HTMLElement} body
   */
  _renderCardView(body) {
    const card = this.pool[this.index];
    if (!card) return;
    const srsEntry = store.srs[card.key];
    const boxNum = srsEntry ? (srsEntry.box || 1) : 1;
    const isUrdu = store.lang === 'ur';
    const isWeakCard = Boolean(store.weakWords && store.weakWords[card.key]);
    const dirLabel = this.promptDir === 'mean-to-ar'
      ? 'Meaning → Arabic'
      : this.promptDir === 'audio-to-mean'
        ? 'Audio → Meaning'
        : 'Arabic → Meaning';

    let cardFaceHtml = '';
    if (this.promptDir === 'mean-to-ar') {
      cardFaceHtml = `
        <div class="drill-gloss" style="margin-bottom:8px;" ${isUrdu ? 'dir="rtl" lang="ur"' : ''}>${esc(card.gloss)}</div>
        ${this.revealed ? `
          <div class="drill-arabic">${esc(card.arabic)}</div>
          ${card.custom ? `<div class="custom-note-line"><span class="custom-badge">note</span> ${esc(card.custom)}</div>` : ''}
        ` : `<div class="search-status-line" style="margin:0">Tap card or press Space to reveal Arabic</div>`}
      `;
    } else if (this.promptDir === 'audio-to-mean') {
      cardFaceHtml = this.revealed ? `
        <div class="drill-arabic">${esc(card.arabic)}</div>
        <div class="drill-gloss" ${isUrdu ? 'dir="rtl" lang="ur"' : ''}>${esc(card.gloss)}</div>
        ${card.custom ? `<div class="custom-note-line"><span class="custom-badge">note</span> ${esc(card.custom)}</div>` : ''}
      ` : `
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px; padding:12px 0;">
          <button type="button" class="btn-secondary" id="drill-audio-prompt-btn">${ICON_SPEAK} <span>Listen to Audio Prompt</span></button>
          <div class="search-status-line" style="margin:0">Listen first, then tap card or press Space to reveal</div>
        </div>
      `;
    } else {
      cardFaceHtml = `
        <div class="drill-arabic">${esc(card.arabic)}</div>
        ${this.revealed ? `
          <div class="drill-gloss" ${isUrdu ? 'dir="rtl" lang="ur"' : ''}>${esc(card.gloss)}</div>
          ${card.custom ? `<div class="custom-note-line"><span class="custom-badge">note</span> ${esc(card.custom)}</div>` : ''}
        ` : `<div class="search-status-line" style="margin:0">Tap card or press Space to reveal</div>`}
      `;
    }

    body.innerHTML = `
      <div class="quiz-progress-row tabular-nums">
        <span>Card ${this.index + 1} of ${this.pool.length} · Unit ${card.stage} L${card.lesson}</span>
        <span>${esc(dirLabel)} · Box ${boxNum}</span>
      </div>
      <div class="quiz-progress-track">
        <div class="quiz-progress-fill" id="drill-progress-fill"></div>
      </div>

      <div class="drill-card-face" id="drill-card-surface" role="button" tabindex="0" aria-label="Tap or press Space to reveal">
        ${cardFaceHtml}
      </div>

      ${this.revealed ? `
        <div class="drill-rating-grid">
          <button type="button" class="srs-rate-btn" data-rate="again">Again<span>10m · Box 1</span></button>
          <button type="button" class="srs-rate-btn" data-rate="hard">Hard<span>1d · Same</span></button>
          <button type="button" class="srs-rate-btn" data-rate="good">Good<span>+1 Box</span></button>
          <button type="button" class="srs-rate-btn" data-rate="easy">Easy<span>+2 Boxes</span></button>
        </div>
        ${isWeakCard && typeof store.clearWeakWord === 'function' ? `
          <div style="display:flex; justify-content:center; margin-bottom:10px;">
            <button type="button" class="btn-ghost btn-sm" id="drill-clear-weak-btn">Mark Cleared from Mistakes</button>
          </div>
        ` : ''}
      ` : ''}

      <div class="lesson-action-group" style="justify-content:space-between;">
        <button type="button" class="btn-ghost btn-sm" id="drill-end-btn">← Decks</button>
        <div class="lesson-action-group">
          ${card.ref ? `<button type="button" class="btn-secondary btn-sm" id="drill-qari-btn" aria-label="Play Qari recitation ${esc(card.ref)}">${ICON_PLAY} <span>${esc(card.ref)}</span></button>` : ''}
          <button type="button" class="btn-secondary btn-sm" id="drill-tts-btn" aria-label="Speak Arabic via browser TTS">${ICON_SPEAK} <span>Speak</span></button>
          ${!this.revealed
            ? `<button type="button" class="btn-primary" id="drill-reveal-btn">Reveal</button>`
            : `<button type="button" class="btn-secondary" id="drill-next-btn">Skip →</button>`}
        </div>
      </div>
    `;

    const ratio = Math.min(1, Math.max(0, (this.index + 1) / Math.max(1, this.pool.length)));
    const progressEl = /** @type {HTMLElement | null} */ (body.querySelector('#drill-progress-fill'));
    if (progressEl) {
      progressEl.style.setProperty('--progress-scale', String(ratio));
    }

    const cardSurface = body.querySelector('#drill-card-surface');
    cardSurface?.addEventListener('click', () => this.toggleReveal());
    cardSurface?.addEventListener('keydown', (e) => {
      if (/** @type {KeyboardEvent} */ (e).key === 'Enter') {
        e.preventDefault();
        this.toggleReveal();
      }
    });

    body.querySelector('#drill-audio-prompt-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      audioPlayer.play({
        arabic: card.arabic,
        ref: card.ref,
        key: `drill_prompt_${card.key}`,
        mode: card.ref ? 'qari' : 'tts',
        buttonEl: /** @type {HTMLElement} */ (e.currentTarget),
        onNotify: this.onNotify
      });
    });

    body.querySelector('#drill-reveal-btn')?.addEventListener('click', () => this.toggleReveal());
    body.querySelector('#drill-next-btn')?.addEventListener('click', () => {
      if (this.index + 1 < this.pool.length) {
        this.index++;
        this.revealed = false;
        this.render();
      } else {
        this.view = 'complete';
        this.render();
      }
    });
    body.querySelector('#drill-end-btn')?.addEventListener('click', () => {
      audioPlayer.stop();
      this.view = 'setup';
      this.render();
    });
    body.querySelector('#drill-qari-btn')?.addEventListener('click', (e) => {
      audioPlayer.play({
        arabic: card.arabic,
        ref: card.ref,
        key: `drill_qari_${card.key}`,
        mode: 'qari',
        buttonEl: /** @type {HTMLElement} */ (e.currentTarget),
        onNotify: this.onNotify
      });
    });
    body.querySelector('#drill-tts-btn')?.addEventListener('click', (e) => {
      audioPlayer.play({
        arabic: card.arabic,
        ref: card.ref,
        key: `drill_tts_${card.key}`,
        mode: 'tts',
        buttonEl: /** @type {HTMLElement} */ (e.currentTarget),
        onNotify: this.onNotify
      });
    });
    body.querySelector('#drill-clear-weak-btn')?.addEventListener('click', () => {
      if (typeof store.clearWeakWord === 'function') {
        store.clearWeakWord(card.key);
        this.onNotify('Cleared from Mistakes deck.');
        this.render();
      }
    });
    body.querySelectorAll('[data-rate]').forEach(btn => {
      btn.addEventListener('click', () => {
        const rating = /** @type {'again' | 'hard' | 'good' | 'easy'} */ (btn.getAttribute('data-rate'));
        this.rateCard(card.key, rating);
      });
    });
  }
}
