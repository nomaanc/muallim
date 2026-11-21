// @ts-check
import { renderVisual } from './visual-helper.js';

/**
 * Muallim ul-Qur'an — Unit 3 Grammar Visuals Module (v2.0)
 * Aligned 100% with the official Unit 3 Table of Contents (Book Pages 77–102).
 * Exports standard mount/destroy interface for all lessons in Unit 3.
 */

/** @type {(() => void) | null} */
let _activeTeardown = null;

/**
 * Visual configurations for Unit 3
 * @type {Record<string, import('./visual-helper.js').VisualConfig>}
 */
export const visuals = {
  "s3l1": {
    "lessonKey": "s3l1",
    "title": "S3L1: Murakkab-e-Tawseefi (Sifat-Mawsoof 1): عَظِيمٌ ← شَيْءٌ عَظِيمٌ ، عَذَابٌ عَظِيمٌ",
    "badge": "Sifat + Mawsoof",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">عَظِيمٌ ، كَبِيرٌ ، مُبِينٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Bada, wazih</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Sifat + Mawsoof)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">شَيْءٌ عَظِيمٌ ، عَذَابٌ عَظِيمٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Badi cheez, bada azaab</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'عَظِيمٌ ، كَبِيرٌ ، مُبِينٌ' par Sifat + Mawsoof ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'شَيْءٌ عَظِيمٌ ، عَذَابٌ عَظِيمٌ' (Badi cheez, bada azaab) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Sifat + Mawsoof ke qaa'ide se 'عَظِيمٌ ، كَبِيرٌ ، مُبِينٌ' badal kar 'شَيْءٌ عَظِيمٌ ، عَذَابٌ عَظِيمٌ' (Badi cheez, bada azaab) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "عَظِيمٌ ، كَبِيرٌ ، مُبِينٌ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "شَيْءٌ عَظِيمٌ ، عَذَابٌ عَظِيمٌ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Sifat + Mawsoof",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Nakirah Sifat-Mawsoof",
        "description": "شَيْءٌ عَظِيمٌ / أَجْرٌ كَبِيرٌ — Ek badi cheez / Bada ajr (dono par Tanween)"
      },
      {
        "title": "2. Ma'rifah Sifat-Mawsoof",
        "description": "الْعَرْشِ الْعَظِيمِ / الصِّرَاطَ الْمُسْتَقِيمَ — Bada Arsh / Seedha raasta (dono par الْـ)"
      },
      {
        "title": "3. Mu'annas Sifat-Mawsoof",
        "description": "آيَةٌ بَيِّنَةٌ / كَلِمَةٌ طَيِّبَةٌ — Khuli nishani / Paakiza kalimah (dono ke aakhir mein ة)"
      }
    ],
    "examples": [
      {
        "arabic": "شَيْءٌ عَظِيمٌ / أَجْرٌ كَبِيرٌ",
        "hinglish": "Ek badi cheez / Bada ajr (dono par Tanween)"
      },
      {
        "arabic": "الْعَرْشِ الْعَظِيمِ / الصِّرَاطَ الْمُسْتَقِيمَ",
        "hinglish": "Bada Arsh / Seedha raasta (dono par الْـ)"
      },
      {
        "arabic": "آيَةٌ بَيِّنَةٌ / كَلِمَةٌ طَيِّبَةٌ",
        "hinglish": "Khuli nishani / Paakiza kalimah (dono ke aakhir mein ة)"
      }
    ]
  },
  "s3l2": {
    "lessonKey": "s3l2",
    "title": "S3L2: Sifat-o-Mawsoof (2 — Ek Ism ke Mukhtalif Awsaf): عَذَابٌ ← عَذَابٌ شَدِيدٌ ، عَذَابٌ عَظِيمٌ",
    "badge": "Mawsoof + Sifaat",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">عَذَابٌ ، كِتَابٌ ، قَوْلٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Azaab, Kitaab, Baat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Mawsoof + Sifaat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">عَذَابٌ شَدِيدٌ ، عَذَابٌ أَلِيمٌ ، عَذَابٌ عَظِيمٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Sakht azaab, dardnaak azaab, bada azaab</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'عَذَابٌ ، كِتَابٌ ، قَوْلٌ' par Mawsoof + Sifaat ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'عَذَابٌ شَدِيدٌ ، عَذَابٌ أَلِيمٌ ، عَذَابٌ عَظِيمٌ' (Sakht azaab, dardnaak azaab, bada azaab) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Mawsoof + Sifaat ke qaa'ide se 'عَذَابٌ ، كِتَابٌ ، قَوْلٌ' badal kar 'عَذَابٌ شَدِيدٌ ، عَذَابٌ أَلِيمٌ ، عَذَابٌ عَظِيمٌ' (Sakht azaab, dardnaak azaab, bada azaab) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "عَذَابٌ ، كِتَابٌ ، قَوْلٌ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "عَذَابٌ شَدِيدٌ ، عَذَابٌ أَلِيمٌ ، عَذَابٌ عَظِيمٌ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Mawsoof + Sifaat",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. عَذَابٌ ke Awsaf",
        "description": "عَذَابٌ شَدِيدٌ / أَلِيمٌ / عَظِيمٌ / مُهِينٌ — Sakht / dardnaak / bada / ruswa karne wala azaab"
      },
      {
        "title": "2. كِتَابٌ / قُرْآنٌ ke Awsaf",
        "description": "كِتَابٌ مُبِينٌ / قُرْآنٌ مَجِيدٌ / كَرِيمٌ — Wazih Kitaab / Buland-shaan aur ba-izzat Qur'an"
      },
      {
        "title": "3. قَوْلٌ / صِرَاطٌ ke Awsaf",
        "description": "قَوْلًا سَدِيدًا / قَوْلٌ مَعْرُوفٌ — Seedhi-sachchi baat / Bhali baat"
      }
    ],
    "examples": [
      {
        "arabic": "عَذَابٌ شَدِيدٌ / أَلِيمٌ / عَظِيمٌ / مُهِينٌ",
        "hinglish": "Sakht / dardnaak / bada / ruswa karne wala azaab"
      },
      {
        "arabic": "كِتَابٌ مُبِينٌ / قُرْآنٌ مَجِيدٌ / كَرِيمٌ",
        "hinglish": "Wazih Kitaab / Buland-shaan aur ba-izzat Qur'an"
      },
      {
        "arabic": "قَوْلًا سَدِيدًا / قَوْلٌ مَعْرُوفٌ",
        "hinglish": "Seedhi-sachchi baat / Bhali baat"
      }
    ]
  },
  "s3l3": {
    "lessonKey": "s3l3",
    "title": "S3L3: Harf-e-Jarr ba-Murakkab-e-Tawseefi: عَذَابٌ عَظِيمٌ ← فِي عَذَابٍ عَظِيمٍ",
    "badge": "Jarr + Tawseefi",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">عَذَابٌ عَظِيمٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Bada azaab</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Jarr + Tawseefi)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">فِي عَذَابٍ عَظِيمٍ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Bade azaab mein</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'عَذَابٌ عَظِيمٌ' par Jarr + Tawseefi ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'فِي عَذَابٍ عَظِيمٍ' (Bade azaab mein) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Jarr + Tawseefi ke qaa'ide se 'عَذَابٌ عَظِيمٌ' badal kar 'فِي عَذَابٍ عَظِيمٍ' (Bade azaab mein) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "عَذَابٌ عَظِيمٌ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "فِي عَذَابٍ عَظِيمٍ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Jarr + Tawseefi",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Harf-e-Jarr + Sifat-Mawsoof",
        "description": "فِي عَذَابٍ عَظِيمٍ / عَلَىٰ صِرَاطٍ مُسْتَقِيمٍ — Bade azaab mein / Seedhe raaste par (dono ke neeche Zair)"
      },
      {
        "title": "2. Laam-e-Ta'keed (لَـ)",
        "description": "لَعَذَابٌ أَلِيمٌ / لَفِي ضَلَالٍ مُبِينٍ — Yaqeenan dardnaak azaab / Yaqeenan khuli gumraahi mein"
      },
      {
        "title": "3. Waw-e-Qasam (وَ)",
        "description": "وَالْقُرْآنِ الْحَكِيمِ / وَالْفَجْرِ وَليَالٍ عَشْرٍ — Hikmat wale Qur'an ki qasam / Fajr aur das raaton ki qasam"
      }
    ],
    "examples": [
      {
        "arabic": "فِي عَذَابٍ عَظِيمٍ / عَلَىٰ صِرَاطٍ مُسْتَقِيمٍ",
        "hinglish": "Bade azaab mein / Seedhe raaste par (dono ke neeche Zair)"
      },
      {
        "arabic": "لَعَذَابٌ أَلِيمٌ / لَفِي ضَلَالٍ مُبِينٍ",
        "hinglish": "Yaqeenan dardnaak azaab / Yaqeenan khuli gumraahi mein"
      },
      {
        "arabic": "وَالْقُرْآنِ الْحَكِيمِ / وَالْفَجْرِ وَليَالٍ عَشْرٍ",
        "hinglish": "Hikmat wale Qur'an ki qasam / Fajr aur das raaton ki qasam"
      }
    ]
  },
  "s3l4": {
    "lessonKey": "s3l4",
    "title": "S3L4: Murakkab-e-Izaafi (Mudaaf-o-Mudaaf Ilaih 1): رَبٌّ ← رَبُّ الْمَشْرِقِ",
    "badge": "Izaafat (ـُ الـِ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">رَبٌّ ، يَوْمٌ ، أَهْلٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Rabb, Din, Wale</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Izaafat (ـُ الـِ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">رَبُّ الْمَشْرِقِ ، يَوْمُ الْقِيَامَةِ ، أَهْلُ الْكِتَابِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Mashriq ka Rabb, Qiyamat ka din, Kitaab wale</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'رَبٌّ ، يَوْمٌ ، أَهْلٌ' par Izaafat (ـُ الـِ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'رَبُّ الْمَشْرِقِ ، يَوْمُ الْقِيَامَةِ ، أَهْلُ الْكِتَابِ' (Mashriq ka Rabb, Qiyamat ka din, Kitaab wale) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Izaafat (ـُ الـِ) ke qaa'ide se 'رَبٌّ ، يَوْمٌ ، أَهْلٌ' badal kar 'رَبُّ الْمَشْرِقِ ، يَوْمُ الْقِيَامَةِ ، أَهْلُ الْكِتَابِ' (Mashriq ka Rabb, Qiyamat ka din, Kitaab wale) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "رَبٌّ ، يَوْمٌ ، أَهْلٌ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "رَبُّ الْمَشْرِقِ ، يَوْمُ الْقِيَامَةِ ، أَهْلُ الْكِتَابِ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Izaafat (ـُ الـِ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. رَبُّ / يَوْمُ (Mudaaf)",
        "description": "رَبُّ الْعَرْشِ / يَوْمُ الدِّينِ — Arsh ka Rabb / Jaza ka din"
      },
      {
        "title": "2. قَوْمُ / أَهْلُ (Mudaaf)",
        "description": "قَوْمُ نُوحٍ / أَهْلُ الْكِتَابِ — Nuh (A.S.) ki qom / Kitaab wale"
      },
      {
        "title": "3. ذُو / عِنْدَ (Mudaaf)",
        "description": "ذُو الْفَضْلِ / عِنْدَ اللَّهِ — Fazl wala / Allah ke paas"
      }
    ],
    "examples": [
      {
        "arabic": "رَبُّ الْعَرْشِ / يَوْمُ الدِّينِ",
        "hinglish": "Arsh ka Rabb / Jaza ka din"
      },
      {
        "arabic": "قَوْمُ نُوحٍ / أَهْلُ الْكِتَابِ",
        "hinglish": "Nuh (A.S.) ki qom / Kitaab wale"
      },
      {
        "arabic": "ذُو الْفَضْلِ / عِنْدَ اللَّهِ",
        "hinglish": "Fazl wala / Allah ke paas"
      }
    ]
  },
  "s3l5": {
    "lessonKey": "s3l5",
    "title": "S3L5: Mudaaf-o-Mudaaf Ilaih (2): اللَّهُ ← كِتَابُ اللَّهِ",
    "badge": "Mudaaf Ilaih (ـِ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">اللَّهُ ، السَّمَاوَاتُ ، الدُّنْيَا</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Allah, Aasman, Duniya</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Mudaaf Ilaih (ـِ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">كِتَابُ اللَّهِ ، نُورُ السَّمَاوَاتِ ، الحَيَاةُ الدُّنْيَا</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Allah ki Kitaab, aasmanon ka noor, duniya ka samaan</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'اللَّهُ ، السَّمَاوَاتُ ، الدُّنْيَا' par Mudaaf Ilaih (ـِ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'كِتَابُ اللَّهِ ، نُورُ السَّمَاوَاتِ ، الحَيَاةُ الدُّنْيَا' (Allah ki Kitaab, aasmanon ka noor, duniya ka samaan) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Mudaaf Ilaih (ـِ) ke qaa'ide se 'اللَّهُ ، السَّمَاوَاتُ ، الدُّنْيَا' badal kar 'كِتَابُ اللَّهِ ، نُورُ السَّمَاوَاتِ ، الحَيَاةُ الدُّنْيَا' (Allah ki Kitaab, aasmanon ka noor, duniya ka samaan) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "اللَّهُ ، السَّمَاوَاتُ ، الدُّنْيَا (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "كِتَابُ اللَّهِ ، نُورُ السَّمَاوَاتِ ، الحَيَاةُ الدُّنْيَا (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Mudaaf Ilaih (ـِ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Lafz اللَّهِ ki taraf Nisbat",
        "description": "كِتَابُ اللَّهِ / رَسُولُ اللَّهِ / نَصْرُ اللَّهِ — Allah ki Kitaab / Allah ke Rasool / Allah ki madad"
      },
      {
        "title": "2. السَّمَاوَاتِ / الْكِتَابِ ki taraf Nisbat",
        "description": "غَيْبُ السَّمَاوَاتِ / آيَاتُ الْكِتَابِ — Aasmanon ka ghaib / Kitaab ki aayatein"
      },
      {
        "title": "3. Laam-e-Ta'keed + Izaafat",
        "description": "لَعَذَابُ الْآخِرَةِ أَكْبَرُ / لَوَعْدُ اللَّهِ حَقٌّ — Yaqeenan aakhirat ka azaab sabse bada hai"
      }
    ],
    "examples": [
      {
        "arabic": "كِتَابُ اللَّهِ / رَسُولُ اللَّهِ / نَصْرُ اللَّهِ",
        "hinglish": "Allah ki Kitaab / Allah ke Rasool / Allah ki madad"
      },
      {
        "arabic": "غَيْبُ السَّمَاوَاتِ / آيَاتُ الْكِتَابِ",
        "hinglish": "Aasmanon ka ghaib / Kitaab ki aayatein"
      },
      {
        "arabic": "لَعَذَابُ الْآخِرَةِ أَكْبَرُ / لَوَعْدُ اللَّهِ حَقٌّ",
        "hinglish": "Yaqeenan aakhirat ka azaab sabse bada hai"
      }
    ]
  },
  "s3l6": {
    "lessonKey": "s3l6",
    "title": "S3L6: Harf-e-Jarr ba-Murakkab-e-Izaafi: كِتَابُ اللَّهِ ← فِي كِتَابِ اللَّهِ",
    "badge": "Jarr + Izaafat",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">كِتَابُ اللَّهِ ، سَبِيلُ اللَّهِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Allah ki Kitaab, Allah ka raasta</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Jarr + Izaafat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">فِي كِتَابِ اللَّهِ ، فِي سَبِيلِ اللَّهِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Allah ki Kitaab mein, Allah ke raaste mein</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'كِتَابُ اللَّهِ ، سَبِيلُ اللَّهِ' par Jarr + Izaafat ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'فِي كِتَابِ اللَّهِ ، فِي سَبِيلِ اللَّهِ' (Allah ki Kitaab mein, Allah ke raaste mein) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Jarr + Izaafat ke qaa'ide se 'كِتَابُ اللَّهِ ، سَبِيلُ اللَّهِ' badal kar 'فِي كِتَابِ اللَّهِ ، فِي سَبِيلِ اللَّهِ' (Allah ki Kitaab mein, Allah ke raaste mein) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "كِتَابُ اللَّهِ ، سَبِيلُ اللَّهِ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "فِي كِتَابِ اللَّهِ ، فِي سَبِيلِ اللَّهِ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Jarr + Izaafat",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. فِي / مِنْ / إِلَىٰ / عَلَىٰ + Izaafat",
        "description": "فِي سَبِيلِ اللَّهِ / مِنْ آيَاتِ اللَّهِ / إِلَىٰ ذِكْرِ اللَّهِ — Allah ke raaste mein / Allah ki nishaniyon mein se / Allah ke zikr ki taraf"
      },
      {
        "title": "2. إِنَّ / يَا + Izaafat",
        "description": "إِنَّ وَعْدَ اللَّهِ حَقٌّ / يَا أَهْلَ الْكِتَابِ — Beshak Allah ka waada sachcha hai / Aye Ahl-e-Kitaab!"
      },
      {
        "title": "3. Sifat + Izaafat Mushtarak",
        "description": "تِلْكَ آيَاتُ الْكِتَابِ الْحَكِيمِ — Yeh hikmat wali Kitaab ki aayatein hain"
      }
    ],
    "examples": [
      {
        "arabic": "فِي سَبِيلِ اللَّهِ / مِنْ آيَاتِ اللَّهِ / إِلَىٰ ذِكْرِ اللَّهِ",
        "hinglish": "Allah ke raaste mein / Allah ki nishaniyon mein se / Allah ke zikr ki taraf"
      },
      {
        "arabic": "إِنَّ وَعْدَ اللَّهِ حَقٌّ / يَا أَهْلَ الْكِتَابِ",
        "hinglish": "Beshak Allah ka waada sachcha hai / Aye Ahl-e-Kitaab!"
      },
      {
        "arabic": "تِلْكَ آيَاتُ الْكِتَابِ الْحَكِيمِ",
        "hinglish": "Yeh hikmat wali Kitaab ki aayatein hain"
      }
    ]
  },
  "s3l7": {
    "lessonKey": "s3l7",
    "title": "S3L7: Lafz 'Kull' ka Istemal: كُلٌّ ← كُلُّ كِتَابٍ ، عَلَىٰ كُلِّ شَيْءٍ",
    "badge": "Kull + Mudaaf Ilaih",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">كُلٌّ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Har / Sab</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Kull + Mudaaf Ilaih)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">كُلُّ كِتَابٍ ، كُلُّ نَفْسٍ ، عَلَىٰ كُلِّ شَيْءٍ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Har kitaab, har jaan, har cheez par</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'كُلٌّ' par Kull + Mudaaf Ilaih ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'كُلُّ كِتَابٍ ، كُلُّ نَفْسٍ ، عَلَىٰ كُلِّ شَيْءٍ' (Har kitaab, har jaan, har cheez par) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Kull + Mudaaf Ilaih ke qaa'ide se 'كُلٌّ' badal kar 'كُلُّ كِتَابٍ ، كُلُّ نَفْسٍ ، عَلَىٰ كُلِّ شَيْءٍ' (Har kitaab, har jaan, har cheez par) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "كُلٌّ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "كُلُّ كِتَابٍ ، كُلُّ نَفْسٍ ، عَلَىٰ كُلِّ شَيْءٍ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Kull + Mudaaf Ilaih",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. كُلُّ + Ism (Har...)",
        "description": "كُلُّ نَفْسٍ / كُلُّ أُمَّةٍ / كُلُّ شَيْءٍ — Har nafs (jaan) / Har ummat / Har cheez"
      },
      {
        "title": "2. مِنْ / فِي / عَلَىٰ / بِـ + كُلِّ",
        "description": "مِنْ كُلِّ شَيْءٍ / فِي كُلِّ سُنْبُلَةٍ / عَلَىٰ كُلِّ شَيْءٍ — Har cheez mein se / Har baali mein / Har cheez par"
      },
      {
        "title": "3. Qur'ani Qaanoon",
        "description": "وَاللَّهُ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ — Aur Allah har cheez par khoob qaadir hai"
      }
    ],
    "examples": [
      {
        "arabic": "كُلُّ نَفْسٍ / كُلُّ أُمَّةٍ / كُلُّ شَيْءٍ",
        "hinglish": "Har nafs (jaan) / Har ummat / Har cheez"
      },
      {
        "arabic": "مِنْ كُلِّ شَيْءٍ / فِي كُلِّ سُنْبُلَةٍ / عَلَىٰ كُلِّ شَيْءٍ",
        "hinglish": "Har cheez mein se / Har baali mein / Har cheez par"
      },
      {
        "arabic": "وَاللَّهُ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
        "hinglish": "Aur Allah har cheez par khoob qaadir hai"
      }
    ]
  },
  "s3l8": {
    "lessonKey": "s3l8",
    "title": "S3L8: Asmaa-ul-Faa'il aur Mubalaghah: حَافِظٌ ، رَازِقٌ ، خَالِقٌ ← خَلَّاقٌ",
    "badge": "Faa'il (فَاعِلٌ) & فَعَّالٌ",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">حَفِظَ ، رَزَقَ ، خَلَقَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Hifazat, rizq, paidaish</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Faa'il (فَاعِلٌ) & فَعَّالٌ)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">حَافِظٌ ، رَازِقٌ ، خَالِقٌ (خَلَّاقٌ)</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Hifazat karne wala, rizq dene wala, paida karne wala</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'حَفِظَ ، رَزَقَ ، خَلَقَ' par Faa'il (فَاعِلٌ) & فَعَّالٌ ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'حَافِظٌ ، رَازِقٌ ، خَالِقٌ (خَلَّاقٌ)' (Hifazat karne wala, rizq dene wala, paida karne wala) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Faa'il (فَاعِلٌ) & فَعَّالٌ ke qaa'ide se 'حَفِظَ ، رَزَقَ ، خَلَقَ' badal kar 'حَافِظٌ ، رَازِقٌ ، خَالِقٌ (خَلَّاقٌ)' (Hifazat karne wala, rizq dene wala, paida karne wala) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "حَفِظَ ، رَزَقَ ، خَلَقَ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "حَافِظٌ ، رَازِقٌ ، خَالِقٌ (خَلَّاقٌ) (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Faa'il (فَاعِلٌ) & فَعَّالٌ",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. فَاعِلٌ Wazan (Kaam karne wala)",
        "description": "حَافِظٌ / رَازِقٌ / خَالِقٌ / عَالِمٌ / غَافِرٌ — Hifazat karne wala / Rizq dene wala / Paida karne wala / Jaanne wala / Bakhshne wala"
      },
      {
        "title": "2. فَعَّالٌ Wazan (Mubalaghah — Bahut zyada)",
        "description": "حَفَّاظٌ / رَزَّاقٌ / خَلَّاقٌ / عَلَّامٌ / غَفَّارٌ — Bahut zyada rizq dene wala / Bada paida karne wala / Khoob bakhshne wala"
      },
      {
        "title": "3. Qur'ani Misaal",
        "description": "وَهُوَ الْخَلَّاقُ الْعَلِيمُ / وَإِنِّي لَغَفَّارٌ — Aur woh bada paida karne wala, khoob jaanne wala hai"
      }
    ],
    "examples": [
      {
        "arabic": "حَافِظٌ / رَازِقٌ / خَالِقٌ / عَالِمٌ / غَافِرٌ",
        "hinglish": "Hifazat karne wala / Rizq dene wala / Paida karne wala / Jaanne wala / Bakhshne wala"
      },
      {
        "arabic": "حَفَّاظٌ / رَزَّاقٌ / خَلَّاقٌ / عَلَّامٌ / غَفَّارٌ",
        "hinglish": "Bahut zyada rizq dene wala / Bada paida karne wala / Khoob bakhshne wala"
      },
      {
        "arabic": "وَهُوَ الْخَلَّاقُ الْعَلِيمُ / وَإِنِّي لَغَفَّارٌ",
        "hinglish": "Aur woh bada paida karne wala, khoob jaanne wala hai"
      }
    ]
  },
  "s3l9": {
    "lessonKey": "s3l9",
    "title": "S3L9: Mazeed Asmaa-ul-Faa'il wa Maf'ool: مُنْتَظِرٌ ، مُهَاجِرٌ ، مُسْلِمٌ",
    "badge": "مُـ...ـِ (Faa'il) & مُـ...ـَ",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">مُـ + نْتَظِرٌ / سْلِمٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuru mein مُـ (Meem par Pesh)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (مُـ...ـِ (Faa'il) & مُـ...ـَ)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">مُنْتَظِرٌ ، مُهَاجِرٌ ، مُسْلِمٌ / مُسَخَّرٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Intizaar karne wala, hijrat karne wala, farmabardar</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'مُـ + نْتَظِرٌ / سْلِمٌ' par مُـ...ـِ (Faa'il) & مُـ...ـَ ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'مُنْتَظِرٌ ، مُهَاجِرٌ ، مُسْلِمٌ / مُسَخَّرٌ' (Intizaar karne wala, hijrat karne wala, farmabardar) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "مُـ...ـِ (Faa'il) & مُـ...ـَ ke qaa'ide se 'مُـ + نْتَظِرٌ / سْلِمٌ' badal kar 'مُنْتَظِرٌ ، مُهَاجِرٌ ، مُسْلِمٌ / مُسَخَّرٌ' (Intizaar karne wala, hijrat karne wala, farmabardar) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "مُـ + نْتَظِرٌ / سْلِمٌ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "مُنْتَظِرٌ ، مُهَاجِرٌ ، مُسْلِمٌ / مُسَخَّرٌ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "مُـ...ـِ (Faa'il) & مُـ...ـَ",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. مُـ...ـِ (Zair = Kaam karne wala)",
        "description": "مُسْلِمٌ / مُؤْمِنٌ / مُحْسِنٌ / مُنْذِرٌ / مُبَشِّرٌ — Farmabardar / Imaan laane wala / Neki karne wala / Darane wala"
      },
      {
        "title": "2. Mazeed مُـ...ـِ Alfaaz",
        "description": "مُهَاجِرٌ / مُجَاهِدٌ / مُنْتَظِرٌ / مُسْتَكْبِرٌ — Hijrat karne wala / Jihaad karne wala / Intizaar karne wala"
      },
      {
        "title": "3. مُـ...ـَ (Zabar = Jis par kaam hua)",
        "description": "مُسَخَّرٌ / مُطَهَّرٌ / مُكَرَّمٌ / مُنَزَّلٌ — Taskheer kiya hua / Paak kiya hua / Izzat diya hua / Utara gaya"
      }
    ],
    "examples": [
      {
        "arabic": "مُسْلِمٌ / مُؤْمِنٌ / مُحْسِنٌ / مُنْذِرٌ / مُبَشِّرٌ",
        "hinglish": "Farmabardar / Imaan laane wala / Neki karne wala / Darane wala"
      },
      {
        "arabic": "مُهَاجِرٌ / مُجَاهِدٌ / مُنْتَظِرٌ / مُسْتَكْبِرٌ",
        "hinglish": "Hijrat karne wala / Jihaad karne wala / Intizaar karne wala"
      },
      {
        "arabic": "مُسَخَّرٌ / مُطَهَّرٌ / مُكَرَّمٌ / مُنَزَّلٌ",
        "hinglish": "Taskheer kiya hua / Paak kiya hua / Izzat diya hua / Utara gaya"
      }
    ]
  },
  "s3l10": {
    "lessonKey": "s3l10",
    "title": "S3L10: Tasniyah (Dual — Do Cheezein / Afraad): مُؤْمِنٌ ← مُؤْمِنَانِ ، مُؤْمِنَيْنِ",
    "badge": "Tasniyah (ـَانِ / ـَيْنِ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">مُؤْمِنٌ ، آيَةٌ ، جَنَّةٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Ek momin, ek nishani, ek baagh</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Tasniyah (ـَانِ / ـَيْنِ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">مُؤْمِنَانِ (مُؤْمِنَيْنِ) ، آيَتَانِ ، جَنَّتَانِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Do momin, do nishaniyan, do baagh</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'مُؤْمِنٌ ، آيَةٌ ، جَنَّةٌ' par Tasniyah (ـَانِ / ـَيْنِ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'مُؤْمِنَانِ (مُؤْمِنَيْنِ) ، آيَتَانِ ، جَنَّتَانِ' (Do momin, do nishaniyan, do baagh) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Tasniyah (ـَانِ / ـَيْنِ) ke qaa'ide se 'مُؤْمِنٌ ، آيَةٌ ، جَنَّةٌ' badal kar 'مُؤْمِنَانِ (مُؤْمِنَيْنِ) ، آيَتَانِ ، جَنَّتَانِ' (Do momin, do nishaniyan, do baagh) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "مُؤْمِنٌ ، آيَةٌ ، جَنَّةٌ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "مُؤْمِنَانِ (مُؤْمِنَيْنِ) ، آيَتَانِ ، جَنَّتَانِ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Tasniyah (ـَانِ / ـَيْنِ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Aam Halat (+ ـَانِ)",
        "description": "مُؤْمِنَانِ / رَجُلَانِ / فَرِيقَانِ / جَنَّتَانِ — Do momin / Do mard / Do giroh / Do baagh"
      },
      {
        "title": "2. Harf-e-Jarr / Nasb (+ ـَيْنِ)",
        "description": "مُؤْمِنَيْنِ / رَجُلَيْنِ / جَنَّتَيْنِ / وَالِدَيْنِ — Do mominon ko/se / Do mardon ko / Do baaghon mein / Maa-baap ke liye"
      },
      {
        "title": "3. Qur'ani Misaal",
        "description": "وَبِالْوَالِدَيْنِ إِحْسَانًا / مَرَجَ الْبَحْرَيْنِ — Aur maa-baap ke saath bhalai karo / Usne do samandar milaye"
      }
    ],
    "examples": [
      {
        "arabic": "مُؤْمِنَانِ / رَجُلَانِ / فَرِيقَانِ / جَنَّتَانِ",
        "hinglish": "Do momin / Do mard / Do giroh / Do baagh"
      },
      {
        "arabic": "مُؤْمِنَيْنِ / رَجُلَيْنِ / جَنَّتَيْنِ / وَالِدَيْنِ",
        "hinglish": "Do mominon ko/se / Do mardon ko / Do baaghon mein / Maa-baap ke liye"
      },
      {
        "arabic": "وَبِالْوَالِدَيْنِ إِحْسَانًا / مَرَجَ الْبَحْرَيْنِ",
        "hinglish": "Aur maa-baap ke saath bhalai karo / Usne do samandar milaye"
      }
    ]
  }
};

/**
 * Mount visual for a lesson in Unit 3.
 * @param {string} containerId - Container DOM ID
 * @param {string} [lessonKey] - Lesson key (e.g. "s3l1")
 * @returns {void}
 */
export function mount(containerId, lessonKey) {
  destroy();
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;

  const key = (lessonKey || 's3l1').toLowerCase();
  const config = visuals[key] || visuals['s3l1'];
  if (config) {
    _activeTeardown = renderVisual(container, config);
  }
}

/**
 * Clean up active visual and deregister listeners.
 * @returns {void}
 */
export function destroy() {
  if (_activeTeardown) {
    try {
      _activeTeardown();
    } catch (e) {
      console.warn('[Visual] Teardown error:', e);
    }
    _activeTeardown = null;
  }
}

// Auto-register to GrammarVisuals.Registry for legacy compatibility
if (typeof window !== 'undefined' && /** @type {any} */ (window).GrammarVisuals) {
  const gv = /** @type {any} */ (window).GrammarVisuals;
  if (!gv.Registry) gv.Registry = {};
  Object.keys(visuals).forEach(k => {
    gv.Registry[k] = (containerId) => mount(containerId, k);
  });
}