// @ts-check

/**
 * Muallim ul-Qur'an — Modular Grammar Visuals Loader (v7.0)
 * Handles dynamic import of unit visual modules with monotonic cancellation tokens
 * and memory cleanup via destroy().
 */

/**
 * @type {Map<string, {mount: Function, destroy: Function}>}
 */
const _activeVisual = new Map();
let _loadToken = 0;

/**
 * Load and mount a lesson's grammar visual.
 * @param {string} lessonKey - Format: "s1l3" (unit 1, lesson 3)
 * @param {string | HTMLElement} containerId - DOM element ID or element to mount into
 * @returns {Promise<void>}
 */
export async function loadVisual(lessonKey, containerId) {
  const token = ++_loadToken;
  const cKey = typeof containerId === 'string' ? containerId : (containerId?.id || 'visual-container');

  // Destroy previous visual before loading next to prevent memory leaks
  if (_activeVisual.has(cKey)) {
    const prev = _activeVisual.get(cKey);
    if (prev && typeof prev.destroy === 'function') {
      try {
        prev.destroy();
      } catch (err) {
        console.warn('[VisualLoader] Error during visual destroy():', err);
      }
    }
    _activeVisual.delete(cKey);
  }

  const normalizedKey = String(lessonKey || '').toLowerCase();
  const match = normalizedKey.match(/s(\d+)l(\d+)/);
  const unitNum = Math.min(7, Math.max(1, match ? parseInt(match[1], 10) : 1));

  let mod;
  try {
    mod = await import(`./unit${unitNum}.js`);
  } catch (err) {
    console.warn(`[VisualLoader] Failed to load unit${unitNum}.js:`, err);
    return;
  }

  // Abort if another loadVisual or destroyVisual call superseded this import
  if (token !== _loadToken) {
    return;
  }

  if (mod && typeof mod.mount === 'function') {
    mod.mount(containerId, normalizedKey);
    _activeVisual.set(cKey, mod);
  }
}

/**
 * Clean up active visual in container and invalidate pending imports.
 * @param {string | HTMLElement} containerId
 * @returns {void}
 */
export function destroyVisual(containerId) {
  _loadToken++;
  const cKey = typeof containerId === 'string' ? containerId : (containerId?.id || 'visual-container');
  if (_activeVisual.has(cKey)) {
    const prev = _activeVisual.get(cKey);
    if (prev && typeof prev.destroy === 'function') {
      try {
        prev.destroy();
      } catch (err) {
        console.warn('[VisualLoader] Error during visual destroy():', err);
      }
    }
    _activeVisual.delete(cKey);
  }
  const el = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (el) el.innerHTML = '';
}
