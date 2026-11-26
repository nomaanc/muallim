#!/usr/bin/env python3
"""
Muallim ul-Qur'an PWA v7.0 — Reusable Verification & Invariant Gate.

Exits 0 on full pass, non-zero on any failure.
Prints a per-unit and global summary table.
"""

from __future__ import annotations

import argparse
import json
import pathlib
import re
import shutil
import subprocess
import sys
import unicodedata
from collections import Counter
from typing import Any

ROOT = pathlib.Path(__file__).resolve().parent.parent

TAG_RE = re.compile(r"<[^>]+>")
URDU_BAD_CHARS_RE = re.compile(r"[\u06CC\u06A9]")  # ی (Farsi yeh) / ک (Keheh)
MASHQ_RE = re.compile(r"\bmashq\b", re.IGNORECASE)
SAW_RE = re.compile(r"\(\s*S\.A\.W\.?\s*\)", re.IGNORECASE)
SCRIPT_LEAK_RE = re.compile(r"[\u0900-\u097F\u0600-\u06FF]")
URDU_SCRIPT_RE = re.compile(r"[\u0600-\u06FF]")
DEVA_SCRIPT_RE = re.compile(r"[\u0900-\u097F]")

UNIT_SIZE_BUDGETS = {
    1: 573_440,    # 560 KB (deduplicated & minified)
    2: 573_440,    # 560 KB
    3: 573_440,    # 560 KB
    4: 860_160,    # 840 KB
    5: 1_992_294,  # 1.90 MB
    6: 3_145_728,  # 3.00 MB
    7: 5_452_595,  # 5.20 MB
}

LESSON_STANDARD_BUDGET = 368_640   # 360 KB for standard lessons (107/114)
LESSON_MAX_BUDGET = 1_153_434      # 1.10 MB cap for giant multi-hundred-verse U6/U7 lessons
LARGE_LESSON_EXCEPTIONS = {"s6l3", "s7l1", "s7l2", "s7l3", "s7l4", "s7l8", "s7l10"}

SEARCH_INDEX_BUDGET = 8_388_608    # 8.00 MB (10-field 14,956-entry index with id, hn, hi)
STYLES_CSS_BUDGET = 87_040         # 85 KB
LAYOUT_CSS_BUDGET = 51_200         # 50 KB

PRUNED_FILES = [
    "teacher.html",
    "admin.html",
    "js/grammar-visuals.js",
    "js/visuals/archetypes.js",
    "scripts/apply_i18n_patch.py",
    "data/da_audit_log.json",
    "functions",
    "firebase-messaging-sw.js",
]

REQUIRED_FONTS = [
    "fonts/amiri-quran.woff2",
    "fonts/noto-sans.woff2",
]


def fmt_kb(num_bytes: int) -> str:
    if num_bytes >= 1_048_576:
        return f"{num_bytes / 1_048_576:.2f} MB"
    return f"{num_bytes / 1024:.1f} KB"


def is_valid_page(val: Any) -> bool:
    if isinstance(val, int) and val > 0:
        return True
    if isinstance(val, str) and val.strip():
        return True
    return False


def verify_units(failures: list[str]) -> tuple[list[dict[str, Any]], set[str]]:
    meta_path = ROOT / "data" / "metadata.json"
    if not meta_path.exists():
        failures.append("Missing data/metadata.json")
        return [], set()

    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    if meta.get("totalLessons") != 114:
        failures.append(f"metadata.json totalLessons={meta.get('totalLessons')} (expected 114)")
    if meta.get("totalItems") != 14956:
        failures.append(f"metadata.json totalItems={meta.get('totalItems')} (expected 14956)")

    meta_units = meta.get("units", [])
    if len(meta_units) != 7:
        failures.append(f"metadata.json units length={len(meta_units)} (expected 7)")

    unit_rows: list[dict[str, Any]] = []
    valid_lesson_keys: set[str] = set()
    total_lessons = 0
    total_items_global = 0
    meta_parity_errs = 0
    title_i18n_errs = 0
    saw_errs = 0
    chunk_errs = 0

    for u in range(1, 8):
        u_path = ROOT / "data" / f"unit{u}.json"
        if not u_path.exists():
            failures.append(f"Missing data/unit{u}.json")
            continue

        size_bytes = u_path.stat().st_size
        budget = UNIT_SIZE_BUDGETS[u]
        if size_bytes >= budget:
            failures.append(f"unit{u}.json size {fmt_kb(size_bytes)} exceeds budget {fmt_kb(budget)}")

        raw = json.loads(u_path.read_text(encoding="utf-8"))
        lessons = raw.get("lessons", []) if isinstance(raw, dict) else raw
        n_lessons = len(lessons)
        total_lessons += n_lessons

        meta_u = meta_units[u - 1] if u - 1 < len(meta_units) else {}
        meta_lessons = meta_u.get("lessons", [])
        if meta_u.get("lessonCount") != n_lessons or len(meta_lessons) != n_lessons:
            meta_parity_errs += 1

        lesson_id_errs = 0
        page_errs = 0
        markup_errs = 0
        urdu_char_errs = 0
        mashq_errs = 0
        i18n_errs = 0
        script_leak_errs = 0
        dup_section_items = 0
        dup_item_ids = 0
        total_items = 0

        expected_ids = list(range(1, n_lessons + 1))
        actual_ids = []

        for idx, lesson in enumerate(lessons):
            lid = lesson.get("lesson_id")
            actual_ids.append(lid)
            if not isinstance(lid, int) or isinstance(lid, bool) or lid != idx + 1:
                lesson_id_errs += 1

            lkey = f"s{u}l{lid}"
            valid_lesson_keys.add(lkey)

            if not (is_valid_page(lesson.get("book_page")) or is_valid_page(lesson.get("page_start"))):
                page_errs += 1

            # Check title_i18n completeness and Devanagari Hindi presence
            ti = lesson.get("title_i18n")
            if not isinstance(ti, dict):
                title_i18n_errs += 1
            else:
                for lk in ("hinglish", "en", "ur", "hi"):
                    val = ti.get(lk)
                    if not isinstance(val, str) or not val.strip():
                        title_i18n_errs += 1
                if not DEVA_SCRIPT_RE.search(str(ti.get("hi") or "")):
                    title_i18n_errs += 1
                if not URDU_SCRIPT_RE.search(str(ti.get("ur") or "")):
                    title_i18n_errs += 1

            # Check lesson-level text for Mashq & (S.A.W.)
            for field in ("title", "hinglish_Focus"):
                val = lesson.get(field)
                if isinstance(val, str) and MASHQ_RE.search(val):
                    mashq_errs += 1
                if isinstance(val, str) and SAW_RE.search(val):
                    saw_errs += 1

            seen_ids: set[str] = set()
            lesson_items = 0

            for sec in lesson.get("sections", []):
                if "items" in sec:
                    dup_section_items += 1

                sec_data = sec.get("data") or {}
                if sec.get("type") == "rule_paragraph" and u == 3 and lid == 1:
                    for field in ("text", "content", "hinglish_text"):
                        v = sec_data.get(field)
                        if isinstance(v, str) and "Stage 3" in v:
                            failures.append("U3L1 rule_paragraph still contains raw 'Stage 3'")

                for field in ("text", "title", "label", "content", "hinglish", "hinglish_combined"):
                    val = sec_data.get(field)
                    if isinstance(val, str) and MASHQ_RE.search(val):
                        mashq_errs += 1
                    if isinstance(val, str) and SAW_RE.search(val):
                        saw_errs += 1
                    val_top = sec.get(field)
                    if isinstance(val_top, str) and MASHQ_RE.search(val_top):
                        mashq_errs += 1
                    if isinstance(val_top, str) and SAW_RE.search(val_top):
                        saw_errs += 1

                items = sec_data.get("items") or sec_data.get("verses") or []
                for item in items:
                    if not isinstance(item, dict):
                        continue
                    total_items += 1
                    lesson_items += 1

                    item_id = item.get("id")
                    if item_id is not None:
                        sid = str(item_id)
                        if sid in seen_ids:
                            dup_item_ids += 1
                        else:
                            seen_ids.add(sid)

                    arabic = item.get("arabic") or ""
                    markup = item.get("arabic_markup")
                    if isinstance(markup, str) and markup:
                        if unicodedata.normalize("NFC", markup) != markup:
                            markup_errs += 1
                        stripped = TAG_RE.sub("", markup)
                        if stripped != arabic:
                            markup_errs += 1

                    if URDU_BAD_CHARS_RE.search(arabic) or (isinstance(markup, str) and URDU_BAD_CHARS_RE.search(markup)):
                        urdu_char_errs += 1

                    hinglish = item.get("hinglish") or ""
                    if isinstance(hinglish, str) and MASHQ_RE.search(hinglish):
                        mashq_errs += 1
                    if isinstance(hinglish, str) and SAW_RE.search(hinglish):
                        saw_errs += 1
                    if isinstance(hinglish, str) and SCRIPT_LEAK_RE.search(hinglish):
                        script_leak_errs += 1

                    trans = item.get("translations")
                    if not isinstance(trans, dict):
                        i18n_errs += 1
                    else:
                        tr_hi_lat = trans.get("hinglish") or ""
                        if isinstance(tr_hi_lat, str) and MASHQ_RE.search(tr_hi_lat):
                            mashq_errs += 1
                        if isinstance(tr_hi_lat, str) and SAW_RE.search(tr_hi_lat):
                            saw_errs += 1
                        if isinstance(tr_hi_lat, str) and SCRIPT_LEAK_RE.search(tr_hi_lat):
                            script_leak_errs += 1

                        tr_en = trans.get("en")
                        tr_ur = trans.get("ur")
                        tr_hi = trans.get("hi")

                        if not isinstance(tr_en, str) or not tr_en.strip():
                            i18n_errs += 1
                        elif SCRIPT_LEAK_RE.search(tr_en):
                            script_leak_errs += 1
                        if isinstance(tr_en, str) and SAW_RE.search(tr_en):
                            saw_errs += 1

                        if not isinstance(tr_ur, str) or not tr_ur.strip() or not URDU_SCRIPT_RE.search(tr_ur):
                            i18n_errs += 1
                        if isinstance(tr_ur, str) and SAW_RE.search(tr_ur):
                            saw_errs += 1

                        if not isinstance(tr_hi, str) or not tr_hi.strip() or not DEVA_SCRIPT_RE.search(tr_hi):
                            i18n_errs += 1
                        if isinstance(tr_hi, str) and SAW_RE.search(tr_hi):
                            saw_errs += 1

            # Verify metadata lesson parity
            if idx < len(meta_lessons):
                ml = meta_lessons[idx]
                if (
                    ml.get("number") != lid
                    or ml.get("title") != lesson.get("title")
                    or ml.get("title_i18n") != lesson.get("title_i18n")
                    or ml.get("itemCount") != lesson_items
                ):
                    meta_parity_errs += 1

            # Verify per-lesson chunk
            chunk_path = ROOT / "data" / "lessons" / f"{lkey}.json"
            if not chunk_path.exists():
                chunk_errs += 1
            else:
                csz = chunk_path.stat().st_size
                cap = LESSON_MAX_BUDGET if lkey in LARGE_LESSON_EXCEPTIONS else LESSON_STANDARD_BUDGET
                if csz >= cap:
                    chunk_errs += 1
                try:
                    cdata = json.loads(chunk_path.read_text(encoding="utf-8"))
                    cl = cdata.get("lesson") or {}
                    if cl.get("lesson_id") != lid or cl.get("title") != lesson.get("title"):
                        chunk_errs += 1
                except Exception:
                    chunk_errs += 1

        if actual_ids != expected_ids and lesson_id_errs == 0:
            lesson_id_errs += 1

        total_items_global += total_items
        unit_errors = (
            lesson_id_errs
            + page_errs
            + markup_errs
            + urdu_char_errs
            + mashq_errs
            + i18n_errs
            + script_leak_errs
            + dup_section_items
            + dup_item_ids
        )
        if unit_errors > 0:
            failures.append(
                f"Unit {u} invariants failed: "
                f"lid={lesson_id_errs}, page={page_errs}, markup={markup_errs}, "
                f"urdu_ar={urdu_char_errs}, mashq={mashq_errs}, i18n={i18n_errs}, "
                f"script_leak={script_leak_errs}, dup_sec={dup_section_items}, dup_id={dup_item_ids}"
            )

        unit_rows.append(
            {
                "unit": u,
                "lessons": n_lessons,
                "items": total_items,
                "size": size_bytes,
                "budget": budget,
                "errors": unit_errors,
            }
        )

    if total_lessons != 114:
        failures.append(f"Total lessons across units={total_lessons} (expected 114)")
    if total_items_global != 14956:
        failures.append(f"Total items across units={total_items_global} (expected 14956)")
    if title_i18n_errs > 0:
        failures.append(f"title_i18n completeness/Devanagari/Urdu check failed ({title_i18n_errs} errors)")
    if meta_parity_errs > 0:
        failures.append(f"metadata.json exact lesson/title parity failed ({meta_parity_errs} mismatches)")
    if saw_errs > 0:
        failures.append(f"Found {saw_errs} raw (S.A.W.) string(s); must use ﷺ (U+FDFA)")
    if chunk_errs > 0:
        failures.append(f"Per-lesson chunk validation failed ({chunk_errs} chunk error(s))")

    # Verify metadata.json 9 Spiral Curriculum Pillars
    pillars = meta.get("pillars")
    if not isinstance(pillars, list) or len(pillars) != 9:
        failures.append(f"metadata.json pillars length={len(pillars) if isinstance(pillars, list) else 'missing'} (expected 9)")
    else:
        for p_idx, p in enumerate(pillars, 1):
            if (
                not isinstance(p, dict)
                or p.get("id") != p_idx
                or not p.get("title")
                or not isinstance(p.get("lessons"), list)
                or len(p["lessons"]) == 0
                or not all(lk in valid_lesson_keys for lk in p["lessons"])
                or not p.get("summary")
                or not isinstance(p.get("examples"), list)
                or len(p["examples"]) == 0
            ):
                failures.append(f"metadata.json pillar {p_idx} invalid or references unknown lesson key")

    return unit_rows, valid_lesson_keys


def verify_v7_datasets(failures: list[str], checks: list[tuple[str, str, bool]]) -> None:
    def record(name: str, detail: str, ok: bool) -> None:
        checks.append((name, detail, ok))
        if not ok:
            failures.append(f"{name}: {detail}")

    # 1. Per-lesson chunks summary
    chunk_files = sorted((ROOT / "data" / "lessons").glob("s*l*.json"))
    max_std = max((f.stat().st_size for f in chunk_files if f.stem not in LARGE_LESSON_EXCEPTIONS), default=0)
    max_all = max((f.stat().st_size for f in chunk_files), default=0)
    std_ok = all(f.stat().st_size < LESSON_STANDARD_BUDGET for f in chunk_files if f.stem not in LARGE_LESSON_EXCEPTIONS)
    all_ok = all(f.stat().st_size < LESSON_MAX_BUDGET for f in chunk_files)
    record(
        "Per-lesson chunks (114)",
        f"{len(chunk_files)}/114 files, std max={fmt_kb(max_std)} < 360 KB, U6/7 max={fmt_kb(max_all)}",
        len(chunk_files) == 114 and std_ok and all_ok,
    )

    # 2. Search index schema & completeness
    si_p = ROOT / "data" / "search-index.json"
    si_sz = si_p.stat().st_size if si_p.exists() else -1
    record(
        "data/search-index.json budget",
        f"{fmt_kb(si_sz)} < {fmt_kb(SEARCH_INDEX_BUDGET)}",
        0 <= si_sz < SEARCH_INDEX_BUDGET,
    )
    if si_p.exists():
        si = json.loads(si_p.read_text(encoding="utf-8"))
        req_keys = {"id", "s", "l", "ar", "tr", "hn", "en", "ur", "hi", "root"}
        bad_schema = sum(1 for x in si if not isinstance(x, dict) or not req_keys.issubset(x.keys()))
        miss_id = sum(1 for x in si if not x.get("id"))
        miss_hn = sum(1 for x in si if not str(x.get("hn") or "").strip())
        miss_hi = sum(1 for x in si if not str(x.get("hi") or "").strip())
        record(
            "search-index.json 10-field",
            f"entries={len(si)}/14956, bad_schema={bad_schema}, miss_id={miss_id}, miss_hn={miss_hn}, miss_hi={miss_hi}",
            len(si) == 14956 and bad_schema == 0 and miss_id == 0 and miss_hn == 0 and miss_hi == 0,
        )

    # 3. Quizzes 4-unique-options & balanced correct distribution
    tot_q = 0
    dup_q = 0
    c_dist: Counter[int] = Counter()
    for u in range(1, 8):
        qp = ROOT / "data" / "quizzes" / f"unit{u}.json"
        if not qp.exists():
            failures.append(f"Missing {qp.relative_to(ROOT)}")
            continue
        qdata = json.loads(qp.read_text(encoding="utf-8"))
        for lobj in qdata:
            for q in lobj.get("questions", []):
                tot_q += 1
                c_idx = q.get("correct")
                if isinstance(c_idx, int) and 0 <= c_idx <= 3:
                    c_dist[c_idx] += 1
                opts = q.get("options") or {}
                for lang in ("en", "ur", "hi", "hinglish"):
                    arr = opts.get(lang)
                    if not isinstance(arr, list) or len(arr) != 4 or len(set(arr)) != 4:
                        dup_q += 1
    balanced = all(120 <= c_dist[i] <= 170 for i in range(4))
    record(
        "Quizzes unique & balanced",
        f"qs={tot_q}/570, dups={dup_q}, dist={dict(sorted(c_dist.items()))}",
        tot_q == 570 and dup_q == 0 and balanced,
    )

    # 4. Model papers schema check
    mp_path = ROOT / "data" / "exams" / "model_papers.json"
    mp_ok = False
    mp_detail = "missing"
    if mp_path.exists():
        mp = json.loads(mp_path.read_text(encoding="utf-8"))
        exams = mp.get("papers") or {}
        expected = {
            "vol1": (50, False, None, 5),
            "u4": (50, False, None, 4),
            "u5": (60, False, None, 4),
            "u7": (100, True, 120, 5),
        }
        mp_errs = 0
        tot_ex_items = 0
        for eid, (marks, timed, dur, nsec) in expected.items():
            ex = exams.get(eid) or {}
            secs = ex.get("sections") or []
            if ex.get("totalMarks") != marks or ex.get("timed") != timed or ex.get("durationMinutes") != dur or len(secs) != nsec:
                mp_errs += 1
            for s in secs:
                for it in s.get("items") or []:
                    tot_ex_items += 1
                    ans = it.get("translations") or {}
                    if not all(isinstance(ans.get(k), str) and ans.get(k).strip() for k in ("hinglish", "en", "ur", "hi")):
                        mp_errs += 1
                    if URDU_BAD_CHARS_RE.search(it.get("arabic") or ""):
                        mp_errs += 1
            if eid == "u7" and len(secs) == 5:
                if not all(isinstance(it.get("ayahs"), list) and len(it["ayahs"]) >= 2 for it in secs[2].get("items") or []):
                    mp_errs += 1
                if not all(isinstance(it.get("targetWord"), str) and it["targetWord"] in (it.get("arabic") or "") for it in secs[3].get("items") or []):
                    mp_errs += 1
                if not all(isinstance(it.get("theme_i18n"), dict) for it in secs[4].get("items") or []):
                    mp_errs += 1
        mp_ok = mp_errs == 0 and tot_ex_items > 0
        mp_detail = f"4 exams, {tot_ex_items} items, {mp_errs} errors ({fmt_kb(mp_path.stat().st_size)})"
    record("exams/model_papers.json", mp_detail, mp_ok)

    # 5. Mushaf showcase schema check
    ms_path = ROOT / "data" / "exams" / "mushaf_showcase.json"
    ms_ok = False
    ms_detail = "missing"
    if ms_path.exists():
        ms = json.loads(ms_path.read_text(encoding="utf-8"))
        passages = ms.get("passages") or []
        expected_ranges = ["19:1–11", "62:1–8", "16:15–26", "3:16–22", "2:6–16", "50:1–15"]
        actual_ranges = [p.get("ayahRange") for p in passages]
        ms_errs = 0
        if actual_ranges != expected_ranges:
            ms_errs += 1
        for p in passages:
            bo_cnt = 0
            for sp in p.get("tokens") or []:
                if URDU_BAD_CHARS_RE.search(sp.get("text") or ""):
                    ms_errs += 1
                if sp.get("blackout"):
                    bo_cnt += 1
                    gl = sp.get("gloss") or {}
                    if not all(isinstance(gl.get(k), str) and gl.get(k).strip() for k in ("hinglish", "en", "ur", "hi")):
                        ms_errs += 1
            if not (2 <= bo_cnt <= 6):
                ms_errs += 1
        ms_ok = ms_errs == 0
        ms_detail = f"{len(passages)}/6 passages, {ms_errs} errors ({fmt_kb(ms_path.stat().st_size)})"
    record("exams/mushaf_showcase.json", ms_detail, ms_ok)

    # 6. js/visuals/unit1..7.js chip targetId presence in SVGs
    vis_missing: list[str] = []
    vis_count = 0
    for u in range(1, 8):
        vp = ROOT / "js" / "visuals" / f"unit{u}.js"
        if not vp.exists():
            vis_missing.append(f"unit{u}.js MISSING")
            continue
        vtxt = vp.read_text(encoding="utf-8")
        m = re.search(r"export const visuals = (\{[\s\S]*?\n\});", vtxt)
        if not m:
            vis_missing.append(f"unit{u}.js unparseable")
            continue
        vis = json.loads(m.group(1))
        for lk, cfg in vis.items():
            vis_count += 1
            svg_all = (cfg.get("svgOriginal") or "") + "\n" + (cfg.get("svgTransformed") or "")
            for ch in cfg.get("chips") or []:
                tid = ch.get("targetId") or ""
                if tid and f'class="{tid}"' not in svg_all and f"class='{tid}'" not in svg_all:
                    vis_missing.append(f"{lk}:{tid}")
    record(
        "Visuals chip targetId parity",
        f"{vis_count}/114 visuals, {len(vis_missing)} missing"
        + (f" ({', '.join(vis_missing[:5])})" if vis_missing else ""),
        vis_count == 114 and len(vis_missing) == 0,
    )


def verify_assets_and_shell(failures: list[str], skip_node: bool) -> list[tuple[str, str, bool]]:
    checks: list[tuple[str, str, bool]] = []

    def record(name: str, detail: str, ok: bool) -> None:
        checks.append((name, detail, ok))
        if not ok:
            failures.append(f"{name}: {detail}")

    # CSS budgets
    styles_p = ROOT / "css" / "styles.css"
    layout_p = ROOT / "css" / "layout.css"
    styles_sz = styles_p.stat().st_size if styles_p.exists() else -1
    layout_sz = layout_p.stat().st_size if layout_p.exists() else -1
    record(
        "css/styles.css budget",
        f"{fmt_kb(styles_sz)} < {fmt_kb(STYLES_CSS_BUDGET)}",
        0 <= styles_sz < STYLES_CSS_BUDGET,
    )
    record(
        "css/layout.css budget",
        f"{fmt_kb(layout_sz)} < {fmt_kb(LAYOUT_CSS_BUDGET)}",
        0 <= layout_sz < LAYOUT_CSS_BUDGET,
    )

    # Fonts WOFF2 header
    font_ok = True
    font_details = []
    for rel in REQUIRED_FONTS:
        fp = ROOT / rel
        if not fp.exists():
            font_ok = False
            font_details.append(f"{rel} MISSING")
        else:
            header = fp.read_bytes()[:4]
            if header != b"wOF2":
                font_ok = False
                font_details.append(f"{rel} bad header {header!r}")
            else:
                font_details.append(f"{fp.name} ({fmt_kb(fp.stat().st_size)})")
    record("Self-hosted WOFF2 fonts", ", ".join(font_details), font_ok)

    # Pruned bloat files absent
    present_bloat = [rel for rel in PRUNED_FILES if (ROOT / rel).exists()]
    record(
        "Pruned bloat files absent",
        "0 present" if not present_bloat else f"Found: {', '.join(present_bloat)}",
        len(present_bloat) == 0,
    )

    # sw.js cache name & ASSETS existence
    sw_path = ROOT / "sw.js"
    if not sw_path.exists():
        record("sw.js cache & ASSETS", "sw.js missing", False)
    else:
        sw_text = sw_path.read_text(encoding="utf-8")
        has_cache = bool(re.search(r"muallim-v[67]\.\d+\.\d+-cache", sw_text))
        m_assets = re.search(r"const\s+ASSETS\s*=\s*\[(.*?)\];", sw_text, re.DOTALL)
        missing_assets: list[str] = []
        asset_count = 0
        if m_assets:
            entries = re.findall(r"['\"]([^'\"]+)['\"]", m_assets.group(1))
            asset_count = len(entries)
            for entry in entries:
                norm = entry.lstrip("./")
                if not norm:
                    continue
                if not (ROOT / norm).exists():
                    missing_assets.append(entry)
        else:
            missing_assets.append("<ASSETS array not found>")
        record(
            "sw.js cache & ASSETS",
            f"cache={'ok' if has_cache else 'MISSING'}, {asset_count} assets, {len(missing_assets)} missing"
            + (f" ({', '.join(missing_assets)})" if missing_assets else ""),
            has_cache and len(missing_assets) == 0 and asset_count > 0,
        )

    # index.html dialog count & forbidden refs & Mashq check
    idx_path = ROOT / "index.html"
    if not idx_path.exists():
        record("index.html invariants", "index.html missing", False)
    else:
        idx_text = idx_path.read_text(encoding="utf-8")
        dialog_count = len(re.findall(r"<dialog\b", idx_text, re.IGNORECASE))
        bad_refs = [ref for ref in ("grammar-visuals.js", "admin.html", "teacher.html") if ref in idx_text]
        has_mashq = bool(MASHQ_RE.search(idx_text))
        record(
            "index.html dialogs & refs",
            f"dialogs={dialog_count}/5, forbidden_refs={len(bad_refs)}, mashq={int(has_mashq)}",
            dialog_count == 5 and len(bad_refs) == 0 and not has_mashq,
        )

    # v7.0 data, quizzes, exams, showcase, visuals checks
    verify_v7_datasets(failures, checks)

    # node --check on js/**/*.js and sw.js
    if skip_node:
        checks.append(("node --check JS syntax", "skipped (--skip-node)", True))
    else:
        node_bin = shutil.which("node")
        if not node_bin:
            record("node --check JS syntax", "node not found on PATH (pass --skip-node to bypass)", False)
        else:
            js_files = sorted((ROOT / "js").rglob("*.js"))
            if sw_path.exists():
                js_files.append(sw_path)
            bad_js: list[str] = []
            for jf in js_files:
                proc = subprocess.run(
                    [node_bin, "--check", str(jf)],
                    capture_output=True,
                    text=True,
                )
                if proc.returncode != 0:
                    bad_js.append(f"{jf.relative_to(ROOT)}: {proc.stderr.strip()}")
            record(
                "node --check JS syntax",
                f"{len(js_files)} files checked, {len(bad_js)} errors"
                + (f" -> {bad_js[0]}" if bad_js else ""),
                len(bad_js) == 0,
            )

    return checks


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify Muallim ul-Qur'an PWA v7.0 invariants.")
    parser.add_argument("--skip-node", action="store_true", help="Skip node --check JS syntax validation.")
    args = parser.parse_args()

    failures: list[str] = []
    unit_rows, _ = verify_units(failures)
    global_checks = verify_assets_and_shell(failures, skip_node=args.skip_node)

    print("\n=== Muallim ul-Qur'an PWA v7.0 Verification Gate ===\n")
    print(f"{'Unit':<8} {'Lessons':>8} {'Items':>8} {'Size':>10} {'Budget':>10} {'Status':>8}")
    print("-" * 58)
    tot_lessons = 0
    tot_items = 0
    tot_size = 0
    for r in unit_rows:
        tot_lessons += r["lessons"]
        tot_items += r["items"]
        tot_size += r["size"]
        st = "PASS" if r["errors"] == 0 and r["size"] < r["budget"] else "FAIL"
        print(
            f"Unit {r['unit']:<3} {r['lessons']:>8} {r['items']:>8} "
            f"{fmt_kb(r['size']):>10} {fmt_kb(r['budget']):>10} {st:>8}"
        )
    print("-" * 58)
    print(f"{'TOTAL':<8} {tot_lessons:>8} {tot_items:>8} {fmt_kb(tot_size):>10} {'':>10} {'':>8}\n")

    print(f"{'Global Check':<32} {'Result':<8} Detail")
    print("-" * 76)
    for name, detail, ok in global_checks:
        print(f"{name:<32} {'PASS' if ok else 'FAIL':<8} {detail}")

    print("-" * 76)
    if failures:
        print(f"\nRESULT: FAIL ({len(failures)} issue(s))")
        for f in failures:
            print(f"  - {f}")
        return 1

    print("\nRESULT: PASS (all invariants verified)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
