// @ts-check

/**
 * Muallim ul-Qur'an — Hash & Query Deep-Link Router + Keyboard Shortcuts (v6.0)
 * Supports #u5/l6 and ?u=5&l=6, Back/Forward history navigation, and Resume banner tracking.
 */

/**
 * Parse unit & lesson from a hash or search string.
 * @param {string} hash
 * @param {string} search
 * @returns {{unit: number, lesson: number} | null}
 */
export function parseRoute(hash, search) {
  const h = String(hash || '').trim();
  const hashMatch = h.match(/^#?u(\d+)\s*\/\s*l(\d+)$/i) || h.match(/^#?u(\d+)l(\d+)$/i);
  if (hashMatch) {
    const unit = Math.min(7, Math.max(1, parseInt(hashMatch[1], 10)));
    const lesson = Math.max(1, parseInt(hashMatch[2], 10));
    return { unit, lesson };
  }

  if (search) {
    const params = new URLSearchParams(search);
    const rawU = params.get('u') || params.get('unit');
    const rawL = params.get('l') || params.get('lesson');
    if (rawU && rawL) {
      const unit = Math.min(7, Math.max(1, parseInt(rawU, 10)));
      const lesson = Math.max(1, parseInt(rawL, 10));
      if (Number.isFinite(unit) && Number.isFinite(lesson)) {
        return { unit, lesson };
      }
    }
  }
  return null;
}

/**
 * Format canonical hash route.
 * @param {number} unit
 * @param {number} lesson
 * @returns {string}
 */
export function formatRouteHash(unit, lesson) {
  return `#u${unit}/l${lesson}`;
}

export class AppRouter {
  /**
   * @param {(unit: number, lesson: number, opts?: {fromHistory?: boolean}) => Promise<void>} onNavigate
   */
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
    this.hasExplicitInitialRoute = false;
    this._suppressHashEvent = false;
  }

  /**
   * Resolve initial URL route and attach history listeners.
   * @returns {{unit: number, lesson: number, explicit: boolean}}
   */
  init() {
    const parsed = parseRoute(window.location.hash, window.location.search);
    this.hasExplicitInitialRoute = Boolean(parsed);
    const target = parsed || { unit: 1, lesson: 1 };

    // Normalize ?u=5&l=6 or empty root cleanly in current history entry
    const hashStr = formatRouteHash(target.unit, target.lesson);
    if (window.location.hash !== hashStr) {
      try {
        history.replaceState({ unit: target.unit, lesson: target.lesson }, '', `${window.location.pathname}${hashStr}`);
      } catch (err) {
        console.warn('[Router] replaceState skipped:', err);
      }
    }

    window.addEventListener('popstate', (ev) => {
      const stateRoute = ev.state && ev.state.unit && ev.state.lesson
        ? { unit: Number(ev.state.unit), lesson: Number(ev.state.lesson) }
        : parseRoute(window.location.hash, window.location.search);
      if (stateRoute) {
        this.onNavigate(stateRoute.unit, stateRoute.lesson, { fromHistory: true });
      }
    });

    window.addEventListener('hashchange', () => {
      if (this._suppressHashEvent) return;
      const route = parseRoute(window.location.hash, '');
      if (route) {
        this.onNavigate(route.unit, route.lesson, { fromHistory: true });
      }
    });

    return { ...target, explicit: this.hasExplicitInitialRoute };
  }

  /**
   * Navigate and push a new history entry unless triggered by popstate/hashchange.
   * @param {number} unit
   * @param {number} lesson
   * @param {boolean} [push]
   */
  syncUrl(unit, lesson, push = true) {
    const hashStr = formatRouteHash(unit, lesson);
    if (window.location.hash === hashStr) return;
    this._suppressHashEvent = true;
    try {
      if (push) {
        history.pushState({ unit, lesson }, '', `${window.location.pathname}${hashStr}`);
      } else {
        history.replaceState({ unit, lesson }, '', `${window.location.pathname}${hashStr}`);
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
 * Determine whether a resume banner should be displayed on landing.
 * @param {{stage: number, lesson: number, title?: string} | null} lastSession
 * @param {{stage: number, lesson: number, arabic?: string} | null} bookmark
 * @param {number} activeUnit
 * @param {number} activeLesson
 * @returns {{unit: number, lesson: number, label: string} | null}
 */
export function getResumeCandidate(lastSession, bookmark, activeUnit, activeLesson) {
  const candidate = lastSession && lastSession.stage && lastSession.lesson
    ? {
        unit: Number(lastSession.stage),
        lesson: Number(lastSession.lesson),
        label: lastSession.title || `Unit ${lastSession.stage} · Lesson ${lastSession.lesson}`
      }
    : (bookmark && bookmark.stage && bookmark.lesson
        ? {
            unit: Number(bookmark.stage),
            lesson: Number(bookmark.lesson),
            label: `Bookmarked — Unit ${bookmark.stage} · Lesson ${bookmark.lesson}`
          }
        : null);

  if (!candidate) return null;
  if (candidate.unit === activeUnit && candidate.lesson === activeLesson) return null;
  return candidate;
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
