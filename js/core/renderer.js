// @ts-check

/**
 * Muallim ul-Qur'an — Lesson & Card Renderer (v6.0)
 * Renders all lesson section types in RTL row-by-row grids, Student Mode zero-CLS
 * tap-to-peek, inline custom note editor, Surah:Ayah ref badges, mastery rings,
 * and grammar visuals lifecycle.
 */

import { store } from './store.js';
import { audioPlayer } from './audio.js';
import { loadVisual, destroyVisual } from '../visuals/loader.js';

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
  return `
    <div class="concept-svg-card">
      <div class="concept-svg-bar">
        <span class="concept-svg-label">Concept Diagram</span>
        <span class="concept-svg-hint">Swipe or expand</span>
        <button type="button" class="btn-ghost btn-sm concept-svg-expand-btn" data-action="expand-svg" aria-label="Expand concept diagram">⤢ Expand</button>
      </div>
      <div class="concept-svg-scroll" tabindex="0" aria-label="Scrollable concept diagram">${svgMarkup}</div>
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

  // Case 2: Bare <svg ...>...</svg> (e.g. Unit 5 Lesson 15 & 16)
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
 * Render Resume where you left off banner.
 * @param {HTMLElement} mount
 * @param {{unit: number, lesson: number, label: string} | null} candidate
 * @param {(unit: number, lesson: number) => void} onResume
 * @param {() => void} onDismiss
 */
export function renderResumeBanner(mount, candidate, onResume, onDismiss) {
  if (!candidate) {
    mount.innerHTML = '';
    return;
  }
  mount.innerHTML = `
    <div class="resume-banner" role="region" aria-label="Resume last lesson">
      <div class="resume-banner-text">
        <span class="resume-banner-eyebrow">Resume where you left off</span>
        <span class="resume-banner-title tabular-nums">Unit ${candidate.unit} · Lesson ${candidate.lesson} — ${escHtml(sanitizeCopy(candidate.label))}</span>
      </div>
      <div class="resume-banner-actions">
        <button type="button" class="btn-primary btn-sm" id="btn-resume-go">Resume</button>
        <button type="button" class="icon-btn" id="btn-resume-dismiss" aria-label="Dismiss resume banner">✕</button>
      </div>
    </div>
  `;
  mount.querySelector('#btn-resume-go')?.addEventListener('click', () => onResume(candidate.unit, candidate.lesson));
  mount.querySelector('#btn-resume-dismiss')?.addEventListener('click', onDismiss);
}

/**
 * Render an entire lesson into #lesson-content-mount and bind interactive card controls.
 * @param {{
 *   unit: number,
 *   lesson: object | null,
 *   mount: HTMLElement,
 *   bottomNavMount: HTMLElement,
 *   onOpenPractice: (mode: 'quiz' | 'morph') => void,
 *   onPrevLesson: () => void,
 *   onNextLesson: () => void,
 *   onNotify: (msg: string) => void
 * }} opts
 */
/** @type {WeakMap<HTMLElement, AbortController>} */
const _mountListeners = new WeakMap();

export async function renderLessonView(opts) {
  const { unit, lesson, mount, bottomNavMount, onOpenPractice, onPrevLesson, onNextLesson, onNotify } = opts;
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

  /** @type {Map<string, any>} */
  const itemRegistry = new Map();

  let html = `
    <section class="lesson-banner" aria-label="Lesson header">
      <div class="lesson-banner-top">
        <div>
          <div class="lesson-eyebrow tabular-nums">Unit ${unit} · Lesson ${lid}${pageLabel ? ` · Pages ${escHtml(String(pageLabel))}` : ''}</div>
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
  `;

  (lesson.sections || []).forEach((sec, sIdx) => {
    const secType = sec.type;
    const d = sec.data || {};

    if (secType === 'hero_header') {
      const heroAr = d.arabic_combined || d.arabic || d.arabic_word || sec.arabic_combined || sec.arabic || '';
      const heroSub = store.getTranslation(d) || d.hinglish_combined || d.hinglish || d.title_en || d.subtitle || '';
      if (heroAr || heroSub) {
        html += `
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
      html += `<section class="rule-card">${rTitle}${formatRuleContent(text)}</section>`;
      return;
    }

    if (secType === 'grace_box') {
      const gText = d.text || '';
      html += `<aside class="grace-card">${escHtml(sanitizeCopy(gText))}</aside>`;
      return;
    }

    if (secType === 'section_label') {
      const lbl = sanitizeCopy(d.text || d.title || d.label || sec.text || '');
      if (lbl) {
        html += `<div class="section-label-divider"><span>${escHtml(lbl)}</span></div>`;
      }
      return;
    }

    if (secType === 'intro_table') {
      const headers = Array.isArray(d.headers) ? d.headers : (Array.isArray(sec.headers) ? sec.headers : []);
      const rows = Array.isArray(d.rows) ? d.rows : (Array.isArray(sec.rows) ? sec.rows : []);
      const cap = sanitizeCopy(d.caption || d.title || sec.title || '');
      html += '<div class="intro-table-wrap"><table class="intro-table">';
      if (cap) html += `<caption>${escHtml(cap)}</caption>`;
      if (headers.length > 0) {
        html += `<thead><tr>${headers.map(h => `<th>${escHtml(sanitizeCopy(String(h)))}</th>`).join('')}</tr></thead>`;
      }
      html += '<tbody>';
      for (const row of rows) {
        const cells = Array.isArray(row) ? row : Object.values(row || {});
        html += `<tr>${cells.map(c => {
          const s = sanitizeCopy(String(c ?? ''));
          const isAr = /[\u0600-\u06FF]/.test(s);
          return `<td${isAr ? ' class="is-arabic-cell" dir="rtl"' : ''}>${escHtml(s)}</td>`;
        }).join('')}</tr>`;
      }
      html += '</tbody></table></div>';
      return;
    }

    if (secType === 'two_col_numbered_list' || secType === 'three_col_numbered_list' || secType === 'verse_block' || secType === 'exercise_verses' || secType === 'tashbeeh_grid' || secType === 'ayah_pause_block') {
      const defaultCols = secType === 'three_col_numbered_list' ? 3 : (secType === 'verse_block' || secType === 'exercise_verses' ? 1 : 2);
      const rawCols = Number(d.cols || sec.cols || defaultCols);
      const cols = Math.min(5, Math.max(1, Number.isFinite(rawCols) ? rawCols : defaultCols));
      const secFullWidth = Boolean(d.full_width || sec.full_width);
      const rawItems = Array.isArray(d.items) ? d.items : (Array.isArray(d.verses) ? d.verses : []);
      const items = rawItems.some(it => it && it.displayOrder !== undefined)
        ? [...rawItems].sort((a, b) => (a.displayOrder ?? 999999) - (b.displayOrder ?? 999999))
        : rawItems;

      html += `<div class="bidi-grid cols-${cols}">`;
      let i = 0;
      while (i < items.length) {
        const it = items[i];
        if (it && it.display_mode === 'paired' && it.pair_role === 'root' && items[i + 1]?.pair_role === 'derived') {
          const rootIt = it;
          const derIt = items[i + 1];
          const rootKey = store.getItemKey(unit, lid, rootIt, sIdx, i);
          const derKey = store.getItemKey(unit, lid, derIt, sIdx, i + 1);
          itemRegistry.set(rootKey, { item: rootIt, sIdx, iIdx: i });
          itemRegistry.set(derKey, { item: derIt, sIdx, iIdx: i + 1 });
          const fullCls = (secFullWidth || rootIt.full_width || derIt.full_width) ? 'is-full-width' : '';
          html += _renderPairedCard(rootIt, derIt, rootKey, derKey, fullCls, isUrdu);
          i += 2;
        } else {
          const itemKey = store.getItemKey(unit, lid, it, sIdx, i);
          const legacyKey = `S${unit}L${lid}_s${sIdx}_${i}`;
          itemRegistry.set(itemKey, { item: it, legacyKey, sIdx, iIdx: i });
          const fullCls = (secFullWidth || it.full_width) ? 'is-full-width' : '';
          html += _renderVocabCard(it, itemKey, legacyKey, fullCls, isUrdu);
          i += 1;
        }
      }
      html += '</div>';
    }
  });

  mount.innerHTML = html;

  // Bind Lesson Header Controls
  mount.querySelector('#btn-toggle-complete')?.addEventListener('click', () => {
    const nowDone = store.toggleLessonComplete(unit, lid);
    onNotify(nowDone ? `Unit ${unit} Lesson ${lid} marked complete.` : 'Completion unmarked.');
  });
  mount.querySelector('#btn-open-practice')?.addEventListener('click', () => onOpenPractice('quiz'));
  mount.querySelector('#btn-open-morph')?.addEventListener('click', () => onOpenPractice('morph'));

  // Event delegation for vocab cards (Audio, Ref play, Star, Bookmark, Tap-to-peek, Inline Note Editor)
  mount.addEventListener('click', (ev) => {
    const target = /** @type {HTMLElement | null} */ (ev.target);
    if (!target) return;

    const expandSvgBtn = target.closest('[data-action="expand-svg"]');
    if (expandSvgBtn) {
      const svgEl = expandSvgBtn.closest('.concept-svg-card')?.querySelector('svg');
      if (svgEl) _openSvgLightbox(svgEl.outerHTML);
      return;
    }

    const audioBtn = target.closest('[data-action="play-audio"]');
    if (audioBtn) {
      const key = audioBtn.getAttribute('data-item-key') || '';
      const entry = itemRegistry.get(key);
      if (entry) {
        audioPlayer.play({
          arabic: entry.item.arabic || '',
          ref: entry.item.ref || '',
          key,
          buttonEl: /** @type {HTMLElement} */ (audioBtn),
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
        starBtn.textContent = nowStarred ? '★' : '☆';
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
          el.closest('.vocab-card')?.classList.remove('is-bookmarked');
        });
        if (isSet) {
          bmBtn.classList.add('bookmarked');
          bmBtn.closest('.vocab-card')?.classList.add('is-bookmarked');
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
      const card = editBtn.closest('.vocab-card');
      const editorMount = card?.querySelector('[data-note-editor-slot]');
      const entry = itemRegistry.get(key);
      if (editorMount && entry) {
        _toggleInlineNoteEditor(/** @type {HTMLElement} */ (editorMount), key, entry.legacyKey);
      }
      return;
    }

    // Student Mode tap-to-peek on gloss box (or tapping Arabic text on vocab card in student mode)
    if (store.mode === 'student') {
      const glossBox = target.closest('.gloss-box');
      if (glossBox) {
        glossBox.classList.toggle('is-peeked');
        return;
      }
      const cardArabic = target.closest('.vocab-card .arabic-text');
      if (cardArabic) {
        const box = cardArabic.closest('.vocab-card')?.querySelector('.gloss-box');
        if (box) box.classList.toggle('is-peeked');
      }
    }
  }, { signal: ac.signal });

  // Render Bottom Prev / Next Lesson Bar
  const hasPrev = !(unit === 1 && lid === 1);
  const hasNext = !(unit === 7 && lid >= store.getUnitLessonCount(7));
  bottomNavMount.innerHTML = `
    <div class="bottom-nav-card">
      <button type="button" class="btn-secondary" id="btn-bottom-prev" ${!hasPrev ? 'disabled' : ''}>← Previous Lesson</button>
      <button type="button" class="btn-primary" id="btn-bottom-next" ${!hasNext ? 'disabled' : ''}>Next Lesson →</button>
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
 * @param {any} it
 * @param {string} itemKey
 * @param {string} legacyKey
 * @param {string} fullCls
 * @param {boolean} isUrdu
 * @returns {string}
 */
function _renderVocabCard(it, itemKey, legacyKey, fullCls, isUrdu) {
  const num = it.sentence_number || it.display_number || '';
  const starred = store.isStarred(itemKey, legacyKey);
  const bookmarked = store.bookmark && (store.bookmark.itemId === itemKey || store.bookmark.itemId === legacyKey);
  const gloss = store.getTranslation(it);
  const customNote = store.getCustomNote(itemKey, legacyKey);
  const ref = it.ref || '';

  return `
    <article class="vocab-card ${fullCls} ${bookmarked ? 'is-bookmarked' : ''}" data-card-key="${escHtml(itemKey)}">
      <div class="card-top">
        <div class="card-meta-badges">
          ${num ? `<span class="card-number tabular-nums">${escHtml(String(num))}</span>` : ''}
          ${ref ? `
            <button type="button" class="ref-badge-btn tabular-nums" data-action="play-audio" data-item-key="${escHtml(itemKey)}" aria-label="Play Surah Ayah ${escHtml(ref)}" title="Recite ${escHtml(ref)}">
              <span>▶</span>
              <span>${escHtml(ref)}</span>
            </button>
          ` : ''}
        </div>
        <div class="card-actions">
          <button type="button" class="card-action-btn" data-action="play-audio" data-item-key="${escHtml(itemKey)}" aria-label="Listen to Arabic" title="Listen">🔊</button>
          <button type="button" class="card-action-btn ${starred ? 'starred' : ''}" data-action="toggle-star" data-item-key="${escHtml(itemKey)}" aria-pressed="${starred}" aria-label="${starred ? 'Remove star' : 'Star this item'}" title="Star">${starred ? '★' : '☆'}</button>
          <button type="button" class="card-action-btn ${bookmarked ? 'bookmarked' : ''}" data-action="toggle-bookmark" data-item-key="${escHtml(itemKey)}" aria-pressed="${Boolean(bookmarked)}" aria-label="Bookmark this item" title="Bookmark">🔖</button>
        </div>
      </div>

      <div class="arabic-text" dir="rtl">${it.arabic_markup || escHtml(it.arabic || '')}</div>

      ${(gloss || customNote) ? `
        <div class="gloss-row">
          <div class="gloss-box" tabindex="0" role="button" aria-label="Translation gloss (tap to peek in Student Mode)">
            <div class="gloss-content">
              <div class="gloss-text" ${isUrdu ? 'dir="rtl" lang="ur"' : 'dir="ltr"'}>${escHtml(gloss)}</div>
              ${customNote ? `<div class="custom-note-line"><span class="custom-badge">note</span> <span>${escHtml(customNote)}</span></div>` : ''}
            </div>
          </div>
          <button type="button" class="card-action-btn note-edit-trigger" data-action="edit-note" data-item-key="${escHtml(itemKey)}" aria-label="Add or edit personal note" title="Personal note">✏️</button>
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
 * @param {string} fullCls
 * @param {boolean} isUrdu
 * @returns {string}
 */
function _renderPairedCard(rootIt, derIt, rootKey, derKey, fullCls, isUrdu) {
  const rootStarred = store.isStarred(rootKey);
  const derStarred = store.isStarred(derKey);
  const rootGloss = store.getTranslation(rootIt);
  const derGloss = store.getTranslation(derIt);
  const derHtml = derIt.arabic_markup
    || (derIt.arabic_suffix
      ? `<span class="arabic-root">${escHtml(derIt.arabic_root || '')}</span><span class="nonroot">${escHtml(derIt.arabic_suffix)}</span>`
      : escHtml(derIt.arabic || ''));

  return `
    <article class="paired-card ${fullCls}">
      <div class="card-top">
        <div class="card-meta-badges">
          ${derIt.ref ? `<button type="button" class="ref-badge-btn tabular-nums" data-action="play-audio" data-item-key="${escHtml(derKey)}" aria-label="Play ${escHtml(derIt.ref)}">▶ ${escHtml(derIt.ref)}</button>` : ''}
        </div>
        <div class="card-actions">
          <button type="button" class="card-action-btn" data-action="play-audio" data-item-key="${escHtml(derKey)}" aria-label="Listen to derived word">🔊</button>
          <button type="button" class="card-action-btn ${rootStarred ? 'starred' : ''}" data-action="toggle-star" data-item-key="${escHtml(rootKey)}" aria-pressed="${rootStarred}" aria-label="Star base word">${rootStarred ? '★' : '☆'}</button>
          <button type="button" class="card-action-btn ${derStarred ? 'starred' : ''}" data-action="toggle-star" data-item-key="${escHtml(derKey)}" aria-pressed="${derStarred}" aria-label="Star derived word">${derStarred ? '★' : '☆'}</button>
        </div>
      </div>

      <div class="paired-card-ar" dir="rtl">
        <span>${rootIt.arabic_markup || escHtml(rootIt.arabic || '')}</span>
        <span aria-hidden="true">←</span>
        <span>${derHtml}</span>
      </div>

      <div class="paired-card-gloss" ${isUrdu ? 'dir="rtl" lang="ur"' : ''}>
        <span>${escHtml(rootGloss)}</span>
        <span aria-hidden="true">→</span>
        <span>${escHtml(derGloss)}</span>
      </div>
    </article>
  `;
}

/**
 * Inline personal note editor inside a vocab card (avoids extra modal dialogs).
 * @param {HTMLElement} slot
 * @param {string} itemKey
 * @param {string} legacyKey
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
    const card = slot.closest('.vocab-card');
    card?.querySelector('.custom-note-line')?.remove();
  });
  slot.querySelector('[data-note-save]')?.addEventListener('click', () => {
    const val = (ta?.value || '').trim();
    store.saveCustomNote(itemKey, val);
    slot.innerHTML = '';
    const content = slot.closest('.vocab-card')?.querySelector('.gloss-content');
    if (content) {
      content.querySelector('.custom-note-line')?.remove();
      if (val) {
        const line = document.createElement('div');
        line.className = 'custom-note-line';
        line.innerHTML = `<span class="custom-badge">note</span> <span>${escHtml(val)}</span>`;
        content.appendChild(line);
      }
    }
  });
}

/**
 * Full-viewport zoomable lightbox for wide Concept SVGs on mobile & desktop.
 * Uses a div overlay (not an extra <dialog>) to keep the 5-modal shell invariant.
 * @param {string} svgOuterHtml
 */
function _openSvgLightbox(svgOuterHtml) {
  document.getElementById('svg-lightbox-overlay')?.remove();
  const overlay = document.createElement('div');
  overlay.id = 'svg-lightbox-overlay';
  overlay.className = 'svg-lightbox';
  overlay.setAttribute('role', 'region');
  overlay.setAttribute('aria-label', 'Expanded concept diagram');
  overlay.innerHTML = `
    <div class="svg-lightbox-bar">
      <span class="svg-lightbox-title">Concept Diagram · Pinch or Scroll to Pan</span>
      <button type="button" class="icon-btn svg-lightbox-close" aria-label="Close diagram">✕</button>
    </div>
    <div class="svg-lightbox-stage">${svgOuterHtml}</div>
  `;
  const close = () => {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (/** @type {KeyboardEvent} */ e) => {
    if (e.key === 'Escape') close();
  };
  overlay.querySelector('.svg-lightbox-close')?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', onKey);
  document.body.appendChild(overlay);
}
