#!/usr/bin/env python3
"""Optimize Muallim ul-Qur'an unit datasets and rebuild search-index.json.

Operations:
1. Deduplicates redundant `section.items` vs `section.data.items` across
   `data/unit1.json`..`data/unit7.json` into a single canonical
   `section.data.items`, preserving all immutable item `id`s and fields.
2. Validates 100% Arabic harakat parity:
   `re.sub(r'<[^>]+>', '', item['arabic_markup']) == item['arabic']`.
3. Rebuilds `data/search-index.json` preserving schema `{s, l, ar, tr, en, ur, root}`.
4. Minifies `unit1.json`..`unit7.json` and `search-index.json` as UTF-8 JSON.

Supports `--dry-run` (default read-only verification) and `--output-dir` so
callers can verify savings without modifying committed files.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Any

TAG_RE = re.compile(r"<[^>]+>")
ARABIC_SCRIPT_RE = re.compile(r"[\u0600-\u06FF]")

TRANSLIT_MAP: dict[str, str] = {
    "ا": "a",
    "أ": "a",
    "إ": "i",
    "آ": "aa",
    "ٱ": "a",
    "ب": "b",
    "ت": "t",
    "ث": "th",
    "ج": "j",
    "ح": "h",
    "خ": "kh",
    "د": "d",
    "ذ": "dh",
    "ر": "r",
    "ز": "z",
    "س": "s",
    "ش": "sh",
    "ص": "s",
    "ض": "d",
    "ط": "t",
    "ظ": "z",
    "ع": "'",
    "غ": "gh",
    "ف": "f",
    "ق": "q",
    "ك": "k",
    "ل": "l",
    "م": "m",
    "ن": "n",
    "ه": "h",
    "ة": "h",
    "و": "w",
    "ي": "y",
    "ى": "a",
    "ء": "'",
    "ؤ": "'",
    "ئ": "'",
    "َ": "a",
    "ُ": "u",
    "ِ": "i",
    "ً": "an",
    "ٌ": "un",
    "ٍ": "in",
    "ٰ": "aa",
    "ْ": "",
    "ّ": "",
    "ـ": "",
    "ۡ": "",
}


def configure_utf8_stdio() -> None:
    """Ensure UTF-8 output on Windows PowerShell consoles."""
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            try:
                stream.reconfigure(encoding="utf-8")
            except Exception:
                pass


def transliterate_arabic(text: str) -> str:
    """Transliterate vocalized Arabic text to lowercase ASCII search tokens."""
    out: list[str] = []
    for ch in text:
        if ch in TRANSLIT_MAP:
            out.append(TRANSLIT_MAP[ch])
        elif ch.isascii() and ch.isalnum():
            out.append(ch.lower())
        elif ch.isspace():
            out.append(" ")
    return re.sub(r"\s+", " ", "".join(out)).strip()


def merge_item_dicts(primary: dict[str, Any], secondary: dict[str, Any]) -> dict[str, Any]:
    """Merge two item objects while preserving primary values and non-empty fields."""
    merged = dict(secondary)
    for key, val in primary.items():
        if key == "translations" and isinstance(val, dict) and isinstance(merged.get("translations"), dict):
            tr_merged = dict(merged["translations"])
            for tk, tv in val.items():
                if tv is not None and tv != "":
                    tr_merged[tk] = tv
            merged["translations"] = tr_merged
        elif val is not None and val != "":
            merged[key] = val
        elif key not in merged:
            merged[key] = val
    return merged


def deduplicate_section_items(section: dict[str, Any]) -> tuple[int, int]:
    """Ensure section items reside solely under `section['data']['items']`.

    Returns (sections_deduplicated, duplicate_items_removed).
    """
    if "items" not in section:
        return (0, 0)

    top_items = section.pop("items")
    data = section.get("data")
    if not isinstance(data, dict):
        data = {}
        section["data"] = data

    data_items = data.get("items")
    if not isinstance(data_items, list) or len(data_items) == 0:
        if isinstance(top_items, list):
            data["items"] = top_items
        return (1, 0)

    if not isinstance(top_items, list) or top_items == data_items:
        removed = len(top_items) if isinstance(top_items, list) else 0
        return (1, removed)

    # Merge any differing items cleanly by immutable item id without dropping records
    by_id: dict[Any, dict[str, Any]] = {}
    for item in top_items:
        if isinstance(item, dict) and "id" in item:
            by_id[item["id"]] = item

    merged_list: list[Any] = []
    seen_ids: set[Any] = set()
    for item in data_items:
        if isinstance(item, dict) and "id" in item:
            iid = item["id"]
            seen_ids.add(iid)
            if iid in by_id:
                merged_list.append(merge_item_dicts(item, by_id[iid]))
            else:
                merged_list.append(item)
        else:
            merged_list.append(item)

    for item in top_items:
        if isinstance(item, dict) and "id" in item and item["id"] not in seen_ids:
            merged_list.append(item)

    data["items"] = merged_list
    return (1, len(top_items))


def minify_json_bytes(payload: Any) -> bytes:
    """Serialize payload to compact UTF-8 JSON bytes without trailing spaces."""
    return json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")


def optimize_dataset(
    data_dir: Path,
    output_dir: Path | None = None,
    dry_run: bool = False,
) -> dict[str, Any]:
    """Deduplicate, validate, rebuild search index, and minify unit JSON files."""
    if not data_dir.is_dir():
        raise FileNotFoundError(f"Data directory not found: {data_dir}")

    target_dir = output_dir if output_dir is not None else data_dir
    if not dry_run:
        target_dir.mkdir(parents=True, exist_ok=True)

    search_entries: list[dict[str, Any]] = []
    mismatches: list[dict[str, Any]] = []
    unit_reports: list[dict[str, Any]] = []

    total_before = 0
    total_after = 0
    total_dedup_sections = 0
    total_dup_items_removed = 0
    total_items = 0

    for unit_num in range(1, 8):
        unit_path = data_dir / f"unit{unit_num}.json"
        if not unit_path.is_file():
            raise FileNotFoundError(f"Missing unit file: {unit_path}")

        before_bytes = unit_path.stat().st_size
        with unit_path.open("r", encoding="utf-8") as f:
            unit_data = json.load(f)

        unit_dedup_sections = 0
        unit_dup_items = 0
        unit_items = 0

        for lesson in unit_data.get("lessons", []):
            lesson_id = int(lesson.get("lesson_id") or 0)
            stage_id = int(lesson.get("stage_id") or unit_num)
            for section in lesson.get("sections", []):
                d_sec, d_items = deduplicate_section_items(section)
                unit_dedup_sections += d_sec
                unit_dup_items += d_items

                sec_data = section.get("data")
                if not isinstance(sec_data, dict):
                    continue
                items = sec_data.get("items")
                if not isinstance(items, list):
                    continue

                for item in items:
                    if not isinstance(item, dict):
                        continue
                    unit_items += 1

                    # Assert Arabic harakat parity
                    if "arabic_markup" in item and "arabic" in item:
                        stripped = TAG_RE.sub("", item["arabic_markup"])
                        if stripped != item["arabic"]:
                            mismatches.append(
                                {
                                    "unit": unit_num,
                                    "lesson": lesson_id,
                                    "id": item.get("id"),
                                    "arabic": item["arabic"],
                                    "stripped": stripped,
                                }
                            )

                    ar = item.get("arabic") or ""
                    translations = item.get("translations") or {}
                    en_val = (translations.get("en") or item.get("hinglish") or "").strip()
                    ur_raw = (translations.get("ur") or "").strip()
                    ur_val = ur_raw if ARABIC_SCRIPT_RE.search(ur_raw) else ""
                    root_val = (item.get("arabic_root") or "").strip()

                    search_entries.append(
                        {
                            "s": stage_id,
                            "l": lesson_id,
                            "ar": ar,
                            "tr": transliterate_arabic(ar),
                            "en": en_val,
                            "ur": ur_val,
                            "root": root_val,
                        }
                    )

        if mismatches:
            sample = json.dumps(mismatches[:5], ensure_ascii=False)
            raise AssertionError(
                f"Arabic strip parity check failed with {len(mismatches)} mismatch(es): {sample}"
            )

        out_bytes = minify_json_bytes(unit_data)
        after_bytes = len(out_bytes)

        if not dry_run:
            out_path = target_dir / f"unit{unit_num}.json"
            tmp_path = target_dir / f".unit{unit_num}.json.tmp"
            with tmp_path.open("wb") as f:
                f.write(out_bytes)
            os.replace(tmp_path, out_path)

        total_before += before_bytes
        total_after += after_bytes
        total_dedup_sections += unit_dedup_sections
        total_dup_items_removed += unit_dup_items
        total_items += unit_items

        unit_reports.append(
            {
                "file": f"unit{unit_num}.json",
                "before_bytes": before_bytes,
                "after_bytes": after_bytes,
                "saved_bytes": before_bytes - after_bytes,
                "dedup_sections": unit_dedup_sections,
                "dup_items_removed": unit_dup_items,
                "items": unit_items,
            }
        )

    # Rebuild & minify search-index.json
    si_src = data_dir / "search-index.json"
    si_before = si_src.stat().st_size if si_src.is_file() else 0
    si_bytes = minify_json_bytes(search_entries)
    si_after = len(si_bytes)

    if not dry_run:
        si_out = target_dir / "search-index.json"
        si_tmp = target_dir / ".search-index.json.tmp"
        with si_tmp.open("wb") as f:
            f.write(si_bytes)
        os.replace(si_tmp, si_out)

    total_before += si_before
    total_after += si_after

    return {
        "dry_run": dry_run,
        "data_dir": str(data_dir),
        "output_dir": str(target_dir),
        "units": unit_reports,
        "search_index": {
            "file": "search-index.json",
            "entries": len(search_entries),
            "before_bytes": si_before,
            "after_bytes": si_after,
            "saved_bytes": si_before - si_after,
        },
        "totals": {
            "total_items": total_items,
            "dedup_sections": total_dedup_sections,
            "dup_items_removed": total_dup_items_removed,
            "arabic_strip_mismatches": len(mismatches),
            "before_bytes": total_before,
            "after_bytes": total_after,
            "saved_bytes": total_before - total_after,
            "saved_pct": round(((total_before - total_after) / total_before * 100.0) if total_before else 0.0, 2),
        },
    }


def main() -> int:
    configure_utf8_stdio()
    default_data_dir = Path(__file__).resolve().parent.parent / "data"

    parser = argparse.ArgumentParser(description="Optimize Muallim unit JSONs and search-index.json")
    parser.add_argument("--data-dir", type=Path, default=default_data_dir, help="Source data directory")
    parser.add_argument("--output-dir", type=Path, default=None, help="Optional target output directory")
    parser.add_argument("--dry-run", action="store_true", help="Compute stats and validate without writing files")
    args = parser.parse_args()

    report = optimize_dataset(args.data_dir, output_dir=args.output_dir, dry_run=args.dry_run)

    mode = "DRY-RUN" if report["dry_run"] else f"WRITTEN -> {report['output_dir']}"
    print(f"=== Muallim Data Optimization ({mode}) ===")
    for u in report["units"]:
        pct = (u["saved_bytes"] / u["before_bytes"] * 100.0) if u["before_bytes"] else 0.0
        print(
            f"  {u['file']:16s}: {u['before_bytes']:10,d} B -> {u['after_bytes']:10,d} B "
            f"(-{u['saved_bytes']:9,d} B, {pct:5.2f}%) | dedup_sections={u['dedup_sections']:3d}, "
            f"dup_items_removed={u['dup_items_removed']:4d}, items={u['items']:4d}"
        )
    si = report["search_index"]
    si_pct = (si["saved_bytes"] / si["before_bytes"] * 100.0) if si["before_bytes"] else 0.0
    print(
        f"  {si['file']:16s}: {si['before_bytes']:10,d} B -> {si['after_bytes']:10,d} B "
        f"(-{si['saved_bytes']:9,d} B, {si_pct:5.2f}%) | entries={si['entries']:5d}"
    )
    t = report["totals"]
    print(
        f"  TOTAL           : {t['before_bytes']:10,d} B -> {t['after_bytes']:10,d} B "
        f"(-{t['saved_bytes']:9,d} B / {t['saved_bytes']/1024:,.2f} KiB, {t['saved_pct']:.2f}%)"
    )
    print(
        f"  Invariants      : items={t['total_items']:,d}, dedup_sections={t['dedup_sections']}, "
        f"dup_items_removed={t['dup_items_removed']:,d}, arabic_strip_mismatches={t['arabic_strip_mismatches']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
