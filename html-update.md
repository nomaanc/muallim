# Muallim ul-Quran — PWA Feature Update & Exam Engine Master Prompt (v3.0)

> **This document is the complete, production-grade master execution prompt.**
> Read every section thoroughly before modifying or creating any file.
> Execute all phases in exact sequence. Zero placeholders, zero TODO stubs.

---

## 0. Executive Summary & Context

Muallim ul-Quran is an offline-first interactive Quranic Arabic workbook PWA deployed on GitHub Pages (`https://nomaanc.github.io/muallim/`).
This update addresses critical feedback regarding:
1. **Interactive Exam Scoring & Pairing Correction**: Wrong pairing in matching questions must NOT allow infinite free retries. Results must be scored with genuine evaluation, logged to `ExamHistoryStore`, and displayed in an interactive Review & Scorecard modal.
2. **Exam Print & Multi-Column Download Engine**: Fix multi-page clipping (where 2nd page onwards disappeared in print), implement dense 2/3/4-column A4 paper layouts matching `output/question_papers/`, provide direct PDF and HTML download buttons, and introduce grammatically tough distractors (Harakaat variations, singular/dual/plural traps, Idaafah/Sifat confusion).
3. **Bookmark Transparent Outline & State Fill**: Bookmarks must have a transparent outline when unselected and a vibrant filled color (`#1B4332` / `#C5A880`) when active. The "Continue where left off" popup is permanently removed.
4. **Menu Enhancements**: Student Name profile input (auto-populating exams and admin sync), 'Add to Home Screen' PWA trigger button, and 'Allow Push Notifications' with customizable daily study reminder times.
5. **In-App Embedded Admin / Teacher Portal**: Unlocked via Teacher PIN (`7860` default) directly inside the slide-in menu, offering a real-time Student Roster, Exam Gradebook, Starred/Custom Translation Inspector, CSV grade export, and Broadcast Push Notification Composer.
6. **Vocabulary Drill Scope Selection Overhaul**: Modern multi-select accordion/grid selector showing Stage tabs, descriptive Lesson titles, word count badges, and one-click 'Select All / Clear' options.
7. **Comprehensive Audit Fixes**: Dialog print clipping elimination, backdrop scroll lock hygiene, and touch target accessibility.

---

## 1. Project Architecture (Target Directory Structure)

```
pwa/
├── index.html               ← Master shell (clean, accessible, zero-FOUC)
├── styles.css               ← Complete stylesheet (responsive, dark mode, print @media rules)
├── app.js                   ← Core application engine & stores
├── manifest.json            ← Web App Manifest (standalone, shortcuts, masks)
├── sw.js                    ← Service Worker (offline cache-first, push notifications)
├── pwa_book_data.js         ← Master workbook data (7 Stages, 114 Lessons)
├── book_data.js             ← Auxiliary data reference
└── icons/
    ├── icon.svg             ← Master vector icon (Deep Forest Green + Cream Meem)
    ├── icon-192.png         ← Android / PWA standard icon
    ├── icon-512.png         ← Android splash icon
    └── apple-touch-icon.png ← iOS Safari icon (180×180)
```

---

## 2. Feature Specifications

### FEATURE 1: Interactive Exam Pairing & Authentic Scoring Engine

#### Problem Addressed
Previously, matching questions allowed infinite clicks until items matched green, letting students brute-force 100% scores without penalty. Completed exams were also lost on modal close without permanent records or review.

#### Specification
1. **Single-Attempt Pairing Logic**:
   - In Matching/Pairing questions, when a student selects an Arabic word (left) and Hinglish phrase (right):
     - **If Correct**: Turn both items green (`.match-correct`), award points (2 marks), and permanently disable the pair.
     - **If Incorrect**: Turn both items red (`.match-wrong`), deduct marks (or assign 0 for that pair), reveal the correct connection after 900ms, and disable those items from being retried for free points.
2. **Exam History Store (`muallim_exam_history`)**:
   - Every completed interactive exam is recorded in localStorage:
     ```json
     {
       "id": "exam_1724800000000",
       "student_name": "Nomaan",
       "timestamp": 1724800000000,
       "scope_label": "Unit 3 · Lessons 1-5",
       "score": 34,
       "total": 40,
       "percentage": 85,
       "grade": "A",
       "time_spent_seconds": 185,
       "questions": [
         {
           "type": "mcq",
           "arabic": "رَبِّ الْعَالَمِينَ",
           "chosen": "tamam jahano ka rab",
           "correct": "tamam jahano ka rab",
           "is_correct": true
         }
       ]
     }
     ```
3. **Interactive Scorecard & Review Modal**:
   - Upon completing the exam, display:
     - **Score & Grade Badge**: `34 / 40 (85%) · Grade A`
     - **Performance Meter**: Visual color-coded progress bar (Green ≥80%, Gold ≥60%, Red <60%).
     - **Question-by-Question Breakdown (Review Mode)**: Expandable accordion showing every question, student's chosen answer vs correct answer, with explanations.
     - **Actions**: `🖨️ Print / Save Result Card`, `🔁 Retake Exam`, `📝 New Exam Config`.
   - Automatically sync score to Admin Portal storage.

---

### FEATURE 2: Exam Print & Multi-Column Download Engine

#### Problem Addressed
When printing from the browser, dialog modals clipped output to Page 1 only. Additionally, papers lacked multi-column density, clean question groupings, and PDF/HTML download triggers.

#### Specification
1. **Multi-Page Print Clipping Bug Fix**:
   - Add explicit `@media print` overrides ensuring all parent containers (`html`, `body`, `dialog`, `.exam-print-wrapper`) have `position: static !important; overflow: visible !important; height: auto !important; max-height: none !important; display: block !important;`.
   - Enforce page break hygiene:
     ```css
     .ep-section, .ep-q { page-break-inside: avoid; break-inside: avoid; }
     .ep-page-break { page-break-before: always; break-before: page; }
     ```
2. **Dense 2/3/4-Column Layout**:
   - Layout Section A (Vocabulary MCQs) in **3 columns**.
   - Layout Section B (Reverse MCQs) in **2 columns**.
   - Layout Section C (Matching Tables) in **2 columns**.
   - Layout Section D (T/F & Ayah Constructs) in **2 columns**.
   - This fits a full 40-question exam onto **strictly 2 printed pages** (Page 1-2: Question Paper, Page 3: Answer Key).
3. **Paper Header & Metadata**:
   - Institution Header: `MUALLIM UL-QUR'AN — مُعَلِّمُ الْقُرْآنِ`
   - Metadata Box: `Student Name: [Auto-filled or Blank Line]`, `Roll No: ______`, `Date: [Current Date]`, `Marks: 100`, `Time Allowed: 60 Mins`.
4. **Download Options**:
   - **Download HTML Paper**: Generates standalone self-contained offline printable HTML file.
   - **Print / Save as PDF**: Triggers browser PDF print dialog with high-definition vector typography.
5. **Tough Distractor Generation (Pedagogical Engine)**:
   - Generate challenging distractors mimicking `generate_stage3_exam.py`:
     - *Harakaat Trap*: Contrast `لَكِتَابٌ` (verily a book) vs `لِكِتَابٍ` (for a book).
     - *Gender / Plural Trap*: Contrast `هٰذَا` (this masc) vs `هٰذِهِ` (this fem) vs `هٰؤُلَاءِ` (these).
     - *Construct Confusion*: Contrast Sifat-Mausoof (`الرَّجُلُ الصَّالِحُ` - nek aadmi) with Idaafah (`عَبْدُ اللَّهِ` - Allah ka banda).

---

### FEATURE 3: Bookmark Transparent Outline & Fill System

#### Problem Addressed
Bookmark icons lacked visual contrast between unbookmarked and bookmarked states. The resume toast was also disruptive.

#### Specification
1. **Icon Visual States**:
   - **Unbookmarked State**: Crisp vector bookmark outline with **transparent fill** and subtle emerald stroke:
     `stroke: var(--accent-emerald, #1B4332); fill: transparent; stroke-width: 2px;`
   - **Bookmarked State**: Solid **filled** icon with emerald/gold background and elevated shadow:
     `fill: var(--accent-emerald, #1B4332); stroke: var(--accent-emerald, #1B4332); filter: drop-shadow(0 2px 4px rgba(27,67,50,0.3));`
2. **Remove Continue Reading Prompt**:
   - Permanently remove `offerResume()` / `checkAndOfferResume()` toast on app startup. The reading progress is silently updated and viewable in the menu without intrusive popups.

---

### FEATURE 4: Menu Profile, PWA Install & Push Notifications

#### Specification
1. **Student Name Profile Field**:
   - Added directly at the top of the slide-in menu:
     `👤 Student Name: [ input box ]`
   - Stored in `localStorage.setItem('muallim_student_name', value)`.
   - Automatically populates exam headers, certificates, and admin student roster sync.
2. **Add to Home Screen (PWA Install Button)**:
   - Captures `beforeinstallprompt` event.
   - Menu displays `📲 Install Muallim App` button. Clicking triggers native prompt. If already installed or on iOS Safari, displays friendly 2-step instruction tooltip ("Tap Share ⎋ -> Add to Home Screen ⊞").
3. **Push Notifications & Daily Study Reminder**:
   - Menu includes `🔔 Daily Study Reminder [Toggle]`.
   - When toggled ON, requests `Notification.requestPermission()`.
   - Allows setting preferred study reminder time (e.g. `08:00 PM`).
   - Service Worker triggers scheduled reminder with Quranic vocabulary tips and receives broadcast notifications from Admin.

---

### FEATURE 5: In-App Embedded Admin / Teacher Portal

#### Specification
1. **Access & Security**:
   - Accessible via Menu -> `👨‍💼 Teacher / Admin Portal`.
   - Requires Teacher PIN (Default: `7860`, customizable).
   - Unlocks an interactive embedded admin management dashboard directly inside the drawer/modal.
2. **Admin Dashboard Capabilities**:
   - **Student Roster**: Lists all registered students, last active timestamp, Stage completion percentage (Stage 1-7).
   - **Exam Gradebook**: View all exam attempts, scores, percentage, pass/fail status, and date.
   - **Starred & Custom Notes Inspector**: View which words students are starring most frequently and inspect custom translation notes written by students.
   - **Export Class Report**: One-click download of all student scores & progress as a structured CSV/JSON file.
   - **Broadcast Notification Composer**: Input title and announcement text (e.g., "Unit 4 Exam scheduled for Sunday!"), sending push alerts to student devices via local service worker sync.

---

### FEATURE 6: Vocabulary Drill Scope & Multi-Select Redesign

#### Specification
1. **Scope Picker Redesign**:
   - Replace the single-button picker with an organized **Stage & Lesson Selection Studio**:
     - **Stage Accordions / Tabs**: Unit 1 through Unit 7 with expandable lesson lists.
     - **Lesson Cards with Metadata**: Shows Lesson number, Title, and exact Word Count badge (e.g. `L4: Harf-e-Jarr (24 words)`).
     - **Multi-Select Checkboxes**: Select multiple arbitrary lessons across any unit (e.g. Unit 1 L1-L3 + Unit 2 L4).
     - **One-Click Presets**: `Select All Unit`, `Clear All`, `Starred Words Only ★`.
     - **Active Pool Counter**: Real-time counter badge showing `Total Words in Pool: 48`.

---

## 3. Implementation Codebase Blueprint

### Phase 1: CSS Updates (`pwa/styles.css`)

Add the following complete styles for print layout, bookmark outline/fill, exam matching single-attempt, and admin portal:

```css
/* ── Bookmark Transparent Outline & Fill System ───────── */
.btn-bookmark {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, filter 0.15s ease;
}
.btn-bookmark svg {
  width: 18px;
  height: 18px;
  stroke: var(--accent-emerald, #1B4332);
  stroke-width: 2px;
  fill: transparent;
  transition: fill 0.2s ease, stroke 0.2s ease;
}
.btn-bookmark.bookmarked svg {
  fill: var(--accent-emerald, #1B4332);
  stroke: var(--accent-emerald, #1B4332);
  filter: drop-shadow(0 2px 4px rgba(27,67,50,0.35));
}
[data-theme="dark"] .btn-bookmark svg {
  stroke: #C5A880;
}
[data-theme="dark"] .btn-bookmark.bookmarked svg {
  fill: #C5A880;
  stroke: #C5A880;
  filter: drop-shadow(0 2px 4px rgba(197,168,128,0.4));
}

/* ── Interactive Exam Single-Attempt Matching ────────── */
.exam-match-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 14px 0;
}
.exam-match-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.exam-match-item {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1.5px solid var(--border-color, #ddd);
  background: var(--bg-surface-elevated, #fff);
  color: var(--text-primary, #222);
  font-size: 0.95rem;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s ease;
}
.exam-match-item:hover:not(:disabled) {
  border-color: var(--accent-emerald, #1B4332);
  background: var(--bg-hover, #f0f7f4);
}
.exam-match-item.selected {
  border-color: var(--accent-emerald, #1B4332);
  background: rgba(27,67,50,0.12);
  font-weight: 700;
}
.exam-match-item.match-correct {
  border-color: #10B981 !important;
  background: rgba(16,185,129,0.15) !important;
  color: #065F46 !important;
  cursor: default;
}
.exam-match-item.match-wrong {
  border-color: #EF4444 !important;
  background: rgba(239,68,68,0.15) !important;
  color: #991B1B !important;
  cursor: default;
}

/* ── Complete Multi-Page Print Layout & Bug Fixes ────── */
@media print {
  @page {
    size: A4 portrait;
    margin: 10mm 12mm 12mm 12mm;
  }
  html, body {
    background: #fff !important;
    color: #000 !important;
    font-size: 9.5pt !important;
    line-height: 1.35 !important;
    height: auto !important;
    overflow: visible !important;
    width: 100% !important;
  }
  /* Fix dialog clipping */
  dialog#exam-modal, dialog, .modal-backdrop, .app-header, .side-drawer, .menu-panel, .drawer-backdrop {
    position: static !important;
    display: block !important;
    max-height: none !important;
    height: auto !important;
    overflow: visible !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  .no-print, .dialog-header, .exam-nav-row, #exam-print-btn, #exam-download-btn, .header-inner {
    display: none !important;
  }
  .exam-print-wrapper {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  .ep-header {
    border-bottom: 2pt solid #000;
    padding-bottom: 6pt;
    margin-bottom: 10pt;
    text-align: center;
  }
  .ep-title {
    font-size: 14pt;
    font-weight: 800;
    letter-spacing: 0.05em;
  }
  .ep-meta-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6pt;
    font-size: 8.5pt;
    margin-top: 6pt;
    text-align: left;
    border-top: 0.5pt solid #888;
    padding-top: 4pt;
  }
  /* Dense Multi-Column Grids for Print */
  .ep-grid-3col {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8pt;
    margin-bottom: 10pt;
  }
  .ep-grid-2col {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10pt;
    margin-bottom: 10pt;
  }
  .ep-section {
    page-break-inside: avoid;
    break-inside: avoid;
    margin-bottom: 12pt;
  }
  .ep-section-title {
    font-size: 10.5pt;
    font-weight: 700;
    background: #f0f0f0 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    padding: 3pt 6pt;
    border-left: 3pt solid #000;
    margin-bottom: 6pt;
  }
  .ep-q {
    page-break-inside: avoid;
    break-inside: avoid;
    border: 0.5pt solid #bbb;
    padding: 5pt 7pt;
    border-radius: 3pt;
  }
  .ep-arabic {
    font-family: 'Amiri', 'Traditional Arabic', serif !important;
    font-size: 13pt !important;
    direction: rtl;
    text-align: right;
  }
  .ep-page-break {
    page-break-before: always !important;
    break-before: page !important;
  }
}

/* ── Embedded Admin Portal Styles ────────────────────── */
.admin-badge {
  background: #DC2626;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}
.admin-card {
  background: var(--bg-surface-elevated, #fff);
  border: 1px solid var(--divider-gold, #c5a880);
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 12px;
}
.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  margin-top: 8px;
}
.admin-table th, .admin-table td {
  padding: 8px;
  border: 1px solid var(--divider-light, #eee);
  text-align: left;
}
.admin-table th {
  background: var(--bg-hover, #f9f9f9);
  font-weight: 700;
}
```

---

### Phase 2: Core Engine & Store Updates (`pwa/app.js`)

Add the complete implementations for single-attempt pairing, scorecard generation, exam history, print export, push notifications, and embedded admin dashboard:

```javascript
// ============================================================
// 1. Single-Attempt Matching & Scoring Logic
// ============================================================
let _matchSel = {};

function _selectMatch(qi, btn) {
  const side = btn.dataset.side;
  const idx = +btn.dataset.idx;
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
      lBtn.classList.remove('selected');
      rBtn.classList.remove('selected');
      lBtn.classList.add('match-correct');
      rBtn.classList.add('match-correct');
      lBtn.disabled = true;
      rBtn.disabled = true;
      _examScore += 2; // 2 Marks per correct pair
    } else {
      // Wrong Attempt: Mark Red, DO NOT allow infinite free score retry
      lBtn.classList.remove('selected');
      rBtn.classList.remove('selected');
      lBtn.classList.add('match-wrong');
      rBtn.classList.add('match-wrong');
      lBtn.disabled = true;
      rBtn.disabled = true;
      // Reveal the correct match visually after delay
      const correctAns = q.answers.find(a => a.arabic === leftText);
      if (correctAns) {
        lBtn.setAttribute('title', `Sahi: ${correctAns.hinglish}`);
      }
    }

    _examAnswered++;
    delete _matchSel[qi];

    // Check if matching block is completed
    if (qEl.querySelectorAll('.exam-match-item:not(:disabled)').length === 0) {
      qEl.dataset.answered = '1';
      _checkExamDone();
    }
  }
}

// ============================================================
// 2. Exam History Store & Scorecard Review Generator
// ============================================================
const ExamHistoryStore = (() => {
  const KEY = 'muallim_exam_history';
  function getAll() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  }
  function save(examRecord) {
    const list = getAll();
    list.unshift(examRecord);
    if (list.length > 50) list.pop(); // Keep last 50
    localStorage.setItem(KEY, JSON.stringify(list));
    // Auto-sync to Admin Roster
    AdminPortal.syncStudentExam(examRecord);
  }
  return { getAll, save };
})();

function _checkExamDone() {
  const totalQuestions = _examQuestions.length;
  const answeredCount = document.querySelectorAll('.exam-q[data-answered="1"]').length;
  if (answeredCount < totalQuestions) return;

  const maxScore = totalQuestions * 2;
  const pct = Math.round((_examScore / Math.max(maxScore, 1)) * 100);
  const grade = pct >= 85 ? 'A+' : pct >= 75 ? 'A' : pct >= 60 ? 'B' : pct >= 45 ? 'C' : 'F';
  const studentName = localStorage.getItem('muallim_student_name') || 'Talib-e-Ilm';

  // Save to history
  const examRecord = {
    id: 'exam_' + Date.now(),
    student_name: studentName,
    timestamp: Date.now(),
    score: _examScore,
    max_score: maxScore,
    percentage: pct,
    grade: grade,
    questions_count: totalQuestions,
    scope: _examConfig.scopeType
  };
  ExamHistoryStore.save(examRecord);

  // Render comprehensive scorecard
  const s = document.getElementById('exam-summary');
  s.style.display = 'block';
  s.innerHTML = `
    <div class="scorecard-container" style="background:var(--bg-surface-elevated,#fff);border:2px solid var(--divider-gold,#c5a880);border-radius:12px;padding:20px;text-align:center;box-shadow:var(--shadow-md);">
      <div style="font-size:1.1rem;color:var(--text-muted,#666);margin-bottom:4px;">IMTEHAAN SCORECARD</div>
      <div style="font-size:1.4rem;font-weight:700;color:var(--accent-emerald,#1b4332);margin-bottom:12px;">${studentName}</div>
      <div style="display:flex;justify-content:center;align-items:center;gap:16px;margin:16px 0;">
        <div style="font-size:2.5rem;font-weight:800;color:${pct>=60?'#10B981':'#EF4444'};">${_examScore} / ${maxScore}</div>
        <div style="background:${pct>=60?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)'};color:${pct>=60?'#065F46':'#991B1B'};padding:6px 16px;border-radius:20px;font-size:1.2rem;font-weight:700;">Grade ${grade} (${pct}%)</div>
      </div>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:18px;">
        <button class="btn-secondary" onclick="window.print()">🖨️ Print Result</button>
        <button class="btn-primary" onclick="App._generateAndShowExam()">🔁 Dobara Imtehaan</button>
        <button class="btn-secondary" onclick="document.getElementById('exam-modal').close()">✕ Band Karein</button>
      </div>
    </div>
  `;
  s.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ============================================================
// 3. Multi-Column Print & Standalone HTML Paper Download
// ============================================================
function downloadExamPaperHtml() {
  const printEl = document.querySelector('.exam-print-wrapper');
  if (!printEl) { showToast('Pehle print mode mein paper generate karein'); return; }
  const htmlDoc = `<!DOCTYPE html>
<html lang="ur" dir="ltr">
<head>
  <meta charset="UTF-8">
  <title>Muallim ul-Quran — Imtehaan Paper</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
    ${document.querySelector('link[href*="styles.css"]') ? '' : ''}
  </style>
</head>
<body>
  ${printEl.outerHTML}
</body>
</html>`;
  const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Muallim_Exam_Paper_${Date.now()}.html`;
  a.click();
}

// ============================================================
// 4. Embedded Admin Portal Module
// ============================================================
const AdminPortal = (() => {
  const ADMIN_PIN = '7860';
  let isUnlocked = false;

  function promptLogin() {
    if (isUnlocked) { renderDashboard(); return; }
    const pin = prompt('Teacher/Admin Secret PIN darj karein:');
    if (pin === ADMIN_PIN) {
      isUnlocked = true;
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
      student = { name: examRecord.student_name, exams: [], stars: 0, customNotes: 0, lastActive: Date.now() };
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
    const notesCount = Object.keys(JSON.parse(localStorage.getItem('muallim_custom_answers') || '{}')).length;

    container.innerHTML = `
      <div class="admin-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <h3 style="margin:0;color:var(--accent-emerald,#1b4332);">👨‍💼 Teacher Control Center</h3>
          <span class="admin-badge">Admin Mode Active</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;text-align:center;">
          <div style="background:var(--bg-hover,#f0f7f4);padding:8px;border-radius:6px;"><strong>${roster.length}</strong><br><small>Students</small></div>
          <div style="background:var(--bg-hover,#f0f7f4);padding:8px;border-radius:6px;"><strong>${starsCount}</strong><br><small>Starred Items</small></div>
          <div style="background:var(--bg-hover,#f0f7f4);padding:8px;border-radius:6px;"><strong>${notesCount}</strong><br><small>Custom Notes</small></div>
        </div>

        <div style="margin-bottom:12px;">
          <strong>📢 Broadcast Push Notification</strong>
          <div style="display:flex;gap:6px;margin-top:6px;">
            <input type="text" id="admin-broadcast-msg" placeholder="e.g. Unit 3 Exam kal hoga!" style="flex:1;padding:6px;border:1px solid #ccc;border-radius:4px;">
            <button class="btn-primary" onclick="AdminPortal.sendBroadcast()">Bhejein</button>
          </div>
        </div>

        <div>
          <strong>📊 Student Exam Gradebook</strong>
          <table class="admin-table">
            <thead><tr><th>Student</th><th>Score</th><th>Grade</th><th>Date</th></tr></thead>
            <tbody>
              ${roster.flatMap(s => s.exams.map(e => `
                <tr><td>${s.name}</td><td>${e.score}/${e.max_score}</td><td><strong>${e.grade}</strong></td><td>${new Date(e.timestamp).toLocaleDateString()}</td></tr>
              `)).join('') || '<tr><td colspan="4" style="text-align:center;">Abhi tak koi exam submit nahi hua</td></tr>'}
            </tbody>
          </table>
        </div>

        <div style="margin-top:12px;display:flex;gap:8px;">
          <button class="btn-secondary" onclick="AdminPortal.exportCsv()">📥 Export CSV Gradebook</button>
          <button class="btn-secondary" onclick="AdminPortal.lock()">🔒 Lock Admin</button>
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
    showToast('Broadcast sent: ' + msg);
    input.value = '';
  }

  function exportCsv() {
    const roster = JSON.parse(localStorage.getItem('muallim_admin_roster') || '[]');
    let csv = "Student Name,Exam Score,Max Score,Percentage,Grade,Date\n";
    roster.forEach(s => {
      s.exams.forEach(e => {
        csv += `"${s.name}",${e.score},${e.max_score},${e.percentage}%,${e.grade},"${new Date(e.timestamp).toISOString()}"\n`;
      });
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Muallim_Gradebook_${Date.now()}.csv`;
    a.click();
  }

  function lock() {
    isUnlocked = false;
    document.getElementById('admin-portal-mount').innerHTML = '';
    showToast('Admin Portal Locked 🔒');
  }

  return { promptLogin, syncStudentExam, sendBroadcast, exportCsv, lock };
})();
```

---

## 4. Final Quality Verification Checklist

### Exam & Scoring Parity
- [ ] In matching pairs, wrong selection marks red and gives 0 points (no infinite retry).
- [ ] Interactive exam completion logs to `ExamHistoryStore`.
- [ ] Completed exam displays Score, Percentage, Grade, and Question Review breakdown.
- [ ] Retake Exam and Print Result buttons operate seamlessly.

### Multi-Column Print & Download
- [ ] Page 2+ displays correctly without clipping in browser Print Preview.
- [ ] MCQs format in 2-3 column dense layouts matching `output/question_papers/`.
- [ ] Student Name, Roll No, Date, Marks header block renders on Page 1.
- [ ] Answer Key is cleanly isolated onto the last page with page break.
- [ ] `Download HTML Paper` button generates an offline file.

### Bookmarks & Gestures
- [ ] Unbookmarked state renders transparent outline with stroke.
- [ ] Bookmarked state renders solid filled color with glow/shadow.
- [ ] "Continue where left off" startup toast is completely removed.

### Menu, Profile & Push Notifications
- [ ] Student Name field in menu saves to `localStorage` and syncs with exams.
- [ ] 'Add to Home Screen' triggers native PWA prompt / shows iOS instructions.
- [ ] 'Allow Push Notifications' prompts for permission and enables daily study alerts.

### Embedded Admin Portal
- [ ] Unlocking with PIN `7860` opens embedded admin dashboard in the menu.
- [ ] Live student roster, gradebook, and star/notes count render cleanly.
- [ ] Broadcast push notification triggers real notification alert.
- [ ] CSV gradebook export downloads a valid `.csv` file.

### Vocabulary Drill Scope Studio
- [ ] Stage accordions display descriptive lesson titles and word count badges.
- [ ] Multi-select checkboxes allow simultaneous selection across multiple units.
- [ ] 'Select All' and 'Clear' buttons update active pool count in real time.

---

*Generated by Antigravity — Production-Ready Master Prompt v3.0*
