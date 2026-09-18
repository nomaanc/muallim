# Muallim ul-Qur an PWA — Quick Context

> **For new AI chat sessions.** Read this file FIRST, then read `SKILL.md`, then proceed.

---

## Project Overview

A standalone Progressive Web App that presents an Arabic Qur an vocabulary textbook in
Hinglish (Hindi written in Roman script). The book has 7 Units (Stages), each containing
multiple lessons. Students read, star words, take exams, and track progress.

- **Live URL**: `https://nomaanc.github.io/muallim/`
- **Admin Dashboard**: `https://nomaanc.github.io/muallim/admin`
- **Repository**: `https://github.com/nomaanc/muallim`

---

## Architecture

| What | Details |
|------|---------|
| **Single-file PWA** | ALL app code lives in `pwa/index.html` (4.2 MB, ~76.9k lines) |
| **Mirror** | After every edit: `Copy-Item index.html final-book-7units.html -Force` |
| **No build tools** | Zero npm, no Vite/Webpack. PowerShell only. Edit to push to done. |
| **Git repo root** | `.git` lives inside `pwa/` — run all git commands from `pwa/` |
| **Shell** | PowerShell on Windows. Use `;` not `&&`. |
| **Firebase** | Firebase Auth + Firestore (no Realtime DB) |
| **Hosting** | GitHub Pages (static) — `pwa/` folder |

---

## Key File Map

```
pwa/
  index.html              <- Main PWA source of truth (4.2 MB, 76.9k lines)
  final-book-7units.html  <- Always kept in sync with index.html
  admin.html              <- [TODO] Admin dashboard page
  sw.js                   <- Service Worker
  manifest.json           <- PWA manifest
  firebase-messaging-sw.js
  firestore.rules         <- Deploy via: firebase deploy --only firestore:rules
  images/                 <- 465 textbook scan images
  icons/                  <- PWA icons
  docs/
    FIREBASE_SETUP.html
    documentation.html    <- [TODO] Full documentation
  third-major-prompt.md   <- Full spec for next dev session
  context.md              <- This file
  SKILL.md                <- Project-local PWA skill
```

### index.html Internal Structure (approximate line ranges)

| Section | Lines |
|---------|-------|
| CSS styles | 1 to 1,580 |
| HTML structure | 1,580 to 2,010 |
| window.PWA_BOOK_DATA JSON | 2,010 to 73,850 |
| App IIFE | 73,850 to 76,716 |
| DOMContentLoaded listeners + qb() wiring | 76,717 to 76,750 |
| Firebase dialog HTML | 76,750 to 76,890 |

---

## Firebase Config

apiKey:      AIzaSyAjBnuLSADlXBZ7OY7daQ7mOta3VaHXVNg
authDomain:  muallim-123.firebaseapp.com
projectId:   muallim-123
appId:       1:226964645326:web:0a219c95dad277b4cd379f

- Firebase account: nomaanaisub@gmail.com
- Admin login: ustaad@muallim.app / Ustaad123
- Admin UID: ME1GchntFqZDLhs23DKzarZE6QC2
- Firestore doc: /users/ME1GchntFqZDLhs23DKzarZE6QC2 has role: "admin", name: "Ustaad"

---

## Git Workflow

Working directory: e:\AIPROJECTS\PROJECTS\translate-hinglish-skill\pwa

After every change to index.html:
  Copy-Item index.html final-book-7units.html -Force
  git add -A
  git commit -m "feat(pwa): description"
  git push origin main

GitHub Pages deploys automatically within ~30 seconds.

---

## Critical Invariants (Non-Negotiable)

1. "Exercise" stays as "Exercise" - NEVER translate to "Mashq" in Hinglish
2. Stage -> Unit EVERYWHERE in UI labels (data JSON retains stage_id internally)
3. Arabic harakat (diacritics) must NEVER be stripped or altered
4. Single-file - ALL changes go in pwa/index.html, then copy to final-book-7units.html
5. PowerShell: use ; not &&, set $env:PYTHONIOENCODING='utf-8' before Python scripts
6. No build tools - zero npm/Node build step; edit HTML directly

---

## Recent Commits

8b0a871 - fix: Firebase auto-init scope bug (admin panel now works)
114e9f9 - chore: remove accidental validate.js from repo
10132d1 - fix: custom answers modal, exam label, exercise removal, PDF, bookmark scroll
d282126 - fix: sticky header, login, bookmark scroll, Stage->Unit rename
44911c6 - feat: Firebase Auth integration, embedded default config, guest mode

---

## Firebase Module Internals

- window._FA   - Firebase Auth helpers
- window._AUTH - Firebase auth instance
- window._FS   - Firestore helpers
- window._FSDB - Firestore db

Scope bug fixed (commit 8b0a871): initFirebaseOnLoad() was inside the IIFE
but called from outside. Fix: exported as App.initFirebaseOnLoad in Object.assign(App, {...}).

Role Detection Flow:
1. App.initFirebase() -> loadFirebase(config) -> sets window._FA, _AUTH, _FSDB
2. onAuthStateChanged fires
3. Fetches /users/{uid} via Firestore getDoc
4. If role === 'admin': shows #admin-nav-tab and #admin-unlocked-view

---

## Firestore Collections

/users/{uid}
  name, email, role ("admin"|"student"), createdAt

/user_data/{uid}
  starredItems: { [itemKey]: boolean }
  customTranslations: { [itemKey]: string }
  examResults: [ { date, score, total, scope, lessonKeys[] } ]
  lastBookmark: { lessonKey, itemKey }
  lessonTime: { [lessonKey]: number }

/pushed_exams/{examId}
  title, createdAt, createdBy, scope: { type, lessonKeys[] }, status

/muallim_broadcasts/{broadcastId}
  message, createdAt, authorUid

/muallim_students/{deviceId}
  name, deviceId, joinedAt

---

## PWA_BOOK_DATA Key Format

window.PWA_BOOK_DATA.stages["Stage1"]    // capital S, no underscore
window.PWA_BOOK_DATA.stages["Stage1"]["S1L5"]  // lesson key format

Custom translations stored in localStorage key: muallim_custom_translations
Key format: S{stage}L{lesson}_{type}_{index} matching data-item-id on .card-top elements

---

## Pending Major Features (from third-major-prompt.md)

P1 - Remove QQ1 exercise sections from JSON (scratch/remove_qq1_sections.py)
P1 - Fix My Answers modal (openCustomAnswersModal at ~line 74452)
P1 - Hamburger menu redesign (section groups, icons, scrollable)
P2 - Create pwa/admin.html (admin dashboard page)
P2 - Session time tracking (lessonTime in Firestore)

Read third-major-prompt.md for full specifications.
