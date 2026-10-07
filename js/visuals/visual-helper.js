// @ts-check

/**
 * Visual Helper - Modular Framework for Muallim v2 Grammar Visuals
 * Provides standardized SVG rendering, Kya Hoga prediction challenge,
 * live word anatomy legend chips, and before/after comparison toggle.
 */

/**
 * @typedef {Object} PredictionConfig
 * @property {string} question
 * @property {[string, string]} options
 * @property {number} correct
 * @property {string} explanation
 */

/**
 * @typedef {Object} AnatomyChip
 * @property {'root' | 'suffix' | 'vowel'} role
 * @property {string} label
 * @property {string} targetId
 */

/**
 * @typedef {Object} VisualConfig
 * @property {string} lessonKey
 * @property {string} title
 * @property {string} badge
 * @property {string} svgOriginal
 * @property {string} svgTransformed
 * @property {PredictionConfig} prediction
 * @property {AnatomyChip[]} chips
 */

/**
 * Sound trigger helper
 * @param {'correct' | 'wrong' | 'pop'} sound
 */
function playSfx(sound) {
  if (typeof window !== 'undefined' && /** @type {any} */ (window).AudioFX) {
    /** @type {any} */ (window).AudioFX.play(sound);
  }
}

/**
 * Render and attach a complete v2 grammar visual to a container element.
 * @param {HTMLElement} container
 * @param {VisualConfig} config
 * @returns {() => void} Teardown callback for destroy()
 */
export function renderVisual(container, config) {
  const cardId = `gv-card-${config.lessonKey}`;
  const asalSvgId = `${cardId}-asal`;
  const transformedSvgId = `${cardId}-trans`;
  const toggleBtnId = `${cardId}-toggle`;
  const kyaAccordionId = `${cardId}-kya-body`;
  const kyaToggleBtnId = `${cardId}-kya-toggle`;
  const kyaCheckBtnId = `${cardId}-kya-check`;
  const kyaResultId = `${cardId}-kya-result`;

  const chipElementsHtml = config.chips.map((c, idx) => `
    <button type="button" class="anatomy-chip chip-${c.role}" id="${cardId}-chip-${idx}" data-target="${c.targetId}" aria-label="Highlight ${c.label}">
      <span>●</span>
      <span>${c.label}</span>
    </button>
  `).join('');

  container.innerHTML = `
    <div class="gv-card" id="${cardId}">
      <div class="gv-header">
        <span>${config.title}</span>
        <div style="display:flex; align-items:center; gap:8px;">
          <button type="button" class="compare-toggle-btn" id="${toggleBtnId}" aria-label="Toggle between original and transformed state">
            <span class="lbl-asal" style="font-weight:700;">Asal</span>
            <span>⇄</span>
            <span class="lbl-trans" style="opacity:0.6;">Badla Hua</span>
          </button>
          <span class="gv-badge">${config.badge}</span>
        </div>
      </div>

      <div class="gv-body" style="padding:14px;">
        <div class="gv-svg-viewport" style="width:100%; min-height:160px; display:flex; justify-content:center; align-items:center;">
          <div id="${asalSvgId}" style="width:100%; display:block;" role="img" aria-label="${config.title} Original State">
            ${config.svgOriginal}
          </div>
          <div id="${transformedSvgId}" style="width:100%; display:none;" role="img" aria-label="${config.title} Transformed State">
            ${config.svgTransformed}
          </div>
        </div>

        <div class="chip-row" style="margin-top:12px;" role="toolbar" aria-label="Word Anatomy Legend">
          ${chipElementsHtml}
        </div>

        <div class="kya-hoga-box">
          <button type="button" class="kya-hoga-toggle" id="${kyaToggleBtnId}" aria-expanded="false" aria-controls="${kyaAccordionId}">
            <span>▸ Kya Hoga? (Prediction Challenge)</span>
            <span style="font-size:0.75rem; opacity:0.8;">Tap to Guess</span>
          </button>
          <div class="kya-hoga-body" id="${kyaAccordionId}" style="display:none;">
            <p style="font-size:0.86rem; margin:0 0 8px; font-weight:600; color:var(--text, #1f2937);">${config.prediction.question}</p>
            <div role="radiogroup" aria-label="Prediction Options">
              <label class="kya-hoga-option">
                <input type="radio" name="kya_${config.lessonKey}" value="0">
                <span>${config.prediction.options[0]}</span>
              </label>
              <label class="kya-hoga-option">
                <input type="radio" name="kya_${config.lessonKey}" value="1">
                <span>${config.prediction.options[1]}</span>
              </label>
            </div>
            <button type="button" class="kya-hoga-btn" id="${kyaCheckBtnId}">Check Karo</button>
            <div id="${kyaResultId}" style="margin-top:8px; font-size:0.84rem; display:none;"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  /** @type {Array<() => void>} */
  const cleanups = [];

  // 1. Before / After Toggle
  const toggleBtn = container.querySelector(`#${toggleBtnId}`);
  const asalSvg = container.querySelector(`#${asalSvgId}`);
  const transSvg = container.querySelector(`#${transformedSvgId}`);
  let isTransformed = false;

  if (toggleBtn && asalSvg && transSvg) {
    const onToggle = () => {
      isTransformed = !isTransformed;
      /** @type {HTMLElement} */ (asalSvg).style.display = isTransformed ? 'none' : 'block';
      /** @type {HTMLElement} */ (transSvg).style.display = isTransformed ? 'block' : 'none';
      toggleBtn.classList.toggle('active', isTransformed);
      const lblAsal = toggleBtn.querySelector('.lbl-asal');
      const lblTrans = toggleBtn.querySelector('.lbl-trans');
      if (lblAsal) /** @type {HTMLElement} */ (lblAsal).style.opacity = isTransformed ? '0.6' : '1';
      if (lblTrans) /** @type {HTMLElement} */ (lblTrans).style.opacity = isTransformed ? '1' : '0.6';
      playSfx('pop');
    };
    toggleBtn.addEventListener('click', onToggle);
    cleanups.push(() => toggleBtn.removeEventListener('click', onToggle));
  }

  // 2. Anatomy Legend Chips Interaction
  config.chips.forEach((c, idx) => {
    const chipBtn = container.querySelector(`#${cardId}-chip-${idx}`);
    if (!chipBtn) return;

    const highlightTarget = (active) => {
      const targets = container.querySelectorAll(`.${c.targetId}, #${c.targetId}`);
      targets.forEach(t => {
        const el = /** @type {HTMLElement | SVGElement} */ (t);
        if (active) {
          el.style.filter = 'drop-shadow(0 0 6px rgba(217,119,6,0.8))';
          el.style.transform = 'scale(1.15)';
          el.style.transformOrigin = 'center';
          el.style.transition = 'transform 0.18s ease, filter 0.18s ease';
        } else {
          el.style.filter = '';
          el.style.transform = '';
        }
      });
    };

    const onEnter = () => highlightTarget(true);
    const onLeave = () => highlightTarget(false);

    chipBtn.addEventListener('mouseenter', onEnter);
    chipBtn.addEventListener('mouseleave', onLeave);
    chipBtn.addEventListener('focus', onEnter);
    chipBtn.addEventListener('blur', onLeave);
    chipBtn.addEventListener('click', () => {
      highlightTarget(true);
      setTimeout(() => highlightTarget(false), 800);
      playSfx('pop');
    });

    cleanups.push(() => {
      chipBtn.removeEventListener('mouseenter', onEnter);
      chipBtn.removeEventListener('mouseleave', onLeave);
      chipBtn.removeEventListener('focus', onEnter);
      chipBtn.removeEventListener('blur', onLeave);
    });
  });

  // 3. Kya Hoga Accordion Toggle
  const kyaToggleBtn = container.querySelector(`#${kyaToggleBtnId}`);
  const kyaBody = container.querySelector(`#${kyaAccordionId}`);
  if (kyaToggleBtn && kyaBody) {
    const onKyaToggle = () => {
      const isOpen = /** @type {HTMLElement} */ (kyaBody).style.display !== 'none';
      /** @type {HTMLElement} */ (kyaBody).style.display = isOpen ? 'none' : 'block';
      kyaToggleBtn.setAttribute('aria-expanded', String(!isOpen));
      const arrowSpan = kyaToggleBtn.querySelector('span:first-child');
      if (arrowSpan) {
        arrowSpan.textContent = isOpen ? '▸ Kya Hoga? (Prediction Challenge)' : '▾ Kya Hoga? (Prediction Challenge)';
      }
    };
    kyaToggleBtn.addEventListener('click', onKyaToggle);
    cleanups.push(() => kyaToggleBtn.removeEventListener('click', onKyaToggle));
  }

  // 4. Kya Hoga Check Button
  const kyaCheckBtn = container.querySelector(`#${kyaCheckBtnId}`);
  const kyaResult = container.querySelector(`#${kyaResultId}`);
  if (kyaCheckBtn && kyaResult) {
    const onCheck = () => {
      const checkedRadio = container.querySelector(`input[name="kya_${config.lessonKey}"]:checked`);
      if (!checkedRadio) {
        /** @type {HTMLElement} */ (kyaResult).style.display = 'block';
        kyaResult.innerHTML = '<span style="color:#d97706;">Pehle ek option chunein!</span>';
        return;
      }
      const val = parseInt(/** @type {HTMLInputElement} */ (checkedRadio).value, 10);
      const isCorrect = val === config.prediction.correct;
      /** @type {HTMLElement} */ (kyaResult).style.display = 'block';

      if (isCorrect) {
        playSfx('correct');
        kyaResult.innerHTML = `
          <div style="background:rgba(5,150,105,0.12); color:#059669; padding:8px 12px; border-radius:8px; border:1px solid #059669;">
            <strong>✓ Sahi Andaaza!</strong> ${config.prediction.explanation}
          </div>
        `;
      } else {
        playSfx('wrong');
        kyaResult.innerHTML = `
          <div style="background:rgba(220,38,38,0.12); color:#dc2626; padding:8px 12px; border-radius:8px; border:1px solid #dc2626;">
            <strong>✗ Ghalat Andaaza.</strong> ${config.prediction.explanation}
          </div>
        `;
      }
    };
    kyaCheckBtn.addEventListener('click', onCheck);
    cleanups.push(() => kyaCheckBtn.removeEventListener('click', onCheck));
  }

  return () => {
    cleanups.forEach(fn => {
      try { fn(); } catch (e) {}
    });
  };
}
