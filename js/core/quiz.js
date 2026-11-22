// @ts-check

/**
 * Muallim ul-Qur'an — Practice Quiz & Morphology Builder Controller (v6.0)
 * Owns #practice-dialog: multilingual curated quizzes (data/quizzes/unitN.json)
 * plus interactive Root & Affix Morphology Builder for Units 5–7.
 */

import { store } from './store.js';
import { audioPlayer } from './audio.js';
import { AudioFX } from '../audio-fx.js';

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

/**
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
 * Extract a Morphology Builder challenge from an item's `arabic_markup` spans.
 * Parses HTML via <template> rather than brittle regex over tags.
 * @param {any} item
 * @returns {{prefix: string, root: string, suffix: string, target: string, baseHint: string, meaning: string, ref: string} | null}
 */
export function extractMorphChallenge(item) {
  const am = item && item.arabic_markup;
  if (!am || typeof am !== 'string' || !am.includes('arabic-root') || !am.includes('nonroot')) {
    return null;
  }

  const segments = am.split(/\s*(?::|←|\s\/\s)\s*/);
  const baseHint = segments.length > 1
    ? segments[0].replace(/<[^>]+>/g, '').trim()
    : '';

  const tpl = document.createElement('template');
  for (let s = segments.length - 1; s >= 0; s--) {
    tpl.innerHTML = segments[s];
    // Group contiguous inline nodes separated by whitespace text nodes
    /** @type {Array<Array<Node>>} */
    const words = [];
    let current = [];
    for (const node of tpl.content.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        if ((node.textContent || '').trim() === '') {
          if (current.length) {
            words.push(current);
            current = [];
          }
        } else {
          current.push(node);
        }
      } else {
        current.push(node);
      }
    }
    if (current.length) words.push(current);

    for (const wordNodes of words) {
      if (wordNodes.some(n => n.nodeType !== Node.ELEMENT_NODE)) continue;
      const els = /** @type {HTMLElement[]} */ (wordNodes);
      const roles = els.map(el => {
        if (el.classList.contains('arabic-root')) return 'root';
        if (el.classList.contains('nonroot')) return 'affix';
        return 'other';
      });
      if (roles.includes('other')) continue;

      const key = roles.join('+');
      let prefix = '';
      let root = '';
      let suffix = '';
      if (key === 'affix+root') {
        prefix = (els[0].textContent || '').trim();
        root = (els[1].textContent || '').trim();
      } else if (key === 'root+affix') {
        root = (els[0].textContent || '').trim();
        suffix = (els[1].textContent || '').trim();
      } else if (key === 'affix+root+affix') {
        prefix = (els[0].textContent || '').trim();
        root = (els[1].textContent || '').trim();
        suffix = (els[2].textContent || '').trim();
      } else {
        continue;
      }

      if (!root || (!prefix && !suffix)) continue;
      return {
        prefix,
        root,
        suffix,
        target: `${prefix}${root}${suffix}`,
        baseHint,
        meaning: store.getTranslation(item),
        ref: item.ref || ''
      };
    }
  }
  return null;
}

export class PracticeController {
  /**
   * @param {{
   *   onNotify: (msg: string) => void,
   *   onJumpToLesson: (unit: number, lesson: number) => Promise<void>
   * }} opts
   */
  constructor(opts) {
    this.onNotify = opts.onNotify;
    this.onJumpToLesson = opts.onJumpToLesson;
    /** @type {'quiz' | 'morph'} */
    this.mode = 'quiz';
    /** @type {Record<number, any[]>} */
    this._quizCache = {};
    this.isLoadingQuiz = false;

    // Quiz state
    this.questions = /** @type {Array<{prompt: string, arabic: string, options: Array<{text: string, isCorrect: boolean, explanation: string}>}>} */ ([]);
    this.qIndex = 0;
    this.qScore = 0;
    this.qAnswered = false;
    this.qSelectedIdx = -1;
    this.qFinished = false;

    // Morphology Builder state
    this.morphDeck = /** @type {Array<{prefix: string, root: string, suffix: string, target: string, baseHint: string, meaning: string, ref: string}>} */ ([]);
    this.morphIndex = 0;
    this.morphScore = 0;
    this.morphPrefixOptions = /** @type {string[]} */ ([]);
    this.morphSuffixOptions = /** @type {string[]} */ ([]);
    this.selectedPrefix = '';
    this.selectedSuffix = '';
    this.morphChecked = false;
    this.morphIsCorrect = false;
    this.morphFinished = false;
  }

  bindTabs() {
    document.getElementById('tab-practice-quiz')?.addEventListener('click', () => {
      this.mode = 'quiz';
      this._syncTabUi();
      this.render();
    });
    document.getElementById('tab-practice-morph')?.addEventListener('click', () => {
      this.mode = 'morph';
      this._syncTabUi();
      this._prepareMorphDeck();
      this.render();
    });
  }

  _syncTabUi() {
    const qTab = document.getElementById('tab-practice-quiz');
    const mTab = document.getElementById('tab-practice-morph');
    qTab?.classList.toggle('active', this.mode === 'quiz');
    qTab?.setAttribute('aria-selected', String(this.mode === 'quiz'));
    mTab?.classList.toggle('active', this.mode === 'morph');
    mTab?.setAttribute('aria-selected', String(this.mode === 'morph'));
  }

  /**
   * Open Practice Studio on Quiz or Morphology tab.
   * @param {'quiz' | 'morph'} [mode]
   */
  async open(mode = 'quiz') {
    const dlg = /** @type {HTMLDialogElement | null} */ (document.getElementById('practice-dialog'));
    if (!dlg) return;

    this.mode = mode;
    this._syncTabUi();
    const tag = document.getElementById('practice-lesson-tag');
    if (tag) tag.textContent = `Unit ${store.currentUnit} · Lesson ${store.currentLesson}`;

    if (!dlg.open) dlg.showModal();

    if (mode === 'morph') {
      this._prepareMorphDeck();
      this.render();
    } else {
      await this._loadAndStartQuiz();
    }
  }

  async _loadAndStartQuiz() {
    const u = store.currentUnit;
    const l = store.currentLesson;
    const lKey = `s${u}l${l}`;

    this.isLoadingQuiz = true;
    this.qFinished = false;
    this.qIndex = 0;
    this.qScore = 0;
    this.qAnswered = false;
    this.qSelectedIdx = -1;
    this.render();

    let questions = [];
    try {
      if (!this._quizCache[u]) {
        const res = await fetch(`./data/quizzes/unit${u}.json`);
        if (res.ok) {
          this._quizCache[u] = await res.json();
        }
      }
      const list = this._quizCache[u];
      if (Array.isArray(list)) {
        const entry = list.find(x => String(x.lessonId || '').toLowerCase() === lKey);
        if (entry && Array.isArray(entry.questions) && entry.questions.length > 0) {
          const lang = store.lang;
          questions = entry.questions.map(q => {
            const prompt = (q.question && (q.question[lang] || q.question.hinglish || q.question.en)) || '';
            const rawOpts = (q.options && (q.options[lang] || q.options.hinglish || q.options.en)) || [];
            const expl = (q.explanation && (q.explanation[lang] || q.explanation.hinglish || q.explanation.en)) || '';
            return {
              prompt,
              arabic: q.arabic || '',
              options: rawOpts.map((text, idx) => ({
                text,
                isCorrect: idx === q.correct,
                explanation: expl
              }))
            };
          });
        }
      }
    } catch (err) {
      console.warn('[Quiz] Curated quiz unavailable, using lesson items fallback:', err);
    }

    if (questions.length === 0) {
      questions = this._buildFallbackQuestions(u, l);
    }

    this.questions = questions.slice(0, 5);
    this.isLoadingQuiz = false;
    this.render();
  }

  /**
   * @param {number} unit
   * @param {number} lessonId
   */
  _buildFallbackQuestions(unit, lessonId) {
    const lesson = store.getLesson(unit, lessonId);
    const items = [];
    if (lesson && Array.isArray(lesson.sections)) {
      for (const sec of lesson.sections) {
        for (const it of ((sec.data && sec.data.items) || [])) {
          const tr = store.getTranslation(it);
          if (it.arabic && tr && !String(it.arabic).includes('----')) {
            items.push({ arabic: it.arabic, gloss: tr });
          }
        }
      }
    }
    const shuffled = shuffle(items);
    const out = [];
    for (let i = 0; i < shuffled.length && out.length < 5; i++) {
      const target = shuffled[i];
      const others = shuffle(items.filter(x => x.gloss !== target.gloss)).slice(0, 3);
      if (others.length < 3) break;
      out.push({
        prompt: 'Select the accurate translation for this Arabic expression:',
        arabic: target.arabic,
        options: shuffle([
          { text: target.gloss, isCorrect: true, explanation: `"${target.arabic}" means "${target.gloss}".` },
          ...others.map(o => ({ text: o.gloss, isCorrect: false, explanation: `"${target.arabic}" means "${target.gloss}".` }))
        ])
      });
    }
    return out;
  }

  _prepareMorphDeck() {
    this.morphFinished = false;
    this.morphIndex = 0;
    this.morphScore = 0;

    if (store.currentUnit < 5) {
      this.morphDeck = [];
      return;
    }

    const lesson = store.getLesson(store.currentUnit, store.currentLesson);
    const unitLessons = store.unitsCache[store.currentUnit] || [];
    const currentChallenges = [];
    const unitChallenges = [];

    if (lesson) {
      for (const sec of (lesson.sections || [])) {
        for (const it of ((sec.data && sec.data.items) || [])) {
          const ch = extractMorphChallenge(it);
          if (ch) currentChallenges.push(ch);
        }
      }
    }

    for (const ul of unitLessons) {
      for (const sec of (ul.sections || [])) {
        for (const it of ((sec.data && sec.data.items) || [])) {
          const ch = extractMorphChallenge(it);
          if (ch) unitChallenges.push(ch);
        }
      }
    }

    const pool = currentChallenges.length >= 3 ? currentChallenges : unitChallenges;
    this.morphDeck = shuffle(pool).slice(0, 6);
    this._setupMorphRound();
  }

  _setupMorphRound() {
    const round = this.morphDeck[this.morphIndex];
    this.selectedPrefix = '';
    this.selectedSuffix = '';
    this.morphChecked = false;
    this.morphIsCorrect = false;
    if (!round) return;

    const unitLessons = store.unitsCache[store.currentUnit] || [];
    const prefixPool = new Set(['يَ', 'تَ', 'أَ', 'نَ', 'لَا ', 'لِـ', 'بِ']);
    const suffixPool = new Set(['ُونَ', 'ِينَ', 'ُوا', 'نَا', 'تُمْ', 'هُمْ', 'كُمْ', 'هَا', 'تْ']);
    for (const ul of unitLessons) {
      for (const sec of (ul.sections || [])) {
        for (const it of ((sec.data && sec.data.items) || [])) {
          const ch = extractMorphChallenge(it);
          if (ch) {
            if (ch.prefix) prefixPool.add(ch.prefix);
            if (ch.suffix) suffixPool.add(ch.suffix);
          }
        }
      }
    }

    const prefDist = shuffle([...prefixPool].filter(p => p !== round.prefix)).slice(0, 3);
    const suffDist = shuffle([...suffixPool].filter(s => s !== round.suffix)).slice(0, 3);

    this.morphPrefixOptions = round.prefix
      ? shuffle([round.prefix, ...prefDist])
      : shuffle([...prefDist.slice(0, 2)]);
    this.morphSuffixOptions = round.suffix
      ? shuffle([round.suffix, ...suffDist])
      : shuffle([...suffDist.slice(0, 2)]);
  }

  render() {
    const body = document.getElementById('practice-dialog-body');
    if (!body) return;

    if (this.mode === 'morph') {
      this._renderMorph(body);
    } else {
      this._renderQuiz(body);
    }
  }

  /**
   * @param {HTMLElement} body
   */
  _renderQuiz(body) {
    if (this.isLoadingQuiz) {
      body.innerHTML = `
        <div class="lesson-skeleton" aria-busy="true">
          <div class="skeleton-block" style="height:24px"></div>
          <div class="skeleton-block" style="height:88px"></div>
          <div class="skeleton-block" style="height:48px"></div>
          <div class="skeleton-block" style="height:48px"></div>
        </div>
      `;
      return;
    }

    if (this.questions.length === 0) {
      body.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">No quiz questions available</div>
          <p class="empty-state-desc">This lesson does not have quiz entries yet. Try the Flashcard Drill or Morphology Builder.</p>
          <button type="button" class="btn-primary" id="quiz-empty-close">Close</button>
        </div>
      `;
      body.querySelector('#quiz-empty-close')?.addEventListener('click', () => {
        /** @type {HTMLDialogElement | null} */ (document.getElementById('practice-dialog'))?.close();
      });
      return;
    }

    if (this.qFinished) {
      const pct = Math.round((this.qScore / this.questions.length) * 100);
      const verdict = pct >= 80 ? 'Excellent Mastery' : pct >= 60 ? 'Good Progress' : 'Keep Reviewing';
      body.innerHTML = `
        <div class="quiz-scorecard" id="quiz-scorecard-view">
          <div class="scorecard-ring tabular-nums">${pct}%</div>
          <h3 class="empty-state-title">${verdict}</h3>
          <p class="empty-state-desc tabular-nums" id="quiz-scorecard-summary">
            You answered <strong>${this.qScore}</strong> of <strong>${this.questions.length}</strong> correctly in Unit ${store.currentUnit} · Lesson ${store.currentLesson}.
          </p>
          <div class="lesson-action-group">
            <button type="button" class="btn-secondary" id="quiz-retake-btn">Retake Quiz</button>
            <button type="button" class="btn-primary" id="quiz-done-btn">Back to Lesson</button>
          </div>
        </div>
      `;
      body.querySelector('#quiz-retake-btn')?.addEventListener('click', () => this._loadAndStartQuiz());
      body.querySelector('#quiz-done-btn')?.addEventListener('click', () => {
        /** @type {HTMLDialogElement | null} */ (document.getElementById('practice-dialog'))?.close();
      });
      return;
    }

    const q = this.questions[this.qIndex];
    const isUrdu = store.lang === 'ur';
    const pct = Math.round(((this.qIndex + 1) / this.questions.length) * 100);

    body.innerHTML = `
      <div class="quiz-progress-row tabular-nums">
        <span>Question ${this.qIndex + 1} of ${this.questions.length}</span>
        <span>Score: ${this.qScore} / ${this.qAnswered ? this.qIndex + 1 : this.qIndex}</span>
      </div>
      <div class="quiz-progress-track">
        <div class="quiz-progress-fill" style="width:${pct}%"></div>
      </div>

      <div class="quiz-prompt" ${isUrdu ? 'dir="rtl" lang="ur"' : ''}>${esc(q.prompt)}</div>
      ${q.arabic ? `<div class="quiz-arabic-panel">${esc(q.arabic)}</div>` : ''}

      <div class="quiz-options-list">
        ${q.options.map((opt, idx) => {
          let cls = 'quiz-option-btn';
          if (this.qAnswered) {
            if (opt.isCorrect) cls += ' correct';
            else if (idx === this.qSelectedIdx) cls += ' wrong';
          }
          return `
            <button type="button" class="${cls}" data-opt-idx="${idx}" ${isUrdu ? 'dir="rtl" lang="ur"' : ''} ${this.qAnswered ? 'disabled' : ''}>
              <span>${esc(opt.text)}</span>
              ${this.qAnswered && opt.isCorrect ? '<span aria-hidden="true">✓</span>' : (this.qAnswered && idx === this.qSelectedIdx ? '<span aria-hidden="true">✗</span>' : '')}
            </button>
          `;
        }).join('')}
      </div>

      ${this.qAnswered ? `
        <div class="quiz-explanation" ${isUrdu ? 'dir="rtl" lang="ur"' : ''}>
          ${esc(q.options[this.qSelectedIdx]?.explanation || '')}
        </div>
        <button type="button" class="btn-primary" style="width:100%" id="quiz-next-btn">
          ${this.qIndex + 1 < this.questions.length ? 'Next Question →' : 'See Scorecard →'}
        </button>
      ` : ''}
    `;

    body.querySelectorAll('[data-opt-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.qAnswered) return;
        const idx = Number(btn.getAttribute('data-opt-idx'));
        this.qSelectedIdx = idx;
        this.qAnswered = true;
        const chosen = q.options[idx];
        if (chosen && chosen.isCorrect) {
          this.qScore++;
          AudioFX.play('correct');
        } else {
          AudioFX.play('wrong');
        }
        this.render();
      });
    });

    body.querySelector('#quiz-next-btn')?.addEventListener('click', () => {
      if (this.qIndex + 1 < this.questions.length) {
        this.qIndex++;
        this.qAnswered = false;
        this.qSelectedIdx = -1;
        this.render();
      } else {
        this.qFinished = true;
        this._persistQuizScore();
        store.recordStudyActivity(1);
        this.render();
      }
    });
  }

  _persistQuizScore() {
    try {
      const key = `muallim_quiz_scores_s${store.currentUnit}l${store.currentLesson}`;
      const prev = JSON.parse(localStorage.getItem(key) || 'null');
      const scores = prev && Array.isArray(prev.scores) ? [...prev.scores, this.qScore] : [this.qScore];
      localStorage.setItem(key, JSON.stringify({
        scores,
        score: this.qScore,
        total: this.questions.length,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.warn('[Quiz] Failed to save score:', err);
    }
  }

  /**
   * @param {HTMLElement} body
   */
  _renderMorph(body) {
    if (store.currentUnit < 5) {
      body.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">Morphology Builder (Units 5–7)</div>
          <p class="empty-state-desc">Assemble nouns, plurals, and verb forms from root and prefix/suffix chips starting in Unit 5.</p>
          <button type="button" class="btn-primary" id="morph-jump-u5">Open Unit 5 · Lesson 6 Builder</button>
        </div>
      `;
      body.querySelector('#morph-jump-u5')?.addEventListener('click', async () => {
        await this.onJumpToLesson(5, 6);
        this.open('morph');
      });
      return;
    }

    if (this.morphDeck.length === 0) {
      body.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">No morphology roots found</div>
          <p class="empty-state-desc">This lesson has no single-word root/affix items. Switch to Practice Quiz or try another Unit 5–7 lesson.</p>
          <button type="button" class="btn-primary" id="morph-switch-quiz">Switch to Practice Quiz</button>
        </div>
      `;
      body.querySelector('#morph-switch-quiz')?.addEventListener('click', () => {
        this.mode = 'quiz';
        this._syncTabUi();
        this._loadAndStartQuiz();
      });
      return;
    }

    if (this.morphFinished) {
      const pct = Math.round((this.morphScore / this.morphDeck.length) * 100);
      body.innerHTML = `
        <div class="quiz-scorecard">
          <div class="scorecard-ring tabular-nums">${pct}%</div>
          <h3 class="empty-state-title">Morphology Complete</h3>
          <p class="empty-state-desc tabular-nums">Assembled <strong>${this.morphScore}</strong> of <strong>${this.morphDeck.length}</strong> forms accurately.</p>
          <div class="lesson-action-group">
            <button type="button" class="btn-secondary" id="morph-retry-btn">Build New Set</button>
            <button type="button" class="btn-primary" id="morph-close-btn">Back to Lesson</button>
          </div>
        </div>
      `;
      body.querySelector('#morph-retry-btn')?.addEventListener('click', () => {
        this._prepareMorphDeck();
        this.render();
      });
      body.querySelector('#morph-close-btn')?.addEventListener('click', () => {
        /** @type {HTMLDialogElement | null} */ (document.getElementById('practice-dialog'))?.close();
      });
      return;
    }

    const round = this.morphDeck[this.morphIndex];
    const assembled = `${this.selectedPrefix}${round.root}${this.selectedSuffix}`;
    const isUrdu = store.lang === 'ur';

    body.innerHTML = `
      <div class="morph-stage">
        <div class="quiz-progress-row tabular-nums">
          <span>Word ${this.morphIndex + 1} of ${this.morphDeck.length}</span>
          <span>Score: ${this.morphScore}</span>
        </div>

        <div class="morph-prompt-box">
          ${round.baseHint ? `<div class="morph-base-hint">Asal: ${esc(round.baseHint)}</div>` : ''}
          <div class="morph-meaning" ${isUrdu ? 'dir="rtl" lang="ur"' : ''}>${esc(round.meaning)}</div>
        </div>

        <div class="morph-assembly-slots" aria-label="Word assembly slots (RTL: Prefix, Root, Suffix)">
          <div class="morph-slot ${this.selectedPrefix ? 'is-filled' : ''}">
            <span class="morph-slot-label">Prefix</span>
            <span class="morph-slot-ar nonroot">${esc(this.selectedPrefix || '—')}</span>
          </div>
          <div class="morph-slot is-filled">
            <span class="morph-slot-label">Root</span>
            <span class="morph-slot-ar arabic-root">${esc(round.root)}</span>
          </div>
          <div class="morph-slot ${this.selectedSuffix ? 'is-filled' : ''}">
            <span class="morph-slot-label">Suffix</span>
            <span class="morph-slot-ar nonroot">${esc(this.selectedSuffix || '—')}</span>
          </div>
        </div>

        <div class="morph-preview-word" aria-live="polite">
          <span class="nonroot">${esc(this.selectedPrefix)}</span><span class="arabic-root">${esc(round.root)}</span><span class="nonroot">${esc(this.selectedSuffix)}</span>
        </div>

        <div class="morph-chip-tray">
          ${round.prefix || this.morphPrefixOptions.length ? `
            <div>
              <div class="morph-chip-group-label">Prefix Chips (tap to toggle)</div>
              <div class="morph-chips-row">
                ${this.morphPrefixOptions.map(p => `
                  <button type="button" class="morph-chip ${this.selectedPrefix === p ? 'selected' : ''}" data-pick-prefix="${esc(p)}" ${this.morphChecked ? 'disabled' : ''}>${esc(p)}</button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${round.suffix || this.morphSuffixOptions.length ? `
            <div>
              <div class="morph-chip-group-label">Suffix Chips (tap to toggle)</div>
              <div class="morph-chips-row">
                ${this.morphSuffixOptions.map(s => `
                  <button type="button" class="morph-chip ${this.selectedSuffix === s ? 'selected' : ''}" data-pick-suffix="${esc(s)}" ${this.morphChecked ? 'disabled' : ''}>${esc(s)}</button>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        ${this.morphChecked ? `
          <div class="quiz-explanation">
            ${this.morphIsCorrect
              ? `<strong>✓ Exact match!</strong> Target form: <span class="arabic-text" style="font-size:1.3rem">${esc(round.target)}</span>`
              : `<strong>Target form:</strong> <span class="arabic-text" style="font-size:1.3rem">${esc(round.target)}</span> (${esc(round.prefix ? `${round.prefix} + ` : '')}${esc(round.root)}${esc(round.suffix ? ` + ${round.suffix}` : '')})`}
          </div>
        ` : ''}

        <div class="lesson-action-group" style="justify-content:space-between;">
          <button type="button" class="btn-secondary" id="morph-audio-btn">🔊 Hear</button>
          ${!this.morphChecked
            ? `<button type="button" class="btn-primary" id="morph-check-btn">Check Word</button>`
            : `<button type="button" class="btn-primary" id="morph-next-btn">${this.morphIndex + 1 < this.morphDeck.length ? 'Next Word →' : 'See Scorecard →'}</button>`}
        </div>
      </div>
    `;

    body.querySelectorAll('[data-pick-prefix]').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-pick-prefix') || '';
        this.selectedPrefix = this.selectedPrefix === val ? '' : val;
        AudioFX.play('pop');
        this.render();
      });
    });

    body.querySelectorAll('[data-pick-suffix]').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-pick-suffix') || '';
        this.selectedSuffix = this.selectedSuffix === val ? '' : val;
        AudioFX.play('pop');
        this.render();
      });
    });

    body.querySelector('#morph-audio-btn')?.addEventListener('click', (e) => {
      audioPlayer.play({
        arabic: this.morphChecked ? round.target : assembled,
        ref: round.ref,
        key: `morph_${this.morphIndex}`,
        buttonEl: /** @type {HTMLElement} */ (e.currentTarget),
        onNotify: this.onNotify
      });
    });

    body.querySelector('#morph-check-btn')?.addEventListener('click', () => {
      this.morphChecked = true;
      this.morphIsCorrect = assembled === round.target;
      if (this.morphIsCorrect) {
        this.morphScore++;
        AudioFX.play('correct');
      } else {
        AudioFX.play('wrong');
      }
      this.render();
    });

    body.querySelector('#morph-next-btn')?.addEventListener('click', () => {
      if (this.morphIndex + 1 < this.morphDeck.length) {
        this.morphIndex++;
        this._setupMorphRound();
        this.render();
      } else {
        this.morphFinished = true;
        store.recordStudyActivity(1);
        this.render();
      }
    });
  }
}
