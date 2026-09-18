# Muallim ul-Qur'an PWA — Third Major Development Prompt

> **Session context**: New chat session in `e:\AIPROJECTS\PROJECTS\translate-hinglish-skill\pwa\`
> Read `context.md` and `SKILL.md` in this folder FIRST before touching any code.

---

## Project Essentials

| Key | Value |
|-----|-------|
| **Workspace** | `e:\AIPROJECTS\PROJECTS\translate-hinglish-skill\pwa\` |
| **Git repo root** | `pwa/` — `.git` lives here |
| **Live URL** | `https://nomaanc.github.io/muallim/` |
| **Source of truth** | `pwa/index.html` (4.2 MB, ~77k lines, single-file PWA) |
| **Mirror** | After every edit: `Copy-Item index.html final-book-7units.html -Force` |
| **Firebase project** | `muallim-123` (account: `nomaanaisub@gmail.com`) |
| **Admin creds** | `ustaad@muallim.app` / `Ustaad123` |
| **Admin UID** | `ME1GchntFqZDLhs23DKzarZE6QC2` |
| **PowerShell rule** | Use `;` not `&&`. Set `$env:PYTHONIOENCODING='utf-8'` before Python. |
| **Shell** | PowerShell on Windows |
| **NEVER** | Translate "Exercise" to "Mashq". Never alter Arabic harakat. |

---

## Requirement 1 — Dedicated Admin Dashboard Page (`pwa/admin.html`)

### What
Create `pwa/admin.html` as a **standalone static HTML page** served at:
`https://nomaanc.github.io/muallim/admin`

This is separate from `index.html`. It has its own HTML, CSS, and inline JS.

### Access & Auth
- On load, check Firebase Auth (`onAuthStateChanged`). If not logged in redirect to `index.html`.
- If logged in but `role !== 'admin'` show "Access Denied" and redirect.
- If logged in and `role === 'admin'` show the full dashboard.
- Firebase config:
  apiKey: AIzaSyAjBnuLSADlXBZ7OY7daQ7mOta3VaHXVNg
  projectId: muallim-123
  authDomain: muallim-123.firebaseapp.com
  appId: 1:226964645326:web:0a219c95dad277b4cd379f

### Dashboard Sections

#### A. Student Analytics
Read from Firestore `/user_data/{userId}` and `/users/{userId}`.

Display per student:
- Name, Email/UID, Role (student/admin)
- Last active timestamp
- Total time spent (track via Firestore — `totalMinutes` in `/user_data/{uid}`)
- Last bookmark — which lesson/card they last bookmarked
- Current lesson — which unit/lesson they are viewing
- Stars count — how many items starred
- Custom answers count — how many custom translations saved
- Exam results — list of all exam results (date, score, scope, unit)

Display as a sortable table with expandable rows. Clicking a student expands to show full exam history and bookmark detail.

#### B. Admin-Generated Exams ("Ustaad ki Exam")
- List all pushed exams from `/pushed_exams/` collection
- Show: exam title, created date, scope (which units/lessons), status (active/expired)
- Button: "Create New Ustaad ki Exam" opens a modal to select units/lessons and push
- Button: "Delete" on each existing exam

#### C. Broadcasts
- Text area to type a broadcast message
- "Send to All Students" button writes to `/muallim_broadcasts/`
- List recent broadcasts (last 10) with timestamp and message preview
- Delete broadcast button

#### D. Student Management
- List all registered users from `/users/` collection
- Show: name, email, role, join date
- Admin can change a user role (student <-> admin)
- Admin can delete a student document from Firestore

### Design Language
- Match PWA aesthetic: warm parchment (#f5f0e8) or dark mode toggle
- Mobile-first, responsive
- Sidebar navigation on desktop, bottom tabs on mobile
- Arabic/Urdu-friendly fonts (Amiri for Arabic text)

### Linking from index.html
- Change "Teacher Admin Panel ACTIVE" button in settings popover to navigate to `./admin.html`
- Remove "Configure Firebase" button from settings popover entirely
- Remove broadcast textarea from settings popover (it now lives in admin.html only)

---

## Requirement 2 — Hamburger Menu Redesign

### Current Problems (from menu.png annotation)
- Too many items, not scrollable on small screens
- Admin features mixed with regular user features
- MY NAME field clutters the menu (should auto-fill from login)
- No logical grouping or icons
- "Configure Firebase" button should be removed

### New Design — Sliding Side Panel + Section Groups + Icons

Keep the sliding side panel from the right (existing animation).
Add: proper section grouping, icons, scroll, visual hierarchy.

New Menu Structure:
```
Header: Muallim [X close button]
--
QUICK ACTIONS
  [Search]    [Drill]     <- 2-column grid
  [Starred]   [My Answers]
--
EXAM
  [Exam (Practice)]       <- renamed from "Ustaad ki Exam"
  [Ustaad ki Exam]        <- NEW: only shows admin-pushed exams
--
APPEARANCE
  Theme: [Parchment] [Night Dark]
  Mode:  [Teacher]   [Student (Blank)]
  Speech Speed slider
  Arabic Font Size slider
--
DATA
  [Export JSON]  [Import JSON]
--
ACCOUNT
  (if logged out): [Login]
  (if logged in):  Name + Role shown, [Password] [Logout]
  (if admin only): [Admin Panel ->] opens admin.html
--
NOTIFICATIONS
  [Allow Notifications]
```

### Key Changes Required in Code
1. Remove "Configure Firebase" button entirely
2. Remove MY NAME text input (name comes from Firebase login)
3. Remove broadcast textarea from hamburger
4. Remove standalone "Password" and "Refresh" buttons — put under Account section
5. Rename existing "Ustaad ki Exam" hamburger button -> "Exam" (self-practice)
6. Add new "Ustaad ki Exam" button that opens admin-pushed exams only
7. Make panel scrollable: `overflow-y: auto; max-height: 100vh`
8. Add section labels (QUICK ACTIONS, EXAM, APPEARANCE, DATA, ACCOUNT, NOTIFICATIONS)
9. Add icons (emoji or SVG) to each major button/option
10. 2-column CSS grid for Quick Actions row

### CSS Requirements
- Section headers: small caps, muted color (#888), font-size 11px, uppercase, letter-spacing
- Thin dividers between sections: `border-top: 1px solid rgba(0,0,0,0.08)`
- Scrollable panel: `overflow-y: auto; max-height: 100vh`
- Responsive: stack to 1-column on screens < 360px wide
- Preserve existing slide-in animation

---

## Requirement 3 — Custom Answers (My Answers) Fix

### What Should Work
The "My Answers" button in hamburger opens a modal showing all custom translations saved via pencil icon across all lessons/units.

### Display Requirements
- Group by lesson: Unit N Lesson N, in book order (U1L1, U1L2... U7L10)
- Each entry shows: Arabic phrase / Original Hinglish / Your custom answer
- Delete/clear button on each to revert to original
- Search input at top to filter by lesson or text
- Empty state message in Hinglish if nothing saved yet

### Debug Steps
1. Verify `openCustomAnswersModal` reads `lsGet('muallim_custom_translations', {})` from localStorage
2. Verify it renders items grouped by lesson correctly
3. Verify `id="menu-btn-custom"` button is wired in DOMContentLoaded via `qb('menu-btn-custom', ...)`
4. Test: save a custom translation via pencil icon, then open My Answers

### Custom Answers Data Format (localStorage)
Key: `muallim_custom_translations`
Value: `{ "S1L5_num_3": "my custom text", "S2L7_num_12": "another" }`
Key format: `S{stage}L{lesson}_{type}_{index}` matching data-item-id on .card-top elements

---

## Requirement 4 — Remove QQ1 Exercise Sections Permanently from JSON

### What
QQ1 (and all qn_label / exercise_header sections at the end of lessons — the "Tarjuma karein" exercise blocks) must be PERMANENTLY DELETED from the inline `window.PWA_BOOK_DATA` JSON in `index.html`.

The user confirmed: DELETE FROM JSON (not just hide at render time).

### Sections to Remove
From qq1.png: QQ1 appears as:
- `exercise_header` section with title "Tarjuma karein" (at end of lesson)
- `qn_label` sections (type qn_label) in ALL lessons ALL units
- `two_col_numbered_list` sections that immediately follow a qn_label (exercise blanks)

Note: The existing JS filter at ~line 74129-74134 already hides these at render time.
Now we also delete them from the JSON data.

### Implementation Approach
Write a Python script `scratch/remove_qq1_sections.py` that:
1. Reads `pwa/index.html`
2. Extracts the PWA_BOOK_DATA JSON block
3. Filters out: sections where type is 'qn_label', sections where type is 'exercise_header' with exercise titles, and following exercise two_col_numbered_list blocks
4. Writes cleaned JSON back into index.html
5. Copies to final-book-7units.html

---

## Requirement 5 — File Organization

### 5a. Images folder (ALREADY DONE)
The images/ folder has been moved from project root to `pwa/images/`.
465 textbook scan images now at: `e:\AIPROJECTS\PROJECTS\translate-hinglish-skill\pwa\images\`

### 5b. Create `pwa/context.md`
Quick context file for new AI chat sessions. Include:
- Project overview
- Architecture overview (single-file PWA, Firebase, GitHub Pages)
- Key file map
- Firebase config
- Confirmed design decisions
- Git workflow
- Invariants

### 5c. Create `pwa/documentation.html`
Standalone HTML documentation page (no external dependencies) covering:
- Project introduction
- Feature list with visual examples referencing images/ folder
- Architecture diagram (inline SVG or CSS)
- Developer guide (how to edit, build, deploy)
- Firebase integration guide
- Admin panel guide
- Data schema overview

---

## Requirement 6 — New Project-Local PWA Skill (`pwa/SKILL.md`)

Create a SKILL.md in the pwa/ folder for use in the new chat session.
This is a project-local skill (not global). Reference it in the new session context.

YAML frontmatter:
```yaml
---
name: muallim-pwa
description: >
  Use when building, fixing, auditing, or extending the Muallim ul-Qur'an
  standalone PWA. Covers architecture, Firebase, exam engine, admin dashboard,
  hamburger menu, custom translations, bookmarks, starred items, and all
  confirmed design decisions.
version: 1.0.0
workspace: e:\AIPROJECTS\PROJECTS\translate-hinglish-skill\pwa\
---
```

Sections to include:
1. Invariants & Non-Negotiables
2. Architecture Map (index.html line ranges, admin.html, Firebase config)
3. Firebase Module (loadFirebase, initFirebaseOnLoad scope bug fix — commit 8b0a871)
4. Data Format (PWA_BOOK_DATA, stage keys, section types, data-item-id format)
5. Feature Inventory (all current features)
6. Confirmed Design Decisions (all 13 confirmed decisions)
7. Git Workflow
8. Known Bugs Already Fixed (with commit hashes)
9. Pending Features

---

## Requirement 7 — Additional Suggestions

### 7.1 Student Progress Tracking
Add sessionTracker to index.html:
- On lesson mount: record {lessonKey, startTime}
- On lesson unmount: compute elapsed, append to Firestore `/user_data/{uid}.lessonTime.{lessonKey}`
- Admin dashboard aggregates this for time-spent analytics

### 7.2 Improve Offline Reliability
Split into offline mode (content only) and sync mode (login, starred, exam results).
Show graceful "Sync when online" queue when offline.

### 7.3 Student Exam Result History
Add "My Results" section in hamburger or inside Exam modal showing past exam scores from Firestore.

### 7.4 Ustaad ki Exam Push Notification
Use Firebase Cloud Messaging to notify subscribed students when admin pushes a new exam.

### 7.5 Audio Playback Fallback
Add fallback for Web Speech API unreliability on Android via preloaded audio or TTS API URLs.

### 7.6 Dark Mode Persistence
Verify lsSet('muallim_theme', theme) is called on theme change and applied on init before first render.

### 7.7 Keyboard & Accessibility for Hamburger
Add role="dialog", aria-modal, aria-label, Escape key to close, focus trap.

### 7.8 PWA Install Prompt
Listen for beforeinstallprompt and show "Add to Home Screen" banner.

### 7.9 Lesson Completion Indicators
Add checkmark badges on lesson selector for lessons with >50% starred or exam taken.

### 7.10 Admin Impersonation View
In admin.html, "View as Student" button opens index.html?uid=xxx in read-only mode.

---

## Implementation Priority Order

| Priority | Requirement | Effort |
|----------|-------------|--------|
| P1 (Now) | Req 4: Remove QQ1 from JSON data | Medium |
| P1 (Now) | Req 3: Fix My Answers modal | Medium |
| P1 (Now) | Req 2: Hamburger menu redesign | High |
| P2 | Req 1: Admin Dashboard admin.html | High |
| P2 | Req 5b/5c: context.md + documentation.html | Medium |
| P3 | Req 6: pwa/SKILL.md | Low |
| P3 | Req 7.1: Session time tracking | Medium |
| P3 | Req 7.3: Student exam result history | Medium |

---

## Architecture Reference

```
pwa/
  index.html              <- Main PWA (4.2 MB, 77k lines)
  final-book-7units.html  <- Mirror of index.html (always sync after edits)
  admin.html              <- [NEW] Admin dashboard
  sw.js                   <- Service Worker
  manifest.json           <- PWA manifest
  firebase-messaging-sw.js
  firestore.rules         <- deploy via: firebase deploy --only firestore:rules
  images/                 <- [MOVED] 465 textbook scan images
  icons/                  <- PWA icons
  docs/
    FIREBASE_SETUP.html
    documentation.html    <- [NEW]
  SKILL.md                <- [NEW] Project-local skill
  context.md              <- [NEW] Quick context for new sessions
```

### index.html Key Line Ranges (approximate)
| Section | Lines |
|---------|-------|
| CSS styles | 1 – 1,580 |
| HTML structure | 1,580 – 2,010 |
| window.PWA_BOOK_DATA JSON | 2,010 – 73,850 |
| App IIFE | 73,850 – 76,716 |
| DOMContentLoaded listeners | 76,717 – 76,744 |
| Firebase dialog HTML | 76,750 – 76,890 |

---

## Confirmed Design Decisions (Non-Negotiable)

1. "Exercise" stays as "Exercise" — never translate to Mashq
2. Stage -> Unit EVERYWHERE in UI (data JSON retains stage_id internally)
3. No build tools — zero npm, no Vite/Webpack; all code in index.html; PowerShell only
4. GitHub Pages (static) — admin.html at /admin, main app at /
5. Bookmark scrolls to exact card with highlight flash animation
6. Sticky header using overflow-x: clip
7. "Ustaad ki Exam" = admin-pushed exams only; regular Exam button = self-practice
8. QQ1 sections removed permanently from book data JSON
9. Admin panel = separate admin.html page; no inline Firebase panel in hamburger
10. Name auto-fills from Firebase login — no manual MY NAME input in hamburger
11. No "Configure Firebase" button in the hamburger menu (removed completely)
12. Arabic harakat (diacritics) must never be stripped or altered
13. Hinglish follows SOV syntax; zero forbidden English words except "Exercise"

---

## Firestore Schema (Current + Additions)

```
/users/{uid}
  name, email, role ("admin"|"student"), createdAt

/user_data/{uid}
  starredItems: { [itemKey]: boolean }
  customTranslations: { [itemKey]: string }
  examResults: [ { date, score, total, scope, lessonKeys[] } ]
  lastBookmark: { lessonKey, itemKey }
  lessonTime: { [lessonKey]: number }  <- seconds spent (Req 7.1)

/pushed_exams/{examId}
  title, createdAt, createdBy, scope: { type, lessonKeys[] }, status

/muallim_broadcasts/{broadcastId}
  message, createdAt, authorUid

/muallim_students/{deviceId}
  name, deviceId, joinedAt
```

---
Generated: 2026-09-18 from third major planning session of Muallim ul-Quran PWA project.
