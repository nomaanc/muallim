// @ts-check
import { renderVisual } from './visual-helper.js';

/**
 * Muallim ul-Qur'an — Unit 2 Grammar Visuals Module (v2.0)
 * Exports standard mount/destroy interface for all lessons in Unit 2.
 */

/** @type {(() => void) | null} */
let _activeTeardown = null;

/**
 * Visual configurations for Unit 2
 * @type {Record<string, import('./visual-helper.js').VisualConfig>}
 */
export const visuals = {
  "s2l1": {
    "lessonKey": "s2l1",
    "title": "S2L1: Inna al-Kitaaba — Harf-e-Ta'keed 'Inna'",
    "badge": "Harf-e-Ta'keed (إِنَّ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Marfoo (Pesh ki halat)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">إِنَّ الْكِتَابَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Harf-e-Ta'keed (إِنَّ) ke dakhil hone ke baad</text>\n  </svg>",
    "prediction": {
        "question": "Jab Harf-e-Ta'keed (إِنَّ) ism par dakhil hota hai toh aakhiri harf ka i'raab kya hota hai?",
        "options": [
            "'إِنَّ الْكِتَابَ' ban jaata hai",
            "Pesh hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Harf-e-Ta'keed (إِنَّ) aane se aakhiri harf ka i'raab badal kar 'إِنَّ الْكِتَابَ' ho jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "الْكِتَابُ (Asal Ism)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "إِنَّ الْكِتَابَ (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab ki Tabdeeli",
            "targetId": "v-vowel"
        }
    ]
},
  "s2l2": {
    "lessonKey": "s2l2",
    "title": "S2L2: Lil-Kitaabi — Harf-e-Jarr 'Li' (Kitaab ke liye)",
    "badge": "Harf-e-Jarr (لِـ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Marfoo (Pesh ki halat)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">لِلْكِتَابِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Harf-e-Jarr (لِـ) ke dakhil hone ke baad</text>\n  </svg>",
    "prediction": {
        "question": "Jab Harf-e-Jarr (لِـ) ism par dakhil hota hai toh aakhiri harf ka i'raab kya hota hai?",
        "options": [
            "'لِلْكِتَابِ' ban jaata hai",
            "Pesh hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Harf-e-Jarr (لِـ) aane se aakhiri harf ka i'raab badal kar 'لِلْكِتَابِ' ho jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "الْكِتَابُ (Asal Ism)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "لِلْكِتَابِ (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab ki Tabdeeli",
            "targetId": "v-vowel"
        }
    ]
},
  "s2l3": {
    "lessonKey": "s2l3",
    "title": "S2L3: Fil-Kitaabi — Harf-e-Jarr 'Fii' (Kitaab mein)",
    "badge": "Harf-e-Jarr (فِي)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Marfoo (Pesh ki halat)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">فِي الْكِتَابِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Harf-e-Jarr (فِي) ke dakhil hone ke baad</text>\n  </svg>",
    "prediction": {
        "question": "Jab Harf-e-Jarr (فِي) ism par dakhil hota hai toh aakhiri harf ka i'raab kya hota hai?",
        "options": [
            "'فِي الْكِتَابِ' ban jaata hai",
            "Pesh hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Harf-e-Jarr (فِي) aane se aakhiri harf ka i'raab badal kar 'فِي الْكِتَابِ' ho jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "الْكِتَابُ (Asal Ism)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "فِي الْكِتَابِ (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab ki Tabdeeli",
            "targetId": "v-vowel"
        }
    ]
},
  "s2l4": {
    "lessonKey": "s2l4",
    "title": "S2L4: Alal-Kitaabi — Harf-e-Jarr 'Alaa' (Kitaab par)",
    "badge": "Harf-e-Jarr (عَلَى)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Marfoo (Pesh ki halat)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">عَلَى الْكِتَابِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Harf-e-Jarr (عَلَى) ke dakhil hone ke baad</text>\n  </svg>",
    "prediction": {
        "question": "Jab Harf-e-Jarr (عَلَى) ism par dakhil hota hai toh aakhiri harf ka i'raab kya hota hai?",
        "options": [
            "'عَلَى الْكِتَابِ' ban jaata hai",
            "Pesh hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Harf-e-Jarr (عَلَى) aane se aakhiri harf ka i'raab badal kar 'عَلَى الْكِتَابِ' ho jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "الْكِتَابُ (Asal Ism)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "عَلَى الْكِتَابِ (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab ki Tabdeeli",
            "targetId": "v-vowel"
        }
    ]
},
  "s2l5": {
    "lessonKey": "s2l5",
    "title": "S2L5: Minal-Kitaabi — Harf-e-Jarr 'Min' (Kitaab se)",
    "badge": "Harf-e-Jarr (مِنْ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Marfoo (Pesh ki halat)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">مِنَ الْكِتَابِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Harf-e-Jarr (مِنْ) ke dakhil hone ke baad</text>\n  </svg>",
    "prediction": {
        "question": "Jab Harf-e-Jarr (مِنْ) ism par dakhil hota hai toh aakhiri harf ka i'raab kya hota hai?",
        "options": [
            "'مِنَ الْكِتَابِ' ban jaata hai",
            "Pesh hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Harf-e-Jarr (مِنْ) aane se aakhiri harf ka i'raab badal kar 'مِنَ الْكِتَابِ' ho jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "الْكِتَابُ (Asal Ism)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "مِنَ الْكِتَابِ (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab ki Tabdeeli",
            "targetId": "v-vowel"
        }
    ]
},
  "s2l6": {
    "lessonKey": "s2l6",
    "title": "S2L6: Ilal-Kitaabi — Harf-e-Jarr 'Ilaa' (Kitaab ki taraf)",
    "badge": "Harf-e-Jarr (إِلَى)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Marfoo (Pesh ki halat)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">إِلَى الْكِتَابِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Harf-e-Jarr (إِلَى) ke dakhil hone ke baad</text>\n  </svg>",
    "prediction": {
        "question": "Jab Harf-e-Jarr (إِلَى) ism par dakhil hota hai toh aakhiri harf ka i'raab kya hota hai?",
        "options": [
            "'إِلَى الْكِتَابِ' ban jaata hai",
            "Pesh hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Harf-e-Jarr (إِلَى) aane se aakhiri harf ka i'raab badal kar 'إِلَى الْكِتَابِ' ho jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "الْكِتَابُ (Asal Ism)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "إِلَى الْكِتَابِ (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab ki Tabdeeli",
            "targetId": "v-vowel"
        }
    ]
},
  "s2l7": {
    "lessonKey": "s2l7",
    "title": "S2L7: Bil-Kitaabi — Harf-e-Jarr 'Bi' (Kitaab ke saath)",
    "badge": "Harf-e-Jarr (بِـ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Marfoo (Pesh ki halat)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">بِالْكِتَابِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Harf-e-Jarr (بِـ) ke dakhil hone ke baad</text>\n  </svg>",
    "prediction": {
        "question": "Jab Harf-e-Jarr (بِـ) ism par dakhil hota hai toh aakhiri harf ka i'raab kya hota hai?",
        "options": [
            "'بِالْكِتَابِ' ban jaata hai",
            "Pesh hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Harf-e-Jarr (بِـ) aane se aakhiri harf ka i'raab badal kar 'بِالْكِتَابِ' ho jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "الْكِتَابُ (Asal Ism)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "بِالْكِتَابِ (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab ki Tabdeeli",
            "targetId": "v-vowel"
        }
    ]
},
  "s2l8": {
    "lessonKey": "s2l8",
    "title": "S2L8: Laa Kitaaba — Harf-e-Nafy-e-Jins 'Laa'",
    "badge": "Nafy-e-Jins (لَا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">كِتَابٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Marfoo (Pesh ki halat)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">لَا كِتَابَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Nafy-e-Jins (لَا) ke dakhil hone ke baad</text>\n  </svg>",
    "prediction": {
        "question": "Jab Nafy-e-Jins (لَا) ism par dakhil hota hai toh aakhiri harf ka i'raab kya hota hai?",
        "options": [
            "'لَا كِتَابَ' ban jaata hai",
            "Pesh hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Nafy-e-Jins (لَا) aane se aakhiri harf ka i'raab badal kar 'لَا كِتَابَ' ho jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "كِتَابٌ (Asal Ism)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "لَا كِتَابَ (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab ki Tabdeeli",
            "targetId": "v-vowel"
        }
    ]
},
  "s2l9": {
    "lessonKey": "s2l9",
    "title": "S2L9: Illal-Kitaaba — Harf-e-Istisna 'Illaa'",
    "badge": "Istisna (إِلَّا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Marfoo (Pesh ki halat)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">إِلَّا الْكِتَابَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Istisna (إِلَّا) ke dakhil hone ke baad</text>\n  </svg>",
    "prediction": {
        "question": "Jab Istisna (إِلَّا) ism par dakhil hota hai toh aakhiri harf ka i'raab kya hota hai?",
        "options": [
            "'إِلَّا الْكِتَابَ' ban jaata hai",
            "Pesh hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Istisna (إِلَّا) aane se aakhiri harf ka i'raab badal kar 'إِلَّا الْكِتَابَ' ho jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "الْكِتَابُ (Asal Ism)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "إِلَّا الْكِتَابَ (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab ki Tabdeeli",
            "targetId": "v-vowel"
        }
    ]
},
  "s2l10": {
    "lessonKey": "s2l10",
    "title": "S2L10: Wal-Kitaabi — Waw-e-Qasam",
    "badge": "Waw-e-Qasam (وَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Marfoo (Pesh ki halat)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">وَالْكِتَابِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Waw-e-Qasam (وَ) ke dakhil hone ke baad</text>\n  </svg>",
    "prediction": {
        "question": "Jab Waw-e-Qasam (وَ) ism par dakhil hota hai toh aakhiri harf ka i'raab kya hota hai?",
        "options": [
            "'وَالْكِتَابِ' ban jaata hai",
            "Pesh hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Waw-e-Qasam (وَ) aane se aakhiri harf ka i'raab badal kar 'وَالْكِتَابِ' ho jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "الْكِتَابُ (Asal Ism)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "وَالْكِتَابِ (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab ki Tabdeeli",
            "targetId": "v-vowel"
        }
    ]
},
  "s2l11": {
    "lessonKey": "s2l11",
    "title": "S2L11: Anna al-Kitaaba — Harf 'Anna' (Ke kitaab)",
    "badge": "Harf Masdariyyah (أَنَّ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Marfoo (Pesh ki halat)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">أَنَّ الْكِتَابَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Harf Masdariyyah (أَنَّ) ke dakhil hone ke baad</text>\n  </svg>",
    "prediction": {
        "question": "Jab Harf Masdariyyah (أَنَّ) ism par dakhil hota hai toh aakhiri harf ka i'raab kya hota hai?",
        "options": [
            "'أَنَّ الْكِتَابَ' ban jaata hai",
            "Pesh hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Harf Masdariyyah (أَنَّ) aane se aakhiri harf ka i'raab badal kar 'أَنَّ الْكِتَابَ' ho jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "الْكِتَابُ (Asal Ism)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "أَنَّ الْكِتَابَ (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab ki Tabdeeli",
            "targetId": "v-vowel"
        }
    ]
},
  "s2l12": {
    "lessonKey": "s2l12",
    "title": "S2L12: Kaana Rasoolan — Fe'l Naaqis 'Kaana'",
    "badge": "Fe'l Naaqis (كَانَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">رَسُولٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Marfoo (Pesh ki halat)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">كَانَ رَسُولًا</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Fe'l Naaqis (كَانَ) ke dakhil hone ke baad</text>\n  </svg>",
    "prediction": {
        "question": "Jab Fe'l Naaqis (كَانَ) ism par dakhil hota hai toh aakhiri harf ka i'raab kya hota hai?",
        "options": [
            "'كَانَ رَسُولًا' ban jaata hai",
            "Pesh hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Fe'l Naaqis (كَانَ) aane se aakhiri harf ka i'raab badal kar 'كَانَ رَسُولًا' ho jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "رَسُولٌ (Asal Ism)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "كَانَ رَسُولًا (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab ki Tabdeeli",
            "targetId": "v-vowel"
        }
    ]
},
  "s2l13": {
    "lessonKey": "s2l13",
    "title": "S2L13: Yaa Aadamu — Harf-e-Nida 'Yaa' (Ae Adam)",
    "badge": "Harf-e-Nida (يَا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">آدَمُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Marfoo (Pesh ki halat)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">يَا آدَمُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Harf-e-Nida (يَا) ke dakhil hone ke baad</text>\n  </svg>",
    "prediction": {
        "question": "Jab Harf-e-Nida (يَا) ism par dakhil hota hai toh aakhiri harf ka i'raab kya hota hai?",
        "options": [
            "'يَا آدَمُ' ban jaata hai",
            "Pesh hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Harf-e-Nida (يَا) aane se aakhiri harf ka i'raab badal kar 'يَا آدَمُ' ho jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "آدَمُ (Asal Ism)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "يَا آدَمُ (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab ki Tabdeeli",
            "targetId": "v-vowel"
        }
    ]
}
};

/**
 * Mount visual for a lesson in Unit 2.
 * @param {string} containerId - Container DOM ID
 * @param {string} [lessonKey] - Lesson key (e.g. "s2l1")
 * @returns {void}
 */
export function mount(containerId, lessonKey) {
  destroy();
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;

  const key = (lessonKey || 's2l1').toLowerCase();
  const config = visuals[key] || visuals['s2l1'];
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
