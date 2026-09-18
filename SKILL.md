---
name: muallim-pwa
description: >
  Use when building, fixing, auditing, or extending the Muallim ul-Qur'an
  standalone PWA. Covers architecture, Firebase, exam engine, admin dashboard,
  hamburger menu, custom translations, bookmarks, starred items, and all
  confirmed design decisions. Read this AFTER context.md.
version: 1.0.0
workspace: e:\AIPROJECTS\PROJECTS\translate-hinglish-skill\pwa\
---

# Muallim ul-Qur'an PWA — Project Skill

## 1. Invariants and Non-Negotiables

- "Exercise" stays as "Exercise" — NEVER translate to "Mashq" in Hinglish
- Stage -> Unit EVERYWHERE in UI labels (data JSON retains stage_id internally)
- Arabic harakat (diacritics) must NEVER be stripped or altered
- Single-file architecture — ALL changes go in `pwa/index.html`, then:
  `Copy-Item index.html final-book-7units.html -Force`
- PowerShell: use `;` not `&&`. Set `$env:PYTHONIOENCODING='utf-8'` before Python.
- No build tools — zero npm/Node/Vite/Webpack. Edit HTML directly.
- Hinglish follows SOV syntax; zero forbidden English words except "Exercise"
- No unrequested refactors — surgical edits only
- Never rewrite the whole index.html. Use replace_file_content for targeted edits.

---

## 2. Architecture Map

### index.html Internal Structure (~76,889 lines, 4.2 MB)

| Section | Lines (approx) |
|---------|---------------|
| CSS styles (custom properties, component styles) | 1 to 1,580 |
| HTML structure (header, popovers, dialogs, modals) | 1,580 to 2,010 |
| window.PWA_BOOK_DATA JSON (inline book data) | 2,010 to 73,850 |
| App IIFE `var App = (function() {...})()` | 73,850 to 76,716 |
| DOMContentLoaded listeners + qb() button wiring | 76,717 to 76,750 |
| Firebase dialog HTML (#login-modal) | 76,750 to 76,890 |

### Key DOM Elements

| ID | Purpose |
|----|---------|
| `#settings-popover` | Native HTML Popover API (hamburger menu) |
| `#admin-access-group` | Account and Teacher Access section in popover |
| `#auth-logged-out-view` | Shown when not logged in |
| `#auth-logged-in-view` | Shown when logged in (default display:none) |
| `#admin-unlocked-view` | Admin-specific panel (default display:none) |
| `#admin-nav-tab` | Fixed floating button bottom-right (default display:none) |
| `#login-modal` | Native <dialog> for login form |
| `#custom-answers-modal` | Native <dialog> for My Answers |
| `id="menu-btn-custom"` | My Answers hamburger button |
| `id="menu-btn-search"` | Search hamburger button |
| `id="menu-btn-drill"` | Drill hamburger button |
| `id="menu-btn-exam"` | Exam hamburger button |

### Other Files

| File | Purpose |
|------|---------|
| `final-book-7units.html` | Mirror of index.html — always sync after edits |
| `admin.html` | [TODO] Separate admin dashboard page |
| `sw.js` | Service Worker |
| `firestore.rules` | Firestore security rules (156 lines) |
| `firebase-messaging-sw.js` | FCM push notification handler |
| `images/` | 465 textbook scan images |

---

## 3. Firebase Module

### Config (embedded in index.html)

```javascript
const FIREBASE_CONFIG = {
  apiKey:      "AIzaSyAjBnuLSADlXBZ7OY7daQ7mOta3VaHXVNg",
  authDomain:  "muallim-123.firebaseapp.com",
  projectId:   "muallim-123",
  appId:       "1:226964645326:web:0a219c95dad277b4cd379f"
};
```

### Firebase Globals

- `window._FA`   — Firebase Auth helpers (set inside `loadFirebase()`)
- `window._AUTH` — Firebase auth instance
- `window._FS`   — Firestore helpers
- `window._FSDB` — Firestore db instance

### Critical Scope Bug (FIXED — commit 8b0a871)

`initFirebaseOnLoad()` was defined INSIDE the IIFE but called from outside.
Fix applied:
1. Added `initFirebaseOnLoad,` to `Object.assign(App, {...})` — exports it as `App.initFirebaseOnLoad`
2. DOMContentLoaded now calls `App.initFirebaseOnLoad()` (not bare `initFirebaseOnLoad()`)

```
IIFE boundary:
--- INSIDE (lines ~73850-76716) ---
function initFirebaseOnLoad() { ... }
Object.assign(App, { initFirebaseOnLoad, ... })  // EXPORTED
--- OUTSIDE (lines 76717+) ---
DOMContentLoaded: App.initFirebaseOnLoad()        // WORKS
```

### Role Detection Flow

1. `App.initFirebase()` -> `loadFirebase(config)` -> sets `window._FA`, `_AUTH`, `_FSDB`
2. `onAuthStateChanged` fires
3. Fetches `/users/{uid}` via Firestore `getDoc`
4. If `role === 'admin'`: calls `_showAdminTab()` (reveals `#admin-nav-tab`) and `_updateAccountUI()` (reveals `#admin-unlocked-view`)

### Firestore Security Rules (deployed)

- `/users/{userId}`: owner or admin read; admin create/delete; owner update (except role)
- `/user_data/{userId}`: owner or admin read/write
- `/pushed_exams/{examId}`: any authenticated user read; admin write only
- `/muallim_students/{deviceId}`: public read; write with valid fields
- `/muallim_broadcasts/{broadcastId}`: public read; authenticated create

---

## 4. Data Format

### PWA_BOOK_DATA Key Format

```javascript
window.PWA_BOOK_DATA.stages["Stage1"]        // capital S, no underscore
window.PWA_BOOK_DATA.stages["Stage1"]["S1L5"]  // lesson key
```

Stage keys: "Stage1" through "Stage7"
Lesson keys: "S1L1", "S1L2"... "S7L10" (no zero-padding)

### Section Types (within lesson data)

| Type | Description |
|------|-------------|
| `two_col_text` | Two column: Arabic left, Hinglish right |
| `two_col_numbered_list` | Numbered list with Arabic/Hinglish pairs |
| `section_header` | Bold section title |
| `exercise_header` | Exercise section title (to be removed — QQ1) |
| `qn_label` | Question label for exercise (to be removed — QQ1) |
| `verse_block` | Quranic verse with translation |
| `grammar_note` | Highlighted grammar explanation |
| `table_section` | Table layout |

### data-item-id Format

Added to `.card-top` elements in `two_col_numbered_list` renderer:
`S{stage}L{lesson}_{type}_{index}`

Example: `S1L5_num_3`

### Custom Translations (localStorage)

Key: `muallim_custom_translations`
Value: `{ "S1L5_num_3": "my custom text", "S2L7_num_12": "another" }`

### Starred Items (localStorage)

Key: `muallim_favourites`
Value: Array of item objects `[{ arabic, hinglish, key, lesson }, ...]`

---

## 5. Feature Inventory

### Currently Working Features

- Full 7-unit Arabic vocabulary book rendering
- Hinglish translations with custom override (pencil icon)
- Star/favourite items with star button
- Vocabulary Drill (starred + custom lesson selection)
- Full-text search across book data
- Bookmarks with scroll-to-card and highlight flash
- Exam engine (self-practice mode, scope selector)
- Firebase Auth login (email/password)
- Admin role detection (role in Firestore /users/{uid})
- Admin nav tab (floating button when admin logged in)
- Dark/light/parchment theme toggle
- Teacher/Student mode toggle (shows/hides Hinglish)
- Arabic text-to-speech (Web Speech API)
- Service Worker offline caching
- PWA installable (manifest.json)
- PDF export for exam
- My Answers modal (custom translations browser)

### Known Broken / Partial Features

- Admin dashboard (admin.html doesn't exist yet)
- "My Answers" modal may not correctly group by lesson
- QQ1 exercise sections still in JSON (hidden at render, not deleted)
- Hamburger menu not scrollable on small screens

---

## 6. Confirmed Design Decisions

All decisions confirmed via Grill-Me session in Sept 2026:

1. "Exercise" stays as "Exercise" — never translate to Mashq
2. Stage -> Unit EVERYWHERE in UI (data JSON retains stage_id internally)
3. No build tools — zero npm, no Vite/Webpack; all code in index.html; PowerShell only
4. GitHub Pages (static) — admin.html at /admin, main app at /
5. Bookmark scrolls to exact card with highlight flash animation
6. Sticky header using overflow-x: clip
7. "Ustaad ki Exam" button = admin-pushed exams only; regular Exam = self-practice
8. QQ1 sections removed permanently from book data JSON (not just hidden at render)
9. Admin panel = separate admin.html page (not inline Firebase panel in hamburger)
10. Name auto-fills from Firebase login — no manual MY NAME input in hamburger
11. No "Configure Firebase" button in hamburger menu (removed completely)
12. Arabic harakat must never be stripped or altered
13. Hinglish follows SOV syntax; zero forbidden English words except "Exercise"

Additional hamburger menu decisions:
- Keep slide-from-right animation
- Add section grouping: QUICK ACTIONS, EXAM, APPEARANCE, DATA, ACCOUNT, NOTIFICATIONS
- 2-column CSS grid for Quick Actions
- Scrollable panel: overflow-y: auto; max-height: 100vh
- Remove broadcast textarea from hamburger (moved to admin.html)
- Admin Panel button links to ./admin.html

---

## 7. Git Workflow

```powershell
# Working directory: e:\AIPROJECTS\PROJECTS\translate-hinglish-skill\pwa
# After every edit to index.html:
Copy-Item index.html final-book-7units.html -Force
git add -A
git commit -m "type(scope): description"
git push origin main
```

Commit type conventions: feat, fix, refactor, docs, test, chore, perf

GitHub Pages deploys automatically from main branch.

---

## 8. Known Bugs Already Fixed

| Commit | Fix |
|--------|-----|
| `8b0a871` | Firebase auto-init scope bug — `initFirebaseOnLoad` was inside IIFE but called outside |
| `114e9f9` | Removed accidentally committed `validate.js` scratch file |
| `10132d1` | Custom answers modal HTML added; `openCustomAnswersModal` exported; My Answers button wired; duplicate `bmSvgHtml` removed; Exercise sections filtered at forEach level |
| `d282126` | Sticky header (overflow-x: clip); Stage->Unit rename; Bookmark SVG; Custom answers skeleton |
| `44911c6` | Firebase Auth integration; embedded default config; guest mode; account controls |

---

## 9. Pending Features

### P1 — High Priority

**Remove QQ1 sections from JSON** (Req 4 in third-major-prompt.md)
- Write Python script: `scratch/remove_qq1_sections.py`
- Filter out: `qn_label` type, `exercise_header` type, following exercise `two_col_numbered_list` blocks
- The JS render-time filter already exists (~line 74129-74134) — this is the permanent data cleanup

**Fix My Answers modal** (Req 3)
- Verify `openCustomAnswersModal` reads `lsGet('muallim_custom_translations', {})`
- Verify items grouped by lesson correctly
- Add delete/revert button per entry
- Add search input to filter

**Hamburger Menu Redesign** (Req 2)
- New structure: QUICK ACTIONS | EXAM | APPEARANCE | DATA | ACCOUNT | NOTIFICATIONS
- Remove: Configure Firebase, MY NAME input, broadcast textarea
- Add: section labels, icons, scrollable panel, 2-col grid for Quick Actions
- Rename exam button; add "Ustaad ki Exam" as separate button

### P2 — Medium Priority

**Create admin.html** (Req 1)
- Sections: Student Analytics, Admin Exams, Broadcasts, Student Management
- Auth check on load; redirect if not admin
- Read from Firestore: /users/, /user_data/, /pushed_exams/

**Session time tracking** (Req 7.1)
- sessionTracker in index.html: record start/end time per lesson
- Append to Firestore /user_data/{uid}.lessonTime.{lessonKey}

### P3 — Nice to Have

- Student exam result history (My Results section)
- Firebase Cloud Messaging for exam push notifications
- PWA install prompt (beforeinstallprompt)
- Lesson completion indicators (checkmark badges)
- Dark mode persistence verification

---

## 10. Node.js Syntax Validation Method

`node --check` does NOT work on `.html` files. Workaround:

```powershell
$env:PYTHONIOENCODING='utf-8'
python -c "
import re
content = open('index.html', encoding='utf-8').read()
scripts = re.findall(r'<script(?:\s[^>]*)?>(.+?)</script>', content, re.DOTALL)
for i, s in enumerate(scripts):
    with open(f'_tmp_s{i}.js', 'w', encoding='utf-8') as f:
        f.write(s)
print(f'Extracted {len(scripts)} script blocks')
"
node --check _tmp_s0.js
node --check _tmp_s1.js
# etc.
```

4 script blocks expected; all should exit 0.

---

## 11. Useful PowerShell Search Commands

```powershell
# Find any function in index.html
Select-String -Path "index.html" -Pattern "functionName" | Select-Object -First 5

# Find line range of Object.assign exports
Select-String -Path "index.html" -Pattern "Object.assign\(App" | Select-Object -First 5

# Count lines
(Get-Content "index.html").Count

# Extract and check script blocks
$env:PYTHONIOENCODING='utf-8'
python scratch/validate_scripts.py
```
