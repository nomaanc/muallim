# Muallim ul-Qur'an PWA — Feature Enhancement Prompt

> **For agent**: Read this file top to bottom before touching any code. Every decision has been made. Do not ask the user questions — implement exactly as written. Verify in browser after each feature, commit, then move on.

---

## CONSTRAINT LEDGER (hold every line throughout the entire session)

```
1.  Vanilla JS only. No React, Vue, Angular, or any framework. No npm packages.
2.  No external JS libraries for exam/print. Use @media print + window.print() only.
3.  All user-facing strings in Hinglish/Roman Urdu — not English labels.
    Display "Unit X Lesson Y" in UI even though data field is named `stage`.
4.  Mobile-first: every new UI element must work at 360px viewport width.
5.  No console.log in delivered code.
6.  Never mutate window.PWA_BOOK_DATA. Read it; never write it.
7.  LocalStorage: use existing keys; add only `muallim_bookmark` (singular) for F3.
8.  Serve locally: cd pwa && python -m http.server 8000 to verify each feature.
9.  Git commit after EACH feature before starting the next.
10. After all 4 features: git push origin main -> auto-deploys to nomaanc.github.io/muallim
11. Final smoke test on the live URL before reporting done.
12. No unrequested refactors. Surgical edits only.
13. Arabic print font: Amiri (Google Fonts). Hinglish print font: Noto Sans.
```

---

## Project Overview

**App**: Muallim ul-Qur'an — Interactive Quranic Arabic Workbook PWA
**Live URL**: https://nomaanc.github.io/muallim/
**Language in UI**: Hinglish (Roman Urdu) — NOT English
**Git remote**: `https://github.com/nomaanc/muallim.git`
**Data**: 7 Units (called "stages" in data), 114 Lessons total (105 complete, 9 stub).

### Workspace Layout

```
e:\AIPROJECTS\PROJECTS\translate-hinglish-skill\
|-- pwa\                                    <- serve this on localhost:8000
|   |-- index.html                          <- 345 lines: all modals, menu panel, header HTML
|   |-- app.js                              <- 1120 lines: ALL application logic
|   |-- styles.css                          <- all CSS
|   |-- pwa_book_data.js                    <- ~1.3 MB bundled data. DO NOT EDIT.
|   |-- sw.js                               <- service worker
|   `-- manifest.json
|-- Data-Version-4-till-stage-7-latest-and-final\
|   `-- Stage1\ ... Stage7\                 <- source JSON (do not bundle manually)
|-- scripts\
|   `-- bundle_pwa_data.py                  <- run only if JSON data files change
|-- Output from other projects\
|   `-- Custom_QuestionPaper.html           <- REFERENCE for exam print CSS/layout
`-- images\
```

### Critical Architecture Facts

**Data access pattern** (the bundle exposes `window.PWA_BOOK_DATA`, NOT `window.bookData`):
```js
window.PWA_BOOK_DATA.stages                          // object: {Stage1: [...], Stage2: [...], ...}
window.PWA_BOOK_DATA.stages['Stage3']                // array of lesson objects
window.PWA_BOOK_DATA.stages['Stage3'][0]             // {lesson_id, lesson_key, title, page_start, status, sections}
lesson.sections[n]                                   // {type, data: {items: [...]}}
lesson.sections[n].data.items[i]                     // {arabic, hinglish, sentence_number, type, ...}
```

**Item key pattern**: `S{stage}L{lesson}_s{sectionIndex}_{itemIndex}` (e.g. `S3L5_s2_7`)
Special variants: verse_block uses `_v_{vIdx}`, two_col_numbered_list uses `_num_{id}`.

**App state variables** (inside the App IIFE, lines 3-13 of app.js):
```js
let currentStage = 1;
let currentLesson = 1;
let audioSpeed = ...;
let favourites = JSON.parse(localStorage.getItem('muallim_favs') || '[]');
let customAnswers = JSON.parse(localStorage.getItem('muallim_custom_answers') || '{}');
let activeEditKey = null;
let spinnerMode = 'starred';  // REPLACED in Feature 2
let spinnerPool = [];
let spinnerIndex = 0;
let isSpinnerRevealed = false;
```

**LocalStorage keys in use**:
| Key | Type | Contents |
|-----|------|----------|
| `muallim_favs` | JSON array | Starred: `[{key, arabic, hinglish, stage, lesson}]` |
| `muallim_bookmarks` | JSON array | Multi-bookmark (replaced in F3 — leave old key orphaned) |
| `muallim_bookmark` | JSON object | NEW single bookmark (F3): `{id, stage, lesson, arabic, hinglish, timestamp}` |
| `muallim_custom_answers` | JSON object | `{itemKey: customText}` |
| `muallim_theme` / `muallim_mode` | string | 'light'/'dark', 'teacher'/'student' |
| `muallim_audio_speed` | string | float as string |
| `muallim_progress` | JSON object | Reading progress store |

**Module-level globals** (outside the IIFE, callable without `App.` prefix):
```
BookmarkStore, showToast(), openMenuPanel(), closeMenuPanel()
openBmDrawer(), closeBmDrawer()           <- DELETED in F3
attachLongPress()                          <- DELETED in F3
refreshBookmarkIndicators()               <- DELETED in F3
updateBookmarksBadge()                    <- DELETED in F3
```

---

## Implementation Order

```
F1 (starred sort) -> commit -> F3 (bookmark) -> commit -> F2 (spinner) -> commit -> F4 (exam) -> commit -> push -> smoke test
```

F3 before F2 because F3 modifies card templates that F2's pool-building code reads.

---

## Feature 1: Starred Items — Sort by Lesson Order

### Existing code to replace (lines 615-642 of app.js)

```js
// CURRENT openFavourites() — renders in insertion order
function openFavourites() {
  let favsHtml = '';
  if (favourites.length === 0) {
    favsHtml = '<p style="text-align:center; color:var(--text-muted); padding:20px;">No starred items yet. Tap the ★ button on any card to save it here!</p>';
  } else {
    favsHtml = '<div class="bidi-grid cols-1">';
    favourites.forEach((f) => {
      const escAr = (f.arabic || '').replace(/'/g, "\\'");
      const escHi = (f.hinglish || '').replace(/'/g, "\\'");
      favsHtml += `
        <div class="vocab-card">
          <div class="card-top">
            <span style="font-size:0.8rem; color:var(--text-muted);">Unit ${f.stage} Lesson ${f.lesson}</span>
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
  }
  document.getElementById('favs-list-mount').innerHTML = favsHtml;
  document.getElementById('favs-modal').showModal();
}
```

### Replacement code

```js
// NEW openFavourites() — grouped under lesson headings, sorted by stage->lesson
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
```

### CSS to add to styles.css

```css
/* F1 — Starred items group header */
.favs-group-header {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 14px 4px 6px;
  border-bottom: 1px solid var(--border-color, #ddd);
  margin-bottom: 8px;
}
.favs-group-header:first-child { padding-top: 4px; }
```

### Edge cases
- Empty `favourites`: empty-state message shown, no groups rendered.
- Un-starring a card from the panel: `App.openFavourites()` is called in onclick so panel re-renders immediately; empty groups disappear automatically.
- All items from one lesson: single group with one header.

### Browser verification
1. Star items from Unit 4 L2, then Unit 3 L1, then Unit 4 L1.
2. Open Starred Items from menu.
3. Expected: headers appear in order Unit 3 L1 -> Unit 4 L1 -> Unit 4 L2.
4. Un-star all Unit 3 L1 cards from panel. Expected: that header disappears.

### Commit
```
git add pwa/app.js pwa/styles.css
git commit -m "feat(pwa): sort starred items by lesson order with group headers"
```

---

## Feature 2: Spaced Repetition Spinner — Scope + Filter Redesign

### Existing code to replace

**index.html lines 121-143** (full spinner modal):
```html
<dialog id="spinner-modal" class="app-modal">
  <div class="modal-header">
    <div class="modal-title">🔀 Spaced Repetition Spinner</div>
    <button class="icon-btn" onclick="document.getElementById('spinner-modal').close()">✕</button>
  </div>
  <div class="modal-body">
    <div class="spinner-pool-toggle">
      <button id="pool-starred-btn" class="spinner-pool-opt selected" onclick="App.setSpinnerPool('starred')">★ Starred Items (<span id="starred-count-badge">0</span>)</button>
      <button id="pool-lesson-btn" class="spinner-pool-opt" onclick="App.setSpinnerPool('lesson')">📖 Current Lesson</button>
    </div>
    <div id="spinner-card" class="spinner-card" onclick="App.toggleSpinnerReveal()">
      <div id="spinner-arabic" class="spinner-arabic">...</div>
      <div id="spinner-hinglish" class="spinner-hinglish" style="display:none;">...</div>
      <div id="spinner-hint" class="spinner-hint">(tap card to reveal translation)</div>
    </div>
    <div class="spinner-controls">
      <button class="btn-secondary" onclick="App.playCurrentSpinnerAudio()">🔊 Hear</button>
      <button class="btn-primary" onclick="App.nextSpinnerCard()">Next Card →</button>
    </div>
  </div>
</dialog>
```

**app.js lines 10 (spinner state)**:
```js
let spinnerMode = 'starred'; // 'starred' or 'lesson'
```

**app.js lines 521-572** (openSpinner + setSpinnerPool — full bodies):
```js
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
      spinnerPool.push({ arabic: f.arabic, origHinglish: f.hinglish, customHinglish: customAnswers[f.key] || '', key: f.key });
    });
  } else {
    const stageData = window.PWA_BOOK_DATA.stages[`Stage${currentStage}`] || [];
    const lesson = stageData.find(l => l.lesson_id === currentLesson) || stageData[0];
    if (lesson) {
      (lesson.sections || []).forEach((sec, sIdx) => {
        (sec.data && sec.data.items || []).forEach((it, iIdx) => {
          if (it.arabic && it.hinglish && !it.arabic.includes('----')) {
            const itemKey = `S${currentStage}L${currentLesson}_s${sIdx}_${iIdx}`;
            spinnerPool.push({ arabic: it.arabic, origHinglish: it.hinglish, customHinglish: customAnswers[itemKey] || '', key: itemKey });
          }
        });
      });
    }
  }
  for (let i = spinnerPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [spinnerPool[i], spinnerPool[j]] = [spinnerPool[j], spinnerPool[i]];
  }
  spinnerIndex = 0;
  showSpinnerCard();
}
```

### Changes to make

#### A. Replace state variable on line 10

Remove: `let spinnerMode = 'starred';`
Add in its place:
```js
let spinnerScope  = 'lesson';  // 'lesson' | 'unit' | 'all'
let spinnerFilter = 'all';     // 'starred' | 'all'
let spinnerScopeValue = null;  // {stage, lesson} or unit number
```

#### B. Replace spinner modal HTML in index.html

```html
<dialog id="spinner-modal" class="app-modal">
  <div class="modal-header">
    <div class="modal-title">🔀 Vocabulary Drill</div>
    <button class="icon-btn" onclick="document.getElementById('spinner-modal').close()">✕</button>
  </div>
  <div class="modal-body">
    <div class="spinner-row-label">Scope</div>
    <div class="spinner-seg-group" id="spinner-scope-group">
      <button class="spinner-seg selected" data-scope="lesson" onclick="App.setSpinnerScope('lesson')">📖 Lesson</button>
      <button class="spinner-seg" data-scope="unit" onclick="App.setSpinnerScope('unit')">📚 Unit</button>
      <button class="spinner-seg" data-scope="all" onclick="App.setSpinnerScope('all')">🌐 Sab</button>
    </div>
    <div id="spinner-scope-picker" class="spinner-scope-picker" style="display:none;"></div>
    <div class="spinner-row-label" style="margin-top:10px;">Filter</div>
    <div class="spinner-seg-group" id="spinner-filter-group">
      <button class="spinner-seg selected" data-filter="all" onclick="App.setSpinnerFilter('all')">📋 Sab Items</button>
      <button class="spinner-seg" data-filter="starred" onclick="App.setSpinnerFilter('starred')">★ Sirf Starred</button>
    </div>
    <div id="spinner-pool-info" class="spinner-pool-info"></div>
    <div id="spinner-card" class="spinner-card" onclick="App.toggleSpinnerReveal()">
      <div id="spinner-arabic" class="spinner-arabic">...</div>
      <div id="spinner-hinglish" class="spinner-hinglish" style="display:none;">...</div>
      <div id="spinner-hint" class="spinner-hint">(card tap karein — tarjuma zahir hoga)</div>
    </div>
    <div class="spinner-controls">
      <button class="btn-secondary" onclick="App.playCurrentSpinnerAudio()">🔊 Suno</button>
      <button class="btn-primary" onclick="App.nextSpinnerCard()">Agla →</button>
    </div>
  </div>
</dialog>
```

#### C. Replace openSpinner + setSpinnerPool + add new functions (replace old functions)

```js
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

function _renderSpinnerScopePicker() {
  const picker = document.getElementById('spinner-scope-picker');
  if (spinnerScope === 'all') { picker.style.display = 'none'; picker.innerHTML = ''; return; }
  picker.style.display = 'block';
  if (spinnerScope === 'unit') {
    const cur = typeof spinnerScopeValue === 'number' ? spinnerScopeValue : currentStage;
    spinnerScopeValue = cur;
    picker.innerHTML = '<div class="spinner-mini-picker"><div class="spinner-stage-tabs">' +
      [1,2,3,4,5,6,7].map(u =>
        `<button class="spinner-mini-btn${u===cur?' selected':''}" onclick="App._setSpinnerUnit(${u})">${u}</button>`
      ).join('') + '</div></div>';
  } else {
    const sv = spinnerScopeValue && spinnerScopeValue.stage ? spinnerScopeValue : { stage: currentStage, lesson: currentLesson };
    const stageData = window.PWA_BOOK_DATA.stages[`Stage${sv.stage}`] || [];
    picker.innerHTML = `<div class="spinner-mini-picker">
      <div class="spinner-stage-tabs">
        ${[1,2,3,4,5,6,7].map(s =>
          `<button class="spinner-stage-tab${s===sv.stage?' selected':''}" onclick="App._setSpinnerStageTab(${s})">${s}</button>`
        ).join('')}
      </div>
      <div class="spinner-lesson-btns">
        ${stageData.map(l => {
          const sel = sv.stage === l.stage && l.lesson_id === sv.lesson;
          return `<button class="spinner-mini-btn${sel?' selected':''}" onclick="App._setSpinnerLesson(${sv.stage},${l.lesson_id})">${l.lesson_id}</button>`;
        }).join('')}
      </div>
    </div>`;
  }
}

function _setSpinnerStageTab(stage) {
  spinnerScopeValue = { stage, lesson: 1 };
  _renderSpinnerScopePicker();
  _buildSpinnerPool();
}
function _setSpinnerUnit(unit) {
  spinnerScopeValue = unit;
  _renderSpinnerScopePicker();
  _buildSpinnerPool();
}
function _setSpinnerLesson(stage, lesson) {
  spinnerScopeValue = { stage, lesson };
  _renderSpinnerScopePicker();
  _buildSpinnerPool();
}

function _buildSpinnerPool() {
  spinnerPool = [];
  const stages = window.PWA_BOOK_DATA.stages;
  const collect = (stageNum, lessonId) => {
    const les = (stages[`Stage${stageNum}`] || []).find(l => l.lesson_id === lessonId);
    if (!les) return;
    (les.sections || []).forEach((sec, sIdx) => {
      ((sec.data && sec.data.items) || []).forEach((it, iIdx) => {
        if (!it.arabic || !it.hinglish || it.arabic.includes('----')) return;
        const itemKey = `S${stageNum}L${lessonId}_s${sIdx}_${iIdx}`;
        if (spinnerFilter === 'starred' && !isStarred(itemKey)) return;
        spinnerPool.push({ arabic: it.arabic, origHinglish: it.hinglish, customHinglish: customAnswers[itemKey] || '', key: itemKey });
      });
    });
  };
  if (spinnerScope === 'lesson') {
    const sv = spinnerScopeValue && spinnerScopeValue.stage ? spinnerScopeValue : { stage: currentStage, lesson: currentLesson };
    collect(sv.stage, sv.lesson);
  } else if (spinnerScope === 'unit') {
    const unit = typeof spinnerScopeValue === 'number' ? spinnerScopeValue : currentStage;
    (stages[`Stage${unit}`] || []).forEach(l => collect(unit, l.lesson_id));
  } else {
    for (let s = 1; s <= 7; s++) (stages[`Stage${s}`] || []).forEach(l => collect(s, l.lesson_id));
  }
  for (let i = spinnerPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [spinnerPool[i], spinnerPool[j]] = [spinnerPool[j], spinnerPool[i]];
  }
  spinnerIndex = 0;
  const info = document.getElementById('spinner-pool-info');
  if (info) info.textContent = spinnerPool.length > 0 ? `${spinnerPool.length} items` : '';
  showSpinnerCard();
}

// Backward compat alias
function setSpinnerPool(mode) {
  if (mode === 'starred') { spinnerScope = 'all'; spinnerFilter = 'starred'; }
  else { spinnerScope = 'lesson'; spinnerFilter = 'all'; }
  spinnerScopeValue = null;
  _buildSpinnerPool();
}
```

Also update the empty-state in `showSpinnerCard()` (lines 575-577):
```js
// Old:
document.getElementById('spinner-arabic').textContent = spinnerMode === 'starred' ? 'No Starred Items Yet' : 'No Items in Current Lesson';
// New:
document.getElementById('spinner-arabic').textContent = spinnerFilter === 'starred' ? 'Koi starred item nahi hai' : 'Is scope mein koi item nahi';
```

**Add to App exports** (the `return { ... }` at end of IIFE):
```js
setSpinnerScope,
setSpinnerFilter,
_setSpinnerStageTab,
_setSpinnerUnit,
_setSpinnerLesson,
_buildSpinnerPool,
```

#### D. CSS to add

```css
/* F2 — Spinner scope/filter */
.spinner-row-label {
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--text-muted); margin-bottom: 5px;
}
.spinner-seg-group { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px; }
.spinner-seg {
  flex: 1; min-width: 70px; padding: 7px 4px; font-size: 0.82rem;
  border: 1.5px solid var(--border-color, #ccc); border-radius: 8px;
  background: transparent; color: var(--text-primary); cursor: pointer; text-align: center;
}
.spinner-seg.selected { background: var(--accent, #1B4332); color: #fff; border-color: var(--accent, #1B4332); }
.spinner-scope-picker {
  background: var(--bg-secondary, #f7f5f0); border-radius: 8px;
  padding: 8px; margin-bottom: 8px;
}
.spinner-mini-picker { display: flex; flex-direction: column; gap: 6px; }
.spinner-stage-tabs, .spinner-lesson-btns { display: flex; flex-wrap: wrap; gap: 4px; }
.spinner-stage-tab {
  padding: 4px 10px; font-size: 0.78rem; border: 1px solid var(--border-color, #ccc);
  border-radius: 6px; background: transparent; cursor: pointer;
}
.spinner-stage-tab.selected { background: var(--accent, #1B4332); color: #fff; border-color: transparent; }
.spinner-mini-btn {
  padding: 4px 8px; font-size: 0.78rem; border: 1px solid var(--border-color, #ccc);
  border-radius: 6px; background: transparent; cursor: pointer; min-width: 32px;
}
.spinner-mini-btn.selected { background: var(--accent-light, #2d6a4f); color: #fff; border-color: transparent; }
.spinner-pool-info { font-size: 0.75rem; color: var(--text-muted); text-align: right; padding: 2px 0 4px; }
```

### Edge cases
- Scope=lesson, filter=starred, no starred items in that lesson: shows empty state, no crash.
- Scope=all, filter=starred, zero starred overall: empty state.
- Stub lessons (no items): `collect()` finds no items and skips silently.
- Old HTML elements `pool-starred-btn` / `pool-lesson-btn` removed — `setSpinnerPool(mode)` alias handles any leftover calls.

### Browser verification
1. Open spinner. Expected: "Lesson" scope selected, current lesson items loaded.
2. Tap "Unit" scope. Expected: unit picker 1-7 appears. Tap "3" -> pool = all Unit 3 items.
3. Tap "★ Sirf Starred" filter. Expected: pool shrinks to starred items from Unit 3 only.
4. Tap "🌐 Sab" scope. Expected: picker disappears; pool = all starred items from all units.
5. Scope=Lesson, tap stage tab "2", tap lesson "5". Expected: pool = items from Unit 2 Lesson 5.

### Commit
```
git add pwa/app.js pwa/index.html pwa/styles.css
git commit -m "feat(pwa): redesign spinner with scope (lesson/unit/all) and starred/all filter"
```

---

## Feature 3: Bookmark Overhaul — Single Bookmark + Auto-Resume

### Exact deletions from app.js

Delete these entire functions (search by name, delete the full body):

1. **`attachLongPress`** (lines 850-859) — full function body
2. **`showBookmarkPopup`** (lines 861-880) — full function body
3. **`dismissBmPopup`** (line 882) — one-liner
4. **`toggleBookmark`** (lines 884-906) — full function body
5. **`copyCard`** (lines 908-913) — full function body
6. **`refreshBookmarkIndicators`** (lines 915-920) — full function body
7. **`openBmDrawer`** (lines 922-945) — full function body
8. **`closeBmDrawer`** (lines 947-951) — full function body
9. **`removeBm`** (line 953) — one-liner
10. **`clearAllBookmarks`** (lines 955-958) — full function body
11. **`jumpToBookmark`** (lines 960-970) — full function body
12. **`updateBookmarksBadge`** (lines 1022-1028) — full function body

Also delete this block from inside `renderCurrentLesson()` (lines 424-444):
```js
// Phase 5: wire up long-press gestures and refresh bookmark indicators
requestAnimationFrame(() => {
  document.querySelectorAll('.vocab-card[data-item-id]').forEach(cardEl => {
    ...
    attachLongPress(...); break; }
    ...
  });
  refreshBookmarkIndicators();
});
```

Also edit the Escape key handler (line 1038):
```js
// Old:
if (e.key === 'Escape') { closeMenuPanel(); closeBmDrawer(); dismissBmPopup(); }
// New:
if (e.key === 'Escape') { closeMenuPanel(); }
```

Also edit `openMenuPanel()` — remove the `updateBookmarksBadge()` call inside it.

### Exact deletions from index.html

Delete the entire bookmark drawer block (lines 215-228):
```html
<!-- Bookmark Drawer — Phase 5F -->
<div id="bm-drawer" class="side-drawer" ...>...</div>
<div id="bm-backdrop" class="drawer-backdrop" onclick="closeBmDrawer()"></div>
```

Delete the bookmark menu entry (lines 281-284):
```html
<button class="menu-action-row" onclick="closeMenuPanel();openBmDrawer()">
  📌 <span>Bookmarks</span>
  <span class="menu-action-badge" id="bm-count-badge"></span>
</button>
```

Delete this line from the deep-link handler (~line 339):
```js
if (location.hash === '#bookmarks')  setTimeout(() => openBmDrawer(), 500);
```

### New BookmarkStore (replace lines 831-848 of app.js)

**Old** (multi-bookmark, 200 max):
```js
const BookmarkStore = (() => {
  const KEY = 'muallim_bookmarks', MAX = 200;
  ...
  return { add, remove, has, getAll, clear };
})();
```

**New** (single bookmark):
```js
const BookmarkStore = (() => {
  const KEY = 'muallim_bookmark'; // singular
  function load() { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } }
  function save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { showToast('Storage full'); } }
  return {
    set(item)        { save(item); },
    get()            { return load(); },
    clear()          { localStorage.removeItem(KEY); },
    isBookmarked(id) { const b = load(); return b ? b.id === id : false; },
    has(id)          { return this.isBookmarked(id); } // shim for any missed references
  };
})();
```

### New helpers to add (add right after new BookmarkStore)

```js
function refreshBookmarkButtons() {
  const bm = BookmarkStore.get();
  document.querySelectorAll('.btn-bookmark').forEach(btn => {
    btn.classList.toggle('bookmarked', bm ? bm.id === btn.dataset.itemId : false);
  });
}

function setBookmark(itemId, stage, lesson, arabic, hinglish) {
  BookmarkStore.set({ id: itemId, stage, lesson, arabic, hinglish, timestamp: Date.now() });
  refreshBookmarkButtons();
  showToast('🔖 Jagah save ho gayi');
}
```

### Modified card templates (all 5 card types in renderCurrentLesson)

Every card in `renderCurrentLesson()` has this pattern (with slight variations):
```js
// OLD:
`<span class="bookmark-indicator" style="display:${BookmarkStore.has(itemKey)?'block':'none'}">📌</span>
<div class="card-top">
  <button class="card-action-btn" onclick="App.speakArabic('${escAr}')">🔊</button>
  <button class="card-action-btn ${starred ? 'starred' : ''}" onclick="App.toggleStarInPlace(this, '${itemKey}', '${escAr}', '${escHi}')">★</button>
</div>`
```

Replace with (everywhere — all 5 card types):
```js
// NEW — remove bookmark-indicator span, add btn-bookmark button:
`<div class="card-top">
  <button class="card-action-btn" onclick="App.speakArabic('${escAr}')">🔊</button>
  <button class="card-action-btn ${starred ? 'starred' : ''}" onclick="App.toggleStarInPlace(this, '${itemKey}', '${escAr}', '${escHi}')">★</button>
  <button class="card-action-btn btn-bookmark${BookmarkStore.isBookmarked(itemKey) ? ' bookmarked' : ''}" data-item-id="${itemKey}" onclick="setBookmark('${itemKey}', ${currentStage}, ${currentLesson}, '${escAr}', '${escHi}')">🔖</button>
</div>`
```

Apply this change to these 5 card types in `renderCurrentLesson()`:
- `grid` / `three_col_list` / `waw_grid` (~lines 255-264)
- `two_col_numbered_list` (~lines 288-297)
- `verse_block` / `exercise_verses` (~lines 325-334)
- `ayah_pause_block` (~lines 374-383)
- `tashbeeh_grid` (~lines 406-414) — this one had no bookmark-indicator, just add the btn-bookmark

### Modified App.init() — auto-resume (replace lines 15-24)

```js
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
  setTimeout(() => { if (typeof offerResume === 'function') offerResume(); }, 1500);
}
```

### CSS to add/remove

**Add**:
```css
/* F3 — Bookmark button */
.btn-bookmark { opacity: 0.4; transition: opacity 0.15s, color 0.15s; }
.btn-bookmark.bookmarked { opacity: 1; color: #d97706; /* amber, distinct from star */ }
.btn-bookmark:active { transform: scale(0.92); }
```

**Remove from styles.css** (search and delete):
- `.bookmark-popup`, `.bookmark-popup-btn`
- `.bookmark-indicator`
- `.bookmark-entry`, `.bookmark-entry-header`, `.bookmark-label`, `.bookmark-arabic`, `.bookmark-hinglish`, `.bookmark-date`
- `.side-drawer` (if ONLY used by bm-drawer; grep first — do NOT delete if menu-panel uses it)
- `.drawer-list`, `.drawer-empty` (if only used by bm-drawer)

### Edge cases
- No bookmark in localStorage (first install): `BookmarkStore.get()` returns null; loads L1,1 as normal.
- Bookmarked card no longer exists in data: `querySelector` returns null; `if (card)` guard prevents crash. Lesson still loads.
- User taps 🔖 on already-bookmarked card: overwrites with same data (timestamp updates), no visible change.
- Old `muallim_bookmarks` key in localStorage: left orphaned, no interference.
- Any code that still calls `BookmarkStore.has(id)`: the shim `has(id) { return this.isBookmarked(id); }` prevents crashes.

### Browser verification
1. Open app fresh (clear localStorage). Expected: loads Unit 1 Lesson 1.
2. Go to Unit 3 Lesson 5. Tap 🔖 on a card. Expected: toast shown, that button glows amber, others dim.
3. Reload page. Expected: silently opens Unit 3 Lesson 5, scrolls to bookmarked card with flash.
4. Tap 🔖 on a different card. Expected: previous button dims, new one glows amber.
5. Open menu. Expected: NO "Bookmarks" entry. No bookmark badge on header.
6. Long-pressing a card: Expected: no popup appears (system removed).

### Commit
```
git add pwa/app.js pwa/index.html pwa/styles.css
git commit -m "feat(pwa): overhaul bookmarks — single bookmark button, auto-resume, remove long-press"
```

---

## Feature 4: Exam Generation System

### Reference files
- Print layout inspiration: `E:\AIPROJECTS\PROJECTS\translate-hinglish-skill\Output from other projects\Custom_QuestionPaper.html`
  (Use its @page, ep-header, section-header, MCQ grid, match-table, answer-line CSS)
- Exam data model reference: `E:\AIPROJECTS\PROJECTS\Question paper\custom-paper.json`

### Menu entry (add in index.html, after "Vocabulary Drill" button at line 289)
```html
<button class="menu-action-row" onclick="closeMenuPanel();openExamConfig()">
  📝 <span>Imtehaan Banao</span>
</button>
```

### New modals to add to index.html (before closing `</body>`)
```html
<dialog id="exam-config-modal" class="app-modal">
  <div class="modal-header">
    <div class="modal-title">📝 Imtehaan Banao</div>
    <button class="icon-btn" onclick="document.getElementById('exam-config-modal').close()">✕</button>
  </div>
  <div class="modal-body" id="exam-config-body"></div>
</dialog>

<dialog id="exam-modal" class="app-modal exam-modal">
  <div class="modal-header">
    <div class="modal-title" id="exam-modal-title">📝 Imtehaan</div>
    <div style="display:flex;gap:6px;">
      <button class="btn-secondary" id="exam-print-btn" onclick="window.print()" style="display:none;">🖨️ Print</button>
      <button class="icon-btn" onclick="document.getElementById('exam-modal').close()">✕</button>
    </div>
  </div>
  <div class="modal-body" id="exam-display-mount"></div>
</dialog>
```

### Exam config state + step renderer (add inside App IIFE, before the `return {` at end)

```js
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
      ${backStep ? `<button class="btn-secondary" onclick="_renderExamStep(${backStep})">← Wapas</button>` : '<span></span>'}
      <button class="btn-primary" onclick="${nextStep ? `_renderExamStep(${nextStep})` : '_generateAndShowExam()'}">${nextLabel || 'Aage →'}</button>
    </div>`;

  if (step === 1) {
    body.innerHTML = `
      <div class="exam-step-title">Qadam 1 — Kya shamil karein?</div>
      <div class="exam-scope-opts">
        ${[['lessons','Alag Alag Lessons'],['units','Poora Unit'],['all','Saare 7 Units']].map(([v,l]) =>
          `<label class="exam-radio-label"><input type="radio" name="es" value="${v}" ${_examConfig.scopeType===v?'checked':''} onchange="_examConfig.scopeType='${v}';_renderExamStep(1)"> ${l}</label>`
        ).join('')}
      </div>
      ${_renderExamScopeSelector()}
      ${nav(null, 2)}
    `;
  } else if (step === 2) {
    body.innerHTML = `
      <div class="exam-step-title">Qadam 2 — Kaunse items?</div>
      <div class="exam-scope-opts">
        <label class="exam-radio-label"><input type="radio" name="ef" value="all" ${_examConfig.filter==='all'?'checked':''} onchange="_examConfig.filter='all'"> Tamam Items</label>
        <label class="exam-radio-label"><input type="radio" name="ef" value="starred" ${_examConfig.filter==='starred'?'checked':''} onchange="_examConfig.filter='starred'"> Sirf Starred ★</label>
      </div>
      ${nav(1, 3)}
    `;
  } else if (step === 3) {
    body.innerHTML = `
      <div class="exam-step-title">Qadam 3 — Kitne Sawaal?</div>
      <div class="exam-count-btns">
        ${[10,20,30,50].map(n => `<button class="exam-count-btn${_examConfig.questionCount===n?' selected':''}" onclick="_examConfig.questionCount=${n};_renderExamStep(3)">${n}</button>`).join('')}
      </div>
      <div style="margin-top:10px;display:flex;align-items:center;gap:8px;">
        <span style="font-size:0.85rem;">Ya likho:</span>
        <input type="number" min="5" max="100" value="${_examConfig.questionCount}" style="width:60px;padding:4px 6px;border:1px solid var(--border-color,#ccc);border-radius:6px;" oninput="_examConfig.questionCount=Math.max(5,Math.min(100,+this.value||20))">
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
            onchange="if(this.checked){if(!_examConfig.questionTypes.includes('${val}'))_examConfig.questionTypes.push('${val}');}else _examConfig.questionTypes=_examConfig.questionTypes.filter(t=>t!=='${val}')">
          ${lbl}
        </label>`).join('')}
      ${nav(3, 5)}
    `;
  } else if (step === 5) {
    body.innerHTML = `
      <div class="exam-step-title">Qadam 5 — Kaise lena hai?</div>
      <div class="exam-scope-opts">
        <label class="exam-radio-label"><input type="radio" name="eo" value="interactive" ${_examConfig.outputMode==='interactive'?'checked':''} onchange="_examConfig.outputMode='interactive'"> 🎯 App mein (scoring ke saath)</label>
        <label class="exam-radio-label"><input type="radio" name="eo" value="print" ${_examConfig.outputMode==='print'?'checked':''} onchange="_examConfig.outputMode='print'"> 🖨️ Print karein (paper pe)</label>
      </div>
      ${nav(4, null, '📝 Imtehaan Banao')}
    `;
  }
}

function _renderExamScopeSelector() {
  if (_examConfig.scopeType === 'all') return '';
  if (_examConfig.scopeType === 'units') {
    return `<div class="exam-unit-grid">
      ${[1,2,3,4,5,6,7].map(u => `
        <label class="exam-unit-check">
          <input type="checkbox" ${_examConfig.selectedUnits.includes(u)?'checked':''}
            onchange="if(this.checked){if(!_examConfig.selectedUnits.includes(${u}))_examConfig.selectedUnits.push(${u});}else _examConfig.selectedUnits=_examConfig.selectedUnits.filter(x=>x!==${u})">
          Unit ${u}
        </label>`).join('')}
    </div>`;
  }
  const st = _examConfig._lessonTabStage || 1;
  const stageData = window.PWA_BOOK_DATA.stages[`Stage${st}`] || [];
  return `
    <div class="exam-stage-tabs">
      ${[1,2,3,4,5,6,7].map(s =>
        `<button class="exam-stage-tab${s===st?' selected':''}" onclick="_examConfig._lessonTabStage=${s};_renderExamStep(1)">Unit ${s}</button>`
      ).join('')}
    </div>
    <div class="exam-lesson-checks">
      ${stageData.map(l => {
        const sel = _examConfig.selectedLessons.some(x => x.stage===st && x.lesson===l.lesson_id);
        return `<label class="exam-lesson-check">
          <input type="checkbox" ${sel?'checked':''}
            onchange="if(this.checked){if(!_examConfig.selectedLessons.some(x=>x.stage===${st}&&x.lesson===${l.lesson_id}))_examConfig.selectedLessons.push({stage:${st},lesson:${l.lesson_id}});}else _examConfig.selectedLessons=_examConfig.selectedLessons.filter(x=>!(x.stage===${st}&&x.lesson===${l.lesson_id}))">
          L${l.lesson_id}
        </label>`;
      }).join('')}
    </div>`;
}
```

### Exam engine (add after config JS above, still inside App IIFE)

```js
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
```

### Interactive exam renderer

```js
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
    const isMatch = q.answers.some(a => a.arabic === q.lefts[sel.left] && a.hinglish === q.rights[sel.right]);
    const lBtn = qEl.querySelector(`.exam-match-item[data-side="left"][data-idx="${sel.left}"]`);
    const rBtn = qEl.querySelector(`.exam-match-item[data-side="right"][data-idx="${sel.right}"]`);
    if (isMatch) {
      lBtn.classList.add('match-correct'); lBtn.disabled = true;
      rBtn.classList.add('match-correct'); rBtn.disabled = true;
      _examScore++; _examAnswered++;
    } else {
      lBtn.classList.add('match-wrong'); rBtn.classList.add('match-wrong');
      setTimeout(() => { lBtn.classList.remove('match-wrong','selected'); rBtn.classList.remove('match-wrong','selected'); }, 800);
    }
    delete _matchSel[qi];
    if (qEl.querySelectorAll('.exam-match-item:not(:disabled)').length === 0) _checkExamDone();
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
  const nonMatch = _examQuestions.filter(q => q.type !== 'matching');
  const matchQ   = _examQuestions.filter(q => q.type === 'matching');
  const answered = document.querySelectorAll('.exam-q[data-answered="1"]').length;
  if (answered < nonMatch.length + matchQ.length) return;
  const total = _examQuestions.length;
  const pct = Math.round(_examScore / Math.max(total,1) * 100);
  const s = document.getElementById('exam-summary');
  s.style.display = 'block';
  s.innerHTML = `
    <div class="exam-score-display">${_examScore} / ${total}</div>
    <div class="exam-score-pct">${pct}% Sahi</div>
    <div style="margin-top:16px;display:flex;gap:10px;justify-content:center;">
      <button class="btn-secondary" onclick="App._generateAndShowExam()">🔁 Dobara</button>
      <button class="btn-primary" onclick="App.openExamConfig()">📝 Naya Imtehaan</button>
    </div>`;
  s.scrollIntoView({ behavior:'smooth', block:'center' });
}
```

### Print exam renderer

```js
function _renderPrintExam() {
  document.getElementById('exam-modal-title').textContent = '📝 Imtehaan Paper';
  document.getElementById('exam-print-btn').style.display = 'inline-flex';
  const today = new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
  let html = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Noto+Sans:wght@400;500;700&display=swap" rel="stylesheet">
    <div class="exam-print-wrapper">
      <div class="ep-header">
        <div class="ep-title">MUALLIM UL-QUR'AN — مُعَلِّمُ الْقُرْآنِ</div>
        <div class="ep-subtitle">IMTEHAAN PAPER</div>
        <div class="ep-meta">
          <div>Naam: _______________________</div>
          <div>Class / Roll: _______________</div>
          <div>Tarikh: ${today}</div>
          <div>Marks: ${_examQuestions.length * 2} | Waqt: ${Math.ceil(_examQuestions.length * 2.5)}m</div>
        </div>
      </div>`;

  const sections = [
    ['mcq','MCQ — Arabic se Hinglish'],
    ['mcq_rev','MCQ — Hinglish se Arabic'],
    ['tf','Sahi ya Ghalat'],
    ['audio_mcq','Audio Sawaal (app mein suno)'],
    ['matching','Jori Milao']
  ];
  let ak = '<div class="ep-answer-key"><div class="ep-ak-title">JAWAB NAAMA (Answer Key)</div>';
  let qn = 1;
  sections.forEach(([type, title]) => {
    const qs = _examQuestions.filter(q => q.type === type);
    if (!qs.length) return;
    html += `<div class="ep-section"><div class="ep-section-header"><span>${title}</span><span>[${qs.length*2} Marks]</span></div>`;
    qs.forEach(q => {
      if (type === 'mcq' || type === 'mcq_rev' || type === 'audio_mcq') {
        const qText = type === 'mcq_rev' ? q.hinglish : `<span class="ep-arabic" dir="rtl">${q.arabic}</span>`;
        const prefix = type === 'audio_mcq' ? '🔊 ' : '';
        const optStyle = type === 'mcq_rev' ? 'dir="rtl" class="ep-arabic"' : '';
        html += `<div class="ep-q">
          <div class="ep-q-text">Q${qn}. ${prefix}${qText} ka matlab:</div>
          <div class="ep-opts">${q.options.map((o,i) => `<div class="ep-opt" ${optStyle}>(${String.fromCharCode(65+i)}) ${o}</div>`).join('')}</div>
        </div>`;
        ak += `<div>Q${qn}: ${String.fromCharCode(65+q.correctIdx)}</div>`;
      } else if (type === 'tf') {
        html += `<div class="ep-q">
          <div class="ep-q-text">Q${qn}. <span class="ep-arabic" dir="rtl">${q.arabic}</span> = "${q.hinglish}" — Sahi hai ya Ghalat?</div>
          <div class="ep-blank-line"></div>
        </div>`;
        ak += `<div>Q${qn}: ${q.isCorrect ? 'Sahi' : 'Ghalat'}</div>`;
      } else if (type === 'matching') {
        html += `<div class="ep-q"><div class="ep-q-text">Q${qn}. Sahi jori milao:</div>
          <table class="ep-match-table"><thead><tr><th>Column A (Arabic)</th><th>Jawab</th><th>Column B (Hinglish)</th></tr></thead><tbody>
          ${q.lefts.map((l,i) => `<tr><td class="ep-arabic" dir="rtl">${l}</td><td class="ep-match-blank">___</td><td>${q.rights[i]||''}</td></tr>`).join('')}
          </tbody></table></div>`;
        ak += `<div>Q${qn}: ${q.answers.map(a => `${a.arabic}=${a.hinglish}`).join('; ')}</div>`;
      }
      qn++;
    });
    html += '</div>';
  });
  ak += '</div>';
  html += `<div style="page-break-before:always;"></div>${ak}</div>`;
  document.getElementById('exam-display-mount').innerHTML = html;
  document.getElementById('exam-modal').showModal();
}
```

**Add to App exports** (the `return { ... }` at end of IIFE):
```js
openExamConfig,
_renderExamStep,
_generateAndShowExam,
_answerMcq,
_answerTf,
_selectMatch,
_checkExamDone,
```

### CSS to add to styles.css

```css
/* F4 — Exam config */
.exam-step-title { font-weight:700; font-size:1rem; margin-bottom:12px; }
.exam-scope-opts { display:flex; flex-direction:column; gap:10px; margin-bottom:12px; }
.exam-radio-label, .exam-check-label { display:flex; align-items:center; gap:8px; font-size:0.9rem; cursor:pointer; }
.exam-unit-grid { display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; }
.exam-unit-check { display:flex; align-items:center; gap:4px; font-size:0.85rem; cursor:pointer; }
.exam-stage-tabs { display:flex; flex-wrap:wrap; gap:4px; margin:8px 0 6px; }
.exam-stage-tab { padding:4px 10px; font-size:0.78rem; border:1px solid var(--border-color,#ccc); border-radius:6px; cursor:pointer; background:transparent; }
.exam-stage-tab.selected { background:var(--accent,#1B4332); color:#fff; border-color:transparent; }
.exam-lesson-checks { display:flex; flex-wrap:wrap; gap:6px; }
.exam-lesson-check { font-size:0.8rem; display:flex; align-items:center; gap:3px; cursor:pointer; }
.exam-count-btns { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:8px; }
.exam-count-btn { padding:8px 18px; border:1.5px solid var(--border-color,#ccc); border-radius:8px; background:transparent; font-size:1rem; cursor:pointer; }
.exam-count-btn.selected { background:var(--accent,#1B4332); color:#fff; border-color:transparent; }
.exam-nav-row { display:flex; justify-content:space-between; margin-top:20px; }

/* F4 — Exam display */
.exam-modal { max-width:98vw; width:680px; }
.exam-questions { display:flex; flex-direction:column; gap:20px; padding:4px 0 16px; }
.exam-q { border:1px solid var(--border-color,#ddd); border-radius:10px; padding:14px; }
.exam-q-num { font-size:0.72rem; font-weight:700; color:var(--text-muted); margin-bottom:6px; text-transform:uppercase; }
.exam-q-text { font-size:0.95rem; margin-bottom:10px; }
.exam-arabic { font-family:'Amiri',serif; font-size:1.3rem; direction:rtl; }
.exam-opt { display:block; width:100%; text-align:left; padding:9px 12px; border:1px solid var(--border-color,#ccc); border-radius:8px; background:transparent; font-size:0.88rem; cursor:pointer; margin-bottom:6px; transition:background 0.15s; }
.exam-opt-arabic { font-family:'Amiri',serif; font-size:1.1rem; direction:rtl; text-align:right; }
.exam-opt:disabled { cursor:default; }
.exam-opt.opt-correct { background:#d1fae5; border-color:#10b981; color:#065f46; }
.exam-opt.opt-wrong   { background:#fee2e2; border-color:#ef4444; color:#991b1b; }
.exam-tf-btns { display:flex; gap:10px; }
.exam-tf { flex:1; text-align:center; }
.exam-audio-btn { margin-bottom:10px; }
.exam-match-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.exam-match-col { display:flex; flex-direction:column; gap:6px; }
.exam-match-item { padding:8px; border:1px solid var(--border-color,#ccc); border-radius:8px; background:transparent; cursor:pointer; font-size:0.88rem; }
.exam-match-item.selected { border-color:var(--accent,#1B4332); background:var(--bg-secondary,#f7f5f0); }
.exam-match-item.match-correct { background:#d1fae5; border-color:#10b981; }
.exam-match-item.match-wrong   { background:#fee2e2; border-color:#ef4444; }
.exam-summary { background:var(--bg-secondary,#f7f5f0); border-radius:12px; padding:24px; text-align:center; margin-top:20px; }
.exam-score-display { font-size:2.5rem; font-weight:800; color:var(--accent,#1B4332); }
.exam-score-pct { font-size:1.1rem; color:var(--text-secondary); margin-top:4px; }

/* F4 — Print exam */
.exam-print-wrapper { font-family:'Noto Sans',sans-serif; color:#000; font-size:9pt; line-height:1.5; }
.ep-header { border:1.5px solid #000; padding:10px; margin-bottom:14px; text-align:center; }
.ep-title { font-size:13pt; font-weight:700; text-transform:uppercase; }
.ep-subtitle { font-size:10pt; font-weight:600; text-transform:uppercase; margin:4px 0 8px; }
.ep-meta { display:grid; grid-template-columns:1fr 1fr; gap:6px; text-align:left; border-top:1px solid #000; padding-top:8px; font-size:9pt; }
.ep-section { margin-bottom:12px; }
.ep-section-header { display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #000; font-weight:700; font-size:9.5pt; text-transform:uppercase; padding-bottom:2px; margin-bottom:8px; }
.ep-q { margin-bottom:10px; page-break-inside:avoid; }
.ep-q-text { font-weight:500; margin-bottom:4px; font-size:9pt; }
.ep-arabic { font-family:'Amiri',serif; font-size:15pt; direction:rtl; }
.ep-opts { display:grid; grid-template-columns:1fr 1fr; gap:4px; margin-left:12px; margin-top:4px; }
.ep-opt { font-size:9pt; }
.ep-blank-line { border-bottom:1px dotted #000; width:70%; height:18px; display:inline-block; vertical-align:bottom; margin-top:4px; }
.ep-match-table { width:100%; border-collapse:collapse; margin-top:6px; font-size:9pt; }
.ep-match-table th, .ep-match-table td { border:1px solid #000; padding:3px 6px; }
.ep-match-blank { text-align:center; width:80px; }
.ep-answer-key { margin-top:8px; }
.ep-ak-title { font-weight:700; text-decoration:underline; font-size:10pt; margin-bottom:8px; }

@media print {
  .app-header, #menu-panel, .modal-header button, #exam-print-btn { display:none !important; }
  dialog.exam-modal { position:static !important; margin:0; border:none; padding:0; width:100%; }
  .ep-section { page-break-inside:avoid; }
}
```

### Edge cases
- No items found: toast shown, config modal stays open.
- Only "matching" type selected, fewer than 4 items: batch of 2-3 still created. Single-item batches dropped silently.
- questionCount > available items: capped at `allItems.length`.
- selectedLessons empty when clicking Aage from step 1: falls back to current lesson.
- questionTypes empty: toast "Kam az kam ek sawaal ka qism chunein!"

### Browser verification
1. Menu -> "Imtehaan Banao". Config modal opens at Step 1.
2. Select "Alag Alag Lessons" -> pick Unit 1, L1 and L2 -> Aage.
3. "Tamam Items" -> Aage. "10 sawaal" -> Aage. Keep all types -> Aage. "App mein" -> "Imtehaan Banao".
4. Expected: Exam with 10 questions. MCQ options tappable, correct = green, wrong = red.
5. Answer all -> Expected: score summary with Dobara / Naya Imtehaan buttons.
6. Generate again with "Print karein". Expected: print layout with A4 formatting, "🖨️ Print" header button.
7. Click Print button. Expected: browser print dialog. Preview shows Arabic in Amiri font, answer key on last page.

### Commit
```
git add pwa/app.js pwa/index.html pwa/styles.css
git commit -m "feat(pwa): add exam generation system with interactive and print modes"
```

---

## Final Deployment

```bash
cd e:\AIPROJECTS\PROJECTS\translate-hinglish-skill
git push origin main
```

GitHub Pages auto-deploys on push to `main` (takes 30-90 seconds).

### Final smoke test on https://nomaanc.github.io/muallim/

- [ ] App opens -> silently resumes to bookmarked lesson (or U1L1 if none)
- [ ] 🔖 on any card -> toast -> reload -> resumes from that card
- [ ] Starred panel -> items grouped by lesson, sorted by lesson order
- [ ] Vocabulary Drill -> two scope/filter rows visible; scope=Unit, tap 3 -> pool builds
- [ ] Menu -> "Imtehaan Banao" -> 5 config steps -> generate interactive exam -> score shows
- [ ] Generate print exam -> Print button in header -> browser print dialog opens
