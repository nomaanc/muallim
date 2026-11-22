#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Idempotent applier for data/patches/unit6_7_i18n_refs.json.

Merges translations.{en,ur,hi} (and synchronized top-level en/ur/hi if present)
plus verified Qur'anic `ref` tags into data/unit6.json and data/unit7.json by
immutable item `id`. Handles both `section.data.items` and `section.items`.

Usage:
    python scripts/apply_i18n_patch.py
    python scripts/apply_i18n_patch.py --patch path/to/patch.json --targets data/unit6.json data/unit7.json
"""

import argparse
import json
from pathlib import Path
from typing import Any, Dict, List, Tuple


DEFAULT_PATCH = Path("data/patches/unit6_7_i18n_refs.json")
DEFAULT_TARGETS = [Path("data/unit6.json"), Path("data/unit7.json")]


def apply_patch_to_unit(unit_data: Dict[str, Any], patch: Dict[str, Dict[str, str]]) -> Tuple[int, int, int]:
    """Merge patch entries into unit_data in place. Returns (matched, i18n_changed, ref_changed)."""
    matched = 0
    i18n_changed = 0
    ref_changed = 0

    for lesson in unit_data.get("lessons", []):
        for section in lesson.get("sections", []):
            item_lists: List[List[Dict[str, Any]]] = []
            sec_data = section.get("data")
            if isinstance(sec_data, dict) and isinstance(sec_data.get("items"), list):
                item_lists.append(sec_data["items"])
            if isinstance(section.get("items"), list):
                item_lists.append(section["items"])

            for items in item_lists:
                for item in items:
                    if not isinstance(item, dict):
                        continue
                    item_id = str(item.get("id", ""))
                    entry = patch.get(item_id)
                    if not entry:
                        continue
                    matched += 1

                    tr = item.get("translations")
                    if not isinstance(tr, dict):
                        tr = {}
                        item["translations"] = tr

                    item_i18n_modified = False
                    for lang in ("en", "ur", "hi"):
                        val = entry.get(lang)
                        if isinstance(val, str) and val.strip():
                            if tr.get(lang) != val:
                                tr[lang] = val
                                item_i18n_modified = True
                            if lang in item and item.get(lang) != val:
                                item[lang] = val
                                item_i18n_modified = True
                    if item_i18n_modified:
                        i18n_changed += 1

                    ref = entry.get("ref")
                    if isinstance(ref, str) and ref.strip():
                        if item.get("ref") != ref:
                            item["ref"] = ref
                            ref_changed += 1

    return matched, i18n_changed, ref_changed


def main() -> None:
    parser = argparse.ArgumentParser(description="Idempotently apply U6/U7 i18n + Quran ref patch.")
    parser.add_argument("--patch", type=Path, default=DEFAULT_PATCH, help="Path to unit6_7_i18n_refs.json")
    parser.add_argument("--targets", type=Path, nargs="+", default=DEFAULT_TARGETS, help="Unit JSON files to patch")
    args = parser.parse_args()

    with args.patch.open("r", encoding="utf-8") as f:
        patch: Dict[str, Dict[str, str]] = json.load(f)

    print(f"Loaded patch: {args.patch} ({len(patch)} entries)")
    for target in args.targets:
        with target.open("r", encoding="utf-8") as f:
            unit_data = json.load(f)
        matched, i18n_changed, ref_changed = apply_patch_to_unit(unit_data, patch)
        with target.open("w", encoding="utf-8") as f:
            json.dump(unit_data, f, ensure_ascii=False, indent=2)
        print(f"  {target}: matched={matched}, i18n_changed={i18n_changed}, ref_changed={ref_changed}")


if __name__ == "__main__":
    main()
