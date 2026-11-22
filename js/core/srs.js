// @ts-check

/**
 * Muallim ul-Qur'an — Leitner 5-Box SRS Flashcard Drill Engine (v6.0)
 * Owns #drill-dialog UI and Leitner interval scheduling.
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

export class SrsController {
  /**
   * @param {{
   *   onNotify: (msg: string) => void,
   *   onClose?: () => void
   * }} opts
   */
  constructor(opts) {
    this.onNotify = opts.onNotify;
    this.activeTab = /** @type {'srs' | 'starred' | 'lessons'} */ ('srs');
    this.view = /** @type {'setup' | 'card' | 'complete'} */ ('setup');
    this.pool = /** @type {Array<{key: string, arabic: string, gloss: string, custom: string, ref?: string, stage: number, lesson: number}>} */ ([]);
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
   * @param {'srs' | 'starred' | 'lessons'} [initialTab]
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
    for (const item of Object.values(store.srs)) {
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
   * Build deck from Smart SRS due items + fresh items from current/loaded lessons.
   */
  async startSrsDeck() {
    await this._ensureUnitsLoaded([store.currentUnit]);
    const now = Date.now();
    /** @type {Array<{card: object, nextReview: number}>} */
    const due = [];
    /** @type {Array<object>} */
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
            const srsKey = `S${u}L${lid}_${it.id ?? `${sIdx}_${iIdx}`}`;
            const itemKey = store.getItemKey(u, lid, it, sIdx, iIdx);
            const card = {
              key: srsKey,
              arabic: it.arabic,
              gloss,
              custom: store.getCustomNote(itemKey),
              ref: it.ref || '',
              stage: u,
              lesson: lid
            };
            const entry = store.srs[srsKey];
            if (entry) {
              if ((entry.nextReview || 0) <= now) {
                due.push({ card, nextReview: entry.nextReview || 0 });
              }
            } else {
              // Prioritize current lesson items first for fresh cards
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

  startStarredDeck() {
    if (store.favs.length === 0) {
      this.onNotify('Star items in a lesson first to drill them here.');
      return;
    }
    this.pool = shuffle(store.favs.map(f => ({
      key: f.key,
      arabic: f.arabic,
      gloss: f.hinglish || '',
      custom: store.getCustomNote(f.key),
      ref: f.ref || '',
      stage: f.stage || 1,
      lesson: f.lesson || 1
    })));
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
        const lKey = `S${u}L${lesson.lesson_id}`;
        if (!this.selectedLessons.has(lKey)) continue;
        for (let sIdx = 0; sIdx < (lesson.sections || []).length; sIdx++) {
          const sec = lesson.sections[sIdx];
          const items = (sec.data && sec.data.items) || [];
          for (let iIdx = 0; iIdx < items.length; iIdx++) {
            const it = items[iIdx];
            const gloss = store.getTranslation(it);
            if (!it.arabic || !gloss || String(it.arabic).includes('----')) continue;
            const itemKey = store.getItemKey(u, lesson.lesson_id, it, sIdx, iIdx);
            deck.push({
              key: `${lKey}_${it.id ?? `${sIdx}_${iIdx}`}`,
              arabic: it.arabic,
              gloss,
              custom: store.getCustomNote(itemKey),
              ref: it.ref || '',
              stage: u,
              lesson: lesson.lesson_id
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
    const intervals = ['1d', '3d', '7d', '14d', '30d'];
    const boxCells = stats.boxes.map((count, i) => `
      <div class="srs-box-cell">
        <div class="srs-box-num tabular-nums">${count}</div>
        <div class="srs-box-lbl">Box ${i + 1} (${intervals[i]})</div>
      </div>
    `).join('');

    let panelHtml = '';
    if (this.activeTab === 'srs') {
      panelHtml = `
        <div class="srs-boxes-grid">${boxCells}</div>
        <p class="search-status-line tabular-nums">
          ${stats.due > 0
            ? `${stats.due} card(s) due for review · ${stats.total} tracked`
            : `${stats.total} card(s) tracked · Ready to introduce cards from Unit ${store.currentUnit} Lesson ${store.currentLesson}`}
        </p>
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
          <button type="button" class="btn-primary" style="width:100%" id="btn-start-starred">Start Starred Drill</button>
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
        <div style="max-height:240px; overflow-y:auto; margin-bottom:12px;">${accHtml}</div>
        <button type="button" class="btn-primary" style="width:100%" id="btn-start-custom" ${this.selectedLessons.size === 0 ? 'disabled' : ''}>Start Selected Drill</button>
      `;
    }

    body.innerHTML = `
      <div class="segmented-tabs" role="tablist" style="margin-bottom:14px">
        <button type="button" class="seg-tab ${this.activeTab === 'srs' ? 'active' : ''}" data-drill-tab="srs">Smart SRS</button>
        <button type="button" class="seg-tab ${this.activeTab === 'starred' ? 'active' : ''}" data-drill-tab="starred">Starred (${store.favs.length})</button>
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

    body.querySelector('#btn-start-srs')?.addEventListener('click', () => this.startSrsDeck());
    body.querySelector('#btn-start-starred')?.addEventListener('click', () => this.startStarredDeck());
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

    body.innerHTML = `
      <div class="quiz-progress-row tabular-nums">
        <span>Card ${this.index + 1} of ${this.pool.length} · Unit ${card.stage} L${card.lesson}</span>
        <span>Box ${boxNum}</span>
      </div>
      <div class="quiz-progress-track">
        <div class="quiz-progress-fill" style="width:${Math.round(((this.index + 1) / this.pool.length) * 100)}%"></div>
      </div>

      <div class="drill-card-face" id="drill-card-surface" role="button" tabindex="0" aria-label="Tap or press Space to reveal translation">
        <div class="drill-arabic">${esc(card.arabic)}</div>
        ${this.revealed ? `
          <div class="drill-gloss" ${isUrdu ? 'dir="rtl" lang="ur"' : ''}>${esc(card.gloss)}</div>
          ${card.custom ? `<div class="custom-note-line"><span class="custom-badge">note</span> ${esc(card.custom)}</div>` : ''}
        ` : `<div class="search-status-line" style="margin:0">Tap card or press Space to reveal</div>`}
      </div>

      ${this.revealed ? `
        <div class="drill-rating-grid">
          <button type="button" class="srs-rate-btn" data-rate="again">Again<span>10m · Box 1</span></button>
          <button type="button" class="srs-rate-btn" data-rate="hard">Hard<span>1d · Same</span></button>
          <button type="button" class="srs-rate-btn" data-rate="good">Good<span>+1 Box</span></button>
          <button type="button" class="srs-rate-btn" data-rate="easy">Easy<span>+2 Boxes</span></button>
        </div>
      ` : ''}

      <div class="lesson-action-group" style="justify-content:space-between;">
        <button type="button" class="btn-ghost btn-sm" id="drill-end-btn">← Decks</button>
        <div class="lesson-action-group">
          <button type="button" class="btn-secondary" id="drill-audio-btn">${card.ref ? `🔊 ${esc(card.ref)}` : '🔊 Hear'}</button>
          ${!this.revealed
            ? `<button type="button" class="btn-primary" id="drill-reveal-btn">Reveal</button>`
            : `<button type="button" class="btn-secondary" id="drill-next-btn">Skip →</button>`}
        </div>
      </div>
    `;

    const cardSurface = body.querySelector('#drill-card-surface');
    cardSurface?.addEventListener('click', () => this.toggleReveal());
    cardSurface?.addEventListener('keydown', (e) => {
      if (/** @type {KeyboardEvent} */ (e).key === 'Enter') {
        e.preventDefault();
        this.toggleReveal();
      }
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
    body.querySelector('#drill-audio-btn')?.addEventListener('click', (e) => {
      audioPlayer.play({
        arabic: card.arabic,
        ref: card.ref,
        key: `drill_${card.key}`,
        buttonEl: /** @type {HTMLElement} */ (e.currentTarget),
        onNotify: this.onNotify
      });
    });
    body.querySelectorAll('[data-rate]').forEach(btn => {
      btn.addEventListener('click', () => {
        const rating = /** @type {'again' | 'hard' | 'good' | 'easy'} */ (btn.getAttribute('data-rate'));
        this.rateCard(card.key, rating);
      });
    });
  }
}
