// @ts-check

/**
 * Muallim ul-Qur'an — Grammar Visuals v1 Fallback Archetypes Module
 * Acts as bridge to legacy GrammarVisuals engine during mixed-state rollout.
 */

/**
 * Mount legacy visual for given lesson key.
 * @param {string} containerId - DOM container ID
 * @param {string} lessonKey - Lesson key (e.g., 's1l3')
 * @returns {void}
 */
export function mount(containerId, lessonKey) {
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;
  
  if (typeof window !== 'undefined' && /** @type {any} */ (window).GrammarVisuals) {
    /** @type {any} */ (window).GrammarVisuals.mount(lessonKey, containerId);
  }
}

/**
 * Teardown and clean up visual DOM/listeners.
 * @returns {void}
 */
export function destroy() {
  // Teardown logic
}
