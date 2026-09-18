---
name: muallim-pwa
description: >
  Use when building, fixing, auditing, or extending the Muallim ul-Qur'an
  PWA (v2.0.0). Covers modular architecture, lazy-loaded unit datasets,
  Firebase Auth, Firestore, exam engine, admin dashboard (admin.html),
  hamburger menu popover, custom translations, bookmarks, and all
  confirmed design decisions.
version: 2.0.0
workspace: e:\AIPROJECTS\PROJECTS\translate-hinglish-skill\pwa\
---

# Muallim ul-Qur'an PWA — Project Skill (v2.0.0)

## 1. Invariants and Non-Negotiables

- **"Exercise" stays as "Exercise"** — NEVER translate to "Mashq" in Hinglish.
- **Stage -> Unit EVERYWHERE in UI** labels (data JSON retains `stage_id` internally).
- **Arabic Harakat (diacritics)** must NEVER be stripped, modified, or corrupted.
- **Modular Architecture (v2.0.0)**:
  - `index.html` (~404 lines shell, all 10 `<dialog>` modals + `#settings-popover`).
  - `css/styles.css` (~978 KB standalone CSS).
  - `js/app.js` (~135 KB core app logic, exported to `window.App`).
  - `data/metadata.json` (lesson index and unit outlines).
  - `data/unit1.json` – `unit7.json` (lazy-loaded unit data).
  - `admin.html` (1,534 lines standalone admin dashboard).
- **PowerShell syntax**: Use `;` not `&&`. Set `$env:PYTHONIOENCODING='utf-8'` before running Python scripts.
- **No build tools**: Zero npm/Node/Vite/Webpack. Vanilla JS/CSS/HTML running directly on GitHub Pages.
- **Hinglish follows SOV syntax**: Subject-Object-Verb matching colloquial Urdu.

---

## 2. File Organization & Architecture

| Path | Purpose |
|---|---|
| `index.html` | Slim HTML host (~404 lines) with modals and zero-FOUC theme head script |
| `css/styles.css` | All styling: responsive layout, light/dark themes, dialogs, popovers |
| `js/app.js` | Modular JavaScript IIFE with async `loadLesson`, `loadMetadata`, `loadUnit`, `flushSessionTime` |
| `data/metadata.json` | Manifest of all units, lesson titles, and counts |
| `data/unit1.json` .. `unit7.json` | Cleaned unit datasets without QQ1 exercise sections |
| `admin.html` | Dedicated admin panel at `/admin.html` with Firebase Auth guard |
| `sw.js` | Service Worker caching static shell and on-demand unit data |
| `docs/documentation.html` | Developer and system documentation |
| `context.md` | Session context for AI paired development |
| `CHANGELOG.md` | Full version release history |

---

## 3. Firebase & Firestore Integration

### Configuration
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

### Credentials & Security
- Admin Login: `ustaad@muallim.app` / `Ustaad123`
- Admin UID: `ME1GchntFqZDLhs23DKzarZE6QC2`
- Firestore Document: `/users/ME1GchntFqZDLhs23DKzarZE6QC2` has `{ role: 'admin', name: 'Ustaad' }`

### Security Rules Summary
- `/users/{userId}`: User or admin read; owner update (except role); admin manage.
- `/user_data/{userId}`: User or admin read/write. Stores `starredItems`, `customTranslations`, `examResults`, `lastBookmark`, and `lessonTime`.
- `/pushed_exams/{examId}`: Authenticated read; admin write.
- `/muallim_broadcasts/{broadcastId}`: Public read; authenticated create; admin manage.

---

## 4. Key LocalStorage Keys

- `muallim_custom_translations`: `{ [itemKey]: "custom text" }`
- `muallim_starred`: `{ [itemKey]: true }`
- `muallim_favourites`: `[ { arabic, hinglish, key, stage, lesson } ]`
- `muallim_bookmark`: `{ lessonKey, itemId, stage, lesson }`
- `muallim_lesson_time`: `{ [lessonKey]: seconds }`
- `muallim_theme`: `'light' | 'dark'`
- `muallim_mode`: `'teacher' | 'student'`

---

## 5. Development & Git Workflow

```powershell
# Working directory: e:\AIPROJECTS\PROJECTS\translate-hinglish-skill\pwa
# Check syntax:
node --check js/app.js

# Git workflow:
git add -A
git commit -m "feat(pwa): description of change"
git push origin main
```
