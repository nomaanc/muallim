---
name: muallim-pwa
description: >
  Use when building, fixing, auditing, or extending the Muallim ul-Qur'an
  PWA (v7.0.0). Covers student-only ES module architecture, 114 per-lesson
  lazy JSON chunks, 570 quizzes, 4 summative model papers, 6-page Mushaf
  showcase, 9 spiral grammar pillars, optional Firebase /user_data/{uid} sync
  with tombstone tracking, and offline Service Worker caching.
version: 7.0.0
workspace: e:\AIPROJECTS\PROJECTS\translate-hinglish-skill\pwa\
---

# Muallim ul-Qur'an PWA — Project Skill (v7.0.0)

## 1. Non-Negotiable Invariants

1. **Student-Only Architecture**: Zero `admin.html`, `teacher.html`, `ustaad`, or `broadcast` UI, routes, or Firestore collections. Optional cloud sync targets `/user_data/{userId}` exclusively; Guest Mode runs 100% locally with zero Firebase requests.
2. **Zero Credentials in Repo**: Never commit passwords, service-account keys, or admin credentials anywhere in code, docs, skills, or tests.
3. **Sacred Text & Harakat Parity**: Preserve 100% of Arabic diacritics after Unicode NFC normalization: `re.sub(r'<[^>]+>', '', item['arabic_markup']) == item['arabic']`. Standardize Arabic `ي` (`U+064A`) and `ك` (`U+0643`); render Prophet honorifics with `ﷺ` (`U+FDFA`), zero `(S.A.W.)`.
4. **Terminology & Immutability**:
   - Keep `"Exercise"` in English/Hinglish prose (NEVER `"Mashq"`).
   - Display `"Unit"` in all learner-facing labels (data JSON retains `stage_id` internally).
   - Never change, delete, or renumber existing item `id`s across all `14,956` curriculum items.
5. **Zero Runtime Build Step**: Pure vanilla ES modules (`js/`), HTML5 (`index.html`), and CSS3 (`css/`). `node_modules/` is strictly for `node --test` unit tests and Playwright E2E tests.
6. **Excluded Directories**: Keep `images/` source scans excluded from git, GitHub Pages, and Firebase Hosting. Keep `docs/` and `skills/` excluded from GitHub Pages and Firebase Hosting deploys.
7. **Windows PowerShell**: Chain commands with `;` (never `&&`) and set `$env:PYTHONIOENCODING='utf-8'` before running Python scripts.
8. **Firestore Rules Delegation**: Whenever modifying `firestore.rules`, delegate authoring to `firestore-rules-author` and keep `security_rules_test_firestore/firestore.rules` identical.

---

## 2. v7.0.0 Architecture & File Map

| Path | Role |
|---|---|
| `index.html` | Student-only shell with exact 5 `<dialog>` modals (`#lesson-picker-dialog`, `#search-dialog`, `#drill-dialog`, `#practice-dialog`, `#settings-dialog`) and `#lesson-content-mount` |
| `css/styles.css`, `css/layout.css` | OKLCH token system, 3 themes (`parchment`, `night`, `sepia`), 4-language typography, verse stepper, model exam & Mushaf showcase styles |
| `js/app.js` | ES module entrypoint, monotonic navigation guard, in-place store updates, keyboard shortcuts, settings & streak UI |
| `js/core/store.js` | State management, `loadLessonChunk(u, l)` / `loadUnit(u)`, `getItemKey()` (`S{u}L{l}_num_{id}`), `showHints`, `weakWords`, `examHistory`, `deletedItems` tombstones, JSON backup export/import |
| `js/core/router.js` | Hash & query routing: `#u{u}/l{l}` (`@itemKey`), `#exam/vol1\|u4\|u5\|u7`, `#mushaf-check`, `#spiral`, `#bookmarks`, `#favourites` |
| `js/core/renderer.js` | Lesson rendering, RTL grids, `/` Clause-by-Clause Verse Stepper, Student Mode tap-to-peek, Root/Translit hints, section jump/filter bar, SVG lightbox |
| `js/core/audio.js`, `js/audio-fx.js` | EveryAyah Qari MP3 streaming (range & multi-ref chaining) with `muallim-audio-v1` CacheStorage (max 150) + Web Speech `ar*` TTS fallback + continuous lesson queue |
| `js/core/srs.js` | Leitner 5-box flashcard drill with `Mistakes` deck, prompt direction selector, Qari + TTS buttons |
| `js/core/quiz.js` | 570-question lesson quizzes (5 per lesson) + Units 5–7 Root-and-Affix Morphology Builder |
| `js/core/exams.js` | `ExamsController`: 4 Summative Model Papers (`vol1`, `u4`, `u5`, timed `u7`), 6-Page Mushaf Coverage Showcase, 9-Pillar Spiral & Root-Family Explorer |
| `js/core/search.js` | 14,956-entry pre-normalized full-text search across Arabic, transliteration, Hinglish, English, Urdu, Hindi, and trilateral roots |
| `js/core/sync.js` | Lazy-loaded optional Firebase Auth & Firestore sync strictly to `/user_data/{uid}` with tombstone reconciliation |
| `js/visuals/loader.js`, `visual-helper.js`, `unit1..7.js` | Per-unit interactive SVG grammar visualizers, shuffled `"Kya Hoga?"` predictions, collapsible `Steps & Examples` drawer |
| `data/metadata.json` | 7 units, 114 lessons with 4-language `title_i18n`, item counts, page ranges, and `pillars` (9 Spiral Grammar Pillars) |
| `data/lessons/s{u}l{l}.json` | 114 minified per-lesson chunks (`< 360 KB` each) for fast initial boot |
| `data/unit1.json` .. `unit7.json` | 7 deduplicated unit datasets (`14,956` total items) |
| `data/quizzes/unit1.json` .. `unit7.json` | 570 4-language quiz questions (5 per lesson) |
| `data/exams/model_papers.json` | 4 official summative model papers (`vol1`, `u4`, `u5`, `u7`) |
| `data/exams/mushaf_showcase.json` | Page 176 6-passage Mushaf comprehension showcase |
| `data/search-index.json` | Compact 10-field index (`{ id, s, l, ar, tr, hn, en, ur, hi, root }`) for all `14,956` items |
| `sw.js`, `manifest.json` | Service Worker (`muallim-v7.0.0-cache`) with Stale-While-Revalidate shell and lazy dataset caching |
| `docs/book-mind.md` | Authoritative curriculum specification & pedagogical reference (excluded from deploy) |

---

## 3. Firebase & Firestore Schema (`/user_data/{userId}`)

- **Firebase Project**: `muallim-123` (Auth + Cloud Firestore).
- **Strict Owner-Only Access**: Only `request.auth != null && request.auth.uid == userId` may read, create, update, or delete `/user_data/{userId}`. All other paths deny by default.
- **Validation & Immutability**:
  - `uid` (if present) must equal `userId` and `request.auth.uid`, immutable once set.
  - `createdAt` immutable once set.
  - `role` restricted to `'student'` or `'guest'`.
  - `theme` restricted to `'parchment' | 'night' | 'sepia' | 'light' | 'dark'`.
  - Bounded maps/lists including `srs` (`<= 12000`), `weakWords` (`<= 5000`), `deletedItems` (`<= 5000`), `starredItems` (`<= 2500`), `customTranslations` (`<= 2500`), `studyLog` (`<= 400`), `completedLessons` (`<= 200`), `examHistory` (`<= 200`), `fieldUpdatedAt` (`<= 50`).

---

## 4. LocalStorage Keys

| Key | Purpose |
|---|---|
| `muallim_theme` | `'parchment' \| 'night' \| 'sepia'` (migrates legacy `light`/`dark`) |
| `muallim_lang` | `'hinglish' \| 'en' \| 'ur' \| 'hi'` |
| `muallim_mode` | `'study' \| 'student'` |
| `muallim_show_hints` | Boolean string for Root & Transliteration hint row |
| `muallim_favs` | Starred items array |
| `muallim_custom_translations` | `{ [itemKey]: string }` personal notes |
| `muallim_bookmark` | `{ lessonKey, itemId, stage, lesson }` |
| `muallim_srs_state` | Leitner 5-box state keyed by `S{u}L{l}_num_{id}` |
| `muallim_completed_lessons` | `{ [lessonKey]: true }` |
| `muallim_streak` | `{ current, longest, lastStudyDate }` |
| `muallim_study_log` | `{ [YYYY-MM-DD]: count }` |
| `muallim_weak_words` | Missed quiz, morphology, and exam items |
| `muallim_exam_history` | Completed quiz and summative model paper attempts |

---

## 5. Verification Commands (PowerShell)

```powershell
# 1. Rebuild per-lesson chunks, unit JSONs, and search index
$env:PYTHONIOENCODING='utf-8'; python scripts/optimize_data.py

# 2. Run Python invariant gate
$env:PYTHONIOENCODING='utf-8'; python scripts/verify_v6.py

# 3. Run Node unit tests and Playwright E2E suite
npm run test:unit; npm run test:e2e
```
