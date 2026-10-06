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
        } else if (type === 'chime') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.setValueAtTime(659.25, now + 0.08);
          osc.frequency.setValueAtTime(783.99, now + 0.16);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
          osc.start(now);
          osc.stop(now + 0.35);
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
      .gv-speaker-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.05rem;
        padding: 2px 6px;
        border-radius: 6px;
        transition: transform 0.15s, background 0.15s;
        margin-left: auto;
        margin-right: 8px;
        opacity: 0.85;
      }
      .gv-speaker-btn:hover {
        transform: scale(1.18);
        opacity: 1;
        background: rgba(0,0,0,0.06);
      }
      .gv-speaker-btn:active {
        transform: scale(0.92);
      }
      @keyframes vowel-land {
        0% { transform: translateY(-16px) scale(0.5); opacity: 0; }
        60% { transform: translateY(4px) scale(1.25); opacity: 1; }
        100% { transform: translateY(0) scale(1); opacity: 1; }
      }
      .vowel-fly {
        display: inline-block !important;
        animation: vowel-land 0.38s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }
    `;
    document.head.appendChild(style);
  }

  function speakArabicFromEl(el) {
    if (!el) return;
    const txt = el.innerText || el.textContent || '';
    const clean = txt.replace(/[a-zA-Z0-9_():+\-=\[\]\/\\]/g, '').trim();
    if (clean && window.App && typeof window.App.speakArabic === 'function') {
      window.App.speakArabic(clean);
    }
  }

  function attachVisualInteractions(container) {
    if (!container) return;
    const headers = container.querySelectorAll('.gv-header');
    headers.forEach(h => {
      if (!h.querySelector('.gv-speaker-btn')) {
        const btn = document.createElement('button');
        btn.className = 'gv-speaker-btn';
        btn.title = 'Sunen (Listen to Arabic)';
        btn.setAttribute('aria-label', 'Listen to Arabic');
        btn.innerHTML = '🔊';
        btn.onclick = (e) => {
          e.stopPropagation();
          const w = container.querySelector('.gv-word-display');
          if (w) speakArabicFromEl(w);
        };
        const badge = h.querySelector('.gv-badge');
        if (badge) h.insertBefore(btn, badge);
        else h.appendChild(btn);
      }
    });

    const displays = container.querySelectorAll('.gv-word-display');
    displays.forEach(d => {
      d.title = (d.title ? d.title + ' | ' : '') + 'Tap to listen';
      d.addEventListener('click', () => {
        setTimeout(() => speakArabicFromEl(d), 40);
      });
    });
  }

  // Particle explosion effect on vowel/affix change with spring fly-in
  function particleBurst(el, container) {
    if (!el || !container) return;
    el.classList.remove('vowel-fly');
    void el.offsetWidth;
    el.classList.add('vowel-fly');

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

    // Stage 2 Lesson 3: Harf-e-Jarr Fii (Container / Inside)
    's2l3'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: فِي (Mein / Container) ka asar</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s2l3-area">
              <svg viewBox="0 0 320 80" style="position: absolute; width: 100%; height: 100%; pointer-events: none; opacity: 0.35;">
                <rect x="30" y="10" width="260" height="60" rx="14" fill="none" stroke="#cb882c" stroke-width="2" stroke-dasharray="6,4"/>
              </svg>
              <div class="gv-word-display" id="s2l3-word">
                <span class="fi-pref" style="color: #881337; width: 0; opacity: 0; overflow: hidden; transition: all 0.35s ease; display: inline-block; margin-left: 8px;">فِي</span>
                <span class="stem" id="s2l3-stem">الْبَيْت</span>
                <span class="vowel" id="s2l3-vowel" style="color: #881337; transition: all 0.3s; display: inline-block;">ُ</span>
              </div>
              <div class="gv-subtext" id="s2l3-sub">al-baytu (Ghar / House)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">Alfaaz chun kar فِي dakhil karein:</span>
              <div style="display: flex; gap: 6px; flex-wrap: wrap; justify-content: center;">
                <button class="gv-btn" id="s2l3-btn-bayt">فِي الْبَيْتِ</button>
                <button class="gv-btn gv-btn-burgundy" id="s2l3-btn-masjid">فِي الْمَسْجِدِ</button>
                <button class="gv-btn gv-btn-blue" id="s2l3-btn-samaa">فِي السَّمَاءِ</button>
              </div>
            </div>
            <div class="gv-status-bar" id="s2l3-status">
              Qaidah: <span style="color: #881337;">Harf-e-Jarr 'فِي' lafz ko apne andar le kar aakhir mein Zer ( ِ ) deta hai</span>
            </div>
          </div>
        </div>
      `;

      const pref = container.querySelector('.fi-pref');
      const stem = document.getElementById('s2l3-stem');
      const vowel = document.getElementById('s2l3-vowel');
      const sub = document.getElementById('s2l3-sub');
      const status = document.getElementById('s2l3-status');
      const area = container.querySelector('.s2l3-area');
      const initialStem = stem.textContent;

      let activeWord = 0;
      function applyFi(wordStem, wordMeaning, btnId) {
        AudioFX.play('pop');
        particleBurst(vowel, area);
        pref.style.width = '46px';
        pref.style.opacity = '1';
        stem.textContent = wordStem;
        vowel.textContent = 'ِ';
        sub.innerHTML = `<span style="color: #881337;">${wordMeaning} (Zer / Majroor)</span>`;
        status.innerHTML = `Halat: <span style="color: #881337;">فِي aane se aakhir mein Zer ( ِ ) aaya</span>`;
      }

      container.querySelector('#s2l3-btn-bayt').onclick = () => applyFi('الْبَيْت', 'Ghar mein (In the house)', 'bayt');
      container.querySelector('#s2l3-btn-masjid').onclick = () => applyFi('الْمَسْجِد', 'Masjid mein (In the mosque)', 'masjid');
      container.querySelector('#s2l3-btn-samaa').onclick = () => applyFi('السَّمَاء', 'Aasman mein (In the heaven)', 'samaa');

      // Click word to toggle
      container.querySelector('#s2l3-word').onclick = () => {
        if (pref.style.opacity === '1') {
          AudioFX.play('whoosh');
          pref.style.width = '0px';
          pref.style.opacity = '0';
          vowel.textContent = 'ُ';
          sub.textContent = `${initialStem}u (Baghair فِي ke Pesh ُ)`;
          status.innerHTML = `Halat: <span style="color: #6b7280;">Aam Pesh ( ُ )</span>`;
        } else {
          applyFi(stem.textContent, 'Andar dakhil hone par Zer ِ', '');
        }
      };
    },

    // Stage 2 Lesson 4: Harf-e-Jarr Alaa (Superior Platform / On Top)
    's2l4'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: عَلَى (Par / Above Platform)</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s2l4-area">
              <svg viewBox="0 0 300 70" style="position: absolute; width: 100%; height: 100%; pointer-events: none; opacity: 0.25;">
                <line x1="20" y1="58" x2="280" y2="58" stroke="#3d6ca3" stroke-width="4" stroke-linecap="round"/>
                <polygon points="150,48 140,58 160,58" fill="#3d6ca3"/>
              </svg>
              <div class="gv-word-display" id="s2l4-word">
                <span class="alaa-pref" style="color: #3d6ca3; width: 0; opacity: 0; overflow: hidden; transition: all 0.35s ease; display: inline-block; margin-left: 8px;">عَلَى</span>
                <span class="stem" id="s2l4-stem">الْعَرْش</span>
                <span class="vowel" id="s2l4-vowel" style="color: #881337; transition: all 0.3s; display: inline-block;">ُ</span>
              </div>
              <div class="gv-subtext" id="s2l4-sub">al-'arshu (Arsh / Throne)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">عَلَى laga kar bulandi dekhein:</span>
              <div style="display: flex; gap: 6px; flex-wrap: wrap; justify-content: center;">
                <button class="gv-btn" id="s2l4-btn-arsh">عَلَى الْعَرْشِ</button>
                <button class="gv-btn gv-btn-burgundy" id="s2l4-btn-qalb">عَلَى الْقَلْبِ</button>
                <button class="gv-btn gv-btn-blue" id="s2l4-btn-ard">عَلَى الْأَرْضِ</button>
              </div>
            </div>
            <div class="gv-status-bar" id="s2l4-status">
              Qaidah: <span style="color: #3d6ca3;">Harf-e-Jarr 'عَلَى' kisi cheez ke upar hone ko batata hai aur Zer ( ِ ) deta hai</span>
            </div>
          </div>
        </div>
      `;

      const pref = container.querySelector('.alaa-pref');
      const stem = document.getElementById('s2l4-stem');
      const vowel = document.getElementById('s2l4-vowel');
      const sub = document.getElementById('s2l4-sub');
      const status = document.getElementById('s2l4-status');
      const area = container.querySelector('.s2l4-area');
      const initialStem = stem.textContent;

      function applyAlaa(wStem, wMeaning) {
        AudioFX.play('pop');
        particleBurst(vowel, area);
        pref.style.width = '64px';
        pref.style.opacity = '1';
        stem.textContent = wStem;
        vowel.textContent = 'ِ';
        sub.innerHTML = `<span style="color: #3d6ca3;">${wMeaning} (Zer / Majroor)</span>`;
        status.innerHTML = `Halat: <span style="color: #3d6ca3;">عَلَى aane se aakhir mein Zer ( ِ ) aayi</span>`;
      }

      container.querySelector('#s2l4-btn-arsh').onclick = () => applyAlaa('الْعَرْش', 'Arsh par (Upon the Throne)');
      container.querySelector('#s2l4-btn-qalb').onclick = () => applyAlaa('الْقَلْب', 'Dil par (Upon the heart)');
      container.querySelector('#s2l4-btn-ard').onclick = () => applyAlaa('الْأَرْض', 'Zameen par (Upon the earth)');

      container.querySelector('#s2l4-word').onclick = () => {
        if (pref.style.opacity === '1') {
          AudioFX.play('whoosh');
          pref.style.width = '0px';
          pref.style.opacity = '0';
          vowel.textContent = 'ُ';
          sub.textContent = `${initialStem}u (Baghair عَلَى ke Pesh ُ)`;
          status.innerHTML = `Halat: <span style="color: #6b7280;">Aam Pesh ( ُ )</span>`;
        } else {
          applyAlaa(stem.textContent, 'Platform par aane se Zer ِ');
        }
      };
    },

    // Stage 2 Lesson 5: Harf-e-Jarr Min (Origin Source Magnet)
    's2l5'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: مِنْ (Se / Origin Source)</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s2l5-area">
              <svg viewBox="0 0 300 70" style="position: absolute; width: 100%; height: 100%; pointer-events: none; opacity: 0.25;">
                <circle cx="50" cy="35" r="14" fill="#5a8249"/>
                <line x1="64" y1="35" x2="260" y2="35" stroke="#5a8249" stroke-width="2.5" stroke-dasharray="5,3"/>
                <polygon points="260,30 274,35 260,40" fill="#5a8249"/>
              </svg>
              <div class="gv-word-display" id="s2l5-word">
                <span class="min-pref" style="color: #5a8249; width: 0; opacity: 0; overflow: hidden; transition: all 0.35s ease; display: inline-block; margin-left: 8px;">مِنَ</span>
                <span class="stem" id="s2l5-stem">اللَّه</span>
                <span class="vowel" id="s2l5-vowel" style="color: #881337; transition: all 0.3s; display: inline-block;">ُ</span>
              </div>
              <div class="gv-subtext" id="s2l5-sub">Allahu (Allah)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">Ibtida / Source dekhne ke liye tap karein:</span>
              <div style="display: flex; gap: 6px; flex-wrap: wrap; justify-content: center;">
                <button class="gv-btn" id="s2l5-btn-allah">مِنَ اللَّهِ</button>
                <button class="gv-btn gv-btn-burgundy" id="s2l5-btn-jinn">مِنَ الْجِنَّةِ</button>
                <button class="gv-btn gv-btn-blue" id="s2l5-btn-samaa">مِنَ السَّمَاءِ</button>
              </div>
            </div>
            <div class="gv-status-bar" id="s2l5-status">
              Qaidah: <span style="color: #5a8249;">Harf-e-Jarr 'مِنْ' ibtida (kahan se shuru hua) zahir karta hai aur Zer ( ِ ) deta hai</span>
            </div>
          </div>
        </div>
      `;

      const pref = container.querySelector('.min-pref');
      const stem = document.getElementById('s2l5-stem');
      const vowel = document.getElementById('s2l5-vowel');
      const sub = document.getElementById('s2l5-sub');
      const status = document.getElementById('s2l5-status');
      const area = container.querySelector('.s2l5-area');
      const initialStem = stem.textContent;

      function applyMin(wStem, wMeaning) {
        AudioFX.play('pop');
        particleBurst(vowel, area);
        pref.style.width = '64px';
        pref.style.opacity = '1';
        stem.textContent = wStem;
        vowel.textContent = 'ِ';
        sub.innerHTML = `<span style="color: #5a8249;">${wMeaning} (Zer / Majroor)</span>`;
        status.innerHTML = `Halat: <span style="color: #5a8249;">مِنْ ki wajah se aakhir mein Zer ( ِ ) aaya</span>`;
      }

      container.querySelector('#s2l5-btn-allah').onclick = () => applyMin('اللَّه', 'Allah ki taraf se (From Allah)');
      container.querySelector('#s2l5-btn-jinn').onclick = () => applyMin('الْجِنَّة', 'Jinnat mein se (From the Jinn)');
      container.querySelector('#s2l5-btn-samaa').onclick = () => applyMin('السَّمَاء', 'Aasman se (From the sky)');

      container.querySelector('#s2l5-word').onclick = () => {
        if (pref.style.opacity === '1') {
          AudioFX.play('whoosh');
          pref.style.width = '0px';
          pref.style.opacity = '0';
          vowel.textContent = 'ُ';
          sub.textContent = `${initialStem}u (Baghair مِنْ ke Pesh ُ)`;
          status.innerHTML = `Halat: <span style="color: #6b7280;">Aam Pesh ( ُ )</span>`;
        } else {
          applyMin(stem.textContent, 'Ibtida zahir karne par Zer ِ');
        }
      };
    },

    // Stage 2 Lesson 6: Harf-e-Jarr Ilaa (Destination Pathway)
    's2l6'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: إِلَى (Taraf / Destination Arrow)</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s2l6-area">
              <svg viewBox="0 0 300 70" style="position: absolute; width: 100%; height: 100%; pointer-events: none; opacity: 0.25;">
                <path d="M30,35 Q150,15 270,35" fill="none" stroke="#d97706" stroke-width="2.5" stroke-dasharray="6,3"/>
                <polygon points="268,28 284,35 268,42" fill="#d97706"/>
              </svg>
              <div class="gv-word-display" id="s2l6-word">
                <span class="ila-pref" style="color: #d97706; width: 0; opacity: 0; overflow: hidden; transition: all 0.35s ease; display: inline-block; margin-left: 8px;">إِلَى</span>
                <span class="stem" id="s2l6-stem">اللَّه</span>
                <span class="vowel" id="s2l6-vowel" style="color: #881337; transition: all 0.3s; display: inline-block;">ُ</span>
              </div>
              <div class="gv-subtext" id="s2l6-sub">Allahu (Allah)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">Manzil / Destination dekhein:</span>
              <div style="display: flex; gap: 6px; flex-wrap: wrap; justify-content: center;">
                <button class="gv-btn" id="s2l6-btn-allah">إِلَى اللَّهِ</button>
                <button class="gv-btn gv-btn-burgundy" id="s2l6-btn-haqq">إِلَى الْحَقِّ</button>
                <button class="gv-btn gv-btn-blue" id="s2l6-btn-sirat">إِلَى الصِّرَاطِ</button>
              </div>
            </div>
            <div class="gv-status-bar" id="s2l6-status">
              Qaidah: <span style="color: #d97706;">Harf-e-Jarr 'إِلَى' manzil (kis taraf) batata hai aur Zer ( ِ ) deta hai</span>
            </div>
          </div>
        </div>
      `;

      const pref = container.querySelector('.ila-pref');
      const stem = document.getElementById('s2l6-stem');
      const vowel = document.getElementById('s2l6-vowel');
      const sub = document.getElementById('s2l6-sub');
      const status = document.getElementById('s2l6-status');
      const area = container.querySelector('.s2l6-area');
      const initialStem = stem.textContent;

      function applyIla(wStem, wMeaning) {
        AudioFX.play('pop');
        particleBurst(vowel, area);
        pref.style.width = '64px';
        pref.style.opacity = '1';
        stem.textContent = wStem;
        vowel.textContent = 'ِ';
        sub.innerHTML = `<span style="color: #d97706;">${wMeaning} (Zer / Majroor)</span>`;
        status.innerHTML = `Halat: <span style="color: #d97706;">إِلَى ki wajah se aakhir mein Zer ( ِ ) aaya</span>`;
      }

      container.querySelector('#s2l6-btn-allah').onclick = () => applyIla('اللَّه', 'Allah ki taraf (Towards Allah)');
      container.querySelector('#s2l6-btn-haqq').onclick = () => applyIla('الْحَقّ', 'Haq ki taraf (Towards the Truth)');
      container.querySelector('#s2l6-btn-sirat').onclick = () => applyIla('الصِّرَاط', 'Seedhe raaste ki taraf (Towards the Path)');

      container.querySelector('#s2l6-word').onclick = () => {
        if (pref.style.opacity === '1') {
          AudioFX.play('whoosh');
          pref.style.width = '0px';
          pref.style.opacity = '0';
          vowel.textContent = 'ُ';
          sub.textContent = `${initialStem}u (Baghair إِلَى ke Pesh ُ)`;
          status.innerHTML = `Halat: <span style="color: #6b7280;">Aam Pesh ( ُ )</span>`;
        } else {
          applyIla(stem.textContent, 'Manzil ki taraf jaane par Zer ِ');
        }
      };
    },

    // Stage 2 Lesson 7: Harf-e-Jarr Bi (Instrument / Link Chain)
    's2l7'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: بِـ (Ke Saath / Zariye Chain)</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s2l7-area">
              <svg viewBox="0 0 300 70" style="position: absolute; width: 100%; height: 100%; pointer-events: none; opacity: 0.25;">
                <circle cx="130" cy="35" r="16" fill="none" stroke="#881337" stroke-width="3"/>
                <circle cx="155" cy="35" r="16" fill="none" stroke="#881337" stroke-width="3"/>
              </svg>
              <div class="gv-word-display" id="s2l7-word">
                <span class="bi-pref" style="color: #881337; width: 0; opacity: 0; overflow: hidden; transition: all 0.35s ease; display: inline-block; margin-left: 4px;">بِـ</span>
                <span class="stem" id="s2l7-stem">الْقَلَم</span>
                <span class="vowel" id="s2l7-vowel" style="color: #881337; transition: all 0.3s; display: inline-block;">ُ</span>
              </div>
              <div class="gv-subtext" id="s2l7-sub">al-qalamu (Qalam / Pen)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">بِـ jod kar rabt dekhein:</span>
              <div style="display: flex; gap: 6px; flex-wrap: wrap; justify-content: center;">
                <button class="gv-btn" id="s2l7-btn-qalam">بِالْقَلَمِ</button>
                <button class="gv-btn gv-btn-burgundy" id="s2l7-btn-allah">بِاللَّهِ</button>
                <button class="gv-btn gv-btn-blue" id="s2l7-btn-haqq">بِالْحَقِّ</button>
              </div>
            </div>
            <div class="gv-status-bar" id="s2l7-status">
              Qaidah: <span style="color: #881337;">Harf-e-Jarr 'بِـ' seedha lafz ke sath jurta hai aur aakhir mein Zer ( ِ ) deta hai</span>
            </div>
          </div>
        </div>
      `;

      const pref = container.querySelector('.bi-pref');
      const stem = document.getElementById('s2l7-stem');
      const vowel = document.getElementById('s2l7-vowel');
      const sub = document.getElementById('s2l7-sub');
      const status = document.getElementById('s2l7-status');
      const area = container.querySelector('.s2l7-area');
      const initialStem = stem.textContent;

      function applyBi(wStem, wMeaning) {
        AudioFX.play('pop');
        particleBurst(vowel, area);
        pref.style.width = '42px';
        pref.style.opacity = '1';
        stem.textContent = wStem;
        vowel.textContent = 'ِ';
        sub.innerHTML = `<span style="color: #881337;">${wMeaning} (Zer / Majroor)</span>`;
        status.innerHTML = `Halat: <span style="color: #881337;">بِـ jodne se aakhir mein Zer ( ِ ) aayi</span>`;
      }

      container.querySelector('#s2l7-btn-qalam').onclick = () => applyBi('الْقَلَم', 'Qalam ke zariye (By the pen)');
      container.querySelector('#s2l7-btn-allah').onclick = () => applyBi('اللَّه', 'Allah ke saath (In/With Allah)');
      container.querySelector('#s2l7-btn-haqq').onclick = () => applyBi('الْحَقّ', 'Haq ke saath (With truth)');

      container.querySelector('#s2l7-word').onclick = () => {
        if (pref.style.opacity === '1') {
          AudioFX.play('whoosh');
          pref.style.width = '0px';
          pref.style.opacity = '0';
          vowel.textContent = 'ُ';
          sub.textContent = `${initialStem}u (Baghair بِـ ke Pesh ُ)`;
          status.innerHTML = `Halat: <span style="color: #6b7280;">Aam Pesh ( ُ )</span>`;
        } else {
          applyBi(stem.textContent, 'Taalluq jodne par Zer ِ');
        }
      };
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
              <svg viewBox="0 0 220 40" class="gv-connecting-arc s3l1-arc-svg" style="width: 180px; height: 36px; overflow: visible; margin-bottom: -4px;">
                <path id="s3l1-arc" d="M 45,30 Q 110,6 175,30" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="140" stroke-dashoffset="0" style="transition: stroke-dashoffset 0.4s ease;"/>
                <circle cx="45" cy="30" r="3.5" fill="#1a1a1a"/>
                <circle cx="175" cy="30" r="3.5" fill="#dc2626"/>
                <text x="110" y="16" font-size="10" fill="#dc2626" text-anchor="middle" font-weight="700">Tawseefi Arc (مطابقت)</text>
              </svg>
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
      const arc = container.querySelector('#s3l1-arc');

      function triggerTawseefi(mTxt, sTxt, subTxt) {
        AudioFX.play('chime');
        mawsoof.textContent = mTxt;
        sifat.textContent = sTxt;
        sub.textContent = subTxt;
        particleBurst(sifat, container.querySelector('.s3l1-area'));
        if (arc) {
          arc.style.strokeDashoffset = '140';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => { arc.style.strokeDashoffset = '0'; });
          });
        }
      }

      container.querySelector('#s3l1-btn-1').onclick = () => triggerTawseefi('شَيْءٌ', 'عَظِيمٌ', 'Ek badi cheez (Bada maamla)');
      container.querySelector('#s3l1-btn-2').onclick = () => triggerTawseefi('عَذَابٌ', 'شَدِيدٌ', 'Sakht azaab (Severe punishment)');
      container.querySelector('#s3l1-btn-3').onclick = () => triggerTawseefi('فَوْزٌ', 'كَبِيرٌ', 'Badi kamyabi (Great success)');
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
              <svg viewBox="0 0 220 40" class="gv-connecting-arc s3l4-arc-svg" style="width: 180px; height: 36px; overflow: visible; margin-bottom: -4px;">
                <path id="s3l4-arc" d="M 45,30 Q 110,6 175,30" fill="none" stroke="#d97706" stroke-width="2.5" stroke-dasharray="140" stroke-dashoffset="0" style="transition: stroke-dashoffset 0.4s ease;"/>
                <circle cx="45" cy="30" r="3.5" fill="#dc2626"/>
                <circle cx="175" cy="30" r="3.5" fill="#1a1a1a"/>
                <text x="110" y="16" font-size="10" fill="#d97706" text-anchor="middle" font-weight="700">Izaafat Bond (تعلق)</text>
              </svg>
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
      const arc = container.querySelector('#s3l4-arc');

      function triggerIzaafat(mTxt, miTxt, subTxt) {
        AudioFX.play('chime');
        m.textContent = mTxt;
        mi.textContent = miTxt;
        sub.textContent = subTxt;
        particleBurst(m, container.querySelector('.s3l4-area'));
        if (arc) {
          arc.style.strokeDashoffset = '140';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => { arc.style.strokeDashoffset = '0'; });
          });
        }
      }

      container.querySelector('#s3l4-btn-1').onclick = () => triggerIzaafat('رَبُّ', 'الْعَرْشِ', 'Arsh ka Rabb (Lord of the Throne)');
      container.querySelector('#s3l4-btn-2').onclick = () => triggerIzaafat('كِتَابُ', 'اللَّهِ', 'Allah ki kitaab (Book of Allah)');
      container.querySelector('#s3l4-btn-3').onclick = () => triggerIzaafat('يَوْمُ', 'الْقِيَامَةِ', 'Qiyamat ka din (Day of Resurrection)');
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
    },

    // Stage 5 Lesson 1 & 2: Jumla Ismiyyah Nominal Sentence & Inna Balance Beam
    's5l1'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: Jumla Ismiyyah & إِنَّ ka Tarazu (Balance Scale)</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s5l1-area" style="min-height: 190px;">
              <svg viewBox="0 0 340 130" style="width: 100%; max-width: 340px; height: 130px;">
                <!-- Central Stand -->
                <line x1="170" y1="55" x2="170" y2="120" stroke="#7a6555" stroke-width="4"/>
                <polygon points="170,45 156,120 184,120" fill="#c8832a" opacity="0.3"/>
                <circle cx="170" cy="55" r="5" fill="#c8832a"/>
                <polygon points="170,45 162,55 178,55" fill="#7a6555"/>
                
                <!-- Rotating Crossbeam -->
                <g id="s5l1-beam" style="transform-origin: 170px 55px; transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);">
                  <line x1="50" y1="55" x2="290" y2="55" stroke="#1a1511" stroke-width="3.5" stroke-linecap="round"/>
                  <!-- Left Pan Hangers -->
                  <line x1="70" y1="55" x2="50" y2="88" stroke="#cb882c" stroke-width="1.5"/>
                  <line x1="70" y1="55" x2="90" y2="88" stroke="#cb882c" stroke-width="1.5"/>
                  <path d="M42,88 Q70,102 98,88 Z" fill="#ebdcc0" stroke="#c8832a" stroke-width="1.5"/>
                  <!-- Right Pan Hangers -->
                  <line x1="270" y1="55" x2="250" y2="88" stroke="#cb882c" stroke-width="1.5"/>
                  <line x1="270" y1="55" x2="290" y2="88" stroke="#cb882c" stroke-width="1.5"/>
                  <path d="M242,88 Q270,102 298,88 Z" fill="#ebdcc0" stroke="#c8832a" stroke-width="1.5"/>
                  
                  <!-- Left Pan Content (Mubtada) -->
                  <text id="s5l1-svg-mubtada" x="70" y="82" font-family="'Amiri',serif" font-size="16" font-weight="700" text-anchor="middle" fill="#1e40af">اللَّهُ</text>
                  <!-- Right Pan Content (Khabar) -->
                  <text id="s5l1-svg-khabar" x="270" y="82" font-family="'Amiri',serif" font-size="16" font-weight="700" text-anchor="middle" fill="#1a1511">عَلِيمٌ</text>
                </g>
              </svg>

              <div class="gv-word-display" id="s5l1-word" style="font-size: 2rem; margin-top: 4px;">
                <span class="inna-tag" id="s5l1-inna-tag" style="color: #dc2626; width: 0; opacity: 0; overflow: hidden; transition: all 0.4s ease; display: inline-block; margin-left: 10px;">إِنَّ</span>
                <span class="mub-word" id="s5l1-mub" style="color: #1e40af; margin-left: 8px;">اللَّهُ</span>
                <span class="khab-word" id="s5l1-khab" style="color: #1a1511;">عَلِيمٌ</span>
              </div>
              <div class="gv-subtext" id="s5l1-sub">Mubtada aur Khabar dono barabar (Pesh ُ)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">Tarazu par إِنَّ dakhil karke jhukaav dekhein:</span>
              <div style="display: flex; gap: 6px; flex-wrap: wrap; justify-content: center;">
                <button class="gv-btn gv-btn-burgundy" id="s5l1-btn-toggle">Apply إِنَّ (Mansoob Zabar)</button>
                <button class="gv-btn" id="s5l1-btn-pair1">اللَّهُ عَلِيمٌ</button>
                <button class="gv-btn gv-btn-blue" id="s5l1-btn-pair2">اللَّهُ غَفُورٌ</button>
              </div>
            </div>
            <div class="gv-status-bar" id="s5l1-status">
              Qaidah: <span style="color: #1e40af;">Aam jumle mein Mubtada aur Khabar dono Marfoo (Pesh ُ) hote hain</span>
            </div>
          </div>
        </div>
      `;

      let hasInna = false;
      let curMub = 'اللَّه';
      let curKhab = 'عَلِيمٌ';

      const beam = container.querySelector('#s5l1-beam');
      const innaTag = container.querySelector('#s5l1-inna-tag');
      const mubSpan = container.querySelector('#s5l1-mub');
      const khabSpan = container.querySelector('#s5l1-khab');
      const svgMub = container.querySelector('#s5l1-svg-mubtada');
      const svgKhab = container.querySelector('#s5l1-svg-khabar');
      const sub = document.getElementById('s5l1-sub');
      const status = document.getElementById('s5l1-status');
      const btnToggle = container.querySelector('#s5l1-btn-toggle');

      function updateDisplay() {
        if (hasInna) {
          AudioFX.play('pop');
          innaTag.style.width = '48px';
          innaTag.style.opacity = '1';
          beam.style.transform = 'rotate(6deg)';
          mubSpan.textContent = curMub + 'َ';
          mubSpan.style.color = '#dc2626';
          svgMub.textContent = curMub + 'َ';
          svgMub.setAttribute('fill', '#dc2626');
          khabSpan.textContent = curKhab;
          svgKhab.textContent = curKhab;
          sub.innerHTML = `<span style="color: #dc2626;">Beshak ${curMub} khoob janne wala hai (Mubtada Mansoob َ bana)</span>`;
          status.innerHTML = `Qaidah: <span style="color: #dc2626;">إِنَّ aane se pehla ism Mansoob (Zabar َ) ho gaya, doosra Marfoo (Pesh ُ) raha</span>`;
          btnToggle.textContent = 'Remove إِنَّ (Reset Balance)';
        } else {
          AudioFX.play('whoosh');
          innaTag.style.width = '0px';
          innaTag.style.opacity = '0';
          beam.style.transform = 'rotate(0deg)';
          mubSpan.textContent = curMub + 'ُ';
          mubSpan.style.color = '#1e40af';
          svgMub.textContent = curMub + 'ُ';
          svgMub.setAttribute('fill', '#1e40af');
          khabSpan.textContent = curKhab;
          svgKhab.textContent = curKhab;
          sub.textContent = `${curMub} janne wala hai (Seedha Jumla Ismiyyah)`;
          status.innerHTML = `Qaidah: <span style="color: #1e40af;">Aam jumle mein Mubtada aur Khabar dono Marfoo (Pesh ُ) hote hain</span>`;
          btnToggle.textContent = 'Apply إِنَّ (Mansoob Zabar)';
        }
      }

      btnToggle.onclick = () => {
        hasInna = !hasInna;
        updateDisplay();
      };

      container.querySelector('#s5l1-btn-pair1').onclick = () => {
        curMub = 'اللَّه';
        curKhab = 'عَلِيمٌ';
        updateDisplay();
      };
      container.querySelector('#s5l1-btn-pair2').onclick = () => {
        curMub = 'اللَّه';
        curKhab = 'غَفُورٌ';
        updateDisplay();
      };
    },

    's5l2'(container) {
      if (Registry['s5l1']) Registry['s5l1'](container);
    },

    // Stage 6 Lesson 1 & 6: Past Tense Conjugation Dial (Morphological Wheel)
    's6l1'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: Fe'l Mazi (Past Tense) Conjugation Dial</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s6l1-area" style="min-height: 200px;">
              <!-- Semicircular Radial Dial SVG -->
              <div style="position: relative; width: 220px; height: 95px; margin-bottom: 4px;">
                <svg id="s6l1-dial-svg" viewBox="0 0 240 115" style="width: 100%; height: 100%; overflow: visible;">
                  <path d="M 25,100 A 95,95 0 0,1 215,100" fill="none" stroke="#e5e7eb" stroke-width="12" stroke-linecap="round"/>
                  <path d="M 25,100 A 95,95 0 0,1 55,50" fill="none" stroke="#d97706" stroke-width="8" stroke-linecap="round"/>
                  <path d="M 55,50 A 95,95 0 0,1 98,18" fill="none" stroke="#881337" stroke-width="8"/>
                  <path d="M 98,18 A 95,95 0 0,1 142,18" fill="none" stroke="#1e40af" stroke-width="8"/>
                  <path d="M 142,18 A 95,95 0 0,1 185,50" fill="none" stroke="#5a8249" stroke-width="8"/>
                  <path d="M 185,50 A 95,95 0 0,1 215,100" fill="none" stroke="#4b5563" stroke-width="8" stroke-linecap="round"/>
                  <text x="24" y="114" font-size="10" font-weight="700" fill="#d97706" style="cursor:pointer;" class="dial-lbl" data-p="huwa">هُوَ</text>
                  <text x="46" y="44" font-size="10" font-weight="700" fill="#881337" style="cursor:pointer;" class="dial-lbl" data-p="hum">هُمْ</text>
                  <text x="120" y="14" font-size="11" font-weight="800" fill="#1e40af" style="cursor:pointer;" class="dial-lbl" data-p="anta" text-anchor="middle">أَنْتَ</text>
                  <text x="194" y="44" font-size="10" font-weight="700" fill="#5a8249" style="cursor:pointer;" class="dial-lbl" data-p="ana">أَنَا</text>
                  <text x="216" y="114" font-size="10" font-weight="700" fill="#4b5563" style="cursor:pointer;" class="dial-lbl" data-p="nahnu" text-anchor="end">نَحْنُ</text>
                  <g id="s6l1-needle" style="transform-origin: 120px 100px; transform: rotate(-60deg); transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);">
                    <line x1="120" y1="100" x2="120" y2="28" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
                    <polygon points="120,20 115,30 125,30" fill="#dc2626"/>
                    <circle cx="120" cy="100" r="7" fill="#1f2937"/>
                    <circle cx="120" cy="100" r="3" fill="#ffffff"/>
                  </g>
                </svg>
              </div>
              <!-- Central Morphological Display -->
              <div class="gv-word-display" id="s6l1-display" style="gap: 2px; font-size: 2.5rem;">
                <span class="r-root" id="s6l1-root" style="color: #111827; letter-spacing: 2px;">فَعَلَ</span>
                <span class="r-suffix" id="s6l1-suffix" style="color: #dc2626; font-weight: 700; transition: all 0.3s ease;"></span>
              </div>
              <div class="gv-subtext" id="s6l1-sub">Us 1 mard ne kiya (He did)</div>
              <div style="font-size: 0.78rem; color: #9ca3af; margin-top: 4px;" id="s6l1-pronoun-tag">Zameer: هُوَ (Default 3 Root Letters)</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">Zameer (Pronoun) chun kar aakhri aalaamat dekhein:</span>
              <div style="display: flex; gap: 5px; flex-wrap: wrap; justify-content: center;">
                <button class="gv-btn" id="s6l1-btn-huwa">هُوَ (Woh 1)</button>
                <button class="gv-btn gv-btn-burgundy" id="s6l1-btn-hum">هُمْ (Woh sab) ـُوا</button>
                <button class="gv-btn gv-btn-blue" id="s6l1-btn-anta">أَنْتَ (Aap 1) ـْتَ</button>
                <button class="gv-btn" style="background:#5a8249;" id="s6l1-btn-ana">أَنَا (Main) ـْتُ</button>
                <button class="gv-btn" style="background:#4b5563;" id="s6l1-btn-nahnu">نَحْنُ (Hum) ـْنَا</button>
              </div>
              <div style="display: flex; gap: 6px; margin-top: 8px; justify-content: center;">
                <span style="font-size: 0.75rem; color: #6b7280; display:flex; align-items:center;">Roots:</span>
                <button class="gv-btn" style="padding: 3px 8px; font-size: 0.72rem;" id="s6l1-root-faala">ف-ع-ل (Kiya)</button>
                <button class="gv-btn gv-btn-burgundy" style="padding: 3px 8px; font-size: 0.72rem;" id="s6l1-root-abada">ع-ب-د (Ibadat ki)</button>
                <button class="gv-btn gv-btn-blue" style="padding: 3px 8px; font-size: 0.72rem;" id="s6l1-root-nasara">ن-ص-ر (Madad ki)</button>
              </div>
            </div>
            <div class="gv-status-bar" id="s6l1-status">
              Qaidah: <span style="color: #dc2626;">3 bunyadi huroof (Black) rehte hain, Zameer aakhir mein (Red) jurti hai</span>
            </div>
          </div>
        </div>
      `;

      let currentVerb = 'faal'; // 'faal' | 'abad' | 'nasar'
      const verbForms = {
        faal: {
          huwa:  { root: 'فَعَلَ', suff: '', meaning: 'Us 1 mard ne kiya (He did)', zam: 'هُوَ (Default)', deg: -60 },
          hum:   { root: 'فَعَل', suff: 'ُوا', meaning: 'Un sab ne kiya (They did)', zam: 'هُمْ', deg: -30 },
          anta:  { root: 'فَعَلْ', suff: 'تَ', meaning: 'Aap ne kiya (You did)', zam: 'أَنْتَ', deg: 0 },
          ana:   { root: 'فَعَلْ', suff: 'تُ', meaning: 'Maine kiya (I did)', zam: 'أَنَا', deg: 30 },
          nahnu: { root: 'فَعَلْ', suff: 'نَا', meaning: 'Humne kiya (We did)', zam: 'نَحْنُ', deg: 60 }
        },
        abad: {
          huwa:  { root: 'عَبَدَ', suff: '', meaning: 'Usne ibadat ki (He worshipped)', zam: 'هُوَ (Default)', deg: -60 },
          hum:   { root: 'عَبَد', suff: 'ُوا', meaning: 'Unhon ne ibadat ki (They worshipped)', zam: 'هُمْ', deg: -30 },
          anta:  { root: 'عَبَدْ', suff: 'تَ', meaning: 'Aapne ibadat ki (You worshipped)', zam: 'أَنْتَ', deg: 0 },
          ana:   { root: 'عَبَدْ', suff: 'تُ', meaning: 'Maine ibadat ki (I worshipped)', zam: 'أَنَا', deg: 30 },
          nahnu: { root: 'عَبَدْ', suff: 'نَا', meaning: 'Humne ibadat ki (We worshipped)', zam: 'نَحْنُ', deg: 60 }
        },
        nasar: {
          huwa:  { root: 'نَصَرَ', suff: '', meaning: 'Usne madad ki (He helped)', zam: 'هُوَ (Default)', deg: -60 },
          hum:   { root: 'نَصَر', suff: 'ُوا', meaning: 'Unhon ne madad ki (They helped)', zam: 'هُمْ', deg: -30 },
          anta:  { root: 'نَصَرْ', suff: 'تَ', meaning: 'Aapne madad ki (You helped)', zam: 'أَنْتَ', deg: 0 },
          ana:   { root: 'نَصَرْ', suff: 'تُ', meaning: 'Maine madad ki (I helped)', zam: 'أَنَا', deg: 30 },
          nahnu: { root: 'نَصَرْ', suff: 'نَا', meaning: 'Humne madad ki (We helped)', zam: 'نَحْنُ', deg: 60 }
        }
      };

      let currentPronoun = 'huwa';
      const rootEl = container.querySelector('#s6l1-root');
      const suffEl = container.querySelector('#s6l1-suffix');
      const subEl = document.getElementById('s6l1-sub');
      const tagEl = document.getElementById('s6l1-pronoun-tag');
      const needle = container.querySelector('#s6l1-needle');
      const area = container.querySelector('.s6l1-area');

      function applyConjugation(pKey) {
        currentPronoun = pKey;
        AudioFX.play('pop');
        const data = verbForms[currentVerb][currentPronoun];
        particleBurst(suffEl, area);
        rootEl.textContent = data.root;
        suffEl.textContent = data.suff;
        subEl.textContent = data.meaning;
        tagEl.textContent = `Zameer: ${data.zam}`;
        if (needle) {
          needle.style.transform = `rotate(${data.deg}deg)`;
        }
      }

      container.querySelector('#s6l1-btn-huwa').onclick = () => applyConjugation('huwa');
      container.querySelector('#s6l1-btn-hum').onclick = () => applyConjugation('hum');
      container.querySelector('#s6l1-btn-anta').onclick = () => applyConjugation('anta');
      container.querySelector('#s6l1-btn-ana').onclick = () => applyConjugation('ana');
      container.querySelector('#s6l1-btn-nahnu').onclick = () => applyConjugation('nahnu');

      container.querySelectorAll('.dial-lbl').forEach(lbl => {
        lbl.onclick = () => {
          const p = lbl.getAttribute('data-p');
          if (p) applyConjugation(p);
        };
      });

      container.querySelector('#s6l1-root-faala').onclick = () => { currentVerb = 'faal'; applyConjugation(currentPronoun); };
      container.querySelector('#s6l1-root-abada').onclick = () => { currentVerb = 'abad'; applyConjugation(currentPronoun); };
      container.querySelector('#s6l1-root-nasara').onclick = () => { currentVerb = 'nasar'; applyConjugation(currentPronoun); };
    },

    's6l6'(container) {
      if (Registry['s6l1']) Registry['s6l1'](container);
    },

    // Stage 7 Lesson 7: Conditional Shart wa Jaza Scales
    's7l7'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: إِنْ (Agar) — Shart & Jaza Connection</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s7l7-area" style="min-height: 180px;">
              <svg viewBox="0 0 340 100" style="width: 100%; max-width: 340px; height: 100px;">
                <!-- Condition Box -->
                <rect x="15" y="20" width="135" height="60" rx="10" fill="#fdf3e2" stroke="#cb882c" stroke-width="2"/>
                <text x="82" y="44" font-family="'Amiri',serif" font-size="15" font-weight="700" text-anchor="middle" fill="#1a1511">إِنْ تَنْصُرُوا اللَّهَ</text>
                <text x="82" y="66" font-family="sans-serif" font-size="9" text-anchor="middle" fill="#7a6555">SHART (Condition)</text>

                <!-- Glowing Connecting Arc -->
                <path id="s7l7-arc" d="M150,50 Q170,15 190,50" fill="none" stroke="#9ca3af" stroke-width="3" stroke-dasharray="6,3"/>
                <polygon points="190,45 198,52 188,57" fill="#9ca3af"/>

                <!-- Response Box -->
                <rect x="190" y="20" width="135" height="60" rx="10" fill="#f0f5ee" stroke="#5a8249" stroke-width="2"/>
                <text x="257" y="44" font-family="'Amiri',serif" font-size="16" font-weight="700" text-anchor="middle" fill="#1a1511">يَنْصُرْكُمْ</text>
                <text x="257" y="66" font-family="sans-serif" font-size="9" text-anchor="middle" fill="#5a8249">JAZA (Promise)</text>
              </svg>
              <div class="gv-subtext" id="s7l7-sub" style="margin-top: 6px;">Agar tum Allah ki madad karoge ➔ Toh Woh tumhari madad karega</div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">Shart aur Jaza ka rabt jodein:</span>
              <button class="gv-btn gv-btn-burgundy" id="s7l7-btn-glow">⚡ Activate Connection</button>
            </div>
            <div class="gv-status-bar" id="s7l7-status">
              Qaidah: <span style="color: #cb882c;">إِنْ Shart aur Jaza dono ko Jazm (Sukoon ـْ) deta hai</span>
            </div>
          </div>
        </div>
      `;

      let active = false;
      const arc = container.querySelector('#s7l7-arc');
      const sub = document.getElementById('s7l7-sub');
      const status = document.getElementById('s7l7-status');
      const area = container.querySelector('.s7l7-area');

      container.querySelector('#s7l7-btn-glow').onclick = () => {
        active = !active;
        AudioFX.play('pop');
        particleBurst(arc, area);
        if (active) {
          arc.setAttribute('stroke', '#cb882c');
          arc.setAttribute('stroke-width', '4');
          sub.innerHTML = `<span style="color: #5a8249; font-weight:700;">Shart poori hui ➔ Allah ki nusrat ka waada yaqeenan poora hua!</span>`;
          status.innerHTML = `Rabt: <span style="color: #5a8249;">Shart aur Jaza dono lafz aapas mein laazmi jud gaye</span>`;
        } else {
          arc.setAttribute('stroke', '#9ca3af');
          arc.setAttribute('stroke-width', '3');
          sub.textContent = 'Agar tum Allah ki madad karoge ➔ Toh Woh tumhari madad karega';
          status.innerHTML = `Qaidah: <span style="color: #cb882c;">إِنْ Shart aur Jaza dono ko Jazm (Sukoon ـْ) deta hai</span>`;
        }
      };
    },

    // Stage 7 Lesson 8: Active to Passive (Ma'roof to Majhool Vowel Shift Morpher)
    's7l8'(container) {
      container.innerHTML = `
        <div class="gv-card">
          <div class="gv-header">
            <span>✨ Visual Samajh: Ma'roof (Active) ➔ Majhool (Passive) Morph</span>
            <span class="gv-badge">Interactive</span>
          </div>
          <div class="gv-body">
            <div class="gv-interactive-area s7l8-area" style="min-height: 180px;">
              <div class="gv-word-display" id="s7l8-word" style="font-size: 2.8rem;">
                <span class="m-v1" id="s7l8-c1" style="color: #1a1511; transition: all 0.35s ease;">عَـ</span><span class="m-v2" id="s7l8-c2" style="color: #1a1511; transition: all 0.35s ease;">بَـ</span><span class="m-v3" id="s7l8-c3" style="color: #1a1511;">دَ</span>
              </div>
              <div class="gv-subtext" id="s7l8-sub">Usne ibadat ki (He worshipped) — Ma'roof / Active</div>
              <div style="margin-top: 4px;">
                <span class="gv-badge" id="s7l8-voice-tag" style="background:#eef3fa; color:#3d6ca3;">Ma'roof (Kaam Karne Wala Ma'loom)</span>
              </div>
            </div>
            <div class="gv-controls">
              <span class="gv-hint">Pesh aur Zer ki tabdeeli dekhein:</span>
              <button class="gv-btn gv-btn-burgundy" id="s7l8-btn-morph">Transform to Majhool (عُبِدَ)</button>
              <div style="display: flex; gap: 6px; margin-top: 8px; justify-content: center;">
                <button class="gv-btn" style="padding: 3px 8px; font-size: 0.72rem;" id="s7l8-v-abad">عَبَدَ ➔ عُبِدَ</button>
                <button class="gv-btn gv-btn-blue" style="padding: 3px 8px; font-size: 0.72rem;" id="s7l8-v-nasar">نَصَرَ ➔ نُصِرَ</button>
                <button class="gv-btn" style="background:#5a8249; padding: 3px 8px; font-size: 0.72rem;" id="s7l8-v-khalaq">خَلَقَ ➔ خُلِقَ</button>
              </div>
            </div>
            <div class="gv-status-bar" id="s7l8-status">
              Qaidah: <span style="color: #881337;">Pehle harf par Pesh ( ُ ) aur doosre par Zer ( ِ ) se Majhool banta hai</span>
            </div>
          </div>
        </div>
      `;

      let isPassive = false;
      let curVerbKey = 'abad';
      const verbs = {
        abad: {
          active: { c1: 'عَـ', c2: 'بَـ', c3: 'دَ', sub: 'Usne ibadat ki (He worshipped)', tag: "Ma'roof (Active)" },
          passive: { c1: 'عُـ', c2: 'بِـ', c3: 'دَ', sub: 'Uski ibadat ki gayi (He was worshipped)', tag: "Majhool (Passive)" }
        },
        nasar: {
          active: { c1: 'نَـ', c2: 'صَـ', c3: 'رَ', sub: 'Usne madad ki (He helped)', tag: "Ma'roof (Active)" },
          passive: { c1: 'نُـ', c2: 'صِـ', c3: 'رَ', sub: 'Uski madad ki gayi (He was helped)', tag: "Majhool (Passive)" }
        },
        khalaq: {
          active: { c1: 'خَـ', c2: 'لَـ', c3: 'قَ', sub: 'Usne paida kiya (He created)', tag: "Ma'roof (Active)" },
          passive: { c1: 'خُـ', c2: 'لِـ', c3: 'قَ', sub: 'Woh paida kiya gaya (He was created)', tag: "Majhool (Passive)" }
        }
      };

      const c1 = document.getElementById('s7l8-c1');
      const c2 = document.getElementById('s7l8-c2');
      const c3 = document.getElementById('s7l8-c3');
      const sub = document.getElementById('s7l8-sub');
      const tag = document.getElementById('s7l8-voice-tag');
      const btnMorph = document.getElementById('s7l8-btn-morph');
      const area = container.querySelector('.s7l8-area');

      function renderMorph() {
        const vData = isPassive ? verbs[curVerbKey].passive : verbs[curVerbKey].active;
        particleBurst(c1, area);
        c1.textContent = vData.c1;
        c2.textContent = vData.c2;
        c3.textContent = vData.c3;
        sub.innerHTML = isPassive ? `<span style="color:#881337; font-weight:700;">${vData.sub}</span>` : vData.sub;
        tag.textContent = vData.tag;
        tag.style.background = isPassive ? '#fcebeb' : '#eef3fa';
        tag.style.color = isPassive ? '#881337' : '#3d6ca3';
        btnMorph.textContent = isPassive ? "Revert to Ma'roof (Active)" : "Transform to Majhool (Passive)";
      }

      btnMorph.onclick = () => {
        isPassive = !isPassive;
        AudioFX.play(isPassive ? 'whoosh' : 'pop');
        renderMorph();
      };

      container.querySelector('#s7l8-v-abad').onclick = () => { curVerbKey = 'abad'; isPassive = false; renderMorph(); };
      container.querySelector('#s7l8-v-nasar').onclick = () => { curVerbKey = 'nasar'; isPassive = false; renderMorph(); };
      container.querySelector('#s7l8-v-khalaq').onclick = () => { curVerbKey = 'khalaq'; isPassive = false; renderMorph(); };
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
      } else if (key.startsWith('s6') && Registry['s6l1']) {
        Registry['s6l1'](container);
      } else if (key.startsWith('s5') && Registry['s5l1']) {
        Registry['s5l1'](container);
      } else if (key.startsWith('s7') && Registry['s7l8']) {
        Registry['s7l8'](container);
      } else if (key.startsWith('s4') && Registry['s4l1']) {
        Registry['s4l1'](container);
      } else if (key.startsWith('s3') && Registry['s3l4']) {
        Registry['s3l4'](container);
      } else if (key.startsWith('s2') && Registry['s2l3']) {
        Registry['s2l3'](container);
      } else if (key.startsWith('s1') && Registry['s1l1']) {
        Registry['s1l1'](container);
      } else {
        genericVisual(key, container);
      }
      attachVisualInteractions(container);
    },
    has(lessonKey) {
      return true; // All lessons have either explicit or stage-based interactive models
    }
  };
})();
