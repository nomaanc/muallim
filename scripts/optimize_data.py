#!/usr/bin/env python3
"""Optimize Muallim ul-Qur'an unit datasets, emit 114 per-lesson chunks, and rebuild search-index.json.

Operations:
1. Deduplicates redundant `section.items` vs `section.data.items` across
   `data/unit1.json`..`data/unit7.json` into `section.data.items`.
2. Strips redundant item keys (`arabic_text`, `hinglish_meaning`,
   `translations.hinglish`, `is_filled`, duplicate top-level `en`/`ur`/`hi`/
   `urdu`/`english`/`notes`, and null translation keys) and duplicate section
   keys (`content`/`hinglish_text` on `rule_paragraph`, `title`/`label` on
   `section_label`).
3. Standardizes Arabic `ي` (U+064A) and `ك` (U+0643), applies Unicode NFC
   normalization, enforces `TAG_RE.sub('', arabic_markup) == arabic` with 0
   mismatches, replaces `(S.A.W.)` with `ﷺ` (U+FDFA), and cleans raw
   `"Stage 3"` -> `"Unit 3"` in U3L1 `rule_paragraph`.
4. Emits minified `data/unit1.json`..`data/unit7.json` and 114 minified
   per-lesson chunks `data/lessons/s{u}l{l}.json` (< 350 KB each).
5. Rebuilds `data/search-index.json` (14,956 entries `{id, s, l, ar, tr, hn, en, ur, hi, root}`)
   with shadda consonant doubling, sun-letter assimilation, and taa-marbootah
   variants in `transliterate_arabic()`.
6. Syncs `data/metadata.json` counts, lesson metadata, and `title_i18n` while
   preserving `pillars`.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import unicodedata
from pathlib import Path
from typing import Any

TAG_RE = re.compile(r"<[^>]+>")
ARABIC_SCRIPT_RE = re.compile(r"[\u0600-\u06FF]")
ARABIC_MARKS_RE = re.compile(r"^[\u064B-\u065F\u0670\u06D6-\u06ED]$")
SAW_RE = re.compile(r"\(\s*S\.A\.W\.?\s*\)", re.IGNORECASE)

SHADDA = "\u0651"
SUKUN = "\u0652"
FATHA = "\u064E"
DAMMA = "\u064F"
KASRA = "\u0650"
FATHATAN = "\u064B"
DAMMATAN = "\u064C"
KASRATAN = "\u064D"
SUPERSCRIPT_ALEF = "\u0670"

SUN_LETTERS = set("تثدذرزسشصضطظلن")

CONS_MAP: dict[str, str] = {
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
}

VOWEL_MAP: dict[str, str] = {
    FATHA: "a",
    DAMMA: "u",
    KASRA: "i",
    FATHATAN: "an",
    DAMMATAN: "un",
    KASRATAN: "in",
    SUPERSCRIPT_ALEF: "aa",
}


def configure_utf8_stdio() -> None:
    """Ensure UTF-8 output on Windows PowerShell consoles."""
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            try:
                stream.reconfigure(encoding="utf-8")
            except Exception:
                pass


def standardize_arabic_chars(text: str) -> str:
    """Standardize Farsi yeh/keheh (ي/ك) and strip tatweel anomalies if needed."""
    return text.replace("\u06CC", "\u064A").replace("\u06A9", "\u0643")


def normalize_arabic_pair(arabic: str, markup: str | None) -> tuple[str, str | None]:
    """Apply NFC and ي/ك standardization while guaranteeing tag-strip parity."""
    ar_std = unicodedata.normalize("NFC", standardize_arabic_chars(arabic))
    if markup is None:
        return ar_std, None

    mk_std = unicodedata.normalize("NFC", standardize_arabic_chars(markup))
    stripped = TAG_RE.sub("", mk_std)
    if stripped == ar_std:
        return ar_std, mk_std

    # On 22 items where <span> separates shadda (ّ) from a following harakah,
    # NFC cannot reorder across the closing/opening tag. Keep canonical NFC
    # equivalence intact and align `arabic` to `TAG_RE.sub('', mk_std)`.
    if unicodedata.normalize("NFC", stripped) == ar_std:
        return stripped, mk_std

    return ar_std, mk_std


def _split_clusters(word: str) -> list[tuple[str, str]]:
    """Group each Arabic base letter with its following combining marks."""
    clusters: list[tuple[str, str]] = []
    for ch in word:
        if ARABIC_MARKS_RE.match(ch):
            if clusters:
                base, marks = clusters[-1]
                clusters[-1] = (base, marks + ch)
        elif ch == "\u0640":  # tatweel
            continue
        else:
            clusters.append((ch, ""))
    return clusters


def _translit_word(word: str) -> list[str]:
    """Transliterate a single Arabic word with shadda, sun-letter, and taa-marbootah handling."""
    word = unicodedata.normalize("NFC", standardize_arabic_chars(word))
    clusters = _split_clusters(word)
    if not clusters:
        return []

    # Detect definite prefix ال + sun letter assimilation at start of word
    sun_assimilated = False
    start_idx = 0
    sun_prefix = ""
    if (
        len(clusters) >= 3
        and clusters[0][0] in ("ا", "أ", "ٱ")
        and clusters[1][0] == "ل"
        and SUKUN not in clusters[1][1] or (
            len(clusters) >= 3
            and clusters[0][0] in ("ا", "أ", "ٱ")
            and clusters[1][0] == "ل"
            and clusters[2][0] in SUN_LETTERS
            and SHADDA in clusters[2][1]
        )
    ):
        if clusters[2][0] in SUN_LETTERS and (SHADDA in clusters[2][1] or not clusters[1][1]):
            sun_c = CONS_MAP.get(clusters[2][0], "")
            if sun_c:
                sun_assimilated = True
                sun_prefix = f"a{sun_c}-"
                start_idx = 2

    def render_body(from_idx: int, taa_end_mode: str, skip_first_shadda: bool) -> str:
        out: list[str] = []
        last_vowel = ""
        n = len(clusters)
        for idx in range(from_idx, n):
            base, marks = clusters[idx]
            has_shadda = SHADDA in marks

            # Determine vowel(s) in marks
            v_str = ""
            for m in marks:
                if m in VOWEL_MAP:
                    v_str += VOWEL_MAP[m]

            # Long vowel letters ا / و / ي / ى
            if base == "ا" and idx > from_idx and last_vowel == "a" and not marks:
                out.append("a")
                last_vowel = "aa"
                continue
            if base == "و" and idx > from_idx and last_vowel == "u" and not marks and not has_shadda:
                out.append("o")
                last_vowel = "oo"
                continue
            if base == "ي" and idx > from_idx and last_vowel == "i" and not marks and not has_shadda:
                out.append("e")
                last_vowel = "ee"
                continue
            if base == "ى" and not marks:
                out.append("aa" if last_vowel != "a" else "a")
                last_vowel = "aa"
                continue

            if base == "ة" and idx == n - 1:
                if taa_end_mode == "at":
                    out.append("t" + v_str)
                elif taa_end_mode == "ah":
                    out.append("h" + v_str)
                else:
                    out.append("t")
                last_vowel = v_str
                continue

            cons = CONS_MAP.get(base, "")
            if has_shadda and not (skip_first_shadda and idx == from_idx):
                if cons and cons != "'":
                    cons = cons + cons

            # Alif at start of word with kasra/damma/fatha
            if base in ("ا", "أ", "إ", "ٱ") and idx == 0 and v_str:
                cons = ""

            out.append(cons + v_str)
            last_vowel = v_str
        return "".join(out)

    has_final_taa = clusters[-1][0] == "ة"
    variants: list[str] = []

    if sun_assimilated:
        body_ah = render_body(start_idx, "ah", skip_first_shadda=True)
        variants.append(sun_prefix + body_ah)
        variants.append(sun_prefix.replace("-", "") + body_ah)
        if has_final_taa:
            body_at = render_body(start_idx, "at", skip_first_shadda=True)
            variants.append(sun_prefix + body_at)
            variants.append(sun_prefix.replace("-", "") + body_at)
            body_bare_t = render_body(start_idx, "bare_t", skip_first_shadda=True)
            variants.append(body_bare_t)
    else:
        body_ah = render_body(0, "ah", skip_first_shadda=False)
        variants.append(body_ah)
        if has_final_taa:
            body_at = render_body(0, "at", skip_first_shadda=False)
            variants.append(body_at)
            body_bare_t = render_body(0, "bare_t", skip_first_shadda=False)
            variants.append(body_bare_t)

    # Also add single-vowel-collapsed forms (e.g., kitaabun -> kitabun, subhaana -> subhana)
    # so common learner spellings like "kitab", "subhan", "zakat" match unloaded lessons.
    extra: list[str] = []
    for v in variants:
        collapsed = re.sub(r"aa", "a", v)
        collapsed = re.sub(r"uo|oo|uu", "u", collapsed)
        collapsed = re.sub(r"ie|ee|ii", "i", collapsed)
        if collapsed != v:
            extra.append(collapsed)
    variants.extend(extra)

    # Deduplicate preserving order
    seen: set[str] = set()
    unique: list[str] = []
    for v in variants:
        v_clean = v.strip()
        if v_clean and v_clean not in seen:
            seen.add(v_clean)
            unique.append(v_clean)
    return unique


def transliterate_arabic(text: str) -> str:
    """Transliterate vocalized Arabic text to lowercase ASCII search tokens."""
    if not text:
        return ""
    tokens: list[str] = []
    seen_tokens: set[str] = set()
    # Split on whitespace and punctuation separators while keeping Arabic/ASCII words
    for raw_tok in re.split(r"[\s/،؛؟۔﴿﴾«»\(\)\[\]:←➔.]+", text):
        if not raw_tok:
            continue
        if raw_tok.isascii():
            tok = raw_tok.lower()
            if tok and tok not in seen_tokens:
                seen_tokens.add(tok)
                tokens.append(tok)
            continue
        for variant in _translit_word(raw_tok):
            if variant not in seen_tokens:
                seen_tokens.add(variant)
                tokens.append(variant)
    return " ".join(tokens)


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
    """Ensure section items reside solely under `section['data']['items']`."""
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


def clean_section_metadata(section: dict[str, Any], unit_num: int, lesson_id: int) -> None:
    """Strip duplicate section keys and sanitize Stage 3 -> Unit 3 in U3L1."""
    sec_type = section.get("type")
    sec_data = section.get("data")
    if not isinstance(sec_data, dict):
        return

    if sec_type == "rule_paragraph":
        if unit_num == 3 and lesson_id == 1:
            for container in (sec_data, section):
                for key in ("text", "content", "hinglish_text"):
                    val = container.get(key)
                    if isinstance(val, str) and "Stage 3" in val:
                        container[key] = val.replace("Stage 3", "Unit 3")

        text_val = sec_data.get("text")
        if isinstance(text_val, str):
            for key in ("content", "hinglish_text"):
                if sec_data.get(key) == text_val:
                    sec_data.pop(key, None)
                if section.get(key) == text_val:
                    section.pop(key, None)

    elif sec_type == "section_label":
        text_val = sec_data.get("text")
        if isinstance(text_val, str):
            for key in ("title", "label"):
                if sec_data.get(key) == text_val:
                    sec_data.pop(key, None)
                if section.get(key) == text_val:
                    section.pop(key, None)


def clean_item(item: dict[str, Any], unit_num: int) -> None:
    """Deduplicate item fields, strip nulls, standardize Arabic & NFC, and fix honorifics."""
    # Replace (S.A.W.) with ﷺ (U+FDFA)
    for key in ("hinglish", "hinglish_meaning"):
        val = item.get(key)
        if isinstance(val, str) and SAW_RE.search(val):
            item[key] = SAW_RE.sub("ﷺ", val)

    tr = item.get("translations")
    if isinstance(tr, dict):
        for tk, tv in list(tr.items()):
            if tv is None:
                tr.pop(tk, None)
            elif isinstance(tv, str) and SAW_RE.search(tv):
                tr[tk] = SAW_RE.sub("ﷺ", tv)
        for null_key in ("bn", "ko", "zh", "es"):
            tr.pop(null_key, None)

    # NFC + ي/ك standardization on Arabic fields
    ar = item.get("arabic")
    mk = item.get("arabic_markup")
    if isinstance(ar, str):
        new_ar, new_mk = normalize_arabic_pair(ar, mk if isinstance(mk, str) else None)
        item["arabic"] = new_ar
        if new_mk is not None:
            item["arabic_markup"] = new_mk

    for ar_field in ("arabic_root", "arabic_suffix"):
        val = item.get(ar_field)
        if isinstance(val, str):
            item[ar_field] = unicodedata.normalize("NFC", standardize_arabic_chars(val))

    # Strip redundant item keys
    if "arabic_text" in item:
        at_norm = unicodedata.normalize("NFC", standardize_arabic_chars(str(item["arabic_text"])))
        if at_norm == item.get("arabic") or unicodedata.normalize("NFC", str(item.get("arabic", ""))) == at_norm:
            item.pop("arabic_text", None)

    hinglish_val = item.get("hinglish")
    if "hinglish_meaning" in item and item["hinglish_meaning"] == hinglish_val:
        item.pop("hinglish_meaning", None)

    if isinstance(tr, dict):
        if "hinglish" in tr and tr["hinglish"] == hinglish_val:
            tr.pop("hinglish", None)
        # Strip duplicate top-level en/ur/hi (and stale Unit 5 urdu/english/empty notes)
        for dup_k in ("en", "ur", "hi"):
            if dup_k in item and (dup_k in tr or item[dup_k] == ""):
                item.pop(dup_k, None)
        if unit_num == 5:
            if "urdu" in item and tr.get("ur"):
                item.pop("urdu", None)
            if "english" in item and tr.get("en"):
                item.pop("english", None)
            if "notes" in item and not item["notes"]:
                item.pop("notes", None)

    item.pop("is_filled", None)


def build_lesson_chunk_payload(unit_data: dict[str, Any], lesson: dict[str, Any], unit_num: int) -> dict[str, Any]:
    """Construct the compact per-lesson chunk matching the shared v7.0 contract."""
    stage_id = unit_data.get("stage_id") or lesson.get("stage_id") or unit_num
    unit_id = unit_data.get("unit_id") or unit_num
    lesson_obj = {
        "lesson_id": lesson.get("lesson_id"),
        "lesson_key": lesson.get("lesson_key"),
        "stage_id": lesson.get("stage_id") or stage_id,
        "title": lesson.get("title"),
        "title_i18n": lesson.get("title_i18n"),
        "arabic_Focus": lesson.get("arabic_Focus"),
        "hinglish_Focus": lesson.get("hinglish_Focus"),
        "page_numbers": lesson.get("page_numbers"),
        "book_page": lesson.get("book_page"),
        "sections": lesson.get("sections", []),
    }
    return {
        "unit_id": unit_id,
        "stage_id": stage_id,
        "lesson": lesson_obj,
    }


def minify_json_bytes(payload: Any) -> bytes:
    """Serialize payload to compact UTF-8 JSON bytes without trailing spaces."""
    return json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")


def atomic_write_bytes(path: Path, data: bytes) -> None:
    """Write bytes atomically via a temp file in the same directory."""
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.parent / f".{path.name}.tmp"
    with tmp_path.open("wb") as f:
        f.write(data)
    os.replace(tmp_path, path)


def optimize_dataset(
    data_dir: Path,
    output_dir: Path | None = None,
    dry_run: bool = False,
) -> dict[str, Any]:
    """Deduplicate, normalize, emit per-lesson chunks, rebuild search index & metadata."""
    if not data_dir.is_dir():
        raise FileNotFoundError(f"Data directory not found: {data_dir}")

    target_dir = output_dir if output_dir is not None else data_dir
    lessons_out_dir = target_dir / "lessons"
    if not dry_run:
        target_dir.mkdir(parents=True, exist_ok=True)
        lessons_out_dir.mkdir(parents=True, exist_ok=True)

    search_entries: list[dict[str, Any]] = []
    mismatches: list[dict[str, Any]] = []
    unit_reports: list[dict[str, Any]] = []
    lesson_chunk_sizes: list[tuple[str, int]] = []
    meta_units_updates: list[dict[str, Any]] = []

    total_before = 0
    total_after = 0
    total_dedup_sections = 0
    total_dup_items_removed = 0
    total_items = 0
    total_lessons = 0

    for unit_num in range(1, 8):
        unit_path = data_dir / f"unit{unit_num}.json"
        if not unit_path.is_file():
            raise FileNotFoundError(f"Missing unit file: {unit_path}")

        before_bytes = unit_path.stat().st_size
        with unit_path.open("r", encoding="utf-8") as f:
            unit_data = json.load(f)

        if "stage_id" not in unit_data or unit_data["stage_id"] is None:
            unit_data["stage_id"] = unit_num

        unit_dedup_sections = 0
        unit_dup_items = 0
        unit_items = 0
        meta_lessons: list[dict[str, Any]] = []

        for lesson in unit_data.get("lessons", []):
            total_lessons += 1
            lesson_id = int(lesson.get("lesson_id") or 0)
            stage_id = int(lesson.get("stage_id") or unit_num)
            lesson_items = 0

            if isinstance(lesson.get("arabic_Focus"), str):
                lesson["arabic_Focus"] = unicodedata.normalize(
                    "NFC", standardize_arabic_chars(lesson["arabic_Focus"])
                )

            for section in lesson.get("sections", []):
                d_sec, d_items = deduplicate_section_items(section)
                unit_dedup_sections += d_sec
                unit_dup_items += d_items
                clean_section_metadata(section, unit_num, lesson_id)

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
                    lesson_items += 1
                    clean_item(item, unit_num)

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
                    hn_val = (item.get("hinglish") or "").strip()
                    en_val = (translations.get("en") or "").strip()
                    ur_raw = (translations.get("ur") or "").strip()
                    ur_val = ur_raw if ARABIC_SCRIPT_RE.search(ur_raw) else ""
                    hi_val = (translations.get("hi") or "").strip()
                    root_val = (item.get("arabic_root") or "").strip()

                    search_entries.append(
                        {
                            "id": item.get("id"),
                            "s": stage_id,
                            "l": lesson_id,
                            "ar": ar,
                            "tr": transliterate_arabic(ar),
                            "hn": hn_val,
                            "en": en_val,
                            "ur": ur_val,
                            "hi": hi_val,
                            "root": root_val,
                        }
                    )

            chunk_payload = build_lesson_chunk_payload(unit_data, lesson, unit_num)
            chunk_bytes = minify_json_bytes(chunk_payload)
            chunk_name = f"s{unit_num}l{lesson_id}.json"
            lesson_chunk_sizes.append((chunk_name, len(chunk_bytes)))
            if not dry_run:
                atomic_write_bytes(lessons_out_dir / chunk_name, chunk_bytes)

            meta_lessons.append(
                {
                    "number": lesson_id,
                    "title": lesson.get("title"),
                    "title_i18n": lesson.get("title_i18n"),
                    "itemCount": lesson_items,
                    "page_numbers": lesson.get("page_numbers"),
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
            atomic_write_bytes(target_dir / f"unit{unit_num}.json", out_bytes)

        total_before += before_bytes
        total_after += after_bytes
        total_dedup_sections += unit_dedup_sections
        total_dup_items_removed += unit_dup_items
        total_items += unit_items

        meta_units_updates.append(
            {
                "id": f"Stage{unit_num}",
                "label": f"Unit {unit_num}",
                "lessonCount": len(meta_lessons),
                "lessons": meta_lessons,
            }
        )

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
        atomic_write_bytes(target_dir / "search-index.json", si_bytes)

    # Sync metadata.json preserving existing pillars
    meta_src = data_dir / "metadata.json"
    existing_meta = json.loads(meta_src.read_text(encoding="utf-8")) if meta_src.is_file() else {}
    synced_meta: dict[str, Any] = {
        "units": meta_units_updates,
        "totalLessons": total_lessons,
        "totalItems": total_items,
    }
    if isinstance(existing_meta.get("pillars"), list):
        synced_meta["pillars"] = existing_meta["pillars"]
    if not dry_run:
        meta_bytes = (json.dumps(synced_meta, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
        atomic_write_bytes(target_dir / "metadata.json", meta_bytes)

    total_before += si_before
    total_after += si_after
    max_chunk = max(lesson_chunk_sizes, key=lambda x: x[1]) if lesson_chunk_sizes else ("", 0)

    return {
        "dry_run": dry_run,
        "data_dir": str(data_dir),
        "output_dir": str(target_dir),
        "units": unit_reports,
        "lessons": {
            "count": len(lesson_chunk_sizes),
            "max_file": max_chunk[0],
            "max_bytes": max_chunk[1],
            "total_bytes": sum(sz for _, sz in lesson_chunk_sizes),
        },
        "search_index": {
            "file": "search-index.json",
            "entries": len(search_entries),
            "before_bytes": si_before,
            "after_bytes": si_after,
            "saved_bytes": si_before - si_after,
        },
        "totals": {
            "total_items": total_items,
            "total_lessons": total_lessons,
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

    parser = argparse.ArgumentParser(description="Optimize Muallim unit JSONs, lesson chunks, and search-index.json")
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
    lc = report["lessons"]
    print(
        f"  {'lessons/*.json':16s}: {lc['count']:3d} chunks, total={lc['total_bytes']:,d} B, "
        f"max={lc['max_file']} ({lc['max_bytes']:,d} B)"
    )
    si = report["search_index"]
    si_pct = (si["saved_bytes"] / si["before_bytes"] * 100.0) if si["before_bytes"] else 0.0
    print(
        f"  {si['file']:16s}: {si['before_bytes']:10,d} B -> {si['after_bytes']:10,d} B "
        f"({si['before_bytes'] - si['after_bytes']:+9,d} B, {si_pct:5.2f}%) | entries={si['entries']:5d}"
    )
    t = report["totals"]
    print(
        f"  TOTAL           : {t['before_bytes']:10,d} B -> {t['after_bytes']:10,d} B "
        f"(-{t['saved_bytes']:9,d} B / {t['saved_bytes']/1024:,.2f} KiB, {t['saved_pct']:.2f}%)"
    )
    print(
        f"  Invariants      : lessons={t['total_lessons']}, items={t['total_items']:,d}, "
        f"dedup_sections={t['dedup_sections']}, dup_items_removed={t['dup_items_removed']:,d}, "
        f"arabic_strip_mismatches={t['arabic_strip_mismatches']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
