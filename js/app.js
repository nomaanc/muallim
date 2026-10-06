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
      try {
        const raw = lsGet('muallim_custom_translations', null);
        if (raw) {
          customAnswers = JSON.parse(raw);
        } else {
          const old = lsGet('muallim_custom_answers', null);
          if (old) {
            customAnswers = JSON.parse(old);
            lsSet('muallim_custom_translations', old);
          }
        }
      } catch(e) { customAnswers = {}; }
      let activeEditKey = null;
      let spinnerMode = 'starred'; // 'starred' or 'lesson'
      let spinnerPool = [];
      let spinnerIndex = 0;
      let isSpinnerRevealed = false;
      var _sessionStart = 0;
      var _sessionLessonKey = '';

      // ── i18n Engine ──
      let currentLang = lsGet('muallim_lang', 'hinglish') || 'hinglish';

      const LANG_FALLBACK = {
        hinglish: [], en: ['hinglish'], ur: ['hinglish'], hi: ['hinglish'],
        bn: ['en','hinglish'], ko: ['en','hinglish'], zh: ['en','hinglish'], es: ['en','hinglish']
      };

      function getTranslation(item) {
        if (!item) return '';
        if (item.translations && item.translations[currentLang]) {
          return item.translations[currentLang];
        }
        const chain = LANG_FALLBACK[currentLang] || ['hinglish'];
        for (const fb of chain) {
          if (item.translations && item.translations[fb]) return item.translations[fb];
        }
        if (typeof item === 'string') return item;
        return item.hinglish || '';
      }

      function setLang(lang) {
        currentLang = lang;
        App.currentLang = lang;
        lsSet('muallim_lang', lang);
        const sel = document.getElementById('setting-lang-select');
        if (sel) sel.value = lang;
        renderCurrentLesson();
      }

      App.getTranslation = getTranslation;
      App.currentLang = currentLang;
      App.setLang = setLang;

      function migrateS4L18Keys() {
        try {
          if (lsGet('muallim_s4l18_migrated', 'false') === 'true') return;
          let changedFavs = false;
          favourites = favourites.map(f => {
            if (f && f.key && f.key.startsWith('S4L18_')) {
              changedFavs = true;
              const newKey = f.key.replace('S4L18_s0_', 'S4L17_s0_').replace('S4L18_s1_', 'S4L17_s1_').replace('S4L18_num_', 'S4L17_s1_num_');
              return { ...f, key: newKey, stage: 4, lesson: 17 };
            }
            if (f && f.stage === 4 && f.lesson === 18) {
              changedFavs = true;
              return { ...f, lesson: 17 };
            }
            return f;
          });
          if (changedFavs) {
            lsSet('muallim_favs', JSON.stringify(favourites));
          }

          let changedCustom = false;
          const newCustom = {};
          for (const k in customAnswers) {
            if (k.startsWith('S4L18_')) {
              changedCustom = true;
              const newKey = k.replace('S4L18_s0_', 'S4L17_s0_').replace('S4L18_s1_', 'S4L17_s1_').replace('S4L18_num_', 'S4L17_s1_num_');
              newCustom[newKey] = customAnswers[k];
            } else {
              newCustom[k] = customAnswers[k];
            }
          }
          if (changedCustom) {
            customAnswers = newCustom;
            lsSet('muallim_custom_translations', JSON.stringify(customAnswers));
          }

          const bmRaw = lsGet('muallim_bookmark', null);
          if (bmRaw) {
            try {
              const bm = JSON.parse(bmRaw);
              if (bm && bm.stage === 4 && bm.lesson === 18) {
                bm.lesson = 17;
                lsSet('muallim_bookmark', JSON.stringify(bm));
              }
            } catch(e) {}
          }

          lsSet('muallim_s4l18_migrated', 'true');
        } catch(e) {
          console.warn('[Muallim] S4L18 migration error:', e);
        }
      }

      function init() {
        migrateS4L18Keys();
        setupEventListeners();
        setAudioSpeed(audioSpeed, false);
        // URL parameter support for direct lesson deep-linking (?unit=X&lesson=Y or ?u=X&l=Y)
        var urlParams = new URLSearchParams(window.location.search);
        var urlUnit = parseInt(urlParams.get('unit') || urlParams.get('u'), 10);
        var urlLesson = parseInt(urlParams.get('lesson') || urlParams.get('l'), 10);
        var _bmLoaded = false;
        if (urlUnit && urlLesson) {
          loadLesson(urlUnit, urlLesson);
          _bmLoaded = true;
        }

        // Auto-resume bookmark on app open if no URL parameter
        if (!_bmLoaded) {
          var _bmAutoRaw = null;
          try { _bmAutoRaw = localStorage.getItem('muallim_bookmark'); } catch(e) {}
          if (_bmAutoRaw) {
            try {
              var _bmAuto = JSON.parse(_bmAutoRaw);
              if (_bmAuto && _bmAuto.stage && _bmAuto.lesson) {
                loadLesson(_bmAuto.stage, _bmAuto.lesson);
                _bmLoaded = true;
              }
            } catch(e) {}
          }
        }
        if (!_bmLoaded) loadLesson(1, 1);
        populateStageTabs();
        updateStarredCountBadge();
        const langSel = document.getElementById('setting-lang-select');
        if (langSel) langSel.value = currentLang;
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
        const isNowStarred = idx < 0;
        if (isNowStarred) {
          const km = (itemKey || '').match(/^S(\d+)L(\d+)/);
          const st = km ? parseInt(km[1]) : currentStage;
          const ls = km ? parseInt(km[2]) : currentLesson;
          favourites.push({ key: itemKey, arabic, hinglish: defaultHinglish, stage: st, lesson: ls });
        } else {
          favourites.splice(idx, 1);
        }
        if (btnElement) {
          btnElement.classList.toggle('starred', isNowStarred);
          btnElement.setAttribute('aria-pressed', isNowStarred ? 'true' : 'false');
          btnElement.setAttribute('aria-label', isNowStarred ? 'Starred' : 'Star this item');
          btnElement.innerHTML = isNowStarred ? '★' : '☆';
        }
        localStorage.setItem('muallim_favs', JSON.stringify(favourites));
        updateStarredCountBadge();
        if (typeof debouncedSync === 'function') debouncedSync();
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
        lsSet('muallim_custom_translations', JSON.stringify(customAnswers));
        const modal = document.getElementById('custom-edit-modal');
        if (modal && modal.close) modal.close();
        renderCurrentLesson();
        if (typeof debouncedSync === 'function') debouncedSync(500);
        const customModal = document.getElementById('custom-answers-modal');
        if (customModal && customModal.open && typeof renderCustomAnswersList === 'function') {
          renderCustomAnswersList();
        }
      }

      function deleteCustomAnswer(targetKey) {
        const keyToDelete = targetKey || activeEditKey;
        if (!keyToDelete) return;
        delete customAnswers[keyToDelete];
        lsSet('muallim_custom_translations', JSON.stringify(customAnswers));
        if (!targetKey) {
          const modal = document.getElementById('custom-edit-modal');
          if (modal && modal.close) modal.close();
        }
        renderCurrentLesson();
        if (typeof debouncedSync === 'function') debouncedSync(500);
        const customModal = document.getElementById('custom-answers-modal');
        if (customModal && customModal.open && typeof renderCustomAnswersList === 'function') {
          renderCustomAnswersList();
        }
      }

      async function loadLesson(stageId, lessonId) {
        stageId = parseInt(stageId) || 1;
        lessonId = parseInt(lessonId) || 1;
        // Flush previous lesson session time before switching
        flushSessionTime();
        currentStage = stageId;
        currentLesson = lessonId;
        const stageKey = `Stage${stageId}`;
        if (!bookData.stages[stageKey]) {
          await loadUnit(stageId);
        }
        loadBookmark();
        renderCurrentLesson();
        const lbl = document.getElementById('current-lesson-label');
        if (lbl) lbl.textContent = `Unit ${stageId} Lesson ${lessonId}`;
        document.title = `Muallim ul-Qur'an — Unit ${stageId} Lesson ${lessonId}`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Record session start for this lesson
        _sessionStart = Date.now();
        _sessionLessonKey = 'S' + stageId + 'L' + lessonId;
      }

      function renderDualAnswerHtml(itemKey, itArabic, origTranslation) {
        const customVal = customAnswers[itemKey];
        const hasCustom = !!customVal;
        const escAr = (itArabic || '').replace(/'/g, "\\'");
        const escHi = (origTranslation || '').replace(/'/g, "\\'");

        let rowsHtml = `<div class="answer-row orig-text">${origTranslation || ''}</div>`;
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
            <div class="lesson-banner-meta">Unit ${currentStage} • Page ${lesson.book_page || lesson.page_start || 1}</div>
          </div>
          <div id="grammar-visual-mount"></div>
          <div style="display:flex; justify-content:center; margin:-4px 0 16px;">
            <button class="btn-primary" style="padding:6px 16px; font-size:0.82rem; border-radius:20px; font-weight:700; box-shadow:0 2px 8px rgba(27,67,50,0.18); cursor:pointer;" onclick="App.openGrammarExerciseModal()">
              ⚡ Practice Lesson Exercises (5 Sawalat)
            </button>
          </div>
        `;

        (lesson.sections || []).forEach((sec, sIdx) => {
          const secType = sec.type;
          const d = sec.data || {};

          if (secType === 'hero_header') {
            const heroAr = d.arabic_combined || d.after_arabic || d.arabic_after || d.transformed_word || d.arabic || d.title_ar || d.arabic_word || d.before_arabic || d.arabic_before || d.word || '';
            const heroHi = getTranslation(d) || d.hinglish_combined || d.after_hinglish || d.hinglish_after || d.transformed_meaning || d.hinglish || d.title_en || d.hinglish_word || d.before_hinglish || d.hinglish_before || d.meaning || d.subtitle || '';
            if (heroAr || heroHi) {
              html += `
                <div class="hero-section">
                  ${heroAr ? `<div class="hero-arabic">${heroAr}</div>` : ''}
                  ${heroHi ? `<div class="hero-hinglish">${heroHi}</div>` : ''}
                </div>
              `;
            }
          } else if (secType === 'rule_paragraph') {
            html += `<div class="rule-card">${d.title ? `<div class="rule-title">${d.title}</div>` : ''}${d.text || ''}</div>`;
          } else if (secType === 'rule_paragraph_hinglish') {
            html += `<div class="rule-block-hinglish">`;
            if (d.title) html += `<div class="rule-title">${d.title}</div>`;
            if (d.text) html += `<div class="rule-text">${d.text}</div>`;
            html += `</div>`;
          } else if (secType === 'grace_box') {
            html += `<div class="grace-card">✨ ${d.text}</div>`;
          } else if (secType === 'intro_table') {
            const tbl = d;
            let tableHtml = '<div class="intro-table-wrap"><table class="intro-table">';
            if (tbl.caption) tableHtml += '<caption>' + tbl.caption + '</caption>';
            if (tbl.headers && tbl.headers.length) {
              tableHtml += '<thead><tr>' + tbl.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
            }
            tableHtml += '<tbody>';
            (tbl.rows || []).forEach(row => {
              const cells = Array.isArray(row) ? row : Object.values(row);
              tableHtml += '<tr>' + cells.map(c => '<td>' + c + '</td>').join('') + '</tr>';
            });
            tableHtml += '</tbody></table></div>';
            html += tableHtml;
          } else if (secType === 'fill_in_exercise') {
            html += '<div class="fill-exercise-wrap">';
            if (d.title) html += '<h3 class="fill-title">' + d.title + '</h3>';
            if (d.instructions) html += '<p class="fill-instructions">' + d.instructions + '</p>';
            (d.items || []).forEach((it, iIdx) => {
              const itemKey = `S${currentStage}L${currentLesson}_fill_${it.id || iIdx}`;
              const starred = isStarred(itemKey);
              const escAr = (it.arabic || '').replace(/'/g, "\\'");
              const origHi = getTranslation(it);
              const escHi = origHi.replace(/'/g, "\\'");
              const answerHtml = renderDualAnswerHtml(itemKey, it.arabic || '', origHi);
              html += `<div class="fill-card">
                <div class="fill-num">${it.sentence_number || (iIdx+1)}</div>
                <div class="fill-arabic" dir="rtl">${it.arabic_markup || it.arabic || ''}</div>
                ${answerHtml}
                <button class="card-action-btn ${starred ? 'starred' : ''}" onclick="App.toggleStarInPlace(this, '${itemKey}', '${escAr}', '${escHi}')">${starred ? '★' : '☆'}</button>
              </div>`;
            });
            html += '</div>';
          } else if (secType === 'grid' || secType === 'three_col_list' || secType === 'waw_grid') {
            const cols = d.columns || 3;
            html += `<div class="bidi-grid cols-${cols}">`;
            (d.items || []).forEach((it, iIdx) => {
              const itemKey = `S${currentStage}L${currentLesson}_s${sIdx}_${iIdx}`;
              const starred = isStarred(itemKey);
              const escAr = (it.arabic || '').replace(/'/g, "\\'");
              const itemHi = getTranslation(it);
              const escHi = itemHi.replace(/'/g, "\\'");
              html += `
                <div class="vocab-card">
                  <div class="card-top" data-item-id="${itemKey}">
                    <button class="card-action-btn" onclick="App.speakArabic('${escAr}')">🔊</button>
                    <button class="card-action-btn ${starred ? 'starred' : ''}" aria-pressed="${starred ? 'true' : 'false'}" aria-label="${starred ? 'Starred' : 'Star this item'}" onclick="App.toggleStarInPlace(this, '${itemKey}', '${escAr}', '${escHi}')">${starred ? '★' : '☆'}</button>
                    ${bmSvgHtml(itemKey)}
                  </div>
                  <div class="arabic-text" style="overflow-wrap:break-word;">${it.arabic_markup || it.arabic || ''}</div>
                  ${renderDualAnswerHtml(itemKey, it.arabic, itemHi)}
                </div>
              `;
            });
            html += `</div>`;
          } else if (secType === 'two_col_numbered_list') {
            html += `<div class="bidi-grid cols-2">`;
            const items = d.items || [];
            let i = 0;
            while (i < items.length) {
              const it = items[i];
              if (it.display_mode === 'paired' && it.pair_role === 'root' && items[i + 1]?.pair_role === 'derived') {
                const rootItem = it;
                const derivedItem = items[i + 1];
                const rootKey = `S${currentStage}L${currentLesson}_num_${rootItem.id || i}`;
                const derivedKey = `S${currentStage}L${currentLesson}_num_${derivedItem.id || (i + 1)}`;
                const rootStarred = isStarred(rootKey);
                const derivedStarred = isStarred(derivedKey);
                const rootEscAr = (rootItem.arabic || '').replace(/'/g, "\\'");
                const rootHi = getTranslation(rootItem);
                const rootEscHi = rootHi.replace(/'/g, "\\'");
                const derivedEscAr = (derivedItem.arabic || '').replace(/'/g, "\\'");
                const derivedHi = getTranslation(derivedItem);
                const derivedEscHi = derivedHi.replace(/'/g, "\\'");
                
                let suffixHtml = '';
                if (derivedItem.arabic_markup) {
                  suffixHtml = derivedItem.arabic_markup;
                } else if (derivedItem.arabic_suffix) {
                  suffixHtml = `<span class="arabic-root-part">${derivedItem.arabic_root || ''}</span><span class="nonroot animate">${derivedItem.arabic_suffix}</span>`;
                } else {
                  suffixHtml = `<span class="arabic-root-part">${derivedItem.arabic || ''}</span>`;
                }
                
                html += `
                  <div class="paired-card" style="${rootItem.full_width ? 'grid-column: 1 / -1;' : ''}">
                    <div class="paired-card__arabic" dir="rtl">
                      <span class="arabic-root">${rootItem.arabic_markup || rootItem.arabic || ''}</span>
                      <svg class="morph-arrow animate" viewBox="0 0 80 24" width="80" height="24" aria-hidden="true">
                        <path class="arrow-track" d="M70,12 L10,12" stroke="var(--divider-gold)" stroke-width="2" fill="none" stroke-dasharray="60" stroke-dashoffset="60"/>
                        <polygon class="arrow-head" points="18,7 8,12 18,17" fill="var(--divider-gold)"/>
                      </svg>
                      <span class="arabic-derived">${suffixHtml}</span>
                    </div>
                    <div class="paired-card__hinglish">
                      <span>${rootHi}</span>
                      <span class="hin-arrow">➜</span>
                      <span>${derivedHi}</span>
                    </div>
                    <div class="card-top" style="position: relative; margin-top: 1rem; border-top: 1px solid var(--divider-light); padding-top: 0.5rem; display: flex; justify-content: space-between;">
                      <div style="display:flex; gap:0.5rem; align-items:center;">
                        <button class="card-action-btn" onclick="App.speakArabic('${rootEscAr}')">🔊</button>
                        <button class="card-action-btn ${rootStarred ? 'starred' : ''}" aria-pressed="${rootStarred ? 'true' : 'false'}" aria-label="${rootStarred ? 'Starred' : 'Star this item'}" onclick="App.toggleStarInPlace(this, '${rootKey}', '${rootEscAr}', '${rootEscHi}')">${rootStarred ? '★' : '☆'}</button>
                      </div>
                      <div style="display:flex; gap:0.5rem; align-items:center;">
                        <button class="card-action-btn" onclick="App.speakArabic('${derivedEscAr}')">🔊</button>
                        <button class="card-action-btn ${derivedStarred ? 'starred' : ''}" aria-pressed="${derivedStarred ? 'true' : 'false'}" aria-label="${derivedStarred ? 'Starred' : 'Star this item'}" onclick="App.toggleStarInPlace(this, '${derivedKey}', '${derivedEscAr}', '${derivedEscHi}')">${derivedStarred ? '★' : '☆'}</button>
                      </div>
                    </div>
                  </div>
                `;
                i += 2;
              } else {
                const iIdx = i;
                const itemKey = `S${currentStage}L${currentLesson}_num_${it.id || iIdx}`;
                const starred = isStarred(itemKey);
                const escAr = (it.arabic || '').replace(/'/g, "\\'");
                const itemHi = getTranslation(it);
                const escHi = itemHi.replace(/'/g, "\\'");
                html += `
                  <div class="vocab-card" style="${it.full_width ? 'grid-column: 1 / -1;' : ''}">
                    <div class="card-top" data-item-id="${itemKey}">
                      ${(it.sentence_number || it.display_number) ? `<span class="card-number sentence-badge">${it.sentence_number || it.display_number}</span>` : ''}
                      <button class="card-action-btn" onclick="App.speakArabic('${escAr}')">🔊</button>
                      <button class="card-action-btn ${starred ? 'starred' : ''}" aria-pressed="${starred ? 'true' : 'false'}" aria-label="${starred ? 'Starred' : 'Star this item'}" onclick="App.toggleStarInPlace(this, '${itemKey}', '${escAr}', '${escHi}')">${starred ? '★' : '☆'}</button>
                      ${bmSvgHtml(itemKey)}
                    </div>
                    <div class="arabic-text">${it.arabic_markup || it.arabic || ''}</div>
                    ${renderDualAnswerHtml(itemKey, it.arabic, itemHi)}
                  </div>
                `;
                i += 1;
              }
            }
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
              const verseHi = getTranslation(v);
              const escHi = verseHi.replace(/'/g, "\\'");
              html += `
                <div class="verse-card">
                  <div class="card-top" data-item-id="${itemKey}">
                    <button class="card-action-btn" onclick="App.speakArabic('${escAr}')">🔊</button>
                    <button class="card-action-btn ${starred ? 'starred' : ''}" aria-pressed="${starred ? 'true' : 'false'}" aria-label="${starred ? 'Starred' : 'Star this item'}" onclick="App.toggleStarInPlace(this, '${itemKey}', '${escAr}', '${escHi}')">${starred ? '★' : '☆'}</button>
                    ${bmSvgHtml(itemKey)}
                  </div>
                  <div class="arabic-text" style="font-size:calc(var(--arabic-scale)*1.1);">${v.arabic_markup || v.arabic || ''}</div>
                  ${verseHi ? renderDualAnswerHtml(itemKey, v.arabic, verseHi) : ''}
                </div>
              `;
            });
            html += `</div>`;
          } else if (secType === 'section_label') {
            html += `<div class="section-label-divider"><span>${d.text || d.title || ''}</span></div>`;

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
                const exHi = getTranslation(ex);
                const escHiEx = exHi.replace(/'/g, "\'");
                html += '<div class="vocab-card example-row"><div class="card-top" data-item-id="' + itemKey + '">' +
                  '<button class="card-action-btn" onclick="App.speakArabic(\'' + escArEx + '\')">&#128362;</button>' +
                  '<button class="card-action-btn ' + (starredEx ? 'starred' : '') + '" aria-pressed="' + (starredEx ? 'true' : 'false') + '" aria-label="' + (starredEx ? 'Starred' : 'Star this item') + '" onclick="App.toggleStarInPlace(this,\'' + itemKey + '\',\'' + escArEx + '\',\'' + escHiEx + '\')">' + (starredEx ? '★' : '☆') + '</button>' +
                  '</div><div class="arabic-text">' + (ex.arabic_markup || ex.arabic || '') + '</div>' +
                  (exHi ? renderDualAnswerHtml(itemKey, ex.arabic, exHi) : '') +
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
                const tbHi = getTranslation(it);
                const escHiTb = tbHi.replace(/'/g, "\'");
                html += '<div class="vocab-card"><div class="card-top" data-item-id="' + itemKey + '">' +
                  '<button class="card-action-btn" onclick="App.speakArabic(\'' + escArTb + '\')">&#128362;</button>' +
                  '<button class="card-action-btn ' + (starredTb ? 'starred' : '') + '" aria-pressed="' + (starredTb ? 'true' : 'false') + '" aria-label="' + (starredTb ? 'Starred' : 'Star this item') + '" onclick="App.toggleStarInPlace(this,\'' + itemKey + '\',\'' + escArTb + '\',\'' + escHiTb + '\')">' + (starredTb ? '★' : '☆') + '</button>' +
                  '</div><div class="arabic-text">' + (it.arabic_markup || it.arabic || '') + '</div>' +
                  (tbHi ? renderDualAnswerHtml(itemKey, it.arabic, tbHi) : '') +
                  '</div>';
              });
              html += '</div>';
            }
          } // end tashbeeh_grid / ayah_pause_block
        });

        if (mount) mount.innerHTML = html;
        if (window.GrammarVisuals) {
          const lKey = lesson.lesson_key || `S${currentStage}L${currentLesson}`;
          window.GrammarVisuals.mount(lKey, 'grammar-visual-mount');
        }
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

      async function populateStageLessons(stageNum) {
        stageNum = parseInt(stageNum) || 1;
        let lessonNumbers = [];
        if (metadata && metadata.units) {
          const u = metadata.units.find(x => x.id === `Stage${stageNum}` || x.id === stageNum || x.id === `stage_${stageNum}`);
          if (u && u.lessons) {
            lessonNumbers = u.lessons.map(l => (l.number !== undefined ? l.number : (l.lesson_id !== undefined ? l.lesson_id : l.id)));
          } else if (u && u.lessonCount) {
            for (let i = 1; i <= u.lessonCount; i++) lessonNumbers.push(i);
          }
        }
        if (lessonNumbers.length === 0) {
          const stageKey = `Stage${stageNum}`;
          if (!bookData.stages[stageKey]) {
            await loadUnit(stageNum);
          }
          const lessons = bookData.stages[stageKey] || [];
          lessonNumbers = lessons.map(l => l.lesson_id);
        }
        let lessonsHtml = '';
        lessonNumbers.forEach(num => {
          const isAct = (stageNum === currentStage && num === currentLesson);
          lessonsHtml += `<button class="lesson-chip ${isAct ? 'active' : ''}" onclick="App.pickLesson(${stageNum}, ${num})">${num}</button>`;
        });
        const slm = document.getElementById('stage-lessons-mount');
        if (slm) slm.innerHTML = lessonsHtml;
      }

      async function pickLesson(stageNum, lessonId) {
        await loadLesson(stageNum, lessonId);
        const modal = document.getElementById('lesson-picker-modal');
        if (modal && modal.close) modal.close();
      }

      async function navigatePrevLesson() {
        if (currentLesson > 1) {
          await loadLesson(currentStage, currentLesson - 1);
        } else if (currentStage > 1) {
          const prevStageNum = currentStage - 1;
          let count = 0;
          if (metadata && metadata.units) {
            const u = metadata.units.find(x => x.id === `Stage${prevStageNum}` || x.id === prevStageNum);
            if (u) count = u.lessonCount || (u.lessons && u.lessons.length) || 0;
          }
          if (!count) {
            const prevLessons = await loadUnit(prevStageNum);
            count = prevLessons ? prevLessons.length : 1;
          }
          await loadLesson(prevStageNum, count);
        }
      }

      async function navigateNextLesson() {
        let currentLessonsCount = 0;
        if (metadata && metadata.units) {
          const u = metadata.units.find(x => x.id === `Stage${currentStage}` || x.id === currentStage);
          if (u) currentLessonsCount = u.lessonCount || (u.lessons && u.lessons.length) || 0;
        }
        if (!currentLessonsCount) {
          const currentStageKey = `Stage${currentStage}`;
          const currentLessons = bookData.stages[currentStageKey] || [];
          currentLessonsCount = currentLessons.length;
        }
        if (currentLesson < currentLessonsCount) {
          await loadLesson(currentStage, currentLesson + 1);
        } else if (currentStage < 7) {
          await loadLesson(currentStage + 1, 1);
        }
      }

      function openSpinner() {
        setSpinnerPool(spinnerMode);
        renderSrsStats();
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
            const display = getTranslation(f) || f.hinglish;
            spinnerPool.push({
              arabic: f.arabic,
              origHinglish: display,
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
                const display = getTranslation(it) || it.hinglish;
                if (it.arabic && display && !it.arabic.includes('----')) {
                  const itemKey = `S${currentStage}L${currentLesson}_s${sIdx}_${iIdx}`;
                  const customVal = customAnswers[itemKey];
                  spinnerPool.push({
                    arabic: it.arabic,
                    origHinglish: display,
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
        const sRating = document.getElementById('drill-srs-rating-row');
        const sBoxBadge = document.getElementById('drill-srs-box-badge');
        const progressLabel = document.getElementById('drill-progress-label');

        if (sRating) sRating.style.display = 'none';

        if (spinnerPool.length === 0) {
          if (sAr) sAr.textContent = spinnerMode === 'starred' ? 'No Starred Items Yet' : (spinnerMode === 'srs' ? 'No Due Cards Right Now' : 'No Items in Current Lesson');
          if (sHi) {
            sHi.innerHTML = spinnerMode === 'starred' ? 'Tap ★ on any word to star it!' : (spinnerMode === 'srs' ? 'Sub cards up to date! Naye sabaq padhein.' : '');
            sHi.style.display = 'block';
          }
          if (sHint) sHint.style.display = 'none';
          if (progressLabel) progressLabel.textContent = 'Card 0 of 0';
          if (sBoxBadge) sBoxBadge.style.display = 'none';
          return;
        }

        if (progressLabel) progressLabel.textContent = `Card ${spinnerIndex + 1} of ${spinnerPool.length}`;

        const it = spinnerPool[spinnerIndex];
        if (sAr) sAr.textContent = it.arabic;

        // SRS Box Badge
        if (sBoxBadge) {
          const srsItem = getSrsItem(it.key);
          if (srsItem && srsItem.box) {
            sBoxBadge.textContent = srsItem.box === 5 ? '🌟 Box 5' : `📦 Box ${srsItem.box}`;
            sBoxBadge.style.display = 'inline-block';
          } else {
            sBoxBadge.textContent = '📦 Box 1 (New)';
            sBoxBadge.style.display = 'inline-block';
          }
        }

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
        const sRating = document.getElementById('drill-srs-rating-row');
        if (sHi) sHi.style.display = isSpinnerRevealed ? 'block' : 'none';
        if (sHint) sHint.style.display = isSpinnerRevealed ? 'none' : 'block';
        if (sRating) sRating.style.display = isSpinnerRevealed ? 'block' : 'none';
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

      
    let currentCustomFilter = '';
    let _customRenderId = 0;

    async function openCustomAnswersModal() {
      const pop = document.getElementById('settings-popover');
      if (pop && pop.hidePopover) {
        try { if (!pop.matches || pop.matches(':popover-open')) pop.hidePopover(); } catch(e) {}
      }
      const modal = document.getElementById('custom-answers-modal');
      currentCustomFilter = '';
      const searchInput = document.getElementById('custom-answers-search');
      if (searchInput) searchInput.value = '';
      await renderCustomAnswersList();
      if (modal && modal.showModal) modal.showModal();
    }

    async function filterCustomAnswers(query) {
      currentCustomFilter = (query || '').trim().toLowerCase();
      return await renderCustomAnswersList();
    }

    async function renderCustomAnswersList() {
      const renderId = ++_customRenderId;
      const body = document.getElementById('custom-answers-body');
      if (!body) return;

      // Migrate / read custom translations
      let customTranslations = {};
      try {
        const raw = localStorage.getItem('muallim_custom_translations');
        if (raw) {
          customTranslations = JSON.parse(raw);
        } else {
          const old = localStorage.getItem('muallim_custom_answers');
          if (old) {
            customTranslations = JSON.parse(old);
            localStorage.setItem('muallim_custom_translations', old);
          }
        }
      } catch(e) { customTranslations = {}; }
      customAnswers = customTranslations; // keep App's customAnswers in sync

      const keys = Object.keys(customTranslations);
      if (keys.length === 0) {
        body.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding:32px 16px; font-size:0.95rem;">Aapne abhi koi custom jawab nahi save kiya.</div>';
        return;
      }

      // Pre-load any units needed for keys
      const stagesNeeded = [...new Set(keys.map(k => {
        const m = k.match(/^S(\d+)L/);
        return m ? parseInt(m[1]) : null;
      }).filter(Boolean))];

      await Promise.all(stagesNeeded.map(s => {
        if (!bookData.stages[`Stage${s}`]) return loadUnit(s).catch(() => {});
        return Promise.resolve();
      }));

      if (renderId !== _customRenderId) return; // Discard stale render

      // Group keys by Unit & Lesson
      const groups = {};
      keys.forEach(k => {
        const m = k.match(/^S(\d+)L(\d+)/);
        if (m) {
          const sNum = parseInt(m[1]);
          const lNum = parseInt(m[2]);
          const groupKey = `Stage${sNum}_Lesson${lNum}`;
          if (!groups[groupKey]) {
            groups[groupKey] = {
              stage: sNum,
              lesson: lNum,
              title: `Unit ${sNum} • Lesson ${lNum}`,
              items: []
            };
          }
          groups[groupKey].items.push({
            key: k,
            answer: customTranslations[k],
            stage: sNum,
            lesson: lNum
          });
        }
      });

      // Sort groups in book order (Unit 1 Lesson 1 first)
      const sortedGroupKeys = Object.keys(groups).sort((a, b) => {
        const ga = groups[a];
        const gb = groups[b];
        if (ga.stage !== gb.stage) return ga.stage - gb.stage;
        return ga.lesson - gb.lesson;
      });

      let html = '';
      let matchCount = 0;

      sortedGroupKeys.forEach(gKey => {
        const g = groups[gKey];
        const matchedItems = [];

        g.items.forEach(item => {
          let originalAr = '';
          let originalHi = '';

          // Look up original text in bookData
          try {
            const stageData = bookData.stages[`Stage${item.stage}`];
            if (stageData) {
              const lessonData = stageData.find(l => l.lesson_id === item.lesson);
              if (lessonData && lessonData.sections) {
                for (let sIdx = 0; sIdx < lessonData.sections.length; sIdx++) {
                  const sec = lessonData.sections[sIdx];
                  const d = sec.data || {};
                  const secItems = d.items || d.verses || d.examples || sec.items || [];
                  for (let iIdx = 0; iIdx < secItems.length; iIdx++) {
                    const it = secItems[iIdx];
                    if (`S${item.stage}L${item.lesson}_num_${it.id || iIdx}` === item.key ||
                        `S${item.stage}L${item.lesson}_s${sIdx}_${iIdx}` === item.key ||
                        `S${item.stage}L${item.lesson}_v_${iIdx}` === item.key ||
                        `S${item.stage}L${item.lesson}_ex${sIdx}_${iIdx}` === item.key ||
                        `S${item.stage}L${item.lesson}_tb${sIdx}_${iIdx}` === item.key ||
                        (it.id && `${item.stage}L${item.lesson}_num_${it.id}` === item.key)) {
                      originalAr = it.arabic || '';
                      originalHi = it.hinglish || '';
                      break;
                    }
                  }
                  if (originalAr || originalHi) break;
                }

                // Fallback: If section index shifted across revisions, check by item index / id in this lesson
                if (!originalAr && !originalHi) {
                  const sMatch = item.key.match(/_s\d+_(\d+)$/);
                  const numMatch = item.key.match(/_num_(\d+)$/);
                  if (sMatch) {
                    const targetIdx = parseInt(sMatch[1]);
                    for (let sIdx = 0; sIdx < lessonData.sections.length; sIdx++) {
                      const sec = lessonData.sections[sIdx];
                      const d = sec.data || {};
                      const secItems = d.items || d.verses || d.examples || sec.items || [];
                      if (secItems[targetIdx] && (secItems[targetIdx].arabic || secItems[targetIdx].hinglish)) {
                        originalAr = secItems[targetIdx].arabic || '';
                        originalHi = secItems[targetIdx].hinglish || '';
                        break;
                      }
                    }
                  } else if (numMatch) {
                    const targetId = parseInt(numMatch[1]);
                    for (let sIdx = 0; sIdx < lessonData.sections.length; sIdx++) {
                      const sec = lessonData.sections[sIdx];
                      const d = sec.data || {};
                      const secItems = d.items || d.verses || d.examples || sec.items || [];
                      const found = secItems.find(it => it.id === targetId);
                      if (found && (found.arabic || found.hinglish)) {
                        originalAr = found.arabic || '';
                        originalHi = found.hinglish || '';
                        break;
                      }
                    }
                  }
                }
              }
            }
          } catch(e) {}

          // Apply search filter
          if (currentCustomFilter) {
            const textToSearch = `${g.title} ${originalAr} ${originalHi} ${item.answer}`.toLowerCase();
            if (!textToSearch.includes(currentCustomFilter)) return;
          }

          matchedItems.push({
            ...item,
            originalAr,
            originalHi
          });
        });

        if (matchedItems.length === 0) return;
        matchCount += matchedItems.length;

        html += `
          <div class="custom-answers-group" style="margin-top:14px; margin-bottom:10px;">
            <div style="font-weight:700; font-size:0.85rem; color:var(--primary, #1B4332); padding-bottom:4px; border-bottom:1px solid var(--divider-light, rgba(0,0,0,0.08)); display:flex; justify-content:space-between; align-items:center;">
              <span>📝 ${g.title}</span>
              <span style="font-size:0.75rem; color:var(--text-muted); font-weight:400;">${matchedItems.length} saved</span>
            </div>
        `;

        matchedItems.forEach(item => {
          const escKey = item.key.replace(/'/g, "\\'");
          html += `
            <div class="custom-answer-card" style="background:var(--bg-surface-elevated, #f9f9f9); padding:10px 12px; border-radius:8px; margin-top:8px; border:1px solid var(--border, #e0e0e0); position:relative;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
                <div style="font-size:0.75rem; color:var(--text-muted); font-family:monospace;">${item.key}</div>
                <button class="icon-btn" onclick="App.deleteCustomAnswer('${escKey}')" title="Delete custom answer" style="color:var(--danger, #dc2626); font-size:0.9rem; padding:2px 6px; border-radius:4px; background:none; border:none; cursor:pointer;" aria-label="Delete">🗑</button>
              </div>
              ${item.originalAr ? `<div style="font-size:1.15rem; color:var(--primary, #1B4332); margin-bottom:4px; font-weight:bold; text-align:right; font-family:'Amiri', serif; direction:rtl;">${item.originalAr}</div>` : ''}
              ${item.originalHi ? `<div style="font-size:0.82rem; color:var(--text-muted); margin-bottom:4px;"><span style="font-weight:600;">Original:</span> ${item.originalHi}</div>` : ''}
              <div style="font-size:0.88rem; color:var(--accent, #0284c7); font-weight:600;"><span style="font-size:0.75rem; background:rgba(2,132,199,0.12); color:#0284c7; padding:1px 6px; border-radius:4px; margin-right:4px;">custom</span> ${item.answer}</div>
            </div>
          `;
        });

        html += `</div>`;
      });

      if (keys.length > 0 && matchCount === 0) {
        body.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding:24px 16px; font-size:0.9rem;">Koi natija nahi mila.</div>';
      } else {
        body.innerHTML = html;
      }
    }

    function closeCustomAnswersModal() {
      const m = document.getElementById('custom-answers-modal');
      if (m && m.close) m.close();
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

      var _searchIndexData = null;
      var _searchIndexPromise = null;

      async function loadSearchIndex() {
        if (_searchIndexData) return _searchIndexData;
        if (_searchIndexPromise) return _searchIndexPromise;
        _searchIndexPromise = (async () => {
          try {
            const res = await fetch('./data/search-index.json');
            if (res.ok) {
              _searchIndexData = await res.json();
            }
          } catch(e) {
            console.warn('[Muallim] Could not load search-index.json:', e);
          } finally {
            _searchIndexPromise = null;
          }
          return _searchIndexData || [];
        })();
        return _searchIndexPromise;
      }

      function normalizeSearchStr(s) {
        if (!s) return '';
        return String(s).toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
          .replace(/[\u0622\u0623\u0625\u0671]/g, 'ا')
          .replace(/[\u0649]/g, 'ي')
          .replace(/[\u0629]/g, 'ه')
          .replace(/[-_.,;:'"`’‘!?()\[\]]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      }

      function openSearchModal() {
        document.getElementById('search-modal').showModal();
        setTimeout(() => document.getElementById('search-input').focus(), 100);
        loadSearchIndex().catch(() => {});
        for (let s = 2; s <= 7; s++) {
          if (!bookData.stages[`Stage${s}`]) {
            loadUnit(s).catch(() => {});
          }
        }
      }

      async function performSearch(query) {
        const rawQ = query.trim();
        const qNorm = normalizeSearchStr(rawQ);
        const resultsMount = document.getElementById('search-results-mount');
        if (qNorm.length < 2 && rawQ.length < 2) {
          resultsMount.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:20px;">Type at least 2 characters to search all lessons.</p>';
          return;
        }

        // Ensure units are loaded
        for (let s = 1; s <= 7; s++) {
          if (!bookData.stages[`Stage${s}`]) {
            await loadUnit(s).catch(() => {});
          }
        }

        const sIndex = await loadSearchIndex();

        const results = [];
        const seenKeys = new Set();

        // 1. Search search-index.json (Arabic, Transliteration, English, Root)
        if (Array.isArray(sIndex) && sIndex.length > 0) {
          for (let i = 0; i < sIndex.length; i++) {
            const item = sIndex[i];
            const arNorm = normalizeSearchStr(item.ar);
            const trNorm = normalizeSearchStr(item.tr);
            const enNorm = normalizeSearchStr(item.en);
            const rootNorm = normalizeSearchStr(item.root);

            let matched = false;
            let matchType = '';

            if (item.ar && item.ar.includes(rawQ)) { matched = true; matchType = 'Arabic'; }
            else if (arNorm && arNorm.includes(qNorm)) { matched = true; matchType = 'Arabic'; }
            else if (trNorm && (trNorm.includes(qNorm) || qNorm.includes(trNorm))) { matched = true; matchType = 'Transliteration'; }
            else if (enNorm && enNorm.includes(qNorm)) { matched = true; matchType = 'English'; }
            else if (rootNorm && rootNorm.replace(/\s+/g, '').includes(qNorm.replace(/\s+/g, ''))) { matched = true; matchType = 'Root'; }

            if (matched) {
              const ukey = `${item.s}_${item.l}_${item.ar}`;
              if (!seenKeys.has(ukey)) {
                seenKeys.add(ukey);
                results.push({
                  stage: item.s,
                  lesson: item.l,
                  arabic: item.ar,
                  transliteration: item.tr || '',
                  english: item.en || '',
                  hinglish: '',
                  root: item.root || '',
                  matchType
                });
              }
            }
          }
        }

        // 2. Search loaded stage lesson data (Arabic and Hinglish translations)
        for (let s = 1; s <= 7; s++) {
          const stageKey = `Stage${s}`;
          const lessons = bookData.stages[stageKey] || [];
          lessons.forEach(l => {
            (l.sections || []).forEach(sec => {
              const items = (sec.data && sec.data.items) || [];
              items.forEach(it => {
                if (it.arabic && it.hinglish) {
                  const arNorm = normalizeSearchStr(it.arabic);
                  const hiNorm = normalizeSearchStr(it.hinglish);

                  const arMatch = it.arabic.includes(rawQ) || (arNorm && arNorm.includes(qNorm));
                  const hiMatch = hiNorm.includes(qNorm) || it.hinglish.toLowerCase().includes(rawQ.toLowerCase());

                  if (arMatch || hiMatch) {
                    const ukey = `${s}_${l.lesson_id}_${it.arabic}`;
                    if (seenKeys.has(ukey)) {
                      const existing = results.find(r => r.stage === s && r.lesson === l.lesson_id && r.arabic === it.arabic);
                      if (existing && !existing.hinglish) existing.hinglish = it.hinglish;
                    } else {
                      seenKeys.add(ukey);
                      results.push({
                        stage: s,
                        lesson: l.lesson_id,
                        arabic: it.arabic,
                        transliteration: '',
                        english: '',
                        hinglish: it.hinglish,
                        root: '',
                        matchType: arMatch ? 'Arabic' : 'Hinglish'
                      });
                    }
                  }
                }
              });
            });
          });
        }

        // Enrich any results that came from search-index with hinglish if available in loaded lessons
        results.forEach(r => {
          if (!r.hinglish) {
            const stageLessons = bookData.stages[`Stage${r.stage}`] || [];
            const les = stageLessons.find(l => l.lesson_id === r.lesson);
            if (les) {
              for (const sec of (les.sections || [])) {
                const found = ((sec.data && sec.data.items) || []).find(it => it.arabic === r.arabic);
                if (found && found.hinglish) {
                  r.hinglish = found.hinglish;
                  break;
                }
              }
            }
          }
        });

        function escSearchHtml(s) {
          return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }

        if (results.length === 0) {
          resultsMount.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:20px;">No results found for "${escSearchHtml(query)}". Try searching in English, Hinglish, Arabic, or Transliteration.</p>`;
          return;
        }

        let out = '';
        results.slice(0, 50).forEach(r => {
          out += `
            <div class="search-result-item" onclick="App.jumpToSearchLesson(${r.stage}, ${r.lesson})">
              <div style="flex:1;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                  <span style="font-size:0.75rem; color:var(--accent-emerald); font-weight:700;">Unit ${r.stage} Lesson ${r.lesson}</span>
                  ${r.matchType ? `<span style="font-size:0.68rem; background:rgba(27,67,50,0.08); color:var(--accent-emerald); padding:1px 6px; border-radius:10px; font-weight:600;">${r.matchType}</span>` : ''}
                </div>
                <div style="font-family:var(--font-arabic); font-size:var(--arabic-scale, 26px); line-height:1.4; color:var(--text-primary); direction:rtl; text-align:right;">${r.arabic}</div>
                <div style="font-size:0.85rem; color:var(--text-secondary); margin-top:4px;">
                  ${r.transliteration ? `<span style="display:inline-block; font-style:italic; color:var(--accent-emerald); margin-right:6px; font-weight:600;">[${escSearchHtml(r.transliteration)}]</span>` : ''}
                  ${r.hinglish ? `<span>${escSearchHtml(r.hinglish)}</span>` : ''}
                  ${r.english && r.english !== r.hinglish ? `<span style="color:var(--text-muted); font-size:0.8rem; margin-left:6px;">(${escSearchHtml(r.english)})</span>` : ''}
                </div>
              </div>
              <span style="color:var(--divider-gold); font-size:1.2rem; margin-left:10px;">→</span>
            </div>
          `;
        });
        if (results.length > 50) {
          out += `<p style="text-align:center; color:var(--text-muted); padding:10px; font-size:0.8rem;">Showing first 50 of ${results.length} results.</p>`;
        }
        resultsMount.innerHTML = out;
      }

      async function jumpToSearchLesson(stageNum, lessonId) {
        document.getElementById('search-modal').close();
        await loadLesson(stageNum, lessonId);
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

            const customSrc = imported.customTranslations || imported.customAnswers || imported.muallim_custom_translations;
            if (customSrc && typeof customSrc === 'object') {
              Object.keys(customSrc).forEach(k => {
                customAnswers[k] = customSrc[k];
                customCount++;
              });
            }

            localStorage.setItem('muallim_custom_translations', JSON.stringify(customAnswers));
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
        const bmM = (itemId || '').match(/^S(\d+)L(\d+)/);
        const bmStage = bmM ? parseInt(bmM[1]) : currentStage;
        const bmLesson = bmM ? parseInt(bmM[2]) : currentLesson;
        saveBookmark({
          stage: bmStage,
          lesson: bmLesson,
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
                       document.querySelector(`[data-id="${_bookmark.itemId}"]`);
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

    App.doGoogleLogin = async function() {
      if (!window._FA || !window._AUTH) {
        showToast('Firebase connect ho raha hai — thodi der mein koshish karein');
        return;
      }
      try {
        const provider = new window._FA.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        showToast('Google Sign-In khul raha hai…');
        await window._FA.signInWithPopup(window._AUTH, provider);
        showToast('✅ Google login kamyab!');
      } catch(e) {
        if (e.code === 'auth/popup-closed-by-user') return;
        showToast('Google login error: ' + (e.message || e.code));
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
      ['muallim_favs','muallim_custom_translations','muallim_custom_answers','muallim_exam_history','muallim_bookmark'].forEach(k => localStorage.removeItem(k));
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
      const srsTab = document.getElementById('drill-tab-srs');
      if (srsTab) srsTab.classList.toggle('active', tab === 'srs');

      document.getElementById('drill-starred-panel').style.display = tab === 'starred' ? 'block' : 'none';
      document.getElementById('drill-custom-panel').style.display = tab === 'custom' ? 'block' : 'none';
      const srsPanel = document.getElementById('drill-srs-panel');
      if (srsPanel) srsPanel.style.display = tab === 'srs' ? 'block' : 'none';

      if (tab === 'custom') buildAccordion();
      if (tab === 'srs') renderSrsStats();
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
              const display = getTranslation(it) || it.hinglish;
              if (it.arabic && display) pool.push({ arabic: it.arabic, origHinglish: display, customHinglish: '', key: lkey });
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
        arabic: f.arabic, origHinglish: getTranslation(f) || f.hinglish,
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
      renderSrsStats();
    };

    // ─── SRS ENGINE (Leitner 5-Box Model) ─────────────────
    const SRS_INTERVALS = [
      0,                        // Box 1: Immediate / 10m
      3 * 24 * 60 * 60 * 1000,  // Box 2: 3 days
      7 * 24 * 60 * 60 * 1000,  // Box 3: 7 days
      14 * 24 * 60 * 60 * 1000, // Box 4: 14 days
      30 * 24 * 60 * 60 * 1000  // Box 5: 30 days (Mastered!)
    ];

    function getSrsState() {
      try {
        return JSON.parse(localStorage.getItem('muallim_srs_state') || '{}');
      } catch(e) {
        return {};
      }
    }

    function saveSrsState(state) {
      try {
        localStorage.setItem('muallim_srs_state', JSON.stringify(state));
      } catch(e) {}
      syncSrsToCloud(state);
    }

    function syncSrsToCloud(state) {
      if (typeof _db !== 'undefined' && _db && window._FS && App.currentUser && App.currentUser.uid) {
        try {
          const { doc, setDoc, serverTimestamp } = window._FS;
          setDoc(doc(_db, 'user_data', App.currentUser.uid), {
            srs: state,
            last_srs_sync: serverTimestamp()
          }, { merge: true }).catch(function(){});
        } catch(e) {}
      }
    }

    function getSrsItem(srsKey) {
      const state = getSrsState();
      return state[srsKey] || null;
    }

    function updateSrsItem(srsKey, rating) {
      const state = getSrsState();
      const now = Date.now();
      const current = state[srsKey] || { box: 1, reps: 0, lapses: 0, lastReview: 0, nextReview: now };
      let newBox = current.box || 1;

      if (rating === 'again') {
        newBox = 1;
        current.lapses = (current.lapses || 0) + 1;
        current.nextReview = now + (10 * 60 * 1000); // 10 minutes
      } else if (rating === 'hard') {
        current.nextReview = now + (24 * 60 * 60 * 1000); // 1 day
      } else if (rating === 'good') {
        newBox = Math.min(5, (current.box || 1) + 1);
        current.nextReview = now + (SRS_INTERVALS[newBox - 1] || (24 * 60 * 60 * 1000));
      } else if (rating === 'easy') {
        newBox = Math.min(5, (current.box || 1) + 2);
        current.nextReview = now + (SRS_INTERVALS[newBox - 1] || (3 * 24 * 60 * 60 * 1000));
      }

      current.box = newBox;
      current.reps = (current.reps || 0) + 1;
      current.lastReview = now;
      state[srsKey] = current;
      saveSrsState(state);
      renderSrsStats();
      return current;
    }

    function renderSrsStats() {
      const state = getSrsState();
      const now = Date.now();
      const boxes = [0, 0, 0, 0, 0];
      let dueCount = 0;
      let totalCount = 0;

      Object.keys(state).forEach(k => {
        const item = state[k];
        if (!item) return;
        totalCount++;
        const bIdx = Math.max(1, Math.min(5, item.box || 1)) - 1;
        boxes[bIdx]++;
        if ((item.nextReview || 0) <= now) {
          dueCount++;
        }
      });

      for (let i = 1; i <= 5; i++) {
        const el = document.getElementById(`srs-box-${i}-count`);
        if (el) el.textContent = boxes[i - 1];
      }

      const badge = document.getElementById('srs-due-badge');
      if (badge) badge.textContent = dueCount;

      const totalEl = document.getElementById('srs-total-tracked');
      if (totalEl) totalEl.textContent = `${totalCount} tracked`;

      const summary = document.getElementById('srs-due-summary');
      if (summary) {
        summary.textContent = dueCount > 0
          ? `${dueCount} cards review ke liye tayyar hain!`
          : `MashaAllah! Sabhi cards up-to-date hain.`;
      }
    }

    function buildSrsDrillPool() {
      const state = getSrsState();
      const now = Date.now();
      const dueList = [];
      const newPool = [];

      const stages = bookData ? bookData.stages : {};
      for (let s = 1; s <= 7; s++) {
        const lessons = stages[`Stage${s}`] || [];
        lessons.forEach(l => {
          const lkey = l.lesson_key || `S${s}L${l.lesson_id}`;
          (l.sections || []).forEach(sec => {
            (sec.data?.items || []).forEach(it => {
              const display = getTranslation(it) || it.hinglish;
              if (!it.arabic || !display || it.arabic.includes('----')) return;
              const srsKey = `${lkey}_${it.id}`;
              const entry = state[srsKey];
              const card = {
                arabic: it.arabic,
                origHinglish: display,
                customHinglish: (typeof customAnswers !== 'undefined' && customAnswers[srsKey]) || '',
                key: srsKey
              };
              if (entry) {
                if ((entry.nextReview || 0) <= now) {
                  dueList.push({ card: card, nextReview: entry.nextReview || 0, box: entry.box || 1 });
                }
              } else {
                newPool.push(card);
              }
            });
          });
        });
      }

      dueList.sort((a, b) => a.nextReview - b.nextReview);
      const result = dueList.map(d => d.card);

      if (result.length < 20 && newPool.length > 0) {
        shuffleArray(newPool);
        const needed = 20 - result.length;
        result.push(...newPool.slice(0, needed));
      }

      return result;
    }

    App.startSrsDrill = function() {
      const pool = buildSrsDrillPool();
      if (pool.length === 0) {
        showToast('Koi cards due nahi hain! Sabaq padhte rahein.');
        return;
      }
      spinnerMode = 'srs';
      startDrillWithPool(pool);
    };

    App.rateCurrentCard = function(rating) {
      if (spinnerPool.length === 0) return;
      const it = spinnerPool[spinnerIndex];
      if (!it || !it.arabic) return;
      updateSrsItem(it.key, rating);
      if (window.AudioFX) {
        window.AudioFX.play(rating === 'again' ? 'whoosh' : 'pop');
      }
      nextSpinnerCard();
    };

    // ─── INTERACTIVE GRAMMAR EXERCISE ENGINE ──────────────
    let exerciseQuestions = [];
    let exerciseCurrentIdx = 0;
    let exerciseScore = 0;

    function generateGrammarExercisesForLesson(lesson, stageNum) {
      const qs = [];
      const secItems = (lesson.sections || []).flatMap(s => (s.data && s.data.items) || []);
      const validItems = secItems.filter(it => it.arabic && it.hinglish && !it.arabic.includes('----'));
      const stage = stageNum || currentStage || 1;
      const lId = lesson.lesson_id || currentLesson || 1;

      // Q1: Core Lesson Topic Concept Question
      if (stage === 1) {
        if (lId === 1) {
          qs.push({
            prompt: "Is lafz ki noiyat pehchaniye (Khaas / The ya Aam / A)?",
            arabic: "الْكِتَابُ",
            options: [
              { text: "Khaas Lafz (Definite — The Book)", isCorrect: true, explanation: "Shuru mein 'الْـ' aane se lafz Khaas (Ma'rifah) ho jata hai aur aakhir se Tanween khatam ho kar ek Pesh bachta hai." },
              { text: "Aam Lafz (Indefinite — Any Book)", isCorrect: false, explanation: "Aam lafz par Tanween ( ٌ ) aati hai, jaise 'كِتَابٌ'." },
              { text: "Fe'l (Verb)", isCorrect: false, explanation: "'الْكِتَابُ' ek Isim (Noun) hai, Fe'l nahi." },
              { text: "Harf (Particle)", isCorrect: false, explanation: "'الْكِتَابُ' ek Isim hai." }
            ]
          });
        } else if (lId === 2) {
          qs.push({
            prompt: "Is lafz ki Jins (Gender) kya hai?",
            arabic: "مُؤْمِنَةٌ",
            options: [
              { text: "Muannas (Female)", isCorrect: true, explanation: "Aakhir mein Gol Taa ( ـَةٌ ) aane ki wajah se yeh lafz Muannas (Female) hai." },
              { text: "Muzakkar (Male)", isCorrect: false, explanation: "Muzakkar 'مُؤْمِنٌ' hota hai jisme Gol Taa nahi hoti." },
              { text: "Jama (Plural)", isCorrect: false, explanation: "Yeh waahid (singular) muannas hai." },
              { text: "Tasniyah (Dual)", isCorrect: false, explanation: "Tasniyah mein 'ـَانِ' ya 'ـَيْنِ' aata hai." }
            ]
          });
        }
      } else if (stage === 2) {
        if (lId === 1) {
          qs.push({
            prompt: "Lafz 'إِنَّ' ke aane se baad wale Ism par kya asar padta hai?",
            arabic: "إِنَّ اللَّهَ",
            options: [
              { text: "Ism Mansoob (Zabar َ) ho jata hai", isCorrect: true, explanation: "Beshak! 'إِنَّ' ta'keed ke liye aata hai aur apne baad wale Ism ko Zabar (Mansoob) deta hai." },
              { text: "Ism Majroor (Zer ِ) ho jata hai", isCorrect: false, explanation: "Zer sirf Huroof-e-Jarr dete hain, 'إِنَّ' nahi." },
              { text: "Ism par Pesh rehta hai", isCorrect: false, explanation: "'إِنَّ' ke aane ke baad Pesh Zabar mein tabdeel ho jata hai." },
              { text: "Koi tabdeeli nahi hoti", isCorrect: false, explanation: "'إِنَّ' lafz ki aakhri harakat ko badal deta hai." }
            ]
          });
        } else {
          qs.push({
            prompt: "Huroof-e-Jarr (jaise فِي, مِنْ, عَلَى, بِـ) aane se aakhri harf par kya asar hota hai?",
            arabic: "فِي الْبَيْتِ",
            options: [
              { text: "Aakhir mein Zer (Kasrah ِ) aati hai", isCorrect: true, explanation: "Sahi jawab! Harf-e-Jarr apne baad wale lafz ko Majroor (Zer) kar deta hai." },
              { text: "Aakhir mein Pesh (Dammah ُ) aati hai", isCorrect: false, explanation: "Pesh aam haalat hoti hai, Harf-e-Jarr ke baad nahi." },
              { text: "Aakhir mein do Zabar aate hain", isCorrect: false, explanation: "Harf-e-Jarr Zer deta hai, Zabar nahi." },
              { text: "Lafz par Sukoon (Jazm) lag jata hai", isCorrect: false, explanation: "Isim par Zer aati hai, Sukoon nahi." }
            ]
          });
        }
      } else if (stage === 3) {
        qs.push({
          prompt: "Is murakkab ki qisam pehchaniye:",
          arabic: "كِتَابُ اللَّهِ",
          options: [
            { text: "Murakkab-e-Izaafi (Mudaaf + Mudaaf-Ilaih)", isCorrect: true, explanation: "Durust! 'كِتَابُ' Mudaaf hai (bina Al aur Tanween ke) aur 'اللَّهِ' Mudaaf-Ilaih hai (Majroor Zer ke saath) — maana: Allah ki kitaab." },
            { text: "Murakkab-e-Tawseefi (Mawsoof + Sifat)", isCorrect: false, explanation: "Tawseefi mein dono lafz ek jaisi harakat aur Alif-Laam mein barabar hote hain." },
            { text: "Jumla Fe'liyyah", isCorrect: false, explanation: "Yeh jumla nahi balke murakkab (phrase) hai." },
            { text: "Harf-e-Nida", isCorrect: false, explanation: "Yahan koi Harf-e-Nida (Yaa) nahi hai." }
          ]
        });
      } else if (stage === 4) {
        qs.push({
          prompt: "Is lafz mein jurti hui zameer (attached pronoun) ka kya maana hai?",
          arabic: "رَبُّهُ",
          options: [
            { text: "Uska Rabb (His Lord)", isCorrect: true, explanation: "Lafz ke aakhir mein 'ـهُ' zameer-e-muttasil hai jiska maana 'uska / uski' hota hai." },
            { text: "Mera Rabb (My Lord)", isCorrect: false, explanation: "Mera Rabb ke liye 'رَبِّي' aata hai." },
            { text: "Aapka Rabb (Your Lord)", isCorrect: false, explanation: "Aapke liye 'رَبُّكَ' aata hai." },
            { text: "Un sab ka Rabb (Their Lord)", isCorrect: false, explanation: "Un sab ke liye 'رَبُّهُمْ' aata hai." }
          ]
        });
      } else if (stage === 5) {
        qs.push({
          prompt: "Lafz 'عَالِمٌ' ki jama (Broken Plural) kya aati hai?",
          arabic: "عَالِمٌ",
          options: [
            { text: "عُلَمَاءُ (Ulama / Scholars)", isCorrect: true, explanation: "Beshak! Jama Mukassar (Broken Plural) mein lafz ke andar tabdeeli hoti hai: Aalim se Ulama." },
            { text: "عَالِمُونَ", isCorrect: false, explanation: "Quran-e-Kareem mein aalim ki jama 'عُلَمَاء' aati hai." },
            { text: "عَالِمَات", isCorrect: false, explanation: "Yeh muannas jama hai." },
            { text: "مَعَالِم", isCorrect: false, explanation: "Ma'alim doosre lafz ki jama hai." }
          ]
        });
      } else if (stage === 6) {
        qs.push({
          prompt: "Fe'l Mazi 'فَعَلُوا' kis zameer (pronoun) ke liye istemaal hota hai?",
          arabic: "فَعَلُوا",
          options: [
            { text: "هُمْ (Woh sab mard / They)", isCorrect: true, explanation: "Aakhir mein 'ـُوا' aana Jama Muzakkar Gaayib (هُمْ) ki aalaamat hai." },
            { text: "هُوَ (Woh 1 mard)", isCorrect: false, explanation: "Woh 1 mard ke liye baghair suffix ke 'فَعَلَ' aata hai." },
            { text: "أَنْتَ (Aap 1 mard)", isCorrect: false, explanation: "Aap 1 ke liye 'فَعَلْتَ' aata hai." },
            { text: "نَحْنُ (Hum sab)", isCorrect: false, explanation: "Hum sab ke liye 'فَعَلْنَا' aata hai." }
          ]
        });
      } else {
        qs.push({
          prompt: "Is Fe'l ki awaz (Voice) kya hai?",
          arabic: "عُبِدَ",
          options: [
            { text: "Majhool (Passive — Uski ibadat ki gayi)", isCorrect: true, explanation: "Pehle harf par Pesh ( ُ ) aur doosre par Zer ( ِ ) aane se Fe'l Majhool (Passive Voice) banta hai." },
            { text: "Ma'roof (Active — Usne ibadat ki)", isCorrect: false, explanation: "Ma'roof 'عَبَدَ' hota hai jisme pehle harf par Zabar hota hai." },
            { text: "Amr (Order / Command)", isCorrect: false, explanation: "Yeh Mazi Majhool hai, Amr nahi." },
            { text: "Nahi (Prohibition)", isCorrect: false, explanation: "Yeh Majhool past tense hai." }
          ]
        });
      }

      // Q2 to Q5: Dynamic questions extracted directly from valid items in this lesson!
      const shuffled = shuffleArray([...validItems]);
      let itemIdx = 0;

      while (qs.length < 5 && itemIdx < shuffled.length) {
        const target = shuffled[itemIdx++];
        const correctTrans = target.hinglish || target.urdu || '';
        if (!correctTrans) continue;

        const otherItems = validItems.filter(it => it.arabic !== target.arabic && it.hinglish && it.hinglish !== correctTrans);
        if (otherItems.length < 3) break;
        const dists = shuffleArray(otherItems).slice(0, 3).map(d => d.hinglish);

        const opts = [
          { text: correctTrans, isCorrect: true, explanation: `Sahi jawab! '${target.arabic}' ka sahi maana '${correctTrans}' hai.` },
          { text: dists[0], isCorrect: false, explanation: `Ghalat. '${target.arabic}' ka sahi maana '${correctTrans}' hai.` },
          { text: dists[1], isCorrect: false, explanation: `Ghalat. '${target.arabic}' ka sahi maana '${correctTrans}' hai.` },
          { text: dists[2], isCorrect: false, explanation: `Ghalat. '${target.arabic}' ka sahi maana '${correctTrans}' hai.` }
        ];

        qs.push({
          prompt: "Is lafz ka sahi maana (translation) muntakhab karein:",
          arabic: target.arabic,
          options: shuffleArray(opts)
        });
      }

      if (qs.length < 5) {
        qs.push({
          prompt: "Quran-e-Kareem mein aam taur par lafz ki default haalat kya hoti hai?",
          arabic: "الْأَصْلُ فِي الْأَسْمَاءِ",
          options: [
            { text: "Marfoo (Pesh / Dammah ُ)", isCorrect: true, explanation: "Har Ism ki asal haalat Marfoo (Pesh) hoti hai jab tak koi asar daalne wala harf na aaye." },
            { text: "Mansoob (Zabar / Fathah َ)", isCorrect: false, explanation: "Zabar 'إِنَّ' ya Maf'ool banne par aata hai." },
            { text: "Majroor (Zer / Kasrah ِ)", isCorrect: false, explanation: "Zer Harf-e-Jarr ya Mudaaf-Ilaih hone par aati hai." },
            { text: "Majzoom (Sukoon ْ)", isCorrect: false, explanation: "Ism par Sukoon aam taur par nahi aata." }
          ]
        });
      }

      return qs.slice(0, 5);
    }

    App.openGrammarExerciseModal = function() {
      const stageKey = `Stage${currentStage}`;
      const stageData = (bookData && bookData.stages && bookData.stages[stageKey]) || [];
      const lesson = stageData.find(l => l.lesson_id === currentLesson) || stageData[0] || {};
      const titleEl = document.getElementById('exercise-lesson-title');
      if (titleEl) titleEl.textContent = `Unit ${currentStage} Lesson ${currentLesson}`;

      exerciseQuestions = generateGrammarExercisesForLesson(lesson, currentStage);
      exerciseCurrentIdx = 0;
      exerciseScore = 0;

      document.getElementById('exercise-quiz-view').style.display = 'block';
      document.getElementById('exercise-scorecard-view').style.display = 'none';

      renderExerciseQuestion();

      const modal = document.getElementById('grammar-exercise-modal');
      if (modal && modal.showModal) modal.showModal();
    };

    function renderExerciseQuestion() {
      const q = exerciseQuestions[exerciseCurrentIdx];
      if (!q) return;

      const prog = document.getElementById('exercise-q-progress');
      if (prog) prog.textContent = `Sawal ${exerciseCurrentIdx + 1} of ${exerciseQuestions.length}`;

      const scoreEl = document.getElementById('exercise-q-score');
      if (scoreEl) scoreEl.textContent = `Score: ${exerciseScore} / ${exerciseCurrentIdx}`;

      const promptEl = document.getElementById('exercise-prompt-text');
      if (promptEl) promptEl.textContent = q.prompt;

      const arBox = document.getElementById('exercise-arabic-box');
      if (arBox) arBox.textContent = q.arabic;

      const expBox = document.getElementById('exercise-explanation-box');
      if (expBox) expBox.style.display = 'none';

      const nextBtn = document.getElementById('exercise-next-btn');
      if (nextBtn) nextBtn.style.display = 'none';

      const mount = document.getElementById('exercise-options-mount');
      if (!mount) return;

      mount.innerHTML = q.options.map((opt, idx) => `
        <button class="exercise-option-btn" id="opt-btn-${idx}" onclick="App.submitExerciseAnswer(${idx})">
          <span>${opt.text}</span>
          <span style="opacity:0.4; font-size:0.8rem;">●</span>
        </button>
      `).join('');
    }

    App.submitExerciseAnswer = function(optIdx) {
      const q = exerciseQuestions[exerciseCurrentIdx];
      if (!q) return;

      const mount = document.getElementById('exercise-options-mount');
      if (!mount) return;

      const buttons = mount.querySelectorAll('.exercise-option-btn');
      buttons.forEach(btn => btn.disabled = true);

      const chosen = q.options[optIdx];
      const chosenBtn = document.getElementById(`opt-btn-${optIdx}`);

      const expBox = document.getElementById('exercise-explanation-box');
      const nextBtn = document.getElementById('exercise-next-btn');

      if (chosen.isCorrect) {
        exerciseScore++;
        if (chosenBtn) chosenBtn.classList.add('correct');
        if (window.AudioFX) window.AudioFX.play('pop');
        if (expBox) {
          expBox.style.display = 'block';
          expBox.style.background = 'rgba(5, 150, 105, 0.12)';
          expBox.style.color = '#059669';
          expBox.innerHTML = `<strong>✓ Sahi Jawab!</strong> ${chosen.explanation}`;
        }
      } else {
        if (chosenBtn) chosenBtn.classList.add('wrong');
        if (window.AudioFX) window.AudioFX.play('whoosh');
        q.options.forEach((opt, idx) => {
          if (opt.isCorrect) {
            const correctBtn = document.getElementById(`opt-btn-${idx}`);
            if (correctBtn) correctBtn.classList.add('correct');
          }
        });
        if (expBox) {
          expBox.style.display = 'block';
          expBox.style.background = 'rgba(220, 38, 38, 0.12)';
          expBox.style.color = '#dc2626';
          expBox.innerHTML = `<strong>✗ Ghalat Jawab.</strong> ${chosen.explanation}`;
        }
      }

      const scoreEl = document.getElementById('exercise-q-score');
      if (scoreEl) scoreEl.textContent = `Score: ${exerciseScore} / ${exerciseCurrentIdx + 1}`;

      if (nextBtn) {
        nextBtn.style.display = 'block';
        nextBtn.textContent = exerciseCurrentIdx + 1 < exerciseQuestions.length ? 'Agla Sawal (Next Question) ➔' : 'Nateeja Dekhein (See Results) ➔';
      }
    };

    App.nextExerciseQuestion = function() {
      if (exerciseCurrentIdx + 1 < exerciseQuestions.length) {
        exerciseCurrentIdx++;
        renderExerciseQuestion();
      } else {
        document.getElementById('exercise-quiz-view').style.display = 'none';
        const card = document.getElementById('exercise-scorecard-view');
        card.style.display = 'block';
        const icon = document.getElementById('exercise-score-icon');
        const text = document.getElementById('exercise-final-score-text');
        const pct = Math.round((exerciseScore / exerciseQuestions.length) * 100);

        if (pct >= 80) {
          icon.textContent = '🏆';
          text.innerHTML = `Aala tareen! Aapne ${exerciseQuestions.length} mein se <strong>${exerciseScore}</strong> (${pct}%) sahi kiye!`;
        } else if (pct >= 50) {
          icon.textContent = '⭐';
          text.innerHTML = `Achhi koshish! Aapne ${exerciseQuestions.length} mein se <strong>${exerciseScore}</strong> (${pct}%) sahi kiye. Sabaq dobara revise karein!`;
        } else {
          icon.textContent = '📖';
          text.innerHTML = `Aapne ${exerciseQuestions.length} mein se <strong>${exerciseScore}</strong> (${pct}%) sahi kiye. Sabaq ko dobara dhyan se padhein!`;
        }
      }
    };

    App.restartGrammarExercise = function() {
      App.openGrammarExerciseModal();
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
    let currentActivePushedExam = null;

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

    App.openExam = function(forcePractice) {
      if (forcePractice) currentActivePushedExam = null;
      examState = 'setup';
      renderExamView();
      const modal = document.getElementById('exam-modal');
      if (modal && modal.showModal) modal.showModal();
    };

    App.startPushedExam = function(pushedExam) {
      currentActivePushedExam = pushedExam;
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
      if (currentActivePushedExam) {
        const title = currentActivePushedExam.title || 'Ustaad ki Exam';
        const scope = currentActivePushedExam.scope || {};
        let scopeStr = '';
        if (Array.isArray(scope.unitKeys) && scope.unitKeys.length) {
          scopeStr += scope.unitKeys.map(k => 'Unit ' + k.replace(/\D/g,'')).join(', ');
        }
        if (Array.isArray(scope.lessonKeys) && scope.lessonKeys.length) {
          scopeStr += ' (Lessons: ' + scope.lessonKeys.join(', ') + ')';
        }
        if (!scopeStr) scopeStr = 'All Lessons';

        return `
          <h3 style="margin:0 0 16px; font-size:1.15rem; font-weight:800; color:var(--primary,#1B4332); display:flex; align-items:center; gap:8px;">
            <span>🎓</span> ${title}
          </h3>
          <div style="background:var(--bg-surface-elevated,#f3f4f6); border-radius:8px; padding:14px; margin-bottom:16px; border:1px solid var(--border,#e5e7eb);">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--accent-emerald,#1B4332); letter-spacing:0.05em; margin-bottom:4px;">Official Exam Scope</div>
            <div style="font-weight:700; color:var(--text-primary); font-size:0.95rem;">${scopeStr}</div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:4px;">Yeh exam aapke Ustaad ne assign kiya hai. Result submit hone ke baad teacher panel mein save ho jayega.</div>
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

          <div style="display:flex; flex-direction:column; gap:10px; margin-top:8px;">
            <button class="btn-primary" style="width:100%; padding:14px; font-size:1.05rem; font-weight:700;" onclick="App.startExam()">
              🚀 Bismillah — Start Exam
            </button>
          </div>
        `;
      }

      return `
        <h3 style="margin:0 0 16px; font-size:1.1rem; font-weight:800; color:var(--primary,#1B4332); display:flex; align-items:center; gap:8px;">
          <span>📝</span> Practice Exam Setup
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
          if (currentActivePushedExam) {
            const scope = currentActivePushedExam.scope || {};
            const unitKeys = Array.isArray(scope.unitKeys) ? scope.unitKeys : [];
            const lessonKeys = Array.isArray(scope.lessonKeys) ? scope.lessonKeys : [];
            const stageMatches = unitKeys.length === 0 || unitKeys.includes(`Stage${s}`);
            if (lessonKeys.length > 0) {
              include = lessonKeys.includes(lkey) || lessonKeys.includes(`S${s}L${l.lesson_id}`);
            } else {
              include = stageMatches;
            }
          } else if (examScopeMode === 'current') {
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
              if (!currentActivePushedExam && examStarredOnlyFilter && !starredSet.has(itemKey)) return;

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
      let types = Array.from(document.querySelectorAll('input[name="exam-type"]:checked')).map(cb => cb.value);
      if (types.length === 0) {
        types = ['mcq', 'fillin', 'truefalse', 'matching', 'arabic_writing'];
      }

      if (!currentActivePushedExam && examScopeMode === 'custom' && examScopeSelection.size === 0) {
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
        <div class="exam-q-arabic" style="font-family:var(--font-arabic); font-size:var(--arabic-scale, 26px); direction:rtl; text-align:center; margin:16px 0; line-height:1.4;">${q.arabic}</div>
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
            return `<button class="${cls}" style="font-family:var(--font-arabic); font-size:var(--arabic-scale, 26px); direction:rtl; min-height:48px; line-height:1.4;" onclick="App.answerArabicWriting(${qIdx}, '${opt.replace(/'/g,"&#39;")}')">
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
        <div class="exam-q-arabic" style="font-family:var(--font-arabic); font-size:var(--arabic-scale, 26px); direction:rtl; text-align:center; margin:16px 0; line-height:1.4;">${q.arabic}</div>
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
              return `<div class="${cls}${locked ? ' locked' : ''}" style="font-family:var(--font-arabic); font-size:var(--arabic-scale, 26px); direction:rtl; line-height:1.3;"
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
        <div class="exam-q-arabic" style="font-family:var(--font-arabic); font-size:var(--arabic-scale, 26px); direction:rtl; text-align:center; margin:16px 0; line-height:1.4;">${q.arabic}</div>
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

    function trackWrongExamWord(arWord, lessonKey) {
      if (!arWord) return;
      try {
        const ar = String(arWord).trim();
        let weak = {};
        try { weak = JSON.parse(lsGet('muallim_weak_words', '{}') || '{}'); } catch(e) { weak = {}; }
        if (!weak[ar]) weak[ar] = { count: 0, lesson: lessonKey || '', arabic: ar };
        weak[ar].count = (weak[ar].count || 0) + 1;
        if (lessonKey) weak[ar].lesson = lessonKey;
        lsSet('muallim_weak_words', JSON.stringify(weak));

        if (typeof _db !== 'undefined' && _db && window._FS && window._AUTH && window._AUTH.currentUser) {
          const { doc, updateDoc, increment } = window._FS;
          const uid = window._AUTH.currentUser.uid;
          const ref = doc(_db, 'user_data', uid);
          const cleanKey = ar.replace(/[\.\/\[\]~*#$]/g, '_');
          updateDoc(ref, {
            [`weakWords.${cleanKey}.count`]: increment(1),
            [`weakWords.${cleanKey}.arabic`]: ar,
            [`weakWords.${cleanKey}.lesson`]: lessonKey || ''
          }).catch(() => {});
        }
      } catch(e) {
        console.warn('[Muallim] trackWrongExamWord error:', e);
      }
    }

    // ── Answer Handlers (1st attempt locked) ──
    App.answerMCQ = function(qIdx, answer) {
      if (examScores[qIdx] !== null) return;
      examAnswers[qIdx] = answer;
      const q = examQuestions[qIdx];
      const correct = answer === q.correct;
      examScores[qIdx] = correct;
      if (!correct) trackWrongExamWord(q.arabic || (q.item ? q.item.arabic : ''), q.lessonKey || `S${currentStage}L${currentLesson}`);
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
      if (!correct) trackWrongExamWord(q.correct, q.lessonKey || `S${currentStage}L${currentLesson}`);
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
      if (!correct) trackWrongExamWord(q.arabic || (q.item ? q.item.arabic : ''), q.lessonKey || `S${currentStage}L${currentLesson}`);
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
      if (!correct) trackWrongExamWord(q.pairs[arPairIdx].arabic, q.lessonKey || `S${currentStage}L${currentLesson}`);
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
      if (!correct) trackWrongExamWord(q.arabic || (q.item ? q.item.arabic : ''), q.lessonKey || `S${currentStage}L${currentLesson}`);
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
      const isUstaad = !!currentActivePushedExam;
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
        isUstaadExam: isUstaad,
        pushedExamId: isUstaad ? currentActivePushedExam.id : null,
        examTitle: isUstaad ? (currentActivePushedExam.title || 'Ustaad ki Exam') : 'Practice Exam',
        scope: isUstaad ? (currentActivePushedExam.scopeDesc || currentActivePushedExam.title) : examScopeMode,
        breakdown: { ...examBreakdown }
      };
      examHistory.push(result);
      lsSet('muallim_exam_history', JSON.stringify(examHistory));
      if (typeof debouncedSync === 'function') debouncedSync(500);

      // Record in exam_results if Ustaad exam and online
      if (isUstaad && window._FS && window._AUTH && window._AUTH.currentUser && typeof _db !== 'undefined' && _db) {
        try {
          const { doc, setDoc, serverTimestamp } = window._FS;
          const uid = window._AUTH.currentUser.uid;
          const userEmail = window._AUTH.currentUser.email || '';
          const sName = lsGet('muallim_student_name', userEmail.split('@')[0]) || userEmail;
          const ref = doc(_db, 'exam_results', currentActivePushedExam.id, 'submissions', uid);
          setDoc(ref, {
            uid,
            name: sName,
            email: userEmail,
            score: pct,
            grade,
            correct,
            total,
            submittedAt: serverTimestamp(),
            examId: currentActivePushedExam.id,
            examTitle: currentActivePushedExam.title || 'Ustaad ki Exam'
          }).catch(e => {
            console.log('[Muallim] Direct submission write note:', e.message);
          });
        } catch(e) {}
      }
    }

    function buildSummaryHTML() {
      const { pct, correct, total } = calcExamScore();
      const grade = calcGrade(pct);
      const student = lsGet('muallim_student_name', '') || '';
      const date = new Date().toLocaleString();

      const gradeColors = { 'A+': '#059669', 'A': '#10B981', 'B': '#0EA5E9', 'C': '#F59E0B', 'D': '#F97316', 'F': '#EF4444' };
      const color = gradeColors[grade] || '#10B981';

      const scopeDesc = currentActivePushedExam 
        ? `🎓 ${currentActivePushedExam.title || 'Ustaad ki Exam'}`
        : ({
            current: `Unit ${currentStage} Lesson ${currentLesson}`,
            stage: `Entire Unit ${currentStage}`,
            custom: `${examScopeSelection.size} Lessons Selected`,
            starred: `⭐ Starred Words (${favourites.length})`
          }[examScopeMode] || `Unit ${currentStage}`);

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
        collection, updateDoc, serverTimestamp, onSnapshot, increment, deleteDoc
      } = await import(FIREBASE_MODULES.firestore);
      const {
        getAuth, signInWithEmailAndPassword, signOut,
        onAuthStateChanged, createUserWithEmailAndPassword,
        sendPasswordResetEmail, updatePassword, signInAnonymously,
        GoogleAuthProvider, signInWithPopup
      } = await import(FIREBASE_MODULES.auth);

      // Prevent double-init
      const apps = getApps();
      _fbApp = apps.length > 0 ? apps[0] : initializeApp(config);
      _db = getFirestore(_fbApp);
      const _auth = getAuth(_fbApp);

      // Expose Firestore helpers on module scope
      window._FS = { doc, setDoc, getDoc, getDocs, collection, updateDoc, serverTimestamp, onSnapshot, increment, deleteDoc, query, where };
      window._FSDB = _db;
      // Expose Auth helpers
      window._FA = { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
                     createUserWithEmailAndPassword, sendPasswordResetEmail, updatePassword,
                     signInAnonymously, GoogleAuthProvider, signInWithPopup };
      window._AUTH = _auth;

      // ── Auth state observer ──
      onAuthStateChanged(_auth, async (user) => {
        if (!user) {
          // If no user is authenticated, sign in anonymously for guest telemetry
          try {
            await signInAnonymously(_auth);
            return;
          } catch(err) {
            console.warn('[Auth] Anonymous sign-in fallback:', err);
            App.currentUser = null;
            _hideAdminTab();
            _hideTeacherTab();
            _updateAccountUI(null);
            if (!sessionStorage.getItem('muallim_guest_mode')) {
              const lm = document.getElementById('login-modal');
              if (lm && lm.showModal) { try { lm.showModal(); } catch(e) {} }
            }
          }
        } else if (user.isAnonymous) {
          // Anonymous Guest User
          sessionStorage.setItem('muallim_guest_uid', user.uid);
          App.currentUser = {
            uid: user.uid,
            email: 'guest@muallim.app',
            role: 'guest',
            name: localStorage.getItem('muallim_student_name') || 'Guest Learner',
            isAnonymous: true
          };
          _hideAdminTab();
          _hideTeacherTab();
          _updateAccountUI(App.currentUser);
          _loadUserDataFromFirestore(user.uid, 'guest_data');
        } else {
          // Logged in user (Student / Teacher / Admin)
          const lm = document.getElementById('login-modal');
          if (lm && lm.open) lm.close();

          // Merge previous guest data if user just logged in from an anonymous session
          const prevGuestUid = sessionStorage.getItem('muallim_guest_uid');
          if (prevGuestUid && prevGuestUid !== user.uid) {
            _mergeGuestDataToUser(prevGuestUid, user.uid);
            sessionStorage.removeItem('muallim_guest_uid');
          }

          // Super-admin hardcoded check
          const SUPER_ADMINS = ['nomaan.cha@gmail.com'];
          let role = 'student', displayName = user.displayName || user.email;
          if (user.email && SUPER_ADMINS.includes(user.email.toLowerCase())) {
            role = 'admin';
          }

          // Fetch or initialize role from Firestore
          try {
            const { doc: d2, getDoc: gd2, setDoc: sd2, serverTimestamp: st2 } = window._FS;
            const userSnap = await gd2(d2(_db, 'users', user.uid));
            if (userSnap.exists()) {
              const ud = userSnap.data();
              if (role !== 'admin') role = ud.role || 'student';
              displayName = ud.name || user.displayName || user.email;
              await sd2(d2(_db, 'users', user.uid), { lastSeen: st2() }, { merge: true });
            } else {
              await sd2(d2(_db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                name: displayName,
                role: role,
                createdAt: st2(),
                lastSeen: st2()
              }, { merge: true });
            }
          } catch(e) { console.warn('[Auth] Could not fetch/sync user doc:', e); }

          App.currentUser = { uid: user.uid, email: user.email, role, name: displayName, isAnonymous: false };

          // Show/hide admin and teacher tabs
          if (role === 'admin') {
            _showAdminTab();
            _showTeacherTab();
          } else if (role === 'teacher') {
            _hideAdminTab();
            _showTeacherTab();
          } else {
            _hideAdminTab();
            _hideTeacherTab();
          }

          _updateAccountUI(App.currentUser);

          // Load user data from user_data/{uid}
          _loadUserDataFromFirestore(user.uid, 'user_data');
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
    function _showTeacherTab() {
      const t = document.getElementById('teacher-nav-tab');
      if (t) t.style.display = 'block';
    }
    function _hideTeacherTab() {
      const t = document.getElementById('teacher-nav-tab');
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
        if (userRole) {
          if (user.role === 'admin') userRole.textContent = 'Role: Super Admin 🛡';
          else if (user.role === 'teacher') userRole.textContent = 'Role: Ustaad / Teacher 👨‍🏫';
          else if (user.role === 'student') userRole.textContent = 'Role: Student / Taalib-e-Ilm 🎓';
          else userRole.textContent = 'Role: Guest Learner';
        }

        if (user.role === 'admin') {
          if (adminPanel) adminPanel.style.display = 'block';
          if (typeof App.refreshAdminStudents === 'function') App.refreshAdminStudents();
        } else {
          if (adminPanel) adminPanel.style.display = 'none';
        }
      }
    }

    async function _loadUserDataFromFirestore(uid, collectionName) {
      if (!_db || !window._FS) return;
      try {
        const { doc, getDoc } = window._FS;
        const snap = await getDoc(doc(_db, collectionName || 'user_data', uid));
        if (snap.exists()) {
          const data = snap.data();
          // Restore starred
          if (Array.isArray(data.starred) || Array.isArray(data.starredItems)) {
            favourites = data.starred || data.starredItems;
            try { localStorage.setItem('muallim_favs', JSON.stringify(favourites)); } catch(e) {}
            updateStarredCountBadge();
          }
          // Restore custom answers
          const customData = data.customTranslations || data.customAnswers;
          if (customData && typeof customData === 'object') {
            customAnswers = customData;
            try { localStorage.setItem('muallim_custom_translations', JSON.stringify(customAnswers)); } catch(e) {}
          }
          // Restore bookmark
          if (data.bookmark || data.lastBookmark) {
            try { localStorage.setItem('muallim_bookmark', JSON.stringify(data.bookmark || data.lastBookmark)); } catch(e) {}
          }
        }
      } catch(e) { console.warn('[Auth] Could not load user_data:', e); }
    }

    async function _mergeGuestDataToUser(guestUid, userUid) {
      if (!_db || !window._FS) return;
      try {
        const { doc, getDoc, setDoc, deleteDoc } = window._FS;
        const snap = await getDoc(doc(_db, 'guest_data', guestUid));
        if (snap.exists()) {
          const gData = snap.data();
          await setDoc(doc(_db, 'user_data', userUid), {
            starredItems: gData.starredItems || [],
            customTranslations: gData.customTranslations || {},
            examHistory: gData.examHistory || [],
            mergedFromGuest: guestUid
          }, { merge: true });
          if (typeof deleteDoc === 'function') {
            await deleteDoc(doc(_db, 'guest_data', guestUid)).catch(() => {});
          }
          console.log('[Auth] Successfully merged guest telemetry to user:', userUid);
        }
      } catch(e) {
        console.warn('[Auth] Failed to merge guest data:', e);
      }
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

    // ── Session time flush ──
    function flushSessionTime() {
      if (!_sessionLessonKey || !App.currentUser) return;
      var elapsed = Math.round((Date.now() - _sessionStart) / 1000);
      if (elapsed <= 10) return;
      // Update local storage
      try {
        var lt = {};
        try { lt = JSON.parse(localStorage.getItem('muallim_lesson_time') || '{}'); } catch(e2) {}
        lt[_sessionLessonKey] = (lt[_sessionLessonKey] || 0) + elapsed;
        localStorage.setItem('muallim_lesson_time', JSON.stringify(lt));
      } catch(e) {}
      // Update Firestore (fire-and-forget)
      if (_db && window._FS && window._FS.increment) {
        var incUpdate = {};
        incUpdate['lessonTime.' + _sessionLessonKey] = window._FS.increment(elapsed);
        var colName = (App.currentUser.isAnonymous) ? 'guest_data' : 'user_data';
        var fsDoc = window._FS.doc(_db, colName, App.currentUser.uid);
        window._FS.setDoc(fsDoc, incUpdate, { merge: true }).catch(console.error);
      }
      _sessionStart = 0;
      _sessionLessonKey = '';
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
        const custom = JSON.parse(localStorage.getItem('muallim_custom_translations') || localStorage.getItem('muallim_custom_answers') || '{}');

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

        // If logged in or guest, sync to user_data or guest_data for curriculum analytics
        if (App.currentUser && App.currentUser.uid) {
          const colName = App.currentUser.isAnonymous ? 'guest_data' : 'user_data';
          await setDoc(doc(_db, colName, App.currentUser.uid), {
            role: App.currentUser.role || (App.currentUser.isAnonymous ? 'guest' : 'student'),
            deviceId,
            name: studentName,
            starredItems: favs,
            customTranslations: custom,
            lastBookmark: _bookmark,
            lastSeen: serverTimestamp(),
            currentStage,
            currentLesson,
            updatedAt: serverTimestamp()
          }, { merge: true });
        }

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
      const custom = JSON.parse(localStorage.getItem('muallim_custom_translations') || localStorage.getItem('muallim_custom_answers') || '{}');
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
        populateStageLessons,
        populateStageTabs,
        // backward-compat aliases (Fix 1b)
        openSearch: openSearchModal,
        openDrillSpinner: openSpinner,
        openExam: App.openExam || function(){},
        openExamConfig: App.openExam || function(){},
        openPracticeExam: App.openExam || function(){},
        openUstaadExam: App.openUstaadExam || function(){},
        startPushedExam: App.startPushedExam || function(){},
        filterCustomAnswers,
        // Firebase Auth exports (Phase 4)
        doLogin: App.doLogin || function(){},
        doGoogleLogin: App.doGoogleLogin || function(){},
        doLogout: App.doLogout || function(){},
        forgotPassword: App.forgotPassword || function(){},
        changePassword: App.changePassword || function(){},
        refreshAdminStudents: App.refreshAdminStudents || function(){},
        openLoginModal: App.openLoginModal || function(){},
        closeLoginModal: App.closeLoginModal || function(){},
        openAdminDashboard: App.openAdminDashboard || function(){},
        initFirebaseOnLoad,
        flushSessionTime,
        currentUser: null,
        getTranslation,
        setLang,
        currentLang
      });
      return App;
    })();
    window.App = App;

    App.openUstaadExam = async function() {
      const pop = document.getElementById('settings-popover');
      if (pop && pop.hidePopover) {
        try { if (!pop.matches || pop.matches(':popover-open')) pop.hidePopover(); } catch(e) {}
      }

      if (!App.currentUser) {
        if (typeof showToast === 'function') {
          showToast('Ustaad ki exam dekhne ke liye pehle login karein.');
        }
        if (typeof App.openLoginModal === 'function') App.openLoginModal();
        return;
      }

      if (_db && window._FS) {
        try {
          const { collection, getDocs, query, where } = window._FS;
          const q = query(collection(_db, 'pushed_exams'), where('status', '==', 'active'));
          const snap = await getDocs(q);
          const exams = [];
          snap.forEach(d => exams.push({ id: d.id, ...d.data() }));

          if (exams.length === 0) {
            if (typeof showToast === 'function') {
              showToast('Filhaal koi active exam ustaad ki taraf se nahi aayi.');
            }
            return;
          }

          const activeExam = exams[0];
          // Preload units in activeExam.scope if needed
          if (activeExam.scope && Array.isArray(activeExam.scope.unitKeys)) {
            for (const uk of activeExam.scope.unitKeys) {
              const uNum = parseInt(String(uk).replace(/\D/g, ''));
              if (uNum && !bookData.stages[`Stage${uNum}`]) {
                await loadUnit(uNum).catch(() => {});
              }
            }
          }

          if (typeof App.startPushedExam === 'function') {
            App.startPushedExam(activeExam);
          } else if (typeof App.openExam === 'function') {
            App.openExam();
          }
          return;
        } catch(e) {
          console.warn('[Muallim] Could not fetch pushed exams:', e);
        }
      }

      if (typeof showToast === 'function') {
        showToast('Filhaal koi active exam ustaad ki taraf se nahi aayi.');
      }
    };

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
          if (pop && pop.hidePopover) {
            try { if (!pop.matches || pop.matches(':popover-open')) pop.hidePopover(); } catch(e) {}
          }
          fn();
        });
      }
      qb('menu-btn-search', function() { if(window.App&&App.openSearchModal) App.openSearchModal(); });
      qb('menu-btn-drill',  function() { if(window.App&&App.openSpinner) App.openSpinner(); });
      qb('menu-btn-exercise', function() { if(window.App&&App.openGrammarExerciseModal) App.openGrammarExerciseModal(); });
      qb('menu-btn-favs',   function() { if(window.App&&App.openFavourites) App.openFavourites(); });
      qb('menu-btn-custom', function() { if(window.App&&App.openCustomAnswersModal) App.openCustomAnswersModal(); });
      qb('menu-btn-exam',   function() { if(window.App&&App.openExam) App.openExam(); });
      qb('menu-btn-ustaad-exam', function() { if(window.App&&App.openUstaadExam) App.openUstaadExam(); });

      // Auto-init Firebase (App.initFirebaseOnLoad is exported from the IIFE)
      if (window.App && typeof App.initFirebaseOnLoad === 'function') App.initFirebaseOnLoad();
    });

    // Best-effort flush on unload
    window.addEventListener('beforeunload', function() {
      // Flush session time for current lesson
      if (typeof flushSessionTime === 'function') flushSessionTime();
      if (typeof _syncDebounceTimer !== 'undefined' && _syncDebounceTimer) {
        clearTimeout(_syncDebounceTimer);
        if (typeof syncAllToFirestore === 'function') syncAllToFirestore();
      }
    });

    // Escape key closes settings popover for accessibility
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        var pop = document.getElementById('settings-popover');
        if (pop && pop.hidePopover && pop.matches(':popover-open')) {
          pop.hidePopover();
        }
      }
    });

    // ── Smart Onboarding Prompts ────────────────────────────────────────────
    (function() {
      function _ls(k) { try { return localStorage.getItem(k); } catch(e) { return null; } }
      function _lsSet(k, v) { try { localStorage.setItem(k, v); } catch(e) {} }

      window._closeOnboard = function(key, val) {
        var modal = document.getElementById('onboard-modal');
        if (modal && modal.close) modal.close();
        if (key) _lsSet(key, val || 'done');
      };

      window._saveOnboardName = function() {
        var input = document.getElementById('ob-name-in');
        var n = input ? input.value.trim() : '';
        if (!n) return;
        _lsSet('muallim_student_name', n);
        _lsSet('muallim_onboard_name_done', 'done');
        var modal = document.getElementById('onboard-modal');
        if (modal && modal.close) modal.close();
        if (window.App && typeof window.App.initStudentName === 'function') window.App.initStudentName();
        if (typeof debouncedSync === 'function') debouncedSync(500);
      };

      function showOnboard(type) {
        var modal = document.getElementById('onboard-modal');
        var body = document.getElementById('onboard-body');
        if (!modal || !body) return;

        if (type === 'name') {
          body.innerHTML = '<div class="onboard-icon">✏️</div>'
            + '<div class="onboard-title">Aapka naam kya hai?</div>'
            + '<div class="onboard-desc">Apna naam likhen taake aapki progress save ho sake.</div>'
            + '<input class="onboard-name-input" id="ob-name-in" type="text" placeholder="Apna naam yahan likhen..." maxlength="40">'
            + '<div class="onboard-actions">'
            + '<button class="btn-ghost" onclick="window._closeOnboard(\'muallim_onboard_name_done\', \'skipped\')">Skip</button>'
            + '<button class="btn-primary" onclick="window._saveOnboardName()">Save Name</button>'
            + '</div>';
        } else if (type === 'notification') {
          body.innerHTML = '<div class="onboard-icon">🔔</div>'
            + '<div class="onboard-title">Notifications allow karein?</div>'
            + '<div class="onboard-desc">Ustaad ke important paighaam aur reminders milenge.</div>'
            + '<div class="onboard-actions">'
            + '<button class="btn-ghost" onclick="window._closeOnboard(\'muallim_onboard_notif_done\', \'denied\')">Skip</button>'
            + '<button class="btn-primary" onclick="window._closeOnboard(\'muallim_onboard_notif_done\', \'done\'); if(window.App&&App.enablePushNotifications) App.enablePushNotifications();">Allow</button>'
            + '</div>';
        } else if (type === 'install') {
          body.innerHTML = '<div class="onboard-icon">📲</div>'
            + '<div class="onboard-title">App install karein?</div>'
            + '<div class="onboard-desc">Home screen par add karein — internet ke baghair bhi chalega!</div>'
            + '<div class="onboard-actions">'
            + '<button class="btn-ghost" onclick="window._closeOnboard(\'muallim_onboard_install_done\', \'denied\')">Skip</button>'
            + '<button class="btn-primary" onclick="window._closeOnboard(\'muallim_onboard_install_done\', \'done\'); if(window.App&&App.promptInstall) App.promptInstall();">Install</button>'
            + '</div>';
        }
        if (modal.showModal) modal.showModal();
      }

      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
          var count = parseInt(_ls('muallim_session_count') || '0') + 1;
          _lsSet('muallim_session_count', String(count));

          if (!_ls('muallim_onboard_name_done') && !_ls('muallim_student_name')) {
            showOnboard('name'); return;
          }
          if (count >= 2 && !_ls('muallim_onboard_notif_done')
              && typeof Notification !== 'undefined' && Notification.permission === 'default') {
            showOnboard('notification'); return;
          }
          if (count >= 3 && !_ls('muallim_onboard_install_done')) {
            var hasDeferredPrompt = false;
            try { hasDeferredPrompt = !!window._deferredInstallPrompt; } catch(e) {}
            if (hasDeferredPrompt) { showOnboard('install'); }
          }
        }, 1800);
      });
    })();

    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./sw.js').catch(function(err) {
        console.warn('[Muallim] ServiceWorker registration failed:', err);
      });
    }