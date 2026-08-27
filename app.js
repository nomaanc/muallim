/* Muallim ul-Quran -- App Logic v2.0 */

    const App = (function() {
      let currentStage = 1;
      let currentLesson = 1;
      let audioSpeed = parseFloat(localStorage.getItem('muallim_audio_speed') || '1.0');
      let favourites = JSON.parse(localStorage.getItem('muallim_favs') || '[]');
      let customAnswers = JSON.parse(localStorage.getItem('muallim_custom_answers') || '{}');
      let activeEditKey = null;
      let spinnerMode = 'starred'; // 'starred' or 'lesson'
      let spinnerPool = [];
      let spinnerIndex = 0;
      let isSpinnerRevealed = false;

      function init() {
        setupEventListeners();
        setAudioSpeed(audioSpeed, false);
        loadLesson(1, 1);
        populateStageTabs();
        updateStarredCountBadge();
        updateBookmarksBadge();
        // Phase 8: offer to resume previous reading position
        setTimeout(() => { if (typeof offerResume === 'function') offerResume(); }, 1500);
      }

      function setupEventListeners() {
        document.getElementById('btn-lesson-picker')?.addEventListener('click', () => {
          document.getElementById('lesson-picker-modal').showModal();
        });
        // Phase 7: search/spinner/favs are now in the menu panel; guard in case old HTML is used
        document.getElementById('btn-open-search')?.addEventListener('click', openSearchModal);
        document.getElementById('btn-open-spinner')?.addEventListener('click', openSpinner);
        document.getElementById('btn-open-favs')?.addEventListener('click', openFavourites);
      }


      function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('muallim_theme', theme);
        document.getElementById('theme-light-btn')?.classList.toggle('selected', theme === 'light');
        document.getElementById('theme-dark-btn')?.classList.toggle('selected', theme === 'dark');
        if (typeof syncMenuState === 'function') syncMenuState();
      }

      function setMode(mode) {
        document.documentElement.setAttribute('data-mode', mode);
        localStorage.setItem('muallim_mode', mode);
        document.getElementById('mode-teacher-btn')?.classList.toggle('selected', mode === 'teacher');
        document.getElementById('mode-student-btn')?.classList.toggle('selected', mode === 'student');
        if (typeof syncMenuState === 'function') syncMenuState();
      }


      function setFontSize(type, val) {
        // Legacy: absolute value from slider ('arabic', number)
        if (type === 'arabic') {
          document.documentElement.style.setProperty('--arabic-scale', val + 'px');
          localStorage.setItem('muallim_ar_scale', val);
          const lbl = document.getElementById('ar-size-label');
          if (lbl) lbl.textContent = Math.round(val) + 'px';
          return;
        }
        // Phase 7: delta-based from menu buttons ('ar' or 'lat', ±1)
        const prop = type === 'ar' ? '--arabic-scale' : '--hinglish-scale';
        const storKey = type === 'ar' ? 'muallim_ar_scale' : 'muallim_lat_scale';
        const labelId = type === 'ar' ? 'ar-size-label' : 'lat-size-label';
        const min = type === 'ar' ? 18 : 11;
        const max = type === 'ar' ? 44 : 24;
        const cur = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(prop)) || (type === 'ar' ? 26 : 15);
        const next = Math.min(max, Math.max(min, cur + val));
        document.documentElement.style.setProperty(prop, next + 'px');
        localStorage.setItem(storKey, next);
        const lbl = document.getElementById(labelId);
        if (lbl) lbl.textContent = next + 'px';
      }


      function setAudioSpeed(val, save = true) {
        audioSpeed = parseFloat(val);
        document.getElementById('speech-rate-slider').value = audioSpeed;
        document.getElementById('speed-val-label').textContent = audioSpeed.toFixed(2) + 'x';
        if (save) {
          localStorage.setItem('muallim_audio_speed', audioSpeed.toString());
        }
      }

      function speakArabic(text) {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const clean = text.replace(/[﴿﴾]/g, '');
        const utter = new SpeechSynthesisUtterance(clean);
        utter.lang = 'ar-SA';
        utter.rate = audioSpeed;
        window.speechSynthesis.speak(utter);
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
        document.getElementById('edit-arabic-preview').textContent = arabic;
        document.getElementById('edit-orig-preview').textContent = originalHinglish;
        document.getElementById('custom-answer-input').value = customAnswers[itemKey] || '';
        document.getElementById('custom-edit-modal').showModal();
      }

      function saveCustomAnswer() {
        if (!activeEditKey) return;
        const val = document.getElementById('custom-answer-input').value.trim();
        if (val) {
          customAnswers[activeEditKey] = val;
        } else {
          delete customAnswers[activeEditKey];
        }
        localStorage.setItem('muallim_custom_answers', JSON.stringify(customAnswers));
        document.getElementById('custom-edit-modal').close();
        renderCurrentLesson();
      }

      function deleteCustomAnswer() {
        if (!activeEditKey) return;
        delete customAnswers[activeEditKey];
        localStorage.setItem('muallim_custom_answers', JSON.stringify(customAnswers));
        document.getElementById('custom-edit-modal').close();
        renderCurrentLesson();
      }

      function loadLesson(stageId, lessonId) {
        currentStage = stageId;
        currentLesson = lessonId;
        renderCurrentLesson();
        document.getElementById('current-lesson-label').textContent = `Unit ${stageId} Lesson ${lessonId}`;
        document.title = `Muallim ul-Qur'an \u2014 Unit ${stageId} Lesson ${lessonId}`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Phase 8: start progress tracking for this lesson
        if (typeof startScrollWatcher === 'function') startScrollWatcher(stageId, lessonId);
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

      // ── Phase 3: Grammar Banner ──────────────────────────────────────
      function renderGrammarBanner(text) {
        if (!text) return '';
        // Wrap Arabic-script sequences in <span lang="ar"> for bidi + font
        const withArabic = text.replace(
          /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]+/g,
          m => `<span lang="ar">${m}</span>`
        );
        return `<div class="grammar-banner" role="note" aria-label="Grammar note">
          <span class="grammar-banner-icon" aria-hidden="true">💡</span>
          <div class="grammar-banner-text">${withArabic}</div>
        </div>`;
      }

      // ── Phase 4: Sentence Number ─────────────────────────────────────
      function renderSentenceNumber(num) {
        if (num == null) return '';
        return `<span class="sentence-number"
          title="Sentence ${num} — click to copy"
          onclick="navigator.clipboard&&navigator.clipboard.writeText('${num}').then(()=>showToast('#${num} copied'))"
        >${num}.</span>`;
      }

      function renderCurrentLesson() {


        const stageKey = `Stage${currentStage}`;
        const stageData = window.PWA_BOOK_DATA.stages[stageKey] || [];
        const lesson = stageData.find(l => l.lesson_id === currentLesson) || stageData[0];

        if (!lesson) {
          document.getElementById('lesson-content-mount').innerHTML = '<p>Lesson data not found.</p>';
          return;
        }

        let html = `
          <div class="lesson-banner">
            <div class="lesson-banner-title">${lesson.title}</div>
            <div class="lesson-banner-meta">Stage ${currentStage} • Page ${lesson.page_start || 1}</div>
          </div>
        `;

        (lesson.sections || []).forEach((sec, sIdx) => {
          const secType = sec.type;
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
              const isSentence = it.type === 'sentence' || it.sentence_number != null;
              const cardHtml = `
                <div class="vocab-card" data-item-id="${itemKey}" style="position:relative">
                  <span class="bookmark-indicator" style="display:${BookmarkStore.has(itemKey)?'block':'none'}">📌</span>
                  <div class="card-top">
                    <button class="card-action-btn" onclick="App.speakArabic('${escAr}')">🔊</button>
                    <button class="card-action-btn ${starred ? 'starred' : ''}" onclick="App.toggleStarInPlace(this, '${itemKey}', '${escAr}', '${escHi}')">★</button>
                  </div>
                  <div class="arabic-text">${it.arabic}</div>
                  ${renderDualAnswerHtml(itemKey, it.arabic, it.hinglish)}
                </div>
              `;
              if (isSentence) {
                html += `<div class="sentence-card-wrapper">
                  ${renderSentenceNumber(it.sentence_number)}
                  ${renderGrammarBanner(it.grammar_banner)}
                  ${cardHtml}
                </div>`;
              } else {
                html += renderGrammarBanner(it.grammar_banner);
                html += cardHtml;
              }
            });

            html += `</div>`;

          } else if (secType === 'two_col_numbered_list') {
            html += `<div class="bidi-grid cols-2">`;
            (d.items || []).forEach((it, iIdx) => {
              const itemKey = `S${currentStage}L${currentLesson}_num_${it.id || iIdx}`;
              const starred = isStarred(itemKey);
              const escAr = (it.arabic || '').replace(/'/g, "\\'");
              const escHi = (it.hinglish || '').replace(/'/g, "\\'");
              const isSentence = it.type === 'sentence' || it.sentence_number != null;
              const cardHtml = `
                <div class="vocab-card" data-item-id="${itemKey}" style="${it.full_width ? 'grid-column: 1 / -1;' : ''} position:relative">
                  <span class="bookmark-indicator" style="display:${BookmarkStore.has(itemKey)?'block':'none'}">📌</span>
                  <div class="card-top">
                    <button class="card-action-btn" onclick="App.speakArabic('${escAr}')">🔊</button>
                    <button class="card-action-btn ${starred ? 'starred' : ''}" onclick="App.toggleStarInPlace(this, '${itemKey}', '${escAr}', '${escHi}')">★</button>
                  </div>
                  <div class="arabic-text">${it.arabic}</div>
                  ${renderDualAnswerHtml(itemKey, it.arabic, it.hinglish)}
                </div>
              `;
              if (isSentence) {
                html += `<div class="sentence-card-wrapper">
                  ${renderSentenceNumber(it.sentence_number)}
                  ${renderGrammarBanner(it.grammar_banner)}
                  ${cardHtml}
                </div>`;
              } else {
                html += renderGrammarBanner(it.grammar_banner);
                html += cardHtml;
              }
            });
            html += `</div>`;
          } else if (secType === 'section_label') {
            if (d.text) html += `<div class="section-label-heading">${d.text}</div>`;
          } else if (secType === 'exercise_header') {
            html += `<div class="exercise-divider" role="separator"><span>✏️ مشق</span></div>`;
          } else if (secType === 'qn_label') {
            html += `<div class="qn-label"><span class="qn-number">Q${d.q_number || ''}</span><span class="qn-instruction">${d.instruction || ''}</span></div>`;
          } else if (secType === 'verse_block' || secType === 'exercise_verses') {
            html += `<div class="bidi-grid cols-1">`;
            const verses = d.verses || d.items || [];
            verses.forEach((v, vIdx) => {
              const itemKey = `S${currentStage}L${currentLesson}_v_${vIdx}`;
              const starred = isStarred(itemKey);
              const escAr = (v.arabic || '').replace(/'/g, "\\'");
              const escHi = (v.hinglish || '').replace(/'/g, "\\'");
              const cardHtml = `
                <div class="verse-card" data-item-id="${itemKey}" style="position:relative">
                  <span class="bookmark-indicator" style="display:${BookmarkStore.has(itemKey)?'block':'none'}">📌</span>
                  <div class="card-top">
                    <button class="card-action-btn" onclick="App.speakArabic('${escAr}')">🔊</button>
                    <button class="card-action-btn ${starred ? 'starred' : ''}" onclick="App.toggleStarInPlace(this, '${itemKey}', '${escAr}', '${escHi}')">★</button>
                  </div>
                  <div class="arabic-text" style="font-size:calc(var(--arabic-scale)*1.1);">${v.arabic}</div>
                  ${v.hinglish ? renderDualAnswerHtml(itemKey, v.arabic, v.hinglish) : ''}
                </div>
              `;
              if (v.sentence_number != null) {
                html += `<div class="sentence-card-wrapper">
                  ${renderSentenceNumber(v.sentence_number)}
                  ${renderGrammarBanner(v.grammar_banner)}
                  ${cardHtml}
                </div>`;
              } else {
                html += renderGrammarBanner(v.grammar_banner);
                html += cardHtml;
              }
            });
            html += `</div>`;
          } else if (secType === 'bullet_instruction') {
            if (d.text) html += `<div class="bullet-instruction" style="margin:8px 0;font-size:0.95rem;color:var(--text-muted, #555);">• ${d.text}</div>`;
          } else if (secType === 'example_table') {
            const rows = d.rows || d.items || [];
            if (rows.length > 0) {
              html += `<div class="example-table-wrapper" style="overflow-x:auto;margin:12px 0;"><table class="example-table" style="width:100%;border-collapse:collapse;">`;
              if (d.headers && d.headers.length) {
                html += `<thead><tr>${d.headers.map(h => `<th style="border:1px solid var(--border-color,#ddd);padding:6px 10px;background:var(--bg-secondary,#f9f9f9);">${h}</th>`).join('')}</tr></thead>`;
              }
              html += `<tbody>`;
              rows.forEach(r => {
                const cells = Array.isArray(r) ? r : [r.col1 || r.arabic, r.col2 || r.hinglish, r.col3 || ''].filter(Boolean);
                html += `<tr>${cells.map(c => `<td style="border:1px solid var(--border-color,#ddd);padding:6px 10px;text-align:center;">${c}</td>`).join('')}</tr>`;
              });
              html += `</tbody></table></div>`;
            }
          } else if (secType === 'spacer') {
            const h = d.height || 16;
            html += `<div class="section-spacer" style="height:${h}px;" aria-hidden="true"></div>`;
          } else if (secType === 'ayah_pause_block') {
            html += `<div class="bidi-grid cols-1">`;
            (d.items || []).forEach((it, iIdx) => {
              const itemKey = `S${currentStage}L${currentLesson}_apb_${it.id || iIdx}`;
              const starred = isStarred(itemKey);
              const escAr = (it.arabic || '').replace(/'/g, "\\'");
              const escHi = (it.hinglish || '').replace(/'/g, "\\'");
              const cardHtml = `
                <div class="verse-card ayah-pause-card" data-item-id="${itemKey}" style="position:relative">
                  <span class="bookmark-indicator" style="display:${BookmarkStore.has(itemKey)?'block':'none'}">📌</span>
                  <div class="card-top">
                    <button class="card-action-btn" onclick="App.speakArabic('${escAr}')">🔊</button>
                    <button class="card-action-btn ${starred ? 'starred' : ''}" onclick="App.toggleStarInPlace(this, '${itemKey}', '${escAr}', '${escHi}')">★</button>
                  </div>
                  <div class="arabic-text" style="font-size:calc(var(--arabic-scale)*1.1);">${it.arabic}</div>
                  ${it.hinglish ? renderDualAnswerHtml(itemKey, it.arabic, it.hinglish) : ''}
                </div>
              `;
              if (it.sentence_number != null) {
                html += `<div class="sentence-card-wrapper">
                  ${renderSentenceNumber(it.sentence_number)}
                  ${renderGrammarBanner(it.grammar_banner)}
                  ${cardHtml}
                </div>`;
              } else {
                html += renderGrammarBanner(it.grammar_banner);
                html += cardHtml;
              }
            });
            html += `</div>`;
          } else if (secType === 'tashbeeh_grid') {
            const items = d.items || [];
            if (items.length > 0) {
              html += `<div class="bidi-grid cols-2">`;
              items.forEach((it, iIdx) => {
                const itemKey = `S${currentStage}L${currentLesson}_tg_${it.id || iIdx}`;
                const starred = isStarred(itemKey);
                const escAr = (it.arabic || '').replace(/'/g, "\\'");
                const escHi = (it.hinglish || '').replace(/'/g, "\\'");
                html += `
                  <div class="vocab-card" data-item-id="${itemKey}" style="position:relative">
                    <div class="card-top">
                      <button class="card-action-btn" onclick="App.speakArabic('${escAr}')">🔊</button>
                      <button class="card-action-btn ${starred ? 'starred' : ''}" onclick="App.toggleStarInPlace(this, '${itemKey}', '${escAr}', '${escHi}')">★</button>
                    </div>
                    <div class="arabic-text">${it.arabic}</div>
                    ${renderDualAnswerHtml(itemKey, it.arabic, it.hinglish)}
                  </div>
                `;
              });
              html += `</div>`;
            }
          }
        });

        document.getElementById('lesson-content-mount').innerHTML = html;

        // Phase 5: wire up long-press gestures and refresh bookmark indicators
        requestAnimationFrame(() => {
          document.querySelectorAll('.vocab-card[data-item-id]').forEach(cardEl => {
            const itemId = cardEl.dataset.itemId;
            // find item data from current lesson for the popup
            const stageData = window.PWA_BOOK_DATA.stages[`Stage${currentStage}`] || [];
            const les = stageData.find(l => l.lesson_id === currentLesson);
            if (!les) return;
            for (const sec of (les.sections || [])) {
              if (sec.type === 'grid' || sec.type === 'three_col_list' || sec.type === 'waw_grid') {
                const items = (sec.data || {}).items || [];
                const it = items.find((_, iIdx) => {
                  const sIdx = (les.sections || []).indexOf(sec);
                  return `S${currentStage}L${currentLesson}_s${sIdx}_${iIdx}` === itemId;
                });
                if (it) { attachLongPress(cardEl, { ...it, id: itemId }, currentStage, currentLesson); break; }
              }
            }
          });
          refreshBookmarkIndicators();
        });

        renderBottomNavigation();
      }


      function renderBottomNavigation() {
        const hasPrev = !(currentStage === 1 && currentLesson === 1);
        const currentStageKey = `Stage${currentStage}`;
        const currentLessons = window.PWA_BOOK_DATA.stages[currentStageKey] || [];
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
        document.getElementById('bottom-nav-mount').innerHTML = bottomHtml;
      }

      function populateStageTabs() {
        let tabsHtml = '';
        for (let s = 1; s <= 7; s++) {
          tabsHtml += `<button class="stage-tab ${s === currentStage ? 'active' : ''}" onclick="App.selectPickerStage(${s})">Stage ${s}</button>`;
        }
        document.getElementById('stage-tabs-mount').innerHTML = tabsHtml;
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
        const lessons = window.PWA_BOOK_DATA.stages[stageKey] || [];
        let lessonsHtml = '';
        lessons.forEach(l => {
          const isAct = (stageNum === currentStage && l.lesson_id === currentLesson);
          lessonsHtml += `<button class="lesson-chip ${isAct ? 'active' : ''}" onclick="App.pickLesson(${stageNum}, ${l.lesson_id})">${l.lesson_id}</button>`;
        });
        document.getElementById('stage-lessons-mount').innerHTML = lessonsHtml;
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
          const prevLessons = window.PWA_BOOK_DATA.stages[prevStageKey] || [];
          loadLesson(currentStage - 1, prevLessons.length);
        }
      }

      function navigateNextLesson() {
        const currentStageKey = `Stage${currentStage}`;
        const currentLessons = window.PWA_BOOK_DATA.stages[currentStageKey] || [];
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
        document.getElementById('pool-starred-btn').classList.toggle('selected', mode === 'starred');
        document.getElementById('pool-lesson-btn').classList.toggle('selected', mode === 'lesson');

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
          const stageData = window.PWA_BOOK_DATA.stages[stageKey] || [];
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
        if (spinnerPool.length === 0) {
          document.getElementById('spinner-arabic').textContent = spinnerMode === 'starred' ? 'No Starred Items Yet' : 'No Items in Current Lesson';
          document.getElementById('spinner-hinglish').innerHTML = spinnerMode === 'starred' ? 'Tap ★ on any word to star it!' : '';
          document.getElementById('spinner-hinglish').style.display = 'block';
          document.getElementById('spinner-hint').style.display = 'none';
          return;
        }
        const it = spinnerPool[spinnerIndex];
        document.getElementById('spinner-arabic').textContent = it.arabic;
        const hinglishEl = document.getElementById('spinner-hinglish');

        let displayHtml = `<div style="color:var(--fill-teacher);">${it.origHinglish}</div>`;
        if (it.customHinglish) {
          displayHtml += `<div style="color:var(--custom-fill); margin-top:4px;"><span class="custom-badge">custom</span> ${it.customHinglish}</div>`;
        }
        hinglishEl.innerHTML = displayHtml;
        hinglishEl.style.display = 'none';
        document.getElementById('spinner-hint').style.display = 'block';
        isSpinnerRevealed = false;
      }

      function toggleSpinnerReveal() {
        if (spinnerPool.length === 0) return;
        isSpinnerRevealed = !isSpinnerRevealed;
        document.getElementById('spinner-hinglish').style.display = isSpinnerRevealed ? 'block' : 'none';
        document.getElementById('spinner-hint').style.display = isSpinnerRevealed ? 'none' : 'block';
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
            favsHtml += `<div class="favs-group-header">Unit ${group.stage} &nbsp;&middot;&nbsp; Lesson ${group.lesson}</div>`;
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
          const lessons = window.PWA_BOOK_DATA.stages[stageKey] || [];
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

      return {
        init,
        setTheme,
        setMode,
        setFontSize,
        setAudioSpeed,
        speakArabic,
        toggleStarInPlace,
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
        importDataBackup
      };
    })();

    document.addEventListener('DOMContentLoaded', App.init);

    // ================================================================
    // Phase 5 — Bookmark System (module-level, outside App IIFE)
    // ================================================================

    const BookmarkStore = (() => {
      const KEY = 'muallim_bookmarks', MAX = 200;
      function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } }
      function save(l) { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch { showToast('Storage full'); } }
      return {
        add(item) {
          let l = load();
          if (l.some(b => b.id === item.id)) return false;
          l.unshift(item);
          if (l.length > MAX) { l = l.slice(0, MAX); showToast('Oldest bookmark removed (max 200)'); }
          save(l); return true;
        },
        remove(id) { save(load().filter(b => b.id !== id)); },
        has(id)    { return load().some(b => b.id === id); },
        getAll()   { return load(); },
        clear()    { save([]); }
      };
    })();

    function attachLongPress(cardEl, itemData, stage, lesson) {
      let t = null;
      const start = e => { t = setTimeout(() => { t = null; if (navigator.vibrate) navigator.vibrate(50); showBookmarkPopup(e, itemData, stage, lesson); }, 600); };
      const cancel = () => { if (t) { clearTimeout(t); t = null; } };
      cardEl.addEventListener('pointerdown', start);
      cardEl.addEventListener('pointerup', cancel);
      cardEl.addEventListener('pointermove', cancel);
      cardEl.addEventListener('pointercancel', cancel);
      cardEl.addEventListener('contextmenu', e => e.preventDefault());
    }

    function showBookmarkPopup(e, itemData, stage, lesson) {
      document.getElementById('bm-popup')?.remove();
      const isBookmarked = BookmarkStore.has(itemData.id);
      const pop = document.createElement('div');
      pop.id = 'bm-popup';
      pop.className = 'bookmark-popup';
      pop.innerHTML = `
        <button class="bookmark-popup-btn" onclick="toggleBookmark()">
          ${isBookmarked ? '🗑 Remove Bookmark' : '📌 Bookmark this'}
        </button>
        <button class="bookmark-popup-btn" onclick="copyCard()">
          📋 Copy Arabic + Hinglish
        </button>`;
      const x = Math.min((e.clientX || 100), window.innerWidth - 220);
      const y = Math.max((e.clientY || 100) - 60, 10);
      pop.style.cssText = `position:fixed;left:${x}px;top:${y}px;z-index:9999`;
      document.body.appendChild(pop);
      window._bmpData = { itemData, stage, lesson };
      setTimeout(() => document.addEventListener('pointerdown', dismissBmPopup, { once: true }), 0);
    }

    function dismissBmPopup() { document.getElementById('bm-popup')?.remove(); window._bmpData = null; }

    function toggleBookmark() {
      const { itemData, stage, lesson } = window._bmpData || {};
      if (!itemData) return;
      if (BookmarkStore.has(itemData.id)) {
        BookmarkStore.remove(itemData.id);
        showToast('Bookmark removed');
      } else {
        BookmarkStore.add({
          id: itemData.id,
          sentence_number: itemData.sentence_number || null,
          arabic: itemData.arabic || '',
          hinglish: itemData.hinglish || '',
          stage: stage, lesson: lesson,
          lesson_key: `S${stage}L${lesson}`,
          label: `Stage ${stage} \u00b7 Lesson ${lesson}`,
          timestamp: Date.now()
        });
        showToast('📌 Bookmarked!');
      }
      refreshBookmarkIndicators();
      dismissBmPopup();
      updateBookmarksBadge();
    }

    function copyCard() {
      const { itemData } = window._bmpData || {};
      if (!itemData) return;
      navigator.clipboard?.writeText(`${itemData.arabic}\n${itemData.hinglish}`).then(() => showToast('Copied!'));
      dismissBmPopup();
    }

    function refreshBookmarkIndicators() {
      document.querySelectorAll('.vocab-card[data-item-id]').forEach(card => {
        const ind = card.querySelector('.bookmark-indicator');
        if (ind) ind.style.display = BookmarkStore.has(card.dataset.itemId) ? 'block' : 'none';
      });
    }

    function openBmDrawer() {
      const list = document.getElementById('bm-list');
      if (!list) return;
      const bms = BookmarkStore.getAll();
      if (typeof closeMenuPanel === 'function') closeMenuPanel();
      list.innerHTML = bms.length === 0
        ? `<div class="drawer-empty">📌<br><br>No bookmarks yet.<br><small>Long-press any sentence card to bookmark it.</small></div>`
        : bms.map(bm => `<div class="bookmark-entry" data-id="${bm.id}">
            <div class="bookmark-entry-header">
              <span class="bookmark-label">${bm.label}${bm.sentence_number ? ' · #'+bm.sentence_number : ''}</span>
              <button class="icon-btn" onclick="event.stopPropagation();removeBm('${bm.id}')">🗑</button>
            </div>
            <div class="bookmark-arabic" dir="rtl">${bm.arabic}</div>
            <div class="bookmark-hinglish">${bm.hinglish}</div>
            <div class="bookmark-date">${new Date(bm.timestamp).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div>
          </div>`).join('');
      list.querySelectorAll('.bookmark-entry').forEach(el => {
        const bm = bms.find(b => b.id === el.dataset.id);
        if (bm) el.addEventListener('click', () => { closeBmDrawer(); jumpToBookmark(bm); });
      });
      document.getElementById('bm-drawer')?.classList.add('open');
      document.getElementById('bm-backdrop')?.classList.add('visible');
      document.body.style.overflow = 'hidden';
    }

    function closeBmDrawer() {
      document.getElementById('bm-drawer')?.classList.remove('open');
      document.getElementById('bm-backdrop')?.classList.remove('visible');
      document.body.style.overflow = '';
    }

    function removeBm(id) { BookmarkStore.remove(id); showToast('Bookmark removed'); openBmDrawer(); refreshBookmarkIndicators(); updateBookmarksBadge(); }

    function clearAllBookmarks() {
      if (!confirm('Remove all bookmarks?')) return;
      BookmarkStore.clear(); openBmDrawer(); refreshBookmarkIndicators(); updateBookmarksBadge();
    }

    function jumpToBookmark(bm) {
      App.loadLesson(bm.stage, bm.lesson);
      setTimeout(() => {
        const card = document.querySelector(`[data-item-id="${bm.id}"]`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.classList.add('highlight-flash');
          setTimeout(() => card.classList.remove('highlight-flash'), 1800);
        }
      }, 400);
    }

    // ================================================================
    // Phase 9 — Enhanced Toast (replaces Phase 5 basic version)
    // ================================================================
    function showToast(msg, duration, actionLabel, actionFn) {
      duration = duration || 3500;
      document.getElementById('app-toast')?.remove();
      const t = document.createElement('div');
      t.id = 'app-toast'; t.className = 'app-toast';
      t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite');
      t.innerHTML = `<span class="toast-msg">${msg}</span>${actionLabel ? `<button class="toast-action">${actionLabel}</button>` : ''}`;
      document.body.appendChild(t);
      if (actionFn) t.querySelector('.toast-action')?.addEventListener('click', () => { actionFn(); t.remove(); });
      requestAnimationFrame(() => t.classList.add('visible'));
      setTimeout(() => { t.classList.remove('visible'); setTimeout(() => t.remove(), 300); }, duration);
    }

    // ================================================================
    // Phase 7 — Slide-In Menu Panel JS (module-level globals)
    // ================================================================

    function openMenuPanel() {
      document.getElementById('menu-panel')?.classList.add('open');
      document.getElementById('menu-backdrop')?.classList.add('visible');
      document.getElementById('menu-toggle-btn')?.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      syncMenuState();
      updateBookmarksBadge();
      updateProgressDisplay();
    }

    function closeMenuPanel() {
      document.getElementById('menu-panel')?.classList.remove('open');
      document.getElementById('menu-backdrop')?.classList.remove('visible');
      document.getElementById('menu-toggle-btn')?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    function syncMenuState() {
      const dark    = document.documentElement.getAttribute('data-theme') === 'dark';
      const teacher = document.documentElement.getAttribute('data-mode')  === 'teacher';
      const tt = document.getElementById('theme-toggle');
      const mt = document.getElementById('mode-toggle');
      if (tt) { tt.classList.toggle('active', dark);    tt.setAttribute('aria-checked', dark); }
      if (mt) { mt.classList.toggle('active', teacher); mt.setAttribute('aria-checked', teacher); }
      const arPx  = getComputedStyle(document.documentElement).getPropertyValue('--arabic-scale').trim();
      const latPx = getComputedStyle(document.documentElement).getPropertyValue('--hinglish-scale').trim();
      const al = document.getElementById('ar-size-label');  if (al)  al.textContent  = arPx;
      const ll = document.getElementById('lat-size-label'); if (ll)  ll.textContent  = latPx;
    }

    // updateBookmarksBadge — updates menu panel badge AND header badge
    function updateBookmarksBadge() {
      const n  = BookmarkStore.getAll().length;
      const cb = document.getElementById('bm-count-badge'); if (cb) cb.textContent = n || '';
      const mb = document.getElementById('menu-badge');
      if (mb) { mb.textContent = n; mb.style.display = n > 0 ? 'block' : 'none'; }
    }

    function shareApp() {
      const d = { title: "Muallim ul-Qur'an", text: 'Interactive Quranic Arabic workbook with Hinglish translations', url: 'https://nomaanc.github.io/muallim/' };
      if (navigator.share && navigator.canShare(d)) navigator.share(d);
      else navigator.clipboard?.writeText(d.url).then(() => showToast('Link copied!'));
    }

    // Global Escape key handler
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeMenuPanel(); closeBmDrawer(); dismissBmPopup(); }
    });

    // ================================================================
    // Phase 8 — Reading Progress
    // ================================================================

    const ProgressStore = (() => {
      const KEY = 'muallim_progress';
      function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } }
      function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} }
      return {
        savePos(stage, lesson) {
          const d = load();
          d.last_position = { stage, lesson, scrollY: window.scrollY, savedAt: Date.now() };
          save(d);
        },
        markViewed(key) {
          const d = load();
          if (!d.viewed) d.viewed = {};
          d.viewed[key] = true;
          save(d);
        },
        getLast()   { return load().last_position || null; },
        getViewed() { return load().viewed || {}; }
      };
    })();

    let _swTimer = null;
    function startScrollWatcher(stage, lesson) {
      if (_swTimer) clearInterval(_swTimer);
      let marked = false;
      const key = `S${stage}L${lesson}`;
      _swTimer = setInterval(() => {
        ProgressStore.savePos(stage, lesson);
        if (!marked) {
          const pct = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
          if (pct > 0.5) { marked = true; ProgressStore.markViewed(key); updateProgressDisplay(); }
        }
      }, 30000);
      window.addEventListener('pagehide', () => ProgressStore.savePos(stage, lesson), { once: true });
    }

    // Header thin progress bar — fills as user scrolls
    window.addEventListener('scroll', () => {
      const pct = Math.min(100, Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100));
      const bar = document.getElementById('reading-progress-bar');
      if (bar) bar.style.width = pct + '%';
    }, { passive: true });

    function offerResume() {
      const last = ProgressStore.getLast();
      if (!last) return;
      const mins = Math.round((Date.now() - last.savedAt) / 60000);
      if (mins > 60 * 24 * 7) return;
      const label = mins < 60 ? `${mins}m ago` : `${Math.round(mins / 60)}h ago`;
      showToast(
        `Continue from Stage ${last.stage} Lesson ${last.lesson}? (${label})`,
        8000,
        'Continue',
        () => App.loadLesson(last.stage, last.lesson)
      );
    }

    function updateProgressDisplay() {
      const el = document.getElementById('progress-display');
      if (!el) return;
      const viewed = ProgressStore.getViewed();
      const stages = window.PWA_BOOK_DATA?.stages || {};
      el.innerHTML = Object.keys(stages).map(sk => {
        const ls = stages[sk];
        if (!ls?.length) return '';
        const total = ls.length;
        const done  = ls.filter(l => viewed[l.lesson_key]).length;
        const pct   = Math.round(done / total * 100);
        const num   = sk.replace('Stage', '');
        return `<div class="progress-stage-row">
          <div class="progress-stage-label"><span>Stage ${num}</span><span>${done}/${total} · ${pct}%</span></div>
          <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
        </div>`;
      }).join('') || '<div style="color:var(--text-muted);font-size:0.85rem;padding:8px 0">Read lessons to track progress</div>';
    }
