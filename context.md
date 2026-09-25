# Muallim ul-Qur'an PWA — Project Context (v2.0.0)

> **For new AI chat sessions.** Read this file FIRST, then read `SKILL.md`, then proceed.

---

## 1. Project Overview

**Muallim ul-Qur'an** is an interactive, offline-first Progressive Web App (PWA) that presents an Arabic Qur'anic vocabulary textbook translated into Roman Urdu (Hinglish). The textbook consists of **7 Units** containing **114 lessons** (104 populated + 10 template chapters). Students can read lessons, star vocabulary, record personal notes/translations, drill flashcards, take self-practice or teacher-assigned exams, and track study time.

- **Live PWA App**: https://nomaanc.github.io/muallim/
- **Admin Dashboard**: https://nomaanc.github.io/muallim/admin.html
- **GitHub Repository**: https://github.com/nomaanc/muallim

---

## 2. Architecture (Modular v2.0.0)

The application was modularized from a 4.2 MB monolithic file into a clean, lazy-loaded production architecture in September 2026:

| File / Folder | Role & Details |
|---|---|
| `index.html` | **Slim HTML shell (~404 lines)**. Contains head meta, early zero-FOUC theme script, app header, lesson content mount, all 10 native `<dialog>` modals, and `#settings-popover`. Zero inline book data. |
| `css/styles.css` | Extracted standalone styling (~978 KB). Supports Parchment (light) and Night Dark themes, CSS variables, responsive typography, popovers, dialogs, and animations. |
| `js/app.js` | Core application logic (~135 KB). Encapsulated in an IIFE and exported to `window.App`. Handles data loading, DOM rendering, star toggling, custom translations, search, drill, exams, Firebase integration, and session time tracking. |
| `data/metadata.json` | Index of all 7 units, lesson IDs, titles, and lesson counts (~10 KB) loaded on application boot. Unit 4 has 17 lessons. |
| `data/unit1.json` – `unit7.json` | On-demand lazy-loaded unit datasets (332 KB – 644 KB each). Cleaned of all QQ1 exercise headers and question blanks; 100,115 Arabic harakat 100% preserved. |
| `data/search-index.json` | Dedicated multi-dimensional search index (~800 KB, 5,928 entries) mapping Arabic words with harakat, Roman transliteration, English meanings, and root letters. |
| `admin.html` | **Standalone Admin Dashboard**. Served at `/admin.html`. Equipped with Firebase Auth guard, Overview analytics, Students progress dossier, Exam results & submissions manager, Broadcast composer, and User management. |
| `sw.js` | Service Worker (v2.1.0) with Cache-First strategy for static assets and on-demand caching for `data/unit*.json` and `data/search-index.json`. |
| `docs/documentation.html` | Comprehensive developer and architecture documentation page. |

---

## 3. Key DOM Elements & Modals (`index.html`)

### Modals (`<dialog>` elements)
- `#lesson-picker-modal`: Unit and lesson selector grid.
- `#spinner-modal`: Vocabulary flashcard drill.
- `#custom-answers-modal`: "My Answers" personal translation viewer & search.
- `#favs-modal`: Starred vocabulary words and verses list.
- `#search-modal`: Real-time full-text search across all 114 lessons.
- `#custom-edit-modal`: Pencil icon modal to edit/save a personal translation note.
- `#export-modal`: Export data backup (starred items and/or custom answers) to JSON.
- `#exam-modal`: Interactive exam engine (Practice Exam & Ustaad ki Exam).
- `#onboard-modal`: Interactive student onboarding flow.
- `#login-modal`: Firebase Auth email/password login modal with guest fallback.

### Navigation & Menus
- `#settings-popover`: Native HTML Popover API hamburger menu with organized sections:
  - **QUICK ACTIONS** (2-col grid): Search, Drill, Starred, My Answers
  - **EXAM**: Practice Exam, Ustaad ki Exam
  - **APPEARANCE**: Theme toggle, Mode toggle, Speech Speed, Arabic Font Size
  - **DATA**: Export JSON, Import JSON
  - **ACCOUNT**: Guest / Student / Admin states, Admin Dashboard link (`./admin.html`)
  - **NOTIFICATIONS**: Push notification permission request
  - **Version Footer**: `Muallim v2.0.0`
- `#admin-nav-tab`: Fixed floating admin pill button (visible only when logged in as admin).

---

## 4. Firebase Configuration & Credentials

Embedded in `index.html` and `admin.html`:
```javascript
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAjBnuLSADlXBZ7OY7daQ7mOta3VaHXVNg",
  authDomain: "muallim-123.firebaseapp.com",
  projectId: "muallim-123",
  storageBucket: "muallim-123.firebasestorage.app",
  messagingSenderId: "226964645326",
  appId: "1:226964645326:web:0a219c95dad277b4cd379f"
};
```

- **Project ID**: `muallim-123`
- **Admin Account**: `nomaanaisub@gmail.com`
- **Admin Login**: `ustaad@muallim.app` / `Ustaad123`
- **Admin UID**: `ME1GchntFqZDLhs23DKzarZE6QC2`
- **Firestore Document**: `/users/ME1GchntFqZDLhs23DKzarZE6QC2` has `{ role: "admin", name: "Ustaad" }`

---

## 5. Firestore Collections Schema

```
/users/{uid}
  name: string
  email: string
  role: "admin" | "student"
  createdAt: timestamp

/user_data/{uid}
  starredItems: { [itemKey]: boolean }
  customTranslations: { [itemKey]: string }
  examResults: [ { date, score, total, correct, grade, isUstaadExam, examTitle, scope } ]
  lastBookmark: { lessonKey, itemKey, stage, lesson }
  lessonTime: { [lessonKey]: number }   // Seconds spent per lesson (incremented via FieldValue.increment)
  weakWords: { [cleanKey]: { arabic: string, count: number, lesson: string } }

/pushed_exams/{examId}
  title: string
  createdAt: timestamp
  createdBy: string (uid)
  scope: { unitKeys: string[], lessonKeys: string[] }
  status: "active" | "expired"
  expiresAt: timestamp (optional)

/exam_results/{examId}/submissions/{uid}
  uid: string
  name: string
  email: string
  score: number (percentage)
  grade: string ("A+", "A", "B", "C", "D", "F")
  correct: number
  total: number
  submittedAt: timestamp
  examId: string
  examTitle: string

/muallim_broadcasts/{broadcastId}
  message: string
  sentAt: timestamp
  createdAt: timestamp
  sentBy: string
  authorUid: string

/muallim_students/{deviceId}
  name: string
  deviceId: string
  joinedAt: timestamp
```

---

## 6. LocalStorage Keys

| Key | Format | Purpose |
|---|---|---|
| `muallim_custom_translations` | `{ [itemKey]: string }` | User's personal translations/notes |
| `muallim_starred` | `{ [itemKey]: boolean }` | Starred items lookup |
| `muallim_favourites` | `[ { arabic, hinglish, key, stage, lesson } ]` | Starred items array for drill |
| `muallim_bookmark` | `{ lessonKey, itemId, stage, lesson }` | Active bookmark position |
| `muallim_theme` | `'light' | 'dark'` | Active theme |
| `muallim_mode` | `'teacher' | 'student'` | Display mode (student hides Hinglish) |
| `muallim_lesson_time` | `{ [lessonKey]: number }` | Cumulative study seconds spent per lesson |
| `muallim_weak_words` | `{ [arabic]: { count, lesson, arabic } }` | Repeatedly missed exam vocabulary words |
| `muallim_ar_scale` | `'26'` (number string) | Arabic font size scale (px) |
| `muallim_lat_scale` | `'15'` (number string) | Hinglish font size scale (px) |

---

## 7. Non-Negotiable Invariants

1. **"Exercise" stays as "Exercise"** — NEVER translate to "Mashq" in Hinglish.
2. **Stage -> Unit EVERYWHERE in UI** — Data JSON retains `stage_id` internally, but UI always renders "Unit".
3. **Arabic Harakat (Diacritics)** — NEVER strip, modify, or normalize Arabic vowels (`[\u064B-\u0652]`). All 100,115 vowels must be preserved.
4. **Hinglish Syntax** — Follows Subject-Object-Verb (SOV) order matching spoken Urdu.
5. **No npm / bundlers** — Vanilla JS, HTML, CSS only. Directly deployable on GitHub Pages.
6. **Windows PowerShell** — Use `;` instead of `&&`. Set `$env:PYTHONIOENCODING='utf-8'` before running Python scripts.

---

## 8. Development Phases Summary

- **Phase 1 (Foundation)**: Split monolithic 4.2 MB index.html into `index.html` shell (404 lines), `css/styles.css`, `js/app.js`, `data/metadata.json`, and `data/unit1-7.json`.
- **Phase 2 (Data Cleanup & Code Fixes)**: Permanently removed 72 `exercise_header`, 114 `qn_label`, and 92 exercise blank sections from `data/unit*.json`. Fixed My Answers modal lookup and star toggling.
- **Phase 3 (UX Overhaul)**: Redesigned hamburger popover with clean section grouping, zero-FOUC dark mode initializer in `<head>`, accessibility attributes, and `Muallim v2.0.0` footer.
- **Phase 4 (Admin Dashboard & Analytics)**: Created `admin.html` (1,534 lines) with Firebase Auth guard, overview statistics, sortable students table with expandable detail rows, exam creator, broadcast manager, and user management. Added session study time tracking (`flushSessionTime`) to `js/app.js`.
