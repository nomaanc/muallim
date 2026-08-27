/* Muallim ul-Quran -- App Logic v2.0 */

    const App = (function() {
      let currentStage = 1;
      let currentLesson = 1;
      let audioSpeed = parseFloat(localStorage.getItem('muallim_audio_speed') || '1.0');
      let favourites = JSON.parse(localStorage.getItem('muallim_favs') || '[]');
      let customAnswers = JSON.parse(localStorage.getItem('muallim_custom_answers') || '{}');
      let activeEditKey = null;
      let spinnerScope  = 'lesson';  // 'lesson' | 'unit' | 'all'
      let spinnerFilter = 'all';     // 'starred' | 'all'
      let spinnerScopeValue = null;  // {stage, lesson} or unit number
      let spinnerPool = [];
      let spinnerIndex = 0;
      let isSpinnerRevealed = false;

      function init() {
        setupEventListeners();
        setAudioSpeed(audioSpeed, false);

        // Auto-resume from single bookmark if exists
        const bm = BookmarkStore.get();
        if (bm && bm.stage && bm.lesson) {
          loadLesson(bm.stage, bm.lesson);
          setTimeout(() => {
            const card = document.querySelector(`[data-item-id="${bm.id}"]`);
            if (card) {
              card.scrollIntoView({ behavior: 'smooth', block: 'center' });
              card.classList.add('highlight-flash');
              setTimeout(() => card.classList.remove('highlight-flash'), 1800);
            }
          }, 600);
        } else {
          loadLesson(1, 1);
        }

        populateStageTabs();
        updateStarredCountBadge();
        // updateBookmarksBadge() removed — bookmark drawer gone
        
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
                  <div class="card-top">
                    <button class="card-action-btn" onclick="App.speakArabic('${escAr}')">🔊</button>
                    <button class="card-action-btn ${starred ? 'starred' : ''}" onclick="App.toggleStarInPlace(this, '${itemKey}', '${escAr}', '${escHi}')">★</button>
                    <button class="card-action-btn btn-bookmark${BookmarkStore.isBookmarked(itemKey) ? ' bookmarked' : ''}" data-item-id="${itemKey}" onclick="setBookmark('${itemKey}', ${currentStage}, ${currentLesson}, '${escAr}', '${escHi}')" title="Bookmark"><svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></button>
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
                  <div class="card-top">
                    <button class="card-action-btn" onclick="App.speakArabic('${escAr}')">🔊</button>
                    <button class="card-action-btn ${starred ? 'starred' : ''}" onclick="App.toggleStarInPlace(this, '${itemKey}', '${escAr}', '${escHi}')">★</button>
                    <button class="card-action-btn btn-bookmark${BookmarkStore.isBookmarked(itemKey) ? ' bookmarked' : ''}" data-item-id="${itemKey}" onclick="setBookmark('${itemKey}', ${currentStage}, ${currentLesson}, '${escAr}', '${escHi}')" title="Bookmark"><svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></button>
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
                  <div class="card-top">
                    <button class="card-action-btn" onclick="App.speakArabic('${escAr}')">🔊</button>
                    <button class="card-action-btn ${starred ? 'starred' : ''}" onclick="App.toggleStarInPlace(this, '${itemKey}', '${escAr}', '${escHi}')">★</button>
                    <button class="card-action-btn btn-bookmark${BookmarkStore.isBookmarked(itemKey) ? ' bookmarked' : ''}" data-item-id="${itemKey}" onclick="setBookmark('${itemKey}', ${currentStage}, ${currentLesson}, '${escAr}', '${escHi}')" title="Bookmark"><svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></button>
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
                  <div class="card-top">
                    <button class="card-action-btn" onclick="App.speakArabic('${escAr}')">🔊</button>
                    <button class="card-action-btn ${starred ? 'starred' : ''}" onclick="App.toggleStarInPlace(this, '${itemKey}', '${escAr}', '${escHi}')">★</button>
                    <button class="card-action-btn btn-bookmark${BookmarkStore.isBookmarked(itemKey) ? ' bookmarked' : ''}" data-item-id="${itemKey}" onclick="setBookmark('${itemKey}', ${currentStage}, ${currentLesson}, '${escAr}', '${escHi}')" title="Bookmark"><svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></button>
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
                      <button class="card-action-btn btn-bookmark${BookmarkStore.isBookmarked(itemKey) ? ' bookmarked' : ''}" data-item-id="${itemKey}" onclick="setBookmark('${itemKey}', ${currentStage}, ${currentLesson}, '${escAr}', '${escHi}')" title="Bookmark"><svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></button>
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
        if (!spinnerScopeValue) {
          spinnerScopeValue = spinnerScope === 'unit' ? currentStage : { stage: currentStage, lesson: currentLesson };
        }
        _renderSpinnerScopePicker();
        _buildSpinnerPool();
        document.getElementById('spinner-modal').showModal();
      }

      function setSpinnerScope(scope) {
        spinnerScope = scope;
        spinnerScopeValue = scope === 'unit' ? currentStage
                          : scope === 'lesson' ? { stage: currentStage, lesson: currentLesson }
                          : null;
        document.querySelectorAll('#spinner-scope-group .spinner-seg').forEach(b =>
          b.classList.toggle('selected', b.dataset.scope === scope));
        _renderSpinnerScopePicker();
        _buildSpinnerPool();
      }

      function setSpinnerFilter(filter) {
        spinnerFilter = filter;
        document.querySelectorAll('#spinner-filter-group .spinner-seg').forEach(b =>
          b.classList.toggle('selected', b.dataset.filter === filter));
        _buildSpinnerPool();
      }

            let _spinnerSelectedLessons = [];

      function _renderSpinnerScopePicker() {
        const picker = document.getElementById('spinner-scope-picker');
        if (spinnerScope === 'all') {
          picker.style.display = 'none';
          picker.innerHTML = '';
          return;
        }
        picker.style.display = 'block';

        const st = typeof spinnerScopeValue === 'number' ? spinnerScopeValue : (spinnerScopeValue?.stage || currentStage);
        const stageData = window.PWA_BOOK_DATA.stages[`Stage${st}`] || [];

        picker.innerHTML = `
          <div class="spinner-scope-studio">
            <div class="spinner-tabs-bar">
              ${[1,2,3,4,5,6,7].map(s => `
                <button class="spinner-tab-btn ${s===st?'selected':''}" onclick="App._setSpinnerStageTab(${s})">
                  Unit ${s}
                </button>
              `).join('')}
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <small><strong>Unit ${st} Lessons:</strong></small>
              <div style="display:flex;gap:4px;">
                <button class="btn-secondary" style="font-size:0.72rem;padding:2px 6px;" onclick="App._selectAllStageLessons(${st})">All Unit ${st}</button>
                <button class="btn-secondary" style="font-size:0.72rem;padding:2px 6px;" onclick="App._clearSpinnerLessons()">Clear</button>
              </div>
            </div>
            <div class="spinner-lesson-grid">
              ${stageData.map(l => {
                const count = (l.sections || []).reduce((acc, sec) => acc + ((sec.data && sec.data.items) ? sec.data.items.length : 0), 0);
                const isSel = _spinnerSelectedLessons.some(x => x.stage === st && x.lesson === l.lesson_id);
                return `
                  <div class="spinner-lesson-chip ${isSel?'selected':''}" onclick="App._toggleSpinnerLessonChip(${st}, ${l.lesson_id})">
                    <span>L${l.lesson_id}</span>
                    <span class="spinner-count-badge">${count}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }

      function _setSpinnerStageTab(stage) {
        spinnerScopeValue = { stage, lesson: 1 };
        _renderSpinnerScopePicker();
      }

      function _toggleSpinnerLessonChip(stage, lesson) {
        const idx = _spinnerSelectedLessons.findIndex(x => x.stage === stage && x.lesson === lesson);
        if (idx >= 0) {
          _spinnerSelectedLessons.splice(idx, 1);
        } else {
          _spinnerSelectedLessons.push({ stage, lesson });
        }
        _renderSpinnerScopePicker();
        _buildSpinnerPool();
      }

      function _selectAllStageLessons(stage) {
        const stageData = window.PWA_BOOK_DATA.stages[`Stage${stage}`] || [];
        stageData.forEach(l => {
          if (!_spinnerSelectedLessons.some(x => x.stage === stage && x.lesson === l.lesson_id)) {
            _spinnerSelectedLessons.push({ stage, lesson: l.lesson_id });
          }
        });
        _renderSpinnerScopePicker();
        _buildSpinnerPool();
      }

      function _clearSpinnerLessons() {
        _spinnerSelectedLessons = [];
        _renderSpinnerScopePicker();
        _buildSpinnerPool();
      }

            function _buildSpinnerPool() {
        spinnerPool = [];
        const stages = window.PWA_BOOK_DATA.stages;

        const addLessonItems = (sNum, lId) => {
          const les = (stages[`Stage${sNum}`] || []).find(l => l.lesson_id === lId);
          if (!les) return;
          (les.sections || []).forEach(sec => {
            ((sec.data && sec.data.items) || []).forEach(it => {
              if (!it.arabic || !it.hinglish || it.arabic.includes('----')) return;
              const key = `S${sNum}L${lId}_${it.id || it.arabic}`;
              if (spinnerFilter === 'starred' && !isStarred(key)) return;
              spinnerPool.push({
                arabic: it.arabic,
                hinglish: it.hinglish,
                stage: sNum,
                lesson: lId,
                key
              });
            });
          });
        };

        if (spinnerScope === 'all') {
          for (let s = 1; s <= 7; s++) {
            (stages[`Stage${s}`] || []).forEach(l => addLessonItems(s, l.lesson_id));
          }
        } else if (_spinnerSelectedLessons.length > 0) {
          _spinnerSelectedLessons.forEach(({ stage, lesson }) => addLessonItems(stage, lesson));
        } else {
          // Default to current lesson if none selected
          addLessonItems(currentStage, currentLesson);
        }

        spinnerCurrentIdx = 0;
        const info = document.getElementById('spinner-pool-info');
        if (info) {
          info.innerHTML = `<strong>Total Words:</strong> ${spinnerPool.length} | <strong>Filtered:</strong> ${spinnerFilter==='starred'?'Starred Only':'All'}`;
        }
        showSpinnerCard();
      }

      // Backward compat alias
      function setSpinnerPool(mode) {
        if (mode === 'starred') { spinnerScope = 'all'; spinnerFilter = 'starred'; }
        else { spinnerScope = 'lesson'; spinnerFilter = 'all'; }
        spinnerScopeValue = null;
        _buildSpinnerPool();
      }

      function showSpinnerCard() {
        if (spinnerPool.length === 0) {
          document.getElementById('spinner-arabic').textContent = spinnerFilter === 'starred' ? 'Koi starred item nahi hai' : 'Is scope mein koi item nahi';
          document.getElementById('spinner-hinglish').innerHTML = spinnerFilter === 'starred' ? 'Tap ★ on any word to star it!' : '';
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

      // ============================================================
      // F4 — Exam Generation System
      // ============================================================
      let _examConfig = {
        scopeType: 'lesson', selectedLessons: [], selectedUnits: [],
        filter: 'all', questionCount: 20,
        questionTypes: ['mcq','mcq_rev','matching','tf','audio_mcq'],
        outputMode: 'interactive', _lessonTabStage: 1
      };
      let _examQuestions = [], _examAnswered = 0, _examScore = 0;

      function openExamConfig() {
        _examConfig = { scopeType: 'lesson', selectedLessons: [], selectedUnits: [], filter: 'all',
          questionCount: 20, questionTypes: ['mcq','mcq_rev','matching','tf','audio_mcq'],
          outputMode: 'interactive', _lessonTabStage: currentStage };
        _renderExamStep(1);
        document.getElementById('exam-config-modal').showModal();
      }

      function _renderExamStep(step) {
        const body = document.getElementById('exam-config-body');
        const nav = (backStep, nextStep, nextLabel) => `
          <div class="exam-nav-row">
            ${backStep ? `<button class="btn-secondary" onclick="App._renderExamStep(${backStep})">← Wapas</button>` : '<span></span>'}
            <button class="btn-primary" onclick="${nextStep ? `App._renderExamStep(${nextStep})` : 'App._generateAndShowExam()'}">${nextLabel || 'Aage →'}</button>
          </div>`;

        if (step === 1) {
          body.innerHTML = `
            <div class="exam-step-title">Qadam 1 — Kya shamil karein?</div>
            <div class="exam-scope-opts">
              ${[['lessons','Alag Alag Lessons'],['units','Poora Unit'],['all','Saare 7 Units']].map(([v,l]) =>
                `<label class="exam-radio-label"><input type="radio" name="es" value="${v}" ${_examConfig.scopeType===v?'checked':''} onchange="App._setExamScopeType('${v}')"> ${l}</label>`
              ).join('')}
            </div>
            ${_renderExamScopeSelector()}
            ${nav(null, 2)}
          `;
        } else if (step === 2) {
          body.innerHTML = `
            <div class="exam-step-title">Qadam 2 — Kaunse items?</div>
            <div class="exam-scope-opts">
              <label class="exam-radio-label"><input type="radio" name="ef" value="all" ${_examConfig.filter==='all'?'checked':''} onchange="App._setExamFilter('all')"> Tamam Items</label>
              <label class="exam-radio-label"><input type="radio" name="ef" value="starred" ${_examConfig.filter==='starred'?'checked':''} onchange="App._setExamFilter('starred')"> Sirf Starred ★</label>
            </div>
            ${nav(1, 3)}
          `;
        } else if (step === 3) {
          body.innerHTML = `
            <div class="exam-step-title">Qadam 3 — Kitne Sawaal?</div>
            <div class="exam-count-btns">
              ${[10,20,30,50].map(n => `<button class="exam-count-btn${_examConfig.questionCount===n?' selected':''}" onclick="App._setExamCount(${n})">${n}</button>`).join('')}
            </div>
            <div style="margin-top:10px;display:flex;align-items:center;gap:8px;">
              <span style="font-size:0.85rem;">Ya likho:</span>
              <input type="number" min="5" max="100" value="${_examConfig.questionCount}" style="width:60px;padding:4px 6px;border:1px solid var(--border-color,#ccc);border-radius:6px;" oninput="App._setExamCountInput(this.value)">
            </div>
            ${nav(2, 4)}
          `;
        } else if (step === 4) {
          const types = [['mcq','MCQ — Arabic → Hinglish'],['mcq_rev','MCQ — Hinglish → Arabic'],
                         ['matching','Matching / Jori Milao'],['tf','Sahi / Ghalat'],['audio_mcq','Audio MCQ — Suno aur jawab do']];
          body.innerHTML = `
            <div class="exam-step-title">Qadam 4 — Sawaal ke Qisam</div>
            ${types.map(([val,lbl]) => `
              <label class="exam-check-label">
                <input type="checkbox" value="${val}" ${_examConfig.questionTypes.includes(val)?'checked':''}
                  onchange="App._toggleExamType('${val}', this.checked)">
                ${lbl}
              </label>`).join('')}
            ${nav(3, 5)}
          `;
        } else if (step === 5) {
          body.innerHTML = `
            <div class="exam-step-title">Qadam 5 — Kaise lena hai?</div>
            <div class="exam-scope-opts">
              <label class="exam-radio-label"><input type="radio" name="eo" value="interactive" ${_examConfig.outputMode==='interactive'?'checked':''} onchange="App._setExamOutputMode('interactive')"> 🎯 App mein (scoring ke saath)</label>
              <label class="exam-radio-label"><input type="radio" name="eo" value="print" ${_examConfig.outputMode==='print'?'checked':''} onchange="App._setExamOutputMode('print')"> 🖨️ Print karein (paper pe)</label>
            </div>
            ${nav(4, null, '📝 Imtehaan Banao')}
          `;
        }
      }

      function _setExamScopeType(v) { _examConfig.scopeType = v; _renderExamStep(1); }
      function _setExamFilter(v) { _examConfig.filter = v; }
      function _setExamCount(n) { _examConfig.questionCount = n; _renderExamStep(3); }
      function _setExamCountInput(val) { _examConfig.questionCount = Math.max(5, Math.min(100, +val || 20)); }
      function _toggleExamType(val, checked) {
        if (checked) {
          if (!_examConfig.questionTypes.includes(val)) _examConfig.questionTypes.push(val);
        } else {
          _examConfig.questionTypes = _examConfig.questionTypes.filter(t => t !== val);
        }
      }
      function _setExamOutputMode(v) { _examConfig.outputMode = v; }
      function _setExamStageTab(s) { _examConfig._lessonTabStage = s; _renderExamStep(1); }
      function _toggleExamUnit(u, checked) {
        if (checked) {
          if (!_examConfig.selectedUnits.includes(u)) _examConfig.selectedUnits.push(u);
        } else {
          _examConfig.selectedUnits = _examConfig.selectedUnits.filter(x => x !== u);
        }
      }
      function _toggleExamLesson(stage, lesson, checked) {
        if (checked) {
          if (!_examConfig.selectedLessons.some(x => x.stage === stage && x.lesson === lesson)) {
            _examConfig.selectedLessons.push({ stage, lesson });
          }
        } else {
          _examConfig.selectedLessons = _examConfig.selectedLessons.filter(x => !(x.stage === stage && x.lesson === lesson));
        }
      }

      function _renderExamScopeSelector() {
        if (_examConfig.scopeType === 'all') return '';
        if (_examConfig.scopeType === 'units') {
          return `<div class="exam-unit-grid">
            ${[1,2,3,4,5,6,7].map(u => `
              <label class="exam-unit-check">
                <input type="checkbox" ${_examConfig.selectedUnits.includes(u)?'checked':''}
                  onchange="App._toggleExamUnit(${u}, this.checked)">
                Unit ${u}
              </label>`).join('')}
          </div>`;
        }
        const st = _examConfig._lessonTabStage || 1;
        const stageData = window.PWA_BOOK_DATA.stages[`Stage${st}`] || [];
        return `
          <div class="exam-stage-tabs">
            ${[1,2,3,4,5,6,7].map(s =>
              `<button class="exam-stage-tab${s===st?' selected':''}" onclick="App._setExamStageTab(${s})">Unit ${s}</button>`
            ).join('')}
          </div>
          <div class="exam-lesson-checks">
            ${stageData.map(l => {
              const sel = _examConfig.selectedLessons.some(x => x.stage===st && x.lesson===l.lesson_id);
              return `<label class="exam-lesson-check">
                <input type="checkbox" ${sel?'checked':''}
                  onchange="App._toggleExamLesson(${st}, ${l.lesson_id}, this.checked)">
                L${l.lesson_id}
              </label>`;
            }).join('')}
          </div>`;
      }

      function _collectExamItems() {
        const items = [], stages = window.PWA_BOOK_DATA.stages;
        const addLesson = (sNum, lId) => {
          const les = (stages[`Stage${sNum}`] || []).find(l => l.lesson_id === lId);
          if (!les) return;
          (les.sections || []).forEach((sec, sIdx) => {
            ((sec.data && sec.data.items) || []).forEach((it, iIdx) => {
              if (!it.arabic || !it.hinglish || it.arabic.includes('----')) return;
              const key = `S${sNum}L${lId}_s${sIdx}_${iIdx}`;
              if (_examConfig.filter === 'starred' && !isStarred(key)) return;
              items.push({ arabic: it.arabic, hinglish: it.hinglish, stage: sNum, lesson: lId, key });
            });
          });
        };
        if (_examConfig.scopeType === 'all') {
          for (let s = 1; s <= 7; s++) (stages[`Stage${s}`] || []).forEach(l => addLesson(s, l.lesson_id));
        } else if (_examConfig.scopeType === 'units') {
          const units = _examConfig.selectedUnits.length ? _examConfig.selectedUnits : [currentStage];
          units.forEach(u => (stages[`Stage${u}`] || []).forEach(l => addLesson(u, l.lesson_id)));
        } else {
          const lessons = _examConfig.selectedLessons.length ? _examConfig.selectedLessons : [{ stage: currentStage, lesson: currentLesson }];
          lessons.forEach(({ stage, lesson }) => addLesson(stage, lesson));
        }
        return items;
      }

      function _shuffleArr(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      }

      function _pickDistractors(correct, all) {
        const sameUnit = _shuffleArr(all.filter(x => x.stage === correct.stage && x.key !== correct.key));
        const diffUnit = _shuffleArr(all.filter(x => x.stage !== correct.stage));
        const d = [...sameUnit.slice(0,2), ...diffUnit.slice(0,1)];
        if (d.length < 3) {
          const extra = _shuffleArr(all.filter(x => x.key !== correct.key && !d.find(dd => dd.key === x.key)));
          d.push(...extra.slice(0, 3 - d.length));
        }
        return d.slice(0, 3);
      }

      function _generateAndShowExam() {
        if (_examConfig.questionTypes.length === 0) { showToast('Kam az kam ek sawaal ka qism chunein!'); return; }
        const allItems = _collectExamItems();
        if (allItems.length === 0) { showToast('Is selection mein koi item nahi. Scope ya filter badlein.'); return; }
        document.getElementById('exam-config-modal').close();

        const pool = _shuffleArr(allItems).slice(0, _examConfig.questionCount);
        const types = _shuffleArr([..._examConfig.questionTypes]);
        _examQuestions = [];

        pool.forEach((item, idx) => {
          const qtype = types[idx % types.length];
          const distractors = _pickDistractors(item, allItems);
          const optItems = _shuffleArr([item, ...distractors]);
          const correctIdx = optItems.findIndex(x => x.key === item.key);
          if (qtype === 'mcq') {
            _examQuestions.push({ type:'mcq', arabic:item.arabic, correct:item.hinglish,
              options:optItems.map(x=>x.hinglish), correctIdx });
          } else if (qtype === 'mcq_rev') {
            _examQuestions.push({ type:'mcq_rev', hinglish:item.hinglish, correct:item.arabic,
              options:optItems.map(x=>x.arabic), correctIdx });
          } else if (qtype === 'tf') {
            const showCorrect = Math.random() > 0.5;
            _examQuestions.push({ type:'tf', arabic:item.arabic,
              hinglish: showCorrect ? item.hinglish : (distractors[0]?.hinglish || item.hinglish),
              isCorrect: showCorrect });
          } else if (qtype === 'audio_mcq') {
            _examQuestions.push({ type:'audio_mcq', arabic:item.arabic, correct:item.hinglish,
              options:optItems.map(x=>x.hinglish), correctIdx });
          } else {
            _examQuestions.push({ type:'matching_item', item, distractors });
          }
        });

        // Consolidate matching_item -> matching sets of 4
        const matchItems = _examQuestions.filter(q => q.type === 'matching_item');
        _examQuestions = _examQuestions.filter(q => q.type !== 'matching_item');
        for (let i = 0; i < matchItems.length; i += 4) {
          const batch = matchItems.slice(i, i+4);
          if (batch.length >= 2) {
            const lefts  = batch.map(b => b.item.arabic);
            const rights = _shuffleArr(batch.map(b => b.item.hinglish));
            _examQuestions.push({ type:'matching', lefts, rights, answers: batch.map(b => ({ arabic:b.item.arabic, hinglish:b.item.hinglish })) });
          }
        }

        _examAnswered = 0; _examScore = 0;
        _examConfig.outputMode === 'print' ? _renderPrintExam() : _renderInteractiveExam();
      }

      function _renderInteractiveExam() {
        document.getElementById('exam-modal-title').textContent = `📝 Imtehaan (${_examQuestions.length} Sawaal)`;
        document.getElementById('exam-print-btn').style.display = 'none';
        let html = '<div class="exam-questions">';
        _examQuestions.forEach((q, qi) => {
          html += `<div class="exam-q" id="examq-${qi}" data-answered="0" data-qi="${qi}">`;
          html += `<div class="exam-q-num">Q${qi+1}</div>`;
          if (q.type === 'mcq') {
            html += `<div class="exam-q-text exam-arabic" dir="rtl">${q.arabic}</div>`;
            q.options.forEach((o,oi) => html += `<button class="exam-opt" onclick="App._answerMcq(${qi},${oi},${q.correctIdx})">${o}</button>`);
          } else if (q.type === 'mcq_rev') {
            html += `<div class="exam-q-text">${q.hinglish}</div>`;
            q.options.forEach((o,oi) => html += `<button class="exam-opt exam-opt-arabic" dir="rtl" onclick="App._answerMcq(${qi},${oi},${q.correctIdx})">${o}</button>`);
          } else if (q.type === 'tf') {
            html += `<div class="exam-q-text exam-arabic" dir="rtl">${q.arabic}</div><div class="exam-q-text">${q.hinglish}</div>`;
            html += `<div class="exam-tf-btns">
              <button class="exam-opt exam-tf" onclick="App._answerTf(${qi},true,${q.isCorrect})">✓ Sahi</button>
              <button class="exam-opt exam-tf" onclick="App._answerTf(${qi},false,${q.isCorrect})">✗ Ghalat</button>
            </div>`;
          } else if (q.type === 'audio_mcq') {
            html += `<button class="btn-secondary exam-audio-btn" onclick="App.speakArabic('${(q.arabic||'').replace(/'/g,"\\'")}')">🔊 Suno</button>`;
            q.options.forEach((o,oi) => html += `<button class="exam-opt" onclick="App._answerMcq(${qi},${oi},${q.correctIdx})">${o}</button>`);
          } else if (q.type === 'matching') {
            html += `<div class="exam-q-text">Sahi jori milao:</div><div class="exam-match-grid">
              <div class="exam-match-col">${q.lefts.map((l,li) => `<button class="exam-match-item exam-arabic" dir="rtl" data-side="left" data-idx="${li}" onclick="App._selectMatch(${qi},this)">${l}</button>`).join('')}</div>
              <div class="exam-match-col">${q.rights.map((r,ri) => `<button class="exam-match-item" data-side="right" data-idx="${ri}" onclick="App._selectMatch(${qi},this)">${r}</button>`).join('')}</div>
            </div>`;
          }
          html += '</div>';
        });
        html += '</div><div id="exam-summary" style="display:none;" class="exam-summary"></div>';
        document.getElementById('exam-display-mount').innerHTML = html;
        document.getElementById('exam-modal').showModal();
      }

            let _matchSel = {};

      function _selectMatch(qi, btn) {
        const side = btn.dataset.side, idx = +btn.dataset.idx;
        if (!_matchSel[qi]) _matchSel[qi] = {};
        _matchSel[qi][side] = idx;
        const qEl = document.getElementById(`examq-${qi}`);
        qEl.querySelectorAll(`.exam-match-item[data-side="${side}"]`).forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const sel = _matchSel[qi];
        if (sel.left !== undefined && sel.right !== undefined) {
          const q = _examQuestions[qi];
          const leftText = q.lefts[sel.left];
          const rightText = q.rights[sel.right];
          const isMatch = q.answers.some(a => a.arabic === leftText && a.hinglish === rightText);
          const lBtn = qEl.querySelector(`.exam-match-item[data-side="left"][data-idx="${sel.left}"]`);
          const rBtn = qEl.querySelector(`.exam-match-item[data-side="right"][data-idx="${sel.right}"]`);

          if (isMatch) {
            lBtn.classList.remove('selected'); rBtn.classList.remove('selected');
            lBtn.classList.add('match-correct'); lBtn.disabled = true;
            rBtn.classList.add('match-correct'); rBtn.disabled = true;
            _examScore += 2; _examAnswered++;
          } else {
            // Wrong Attempt: Mark Red and DO NOT permit infinite retry
            lBtn.classList.remove('selected'); rBtn.classList.remove('selected');
            lBtn.classList.add('match-wrong'); lBtn.disabled = true;
            rBtn.classList.add('match-wrong'); rBtn.disabled = true;
            _examAnswered++;
            const correctAns = q.answers.find(a => a.arabic === leftText);
            if (correctAns) {
              lBtn.setAttribute('title', `Sahi: ${correctAns.hinglish}`);
            }
          }
          delete _matchSel[qi];
          if (qEl.querySelectorAll('.exam-match-item:not(:disabled)').length === 0) {
            qEl.dataset.answered = '1';
            _checkExamDone();
          }
        }
      }

      function _answerMcq(qi, chosen, correct) {
        const qEl = document.getElementById(`examq-${qi}`);
        if (qEl.dataset.answered === '1') return;
        qEl.dataset.answered = '1'; _examAnswered++;
        const opts = qEl.querySelectorAll('.exam-opt');
        opts.forEach((b,i) => { b.disabled=true; if(i===correct) b.classList.add('opt-correct'); if(i===chosen&&chosen!==correct) b.classList.add('opt-wrong'); });
        if (chosen === correct) _examScore++;
        _checkExamDone();
      }

      function _answerTf(qi, userAns, isCorrect) {
        const qEl = document.getElementById(`examq-${qi}`);
        if (qEl.dataset.answered === '1') return;
        qEl.dataset.answered = '1'; _examAnswered++;
        if (userAns === isCorrect) _examScore++;
        qEl.querySelectorAll('.exam-tf').forEach(b => {
          b.disabled=true;
          const bIsTrue = b.textContent.includes('Sahi');
          if (bIsTrue === isCorrect) b.classList.add('opt-correct');
          else if (bIsTrue === userAns) b.classList.add('opt-wrong');
        });
        _checkExamDone();
      }

            function _checkExamDone() {
        const total = _examQuestions.length;
        const answered = document.querySelectorAll('.exam-q[data-answered="1"]').length;
        if (answered < total) return;
        const maxMarks = total * 2;
        const pct = Math.round((_examScore / Math.max(maxMarks, 1)) * 100);
        const grade = pct >= 85 ? 'A+' : pct >= 75 ? 'A' : pct >= 60 ? 'B' : pct >= 45 ? 'C' : 'F';
        const studentName = (localStorage.getItem('muallim_student_name') || '').trim() || 'Talib-e-Ilm';

        // Save to ExamHistoryStore
        const examRecord = {
          id: 'exam_' + Date.now(),
          student_name: studentName,
          timestamp: Date.now(),
          score: _examScore,
          max_score: maxMarks,
          percentage: pct,
          grade: grade,
          questions_count: total
        };
        if (typeof ExamHistoryStore !== 'undefined') {
          ExamHistoryStore.save(examRecord);
        }

        const s = document.getElementById('exam-summary');
        s.style.display = 'block';
        s.innerHTML = `
          <div class="scorecard-box">
            <div style="font-size:0.95rem;color:var(--text-muted,#666);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Nateeja / Exam Scorecard</div>
            <div style="font-size:1.35rem;font-weight:700;color:var(--accent-emerald,#1b4332);margin-bottom:10px;">${studentName}</div>
            <div style="font-size:2.8rem;font-weight:800;color:${pct>=60?'#10B981':'#EF4444'};line-height:1;">${_examScore} / ${maxMarks}</div>
            <div class="scorecard-grade-badge ${pct>=60?'pass':'fail'}">Grade ${grade} · ${pct}% Sahi</div>
            <div style="margin-top:16px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
              <button class="btn-secondary" onclick="window.print()">🖨️ Print Result</button>
              <button class="btn-primary" onclick="App._generateAndShowExam()">🔁 Dobara Imtehaan</button>
              <button class="btn-secondary" onclick="App.openExamConfig()">📝 Naya Imtehaan</button>
            </div>
          </div>
        `;
        s.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

            function _renderPrintExam() {
        document.getElementById('exam-modal-title').textContent = '📝 Imtehaan Paper (Print Mode)';
        document.getElementById('exam-print-btn').style.display = 'inline-flex';
        const dlBtn = document.getElementById('exam-download-btn');
        if (dlBtn) dlBtn.style.display = 'inline-flex';

        const today = new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
        const studentName = (localStorage.getItem('muallim_student_name') || '').trim() || '___________________';

        let html = `
          <div class="exam-print-wrapper">
            <div class="ep-header">
              <div class="ep-title">MUALLIM UL-QUR'AN — مُعَلِّمُ الْقُرْآنِ</div>
              <div class="ep-subtitle">EXAMINATION PAPER</div>
              <div class="ep-meta-grid">
                <div><strong>Naam:</strong> ${studentName}</div>
                <div><strong>Roll No:</strong> _______________</div>
                <div><strong>Tarikh:</strong> ${today}</div>
                <div><strong>Marks:</strong> ${_examQuestions.length * 2} | <strong>Waqt:</strong> ${Math.ceil(_examQuestions.length * 2.5)}m</div>
              </div>
            </div>`;

        const sections = [
          ['mcq', 'Section A: Arabic se Hinglish (MCQ)', 'ep-grid-3col'],
          ['mcq_rev', 'Section B: Hinglish se Arabic (MCQ)', 'ep-grid-2col'],
          ['matching', 'Section C: Jori Milao (Matching Pairs)', 'ep-grid-2col'],
          ['tf', 'Section D: Sahi ya Ghalat (True / False)', 'ep-grid-2col'],
          ['audio_mcq', 'Section E: Audio / Ayah Constructs', 'ep-grid-2col']
        ];

        let ak = '<div class="ep-page-break"></div><div class="ep-answer-key"><div class="ep-section-header"><span>JAWAB NAAMA (Answer Key)</span><span>Unit Test</span></div><div class="ep-grid-3col" style="margin-top:8pt;">';
        let qn = 1;

        sections.forEach(([type, title, gridClass]) => {
          const qs = _examQuestions.filter(q => q.type === type);
          if (!qs.length) return;
          html += `<div class="ep-section">
            <div class="ep-section-header"><span>${title}</span><span>[${qs.length * 2} Marks]</span></div>
            <div class="${gridClass}">`;

          qs.forEach(q => {
            if (type === 'mcq' || type === 'mcq_rev' || type === 'audio_mcq') {
              const qText = type === 'mcq_rev' ? q.hinglish : `<span class="ep-arabic" dir="rtl">${q.arabic}</span>`;
              const prefix = type === 'audio_mcq' ? '🔊 ' : '';
              const optStyle = type === 'mcq_rev' ? 'dir="rtl" class="ep-arabic"' : '';
              html += `<div class="ep-q">
                <div class="ep-q-text">Q${qn}. ${prefix}${qText}</div>
                <div class="ep-opts">${q.options.map((o,i) => `<div class="ep-opt" ${optStyle}>(${String.fromCharCode(65+i)}) ${o}</div>`).join('')}</div>
              </div>`;
              ak += `<div style="border:0.5pt solid #ccc;padding:3pt 6pt;border-radius:3pt;"><strong>Q${qn}:</strong> (${String.fromCharCode(65+q.correctIdx)}) ${type==='mcq_rev'?q.correct:q.correct}</div>`;
            } else if (type === 'tf') {
              html += `<div class="ep-q">
                <div class="ep-q-text">Q${qn}. <span class="ep-arabic" dir="rtl">${q.arabic}</span> = "${q.hinglish}"</div>
                <div style="font-size:8pt;margin-top:3pt;">[  ] Sahi  /  [  ] Ghalat</div>
              </div>`;
              ak += `<div style="border:0.5pt solid #ccc;padding:3pt 6pt;border-radius:3pt;"><strong>Q${qn}:</strong> ${q.isCorrect ? 'Sahi (True)' : 'Ghalat (False)'}</div>`;
            } else if (type === 'matching') {
              html += `<div class="ep-q" style="grid-column: span 2;">
                <div class="ep-q-text">Q${qn}. Sahi jori milayein:</div>
                <table class="ep-match-table"><thead><tr><th>Column A (Arabic)</th><th>Jawab</th><th>Column B (Hinglish)</th></tr></thead><tbody>
                ${q.lefts.map((l,i) => `<tr><td class="ep-arabic" dir="rtl">${l}</td><td class="ep-match-blank">_____</td><td>${q.rights[i]||''}</td></tr>`).join('')}
                </tbody></table></div>`;
              ak += `<div style="border:0.5pt solid #ccc;padding:3pt 6pt;border-radius:3pt;grid-column: span 2;"><strong>Q${qn}:</strong> ${q.answers.map(a => `${a.arabic} ➔ ${a.hinglish}`).join('; ')}</div>`;
            }
            qn++;
          });
          html += '</div></div>';
        });

        ak += '</div></div>';
        html += ak + '</div>';
        document.getElementById('exam-display-mount').innerHTML = html;
        document.getElementById('exam-modal').showModal();
      }

      function downloadExamPaperHtml() {
        const printEl = document.querySelector('.exam-print-wrapper');
        if (!printEl) { showToast('Pehle imtehaan paper generate karein'); return; }
        const doc = `<!DOCTYPE html>
<html lang="ur" dir="ltr">
<head>
  <meta charset="UTF-8">
  <title>Muallim ul-Quran — Imtehaan Paper</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 15px; margin: 0; color: #000; }
    .ep-header { border: 1.5pt solid #000; padding: 8pt; text-align: center; margin-bottom: 10pt; }
    .ep-title { font-size: 14pt; font-weight: 800; }
    .ep-subtitle { font-size: 10pt; font-weight: 700; margin: 2pt 0; }
    .ep-meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6pt; font-size: 8.5pt; border-top: 1pt solid #000; padding-top: 4pt; margin-top: 4pt; text-align: left; }
    .ep-grid-3col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6pt; }
    .ep-grid-2col { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8pt; }
    .ep-section { margin-bottom: 10pt; }
    .ep-section-header { font-size: 10pt; font-weight: 700; background: #eee; padding: 3pt 6pt; border-left: 3pt solid #000; margin-bottom: 6pt; display: flex; justify-content: space-between; }
    .ep-q { border: 0.5pt solid #aaa; padding: 4pt 6pt; border-radius: 3pt; font-size: 8.5pt; margin-bottom: 4pt; }
    .ep-arabic { font-family: 'Amiri', 'Traditional Arabic', serif; font-size: 13pt; direction: rtl; text-align: right; }
    .ep-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 2pt; font-size: 8pt; margin-top: 2pt; }
    .ep-match-table { width: 100%; border-collapse: collapse; font-size: 8pt; margin-top: 4pt; }
    .ep-match-table th, .ep-match-table td { border: 0.5pt solid #000; padding: 3pt 5pt; }
    .ep-page-break { page-break-before: always; margin-top: 20pt; }
    @media print { @page { size: A4 portrait; margin: 8mm 10mm; } body { padding: 0; } }
  </style>
</head>
<body>
  ${printEl.outerHTML}
</body>
</html>`;
        const blob = new Blob([doc], { type: 'text/html;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `Muallim_Exam_Paper_${Date.now()}.html`;
        a.click();
        showToast('Imtehaan paper download ho gaya 📥');
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
        setSpinnerScope,
        setSpinnerFilter,
        _setSpinnerStageTab,
        _setSpinnerUnit,
        _setSpinnerLesson,
        _buildSpinnerPool,
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
        setStudentName,
        getStudentName,
        installPwaApp,
        toggleDailyReminder,
        setReminderTime,
        downloadExamPaperHtml,
        _selectAllStageLessons,
        _clearSpinnerLessons,
        _toggleSpinnerLessonChip,
        openExamConfig,
        _renderExamStep,
        _setExamScopeType,
        _setExamFilter,
        _setExamCount,
        _setExamCountInput,
        _toggleExamType,
        _setExamOutputMode,
        _setExamStageTab,
        _toggleExamUnit,
        _toggleExamLesson,
        _generateAndShowExam,
        _answerMcq,
        _answerTf,
        _selectMatch,
        _checkExamDone
      };
    })();

    document.addEventListener('DOMContentLoaded', App.init);

    
    // ================================================================
    // Phase 5 — Single Bookmark System (SVG Outline / Filled State)
    // ================================================================

    const BookmarkStore = (() => {
      const KEY = 'muallim_bookmark';
      function load() { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } }
      function save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { showToast('Storage full'); } }
      return {
        set(item)        { save(item); },
        get()            { return load(); },
        clear()          { localStorage.removeItem(KEY); },
        isBookmarked(id) { const b = load(); return b ? b.id === id : false; },
        has(id)          { return this.isBookmarked(id); }
      };
    })();

    function refreshBookmarkButtons() {
      const bm = BookmarkStore.get();
      document.querySelectorAll('.btn-bookmark').forEach(btn => {
        btn.classList.toggle('bookmarked', bm ? bm.id === btn.dataset.itemId : false);
      });
    }

    function setBookmark(itemId, stage, lesson, arabic, hinglish) {
      if (BookmarkStore.isBookmarked(itemId)) {
        BookmarkStore.clear();
        refreshBookmarkButtons();
        showToast('🔖 Bookmark hata diya gaya');
      } else {
        BookmarkStore.set({ id: itemId, stage, lesson, arabic, hinglish, timestamp: Date.now() });
        refreshBookmarkButtons();
        showToast('🔖 Jagah save ho gayi');
      }
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

      // Sync Student Name
      const nameInput = document.getElementById('student-name-input');
      if (nameInput) nameInput.value = localStorage.getItem('muallim_student_name') || '';

      // Sync Push Notification toggle
      const pt = document.getElementById('push-notif-toggle');
      const isNotif = localStorage.getItem('muallim_daily_reminder') === 'true';
      if (pt) { pt.classList.toggle('active', isNotif); pt.setAttribute('aria-checked', isNotif); }
      const timeCont = document.getElementById('reminder-time-container');
      if (timeCont) timeCont.style.display = isNotif ? 'flex' : 'none';
      const timeInput = document.getElementById('reminder-time-input');
      if (timeInput) timeInput.value = localStorage.getItem('muallim_reminder_time') || '20:00';
    }

    function shareApp() {
      const d = { title: "Muallim ul-Qur'an", text: 'Interactive Quranic Arabic workbook with Hinglish translations', url: 'https://nomaanc.github.io/muallim/' };
      if (navigator.share && navigator.canShare(d)) navigator.share(d);
      else navigator.clipboard?.writeText(d.url).then(() => showToast('Link copied!'));
    }

    // Global Escape key handler
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeMenuPanel(); }
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


    // ================================================================
    // Student Profile & PWA Install & Notifications
    // ================================================================
    let _deferredInstallPrompt = null;
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      _deferredInstallPrompt = e;
      const btn = document.getElementById('install-pwa-btn');
      if (btn) btn.style.display = 'flex';
    });

    function setStudentName(val) {
      localStorage.setItem('muallim_student_name', (val || '').trim());
    }
    function getStudentName() {
      return localStorage.getItem('muallim_student_name') || '';
    }

    function installPwaApp() {
      if (_deferredInstallPrompt) {
        _deferredInstallPrompt.prompt();
        _deferredInstallPrompt.userChoice.then(() => { _deferredInstallPrompt = null; });
      } else {
        showToast('📲 PWA: Browser menu se "Add to Home screen" / "Install" chunein', 5000);
      }
    }

    function toggleDailyReminder() {
      const toggle = document.getElementById('push-notif-toggle');
      const timeCont = document.getElementById('reminder-time-container');
      const isEnabled = localStorage.getItem('muallim_daily_reminder') === 'true';

      if (!isEnabled) {
        if ('Notification' in window) {
          Notification.requestPermission().then(perm => {
            if (perm === 'granted') {
              localStorage.setItem('muallim_daily_reminder', 'true');
              toggle?.classList.add('active');
              toggle?.setAttribute('aria-checked', 'true');
              if (timeCont) timeCont.style.display = 'flex';
              showToast('Daily Study Reminder Active 🔔');
              scheduleStudyReminder();
            } else {
              showToast('Notification permission nahi mili');
            }
          });
        } else {
          showToast('Aapka browser notifications support nahi karta');
        }
      } else {
        localStorage.removeItem('muallim_daily_reminder');
        toggle?.classList.remove('active');
        toggle?.setAttribute('aria-checked', 'false');
        if (timeCont) timeCont.style.display = 'none';
        showToast('Daily Reminder Band Kar Diya Gaya');
      }
    }

    function setReminderTime(t) {
      localStorage.setItem('muallim_reminder_time', t);
      showToast(`Reminder waqt set: ${t}`);
      scheduleStudyReminder();
    }

    function scheduleStudyReminder() {
      if (localStorage.getItem('muallim_daily_reminder') !== 'true') return;
      const timeStr = localStorage.getItem('muallim_reminder_time') || '20:00';
      const [h, m] = timeStr.split(':').map(Number);
      const now = new Date();
      const target = new Date();
      target.setHours(h, m, 0, 0);
      if (target <= now) target.setDate(target.getDate() + 1);
      const delay = target.getTime() - now.getTime();

      setTimeout(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification("Muallim ul-Qur'an — Dars ka Waqt", {
            body: 'Aaj ka Quranic Arabic dars mukammal karein aur naye alfaaz seekhein!',
            icon: './icons/icon-192.png'
          });
        }
        scheduleStudyReminder(); // Schedule for next day
      }, Math.min(delay, 2147483647));
    }

    // ================================================================
    // Exam History Store & Admin Sync
    // ================================================================
    const ExamHistoryStore = (() => {
      const KEY = 'muallim_exam_history';
      function getAll() {
        try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
      }
      function save(record) {
        const list = getAll();
        list.unshift(record);
        if (list.length > 50) list.pop();
        localStorage.setItem(KEY, JSON.stringify(list));
        AdminPortal.syncStudentExam(record);
      }
      return { getAll, save };
    })();

    // ================================================================
    // In-App Embedded Admin Portal
    // ================================================================
    const AdminPortal = (() => {
      const DEFAULT_PIN = '7860';
      let _isUnlocked = false;

      function promptLogin() {
        if (_isUnlocked) { renderDashboard(); return; }
        const pin = prompt('Teacher / Admin PIN darj karein:');
        if (pin === (localStorage.getItem('muallim_admin_pin') || DEFAULT_PIN)) {
          _isUnlocked = true;
          renderDashboard();
          showToast('Admin Portal Unlocked ✅');
        } else if (pin !== null) {
          showToast('Ghalat PIN ❌');
        }
      }

      function syncStudentExam(examRecord) {
        const roster = JSON.parse(localStorage.getItem('muallim_admin_roster') || '[]');
        let student = roster.find(s => s.name === examRecord.student_name);
        if (!student) {
          student = { name: examRecord.student_name, exams: [], lastActive: Date.now() };
          roster.push(student);
        }
        student.exams.unshift(examRecord);
        student.lastActive = Date.now();
        localStorage.setItem('muallim_admin_roster', JSON.stringify(roster));
      }

      function renderDashboard() {
        const container = document.getElementById('admin-portal-mount');
        if (!container) return;
        const roster = JSON.parse(localStorage.getItem('muallim_admin_roster') || '[]');
        const starsCount = (JSON.parse(localStorage.getItem('muallim_favs') || '[]')).length;
        const notesObj = JSON.parse(localStorage.getItem('muallim_custom_answers') || '{}');
        const notesCount = Object.keys(notesObj).length;

        container.innerHTML = `
          <div class="admin-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
              <strong style="color:var(--accent-emerald,#1b4332);font-size:1rem;">👨‍💼 Teacher Control Center</strong>
              <span class="admin-badge">Admin Active</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;text-align:center;">
              <div style="background:var(--bg-hover,#f0f7f4);padding:8px;border-radius:6px;"><strong>${roster.length}</strong><br><small>Students</small></div>
              <div style="background:var(--bg-hover,#f0f7f4);padding:8px;border-radius:6px;"><strong>${starsCount}</strong><br><small>Starred Words</small></div>
              <div style="background:var(--bg-hover,#f0f7f4);padding:8px;border-radius:6px;"><strong>${notesCount}</strong><br><small>Custom Notes</small></div>
            </div>

            <div style="margin-bottom:12px;">
              <small><strong>📢 Broadcast Study Notice</strong></small>
              <div style="display:flex;gap:6px;margin-top:4px;">
                <input type="text" id="admin-broadcast-msg" placeholder="e.g. Unit 3 Exam kal hoga!" style="flex:1;padding:6px;border:1px solid #ccc;border-radius:4px;font-size:0.85rem;">
                <button class="btn-primary" style="padding:6px 12px;font-size:0.82rem;" onclick="AdminPortal.sendBroadcast()">Send</button>
              </div>
            </div>

            <div>
              <small><strong>📊 Student Exam Gradebook</strong></small>
              <div style="max-height:160px;overflow-y:auto;margin-top:4px;">
                <table class="admin-table">
                  <thead><tr><th>Student</th><th>Score</th><th>Grade</th><th>Date</th></tr></thead>
                  <tbody>
                    ${roster.flatMap(s => s.exams.map(e => `
                      <tr><td>${s.name}</td><td>${e.score}/${e.max_score}</td><td><strong>${e.grade}</strong></td><td>${new Date(e.timestamp).toLocaleDateString()}</td></tr>
                    `)).join('') || '<tr><td colspan="4" style="text-align:center;">Koi exam submit nahi hua</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>

            <div style="margin-top:12px;display:flex;gap:6px;flex-wrap:wrap;">
              <button class="btn-secondary" style="font-size:0.8rem;padding:4px 8px;" onclick="AdminPortal.exportCsv()">📥 Export CSV</button>
              <button class="btn-secondary" style="font-size:0.8rem;padding:4px 8px;" onclick="AdminPortal.changePin()">🔑 Change PIN</button>
              <button class="btn-secondary" style="font-size:0.8rem;padding:4px 8px;" onclick="AdminPortal.lock()">🔒 Lock</button>
            </div>
          </div>
        `;
      }

      function sendBroadcast() {
        const input = document.getElementById('admin-broadcast-msg');
        const msg = input?.value?.trim();
        if (!msg) { showToast('Message likhein!'); return; }
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification("Muallim ul-Qur'an Notice", { body: msg, icon: './icons/icon-192.png' });
        }
        showToast('Notice broadcasted: ' + msg);
        input.value = '';
      }

      function exportCsv() {
        const roster = JSON.parse(localStorage.getItem('muallim_admin_roster') || '[]');
        let csv = "Student Name,Exam Score,Max Score,Percentage,Grade,Date
";
        roster.forEach(s => {
          s.exams.forEach(e => {
            csv += `"${s.name}",${e.score},${e.max_score},${e.percentage}%,${e.grade},"${new Date(e.timestamp).toISOString()}"
`;
          });
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `Muallim_Gradebook_${Date.now()}.csv`;
        a.click();
      }

      function changePin() {
        const newPin = prompt('Naya 4-digit PIN darj karein:');
        if (newPin && newPin.trim().length >= 4) {
          localStorage.setItem('muallim_admin_pin', newPin.trim());
          showToast('PIN tabdeel ho gaya ✅');
        } else if (newPin !== null) {
          showToast('Kam az kam 4 digits zaroori hain');
        }
      }

      function lock() {
        _isUnlocked = false;
        const mount = document.getElementById('admin-portal-mount');
        if (mount) mount.innerHTML = '';
        showToast('Admin Portal Locked 🔒');
      }

      return { promptLogin, syncStudentExam, sendBroadcast, exportCsv, changePin, lock };
    })();
