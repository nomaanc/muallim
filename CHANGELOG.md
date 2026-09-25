# Changelog — Muallim ul-Qur'an PWA

All notable changes to the Muallim ul-Qur'an PWA are documented in this file.

---

## [2.1.0] — 2026-09-25

### 🌟 Ustaad ki Exam, Analytics & Multi-Dimensional Search Update

#### 1. Ustaad ki Exam & Submissions Visibility (Admin & Student)
- **Exam Results Architecture**: Submissions record `isUstaadExam`, `pushedExamId`, `examTitle`, `score` (percentage), `grade`, `correct`, `total`, and timestamp.
- **Admin Exam Scores Viewer**: Added **"Scores / Submissions"** column to `admin.html` with expandable details row showing:
  - Aggregate statistics: Total Submissions, Average Score (%), Pass Rate (≥50%), Highest Score.
  - Submissions table: Student Name, Email / UID, Score %, Grade badge, Questions correct/total, and Submitted Date.
- **Student Exam Flow**: Pushed official Ustaad exams display an official banner in the exam setup view, filter questions strictly by the pushed scope, and automatically push submissions to Firestore `/exam_results/{examId}/submissions/{uid}` and sync to `user_data/{uid}.examHistory`.

#### 2. Deep Student Analytics (`admin.html`)
- **Lesson Study Time**: Displays active study duration per lesson in minutes (`S1L1: 15m`, `S1L2: 20m`...) calculated from Firestore `user_data/{uid}.lessonTime`.
- **Weak / Repeatedly Failed Words**: Added auto-tracking on wrong exam attempts to Firestore `user_data/{uid}.weakWords`. Admin view highlights repeated mistake words in Arabic script with failure count badges (`❌ 3x`) and lesson tags.
- **Exam Breakdown**: Clear distinction between official Ustaad Exams and self-practice attempts with grade badges and dates.
- **Starred Vocabulary & Custom Answers**: Visual badges for starred Arabic vocabulary and student-submitted custom translation corrections.

#### 3. Menu Refactor & User Management
- **Hamburger Menu Cleanup**: Removed Password and Logout buttons from the student hamburger menu in `index.html`. Replaced with a subtle "Sign Out" link.
- **Admin Settings Hub**: Centralized admin password changes and logout in `admin.html` Settings.
- **Manual Student Creation**: Added "＋ Add Student" modal in User Management allowing admins to register students with custom email and password via an isolated secondary Firebase App instance.
- **Password Reset / Change**: Added "🔑 Change Pass" action per user with support for Firebase Cloud Functions (`setStudentPassword`) and fallback password reset emails.

#### 4. Overview Section Deep Links
- **Interactive Stat Cards**: Clicking "Total Users", "Active (7d)", "Exam Results", or "Broadcasts" immediately navigates to their respective admin sections.
- **Direct Activity Navigation**: Recent activity feed items are clickable (`jumpToStudentDetail`), opening and scrolling directly to that student's expanded analytics dossier.

#### 5. Multi-Dimensional Arabic Search & Universal Typography
- **Dedicated Search Index (`data/search-index.json`)**: Built a deduplicated corpus of 5,928 verified Quranic vocabulary entries mapping Arabic with preserved harakat, Roman transliteration (e.g. *Ash-Shams*), English meaning (*Sun*), and root letters.
- **5-Way Search Matching**: Search query matches across Arabic (with/without diacritics), Transliteration, English, Root, and Hinglish.
- **Universal Arabic Font Slider**: Font scale slider (`--arabic-scale`) in hamburger menu applies consistently across workbook lessons, search results, drill cards, exam questions, and exam review.

#### 6. Unit 4 Consolidation & Integrity
- **Merged Lesson 18 into 17**: S4L18 (Page 39) merged into S4L17 as section `s2`. Updated Unit 4 count from 18 to 17 in `data/unit4.json` and `data/metadata.json`. Image renamed to `images/S4L17p2.png`.
- **Transparent Key Migration**: Implemented `migrateS4L18Keys()` in `js/app.js` to migrate legacy `S4L18_*` keys to `S4L17_*` in bookmarks, stars, and custom answers.
- **Firestore Rules & Broadcast Fix**: Fixed broadcast timestamp synchronization (`sentAt` & `createdAt`) and deployed Firestore rules supporting submissions subcollection and admin delete.

---

## [2.0.0] — 2026-09-18

### 🚀 Major Architectural Transformation (Phases 1–4)

#### Phase 1: Modular Split & Foundation
- **Slim Shell**: Split 4.2 MB monolithic `index.html` (76,889 lines) into a lean HTML shell of **404 lines** (`index.html`).
- **Separated Assets**: Extracted CSS into `css/styles.css` (978 KB) and logic into `js/app.js` (135 KB).
- **Lazy Loading**: Decomposed book data into `data/metadata.json` (10 KB) and 7 on-demand unit data files (`data/unit1.json` through `data/unit7.json`). Units 2–7 load asynchronously upon navigation.
- **Service Worker v2**: Updated `sw.js` to cache core modular assets with dynamic caching for unit JSON payloads.
- **Repository Hygiene**: Cleaned obsolete files (`final-book-7units.html`, `pwa_book_data.js`, `book_data.js`, `book_data.json`), added `.gitignore`, and tagged `v1.0.0`.

#### Phase 2: Data Cleanup & Core Bug Fixes
- **QQ1 Exercise Removal**: Permanently eliminated 72 `exercise_header`, 114 `qn_label`, and 92 `two_col_numbered_list` exercise blanks from `data/unit*.json`.
- **Diacritics Integrity**: 100% preserved **100,115 Arabic harakat** without unicode corruption or ASCII mangling.
- **"My Answers" Fixes**:
  - Standardized storage key on `muallim_custom_translations` with automatic backwards-compatible migration from legacy `muallim_custom_answers`.
  - Fixed unit/lesson lookups (`Stage${stage}`, `l.lesson_id`, and `sec.data?.items` with shifted index fallback).
  - Added delete button (trash icon), real-time search filter, and Hinglish empty state (*"Aapne abhi koi custom jawab nahi save kiya."*).
  - Added `_customRenderId` to prevent async search render race conditions.
- **Star Toggle**:
  - Added active gold visual state with drop-shadow glow and `aria-pressed` dynamic state.
  - Fixed item attribution to parse stage and lesson directly from `S${stage}L${lesson}` keys.

#### Phase 3: UX Overhaul & Hamburger Redesign
- **Structured Sections in `#settings-popover`**:
  - **QUICK ACTIONS** (2-column responsive grid): Search, Drill, Starred, My Answers.
  - **EXAM**: Practice Exam, Ustaad ki Exam.
  - **APPEARANCE**: Theme toggle (Parchment / Night Dark), Mode toggle (Teacher / Student Blank), Speech Speed slider, Arabic Font Size slider.
  - **DATA**: Export JSON, Import JSON.
  - **ACCOUNT**: Dynamic Guest / Student / Admin states with Login, Password change, Logout, and Admin Dashboard link.
  - **NOTIFICATIONS**: Push notification permission request.
  - **Footer**: `Muallim v2.0.0` version display.
- **Zero-FOUC Theming**: Added early theme and mode evaluator script in `<head>` to prevent flash of unstyled content.
- **Accessibility & Scroll**: Added `role="dialog"`, `aria-modal="true"`, `aria-label="Settings Menu"`, Escape key dismissal, and `overflow-y: auto; max-height: calc(100dvh - 80px);`.
- **Deprecated Cleanup**: Removed obsolete "Configure Firebase", "MY NAME" text input, broadcast textarea, and student mount from hamburger menu.

#### Phase 4: Dedicated Admin Dashboard & Analytics
- **Standalone `admin.html`**: Created dedicated 1,534-line admin portal at `/admin.html` with Firebase Auth guard (auto-redirects unauthorized users).
- **Overview Section**: Real-time summary stat cards (total users, active students, total exams taken, broadcasts) and recent Firestore activity feed.
- **Students Analytics**: Sortable student progress table (Name, Email/UID, Role, Last Active, Stars, Custom Answers, Exam Count) with expandable detail rows showing full exam history and last bookmark.
- **Exams Manager ("Ustaad ki Exam")**: View active/expired pushed exams, delete exams, and modal to push new exams by selecting Unit 1–7 checkboxes and lesson numbers.
- **Broadcasts**: Live broadcast composer with 500-character counter and recent broadcasts history with delete capability.
- **User Management**: Table of registered users with role toggle (`student` ⇄ `admin`) and user document deletion.
- **Session Progress Tracking**: Added `_sessionStart`, `_sessionLessonKey`, and `flushSessionTime()` to `js/app.js` to track active study seconds per lesson in localStorage and Firestore `/user_data/{uid}.lessonTime.{lessonKey}`.

---

## [1.0.0] — 2026-09-18
- Pre-split legacy monolithic release (4.2 MB `index.html` with inline `window.PWA_BOOK_DATA`).
- Tagged in git as baseline before v2.0.0 refactor.
