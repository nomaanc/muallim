# Muallim ul-Qur'an (معلم القرآن) — Interactive Qur'anic Arabic PWA

[![Live App](https://img.shields.io/badge/Live_App-Muallim_PWA-1B4332?style=for-the-badge&logo=pwa&logoColor=white)](https://nomaanc.github.io/muallim/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline_First-2D6A4F?style=for-the-badge&logo=googlechrome&logoColor=white)](https://nomaanc.github.io/muallim/)
[![Curriculum](https://img.shields.io/badge/Curriculum-7_Units_·_114_Lessons_·_14956_Items-0284C7?style=for-the-badge)](https://nomaanc.github.io/muallim/)
[![Quizzes & Exams](https://img.shields.io/badge/Practice-570_Quizzes_·_4_Model_Papers-7C3AED?style=for-the-badge)](https://nomaanc.github.io/muallim/#exam/vol1)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Zero Build Step](https://img.shields.io/badge/Runtime-Vanilla_ES_Modules-black?style=for-the-badge&logo=javascript&logoColor=white)](https://nomaanc.github.io/muallim/)

> **Muallim ul-Qur'an (v7.0.0)** is an offline-first, student-only Progressive Web Application (PWA) for learning Qur'anic Arabic vocabulary, morphology, and syntax across **7 Units, 114 Lessons, and 14,956 verified items** in **4 languages** (Roman Urdu/Hinglish, English, Nastaliq Urdu, and Devanagari Hindi).

---

## Overview

Built directly from the 7-unit *Muallim ul-Qur'an* workbook, v7.0.0 delivers per-lesson lazy loading (`114` lesson chunks), interactive SVG grammar models, clause-by-clause verse stepping, Leitner 5-box spaced repetition, `570` lesson quizzes, `4` official summative model papers, a `6`-page Mushaf comprehension showcase, and a 9-pillar spiral grammar explorer. All progress stays local by default with optional owner-only Firebase cloud sync.

---

## Curriculum Structure (v7.0.0)

| Unit | Topic Focus | Lessons | Total Items | Lesson Quizzes | Status |
|:---:|:---|:---:|:---:|:---:|:---:|
| **Unit 1** | Mufrad Asma (Singular Nouns), Tanween, Alif-Laam, Demonstratives | 19 Lessons | 961 Items | 95 Questions | Verified |
| **Unit 2** | Huroof-e-Jarr, Inna, Kaana, Qasam, Huroof-e-Nida | 13 Lessons | 1,004 Items | 65 Questions | Verified |
| **Unit 3** | Murakkab-e-Tawseefi, Mudaaf-o-Mudaaf Ilaih, Ism Faa'il & Maf'ool | 10 Lessons | 1,015 Items | 50 Questions | Verified |
| **Unit 4** | Attached Pronouns (Damair), Prepositions with Pronouns, Relative Clauses | 18 Lessons | 1,487 Items | 90 Questions | Verified |
| **Unit 5** | Jumla Ismiyyah, Advanced Particles, Conditionals & Negation | 23 Lessons | 2,425 Items | 115 Questions | Verified |
| **Unit 6** | Fe'l Maazi & Mudhari' Conjugations, Pronouns, Derived Verb Forms | 21 Lessons | 3,122 Items | 105 Questions | Verified |
| **Unit 7** | Passive Voice (Majhool), Amr/Nahy, Weak Verbs & Qur'anic Usloob | 10 Lessons | 4,942 Items | 50 Questions | Verified |
| **TOTAL** | **Complete 7-Unit Qur'anic Arabic Curriculum** | **114 Lessons** | **14,956 Items** | **570 Questions** | **100% Verified** |

---

## Features

### Per-Lesson Lazy Chunks & Pedagogical Integrity
- **114 Per-Lesson Payloads (`data/lessons/s{u}l{l}.json`)**: Fast lesson switching without parsing multi-megabyte unit bundles upfront, while retaining `data/unit1.json`–`unit7.json` for cross-lesson drills.
- **100% Harakat Parity**: Every item enforces Unicode NFC parity (`arabic_markup` stripped of HTML tags matches `arabic` character-for-character) with standard Arabic `ي` and `ك`.
- **Horizontal RTL Grids & Clause Stepper**: Multi-column vocabulary grids read right-to-left; slash-segmented verses (`/`) split into interactive clause-by-clause chips for focused translation practice.
- **4 Languages & 3 Themes**: Switch dynamically between Hinglish (Roman Urdu SOV), English, Nastaliq Urdu (`ur` RTL), and Devanagari Hindi (`hi`) across **Parchment**, **Night**, and **Sepia** themes.

### Interactive Grammar Visuals (`js/visuals/unit1..7.js`)
- Context-aware animated SVG grammar diagrams per lesson, themed with CSS custom properties (`var(--bg-surface)`, `var(--ink-primary)`).
- Shuffled *"Kya Hoga?"* prediction prompts, an expandable **Steps & Examples** drawer, and a full-viewport zoom/pan lightbox.

### Practice, Assessment & Discovery
- **Leitner 5-Box SRS (`js/core/srs.js`)**: Box 1 (1d) through Box 5 (30d), plus a dedicated **Mistakes** deck, prompt direction selector (`Arabic → Meaning`, `Meaning → Arabic`, `Audio → Meaning`), and separate Qari + browser TTS audio buttons.
- **570 Lesson Quizzes & Morphology Builder (`js/core/quiz.js`)**: 5 randomized 4-language questions per lesson plus Units 5–7 interactive Root-and-Affix Morphology Builder.
- **4 Summative Model Papers (`#exam/vol1`, `#exam/u4`, `#exam/u5`, `#exam/u7`)**: Official workbook exams from `data/exams/model_papers.json` including *Bayyinat* continuous passages and a pauseable `120:00` timer on the Unit 7 final exam.
- **6-Page Mushaf Coverage Showcase (`#mushaf-check`)**: Real Qur'anic passages from Page 176 (`data/exams/mushaf_showcase.json`) comparing current mastery against the post-Unit-7 comprehension benchmark with tap-to-peek masks.
- **9-Pillar Spiral & Root Explorer (`#spiral`)**: Trace the 9 cross-cutting grammar pillars across `U#L#` chains and browse cognate nouns, participles, and verbs by trilateral root.

### Audio & Offline PWA
- **Qari Recitation & Continuous Queue (`js/core/audio.js`)**: Streams ayah MP3s (`everyayah.com`), chains range (`50:12-13`) and multi-ref (`2:39; 2:82`) passages, caches up to 150 clips in `muallim-audio-v1`, and falls back to browser Arabic TTS.
- **Service Worker (`sw.js` `muallim-v7.0.0-cache`)**: Stale-While-Revalidate shell caching plus on-demand caching for lesson chunks, quizzes, exams, visuals, and the `14,956`-entry search index.
- **Optional Personal Cloud Sync (`js/core/sync.js`)**: Works offline with zero login; when signed in, syncs strictly to `/user_data/{uid}` with tombstone support for deletions.

---

## Architecture

Zero runtime build step or bundler. Pure vanilla ES modules, HTML5, and CSS3:

```text
pwa/
├── index.html                  # Student-only shell (5 <dialog> modals + view mount)
├── manifest.json               # PWA manifest with bookmarks & starred shortcuts
├── sw.js                       # Service Worker (muallim-v7.0.0-cache)
├── firestore.rules             # Strict owner-only /user_data/{userId} rules
├── css/
│   ├── styles.css              # Design tokens, themes, components, exam & stepper UI
│   └── layout.css              # Responsive grid, mobile bottom bar, lightbox
├── js/
│   ├── app.js                  # App shell, navigation guard, in-place store handlers
│   ├── audio-fx.js             # Web Audio UI feedback synthesizer
│   ├── core/                   # store, router, renderer, audio, srs, quiz, exams, search, sync
│   └── visuals/                # loader, visual-helper, unit1.js .. unit7.js
├── data/
│   ├── metadata.json           # 7 units, 114 lesson titles (4 langs), 9 spiral pillars
│   ├── search-index.json       # 14,956 pre-indexed items with roots & transliterations
│   ├── lessons/                # 114 minified per-lesson JSON chunks (s1l1..s7l10)
│   ├── quizzes/                # unit1.json .. unit7.json (570 questions)
│   ├── exams/                  # model_papers.json (4 papers) & mushaf_showcase.json (6 passages)
│   └── unit1.json .. unit7.json
├── scripts/                    # optimize_data.py, verify_v6.py
└── tests/                      # unit/*.test.js & e2e/playtest.spec.js
```

---

## Quick Start & Testing

### Run Locally
```bash
git clone https://github.com/nomaanc/muallim.git
cd muallim
python -m http.server 8080
```
Open `http://127.0.0.1:8080` in your browser.

### Verify & Test (Dev Dependencies)
`package.json` includes `@playwright/test` strictly for automated CI and local verification:

```powershell
# Python invariant & schema gate
$env:PYTHONIOENCODING='utf-8'; python scripts/verify_v6.py

# Node unit tests & Playwright E2E suite
npm ci
npm run test:unit
npm run test:e2e
```

---

## License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.
