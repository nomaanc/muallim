// @ts-check

/**
 * Muallim ul-Qur'an — Grammar Visuals Fallback Archetypes Module (v2.0)
 * Renders the generic concept card fallback migrated from legacy grammar-visuals.js
 * when a unit visual module is unavailable.
 */

/** @type {HTMLElement | null} */
let _mountedContainer = null;

/**
 * Mount generic fallback visual for a given lesson key.
 * @param {string | HTMLElement} containerId - DOM container ID or element
 * @param {string} [lessonKey] - Lesson key (e.g., 's1l3')
 * @returns {void}
 */
export function mount(containerId, lessonKey) {
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;

  _mountedContainer = container;
  const label = typeof lessonKey === 'string' && lessonKey.trim()
    ? lessonKey.trim().toUpperCase()
    : 'Concept';

  container.innerHTML = `
    <div class="gv-card">
      <div class="gv-header">
        <span>✨ Sabbaq ka Markazi Nuqta (Core Focus)</span>
        <span class="gv-badge"></span>
      </div>
      <div class="gv-body">
        <div class="gv-interactive-area" style="background: var(--bg-surface-elevated, #fdfbf7); border-radius: 12px; border: 1.5px dashed var(--divider-light, #e2d9cc); padding: 12px;">
          <div style="font-size: 0.95rem; color: var(--text-primary, #374151); text-align: center; max-width: 380px; line-height: 1.5;">
            Is sabaq mein surkh (red) rang markazi usool ya tabdeeli ko wazeh karta hai. Har lafz ke harakat aur maani par dhyan dein.
          </div>
        </div>
      </div>
    </div>
  `;

  const badge = container.querySelector('.gv-badge');
  if (badge) badge.textContent = label;
}

/**
 * Teardown and clean up visual DOM/listeners.
 * @returns {void}
 */
export function destroy() {
  if (_mountedContainer) {
    _mountedContainer.innerHTML = '';
    _mountedContainer = null;
  }
}
