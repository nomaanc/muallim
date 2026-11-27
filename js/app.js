// @ts-check

/**
 * Muallim ul-Qur'an — Application Bootstrap & Modal Orchestrator (v7.0)
 * Native ES module entrypoint linking store, router, renderer, audio, SRS,
 * search, practice quiz / morphology builder, summative exams / Mushaf showcase /
 * 9-pillar spiral explorer, and optional cloud sync.
 */

import { store, toLocalDateKey } from './core/store.js';
import { AppRouter, parseRoute, getResumeCandidate, bindKeyboardShortcuts } from './core/router.js';
import { audioPlayer } from './core/audio.js';
import { SrsController } from './core/srs.js';
import { SearchController } from './core/search.js';
import { PracticeController } from './core/quiz.js';
import { ExamsController } from './core/exams.js';
import { cloudSync } from './core/sync.js';
import {
  escHtml,
  renderMasteryRing,
  renderLessonSkeleton,
  renderLessonError,
  renderResumeBanner,
  renderLessonView,
  updateLessonHintsInPlace,
  syncGlossBoxModeAttributes,
  syncCardStarsInPlace,
  syncCardBookmarksInPlace,
  syncCardNotesInPlace,
  syncCompletionInPlace
} from './core/renderer.js';

const HTML_LANG_MAP = {
  hinglish: 'ur-Latn',
  en: 'en',
  ur: 'ur',
  hi: 'hi'
};

let _toastTimer = 0;
/** @type {'prefs' | 'starred' | 'sync'} */
let _settingsTab = 'prefs';
let _pickerUnit = 1;
let _resumeDismissed = false;
let _navToken = 0;
/** @type {'lesson' | 'exam' | 'mushaf-check' | 'spiral'} */
let _activeView = 'lesson';
let _activeExamId = 'vol1';
/** @type {{root?: string, pillar?: number}} */
let _activeSpiralParams = {};

/**
 * Show a temporary accessible status toast.
 * @param {string} msg
 * @param {number} [durationMs]
 */
function showToast(msg, durationMs = 3000) {
  const el = document.getElementById('app-toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = window.setTimeout(() => {
    el.classList.remove('show');
  }, durationMs);
}

/** @type {AppRouter} */
let router;
/** @type {SearchController} */
let searchCtrl;
/** @type {SrsController} */
let srsCtrl;
/** @type {PracticeController} */
let practiceCtrl;
/** @type {any} */
let examsCtrl;

function _syncDocumentLang() {
  document.documentElement.lang = HTML_LANG_MAP[store.lang] || 'ur-Latn';
}

/**
 * Smoothly scroll to a specific card key inside the lesson mount.
 * @param {HTMLElement} mount
 * @param {string} itemKey
 */
function _scrollToCardKey(mount, itemKey) {
  if (!itemKey) return;
  const escKey = CSS.escape(String(itemKey));
  const target =
    mount.querySelector(`[data-card-key="${escKey}"]`) ||
    mount.querySelector(`[data-root-key="${escKey}"]`) ||
    mount.querySelector(`[data-legacy-key="${escKey}"]`);
  if (target instanceof HTMLElement) {
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('is-scroll-target');
      window.setTimeout(() => target.classList.remove('is-scroll-target'), 2200);
    });
  }
}

/**
 * Push or replace hash URL for non-lesson views without re-triggering hashchange loops.
 * @param {string} hash
 * @param {boolean} [push]
 */
function _syncNonLessonHash(hash, push = true) {
  const norm = hash.startsWith('#') ? hash : `#${hash}`;
  if (typeof router?.syncHash === 'function') {
    router.syncHash(norm, { hash: norm }, push);
    return;
  }
  if (window.location.hash === norm) return;
  try {
    if (push) {
      history.pushState({ hash: norm }, '', `${window.location.pathname}${norm}`);
    } else {
      history.replaceState({ hash: norm }, '', `${window.location.pathname}${norm}`);
    }
  } catch (err) {
    console.warn('[App] History update skipped:', err);
  }
}

/**
 * Navigate to a hash route (#exam/vol1, #mushaf-check, #spiral, #u1/l1, #bookmarks, #favourites).
 * @param {string} hash
 */
async function navigateToHash(hash) {
  const norm = hash.startsWith('#') ? hash : `#${hash}`;
  const parsed = parseRoute(norm, '');
  if (parsed) {
    await handleRoute(parsed, { fromHistory: false, rawHash: norm });
  }
}

/**
 * Dispatch a discriminated route object to the active view controller.
 * @param {any} route
 * @param {{fromHistory?: boolean, rawHash?: string}} [opts]
 */
async function handleRoute(route, opts = {}) {
  const rawHash = opts.rawHash || window.location.hash;
  if (rawHash === '#bookmarks' || route?.view === 'bookmarks') {
    const bm = store.bookmark;
    if (bm && bm.stage && bm.lesson) {
      await goToLesson(bm.stage, bm.lesson, { fromHistory: opts.fromHistory, itemKey: bm.itemId });
    } else {
      showToast('No bookmark saved yet. Tap the bookmark icon on any card.');
      if (_activeView !== 'lesson' || !document.querySelector('#lesson-content-mount .lesson-banner')) {
        await goToLesson(store.currentUnit, store.currentLesson, { fromHistory: true });
      }
    }
    return;
  }

  if (rawHash === '#favourites' || route?.view === 'favourites') {
    if (!document.querySelector('#lesson-content-mount .lesson-banner')) {
      await goToLesson(store.currentUnit, store.currentLesson, { fromHistory: true });
    }
    openSettingsDialog('starred');
    return;
  }

  if (!route || route.view === 'lesson' || (!route.view && route.unit && route.lesson)) {
    const u = route?.unit || 1;
    const l = route?.lesson || 1;
    await goToLesson(u, l, { fromHistory: opts.fromHistory, itemKey: route?.itemKey });
    return;
  }

  const mount = document.getElementById('lesson-content-mount');
  const bottomMount = document.getElementById('bottom-nav-mount');
  if (!mount || !bottomMount) return;

  const token = ++_navToken;
  audioPlayer.stop();
  examsCtrl?.destroy?.();
  bottomMount.innerHTML = '';

  const viewCallbacks = {
    onNavigateLesson: (u, l, itemKey) => goToLesson(u, l, { itemKey }),
    onOpenExam: (examId) => navigateToHash(`#exam/${examId}`),
    onOpenRoute: (h) => navigateToHash(h),
    onNotify: showToast
  };

  if (route.view === 'exam') {
    const examId = route.examId || 'vol1';
    _activeView = 'exam';
    _activeExamId = examId;
    if (!opts.fromHistory) _syncNonLessonHash(`#exam/${examId}`, true);
    _updateChromeLabels();
    window.scrollTo({ top: 0, behavior: 'auto' });
    await examsCtrl.renderExamView(mount, examId, viewCallbacks);
    if (token !== _navToken) return;
    return;
  }

  if (route.view === 'mushaf-check') {
    _activeView = 'mushaf-check';
    if (!opts.fromHistory) _syncNonLessonHash('#mushaf-check', true);
    _updateChromeLabels();
    window.scrollTo({ top: 0, behavior: 'auto' });
    await examsCtrl.renderMushafShowcase(mount, viewCallbacks);
    if (token !== _navToken) return;
    return;
  }

  if (route.view === 'spiral') {
    _activeView = 'spiral';
    _activeSpiralParams = { root: route.root, pillar: route.pillar };
    const hash = route.root
      ? `#spiral/root/${encodeURIComponent(route.root)}`
      : (route.pillar ? `#spiral/p${route.pillar}` : '#spiral');
    if (!opts.fromHistory) _syncNonLessonHash(hash, true);
    _updateChromeLabels();
    window.scrollTo({ top: 0, behavior: 'auto' });
    await examsCtrl.renderSpiralExplorer(mount, _activeSpiralParams, viewCallbacks);
    if (token !== _navToken) return;
  }
}

/**
 * Load per-lesson chunk (or unit JSON) and render the requested lesson cleanly.
 * Guarded by monotonic ++_navToken to prevent out-of-order async overwrites.
 * @param {number} unitNum
 * @param {number} lessonNum
 * @param {{fromHistory?: boolean, itemKey?: string}} [opts]
 */
async function goToLesson(unitNum, lessonNum, opts = {}) {
  const token = ++_navToken;
  _activeView = 'lesson';
  const unit = Math.min(7, Math.max(1, Number(unitNum) || 1));
  const mount = document.getElementById('lesson-content-mount');
  const bottomMount = document.getElementById('bottom-nav-mount');
  if (!mount || !bottomMount) return;

  audioPlayer.stop();
  examsCtrl?.destroy?.();
  renderLessonSkeleton(mount);

  try {
    await store.loadMetadata();
    if (token !== _navToken) return;

    const maxLesson = store.getUnitLessonCount(unit);
    const lessonId = Math.min(maxLesson, Math.max(1, Number(lessonNum) || 1));
    let lesson = null;
    if (typeof store.loadLessonChunk === 'function') {
      lesson = await store.loadLessonChunk(unit, lessonId);
    } else {
      await store.loadUnit(unit);
      lesson = store.getLesson(unit, lessonId);
    }
    if (token !== _navToken) return;

    store.setCurrentPosition(unit, lessonId, lesson?.title || '');
    router.syncUrl(unit, lessonId, !opts.fromHistory);
    _updateChromeLabels();

    if (store.showHints && typeof searchCtrl?.ensureIndexLoaded === 'function') {
      searchCtrl.ensureIndexLoaded().then(() => {
        if (token === _navToken && _activeView === 'lesson') {
          updateLessonHintsInPlace(mount, unit, lessonId, (u, l, id) => searchCtrl.getItemMeta?.(u, l, id) || null);
        }
      }).catch(err => console.warn('[App] Hints index load skipped:', err));
    }

    await renderLessonView({
      unit,
      lesson,
      mount,
      bottomNavMount: bottomMount,
      onOpenPractice: (mode) => practiceCtrl.open(mode),
      onPrevLesson: navigatePrevLesson,
      onNextLesson: navigateNextLesson,
      onNotify: showToast,
      getItemMeta: (u, l, id) => searchCtrl?.getItemMeta?.(u, l, id) || null
    });
    if (token !== _navToken) return;

    if (!opts.fromHistory && unit === store.currentUnit && lessonId === store.currentLesson) {
      const resumeMount = document.getElementById('resume-banner-mount');
      if (resumeMount && _resumeDismissed) resumeMount.innerHTML = '';
    }

    if (opts.itemKey) {
      _scrollToCardKey(mount, opts.itemKey);
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  } catch (err) {
    if (token !== _navToken) return;
    const detail = err instanceof Error ? err.message : 'Unable to fetch lesson data';
    renderLessonError(mount, detail, () => goToLesson(unitNum, lessonNum, opts));
  }
}

async function navigatePrevLesson() {
  if (_activeView !== 'lesson') {
    await goToLesson(store.currentUnit, store.currentLesson);
    return;
  }
  if (store.currentLesson > 1) {
    await goToLesson(store.currentUnit, store.currentLesson - 1);
  } else if (store.currentUnit > 1) {
    const prevUnit = store.currentUnit - 1;
    await store.loadMetadata();
    await goToLesson(prevUnit, store.getUnitLessonCount(prevUnit));
  }
}

async function navigateNextLesson() {
  if (_activeView !== 'lesson') {
    await goToLesson(store.currentUnit, store.currentLesson);
    return;
  }
  const count = store.getUnitLessonCount(store.currentUnit);
  if (store.currentLesson < count) {
    await goToLesson(store.currentUnit, store.currentLesson + 1);
  } else if (store.currentUnit < 7) {
    await goToLesson(store.currentUnit + 1, 1);
  }
}

function _updateChromeLabels() {
  const lbl = document.getElementById('current-lesson-label');
  if (_activeView === 'exam') {
    const examTitles = {
      vol1: 'Vol. 1 Model Exam',
      u4: 'Unit 4 Model Exam',
      u5: 'Unit 5 Model Exam',
      u7: 'Unit 7 Model Exam'
    };
    const t = examTitles[_activeExamId] || 'Model Exam';
    if (lbl) lbl.textContent = t;
    document.title = `Muallim ul-Qur'an: ${t}`;
  } else if (_activeView === 'mushaf-check') {
    if (lbl) lbl.textContent = 'Mushaf 85% Showcase';
    document.title = "Muallim ul-Qur'an: Mushaf 85% Showcase";
  } else if (_activeView === 'spiral') {
    if (lbl) lbl.textContent = '9-Pillar & Root Explorer';
    document.title = "Muallim ul-Qur'an: 9-Pillar & Root Explorer";
  } else {
    if (lbl) lbl.textContent = `Unit ${store.currentUnit}, Lesson ${store.currentLesson}`;
    document.title = `Muallim ul-Qur'an: Unit ${store.currentUnit} Lesson ${store.currentLesson}`;
  }

  const streakVal = document.getElementById('streak-count-val');
  const streakPill = document.getElementById('streak-pill');
  const curStreak = store.streak.current || 0;
  if (streakVal) streakVal.textContent = `${curStreak}d`;
  if (streakPill) {
    streakPill.classList.toggle('is-active', curStreak > 0);
    streakPill.title = `Current streak: ${curStreak}d | Longest: ${store.streak.longest || 0}d`;
  }

  const isStudent = store.mode === 'student';
  const hdrModeBtn = document.getElementById('btn-header-mode');
  const hdrModeLbl = document.getElementById('header-mode-label');
  if (hdrModeBtn) hdrModeBtn.setAttribute('aria-pressed', String(isStudent));
  if (hdrModeLbl) hdrModeLbl.textContent = isStudent ? 'Reveal All' : 'Student Mode';

  const mbarStudent = document.getElementById('mbar-student');
  const mbarStudentLbl = document.getElementById('mbar-student-label');
  if (mbarStudent) mbarStudent.setAttribute('aria-pressed', String(isStudent));
  if (mbarStudentLbl) mbarStudentLbl.textContent = isStudent ? 'Reveal' : 'Hide';

  const mbarPrev = /** @type {HTMLButtonElement | null} */ (document.getElementById('mbar-prev'));
  const mbarNext = /** @type {HTMLButtonElement | null} */ (document.getElementById('mbar-next'));
  if (mbarPrev) mbarPrev.disabled = _activeView === 'lesson' && store.currentUnit === 1 && store.currentLesson === 1;
  if (mbarNext) mbarNext.disabled = _activeView === 'lesson' && store.currentUnit === 7 && store.currentLesson >= store.getUnitLessonCount(7);

  const starCountBadge = document.getElementById('settings-starred-count');
  if (starCountBadge) starCountBadge.textContent = String(store.favs.length);
}

/**
 * Toggle Student Mode or reveal/hide all glosses via Space shortcut.
 * @returns {boolean}
 */
function handleSpaceKey() {
  if (srsCtrl.handleSpaceFlip()) return true;
  if (store.mode !== 'student') return false;
  const boxes = Array.from(document.querySelectorAll('#lesson-content-mount .gloss-box'));
  if (boxes.length === 0) return false;
  const anyHidden = boxes.some(b => !b.classList.contains('is-peeked'));
  boxes.forEach(b => b.classList.toggle('is-peeked', anyHidden));
  return true;
}

/**
 * Render last-7-days activity strip using DST-safe local calendar arithmetic.
 * @returns {string}
 */
function _renderStudyActivityHtml() {
  const days = [];
  const log = store.studyLog || {};
  for (let offset = 6; offset >= 0; offset--) {
    const d = new Date();
    d.setDate(d.getDate() - offset);
    const key = toLocalDateKey(d);
    const count = Number(log[key]) || 0;
    const label = d.toLocaleDateString(undefined, { weekday: 'short' });
    days.push({ key, count, label, isToday: offset === 0 });
  }
  const cur = store.streak?.current || 0;
  const best = store.streak?.longest || 0;
  return `
    <div class="study-activity-card">
      <div class="study-streak-row tabular-nums">
        <span>Current Streak: <strong>${cur}d</strong></span>
        <span>Longest Streak: <strong>${best}d</strong></span>
      </div>
      <div class="study-week-grid" aria-label="Last 7 days study activity">
        ${days.map(day => `
          <div class="study-day-cell ${day.count > 0 ? 'is-active' : ''} ${day.isToday ? 'is-today' : ''}" title="${escHtml(day.key)}: ${day.count} study action(s)">
            <span class="study-day-name">${escHtml(day.label)}</span>
            <span class="study-day-count tabular-nums">${day.count}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ── Lesson Picker Modal (#lesson-picker-dialog) ── */
async function openLessonPicker() {
  const dlg = /** @type {HTMLDialogElement | null} */ (document.getElementById('lesson-picker-dialog'));
  if (!dlg) return;
  _pickerUnit = store.currentUnit;
  if (!dlg.open) dlg.showModal();
  await renderLessonPicker();
}

async function renderLessonPicker() {
  const bmMount = document.getElementById('picker-bookmark-mount');
  const unitsMount = document.getElementById('picker-units-mount');
  const summaryMount = document.getElementById('picker-unit-summary');
  const lessonsMount = document.getElementById('picker-lessons-mount');
  if (!unitsMount || !lessonsMount) return;

  if (bmMount) {
    const bm = store.bookmark;
    if (bm && bm.stage && bm.lesson) {
      bmMount.innerHTML = `
        <div class="picker-bookmark-bar">
          <div class="picker-bookmark-info">
            <span class="picker-bookmark-label tabular-nums">Bookmark: Unit ${bm.stage}, Lesson ${bm.lesson}</span>
            ${bm.arabic ? `<span class="picker-bookmark-ar" dir="rtl">${escHtml(bm.arabic)}</span>` : ''}
          </div>
          <button type="button" class="btn-primary btn-sm" id="btn-picker-jump-bm">Jump to Bookmark</button>
        </div>
      `;
      bmMount.querySelector('#btn-picker-jump-bm')?.addEventListener('click', async () => {
        /** @type {HTMLDialogElement | null} */ (document.getElementById('lesson-picker-dialog'))?.close();
        await goToLesson(bm.stage, bm.lesson, { itemKey: bm.itemId });
      });
    } else {
      bmMount.innerHTML = '';
    }
  }

  await store.loadMetadata();
  const metaLessons = store.metadata?.units?.[_pickerUnit - 1]?.lessons;
  const hasRichMeta = Array.isArray(metaLessons) && metaLessons.length > 0 && metaLessons.every(x => x.title_i18n || x.title);

  if (!store.unitsCache[_pickerUnit] && !hasRichMeta) {
    lessonsMount.innerHTML = `
      <div class="skeleton-block" style="height:52px"></div>
      <div class="skeleton-block" style="height:52px"></div>
    `;
    await store.loadUnit(_pickerUnit);
  }

  let unitTabsHtml = '';
  for (let u = 1; u <= 7; u++) {
    const m = store.getUnitMastery(u);
    unitTabsHtml += `
      <button type="button" class="unit-tab-card ${u === _pickerUnit ? 'active' : ''}" role="tab" aria-selected="${u === _pickerUnit}" data-pick-unit="${u}">
        <div>
          <div class="unit-tab-label">Unit ${u}</div>
          <div class="unit-tab-count tabular-nums">${m.completed}/${m.total}</div>
        </div>
        <span class="tabular-nums" style="font-size:0.75rem; font-weight:700; color:var(--accent-positive)">${m.pct}%</span>
      </button>
    `;
  }
  unitsMount.innerHTML = unitTabsHtml;

  const activeMastery = store.getUnitMastery(_pickerUnit);
  const curStreak = store.streak?.current || 0;
  const bestStreak = store.streak?.longest || 0;
  if (summaryMount) {
    summaryMount.innerHTML = `
      <div class="picker-summary-text">
        <span>Unit ${_pickerUnit} Progress</span>
        <span class="picker-streak-meta tabular-nums">Streak: ${curStreak}d (Best: ${bestStreak}d)</span>
      </div>
      ${renderMasteryRing(activeMastery.pct, activeMastery.completed, activeMastery.total)}
    `;
  }

  const lessonList = store.unitsCache[_pickerUnit] || metaLessons || [];
  lessonsMount.innerHTML = lessonList.map(l => {
    const lid = Number(l.lesson_id ?? l.number);
    const isActive = _activeView === 'lesson' && _pickerUnit === store.currentUnit && lid === store.currentLesson;
    const isDone = store.isLessonCompleted(_pickerUnit, lid);
    const title = (l.title_i18n && l.title_i18n[store.lang]) || l.title || `Lesson ${lid}`;
    return `
      <button type="button" class="lesson-pick-item ${isActive ? 'active' : ''}" data-pick-lesson="${lid}">
        <span class="lesson-pick-num tabular-nums">${lid}</span>
        <span class="lesson-pick-title">${escHtml(title)}</span>
        <span class="lesson-done-dot ${isDone ? 'done' : ''}" aria-label="${isDone ? 'Completed' : 'Not completed'}">${isDone ? '✓' : ''}</span>
      </button>
    `;
  }).join('');

  unitsMount.querySelectorAll('[data-pick-unit]').forEach(btn => {
    btn.addEventListener('click', () => {
      _pickerUnit = Number(btn.getAttribute('data-pick-unit'));
      renderLessonPicker();
    });
  });

  lessonsMount.querySelectorAll('[data-pick-lesson]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const lid = Number(btn.getAttribute('data-pick-lesson'));
      /** @type {HTMLDialogElement | null} */ (document.getElementById('lesson-picker-dialog'))?.close();
      await goToLesson(_pickerUnit, lid);
    });
  });
}

/* ── Settings & Sync Modal (#settings-dialog) ── */
function openSettingsDialog(tab = 'prefs') {
  const dlg = /** @type {HTMLDialogElement | null} */ (document.getElementById('settings-dialog'));
  if (!dlg) return;
  _settingsTab = tab;
  _syncSettingsTabs();
  renderSettingsBody();
  if (!dlg.open) dlg.showModal();
}

function _syncSettingsTabs() {
  const tabs = [
    ['tab-settings-prefs', 'prefs'],
    ['tab-settings-starred', 'starred'],
    ['tab-settings-sync', 'sync']
  ];
  for (const [id, key] of tabs) {
    const el = document.getElementById(id);
    el?.classList.toggle('active', _settingsTab === key);
    el?.setAttribute('aria-selected', String(_settingsTab === key));
  }
}

function renderSettingsBody() {
  const body = document.getElementById('settings-dialog-body');
  if (!body) return;

  if (_settingsTab === 'starred') {
    const sortedFavs = [...store.favs].sort((a, b) =>
      (Number(a.stage) - Number(b.stage))
      || (Number(a.lesson) - Number(b.lesson))
      || String(a.key || '').localeCompare(String(b.key || ''))
    );
    /** @type {Map<string, {stage: number, lesson: number, items: typeof sortedFavs}>} */
    const favGroups = new Map();
    for (const f of sortedFavs) {
      const u = Number(f.stage) || 1;
      const l = Number(f.lesson) || 1;
      const gk = `${u}:${l}`;
      if (!favGroups.has(gk)) favGroups.set(gk, { stage: u, lesson: l, items: [] });
      favGroups.get(gk)?.items.push(f);
    }

    const noteEntries = Object.entries(store.customNotes || {})
      .filter(([, val]) => typeof val === 'string' && val.trim())
      .sort(([ka], [kb]) => {
        const ma = String(ka).match(/^s(\d+)l(\d+)/i);
        const mb = String(kb).match(/^s(\d+)l(\d+)/i);
        const ua = ma ? Number(ma[1]) : 99;
        const ub = mb ? Number(mb[1]) : 99;
        const la = ma ? Number(ma[2]) : 999;
        const lb = mb ? Number(mb[2]) : 999;
        return (ua - ub) || (la - lb) || String(ka).localeCompare(String(kb));
      });

    if (sortedFavs.length === 0 && noteEntries.length === 0) {
      body.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">No starred items or personal notes yet</div>
          <p class="empty-state-desc">Tap the star icon on a card or open Personal Note to save a custom translation. Both sync to cloud and export in Backup JSON.</p>
        </div>
      `;
      return;
    }
    body.innerHTML = `
      <div class="settings-stack">
        ${sortedFavs.length > 0 ? `
          <section class="settings-section">
            <span class="field-label">Starred Items (Sorted by Lesson: ${sortedFavs.length})</span>
            <div class="starred-list-stack">
              ${Array.from(favGroups.values()).map(grp => `
                <div class="starred-lesson-group">
                  <div class="search-result-unit tabular-nums" style="margin:6px 0 4px; font-weight:700; color:var(--accent-primary);">Unit ${grp.stage}, Lesson ${grp.lesson} (${grp.items.length})</div>
                  ${grp.items.map(f => `
                    <div class="starred-item-row">
                      <button type="button" style="flex:1; text-align:left; min-width:0;" data-jump-star="${f.stage}:${f.lesson}" data-jump-key="${escHtml(f.key)}">
                        <div class="arabic-text" style="font-size:1.35rem; line-height:1.5">${escHtml(f.arabic)}</div>
                        <div class="search-result-gloss">${escHtml(f.hinglish)}</div>
                      </button>
                      <button type="button" class="btn-ghost btn-sm" data-unstar-key="${escHtml(f.key)}" aria-label="Remove star">Remove</button>
                    </div>
                  `).join('')}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
        ${noteEntries.length > 0 ? `
          <section class="settings-section">
            <span class="field-label">Personal Notes / Custom Translations (${noteEntries.length})</span>
            <div class="starred-list-stack">
              ${noteEntries.map(([key, noteText]) => {
                const m = String(key).match(/^s(\d+)l(\d+)/i);
                const jumpAttr = m ? `data-jump-star="${Number(m[1])}:${Number(m[2])}" data-jump-key="${escHtml(key)}"` : '';
                const label = m ? `Unit ${Number(m[1])}, Lesson ${Number(m[2])}` : key;
                return `
                  <div class="starred-item-row">
                    <button type="button" style="flex:1; text-align:left; min-width:0;" ${jumpAttr}>
                      <div class="search-result-unit tabular-nums">${escHtml(label)}</div>
                      <div class="search-result-gloss">${escHtml(noteText)}</div>
                    </button>
                    <button type="button" class="btn-ghost btn-sm" data-del-note-key="${escHtml(key)}" aria-label="Delete personal note">Clear</button>
                  </div>
                `;
              }).join('')}
            </div>
          </section>
        ` : ''}
      </div>
    `;
    body.querySelectorAll('[data-jump-star]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const [u, l] = (btn.getAttribute('data-jump-star') || '1:1').split(':').map(Number);
        const itemKey = btn.getAttribute('data-jump-key') || undefined;
        /** @type {HTMLDialogElement | null} */ (document.getElementById('settings-dialog'))?.close();
        await goToLesson(u, l, { itemKey });
      });
    });
    body.querySelectorAll('[data-unstar-key]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-unstar-key') || '';
        store.toggleStar({ key, arabic: '', hinglish: '', stage: 1, lesson: 1 });
        renderSettingsBody();
      });
    });
    body.querySelectorAll('[data-del-note-key]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-del-note-key') || '';
        store.saveCustomNote(key, '');
        renderSettingsBody();
      });
    });
    return;
  }

  if (_settingsTab === 'sync') {
    const user = cloudSync.user;
    const notesCount = Object.keys(store.customNotes || {}).length;
    body.innerHTML = `
      <div class="settings-stack">
        <section class="settings-section">
          <label class="field-label">Local JSON Backup &amp; Restore</label>
          <p class="search-status-line" style="margin:0 0 6px">Includes ${store.favs.length} starred items, ${notesCount} personal notes (custom translations), SRS boxes, streak, weak words, exam history &amp; completed lessons.</p>
          <div class="lesson-action-group">
            <button type="button" class="btn-secondary" id="btn-export-json">Export JSON</button>
            <button type="button" class="btn-secondary" id="btn-import-json">Import JSON</button>
            <input type="file" id="input-import-json" accept=".json" hidden>
          </div>
        </section>

        <section class="settings-section">
          <label class="field-label">App Version &amp; Cache (v7.0.1)</label>
          <p class="search-status-line" style="margin:0 0 6px">If an older version appears cached on your device, clear the offline cache and reload fresh.</p>
          <div class="lesson-action-group">
            <button type="button" class="btn-secondary btn-sm" id="btn-force-refresh">Force Refresh App</button>
          </div>
        </section>

        <section class="settings-section">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
            <span class="field-label" style="margin:0">Optional Cloud Sync (/user_data)</span>
            <span class="sync-badge ${cloudSync.status === 'synced' ? 'is-connected' : ''}">${escHtml(cloudSync.statusMessage)}</span>
          </div>
          ${user ? `
            <div class="auth-card">
              <div>
                <div style="font-weight:700">${escHtml(user.name)}</div>
                <div class="search-status-line" style="margin:0">${escHtml(user.email)}</div>
              </div>
              <div class="lesson-action-group">
                <button type="button" class="btn-primary btn-sm" id="btn-sync-now">Sync Now</button>
                <button type="button" class="btn-danger btn-sm" id="btn-sign-out">Sign Out</button>
              </div>
            </div>
          ` : `
            <div class="auth-card">
              <p class="search-status-line" style="margin:0">App works 100% offline without an account. Sign in only if you want cross-device sync.</p>
              <button type="button" class="btn-secondary" id="btn-google-signin">Sign in with Google</button>
              <div>
                <label class="field-label" for="auth-email-in">Email</label>
                <input type="email" id="auth-email-in" class="text-input" placeholder="you@example.com" autocomplete="email">
              </div>
              <div>
                <label class="field-label" for="auth-pass-in">Password</label>
                <input type="password" id="auth-pass-in" class="text-input" placeholder="Minimum 6 characters" autocomplete="current-password">
              </div>
              <div id="auth-error-box" class="search-status-line" style="color:var(--accent-danger); margin:0" hidden></div>
              <div class="lesson-action-group" style="justify-content:space-between">
                <button type="button" class="btn-ghost btn-sm" id="btn-email-signup">Create Account</button>
                <button type="button" class="btn-ghost btn-sm" id="btn-forgot-password">Forgot Password?</button>
                <button type="button" class="btn-primary btn-sm" id="btn-email-signin">Sign In</button>
              </div>
            </div>
          `}
        </section>
      </div>
    `;

    body.querySelector('#btn-export-json')?.addEventListener('click', () => {
      const json = store.exportBackupJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'muallim_backup_v7.json';
      a.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('Backup JSON exported.');
    });

    const importInput = /** @type {HTMLInputElement | null} */ (body.querySelector('#input-import-json'));
    body.querySelector('#btn-import-json')?.addEventListener('click', () => importInput?.click());
    importInput?.addEventListener('change', () => {
      const file = importInput.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const stats = store.importBackupJson(String(reader.result || ''));
          showToast(`Imported ${stats.favCount} starred, ${stats.noteCount} notes, ${stats.completedCount} lessons.`);
          goToLesson(store.currentUnit, store.currentLesson, { fromHistory: true });
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Invalid JSON file';
          showToast(`Import failed: ${msg}`);
        }
      };
      reader.readAsText(file);
    });

    body.querySelector('#btn-google-signin')?.addEventListener('click', async () => {
      try {
        await cloudSync.signInWithGoogle();
        showToast('Signed in with Google.');
        renderSettingsBody();
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Google sign-in failed.');
      }
    });

    const doEmailAuth = async (isCreate) => {
      const email = /** @type {HTMLInputElement | null} */ (body.querySelector('#auth-email-in'))?.value.trim() || '';
      const pass = /** @type {HTMLInputElement | null} */ (body.querySelector('#auth-pass-in'))?.value || '';
      const errBox = body.querySelector('#auth-error-box');
      if (!email || !pass) {
        if (errBox) {
          errBox.textContent = 'Enter both email and password.';
          /** @type {HTMLElement} */ (errBox).hidden = false;
        }
        return;
      }
      try {
        await cloudSync.signInWithEmail(email, pass, isCreate);
        showToast(isCreate ? 'Account created and synced.' : 'Signed in.');
        renderSettingsBody();
      } catch (err) {
        if (errBox) {
          errBox.textContent = err instanceof Error ? err.message : 'Authentication failed.';
          /** @type {HTMLElement} */ (errBox).hidden = false;
        }
      }
    };

    body.querySelector('#btn-email-signin')?.addEventListener('click', () => doEmailAuth(false));
    body.querySelector('#btn-email-signup')?.addEventListener('click', () => doEmailAuth(true));

    body.querySelector('#btn-forgot-password')?.addEventListener('click', async () => {
      const email = /** @type {HTMLInputElement | null} */ (body.querySelector('#auth-email-in'))?.value.trim() || '';
      const errBox = /** @type {HTMLElement | null} */ (body.querySelector('#auth-error-box'));
      if (!email) {
        if (errBox) {
          errBox.textContent = 'Enter your email address first to send a reset link.';
          errBox.hidden = false;
        }
        return;
      }
      try {
        await cloudSync.sendPasswordReset(email);
        if (errBox) errBox.hidden = true;
        showToast('Password reset email sent.');
      } catch (err) {
        if (errBox) {
          errBox.textContent = err instanceof Error ? err.message : 'Could not send reset email.';
          errBox.hidden = false;
        }
      }
    });

    body.querySelector('#btn-sync-now')?.addEventListener('click', async () => {
      await cloudSync.pushToCloud();
      showToast('Synced to cloud.');
    });
    body.querySelector('#btn-sign-out')?.addEventListener('click', async () => {
      await cloudSync.signOut();
      showToast('Signed out.');
      renderSettingsBody();
    });

    body.querySelector('#btn-force-refresh')?.addEventListener('click', async () => {
      try {
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map(k => caches.delete(k)));
        }
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map(r => r.unregister()));
        }
      } catch (err) {
        console.warn('[Cache] Clear failed:', err);
      }
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set('_refresh', String(Date.now()));
      window.location.replace(nextUrl.toString());
    });
    return;
  }

  // Reading Preferences Tab
  const hintsOn = Boolean(store.showHints);
  body.innerHTML = `
    <div class="settings-stack">
      <section class="settings-section">
        <span class="field-label">Study Streak &amp; Weekly Log</span>
        ${_renderStudyActivityHtml()}
      </section>

      <section class="settings-section">
        <span class="field-label">Reading Theme</span>
        <div class="theme-pill-grid">
          <button type="button" class="theme-pill-btn" data-set-theme="parchment" aria-pressed="${store.theme === 'parchment'}">
            <span class="theme-swatch parchment" aria-hidden="true"></span>
            <span>Parchment</span>
          </button>
          <button type="button" class="theme-pill-btn" data-set-theme="sepia" aria-pressed="${store.theme === 'sepia'}">
            <span class="theme-swatch sepia" aria-hidden="true"></span>
            <span>Soft Sepia</span>
          </button>
          <button type="button" class="theme-pill-btn" data-set-theme="night" aria-pressed="${store.theme === 'night'}">
            <span class="theme-swatch night" aria-hidden="true"></span>
            <span>Deep Night</span>
          </button>
        </div>
      </section>

      <section class="settings-section">
        <label class="field-label" for="setting-lang-select">Translation Language</label>
        <select id="setting-lang-select" class="select-input">
          <option value="hinglish" ${store.lang === 'hinglish' ? 'selected' : ''}>Roman Urdu (Hinglish)</option>
          <option value="en" ${store.lang === 'en' ? 'selected' : ''}>English</option>
          <option value="ur" ${store.lang === 'ur' ? 'selected' : ''}>Urdu (اردو)</option>
          <option value="hi" ${store.lang === 'hi' ? 'selected' : ''}>Hindi (हिंदी)</option>
        </select>
      </section>

      <section class="settings-section">
        <span class="field-label">Study Mode</span>
        <div class="segmented-tabs">
          <button type="button" class="seg-tab ${store.mode === 'teacher' ? 'active' : ''}" data-set-mode="teacher">Show Translations</button>
          <button type="button" class="seg-tab ${store.mode === 'student' ? 'active' : ''}" data-set-mode="student">Student Mode (Tap to Peek)</button>
        </div>
      </section>

      <section class="settings-section">
        <div class="settings-toggle-row">
          <div>
            <label class="field-label" for="setting-show-hints" style="margin-bottom:2px">Show Root &amp; Transliteration Hints</label>
            <p class="search-status-line" style="margin:0">Display transliteration and clickable root pills below Arabic cards.</p>
          </div>
          <button type="button" id="setting-show-hints" class="header-chip-btn" aria-pressed="${hintsOn}">${hintsOn ? 'On' : 'Off'}</button>
        </div>
      </section>

      <section class="settings-section">
        <div style="display:flex; justify-content:space-between;">
          <label class="field-label" for="setting-arabic-size">Arabic Text Size</label>
          <span class="tabular-nums" style="font-size:0.82rem; font-weight:700" id="lbl-ar-size">${store.arabicScale}px</span>
        </div>
        <input type="range" id="setting-arabic-size" class="range-input" min="18" max="42" step="1" value="${store.arabicScale}">
      </section>

      <section class="settings-section">
        <div style="display:flex; justify-content:space-between;">
          <label class="field-label" for="setting-audio-speed">Audio &amp; Speech Speed</label>
          <span class="tabular-nums" style="font-size:0.82rem; font-weight:700" id="lbl-audio-speed">${store.audioSpeed.toFixed(2)}x</span>
        </div>
        <input type="range" id="setting-audio-speed" class="range-input" min="0.5" max="1.5" step="0.05" value="${store.audioSpeed}">
      </section>
    </div>
  `;

  body.querySelectorAll('[data-set-theme]').forEach(btn => {
    btn.addEventListener('click', () => {
      store.setTheme(btn.getAttribute('data-set-theme') || 'parchment');
      renderSettingsBody();
    });
  });

  body.querySelector('#setting-lang-select')?.addEventListener('change', (e) => {
    const val = /** @type {HTMLSelectElement} */ (e.currentTarget).value;
    store.setLang(val);
    _syncDocumentLang();
    if (_activeView === 'lesson') {
      const y = window.scrollY;
      goToLesson(store.currentUnit, store.currentLesson, { fromHistory: true }).then(() => {
        window.scrollTo({ top: y, behavior: 'auto' });
      });
    } else if (_activeView === 'exam') {
      handleRoute({ view: 'exam', examId: _activeExamId }, { fromHistory: true });
    } else if (_activeView === 'mushaf-check') {
      handleRoute({ view: 'mushaf-check' }, { fromHistory: true });
    } else if (_activeView === 'spiral') {
      handleRoute({ view: 'spiral', ..._activeSpiralParams }, { fromHistory: true });
    }
  });

  body.querySelectorAll('[data-set-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      const m = /** @type {'teacher' | 'student'} */ (btn.getAttribute('data-set-mode'));
      store.setMode(m);
      renderSettingsBody();
    });
  });

  body.querySelector('#setting-show-hints')?.addEventListener('click', (e) => {
    const next = !store.showHints;
    if (typeof store.setShowHints === 'function') {
      store.setShowHints(next);
    } else {
      store.showHints = next;
      store.emit('hints', false);
    }
    const btn = /** @type {HTMLElement} */ (e.currentTarget);
    btn.setAttribute('aria-pressed', String(next));
    btn.textContent = next ? 'On' : 'Off';
  });

  body.querySelector('#setting-arabic-size')?.addEventListener('input', (e) => {
    const val = Number(/** @type {HTMLInputElement} */ (e.currentTarget).value);
    store.setArabicScale(val);
    const lbl = body.querySelector('#lbl-ar-size');
    if (lbl) lbl.textContent = `${val}px`;
  });

  body.querySelector('#setting-audio-speed')?.addEventListener('input', (e) => {
    const val = Number(/** @type {HTMLInputElement} */ (e.currentTarget).value);
    store.setAudioSpeed(val);
    audioPlayer.setRate(val);
    const lbl = body.querySelector('#lbl-audio-speed');
    if (lbl) lbl.textContent = `${val.toFixed(2)}x`;
  });
}

function initApp() {
  store.init();
  _syncDocumentLang();
  audioPlayer.setRate(store.audioSpeed);
  store.setSyncHook(() => cloudSync.queuePush());

  // Snapshot initial resume candidate BEFORE router sets current position
  const initialLastSession = store.lastSession;
  const initialBookmark = store.bookmark;

  router = new AppRouter(
    (arg1, arg2, arg3) => {
      if (arg1 && typeof arg1 === 'object') {
        return handleRoute(arg1, arg2 || {});
      }
      return handleRoute(
        { view: 'lesson', unit: Number(arg1) || 1, lesson: Number(arg2) || 1, itemKey: arg3?.itemKey },
        arg3 || {}
      );
    },
    (route, opts) => handleRoute(route, opts || {})
  );
  const initialRoute = router.init();

  // Fallback hashchange listener if router.js lacks syncHash/onRoute support
  if (typeof router.syncHash !== 'function') {
    window.addEventListener('hashchange', () => {
      const h = window.location.hash;
      if (h === '#bookmarks' || h === '#favourites') {
        handleRoute({ view: h.slice(1) }, { fromHistory: true, rawHash: h });
        return;
      }
      const r = parseRoute(h, window.location.search);
      if (r && r.view && r.view !== 'lesson') {
        handleRoute(r, { fromHistory: true, rawHash: h });
      }
    });
  }

  searchCtrl = new SearchController((u, l) => goToLesson(u, l));
  searchCtrl.bind();

  srsCtrl = new SrsController({ onNotify: showToast });

  practiceCtrl = new PracticeController({
    onNotify: showToast,
    onJumpToLesson: (u, l) => goToLesson(u, l)
  });
  practiceCtrl.bindTabs();

  examsCtrl = typeof ExamsController === 'function' ? new ExamsController({ searchCtrl }) : ExamsController;

  // Wire header & mobile bottom bar controls
  document.getElementById('btn-lesson-picker')?.addEventListener('click', openLessonPicker);
  document.getElementById('btn-header-search')?.addEventListener('click', () => searchCtrl.open());
  document.getElementById('btn-header-drill')?.addEventListener('click', () => srsCtrl.open('srs'));
  document.getElementById('btn-open-settings')?.addEventListener('click', () => openSettingsDialog('prefs'));
  document.getElementById('btn-header-mode')?.addEventListener('click', () => {
    store.setMode(store.mode === 'student' ? 'teacher' : 'student');
  });

  document.getElementById('mbar-prev')?.addEventListener('click', navigatePrevLesson);
  document.getElementById('mbar-next')?.addEventListener('click', navigateNextLesson);
  document.getElementById('mbar-student')?.addEventListener('click', () => {
    store.setMode(store.mode === 'student' ? 'teacher' : 'student');
  });
  document.getElementById('mbar-drill')?.addEventListener('click', () => srsCtrl.open('srs'));
  document.getElementById('mbar-search')?.addEventListener('click', () => searchCtrl.open());

  // Quick-launch buttons inside #lesson-picker-dialog and #practice-dialog
  document.querySelectorAll('[data-quick-route]').forEach(btn => {
    btn.addEventListener('click', () => {
      const hash = btn.getAttribute('data-quick-route') || '';
      const dlg = btn.closest('dialog');
      if (dlg instanceof HTMLDialogElement && dlg.open) dlg.close();
      if (hash) navigateToHash(hash);
    });
  });

  // Settings tab buttons
  document.getElementById('tab-settings-prefs')?.addEventListener('click', () => {
    _settingsTab = 'prefs';
    _syncSettingsTabs();
    renderSettingsBody();
  });
  document.getElementById('tab-settings-starred')?.addEventListener('click', () => {
    _settingsTab = 'starred';
    _syncSettingsTabs();
    renderSettingsBody();
  });
  document.getElementById('tab-settings-sync')?.addEventListener('click', () => {
    _settingsTab = 'sync';
    _syncSettingsTabs();
    renderSettingsBody();
  });

  // Generic dialog close buttons & backdrop click
  document.querySelectorAll('[data-close-dialog]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-close-dialog');
      if (id) /** @type {HTMLDialogElement | null} */ (document.getElementById(id))?.close();
    });
  });
  document.querySelectorAll('dialog.app-dialog').forEach(dlg => {
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg) /** @type {HTMLDialogElement} */ (dlg).close();
    });
  });

  bindKeyboardShortcuts({
    onPrev: navigatePrevLesson,
    onNext: navigateNextLesson,
    onSpace: handleSpaceKey,
    onSearch: () => searchCtrl.open(),
    onEscape: () => {
      const openDlg = /** @type {HTMLDialogElement | null} */ (document.querySelector('dialog[open]'));
      if (openDlg) openDlg.close();
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      document.querySelectorAll('[data-note-editor-slot]').forEach(el => {
        el.innerHTML = '';
      });
    }
  });

  // Surgical in-place store updates (never reset window.scrollY on active lesson)
  store.subscribe((reason) => {
    _updateChromeLabels();
    if (reason === 'lang') {
      _syncDocumentLang();
    }
    const mount = document.getElementById('lesson-content-mount');
    if (!mount || _activeView !== 'lesson') return;

    if (reason === 'mode') {
      syncGlossBoxModeAttributes(mount, store.mode);
    } else if (reason === 'progress') {
      syncCompletionInPlace(mount, store.currentUnit, store.currentLesson);
    } else if (reason === 'favs') {
      syncCardStarsInPlace(mount);
    } else if (reason === 'notes') {
      syncCardNotesInPlace(mount);
    } else if (reason === 'bookmark') {
      syncCardBookmarksInPlace(mount);
    } else if (reason === 'hints') {
      if (store.showHints && typeof searchCtrl?.ensureIndexLoaded === 'function') {
        searchCtrl.ensureIndexLoaded().then(() => {
          if (_activeView === 'lesson') {
            updateLessonHintsInPlace(mount, store.currentUnit, store.currentLesson, (u, l, id) => searchCtrl.getItemMeta?.(u, l, id) || null);
          }
        }).catch(err => console.warn('[App] Hints load error:', err));
      } else {
        updateLessonHintsInPlace(mount, store.currentUnit, store.currentLesson);
      }
    } else if (reason === 'cloudPull') {
      _syncDocumentLang();
      syncCompletionInPlace(mount, store.currentUnit, store.currentLesson);
      syncCardStarsInPlace(mount);
      syncCardBookmarksInPlace(mount);
      syncCardNotesInPlace(mount);
      if (store.showHints && typeof searchCtrl?.ensureIndexLoaded === 'function') {
        searchCtrl.ensureIndexLoaded().then(() => {
          if (_activeView === 'lesson') {
            updateLessonHintsInPlace(mount, store.currentUnit, store.currentLesson, (u, l, id) => searchCtrl.getItemMeta?.(u, l, id) || null);
          }
        }).catch(err => console.warn('[App] Hints load error:', err));
      } else {
        updateLessonHintsInPlace(mount, store.currentUnit, store.currentLesson);
      }
    }
  });

  cloudSync.subscribe(() => {
    const dlg = /** @type {HTMLDialogElement | null} */ (document.getElementById('settings-dialog'));
    if (dlg?.open && _settingsTab === 'sync') {
      renderSettingsBody();
    }
  });

  // Dispatch initial route + show Resume banner if landing on bare URL with prior progress
  const rawHash = window.location.hash;
  const resolvedInitial =
    rawHash === '#bookmarks' || rawHash === '#favourites'
      ? { view: rawHash.slice(1) }
      : (initialRoute && initialRoute.view ? initialRoute : parseRoute(rawHash, window.location.search) || initialRoute);

  handleRoute(resolvedInitial, { fromHistory: true, rawHash }).then(() => {
    if (!initialRoute.explicit && !_resumeDismissed && _activeView === 'lesson') {
      const resumeMount = document.getElementById('resume-banner-mount');
      const candidate = getResumeCandidate(initialLastSession, initialBookmark, initialRoute.unit || 1, initialRoute.lesson || 1);
      if (resumeMount && candidate) {
        renderResumeBanner(
          resumeMount,
          candidate,
          (u, l, itemKey) => {
            _resumeDismissed = true;
            resumeMount.innerHTML = '';
            goToLesson(u, l, { itemKey });
          },
          () => {
            _resumeDismissed = true;
            resumeMount.innerHTML = '';
          }
        );
      }
    }
  });

  cloudSync.restoreIfOptedIn();

  // Register Service Worker on HTTP(S) with automatic update activation
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    const hadController = Boolean(navigator.serviceWorker.controller);
    let swReloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || swReloading) return;
      swReloading = true;
      window.location.reload();
    });
    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).then((reg) => {
      reg.update().catch(err => console.warn('[SW] Update check skipped:', err));
      reg.addEventListener('updatefound', () => {
        const next = reg.installing;
        if (!next) return;
        next.addEventListener('statechange', () => {
          if (next.state === 'installed' && navigator.serviceWorker.controller) {
            next.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });
    }).catch(err => {
      console.warn('[SW] Registration skipped:', err);
    });
  }

  // Expose minimal debug/API facade
  /** @type {any} */ (window).Muallim = {
    goToLesson,
    navigateToHash,
    openLessonPicker,
    openSearch: () => searchCtrl.open(),
    openDrill: (t) => srsCtrl.open(t),
    openPractice: (m) => practiceCtrl.open(m),
    openSettings: (t) => openSettingsDialog(t),
    store
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
