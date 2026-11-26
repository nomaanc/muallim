// @ts-check

/**
 * Muallim ul-Qur'an — Lesson & Card Renderer (v7.0)
 * Renders lesson sections in RTL row-by-row grids, Student Mode zero-CLS
 * tap-to-peek, '/' Clause-by-Clause Stepper, inline custom note editor,
 * Surah:Ayah ref badges, optional Root & Transliteration hints, sticky
 * Section Jump & Filter Bar, and accessible SVG Lightbox.
 */

import { store } from './store.js';
import { audioPlayer } from './audio.js';
import { loadVisual, destroyVisual } from '../visuals/loader.js';

let _svgScopeSeq = 0;

const ICONS = {
  play: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
  stop: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  speaker: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
  star: '<svg class="icon-star" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  bookmark: '<svg class="icon-bookmark" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
  note: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
  expand: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
  chevronLeft: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>',
  chevronRight: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>',
  arrowLeft: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
  arrowRight: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>'
};

/**
 * @param {string} val
 * @returns {string}
 */
export function escHtml(val) {
  return String(val || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Normalize legacy terminology cleanly ("Stage" -> "Unit", "Mashq" -> "Exercise").
 * @param {string} text
 * @returns {string}
 */
function sanitizeCopy(text) {
  return String(text || '')
    .replace(/\bStage\s*(\d+)/gi, 'Unit $1')
    .replace(/\bMashq\b/gi, 'Exercise');
}

/**
 * Safely render Arabic markup allowing ONLY root/nonroot spans and &nbsp;.
 * Escapes all other HTML to prevent XSS while rendering textbook markup cleanly.
 * @param {string} raw
 * @returns {string}
 */
export function renderSafeArabicMarkup(raw) {
  const tokens = [];
  const withPlaceholders = String(raw || '')
    .replace(/<span\s+class="(arabic-root|nonroot)">/gi, (_, cls) => {
      const idx = tokens.push(`<span class="${cls.toLowerCase()}">`) - 1;
      return `@@TOK${idx}@@`;
    })
    .replace(/<\/span>/gi, () => {
      const idx = tokens.push('</span>') - 1;
      return `@@TOK${idx}@@`;
    })
    .replace(/&nbsp;/gi, () => {
      const idx = tokens.push('&nbsp;') - 1;
      return `@@TOK${idx}@@`;
    });
  return escHtml(withPlaceholders).replace(/@@TOK(\d+)@@/g, (_, n) => tokens[Number(n)] || '');
}

/**
 * Strip dangerous SVG elements/attributes (<script>, <foreignObject>, on* handlers, javascript: URIs).
 * @param {string} svgMarkup
 * @returns {string}
 */
function sanitizeSvgMarkup(svgMarkup) {
  return String(svgMarkup || '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<script\b[^>]*\/?>/gi, '')
    .replace(/<foreignObject\b[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/<foreignObject\b[^>]*\/?>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|xlink:href)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '');
}

/**
 * Scope SVG <linearGradient>, <radialGradient>, <filter>, <clipPath>, <mask>, <pattern>
 * (and any element IDs inside the SVG) uniquely per render or lightbox clone.
 * @param {string} svgMarkup
 * @param {string} prefix
 * @returns {string}
 */
function scopeSvgIds(svgMarkup, prefix) {
  const ids = new Set();
  const idRe = /\bid\s*=\s*(["'])([^"']+)\1/gi;
  let m;
  while ((m = idRe.exec(svgMarkup)) !== null) {
    if (m[2]) ids.add(m[2]);
  }
  if (ids.size === 0) return svgMarkup;

  let out = svgMarkup;
  for (const oldId of ids) {
    const newId = `${prefix}${oldId}`;
    const escId = oldId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out
      .replace(new RegExp(`\\bid\\s*=\\s*(["'])${escId}\\1`, 'g'), `id="${newId}"`)
      .replace(new RegExp(`url\\(#${escId}\\)`, 'g'), `url(#${newId})`)
      .replace(new RegExp(`((?:xlink:)?href)\\s*=\\s*(["'])#${escId}\\2`, 'g'), `$1="${'#' + newId}"`);
  }
  return out;
}

/**
 * Split safe Arabic markup into `/` clause segments while keeping `<span>` tags balanced.
 * @param {string} safeHtml
 * @returns {string[]}
 */
function splitSafeMarkupClauses(safeHtml) {
  const str = String(safeHtml || '');
  // Match '/' delimiters outside closing tags like </span>
  const tokens = str.split(/(<[^>]+>|\s+\/\/?\s+)/g).filter(Boolean);
  /** @type {string[]} */
  const clauses = [];
  let buf = '';
  /** @type {string[]} */
  const openStack = [];

  for (const tok of tokens) {
    if (/^<span\b[^>]*>$/i.test(tok)) {
      openStack.push(tok);
      buf += tok;
    } else if (/^<\/span>$/i.test(tok)) {
      openStack.pop();
      buf += tok;
    } else if (/^\s+\/\/?\s+$/.test(tok)) {
      const closing = '</span>'.repeat(openStack.length);
      const trimmed = `${buf}${closing}`.trim();
      if (trimmed) clauses.push(trimmed);
      buf = openStack.join('');
    } else {
      buf += tok;
    }
  }
  const tail = `${buf}${'</span>'.repeat(openStack.length)}`.trim();
  if (tail) clauses.push(tail);
  return clauses;
}

/**
 * Format page numbers cleanly (e.g. [56, 57, 58] -> "56–58").
 * @param {any} raw
 * @returns {string}
 */
function formatPageLabel(raw) {
  if (Array.isArray(raw)) {
    const nums = raw.map(Number).filter(Number.isFinite);
    if (nums.length === 0) return '';
    if (nums.length === 1) return String(nums[0]);
    const isContiguous = nums.every((n, i) => i === 0 || n === nums[i - 1] + 1);
    return isContiguous ? `${nums[0]}–${nums[nums.length - 1]}` : nums.join(', ');
  }
  return String(raw || '');
}

/**
 * Wrap a concept SVG block in a mobile-legible horizontal-pan card with an Expand button.
 * @param {string} svgMarkup
 * @returns {string}
 */
function wrapConceptSvg(svgMarkup) {
  const safeSvg = scopeSvgIds(sanitizeSvgMarkup(svgMarkup), `svg_${++_svgScopeSeq}_`);
  return `
    <div class="concept-svg-card">
      <div class="concept-svg-bar">
        <span class="concept-svg-label">Concept Diagram</span>
        <span class="concept-svg-hint">Swipe or expand</span>
        <button type="button" class="btn-ghost btn-sm concept-svg-expand-btn" data-action="expand-svg" aria-label="Expand concept diagram">${ICONS.expand}<span>Expand</span></button>
      </div>
      <div class="concept-svg-scroll" tabindex="0" aria-label="Scrollable concept diagram">${safeSvg}</div>
    </div>
  `;
}

/**
 * Format rule_paragraph text: preserve embedded .lesson-concept-svg or bare <svg>
 * blocks while converting simple Markdown **bold** and `code` tokens cleanly.
 * @param {string} raw
 * @returns {string}
 */
function formatRuleContent(raw) {
  const txt = sanitizeCopy(raw);
  const formatProse = (prose) => {
    if (!prose) return '';
    const formatted = escHtml(prose)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
    return `<div class="rule-body-text">${formatted}</div>`;
  };

  // Case 1: <div class="lesson-concept-svg"...>...</div>
  const divMatch = txt.match(/<div\s+class="lesson-concept-svg"[^>]*>[\s\S]*?<\/div>/i);
  if (divMatch && divMatch.index !== undefined) {
    const before = txt.slice(0, divMatch.index).trim();
    const svgInnerMatch = divMatch[0].match(/<svg[\s\S]*?<\/svg>/i);
    const svgMarkup = svgInnerMatch ? svgInnerMatch[0] : divMatch[0];
    const after = txt.slice(divMatch.index + divMatch[0].length).trim();
    return `${formatProse(before)}${wrapConceptSvg(svgMarkup)}${formatProse(after)}`;
  }

  // Case 2: Bare <svg ...>...</svg>
  const svgMatch = txt.match(/<svg\b[\s\S]*?<\/svg>/i);
  if (svgMatch && svgMatch.index !== undefined) {
    const before = txt.slice(0, svgMatch.index).trim();
    const after = txt.slice(svgMatch.index + svgMatch[0].length).trim();
    return `${formatProse(before)}${wrapConceptSvg(svgMatch[0])}${formatProse(after)}`;
  }

  return escHtml(txt)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

/**
 * Render an SVG Unit Mastery Ring.
 * @param {number} pct
 * @param {number} completed
 * @param {number} total
 * @returns {string}
 */
export function renderMasteryRing(pct, completed, total) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, Math.max(0, pct)) / 100) * circ;
  return `
    <div class="mastery-ring-wrap" title="Unit mastery: ${completed} of ${total} lessons completed">
      <svg class="mastery-ring-svg" viewBox="0 0 36 36" aria-hidden="true">
        <circle class="mastery-ring-track" cx="18" cy="18" r="${r}"/>
        <circle class="mastery-ring-fill" cx="18" cy="18" r="${r}"
          stroke-dasharray="${circ.toFixed(2)}"
          stroke-dashoffset="${offset.toFixed(2)}"/>
      </svg>
      <div class="mastery-ring-text tabular-nums">
        <span class="mastery-ring-pct">${pct}%</span>
        <span class="mastery-ring-sub">${completed}/${total}</span>
      </div>
    </div>
  `;
}

/**
 * Render exact-height loading skeleton matching banner + visual + grid.
 * @param {HTMLElement} mount
 */
export function renderLessonSkeleton(mount) {
  mount.innerHTML = `
    <div class="lesson-skeleton" aria-busy="true" aria-label="Loading lesson">
      <div class="skeleton-block skeleton-banner"></div>
      <div class="skeleton-block skeleton-visual"></div>
      <div class="skeleton-grid">
        <div class="skeleton-block skeleton-card"></div>
        <div class="skeleton-block skeleton-card"></div>
        <div class="skeleton-block skeleton-card"></div>
        <div class="skeleton-block skeleton-card"></div>
      </div>
    </div>
  `;
}

/**
 * Render explicit error recovery state.
 * @param {HTMLElement} mount
 * @param {string} detail
 * @param {() => void} onRetry
 */
export function renderLessonError(mount, detail, onRetry) {
  mount.innerHTML = `
    <div class="error-banner" role="alert">
      <div class="error-banner-title">Could not load this lesson</div>
      <p class="error-banner-desc">${escHtml(detail)}. Check your connection or cached files, then retry.</p>
      <button type="button" class="btn-primary" id="lesson-retry-btn">Retry Loading Lesson</button>
    </div>
  `;
  mount.querySelector('#lesson-retry-btn')?.addEventListener('click', onRetry);
}

/**
 * Render Resume where you left off / Bookmark banner.
 * Accepts either a single candidate or { sessionCandidate, bookmarkCandidate }.
 * @param {HTMLElement} mount
 * @param {any} candidateOrPair
 * @param {(unit: number, lesson: number, itemKey?: string) => void} onResume
 * @param {() => void} onDismiss
 */
export function renderResumeBanner(mount, candidateOrPair, onResume, onDismiss) {
  if (!candidateOrPair) {
    mount.innerHTML = '';
    return;
  }

  let sessionCand = null;
  let bookmarkCand = null;
  if ('sessionCandidate' in candidateOrPair || 'bookmarkCandidate' in candidateOrPair) {
    sessionCand = candidateOrPair.sessionCandidate || null;
    bookmarkCand = candidateOrPair.bookmarkCandidate || null;
  } else {
    sessionCand = candidateOrPair;
  }

  const primary = sessionCand || bookmarkCand;
  if (!primary) {
    mount.innerHTML = '';
    return;
  }

  const primaryTitle = sanitizeCopy(primary.label || `Unit ${primary.unit}, Lesson ${primary.lesson}`);
  const showBookmarkPill = bookmarkCand && bookmarkCand.itemId;

  mount.innerHTML = `
    <div class="resume-banner" role="region" aria-label="Resume study">
      <div class="resume-banner-text">
        <span class="resume-banner-label">${sessionCand ? 'Resume where you left off' : 'Saved bookmark'}</span>
        <span class="resume-banner-title tabular-nums">Unit ${primary.unit}, Lesson ${primary.lesson}: ${escHtml(primaryTitle)}</span>
      </div>
      <div class="resume-banner-actions">
        ${showBookmarkPill ? `
          <button type="button" class="btn-secondary btn-sm" id="btn-resume-bookmark">Jump to Bookmark</button>
        ` : ''}
        <button type="button" class="btn-primary btn-sm" id="btn-resume-go">Resume</button>
        <button type="button" class="icon-btn" id="btn-resume-dismiss" aria-label="Dismiss resume banner">✕</button>
      </div>
    </div>
  `;

  mount.querySelector('#btn-resume-go')?.addEventListener('click', () => {
    onResume(primary.unit, primary.lesson, primary.itemId || undefined);
  });
  mount.querySelector('#btn-resume-bookmark')?.addEventListener('click', () => {
    if (bookmarkCand) onResume(bookmarkCand.unit, bookmarkCand.lesson, bookmarkCand.itemId);
  });
  mount.querySelector('#btn-resume-dismiss')?.addEventListener('click', onDismiss);
}

/**
 * Build Root & Transliteration Hint HTML for a card slot.
 * @param {{tr?: string, root?: string} | null | undefined} meta
 * @returns {string}
 */
export function buildHintRowHtml(meta) {
  if (!meta || (!meta.tr && !meta.root)) return '';
  const parts = [];
  if (meta.tr) {
    parts.push(`<span class="hint-tr-chip">${escHtml(meta.tr)}</span>`);
  }
  if (meta.root) {
    const rootTxt = String(meta.root).trim();
    parts.push(
      `<a href="#spiral/root/${encodeURIComponent(rootTxt)}" class="hint-root-pill" data-action="open-root" data-root="${escHtml(rootTxt)}" title="Explore cognate words for root ${escHtml(rootTxt)}">Root: <span dir="rtl" lang="ar">${escHtml(rootTxt)}</span></a>`
    );
  }
  return parts.join('');
}

/**
 * Update Root & Transliteration Hint rows in place without re-rendering the lesson.
 * @param {HTMLElement} mount
 * @param {number} unit
 * @param {number} lessonId
 * @param {(u: number, l: number, id: any) => ({tr?: string, root?: string} | null)} [getItemMeta]
 */
export function updateLessonHintsInPlace(mount, unit, lessonId, getItemMeta) {
  const show = Boolean(store.showHints);
  mount.querySelectorAll('[data-hints-slot]').forEach(slot => {
    const el = /** @type {HTMLElement} */ (slot);
    if (!show || typeof getItemMeta !== 'function') {
      el.hidden = true;
      el.innerHTML = '';
      return;
    }
    const itemId = el.getAttribute('data-item-id') || '';
    const meta = itemId ? getItemMeta(unit, lessonId, itemId) : null;
    const html = buildHintRowHtml(meta);
    if (html) {
      el.innerHTML = html;
      el.hidden = false;
    } else {
      el.innerHTML = '';
      el.hidden = true;
    }
  });
}

/**
 * Sync tabindex="0" and role="button" on .gloss-box dynamically with Student Mode.
 * @param {HTMLElement} mount
 * @param {'teacher' | 'student'} mode
 */
export function syncGlossBoxModeAttributes(mount, mode) {
  const isStudent = mode === 'student';
  mount.querySelectorAll('.gloss-box').forEach(box => {
    if (isStudent) {
      box.setAttribute('tabindex', '0');
      box.setAttribute('role', 'button');
      box.setAttribute('aria-label', 'Translation gloss (tap to peek in Student Mode)');
    } else {
      box.removeAttribute('tabindex');
      box.removeAttribute('role');
      box.removeAttribute('aria-label');
    }
  });
}

/**
 * Update star buttons in place across the active lesson view.
 * @param {HTMLElement} mount
 */
export function syncCardStarsInPlace(mount) {
  mount.querySelectorAll('[data-action="toggle-star"]').forEach(btn => {
    const key = btn.getAttribute('data-item-key') || '';
    const legacy = btn.getAttribute('data-legacy-key') || undefined;
    const starred = store.isStarred(key, legacy);
    btn.classList.toggle('starred', starred);
    btn.setAttribute('aria-pressed', String(starred));
    btn.setAttribute('aria-label', starred ? 'Remove star' : 'Star this item');
  });
}

/**
 * Update bookmark classes and buttons in place across the active lesson view.
 * @param {HTMLElement} mount
 */
export function syncCardBookmarksInPlace(mount) {
  const bmId = store.bookmark?.itemId || '';
  mount.querySelectorAll('[data-action="toggle-bookmark"]').forEach(btn => {
    const key = btn.getAttribute('data-item-key') || '';
    const legacy = btn.getAttribute('data-legacy-key') || '';
    const isBm = Boolean(bmId && (bmId === key || (legacy && bmId === legacy)));
    btn.classList.toggle('bookmarked', isBm);
    btn.setAttribute('aria-pressed', String(isBm));
    btn.closest('.vocab-card, .paired-card')?.classList.toggle('is-bookmarked', isBm);
  });
}

/**
 * Update custom note lines in place across the active lesson view.
 * @param {HTMLElement} mount
 */
export function syncCardNotesInPlace(mount) {
  mount.querySelectorAll('.vocab-card, .paired-card').forEach(card => {
    const key = card.getAttribute('data-card-key') || '';
    const legacy = card.getAttribute('data-legacy-key') || undefined;
    const val = key ? store.getCustomNote(key, legacy) : '';
    const content = card.querySelector('.gloss-content');
    if (!content) return;
    const existing = content.querySelector('.custom-note-line');
    if (val) {
      if (existing) {
        const txtSpan = existing.querySelector('.custom-note-text');
        if (txtSpan) txtSpan.textContent = val;
      } else {
        const line = document.createElement('div');
        line.className = 'custom-note-line';
        line.innerHTML = `<span class="custom-badge">note</span> <span class="custom-note-text">${escHtml(val)}</span>`;
        content.appendChild(line);
      }
    } else if (existing) {
      existing.remove();
    }
  });
}

/**
 * Update completion button and mastery ring in place without re-rendering.
 * @param {HTMLElement} mount
 * @param {number} unit
 * @param {number} lessonId
 */
export function syncCompletionInPlace(mount, unit, lessonId) {
  const isDone = store.isLessonCompleted(unit, lessonId);
  const btn = mount.querySelector('#btn-toggle-complete');
  if (btn) {
    btn.setAttribute('aria-pressed', String(isDone));
    btn.innerHTML = `<span aria-hidden="true">${isDone ? '✓' : '○'}</span><span>${isDone ? 'Completed' : 'Mark Complete'}</span>`;
  }
  const ring = mount.querySelector('.lesson-banner .mastery-ring-wrap');
  if (ring) {
    const mastery = store.getUnitMastery(unit);
    ring.outerHTML = renderMasteryRing(mastery.pct, mastery.completed, mastery.total);
  }
}

/** @type {WeakMap<HTMLElement, AbortController>} */
const _mountListeners = new WeakMap();

/**
 * Render an entire lesson into #lesson-content-mount and bind interactive card controls.
 * @param {{
 *   unit: number,
 *   lesson: any,
 *   mount: HTMLElement,
 *   bottomNavMount: HTMLElement,
 *   onOpenPractice: (mode: 'quiz' | 'morph') => void,
 *   onPrevLesson: () => void,
 *   onNextLesson: () => void,
 *   onNotify: (msg: string) => void,
 *   getItemMeta?: (u: number, l: number, id: any) => ({tr?: string, root?: string} | null)
 * }} opts
 */
export async function renderLessonView(opts) {
  const { unit, lesson, mount, bottomNavMount, onOpenPractice, onPrevLesson, onNextLesson, onNotify, getItemMeta } = opts;
  if (!lesson) {
    renderLessonError(mount, `Lesson ${store.currentLesson} in Unit ${unit} was not found`, onPrevLesson);
    return;
  }

  const prevCtrl = _mountListeners.get(mount);
  if (prevCtrl) prevCtrl.abort();
  const ac = new AbortController();
  _mountListeners.set(mount, ac);

  destroyVisual('grammar-visual-mount');

  const lid = Number(lesson.lesson_id);
  const lang = store.lang;
  const isUrdu = lang === 'ur';
  const rawTitle = (lesson.title_i18n && lesson.title_i18n[lang]) || lesson.title || `Unit ${unit} Lesson ${lid}`;
  const title = sanitizeCopy(rawTitle);
  const focusAr = lesson.arabic_Focus || '';
  const pageLabel = formatPageLabel(lesson.page_numbers) || formatPageLabel(lesson.book_page) || formatPageLabel(lesson.page_start) || '';
  const isDone = store.isLessonCompleted(unit, lid);
  const mastery = store.getUnitMastery(unit);

  /** @type {Map<string, {item: any, legacyKey?: string, sIdx: number, iIdx: number}>} */
  const itemRegistry = new Map();
  /** @type {Array<{arabic: string, ref: string, key: string}>} */
  const audioQueue = [];
  /** @type {Array<{id: string, label: string}>} */
  const sectionLabels = [];
  let totalItemsCount = 0;
  let sectionsHtml = '';

  (lesson.sections || []).forEach((sec, sIdx) => {
    const secType = sec.type;
    const d = sec.data || {};

    if (secType === 'hero_header') {
      const heroAr = d.arabic_combined || d.arabic || d.arabic_word || sec.arabic_combined || sec.arabic || '';
      const heroSub = store.getTranslation(d) || d.hinglish_combined || d.hinglish || d.title_en || d.subtitle || '';
      if (heroAr || heroSub) {
        sectionsHtml += `
          <section class="hero-section">
            ${heroAr ? `<div class="hero-arabic">${renderSafeArabicMarkup(heroAr)}</div>` : ''}
            ${heroSub ? `<div class="hero-hinglish">${escHtml(sanitizeCopy(heroSub))}</div>` : ''}
          </section>
        `;
      }
      return;
    }

    if (secType === 'rule_paragraph') {
      const text = d.text || d.content || sec.text || sec.content || '';
      const rTitle = d.title ? `<div class="rule-title">${escHtml(sanitizeCopy(d.title))}</div>` : '';
      sectionsHtml += `<section class="rule-card">${rTitle}${formatRuleContent(text)}</section>`;
      return;
    }

    if (secType === 'grace_box') {
      const gText = d.text || '';
      sectionsHtml += `<aside class="grace-card">${escHtml(sanitizeCopy(gText))}</aside>`;
      return;
    }

    if (secType === 'section_label') {
      const lbl = sanitizeCopy(d.text || d.title || d.label || sec.text || '');
      if (lbl) {
        const secDomId = `sec-u${unit}l${lid}-${sIdx}`;
        sectionLabels.push({ id: secDomId, label: lbl });
        sectionsHtml += `<div class="section-label-divider" id="${secDomId}"><span>${escHtml(lbl)}</span></div>`;
      }
      return;
    }

    if (secType === 'intro_table') {
      const headers = Array.isArray(d.headers) ? d.headers : (Array.isArray(sec.headers) ? sec.headers : []);
      const rows = Array.isArray(d.rows) ? d.rows : (Array.isArray(sec.rows) ? sec.rows : []);
      const cap = sanitizeCopy(d.caption || d.title || sec.title || '');
      sectionsHtml += '<div class="intro-table-wrap"><table class="intro-table">';
      if (cap) sectionsHtml += `<caption>${escHtml(cap)}</caption>`;
      if (headers.length > 0) {
        sectionsHtml += `<thead><tr>${headers.map(h => `<th>${escHtml(sanitizeCopy(String(h)))}</th>`).join('')}</tr></thead>`;
      }
      sectionsHtml += '<tbody>';
      for (const row of rows) {
        const cells = Array.isArray(row) ? row : Object.values(row || {});
        sectionsHtml += `<tr>${cells.map(c => {
          const s = sanitizeCopy(String(c ?? ''));
          const isAr = /[\u0600-\u06FF]/.test(s);
          return `<td${isAr ? ' class="is-arabic-cell" dir="rtl"' : ''}>${escHtml(s)}</td>`;
        }).join('')}</tr>`;
      }
      sectionsHtml += '</tbody></table></div>';
      return;
    }

    if (
      secType === 'two_col_numbered_list' ||
      secType === 'three_col_numbered_list' ||
      secType === 'verse_block' ||
      secType === 'exercise_verses' ||
      secType === 'tashbeeh_grid' ||
      secType === 'ayah_pause_block'
    ) {
      const defaultCols = secType === 'three_col_numbered_list' ? 3 : (secType === 'verse_block' || secType === 'exercise_verses' ? 1 : 2);
      const rawCols = Number(d.cols || sec.cols || defaultCols);
      const cols = Math.min(5, Math.max(1, Number.isFinite(rawCols) ? rawCols : defaultCols));
      const secFullWidth = Boolean(d.full_width || sec.full_width);
      const rawItems = Array.isArray(d.items) ? d.items : (Array.isArray(d.verses) ? d.verses : []);
      const items = rawItems.some(it => it && it.displayOrder !== undefined)
        ? [...rawItems].sort((a, b) => (a.displayOrder ?? 999999) - (b.displayOrder ?? 999999))
        : rawItems;

      sectionsHtml += `<div class="bidi-grid cols-${cols}">`;
      let i = 0;
      while (i < items.length) {
        const it = items[i];
        if (it && it.display_mode === 'paired' && it.pair_role === 'root' && items[i + 1]?.pair_role === 'derived') {
          const rootIt = it;
          const derIt = items[i + 1];
          const rootKey = store.getItemKey(unit, lid, rootIt, sIdx, i);
          const derKey = store.getItemKey(unit, lid, derIt, sIdx, i + 1);
          const legacyKey = `S${unit}L${lid}_s${sIdx}_${i + 1}`;
          itemRegistry.set(rootKey, { item: rootIt, sIdx, iIdx: i });
          itemRegistry.set(derKey, { item: derIt, legacyKey, sIdx, iIdx: i + 1 });
          if (derIt.arabic && !String(derIt.arabic).includes('----')) {
            audioQueue.push({ arabic: derIt.arabic, ref: derIt.ref || '', key: derKey });
          }
          totalItemsCount += 2;
          const fullCls = (secFullWidth || rootIt.full_width || derIt.full_width) ? 'is-full-width' : '';
          sectionsHtml += _renderPairedCard(rootIt, derIt, rootKey, derKey, legacyKey, fullCls, isUrdu, unit, lid, getItemMeta);
          i += 2;
        } else {
          const itemKey = store.getItemKey(unit, lid, it, sIdx, i);
          const legacyKey = `S${unit}L${lid}_s${sIdx}_${i}`;
          itemRegistry.set(itemKey, { item: it, legacyKey, sIdx, iIdx: i });
          if (it.arabic && !String(it.arabic).includes('----')) {
            audioQueue.push({ arabic: it.arabic, ref: it.ref || '', key: itemKey });
          }
          totalItemsCount += 1;
          const fullCls = (secFullWidth || it.full_width) ? 'is-full-width' : '';
          sectionsHtml += _renderVocabCard(it, itemKey, legacyKey, fullCls, isUrdu, unit, lid, getItemMeta);
          i += 1;
        }
      }
      sectionsHtml += '</div>';
    }
  });

  const showToolbar = totalItemsCount >= 15 || sectionLabels.length >= 2;
  const toolbarHtml = showToolbar ? `
    <div class="lesson-toolbar" role="region" aria-label="Lesson section jump, card filters, and continuous audio">
      <div class="toolbar-filters" role="group" aria-label="Filter lesson cards">
        <button type="button" class="filter-pill active" data-filter-cards="all" aria-pressed="true">All</button>
        <button type="button" class="filter-pill" data-filter-cards="starred" aria-pressed="false">Starred</button>
        <button type="button" class="filter-pill" data-filter-cards="unpeeked" aria-pressed="false">Unpeeked</button>
      </div>
      <div class="toolbar-controls">
        ${sectionLabels.length >= 1 ? `
          <select id="toolbar-section-jump" class="select-input toolbar-jump-select" aria-label="Jump to section">
            <option value="">Jump to section (${sectionLabels.length})</option>
            ${sectionLabels.map(s => `<option value="${escHtml(s.id)}">${escHtml(s.label)}</option>`).join('')}
          </select>
        ` : ''}
        <button type="button" id="btn-play-lesson" class="btn-secondary btn-sm toolbar-play-btn" aria-pressed="false">
          ${ICONS.play}
          <span>Play Lesson</span>
        </button>
      </div>
    </div>
  ` : '';

  const html = `
    <section class="lesson-banner" aria-label="Lesson header">
      <div class="lesson-banner-top">
        <div>
          <div class="lesson-meta-line tabular-nums">Unit ${unit}, Lesson ${lid}${pageLabel ? `: Pages ${escHtml(String(pageLabel))}` : ''}</div>
          <h1 class="lesson-banner-title" ${isUrdu && lesson.title_i18n?.ur ? 'dir="rtl" lang="ur"' : ''}>${escHtml(title)}</h1>
          ${focusAr ? `<div class="lesson-focus-chip" dir="rtl">${escHtml(focusAr)}</div>` : ''}
        </div>
        ${renderMasteryRing(mastery.pct, mastery.completed, mastery.total)}
      </div>

      <div class="lesson-banner-actions">
        <button type="button" id="btn-toggle-complete" class="completion-toggle" aria-pressed="${isDone}">
          <span aria-hidden="true">${isDone ? '✓' : '○'}</span>
          <span>${isDone ? 'Completed' : 'Mark Complete'}</span>
        </button>

        <div class="lesson-action-group">
          ${unit >= 5 ? `<button type="button" id="btn-open-morph" class="btn-secondary btn-sm">Morphology Builder</button>` : ''}
          <button type="button" id="btn-open-practice" class="btn-primary btn-sm">Practice Quiz</button>
        </div>
      </div>
    </section>

    <div id="grammar-visual-mount"></div>

    ${toolbarHtml}

    <div id="lesson-sections-body">
      ${sectionsHtml}
      <div id="lesson-filter-empty" class="empty-state" hidden>
        <div class="empty-state-title">No cards match this filter</div>
        <p class="empty-state-desc">Try switching back to All cards to see every item in this lesson.</p>
        <button type="button" class="btn-secondary btn-sm" id="btn-reset-card-filter">Show All Cards</button>
      </div>
    </div>
  `;

  mount.innerHTML = html;

  // Bind Lesson Header Controls
  mount.querySelector('#btn-toggle-complete')?.addEventListener('click', () => {
    const nowDone = store.toggleLessonComplete(unit, lid);
    onNotify(nowDone ? `Unit ${unit} Lesson ${lid} marked complete.` : 'Completion unmarked.');
  });
  mount.querySelector('#btn-open-practice')?.addEventListener('click', () => onOpenPractice('quiz'));
  mount.querySelector('#btn-open-morph')?.addEventListener('click', () => onOpenPractice('morph'));

  // Bind Toolbar: Filter Pills, Section Jump, Continuous Play Lesson
  let activeFilter = 'all';
  const applyCardFilter = (mode) => {
    activeFilter = mode;
    mount.querySelectorAll('[data-filter-cards]').forEach(b => {
      const on = b.getAttribute('data-filter-cards') === mode;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    let visibleCount = 0;
    mount.querySelectorAll('.vocab-card, .paired-card').forEach(card => {
      const el = /** @type {HTMLElement} */ (card);
      let match = true;
      if (mode === 'starred') {
        const k1 = el.getAttribute('data-card-key') || '';
        const k2 = el.getAttribute('data-root-key') || '';
        const leg = el.getAttribute('data-legacy-key') || undefined;
        match = store.isStarred(k1, leg) || (k2 ? store.isStarred(k2) : false);
      } else if (mode === 'unpeeked') {
        const box = el.querySelector('.gloss-box');
        match = Boolean(box && !box.classList.contains('is-peeked'));
      }
      el.hidden = !match;
      if (match) visibleCount++;
    });
    mount.querySelectorAll('.bidi-grid').forEach(grid => {
      const g = /** @type {HTMLElement} */ (grid);
      const hasVisible = Array.from(g.children).some(c => !/** @type {HTMLElement} */ (c).hidden);
      g.hidden = !hasVisible;
    });
    const emptyNotice = /** @type {HTMLElement | null} */ (mount.querySelector('#lesson-filter-empty'));
    if (emptyNotice) emptyNotice.hidden = visibleCount > 0;
  };

  mount.querySelectorAll('[data-filter-cards]').forEach(btn => {
    btn.addEventListener('click', () => {
      applyCardFilter(btn.getAttribute('data-filter-cards') || 'all');
    });
  });

  mount.querySelector('#btn-reset-card-filter')?.addEventListener('click', () => {
    applyCardFilter('all');
  });

  const jumpSel = /** @type {HTMLSelectElement | null} */ (mount.querySelector('#toolbar-section-jump'));
  jumpSel?.addEventListener('change', () => {
    const targetId = jumpSel.value;
    if (!targetId) return;
    const targetEl = document.getElementById(targetId);
    targetEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    jumpSel.selectedIndex = 0;
  });

  const playLessonBtn = /** @type {HTMLButtonElement | null} */ (mount.querySelector('#btn-play-lesson'));
  let lessonQueueActive = false;
  const setPlayLessonState = (active) => {
    lessonQueueActive = active;
    if (!playLessonBtn) return;
    playLessonBtn.setAttribute('aria-pressed', String(active));
    playLessonBtn.classList.toggle('is-playing', active);
    playLessonBtn.innerHTML = active
      ? `${ICONS.stop}<span>Stop Audio</span>`
      : `${ICONS.play}<span>Play Lesson</span>`;
    if (!active) {
      mount.querySelectorAll('.is-audio-focused').forEach(el => el.classList.remove('is-audio-focused'));
    }
  };

  playLessonBtn?.addEventListener('click', () => {
    if (lessonQueueActive) {
      audioPlayer.stop();
      setPlayLessonState(false);
      return;
    }
    if (audioQueue.length === 0) {
      onNotify('No playable Arabic items found in this lesson.');
      return;
    }
    if (typeof audioPlayer.playLessonQueue !== 'function') {
      const first = audioQueue[0];
      audioPlayer.play({
        arabic: first.arabic,
        ref: first.ref,
        key: first.key,
        buttonEl: playLessonBtn,
        onNotify
      });
      return;
    }
    setPlayLessonState(true);
    audioPlayer.playLessonQueue(audioQueue, {
      onCardFocus: (key) => {
        mount.querySelectorAll('.is-audio-focused').forEach(el => el.classList.remove('is-audio-focused'));
        if (!key) return;
        const card = mount.querySelector(`[data-card-key="${CSS.escape(key)}"]`);
        if (card) {
          card.classList.add('is-audio-focused');
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      },
      onStateChange: (state) => {
        const playing = state === true || state === 'playing' || state === 'loading';
        setPlayLessonState(playing);
      },
      onNotify
    });
  });

  // Event delegation for vocab & paired cards
  mount.addEventListener('click', (ev) => {
    const target = /** @type {HTMLElement | null} */ (ev.target);
    if (!target) return;

    const expandSvgBtn = target.closest('[data-action="expand-svg"]');
    if (expandSvgBtn) {
      const svgEl = expandSvgBtn.closest('.concept-svg-card')?.querySelector('svg');
      if (svgEl) _openSvgLightbox(svgEl.outerHTML);
      return;
    }

    // Clause-by-Clause Verse Stepper chip click
    const clauseChip = target.closest('[data-action="clause-step"]');
    if (clauseChip) {
      const stepper = clauseChip.closest('.clause-stepper');
      const idx = clauseChip.getAttribute('data-clause-idx');
      if (stepper && idx !== null) {
        stepper.querySelectorAll('.clause-chip.is-active').forEach(c => {
          if (c !== clauseChip) c.classList.remove('is-active');
        });
        const willBeActive = !clauseChip.classList.contains('is-active');
        clauseChip.classList.toggle('is-active', willBeActive);
        clauseChip.setAttribute('aria-pressed', String(willBeActive));

        const trChip = stepper.querySelector(`[data-clause-tr-idx="${idx}"]`);
        stepper.querySelectorAll('.clause-tr-chip.is-active').forEach(t => {
          if (t !== trChip) t.classList.remove('is-active');
        });
        if (trChip) {
          trChip.classList.add('is-revealed');
          trChip.classList.toggle('is-active', willBeActive);
        }

        const total = Number(stepper.getAttribute('data-clause-total') || 0);
        const statusEl = stepper.querySelector('.clause-stepper-count');
        if (statusEl && total > 0) {
          statusEl.textContent = willBeActive ? `Clause ${Number(idx) + 1} of ${total}` : `${total} clauses`;
        }
      }
      return;
    }

    const clauseNextBtn = target.closest('[data-action="clause-next"]');
    if (clauseNextBtn) {
      const stepper = clauseNextBtn.closest('.clause-stepper');
      if (!stepper) return;
      const chips = Array.from(stepper.querySelectorAll('.clause-chip'));
      if (chips.length === 0) return;
      const curIdx = chips.findIndex(c => c.classList.contains('is-active'));
      const nextIdx = (curIdx + 1) % chips.length;
      /** @type {HTMLElement} */ (chips[nextIdx]).click();
      return;
    }

    const qariBtn = target.closest('[data-action="play-qari"]');
    if (qariBtn) {
      const key = qariBtn.getAttribute('data-item-key') || '';
      const entry = itemRegistry.get(key);
      if (entry) {
        audioPlayer.play({
          arabic: entry.item.arabic || '',
          ref: entry.item.ref || '',
          key,
          mode: 'qari',
          buttonEl: /** @type {HTMLElement} */ (qariBtn),
          onNotify
        });
      }
      return;
    }

    const ttsBtn = target.closest('[data-action="play-tts"], [data-action="play-audio"]');
    if (ttsBtn) {
      const key = ttsBtn.getAttribute('data-item-key') || '';
      const entry = itemRegistry.get(key);
      if (entry) {
        audioPlayer.play({
          arabic: entry.item.arabic || '',
          ref: '',
          key,
          mode: 'tts',
          buttonEl: /** @type {HTMLElement} */ (ttsBtn),
          onNotify
        });
      }
      return;
    }

    const starBtn = target.closest('[data-action="toggle-star"]');
    if (starBtn) {
      const key = starBtn.getAttribute('data-item-key') || '';
      const entry = itemRegistry.get(key);
      if (entry) {
        const nowStarred = store.toggleStar({
          key,
          arabic: entry.item.arabic || '',
          hinglish: store.getTranslation(entry.item),
          stage: unit,
          lesson: lid,
          ref: entry.item.ref || ''
        }, entry.legacyKey);
        starBtn.classList.toggle('starred', nowStarred);
        starBtn.setAttribute('aria-pressed', String(nowStarred));
        starBtn.setAttribute('aria-label', nowStarred ? 'Remove star' : 'Star this item');
        if (activeFilter === 'starred') applyCardFilter('starred');
      }
      return;
    }

    const bmBtn = target.closest('[data-action="toggle-bookmark"]');
    if (bmBtn) {
      const key = bmBtn.getAttribute('data-item-key') || '';
      const entry = itemRegistry.get(key);
      if (entry) {
        const isSet = store.toggleBookmark({
          stage: unit,
          lesson: lid,
          itemId: key,
          arabic: entry.item.arabic || ''
        });
        mount.querySelectorAll('[data-action="toggle-bookmark"].bookmarked').forEach(el => {
          el.classList.remove('bookmarked');
          el.setAttribute('aria-pressed', 'false');
          el.closest('.vocab-card, .paired-card')?.classList.remove('is-bookmarked');
        });
        if (isSet) {
          bmBtn.classList.add('bookmarked');
          bmBtn.setAttribute('aria-pressed', 'true');
          bmBtn.closest('.vocab-card, .paired-card')?.classList.add('is-bookmarked');
          onNotify('Bookmark saved.');
        } else {
          onNotify('Bookmark removed.');
        }
      }
      return;
    }

    const editBtn = target.closest('[data-action="edit-note"]');
    if (editBtn) {
      const key = editBtn.getAttribute('data-item-key') || '';
      const card = editBtn.closest('.vocab-card, .paired-card');
      const editorMount = card?.querySelector('[data-note-editor-slot]');
      const entry = itemRegistry.get(key);
      if (editorMount && entry) {
        _toggleInlineNoteEditor(/** @type {HTMLElement} */ (editorMount), key, entry.legacyKey);
      }
      return;
    }

    // Student Mode tap-to-peek on gloss box (or tapping Arabic text on vocab/paired card)
    if (store.mode === 'student') {
      const glossBox = target.closest('.gloss-box');
      if (glossBox) {
        glossBox.classList.toggle('is-peeked');
        if (activeFilter === 'unpeeked') applyCardFilter('unpeeked');
        return;
      }
      const cardArabic = target.closest('.vocab-card .arabic-text, .paired-card .paired-card-ar');
      if (cardArabic) {
        const box = cardArabic.closest('.vocab-card, .paired-card')?.querySelector('.gloss-box');
        if (box) {
          box.classList.toggle('is-peeked');
          if (activeFilter === 'unpeeked') applyCardFilter('unpeeked');
        }
      }
    }
  }, { signal: ac.signal });

  // Keyboard activation (Enter + focused Space) on .gloss-box ONLY in Student Mode
  mount.addEventListener('keydown', (ev) => {
    if (store.mode !== 'student') return;
    const target = /** @type {HTMLElement | null} */ (ev.target);
    const glossBox = target?.closest('.gloss-box');
    if (!glossBox) return;
    if (ev.key === 'Enter' || ev.key === ' ' || ev.code === 'Space') {
      ev.preventDefault();
      ev.stopPropagation();
      glossBox.classList.toggle('is-peeked');
      if (activeFilter === 'unpeeked') applyCardFilter('unpeeked');
    }
  }, { signal: ac.signal });

  // Render Bottom Prev / Next Lesson Bar (SVG chevrons, no glued arrow text)
  const hasPrev = !(unit === 1 && lid === 1);
  const hasNext = !(unit === 7 && lid >= store.getUnitLessonCount(7));
  bottomNavMount.innerHTML = `
    <div class="bottom-nav-card">
      <button type="button" class="btn-secondary" id="btn-bottom-prev" ${!hasPrev ? 'disabled' : ''}>${ICONS.chevronLeft}<span>Previous Lesson</span></button>
      <button type="button" class="btn-primary" id="btn-bottom-next" ${!hasNext ? 'disabled' : ''}><span>Next Lesson</span>${ICONS.chevronRight}</button>
    </div>
  `;
  bottomNavMount.querySelector('#btn-bottom-prev')?.addEventListener('click', onPrevLesson);
  bottomNavMount.querySelector('#btn-bottom-next')?.addEventListener('click', onNextLesson);

  // Mount Grammar Visual cleanly
  const lKey = String(lesson.lesson_key || `s${unit}l${lid}`).toLowerCase();
  loadVisual(lKey, 'grammar-visual-mount').catch(err => {
    console.warn('[Renderer] Grammar visual skipped:', err);
  });
}

/**
 * Render Arabic display block, upgrading slash-segmented verses into interactive clause stepper.
 * @param {any} it
 * @param {string} gloss
 * @param {boolean} isUrdu
 * @returns {string}
 */
function _renderArabicOrStepper(it, gloss, isUrdu) {
  const rawAr = String(it.arabic || '');
  const safeArHtml = it.arabic_markup ? renderSafeArabicMarkup(it.arabic_markup) : escHtml(rawAr);

  if (!/\s+\/\/?\s+/.test(rawAr)) {
    return `<div class="arabic-text" dir="rtl">${safeArHtml}</div>`;
  }

  const arClauses = splitSafeMarkupClauses(safeArHtml);
  if (arClauses.length < 2) {
    return `<div class="arabic-text" dir="rtl">${safeArHtml}</div>`;
  }

  const trClauses = String(gloss || '').split(/\s+\/\/?\s+/).map(s => s.trim()).filter(Boolean);
  const hasMatchedTr = trClauses.length === arClauses.length;

  return `
    <div class="clause-stepper" data-clause-total="${arClauses.length}">
      <div class="clause-stepper-bar">
        <span class="clause-stepper-count tabular-nums">${arClauses.length} clauses</span>
        <button type="button" class="btn-ghost btn-sm clause-step-next-btn" data-action="clause-next">Step Clause</button>
      </div>
      <div class="clause-stepper-ar" dir="rtl" role="group" aria-label="Verse clauses">
        ${arClauses.map((clauseHtml, idx) => `
          <button type="button" class="clause-chip" data-action="clause-step" data-clause-idx="${idx}" aria-pressed="false">${clauseHtml}</button>
        `).join('<span class="clause-slash-sep" aria-hidden="true">/</span>')}
      </div>
      ${hasMatchedTr ? `
        <div class="clause-stepper-tr" ${isUrdu ? 'dir="rtl" lang="ur"' : 'dir="ltr"'} aria-label="Clause meanings">
          ${trClauses.map((trText, idx) => `
            <span class="clause-tr-chip" data-clause-tr-idx="${idx}">${escHtml(trText)}</span>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * @param {any} it
 * @param {string} itemKey
 * @param {string} legacyKey
 * @param {string} fullCls
 * @param {boolean} isUrdu
 * @param {number} unit
 * @param {number} lid
 * @param {(u: number, l: number, id: any) => ({tr?: string, root?: string} | null)} [getItemMeta]
 * @returns {string}
 */
function _renderVocabCard(it, itemKey, legacyKey, fullCls, isUrdu, unit, lid, getItemMeta) {
  const num = it.sentence_number || it.display_number || '';
  const starred = store.isStarred(itemKey, legacyKey);
  const bookmarked = Boolean(store.bookmark && (store.bookmark.itemId === itemKey || store.bookmark.itemId === legacyKey));
  const gloss = store.getTranslation(it);
  const customNote = store.getCustomNote(itemKey, legacyKey);
  const ref = it.ref || '';
  const studentAttrs = store.mode === 'student'
    ? ' tabindex="0" role="button" aria-label="Translation gloss (tap to peek in Student Mode)"'
    : '';
  const hintMeta = store.showHints && typeof getItemMeta === 'function' ? getItemMeta(unit, lid, it.id) : null;
  const hintHtml = store.showHints ? buildHintRowHtml(hintMeta) : '';

  return `
    <article class="vocab-card ${fullCls} ${bookmarked ? 'is-bookmarked' : ''}" data-card-key="${escHtml(itemKey)}" data-legacy-key="${escHtml(legacyKey)}">
      <div class="card-top">
        <div class="card-meta-badges">
          ${num ? `<span class="card-number tabular-nums">${escHtml(String(num))}</span>` : ''}
          ${ref ? `
            <button type="button" class="ref-badge-btn tabular-nums" data-action="play-qari" data-item-key="${escHtml(itemKey)}" aria-label="Play Ayah ${escHtml(ref)} (Qari Mishary Alafasy)" title="Recite Ayah ${escHtml(ref)}: Qari Mishary Alafasy">
              ${ICONS.play}
              <span>${escHtml(ref)}</span>
            </button>
          ` : ''}
        </div>
        <div class="card-actions">
          <button type="button" class="card-action-btn" data-action="play-tts" data-item-key="${escHtml(itemKey)}" aria-label="Listen via browser Arabic voice (TTS)" title="Browser Arabic TTS">${ICONS.speaker}</button>
          <button type="button" class="card-action-btn ${starred ? 'starred' : ''}" data-action="toggle-star" data-item-key="${escHtml(itemKey)}" data-legacy-key="${escHtml(legacyKey)}" aria-pressed="${starred}" aria-label="${starred ? 'Remove star' : 'Star this item'}" title="Star">${ICONS.star}</button>
          <button type="button" class="card-action-btn ${bookmarked ? 'bookmarked' : ''}" data-action="toggle-bookmark" data-item-key="${escHtml(itemKey)}" data-legacy-key="${escHtml(legacyKey)}" aria-pressed="${bookmarked}" aria-label="Bookmark this item" title="Bookmark">${ICONS.bookmark}</button>
        </div>
      </div>

      ${_renderArabicOrStepper(it, gloss, isUrdu)}

      <div class="card-hints-row" data-hints-slot="${escHtml(itemKey)}" data-item-id="${escHtml(String(it.id ?? ''))}" ${hintHtml ? '' : 'hidden'}>${hintHtml}</div>

      ${(gloss || customNote) ? `
        <div class="gloss-row">
          <div class="gloss-box"${studentAttrs}>
            <div class="gloss-content">
              <div class="gloss-text" ${isUrdu ? 'dir="rtl" lang="ur"' : 'dir="ltr"'}>${escHtml(gloss)}</div>
              ${customNote ? `<div class="custom-note-line"><span class="custom-badge">note</span> <span class="custom-note-text">${escHtml(customNote)}</span></div>` : ''}
            </div>
          </div>
          <button type="button" class="card-action-btn note-edit-trigger" data-action="edit-note" data-item-key="${escHtml(itemKey)}" aria-label="Add or edit personal note" title="Personal note">${ICONS.note}</button>
        </div>
      ` : ''}
      <div data-note-editor-slot="${escHtml(itemKey)}"></div>
    </article>
  `;
}

/**
 * @param {any} rootIt
 * @param {any} derIt
 * @param {string} rootKey
 * @param {string} derKey
 * @param {string} legacyKey
 * @param {string} fullCls
 * @param {boolean} isUrdu
 * @param {number} unit
 * @param {number} lid
 * @param {(u: number, l: number, id: any) => ({tr?: string, root?: string} | null)} [getItemMeta]
 * @returns {string}
 */
function _renderPairedCard(rootIt, derIt, rootKey, derKey, legacyKey, fullCls, isUrdu, unit, lid, getItemMeta) {
  const rootStarred = store.isStarred(rootKey);
  const derStarred = store.isStarred(derKey, legacyKey);
  const bookmarked = Boolean(store.bookmark && (store.bookmark.itemId === derKey || store.bookmark.itemId === rootKey || store.bookmark.itemId === legacyKey));
  const rootGloss = store.getTranslation(rootIt);
  const derGloss = store.getTranslation(derIt);
  const customNote = store.getCustomNote(derKey, legacyKey);
  const rootHtml = rootIt.arabic_markup ? renderSafeArabicMarkup(rootIt.arabic_markup) : escHtml(rootIt.arabic || '');
  const derHtml = derIt.arabic_markup
    ? renderSafeArabicMarkup(derIt.arabic_markup)
    : (derIt.arabic_suffix
      ? `<span class="arabic-root">${escHtml(derIt.arabic_root || '')}</span><span class="nonroot">${escHtml(derIt.arabic_suffix)}</span>`
      : escHtml(derIt.arabic || ''));
  const studentAttrs = store.mode === 'student'
    ? ' tabindex="0" role="button" aria-label="Translation gloss (tap to peek in Student Mode)"'
    : '';
  const hintMeta = store.showHints && typeof getItemMeta === 'function' ? getItemMeta(unit, lid, derIt.id) : null;
  const hintHtml = store.showHints ? buildHintRowHtml(hintMeta) : '';

  return `
    <article class="paired-card ${fullCls} ${bookmarked ? 'is-bookmarked' : ''}" data-card-key="${escHtml(derKey)}" data-root-key="${escHtml(rootKey)}" data-legacy-key="${escHtml(legacyKey)}">
      <div class="card-top">
        <div class="card-meta-badges">
          ${derIt.ref ? `<button type="button" class="ref-badge-btn tabular-nums" data-action="play-qari" data-item-key="${escHtml(derKey)}" aria-label="Play Ayah ${escHtml(derIt.ref)} (Qari Mishary Alafasy)" title="Recite Ayah ${escHtml(derIt.ref)}: Qari Mishary Alafasy">${ICONS.play}<span>${escHtml(derIt.ref)}</span></button>` : ''}
        </div>
        <div class="card-actions">
          <button type="button" class="card-action-btn" data-action="play-tts" data-item-key="${escHtml(derKey)}" aria-label="Listen to derived word via TTS" title="Browser Arabic TTS">${ICONS.speaker}</button>
          <button type="button" class="card-action-btn ${rootStarred ? 'starred' : ''}" data-action="toggle-star" data-item-key="${escHtml(rootKey)}" aria-pressed="${rootStarred}" aria-label="${rootStarred ? 'Remove star from base word' : 'Star base word'}" title="Star base word">${ICONS.star}</button>
          <button type="button" class="card-action-btn ${derStarred ? 'starred' : ''}" data-action="toggle-star" data-item-key="${escHtml(derKey)}" data-legacy-key="${escHtml(legacyKey)}" aria-pressed="${derStarred}" aria-label="${derStarred ? 'Remove star from derived word' : 'Star derived word'}" title="Star derived word">${ICONS.star}</button>
          <button type="button" class="card-action-btn ${bookmarked ? 'bookmarked' : ''}" data-action="toggle-bookmark" data-item-key="${escHtml(derKey)}" data-legacy-key="${escHtml(legacyKey)}" aria-pressed="${bookmarked}" aria-label="Bookmark this card" title="Bookmark">${ICONS.bookmark}</button>
        </div>
      </div>

      <div class="paired-card-ar" dir="rtl">
        <span>${rootHtml}</span>
        <span aria-hidden="true">${ICONS.arrowLeft}</span>
        <span>${derHtml}</span>
      </div>

      <div class="card-hints-row" data-hints-slot="${escHtml(derKey)}" data-item-id="${escHtml(String(derIt.id ?? ''))}" ${hintHtml ? '' : 'hidden'}>${hintHtml}</div>

      <div class="gloss-row">
        <div class="gloss-box"${studentAttrs}>
          <div class="gloss-content">
            <div class="paired-card-gloss" ${isUrdu ? 'dir="rtl" lang="ur"' : ''}>
              <span>${escHtml(rootGloss)}</span>
              <span aria-hidden="true">${ICONS.arrowRight}</span>
              <span>${escHtml(derGloss)}</span>
            </div>
            ${customNote ? `<div class="custom-note-line"><span class="custom-badge">note</span> <span class="custom-note-text">${escHtml(customNote)}</span></div>` : ''}
          </div>
        </div>
        <button type="button" class="card-action-btn note-edit-trigger" data-action="edit-note" data-item-key="${escHtml(derKey)}" aria-label="Add or edit personal note" title="Personal note">${ICONS.note}</button>
      </div>
      <div data-note-editor-slot="${escHtml(derKey)}"></div>
    </article>
  `;
}

/**
 * Inline personal note editor inside a vocab or paired card (avoids extra modal dialogs).
 * @param {HTMLElement} slot
 * @param {string} itemKey
 * @param {string | undefined} legacyKey
 */
function _toggleInlineNoteEditor(slot, itemKey, legacyKey) {
  if (slot.innerHTML.trim()) {
    slot.innerHTML = '';
    return;
  }
  const existing = store.getCustomNote(itemKey, legacyKey);
  slot.innerHTML = `
    <div class="inline-note-editor">
      <label class="field-label" for="note-input-${escHtml(itemKey)}">Personal Note</label>
      <textarea id="note-input-${escHtml(itemKey)}" class="edit-textarea" rows="2" placeholder="Enter your personal translation or study note...">${escHtml(existing)}</textarea>
      <div class="inline-note-actions">
        <button type="button" class="btn-ghost btn-sm" data-note-cancel>Cancel</button>
        ${existing ? `<button type="button" class="btn-danger btn-sm" data-note-clear>Clear</button>` : ''}
        <button type="button" class="btn-primary btn-sm" data-note-save>Save Note</button>
      </div>
    </div>
  `;
  const ta = /** @type {HTMLTextAreaElement | null} */ (slot.querySelector('textarea'));
  ta?.focus();

  slot.querySelector('[data-note-cancel]')?.addEventListener('click', () => {
    slot.innerHTML = '';
  });
  slot.querySelector('[data-note-clear]')?.addEventListener('click', () => {
    store.saveCustomNote(itemKey, '');
    slot.innerHTML = '';
    const card = slot.closest('.vocab-card, .paired-card');
    card?.querySelector('.custom-note-line')?.remove();
  });
  slot.querySelector('[data-note-save]')?.addEventListener('click', () => {
    const val = (ta?.value || '').trim();
    store.saveCustomNote(itemKey, val);
    slot.innerHTML = '';
    const content = slot.closest('.vocab-card, .paired-card')?.querySelector('.gloss-content');
    if (content) {
      content.querySelector('.custom-note-line')?.remove();
      if (val) {
        const line = document.createElement('div');
        line.className = 'custom-note-line';
        line.innerHTML = `<span class="custom-badge">note</span> <span class="custom-note-text">${escHtml(val)}</span>`;
        content.appendChild(line);
      }
    }
  });
}

/**
 * Full-viewport zoomable lightbox for wide Concept SVGs on mobile & desktop.
 * Uses a div overlay with role="dialog" aria-modal="true" (preserving the 5-<dialog> invariant),
 * initial close-button focus, Tab focus trapping, unique SVG ID scoping, and focus restoration.
 * @param {string} svgOuterHtml
 */
function _openSvgLightbox(svgOuterHtml) {
  document.getElementById('svg-lightbox-overlay')?.remove();
  const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const scopedSvg = scopeSvgIds(sanitizeSvgMarkup(svgOuterHtml), `lb_${++_svgScopeSeq}_`);

  const overlay = document.createElement('div');
  overlay.id = 'svg-lightbox-overlay';
  overlay.className = 'svg-lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'svg-lightbox-title');
  overlay.innerHTML = `
    <div class="svg-lightbox-bar">
      <span id="svg-lightbox-title" class="svg-lightbox-title">Concept Diagram: Pinch or Scroll to Pan</span>
      <button type="button" class="icon-btn svg-lightbox-close" aria-label="Close diagram">✕</button>
    </div>
    <div class="svg-lightbox-stage" tabindex="0" aria-label="Expanded concept diagram stage">${scopedSvg}</div>
  `;

  const closeBtn = /** @type {HTMLButtonElement | null} */ (overlay.querySelector('.svg-lightbox-close'));
  const getFocusable = () =>
    Array.from(
      overlay.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter(el => /** @type {HTMLElement} */ (el).offsetParent !== null);

  const close = () => {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
    if (opener && opener.isConnected) {
      opener.focus();
    }
  };

  /** @param {KeyboardEvent} e */
  const onKey = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      close();
      return;
    }
    if (e.key === 'Tab') {
      const focusables = getFocusable();
      if (focusables.length === 0) return;
      const first = /** @type {HTMLElement} */ (focusables[0]);
      const last = /** @type {HTMLElement} */ (focusables[focusables.length - 1]);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  closeBtn?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', onKey);
  document.body.appendChild(overlay);
  closeBtn?.focus();
}
