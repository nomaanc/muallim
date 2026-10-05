# Muallim ul-Qur'an (معلم القرآن) — Interactive Qur'anic Arabic PWA

[![Live App](https://img.shields.io/badge/Live_App-Muallim_PWA-1B4332?style=for-the-badge&logo=pwa&logoColor=white)](https://nomaanc.github.io/muallim/)
[![Ustaad Portal](https://img.shields.io/badge/Ustaad-Teacher_Portal-2563EB?style=for-the-badge&logo=googleclassroom&logoColor=white)](https://nomaanc.github.io/muallim/teacher.html)
[![Admin Dashboard](https://img.shields.io/badge/Admin-Dashboard-D97706?style=for-the-badge&logo=firebase&logoColor=white)](https://nomaanc.github.io/muallim/admin.html)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline_First-2D6A4F?style=for-the-badge&logo=googlechrome&logoColor=white)](https://nomaanc.github.io/muallim/)
[![Curriculum](https://img.shields.io/badge/Curriculum-7_Units_·_113_Lessons_·_8871_Items-0284C7?style=for-the-badge)](https://nomaanc.github.io/muallim/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Zero npm Dependencies](https://img.shields.io/badge/Dependencies-Zero_npm-black?style=for-the-badge&logo=javascript&logoColor=white)](https://nomaanc.github.io/muallim/)

> **Muallim ul-Qur'an** is an offline-first Progressive Web Application (PWA) designed to teach Qur'anic Arabic vocabulary and syntax through authentic Roman Urdu (Hinglish) translations, interactive animated SVG grammar diagrams, Leitner 5-box spaced repetition drills, and interactive exercises.

---

## 📖 Overview

Based on the classical curriculum *Muallim ul-Qur'an*, this application presents **7 complete Units containing 113 lessons**, digitizing **8,871 Qur'anic vocabulary entries, phrases, and verses** while preserving **100% of authentic Arabic diacritics (harakat/tashkeel)**.

The platform pairs classical Arabic pedagogy with web engineering standards: students learn through interactive visual breakdowns, phonetic Roman Urdu translations following Subject-Object-Verb (SOV) order, Leitner 5-box memory drills, and instant self-assessment tools.

---

## 🏛️ Curriculum Structure (100% Complete & Verified)

All 7 units are digitized, marked up, and verified with zero missing IDs, zero diacritic drift, and zero forbidden words:

| Unit | Topic Focus | Lessons | Total Items | Markup Coverage | Quality Audit |
|:---:|:---|:---:|:---:|:---:|:---:|
| **Unit 1** | Mufrad Asma (Singular Nouns), Tanween, Alif-Laam, Gender, Broken Plurals | 19 Lessons | 804 Items | 804 / 804 (100%) | Passed (0 Errors) |
| **Unit 2** | Huroof-e-Jarr, Ta'keed (Inna), Kaana, Waw-e-Qasam, Huroof-e-Nida | 13 Lessons | 827 Items | 827 / 827 (100%) | Passed (0 Errors) |
| **Unit 3** | Murakkab-e-Tawseefi (Adjective Phrases), Mudaaf-o-Mudaaf Ilaih, Ism Faa'il | 10 Lessons | 973 Items | 973 / 973 (100%) | Passed (0 Errors) |
| **Unit 4** | Murakkab-e-Izafi, Attached Pronouns (Hu, Humaa, Hum), Harf-e-Jarr with Pronouns | 17 Lessons | 1,404 Items | 1,404 / 1,404 (100%) | Passed (0 Errors) |
| **Unit 5** | Jumla Ismiyyah (Nominal Sentences), Demonstrative Pronouns (Haaza, Zaalika), Negation | 23 Lessons | 2,407 Items | 2,407 / 2,407 (100%) | Passed (0 Errors) |
| **Unit 6** | Fe'l Mazi (Past Tense Verbs), Trilateral Roots, Subject Pronoun Affixes | 21 Lessons | 1,120 Items | 1,120 / 1,120 (100%) | Passed (0 Errors) |
| **Unit 7** | Advanced Conjugations, Shartiyyah (In Kuntum), Fe'l Majhool, Qur'anic Usloob | 10 Lessons | 1,336 Items | 1,336 / 1,336 (100%) | Passed (0 Errors) |
| **TOTAL** | **Complete Classical Qur'anic Arabic Curriculum** | **113 Lessons** | **8,871 Items** | **8,871 / 8,871 (100%)** | **100% Verified** |

---

## 🎯 The Four Pillars of Pedagogical Integrity

The application enforces four non-negotiable architectural standards across all 8,871 items:

1. **Horizontal Right-to-Left (RTL) Reading Order**
   Multi-column vocabulary grids flow row-by-row from right to left across columns (Row 1: Right ➔ Center ➔ Left, Row 2: Right ➔ Center ➔ Left), mirroring physical Qur'anic typography.

2. **Intermediary Hinglish Descriptions**
   Textbook rules and section transitions are presented as authentic Roman Urdu `rule_paragraph` and `section_label` elements directly preceding exercises, contextualizing vocabulary before usage.

3. **Authentic Sentence Numbering**
   Printed textbook numbers (e.g., `1.`, `2.`) are strictly preserved as numerical badges on Qur'anic verses and phrases, while reference flashcard grids remain clean and unnumbered.

4. **Dual-Highlight Semantic Markup (`arabic_markup`)**
   Every Arabic item is marked with dual semantic styles:
   - `<span class="nonroot">`: Red ink elements highlighting either the lesson topic focus (Reason A) or morphological affixes/prefixes (Reason B).
   - `<span class="arabic-root">`: Black ink elements preserving base roots and nominal stems.
   - **Tashkeel Guarantee**: `arabic_markup.replace(/<[^>]+>/g, '')` matches the base `arabic` field character-for-character with 100% harakat preserved.

---

## ✨ Features

### ⚡ Interactive SVG Grammar Visualizer (`js/grammar-visuals.js`)
- Context-aware animated SVG diagrams positioned at the head of every lesson.
- Interactive, multi-state visual demonstrations:
  - **Unit 1**: Definite article (*Alif-Laam*) attachment and Tanween cancellation morpher.
  - **Unit 2**: Preposition (*Huroof-e-Jarr*: *Fii*, *Alaa*, *Min*, *Ilaa*, *Bi*) container & platform force visualizers.
  - **Unit 3**: Noun-Adjective (*Tawseefi*) 4-attribute harmony scale & *Mudaaf-o-Mudaaf Ilaih* connector chains.
  - **Unit 4**: Attached and detached pronouns (*Damair*) morphological connectors.
  - **Unit 5**: *Inna* & Nominal Sentence dynamic balance beam scale.
  - **Unit 6**: *Fe'l Mazi* 14-form morphological conjugation wheel.
  - **Unit 7**: Active (*Ma'roof*) to Passive (*Majhool*) vowel shift morpher & Conditional (*Shart wa Jaza*) scale.
- Zero external dependencies: constructed with pure vanilla ES6, CSS `@keyframes`, and procedural Web Audio API sound synthesis.

### 🧠 Adaptive Spaced-Repetition System (Leitner 5-Box SRS)
- Evidence-based Leitner 5-box memory scheduling built directly into the vocabulary drill.
- Interval expansion: Box 1 (1d) ➔ Box 2 (3d) ➔ Box 3 (7d) ➔ Box 4 (14d) ➔ Box 5 (30d 🌟 Mastered).
- Multi-grade memory ratings (`🔴 Again`, `🟡 Hard`, `🟢 Good`, `🔵 Easy`) with automated sync to Cloud Firestore.

### 📝 Interactive Grammar Multiple-Choice Exercises
- 5-question targeted drills per lesson with instant Roman Urdu feedback explanations.
- Grammatical voice identification, I'raab detection, and dynamic vocabulary distractor options.

### 👨‍🏫 Ustaad / Teacher Portal (`teacher.html`)
- Dedicated teacher dashboard built with Tailwind CSS:
  - Track assigned students' progress, study hours, starred vocabulary, and exam history.
  - Push custom timed exams to students with configurable question counts and passing scores.
  - Broadcast instant notifications to active student sessions.

### 📱 Offline-First Progressive Web App (PWA)
- Installable on Android, iOS, Windows, macOS, and Linux.
- Service Worker (`sw.js` v2.7.0) with Cache-First asset caching and on-demand JSON dataset storage.
- Operates without internet connectivity after initial load.

### 🔍 Multi-Dimensional Instant Search
- Instant search index with 5,900+ terms (`data/search-index.json`).
- Search across Arabic (with/without tashkeel), Roman Urdu transliterations, and English meanings.

---

## 🛠️ Architecture & Stack

Zero build tools or package managers required. The application runs natively in any standard web browser:

```
muallim/
├── index.html               # Main PWA application shell (~508 lines)
├── teacher.html             # Dedicated Ustaad / Teacher Portal
├── admin.html               # Super Admin analytics dashboard
├── manifest.json            # PWA manifest with standalone display configuration
├── sw.js                    # Service Worker (v2.7.0) with cache-first routing
├── css/
│   └── styles.css           # Sovereign design system, emerald/amber themes, dialogs
├── js/
│   ├── app.js               # Core app state, Leitner SRS engine, drill spinner, exercises
│   └── grammar-visuals.js   # Interactive SVG Grammar Engine & Web Audio synthesizer
└── data/
    ├── metadata.json        # Fast-loading table of contents and curriculum index
    ├── search-index.json    # 5,900+ term multi-lingual search index
    └── unit1.json - unit7.json  # 7 lazy-loaded unit datasets (8,871 verified items)
```

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3 with CSS Custom Properties.
- **Backend (Optional)**: Firebase Authentication and Cloud Firestore for multi-device sync and admin features.
- **Deployment**: Zero build step. Host directly on GitHub Pages, Cloudflare Pages, or Firebase Hosting.

---

## 🚀 Quick Start & Installation

### Option 1: Open in Browser
Access the live PWA directly: **[https://nomaanc.github.io/muallim/](https://nomaanc.github.io/muallim/)**

### Option 2: Install as a PWA
1. Open the URL in Google Chrome, Microsoft Edge, or Safari.
2. Click **Install App** in the address bar or tap **Share ➔ Add to Home Screen** on mobile.
3. Access directly from your home screen or application launcher offline.

### Option 3: Run Locally
Clone the repository and serve with any local HTTP server:

```bash
# Clone the repository
git clone https://github.com/nomaanc/muallim.git
cd muallim

# Serve using Python 3
python -m http.server 8000

# Or serve using Node npx
npx serve .
```

Open `http://localhost:8000` in your web browser.

---

## 📜 Metadata & Semantic Schema

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Muallim ul-Qur'an PWA",
  "operatingSystem": "All modern browsers (Android, iOS, Windows, macOS, Linux)",
  "applicationCategory": "EducationalApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "educationalLevel": "Beginner to Advanced Qur'anic Arabic",
  "inLanguage": ["ar", "ur-Latn", "en"],
  "description": "Interactive, offline-first Progressive Web App for learning Qur'anic Arabic vocabulary and grammar through Roman Urdu (Hinglish), animated SVG models, and self-assessment exams."
}
```

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## 🌟 Acknowledgements

- Dedicated to students seeking to understand the Arabic of the Noble Qur'an.
- Curriculum based on the traditional *Muallim ul-Qur'an* pedagogy.
