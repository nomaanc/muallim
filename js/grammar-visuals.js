/**
 * Muallim ul-Qur'an — Interactive Grammar SVG Visuals Engine (v1.0)
 * 
 * Provides interactive, context-aware animated SVG diagrams for lesson concepts.
 * Vanilla ES6, CSS @keyframes, Web Audio synthesis, zero external dependencies.
 * Constraint: Strictly no complex technical grammar jargon in UI; uses intuitive Islamic/book-matching terms.
 */

window.GrammarVisuals = (function() {
  'use strict';

  // --- Sound Effects Synthesizer (Zero asset dependencies) ---
  const AudioFX = {
    ctx: null,
    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        try {
          this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) {}
      }
    },
    play(type) {
      this.init();
      if (!this.ctx) return;
      try {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        if (type === 'pop') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
        } else if (type === 'whoosh') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(180, now + 0.15);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
        }
      } catch(e) {}
    }
  };

  // --- CSS Injection ---
  function injectStyles() {
    if (document.getElementById('gv-styles')) return;
    const style = document.createElement('style');
    style.id = 'gv-styles';
    style.textContent = `
      .gv-card {
        background: var(--bg-surface, #ffffff);
        border: 1.5px solid var(--border-color, #e5e7eb);
        border-radius: 16px;
        margin: 0 0 1.25rem 0;
        overflow: hidden;
        box-shadow: 0 4px 14px rgba(0,0,0,0.04);
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .gv-card:hover {
        box-shadow: 0 6px 20px rgba(0,0,0,0.07);
      }
      .gv-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        background: var(--bg-surface-elevated, #f9fafb);
        border-bottom: 1px solid var(--border-color, #e5e7eb);
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--accent, #1B4332);
        letter-spacing: 0.5px;
      }
      .gv-badge {
        background: rgba(217, 119, 6, 0.12);
        color: #d97706;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.72rem;
        font-weight: 800;
        text-transform: uppercase;
      }
      .gv-body {
        padding: 16px;
      }
      .gv-interactive-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 140px;
        background: #fdfbf7;
        border-radius: 12px;
        border: 1.5px dashed #e2d9cc;
        position: relative;
        overflow: hidden;
        padding: 12px;
      }
      .gv-word-display {
        font-family: 'Amiri', 'Traditional Arabic', serif;
        font-size: 2.4rem;
        display: flex;
        align-items: center;
        direction: rtl;
        cursor: pointer;
        user-select: none;
        transition: transform 0.2s;
      }
      .gv-word-display:hover {
        transform: scale(1.04);
      }
      .gv-subtext {
        font-size: 0.88rem;
        font-weight: 600;
        color: #6b7280;
        margin-top: 8px;
        text-align: center;
      }
      .gv-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 12px;
        gap: 8px;
        flex-wrap: wrap;
      }
      .gv-hint {
        font-size: 0.78rem;
        color: #9ca3af;
      }
      .gv-btn {
        background: #d97706;
        color: #fff;
        border: none;
        padding: 7px 16px;
        border-radius: 20px;
        font-size: 0.78rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 2px 8px rgba(217, 119, 6, 0.25);
      }
      .gv-btn:hover {
        background: #b45309;
        transform: translateY(-1px);
      }
      .gv-btn:active {
        transform: translateY(1px);
      }
      .gv-btn-burgundy {
        background: #881337;
        box-shadow: 0 2px 8px rgba(136, 19, 55, 0.25);
      }
      .gv-btn-burgundy:hover {
        background: #70102d;
      }
      .gv-btn-blue {
        background: #1e40af;
        box-shadow: 0 2px 8px rgba(30, 64, 175, 0.25);
      }
      .gv-btn-blue:hover {
        background: #1e3a8a;
      }
      .gv-status-bar {
        text-align: center;
        font-size: 0.85rem;
        font-weight: 700;
        margin-top: 8px;
        color: #374151;
      }
    `;
    document.head.appendChild(style);
  }

  // Particle explosion effect on vowel/affix change
  function particleBurst(el, container) {
    if (!el || !container) return;
    const rect = el.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    const x = rect.left - cRect.left + rect.width / 2;
    const y = rect.top - cRect.top + rect.height / 2;

    for (let i = 0; i < 8; i++) {
      const p = document.createElement('span');
      p.style.cssText = `
        position: absolute;
        left: ${x}px; top: ${y}px;
        width: 6px; height: 6px;
        border-radius: 50%;
        background: #d97706;
        pointer-events: none;
        z-index: 10;
        transition: all 0.4s ease-out;
      `;
      container.appendChild(p);
      const angle = (i / 8) * Math.PI * 2;
      const dist = 30 + Math.random() * 20;
      setTimeout(() => {
        p.style.transform = `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px) scale(0)`;
        p.style.opacity = '0';
      }, 10);
      setTimeout(() => p.remove(), 450);
    }
  }

  // --- Visuals Registry by Lesson Key (s1l1, s1l2, etc.) ---
  const Registry = {
    // Stage 1 Lesson 1: Definite vs Indefinite (Alif-Lam & Tanween)
    's1l1'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: Khaas (The) vs Aam (A)</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s1l1-area">
              <div class="gv-word-display" id="s1l1-word">
                <span class="prefix-al" style="color: #d97706; width: 0; opacity: 0; overflow: hidden; transition: all 0.35s ease; display: inline-block;">الْـ</span>
                <span class="stem">كِتَاب</span>
                <span class="vowel" style="color: #881337; transition: all 0.3s; display: inline-block;">ٌ</span>
              </div>
              <div class="gv-subtext" id="s1l1-sub">koi bhi kitaab (a book)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">Lafz ya button par tap karke dekhein:</span>
              <button class="gv-btn" id="s1l1-btn">Toggle الْـ</button>
            </div>
            <div class="gv-status-bar" id="s1l1-status">
              Halat: <span style="color: #6b7280;">Aam Lafz (Do Pesh / Tanween ٌ)</span>
            </div>
          </div>
        </div>
      `;

      let isDef = false;
      function toggle() {
        isDef = !isDef;
        AudioFX.play('pop');
        const area = container.querySelector('.s1l1-area');
        const prefix = container.querySelector('.prefix-al');
        const vowel = container.querySelector('.vowel');
        const sub = document.getElementById('s1l1-sub');
        const status = document.getElementById('s1l1-status');

        particleBurst(vowel, area);

        if (isDef) {
          prefix.style.width = '48px';
          prefix.style.opacity = '1';
          vowel.textContent = 'ُ';
          sub.innerHTML = `<span style="color: #d97706;">woh khaas kitaab (the specific book)</span>`;
          status.innerHTML = `Halat: <span style="color: #d97706;">Khaas Lafz (الْـ aane se Ek Pesh ُ bacha)</span>`;
        } else {
          prefix.style.width = '0px';
          prefix.style.opacity = '0';
          vowel.textContent = 'ٌ';
          sub.innerHTML = `koi bhi kitaab (a book)`;
          status.innerHTML = `Halat: <span style="color: #6b7280;">Aam Lafz (Do Pesh / Tanween ٌ)</span>`;
        }
      }

      container.querySelector('#s1l1-word').onclick = toggle;
      container.querySelector('#s1l1-btn').onclick = toggle;
    },

    // Stage 1 Lesson 2: Gender Flipper (Ta-Marbuta ـَةٌ)
    's1l2'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: Muzakkar (Male) ↔ Muannas (Female)</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s1l2-area">
              <div class="gender-icon" style="font-size: 2.2rem; margin-bottom: 4px; transition: transform 0.3s;" id="s1l2-icon">🧑‍💼</div>
              <div class="gv-word-display" id="s1l2-word">
                <span class="stem">مُؤْمِن</span>
                <span class="ta-suffix" style="color: #881337; width: 0; opacity: 0; overflow: hidden; transition: all 0.35s ease; display: inline-block;">َةٌ</span>
                <span class="masc-vowel" style="color: #881337; transition: all 0.3s; display: inline-block;">ٌ</span>
              </div>
              <div class="gv-subtext" id="s1l2-sub">momin (male believer)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">Tap karke gender tabdeel karein:</span>
              <button class="gv-btn gv-btn-burgundy" id="s1l2-btn">Flip Gender</button>
            </div>
            <div class="gv-status-bar" id="s1l2-status">
              Jins: <span style="color: #1e40af;">Muzakkar (Male)</span>
            </div>
          </div>
        </div>
      `;

      let isFem = false;
      function toggle() {
        isFem = !isFem;
        AudioFX.play('whoosh');
        const area = container.querySelector('.s1l2-area');
        const icon = document.getElementById('s1l2-icon');
        const ta = container.querySelector('.ta-suffix');
        const masc = container.querySelector('.masc-vowel');
        const sub = document.getElementById('s1l2-sub');
        const status = document.getElementById('s1l2-status');

        particleBurst(ta, area);

        if (isFem) {
          ta.style.width = '36px';
          ta.style.opacity = '1';
          masc.style.display = 'none';
          icon.textContent = '👩‍💼';
          icon.style.transform = 'scale(1.15)';
          sub.innerHTML = `<span style="color: #881337;">mominah (female believer)</span>`;
          status.innerHTML = `Jins: <span style="color: #881337;">Muannas (Gol Taa ـَةٌ ka izafa)</span>`;
        } else {
          ta.style.width = '0px';
          ta.style.opacity = '0';
          masc.style.display = 'inline-block';
          icon.textContent = '🧑‍💼';
          icon.style.transform = 'scale(1)';
          sub.innerHTML = `momin (male believer)`;
          status.innerHTML = `Jins: <span style="color: #1e40af;">Muzakkar (Male)</span>`;
        }
      }

      container.querySelector('#s1l2-word').onclick = toggle;
      container.querySelector('#s1l2-btn').onclick = toggle;
    },

    // Stage 2 Lesson 1: Inna Power Particle (Zabar َ impact)
    's2l1'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: إِنَّ ka asar (Zabar َ aana)</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s2l1-area">
              <div class="gv-word-display" id="s2l1-word">
                <span class="inna-pref" style="color: #881337; width: 0; opacity: 0; overflow: hidden; transition: all 0.35s ease; display: inline-block; margin-left: 8px;">إِنَّ</span>
                <span class="stem">اللَّه</span>
                <span class="vowel" style="color: #881337; transition: all 0.3s; display: inline-block;">ُ</span>
              </div>
              <div class="gv-subtext" id="s2l1-sub">Allah (Default aakhir)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">إِنَّ laga kar dekhein:</span>
              <button class="gv-btn gv-btn-burgundy" id="s2l1-btn">Apply إِنَّ</button>
            </div>
            <div class="gv-status-bar" id="s2l1-status">
              Halat: <span style="color: #6b7280;">Aam Pesh ( ُ )</span>
            </div>
          </div>
        </div>
      `;

      let hasInna = false;
      function toggle() {
        hasInna = !hasInna;
        AudioFX.play('pop');
        const area = container.querySelector('.s2l1-area');
        const pref = container.querySelector('.inna-pref');
        const vowel = container.querySelector('.vowel');
        const sub = document.getElementById('s2l1-sub');
        const status = document.getElementById('s2l1-status');

        particleBurst(vowel, area);

        if (hasInna) {
          pref.style.width = '60px';
          pref.style.opacity = '1';
          vowel.textContent = 'َ';
          sub.innerHTML = `<span style="color: #881337;">Beshak Allah (Indeed Allah)</span>`;
          status.innerHTML = `Halat: <span style="color: #881337;">إِنَّ ne lafz par Zabar ( َ ) diya</span>`;
        } else {
          pref.style.width = '0px';
          pref.style.opacity = '0';
          vowel.textContent = 'ُ';
          sub.innerHTML = `Allah (Default aakhir)`;
          status.innerHTML = `Halat: <span style="color: #6b7280;">Aam Pesh ( ُ )</span>`;
        }
      }

      container.querySelector('#s2l1-word').onclick = toggle;
      container.querySelector('#s2l1-btn').onclick = toggle;
    },

    // Stage 2 Lesson 2: Harf-e-Jarr Li (Zer ِ impact)
    's2l2'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: لِـ (Ke liye) ka asar (Zer ِ aana)</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s2l2-area">
              <div class="gv-word-display" id="s2l2-word">
                <span class="li-pref" style="color: #881337; width: 0; opacity: 0; overflow: hidden; transition: all 0.35s ease; display: inline-block; margin-left: 4px;">لِـ</span>
                <span class="stem">الْكِتَاب</span>
                <span class="vowel" style="color: #881337; transition: all 0.3s; display: inline-block;">ُ</span>
              </div>
              <div class="gv-subtext" id="s2l2-sub">al-kitaabu (The book)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">لِـ laga kar asar dekhein:</span>
              <button class="gv-btn gv-btn-burgundy" id="s2l2-btn">Apply لِـ</button>
            </div>
            <div class="gv-status-bar" id="s2l2-status">
              Halat: <span style="color: #6b7280;">Aam Pesh ( ُ )</span>
            </div>
          </div>
        </div>
      `;

      let hasLi = false;
      function toggle() {
        hasLi = !hasLi;
        AudioFX.play('pop');
        const area = container.querySelector('.s2l2-area');
        const pref = container.querySelector('.li-pref');
        const vowel = container.querySelector('.vowel');
        const sub = document.getElementById('s2l2-sub');
        const status = document.getElementById('s2l2-status');

        particleBurst(vowel, area);

        if (hasLi) {
          pref.style.width = '42px';
          pref.style.opacity = '1';
          vowel.textContent = 'ِ';
          sub.innerHTML = `<span style="color: #881337;">kitaab ke liye (for the book)</span>`;
          status.innerHTML = `Halat: <span style="color: #881337;">لِـ aane se aakhir mein Zer ( ِ ) aaya</span>`;
        } else {
          pref.style.width = '0px';
          pref.style.opacity = '0';
          vowel.textContent = 'ُ';
          sub.innerHTML = `al-kitaabu (The book)`;
          status.innerHTML = `Halat: <span style="color: #6b7280;">Aam Pesh ( ُ )</span>`;
        }
      }

      container.querySelector('#s2l2-word').onclick = toggle;
      container.querySelector('#s2l2-btn').onclick = toggle;
    },

    // Stage 2 Lesson 8: Laa Nafy-e-Jins (Single Zabar َ without Tanween)
    's2l8'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: لَا (Nafy / Inkaar) ka asar</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s2l8-area">
              <div class="gv-word-display" id="s2l8-word">
                <span class="laa-pref" style="color: #881337; width: 0; opacity: 0; overflow: hidden; transition: all 0.35s ease; display: inline-block; margin-left: 8px;">لَا</span>
                <span class="stem">إِلٰه</span>
                <span class="vowel" style="color: #881337; transition: all 0.3s; display: inline-block;">ٌ</span>
              </div>
              <div class="gv-subtext" id="s2l8-sub">ilahun (Koi ma'bood)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">لَا laga kar asar dekhein:</span>
              <button class="gv-btn gv-btn-burgundy" id="s2l8-btn">Apply لَا</button>
            </div>
            <div class="gv-status-bar" id="s2l8-status">
              Halat: <span style="color: #6b7280;">Aam Tanween ( ٌ )</span>
            </div>
          </div>
        </div>
      `;

      let hasLaa = false;
      function toggle() {
        hasLaa = !hasLaa;
        AudioFX.play('pop');
        const area = container.querySelector('.s2l8-area');
        const pref = container.querySelector('.laa-pref');
        const vowel = container.querySelector('.vowel');
        const sub = document.getElementById('s2l8-sub');
        const status = document.getElementById('s2l8-status');

        particleBurst(vowel, area);

        if (hasLaa) {
          pref.style.width = '48px';
          pref.style.opacity = '1';
          vowel.textContent = 'َ';
          sub.innerHTML = `<span style="color: #881337;">koi ma'bood nahi (there is no deity)</span>`;
          status.innerHTML = `Halat: <span style="color: #881337;">لَا ne Tanween hata kar sirf ek Zabar ( َ ) diya</span>`;
        } else {
          pref.style.width = '0px';
          pref.style.opacity = '0';
          vowel.textContent = 'ٌ';
          sub.innerHTML = `ilahun (Koi ma'bood)`;
          status.innerHTML = `Halat: <span style="color: #6b7280;">Aam Tanween ( ٌ )</span>`;
        }
      }

      container.querySelector('#s2l8-word').onclick = toggle;
      container.querySelector('#s2l8-btn').onclick = toggle;
    },

    // Stage 2 Lesson 13: Harf-e-Nida Yaa (Single Pesh ُ without Tanween)
    's2l13'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: يَا (Pukaarna / Nida)</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s2l13-area">
              <div class="gv-word-display" id="s2l13-word">
                <span class="yaa-pref" style="color: #881337; width: 0; opacity: 0; overflow: hidden; transition: all 0.35s ease; display: inline-block; margin-left: 8px;">يَا</span>
                <span class="stem">رَجُل</span>
                <span class="vowel" style="color: #881337; transition: all 0.3s; display: inline-block;">ٌ</span>
              </div>
              <div class="gv-subtext" id="s2l13-sub">rajulun (Ek aadmi)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">يَا laga kar pukaarein:</span>
              <button class="gv-btn gv-btn-burgundy" id="s2l13-btn">Apply يَا</button>
            </div>
            <div class="gv-status-bar" id="s2l13-status">
              Halat: <span style="color: #6b7280;">Aam Tanween ( ٌ )</span>
            </div>
          </div>
        </div>
      `;

      let hasYaa = false;
      function toggle() {
        hasYaa = !hasYaa;
        AudioFX.play('pop');
        const area = container.querySelector('.s2l13-area');
        const pref = container.querySelector('.yaa-pref');
        const vowel = container.querySelector('.vowel');
        const sub = document.getElementById('s2l13-sub');
        const status = document.getElementById('s2l13-status');

        particleBurst(vowel, area);

        if (hasYaa) {
          pref.style.width = '48px';
          pref.style.opacity = '1';
          vowel.textContent = 'ُ';
          sub.innerHTML = `<span style="color: #881337;">Ae aadmi! (O man!)</span>`;
          status.innerHTML = `Halat: <span style="color: #881337;">يَا aane se Tanween gir kar sirf ek Pesh ( ُ ) bacha</span>`;
        } else {
          pref.style.width = '0px';
          pref.style.opacity = '0';
          vowel.textContent = 'ٌ';
          sub.innerHTML = `rajulun (Ek aadmi)`;
          status.innerHTML = `Halat: <span style="color: #6b7280;">Aam Tanween ( ٌ )</span>`;
        }
      }

      container.querySelector('#s2l13-word').onclick = toggle;
      container.querySelector('#s2l13-btn').onclick = toggle;
    },


    // Stage 3 Lesson 1 & 2: Murakkab-e-Tawseefi (Adjective-Noun agreement)
    's3l1'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: Murakkab-e-Tawseefi (Mawsoof + Sifat)</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s3l1-area">
              <div class="gv-word-display" id="s3l1-word">
                <span class="mawsoof" style="color: #1a1a1a; margin-left: 12px; transition: all 0.3s;">شَيْءٌ</span>
                <span class="sifat" style="color: #dc2626; transition: all 0.3s;">عَظِيمٌ</span>
              </div>
              <div class="gv-subtext" id="s3l1-sub">Ek badi cheez (Mawsoof: Isim, Sifat: Khoobi)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">Mukhtalif Murakkabat par tap karke dekhein:</span>
              <div style="display: flex; gap: 6px; flex-wrap: wrap; justify-content: center;">
                <button class="gv-btn" id="s3l1-btn-1">شَيْءٌ عَظِيمٌ</button>
                <button class="gv-btn gv-btn-burgundy" id="s3l1-btn-2">عَذَابٌ شَدِيدٌ</button>
                <button class="gv-btn gv-btn-blue" id="s3l1-btn-3">فَوْزٌ كَبِيرٌ</button>
              </div>
            </div>
            <div class="gv-status-bar" id="s3l1-status">
              Qaidah: <span style="color: #dc2626;">Sifat (Khoobi) hamesha Mawsoof ke baad aati hai aur uske mutabiq hoti hai</span>
            </div>
          </div>
        </div>
      `;

      const mawsoof = container.querySelector('.mawsoof');
      const sifat = container.querySelector('.sifat');
      const sub = document.getElementById('s3l1-sub');

      container.querySelector('#s3l1-btn-1').onclick = () => {
        AudioFX.play('pop');
        mawsoof.textContent = 'شَيْءٌ';
        sifat.textContent = 'عَظِيمٌ';
        sub.textContent = 'Ek badi cheez (Bada maamla)';
      };
      container.querySelector('#s3l1-btn-2').onclick = () => {
        AudioFX.play('whoosh');
        mawsoof.textContent = 'عَذَابٌ';
        sifat.textContent = 'شَدِيدٌ';
        sub.textContent = 'Sakht azaab (Severe punishment)';
      };
      container.querySelector('#s3l1-btn-3').onclick = () => {
        AudioFX.play('whoosh');
        mawsoof.textContent = 'فَوْزٌ';
        sifat.textContent = 'كَبِيرٌ';
        sub.textContent = 'Badi kamyabi (Great success)';
      };
    },

    's3l2'(container) {
      if (Registry['s3l1']) Registry['s3l1'](container);
    },

    // Stage 3 Lesson 3: Harf-e-Jarr + Murakkab-e-Tawseefi
    's3l3'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: Harf-e-Jarr + Murakkab-e-Tawseefi</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s3l3-area">
              <div class="gv-word-display" id="s3l3-word">
                <span class="jarr-pref" style="color: #dc2626; width: 0; opacity: 0; overflow: hidden; transition: all 0.35s ease; display: inline-block; margin-left: 8px;">فِي</span>
                <span class="m-noun" style="color: #1a1a1a; margin-left: 8px;">عَذَاب</span><span class="m-vow1" style="color: #881337;">ٌ</span>
                <span class="m-adj" style="color: #1a1a1a;">عَظِيم</span><span class="m-vow2" style="color: #881337;">ٌ</span>
              </div>
              <div class="gv-subtext" id="s3l3-sub">عَذَابٌ عَظِيمٌ (Bada azaab)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">Harf-e-Jarr shuru mein lagayein:</span>
              <button class="gv-btn gv-btn-burgundy" id="s3l3-btn">Apply فِي</button>
            </div>
            <div class="gv-status-bar" id="s3l3-status">
              Halat: <span style="color: #6b7280;">Marfoo (Dono par Pesh / Tanween ٌ)</span>
            </div>
          </div>
        </div>
      `;

      let hasJarr = false;
      function toggle() {
        hasJarr = !hasJarr;
        AudioFX.play('pop');
        const pref = container.querySelector('.jarr-pref');
        const v1 = container.querySelector('.m-vow1');
        const v2 = container.querySelector('.m-vow2');
        const sub = document.getElementById('s3l3-sub');
        const status = document.getElementById('s3l3-status');

        if (hasJarr) {
          pref.style.width = '36px';
          pref.style.opacity = '1';
          v1.textContent = 'ٍ';
          v2.textContent = 'ٍ';
          sub.innerHTML = `<span style="color: #dc2626;">Bade azaab mein (In a great punishment)</span>`;
          status.innerHTML = `Halat: <span style="color: #dc2626;">Harf-e-Jarr ki wajah se DONO alfaaz par Zer ( ٍ ) aayi</span>`;
        } else {
          pref.style.width = '0px';
          pref.style.opacity = '0';
          v1.textContent = 'ٌ';
          v2.textContent = 'ٌ';
          sub.textContent = 'عَذَابٌ عَظِيمٌ (Bada azaab)';
          status.innerHTML = `Halat: <span style="color: #6b7280;">Marfoo (Dono par Pesh / Tanween ٌ)</span>`;
        }
      }
      container.querySelector('#s3l3-btn').onclick = toggle;
    },

    // Stage 3 Lesson 4 & 5: Murakkab-e-Izaafi (Mudaaf + Mudaaf-Ilaih)
    's3l4'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: Murakkab-e-Izaafi (Mudaaf + Mudaaf-Ilaih)</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s3l4-area">
              <div class="gv-word-display" id="s3l4-word">
                <span class="mudaaf" style="color: #dc2626; margin-left: 12px; transition: all 0.3s;">رَبُّ</span>
                <span class="mudaaf-ilaih" style="color: #1a1a1a; transition: all 0.3s;">الْعَرْشِ</span>
              </div>
              <div class="gv-subtext" id="s3l4-sub">Arsh ka Rabb (Mudaaf: No Al / No Tanween, Mudaaf-Ilaih: Zer)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">Mukhtalif Izaafat par tap karke dekhein:</span>
              <div style="display: flex; gap: 6px; flex-wrap: wrap; justify-content: center;">
                <button class="gv-btn" id="s3l4-btn-1">رَبُّ الْعَرْشِ</button>
                <button class="gv-btn gv-btn-burgundy" id="s3l4-btn-2">كِتَابُ اللَّهِ</button>
                <button class="gv-btn gv-btn-blue" id="s3l4-btn-3">يَوْمُ الْقِيَامَةِ</button>
              </div>
            </div>
            <div class="gv-status-bar" id="s3l4-status">
              Qaidah: <span style="color: #dc2626;">Mudaaf par Alif-Laam aur Tanween nahi aati, Mudaaf-Ilaih Majroor (Zer) hota hai</span>
            </div>
          </div>
        </div>
      `;

      const m = container.querySelector('.mudaaf');
      const mi = container.querySelector('.mudaaf-ilaih');
      const sub = document.getElementById('s3l4-sub');

      container.querySelector('#s3l4-btn-1').onclick = () => {
        AudioFX.play('pop');
        m.textContent = 'رَبُّ';
        mi.textContent = 'الْعَرْشِ';
        sub.textContent = 'Arsh ka Rabb (Lord of the Throne)';
      };
      container.querySelector('#s3l4-btn-2').onclick = () => {
        AudioFX.play('whoosh');
        m.textContent = 'كِتَابُ';
        mi.textContent = 'اللَّهِ';
        sub.textContent = 'Allah ki kitaab (Book of Allah)';
      };
      container.querySelector('#s3l4-btn-3').onclick = () => {
        AudioFX.play('whoosh');
        m.textContent = 'يَوْمُ';
        mi.textContent = 'الْقِيَامَةِ';
        sub.textContent = 'Qiyamat ka din (Day of Resurrection)';
      };
    },

    's3l5'(container) {
      if (Registry['s3l4']) Registry['s3l4'](container);
    },

    's3l6'(container) {
      if (Registry['s3l3']) Registry['s3l3'](container);
    },

    // Stage 3 Lesson 7: Lafz "Kull" (Har / Every)
    's3l7'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: Lafz كُلّ (Har / Every)</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s3l7-area">
              <div class="gv-word-display" id="s3l7-word">
                <span class="kull-word" style="color: #dc2626; margin-left: 10px;">كُلُّ</span>
                <span class="kull-noun" style="color: #1a1a1a;">نَفْسٍ</span>
              </div>
              <div class="gv-subtext" id="s3l7-sub">Har jaan (Every soul)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">Prefix jor kar dekhein:</span>
              <div style="display: flex; gap: 6px; flex-wrap: wrap; justify-content: center;">
                <button class="gv-btn" id="s3l7-btn-1">كُلُّ شَيْءٍ</button>
                <button class="gv-btn gv-btn-burgundy" id="s3l7-btn-2">عَلَى كُلِّ شَيْءٍ</button>
                <button class="gv-btn gv-btn-blue" id="s3l7-btn-3">مِنْ كُلِّ بَابٍ</button>
              </div>
            </div>
            <div class="gv-status-bar" id="s3l7-status">
              Qaidah: <span style="color: #dc2626;">كُلّ ke baad wala lafz Majroor (Zer / Tanween) hota hai</span>
            </div>
          </div>
        </div>
      `;

      const kw = container.querySelector('.kull-word');
      const kn = container.querySelector('.kull-noun');
      const sub = document.getElementById('s3l7-sub');

      container.querySelector('#s3l7-btn-1').onclick = () => {
        AudioFX.play('pop');
        kw.textContent = 'كُلُّ';
        kn.textContent = 'شَيْءٍ';
        sub.textContent = 'Har cheez (Every thing)';
      };
      container.querySelector('#s3l7-btn-2').onclick = () => {
        AudioFX.play('whoosh');
        kw.textContent = 'عَلَى كُلِّ';
        kn.textContent = 'شَيْءٍ';
        sub.textContent = 'Har cheez par (Upon every thing)';
      };
      container.querySelector('#s3l7-btn-3').onclick = () => {
        AudioFX.play('whoosh');
        kw.textContent = 'مِنْ كُلِّ';
        kn.textContent = 'بَابٍ';
        sub.textContent = 'Har darwaze se (From every door)';
      };
    },

    // Stage 3 Lesson 8: Asmaa-ul-Faa'il & Intensive Fa'il/Fa''al
    's3l8'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: فَاعِل (Doer) vs فَعَّال (Supreme Doer)</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s3l8-area">
              <div class="gv-word-display" id="s3l8-word">
                <span class="fail-std" style="color: #1a1a1a; margin-left: 14px;">خَالِقٌ</span>
                <span class="arrow" style="color: #9ca3af; font-size: 1.2rem; margin-left: 14px;">➔</span>
                <span class="fail-int" style="color: #dc2626;">خَلَّاقٌ</span>
              </div>
              <div class="gv-subtext" id="s3l8-sub">Paida karne wala (Creator) ➔ Bohot bada Khaliq (Supreme Creator)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">Awzaan tabdeel karein:</span>
              <div style="display: flex; gap: 6px; flex-wrap: wrap; justify-content: center;">
                <button class="gv-btn" id="s3l8-btn-1">خَالِق ➔ خَلَّاق</button>
                <button class="gv-btn gv-btn-burgundy" id="s3l8-btn-2">غَافِر ➔ غَفَّار</button>
                <button class="gv-btn gv-btn-blue" id="s3l8-btn-3">رَازِق ➔ رَزَّاق</button>
              </div>
            </div>
            <div class="gv-status-bar" id="s3l8-status">
              Qaidah: <span style="color: #dc2626;">Shaddah aur Alif se Mubalagha (ziadati/kasrat) ka maana banta hai</span>
            </div>
          </div>
        </div>
      `;

      const std = container.querySelector('.fail-std');
      const int = container.querySelector('.fail-int');
      const sub = document.getElementById('s3l8-sub');

      container.querySelector('#s3l8-btn-1').onclick = () => {
        AudioFX.play('whoosh');
        std.textContent = 'خَالِقٌ';
        int.textContent = 'خَلَّاقٌ';
        sub.textContent = 'Paida karne wala (Creator) ➔ Bohot bada Khaliq (Supreme Creator)';
      };
      container.querySelector('#s3l8-btn-2').onclick = () => {
        AudioFX.play('whoosh');
        std.textContent = 'غَافِرٌ';
        int.textContent = 'غَفَّارٌ';
        sub.textContent = 'Bakhshne wala (Forgiver) ➔ Bohot ziada Bakhshne wala (Oft-Forgiving)';
      };
      container.querySelector('#s3l8-btn-3').onclick = () => {
        AudioFX.play('whoosh');
        std.textContent = 'رَازِقٌ';
        int.textContent = 'رَزَّاقٌ';
        sub.textContent = 'Rizq dene wala (Provider) ➔ Hamesha Rizq pohanchane wala (Supreme Sustainer)';
      };
    },

    // Stage 3 Lesson 9: Mazeed Feehi Faa'il vs Maf'ool
    's3l9'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: مُفْعِل (Fa'il) vs مُفْعَل (Maf'ool)</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s3l9-area">
              <div class="gv-word-display" id="s3l9-word">
                <span class="w-pref" style="color: #dc2626;">مُـ</span><span class="w-stem">رْسِ</span><span class="w-end" style="color: #dc2626;">لٌ</span>
              </div>
              <div class="gv-subtext" id="s3l9-sub">Bhejney wala (The Sender) — Kasrah = Fa'il (Kaam Karne Wala)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">Kasrah vs Fatah tabdeel karke dekhein:</span>
              <div style="display: flex; gap: 6px;">
                <button class="gv-btn" id="s3l9-btn-fail">مُرْسِلٌ (Fa'il)</button>
                <button class="gv-btn gv-btn-burgundy" id="s3l9-btn-mafool">مُرْسَلٌ (Maf'ool)</button>
              </div>
            </div>
            <div class="gv-status-bar" id="s3l9-status">
              Qaidah: <span style="color: #dc2626;">Aakhri harf se pehle Zer = Doer, Zabar = Receiver</span>
            </div>
          </div>
        </div>
      `;

      const stem = container.querySelector('.w-stem');
      const end = container.querySelector('.w-end');
      const sub = document.getElementById('s3l9-sub');

      container.querySelector('#s3l9-btn-fail').onclick = () => {
        AudioFX.play('pop');
        stem.textContent = 'رْسِ';
        end.textContent = 'لٌ';
        sub.innerHTML = `Bhejney wala (The Sender) — <span style="color: #dc2626;">Zer = Fa'il (Doer)</span>`;
      };
      container.querySelector('#s3l9-btn-mafool').onclick = () => {
        AudioFX.play('whoosh');
        stem.textContent = 'رْسَ';
        end.textContent = 'لٌ';
        sub.innerHTML = `Bheja hua (The Messenger / Sent one) — <span style="color: #881337;">Zabar = Maf'ool (Done upon)</span>`;
      };
    },

    // Stage 3 Lesson 10: Tasniyah (Dual Form)
    's3l10'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: Tasniyah (Duality / Do Ke Liye)</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s3l10-area">
              <div class="gv-word-display" id="s3l10-word">
                <span class="sing-noun" style="color: #1a1a1a; margin-left: 10px;">الْمُؤْمِنُ</span>
                <span class="arrow" style="color: #9ca3af; font-size: 1.2rem; margin-left: 10px;">➔</span>
                <span class="dual-stem" style="color: #1a1a1a;">الْمُؤْمِنَ</span><span class="dual-suff" style="color: #dc2626; transition: all 0.3s;">انِ</span>
              </div>
              <div class="gv-subtext" id="s3l10-sub">Ek Momin ➔ Do Momin (Marfoo: ـَانِ)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">Haalat tabdeel karke dekhein:</span>
              <div style="display: flex; gap: 6px;">
                <button class="gv-btn" id="s3l10-btn-aan">ـَانِ (Marfoo)</button>
                <button class="gv-btn gv-btn-burgundy" id="s3l10-btn-ayn">ـَيْنِ (Mansoob/Majroor)</button>
              </div>
            </div>
            <div class="gv-status-bar" id="s3l10-status">
              Qaidah: <span style="color: #dc2626;">Lafz ke aakhir mein (انِ) ya (ينِ) lagane se Tasniyah banti hai</span>
            </div>
          </div>
        </div>
      `;

      const suff = container.querySelector('.dual-suff');
      const sub = document.getElementById('s3l10-sub');

      container.querySelector('#s3l10-btn-aan').onclick = () => {
        AudioFX.play('pop');
        suff.textContent = 'انِ';
        sub.innerHTML = `Ek Momin ➔ Do Momin (<span style="color: #dc2626;">Marfoo: ـَانِ</span>)`;
      };
      container.querySelector('#s3l10-btn-ayn').onclick = () => {
        AudioFX.play('whoosh');
        suff.textContent = 'يْنِ';
        sub.innerHTML = `Ek Momin ➔ Do Momin (<span style="color: #881337;">Mansoob / Majroor: ـَيْنِ</span>)`;
      };
    },

    // Stage 4 Lesson 1: Pronoun هُوَ
    's4l1'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: هُوَ (Woh) Pronoun</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s4l1-area">
              <div class="gv-word-display" id="s4l1-word">
                <span class="pronoun" style="color: #d97706; margin-left: 10px;">هُوَ</span>
                <span class="stem">رَسُولٌ</span>
              </div>
              <div class="gv-subtext" id="s4l1-sub">Woh rasool hai (He is a messenger)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">Prefix tabdeel karein:</span>
              <div style="display: flex; gap: 6px;">
                <button class="gv-btn" id="s4l1-btn-wa">وَ (Aur)</button>
                <button class="gv-btn gv-btn-burgundy" id="s4l1-btn-fa">فَـ (To)</button>
                <button class="gv-btn gv-btn-blue" id="s4l1-btn-reset">Normal</button>
              </div>
            </div>
            <div class="gv-status-bar" id="s4l1-status">
              Jumla: <span style="color: #d97706;">Seedha Jumla (هُوَ = Woh)</span>
            </div>
          </div>
        </div>
      `;

      const pro = container.querySelector('.pronoun');
      const sub = document.getElementById('s4l1-sub');
      const status = document.getElementById('s4l1-status');

      container.querySelector('#s4l1-btn-wa').onclick = () => {
        AudioFX.play('pop');
        pro.innerHTML = `<span style="color:#881337;">وَ</span>هُوَ`;
        sub.innerHTML = `<span style="color:#881337;">Aur woh rasool hai (And he is a messenger)</span>`;
        status.innerHTML = `Prefix: <span style="color:#881337;">وَ (Aur) jud gaya</span>`;
      };
      container.querySelector('#s4l1-btn-fa').onclick = () => {
        AudioFX.play('pop');
        pro.innerHTML = `<span style="color:#881337;">فَـ</span>هُوَ`;
        sub.innerHTML = `<span style="color:#881337;">To woh rasool hai (So he is a messenger)</span>`;
        status.innerHTML = `Prefix: <span style="color:#881337;">فَـ (To / Pas) jud gaya</span>`;
      };
      container.querySelector('#s4l1-btn-reset').onclick = () => {
        AudioFX.play('whoosh');
        pro.innerHTML = `هُوَ`;
        sub.innerHTML = `Woh rasool hai (He is a messenger)`;
        status.innerHTML = `Jumla: <span style="color:#d97706;">Seedha Jumla (هُوَ = Woh)</span>`;
      };
    },

    // Stage 4 Lesson 2: Attached Pronoun ـهُ
    's4l2'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: Aakhir mein ـهُ (Uska / Uski)</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s4l2-area">
              <div class="gv-word-display" id="s4l2-word">
                <span class="stem">بَيْتُ</span>
                <span class="suffix" style="color: #881337; transition: all 0.3s; display: inline-block;">هُ</span>
              </div>
              <div class="gv-subtext" id="s4l2-sub">uska ghar (his house)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">Lafz badal kar dekhein:</span>
              <div style="display: flex; gap: 6px;">
                <button class="gv-btn" id="s4l2-btn-rab">رَبُّهُ</button>
                <button class="gv-btn gv-btn-burgundy" id="s4l2-btn-kit">كِتَابُهُ</button>
                <button class="gv-btn gv-btn-blue" id="s4l2-btn-bayt">بَيْتُهُ</button>
              </div>
            </div>
            <div class="gv-status-bar" id="s4l2-status">
              Ta'alluq: <span style="color: #881337;">Surkh (Red) hissa = "Uska"</span>
            </div>
          </div>
        </div>
      `;

      const stem = container.querySelector('.stem');
      const sub = document.getElementById('s4l2-sub');

      container.querySelector('#s4l2-btn-rab').onclick = () => {
        AudioFX.play('pop');
        stem.textContent = 'رَبُّ';
        sub.innerHTML = `uska Rab (his Lord)`;
      };
      container.querySelector('#s4l2-btn-kit').onclick = () => {
        AudioFX.play('pop');
        stem.textContent = 'كِتَابُ';
        sub.innerHTML = `uski kitaab (his book)`;
      };
      container.querySelector('#s4l2-btn-bayt').onclick = () => {
        AudioFX.play('pop');
        stem.textContent = 'بَيْتُ';
        sub.innerHTML = `uska ghar (his house)`;
      };
    },

    // Stage 5 Lesson 4: Broken Plurals (Internal change morpher)
    's5l4'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: Lafz ke andar tabdeeli se Jama (Broken Plural)</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s5l4-area">
              <div class="gv-word-display" id="s5l4-word" style="gap: 16px;">
                <span class="sing-word" style="color: #1e40af; transition: all 0.3s;">عَالِمٌ</span>
                <span style="font-size: 1.5rem; color: #9ca3af;">➔</span>
                <span class="plur-word" style="color: #881337; font-weight: 700; transition: all 0.3s;">عُلَمَاءُ</span>
              </div>
              <div class="gv-subtext" id="s5l4-sub">Ek alim ➔ Kai ulema (Scholars)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">Dusri misalein dekhein:</span>
              <div style="display: flex; gap: 6px;">
                <button class="gv-btn" id="s5l4-btn-1">عَالِم ➔ عُلَمَاء</button>
                <button class="gv-btn gv-btn-burgundy" id="s5l4-btn-2">حَاكِم ➔ حُكَّام</button>
                <button class="gv-btn gv-btn-blue" id="s5l4-btn-3">كَافِر ➔ كُفَّار</button>
              </div>
            </div>
            <div class="gv-status-bar" id="s5l4-status">
              Qaidah: <span style="color: #881337;">Aakhir mein (ون) nahi, balke lafz ke andar tabdeeli</span>
            </div>
          </div>
        </div>
      `;

      const sing = container.querySelector('.sing-word');
      const plur = container.querySelector('.plur-word');
      const sub = document.getElementById('s5l4-sub');

      container.querySelector('#s5l4-btn-1').onclick = () => {
        AudioFX.play('whoosh');
        sing.textContent = 'عَالِمٌ';
        plur.textContent = 'عُلَمَاءُ';
        sub.innerHTML = `Ek alim ➔ Kai ulema (Scholars)`;
      };
      container.querySelector('#s5l4-btn-2').onclick = () => {
        AudioFX.play('whoosh');
        sing.textContent = 'حَاكِمٌ';
        plur.textContent = 'حُكَّامٌ';
        sub.innerHTML = `Ek hakim ➔ Kai hukkam (Rulers)`;
      };
      container.querySelector('#s5l4-btn-3').onclick = () => {
        AudioFX.play('whoosh');
        sing.textContent = 'كَافِرٌ';
        plur.textContent = 'كُفَّارٌ';
        sub.innerHTML = `Ek kafir ➔ Kai kuffar (Disbelievers)`;
      };
    }
  };

  // Generic fallback visual generator for any lesson key not explicitly registered
  function genericVisual(key, container) {
    injectStyles();
    container.innerHTML = `
      <div class="gv-card">
        <div class="gv-header">
          <span>✨ Sabbaq ka Markazi Nuqta (Core Focus)</span>
          <span class="gv-badge">Concept</span>
        </div>
        <div class="gv-body">
          <div class="gv-interactive-area">
            <div style="font-size: 0.95rem; color: #374151; text-align: center; max-width: 380px; line-height: 1.5;">
              Is sabaq mein surkh (red) rang markazi usool ya tabdeeli ko wazeh karta hai. Har lafz ke harakat aur maani par dhyan dein.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  return {
    mount(lessonKey, containerId) {
      injectStyles();
      const container = document.getElementById(containerId);
      if (!container) return;
      const key = (lessonKey || '').toLowerCase();
      if (Registry[key]) {
        Registry[key](container);
      } else {
        genericVisual(key, container);
      }
    },
    has(lessonKey) {
      const key = (lessonKey || '').toLowerCase();
      return !!Registry[key];
    }
  };
})();
