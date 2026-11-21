// @ts-check
import { renderVisual } from './visual-helper.js';

/**
 * Muallim ul-Qur'an — Unit 4 Grammar Visuals Module (v2.0)
 * Aligned 100% with the official 18-lesson Unit 4 Table of Contents (Book Pages 2–39).
 * Exports standard mount/destroy interface for all lessons in Unit 4.
 */

/** @type {(() => void) | null} */
let _activeTeardown = null;

/**
 * Visual configurations for Unit 4 (s4l1–s4l18)
 * @type {Record<string, import('./visual-helper.js').VisualConfig>}
 */
export const visuals = {
  "s4l1": {
    "lessonKey": "s4l1",
    "title": "S4L1: Zameer-e-Munfasil Muzakkar Ghaib: رَسُولٌ ← هُوَ رَسُولٌ",
    "badge": "Zameer (هُوَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">رَسُولٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Ek Rasool</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Zameer (هُوَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">هُوَ رَسُولٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Woh ek Rasool hai</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'رَسُولٌ' par Zameer (هُوَ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'هُوَ رَسُولٌ' (Woh ek Rasool hai) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Zameer (هُوَ) ke qaa'ide se 'رَسُولٌ' badal kar 'هُوَ رَسُولٌ' (Woh ek Rasool hai) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "رَسُولٌ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "هُوَ رَسُولٌ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Zameer (هُوَ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. هُوَ + Nakirah (Tanween)",
        "description": "هُوَ رَسُولٌ / هُوَ إِلَٰهٌ وَاحِدٌ — Woh ek Rasool hai / Woh ek Ma'bood hai"
      },
      {
        "title": "1. وَهُوَ / فَهُوَ",
        "description": "وَهُوَ الْغَفُورُ الْوَدُودُ / فَهُوَ كَفَّارَةٌ — Aur woh bakhshne wala hai / Toh woh kaffara hai"
      },
      {
        "title": "1. هُوَ + Ma'rifah (الْـ) (Hasr)",
        "description": "هُوَ اللَّهُ / هُوَ الْحَقُّ / لَهُوَ الْعَزِيزُ — Wohi Allah hai / Wohi haq hai / Yaqeenan wohi Ghalib hai"
      }
    ],
    "examples": [
      {
        "arabic": "هُوَ رَسُولٌ / هُوَ إِلَٰهٌ وَاحِدٌ",
        "hinglish": "Woh ek Rasool hai / Woh ek Ma'bood hai"
      },
      {
        "arabic": "وَهُوَ الْغَفُورُ الْوَدُودُ / فَهُوَ كَفَّارَةٌ",
        "hinglish": "Aur woh bakhshne wala hai / Toh woh kaffara hai"
      },
      {
        "arabic": "هُوَ اللَّهُ / هُوَ الْحَقُّ / لَهُوَ الْعَزِيزُ",
        "hinglish": "Wohi Allah hai / Wohi haq hai / Yaqeenan wohi Ghalib hai"
      }
    ]
  },
  "s4l2": {
    "lessonKey": "s4l2",
    "title": "S4L2: Zameer-e-Muttasil Muzakkar Ghaib: بَيْتٌ ← بَيْتُهُ",
    "badge": "Zameer (ـهُ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">بَيْتٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Ghar</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Zameer (ـهُ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">بَيْتُهُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Uska ghar</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'بَيْتٌ' par Zameer (ـهُ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'بَيْتُهُ' (Uska ghar) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Zameer (ـهُ) ke qaa'ide se 'بَيْتٌ' badal kar 'بَيْتُهُ' (Uska ghar) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "بَيْتٌ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "بَيْتُهُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Zameer (ـهُ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. بَيْتٌ (Ghar)",
        "description": "بَيْتُهُ — Uska ghar (Tanween hat kar ek Pesh bacha)"
      },
      {
        "title": "1. رَبٌّ (Rabb)",
        "description": "رَبُّهُ — Uska Rabb"
      },
      {
        "title": "1. عَمَلٌ / أَجْرٌ",
        "description": "عَمَلُهُ / أَجْرُهُ — Uska amal / Uska ajr"
      }
    ],
    "examples": [
      {
        "arabic": "بَيْتُهُ",
        "hinglish": "Uska ghar (Tanween hat kar ek Pesh bacha)"
      },
      {
        "arabic": "رَبُّهُ",
        "hinglish": "Uska Rabb"
      },
      {
        "arabic": "عَمَلُهُ / أَجْرُهُ",
        "hinglish": "Uska amal / Uska ajr"
      }
    ]
  },
  "s4l3": {
    "lessonKey": "s4l3",
    "title": "S4L3: Harf-e-Jarr ba-Zameer: بَيْتُهُ ← فِي بَيْتِهِ",
    "badge": "Jarr + ـهِ",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">بَيْتُهُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Uska ghar</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Jarr + ـهِ)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">فِي بَيْتِهِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Uske ghar mein</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'بَيْتُهُ' par Jarr + ـهِ ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'فِي بَيْتِهِ' (Uske ghar mein) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Jarr + ـهِ ke qaa'ide se 'بَيْتُهُ' badal kar 'فِي بَيْتِهِ' (Uske ghar mein) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "بَيْتُهُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "فِي بَيْتِهِ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Jarr + ـهِ",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. بَيْتُهُ (Uska ghar)",
        "description": "فِي بَيْتِهِ / إِلَىٰ بَيْتِهِ — Uske ghar mein / Uske ghar ki taraf"
      },
      {
        "title": "1. رَبُّهُ (Uska Rabb)",
        "description": "مِنْ رَبِّهِ / عَلَىٰ رَبِّهِ — Uske Rabb ki taraf se / Uske Rabb par"
      },
      {
        "title": "1. إِنَّ + Ism + ـهُ",
        "description": "إِنَّ رَبَّهُ / إِنَّ أَجَلَهُ — Beshak uska Rabb / Beshak uska muqarrar waqt"
      }
    ],
    "examples": [
      {
        "arabic": "فِي بَيْتِهِ / إِلَىٰ بَيْتِهِ",
        "hinglish": "Uske ghar mein / Uske ghar ki taraf"
      },
      {
        "arabic": "مِنْ رَبِّهِ / عَلَىٰ رَبِّهِ",
        "hinglish": "Uske Rabb ki taraf se / Uske Rabb par"
      },
      {
        "arabic": "إِنَّ رَبَّهُ / إِنَّ أَجَلَهُ",
        "hinglish": "Beshak uska Rabb / Beshak uska muqarrar waqt"
      }
    ]
  },
  "s4l4": {
    "lessonKey": "s4l4",
    "title": "S4L4: Huroof ke saath Zameer: لِـ ← لَهُ ، مِنْ ← مِنْهُ ، فِي ← فِيهِ",
    "badge": "Huroof + ـهُ",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">لِـ ، مِنْ ، فِي</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Ke liye, se, mein</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Huroof + ـهُ)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">لَهُ ، مِنْهُ ، فِيهِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Uske liye, us-se, usmein</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'لِـ ، مِنْ ، فِي' par Huroof + ـهُ ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'لَهُ ، مِنْهُ ، فِيهِ' (Uske liye, us-se, usmein) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Huroof + ـهُ ke qaa'ide se 'لِـ ، مِنْ ، فِي' badal kar 'لَهُ ، مِنْهُ ، فِيهِ' (Uske liye, us-se, usmein) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "لِـ ، مِنْ ، فِي (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "لَهُ ، مِنْهُ ، فِيهِ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Huroof + ـهُ",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. لِـ / مِنْ / عَنْ + ـهُ",
        "description": "لَهُ / مِنْهُ / عَنْهُ — Uske liye (uska hai) / Us-se / Uske baare mein"
      },
      {
        "title": "1. فِي / إِلَىٰ / عَلَىٰ / بِـ + ـهُ",
        "description": "فِيهِ / إِلَيْهِ / عَلَيْهِ / بِهِ — Usmein / Uski taraf / Us par / Uske saath"
      },
      {
        "title": "1. إِنَّ / أَنَّ / كَأَنَّ + ـهُ",
        "description": "إِنَّهُ / أَنَّهُ / كَأَنَّهُ — Beshak woh / Ke woh / Goya woh"
      }
    ],
    "examples": [
      {
        "arabic": "لَهُ / مِنْهُ / عَنْهُ",
        "hinglish": "Uske liye (uska hai) / Us-se / Uske baare mein"
      },
      {
        "arabic": "فِيهِ / إِلَيْهِ / عَلَيْهِ / بِهِ",
        "hinglish": "Usmein / Uski taraf / Us par / Uske saath"
      },
      {
        "arabic": "إِنَّهُ / أَنَّهُ / كَأَنَّهُ",
        "hinglish": "Beshak woh / Ke woh / Goya woh"
      }
    ]
  },
  "s4l5": {
    "lessonKey": "s4l5",
    "title": "S4L5: Zameer-e-Munfasil Mukhaatab: يُوسُفُ ← أَنْتَ يُوسُفُ",
    "badge": "Zameer (أَنْتَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">يُوسُفُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Yusuf</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Zameer (أَنْتَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">أَنْتَ يُوسُفُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Tu / Aap Yusuf ho</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'يُوسُفُ' par Zameer (أَنْتَ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'أَنْتَ يُوسُفُ' (Tu / Aap Yusuf ho) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Zameer (أَنْتَ) ke qaa'ide se 'يُوسُفُ' badal kar 'أَنْتَ يُوسُفُ' (Tu / Aap Yusuf ho) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "يُوسُفُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "أَنْتَ يُوسُفُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Zameer (أَنْتَ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. أَنْتَ + Ism",
        "description": "أَنْتَ يُوسُفُ / أَنْتَ نَذِيرٌ — Aap Yusuf hain / Aap darane wale hain"
      },
      {
        "title": "1. إِنَّمَا أَنْتَ...",
        "description": "إِنَّمَا أَنْتَ مُذَكِّرٌ / نَذِيرٌ — Aap toh sirf naseehat karne wale / darane wale hain"
      },
      {
        "title": "1. إِنَّكَ أَنْتَ + الْـ (Hasr)",
        "description": "إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ — Beshak Tu hi khoob sunne wala, jaanne wala hai"
      }
    ],
    "examples": [
      {
        "arabic": "أَنْتَ يُوسُفُ / أَنْتَ نَذِيرٌ",
        "hinglish": "Aap Yusuf hain / Aap darane wale hain"
      },
      {
        "arabic": "إِنَّمَا أَنْتَ مُذَكِّرٌ / نَذِيرٌ",
        "hinglish": "Aap toh sirf naseehat karne wale / darane wale hain"
      },
      {
        "arabic": "إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ",
        "hinglish": "Beshak Tu hi khoob sunne wala, jaanne wala hai"
      }
    ]
  },
  "s4l6": {
    "lessonKey": "s4l6",
    "title": "S4L6: Zameer-e-Muttasil Mukhaatab: بَيْتٌ ← بَيْتُكَ",
    "badge": "Zameer (ـكَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">بَيْتٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Ghar</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Zameer (ـكَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">بَيْتُكَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Tera ghar</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'بَيْتٌ' par Zameer (ـكَ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'بَيْتُكَ' (Tera ghar) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Zameer (ـكَ) ke qaa'ide se 'بَيْتٌ' badal kar 'بَيْتُكَ' (Tera ghar) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "بَيْتٌ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "بَيْتُكَ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Zameer (ـكَ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. بَيْتٌ (Ghar)",
        "description": "بَيْتُكَ — Tera ghar"
      },
      {
        "title": "1. رَبٌّ (Rabb)",
        "description": "رَبُّكَ — Tera (Aapka) Rabb"
      },
      {
        "title": "1. رَحْمَةٌ / وَعْدُ",
        "description": "رَحْمَتُكَ / وَعْدُكَ — Teri rahmat / Tera waada"
      }
    ],
    "examples": [
      {
        "arabic": "بَيْتُكَ",
        "hinglish": "Tera ghar"
      },
      {
        "arabic": "رَبُّكَ",
        "hinglish": "Tera (Aapka) Rabb"
      },
      {
        "arabic": "رَحْمَتُكَ / وَعْدُكَ",
        "hinglish": "Teri rahmat / Tera waada"
      }
    ]
  },
  "s4l7": {
    "lessonKey": "s4l7",
    "title": "S4L7: Harf-e-Jarr ba-Zameer: بَيْتُكَ ← فِي بَيْتِكَ",
    "badge": "Jarr + ـكَ",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">بَيْتُكَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Tera ghar</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Jarr + ـكَ)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">فِي بَيْتِكَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Tere ghar mein</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'بَيْتُكَ' par Jarr + ـكَ ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'فِي بَيْتِكَ' (Tere ghar mein) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Jarr + ـكَ ke qaa'ide se 'بَيْتُكَ' badal kar 'فِي بَيْتِكَ' (Tere ghar mein) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "بَيْتُكَ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "فِي بَيْتِكَ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Jarr + ـكَ",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Harf-e-Jarr + Ism + ـكَ",
        "description": "فِي بَيْتِكَ / مِنْ رَبِّكَ / إِلَىٰ رَبِّكَ — Tere ghar mein / Aapke Rabb ki taraf se / Aapke Rabb ki taraf"
      },
      {
        "title": "1. إِنَّ + Ism + ـكَ",
        "description": "إِنَّ رَبَّكَ / إِنَّ صَلَاتَكَ — Beshak aapka Rabb / Beshak aapki namaz"
      },
      {
        "title": "1. Izaafat + رَبِّكَ",
        "description": "رَحْمَةُ رَبِّكَ / صِرَاطُ رَبِّكَ / عَذَابُ رَبِّكَ — Aapke Rabb ki rahmat / raasta / azaab"
      }
    ],
    "examples": [
      {
        "arabic": "فِي بَيْتِكَ / مِنْ رَبِّكَ / إِلَىٰ رَبِّكَ",
        "hinglish": "Tere ghar mein / Aapke Rabb ki taraf se / Aapke Rabb ki taraf"
      },
      {
        "arabic": "إِنَّ رَبَّكَ / إِنَّ صَلَاتَكَ",
        "hinglish": "Beshak aapka Rabb / Beshak aapki namaz"
      },
      {
        "arabic": "رَحْمَةُ رَبِّكَ / صِرَاطُ رَبِّكَ / عَذَابُ رَبِّكَ",
        "hinglish": "Aapke Rabb ki rahmat / raasta / azaab"
      }
    ]
  },
  "s4l8": {
    "lessonKey": "s4l8",
    "title": "S4L8: Huroof ke saath Zameer: لِـ ← لَكَ ، مِنْ ← مِنْكَ ، فِي ← فِيكَ",
    "badge": "Huroof + ـكَ",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">لِـ ، مِنْ ، فِي</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Ke liye, se, mein</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Huroof + ـكَ)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">لَكَ ، مِنْكَ ، فِيكَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Tere liye, tujh se, tujh mein</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'لِـ ، مِنْ ، فِي' par Huroof + ـكَ ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'لَكَ ، مِنْكَ ، فِيكَ' (Tere liye, tujh se, tujh mein) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Huroof + ـكَ ke qaa'ide se 'لِـ ، مِنْ ، فِي' badal kar 'لَكَ ، مِنْكَ ، فِيكَ' (Tere liye, tujh se, tujh mein) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "لِـ ، مِنْ ، فِي (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "لَكَ ، مِنْكَ ، فِيكَ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Huroof + ـكَ",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. لِـ / مِنْ / عَنْ + ـكَ",
        "description": "لَكَ / مِنْكَ / عَنْكَ — Tere liye / Tujh se / Tujh se (tere baare mein)"
      },
      {
        "title": "1. فِي / إِلَىٰ / عَلَىٰ / بِـ + ـكَ",
        "description": "فِيكَ / إِلَيْكَ / عَلَيْكَ / بِكَ — Tujh mein / Teri taraf / Tujh par / Tujh se"
      },
      {
        "title": "1. إِنَّ / أَنَّ + ـكَ",
        "description": "إِنَّكَ / أَنَّكَ — Beshak tu (aap) / Ke tu (aap)"
      }
    ],
    "examples": [
      {
        "arabic": "لَكَ / مِنْكَ / عَنْكَ",
        "hinglish": "Tere liye / Tujh se / Tujh se (tere baare mein)"
      },
      {
        "arabic": "فِيكَ / إِلَيْكَ / عَلَيْكَ / بِكَ",
        "hinglish": "Tujh mein / Teri taraf / Tujh par / Tujh se"
      },
      {
        "arabic": "إِنَّكَ / أَنَّكَ",
        "hinglish": "Beshak tu (aap) / Ke tu (aap)"
      }
    ]
  },
  "s4l9": {
    "lessonKey": "s4l9",
    "title": "S4L9: Zameer-e-Munfasil Mu'annas Ghaib: فِتْنَةٌ ← هِيَ فِتْنَةٌ",
    "badge": "Zameer (هِيَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">فِتْنَةٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Aazmaish</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Zameer (هِيَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">هِيَ فِتْنَةٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Woh (mu'annas) ek aazmaish hai</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'فِتْنَةٌ' par Zameer (هِيَ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'هِيَ فِتْنَةٌ' (Woh (mu'annas) ek aazmaish hai) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Zameer (هِيَ) ke qaa'ide se 'فِتْنَةٌ' badal kar 'هِيَ فِتْنَةٌ' (Woh (mu'annas) ek aazmaish hai) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "فِتْنَةٌ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "هِيَ فِتْنَةٌ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Zameer (هِيَ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. هِيَ + Mu'annas Ism",
        "description": "هِيَ فِتْنَةٌ / هِيَ بَيْضَاءُ — Woh ek aazmaish hai / Woh (haath) roshan sufaid hai"
      },
      {
        "title": "1. وَهِيَ / فَهِيَ",
        "description": "وَهِيَ خَاوِيَةٌ / فَهِيَ كَالْحِجَارَةِ — Halanke woh giri hui thi / Toh woh pattharon ki tarah hain"
      },
      {
        "title": "1. هِيَ + الْـ (Hasr)",
        "description": "هِيَ الْحَيَوَانُ / هِيَ الْمَأْوَىٰ — Wohi asal zindagi hai / Wohi thikana hai"
      }
    ],
    "examples": [
      {
        "arabic": "هِيَ فِتْنَةٌ / هِيَ بَيْضَاءُ",
        "hinglish": "Woh ek aazmaish hai / Woh (haath) roshan sufaid hai"
      },
      {
        "arabic": "وَهِيَ خَاوِيَةٌ / فَهِيَ كَالْحِجَارَةِ",
        "hinglish": "Halanke woh giri hui thi / Toh woh pattharon ki tarah hain"
      },
      {
        "arabic": "هِيَ الْحَيَوَانُ / هِيَ الْمَأْوَىٰ",
        "hinglish": "Wohi asal zindagi hai / Wohi thikana hai"
      }
    ]
  },
  "s4l10": {
    "lessonKey": "s4l10",
    "title": "S4L10: Zameer-e-Muttasil Mu'annas Ghaib: بَيْتٌ ← بَيْتُهَا",
    "badge": "Zameer (ـهَا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">بَيْتٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Ghar</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Zameer (ـهَا))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">بَيْتُهَا</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Us (mu'annas) ka ghar</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'بَيْتٌ' par Zameer (ـهَا) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'بَيْتُهَا' (Us (mu'annas) ka ghar) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Zameer (ـهَا) ke qaa'ide se 'بَيْتٌ' badal kar 'بَيْتُهَا' (Us (mu'annas) ka ghar) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "بَيْتٌ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "بَيْتُهَا (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Zameer (ـهَا)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. بَيْتٌ (Ghar)",
        "description": "بَيْتُهَا — Us (aurat / basti) ka ghar"
      },
      {
        "title": "1. رَبٌّ / أَهْلٌ",
        "description": "رَبُّهَا / أَهْلُهَا — Uska Rabb / Us (basti) ke rehne wale"
      },
      {
        "title": "1. أَكْلٌ / فَرْعٌ",
        "description": "أُكُلُهَا / فَرْعُهَا — Us (darakht) ka phal / Uski shaakh"
      }
    ],
    "examples": [
      {
        "arabic": "بَيْتُهَا",
        "hinglish": "Us (aurat / basti) ka ghar"
      },
      {
        "arabic": "رَبُّهَا / أَهْلُهَا",
        "hinglish": "Uska Rabb / Us (basti) ke rehne wale"
      },
      {
        "arabic": "أُكُلُهَا / فَرْعُهَا",
        "hinglish": "Us (darakht) ka phal / Uski shaakh"
      }
    ]
  },
  "s4l11": {
    "lessonKey": "s4l11",
    "title": "S4L11: Harf-e-Jarr ba-Zameer Mu'annas: بَيْتُهَا ← فِي بَيْتِهَا",
    "badge": "Jarr + ـهَا",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">بَيْتُهَا</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Uska ghar</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Jarr + ـهَا)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">فِي بَيْتِهَا</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Us (mu'annas) ke ghar mein</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'بَيْتُهَا' par Jarr + ـهَا ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'فِي بَيْتِهَا' (Us (mu'annas) ke ghar mein) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Jarr + ـهَا ke qaa'ide se 'بَيْتُهَا' badal kar 'فِي بَيْتِهَا' (Us (mu'annas) ke ghar mein) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "بَيْتُهَا (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "فِي بَيْتِهَا (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Jarr + ـهَا",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. فِي / مِنْ + Ism + ـهَا",
        "description": "فِي بَيْتِهَا / مِنْ أَهْلِهَا / فِي نَفْسِهَا — Uske ghar mein / Uske ghar walon mein se / Uske dil mein"
      },
      {
        "title": "1. عَلَىٰ / إِلَىٰ / بِـ + Ism + ـهَا",
        "description": "عَلَىٰ وُسْعِهَا / إِلَىٰ رَبِّهَا / بِإِذْنِ رَبِّهَا — Uski taqat ke mutabiq / Apne Rabb ki taraf / Apne Rabb ke hukm se"
      },
      {
        "title": "1. إِنَّ + Ism + ـهَا",
        "description": "إِنَّ بَطْشَ رَبِّكَ / إِنَّ أَكْلَهَا — Beshak uska khana / phal"
      }
    ],
    "examples": [
      {
        "arabic": "فِي بَيْتِهَا / مِنْ أَهْلِهَا / فِي نَفْسِهَا",
        "hinglish": "Uske ghar mein / Uske ghar walon mein se / Uske dil mein"
      },
      {
        "arabic": "عَلَىٰ وُسْعِهَا / إِلَىٰ رَبِّهَا / بِإِذْنِ رَبِّهَا",
        "hinglish": "Uski taqat ke mutabiq / Apne Rabb ki taraf / Apne Rabb ke hukm se"
      },
      {
        "arabic": "إِنَّ بَطْشَ رَبِّكَ / إِنَّ أَكْلَهَا",
        "hinglish": "Beshak uska khana / phal"
      }
    ]
  },
  "s4l12": {
    "lessonKey": "s4l12",
    "title": "S4L12: Huroof ke saath Zameer Mu'annas: لِـ ← لَهَا ، مِنْ ← مِنْهَا ، فِي ← فِيهَا",
    "badge": "Huroof + ـهَا",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">لِـ ، مِنْ ، فِي</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Ke liye, se, mein</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Huroof + ـهَا)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">لَهَا ، مِنْهَا ، فِيهَا</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Uske liye, us-se, usmein</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'لِـ ، مِنْ ، فِي' par Huroof + ـهَا ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'لَهَا ، مِنْهَا ، فِيهَا' (Uske liye, us-se, usmein) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Huroof + ـهَا ke qaa'ide se 'لِـ ، مِنْ ، فِي' badal kar 'لَهَا ، مِنْهَا ، فِيهَا' (Uske liye, us-se, usmein) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "لِـ ، مِنْ ، فِي (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "لَهَا ، مِنْهَا ، فِيهَا (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Huroof + ـهَا",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. لِـ / مِنْ / عَنْ + ـهَا",
        "description": "لَهَا / مِنْهَا / عَنْهَا — Uske liye / Usmein se / Us-se"
      },
      {
        "title": "1. فِي / إِلَىٰ / عَلَىٰ / بِـ + ـهَا",
        "description": "فِيهَا / إِلَيْهَا / عَلَيْهَا / بِهَا — Usmein (Jannat/Dunya mein) / Uski taraf / Us par / Uske saath"
      },
      {
        "title": "1. إِنَّ / أَنَّ / كَأَنَّ + ـهَا",
        "description": "إِنَّهَا / أَنَّهَا / كَأَنَّهَا — Beshak woh / Ke woh / Goya woh"
      }
    ],
    "examples": [
      {
        "arabic": "لَهَا / مِنْهَا / عَنْهَا",
        "hinglish": "Uske liye / Usmein se / Us-se"
      },
      {
        "arabic": "فِيهَا / إِلَيْهَا / عَلَيْهَا / بِهَا",
        "hinglish": "Usmein (Jannat/Dunya mein) / Uski taraf / Us par / Uske saath"
      },
      {
        "arabic": "إِنَّهَا / أَنَّهَا / كَأَنَّهَا",
        "hinglish": "Beshak woh / Ke woh / Goya woh"
      }
    ]
  },
  "s4l13": {
    "lessonKey": "s4l13",
    "title": "S4L13: Zameer-e-Munfasil Mutakallim: يُوسُفُ ← أَنَا يُوسُفُ",
    "badge": "Zameer (أَنَا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">يُوسُفُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Yusuf</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Zameer (أَنَا))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">أَنَا يُوسُفُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Main Yusuf hoon</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'يُوسُفُ' par Zameer (أَنَا) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'أَنَا يُوسُفُ' (Main Yusuf hoon) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Zameer (أَنَا) ke qaa'ide se 'يُوسُفُ' badal kar 'أَنَا يُوسُفُ' (Main Yusuf hoon) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "يُوسُفُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "أَنَا يُوسُفُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Zameer (أَنَا)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. أَنَا + Ism",
        "description": "أَنَا يُوسُفُ / أَنَا نَذِيرٌ مُبِينٌ — Main Yusuf hoon / Main khula darane wala hoon"
      },
      {
        "title": "1. وَمَا أَنَا بِـ...",
        "description": "وَمَا أَنَا بِطَارِدِ الْمُؤْمِنِينَ / بِوَكِيلٍ — Aur main mominon ko nikalne wala / zimmedar nahin hoon"
      },
      {
        "title": "1. إِنَّنِي أَنَا / وَأَنَا + الْـ",
        "description": "إِنَّنِي أَنَا اللَّهُ / وَأَنَا التَّوَّابُ الرَّحِيمُ — Beshak Main hi Allah hoon / Aur Main hi tauba qabool karne wala hoon"
      }
    ],
    "examples": [
      {
        "arabic": "أَنَا يُوسُفُ / أَنَا نَذِيرٌ مُبِينٌ",
        "hinglish": "Main Yusuf hoon / Main khula darane wala hoon"
      },
      {
        "arabic": "وَمَا أَنَا بِطَارِدِ الْمُؤْمِنِينَ / بِوَكِيلٍ",
        "hinglish": "Aur main mominon ko nikalne wala / zimmedar nahin hoon"
      },
      {
        "arabic": "إِنَّنِي أَنَا اللَّهُ / وَأَنَا التَّوَّابُ الرَّحِيمُ",
        "hinglish": "Beshak Main hi Allah hoon / Aur Main hi tauba qabool karne wala hoon"
      }
    ]
  },
  "s4l14": {
    "lessonKey": "s4l14",
    "title": "S4L14: Zameer-e-Muttasil Mutakallim: بَيْتٌ ← بَيْتِي",
    "badge": "Zameer (ـِي)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">بَيْتٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Ghar</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Zameer (ـِي))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">بَيْتِي</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Mera ghar</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'بَيْتٌ' par Zameer (ـِي) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'بَيْتِي' (Mera ghar) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Zameer (ـِي) ke qaa'ide se 'بَيْتٌ' badal kar 'بَيْتِي' (Mera ghar) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "بَيْتٌ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "بَيْتِي (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Zameer (ـِي)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. بَيْتٌ / رَبٌّ + ـِي",
        "description": "بَيْتِي / رَبِّي — Mera ghar / Mera Rabb (Yaa se pehle Zair)"
      },
      {
        "title": "1. صَلَاةٌ / رَحْمَةٌ + ـِي",
        "description": "صَلَاتِي / رَحْمَتِي — Meri namaz / Meri rahmat (Gol ة khul kar تِ ban gayi)"
      },
      {
        "title": "1. عَصَا / هُدًى + ـيَ",
        "description": "عَصَايَ / هُدَايَ / مَحْيَايَ — Meri laathi / Meri hidayat / Meri zindagi (Alif ke baad ـيَ)"
      }
    ],
    "examples": [
      {
        "arabic": "بَيْتِي / رَبِّي",
        "hinglish": "Mera ghar / Mera Rabb (Yaa se pehle Zair)"
      },
      {
        "arabic": "صَلَاتِي / رَحْمَتِي",
        "hinglish": "Meri namaz / Meri rahmat (Gol ة khul kar تِ ban gayi)"
      },
      {
        "arabic": "عَصَايَ / هُدَايَ / مَحْيَايَ",
        "hinglish": "Meri laathi / Meri hidayat / Meri zindagi (Alif ke baad ـيَ)"
      }
    ]
  },
  "s4l15": {
    "lessonKey": "s4l15",
    "title": "S4L15: Harf-e-Jarr ba-Zameer Mutakallim: بَيْتِي ← فِي بَيْتِي",
    "badge": "Jarr + ـِي",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">بَيْتِي</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Mera ghar</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Jarr + ـِي)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">فِي بَيْتِي</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Mere ghar mein</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'بَيْتِي' par Jarr + ـِي ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'فِي بَيْتِي' (Mere ghar mein) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Jarr + ـِي ke qaa'ide se 'بَيْتِي' badal kar 'فِي بَيْتِي' (Mere ghar mein) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "بَيْتِي (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "فِي بَيْتِي (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Jarr + ـِي",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. فِي / إِلَىٰ + Ism + ـِي",
        "description": "فِي بَيْتِي / إِلَىٰ رَبِّي / فِي سَبِيلِي — Mere ghar mein / Mere Rabb ki taraf / Mere raaste mein"
      },
      {
        "title": "1. مِنْ / عَلَىٰ + Ism + ـِي",
        "description": "مِنْ ذُرِّيَّتِي / عَلَىٰ رَبِّي / مِنْ أَهْلِي — Meri aulaad mein se / Mere Rabb par / Mere ghar walon mein se"
      },
      {
        "title": "1. إِنَّ + Ism + ـِي",
        "description": "إِنَّ رَبِّي / إِنَّ صَلَاتِي / إِنَّ عَذَابِي — Beshak mera Rabb / Beshak meri namaz / Beshak mera azaab"
      }
    ],
    "examples": [
      {
        "arabic": "فِي بَيْتِي / إِلَىٰ رَبِّي / فِي سَبِيلِي",
        "hinglish": "Mere ghar mein / Mere Rabb ki taraf / Mere raaste mein"
      },
      {
        "arabic": "مِنْ ذُرِّيَّتِي / عَلَىٰ رَبِّي / مِنْ أَهْلِي",
        "hinglish": "Meri aulaad mein se / Mere Rabb par / Mere ghar walon mein se"
      },
      {
        "arabic": "إِنَّ رَبِّي / إِنَّ صَلَاتِي / إِنَّ عَذَابِي",
        "hinglish": "Beshak mera Rabb / Beshak meri namaz / Beshak mera azaab"
      }
    ]
  },
  "s4l16": {
    "lessonKey": "s4l16",
    "title": "S4L16: Huroof ke saath Zameer Mutakallim: لِـ ← لِي ، مِنْ ← مِنِّي ، عَلَىٰ ← عَلَيَّ",
    "badge": "Huroof + ـِي",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">لِـ ، مِنْ ، عَلَىٰ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Ke liye, se, par</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Huroof + ـِي)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">لِي ، مِنِّي ، عَلَيَّ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Mere liye, mujh se, mujh par</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'لِـ ، مِنْ ، عَلَىٰ' par Huroof + ـِي ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'لِي ، مِنِّي ، عَلَيَّ' (Mere liye, mujh se, mujh par) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Huroof + ـِي ke qaa'ide se 'لِـ ، مِنْ ، عَلَىٰ' badal kar 'لِي ، مِنِّي ، عَلَيَّ' (Mere liye, mujh se, mujh par) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "لِـ ، مِنْ ، عَلَىٰ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "لِي ، مِنِّي ، عَلَيَّ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Huroof + ـِي",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. لِـ / بِـ / فِي + ـِي",
        "description": "لِي / بِي / فِيَّ — Mere liye (mera) / Mujh se / Mujh mein"
      },
      {
        "title": "1. مِنْ / عَنْ + ـنِي (Noon Wiqayah)",
        "description": "مِنِّي / عَنِّي — Mujh se / Mujh se (tashdeed ke saath)"
      },
      {
        "title": "1. إِلَىٰ / عَلَىٰ + ـيَّ",
        "description": "إِلَيَّ / عَلَيَّ / لَدَيَّ — Meri taraf / Mujh par / Mere paas"
      }
    ],
    "examples": [
      {
        "arabic": "لِي / بِي / فِيَّ",
        "hinglish": "Mere liye (mera) / Mujh se / Mujh mein"
      },
      {
        "arabic": "مِنِّي / عَنِّي",
        "hinglish": "Mujh se / Mujh se (tashdeed ke saath)"
      },
      {
        "arabic": "إِلَيَّ / عَلَيَّ / لَدَيَّ",
        "hinglish": "Meri taraf / Mujh par / Mere paas"
      }
    ]
  },
  "s4l17": {
    "lessonKey": "s4l17",
    "title": "S4L17: Haalat-e-Nasb (Haal): مُجْرِمٌ ← مُجْرِمًا (Do Zabar)",
    "badge": "Haal (ـًا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">مُجْرِمٌ ، خَائِفٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Mujrim, darne wala</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Haal (ـًا))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">مُجْرِمًا ، خَائِفًا</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Mujrim ban kar / darne ki haalat mein</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'مُجْرِمٌ ، خَائِفٌ' par Haal (ـًا) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'مُجْرِمًا ، خَائِفًا' (Mujrim ban kar / darne ki haalat mein) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Haal (ـًا) ke qaa'ide se 'مُجْرِمٌ ، خَائِفٌ' badal kar 'مُجْرِمًا ، خَائِفًا' (Mujrim ban kar / darne ki haalat mein) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "مُجْرِمٌ ، خَائِفٌ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "مُجْرِمًا ، خَائِفًا (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Haal (ـًا)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. مُجْرِمٌ (Mujrim)",
        "description": "مُجْرِمًا — Mujrim ban kar / Bahaiseeyat mujrim"
      },
      {
        "title": "1. خَائِفٌ / سَاجِدٌ",
        "description": "خَائِفًا / سَاجِدًا — Darte hue / Sajda karte hue"
      },
      {
        "title": "1. قَائِمٌ / قَاعِدٌ / خَالِدٌ",
        "description": "قَائِمًا / قَاعِدًا / خَالِدًا فِيهَا — Khade hote hue / Baithe hue / Hamesha rehne wala ban kar"
      }
    ],
    "examples": [
      {
        "arabic": "مُجْرِمًا",
        "hinglish": "Mujrim ban kar / Bahaiseeyat mujrim"
      },
      {
        "arabic": "خَائِفًا / سَاجِدًا",
        "hinglish": "Darte hue / Sajda karte hue"
      },
      {
        "arabic": "قَائِمًا / قَاعِدًا / خَالِدًا فِيهَا",
        "hinglish": "Khade hote hue / Baithe hue / Hamesha rehne wala ban kar"
      }
    ]
  },
  "s4l18": {
    "lessonKey": "s4l18",
    "title": "S4L18: Ism-ul-Maf'ool (Jis par kaam hua): مَظْلُومٌ ، مَذْكُورٌ ، مَنْصُورٌ",
    "badge": "Ism-ul-Maf'ool (مَفْعُولٌ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">ظُلْمٌ ، ذِكْرٌ ، نَصْرٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Zulm, zikr, madad</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Ism-ul-Maf'ool (مَفْعُولٌ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">مَظْلُومٌ ، مَذْكُورٌ ، مَنْصُورٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jis par zulm hua, jiska zikr kiya gaya, jiski madad ki gayi</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'ظُلْمٌ ، ذِكْرٌ ، نَصْرٌ' par Ism-ul-Maf'ool (مَفْعُولٌ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'مَظْلُومٌ ، مَذْكُورٌ ، مَنْصُورٌ' (Jis par zulm hua, jiska zikr kiya gaya, jiski madad ki gayi) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Ism-ul-Maf'ool (مَفْعُولٌ) ke qaa'ide se 'ظُلْمٌ ، ذِكْرٌ ، نَصْرٌ' badal kar 'مَظْلُومٌ ، مَذْكُورٌ ، مَنْصُورٌ' (Jis par zulm hua, jiska zikr kiya gaya, jiski madad ki gayi) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "ظُلْمٌ ، ذِكْرٌ ، نَصْرٌ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "مَظْلُومٌ ، مَذْكُورٌ ، مَنْصُورٌ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Ism-ul-Maf'ool (مَفْعُولٌ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. مَـ + فْ + عُ + و + لٌ",
        "description": "مَظْلُومٌ / مَنْصُورٌ — Jis par zulm kiya gaya / Jiski madad ki gayi"
      },
      {
        "title": "1. مَفْعُولٌ Wazan",
        "description": "مَذْكُورٌ / مَشْكُورٌ / مَسْئُولٌ — Jiska zikr kiya gaya / Jiska shukr kiya gaya / Jisse poochha jaye"
      },
      {
        "title": "1. Qur'ani Sifaat",
        "description": "مَحْفُوظٌ / مَسْطُورٌ / مَشْهُودٌ / مَعْرُوفٌ — Hifazat kiya hua / Likha hua / Haazri wala / Bhala (jaana-pehchana)"
      }
    ],
    "examples": [
      {
        "arabic": "مَظْلُومٌ / مَنْصُورٌ",
        "hinglish": "Jis par zulm kiya gaya / Jiski madad ki gayi"
      },
      {
        "arabic": "مَذْكُورٌ / مَشْكُورٌ / مَسْئُولٌ",
        "hinglish": "Jiska zikr kiya gaya / Jiska shukr kiya gaya / Jisse poochha jaye"
      },
      {
        "arabic": "مَحْفُوظٌ / مَسْطُورٌ / مَشْهُودٌ / مَعْرُوفٌ",
        "hinglish": "Hifazat kiya hua / Likha hua / Haazri wala / Bhala (jaana-pehchana)"
      }
    ]
  }
};

/**
 * Mount visual for a lesson in Unit 4.
 * @param {string} containerId - Container DOM ID
 * @param {string} [lessonKey] - Lesson key (e.g. "s4l1")
 * @returns {void}
 */
export function mount(containerId, lessonKey) {
  destroy();
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;

  const key = (lessonKey || 's4l1').toLowerCase();
  const config = visuals[key] || visuals['s4l1'];
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