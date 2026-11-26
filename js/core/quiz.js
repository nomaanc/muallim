// @ts-check

/**
 * Muallim ul-Qur'an — Practice Quiz & Morphology Builder Controller (v7.0)
 * Owns #practice-dialog: multilingual curated quizzes (data/quizzes/unitN.json)
 * plus interactive Root & Affix Morphology Builder for Units 5–7.
 */

import { store } from './store.js';
import { audioPlayer } from './audio.js';
import { AudioFX } from '../audio-fx.js';

const ICON_SPEAK = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;

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
 * Parse a segment HTML string into token descriptors (works in DOM and pure Node).
 * @param {string} segHtml
 * @returns {{
 *   words: Array<Array<{role: 'root' | 'affix' | 'other', text: string}>>,
 *   flatTokens: Array<{role: 'root' | 'affix' | 'other', text: string, spacedBefore: boolean}>
 * }}
 */
function parseSegmentTokens(segHtml) {
  /** @type {Array<Array<{role: 'root' | 'affix' | 'other', text: string}>>} */
  const words = [];
  /** @type {Array<{role: 'root' | 'affix' | 'other', text: string, spacedBefore: boolean}>} */
  const flatTokens = [];

  if (typeof document !== 'undefined' && typeof Node !== 'undefined') {
    const tpl = document.createElement('template');
    tpl.innerHTML = segHtml;

    let current = [];
    let hadSpace = false;
    for (const node of tpl.content.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        const txt = node.textContent || '';
        if (txt.trim() === '') {
          hadSpace = true;
          if (current.length) {
            words.push(current);
            current = [];
          }
        } else {
          const clean = txt.trim();
          const tok = { role: /** @type {'other'} */ ('other'), text: clean };
          current.push(tok);
          flatTokens.push({ ...tok, spacedBefore: hadSpace });
          hadSpace = false;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = /** @type {HTMLElement} */ (node);
        const role = el.classList.contains('arabic-root')
          ? 'root'
          : el.classList.contains('nonroot')
            ? 'affix'
            : 'other';
        const text = (el.textContent || '').trim();
        if (text) {
          const tok = { role: /** @type {'root' | 'affix' | 'other'} */ (role), text };
          current.push(tok);
          flatTokens.push({ ...tok, spacedBefore: hadSpace });
          hadSpace = false;
        }
      }
    }
    if (current.length) words.push(current);
    return { words, flatTokens };
  }

  // Fallback parser for pure Node.js unit tests without DOM
  const re = /<span\s+class=["']([^"']+)["'][^>]*>([\s\S]*?)<\/span>|([^<]+)/gi;
  let current = [];
  let hadSpace = false;
  let match;
  while ((match = re.exec(segHtml)) !== null) {
    if (match[3] !== undefined) {
      const txt = match[3];
      if (txt.trim() === '') {
        hadSpace = true;
        if (current.length) {
          words.push(current);
          current = [];
        }
      } else {
        const tok = { role: /** @type {'other'} */ ('other'), text: txt.trim() };
        current.push(tok);
        flatTokens.push({ ...tok, spacedBefore: hadSpace });
        hadSpace = false;
      }
    } else {
      const cls = match[1] || '';
      const text = (match[2] || '').replace(/<[^>]+>/g, '').trim();
      if (!text) continue;
      const role = cls.includes('arabic-root') ? 'root' : cls.includes('nonroot') ? 'affix' : 'other';
      const tok = { role: /** @type {'root' | 'affix' | 'other'} */ (role), text };
      current.push(tok);
      flatTokens.push({ ...tok, spacedBefore: hadSpace });
      hadSpace = false;
    }
  }
  if (current.length) words.push(current);
  return { words, flatTokens };
}

/**
 * Extract a Morphology Builder challenge from an item's `arabic_markup` spans.
 * Supports intra-word affixes (`affix+root`, `root+affix`, `affix+root+affix`),
 * multi-word particle+root expressions (`أَنْتُمْ مُسْلِمُونَ`, `أُولَٰئِكَ أَصْحَابُ`, `أَشَدُّ بَطْشًا`, `مِنْ شِرْكٍ`),
 * and `nonroot` particle phrases (`أَنْ يَغْفِرَ`, `لَمْ يُؤْمِنْ`).
 * @param {any} item
 * @returns {{prefix: string, root: string, suffix: string, target: string, baseHint: string, meaning: string, ref: string} | null}
 */
export function extractMorphChallenge(item) {
  const am = item && item.arabic_markup;
  if (!am || typeof am !== 'string' || !am.includes('nonroot')) {
    return null;
  }

  const segments = am.split(/\s*(?::|←|\s\/\s)\s*/);
  const baseHint = segments.length > 1
    ? segments[0].replace(/<[^>]+>/g, '').trim()
    : '';
  const meaning = store.getTranslation(item);
  const ref = item.ref || '';

  // Pass 1: Intra-word contiguous affix+root / root+affix / affix+root+affix
  for (let s = segments.length - 1; s >= 0; s--) {
    const { words } = parseSegmentTokens(segments[s]);
    for (const wordNodes of words) {
      if (wordNodes.some(t => t.role === 'other')) continue;
      const key = wordNodes.map(t => t.role).join('+');
      let prefix = '';
      let root = '';
      let suffix = '';
      if (key === 'affix+root') {
        prefix = wordNodes[0].text;
        root = wordNodes[1].text;
      } else if (key === 'root+affix') {
        root = wordNodes[0].text;
        suffix = wordNodes[1].text;
      } else if (key === 'affix+root+affix') {
        prefix = wordNodes[0].text;
        root = wordNodes[1].text;
        suffix = wordNodes[2].text;
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
        meaning,
        ref
      };
    }
  }

  // Pass 2: Multi-word expressions (e.g. nonroot particle/pronoun + arabic-root, or arabic-root + nonroot)
  for (let s = segments.length - 1; s >= 0; s--) {
    const { flatTokens } = parseSegmentTokens(segments[s]);
    if (flatTokens.length < 2) continue;

    // Look for affix + root + affix (e.g. مَا هٰذَا إِلَّا)
    for (let i = 0; i <= flatTokens.length - 3; i++) {
      const a = flatTokens[i];
      const b = flatTokens[i + 1];
      const c = flatTokens[i + 2];
      if (a.role === 'affix' && b.role === 'root' && c.role === 'affix') {
        const prefix = `${a.text} `;
        const root = b.text;
        const suffix = ` ${c.text}`;
        return {
          prefix,
          root,
          suffix,
          target: `${prefix}${root}${suffix}`,
          baseHint,
          meaning,
          ref
        };
      }
    }

    // Look for affix + root (e.g. أَنْتُمْ مُسْلِمُونَ, أُولَٰئِكَ أَصْحَابُ, مِنْ شِرْكٍ, وَمَا مُحَمَّدٌ)
    for (let i = 0; i <= flatTokens.length - 2; i++) {
      const a = flatTokens[i];
      const b = flatTokens[i + 1];
      if (a.role === 'affix' && b.role === 'root') {
        const prefix = `${a.text} `;
        const root = b.text;
        return {
          prefix,
          root,
          suffix: '',
          target: `${prefix}${root}`,
          baseHint,
          meaning,
          ref
        };
      }
    }

    // Look for root + affix (e.g. أَشَدُّ بَطْشًا, أَنْ يُبَدِّلَ)
    for (let i = 0; i <= flatTokens.length - 2; i++) {
      const a = flatTokens[i];
      const b = flatTokens[i + 1];
      if (a.role === 'root' && b.role === 'affix') {
        const root = a.text;
        const suffix = ` ${b.text}`;
        return {
          prefix: '',
          root,
          suffix,
          target: `${root}${suffix}`,
          baseHint,
          meaning,
          ref
        };
      }
    }

    // Pass 3: nonroot particle phrases (e.g. <span class="nonroot">أَنْ</span> <span class="nonroot">يَغْفِرَ</span>)
    for (let i = 0; i <= flatTokens.length - 2; i++) {
      const a = flatTokens[i];
      const b = flatTokens[i + 1];
      if (a.role === 'affix' && b.role === 'affix') {
        const prefix = `${a.text} `;
        const root = b.text;
        return {
          prefix,
          root,
          suffix: '',
          target: `${prefix}${root}`,
          baseHint,
          meaning,
          ref
        };
      }
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
    /** @type {Array<{key: string, prompt: string, arabic: string, options: Array<{text: string, isCorrect: boolean, explanation: string}>}>} */
    this.questions = [];
    this.qIndex = 0;
    this.qScore = 0;
    this.qAnswered = false;
    this.qSelectedIdx = -1;
    this.qFinished = false;

    // Morphology Builder state
    /** @type {Array<{key: string, prefix: string, root: string, suffix: string, target: string, baseHint: string, meaning: string, ref: string}>} */
    this.morphDeck = [];
    this.morphIndex = 0;
    this.morphScore = 0;
    /** @type {string[]} */
    this.morphPrefixOptions = [];
    /** @type {string[]} */
    this.morphSuffixOptions = [];
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
      await this._ensureUnitLoadedForMorph(store.currentUnit);
      this._prepareMorphDeck();
      this.render();
    } else {
      await this._loadAndStartQuiz();
    }
  }

  async _ensureUnitLoadedForMorph(unitNum) {
    if (unitNum >= 5 && !store.unitsCache[unitNum] && typeof store.loadUnit === 'function') {
      try {
        await store.loadUnit(unitNum);
      } catch (err) {
        console.warn('[Morph] Unit pool load skipped:', err);
      }
    }
  }

  /**
   * Resolve a canonical itemKey for a quiz question by matching against the active lesson.
   * @param {number} u
   * @param {number} l
   * @param {string} arabic
   * @param {string | number} fallbackId
   * @returns {string}
   */
  _resolveQuizQuestionKey(u, l, arabic, fallbackId) {
    const lesson = store.getLesson(u, l);
    if (lesson && Array.isArray(lesson.sections) && arabic) {
      for (let sIdx = 0; sIdx < lesson.sections.length; sIdx++) {
        const items = (lesson.sections[sIdx].data && lesson.sections[sIdx].data.items) || [];
        for (let iIdx = 0; iIdx < items.length; iIdx++) {
          const it = items[iIdx];
          if (it.arabic === arabic) {
            return store.getItemKey(u, l, it, sIdx, iIdx);
          }
        }
      }
    }
    return `S${u}L${l}_num_${fallbackId}`;
  }

  /**
   * Record a missed item in weakWords and reset its Leitner SRS entry to Box 1.
   * @param {{key: string, arabic: string, gloss: string, ref?: string}} info
   */
  _recordMiss(info) {
    if (!info || !info.key) return;
    if (typeof store.recordWeakWord === 'function') {
      store.recordWeakWord({
        key: info.key,
        arabic: info.arabic || '',
        gloss: info.gloss || '',
        ref: info.ref || '',
        stage: store.currentUnit,
        lesson: store.currentLesson
      });
    }
    if (typeof store.saveSrsState === 'function') {
      const now = Date.now();
      const prev = (store.srs && store.srs[info.key]) || { box: 1, reps: 0, lapses: 0, lastReview: 0, nextReview: now };
      store.saveSrsState({
        ...(store.srs || {}),
        [info.key]: {
          box: 1,
          reps: (prev.reps || 0) + 1,
          lapses: (prev.lapses || 0) + 1,
          lastReview: now,
          nextReview: now
        }
      });
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
          questions = entry.questions.map((q, qIdx) => {
            const prompt = (q.question && (q.question[lang] || q.question.hinglish || q.question.en)) || '';
            const rawOpts = (q.options && (q.options[lang] || q.options.hinglish || q.options.en)) || [];
            const expl = (q.explanation && (q.explanation[lang] || q.explanation.hinglish || q.explanation.en)) || '';
            const arabic = q.arabic || '';
            return {
              key: this._resolveQuizQuestionKey(u, l, arabic, q.id || `q${qIdx + 1}`),
              prompt,
              arabic,
              options: shuffle(rawOpts.map((text, idx) => ({
                text,
                isCorrect: idx === q.correct,
                explanation: expl
              })))
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
      for (let sIdx = 0; sIdx < lesson.sections.length; sIdx++) {
        const sec = lesson.sections[sIdx];
        const secItems = (sec.data && sec.data.items) || [];
        for (let iIdx = 0; iIdx < secItems.length; iIdx++) {
          const it = secItems[iIdx];
          const tr = store.getTranslation(it);
          if (it.arabic && tr && !String(it.arabic).includes('----')) {
            items.push({
              key: store.getItemKey(unit, lessonId, it, sIdx, iIdx),
              arabic: it.arabic,
              gloss: tr
            });
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
        key: target.key,
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

    const u = store.currentUnit;
    const lid = store.currentLesson;
    const lesson = store.getLesson(u, lid);
    const unitLessons = store.unitsCache[u] || [];
    const currentChallenges = [];
    const unitChallenges = [];
    const seenTargets = new Set();

    if (lesson) {
      const secs = lesson.sections || [];
      for (let sIdx = 0; sIdx < secs.length; sIdx++) {
        const items = (secs[sIdx].data && secs[sIdx].data.items) || [];
        for (let iIdx = 0; iIdx < items.length; iIdx++) {
          const it = items[iIdx];
          const ch = extractMorphChallenge(it);
          if (ch && !seenTargets.has(ch.target)) {
            seenTargets.add(ch.target);
            currentChallenges.push({ ...ch, key: store.getItemKey(u, lid, it, sIdx, iIdx) });
          }
        }
      }
    }

    for (const ul of unitLessons) {
      const ulId = Number(ul.lesson_id);
      const secs = ul.sections || [];
      for (let sIdx = 0; sIdx < secs.length; sIdx++) {
        const items = (secs[sIdx].data && secs[sIdx].data.items) || [];
        for (let iIdx = 0; iIdx < items.length; iIdx++) {
          const it = items[iIdx];
          const ch = extractMorphChallenge(it);
          if (ch) {
            unitChallenges.push({ ...ch, key: store.getItemKey(u, ulId, it, sIdx, iIdx) });
          }
        }
      }
    }

    const pool = currentChallenges.length >= 6
      ? currentChallenges
      : [...currentChallenges, ...unitChallenges.filter(c => !seenTargets.has(c.target))];
    this.morphDeck = shuffle(pool.slice(0, 24)).slice(0, 6);
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
    const isSpacedPrefix = round.prefix.endsWith(' ');
    const isSpacedSuffix = round.suffix.startsWith(' ');

    const prefixPool = new Set(
      isSpacedPrefix
        ? ['أَنْتُمْ ', 'أُولَٰئِكَ ', 'مَا ', 'مِنْ ', 'أَنْ ', 'لَنْ ', 'لَمْ ']
        : ['يَ', 'تَ', 'أَ', 'نَ', 'لَا ', 'لِـ', 'بِ']
    );
    const suffixPool = new Set(
      isSpacedSuffix
        ? [' بَطْشًا', ' قُوَّةً', ' عَذَابًا', ' إِلَّا', ' مُبِينٌ', ' نَذِيرٌ']
        : ['ُونَ', 'ِينَ', 'ُوا', 'نَا', 'تُمْ', 'هُمْ', 'كُمْ', 'هَا', 'تْ']
    );

    for (const ul of unitLessons) {
      for (const sec of (ul.sections || [])) {
        for (const it of ((sec.data && sec.data.items) || [])) {
          const ch = extractMorphChallenge(it);
          if (ch) {
            if (ch.prefix && ch.prefix.endsWith(' ') === isSpacedPrefix) prefixPool.add(ch.prefix);
            if (ch.suffix && ch.suffix.startsWith(' ') === isSpacedSuffix) suffixPool.add(ch.suffix);
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
    const ratio = Math.min(1, Math.max(0, (this.qIndex + 1) / Math.max(1, this.questions.length)));

    body.innerHTML = `
      <div class="quiz-progress-row tabular-nums">
        <span>Question ${this.qIndex + 1} of ${this.questions.length}</span>
        <span>Score: ${this.qScore} / ${this.qAnswered ? this.qIndex + 1 : this.qIndex}</span>
      </div>
      <div class="quiz-progress-track">
        <div class="quiz-progress-fill" id="quiz-progress-fill"></div>
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

    const fillEl = /** @type {HTMLElement | null} */ (body.querySelector('#quiz-progress-fill'));
    if (fillEl) {
      fillEl.style.setProperty('--progress-scale', String(ratio));
    }

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
          const correctOpt = q.options.find(o => o.isCorrect);
          this._recordMiss({
            key: q.key,
            arabic: q.arabic || q.prompt,
            gloss: correctOpt ? correctOpt.text : ''
          });
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
        if (typeof store.recordExamAttempt === 'function') {
          store.recordExamAttempt({
            examId: `quiz_s${store.currentUnit}l${store.currentLesson}`,
            mode: 'quiz',
            score: this.qScore,
            total: this.questions.length,
            pct: Math.round((this.qScore / Math.max(1, this.questions.length)) * 100),
            completedAt: Date.now()
          });
        }
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
          <p class="empty-state-desc">This lesson has no root/affix items. Switch to Practice Quiz or try another Unit 5–7 lesson.</p>
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
    const ratio = Math.min(1, Math.max(0, (this.morphIndex + 1) / Math.max(1, this.morphDeck.length)));

    body.innerHTML = `
      <div class="morph-stage">
        <div class="quiz-progress-row tabular-nums">
          <span>Word ${this.morphIndex + 1} of ${this.morphDeck.length}</span>
          <span>Score: ${this.morphScore}</span>
        </div>
        <div class="quiz-progress-track">
          <div class="quiz-progress-fill" id="morph-progress-fill"></div>
        </div>

        <div class="morph-prompt-box">
          ${round.baseHint ? `<div class="morph-base-hint">Asal: ${esc(round.baseHint)}</div>` : ''}
          <div class="morph-meaning" ${isUrdu ? 'dir="rtl" lang="ur"' : ''}>${esc(round.meaning)}</div>
        </div>

        <div class="morph-assembly-slots" aria-label="Word assembly slots (RTL: Prefix, Root, Suffix)">
          <div class="morph-slot ${this.selectedPrefix ? 'is-filled' : ''}">
            <span class="morph-slot-label">Prefix</span>
            <span class="morph-slot-ar nonroot">${esc(this.selectedPrefix.trim() || '...')}</span>
          </div>
          <div class="morph-slot is-filled">
            <span class="morph-slot-label">Root</span>
            <span class="morph-slot-ar arabic-root">${esc(round.root)}</span>
          </div>
          <div class="morph-slot ${this.selectedSuffix ? 'is-filled' : ''}">
            <span class="morph-slot-label">Suffix</span>
            <span class="morph-slot-ar nonroot">${esc(this.selectedSuffix.trim() || '...')}</span>
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
                  <button type="button" class="morph-chip ${this.selectedPrefix === p ? 'selected' : ''}" data-pick-prefix="${esc(p)}" ${this.morphChecked ? 'disabled' : ''}>${esc(p.trim())}</button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${round.suffix || this.morphSuffixOptions.length ? `
            <div>
              <div class="morph-chip-group-label">Suffix Chips (tap to toggle)</div>
              <div class="morph-chips-row">
                ${this.morphSuffixOptions.map(s => `
                  <button type="button" class="morph-chip ${this.selectedSuffix === s ? 'selected' : ''}" data-pick-suffix="${esc(s)}" ${this.morphChecked ? 'disabled' : ''}>${esc(s.trim())}</button>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        ${this.morphChecked ? `
          <div class="quiz-explanation">
            ${this.morphIsCorrect
              ? `<strong>✓ Exact match!</strong> Target form: <span class="arabic-text" style="font-size:1.3rem">${esc(round.target)}</span>`
              : `<strong>Target form:</strong> <span class="arabic-text" style="font-size:1.3rem">${esc(round.target)}</span> (${esc(round.prefix ? `${round.prefix.trim()} + ` : '')}${esc(round.root)}${esc(round.suffix ? ` + ${round.suffix.trim()}` : '')})`}
          </div>
        ` : ''}

        <div class="lesson-action-group" style="justify-content:space-between;">
          <button type="button" class="btn-secondary btn-sm" id="morph-audio-btn">${ICON_SPEAK} <span>Hear</span></button>
          ${!this.morphChecked
            ? `<button type="button" class="btn-primary" id="morph-check-btn">Check Word</button>`
            : `<button type="button" class="btn-primary" id="morph-next-btn">${this.morphIndex + 1 < this.morphDeck.length ? 'Next Word →' : 'See Scorecard →'}</button>`}
        </div>
      </div>
    `;

    const morphFillEl = /** @type {HTMLElement | null} */ (body.querySelector('#morph-progress-fill'));
    if (morphFillEl) {
      morphFillEl.style.setProperty('--progress-scale', String(ratio));
    }

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
        this._recordMiss({
          key: round.key,
          arabic: round.target,
          gloss: round.meaning,
          ref: round.ref
        });
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
        if (typeof store.recordExamAttempt === 'function') {
          store.recordExamAttempt({
            examId: `morph_s${store.currentUnit}l${store.currentLesson}`,
            mode: 'morph',
            score: this.morphScore,
            total: this.morphDeck.length,
            pct: Math.round((this.morphScore / Math.max(1, this.morphDeck.length)) * 100),
            completedAt: Date.now()
          });
        }
        store.recordStudyActivity(1);
        this.render();
      }
    });
  }
}
