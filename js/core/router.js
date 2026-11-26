// @ts-check

/**
 * Muallim ul-Qur'an — Hash & Query Deep-Link Router + Keyboard Shortcuts (v7.0)
 * Supports lesson routes (#u5/l6, ?u=5&l=6, #u5/l6@itemKey), Model Exams (#exam/*),
 * Mushaf Showcase (#mushaf-check), 9-Pillar Spiral & Root Explorer (#spiral*),
 * and modal shortcut triggers (#bookmarks, #favourites).
 */

import { store } from './store.js';

/**
 * @typedef {
 *   | {view: 'lesson', unit: number, lesson: number, itemKey?: string}
 *   | {view: 'exam', examId: 'vol1' | 'u4' | 'u5' | 'u7'}
 *   | {view: 'mushaf-check'}
 *   | {view: 'spiral', root?: string, pillar?: number}
 *   | {view: 'bookmarks'}
 *   | {view: 'favourites'}
 * } ParsedRoute
 */

/**
 * Parse route from a hash or search string into a discriminated route object.
 * @param {string} hash
 * @param {string} [search]
 * @returns {ParsedRoute | null}
 */
export function parseRoute(hash, search = '') {
  const h = String(hash || '').trim();

  if (/^#?bookmarks\/?$/i.test(h)) {
    return { view: 'bookmarks' };
  }

  if (/^#?favou?rites\/?$/i.test(h)) {
    return { view: 'favourites' };
  }

  if (/^#?mushaf-check\/?$/i.test(h)) {
    return { view: 'mushaf-check' };
  }

  const examMatch = h.match(/^#?exam\/(vol1|u4|u5|u7)\/?$/i);
  if (examMatch) {
    return {
      view: 'exam',
      examId: /** @type {'vol1' | 'u4' | 'u5' | 'u7'} */ (examMatch[1].toLowerCase())
    };
  }

  const spiralRootMatch = h.match(/^#?spiral\/root\/(.+)$/i);
  if (spiralRootMatch) {
    let root = spiralRootMatch[1].trim();
    try {
      root = decodeURIComponent(root);
    } catch (_) {
      // Keep raw value if malformed URI component
    }
    return { view: 'spiral', root };
  }

  const spiralPillarMatch = h.match(/^#?spiral\/p(\d+)\/?$/i);
  if (spiralPillarMatch) {
    return { view: 'spiral', pillar: parseInt(spiralPillarMatch[1], 10) };
  }

  if (/^#?spiral\/?$/i.test(h)) {
    return { view: 'spiral' };
  }

  const hashMatch = h.match(/^#?u(\d+)\s*\/\s*l(\d+)(?:@([^\s#]+))?$/i)
    || h.match(/^#?u(\d+)l(\d+)(?:@([^\s#]+))?$/i);
  if (hashMatch) {
    const unit = Math.min(7, Math.max(1, parseInt(hashMatch[1], 10)));
    const lesson = Math.max(1, parseInt(hashMatch[2], 10));
    let itemKey = hashMatch[3] ? hashMatch[3].trim() : '';
    if (itemKey) {
      try { itemKey = decodeURIComponent(itemKey); } catch (_) { /* keep raw */ }
    }
    return itemKey
      ? { view: 'lesson', unit, lesson, itemKey }
      : { view: 'lesson', unit, lesson };
  }

  if (search) {
    const params = new URLSearchParams(search);
    const rawU = params.get('u') || params.get('unit');
    const rawL = params.get('l') || params.get('lesson');
    if (rawU && rawL) {
      const unit = Math.min(7, Math.max(1, parseInt(rawU, 10)));
      const lesson = Math.max(1, parseInt(rawL, 10));
      if (Number.isFinite(unit) && Number.isFinite(lesson)) {
        const itemKey = (params.get('item') || params.get('key') || '').trim();
        return itemKey
          ? { view: 'lesson', unit, lesson, itemKey }
          : { view: 'lesson', unit, lesson };
      }
    }
  }
  return null;
}

/**
 * Format canonical lesson hash route.
 * @param {number} unit
 * @param {number} lesson
 * @param {string} [itemKey]
 * @returns {string}
 */
export function formatRouteHash(unit, lesson, itemKey = '') {
  return itemKey ? `#u${unit}/l${lesson}@${encodeURIComponent(itemKey)}` : `#u${unit}/l${lesson}`;
}

export class AppRouter {
  /**
   * @param {(unit: number, lesson: number, opts?: {fromHistory?: boolean, itemKey?: string, route?: ParsedRoute}) => Promise<void>} onNavigate
   * @param {(route: ParsedRoute, opts?: {fromHistory?: boolean}) => Promise<void> | void} [onRoute]
   */
  constructor(onNavigate, onRoute) {
    this.onNavigate = onNavigate;
    this.onRoute = onRoute || null;
    this.hasExplicitInitialRoute = false;
    this._suppressHashEvent = false;
  }

  /**
   * Dispatch a parsed route to the appropriate callback.
   * @param {ParsedRoute} route
   * @param {boolean} fromHistory
   */
  _dispatch(route, fromHistory) {
    if (route.view === 'lesson') {
      this.onNavigate(route.unit, route.lesson, {
        fromHistory,
        itemKey: route.itemKey,
        route
      });
    } else if (this.onRoute) {
      this.onRoute(route, { fromHistory });
    } else {
      // Fallback for single-callback callers
      /** @type {any} */ (this.onNavigate)(route, null, { fromHistory, route });
    }
  }

  /**
   * Resolve initial URL route and attach history listeners.
   * @returns {ParsedRoute & {unit?: number, lesson?: number, explicit: boolean}}
   */
  init() {
    const parsed = parseRoute(window.location.hash, window.location.search);
    this.hasExplicitInitialRoute = Boolean(parsed);
    const target = parsed || { view: /** @type {const} */ ('lesson'), unit: 1, lesson: 1 };

    if (target.view === 'lesson') {
      const hashStr = formatRouteHash(target.unit, target.lesson, target.itemKey);
      if (window.location.hash !== hashStr) {
        try {
          history.replaceState(target, '', `${window.location.pathname}${hashStr}`);
        } catch (err) {
          console.warn('[Router] replaceState skipped:', err);
        }
      }
    }

    window.addEventListener('popstate', (ev) => {
      const stateRoute = ev.state && ev.state.view
        ? /** @type {ParsedRoute} */ (ev.state)
        : (ev.state && ev.state.unit && ev.state.lesson
          ? { view: /** @type {const} */ ('lesson'), unit: Number(ev.state.unit), lesson: Number(ev.state.lesson), itemKey: ev.state.itemKey }
          : parseRoute(window.location.hash, window.location.search));
      if (stateRoute) {
        this._dispatch(stateRoute, true);
      }
    });

    window.addEventListener('hashchange', () => {
      if (this._suppressHashEvent) return;
      const route = parseRoute(window.location.hash, '');
      if (route) {
        this._dispatch(route, true);
      }
    });

    if (target.view === 'lesson') {
      return { ...target, explicit: this.hasExplicitInitialRoute };
    }
    return { ...target, unit: 1, lesson: 1, explicit: true };
  }

  /**
   * Navigate and push a new history entry unless triggered by popstate/hashchange.
   * @param {number} unit
   * @param {number} lesson
   * @param {boolean} [push]
   * @param {string} [itemKey]
   */
  syncUrl(unit, lesson, push = true, itemKey = '') {
    const hashStr = formatRouteHash(unit, lesson, itemKey);
    const stateObj = itemKey ? { view: 'lesson', unit, lesson, itemKey } : { view: 'lesson', unit, lesson };
    this.syncHash(hashStr, stateObj, push);
  }

  /**
   * Update location hash for any route view without firing redundant hashchange loops.
   * @param {string} hashStr
   * @param {object} [stateObj]
   * @param {boolean} [push]
   */
  syncHash(hashStr, stateObj = {}, push = true) {
    const normalized = hashStr.startsWith('#') ? hashStr : `#${hashStr}`;
    if (window.location.hash === normalized) return;
    this._suppressHashEvent = true;
    try {
      if (push) {
        history.pushState(stateObj, '', `${window.location.pathname}${normalized}`);
      } else {
        history.replaceState(stateObj, '', `${window.location.pathname}${normalized}`);
      }
    } catch (err) {
      console.warn('[Router] History update skipped:', err);
    } finally {
      setTimeout(() => {
        this._suppressHashEvent = false;
      }, 0);
    }
  }
}

/**
 * Compute both last-session and bookmark resume candidates independently.
 * @param {{stage: number, lesson: number, title?: string} | null} [lastSession]
 * @param {{stage: number, lesson: number, itemId?: string, arabic?: string} | null} [bookmark]
 * @param {number} [activeUnit]
 * @param {number} [activeLesson]
 * @returns {{
 *   sessionCandidate: {unit: number, lesson: number, label: string} | null,
 *   bookmarkCandidate: {unit: number, lesson: number, itemKey: string, arabic: string, label: string} | null
 * }}
 */
export function getResumeCandidate(
  lastSession = store.lastSession,
  bookmark = store.bookmark,
  activeUnit = store.currentUnit,
  activeLesson = store.currentLesson
) {
  let sessionCandidate = null;
  if (lastSession && lastSession.stage && lastSession.lesson) {
    const su = Number(lastSession.stage);
    const sl = Number(lastSession.lesson);
    if (su !== activeUnit || sl !== activeLesson) {
      sessionCandidate = {
        unit: su,
        lesson: sl,
        label: lastSession.title || `Unit ${su} · Lesson ${sl}`
      };
    }
  }

  let bookmarkCandidate = null;
  if (bookmark && bookmark.stage && bookmark.lesson) {
    const bu = Number(bookmark.stage);
    const bl = Number(bookmark.lesson);
    bookmarkCandidate = {
      unit: bu,
      lesson: bl,
      itemKey: String(bookmark.itemId || ''),
      arabic: String(bookmark.arabic || ''),
      label: `Bookmarked: Unit ${bu} · Lesson ${bl}`
    };
  }

  return { sessionCandidate, bookmarkCandidate };
}

/**
 * Bind global keyboard shortcuts without interfering with form inputs or open dialogs.
 * @param {{
 *   onPrev: () => void,
 *   onNext: () => void,
 *   onSpace: () => boolean,
 *   onSearch: () => void,
 *   onEscape: () => void
 * }} handlers
 * @returns {() => void}
 */
export function bindKeyboardShortcuts(handlers) {
  /** @param {KeyboardEvent} e */
  const onKeyDown = (e) => {
    const target = /** @type {HTMLElement | null} */ (e.target);
    const tag = target ? target.tagName.toLowerCase() : '';
    const isInput = tag === 'input' || tag === 'textarea' || tag === 'select' || (target && target.isContentEditable);

    if (e.key === 'Escape') {
      handlers.onEscape();
      return;
    }

    if (isInput || e.metaKey || e.ctrlKey || e.altKey) return;

    const openDialog = document.querySelector('dialog[open]');
    if (openDialog) {
      if (e.key === ' ' && openDialog.id === 'drill-dialog') {
        if (handlers.onSpace()) e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlers.onPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handlers.onNext();
    } else if (e.key === '/') {
      e.preventDefault();
      handlers.onSearch();
    } else if (e.key === ' ' || e.code === 'Space') {
      // Only intercept Space if focus is not on an interactive button/link
      if (tag === 'button' || tag === 'a') return;
      if (handlers.onSpace()) {
        e.preventDefault();
      }
    }
  };

  document.addEventListener('keydown', onKeyDown);
  return () => document.removeEventListener('keydown', onKeyDown);
}
