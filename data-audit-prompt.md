# Muallim ul-Qur'an — Complete Audit Prompt
## Visual Data Verification + PWA Quality Audit
## VERSION 3.0 — Rewritten 2026-08-25 after S7L1 post-mortem

---

> **You are a new agent reading this file in a new session.**
>
> This document is your complete, self-contained mission brief. Read ALL sections
> before opening any file or writing any code. Execute phases in the order written.
> Stop at every **GATE** marker and wait for explicit user approval before continuing.
>
> **CURRENT STATUS (read before anything else):**
> All sentence_number phases (A0-A11, B0-B4) were marked DONE in v2.0.
> **NEW WORK REQUIRED:** A full re-audit of all stages with image verification.
> This is Phase C0-C7. Start at Phase **C0** in a fresh session.

---

## WHAT WENT WRONG WITH S7L1 — POST-MORTEM (MUST READ)

S7L1 showed **blank content** in the PWA despite being counted as complete.
Five root causes identified and five new constraints added (C16-C20):

**RC1 — Stub status ignored:**
S7L1 had "status": "template" — ignored by the audit script.
→ C16: Check items:[] AND "status":"template" in every audit.

**RC2 — Wrong schema for lesson type:**
S7L1 is a grammar-reference lesson (38 pages, 9 content sections).
The stub template had 2 sections with empty arrays — completely wrong.
→ C17: View first image, classify lesson: PRACTICE/VOCAB/GRAMMAR-REF/STUB.

**RC3 — app.js silently discarded unknown section types:**
exercise_header, qn_label, section_label had no rendering code — zero HTML.
→ C18: After JSON changes, verify every section type has a rendering block.
→ FIXED 2026-08-25: all three types now render in app.js + styles.css.

**RC4 — Image/item ratio never checked:**
S7L1 had 38 images but only 2 items — never flagged.
→ C19: If img_count/item_count > 3 and items < 10 → POTENTIAL-EMPTY.

**RC5 — Census counted sections not items:**
S7L1 had items:[] arrays that looked like items but were empty.
→ C20: Census must check len(items) > 0, not just section existence.

---

## LESSONS LEARNED (L1-L16)

L1:  Section IDs may be UUIDs — use startswith() matching in fix scripts.
L2:  Always add: import sys; sys.stdout.reconfigure(encoding='utf-8')
L3:  Bundle once per phase: python scripts/bundle_pwa_data.py
L4:  Stub signals: "status":"template" OR items:[] OR img/item ratio > 3.
L5:  sentence_number resets to 1 at each new printed subsection (C2).
L6:  Overflow data: when item_count > img predictions, check NEXT lesson.
L7:  Exercise-only sections: ALL items get sn 1..N.
L8:  Run census BEFORE opening any image.
L9:  Fix script template: see REFERENCE SCRIPTS section.
L10: 3-step loop: CENSUS → IMAGE → FIX.
L11: Grammar-reference lessons require full JSON rebuild from images.
L12: After JSON change, verify all section types render in app.js.
L13: Stages 1-5 = .png  |  Stages 6-7 = .jpg
L14: grammar_banner on FIRST item of each named group only.
L15: page_start must match actual first textbook page. title must be readable.
L16: status must be "complete" after build, "stub" for empty, never "template".

---

## CONSTRAINT LEDGER (20 Active)

C1.  Never invent sentence_number. Read from image. Unclear → null.
C2.  sentence_number resets to 1 at each new PRINTED subsection.
C3.  sentence_number belongs only on items with a printed margin number.
C4.  Never invent rule_paragraph text. Copy verbatim.
C5.  Match JSON items to image items by Arabic text, not array index.
C6.  Every V4 JSON change must propagate: python scripts/bundle_pwa_data.py
C7.  Preserve all item fields (id, arabic, hinglish, is_filled). Never delete.
C8.  is_filled is NOT in scope.
C9.  Stage 6-7 images = .jpg. Stages 1-5 = .png.
C10. V4 JSON is source of truth. Fix V4 first, then bundle.
C11. pwa/final-book-7units.html is UNTOUCHABLE. Never edit it.
C12. Part C re-audit must be done after A+B to catch schema mismatches.
C13. Stop at every GATE. No "proceed" from user = no action.
C14. Every phase produces exactly one primary artifact.
C15. Log every change: old value → new value.
C16. (NEW) Check items:[] separately. "status":"template" = STUB.
C17. (NEW) View first image, classify: PRACTICE/VOCAB/GRAMMAR-REF/STUB.
C18. (NEW) After JSON change, verify every section type renders in app.js.
C19. (NEW) img_count/max(item_count,1) > 3 and items < 10 → POTENTIAL-EMPTY.
C20. (NEW) Census must check len(items) > 0, not just section existence.

---

## PROJECT MAP

### File Roles
| Path | Role | Touch? |
|---|---|---|
| pwa/final-book-7units.html | Original 2.5 MB monolith | NEVER |
| pwa/app.js | JS rendering | Add new section type renderers |
| pwa/styles.css | CSS | Add CSS for new types |
| pwa/pwa_book_data.js | Compiled data bundle | After every JSON fix (via bundle) |
| Data-Version-4-till-stage-7-latest-and-final/ | Source-of-truth JSON | PRIMARY EDIT TARGET |
| images/ | Scanned workbook images | Read-only |
| scripts/bundle_pwa_data.py | Regenerates pwa_book_data.js | Run after any JSON fix |

### Image Inventory
| Stage | Lessons | Images | Format | Pattern |
|---|---|---|---|---|
| 1 | S1L1-S1L19 (19) | 37 | .png | images/S1L{N}p{P}.png |
| 2 | S2L1-S2L13 (13) | 23 | .png | images/S2L{N}p{P}.png |
| 3 | S3L1-S3L10 (10) | 26 | .png | images/S3L{N}p{P}.png |
| 4 | S4L1-S4L18 (18) | 38 | .png | images/S4L{N}p{P}.png |
| 5 | S5L1-S5L23 (23) | 71 | .png | images/S5L{N}p{P}.png |
| 6 | S6L1-S6L21 (21) | 81 | .jpg | images/S6L{N}p{P}.jpg |
| 7 | S7L1-S7L10 (10) | 167 | .jpg | images/S7L{N}p{P}.jpg |
| Total | 114 | 443 | mixed | |

### Rendered Section Types (app.js — as of 2026-08-25)
hero_header, rule_paragraph, grace_box, grid, three_col_list, waw_grid,
two_col_numbered_list, verse_block, exercise_verses,
section_label (NEW), exercise_header (NEW), qn_label (NEW)

---

## PART C — FULL CONTENT AUDIT (NEW WORK)

Phases C0-C7 go beyond sn-only checking. They verify schema correctness,
items[] population, lesson type, and app.js rendering for all 114 lessons.

---

### Phase C0 — Master Census (All 114 Lessons)

Goal: Produce a complete triage table using all four new checks (C16-C19).

Run: python scripts/census_full_v3.py

The census_full_v3.py script is in scripts/ folder.
It outputs a triage table and saves scripts/audit_report_c0_census.json.

Triage labels:
  STUB           — items:[] in every section OR status=template
  POTENTIAL-EMPTY — ratio > 3 and item_count < 10 and img_count > 5
  NEEDS-SN       — items exist but no sentence_numbers set
  PARTIAL-SN     — some sn set, some missing
  OK             — fully populated

Report format:
  PHASE C0 COMPLETE
  Total: 114 | STUB: N | POTENTIAL-EMPTY: N | NEEDS-SN: N | PARTIAL: N | OK: N

GATE C0 — Wait for: "Proceed with C1"

---

### Phase C1 — Stage 7 Full Re-Audit (Priority 1)

Goal: Re-verify all 10 Stage 7 lessons. Verify S7L1 rebuild.

S7L1 rebuild verification (2026-08-25 build):
  1. Census shows total_items >= 400, status="complete", 16 sections
  2. S7L1p1.jpg: sec1_vocab grid matches 3-letter verb list (kha-la-qa first)
  3. S7L1p3.jpg: sec2_patterns prefix groups (fa-, thumma, allazi, qad, idh...)
  4. S7L1p6.jpg: sec3_quran starts with kha-la-qa group
  5. S7L1p15.jpg: sec4_practice sn=1 matches printed number in margin

For S7L2-S7L10: view p1 image, classify lesson, view all pages, fix sn.

Image pattern: images/S7L{N}p{P}.jpg (all Stage 7 images are .jpg)

Run census script: python scripts/census_stage7_v3.py
Fix sn if needed: python scripts/fix_stage7_v3.py
Bundle: python scripts/bundle_pwa_data.py

Deliverable: scripts/audit_report_c1_stage7.json

GATE C1 — Wait for: "Proceed with C2"

---

### Phase C2 — Stage 6 Re-Audit (21 lessons, 81 images)

For each non-OK lesson from census:
  1. View first image (S6L{N}p1.jpg) — classify lesson type
  2. If GRAMMAR-REF or wrong schema — rebuild JSON from images
  3. If NEEDS-SN only — use fix script
  4. Bundle

Deliverable: scripts/audit_report_c2_stage6.json

GATE C2 — Wait for: "Proceed with C3"

---

### Phase C3 — Stage 5 Re-Audit (23 lessons, 71 images)

Priority checks:
  Known stubs: S5L5,S5L6,S5L7,S5L9,S5L13,S5L17,S5L18,S5L19
    → Verify status="stub" (NOT "complete" or "template")
  S5L16 items[74]-[99]: confirm they belong to S5L16, not S5L17
  S5L21: 17 idiom sections, 200+ items — verify all have sn

Deliverable: scripts/audit_report_c3_stage5.json

GATE C3 — Wait for: "Proceed with C4"

---

### Phase C4 — Stage 4 Re-Audit (18 lessons, 38 images)

Priority checks:
  S4L4: two-group lesson — verify sn resets between groups (C2)
  S4L8: 45 sn items — verify count
  S4L16: 47 items in correct section — verify

Deliverable: scripts/audit_report_c4_stage4.json

GATE C4 — Wait for: "Proceed with C5"

---

### Phase C5 — Stage 3 Re-Audit (10 lessons, 26 images)

Target: 30 minutes. Run census, fix any issues, bundle.
Deliverable: scripts/audit_report_c5_stage3.json

GATE C5 — Wait for: "Proceed with C6"

---

### Phase C6 — Stages 1-2 Re-Audit (32 lessons, 60 images)

Target: 45 minutes. Run census for both, fix issues, bundle.
Deliverable: scripts/audit_report_c6_stages1_2.json

GATE C6 — Wait for: "Proceed with C7"

---

### Phase C7 — Final Verification

Step 1: Re-run C0 census — all lessons must be OK or STUB.
Step 2: Run: python scripts/check_section_types.py
         Verify zero RENDER-GAPs.
Step 3: python scripts/bundle_pwa_data.py
        python scripts/verify_audit_sync.py
Step 4: python scripts/final_counts.py

Report format:
  PHASE C7 FINAL
  Lessons: 114 | Complete: N | Stubs: N
  Total items: N | Total sn: N
  Render-gaps: 0 | Sync issues: 0
  Constraints C1-C20: all HELD | PWA ready: YES

GATE C7 — FINAL — Wait for: "Done, deploy"

---

## REFERENCE SCRIPTS

### census_full_v3.py (save to scripts/ and run)
See full script in Phase C0 (too long to inline here).
Outputs: triage table + scripts/audit_report_c0_census.json

### check_section_types.py
Scans all JSON files and checks every section type against the known-rendered list.
Flags any RENDER-GAP that needs to be added to app.js.

### verify_audit_sync.py (already exists)
Run: python scripts/verify_audit_sync.py
Verifies all lesson keys exist in pwa_book_data.js.

### Fix Script Template
FIXES dict format:
  filename: { section_id_or_prefix: 'ALL' or [(start_idx, end_idx), ...] }
  'ALL' = every item gets sn 1..N (0-based indices)
  [(s,e)] = items at indices s..e get sn 1..(e-s+1); rest get sn=null
  Multiple tuples = multiple groups, sn resets to 1 for each
Always backup before fixing: shutil.copy2(filepath, backup_path)

---

## DEPLOYMENT

Repo: https://github.com/nomaanc/muallim
Live: https://nomaanc.github.io/muallim/
Git root: e:\AIPROJECTS\PROJECTS\translate-hinglish-skill\pwa\
(git initialized 2026-08-25, remote = origin/main)

To deploy:
  cd "e:\AIPROJECTS\PROJECTS\translate-hinglish-skill\pwa"
  git add app.js styles.css pwa_book_data.js
  git commit -m "fix: [description]"
  git push origin main
  (Use GitHub PAT as password if prompted)
  GitHub Pages deploys in ~60 sec.

---

## COMPLETION STATUS

| Phase | Target | Status | Notes |
|---|---|---|---|
| A0-A11 | sn audit all stages | DONE | 3861 sn set |
| B0-B4 | PWA quality | DONE | 15/15 PASS |
| S7L1 rebuild | Grammar-ref lesson | DONE 2026-08-25 | 406 items |
| app.js new types | exercise_header, qn_label, section_label | DONE 2026-08-25 | |
| styles.css classes | .section-label-heading etc | DONE 2026-08-25 | |
| C0 | Master census (new checks) | TODO | Start here |
| C1 | Stage 7 re-audit + S7L1 verify | TODO | Priority 1 |
| C2 | Stage 6 re-audit | TODO | |
| C3 | Stage 5 re-audit | TODO | |
| C4 | Stage 4 re-audit | TODO | |
| C5 | Stage 3 re-audit | TODO | |
| C6 | Stages 1-2 re-audit | TODO | |
| C7 | Final verify + deploy | TODO | |

Version 3.0 — 2026-08-25
