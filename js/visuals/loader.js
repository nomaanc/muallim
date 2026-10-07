// @ts-check

/**
 * Muallim ul-Qur'an — Modular Grammar Visuals Loader (v2.0)
 * Handles dynamic import of unit visual modules, memory cleanup via destroy(),
 * and graceful fallback to archetypes.
 */

/**
 * @type {Map<string, {mount: Function, destroy: Function}>}
 */
const _activeVisual = new Map();

/**
 * Load and mount a lesson's grammar visual.
 * @param {string} lessonKey - Format: "s1l3" (unit 1, lesson 3)
 * @param {string} containerId - DOM element ID to mount into
 * @returns {Promise<void>}
 */
export async function loadVisual(lessonKey, containerId) {
  const cKey = typeof containerId === 'string' ? containerId : (containerId?.id || 'visual-container');
  // Destroy previous visual to prevent memory leaks (QG-1)
  if (_activeVisual.has(cKey)) {
    const prev = _activeVisual.get(cKey);
    if (prev && typeof prev.destroy === 'function') {
      try {
        prev.destroy();
      } catch (err) {
        console.warn('Error during visual destroy():', err);
      }
    }
    _activeVisual.delete(cKey);
  }

  const normalizedKey = (lessonKey || '').toLowerCase();
  const match = normalizedKey.match(/s(\d+)l(\d+)/);
  const unitNum = match ? parseInt(match[1], 10) : 1;

  let mod;
  try {
    mod = await import(`./unit${unitNum}.js`);
  } catch (err) {
    // Graceful fallback to archetypes (mixed-state deployment §2.3)
    try {
      mod = await import('./archetypes.js');
    } catch (fallbackErr) {
      console.warn('Failed to load fallback archetypes:', fallbackErr);
    }
  }

  if (mod && typeof mod.mount === 'function') {
    mod.mount(containerId, normalizedKey);
    _activeVisual.set(cKey, mod);
  }
}

/**
 * Clean up active visual in container.
 * @param {string | HTMLElement} containerId
 * @returns {void}
 */
export function destroyVisual(containerId) {
  const cKey = typeof containerId === 'string' ? containerId : (containerId?.id || 'visual-container');
  if (_activeVisual.has(cKey)) {
    const prev = _activeVisual.get(cKey);
    if (prev && typeof prev.destroy === 'function') {
      try {
        prev.destroy();
      } catch (err) {
        console.warn('Error during visual destroy():', err);
      }
    }
    _activeVisual.delete(cKey);
  }
  const el = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (el) el.innerHTML = '';
}

// Attach to window for non-module script consumption if needed
if (typeof window !== 'undefined') {
  /** @type {any} */ (window).VisualLoader = {
    loadVisual,
    destroyVisual
  };
}
