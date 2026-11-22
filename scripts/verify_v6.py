#!/usr/bin/env python3
"""
Muallim ul-Qur'an PWA v6.0 — Reusable Verification & Invariant Gate.

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
from typing import Any

ROOT = pathlib.Path(__file__).resolve().parent.parent

TAG_RE = re.compile(r"<[^>]+>")
URDU_BAD_CHARS_RE = re.compile(r"[\u06CC\u06A9]")  # ی (Farsi yeh) / ک (Keheh)
MASHQ_RE = re.compile(r"\bmashq\b", re.IGNORECASE)
SCRIPT_LEAK_RE = re.compile(r"[\u0900-\u097F\u0600-\u06FF]")
URDU_SCRIPT_RE = re.compile(r"[\u0600-\u06FF]")
DEVA_SCRIPT_RE = re.compile(r"[\u0900-\u097F]")

UNIT_SIZE_BUDGETS = {
    1: 1_048_576,  # 1.0 MB
    2: 1_048_576,  # 1.0 MB
    3: 1_048_576,  # 1.0 MB
    4: 1_572_864,  # 1.5 MB
    5: 3_670_016,  # 3.5 MB
    6: 3_984_588,  # 3.8 MB
    7: 6_291_456,  # 6.0 MB
}

SEARCH_INDEX_BUDGET = 4_718_592  # 4.5 MB
STYLES_CSS_BUDGET = 61_440       # 60 KB
LAYOUT_CSS_BUDGET = 35_840       # 35 KB

PRUNED_FILES = [
    "teacher.html",
    "admin.html",
    "js/grammar-visuals.js",
    "data/lessons",
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


def verify_units(failures: list[str]) -> list[dict[str, Any]]:
    meta_path = ROOT / "data" / "metadata.json"
    if not meta_path.exists():
        failures.append("Missing data/metadata.json")
        return []

    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    if meta.get("totalLessons") != 114:
        failures.append(f"metadata.json totalLessons={meta.get('totalLessons')} (expected 114)")

    meta_units = meta.get("units", [])
    if len(meta_units) != 7:
        failures.append(f"metadata.json units length={len(meta_units)} (expected 7)")

    unit_rows: list[dict[str, Any]] = []
    total_lessons = 0

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

            if not (is_valid_page(lesson.get("book_page")) or is_valid_page(lesson.get("page_start"))):
                page_errs += 1

            # Check lesson-level text for Mashq
            for field in ("title", "hinglish_Focus"):
                val = lesson.get(field)
                if isinstance(val, str) and MASHQ_RE.search(val):
                    mashq_errs += 1

            seen_ids: set[str] = set()

            for sec in lesson.get("sections", []):
                if "items" in sec:
                    dup_section_items += 1

                sec_data = sec.get("data") or {}
                for field in ("text", "title", "label", "content", "hinglish", "hinglish_combined"):
                    val = sec_data.get(field)
                    if isinstance(val, str) and MASHQ_RE.search(val):
                        mashq_errs += 1
                    val_top = sec.get(field)
                    if isinstance(val_top, str) and MASHQ_RE.search(val_top):
                        mashq_errs += 1

                items = sec_data.get("items") or sec_data.get("verses") or []
                for item in items:
                    if not isinstance(item, dict):
                        continue
                    total_items += 1

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
                        stripped = TAG_RE.sub("", markup)
                        if stripped != arabic:
                            markup_errs += 1

                    if URDU_BAD_CHARS_RE.search(arabic) or (isinstance(markup, str) and URDU_BAD_CHARS_RE.search(markup)):
                        urdu_char_errs += 1

                    hinglish = item.get("hinglish") or ""
                    if isinstance(hinglish, str) and MASHQ_RE.search(hinglish):
                        mashq_errs += 1
                    if isinstance(hinglish, str) and SCRIPT_LEAK_RE.search(hinglish):
                        script_leak_errs += 1

                    trans = item.get("translations")
                    if not isinstance(trans, dict):
                        i18n_errs += 1
                    else:
                        tr_hi_lat = trans.get("hinglish") or ""
                        if isinstance(tr_hi_lat, str) and MASHQ_RE.search(tr_hi_lat):
                            mashq_errs += 1
                        if isinstance(tr_hi_lat, str) and SCRIPT_LEAK_RE.search(tr_hi_lat):
                            script_leak_errs += 1

                        tr_en = trans.get("en")
                        tr_ur = trans.get("ur")
                        tr_hi = trans.get("hi")

                        if not isinstance(tr_en, str) or not tr_en.strip():
                            i18n_errs += 1
                        elif SCRIPT_LEAK_RE.search(tr_en):
                            script_leak_errs += 1

                        if not isinstance(tr_ur, str) or not tr_ur.strip() or not URDU_SCRIPT_RE.search(tr_ur):
                            i18n_errs += 1

                        if not isinstance(tr_hi, str) or not tr_hi.strip() or not DEVA_SCRIPT_RE.search(tr_hi):
                            i18n_errs += 1

        if actual_ids != expected_ids and lesson_id_errs == 0:
            lesson_id_errs += 1

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

    return unit_rows


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

    # Search index budget
    si_p = ROOT / "data" / "search-index.json"
    si_sz = si_p.stat().st_size if si_p.exists() else -1
    record(
        "data/search-index.json budget",
        f"{fmt_kb(si_sz)} < {fmt_kb(SEARCH_INDEX_BUDGET)}",
        0 <= si_sz < SEARCH_INDEX_BUDGET,
    )

    # Fonts wOF2 header
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
    record("Self-hosted wOF2 fonts", ", ".join(font_details), font_ok)

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
        has_cache = "muallim-v6.0.0-cache" in sw_text
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
    parser = argparse.ArgumentParser(description="Verify Muallim ul-Qur'an PWA v6.0 invariants.")
    parser.add_argument("--skip-node", action="store_true", help="Skip node --check JS syntax validation.")
    args = parser.parse_args()

    failures: list[str] = []
    unit_rows = verify_units(failures)
    global_checks = verify_assets_and_shell(failures, skip_node=args.skip_node)

    print("\n=== Muallim ul-Qur'an PWA v6.0 Verification Gate ===\n")
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
