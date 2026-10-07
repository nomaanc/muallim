# Muallim ul-Qur'an — Master Overhaul Plan v10.0

> **Document Purpose:** This is the single source of truth for every agent, developer, and model executing work on this project. Every section is written to be unambiguous — if an instruction feels open to interpretation, treat the most conservative reading as correct and log a question in `data/da_audit_log.json` rather than guessing.
>
> **Status:** Active Execution Plan
> **Generated:** 2026-10-06 | **Last Updated:** 2026-10-07
> **Completed Baseline:** Units 1–7 translations (8,871 items), Firestore security rules, PWA v3.0.0 production release.

---

## HOW TO READ THIS DOCUMENT

- **§0** — What is already done. Do NOT redo it.
- **§1** — Hard rules. Breaking any of these is a blocker, not a warning.
- **§2** — How each feature must be built (architecture specs with code shapes).
- **§3** — The 113-lesson list and what each lesson needs.
- **§4** — The phase-by-phase execution plan with explicit entry gates and exit criteria.
- **§5** — Quality gates. A phase is NOT done until every gate passes.
- **§6** — Data accuracy bugs. Full spec, examples, detection rules, and fix procedures.
- **§7** — Visual scan protocol. Step-by-step guide for reading book images accurately.

**If you are a model executing one phase:** Read §1, §4 (your phase only), §5, and §6. You do not need §3 in full unless building quiz content.

---

## §0 — Completed Baseline (Do Not Repeat This Work)

The following is already done. Any agent must verify this before starting, but must not re-do it.

| Completed Item | Evidence |
|---|---|
| 8,871 vocabulary/phrase items with `arabic`, `arabic_markup`, `en`, `ur`, `hi`, `hinglish` fields | Firestore collection, all 113 lessons |
| Firestore security rules — owner-scoped user progress | `firestore.rules` in repo root |
| PWA Service Worker, manifest, offline cache `muallim-v3.0.0-cache` | `sw.js`, `manifest.json` |
| 30 of 113 lessons have v1 grammar visuals (the other 83 use archetype fallback) | `js/grammar-visuals.js` |
| Quiz bank for all lessons — legacy format (1 question per lesson) | `data/quiz_banks.json` |

**DO NOT touch:** `item.id` values, `item.arabic`, `item.arabic_markup`. These are immutable keys. Any change here breaks existing user progress records permanently.

---

## §1 — System Invariants (Hard Rules, No Exceptions)

Every invariant below is a **blocker**. Code that violates any of these must be fixed before it can be merged, deployed, or considered done.

### INV-1 — Arabic Data Integrity
`item.arabic` and `item.arabic_markup` must remain **bit-for-bit unchanged** from their current Firestore values.
- Do not strip diacritics (tashkeel: ◌َ ◌ِ ◌ُ ◌ً ◌ٍ ◌ٌ ◌ّ ◌ْ).
- Do not normalize Unicode forms.
- Do not remove the red/black ink spans inside `arabic_markup`.
- Verification: After any Firestore write, read the value back and byte-compare it to the original.

### INV-2 — Immutable Item IDs
`item.id` values are primary keys for user progress, Firestore documents, and quiz references.
- Never rename, regenerate, or delete an `id`.
- If a data reorder is needed (Bug DA-2), add a new `displayOrder` field. Do not change the `id`.

### INV-3 — Zero Build Step
The codebase is pure vanilla HTML5 + CSS3 + ES6. There is no Webpack, Vite, Babel, TypeScript compiler, or bundler.
- Every `.js` file MUST start with `// @ts-check`.
- Use JSDoc annotations for all function signatures so IDEs provide type hints without a compiler.
- Do not add `package.json` build scripts. CDN-only dependencies.

### INV-4 — Hinglish-Mode Purity
When the app is in Hinglish mode, **zero Urdu-script characters** (`U+0600–U+06FF`) may appear in any UI string — labels, headings, grammar descriptions, tooltips, button text, or error messages.
- Hinglish is Roman Urdu: written with Latin alphabet, sounds like Urdu.
- Correct: `"Wahid"`, `"Jama"`, `"Misal 1"`, `"Unka Matlab"`
- Wrong: `"واحد"`, `"جمع"`, `"مثل١"`, `"اسکامعنی"`
- Arabic text in the `item.arabic` field displayed as Arabic script is always correct — this rule applies only to **UI chrome strings** (labels, headings, instructions).

### INV-5 — Offline-First
Every new JS module, JSON file, and asset must be added to the Service Worker cache manifest. Nothing may be network-only.

### INV-6 — Accessibility
- All interactive SVG elements: `role`, `aria-label`, `tabindex`.
- All quiz answer buttons: keyboard focusable, activatable via Enter/Space.
- All CSS animations: wrapped in `@media (prefers-reduced-motion: no-preference) { ... }` so they are off by default for users with the OS motion setting enabled.

### INV-7 — Data Accuracy (Units 5–7)
The `hinglish` field for any Quranic phrase item in Units 5, 6, or 7 must contain a **Hinglish semantic translation** (Roman Urdu meaning), never an Arabic transliteration.
- Wrong: `"Al-haqqu mir-Rabbihim"` — this is phonetic Arabic, meaningless to learner.
- Correct: `"Unke Rab ki taraf se haq hai"` — this is the actual meaning in Roman Urdu.
- Full specification, detection rules, and correction examples are in §6.

---

## §2 — Architecture & Feature Specifications

### 2.1 — Grammar Visuals Engine v2.0

**File structure:** One file per unit — `js/visuals/unit1.js`, `js/visuals/unit2.js`, ..., `js/visuals/unit7.js`.

**Every visual module must export exactly this interface:**
```js
// @ts-check

/**
 * @param {string} containerId - The DOM element ID to mount into
 * @returns {void}
 */
export function mount(containerId) { /* ... */ }

/**
 * Removes all event listeners and cleans up DOM. Must be called before navigation.
 * @returns {void}
 */
export function destroy() { /* ... */ }
```

**Why `destroy()` is mandatory:** This is an SPA. Users navigate between 113 lessons without page reloads. If event listeners are not removed, each navigation adds a new set of listeners on top of old ones. After 10 navigations the user has 10× the listeners — memory leak, audio glitches, broken interactions. `destroy()` is the solution. It is not optional.

**Each visual must contain these four components:**

#### 2.1a — Interactive SVG Illustration
- SVG must use a `viewBox` attribute. Never use fixed `width`/`height` in pixels.
- Must be fully visible and functional at 390px viewport width (iPhone 14 Pro portrait — the primary device).
- The SVG itself demonstrates the grammar transformation (e.g., how a suffix attaches to a root word).

#### 2.1b — "Kya Hoga?" Prediction Challenge
This is an active learning feature — it makes the student predict the answer before seeing it.

**Exact UI behavior:**
1. Below the SVG, show a question: e.g., `"Agar 'kitaab' par 'hum' wala suffix lagao, kya banega?"`
2. Show exactly 2 radio options. One is correct, one is a plausible distractor.
3. Student selects one and taps `"Check Karo"`.
4. If correct: play `AudioFX.play('correct')` (base64 embedded) and show green checkmark.
5. If wrong: play `AudioFX.play('wrong')` and show red X with the correct answer revealed.
6. Log anonymously: `{ lessonId, questionId, wasCorrect }` to Firestore analytics collection (no user ID, no personal data).
7. If >40% of logs for a specific question show `wasCorrect: false`, flag that lesson with `needsReview: true` in the lesson metadata.

**Audio:** Both `correct` and `wrong` sounds are base64-encoded strings stored in `js/audio-fx.js`. No network requests for audio.

**Layout on 390px:** This accordion is collapsed by default. Tapping a `▸ Kya Hoga?` button expands it inline. This prevents it from pushing page content off-screen.

#### 2.1c — Live Word Anatomy Legend
- A horizontal scrollable chip row beneath the SVG.
- Each chip is color-coded by grammatical role (root = blue, suffix = orange, vowel change = red, etc.).
- Tapping a chip highlights the corresponding SVG element.
- On desktop, chips appear as a static legend row (no scroll needed).

#### 2.1d — Before/After Comparison Toggle
- A single two-state toggle button in the visual card header: labeled `[ Asal | Badla Hua ]` (Original | Transformed).
- Toggling replaces the SVG content with the alternate state without a page reload.
- Both states must be pre-rendered in the DOM (use CSS `display:none` toggle, not dynamic SVG generation) to ensure instant switching.

---

### 2.2 — Practice Quiz Engine v2.0

**File structure:** One JSON file per unit — `data/quizzes/unit1.json`, ..., `data/quizzes/unit7.json`.

**Each lesson gets exactly 5 questions.** Total: 113 lessons × 5 = 565 questions.

**Question structure (JSON schema):**
```json
{
  "lessonId": "s1l3",
  "questions": [
    {
      "id": "s1l3-q1",
      "type": "grammar-rule",
      "lang": "hinglish",
      "question": "Jab kisi ism ke aakhir mein 'ون' aaye, toh woh kya hota hai?",
      "options": ["Wahid Muzakkar", "Jama Muzakkar", "Wahid Muannas", "Jama Muannas"],
      "correct": 1,
      "explanation": "ون plural masculine suffix hai — jama muzakkar."
    }
  ]
}
```

**The 5-question structure per lesson:**
- Q1: Grammar rule identification (what rule does this lesson teach?)
- Q2: Apply the rule (given root word, what is the transformed form?)
- Q3: Reverse identification (given transformed word, what is the root and rule?)
- Q4: Vocabulary meaning (Arabic → Hinglish meaning, from lesson vocabulary)
- Q5: Contextual Quranic phrase (identify a phrase from the lesson's Quranic examples)

**Language requirement:** Each of Q1–Q5 must be authored in all 4 languages (`en`, `ur`, `hi`, `hinglish`). The quiz engine selects based on user's active language setting.

**Legacy migration:** Users who completed a lesson quiz in the old format receive their `mastered` badge. They see a subtle `"Naye Sawal Uplabdh Hain ✦"` indicator on the lesson card inviting them to retry.

---

### 2.3 — Mixed-State Deployment

At any point during the overhaul, some lessons will have v2 visuals and others will still use v1. This is expected and supported.

**Lookup logic (already in codebase, do not change the interface):**
```js
const key = `s${unitNum}l${lessonNum}`; // e.g., "s1l3"
if (GrammarVisuals.Registry[key]) {
  GrammarVisuals.Registry[key].mount(containerId);
} else {
  GrammarVisuals.Archetypes[stageArchetype].mount(containerId); // v1 fallback
}
```

**Rule:** Never remove a v1 archetype until ALL 113 lessons have v2 visuals. That happens only in Phase 8.

---

### 2.4 — Diagnostics & Test Harness

#### A — In-App Debug Runner (`?debug=test`)
Accessible by appending `?debug=test` to the app URL. Visible only in non-production builds (check `location.hostname !== 'muallim.app'` or your production hostname).

Runs automatically on load and checks:
1. For every lesson: does `mount(container)` run without throwing?
2. For every lesson: does `destroy()` run and leave zero dangling event listeners? (Use `getEventListeners` in Chrome or a manual WeakRef tracking pattern.)
3. For every quiz JSON: does it parse and contain exactly 5 questions with valid `correct` indices?
4. Outputs a pass/fail report into a floating `<div id="debug-report">` panel overlaid on the app.

#### B — Playwright E2E Suite (`tests/e2e/playtest.spec.js`)
Run via: `npx playwright test`

Required test coverage:
1. Navigation: all 113 lesson routes load without JS errors.
2. Grammar visual: `mount` and `destroy` execute without console errors on at least 1 lesson per unit.
3. Quiz: complete a 5-question quiz, verify score calculation.
4. Language toggle: switch between en/ur/hi/hinglish, verify UI strings change language correctly.
5. Offline: simulate network offline via Playwright, verify SW serves the app.
6. Visual regression: snapshot at 390×844 (mobile) and 1280×800 (desktop) for 5 representative lessons.

---

## §3 — 113-Lesson Master Blueprint

*(The full lesson-by-lesson table specifying grammar visual type, quiz rule focus, and vocabulary count per lesson is defined in the original `MUALLIM_OVERHAUL_PLAN.md` v9.0 file. Agents working on a specific lesson must consult that table. This v10.0 document focuses on system-level requirements and the data accuracy mandate.)*

**Quick unit summary:**

| Unit | Lessons | Grammar Theme | Notes |
|---|---|---|---|
| 1 | L1–L11 | Definite article (ال), plurals | 11 lessons |
| 2 | L1–L16 | Pronouns (هو / هي / هم / هن) | 16 lessons |
| 3 | L1–L18 | Prepositions (في / من / على / إلى) | 18 lessons |
| 4 | L1–L15 | Verb forms (ماضي past tense) | 15 lessons |
| 5 | L1–L23 | Possessive pronouns (هم / هن / كم suffixes) | 23 lessons — DATA BUGS DA-1/DA-2/DA-3 present |
| 6 | L1–L21 | Present tense verbs (يفعل / يفعلون) | 21 lessons — DATA BUGS DA-1/DA-3 present |
| 7 | L1–L10 | Past/present verb conjugation tables | 10 lessons — DATA BUGS DA-1/DA-2/DA-3 present |

---

## §4 — Phase-by-Phase Execution Plan

### Phase Execution Rules (Apply to ALL Phases)
- Complete every item in a phase before starting the next phase.
- If a phase gate check fails, fix the issue in the current phase — do not proceed.
- Each phase ends with a deployment to Firebase (`firebase deploy`). Never batch multiple phases into one deployment.
- After deployment, bump the SW cache version (e.g., `muallim-v3.1.0-cache` for Phase 0).

---

### PHASE 0-DA — Data Accuracy Correction (MUST RUN BEFORE PHASES 5, 6, 7)

**What this phase is:** A data-only correction pass. No UI code is written here. The goal is to fix three confirmed data bugs in Units 5–7 before those units' visuals are built on top of bad data.

**Why it must run first:** Building lesson visuals for U5–U7 on top of wrong `hinglish` values and wrong card ordering is like building a house on a cracked foundation. Fix the foundation first.

**Entry gate (before starting Phase 0-DA):**
- [ ] Access to Firestore project confirmed (Firebase CLI authenticated).
- [ ] All book images confirmed present at `E:\AIPROJECTS\PROJECTS\translate-hinglish-skill\pwa\images\`.
- [ ] `data/da_audit_log.json` file created (empty array `[]` is the initial state).

**Work steps:**

**Step 0-DA-1: Run the DA-3 detection scan**
Before opening a single image, run this heuristic scan across all U5–U7 items in Firestore:
- Retrieve all items where `id` starts with `s5`, `s6`, or `s7`.
- For each item, check its `hinglish` field against the transliteration detection rules in §6.3.
- Write all flagged items to `data/da_audit_log.json` with status `"unresolved"`.
- This gives a priority list of items that definitely need correction.

**Step 0-DA-2: Lesson-by-lesson visual audit**
For each lesson in U5, U6, U7 (in order: U5L1→U5L23, then U6L1→U6L21, then U7L1→U7L10):
1. Open the book images for that lesson. See §7 for the exact image-reading protocol.
2. Run the three DA checks (DA-1, DA-2, DA-3) per the checklist in §6.4.
3. For each issue found, update the corresponding Firestore item and mark as `"resolved"` in the audit log.

**Step 0-DA-3: Commit the audit log**
- `data/da_audit_log.json` must be committed to the repository.
- Every entry must have status `"resolved"` before Phase 5 can start.

**Exit gate (Phase 0-DA is done when ALL of these pass):**
- [ ] `data/da_audit_log.json` has 0 entries with status `"unresolved"`.
- [ ] No U5/U6/U7 item has a `hinglish` value matching the DA-3 transliteration heuristic.
- [ ] No Urdu-script character appears in any Hinglish-mode UI label for U5–U7 lessons.
- [ ] Vocabulary card display order for multi-column lessons matches the book's RTL column-first sequence.

---

### PHASE 0 — Shared Infrastructure Setup

**Entry gate:**
- [ ] Phase 0-DA exit gate fully passed (if working on U5–U7) — or this gate is waived for U1–U4 work.
- [ ] Local dev environment confirmed: browser with DevTools, Firebase CLI installed.

**Deliverables:**

**D0-1: Modular visual loader**
Create `js/visuals/loader.js`:
```js
// @ts-check

/**
 * @type {Map<string, {mount: Function, destroy: Function}>}
 */
const _activeVisual = new Map();

/**
 * Load and mount a lesson's grammar visual.
 * @param {string} lessonKey - Format: "s1l3" (unit 1, lesson 3)
 * @param {string} containerId - DOM element ID to mount into
 */
export async function loadVisual(lessonKey, containerId) {
  // Destroy previous visual to prevent memory leaks
  if (_activeVisual.has(containerId)) {
    _activeVisual.get(containerId).destroy();
    _activeVisual.delete(containerId);
  }

  const unitNum = parseInt(lessonKey.match(/s(\d+)/)[1]);
  let mod;
  try {
    mod = await import(`./unit${unitNum}.js`);
  } catch {
    mod = await import('./archetypes.js'); // v1 fallback
  }
  mod.mount(containerId, lessonKey);
  _activeVisual.set(containerId, mod);
}
```

**D0-2: Service Worker update toast**
In `sw.js`, detect new SW activation and broadcast a message. In `app.js`, listen and display:
```js
// In app.js
navigator.serviceWorker.addEventListener('message', (e) => {
  if (e.data?.type === 'SW_UPDATED') {
    showToast('Naya version uplabdh hai! 🔄 Refresh karein.', { action: 'Refresh', onClick: () => location.reload() });
  }
});
```

**D0-3: CSS base for 390px mobile**
In `css/layout.css`, set the baseline grid:
```css
/* All interactive content must fit within 390px without horizontal scroll */
.lesson-card { max-width: 390px; width: 100%; box-sizing: border-box; }
.chip-row { display: flex; overflow-x: auto; gap: 8px; padding: 4px 0; }
/* Respect OS motion setting — animations are OFF by default */
.animated { animation: none; transition: none; }
@media (prefers-reduced-motion: no-preference) {
  .animated { animation: var(--anim); transition: var(--trans); }
}
```

**D0-4: Playwright test skeleton**
Create `tests/e2e/playtest.spec.js` with at minimum:
- One test per deliverable above (SW toast appears, visual loads, visual destroys cleanly, quiz JSON validates).

**D0-5: Migration logic for quiz scores**
In `js/progress.js`, add:
```js
// If old quiz score exists in format { score: 1, total: 1 }, migrate to new format
// { scores: [null, null, null, null, null], legacy_mastered: true }
```

**Exit gate (Phase 0 done when ALL pass):**
- [ ] `js/visuals/loader.js` exists and passes `// @ts-check` with no errors.
- [ ] SW update toast appears in-app when a new SW is installed (test manually in Chrome DevTools → Application → Service Workers → Update).
- [ ] `css/layout.css` animations are off when OS reduced-motion is on.
- [ ] `tests/e2e/playtest.spec.js` runs without error (some tests may be skipped until content is built, but the file must be valid).
- [ ] `data/quizzes/` directory exists (empty, ready for per-unit JSON files).
- [ ] `js/visuals/` directory exists (empty, ready for per-unit JS files).

---

### PHASES 1–7 — Unit-by-Unit Delivery

Each unit follows identical steps. Replace `{X}` with the unit number (1–7).

**Entry gate for Unit {X}:**
- [ ] Previous unit's exit gate fully passed and deployed to Firebase.
- [ ] For units 5, 6, 7 only: Phase 0-DA exit gate fully passed.

**Deliverables per unit:**

**D{X}-1: Grammar visuals file `js/visuals/unit{X}.js`**
- Contains the `mount(containerId, lessonKey)` and `destroy()` exports.
- Contains individual visual logic for each of the unit's lessons (keyed by `lessonKey`).
- Every visual implements all four components from §2.1 (SVG, Kya Hoga?, Anatomy Legend, Toggle).
- File must start with `// @ts-check` and have JSDoc on all exported functions.

**D{X}-2: Quiz file `data/quizzes/unit{X}.json`**
- Contains exactly 5 questions for each lesson in the unit.
- All questions authored in all 4 languages.
- Follows the JSON schema from §2.2.
- Validated by the in-app debug runner.

**D{X}-3: Visual regression snapshots**
- Run `npx playwright test` and confirm snapshots are captured for at least 3 lessons in the unit.
- No snapshot may show a JS error, blank screen, or layout overflow at 390px.

**D{X}-4: Cache bump**
Update SW cache name: `muallim-v3.{X}.0-cache`.

**Exit gate per unit:**
- [ ] `js/visuals/unit{X}.js` exists, exports `mount` and `destroy`, passes `// @ts-check`.
- [ ] `data/quizzes/unit{X}.json` exists, validates against schema, has exactly 5 questions per lesson.
- [ ] In-app debug runner reports 0 failures for all lessons in Unit {X}.
- [ ] Playwright snapshots captured, no overflow or errors at 390px.
- [ ] Firebase deployed successfully (`firebase deploy` exits 0).
- [ ] SW cache version bumped.
- [ ] **For Unit 5, 6, 7 only:** `data/da_audit_log.json` shows 0 unresolved items for that unit.

---

### PHASE 8 — Global Validation & Final Release

**Entry gate:**
- [ ] All 7 unit exit gates passed.
- [ ] All 565 quiz questions in place across 7 JSON files.
- [ ] All 113 visuals registered in `GrammarVisuals.Registry`.

**Deliverables:**

**D8-1: Full Playwright suite pass**
Every test in `tests/e2e/playtest.spec.js` must pass. Target: 0 failures, 0 skipped.

**D8-2: Remove v1 fallback code**
Remove `GrammarVisuals.Archetypes` from `js/grammar-visuals.js`. All 113 lessons now use v2 visuals — the fallback path is dead code.

**D8-3: Final cache bump**
`muallim-v4.0.0-cache`

**D8-4: Remove debug runner from production**
Confirm `?debug=test` returns 404 or blank when `location.hostname` is the production domain.

**Exit gate:**
- [ ] 100% Playwright pass rate across all 113 lessons.
- [ ] No references to `GrammarVisuals.Archetypes` remain in the codebase.
- [ ] SW cache is `muallim-v4.0.0-cache`.
- [ ] `data/da_audit_log.json` has 0 unresolved entries.
- [ ] Firebase deployed successfully.

---

## §5 — Quality Gates (Complete Definition)

A phase is **not done** until every applicable gate below passes. These are binary — not "mostly passing."

| Gate ID | Check | How to Verify |
|---|---|---|
| QG-1 | Zero memory leaks — `destroy()` removes all event listeners | Run debug runner, check for listener count via Chrome `getEventListeners(document)` before and after `destroy()` |
| QG-2 | All JS files start with `// @ts-check` and have zero IDE type errors | Open each new file in VS Code with TypeScript extension — zero red underlines |
| QG-3 | Exactly 565 quiz questions (113 × 5) across all unit JSON files | `jq '[.[].questions[]] | length' data/quizzes/unit*.json` — sum must equal 565 |
| QG-4 | All quiz questions have exactly 4 options and a `correct` index of 0–3 | Validated by in-app debug runner |
| QG-5 | All quiz questions authored in all 4 languages (`en`, `ur`, `hi`, `hinglish`) | Debug runner checks each question object has all 4 keys |
| QG-6 | 390px layout — no horizontal scroll on any lesson | Playwright viewport `390×844`, check `document.documentElement.scrollWidth <= 390` |
| QG-7 | Animations off when OS reduced-motion enabled | Set OS preference, load app, assert no CSS `animation` or `transition` is playing |
| QG-8 | All SVG interactive elements have `aria-label` | Playwright `$$('[role]')` check, axe-core audit |
| QG-9 | 100% Playwright test pass rate | `npx playwright test` exits 0 |
| QG-10 | `data/da_audit_log.json` — 0 unresolved entries | `jq '[.[] | select(.status == "unresolved")] | length' data/da_audit_log.json` must return `0` |
| QG-11 | Zero Urdu-script in Hinglish-mode UI | Playwright in hinglish mode, scan all visible text for `/[\u0600-\u06FF]/` regex — must return 0 matches in UI chrome |
| QG-12 | Zero transliterations in `hinglish` fields for compound phrases U5–U7 | Run DA-3 heuristic scan (§6.3) — must return 0 flagged items |
| QG-13 | Vocabulary card order matches RTL column-first book layout | Manual spot-check: open book image, compare first 5 cards in app against book's first 5 RTL-order words |

---

## §6 — Data Accuracy Bugs (Full Specification)

> **These are confirmed bugs, not suspected issues.** Direct book image audit on 2026-10-07 verified all three across 12 images spanning U5, U6, and U7. Every agent working on U5–U7 must treat §6 as a hard requirement, not a suggestion.

---

### 6.0 — Bug Audit Evidence Table

| Image | Lesson | DA-1 Urdu Labels | DA-2 Wrong Order | DA-3 Transliteration |
|---|---|---|---|---|
| S5L2p1.png | U5 L2 | ✅ `کالم ١/٢` visible | ✅ Dual-column layout | ➖ No phrase section |
| S5L4p1.png | U5 L4 | ✅ `کالم ١/٢` + 3-col headers | ✅ 3-column RTL | ➖ No phrase section |
| S5L6p1.png | U5 L6 | ✅ `مثل١/٢/٣` headers | ✅ 3-column RTL, ~48 words | ✅ 30 phrase compounds |
| S5L6p2.png | U5 L6 | ✅ | ✅ | ✅ `صَلَاتُهُمْ عِنْدَ الْبَيْتِ` etc |
| S5L6p3.png | U5 L6 | ✅ | ➖ | ✅ Further phrases |
| S5L7p1.png | U5 L7 | ✅ Preposition section labels | ✅ Multi-section RTL | ✅ `عَلَى صَلَاتِهِمْ` style |
| S5L9p1.png | U5 L9 | ✅ `مطلب/جمع` col headers | ➖ Single column | ✅ Pronoun-prefix phrases |
| S5L10p1.png | U5 L10 | ✅ All 3 col headers Urdu | ✅ 3-col, ~48 words | ✅ Phrase section present |
| S5L12p1.png | U5 L12 | ✅ `حرف/معنی/اسکامعنی` | ➖ Different layout | ✅ `عَلَيْكُمُ اللَّيْلَ` phrases |
| S6L5p1.png | U6 L5 | ✅ Verb def label in Urdu | ➖ Single entry | ✅ `يَكْفُرُ بِالرَّحْمَنِ` |
| S6L8p1.png | U6 L8 | ✅ Verb def label in Urdu | ➖ Single entry | ✅ `يَأْمُرُونَ بِالْقِسْطِ` |
| S7L1p1.jpg | U7 L1 | ✅ `سیکشن ١` label | ✅ 4-column RTL verb table | ➖ Verb-only section |

**All three bugs are systemic. No lesson in U5–U7 should be assumed clean until audited.**

---

### 6.1 — Bug DA-1: Urdu-Script Labels in Hinglish-Mode UI

**What is happening:**
Section headings, column labels, grammar explanations, and group titles appear in Urdu script (Arabic-alphabet Urdu words) when the app is in Hinglish mode.

**Why this is wrong:**
Urdu script and Arabic script are visually identical. A student in Hinglish mode cannot read Urdu script — they use Roman Urdu. Showing `واحد` when the student expects `Wahid` breaks the entire Hinglish learning experience.

**Complete Urdu → Hinglish string map (use these exact replacements):**

| Urdu Script (current WRONG value) | Hinglish Replacement (correct) |
|---|---|
| `واحد` | `Wahid` |
| `جمع` | `Jama` |
| `مثل١` | `Misal 1` |
| `مثل٢` | `Misal 2` |
| `مثل٣` | `Misal 3` |
| `مثال` | `Misal` |
| `کالم ١` | `Pahla Kalam` |
| `کالم ٢` | `Doosra Kalam` |
| `کالم ٣` | `Teesra Kalam` |
| `اسکامعنی` | `Uska Matlab` |
| `معنی` | `Matlab` |
| `حرف` | `Harf` |
| `لفظ` | `Lafz` |
| `مطلب` | `Matlab` |
| `آخر میں` | `Aakhir mein` |
| `سیکشن ١` | `Section 1` |
| `سیکشن ٢` | `Section 2` |
| `ان کا` / `ان کی` | `Unka` / `Unki` |
| `تم لوگوں کا` | `Tum logo ka` |
| `تم لوگوں کی` | `Tum logo ki` |
| `درج ذیل مثالوں پر غور کریں` | `Neeche di gayi misalon par ghor karein` |
| `خالق` | `Khaliq` |
| `خوشخبری` | `Khushkhabri` |
| `بنایا` | `Banaya` |
| `واپس آیا` | `Waapas aaya` |
| `حکم دیا` | `Hukm diya` |
| `نافرمانی` | `Naafarmani` |

**How to find these strings in the codebase:**
1. Search for any Unicode character in range `\u0600–\u06FF` in `.js`, `.json`, and `.html` files.
2. Command: `grep -rn "[\x{0600}-\x{06FF}]" js/ data/ --include="*.js" --include="*.json"` (Linux/Mac) or use VS Code global search with regex `[\u0600-\u06FF]`.
3. Every match that is NOT inside an `item.arabic` or `item.arabic_markup` field is a DA-1 violation.

**Fix:** Replace the Urdu-script string with the Hinglish equivalent from the table above. If a string is not in the table, transliterate it to Roman Urdu and add it to the table for future reference.

---

### 6.2 — Bug DA-2: Wrong Vocabulary Card Ordering

**What is happening:**
The book prints vocabulary tables in multiple columns, read right-to-left (as is standard in Arabic/Urdu typography). The app currently renders vocabulary cards in the wrong sequence — top-to-bottom reading each column from left to right, which is the reverse of the intended order.

**Concrete example from S5L6:**

The book page has a table with 3 columns. In Arabic/Urdu convention, you read the RIGHTMOST column first, going down, then move to the middle column, then the leftmost:

```
┌─────────────────┬─────────────────┬─────────────────┐
│  LEFT col (3rd) │  MID col (2nd)  │  RIGHT col (1st)│  ← Read this column FIRST
├─────────────────┼─────────────────┼─────────────────┤
│    لِبَاسٌ      │   حِسَابٌ       │    رَبٌّ        │  ← Row 1
│    صَلَاةٌ      │   إِسْلَامٌ      │    صِدْقٌ       │  ← Row 2
│    وَلِيٌّ      │    أَمْرٌ       │    نَصْرٌ       │  ← Row 3
└─────────────────┴─────────────────┴─────────────────┘
```

**Correct reading order (right column first, top to bottom, then next column):**
`رَبٌّ` → `صِدْقٌ` → `نَصْرٌ` → ... → `حِسَابٌ` → `إِسْلَامٌ` → `أَمْرٌ` → ... → `لِبَاسٌ` → `صَلَاةٌ` → `وَلِيٌّ` → ...

**Current WRONG app order (left column first, reading rows across):**
`رَبٌّ` → `حِسَابٌ` → `لِبَاسٌ` → `صِدْقٌ` → `إِسْلَامٌ` → `صَلَاةٌ` → ... ← This reads rows left-to-right, which is wrong.

**Wait — this description might be confusing. Let me be explicit:**
The user reported: after `رَبٌّ → رَبُّهُمْ`, the next card should be `حِسَابٌ : حِسَابُهُمْ` (not `لِبَاسٌ`). This confirms the RIGHT column reads: رَبّ, حِسَاب, لِبَاس top-to-bottom. So the order within the right column is top-to-bottom. The bug is the app moves to the NEXT column too early instead of completing the current column first.

**Algorithm for correct ordering (for implementors):**

```
Given: a flat array of N items and columnCount C (from book image)
rowsPerColumn = ceil(N / C)

// Items in the flat array are stored row-by-row (left-to-right, which is wrong)
// We need to re-read them column-by-column from rightmost column

correctOrder = []
for col in range(C - 1, -1, -1):  // C-1 = rightmost, 0 = leftmost
  for row in range(rowsPerColumn):
    flatIndex = row * C + col
    if flatIndex < N:
      correctOrder.append(items[flatIndex])
```

**Implementation options (pick one, never mix):**

Option A — Reorder in data layer:
- Change the physical order of items in the Firestore document for that lesson.
- Risk: If `item.id` encodes position (e.g., `s5l6-v3` for "vocabulary item 3"), reordering changes which ID maps to which word → breaks user progress.
- **Only use this if `item.id` values are NOT position-based.**

Option B — Add `displayOrder` field (PREFERRED):
- Do not change `item.id` or the stored array order.
- Add a `displayOrder: number` field to each item in the lesson.
- The rendering code sorts items by `displayOrder` before rendering cards.
- User progress (keyed by `item.id`) is unaffected.

**Lessons confirmed to have multi-column tables (DA-2 applies):**
U5: L2, L4, L6, L7, L10 (3 columns confirmed), likely L1, L3, L5, L8, L9, L11–L23 (audit required)
U7: L1 (4 columns confirmed)
U6: Single-entry format for most verb lessons — audit required, may not apply.

**How to determine column count from a book image:**
Count the number of vertical dividing lines in the vocabulary table. A table with 2 dividers has 3 columns. See §7 for the image-reading protocol.

---

### 6.3 — Bug DA-3: Arabic Transliteration in `hinglish` Field

**What is happening:**
The `hinglish` field for Quranic compound phrase items in U5–U7 contains romanized Arabic phonetics (transliteration) instead of the actual Hinglish (Roman Urdu) meaning.

**The critical distinction — understand this before touching any data:**

| Type | Example | What it tells the learner |
|---|---|---|
| **Transliteration** (WRONG) | `Al-haqqu mir-Rabbihim` | How to pronounce the Arabic sounds |
| **Hinglish Translation** (CORRECT) | `Unke Rab ki taraf se haq hai` | What the phrase actually means |

A learner reading transliteration hears the Arabic sounds but learns nothing about the meaning. The entire purpose of the app is vocabulary and meaning comprehension. Transliteration in the `hinglish` field is a complete failure of the feature.

**How to tell the difference (rules for any model or agent):**

A `hinglish` value IS a transliteration (wrong) if it:
1. Contains `-uu-`, `-aa-`, `-ii-` (Arabic long vowel romanizations)
2. Contains any of these suffixes without Urdu meaning words: `-uhum`, `-ahum`, `-akum`, `-ihi`, `-ahu`
3. Contains these Arabic article/preposition romanizations: `al-`, `bil-`, `mir-`, `lil-`, `fil-`, `wal-`
4. Contains 0 of these Urdu semantic words: `ka`, `ki`, `ke`, `hai`, `hain`, `mein`, `se`, `ko`, `par`, `woh`, `yeh`, `aur`, `nahi`, `kiya`, `karo`, `hoga`, `tha`, `the`, `thi`

A `hinglish` value IS a correct translation if it:
1. Contains at least 1 Urdu semantic word from the list above
2. Conveys meaning, not sound
3. Would make sense to someone who does not know Arabic

**Confirmed wrong→right examples (use as translation reference):**

| Arabic Phrase | WRONG (current) | CORRECT (replace with) |
|---|---|---|
| `الْحَقُّ مِنْ رَبِّهِمْ` | `Al-haqqu mir-Rabbihim` | `Unke Rab ki taraf se haq hai` |
| `لِلنَّاسِ حِسَابُهُمْ` | `Lin-naasi hisaabuhum` | `Logo ke liye unka hisaab` |
| `صَلَاتُهُمْ عِنْدَ الْبَيْتِ` | `Salaatuhum 'indal-Bayt` | `Unki namaz Bait (Allah) ke paas` |
| `أَمْوَالُهُمْ وَلَا أَوْلَادُهُمْ` | `Amwaaluhum wa laa awlaaduhum` | `Unka maal aur unki aulad nahi` |
| `عَلَيْكُمُ اللَّيْلَ` | `'Alaykumul-layl` | `Tumhare upar raat (ka waqt)` |
| `عَلَيْكُمُ النَّهَارَ` | `'Alaykumun-nahaar` | `Tumhare upar din (ka waqt)` |
| `رَبُّكُمْ` | `Rabbukum` | `Tumhara Rab` |
| `وَلِيُّكُمْ` | `Waliyyukum` | `Tumhara wali / sahara` |
| `عَدُوُّكُمْ` | `'Aduwwukum` | `Tumhara dushman` |
| `مَوْلَاكُمْ` | `Mawlaakum` | `Tumhara maalik / saathi` |
| `يَكْفُرُ بِالرَّحْمَنِ` | `Yakfuru bir-Rahmaan` | `Rahman ka inkar karta hai` |
| `يَأْمُرُونَ بِالْقِسْطِ` | `Ya'muroona bil-qist` | `Insaaf ka hukm dete hain` |
| `عَلَى صَلَاتِهِمْ` | `'Alaa Salaatihim` | `Apni namazon par (qayim)` |
| `مِنْ رَبِّهِمْ` | `Mir-Rabbihim` | `Unke Rab ki taraf se` |
| `فِي مِلَّتِهِمْ` | `Fee millatihim` | `Unke deen mein` |
| `لِرَسُولِهِمْ` | `Li-Rasoolihim` | `Unke Rasool ke liye` |
| `عَلَى قُلُوبِهِمْ` | `'Alaa quloobihim` | `Unke dilon par` |
| `مِنْ يَوْمِهِمْ` | `Min yawmihim` | `Unke din se` |

**How to derive correct translations for phrases NOT in this table:**
1. Break the Arabic phrase into its component words using the lesson's vocabulary list.
2. Each component word's meaning is in the lesson data (`ur` or `en` field).
3. Combine the component meanings in natural Roman Urdu word order.
4. The result is the correct `hinglish` value.
5. Never use an English-Arabic dictionary phonetic system — that produces transliteration.

**Where to write corrections:**
- Update the Firestore document: collection path will be `units/{unitId}/lessons/{lessonId}/items/{itemId}`, or equivalent collection structure in your project.
- Also update the local JSON fixture if one exists for offline fallback.
- Log the change in `data/da_audit_log.json`:
  ```json
  {
    "id": "s5l6-p-14",
    "unit": "5",
    "lesson": "6",
    "arabic": "الْحَقُّ مِنْ رَبِّهِمْ",
    "old_hinglish": "Al-haqqu mir-Rabbihim",
    "new_hinglish": "Unke Rab ki taraf se haq hai",
    "verified_by_page": "S5L6p2.png",
    "status": "resolved",
    "resolved_date": "2026-10-07"
  }
  ```

---

### 6.4 — Per-Lesson Audit Checklist (Run for Every U5–U7 Lesson)

Run this checklist for each lesson before marking that lesson's data clean. Check each box — do not skip steps.

**Checklist for Lesson S{unit}L{lesson}:**

```
[ ] Step 1: Identify all page images for this lesson.
    File pattern: images/S{unit}L{lesson}p{1}.png (then p2, p3... until file does not exist)
    Unit 5 extension: .png
    Unit 6 extension: .png (some lessons may be .jpg — try both)
    Unit 7 extension: .jpg

[ ] Step 2: Open page 1. Count the columns in the vocabulary table.
    - 1 column → DA-2 does not apply to this lesson. Note "DA-2: N/A"
    - 2 columns → DA-2 applies. Column count = 2.
    - 3 columns → DA-2 applies. Column count = 3.
    - 4 columns → DA-2 applies. Column count = 4 (U7 verb tables).

[ ] Step 3: Check DA-1 (Urdu labels).
    - Look at every visible heading, column header, row label, and grammar description.
    - If any text is in Urdu script (Arabic alphabet letters forming Urdu words, NOT Arabic vocabulary), record the exact string.
    - Cross-reference with §6.1 replacement table.
    - Apply fix: replace Urdu string with Hinglish equivalent.
    - Result: PASS (no Urdu labels) or FIXED (corrections applied and logged).

[ ] Step 4: Check DA-2 (word order) — ONLY if column count ≥ 2.
    - Read the RIGHTMOST column of the book table, top to bottom. Note the first 5 words.
    - Open the app for this lesson in Hinglish mode.
    - The FIRST 5 vocabulary cards shown must match the right-column top-5 from the book.
    - If they don't match, apply `displayOrder` fix per §6.2.
    - Result: PASS or FIXED.

[ ] Step 5: Scan all pages for a Quranic phrases section.
    - Indicator: A section showing compound Arabic phrases (not single words).
    - Common section headings (in book, in Urdu): "قرآنی فقروں کا ترجمہ" or similar.
    - If no phrase section found on any page: Note "DA-3: N/A" and skip Step 6.

[ ] Step 6: Check DA-3 (transliteration) — ONLY if a phrase section was found.
    - For each Arabic compound phrase in the section, find the matching item in the database.
    - Apply the DA-3 detection rules from §6.3 to the item's `hinglish` field.
    - If the `hinglish` value is a transliteration: correct it using the reference table in §6.3 or by deriving from component word meanings.
    - Log each correction in data/da_audit_log.json.
    - Result: PASS (no transliterations) or FIXED (corrections applied and logged).

[ ] Step 7: Update da_audit_log.json.
    - Add one summary entry per lesson: { "lesson": "S5L6", "da1": "PASS", "da2": "FIXED", "da3": "FIXED", "items_corrected": 14 }
    - If all three checks are PASS with no fixes needed, still log the lesson as audited.

[ ] Step 8: Mark lesson audit as complete only when all applied checks are PASS or FIXED.
    - NEVER mark FIXED without having actually made the correction in Firestore.
    - NEVER mark PASS without having opened and examined the book image.
```

---

### 6.5 — Image Inventory & Lesson Map

**Unit 5 — PNG format**

| Lesson | Expected Pages | Confirmed Table Type | DA-2 Columns |
|---|---|---|---|
| L1 | 2–3 | Suffix table | Likely 2–3 |
| L2 | 2–3 | Dual-column suffix | 2 confirmed |
| L3 | 2–3 | Suffix table | Likely 2–3 |
| L4 | 2–3 | Triple-column | 3 confirmed |
| L5 | 2–3 | Suffix table | Likely 2–3 |
| L6 | 3 | Triple-column, phrase section | 3 confirmed |
| L7 | 3–4 | Multi-section preposition + phrases | Multi confirmed |
| L8 | 2–3 | Suffix table | Audit required |
| L9 | 2–3 | Single-col pronoun + phrases | Single confirmed |
| L10 | 2–3 | Triple-column | 3 confirmed |
| L11–L23 | 2–3 each | Pattern varies | Audit required |

**Unit 6 — PNG/JPG format**
Most U6 lessons cover a single verb pattern per page (e.g., `يَكْفُرُ`). DA-2 is likely N/A for most U6 lessons. DA-3 and DA-1 are confirmed present.

**Unit 7 — JPG format**
U7 has complex multi-section pages. S7L1 has 38 pages. Each page contains 7 verb forms in a 4-column RTL table. DA-2 applies to verb conjugation tables with a 4-column sort (not 3-column).

---

### 6.6 — `data/da_audit_log.json` Schema

```json
[
  {
    "lesson": "S5L6",
    "audited_date": "2026-10-07",
    "audited_by": "agent-session-id-or-name",
    "pages_viewed": ["S5L6p1.png", "S5L6p2.png", "S5L6p3.png"],
    "da1_result": "FIXED",
    "da2_result": "FIXED",
    "da3_result": "FIXED",
    "corrections": [
      {
        "item_id": "s5l6-p-14",
        "bug": "DA-3",
        "arabic": "الْحَقُّ مِنْ رَبِّهِمْ",
        "old_hinglish": "Al-haqqu mir-Rabbihim",
        "new_hinglish": "Unke Rab ki taraf se haq hai",
        "status": "resolved"
      }
    ],
    "status": "complete"
  }
]
```

Valid status values:
- `"complete"` — all checks passed or fixed, Firestore updated.
- `"in_progress"` — currently being audited.
- `"unresolved"` — issue found but fix not yet applied (blocks phase gate).

---

## §7 — Visual Scan Protocol (How to Read Book Images Accurately)

> This section is specifically for any agent or model performing image-based book audits. Follow these rules exactly to avoid hallucination errors.

### 7.1 — Before Looking at Any Image

1. **State your assumption out loud before opening the image:** "I am about to look at `S5L6p1.png`. I expect to see a vocabulary table with Arabic words. I will note what I actually see, not what I expect."
2. **Do not infer content from lesson number or unit theme.** Look at the actual image. S5L9 may have a different table structure than S5L6 even though they are in the same unit.
3. **If an image file does not exist**, report it as missing — do not assume the lesson has no content.

### 7.2 — Reading the Image

When viewing a book image scan:

**Step A — Identify the page type.** The page is one of:
- **Title page:** Shows unit and lesson number only (e.g., `يونٹ 5 سبق 1`). No content. Move to next page.
- **Grammar introduction page:** Shows the main word transformation at the top (e.g., `كِتَابٌ ← كِتَابُهُمْ`) and example rows. This page explains the lesson's grammar rule.
- **Vocabulary list page:** Shows a multi-column table of Arabic words with their transformed forms.
- **Quranic phrases page:** Shows full Arabic phrase compounds (multiple words, from Quran verses).
- **Combined page:** May contain both vocabulary and phrase sections.

**Step B — For vocabulary tables, read COLUMN COUNT precisely.**
- Count the number of columns by counting the header row cells, not the dividing lines.
- A table with header cells `[لفظ] [←] [كالم١] [كالم٢]` has vocabulary in 2 columns (ignore the arrow column).
- Write down: "This table has N vocabulary columns."
- Do NOT guess the column count — count it explicitly from the image.

**Step C — For RTL column ordering, read the RIGHTMOST column first.**
- In Arabic/Urdu tables, content flows right-to-left.
- The column on the RIGHT side of the page is Column 1 (read first).
- Read all words in Column 1 top-to-bottom. Write them down.
- Then Column 2 (next to the left). Write them down.
- Then Column 3 (leftmost). Write them down.
- This sequence is the correct `displayOrder`.

**Step D — For Quranic phrase sections, read each phrase as a unit.**
- Each row in the phrase section is one item: an Arabic compound phrase on the right, a translation blank on the left.
- The book provides the Arabic phrase. The student writes the translation.
- The app should show the Arabic phrase + the Hinglish translation (what the student would write).
- If the app shows something that sounds like the Arabic phrase read aloud (not the meaning), that is DA-3.

**Step E — For UI labels and headings, distinguish Arabic vocabulary from Urdu labels.**
- Arabic vocabulary (item.arabic): stands alone in large font, represents a word being taught. Leave it in Arabic script.
- Urdu label: appears in smaller text, labels a column or section, is written in Urdu (using Arabic alphabet but as Urdu language). These must be replaced with Hinglish.
- How to distinguish: Urdu labels are Urdu words (common Urdu vocabulary like "مثال", "کالم", "معنی"). Arabic vocabulary is Quranic/Arabic (like "رَبٌّ", "كِتَابٌ"). When in doubt, check if the word appears in the lesson vocabulary list — if yes, it is Arabic vocabulary. If no, it is likely a Urdu label.

### 7.3 — Recording What You See

After viewing each image, write a brief observation note before making any changes:

```
Image: S5L6p1.png
Page type: Grammar intro + vocabulary list
Columns: 3 (right col = رَبّ, حِسَاب, لِبَاس... ; mid col = صَلَاة, إِسْلَام...; left col = صِدْق...)
Urdu labels spotted: مثل١, مثل٢, مثل٣ (column headers)
Phrase section: Not on this page (see p2)
DA-1: Apply fix — replace مثل١/٢/٣ with Misal 1/2/3
DA-2: Apply fix — right col words should be first 16 cards
DA-3: Not applicable on this page
```

Only after writing this note, proceed to make corrections.

### 7.4 — Hallucination Prevention Rules

These rules prevent common model errors during image audits:

| Rule | Wrong Behavior | Correct Behavior |
|---|---|---|
| Never infer from lesson number | Assuming L7 is like L6 because they are adjacent | Open L7's image and read it independently |
| Never infer from unit theme | Assuming all U5 lessons have 3-column tables because L6 does | Count columns on each lesson's own image |
| Never fabricate page content | Describing words "likely present" on a page not yet opened | Only describe what is visible in the opened image |
| Never skip pages | Checking only p1 when the phrase section is on p2 | Open all pages for each lesson (p1, p2, p3...) |
| Never translate from memory | Writing a Hinglish translation based on what you "know" the phrase means | Derive from component words in lesson vocabulary list |
| Never mark PASS without checking | Marking a lesson clean because it "probably doesn't have phrases" | Run every applicable step of the §6.4 checklist |
| Never mark FIXED without updating Firestore | Writing the correction in the log but not in the database | Update Firestore first, then log as resolved |

---

## §8 — Glossary

| Term | Definition |
|---|---|
| **Hinglish** | Roman Urdu — Urdu language written in Latin alphabet. Example: `"Kitaab mein"` instead of `"کتاب میں"`. |
| **Transliteration** | Phonetic romanization of Arabic sounds. Example: `"fil-kitaabi"`. This is NOT Hinglish — it tells you how to pronounce Arabic, not what it means. |
| **Tashkeel** | Arabic diacritical marks (harakat) — the small vowel marks on Arabic text (◌َ ◌ِ ◌ُ ◌ً ◌ٍ ◌ٌ ◌ّ ◌ْ). Must never be removed. |
| **RTL** | Right-to-Left. Arabic and Urdu text and tables read from right to left. |
| **Lesson key** | A short string identifying a specific lesson: `s{unit}l{lesson}` — e.g., `s5l6` = Unit 5 Lesson 6. |
| **displayOrder** | A field added to each item indicating its position in the rendered card list. Used to fix DA-2 without changing item IDs. |
| **DA-1 / DA-2 / DA-3** | The three confirmed data bugs in U5–U7. DA-1 = Urdu labels, DA-2 = wrong card order, DA-3 = transliteration in hinglish field. |
| **v1 visual** | Old grammar visual — one of 30 bespoke or 83 archetype visuals in `js/grammar-visuals.js`. |
| **v2 visual** | New bespoke grammar visual with `mount()/destroy()`, Kya Hoga?, Anatomy Legend, and Toggle. |
| **da_audit_log.json** | The canonical record of every DA bug found and fixed. A phase gate cannot pass if this file has unresolved entries. |
