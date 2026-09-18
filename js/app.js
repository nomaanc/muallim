var bookData = { stages: {} };
var metadata = null;

async function loadMetadata() {
  var res = await fetch('data/metadata.json');
  metadata = await res.json();
  return metadata;
}

async function loadUnit(unitNumber) {
  var key = 'Stage' + unitNumber;
  if (bookData.stages[key]) return bookData.stages[key];
  var res = await fetch('data/unit' + unitNumber + '.json');
  var data = await res.json();
  bookData.stages[key] = data.lessons;
  return data.lessons;
}

var App = (function() {
      const App = {};

      // ── Safe LocalStorage Wrappers ──
      function lsGet(key, fallback) {
        try {
          const val = localStorage.getItem(key);
          return val !== null ? val : (fallback !== undefined ? fallback : null);
        } catch(e) {
          return fallback !== undefined ? fallback : null;
        }
      }
      function lsSet(key, val) {
        try { localStorage.setItem(key, val); } catch(e) {}
      }
      function lsRemove(key) {
        try { localStorage.removeItem(key); } catch(e) {}
      }

      let currentStage = 1;
      let currentLesson = 1;
      let audioSpeed = parseFloat(lsGet('muallim_audio_speed', '1.0') || '1.0');
      let favourites = [];
      try { favourites = JSON.parse(lsGet('muallim_favs', '[]') || '[]'); } catch(e) { favourites = []; }
      let customAnswers = {};
      try { customAnswers = JSON.parse(lsGet('muallim_custom_answers', '{}') || '{}'); } catch(e) { customAnswers = {}; }
      let activeEditKey = null;
      let spinnerMode = 'starred'; // 'starred' or 'lesson'
      let spinnerPool = [];
      let spinnerIndex = 0;
      let isSpinnerRevealed = false;

      function init() {
        setupEventListeners();
        setAudioSpeed(audioSpeed, false);
        // Auto-resume bookmark on every app open
        var _bmAutoRaw = null;
        try { _bmAutoRaw = localStorage.getItem('muallim_bookmark'); } catch(e) {}
        var _bmLoaded = false;
        if (_bmAutoRaw) {
          try {
            var _bmAuto = JSON.parse(_bmAutoRaw);
            if (_bmAuto && _bmAuto.stage && _bmAuto.lesson) {
              loadLesson(_bmAuto.stage, _bmAuto.lesson);
              _bmLoaded = true;
            }
          } catch(e) {}
        }
        if (!_bmLoaded) loadLesson(1, 1);
        populateStageTabs();
        updateStarredCountBadge();
        if (typeof debouncedSync === "function") debouncedSync();
      }

      function setupEventListeners() {
        document.getElementById('btn-lesson-picker').addEventListener('click', () => {
          document.getElementById('lesson-picker-modal').showModal();
        });
        var _bs = document.getElementById('btn-open-search'); if(_bs) _bs.addEventListener('click', openSearchModal);
        var _bsp = document.getElementById('btn-open-spinner'); if(_bsp) _bsp.addEventListener('click', function() {
          // Reset drill to setup view
          const sv = document.getElementById('drill-setup-view');
          const cv = document.getElementById('drill-card-view');
          if (sv) sv.style.display = 'block';
          if (cv) cv.style.display = 'none';
          const ts = document.getElementById('drill-tab-starred');
          const tc = document.getElementById('drill-tab-custom');
          const sp = document.getElementById('drill-starred-panel');
          const cp = document.getElementById('drill-custom-panel');
          if (ts) ts.classList.add('active');
          if (tc) tc.classList.remove('active');
          if (sp) sp.style.display = 'block';
          if (cp) cp.style.display = 'none';
          document.getElementById('spinner-modal').showModal();
        });
        var _bf = document.getElementById('btn-open-favs'); if(_bf) _bf.addEventListener('click', openFavourites);
      }

      function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('muallim_theme', theme);
        document.getElementById('theme-light-btn').classList.toggle('selected', theme === 'light');
        document.getElementById('theme-dark-btn').classList.toggle('selected', theme === 'dark');
      }

      function setMode(mode) {
        document.documentElement.setAttribute('data-mode', mode);
        localStorage.setItem('muallim_mode', mode);
        document.getElementById('mode-teacher-btn').classList.toggle('selected', mode === 'teacher');
        document.getElementById('mode-student-btn').classList.toggle('selected', mode === 'student');
      }

      function setFontSize(type, val) {
        if (type === 'arabic') {
          document.documentElement.style.setProperty('--arabic-scale', val + 'px');
          localStorage.setItem('muallim_ar_scale', val);
        }
      }

      function setAudioSpeed(val, save = true) {
        audioSpeed = parseFloat(val);
        const slider = document.getElementById('speech-rate-slider');
        if (slider) slider.value = audioSpeed;
        const lbl = document.getElementById('speed-val-label');
        if (lbl) lbl.textContent = audioSpeed.toFixed(2) + 'x';
        if (save) {
          lsSet('muallim_audio_speed', audioSpeed.toString());
        }
      }

      function speakArabic(text) {
        if (!('speechSynthesis' in window)) { showToast('Audio not supported on this browser'); return; }
        try {
          window.speechSynthesis.cancel();
          const clean = text.replace(/[﴿﴾]/g, '');
          const utter = new SpeechSynthesisUtterance(clean);
          utter.lang = 'ar-SA';
          utter.rate = audioSpeed;
          utter.onerror = () => showToast('Audio unavailable — tap again to retry');
          window.speechSynthesis.speak(utter);
        } catch(e) {
          showToast('Audio error: ' + e.message);
        }
      }

      function toggleStarInPlace(btnElement, itemKey, arabic, defaultHinglish) {
        const idx = favourites.findIndex(f => f.key === itemKey);
        if (idx >= 0) {
          favourites.splice(idx, 1);
          if (btnElement) btnElement.classList.remove('starred');
        } else {
          favourites.push({ key: itemKey, arabic, hinglish: defaultHinglish, stage: currentStage, lesson: currentLesson });
          if (btnElement) btnElement.classList.add('starred');
        }
        localStorage.setItem('muallim_favs', JSON.stringify(favourites));
        updateStarredCountBadge();
      }

      function isStarred(itemKey) {
        return favourites.some(f => f.key === itemKey);
      }

      function updateStarredCountBadge() {
        const badge = document.getElementById('starred-count-badge');
        if (badge) badge.textContent = favourites.length;
      }

      function openCustomEditor(itemKey, arabic, originalHinglish) {
        activeEditKey = itemKey;
        const eAr = document.getElementById('edit-arabic-preview');
        if (eAr) eAr.textContent = arabic;
        const eOrig = document.getElementById('edit-orig-preview');
        if (eOrig) eOrig.textContent = originalHinglish;
        const cInp = document.getElementById('custom-answer-input');
        if (cInp) cInp.value = customAnswers[itemKey] || '';
        const modal = document.getElementById('custom-edit-modal');
        if (modal && modal.showModal) modal.showModal();
      }

      function saveCustomAnswer() {
        if (!activeEditKey) return;
        const cInp = document.getElementById('custom-answer-input');
        if (!cInp) return;
        const val = cInp.value.trim();
        if (val) {
          customAnswers[activeEditKey] = val;
        } else {
          delete customAnswers[activeEditKey];
        }
        lsSet('muallim_custom_answers', JSON.stringify(customAnswers));
        const modal = document.getElementById('custom-edit-modal');
        if (modal && modal.close) modal.close();
        renderCurrentLesson();
        if (typeof debouncedSync === 'function') debouncedSync(500);
      }

      function deleteCustomAnswer() {
        if (!activeEditKey) return;
        delete customAnswers[activeEditKey];
        lsSet('muallim_custom_answers', JSON.stringify(customAnswers));
        const modal = document.getElementById('custom-edit-modal');
        if (modal && modal.close) modal.close();
        renderCurrentLesson();
        if (typeof debouncedSync === 'function') debouncedSync(500);
      }

      function loadLesson(stageId, lessonId) {
        currentStage = stageId;
        currentLesson = lessonId;
        loadBookmark();
        renderCurrentLesson();
        document.getElementById('current-lesson-label').textContent = `Unit ${stageId} Lesson ${lessonId}`;
        document.title = `Muallim ul-Qur'an — Unit ${stageId} Lesson ${lessonId}`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      function renderDualAnswerHtml(itemKey, itArabic, origHinglish) {
        const customVal = customAnswers[itemKey];
        const hasCustom = !!customVal;
        const escAr = itArabic.replace(/'/g, "\\'");
        const escHi = (origHinglish || '').replace(/'/g, "\\'");

        let rowsHtml = `<div class="answer-row orig-text">${origHinglish || ''}</div>`;
        if (hasCustom) {
          rowsHtml += `
            <div class="answer-row custom-text">
              <span class="custom-badge">custom</span> ${customVal}
            </div>
          `;
        }

        return `
          <div class="hinglish-wrapper">
            <div class="hinglish-text student-blank teacher-fill" onclick="this.classList.toggle('revealed')">
              ${rowsHtml}
            </div>
            <button class="pencil-btn" title="Edit personal translation" onclick="App.openCustomEditor('${itemKey}', '${escAr}', '${escHi}')">✏️</button>
          </div>
        `;
      }

      function renderCurrentLesson() {
        const stageKey = `Stage${currentStage}`;
        const stageData = bookData.stages[stageKey] || [];
        const lesson = stageData.find(l => l.lesson_id === currentLesson) || stageData[0];

        const mount = document.getElementById('lesson-content-mount');
        if (!lesson) {
          if (mount) mount.innerHTML = '<p>Lesson data not found.</p>';
          return;
        }

        let html = `
          <div class="lesson-banner">
            <div class="lesson-banner-title">${lesson.title}</div>
            <div class="lesson-banner-meta">Unit ${currentStage} • Page ${lesson.page_start || 1}</div>
          </div>
        `;

        (lesson.sections || []).forEach((sec, sIdx) => {
          const secType = sec.type;
          // Skip exercise sections entirely per user request
          if (secType === 'exercise_header' || secType === 'exercise_verses' || 
              secType === 'exercise_fill_blank' || secType === 'exercise_mcq' ||
              (sec.data && sec.data.q_number && String(sec.data.q_number).match(/^(Exercise|QQ)/i))) {
            return;
          }
          const d = sec.data || {};

          if (secType === 'hero_header') {
            const heroAr = d.arabic_combined || d.after_arabic || d.arabic_after || d.transformed_word || d.arabic || d.title_ar || d.arabic_word || d.before_arabic || d.arabic_before || d.word || '';
            const heroHi = d.hinglish_combined || d.after_hinglish || d.hinglish_after || d.transformed_meaning || d.hinglish || d.title_en || d.hinglish_word || d.before_hinglish || d.hinglish_before || d.meaning || d.subtitle || '';
            if (heroAr || heroHi) {
              html += `
                <div class="hero-section">
                  ${heroAr ? `<div class="hero-arabic">${heroAr}</div>` : ''}
                  ${heroHi ? `<div class="hero-hinglish">${heroHi}</div>` : ''}
                </div>
              `;
            }
          } else if (secType === 'rule_paragraph') {
            html += `<div class="rule-card">${d.text}</div>`;
          } else if (secType === 'grace_box') {
            html += `<div class="grace-card">✨ ${d.text}</div>`;
          } else if (secType === 'grid' || secType === 'three_col_list' || secType === 'waw_grid') {
            const cols = d.columns || 3;
            html += `<div class="bidi-grid cols-${cols}">`;
            (d.items || []).forEach((it, iIdx) => {
              const itemKey = `S${currentStage}L${currentLesson}_s${sIdx}_${iIdx}`;
              const starred = isStarred(itemKey);
              const escAr = (it.arabic || '').replace(/'/g, "\\'");
              const escHi = (it.hinglish || '').replace(/'/g, "\\'");
              html += `
                <div class="vocab-card">
                  <div class="card-top" data-item-id="${itemKey}">
                    <button class="card-action-btn" onclick="App.speakArabic('${escAr}')">🔊</button>
                    <button class="card-action-btn ${starred ? 'starred' : ''}" onclick="App.toggleStarInPlace(this, '${itemKey}', '${escAr}', '${escHi}')">★</button>
                    ${bmSvgHtml(itemKey)}
                  </div>
                  <div class="arabic-text" style="overflow-wrap:break-word;">${it.arabic}</div>
                  ${renderDualAnswerHtml(itemKey, it.arabic, it.hinglish)}
                </div>
              `;
            });
            html += `</div>`;
          } else if (secType === 'two_col_numbered_list') {
            html += `<div class="bidi-grid cols-2">`;
            (d.items || []).forEach((it, iIdx) => {
              const itemKey = `S${currentStage}L${currentLesson}_num_${it.id || iIdx}`;
              const starred = isStarred(itemKey);
              const escAr = (it.arabic || '').replace(/'/g, "\\'");
              const escHi = (it.hinglish || '').replace(/'/g, "\\'");
              html += `
                <div class="vocab-card" style="${it.full_width ? 'grid-column: 1 / -1;' : ''}">
                  <div class="card-top" data-item-id="${itemKey}">
                    ${it.id ? `<span class="card-number">${iIdx + 1}</span>` : ''}
                    <button class="card-action-btn" onclick="App.speakArabic('${escAr}')">🔊</button>
                    <button class="card-action-btn ${starred ? 'starred' : ''}" onclick="App.toggleStarInPlace(this, '${itemKey}', '${escAr}', '${escHi}')">★</button>
                    ${bmSvgHtml(itemKey)}
                  </div>
                  <div class="arabic-text">${it.arabic}</div>
                  ${renderDualAnswerHtml(itemKey, it.arabic, it.hinglish)}
                </div>
              `;
            });
            html += `</div>`;
          } else if (secType === 'exercise_header') {
            html += `<div class="section-exercise-divider"><span>Exercise</span></div>`;
          } else if (secType === 'verse_block' || secType === 'exercise_verses') {
            html += `<div class="bidi-grid cols-1">`;
            const verses = d.verses || d.items || [];
            verses.forEach((v, vIdx) => {
              const itemKey = `S${currentStage}L${currentLesson}_v_${vIdx}`;
              const starred = isStarred(itemKey);
              const escAr = (v.arabic || '').replace(/'/g, "\\'");
              const escHi = (v.hinglish || '').replace(/'/g, "\\'");
              html += `
                <div class="verse-card">
                  <div class="card-top">
                    <button class="card-action-btn" onclick="App.speakArabic('${escAr}')">🔊</button>
                    <button class="card-action-btn ${starred ? 'starred' : ''}" onclick="App.toggleStarInPlace(this, '${itemKey}', '${escAr}', '${escHi}')">★</button>
                    ${bmSvgHtml(itemKey)}
                  </div>
                  <div class="arabic-text" style="font-size:calc(var(--arabic-scale)*1.1);">${v.arabic}</div>
                  ${v.hinglish ? renderDualAnswerHtml(itemKey, v.arabic, v.hinglish) : ''}
                </div>
              `;
            });
            html += `</div>`;
          } else if (secType === 'section_label') {
            html += `<div class="section-label-divider"><span>${d.text || ''}</span></div>`;

          } else if (secType === 'qn_label') {
            const qNum = d.q_number ? `<span class="qn-number">Q${d.q_number}.</span>` : '';
            html += `<div class="qn-label-card">${qNum}<span class="qn-instruction">${d.instruction || d.text || ''}</span></div>`;

          } else if (secType === 'bullet_instruction') {
            html += `<div class="bullet-instruction"><span class="bullet-dot">&#8226;</span><span>${d.text || ''}</span></div>`;

          } else if (secType === 'example_table') {
            const exItems = d.examples || d.items || [];
            if (exItems.length > 0) {
              html += '<div class="example-table">';
              exItems.forEach(function(ex, eIdx) {
                const itemKey = 'S'+currentStage+'L'+currentLesson+'_ex'+sIdx+'_'+eIdx;
                const starredEx = isStarred(itemKey);
                const escArEx = (ex.arabic || '').replace(/'/g, "\'");
                const escHiEx = (ex.hinglish || '').replace(/'/g, "\'");
                html += '<div class="vocab-card example-row"><div class="card-top">' +
                  '<button class="card-action-btn" onclick="App.speakArabic(\'' + escArEx + '\')">&#128362;</button>' +
                  '<button class="card-action-btn ' + (starredEx ? 'starred' : '') + '" onclick="App.toggleStarInPlace(this,\'' + itemKey + '\',\'' + escArEx + '\',\'' + escHiEx + '\')">&#9733;</button>' +
                  '</div><div class="arabic-text">' + (ex.arabic || '') + '</div>' +
                  (ex.hinglish ? renderDualAnswerHtml(itemKey, ex.arabic, ex.hinglish) : '') +
                  '</div>';
              });
              html += '</div>';
            }

          } else if (secType === 'spacer') {
            html += '<div style="height:' + Math.min(d.height_mm || 8, 20) + 'px"></div>';
          } else if (secType === 'horizontal_rule') {
            html += '<hr style="margin:14px 0; border:none; border-top:1px solid var(--border,#e5e7eb);" />';

          } else if (secType === 'tashbeeh_grid' || secType === 'ayah_pause_block') {
            const tbItems = d.items || [];
            if (tbItems.length > 0) {
              html += '<div class="bidi-grid cols-2">';
              tbItems.forEach(function(it, iIdx) {
                const itemKey = 'S'+currentStage+'L'+currentLesson+'_tb'+sIdx+'_'+iIdx;
                const starredTb = isStarred(itemKey);
                const escArTb = (it.arabic || '').replace(/'/g, "\'");
                const escHiTb = (it.hinglish || '').replace(/'/g, "\'");
                html += '<div class="vocab-card"><div class="card-top">' +
                  '<button class="card-action-btn" onclick="App.speakArabic(\'' + escArTb + '\')">&#128362;</button>' +
                  '<button class="card-action-btn ' + (starredTb ? 'starred' : '') + '" onclick="App.toggleStarInPlace(this,\'' + itemKey + '\',\'' + escArTb + '\',\'' + escHiTb + '\')">&#9733;</button>' +
                  '</div><div class="arabic-text">' + (it.arabic || '') + '</div>' +
                  (it.hinglish ? renderDualAnswerHtml(itemKey, it.arabic, it.hinglish) : '') +
                  '</div>';
              });
              html += '</div>';
            }
          } // end tashbeeh_grid / ayah_pause_block
        });

        if (mount) mount.innerHTML = html;
        renderBottomNavigation();
        scrollToBookmark();
      }

      function renderBottomNavigation() {
        const hasPrev = !(currentStage === 1 && currentLesson === 1);
        const currentStageKey = `Stage${currentStage}`;
        const currentLessons = bookData.stages[currentStageKey] || [];
        const hasNext = !(currentStage === 7 && currentLesson === currentLessons.length);

        let bottomHtml = `
          <div class="bottom-nav-card">
            <button class="nav-step-btn" ${!hasPrev ? 'disabled' : ''} onclick="App.navigatePrevLesson()">
              ← Previous Lesson
            </button>
            <button class="nav-step-btn" ${!hasNext ? 'disabled' : ''} onclick="App.navigateNextLesson()">
              Next Lesson →
            </button>
          </div>
        `;
        const bNav = document.getElementById('bottom-nav-mount');
        if (bNav) bNav.innerHTML = bottomHtml;
      }

      function populateStageTabs() {
        let tabsHtml = '';
        for (let s = 1; s <= 7; s++) {
          tabsHtml += `<button class="stage-tab ${s === currentStage ? 'active' : ''}" onclick="App.selectPickerStage(${s})">Unit ${s}</button>`;
        }
        const stm = document.getElementById('stage-tabs-mount'); if (stm) stm.innerHTML = tabsHtml;
        populateStageLessons(currentStage);
      }

      function selectPickerStage(stageNum) {
        document.querySelectorAll('.stage-tab').forEach((tab, idx) => {
          tab.classList.toggle('active', (idx + 1) === stageNum);
        });
        populateStageLessons(stageNum);
      }

      function populateStageLessons(stageNum) {
        const stageKey = `Stage${stageNum}`;
        const lessons = bookData.stages[stageKey] || [];
        let lessonsHtml = '';
        lessons.forEach(l => {
          const isAct = (stageNum === currentStage && l.lesson_id === currentLesson);
          lessonsHtml += `<button class="lesson-chip ${isAct ? 'active' : ''}" onclick="App.pickLesson(${stageNum}, ${l.lesson_id})">${l.lesson_id}</button>`;
        });
        const slm = document.getElementById('stage-lessons-mount'); if (slm) slm.innerHTML = lessonsHtml;
      }

      function pickLesson(stageNum, lessonId) {
        loadLesson(stageNum, lessonId);
        document.getElementById('lesson-picker-modal').close();
      }

      function navigatePrevLesson() {
        if (currentLesson > 1) {
          loadLesson(currentStage, currentLesson - 1);
        } else if (currentStage > 1) {
          const prevStageKey = `Stage${currentStage - 1}`;
          const prevLessons = bookData.stages[prevStageKey] || [];
          loadLesson(currentStage - 1, prevLessons.length);
        }
      }

      function navigateNextLesson() {
        const currentStageKey = `Stage${currentStage}`;
        const currentLessons = bookData.stages[currentStageKey] || [];
        if (currentLesson < currentLessons.length) {
          loadLesson(currentStage, currentLesson + 1);
        } else if (currentStage < 7) {
          loadLesson(currentStage + 1, 1);
        }
      }

      function openSpinner() {
        setSpinnerPool(spinnerMode);
        document.getElementById('spinner-modal').showModal();
      }

      function setSpinnerPool(mode) {
        spinnerMode = mode;
        const starTab = document.getElementById('pool-starred-btn') || document.getElementById('drill-tab-starred'); if (starTab) starTab.classList.toggle('selected', mode === 'starred');
        const lsnTab = document.getElementById('pool-lesson-btn') || document.getElementById('drill-tab-custom'); if (lsnTab) lsnTab.classList.toggle('selected', mode === 'lesson');

        spinnerPool = [];
        if (mode === 'starred') {
          favourites.forEach(f => {
            const customVal = customAnswers[f.key];
            spinnerPool.push({
              arabic: f.arabic,
              origHinglish: f.hinglish,
              customHinglish: customVal || '',
              key: f.key
            });
          });
        } else {
          const stageKey = `Stage${currentStage}`;
          const stageData = bookData.stages[stageKey] || [];
          const lesson = stageData.find(l => l.lesson_id === currentLesson) || stageData[0];
          if (lesson) {
            (lesson.sections || []).forEach((sec, sIdx) => {
              const items = (sec.data && sec.data.items) || [];
              items.forEach((it, iIdx) => {
                if (it.arabic && it.hinglish && !it.arabic.includes('----')) {
                  const itemKey = `S${currentStage}L${currentLesson}_s${sIdx}_${iIdx}`;
                  const customVal = customAnswers[itemKey];
                  spinnerPool.push({
                    arabic: it.arabic,
                    origHinglish: it.hinglish,
                    customHinglish: customVal || '',
                    key: itemKey
                  });
                }
              });
            });
          }
        }

        // Shuffle pool
        for (let i = spinnerPool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [spinnerPool[i], spinnerPool[j]] = [spinnerPool[j], spinnerPool[i]];
        }
        spinnerIndex = 0;
        showSpinnerCard();
      }

      function showSpinnerCard() {
        const sAr = document.getElementById('spinner-arabic');
        const sHi = document.getElementById('spinner-hinglish');
        const sHint = document.getElementById('spinner-hint');
        if (spinnerPool.length === 0) {
          if (sAr) sAr.textContent = spinnerMode === 'starred' ? 'No Starred Items Yet' : 'No Items in Current Lesson';
          if (sHi) {
            sHi.innerHTML = spinnerMode === 'starred' ? 'Tap ★ on any word to star it!' : '';
            sHi.style.display = 'block';
          }
          if (sHint) sHint.style.display = 'none';
          return;
        }
        const it = spinnerPool[spinnerIndex];
        if (sAr) sAr.textContent = it.arabic;

        let displayHtml = `<div style="color:var(--fill-teacher);">${it.origHinglish}</div>`;
        if (it.customHinglish) {
          displayHtml += `<div style="color:var(--custom-fill); margin-top:4px;"><span class="custom-badge">custom</span> ${it.customHinglish}</div>`;
        }
        if (sHi) {
          sHi.innerHTML = displayHtml;
          sHi.style.display = 'none';
        }
        if (sHint) sHint.style.display = 'block';
        isSpinnerRevealed = false;
      }

      function toggleSpinnerReveal() {
        if (spinnerPool.length === 0) return;
        isSpinnerRevealed = !isSpinnerRevealed;
        const sHi = document.getElementById('spinner-hinglish');
        const sHint = document.getElementById('spinner-hint');
        if (sHi) sHi.style.display = isSpinnerRevealed ? 'block' : 'none';
        if (sHint) sHint.style.display = isSpinnerRevealed ? 'none' : 'block';
      }

      function nextSpinnerCard() {
        if (spinnerPool.length === 0) return;
        spinnerIndex = (spinnerIndex + 1) % spinnerPool.length;
        showSpinnerCard();
      }

      function playCurrentSpinnerAudio() {
        if (spinnerPool.length > 0) {
          speakArabic(spinnerPool[spinnerIndex].arabic);
        }
      }

      
    function openCustomAnswersModal() {
      closeSidebar();
      const modal = document.getElementById('custom-answers-modal');
      const body = document.getElementById('custom-answers-body');
      let customAnswers = {};
      try {
        customAnswers = JSON.parse(localStorage.getItem('muallim_custom_answers') || '{}');
      } catch(e) {}
      
      let html = '';
      const keys = Object.keys(customAnswers);
      if (keys.length === 0) {
        html = '<div style="text-align:center; color:#666; padding:20px;">No custom answers yet.</div>';
      } else {
        const groups = {};
        keys.forEach(k => {
          const m = k.match(/^S(\d+)L(\d+)/);
          if (m) {
            const groupKey = `Unit ${m[1]} • Lesson ${m[2]}`;
            if (!groups[groupKey]) groups[groupKey] = [];
            groups[groupKey].push({ key: k, answer: customAnswers[k], stage: m[1], lesson: m[2] });
          }
        });
        
        for (const [gName, items] of Object.entries(groups)) {
          html += `<div style="font-weight:bold; margin-top:16px; margin-bottom:8px; border-bottom:1px solid #eee; padding-bottom:4px;">📝 ${gName} <span style="color:#888; font-size:0.85em;">(${items.length})</span></div>`;
          items.forEach(item => {
            let originalAr = '';
            let originalHi = '';
            
            // Lookup original text
            try {
              const stageData = bookData.stages[`stage_${item.stage}`];
              if (stageData) {
                const lessonData = stageData.find(l => l.lesson_number == item.lesson);
                if (lessonData && lessonData.sections) {
                  for (const sec of lessonData.sections) {
                    if (sec.items) {
                      const found = sec.items.find(i => i.id == item.key.split('_num_')[1] || `${item.key.split('_')[0]}_num_${i.id}` === item.key);
                      if (found) {
                        originalAr = found.arabic || '';
                        originalHi = found.hinglish || '';
                        break;
                      }
                    }
                  }
                }
              }
            } catch(e) {}
            
            html += `
              <div style="background:#f9f9f9; padding:12px; border-radius:8px; margin-bottom:12px; border:1px solid #e0e0e0;">
                <div style="font-size:1.1rem; color:#1B4332; margin-bottom:6px; font-weight:bold; text-align:right; font-family:'Amiri', serif;">${originalAr}</div>
                <div style="font-size:0.9rem; color:#666; margin-bottom:6px; font-style:italic;">Original: ${originalHi}</div>
                <div style="font-size:0.95rem; color:#0ea5e9; font-weight:500;">Custom: ${item.answer}</div>
              </div>
            `;
          });
        }
      }
      body.innerHTML = html;
      modal.showModal();
    }
    
    function closeCustomAnswersModal() {
      document.getElementById('custom-answers-modal').close();
    }

    function openFavourites() {
        let favsHtml = '';
        if (favourites.length === 0) {
          favsHtml = '<p style="text-align:center; color:var(--text-muted); padding:20px;">Abhi koi starred item nahi hai. Kisi bhi card par ★ tap karein!</p>';
        } else {
          // Group by stage+lesson, sort groups ascending
          const groups = {};
          favourites.forEach(f => {
            const gk = `${f.stage}_${f.lesson}`;
            if (!groups[gk]) groups[gk] = { stage: f.stage, lesson: f.lesson, items: [] };
            groups[gk].items.push(f);
          });
          const sortedGroups = Object.values(groups).sort((a, b) =>
            a.stage !== b.stage ? a.stage - b.stage : a.lesson - b.lesson
          );
          favsHtml = '';
          sortedGroups.forEach(group => {
            favsHtml += `<div class="starred-group-header">⭐ Unit ${group.stage} &bull; Lesson ${group.lesson} <span class="starred-count">(${group.items.length})</span></div>`;
            favsHtml += '<div class="bidi-grid cols-1">';
            group.items.forEach(f => {
              const escAr = (f.arabic || '').replace(/'/g, "\\'");
              const escHi = (f.hinglish || '').replace(/'/g, "\\'");
              favsHtml += `
                <div class="vocab-card">
                  <div class="card-top">
                    <div class="card-actions">
                      <button class="card-action-btn" onclick="App.speakArabic('${escAr}')">🔊</button>
                      <button class="card-action-btn starred" onclick="App.toggleStarInPlace(this, '${f.key}', '${escAr}', '${escHi}'); App.openFavourites();">★</button>
                    </div>
                  </div>
                  <div class="arabic-text">${f.arabic}</div>
                  ${renderDualAnswerHtml(f.key, f.arabic, f.hinglish)}
                </div>
              `;
            });
            favsHtml += '</div>';
          });
        }
        document.getElementById('favs-list-mount').innerHTML = favsHtml;
        document.getElementById('favs-modal').showModal();
      }

      function openSearchModal() {
        document.getElementById('search-modal').showModal();
        setTimeout(() => document.getElementById('search-input').focus(), 100);
      }

      function performSearch(query) {
        const q = query.trim().toLowerCase();
        const resultsMount = document.getElementById('search-results-mount');
        if (q.length < 2) {
          resultsMount.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:20px;">Type at least 2 characters to search all 114 lessons.</p>';
          return;
        }

        const results = [];
        for (let s = 1; s <= 7; s++) {
          const stageKey = `Stage${s}`;
          const lessons = bookData.stages[stageKey] || [];
          lessons.forEach(l => {
            (l.sections || []).forEach(sec => {
              const items = (sec.data && sec.data.items) || [];
              items.forEach(it => {
                if (it.arabic && it.hinglish) {
                  const arMatch = it.arabic.includes(q);
                  const hiMatch = it.hinglish.toLowerCase().includes(q);
                  if (arMatch || hiMatch) {
                    results.push({
                      stage: s,
                      lesson: l.lesson_id,
                      arabic: it.arabic,
                      hinglish: it.hinglish
                    });
                  }
                }
              });
            });
          });
        }

        if (results.length === 0) {
          resultsMount.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:20px;">No results found for "${query}".</p>`;
          return;
        }

        let out = '';
        results.slice(0, 50).forEach(r => {
          out += `
            <div class="search-result-item" onclick="App.jumpToSearchLesson(${r.stage}, ${r.lesson})">
              <div>
                <span style="font-size:0.75rem; color:var(--accent-emerald); font-weight:700;">Unit ${r.stage} Lesson ${r.lesson}</span>
                <div style="font-family:var(--font-arabic); font-size:1.1rem; color:var(--text-primary);">${r.arabic}</div>
                <div style="font-size:0.85rem; color:var(--text-secondary);">${r.hinglish}</div>
              </div>
              <span style="color:var(--divider-gold); font-size:1.2rem;">→</span>
            </div>
          `;
        });
        if (results.length > 50) {
          out += `<p style="text-align:center; color:var(--text-muted); padding:10px; font-size:0.8rem;">Showing first 50 of ${results.length} results.</p>`;
        }
        resultsMount.innerHTML = out;
      }

      function jumpToSearchLesson(stageNum, lessonId) {
        document.getElementById('search-modal').close();
        loadLesson(stageNum, lessonId);
      }

      function openExportDialog() {
        document.getElementById('export-favs-count').textContent = favourites.length;
        document.getElementById('export-custom-count').textContent = Object.keys(customAnswers).length;
        document.getElementById('export-modal').showModal();
      }

      function doExport(mode) {
        document.getElementById('export-modal').close();
        const payload = {
          version: "4.5-ultimate",
          exported_at: new Date().toISOString(),
          mode: mode
        };

        if (mode === 'both' || mode === 'favs') {
          // Enrich favourites with custom answers if present
          payload.favourites = favourites.map(f => ({
            ...f,
            custom_answer: customAnswers[f.key] || null
          }));
        }

        if (mode === 'both' || mode === 'custom') {
          payload.customAnswers = customAnswers;
        }

        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `muallim_backup_${mode}.json`;
        a.click();
      }

      function importDataBackup(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
          try {
            const imported = JSON.parse(e.target.result);
            let favCount = 0;
            let customCount = 0;

            if (imported.favourites && Array.isArray(imported.favourites)) {
              // Merge favourites
              imported.favourites.forEach(newFav => {
                if (newFav.key && !favourites.some(f => f.key === newFav.key)) {
                  favourites.push({
                    key: newFav.key,
                    arabic: newFav.arabic || '',
                    hinglish: newFav.hinglish || '',
                    stage: newFav.stage || 1,
                    lesson: newFav.lesson || 1
                  });
                  favCount++;
                }
                if (newFav.key && newFav.custom_answer) {
                  customAnswers[newFav.key] = newFav.custom_answer;
                  customCount++;
                }
              });
              localStorage.setItem('muallim_favs', JSON.stringify(favourites));
            }

            if (imported.customAnswers && typeof imported.customAnswers === 'object') {
              Object.keys(imported.customAnswers).forEach(k => {
                customAnswers[k] = imported.customAnswers[k];
                customCount++;
              });
            }

            localStorage.setItem('muallim_custom_answers', JSON.stringify(customAnswers));
            updateStarredCountBadge();
            alert(`Backup successfully restored!
- Starred items imported: ${favCount}
- Custom answers imported: ${customCount}`);
            renderCurrentLesson();
          } catch(err) {
            alert('Failed to parse backup JSON file: ' + err.message);
          }
        };
        reader.readAsText(file);
      }


    // ═══════════════════════════════════════════════════════
    // NEW FEATURES JS — appended block
    // ═══════════════════════════════════════════════════════

    // ─── Toast ───────────────────────────────────────────
    function showToast(msg, duration) {
      duration = duration || 2800;
      const t = document.getElementById('app-toast');
      if (!t) return;
      t.textContent = msg;
      t.classList.add('show');
      clearTimeout(t._timer);
      t._timer = setTimeout(() => t.classList.remove('show'), duration);
    }

    // ─── P1: SVG Bookmark ────────────────────────────────
    let _bookmark = null;
    const BM_KEY = 'muallim_bookmark';

    function loadBookmark() {
      try { _bookmark = JSON.parse(localStorage.getItem(BM_KEY)); } catch(e) { _bookmark = null; }
    }

    function saveBookmark(obj) {
      _bookmark = obj;
      localStorage.setItem(BM_KEY, JSON.stringify(obj));
    }

    function clearBookmark() {
      _bookmark = null;
      localStorage.removeItem(BM_KEY);
    }

    function bmSvgHtml(itemId) {
      const isBookmarked = _bookmark && _bookmark.itemId === itemId;
      return `<svg class="bm-icon${isBookmarked ? ' bookmarked' : ''}" data-bm-id="${itemId}"
        viewBox="0 0 24 24" width="18" height="18" aria-label="Bookmark"
        onclick="App.toggleBookmark(this, '${itemId}')">
        <path class="bm-path"
          d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z"/>
      </svg>`;
    }

    App.toggleBookmark = function(svgEl, itemId) {
      if (_bookmark && _bookmark.itemId === itemId) {
        // Clear bookmark
        clearBookmark();
        svgEl.classList.remove('bookmarked');
        svgEl.classList.add('bm-pulse');
        setTimeout(() => svgEl.classList.remove('bm-pulse'), 400);
        showToast('Bookmark removed');
      } else {
        // Clear previous bookmark icon if on page
        document.querySelectorAll('.bm-icon.bookmarked').forEach(el => el.classList.remove('bookmarked'));
        // Set new bookmark
        const card = svgEl.closest('[data-item-id]') || svgEl.closest('.vocab-card') || svgEl.closest('.verse-card');
        const arabic = card ? (card.querySelector('.arabic-text') || {}).textContent || '' : '';
        saveBookmark({
          stage: currentStage,
          lesson: currentLesson,
          itemId: itemId,
          arabic: arabic.trim(),
          savedAt: Date.now()
        });
        svgEl.classList.add('bookmarked', 'bm-pulse');
        setTimeout(() => svgEl.classList.remove('bm-pulse'), 400);
        showToast('🔖 Bookmarked!');
      }
    };

    function scrollToBookmark() {
      if (!_bookmark) return;
      if (_bookmark.stage !== currentStage || _bookmark.lesson !== currentLesson) return;
      setTimeout(() => {
        requestAnimationFrame(() => {
          const card = document.querySelector(`[data-item-id="${_bookmark.itemId}"]`) ||
                       document.querySelector(`[data-item-id="${_bookmark.itemId}"]`);
          if (card) {
            card.closest('.vocab-card, .verse-card')?.classList.add('bookmark-highlight');
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.classList.add('highlight-flash');
            setTimeout(() => card.classList.remove('highlight-flash'), 1800);
          }
        });
      }, 800);
    }

    // ─── P2: Student Name ─────────────────────────────────
    App.saveStudentName = function(name) {
      lsSet('muallim_student_name', name.trim());
      showToast('Name saved ✓');
      if (typeof debouncedSync === 'function') debouncedSync(500);
    };

    function initStudentName() {
      const el = document.getElementById('student-name-input');
      if (el) el.value = localStorage.getItem('muallim_student_name') || '';
    }

    // ─── P2: Install Prompt ───────────────────────────────
    let _deferredInstallPrompt = null;
    window.addEventListener('beforeinstallprompt', function(e) {
      e.preventDefault();
      _deferredInstallPrompt = e;
      const grp = document.getElementById('install-app-group');
      if (grp) grp.style.display = 'block';
    });

    App.promptInstall = async function() {
      if (!_deferredInstallPrompt) { showToast('Already installed or not supported'); return; }
      _deferredInstallPrompt.prompt();
      const { outcome } = await _deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') showToast('App installed! 🎉');
      _deferredInstallPrompt = null;
      const grp = document.getElementById('install-app-group');
      if (grp) grp.style.display = 'none';
    };

    // ─── P2: Push Notifications (FCM stub) ───────────────
    App.enablePushNotifications = async function() {
      if (!('Notification' in window)) {
        showToast('Notifications not supported on this browser');
        return;
      }
      const perm = await Notification.requestPermission();
      const statusEl = document.getElementById('notif-status');
      if (perm === 'granted') {
        if (statusEl) statusEl.textContent = '✅ Notifications enabled';
        showToast('✅ Notifications enabled!');
        // Firebase FCM token would be obtained here after firebase-config.js is loaded
        if (window._FCM_MESSAGING) {
          try {
            const { getToken } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js');
            // Token obtained — would save to Firestore
          } catch(e) { console.warn('FCM not configured', e); }
        }
      } else {
        if (statusEl) statusEl.textContent = '❌ Notifications blocked';
        showToast('Please enable notifications in browser settings');
      }
    };

    // ─── P3: Admin PIN ───────────────────────────────────
    const DEFAULT_PIN_HASH = '3e8e31f04ca91ef08d0e5b3e918c0e5b45ce0a7ca7aca2f06d9b5a9b3c2e4a7c'; // SHA256 of '786' placeholder
    let _adminUnlocked = false;

    async function sha256(str) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
    }

    // ─── Firebase Auth: Login / Logout / Password ───────────────
    App.doLogin = async function() {
      const emailEl = document.getElementById('login-email');
      const passEl  = document.getElementById('login-password');
      const errEl   = document.getElementById('login-error');
      if (!emailEl || !passEl) return;
      const email = emailEl.value.trim();
      const pass  = passEl.value;
      if (!email || !pass) {
        if (errEl) { errEl.textContent = 'Email aur password dono darruri hain'; errEl.style.display = 'block'; }
        return;
      }
      if (!window._FA || !window._AUTH) {
        if (errEl) { errEl.textContent = 'Firebase connect ho raha hai — thodi der mein dobara koshish karein'; errEl.style.display = 'block'; }
        return;
      }
      try {
        if (errEl) errEl.style.display = 'none';
        const submitBtn = document.querySelector('.login-submit');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Logging in…'; }
        await window._FA.signInWithEmailAndPassword(window._AUTH, email, pass);
        // onAuthStateChanged will close the modal
      } catch(e) {
        const msgs = {
          'auth/user-not-found':  'Yeh email registered nahi hai',
          'auth/wrong-password':  'Password ghalat hai',
          'auth/invalid-email':   'Email ka format sahi nahi',
          'auth/too-many-requests': 'Bohot zyada koshishein — kuch der baad try karein',
          'auth/network-request-failed': 'Internet connection check karein',
          'auth/invalid-credential': 'Email ya password ghalat hai',
        };
        if (errEl) {
          errEl.textContent = msgs[e.code] || ('Login error: ' + e.message);
          errEl.style.display = 'block';
        }
        const submitBtn = document.querySelector('.login-submit');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Login'; }
      }
    };

    App.doLogout = async function() {
      if (!window._FA || !window._AUTH) return;
      if (!confirm('Logout karna chahte hain?')) return;
      try {
        await window._FA.signOut(window._AUTH);
        App.currentUser = null;
        showToast('Logged out');
        // onAuthStateChanged will show login modal
      } catch(e) {
        showToast('Logout error: ' + e.message);
      }
    };

    App.forgotPassword = async function() {
      const emailEl = document.getElementById('login-email');
      const email = emailEl ? emailEl.value.trim() : prompt('Apna registered email darj karein:');
      if (!email) return;
      if (!window._FA || !window._AUTH) { showToast('Firebase not ready'); return; }
      try {
        await window._FA.sendPasswordResetEmail(window._AUTH, email);
        showToast('✅ Password reset email bhej di gayi — inbox check karein');
      } catch(e) {
        showToast('Error: ' + e.message);
      }
    };

    App.changePassword = async function() {
      if (!window._AUTH?.currentUser) { showToast('Pehle login karein'); return; }
      const newPw = prompt('Naya password darruj karein (min 8 characters):');
      if (!newPw || newPw.length < 8) { showToast('Password kam az kam 8 characters ka hona chahiye'); return; }
      const confirm2 = prompt('Dobara confirm karein:');
      if (newPw !== confirm2) { showToast('Password match nahi kiya'); return; }
      try {
        await window._FA.updatePassword(window._AUTH.currentUser, newPw);
        showToast('✅ Password kamyabi se badal diya gaya');
      } catch(e) {
        showToast('Error: ' + e.message);
      }
    };

    App.openLoginModal = function() {
      const pop = document.getElementById('settings-popover');
      if (pop && pop.hidePopover) {
        try { pop.hidePopover(); } catch(e) {}
      }
      const lm = document.getElementById('login-modal');
      if (lm && lm.showModal) {
        try { lm.showModal(); } catch(e) {}
      }
    };

    App.closeLoginModal = function() {
      sessionStorage.setItem('muallim_guest_mode', '1');
      const lm = document.getElementById('login-modal');
      if (lm && lm.open) {
        try { lm.close(); } catch(e) {}
      }
    };

    App.openAdminDashboard = function() {
      const pop = document.getElementById('settings-popover');
      if (pop && pop.showPopover) {
        try { pop.showPopover(); } catch(e) {}
      }
      const grp = document.getElementById('admin-access-group');
      if (grp) {
        setTimeout(() => grp.scrollIntoView({ behavior: 'smooth' }), 100);
      }
      if (typeof App.refreshAdminStudents === 'function') App.refreshAdminStudents();
    };

    // ─── Keep old refreshAdminStudents for backward compat ─────
    App.refreshAdminStudents = function() {
      const mount = document.getElementById('admin-students-mount');
      if (!mount) return;
      const examHistory = JSON.parse(localStorage.getItem('muallim_exam_history') || '[]');
      const studentName = localStorage.getItem('muallim_student_name') || 'Anonymous';
      if (examHistory.length === 0) {
        mount.innerHTML = '<div style="text-align:center; padding:10px; color:var(--text-muted);">No exam history yet</div>';
        return;
      }
      const best = examHistory.reduce((a, b) => a.score > b.score ? a : b, examHistory[0]);
      mount.innerHTML = `
        <table class="admin-student-table">
          <tr><th>Name</th><th>Best Score</th><th>Attempts</th></tr>
          <tr><td>${studentName}</td><td class="score-pct">${best.score}% (${best.grade})</td><td>${examHistory.length}</td></tr>
        </table>
        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:6px;">
          ℹ️ For multi-device sync, configure Firebase (see docs/FIREBASE_SETUP.md)
        </div>`;
    };

    App.clearAllLocalData = function() {
      if (!confirm('This will clear all local data (starred items, custom answers, exam history). Are you sure?')) return;
      ['muallim_favs','muallim_custom_answers','muallim_exam_history','muallim_bookmark'].forEach(k => localStorage.removeItem(k));
      favourites = [];
      customAnswers = {};
      examHistory = [];
      updateStarredCountBadge();
      renderCurrentLesson();
      showToast('All local data cleared');
    };

    // ─── P4: Bug fixes ────────────────────────────────────
    // Bug 7: exercise_header renderer is added in renderCurrentLesson patch below
    // Bug 8: openExportDialog already updated (existing function handles counts)
    // Bug 9: speakArabic try/catch improved below

    // ─── P5: Vocab Drill Accordion ───────────────────────
    let drillSelectedLessons = new Set(); // Set of lesson_keys e.g. 'S2L3'

    App.switchDrillTab = function(tab) {
      document.getElementById('drill-tab-starred').classList.toggle('active', tab === 'starred');
      document.getElementById('drill-tab-custom').classList.toggle('active', tab === 'custom');
      document.getElementById('drill-starred-panel').style.display = tab === 'starred' ? 'block' : 'none';
      document.getElementById('drill-custom-panel').style.display = tab === 'custom' ? 'block' : 'none';
      if (tab === 'custom') buildAccordion();
    };

    function buildAccordion() {
      const mount = document.getElementById('lesson-accordion-mount');
      if (!mount || mount.childElementCount > 0) { updateDrillCount(); return; }
      let html = '';
      const stages = bookData ? bookData.stages : {};
      for (let s = 1; s <= 7; s++) {
        const key = `Stage${s}`;
        const lessons = stages[key] || [];
        if (!lessons.length) continue;
        html += `<div class="accordion-stage-header" onclick="toggleStageAccordion(${s})" id="stage-acc-hdr-${s}">
          <span>Unit ${s}</span>
          <span class="accordion-stage-count" id="stage-acc-count-${s}">0/${lessons.length}</span>
          <span class="arrow">▶</span>
        </div>
        <div class="accordion-stage-body" id="stage-acc-body-${s}">`;
        lessons.forEach(l => {
          const lkey = l.lesson_key || `S${s}L${l.lesson_id}`;
          html += `<span class="lesson-pill" id="pill-${lkey}" onclick="toggleLessonPill('${lkey}', ${s})">L${l.lesson_id}</span>`;
        });
        html += '</div>';
      }
      mount.innerHTML = html;
      updateDrillCount();
    }

    function toggleStageAccordion(s) {
      const hdr = document.getElementById(`stage-acc-hdr-${s}`);
      const body = document.getElementById(`stage-acc-body-${s}`);
      if (!hdr || !body) return;
      const isOpen = body.classList.contains('open');
      body.classList.toggle('open', !isOpen);
      hdr.classList.toggle('open', !isOpen);
    }

    function toggleLessonPill(lkey, stageNum) {
      const pill = document.getElementById(`pill-${lkey}`);
      if (!pill) return;
      if (drillSelectedLessons.has(lkey)) {
        drillSelectedLessons.delete(lkey);
        pill.classList.remove('selected');
      } else {
        drillSelectedLessons.add(lkey);
        pill.classList.add('selected');
      }
      updateStageAccordionCount(stageNum);
      updateDrillCount();
    }

    function updateStageAccordionCount(s) {
      const key = `Stage${s}`;
      const lessons = (bookData?.stages?.[key] || []);
      const total = lessons.length;
      const selected = lessons.filter(l => drillSelectedLessons.has(l.lesson_key || `S${s}L${l.lesson_id}`)).length;
      const el = document.getElementById(`stage-acc-count-${s}`);
      if (el) el.textContent = `${selected}/${total}`;
    }

    function updateDrillCount() {
      let count = 0;
      const stages = bookData?.stages || {};
      for (let s = 1; s <= 7; s++) {
        const lessons = (stages[`Stage${s}`] || []);
        lessons.forEach(l => {
          const lkey = l.lesson_key || `S${s}L${l.lesson_id}`;
          if (!drillSelectedLessons.has(lkey)) return;
          (l.sections || []).forEach(sec => {
            (sec.data?.items || []).forEach(it => {
              if (it.arabic && it.hinglish) count++;
            });
          });
        });
      }
      const el = document.getElementById('drill-card-count-label');
      if (el) el.textContent = `${count} cards selected`;
    }

    App.drillSelectAll = function() {
      const stages = bookData?.stages || {};
      for (let s = 1; s <= 7; s++) {
        (stages[`Stage${s}`] || []).forEach(l => {
          const lkey = l.lesson_key || `S${s}L${l.lesson_id}`;
          drillSelectedLessons.add(lkey);
          const pill = document.getElementById(`pill-${lkey}`);
          if (pill) pill.classList.add('selected');
        });
        updateStageAccordionCount(s);
      }
      updateDrillCount();
    };

    App.drillClearAll = function() {
      drillSelectedLessons.clear();
      document.querySelectorAll('.lesson-pill.selected').forEach(p => p.classList.remove('selected'));
      for (let s = 1; s <= 7; s++) updateStageAccordionCount(s);
      updateDrillCount();
    };

    function buildCustomDrillPool() {
      const pool = [];
      const stages = bookData?.stages || {};
      for (let s = 1; s <= 7; s++) {
        (stages[`Stage${s}`] || []).forEach(l => {
          const lkey = l.lesson_key || `S${s}L${l.lesson_id}`;
          if (!drillSelectedLessons.has(lkey)) return;
          (l.sections || []).forEach(sec => {
            (sec.data?.items || []).forEach(it => {
              if (it.arabic && it.hinglish) pool.push({ arabic: it.arabic, origHinglish: it.hinglish, customHinglish: '', key: lkey });
            });
          });
        });
      }
      return shuffleArray(pool);
    }

    function shuffleArray(arr) {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    App.startCustomDrill = function() {
      const pool = buildCustomDrillPool();
      if (pool.length === 0) { showToast('No vocab cards in selected lessons'); return; }
      startDrillWithPool(pool);
    };

    App.startStarredDrill = function() {
      const pool = favourites.map(f => ({
        arabic: f.arabic, origHinglish: f.hinglish,
        customHinglish: customAnswers[f.key] || '', key: f.key
      }));
      if (pool.length === 0) { showToast('No starred items yet. Tap ★ on any card!'); return; }
      startDrillWithPool(shuffleArray(pool));
    };

    function startDrillWithPool(pool) {
      spinnerPool = pool;
      spinnerIndex = 0;
      document.getElementById('drill-setup-view').style.display = 'none';
      document.getElementById('drill-card-view').style.display = 'block';
      showSpinnerCard();
    }

    App.endDrill = function() {
      document.getElementById('drill-setup-view').style.display = 'block';
      document.getElementById('drill-card-view').style.display = 'none';
    };

    // ─── EXAM ENGINE ─────────────────────────────────────
    let examState = 'idle'; // idle | setup | running | summary | review
    let examQuestions = [];
    let examAnswers = [];
    let examScores = [];
    let examCurrentQ = 0;
    let examBreakdown = {};
    let examHistory = [];
    let matchingArabicSel = null;
    let examScopeMode = 'current'; // 'current' | 'stage' | 'custom' | 'starred'
    let examScopeSelection = new Set();
    let examStarredOnlyFilter = false;
    let examSelectedCount = 20;

    // Load history safely
    try { examHistory = JSON.parse(lsGet('muallim_exam_history', '[]') || '[]'); } catch(e) { examHistory = []; }

    App.printExamAsPDF = function() {
      // Build pool first
      const pool = buildExamPool();
      if (!pool.length) { alert('Koi items nahi mile! Pehle scope select karein.'); return; }
      const shuffle = arr => arr.sort(() => Math.random() - 0.5);
      const selected = shuffle(pool).slice(0, examSelectedCount || 20);
      
      const rows = selected.map((item, i) => `
        <div style="margin-bottom:18px; padding-bottom:14px; border-bottom:1px solid #ddd;">
          <div style="font-weight:700; margin-bottom:6px;">${i+1}. <span style="font-family:'Amiri',serif; font-size:1.1em;">${item.arabic}</span></div>
          <div style="color:#555; font-size:0.85em; margin-bottom:8px;">${item.hinglish || ''}</div>
          <div style="border-bottom:1px solid #aaa; margin-top:16px; height:1px;"></div>
          <div style="font-size:0.75em; color:#aaa; margin-top:2px;">Jawab / Answer</div>
        </div>
      `).join('');
      
      const win = window.open('', '_blank');
      win.document.write(`<!DOCTYPE html><html><head><title>Muallim Exam</title>
        <style>body{font-family:sans-serif;max-width:700px;margin:40px auto;padding:20px;}
        h1{text-align:center;font-size:1.3em;}
        .meta{text-align:center;color:#666;margin-bottom:30px;}
        @media print{button{display:none!important;}}
        </style></head><body>
        <h1>🎓 Muallim ul-Qur'an — Ustaad ki Exam</h1>
        <div class="meta">Naam / Name: _________________________ &nbsp;&nbsp; Tarikh / Date: _____________</div>
        ${rows}
        <div style="text-align:center;margin-top:30px;">
          <button onclick="window.print()" style="padding:10px 24px;background:#1B4332;color:#fff;border:none;border-radius:6px;font-size:1rem;cursor:pointer;font-weight:700;">🖨 Print / Save PDF</button>
        </div>
      </body></html>`);
      win.document.close();
    };

    App.openExam = function() {
      examState = 'setup';
      renderExamView();
      const modal = document.getElementById('exam-modal');
      if (modal && modal.showModal) modal.showModal();
    };

    App.closeExam = function() {
      const modal = document.getElementById('exam-modal');
      if (modal && modal.close) modal.close();
      examState = 'idle';
    };

    function renderExamView() {
      const body = document.getElementById('exam-modal-body');
      if (!body) return;
      if (examState === 'setup') body.innerHTML = buildExamSetupHTML();
      else if (examState === 'running') body.innerHTML = buildQuestionHTML();
      else if (examState === 'summary') body.innerHTML = buildSummaryHTML();
      else if (examState === 'review') body.innerHTML = buildReviewHTML();
    }

    App.setExamScope = function(mode) {
      examScopeMode = mode;
      if (mode !== 'custom') examScopeSelection.clear();
      renderExamView();
    };

    App.toggleExamStarredFilter = function(checked) {
      examStarredOnlyFilter = !!checked;
      renderExamView();
    };

    App.toggleStageExamBody = function(stageNum) {
      const el = document.getElementById(`exam-stage-body-${stageNum}`);
      if (!el) return;
      el.style.display = el.style.display === 'none' ? 'flex' : 'none';
    };

    App.selectAllInStage = function(stageNum, selectAll) {
      const stages = bookData?.stages || {};
      const lessons = (stages[`Stage${stageNum}`] || []).filter(l => l.status !== 'template');
      lessons.forEach(l => {
        const lkey = l.lesson_key || `S${stageNum}L${l.lesson_id}`;
        if (selectAll) examScopeSelection.add(lkey);
        else examScopeSelection.delete(lkey);
      });
      renderExamView();
    };

    App.toggleExamLessonPill = function(lkey) {
      if (examScopeSelection.has(lkey)) examScopeSelection.delete(lkey);
      else examScopeSelection.add(lkey);
      renderExamView();
    };

    App.selectExamCount = function(cnt) {
      examSelectedCount = cnt;
      document.querySelectorAll('.count-btn').forEach(btn => {
        btn.classList.toggle('selected', parseInt(btn.dataset.count) === cnt);
      });
    };

    function buildExamScopeAccordionHTML() {
      const stages = bookData?.stages || {};
      let html = `<div class="exam-lesson-accordion" style="margin-top:10px; border:1px solid var(--border,#e5e7eb); border-radius:8px; max-height:220px; overflow-y:auto; padding:6px; background:var(--bg-surface-elevated,#f9fafb);">`;
      
      for (let s = 1; s <= 7; s++) {
        const stageKey = `Stage${s}`;
        const lessons = (stages[stageKey] || []).filter(l => l.status !== 'template');
        const selectedInStage = lessons.filter(l => examScopeSelection.has(l.lesson_key || `S${s}L${l.lesson_id}`)).length;
        
        html += `
          <div style="margin-bottom:6px; border:1px solid var(--border,#e5e7eb); border-radius:6px; background:var(--bg-surface,#fff); overflow:hidden;">
            <div style="display:flex; justify-content:space-between; align-items:center; padding:7px 10px; cursor:pointer; font-size:0.82rem; font-weight:700; background:var(--bg-surface-elevated,#f3f4f6);" onclick="App.toggleStageExamBody(${s})">
              <span>Unit ${s} (${lessons.length} lessons)</span>
              <span style="font-size:0.75rem; color:var(--primary,#1B4332);">${selectedInStage ? selectedInStage + ' selected' : '▾'}</span>
            </div>
            <div id="exam-stage-body-${s}" style="display:${s === currentStage ? 'flex' : 'none'}; flex-wrap:wrap; gap:4px; padding:6px;">
              <button type="button" class="btn-ghost" style="padding:2px 8px; font-size:0.72rem; cursor:pointer;" onclick="App.selectAllInStage(${s}, true)">All</button>
              <button type="button" class="btn-ghost" style="padding:2px 8px; font-size:0.72rem; cursor:pointer;" onclick="App.selectAllInStage(${s}, false)">None</button>
              ${lessons.map(l => {
                const lkey = l.lesson_key || `S${s}L${l.lesson_id}`;
                const isSel = examScopeSelection.has(lkey);
                return `<button type="button" class="exam-lesson-pill ${isSel ? 'active' : ''}" onclick="App.toggleExamLessonPill('${lkey}')">L-${l.lesson_id}</button>`;
              }).join('')}
            </div>
          </div>
        `;
      }
      html += `</div>`;
      return html;
    }

    function buildExamSetupHTML() {
      return `
        <h3 style="margin:0 0 16px; font-size:1.1rem; font-weight:800; color:var(--primary,#1B4332); display:flex; align-items:center; gap:8px;">
          <span>🎓</span> Ustaad ki Exam Setup
        </h3>

        <!-- Scope Selection -->
        <div class="exam-setup-section" style="margin-bottom:16px;">
          <div class="exam-setup-label" style="font-weight:700; font-size:0.88rem; margin-bottom:8px; color:var(--text-primary);">
            Exam Scope
          </div>
          <div class="exam-scope-btns" style="display:flex; flex-wrap:wrap; gap:6px;">
            <button type="button" class="scope-btn ${examScopeMode === 'current' ? 'selected' : ''}" onclick="App.setExamScope('current')">
              📌 Current Lesson (Unit ${currentStage} L-${currentLesson})
            </button>
            <button type="button" class="scope-btn ${examScopeMode === 'stage' ? 'selected' : ''}" onclick="App.setExamScope('stage')">
              📚 Entire Unit ${currentStage}
            </button>
            <button type="button" class="scope-btn ${examScopeMode === 'custom' ? 'selected' : ''}" onclick="App.setExamScope('custom')">
              🎛 Custom Selection (${examScopeSelection.size} lessons)
            </button>
            <button type="button" class="scope-btn ${examScopeMode === 'starred' ? 'selected' : ''}" onclick="App.setExamScope('starred')">
              ⭐ Starred Words Only (${favourites.length})
            </button>
          </div>

          ${examScopeMode === 'custom' ? buildExamScopeAccordionHTML() : ''}

          ${examScopeMode !== 'starred' ? `
            <div style="margin-top:10px;">
              <label style="display:flex; align-items:center; gap:8px; font-size:0.85rem; color:var(--text-secondary); cursor:pointer;">
                <input type="checkbox" id="exam-starred-only-cb" ${examStarredOnlyFilter ? 'checked' : ''} onchange="App.toggleExamStarredFilter(this.checked)">
                <span>⭐ Only include starred words from selected scope</span>
              </label>
            </div>
          ` : ''}
        </div>

        <!-- Question Types -->
        <div class="exam-setup-section" style="margin-bottom:16px;">
          <div class="exam-setup-label" style="font-weight:700; font-size:0.88rem; margin-bottom:8px; color:var(--text-primary);">
            Question Types
          </div>
          <div class="exam-type-checkboxes" style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <label class="exam-type-checkbox-label" style="font-size:0.85rem; display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="checkbox" name="exam-type" value="mcq" checked> 📝 MCQ (Sahi Jawab)
            </label>
            <label class="exam-type-checkbox-label" style="font-size:0.85rem; display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="checkbox" name="exam-type" value="fillin" checked> ✍️ Fill in Blank
            </label>
            <label class="exam-type-checkbox-label" style="font-size:0.85rem; display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="checkbox" name="exam-type" value="truefalse" checked> ⚖️ True / False
            </label>
            <label class="exam-type-checkbox-label" style="font-size:0.85rem; display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="checkbox" name="exam-type" value="matching" checked> 🔗 Matching Pairs
            </label>
            <label class="exam-type-checkbox-label" style="font-size:0.85rem; display:flex; align-items:center; gap:6px; cursor:pointer; grid-column:span 2;">
              <input type="checkbox" name="exam-type" value="arabic_writing" checked> ★ Arabic Pehchanen (Arabic Writing)
            </label>
          </div>
        </div>

        <!-- Question Count -->
        <div class="exam-setup-section" style="margin-bottom:16px;">
          <div class="exam-setup-label" style="font-weight:700; font-size:0.88rem; margin-bottom:8px; color:var(--text-primary);">
            Number of Questions
          </div>
          <div class="exam-count-btns" style="display:flex; gap:8px;">
            <button type="button" class="count-btn ${examSelectedCount === 10 ? 'selected' : ''}" data-count="10" onclick="App.selectExamCount(10)">10</button>
            <button type="button" class="count-btn ${examSelectedCount === 20 ? 'selected' : ''}" data-count="20" onclick="App.selectExamCount(20)">20</button>
            <button type="button" class="count-btn ${examSelectedCount === 30 ? 'selected' : ''}" data-count="30" onclick="App.selectExamCount(30)">30</button>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px; margin-top:4px;">
          <button class="btn-secondary" style="width:100%; padding:12px; font-size:1rem; font-weight:700;" onclick="App.printExamAsPDF()">
            📄 PDF Exam Paper Download / Print
          </button>
          <button class="btn-primary" style="width:100%; padding:12px; font-size:1rem; font-weight:700;" onclick="App.startExam()">
            ▶ Exam Shuru Karein (Live Exam)
          </button>
        </div>
      `;
    }

    function buildExamPool() {
      const stages = bookData?.stages || {};
      const pool = [];
      const starredSet = new Set(favourites);

      if (examScopeMode === 'starred') {
        favourites.forEach(key => {
          const match = key.match(/^S(\d+)L(\d+)_s(\d+)_(\d+)$/);
          if (!match) return;
          const [, s, l, si, ii] = match.map(Number);
          const stageKey = `Stage${s}`;
          const lesson = (stages[stageKey] || []).find(x => x.lesson_id === l);
          if (!lesson) return;
          const sec = lesson.sections?.[si];
          const item = sec?.data?.items?.[ii] || sec?.data?.verses?.[ii];
          if (item?.arabic && item?.hinglish && !item.arabic.includes('----')) {
            pool.push({
              arabic: item.arabic,
              hinglish: customAnswers[key] || item.hinglish,
              stage: s,
              lesson: l,
              lessonKey: `S${s}L${l}`,
              sectionType: sec.type,
              sectionId: `S${s}L${l}_s${si}`,
              key
            });
          }
        });
        return pool;
      }

      for (let s = 1; s <= 7; s++) {
        const stageKey = `Stage${s}`;
        (stages[stageKey] || []).forEach(l => {
          if (l.status === 'template') return;
          const lkey = l.lesson_key || `S${s}L${l.lesson_id}`;
          
          let include = false;
          if (examScopeMode === 'current') {
            include = (s === currentStage && l.lesson_id === currentLesson);
          } else if (examScopeMode === 'stage') {
            include = (s === currentStage);
          } else if (examScopeMode === 'custom') {
            include = examScopeSelection.has(lkey);
          }

          if (!include) return;

          (l.sections || []).forEach((sec, si) => {
            const items = (sec.data && sec.data.items) || (sec.data && sec.data.verses) || [];
            items.forEach((it, ii) => {
              if (!it.arabic || !it.hinglish || it.arabic.includes('----')) return;
              const itemKey = `${lkey}_s${si}_${ii}`;
              if (examStarredOnlyFilter && !starredSet.has(itemKey)) return;

              pool.push({
                arabic: it.arabic,
                hinglish: customAnswers[itemKey] || it.hinglish,
                stage: s,
                lesson: l.lesson_id,
                lessonKey: lkey,
                sectionType: sec.type,
                sectionId: `${lkey}_s${si}`,
                key: itemKey
              });
            });
          });
        });
      }
      return pool;
    }

    function getSmartDistractors(correctItem, allPool, count) {
      const sameSection = allPool.filter(v => v.sectionId === correctItem.sectionId && v.hinglish !== correctItem.hinglish);
      const sameLesson = allPool.filter(v => v.lessonKey === correctItem.lessonKey && v.hinglish !== correctItem.hinglish);
      const sameStage = allPool.filter(v => v.stage === correctItem.stage && v.hinglish !== correctItem.hinglish);
      const anyPool = allPool.filter(v => v.hinglish !== correctItem.hinglish);

      const candidatePool = sameSection.length >= count ? sameSection :
                            sameLesson.length >= count ? sameLesson :
                            sameStage.length >= count ? sameStage : anyPool;

      const shuffled = shuffleArray([...candidatePool]);
      const seen = new Set([correctItem.hinglish.trim().toLowerCase()]);
      const result = [];

      for (const v of shuffled) {
        const norm = v.hinglish.trim().toLowerCase();
        if (!seen.has(norm)) {
          seen.add(norm);
          result.push(v.hinglish);
        }
        if (result.length >= count) break;
      }
      while (result.length < count) {
        result.push(`Option ${result.length + 1}`);
      }
      return result;
    }

    function getSmartArabicDistractors(correctItem, allPool, count) {
      const sameLesson = allPool.filter(v => v.lessonKey === correctItem.lessonKey && v.arabic !== correctItem.arabic);
      const sameStage = allPool.filter(v => v.stage === correctItem.stage && v.arabic !== correctItem.arabic);
      const anyPool = allPool.filter(v => v.arabic !== correctItem.arabic);

      const candidatePool = sameLesson.length >= count ? sameLesson :
                            sameStage.length >= count ? sameStage : anyPool;

      const shuffled = shuffleArray([...candidatePool]);
      const seen = new Set([correctItem.arabic.trim()]);
      const result = [];

      for (const v of shuffled) {
        const norm = v.arabic.trim();
        if (!seen.has(norm)) {
          seen.add(norm);
          result.push(v.arabic);
        }
        if (result.length >= count) break;
      }
      while (result.length < count) {
        result.push('—');
      }
      return result;
    }

    App.startExam = function() {
      const types = Array.from(document.querySelectorAll('input[name="exam-type"]:checked')).map(cb => cb.value);
      if (types.length === 0) { showToast('Kam se kam ek question type chunein'); return; }

      if (examScopeMode === 'custom' && examScopeSelection.size === 0) {
        showToast('Kam se kam ek lesson chunein accordion se'); return;
      }

      examQuestions = generateExamQuestions(types, examSelectedCount);
      if (examQuestions.length === 0) return;

      examAnswers = new Array(examQuestions.length).fill(null);
      examScores = new Array(examQuestions.length).fill(null);
      examCurrentQ = 0;
      examBreakdown = {};
      types.forEach(t => examBreakdown[t] = { correct: 0, total: 0 });

      examState = 'running';
      renderExamView();
    };

    function generateExamQuestions(types, count) {
      const pool = buildExamPool();
      if (pool.length < 4) {
        showToast('Is scope mein kam se kam 4 alfaaz chahiye exam ke liye');
        return [];
      }

      const questions = [];
      const shuffledPool = shuffleArray([...pool]);

      let qIdx = 0;
      while (questions.length < count && qIdx < shuffledPool.length * 3) {
        const type = types[questions.length % types.length];
        const item = shuffledPool[qIdx % shuffledPool.length];
        qIdx++;

        if (type === 'mcq') {
          const distractors = getSmartDistractors(item, pool, 3);
          const options = shuffleArray([item.hinglish, ...distractors]);
          questions.push({ type: 'mcq', arabic: item.arabic, correct: item.hinglish, options });

        } else if (type === 'arabic_writing') {
          const wrongArabics = getSmartArabicDistractors(item, pool, 3);
          const options = shuffleArray([item.arabic, ...wrongArabics]);
          questions.push({ type: 'arabic_writing', hinglish: item.hinglish, correct: item.arabic, options });

        } else if (type === 'truefalse') {
          const isTrue = Math.random() > 0.45;
          let statement;
          if (isTrue) {
            statement = item.hinglish;
          } else {
            const dist = getSmartDistractors(item, pool, 1)[0];
            statement = dist;
          }
          questions.push({
            type: 'truefalse',
            arabic: item.arabic,
            statement,
            correct: isTrue ? 'true' : 'false',
            isTrue,
            correctHinglish: item.hinglish
          });

        } else if (type === 'fillin') {
          questions.push({ type: 'fillin', arabic: item.arabic, correct: item.hinglish });

        } else if (type === 'matching') {
          const bySec = {};
          pool.forEach(it => {
            if (!bySec[it.sectionId]) bySec[it.sectionId] = [];
            bySec[it.sectionId].push(it);
          });
          const viable = Object.values(bySec).filter(list => list.length >= 4);
          const chosenList = viable.length > 0 ? viable[Math.floor(Math.random() * viable.length)] : pool;
          const pairCount = Math.min(5, chosenList.length);
          const pairs = shuffleArray([...chosenList]).slice(0, pairCount).map(p => ({ arabic: p.arabic, hinglish: p.hinglish }));
          const shuffledHinglish = shuffleArray(pairs.map(p => p.hinglish));
          questions.push({
            type: 'matching',
            pairs,
            shuffledHinglish,
            pairScores: new Array(pairCount).fill(null),
            pairAnswers: new Array(pairCount).fill(null)
          });
        }
      }

      return questions.slice(0, count);
    }

    // ── Question Rendering ──
    function buildQuestionHTML() {
      const q = examQuestions[examCurrentQ];
      const pct = Math.round((examCurrentQ / examQuestions.length) * 100);
      const student = lsGet('muallim_student_name', '') || '';

      let content = '';
      if (q.type === 'mcq') content = buildMCQHTML(q, examCurrentQ);
      else if (q.type === 'arabic_writing') content = buildArabicWritingHTML(q, examCurrentQ);
      else if (q.type === 'truefalse') content = buildTFHTML(q, examCurrentQ);
      else if (q.type === 'matching') content = buildMatchingHTML(q, examCurrentQ);
      else if (q.type === 'fillin') content = buildFillinHTML(q, examCurrentQ);

      const typeLabels = {
        mcq: 'Multiple Choice',
        arabic_writing: '★ Arabic Pehchanen',
        truefalse: 'True / False',
        matching: 'Match Pairs',
        fillin: 'Fill in Blank'
      };

      return `
        <div class="exam-progress-bar-wrap"><div class="exam-progress-bar" style="width:${pct}%"></div></div>
        <div class="exam-q-counter">Question ${examCurrentQ + 1} of ${examQuestions.length}${student ? ' · ' + student : ''}</div>
        <div class="exam-type-badge">${typeLabels[q.type] || q.type}</div>
        ${content}
      `;
    }

    function buildMCQHTML(q, qIdx) {
      const locked = examScores[qIdx] !== null;
      return `
        <div class="exam-q-arabic" style="font-family:'Amiri',serif; font-size:1.6rem; direction:rtl; text-align:center; margin:16px 0;">${q.arabic}</div>
        <div class="mcq-options">
          ${q.options.map(opt => {
            let cls = 'mcq-opt';
            if (locked) {
              cls += ' locked';
              if (opt === q.correct) cls += ' correct';
              else if (opt === examAnswers[qIdx]) cls += ' wrong';
            }
            const icon = locked ? (opt === q.correct ? '✓' : (opt === examAnswers[qIdx] ? '✗' : '')) : '';
            return `<button class="${cls}" onclick="App.answerMCQ(${qIdx}, '${opt.replace(/'/g,"&#39;")}')">
              ${opt} ${icon ? `<span class="opt-icon">${icon}</span>` : ''}
            </button>`;
          }).join('')}
        </div>
        ${locked ? nextOrFinishBtn(qIdx) : ''}
      `;
    }

    function buildArabicWritingHTML(q, qIdx) {
      const locked = examScores[qIdx] !== null;
      return `
        <div class="exam-q-hinglish" style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin:12px 0 16px; text-align:center; padding:14px; background:var(--bg-surface-elevated,#f3f4f6); border-radius:8px; line-height:1.5;">
          "${q.hinglish}"
        </div>
        <div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:10px; text-align:center;">
          Is ka sahi Arabic lafz chunein:
        </div>
        <div class="mcq-options">
          ${q.options.map(opt => {
            let cls = 'mcq-opt arabic-opt';
            if (locked) {
              cls += ' locked';
              if (opt === q.correct) cls += ' correct';
              else if (opt === examAnswers[qIdx]) cls += ' wrong';
            }
            const icon = locked ? (opt === q.correct ? '✓' : (opt === examAnswers[qIdx] ? '✗' : '')) : '';
            return `<button class="${cls}" style="font-family:'Amiri',serif; font-size:1.35rem; direction:rtl; min-height:48px;" onclick="App.answerArabicWriting(${qIdx}, '${opt.replace(/'/g,"&#39;")}')">
              ${opt} ${icon ? `<span class="opt-icon">${icon}</span>` : ''}
            </button>`;
          }).join('')}
        </div>
        ${locked ? nextOrFinishBtn(qIdx) : ''}
      `;
    }

    function buildTFHTML(q, qIdx) {
      const locked = examScores[qIdx] !== null;
      function tfCls(val) {
        let c = 'tf-opt';
        if (locked) {
          c += ' locked';
          if (val === q.correct) c += ' correct';
          else if (val === examAnswers[qIdx]) c += ' wrong';
        }
        return c;
      }
      return `
        <div class="exam-q-arabic" style="font-family:'Amiri',serif; font-size:1.6rem; direction:rtl; text-align:center; margin:16px 0;">${q.arabic}</div>
        <div class="tf-statement">Does this mean: <strong>"${q.statement}"</strong>?</div>
        <div class="tf-options">
          <button class="${tfCls('true')}" onclick="App.answerTF(${qIdx}, 'true')">✅ True</button>
          <button class="${tfCls('false')}" onclick="App.answerTF(${qIdx}, 'false')">❌ False</button>
        </div>
        ${locked && !q.isTrue ? `<div class="fillin-feedback wrong" style="margin-top:10px; text-align:center;">Sahi matlab: <strong>${q.correctHinglish}</strong></div>` : ''}
        ${locked ? nextOrFinishBtn(qIdx) : ''}
      `;
    }

    function buildMatchingHTML(q, qIdx) {
      const allLocked = q.pairScores.every(s => s !== null);
      return `
        <div style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:12px;">
          Tap an Arabic word, then tap its Hinglish meaning to match.
        </div>
        <div class="matching-container">
          <div class="match-col">
            <div class="match-legend">Arabic</div>
            ${q.pairs.map((p, i) => {
              const score = q.pairScores[i];
              let cls = 'match-item arabic-side';
              if (score === true) cls += ' correct';
              else if (score === false) cls += ' wrong';
              else if (score === null && matchingArabicSel === i) cls += ' selected';
              const locked = score !== null;
              return `<div class="${cls}${locked ? ' locked' : ''}" style="font-family:'Amiri',serif; font-size:1.25rem; direction:rtl;"
                onclick="${locked ? '' : `App.selectMatchArabic(${qIdx}, ${i})`}">${p.arabic}</div>`;
            }).join('')}
          </div>
          <div class="match-col">
            <div class="match-legend">Meaning</div>
            ${q.shuffledHinglish.map((hi, i) => {
              const pairIdx = q.pairs.findIndex(p => p.hinglish === hi);
              const score = q.pairScores[pairIdx];
              let cls = 'match-item';
              if (score === true) cls += ' correct locked';
              else if (score === false) cls += ' revealed locked';
              return `<div class="${cls}" onclick="App.selectMatchHinglish(${qIdx}, '${hi.replace(/'/g,"&#39;")}')">
                ${hi}
              </div>`;
            }).join('')}
          </div>
        </div>
        ${allLocked ? nextOrFinishBtn(qIdx) : ''}
      `;
    }

    function buildFillinHTML(q, qIdx) {
      const locked = examScores[qIdx] !== null;
      const wasCorrect = examScores[qIdx] === true;
      return `
        <div class="exam-q-arabic" style="font-family:'Amiri',serif; font-size:1.6rem; direction:rtl; text-align:center; margin:16px 0;">${q.arabic}</div>
        <div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:10px;">Type the Hinglish/Roman Urdu meaning:</div>
        <input type="text" class="fillin-input${locked ? (wasCorrect ? ' correct' : ' wrong') : ''}"
          id="fillin-input-${qIdx}"
          placeholder="Type meaning here..."
          ${locked ? `value="${examAnswers[qIdx] || ''}" disabled` : ''}
          onkeydown="if(event.key==='Enter')App.submitFillin(${qIdx})">
        ${locked ? `
          <div class="fillin-feedback ${wasCorrect ? 'correct' : 'wrong'}">
            ${wasCorrect ? '✅ Correct!' : `❌ Wrong. Correct answer: <strong>${q.correct}</strong>`}
          </div>
        ` : `<button class="btn-primary" style="width:100%; margin-top:8px;" onclick="App.submitFillin(${qIdx})">Submit</button>`}
        ${locked ? nextOrFinishBtn(qIdx) : ''}
      `;
    }

    function nextOrFinishBtn(qIdx) {
      const isLast = qIdx >= examQuestions.length - 1;
      return `<div style="margin-top:14px;">
        <button class="btn-primary" style="width:100%; padding:10px; font-weight:700;" onclick="${isLast ? 'App.finishExam()' : 'App.nextQuestion()'}">
          ${isLast ? '📋 See Results' : 'Next Question →'}
        </button>
      </div>`;
    }

    // ── Answer Handlers (1st attempt locked) ──
    App.answerMCQ = function(qIdx, answer) {
      if (examScores[qIdx] !== null) return;
      examAnswers[qIdx] = answer;
      const q = examQuestions[qIdx];
      const correct = answer === q.correct;
      examScores[qIdx] = correct;
      if (!examBreakdown.mcq) examBreakdown.mcq = { correct: 0, total: 0 };
      examBreakdown.mcq.total++;
      if (correct) examBreakdown.mcq.correct++;
      renderExamView();
    };

    App.answerArabicWriting = function(qIdx, answer) {
      if (examScores[qIdx] !== null) return;
      examAnswers[qIdx] = answer;
      const q = examQuestions[qIdx];
      const correct = answer === q.correct;
      examScores[qIdx] = correct;
      if (!examBreakdown.arabic_writing) examBreakdown.arabic_writing = { correct: 0, total: 0 };
      examBreakdown.arabic_writing.total++;
      if (correct) examBreakdown.arabic_writing.correct++;
      renderExamView();
    };

    App.answerTF = function(qIdx, answer) {
      if (examScores[qIdx] !== null) return;
      examAnswers[qIdx] = answer;
      const q = examQuestions[qIdx];
      const correct = answer === q.correct;
      examScores[qIdx] = correct;
      if (!examBreakdown.truefalse) examBreakdown.truefalse = { correct: 0, total: 0 };
      examBreakdown.truefalse.total++;
      if (correct) examBreakdown.truefalse.correct++;
      renderExamView();
    };

    App.selectMatchArabic = function(qIdx, pairIdx) {
      matchingArabicSel = pairIdx;
      renderExamView();
    };

    App.selectMatchHinglish = function(qIdx, hinglish) {
      const q = examQuestions[qIdx];
      if (matchingArabicSel === null) { showToast('Select an Arabic word first'); return; }
      const arPairIdx = matchingArabicSel;
      if (q.pairScores[arPairIdx] !== null) { matchingArabicSel = null; renderExamView(); return; }
      const correctHinglish = q.pairs[arPairIdx].hinglish;
      const correct = hinglish === correctHinglish;
      q.pairScores[arPairIdx] = correct;
      q.pairAnswers[arPairIdx] = hinglish;
      if (!examBreakdown.matching) examBreakdown.matching = { correct: 0, total: 0 };
      examBreakdown.matching.total++;
      if (correct) examBreakdown.matching.correct++;
      matchingArabicSel = null;
      renderExamView();
    };

    App.submitFillin = function(qIdx) {
      const input = document.getElementById(`fillin-input-${qIdx}`);
      if (!input) return;
      const answer = input.value.trim();
      if (!answer) { showToast('Please type an answer'); return; }
      const q = examQuestions[qIdx];
      const correct = fuzzyMatch(answer.toLowerCase(), q.correct.toLowerCase());
      examAnswers[qIdx] = answer;
      examScores[qIdx] = correct;
      if (!examBreakdown.fillin) examBreakdown.fillin = { correct: 0, total: 0 };
      examBreakdown.fillin.total++;
      if (correct) examBreakdown.fillin.correct++;
      renderExamView();
    };

    function fuzzyMatch(a, b) {
      if (a === b) return true;
      if (b.includes(a) && a.length >= 3) return true;
      return levenshtein(a, b) <= 2;
    }

    function levenshtein(a, b) {
      const m = a.length, n = b.length;
      const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0));
      for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
      }
      return dp[m][n];
    }

    App.nextQuestion = function() {
      if (examCurrentQ < examQuestions.length - 1) {
        examCurrentQ++;
        renderExamView();
      }
    };

    App.finishExam = function() {
      examState = 'summary';
      saveExamResult();
      renderExamView();
    };

    function calcExamScore() {
      let total = 0, correct = 0;
      examQuestions.forEach((q, i) => {
        if (q.type === 'matching') {
          q.pairs.forEach((_, pi) => {
            total++;
            if (q.pairScores[pi] === true) correct++;
          });
        } else {
          total++;
          if (examScores[i] === true) correct++;
        }
      });
      const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
      return { pct, correct, total };
    }

    function calcGrade(pct) {
      if (pct >= 95) return 'A+';
      if (pct >= 85) return 'A';
      if (pct >= 70) return 'B';
      if (pct >= 55) return 'C';
      if (pct >= 40) return 'D';
      return 'F';
    }

    function saveExamResult() {
      const { pct, correct, total } = calcExamScore();
      const grade = calcGrade(pct);
      const result = {
        id: `exam_${Date.now()}`,
        studentName: lsGet('muallim_student_name', 'Anonymous') || 'Anonymous',
        stage: currentStage,
        lesson: currentLesson,
        date: new Date().toISOString(),
        score: pct,
        grade,
        correct,
        total,
        breakdown: { ...examBreakdown }
      };
      examHistory.push(result);
      lsSet('muallim_exam_history', JSON.stringify(examHistory));
      if (typeof debouncedSync === 'function') debouncedSync(500);
    }

    function buildSummaryHTML() {
      const { pct, correct, total } = calcExamScore();
      const grade = calcGrade(pct);
      const student = lsGet('muallim_student_name', '') || '';
      const date = new Date().toLocaleString();

      const gradeColors = { 'A+': '#059669', 'A': '#10B981', 'B': '#0EA5E9', 'C': '#F59E0B', 'D': '#F97316', 'F': '#EF4444' };
      const color = gradeColors[grade] || '#10B981';

      const scopeDesc = {
        current: `Unit ${currentStage} Lesson ${currentLesson}`,
        stage: `Entire Unit ${currentStage}`,
        custom: `${examScopeSelection.size} Lessons Selected`,
        starred: `⭐ Starred Words (${favourites.length})`
      }[examScopeMode] || `Unit ${currentStage}`;

      const breakdownRows = Object.entries(examBreakdown).map(([type, bd]) => {
        const labels = {
          mcq: 'MCQ (Sahi Jawab)',
          arabic_writing: '★ Arabic Pehchanen',
          truefalse: 'True / False',
          matching: 'Matching Pairs',
          fillin: 'Fill in Blank'
        };
        const typePct = bd.total > 0 ? Math.round((bd.correct / bd.total) * 100) : 0;
        return `<tr>
          <td>${labels[type] || type}</td>
          <td>${bd.correct} / ${bd.total}</td>
          <td class="score-pct">${typePct}%</td>
        </tr>`;
      }).join('');

      return `
        <div class="exam-score-card">
          <div class="exam-grade-badge" style="color:${color};">${grade}</div>
          <div class="exam-score-num">${pct}% — ${correct} / ${total} correct</div>
          ${student ? `<div class="exam-score-student">👤 ${student}</div>` : ''}
          <div class="exam-score-date">📅 ${date} · ${scopeDesc}</div>
        </div>

        ${breakdownRows ? `
          <table class="exam-breakdown-table">
            <tr><th>Question Type</th><th>Score</th><th>%</th></tr>
            ${breakdownRows}
          </table>
        ` : ''}

        <div class="exam-action-btns">
          <button class="btn-primary" onclick="App.printExamResults('student')">📄 Print / Download Exam Paper</button>
          <button class="btn-secondary" onclick="App.printExamResults('key')">🔑 Print Teacher Answer Key</button>
          <button class="btn-secondary" onclick="App.reviewExam()">🔍 Review All Answers</button>
          <button class="btn-secondary" onclick="App.retakeExam()">🔁 Retake Exam</button>
          <button class="btn-secondary" onclick="App.closeExam()">✓ Close</button>
        </div>
      `;
    }

    App.reviewExam = function() {
      examState = 'review';
      renderExamView();
    };

    function buildReviewHTML() {
      let html = '<div style="margin-bottom:14px;"><button class="btn-secondary" style="width:100%;" onclick="examState=\'summary\'; renderExamView()">← Back to Results</button></div>';
      examQuestions.forEach((q, i) => {
        const score = q.type === 'matching' ? (q.pairScores.every(s => s === true) ? true : false) : examScores[i];
        const correct = score === true;
        html += `<div class="review-item ${correct ? 'correct-q' : 'wrong-q'}">
          <div class="review-q-header">
            <span class="review-q-num">Q${i + 1} · ${q.type.toUpperCase()}</span>
            <span class="review-q-result ${correct ? 'correct' : 'wrong'}">${correct ? '✅ Correct' : '❌ Wrong'}</span>
          </div>
          <div class="review-q-arabic" style="font-family:'Amiri',serif; font-size:1.3rem; direction:rtl;">${q.arabic || (q.pairs?.map(p => p.arabic).join(' / ') || q.hinglish)}</div>
          <div class="review-answer-row">
            <span style="color:var(--text-muted);">Correct: </span>
            <span style="color:#10B981; font-weight:600;">${q.correct || q.pairs?.map(p => p.hinglish).join(', ')}</span>
          </div>
          ${examAnswers[i] && examAnswers[i] !== q.correct ? `
            <div class="review-answer-row">
              <span style="color:var(--text-muted);">Your answer: </span>
              <span style="color:#EF4444; font-weight:600;">${examAnswers[i]}</span>
            </div>` : ''}
        </div>`;
      });
      return html;
    }

    App.retakeExam = function() {
      examBreakdown = {};
      examState = 'setup';
      renderExamView();
    };

    // ── Professional A4 Exam Print / PDF (Student Paper & Answer Key) ──
    App.printExamResults = async function(edition) {
      edition = edition || 'student';
      const isKey = (edition === 'key');

      const { pct, correct, total } = calcExamScore();
      const grade = calcGrade(pct);
      const student = lsGet('muallim_student_name', 'Student') || 'Student';
      const date = new Date().toLocaleDateString();

      const scopeDesc = {
        current: `Unit ${currentStage} Lesson ${currentLesson}`,
        stage: `Unit ${currentStage} Comprehensive`,
        custom: `${examScopeSelection.size} Lessons Custom Exam`,
        starred: `⭐ Starred Vocabulary Exam`
      }[examScopeMode] || `Unit ${currentStage}`;

      const mcqs = examQuestions.filter(q => q.type === 'mcq');
      const fills = examQuestions.filter(q => q.type === 'fillin');
      const matchings = examQuestions.filter(q => q.type === 'matching');
      const tfs = examQuestions.filter(q => q.type === 'truefalse');
      const writings = examQuestions.filter(q => q.type === 'arabic_writing');

      const printWin = window.open('', '_blank', 'width=920,height=750');
      if (!printWin) {
        showToast('Please allow popups to open the printable exam sheet');
        return;
      }

      const keyBtnHtml = !isKey ? '<button onclick="window.opener.App.printExamResults(\'key\'); window.close();" style="padding:10px 20px; background:#0EA5E9; color:#fff; border:none; border-radius:6px; font-size:1rem; cursor:pointer; font-weight:700;">🔑 Open Teacher Key</button>' : '';

      const summaryCardHtml = isKey ? `<div class="score-card">
        <div>
          <div style="font-weight:800; font-size:11pt; color:#1B4332;">Result Summary</div>
          <div style="font-size:9.5pt; color:#4b5563;">Score: ${correct} / ${total} (${pct}%)</div>
        </div>
        <div class="score-badge">${grade}</div>
      </div>` : '';

      let pageHtml = '<!DOCTYPE html><html lang="ur" dir="ltr"><head><meta charset="utf-8">';
      pageHtml += '<title>Muallim ul-Qur\'an — ' + (isKey ? 'Answer Key' : 'Exam Paper') + '</title>';
      pageHtml += '<link rel="preconnect" href="https://fonts.googleapis.com">';
      pageHtml += '<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet">';
      pageHtml += '<style>';
      pageHtml += '* { box-sizing: border-box; margin: 0; padding: 0; }';
      pageHtml += 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; font-size: 11pt; margin: 15mm; color: #111; line-height: 1.4; }';
      pageHtml += '.exam-header { border-bottom: 2.5px solid #1B4332; padding-bottom: 10px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; }';
      pageHtml += '.exam-title { font-size: 16pt; font-weight: 900; color: #1B4332; }';
      pageHtml += '.exam-sub { font-size: 9.5pt; color: #4b5563; margin-top: 3px; }';
      pageHtml += '.exam-meta { margin-top: 8px; font-size: 9pt; display: flex; gap: 16px; }';
      pageHtml += '.meta-item strong { color: #1B4332; }';
      pageHtml += '.badge-edition { padding: 4px 12px; border-radius: 4px; font-size: 9.5pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }';
      pageHtml += '.badge-student { background: #e5e7eb; color: #111827; }';
      pageHtml += '.badge-key { background: #1B4332; color: #fff; }';
      pageHtml += '.section-hdr { background: #1B4332; color: #fff; padding: 5px 12px; font-size: 9.5pt; font-weight: 700; margin: 16px 0 10px; display: flex; justify-content: space-between; border-radius: 3px; page-break-after: avoid; -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
      pageHtml += '.mcq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }';
      pageHtml += '.mcq-card { border: 0.5pt solid #d1d5db; border-radius: 4px; padding: 8px 10px; page-break-inside: avoid; }';
      pageHtml += '.mcq-qnum { font-weight: 700; font-size: 8.5pt; color: #1B4332; }';
      pageHtml += '.q-ar { font-family: "Amiri", serif; font-size: 15pt; direction: rtl; text-align: right; margin: 4px 0 6px; color: #000; }';
      pageHtml += '.mcq-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 8.5pt; }';
      pageHtml += '.mcq-opt { padding: 2px 4px; border-radius: 2px; }';
      pageHtml += '.ans-highlight { background: #d1fae5; font-weight: 700; color: #065f46; }';
      pageHtml += '.fill-row { display: flex; align-items: baseline; gap: 12px; margin-bottom: 8px; padding: 4px 0; border-bottom: 0.5pt dashed #e5e7eb; page-break-inside: avoid; }';
      pageHtml += '.fill-blank { flex: 1; border-bottom: 1.5pt solid #333; min-height: 1.5em; font-weight: 700; color: #065f46; }';
      pageHtml += '.match-table { width: 100%; border-collapse: collapse; margin-top: 6px; page-break-inside: avoid; }';
      pageHtml += '.match-table th { background: #f3f4f6; padding: 4px 8px; font-size: 8.5pt; text-align: left; border: 0.5pt solid #d1d5db; }';
      pageHtml += '.match-table td { padding: 5px 8px; border: 0.5pt solid #d1d5db; font-size: 9pt; }';
      pageHtml += '.tf-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 0.5pt dotted #d1d5db; page-break-inside: avoid; }';
      pageHtml += '.tf-box { border: 1pt solid #333; width: 45px; height: 20px; text-align: center; font-size: 8.5pt; font-weight: 700; line-height: 18px; }';
      pageHtml += '.ar-write-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }';
      pageHtml += '.ar-write-card { border: 0.5pt solid #d1d5db; border-radius: 4px; padding: 8px 10px; page-break-inside: avoid; }';
      pageHtml += '.score-card { border: 1.5pt solid #1B4332; border-radius: 6px; padding: 12px; margin-top: 18px; display: flex; justify-content: space-between; align-items: center; }';
      pageHtml += '.score-badge { font-size: 2.2rem; font-weight: 900; color: #1B4332; }';
      pageHtml += '@media print { .no-print { display: none !important; } body { margin: 10mm; } }';
      pageHtml += '</style></head><body>';

      pageHtml += `<div class="exam-header">
        <div>
          <div class="exam-title">📖 Muallim ul-Qur'an</div>
          <div class="exam-sub">Hinglish Qur'anic Arabic Curriculum — ${scopeDesc}</div>
          <div class="exam-meta">
            <div class="meta-item">Student: <strong>${isKey ? student : '___________________________'}</strong></div>
            <div class="meta-item">Date: <strong>${date}</strong></div>
            <div class="meta-item">Total Questions: <strong>${examQuestions.length}</strong></div>
          </div>
        </div>
        <div>
          <span class="badge-edition ${isKey ? 'badge-key' : 'badge-student'}">${isKey ? '🔑 Teacher Key' : 'Student Paper'}</span>
        </div>
      </div>`;

      if (mcqs.length > 0) {
        pageHtml += `<div class="section-hdr"><span>Section A — Multiple Choice (Sahi Jawab)</span><span>${mcqs.length} Marks</span></div>`;
        pageHtml += '<div class="mcq-grid">';
        mcqs.forEach((q, idx) => {
          pageHtml += `<div class="mcq-card"><div class="mcq-qnum">Q${idx + 1}.</div><div class="q-ar">${q.arabic}</div><div class="mcq-opts">`;
          q.options.forEach((opt, oi) => {
            const hl = isKey && opt === q.correct ? ' ans-highlight' : '';
            pageHtml += `<div class="mcq-opt${hl}">${'ABCD'[oi]}. ${opt}</div>`;
          });
          pageHtml += '</div></div>';
        });
        pageHtml += '</div>';
      }

      if (fills.length > 0) {
        pageHtml += `<div class="section-hdr"><span>Section B — Fill in the Blank (Khaali Jagah Bharein)</span><span>${fills.length * 2} Marks</span></div>`;
        fills.forEach((q, idx) => {
          pageHtml += `<div class="fill-row"><span style="font-weight:700; font-size:8.5pt; color:#1B4332;">Q${idx + 1}.</span>`;
          pageHtml += `<span class="q-ar" style="margin:0; min-width:120px;">${q.arabic}</span>`;
          pageHtml += `<div class="fill-blank">${isKey ? q.correct : ''}</div></div>`;
        });
      }

      if (matchings.length > 0) {
        const mMarks = matchings.reduce((sum, m) => sum + m.pairs.length, 0);
        pageHtml += `<div class="section-hdr"><span>Section C — Matching Pairs (Jori Milayen)</span><span>${mMarks} Marks</span></div>`;
        matchings.forEach((q) => {
          pageHtml += '<table class="match-table"><tr><th>#</th><th>Arabic Phrase</th><th>Matching Meaning</th><th>Letter</th></tr>';
          q.pairs.forEach((p, pi) => {
            const letter = String.fromCharCode(65 + pi);
            const ansLetter = isKey ? String.fromCharCode(65 + q.shuffledHinglish.indexOf(p.hinglish)) : '____';
            pageHtml += `<tr><td style="width:30px;">${pi + 1}</td><td style="font-family:'Amiri',serif; font-size:13pt; direction:rtl; text-align:right;">${p.arabic}</td>`;
            pageHtml += `<td>${letter}. ${isKey ? p.hinglish : q.shuffledHinglish[pi]}</td><td style="width:50px; text-align:center; font-weight:700;">${ansLetter}</td></tr>`;
          });
          pageHtml += '</table>';
        });
      }

      if (tfs.length > 0) {
        pageHtml += `<div class="section-hdr"><span>Section D — True or False (Sahi ya Ghalat)</span><span>${tfs.length} Marks</span></div>`;
        tfs.forEach((q, idx) => {
          const hl = isKey ? ' ans-highlight' : '';
          const tfVal = isKey ? (q.correct === 'true' ? 'TRUE' : 'FALSE') : '';
          pageHtml += `<div class="tf-row"><div><span style="font-weight:700; font-size:8.5pt; color:#1B4332;">Q${idx + 1}.</span>`;
          pageHtml += `<span class="q-ar" style="margin:0 8px;">${q.arabic}</span><span>means: <strong>"${q.statement}"</strong></span></div>`;
          pageHtml += `<div class="tf-box${hl}">${tfVal}</div></div>`;
        });
      }

      if (writings.length > 0) {
        pageHtml += `<div class="section-hdr"><span>Section E — Arabic Writing (Arabic Pehchanen)</span><span>${writings.length * 2} Marks</span></div>`;
        pageHtml += '<div class="ar-write-grid">';
        writings.forEach((q, idx) => {
          pageHtml += `<div class="ar-write-card"><div style="font-weight:700; font-size:8.5pt; color:#1B4332; margin-bottom:4px;">Q${idx + 1}. "${q.hinglish}"</div>`;
          pageHtml += '<div style="font-size:8pt; color:#6b7280; margin-bottom:4px;">Chunein sahi Arabic:</div><div class="mcq-opts" style="direction:rtl;">';
          q.options.forEach((opt, oi) => {
            const hl = isKey && opt === q.correct ? ' ans-highlight' : '';
            pageHtml += `<div class="mcq-opt${hl}" style="font-family:'Amiri',serif; font-size:12pt; text-align:right;">${'ABCD'[oi]}. ${opt}</div>`;
          });
          pageHtml += '</div></div>';
        });
        pageHtml += '</div>';
      }

      pageHtml += summaryCardHtml;

      pageHtml += `<div class="no-print" style="margin-top:24px; display:flex; justify-content:center; gap:10px;">
        <button onclick="window.print()" style="padding:10px 24px; background:#1B4332; color:#fff; border:none; border-radius:6px; font-size:1rem; cursor:pointer; font-weight:700;">🖨 Print / Save PDF</button>
        ${keyBtnHtml}
        <button onclick="window.close()" style="padding:10px 20px; background:#eee; border:none; border-radius:6px; font-size:1rem; cursor:pointer;">Close</button>
      </div>`;

      pageHtml += '</body></html>';

      printWin.document.write(pageHtml);
      printWin.document.close();
      printWin.focus();
    };


    // ═══════════════════════════════════════════════════════════════
    // FIREBASE SYNC MODULE
    // Handles: Firestore multi-device sync for starred, custom answers,
    // exam history, student profiles. Admin reads all student data.
    // ═══════════════════════════════════════════════════════════════

    // ── Device ID (stable UUID per browser) ──
    function getDeviceId() {
      let id = localStorage.getItem('muallim_device_id');
      if (!id) {
        id = 'dev_' + crypto.randomUUID();
        localStorage.setItem('muallim_device_id', id);
      }
      return id;
    }

    // ── Firebase state ──
    let _db = null;          // Firestore instance
    let _fbApp = null;       // Firebase App instance
    let _fbConfig = null;    // config object
    let _syncDebounceTimer = null;

    const FIREBASE_MODULES = {
      app:       'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js',
      firestore: 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js',
      auth:      'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js',
    };

    // ── Load + init Firebase ──
    async function loadFirebase(config) {
      const { initializeApp, getApps } = await import(FIREBASE_MODULES.app);
      const {
        getFirestore, doc, setDoc, getDoc, getDocs,
        collection, updateDoc, serverTimestamp, onSnapshot
      } = await import(FIREBASE_MODULES.firestore);
      const {
        getAuth, signInWithEmailAndPassword, signOut,
        onAuthStateChanged, createUserWithEmailAndPassword,
        sendPasswordResetEmail, updatePassword
      } = await import(FIREBASE_MODULES.auth);

      // Prevent double-init
      const apps = getApps();
      _fbApp = apps.length > 0 ? apps[0] : initializeApp(config);
      _db = getFirestore(_fbApp);
      const _auth = getAuth(_fbApp);

      // Expose Firestore helpers on module scope
      window._FS = { doc, setDoc, getDoc, getDocs, collection, updateDoc, serverTimestamp, onSnapshot };
      window._FSDB = _db;
      // Expose Auth helpers
      window._FA = { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
                     createUserWithEmailAndPassword, sendPasswordResetEmail, updatePassword };
      window._AUTH = _auth;

      // ── Auth state observer ──
      onAuthStateChanged(_auth, async (user) => {
        if (!user) {
          App.currentUser = null;
          _hideAdminTab();
          _updateAccountUI(null);
          // Show login modal unless guest mode was chosen for this session
          if (!sessionStorage.getItem('muallim_guest_mode')) {
            const lm = document.getElementById('login-modal');
            if (lm && lm.showModal) { try { lm.showModal(); } catch(e) {} }
          }
        } else {
          // Close login modal
          const lm = document.getElementById('login-modal');
          if (lm && lm.open) lm.close();

          // Fetch role from Firestore
          let role = 'student', displayName = user.email;
          try {
            const { doc: d2, getDoc: gd2 } = window._FS;
            const userSnap = await gd2(d2(_db, 'users', user.uid));
            if (userSnap.exists()) {
              const ud = userSnap.data();
              role = ud.role || 'student';
              displayName = ud.name || user.email;
            }
          } catch(e) { console.warn('[Auth] Could not fetch user doc:', e); }

          App.currentUser = { uid: user.uid, email: user.email, role, name: displayName };

          // Show/hide admin tab
          if (role === 'admin') _showAdminTab();
          else _hideAdminTab();

          _updateAccountUI(App.currentUser);

          // Load user data from user_data/{uid}
          _loadUserDataFromFirestore(user.uid);
        }
      });

      return true;
    }

    function _showAdminTab() {
      const t = document.getElementById('admin-nav-tab');
      if (t) t.style.display = '';
    }
    function _hideAdminTab() {
      const t = document.getElementById('admin-nav-tab');
      if (t) t.style.display = 'none';
    }

    function _updateAccountUI(user) {
      const loggedOutView = document.getElementById('auth-logged-out-view');
      const loggedInView  = document.getElementById('auth-logged-in-view');
      const userDisplay   = document.getElementById('auth-user-display');
      const userRole      = document.getElementById('auth-user-role');
      const adminPanel    = document.getElementById('admin-unlocked-view');

      if (!user) {
        if (loggedOutView) loggedOutView.style.display = 'block';
        if (loggedInView)  loggedInView.style.display = 'none';
        if (adminPanel)    adminPanel.style.display = 'none';
      } else {
        if (loggedOutView) loggedOutView.style.display = 'none';
        if (loggedInView)  loggedInView.style.display = 'block';
        if (userDisplay)   userDisplay.textContent = (user.name || user.email);
        if (userRole)      userRole.textContent = user.role === 'admin' ? 'Role: Teacher / Admin 🛡' : 'Role: Student';

        if (user.role === 'admin') {
          if (adminPanel) adminPanel.style.display = 'block';
          if (typeof App.refreshAdminStudents === 'function') App.refreshAdminStudents();
        } else {
          if (adminPanel) adminPanel.style.display = 'none';
        }
      }
    }

    async function _loadUserDataFromFirestore(uid) {
      if (!_db || !window._FS) return;
      try {
        const { doc, getDoc } = window._FS;
        const snap = await getDoc(doc(_db, 'user_data', uid));
        if (snap.exists()) {
          const data = snap.data();
          // Restore starred
          if (Array.isArray(data.starred)) {
            favourites = data.starred;
            try { localStorage.setItem('muallim_favs', JSON.stringify(favourites)); } catch(e) {}
            updateStarredCountBadge();
          }
          // Restore custom answers
          if (data.customAnswers && typeof data.customAnswers === 'object') {
            customAnswers = data.customAnswers;
            try { localStorage.setItem('muallim_custom_answers', JSON.stringify(customAnswers)); } catch(e) {}
          }
          // Restore bookmark
          if (data.bookmark) {
            try { localStorage.setItem('muallim_bookmark', JSON.stringify(data.bookmark)); } catch(e) {}
          }
        }
      } catch(e) { console.warn('[Auth] Could not load user_data:', e); }
    }

    // ── Firebase Config: Save / Clear / Toggle panel ──
    App.saveFirebaseConfig = async function() {
      const raw = document.getElementById('firebase-config-input').value.trim();
      if (!raw) { showToast('Paste your Firebase config first'); return; }
      let config;
      try {
        // Allow both JSON object and JS object literals
        config = JSON.parse(raw.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3'));
      } catch(e) {
        showToast('Invalid config JSON: ' + e.message); return;
      }
      if (!config.apiKey || !config.projectId) {
        showToast('Config missing apiKey or projectId'); return;
      }
      localStorage.setItem('muallim_firebase_config', JSON.stringify(config));
      _fbConfig = config;
      showToast('Connecting to Firebase…');
      await App.initFirebase();
    };

    App.clearFirebaseConfig = function() {
      if (!confirm('Remove Firebase config? Sync will stop (local data stays intact).')) return;
      localStorage.removeItem('muallim_firebase_config');
      _db = null; _fbApp = null; _fbConfig = null;
      updateFirebaseStatusBadge(false);
      showToast('Firebase config removed');
    };

    App.toggleFirebaseConfigPanel = function() {
      const panel = document.getElementById('firebase-config-panel');
      if (!panel) return;
      const isOpen = panel.style.display !== 'none';
      panel.style.display = isOpen ? 'none' : 'block';
      if (!isOpen) {
        // Pre-fill if config exists
        const saved = localStorage.getItem('muallim_firebase_config');
        if (saved) document.getElementById('firebase-config-input').value = saved;
      }
    };

    const DEFAULT_FIREBASE_CONFIG = {
      apiKey: "AIzaSyAjBnuLSADlXBZ7OY7daQ7mOta3VaHXVNg",
      authDomain: "muallim-123.firebaseapp.com",
      projectId: "muallim-123",
      storageBucket: "muallim-123.firebasestorage.app",
      messagingSenderId: "226964645326",
      appId: "1:226964645326:web:0a219c95dad277b4cd379f"
    };

    // ── Initialize Firebase on load (default or saved config) ──
    App.initFirebase = async function() {
      let config = null;
      const savedConfig = localStorage.getItem('muallim_firebase_config');
      if (savedConfig) {
        try { config = JSON.parse(savedConfig); } catch(e) {}
      }
      if (!config) {
        config = DEFAULT_FIREBASE_CONFIG;
      }
      _fbConfig = config;
      try {
        showSyncIndicator('Connecting…');
        await loadFirebase(_fbConfig);
        updateFirebaseStatusBadge(true);
        console.log('[Firebase] Connected successfully');
      } catch(e) {
        updateFirebaseStatusBadge(false);
        console.warn('[Firebase] Init failed:', e);
      }
    };

    function updateFirebaseStatusBadge(connected) {
      const badge = document.getElementById('firebase-status-badge');
      if (!badge) return;
      if (connected) {
        badge.className = 'firebase-status connected';
        badge.textContent = '☁ Firebase connected';
      } else {
        badge.className = 'firebase-status disconnected';
        badge.textContent = '⚡ Firebase not configured';
      }
    }

    function showSyncIndicator(msg) {
      const el = document.getElementById('sync-indicator');
      if (!el) return;
      el.textContent = msg || '☁ Synced';
      el.classList.add('show');
      clearTimeout(el._t);
      el._t = setTimeout(() => el.classList.remove('show'), 2500);
    }

    // ── Firestore document paths ──
    function studentDocPath() {
      return `muallim_students/${getDeviceId()}`;
    }

    // ── Full sync: push local → Firestore ──
    async function syncAllToFirestore() {
      if (!_db || !window._FS) return;
      const { doc, setDoc, serverTimestamp } = window._FS;
      const studentName = localStorage.getItem('muallim_student_name') || 'Anonymous';
      const deviceId = getDeviceId();

      try {
        // Write student profile + all data in one document
        const examHistory = JSON.parse(localStorage.getItem('muallim_exam_history') || '[]');
        const favs = JSON.parse(localStorage.getItem('muallim_favs') || '[]');
        const custom = JSON.parse(localStorage.getItem('muallim_custom_answers') || '{}');

        const payload = {
          deviceId,
          name: studentName,
          lastSeen: serverTimestamp(),
          currentStage,
          currentLesson,
          // Stars: array of { key, arabic, hinglish, stage, lesson }
          starred: favs,
          // Custom answers: key → answer string
          customAnswers: custom,
          // Exam history: array of result objects
          examHistory: examHistory.slice(-50), // keep last 50
          // Best score
          bestScore: examHistory.length > 0 ? Math.max(...examHistory.map(h => h.score)) : null,
        };

        await setDoc(doc(_db, studentDocPath()), payload, { merge: true });
        showSyncIndicator('☁ Synced');
      } catch(e) {
        console.warn('[Firebase] syncAll error:', e);
      }
    }

    // ── Debounced sync (called after every data change) ──
    function debouncedSync(delayMs) {
      delayMs = delayMs || 1500;
      clearTimeout(_syncDebounceTimer);
      _syncDebounceTimer = setTimeout(syncAllToFirestore, delayMs);
    }

    // (sync called directly from core toggleStarInPlace / saveCustomAnswer)

    // (saveStudentName handles sync directly)

    // ── Admin: Read ALL students from Firestore ──
    App.refreshAdminStudents = async function() {
      const mount = document.getElementById('admin-students-mount');
      if (!mount) return;

      // If Firebase not configured, show local data only
      if (!_db || !window._FS) {
        renderAdminLocalOnly(mount);
        return;
      }

      mount.innerHTML = '<div style="text-align:center; padding:12px; color:var(--text-muted);">Loading…</div>';

      try {
        const { collection, getDocs } = window._FS;
        const snap = await getDocs(collection(_db, 'muallim_students'));
        const students = [];
        snap.forEach(doc => students.push({ id: doc.id, ...doc.data() }));

        if (students.length === 0) {
          mount.innerHTML = '<div style="text-align:center; padding:12px; color:var(--text-muted);">No students synced yet</div>';
          return;
        }

        // Sort by lastSeen descending
        students.sort((a, b) => {
          const at = a.lastSeen?.toMillis?.() || 0;
          const bt = b.lastSeen?.toMillis?.() || 0;
          return bt - at;
        });

        mount.innerHTML = students.map(s => buildAdminStudentCard(s)).join('');
      } catch(e) {
        mount.innerHTML = `<div style="color:#EF4444; padding:8px; font-size:0.8rem;">Error: ${e.message}</div>`;
      }
    };

    function renderAdminLocalOnly(mount) {
      const name = localStorage.getItem('muallim_student_name') || 'Anonymous';
      const examHistory = JSON.parse(localStorage.getItem('muallim_exam_history') || '[]');
      const favs = JSON.parse(localStorage.getItem('muallim_favs') || '[]');
      const custom = JSON.parse(localStorage.getItem('muallim_custom_answers') || '{}');
      const best = examHistory.length > 0 ? Math.max(...examHistory.map(h => h.score)) : null;

      const student = {
        name, deviceId: getDeviceId(),
        starred: favs, customAnswers: custom, examHistory,
        bestScore: best, lastSeen: null, _localOnly: true
      };
      mount.innerHTML = buildAdminStudentCard(student);
      mount.insertAdjacentHTML('afterbegin',
        '<div style="font-size:0.72rem; color:var(--accent-emerald); margin-bottom:8px;">⚠ Local data only — configure Firebase for multi-device</div>'
      );
    }

    function buildAdminStudentCard(s) {
      const name = s.name || 'Anonymous';
      const deviceShort = (s.deviceId || '').slice(-6);
      const lastSeen = s.lastSeen?.toDate?.() ? new Date(s.lastSeen.toDate()).toLocaleDateString() : (s._localOnly ? 'this device' : 'unknown');
      const starCount = (s.starred || []).length;
      const customCount = Object.keys(s.customAnswers || {}).length;
      const examCount = (s.examHistory || []).length;
      const best = s.bestScore != null ? s.bestScore + '%' : '—';

      return `
        <div class="admin-student-card">
          <div class="admin-student-card-header">
            <span class="admin-student-name">👤 ${name}</span>
            <span class="admin-student-badge">#${deviceShort} · ${lastSeen}</span>
          </div>
          <div class="admin-data-row">
            <span class="admin-data-chip starred">⭐ ${starCount} starred</span>
            <span class="admin-data-chip custom">✏ ${customCount} custom</span>
            <span class="admin-data-chip exam">🎓 ${examCount} exams · best ${best}</span>
          </div>
          ${examCount > 0 ? `
            <div style="margin-top:6px; font-size:0.75rem; color:var(--text-muted);">
              Last exam: ${s.examHistory.slice(-1)[0]?.grade || '—'} — 
              ${s.examHistory.slice(-1)[0]?.score || 0}% on 
              ${new Date(s.examHistory.slice(-1)[0]?.date || Date.now()).toLocaleDateString()}
            </div>` : ''}
          ${starCount > 0 ? `
            <details style="margin-top:6px;">
              <summary style="font-size:0.72rem; color:var(--accent-emerald); cursor:pointer; font-weight:700;">
                View ${starCount} starred words
              </summary>
              <div style="margin-top:6px; display:flex; flex-wrap:wrap; gap:4px;">
                ${(s.starred || []).map(f =>
                  `<span style="font-family:var(--font-arabic); font-size:0.9rem; padding:2px 6px; background:rgba(251,191,36,0.1); border-radius:6px;" title="${f.hinglish || ''}">${f.arabic}</span>`
                ).join('')}
              </div>
            </details>` : ''}
          ${customCount > 0 ? `
            <details style="margin-top:4px;">
              <summary style="font-size:0.72rem; color:#4338CA; cursor:pointer; font-weight:700;">
                View ${customCount} custom answers
              </summary>
              <table style="margin-top:6px; width:100%; border-collapse:collapse; font-size:0.72rem;">
                <tr style="color:var(--text-muted);"><th style="text-align:left; padding:2px 4px;">Arabic key</th><th style="text-align:left; padding:2px 4px;">Custom answer</th></tr>
                ${Object.entries(s.customAnswers || {}).map(([k, v]) =>
                  `<tr><td style="padding:2px 4px; color:var(--text-muted);">${k}</td><td style="padding:2px 4px; color:var(--text-primary); font-weight:600;">${v}</td></tr>`
                ).join('')}
              </table>
            </details>` : ''}
        </div>`;
    }

    // ── Admin: Send broadcast notification ──
    App.sendBroadcast = async function() {
      const msg = document.getElementById('broadcast-msg-input')?.value?.trim();
      if (!msg) { showToast('Type a message first'); return; }
      if (!_db || !window._FS) {
        showToast('Firebase must be configured to send broadcasts');
        return;
      }
      try {
        const { doc, setDoc, serverTimestamp } = window._FS;
        await setDoc(doc(_db, 'muallim_broadcasts', `bc_${Date.now()}`), {
          message: msg,
          sentAt: serverTimestamp(),
          sentBy: localStorage.getItem('muallim_student_name') || 'Teacher'
        });
        document.getElementById('broadcast-msg-input').value = '';
        showToast('📢 Broadcast sent!');
      } catch(e) {
        showToast('Error sending broadcast: ' + e.message);
      }
    };

    // ── Listen for incoming broadcasts (students) ──
    async function listenForBroadcasts() {
      if (!_db || !window._FS) return;
      const { collection, onSnapshot } = window._FS;
      try {
        onSnapshot(collection(_db, 'muallim_broadcasts'), snap => {
          snap.docChanges().forEach(change => {
            if (change.type === 'added') {
              const data = change.doc.data();
              // Only show if message is new (within last 5 minutes)
              const ageMs = Date.now() - (data.sentAt?.toMillis?.() || 0);
              if (ageMs < 5 * 60 * 1000) {
                showToast('📢 ' + data.message, 6000);
              }
            }
          });
        });
      } catch(e) {
        console.warn('[Firebase] broadcast listener error:', e);
      }
    }

    // (finishExam handles sync via saveExamResult directly)

    // ── Auto-init Firebase on DOMContentLoaded ──
    // (called from the patched DOMContentLoaded listener below)
    function initFirebaseOnLoad() {
      App.initFirebase().then(() => {
        if (_db) listenForBroadcasts();
      });
    }

      Object.assign(App, {
        openCustomAnswersModal,
        closeCustomAnswersModal,
        init,
        setTheme,
        setMode,
        setFontSize,
        setAudioSpeed,
        speakArabic,
        toggleStarInPlace,
        isStarred,
        openCustomEditor,
        saveCustomAnswer,
        deleteCustomAnswer,
        loadLesson,
        selectPickerStage,
        pickLesson,
        navigatePrevLesson,
        navigateNextLesson,
        openSpinner,
        setSpinnerPool,
        toggleSpinnerReveal,
        nextSpinnerCard,
        playCurrentSpinnerAudio,
        openFavourites,
        openSearchModal,
        performSearch,
        jumpToSearchLesson,
        openExportDialog,
        doExport,
        importDataBackup,
        loadBookmark,
        initStudentName,
        // backward-compat aliases (Fix 1b)
        openSearch: openSearchModal,
        openDrillSpinner: openSpinner,
        openExam: App.openExam || function(){},
        openExamConfig: App.openExam || function(){},
        // Firebase Auth exports (Phase 4)
        doLogin: App.doLogin || function(){},
        doLogout: App.doLogout || function(){},
        forgotPassword: App.forgotPassword || function(){},
        changePassword: App.changePassword || function(){},
        refreshAdminStudents: App.refreshAdminStudents || function(){},
        openLoginModal: App.openLoginModal || function(){},
        closeLoginModal: App.closeLoginModal || function(){},
        openAdminDashboard: App.openAdminDashboard || function(){},
        initFirebaseOnLoad,
        currentUser: null
      });
      return App;
    })();

    document.addEventListener('DOMContentLoaded', async function() {
      try {
        await loadMetadata();
        await loadUnit(1);
      } catch (e) {
        console.error("Failed to load initial data", e);
      }
      if (window.App && typeof window.App.init === 'function') {
        window.App.init();
      }
      setTimeout(() => {
        if (window.App && typeof window.App.initStudentName === 'function') window.App.initStudentName();
        if (window.App && typeof window.App.loadBookmark === 'function') window.App.loadBookmark();
      }, 100);

      // Wire quick-action buttons in hamburger menu
      function qb(id, fn) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('click', function() {
          var pop = document.getElementById('settings-popover');
          if (pop && pop.hidePopover) pop.hidePopover();
          fn();
        });
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./sw.js').catch(function(err) {
        console.warn('[Muallim] ServiceWorker registration failed:', err);
      });
    }