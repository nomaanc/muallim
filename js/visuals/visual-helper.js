// @ts-check

/**
 * Visual Helper — Modular Framework for Muallim v7.0 Grammar Visuals
 * Provides standardized SVG rendering, shuffled Kya Hoga prediction challenge,
 * live word anatomy legend chips, before/after comparison toggle, and collapsible Steps & Examples drawer.
 */

const ICON_CHEVRON = `<svg class="gv-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`;
const ICON_SWAP = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>`;

/**
 * @typedef {Object} PredictionConfig
 * @property {string} question
 * @property {string[]} options
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
 * @typedef {Object} VisualStep
 * @property {string} title
 * @property {string} [description]
 * @property {string} [desc]
 */

/**
 * @typedef {Object} VisualExample
 * @property {string} arabic
 * @property {string} hinglish
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
 * @property {VisualStep[]} [steps]
 * @property {VisualExample[]} [examples]
 */

/**
 * @param {string} val
 * @returns {string}
 */
function esc(val) {
  return String(val || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Fisher-Yates shuffle returning a new array.
 * @template T
 * @param {Array<T>} arr
 * @returns {Array<T>}
 */
function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

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
 * Render and attach a complete grammar visual to a container element.
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
  const stepsBtnId = `${cardId}-steps-toggle`;
  const stepsDrawerId = `${cardId}-steps-drawer`;

  const shuffledOptions = shuffle(
    (config.prediction?.options || []).map((text, idx) => ({
      text,
      isCorrect: idx === config.prediction.correct
    }))
  );

  const chipElementsHtml = (config.chips || []).map((c, idx) => `
    <button type="button" class="anatomy-chip chip-${c.role}" id="${cardId}-chip-${idx}" data-target="${esc(c.targetId)}" aria-label="Highlight ${esc(c.label)}">
      <span class="chip-dot" aria-hidden="true"></span>
      <span>${esc(c.label)}</span>
    </button>
  `).join('');

  const steps = Array.isArray(config.steps) ? config.steps : [];
  const examples = Array.isArray(config.examples) ? config.examples : [];
  const hasDrawerContent = steps.length > 0 || examples.length > 0;

  const drawerHtml = hasDrawerContent ? `
    <div class="gv-steps-box">
      <button type="button" class="gv-steps-toggle" id="${stepsBtnId}" aria-expanded="false" aria-controls="${stepsDrawerId}">
        <span>Steps &amp; Examples (${steps.length + examples.length})</span>
        ${ICON_CHEVRON}
      </button>
      <div class="gv-steps-drawer" id="${stepsDrawerId}" style="display:grid; grid-template-rows:0fr; transition:grid-template-rows 200ms ease;">
        <div class="gv-steps-inner" style="overflow:hidden;">
          ${steps.length > 0 ? `
            <div class="gv-steps-list">
              ${steps.map(st => `
                <div class="gv-step-item">
                  <strong>${esc(st.title)}</strong>
                  <p>${esc(st.description || st.desc || '')}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${examples.length > 0 ? `
            <div class="gv-examples-list">
              ${examples.map(ex => `
                <div class="gv-example-item">
                  <span class="arabic-text" dir="rtl" lang="ar">${esc(ex.arabic)}</span>
                  <span class="gv-example-gloss">${esc(ex.hinglish)}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  ` : '';

  container.innerHTML = `
    <div class="gv-card" id="${cardId}">
      <div class="gv-header">
        <span>${esc(config.title)}</span>
        <div style="display:flex; align-items:center; gap:8px;">
          <button type="button" class="compare-toggle-btn" id="${toggleBtnId}" aria-label="Toggle between original and transformed state">
            <span class="lbl-asal" style="font-weight:700;">Asal</span>
            ${ICON_SWAP}
            <span class="lbl-trans" style="opacity:0.6;">Badla Hua</span>
          </button>
          <span class="gv-badge">${esc(config.badge)}</span>
        </div>
      </div>

      <div class="gv-body" style="padding:14px;">
        <div class="gv-svg-viewport" style="width:100%; min-height:160px; display:flex; justify-content:center; align-items:center;">
          <div id="${asalSvgId}" style="width:100%; display:block;" role="img" aria-label="${esc(config.title)} Original State">
            ${config.svgOriginal}
          </div>
          <div id="${transformedSvgId}" style="width:100%; display:none;" role="img" aria-label="${esc(config.title)} Transformed State">
            ${config.svgTransformed}
          </div>
        </div>

        <div class="chip-row" style="margin-top:12px;" role="toolbar" aria-label="Word Anatomy Legend">
          ${chipElementsHtml}
        </div>

        <div class="kya-hoga-box">
          <button type="button" class="kya-hoga-toggle" id="${kyaToggleBtnId}" aria-expanded="false" aria-controls="${kyaAccordionId}">
            <span>Kya Hoga? (Prediction Challenge)</span>
            <span style="font-size:0.75rem; opacity:0.8;">Tap to Guess</span>
          </button>
          <div class="kya-hoga-body" id="${kyaAccordionId}" style="display:none;">
            <p style="font-size:0.86rem; margin:0 0 8px; font-weight:600; color:var(--ink-primary);">${esc(config.prediction.question)}</p>
            <div role="radiogroup" aria-label="Prediction Options">
              ${shuffledOptions.map((opt, idx) => `
                <label class="kya-hoga-option">
                  <input type="radio" name="kya_${esc(config.lessonKey)}" value="${idx}">
                  <span>${esc(opt.text)}</span>
                </label>
              `).join('')}
            </div>
            <button type="button" class="kya-hoga-btn" id="${kyaCheckBtnId}">Check Answer</button>
            <div id="${kyaResultId}" style="margin-top:8px; font-size:0.84rem; display:none;"></div>
          </div>
        </div>

        ${drawerHtml}
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

  // 2. Anatomy Legend Chips Interaction (with full click & timeout cleanup)
  (config.chips || []).forEach((c, idx) => {
    const chipBtn = container.querySelector(`#${cardId}-chip-${idx}`);
    if (!chipBtn) return;
    let chipTimer = 0;

    const highlightTarget = (active) => {
      const targets = container.querySelectorAll(`.${c.targetId}, #${c.targetId}`);
      targets.forEach(t => {
        const el = /** @type {HTMLElement | SVGElement} */ (t);
        if (active) {
          el.style.filter = 'drop-shadow(0 0 6px rgba(217,119,6,0.8))';
          el.style.transform = 'scale(1.12)';
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
    const onClick = () => {
      clearTimeout(chipTimer);
      highlightTarget(true);
      chipTimer = window.setTimeout(() => highlightTarget(false), 800);
      playSfx('pop');
    };

    chipBtn.addEventListener('mouseenter', onEnter);
    chipBtn.addEventListener('mouseleave', onLeave);
    chipBtn.addEventListener('focus', onEnter);
    chipBtn.addEventListener('blur', onLeave);
    chipBtn.addEventListener('click', onClick);

    cleanups.push(() => {
      clearTimeout(chipTimer);
      chipBtn.removeEventListener('mouseenter', onEnter);
      chipBtn.removeEventListener('mouseleave', onLeave);
      chipBtn.removeEventListener('focus', onEnter);
      chipBtn.removeEventListener('blur', onLeave);
      chipBtn.removeEventListener('click', onClick);
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
    };
    kyaToggleBtn.addEventListener('click', onKyaToggle);
    cleanups.push(() => kyaToggleBtn.removeEventListener('click', onKyaToggle));
  }

  // 4. Kya Hoga Check Button (evaluates shuffled options)
  const kyaCheckBtn = container.querySelector(`#${kyaCheckBtnId}`);
  const kyaResult = container.querySelector(`#${kyaResultId}`);
  if (kyaCheckBtn && kyaResult) {
    const onCheck = () => {
      const checkedRadio = container.querySelector(`input[name="kya_${config.lessonKey}"]:checked`);
      if (!checkedRadio) {
        /** @type {HTMLElement} */ (kyaResult).style.display = 'block';
        kyaResult.innerHTML = '<span style="color:var(--accent-warning);">Pehle ek option chunein!</span>';
        return;
      }
      const val = parseInt(/** @type {HTMLInputElement} */ (checkedRadio).value, 10);
      const isCorrect = Boolean(shuffledOptions[val]?.isCorrect);
      /** @type {HTMLElement} */ (kyaResult).style.display = 'block';

      if (isCorrect) {
        playSfx('correct');
        kyaResult.innerHTML = `
          <div style="background:oklch(from var(--accent-positive) l c h / 0.12); color:var(--accent-positive); padding:8px 12px; border-radius:8px; border:1px solid var(--accent-positive);">
            <strong>✓ Sahi Andaaza!</strong> ${esc(config.prediction.explanation)}
          </div>
        `;
      } else {
        playSfx('wrong');
        kyaResult.innerHTML = `
          <div style="background:oklch(from var(--accent-danger) l c h / 0.12); color:var(--accent-danger); padding:8px 12px; border-radius:8px; border:1px solid var(--accent-danger);">
            <strong>✗ Ghalat Andaaza.</strong> ${esc(config.prediction.explanation)}
          </div>
        `;
      }
    };
    kyaCheckBtn.addEventListener('click', onCheck);
    cleanups.push(() => kyaCheckBtn.removeEventListener('click', onCheck));
  }

  // 5. Collapsible Steps & Examples Drawer (grid-template-rows: 0fr -> 1fr)
  const stepsBtn = container.querySelector(`#${stepsBtnId}`);
  const stepsDrawer = /** @type {HTMLElement | null} */ (container.querySelector(`#${stepsDrawerId}`));
  if (stepsBtn && stepsDrawer) {
    const onStepsToggle = () => {
      const isOpen = stepsDrawer.classList.toggle('is-open');
      stepsBtn.setAttribute('aria-expanded', String(isOpen));
      stepsDrawer.style.gridTemplateRows = isOpen ? '1fr' : '0fr';
    };
    stepsBtn.addEventListener('click', onStepsToggle);
    cleanups.push(() => stepsBtn.removeEventListener('click', onStepsToggle));
  }

  return () => {
    cleanups.forEach(fn => {
      try {
        fn();
      } catch (err) {
        console.warn('[VisualHelper] Teardown cleanup error:', err);
      }
    });
  };
}
