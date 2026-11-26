// @ts-check

/**
 * Muallim ul-Qur'an — Summative Model Exams, Page 176 Mushaf Showcase & 9-Pillar Spiral Explorer (v7.0)
 * Renders #exam/vol1|u4|u5|u7, #mushaf-check, and #spiral routes inside the main content mount.
 */

import { store } from './store.js';
import { audioPlayer } from './audio.js';
import { AudioFX } from '../audio-fx.js';

const ICON_PLAY = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;
const ICON_SPEAK = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
const ICON_CLOCK = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;

const EXAM_TABS = [
  { id: 'vol1', label: 'Vol. 1 (Units 1-3)', marks: 50, timed: false },
  { id: 'u4', label: 'Unit 4', marks: 50, timed: false },
  { id: 'u5', label: 'Unit 5', marks: 60, timed: false },
  { id: 'u7', label: 'Unit 7 (2h)', marks: 100, timed: true }
];

const QUICK_ROOTS = [
  'ع ب د', 'ك ت ب', 'ع ل م', 'خ ل ق', 'غ ف ر', 'ر ز ق',
  'ظ ل م', 'س ج د', 'ن ز ل', 'ش ك ر', 'أ م ن', 'ح م د'
];

const FALLBACK_PILLARS = [
  {
    id: 1,
    title: 'Nouns, Definiteness, Tanween & Gender',
    lessons: ['s1l1', 's1l13', 's1l14', 's1l17', 's3l1', 's4l9', 's7l7'],
    summary: 'Definite Al- vs indefinite tanween, feminine Taa Marbootah, feminine pronouns, and verb gender agreement.',
    examples: ['اَلْكِتَابُ ➔ كِتَابٌ', 'آيَةٌ ➔ هٰذِهِ آيَةٌ', 'عَبَدَ ⬅ عَبَدَتْ']
  },
  {
    id: 2,
    title: 'Number Systems (Singular, Dual, Sound & Broken Plurals)',
    lessons: ['s1l10', 's1l11', 's3l10', 's5l1', 's5l2', 's5l4', 's6l6', 's7l2'],
    summary: 'Broken plurals, feminine plurals, duals, sound masculine plurals, and plural pronouns and verbs.',
    examples: ['قَلَمٌ ➔ أَقْلَامٌ', 'مُؤْمِنٌ ➔ مُؤْمِنَانِ', 'الْمُسْلِمُ ⬅ الْمُسْلِمُونَ']
  },
  {
    id: 3,
    title: 'Case Endings (Raf, Nasb, Jarr) & Case Triggers',
    lessons: ['s1l6', 's2l1', 's2l2', 's2l8', 's3l3', 's3l4', 's4l17', 's5l22', 's6l3', 's6l19'],
    summary: 'Subject Raf, prepositional and Idaafah Jarr, particle and object Nasb, and verbal moods.',
    examples: ['الْكِتَابُ ➔ إِنَّ الْكِتَابَ', 'لِلْكِتَابِ', 'يَغْفِرُ اللَّهُ الذُّنُوبَ']
  },
  {
    id: 4,
    title: 'Prepositions & High-Frequency Particles',
    lessons: ['s1l12', 's1l18', 's2l1', 's2l3', 's2l5', 's2l7', 's5l19', 's5l20', 's6l2', 's6l17'],
    summary: 'Prepositions, emphatic Inna and Laam, restrictive Maa Illaa, and verbal mood particles.',
    examples: ['لَهُ، مِنْهُ، فِيهِ', 'مَا هٰذَا إِلَّا سِحْرٌ', 'لَنْ نَصْبِرَ']
  },
  {
    id: 5,
    title: 'Pronouns (Detached & Attached, Singular & Plural)',
    lessons: ['s4l1', 's4l5', 's4l9', 's4l13', 's5l5', 's5l9', 's5l13', 's6l5', 's7l3'],
    summary: 'Detached subject pronouns and attached noun, particle, and verb object pronouns.',
    examples: ['هُوَ رَسُولٌ', 'بَيْتُهُ', 'كِتَابُكُمْ', 'جَعَلْنَاهُمْ']
  },
  {
    id: 6,
    title: 'Nominal & Genitive Compounds (Tawseefi, Izaafi, Ishaari)',
    lessons: ['s1l15', 's1l16', 's3l1', 's3l4', 's3l5', 's3l7', 's5l3', 's5l17'],
    summary: 'Demonstrative phrases, noun-adjective agreement, and possessive Idaafah chains.',
    examples: ['هٰذَا كِتَابٌ', 'شَيْءٌ عَظِيمٌ', 'كِتَابُ اللَّهِ']
  },
  {
    id: 7,
    title: 'Active & Passive Participles (Faa-il, Maf-ool, Tafzeel)',
    lessons: ['s1l19', 's3l8', 's3l9', 's4l18', 's5l1', 's5l22'],
    summary: 'Superlatives, active participles, derived Mu- participles, and passive participles.',
    examples: ['كَبِيرٌ ➔ أَكْبَرُ', 'خَالِقٌ', 'مُسْلِمٌ', 'مَظْلُومٌ']
  },
  {
    id: 8,
    title: 'Verb System (Mudhari, Nahi, Shart, Maazi & Passive)',
    lessons: ['s2l12', 's5l20', 's6l1', 's6l6', 's6l14', 's6l16', 's6l21', 's7l1', 's7l2', 's7l8'],
    summary: 'Single-sighah mastery of present-future and past active and passive verbs without 14-form clutter.',
    examples: ['يَعْبُدُ ⬅ يَعْبُدُونَ', 'لَا تَقْتُلُوا', 'أُنْزِلَ']
  },
  {
    id: 9,
    title: 'Recurring Qur-anic Idioms (Muhaawaraat)',
    lessons: ['s5l19', 's5l21', 's5l23', 's6l4', 's6l7', 's6l11', 's6l19', 's7l1', 's7l10'],
    summary: 'High-frequency Qur-anic clause templates and rhetorical capstone styles.',
    examples: ['أَلَيْسَ', 'مَا أَدْرَاكَ مَا', 'أَفَلَا يَعْلَمُونَ', 'أَفَمَنْ / كَمَنْ']
  }
];

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
 * Sanitize limited Arabic pedagogical markup (`arabic-root`, `nonroot`, `u`, `strong`, `span`, `br`).
 * @param {string} rawHtml
 * @returns {string}
 */
function sanitizeMarkup(rawHtml) {
  if (!rawHtml) return '';
  if (typeof document === 'undefined') {
    return esc(String(rawHtml).replace(/<[^>]+>/g, ''));
  }
  const tpl = document.createElement('template');
  tpl.innerHTML = String(rawHtml);
  const walk = (node) => {
    const frag = document.createDocumentFragment();
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        frag.appendChild(document.createTextNode(child.textContent || ''));
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const el = /** @type {HTMLElement} */ (child);
        const tag = el.tagName.toLowerCase();
        if (tag === 'br') {
          frag.appendChild(document.createElement('br'));
        } else if (tag === 'span' || tag === 'u' || tag === 'strong' || tag === 'b' || tag === 'mark') {
          const safe = document.createElement(tag === 'u' ? 'span' : tag);
          const allowedClasses = ['arabic-root', 'nonroot', 'exam-target-underline', 'ayah-medallion'];
          const cls = Array.from(el.classList).filter(c => allowedClasses.includes(c));
          if (tag === 'u' && !cls.includes('exam-target-underline')) {
            cls.push('exam-target-underline');
          }
          if (cls.length) safe.className = cls.join(' ');
          safe.appendChild(walk(el));
          frag.appendChild(safe);
        } else {
          frag.appendChild(walk(el));
        }
      }
    }
    return frag;
  };
  const wrap = document.createElement('div');
  wrap.appendChild(walk(tpl.content));
  return wrap.innerHTML;
}

/**
 * Resolve localized text from string or `{ hinglish, en, ur, hi }` map.
 * @param {any} val
 * @param {string} [fallback]
 * @returns {string}
 */
function pickLang(val, fallback = '') {
  if (!val) return fallback;
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    const lang = store.lang || 'hinglish';
    return String(
      val[lang] ||
      val.hinglish ||
      val.en ||
      val.ur ||
      val.hi ||
      fallback
    );
  }
  return String(val);
}

/**
 * Parse a lesson code like "s5l19" or "U5L19" into `{ unit, lesson }`.
 * @param {string} code
 * @returns {{unit: number, lesson: number} | null}
 */
function parseLessonCode(code) {
  const m = String(code || '').trim().match(/^[su](\d+)\s*l(\d+)$/i);
  if (!m) return null;
  return { unit: Number(m[1]), lesson: Number(m[2]) };
}

/**
 * Format seconds as MM:SS (`120:00` for 7200).
 * @param {number} secs
 * @returns {string}
 */
function formatCountdown(secs) {
  const s = Math.max(0, Math.floor(secs));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(m).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
}

/**
 * Render Arabic text with optional slash clauses, target underline, and ayah medallions.
 * @param {any} item
 * @returns {string}
 */
function renderExamArabicHtml(item) {
  const rawMarkup = item.arabic_markup || '';
  const rawArabic = item.arabic || '';
  const targetWord = item.targetWord || item.target_word || item.underlined || '';

  // Continuous Bayyinat passage with verses/ayahs array
  if (Array.isArray(item.verses) || Array.isArray(item.ayahs)) {
    const list = item.verses || item.ayahs;
    return `
      <div class="bayyinat-passage" dir="rtl" lang="ar">
        ${list.map(v => {
          const text = typeof v === 'string' ? v : (v.arabic_markup ? sanitizeMarkup(v.arabic_markup) : esc(v.arabic || v.text || ''));
          const num = typeof v === 'object' ? (v.ayah || v.ayahNumber || v.number || v.ref || '') : '';
          return `
            <span class="bayyinat-verse">${text}</span>
            ${num ? `<span class="ayah-medallion tabular-nums" aria-label="Ayah ${esc(String(num))}">${esc(String(num))}</span>` : ''}
          `;
        }).join(' ')}
      </div>
    `;
  }

  // Slash-segmented clauses
  const plainText = rawArabic || String(rawMarkup).replace(/<[^>]+>/g, '');
  if (plainText.includes('/')) {
    const sourceForClauses = rawMarkup && rawMarkup.includes('/') ? rawMarkup : rawArabic;
    const parts = String(sourceForClauses).split(/\s*\/\/?\s*/).filter(Boolean);
    if (parts.length > 1) {
      return `
        <div class="exam-clause-row" dir="rtl" lang="ar">
          ${parts.map((part, idx) => {
            let rendered = rawMarkup && rawMarkup.includes('/') ? sanitizeMarkup(part) : esc(part);
            if (targetWord && !rendered.includes('exam-target-underline')) {
              rendered = rendered.replace(esc(targetWord), `<span class="exam-target-underline">${esc(targetWord)}</span>`);
            }
            return `
              <span class="exam-clause-chip">${rendered}</span>
              ${idx < parts.length - 1 ? '<span class="exam-clause-sep" aria-hidden="true">/</span>' : ''}
            `;
          }).join('')}
        </div>
      `;
    }
  }

  let html = rawMarkup ? sanitizeMarkup(rawMarkup) : esc(rawArabic);
  if (targetWord && !html.includes('exam-target-underline')) {
    html = html.replace(esc(targetWord), `<span class="exam-target-underline">${esc(targetWord)}</span>`);
  }
  // Format embedded ayah markers like (1) or ۝١
  html = html.replace(/\((\d{1,3})\)/g, '<span class="ayah-medallion tabular-nums">$1</span>');
  return `<div class="arabic-text" dir="rtl" lang="ar">${html}</div>`;
}

export class ExamsController {
  /**
   * @param {{ searchCtrl?: any }} [opts]
   */
  constructor(opts = {}) {
    this.searchCtrl = opts.searchCtrl || null;
    this._papersCache = null;
    this._mushafCache = null;
    this._fallbackIndex = null;
    this._timerId = 0;
    this._remainingSeconds = 7200;
    this._timerPaused = false;
    this._activeExamId = 'vol1';
    this._mushafMode = /** @type {'progress' | 'benchmark'} */ ('progress');
    /** @type {Set<string>} */
    this._peekedMasks = new Set();
    /** @type {Record<string, 'correct' | 'missed'>} */
    this._grades = {};
    /** @type {Set<string>} */
    this._revealedAnswers = new Set();
    this._submitted = false;
  }

  destroy() {
    if (this._timerId) {
      clearInterval(this._timerId);
      this._timerId = 0;
    }
    audioPlayer.stop();
  }

  async _loadPapers() {
    if (this._papersCache) return this._papersCache;
    const res = await fetch('./data/exams/model_papers.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    this._papersCache = await res.json();
    return this._papersCache;
  }

  async _loadMushaf() {
    if (this._mushafCache) return this._mushafCache;
    const res = await fetch('./data/exams/mushaf_showcase.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    this._mushafCache = await res.json();
    return this._mushafCache;
  }

  /**
   * Resolve paper object cleanly across possible JSON shapes.
   * @param {any} data
   * @param {string} examId
   */
  _extractPaper(data, examId) {
    if (!data) return null;
    const key = String(examId || 'vol1').toLowerCase();
    const container = data.exams || data.papers;
    if (container) {
      if (Array.isArray(container)) {
        return container.find(p => String(p.id || p.examId || '').toLowerCase() === key) || container[0];
      }
      return container[key] || null;
    }
    if (Array.isArray(data)) {
      return data.find(p => String(p.id || p.examId || '').toLowerCase() === key) || data[0];
    }
    return data[key] || null;
  }

  /**
   * Render Summative Model Exam View (#exam/vol1|u4|u5|u7).
   * @param {HTMLElement} mount
   * @param {'vol1' | 'u4' | 'u5' | 'u7'} examId
   * @param {{
   *   onNavigateLesson?: (u: number, l: number) => void,
   *   onOpenExam?: (id: string) => void,
   *   onNotify?: (msg: string) => void,
   *   onOpenRoute?: (hash: string) => void
   * }} [callbacks]
   */
  async renderExamView(mount, examId = 'vol1', callbacks = {}) {
    this.destroy();
    const id = /** @type {'vol1' | 'u4' | 'u5' | 'u7'} */ (
      ['vol1', 'u4', 'u5', 'u7'].includes(examId) ? examId : 'vol1'
    );
    this._activeExamId = id;
    this._grades = {};
    this._revealedAnswers = new Set();
    this._submitted = false;
    this._remainingSeconds = 7200;
    this._timerPaused = false;

    mount.innerHTML = `
      <div class="lesson-skeleton" aria-busy="true">
        <div class="skeleton-block" style="height:96px"></div>
        <div class="skeleton-block" style="height:220px"></div>
      </div>
    `;

    let data;
    try {
      data = await this._loadPapers();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to load model papers';
      mount.innerHTML = `
        <div class="error-banner">
          <div class="error-banner-title">Could not load Model Exam</div>
          <p class="error-banner-desc">${esc(msg)}</p>
          <button type="button" class="btn-primary btn-sm" id="exam-retry-btn">Retry</button>
        </div>
      `;
      mount.querySelector('#exam-retry-btn')?.addEventListener('click', () => {
        this._papersCache = null;
        this.renderExamView(mount, id, callbacks);
      });
      return;
    }

    const paper = this._extractPaper(data, id);
    if (!paper) {
      mount.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">Model Paper not found</div>
          <p class="empty-state-desc">No exam data found for "${esc(id)}".</p>
          <button type="button" class="btn-primary btn-sm" id="exam-back-home">Back to Unit 1 Lesson 1</button>
        </div>
      `;
      mount.querySelector('#exam-back-home')?.addEventListener('click', () => {
        callbacks.onNavigateLesson?.(1, 1);
      });
      return;
    }

    this._renderExamDom(mount, paper, id, callbacks);
    if (id === 'u7') {
      this._startU7Timer(mount, callbacks);
    }
  }

  _startU7Timer(mount, callbacks) {
    if (this._timerId) clearInterval(this._timerId);
    this._timerId = window.setInterval(() => {
      if (this._timerPaused || this._submitted) return;
      if (this._remainingSeconds > 0) {
        this._remainingSeconds--;
        const pill = mount.querySelector('#exam-timer-val');
        const wrap = mount.querySelector('#exam-timer-pill');
        if (pill) pill.textContent = formatCountdown(this._remainingSeconds);
        if (wrap) wrap.classList.toggle('is-warning', this._remainingSeconds <= 300);
      } else {
        clearInterval(this._timerId);
        this._timerId = 0;
        callbacks.onNotify?.('Time is up for the Unit 7 Model Paper. Review and submit your score.');
      }
    }, 1000);
  }

  _renderExamDom(mount, paper, examId, callbacks) {
    const sections = Array.isArray(paper.sections) ? paper.sections : [];
    const totalMarks = Number(paper.totalMarks || paper.total_marks) ||
      sections.reduce((acc, s) => acc + (Number(s.marks || s.totalMarks) || 0), 0) || 100;
    const isTimed = examId === 'u7' || Boolean(paper.timed);
    const isUrdu = store.lang === 'ur';

    // Compute earned marks and counts
    let earnedMarks = 0;
    let totalItems = 0;
    let gradedItems = 0;
    const missedEntries = [];

    for (let sIdx = 0; sIdx < sections.length; sIdx++) {
      const sec = sections[sIdx];
      const items = Array.isArray(sec.items) ? sec.items : [];
      const secMarks = Number(sec.marks || sec.totalMarks) || items.length;
      const perItemMarks = items.length > 0 ? secMarks / items.length : 0;
      for (let iIdx = 0; iIdx < items.length; iIdx++) {
        totalItems++;
        const item = items[iIdx];
        const iKey = `${examId}_s${sIdx}_i${iIdx}`;
        const status = this._grades[iKey];
        if (status) gradedItems++;
        if (status === 'correct') {
          earnedMarks += Number(item.marks) || perItemMarks;
        } else if (status === 'missed') {
          missedEntries.push({
            key: item.itemKey || `S${item.unit || item.stage || (examId === 'u7' ? 7 : examId === 'u5' ? 5 : examId === 'u4' ? 4 : 1)}L${item.lesson || 1}_num_${item.id || iKey}`,
            arabic: item.arabic || (Array.isArray(item.ayahs) ? item.ayahs.map(a => a.arabic || '').join(' ') : ''),
            gloss: pickLang(item.answer_i18n || item.targetGloss_i18n || item.theme_i18n || item.translations || item.answer || item.meaning),
            ref: item.ref || (Array.isArray(item.ayahs) && item.ayahs[0]?.ref) || '',
            stage: Number(item.unit || item.stage || (examId === 'u7' ? 7 : examId === 'u5' ? 5 : examId === 'u4' ? 4 : 1)),
            lesson: Number(item.lesson || 1)
          });
        }
      }
    }
    const roundedScore = Math.round(earnedMarks * 10) / 10;
    const pct = totalMarks > 0 ? Math.round((roundedScore / totalMarks) * 100) : 0;
    const ratio = totalItems > 0 ? gradedItems / totalItems : 0;

    const history = (store.examHistory || []).filter(h => h.examId === examId).slice(-3).reverse();

    const tabsHtml = EXAM_TABS.map(t => `
      <button type="button" class="exam-tab-btn ${t.id === examId ? 'active' : ''}" data-switch-exam="${t.id}">
        ${esc(t.label)} · ${t.marks}m
      </button>
    `).join('');

    const sectionsHtml = sections.map((sec, sIdx) => {
      const items = Array.isArray(sec.items) ? sec.items : [];
      const layoutStr = String(sec.layout || '').toLowerCase();
      const layoutCols = layoutStr.includes('3') ? 3 : layoutStr.includes('1') || layoutStr.includes('bayyinat') || layoutStr.includes('thematic') ? 1 : layoutStr.includes('2') ? 2 : 0;
      const cols = Number(sec.columns) || layoutCols || (sec.type === 'bayyinat' || sec.type === 'thematic' ? 1 : 2);
      const secTitle = pickLang(sec.title_i18n || sec.title, `Question ${sIdx + 1}`);
      const secRubric = pickLang(sec.rubric_i18n || sec.rubric || sec.instructions, '');
      const secMarks = Number(sec.marks || sec.totalMarks) || 0;

      const itemsHtml = items.map((item, iIdx) => {
        const iKey = `${examId}_s${sIdx}_i${iIdx}`;
        const status = this._grades[iKey] || '';
        const isRev = this._revealedAnswers.has(iKey) || this._submitted;
        const answerText = pickLang(
          item.answer_i18n || item.targetGloss_i18n || item.theme_i18n || item.translations || item.answer || item.meaning || item.explanation,
          ''
        );
        const themeText = item.answer_i18n && item.theme_i18n ? pickLang(item.theme_i18n, '') : '';
        const targetGloss = item.answer_i18n && item.targetGloss_i18n ? pickLang(item.targetGloss_i18n, '') : '';
        const glossHints = Array.isArray(item.glossHints) ? item.glossHints : [];
        const itemRef = item.ref || (Array.isArray(item.ayahs) && item.ayahs[0]?.ref) || '';
        const hasAudio = Boolean(itemRef || item.arabic || (Array.isArray(item.ayahs) && item.ayahs.length > 0));

        return `
          <article class="exam-item-card ${status === 'correct' ? 'is-correct' : status === 'missed' ? 'is-missed' : ''}" data-exam-item="${iKey}">
            <div class="card-top">
              <div class="card-meta-badges">
                <span class="card-number tabular-nums">${sIdx + 1}.${iIdx + 1}</span>
                ${itemRef ? `<span class="ref-badge-btn">${esc(itemRef)}</span>` : ''}
                ${item.marks ? `<span class="dialog-subtitle tabular-nums">${esc(String(item.marks))}m</span>` : ''}
              </div>
              <div class="card-actions">
                ${hasAudio ? `
                  ${itemRef ? `<button type="button" class="card-action-btn" data-exam-audio="qari" data-item-key="${iKey}" aria-label="Play Qari recitation">${ICON_PLAY}</button>` : ''}
                  <button type="button" class="card-action-btn" data-exam-audio="tts" data-item-key="${iKey}" aria-label="Speak Arabic">${ICON_SPEAK}</button>
                ` : ''}
              </div>
            </div>

            ${renderExamArabicHtml(item)}

            ${glossHints.length > 0 ? `
              <div class="search-status-line" style="margin:0;">
                Lexical gloss: ${glossHints.map(h => typeof h === 'string' ? esc(h) : `${esc(h.word || h.ar || '')}: ${esc(pickLang(h.gloss_i18n || h.gloss || h.meaning, ''))}`).join(' · ')}
              </div>
            ` : ''}

            ${isRev && (answerText || targetGloss || themeText) ? `
              <div class="exam-answer-box" ${isUrdu ? 'dir="rtl" lang="ur"' : ''}>
                ${targetGloss ? `<div class="gloss-text"><strong>Target (${esc(item.targetWord || '')}):</strong> ${esc(targetGloss)}</div>` : ''}
                ${answerText ? `<div class="gloss-text">${esc(answerText)}</div>` : ''}
                ${themeText ? `<div class="gloss-text" style="margin-top:4px;"><strong>Theme:</strong> ${esc(themeText)}</div>` : ''}
              </div>
            ` : ''}

            <div class="exam-grade-actions">
              <button type="button" class="btn-ghost btn-sm" data-exam-reveal="${iKey}">
                ${isRev ? 'Hide Answer' : 'Reveal Answer'}
              </button>
              <div class="lesson-action-group">
                <button type="button" class="btn-secondary btn-sm ${status === 'correct' ? 'is-selected' : ''}" data-exam-grade="correct" data-item-key="${iKey}" aria-pressed="${status === 'correct'}">Got It</button>
                <button type="button" class="btn-secondary btn-sm ${status === 'missed' ? 'is-selected' : ''}" data-exam-grade="missed" data-item-key="${iKey}" aria-pressed="${status === 'missed'}">Missed</button>
              </div>
            </div>
          </article>
        `;
      }).join('');

      return `
        <section class="exam-section-card">
          <div class="exam-section-head">
            <div>
              <h3 class="section-title">${esc(secTitle)}</h3>
              ${secRubric ? `<p class="exam-rubric" ${isUrdu ? 'dir="rtl" lang="ur"' : ''}>${esc(secRubric)}</p>` : ''}
            </div>
            <span class="exam-marks-badge tabular-nums">${secMarks} marks</span>
          </div>
          <div class="exam-items-grid cols-${cols}">
            ${itemsHtml}
          </div>
        </section>
      `;
    }).join('');

    mount.innerHTML = `
      <div class="exam-shell">
        <div class="exam-tabs-row" role="navigation" aria-label="Model Papers">
          ${tabsHtml}
          <button type="button" class="btn-ghost btn-sm" id="exam-nav-mushaf">Page 176 Showcase</button>
          <button type="button" class="btn-ghost btn-sm" id="exam-nav-spiral">9-Pillar Spiral</button>
        </div>

        <header class="exam-header-card">
          <div>
            <div class="lesson-kicker">Official Summative Model Paper</div>
            <h1 class="lesson-title">${esc(pickLang(paper.title_i18n || paper.title, `Model Paper (${examId.toUpperCase()})`))}</h1>
            <p class="search-status-line" style="margin:4px 0 0;">
              ${esc(pickLang(paper.instructions_i18n || paper.instructions, 'Evaluate your comprehension and mark each item Got It or Missed to record weak words into SRS.'))}
            </p>
          </div>
          <div class="exam-header-meta">
            <span class="exam-marks-badge tabular-nums">${totalMarks} Marks</span>
            ${isTimed ? `
              <div class="exam-timer-pill ${this._timerPaused ? 'is-paused' : ''} ${this._remainingSeconds <= 300 ? 'is-warning' : ''}" id="exam-timer-pill">
                ${ICON_CLOCK}
                <span id="exam-timer-val" class="tabular-nums">${formatCountdown(this._remainingSeconds)}</span>
                <button type="button" class="btn-ghost btn-sm" id="exam-timer-toggle">${this._timerPaused ? 'Resume' : 'Pause'}</button>
                <button type="button" class="btn-ghost btn-sm" id="exam-timer-reset">Reset</button>
              </div>
            ` : `<span class="sync-badge">Untimed Mode</span>`}
          </div>
        </header>

        <div class="quiz-progress-row tabular-nums">
          <span>Graded ${gradedItems} of ${totalItems} items</span>
          <span>Live Score: ${roundedScore} / ${totalMarks} (${pct}%)</span>
        </div>
        <div class="quiz-progress-track">
          <div class="quiz-progress-fill" id="exam-progress-fill"></div>
        </div>

        ${this._submitted ? `
          <section class="exam-scorecard">
            <div class="scorecard-ring tabular-nums">${pct}%</div>
            <h2 class="empty-state-title">Exam Attempt Saved</h2>
            <p class="empty-state-desc tabular-nums">
              Scored <strong>${roundedScore}</strong> of <strong>${totalMarks}</strong>.
              ${missedEntries.length > 0 ? `${missedEntries.length} missed item(s) added to your SRS Mistakes deck.` : 'Zero missed items in this paper.'}
            </p>
            <div class="lesson-action-group">
              <button type="button" class="btn-secondary" id="exam-retake-btn">Retake Paper</button>
              <button type="button" class="btn-primary" id="exam-back-lesson">Back to Lesson</button>
            </div>
          </section>
        ` : ''}

        ${sectionsHtml}

        <div class="bottom-nav-card">
          <button type="button" class="btn-secondary" id="exam-reveal-all-btn">Reveal All Model Answers</button>
          <button type="button" class="btn-primary" id="exam-submit-btn">Finish &amp; Save Attempt (${roundedScore}/${totalMarks})</button>
        </div>

        ${history.length > 0 ? `
          <section class="exam-section-card">
            <h3 class="section-title">Recent Attempts</h3>
            <div class="starred-list-stack">
              ${history.map(h => `
                <div class="starred-item-row tabular-nums">
                  <span>${new Date(h.completedAt).toLocaleDateString()}</span>
                  <strong>${h.score} / ${h.total} (${h.pct}%)</strong>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
      </div>
    `;

    const fillEl = /** @type {HTMLElement | null} */ (mount.querySelector('#exam-progress-fill'));
    if (fillEl) fillEl.style.setProperty('--progress-scale', String(ratio));

    mount.querySelectorAll('[data-switch-exam]').forEach(btn => {
      btn.addEventListener('click', () => {
        const nextId = btn.getAttribute('data-switch-exam') || 'vol1';
        if (callbacks.onOpenExam) callbacks.onOpenExam(nextId);
        else if (callbacks.onOpenRoute) callbacks.onOpenRoute(`#exam/${nextId}`);
        else this.renderExamView(mount, /** @type {any} */ (nextId), callbacks);
      });
    });

    mount.querySelector('#exam-nav-mushaf')?.addEventListener('click', () => {
      if (callbacks.onOpenRoute) callbacks.onOpenRoute('#mushaf-check');
      else this.renderMushafShowcase(mount, callbacks);
    });
    mount.querySelector('#exam-nav-spiral')?.addEventListener('click', () => {
      if (callbacks.onOpenRoute) callbacks.onOpenRoute('#spiral');
      else this.renderSpiralExplorer(mount, {}, callbacks);
    });

    mount.querySelector('#exam-timer-toggle')?.addEventListener('click', () => {
      this._timerPaused = !this._timerPaused;
      const btn = mount.querySelector('#exam-timer-toggle');
      const pill = mount.querySelector('#exam-timer-pill');
      if (btn) btn.textContent = this._timerPaused ? 'Resume' : 'Pause';
      if (pill) pill.classList.toggle('is-paused', this._timerPaused);
    });
    mount.querySelector('#exam-timer-reset')?.addEventListener('click', () => {
      this._remainingSeconds = 7200;
      this._timerPaused = false;
      const val = mount.querySelector('#exam-timer-val');
      if (val) val.textContent = formatCountdown(this._remainingSeconds);
    });

    // Item lookup helper
    const findItem = (iKey) => {
      const m = iKey.match(/_s(\d+)_i(\d+)$/);
      if (!m) return null;
      const sec = sections[Number(m[1])];
      return sec?.items?.[Number(m[2])] || null;
    };

    mount.querySelectorAll('[data-exam-audio]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = /** @type {'qari' | 'tts'} */ (btn.getAttribute('data-exam-audio'));
        const iKey = btn.getAttribute('data-item-key') || '';
        const item = findItem(iKey);
        if (!item) return;
        const listSrc = Array.isArray(item.ayahs) ? item.ayahs : Array.isArray(item.verses) ? item.verses : [];
        const arabic = item.arabic || listSrc.map(v => v.arabic || v).join(' ');
        const ref = item.ref || (listSrc[0] && listSrc[0].ref) || '';
        audioPlayer.play({
          arabic,
          ref,
          key: `exam_${iKey}`,
          mode,
          buttonEl: /** @type {HTMLElement} */ (e.currentTarget),
          onNotify: callbacks.onNotify
        });
      });
    });

    mount.querySelectorAll('[data-exam-reveal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const iKey = btn.getAttribute('data-exam-reveal') || '';
        if (this._revealedAnswers.has(iKey)) this._revealedAnswers.delete(iKey);
        else this._revealedAnswers.add(iKey);
        this._renderExamDom(mount, paper, examId, callbacks);
      });
    });

    mount.querySelectorAll('[data-exam-grade]').forEach(btn => {
      btn.addEventListener('click', () => {
        const grade = /** @type {'correct' | 'missed'} */ (btn.getAttribute('data-exam-grade'));
        const iKey = btn.getAttribute('data-item-key') || '';
        this._grades[iKey] = grade;
        this._revealedAnswers.add(iKey);
        AudioFX.play(grade === 'correct' ? 'correct' : 'wrong');
        this._renderExamDom(mount, paper, examId, callbacks);
      });
    });

    mount.querySelector('#exam-reveal-all-btn')?.addEventListener('click', () => {
      for (let sIdx = 0; sIdx < sections.length; sIdx++) {
        const items = sections[sIdx].items || [];
        for (let iIdx = 0; iIdx < items.length; iIdx++) {
          this._revealedAnswers.add(`${examId}_s${sIdx}_i${iIdx}`);
        }
      }
      this._renderExamDom(mount, paper, examId, callbacks);
    });

    mount.querySelector('#exam-submit-btn')?.addEventListener('click', () => {
      this._submitted = true;
      for (const m of missedEntries) {
        if (typeof store.recordWeakWord === 'function') {
          store.recordWeakWord(m);
        }
      }
      if (typeof store.recordExamAttempt === 'function') {
        store.recordExamAttempt({
          examId,
          mode: 'exam',
          score: roundedScore,
          total: totalMarks,
          pct,
          completedAt: Date.now()
        });
      }
      store.recordStudyActivity(1);
      callbacks.onNotify?.(`Saved ${examId.toUpperCase()} attempt: ${roundedScore}/${totalMarks} (${pct}%).`);
      this._renderExamDom(mount, paper, examId, callbacks);
      mount.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
    });

    mount.querySelector('#exam-retake-btn')?.addEventListener('click', () => {
      this.renderExamView(mount, examId, callbacks);
    });
    mount.querySelector('#exam-back-lesson')?.addEventListener('click', () => {
      callbacks.onNavigateLesson?.(store.currentUnit, store.currentLesson);
    });
  }

  /**
   * Render Page 176 6-Page Mushaf Coverage Showcase (#mushaf-check).
   * @param {HTMLElement} mount
   * @param {{
   *   onNavigateLesson?: (u: number, l: number) => void,
   *   onNotify?: (msg: string) => void,
   *   onOpenRoute?: (hash: string) => void
   * }} [callbacks]
   */
  async renderMushafShowcase(mount, callbacks = {}) {
    this.destroy();
    this._peekedMasks = new Set();

    mount.innerHTML = `
      <div class="lesson-skeleton" aria-busy="true">
        <div class="skeleton-block" style="height:96px"></div>
        <div class="skeleton-block" style="height:280px"></div>
      </div>
    `;

    let data;
    try {
      data = await this._loadMushaf();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to load Mushaf showcase';
      mount.innerHTML = `
        <div class="error-banner">
          <div class="error-banner-title">Could not load Page 176 Mushaf Showcase</div>
          <p class="error-banner-desc">${esc(msg)}</p>
          <button type="button" class="btn-primary btn-sm" id="mushaf-retry-btn">Retry</button>
        </div>
      `;
      mount.querySelector('#mushaf-retry-btn')?.addEventListener('click', () => {
        this._mushafCache = null;
        this.renderMushafShowcase(mount, callbacks);
      });
      return;
    }

    const pages = Array.isArray(data?.pages)
      ? data.pages
      : Array.isArray(data?.passages)
        ? data.passages
        : Array.isArray(data)
          ? data
          : [];

    this._renderMushafDom(mount, data, pages, callbacks);
  }

  _isTokenLearned(token) {
    const unit = Number(token.unit || token.stage || 0);
    const hasExplicitBlackout = typeof token.blackout === 'boolean';
    const isUnlearned = hasExplicitBlackout
      ? Boolean(token.blackout || token.unlearned || unit > 7)
      : Boolean(token.unlearned || unit === 0 || unit > 7);
    if (this._mushafMode === 'benchmark') {
      return !isUnlearned;
    }
    if (isUnlearned) return false;
    if (unit === 0) return true;
    if (token.lesson) {
      return store.isLessonCompleted(unit, Number(token.lesson));
    }
    const mastery = store.getUnitMastery(unit);
    return mastery.completed > 0;
  }

  _renderMushafDom(mount, data, pages, callbacks) {
    let totalTokens = 0;
    let learnedTokens = 0;

    const completedUnits = [1, 2, 3, 4, 5, 6, 7].filter(u => store.getUnitMastery(u).completed > 0);

    const cardsHtml = pages.map((page, pIdx) => {
      // Support both flat page.tokens/spans AND nested page.ayahs[{ ayah, ref, spans }]
      let tokens = [];
      if (Array.isArray(page.ayahs)) {
        for (const a of page.ayahs) {
          for (const sp of (Array.isArray(a.spans) ? a.spans : [])) {
            tokens.push(sp);
          }
          if (a.ayah !== undefined && a.ayah !== null) {
            tokens.push({ isMarker: true, arabic: String(a.ayah) });
          }
        }
      } else if (Array.isArray(page.tokens)) {
        tokens = page.tokens;
      } else if (Array.isArray(page.spans)) {
        tokens = page.spans;
      } else if (Array.isArray(page.segments)) {
        tokens = page.segments;
      }

      let pageTotal = 0;
      let pageLearned = 0;
      const passageArabicList = [];

      const flowHtml = tokens.map((tok, tIdx) => {
        const arabic = tok.arabic || tok.text || '';
        if (!arabic) return '';
        if (!tok.isMarker) passageArabicList.push(arabic);

        // Punctuation/ayah markers don't count as vocabulary masks
        if (tok.isMarker || tok.type === 'ayah_marker' || /^[﴿﴾۝٠-٩\d().\s]+$/.test(arabic)) {
          return `<span class="ayah-medallion tabular-nums">${esc(arabic)}</span>`;
        }

        pageTotal++;
        totalTokens++;
        const learned = this._isTokenLearned(tok);
        const maskKey = `p${pIdx}_t${tIdx}`;
        const peeked = this._peekedMasks.has(maskKey);
        if (learned) {
          pageLearned++;
          learnedTokens++;
          return `<span class="mushaf-token">${esc(arabic)}</span>`;
        }

        const gloss = pickLang(tok.gloss_i18n || tok.translations || tok.gloss || tok.meaning, 'Unlearned vocabulary');
        return `
          <button type="button" class="mushaf-blackout ${peeked ? 'is-peeked' : ''}" data-mushaf-peek="${maskKey}" aria-expanded="${peeked}">
            <span class="mushaf-blackout-ar">${esc(arabic)}</span>
            ${peeked ? `<span class="mushaf-peek-gloss">${esc(gloss)}</span>` : ''}
          </button>
        `;
      }).join(' ');

      const pagePct = pageTotal > 0 ? Math.round((pageLearned / pageTotal) * 100) : 100;
      const title = pickLang(page.surahName_i18n || page.title_i18n || page.surah_name || page.title, `Page ${pIdx + 1}`);
      const ref = page.ref || page.ayahRange || page.ayah_range || '';
      const fullArabic = page.arabic || passageArabicList.join(' ');

      return `
        <article class="mushaf-page-card" data-mushaf-page="${pIdx}">
          <div class="mushaf-page-head">
            <div>
              <h3 class="section-title">${esc(title)}</h3>
              <span class="dialog-subtitle tabular-nums">${esc(ref)} · ${pagePct}% covered</span>
            </div>
            <div class="card-actions">
              ${ref ? `<button type="button" class="ref-badge-btn" data-mushaf-audio="qari" data-page-idx="${pIdx}">${ICON_PLAY} <span>${esc(ref)}</span></button>` : ''}
              <button type="button" class="card-action-btn" data-mushaf-audio="tts" data-page-idx="${pIdx}" aria-label="Speak passage">${ICON_SPEAK}</button>
            </div>
          </div>
          <div class="mushaf-arabic-flow" dir="rtl" lang="ar" data-full-arabic="${esc(fullArabic)}">
            ${flowHtml}
          </div>
        </article>
      `;
    }).join('');

    const overallPct = totalTokens > 0 ? Math.round((learnedTokens / totalTokens) * 100) : 0;
    const ratio = totalTokens > 0 ? learnedTokens / totalTokens : 0;

    mount.innerHTML = `
      <div class="mushaf-shell">
        <div class="exam-tabs-row">
          <button type="button" class="btn-ghost btn-sm" id="mushaf-nav-exam">Model Exams</button>
          <button type="button" class="btn-ghost btn-sm" id="mushaf-nav-spiral">9-Pillar Spiral</button>
          <button type="button" class="btn-ghost btn-sm" id="mushaf-back-lesson">Back to Lesson</button>
        </div>

        <header class="exam-header-card">
          <div>
            <div class="lesson-kicker">Volume 4 · Page 176 Closing Self-Assessment</div>
            <h1 class="lesson-title">${esc(pickLang(data?.title_i18n || data?.title, '6-Page Mushaf Coverage Showcase'))}</h1>
            <p class="search-status-line" style="margin:4px 0 0;">
              Tap any blackout span to peek at the unlearned word and its gloss.
            </p>
          </div>
          <div class="segmented-tabs" role="tablist" aria-label="Coverage mode">
            <button type="button" class="seg-tab ${this._mushafMode === 'progress' ? 'active' : ''}" data-mushaf-mode="progress">My Current Progress</button>
            <button type="button" class="seg-tab ${this._mushafMode === 'benchmark' ? 'active' : ''}" data-mushaf-mode="benchmark">After Unit 7 Benchmark</button>
          </div>
        </header>

        <div class="mushaf-stats-bar">
          <div class="quiz-progress-row tabular-nums" style="width:100%;">
            <span>
              ${this._mushafMode === 'progress'
                ? (completedUnits.length > 0 ? `Active Units: ${completedUnits.join(', ')}` : 'Complete lessons in any Unit to unlock spans')
                : 'After completing Units 1 to 7'}
            </span>
            <strong>${overallPct}% Direct Comprehension (${learnedTokens} / ${totalTokens} spans)</strong>
          </div>
          <div class="quiz-progress-track" style="width:100%;">
            <div class="quiz-progress-fill" id="mushaf-progress-fill"></div>
          </div>
        </div>

        <div class="mushaf-grid">
          ${cardsHtml}
        </div>
      </div>
    `;

    const fillEl = /** @type {HTMLElement | null} */ (mount.querySelector('#mushaf-progress-fill'));
    if (fillEl) fillEl.style.setProperty('--progress-scale', String(ratio));

    mount.querySelectorAll('[data-mushaf-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        this._mushafMode = /** @type {'progress' | 'benchmark'} */ (btn.getAttribute('data-mushaf-mode'));
        this._peekedMasks.clear();
        this._renderMushafDom(mount, data, pages, callbacks);
      });
    });

    mount.querySelectorAll('[data-mushaf-peek]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-mushaf-peek') || '';
        if (this._peekedMasks.has(key)) this._peekedMasks.delete(key);
        else this._peekedMasks.add(key);
        AudioFX.play('pop');
        this._renderMushafDom(mount, data, pages, callbacks);
      });
    });

    mount.querySelectorAll('[data-mushaf-audio]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = /** @type {'qari' | 'tts'} */ (btn.getAttribute('data-mushaf-audio'));
        const idx = Number(btn.getAttribute('data-page-idx'));
        const page = pages[idx];
        if (!page) return;
        const flowEl = mount.querySelector(`[data-mushaf-page="${idx}"] .mushaf-arabic-flow`);
        const arabic = page.arabic || flowEl?.getAttribute('data-full-arabic') || '';
        audioPlayer.play({
          arabic,
          ref: page.ref || page.ayah_range || '',
          key: `mushaf_p${idx}`,
          mode,
          buttonEl: /** @type {HTMLElement} */ (e.currentTarget),
          onNotify: callbacks.onNotify
        });
      });
    });

    mount.querySelector('#mushaf-nav-exam')?.addEventListener('click', () => {
      if (callbacks.onOpenExam) callbacks.onOpenExam('u7');
      else callbacks.onOpenRoute?.('#exam/u7');
    });
    mount.querySelector('#mushaf-nav-spiral')?.addEventListener('click', () => {
      if (callbacks.onOpenRoute) callbacks.onOpenRoute('#spiral');
      else this.renderSpiralExplorer(mount, {}, callbacks);
    });
    mount.querySelector('#mushaf-back-lesson')?.addEventListener('click', () => {
      callbacks.onNavigateLesson?.(store.currentUnit, store.currentLesson);
    });
  }

  /**
   * Ensure search index is loaded (via searchCtrl or direct fetch fallback).
   * @param {any} [ctrlOverride]
   * @returns {Promise<Array<any>>}
   */
  async _ensureSearchIndex(ctrlOverride) {
    const ctrl = ctrlOverride || this.searchCtrl;
    if (ctrl && typeof ctrl.ensureIndexLoaded === 'function') {
      return ctrl.ensureIndexLoaded();
    }
    if (this._fallbackIndex) return this._fallbackIndex;
    const res = await fetch('./data/search-index.json');
    if (!res.ok) return [];
    const data = await res.json();
    this._fallbackIndex = Array.isArray(data) ? data : [];
    return this._fallbackIndex;
  }

  /**
   * Look up all entries sharing a triliteral root via searchCtrl.getByRoot or fallback.
   * @param {string} rootQuery
   * @param {any} [ctrlOverride]
   */
  async _lookupRootFamily(rootQuery, ctrlOverride) {
    const ctrl = ctrlOverride || this.searchCtrl;
    if (ctrl && typeof ctrl.getByRoot === 'function') {
      await ctrl.ensureIndexLoaded();
      const res = ctrl.getByRoot(rootQuery);
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.matches)) return res.matches;
    }
    const idx = await this._ensureSearchIndex(ctrl);
    const norm = String(rootQuery || '').replace(/[\s\-_]/g, '');
    if (!norm) return [];
    return idx.filter(entry => String(entry.root || '').replace(/[\s\-_]/g, '').includes(norm));
  }

  /**
   * Categorize a root-family entry into Nouns, Participles, Mudhari, Maazi, or Expressions.
   * @param {any} entry
   * @returns {'nouns' | 'participles' | 'mudhari' | 'maazi'}
   */
  _classifyRootEntry(entry) {
    const u = Number(entry.s) || 1;
    const ar = String(entry.ar || '').trim();
    const firstWord = ar.split(/\s+/)[0] || '';
    if (u === 6 || /^[يتأن][َُِ]/.test(firstWord)) return 'mudhari';
    if (u === 7) return 'maazi';
    if (
      u === 3 ||
      /^[م]ُ/.test(firstWord) ||
      /^مَ.{2}و/.test(firstWord) ||
      /^[أإ].{2}[َُ]/.test(firstWord)
    ) {
      return 'participles';
    }
    return 'nouns';
  }

  /**
   * Render 9-Pillar Spiral & Root-Family Explorer (#spiral).
   * @param {HTMLElement} mount
   * @param {{ root?: string, pillar?: number }} [params]
   * @param {{
   *   onNavigateLesson?: (u: number, l: number) => void,
   *   onOpenExam?: (id: string) => void,
   *   onNotify?: (msg: string) => void,
   *   onOpenRoute?: (hash: string) => void,
   *   searchCtrl?: any
   * }} [callbacks]
   */
  async renderSpiralExplorer(mount, params = {}, callbacks = {}) {
    this.destroy();
    await store.loadMetadata().catch(() => null);
    const pillars = Array.isArray(store.metadata?.pillars) && store.metadata.pillars.length > 0
      ? store.metadata.pillars
      : FALLBACK_PILLARS;

    const activePillar = Number(params?.pillar) || 0;
    const activeRoot = String(params?.root || '').trim();
    let rootMatches = [];

    if (activeRoot) {
      mount.innerHTML = `
        <div class="lesson-skeleton" aria-busy="true">
          <div class="skeleton-block" style="height:88px"></div>
          <div class="skeleton-block" style="height:240px"></div>
        </div>
      `;
      rootMatches = await this._lookupRootFamily(activeRoot, callbacks.searchCtrl);
    }

    this._renderSpiralDom(mount, pillars, activePillar, activeRoot, rootMatches, callbacks);
  }

  _renderSpiralDom(mount, pillars, activePillar, activeRoot, rootMatches, callbacks) {
    const groups = {
      nouns: [],
      participles: [],
      mudhari: [],
      maazi: []
    };
    const seen = new Set();
    for (const m of rootMatches) {
      const k = `${m.s}_${m.l}_${m.ar}`;
      if (seen.has(k)) continue;
      seen.add(k);
      groups[this._classifyRootEntry(m)].push(m);
    }

    const groupMeta = [
      { key: 'nouns', title: 'Cognate Nouns & Nominal Forms (Units 1 to 5)' },
      { key: 'participles', title: 'Participles & Attributes (Faa-il / Maf-ool / Tafzeel)' },
      { key: 'mudhari', title: "Present-Future Verbs (Fe'l Mudhari', Unit 6)" },
      { key: 'maazi', title: "Past Verbs (Fe'l Maazi, Unit 7)" }
    ];

    const rootResultsHtml = activeRoot ? (
      rootMatches.length === 0
        ? `
          <div class="empty-state">
            <div class="empty-state-title">No entries found for root "${esc(activeRoot)}"</div>
            <p class="empty-state-desc">Try spacing the three root letters (e.g. ع ب د) or selecting a common root chip above.</p>
          </div>
        `
        : groupMeta.map(g => {
          const items = groups[g.key];
          if (!items || items.length === 0) return '';
          return `
            <section class="root-family-group">
              <h3 class="section-title">${esc(g.title)} <span class="tabular-nums">(${items.length})</span></h3>
              <div class="root-family-grid">
                ${items.slice(0, 24).map(it => {
                  const gloss = pickLang({ hinglish: it.hn, en: it.en, ur: it.ur, hi: it.hi }, it.en || it.hn || '');
                  return `
                    <article class="root-entry-card">
                      <div class="card-top">
                        <button type="button" class="lesson-pill" data-spiral-jump="${it.s}:${it.l}">Unit ${it.s} · L${it.l}</button>
                        <button type="button" class="card-action-btn" data-root-audio="${esc(it.ar)}" aria-label="Speak Arabic">${ICON_SPEAK}</button>
                      </div>
                      <div class="arabic-text" dir="rtl" lang="ar">${esc(it.ar)}</div>
                      ${it.tr ? `<div class="search-result-gloss"><em>[${esc(it.tr)}]</em></div>` : ''}
                      <div class="gloss-text">${esc(gloss)}</div>
                    </article>
                  `;
                }).join('')}
              </div>
            </section>
          `;
        }).join('')
    ) : `
      <div class="empty-state">
        <div class="empty-state-title">Explore a Triliteral Root Family</div>
        <p class="empty-state-desc">Select a root chip above or enter three root letters (e.g. ك ت ب) to trace cognate nouns, participles, Mudhari', and Maazi verbs across Units 1 to 7.</p>
      </div>
    `;

    const pillarsHtml = pillars.map((p, idx) => {
      const pid = Number(p.id) || (idx + 1);
      const isActive = pid === activePillar;
      const lessons = Array.isArray(p.lessons) ? p.lessons : [];
      const examples = Array.isArray(p.examples) ? p.examples : [];
      const title = pickLang(p.title_i18n || p.title, `Pillar ${pid}`);
      const summary = pickLang(p.summary_i18n || p.summary, '');

      return `
        <article class="spiral-pillar-card ${isActive ? 'is-active' : ''}" data-pillar-id="${pid}">
          <div class="card-top">
            <span class="gv-badge tabular-nums">Pillar ${pid}</span>
            <span class="dialog-subtitle tabular-nums">${lessons.length} checkpoints</span>
          </div>
          <h3 class="section-title">${esc(title)}</h3>
          ${summary ? `<p class="empty-state-desc" style="text-align:left; max-width:none;">${esc(summary)}</p>` : ''}
          ${examples.length > 0 ? `
            <div class="spiral-examples-row" dir="rtl" lang="ar">
              ${examples.map(ex => {
                if (typeof ex === 'string') {
                  return `<span class="exam-clause-chip">${esc(ex)}</span>`;
                }
                const ar = ex.ar || ex.arabic || '';
                const tr = pickLang(ex, ex.hinglish || ex.en || '');
                return `<span class="exam-clause-chip" title="${esc(tr)}">${esc(ar)}${tr ? ` <small style="direction:ltr; unicode-bidi:isolate;">(${esc(tr)})</small>` : ''}</span>`;
              }).join('')}
            </div>
          ` : ''}
          <div class="spiral-chain-row" aria-label="Lesson progression chain">
            ${lessons.map((code, cIdx) => {
              const parsed = parseLessonCode(code);
              const label = parsed ? `U${parsed.unit}L${parsed.lesson}` : String(code).toUpperCase();
              return `
                <button type="button" class="spiral-chain-pill" data-spiral-code="${esc(code)}">${esc(label)}</button>
                ${cIdx < lessons.length - 1 ? '<span aria-hidden="true">→</span>' : ''}
              `;
            }).join('')}
          </div>
        </article>
      `;
    }).join('');

    mount.innerHTML = `
      <div class="spiral-shell">
        <div class="exam-tabs-row">
          <button type="button" class="btn-ghost btn-sm" id="spiral-nav-exam">Model Exams</button>
          <button type="button" class="btn-ghost btn-sm" id="spiral-nav-mushaf">Page 176 Showcase</button>
          <button type="button" class="btn-ghost btn-sm" id="spiral-back-lesson">Back to Lesson</button>
        </div>

        <header class="exam-header-card">
          <div>
            <div class="lesson-kicker">Cross-Cutting Spiral Curriculum &amp; Root Families</div>
            <h1 class="lesson-title">9-Pillar Spiral &amp; Root-Family Explorer</h1>
            <p class="search-status-line" style="margin:4px 0 0;">
              Follow how each grammatical pillar builds across Units 1 to 7, or inspect any triliteral root family across nouns and verbs.
            </p>
          </div>
        </header>

        <section class="exam-section-card">
          <h2 class="section-title">Triliteral Root-Family Browser</h2>
          <form id="spiral-root-form" class="root-explorer-bar">
            <input type="text" id="spiral-root-input" class="text-input" value="${esc(activeRoot)}" placeholder="Enter root (e.g. ع ب د or ك ت ب)" aria-label="Triliteral root search">
            <button type="submit" class="btn-primary btn-sm">Explore Root</button>
          </form>
          <div class="root-chips-row">
            ${QUICK_ROOTS.map(r => `
              <button type="button" class="root-chip ${activeRoot === r ? 'active' : ''}" data-pick-root="${esc(r)}">${esc(r)}</button>
            `).join('')}
          </div>
          ${rootResultsHtml}
        </section>

        <section class="exam-section-card">
          <h2 class="section-title">9 Cross-Cutting Grammar Pillars</h2>
          <div class="spiral-pillars-grid">
            ${pillarsHtml}
          </div>
        </section>
      </div>
    `;

    mount.querySelector('#spiral-root-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = /** @type {HTMLInputElement | null} */ (mount.querySelector('#spiral-root-input'));
      const val = (input?.value || '').trim();
      if (callbacks.onOpenRoute && val) {
        callbacks.onOpenRoute(`#spiral/root/${encodeURIComponent(val)}`);
      }
      await this.renderSpiralExplorer(mount, { root: val, pillar: activePillar }, callbacks);
    });

    mount.querySelectorAll('[data-pick-root]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const val = btn.getAttribute('data-pick-root') || '';
        if (callbacks.onOpenRoute) {
          callbacks.onOpenRoute(`#spiral/root/${encodeURIComponent(val)}`);
        }
        await this.renderSpiralExplorer(mount, { root: val, pillar: activePillar }, callbacks);
      });
    });

    mount.querySelectorAll('[data-spiral-code]').forEach(btn => {
      btn.addEventListener('click', () => {
        const parsed = parseLessonCode(btn.getAttribute('data-spiral-code') || '');
        if (parsed) {
          callbacks.onNavigateLesson?.(parsed.unit, parsed.lesson);
        }
      });
    });

    mount.querySelectorAll('[data-spiral-jump]').forEach(btn => {
      btn.addEventListener('click', () => {
        const [u, l] = (btn.getAttribute('data-spiral-jump') || '1:1').split(':').map(Number);
        callbacks.onNavigateLesson?.(u || 1, l || 1);
      });
    });

    mount.querySelectorAll('[data-root-audio]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ar = btn.getAttribute('data-root-audio') || '';
        audioPlayer.play({
          arabic: ar,
          mode: 'tts',
          key: `spiral_${ar}`,
          buttonEl: /** @type {HTMLElement} */ (e.currentTarget),
          onNotify: callbacks.onNotify
        });
      });
    });

    mount.querySelector('#spiral-nav-exam')?.addEventListener('click', () => {
      if (callbacks.onOpenExam) callbacks.onOpenExam('vol1');
      else callbacks.onOpenRoute?.('#exam/vol1');
    });
    mount.querySelector('#spiral-nav-mushaf')?.addEventListener('click', () => {
      if (callbacks.onOpenRoute) callbacks.onOpenRoute('#mushaf-check');
      else this.renderMushafShowcase(mount, callbacks);
    });
    mount.querySelector('#spiral-back-lesson')?.addEventListener('click', () => {
      callbacks.onNavigateLesson?.(store.currentUnit, store.currentLesson);
    });
  }
}

export const examsCtrl = new ExamsController();
