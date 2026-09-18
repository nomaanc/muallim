# Changelog — Muallim ul-Qur'an PWA

All notable changes to the Muallim ul-Qur'an PWA are documented in this file.

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
