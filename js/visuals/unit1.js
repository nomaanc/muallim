// @ts-check
import { renderVisual } from './visual-helper.js';

/**
 * Muallim ul-Qur'an — Unit 1 Grammar Visuals Module (v2.0)
 * Exports standard mount/destroy interface for all lessons in Unit 1.
 */

/** @type {(() => void) | null} */
let _activeTeardown = null;

/**
 * Visual configurations for Unit 1
 * @type {Record<string, import('./visual-helper.js').VisualConfig>}
 */
export const visuals = {
  "s1l1": {
    "lessonKey": "s1l1",
    "title": "S1L1: Ma'rifah vs Nakirah (الْـ prefix)",
    "badge": "Ism Khas & Aam",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">كِتَابٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Aam Ism (Koi kitaab) — Tanween ke saath</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">الْكِتَابُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Khas Ism (Khaas kitaab) — Tanween gir gayi</text>\n  </svg>",
    "prediction": {
        "question": "Jab kisi aam lafz par 'الْـ' lagate hain, toh aakhir mein kya hota hai?",
        "options": [
            "Tanween gir kar ek harkat reh jaati hai",
            "Do pesh waise hi rehte hain"
        ],
        "correct": 0,
        "explanation": "Arabi mein 'الْـ' aur Tanween ek saath kabhi nahi aate — Tanween gir jaati hai."
    },
    "chips": [
        {
            "role": "prefix",
            "label": "الْـ (Khas Banane Wala)",
            "targetId": "v-prefix"
        },
        {
            "role": "root",
            "label": "كِتَاب (Bunyadi Lafz)",
            "targetId": "v-root"
        },
        {
            "role": "vowel",
            "label": "ُ (Ek Pesh - Tanween Khatam)",
            "targetId": "v-vowel"
        }
    ]
},
  "s1l2": {
    "lessonKey": "s1l2",
    "title": "S1L2: Muzakkar vs Muannas (Taa Marbutah ة)",
    "badge": "Jins (Gender)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">مُؤْمِنٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Muzakkar (Momin Mard)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">مُؤْمِنَةٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Muannas (Momin Aurat) — Taa Marbutah 'ة' ke sath</text>\n  </svg>",
    "prediction": {
        "question": "Agar kisi muzakkar ism ke aakhir mein 'ة' lagayein, toh kya banta hai?",
        "options": [
            "Woh ism Muannas (feminine) ban jaata hai",
            "Woh ism Jama (plural) ban jaata hai"
        ],
        "correct": 0,
        "explanation": "Taa Marbutah 'ة' Arabi mein muannas ki sabse aam alamat hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "مُؤْمِن (Muzakkar Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "ة (Taa Marbutah - Muannas Alamat)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "ٌ (Do Pesh)",
            "targetId": "v-vowel"
        }
    ]
},
  "s1l3": {
    "lessonKey": "s1l3",
    "title": "S1L3: Ism Isharah Qareeb (هَذَا / هَذِهِ)",
    "badge": "Ishaarah Qareeb",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">هَذَا كِتَابٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Muzakkar Qareeb (Yeh kitaab hai)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">هَذِهِ شَجَرَةٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Muannas Qareeb (Yeh darakht hai)</text>\n  </svg>",
    "prediction": {
        "question": "Kisi qareeb ki muannas cheez ki taraf ishara karne ke liye kya istemal hoga?",
        "options": [
            "هَذِهِ (Haazihi)",
            "هَذَا (Haaza)"
        ],
        "correct": 0,
        "explanation": "Qareeb muzakkar ke liye 'هَذَا' aur muannas ke liye 'هَذِهِ' aata hai."
    },
    "chips": [
        {
            "role": "prefix",
            "label": "هَذَا / هَذِهِ (Ism-e-Ishaarah)",
            "targetId": "v-prefix"
        },
        {
            "role": "root",
            "label": "كِتَاب / شَجَرَة (Musharun Ilayh)",
            "targetId": "v-root"
        },
        {
            "role": "vowel",
            "label": "ٌ (Tanween)",
            "targetId": "v-vowel"
        }
    ]
},
  "s1l4": {
    "lessonKey": "s1l4",
    "title": "S1L4: Ism Isharah Baeed (ذَلِكَ / تِلْكَ)",
    "badge": "Ishaarah Baeed",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">ذَلِكَ الْكِتَابُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Muzakkar Baeed (Woh kitaab)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">تِلْكَ آيَةٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Muannas Baeed (Woh aayat)</text>\n  </svg>",
    "prediction": {
        "question": "Door ki muannas cheez ki taraf ishara karne ke liye kya aayega?",
        "options": [
            "تِلْكَ (Tilka)",
            "ذَلِكَ (Zaalika)"
        ],
        "correct": 0,
        "explanation": "Door ke muzakkar ke liye 'ذَلِكَ' aur muannas ke liye 'تِلْكَ' aata hai."
    },
    "chips": [
        {
            "role": "prefix",
            "label": "ذَلِكَ / تِلْكَ (Door ka Isharah)",
            "targetId": "v-prefix"
        },
        {
            "role": "root",
            "label": "الْكِتَاب / آيَة (Musharun Ilayh)",
            "targetId": "v-root"
        },
        {
            "role": "vowel",
            "label": "ُ / ٌ (Harkat)",
            "targetId": "v-vowel"
        }
    ]
},
  "s1l5": {
    "lessonKey": "s1l5",
    "title": "S1L5: Ism Isharah Jama (هَؤُلَاءِ / أُولَئِكَ)",
    "badge": "Ishaarah Jama",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">هَٰؤُلَاءِ قَوْمٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Qareeb Jama (Yeh sab log)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">أُولَٰئِكَ هُمُ الْمُفْلِحُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Door Jama (Woh sab kamyab hain)</text>\n  </svg>",
    "prediction": {
        "question": "Door ke logon (plural) ki taraf ishara karne ke liye kya aata hai?",
        "options": [
            "أُولَٰئِكَ (Ulaa'ika)",
            "هَٰؤُلَاءِ (Haa'ulaa'i)"
        ],
        "correct": 0,
        "explanation": "Door ki jama ke liye 'أُولَٰئِكَ' (Woh log) aur qareeb ke liye 'هَٰؤُلَاءِ' (Yeh log) aata hai."
    },
    "chips": [
        {
            "role": "prefix",
            "label": "هَٰؤُلَاءِ / أُولَٰئِكَ (Jama Isharah)",
            "targetId": "v-prefix"
        },
        {
            "role": "root",
            "label": "قَوْم / الْمُفْلِحُونَ (Jama Musharun Ilayh)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "ُونَ (Jama Muzakkar Alamat)",
            "targetId": "v-suffix"
        }
    ]
},
  "s1l6": {
    "lessonKey": "s1l6",
    "title": "S1L6: Huroof-e-Tahajji & Harakaat",
    "badge": "Harakat & Aswaat",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">بَ - بِ - بُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asal Halat: بَ - بِ - بُ</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">بَنْ - بٍ - بٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Badli Hui Halat: بَنْ - بٍ - بٌ</text>\n  </svg>",
    "prediction": {
        "question": "Is sabaq (Harakat & Aswaat) ka bunyadi qaaida kya sikhata hai?",
        "options": [
            "بَنْ - بٍ - بٌ ban jaata hai",
            "Koi tabdeeli nahi aati"
        ],
        "correct": 0,
        "explanation": "Qur'ani qawaid ke mutabiq lafz par amal hone se 'بَنْ - بٍ - بٌ' ban jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "بَ - بِ - بُ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "بَنْ - بٍ - بٌ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Harkat / Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s1l7": {
    "lessonKey": "s1l7",
    "title": "S1L7: Sukoon & Jazm",
    "badge": "Sukoon (Sakin)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">مَنْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asal Halat: مَنْ</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">قُلْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Badli Hui Halat: قُلْ</text>\n  </svg>",
    "prediction": {
        "question": "Is sabaq (Sukoon (Sakin)) ka bunyadi qaaida kya sikhata hai?",
        "options": [
            "قُلْ ban jaata hai",
            "Koi tabdeeli nahi aati"
        ],
        "correct": 0,
        "explanation": "Qur'ani qawaid ke mutabiq lafz par amal hone se 'قُلْ' ban jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "مَنْ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "قُلْ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Harkat / Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s1l8": {
    "lessonKey": "s1l8",
    "title": "S1L8: Tashdeed / Shaddah",
    "badge": "Shaddah (Musheddad)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">رَبْ + بَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asal Halat: رَبْ + بَ</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">رَبَّ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Badli Hui Halat: رَبَّ</text>\n  </svg>",
    "prediction": {
        "question": "Is sabaq (Shaddah (Musheddad)) ka bunyadi qaaida kya sikhata hai?",
        "options": [
            "رَبَّ ban jaata hai",
            "Koi tabdeeli nahi aati"
        ],
        "correct": 0,
        "explanation": "Qur'ani qawaid ke mutabiq lafz par amal hone se 'رَبَّ' ban jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "رَبْ + بَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "رَبَّ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Harkat / Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s1l9": {
    "lessonKey": "s1l9",
    "title": "S1L9: Asma-ul-Husna & Tanween",
    "badge": "Sifaat-e-Ilaahi",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">غَفُورٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asal Halat: غَفُورٌ</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">الْغَفُورُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Badli Hui Halat: الْغَفُورُ</text>\n  </svg>",
    "prediction": {
        "question": "Is sabaq (Sifaat-e-Ilaahi) ka bunyadi qaaida kya sikhata hai?",
        "options": [
            "الْغَفُورُ ban jaata hai",
            "Koi tabdeeli nahi aati"
        ],
        "correct": 0,
        "explanation": "Qur'ani qawaid ke mutabiq lafz par amal hone se 'الْغَفُورُ' ban jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "غَفُورٌ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "الْغَفُورُ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Harkat / Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s1l10": {
    "lessonKey": "s1l10",
    "title": "S1L10: Jama Muzakkar Salim (ـُونَ)",
    "badge": "Jama Salim",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">مُسْلِمٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asal Halat: مُسْلِمٌ</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">مُسْلِمُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Badli Hui Halat: مُسْلِمُونَ</text>\n  </svg>",
    "prediction": {
        "question": "Is sabaq (Jama Salim) ka bunyadi qaaida kya sikhata hai?",
        "options": [
            "مُسْلِمُونَ ban jaata hai",
            "Koi tabdeeli nahi aati"
        ],
        "correct": 0,
        "explanation": "Qur'ani qawaid ke mutabiq lafz par amal hone se 'مُسْلِمُونَ' ban jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "مُسْلِمٌ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "مُسْلِمُونَ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Harkat / Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s1l11": {
    "lessonKey": "s1l11",
    "title": "S1L11: Jama Muannas Salim (ـَاتٌ)",
    "badge": "Jama Muannas",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">مُسْلِمَةٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asal Halat: مُسْلِمَةٌ</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">مُسْلِمَاتٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Badli Hui Halat: مُسْلِمَاتٌ</text>\n  </svg>",
    "prediction": {
        "question": "Is sabaq (Jama Muannas) ka bunyadi qaaida kya sikhata hai?",
        "options": [
            "مُسْلِمَاتٌ ban jaata hai",
            "Koi tabdeeli nahi aati"
        ],
        "correct": 0,
        "explanation": "Qur'ani qawaid ke mutabiq lafz par amal hone se 'مُسْلِمَاتٌ' ban jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "مُسْلِمَةٌ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "مُسْلِمَاتٌ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Harkat / Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s1l12": {
    "lessonKey": "s1l12",
    "title": "S1L12: Harf-e-Atf 'Waw' (Al-Kitabu wal-Qalamu)",
    "badge": "Atf (Waw)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asal Halat: الْكِتَابُ</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">الْكِتَابُ وَالْقَلَمُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Badli Hui Halat: الْكِتَابُ وَالْقَلَمُ</text>\n  </svg>",
    "prediction": {
        "question": "Is sabaq (Atf (Waw)) ka bunyadi qaaida kya sikhata hai?",
        "options": [
            "الْكِتَابُ وَالْقَلَمُ ban jaata hai",
            "Koi tabdeeli nahi aati"
        ],
        "correct": 0,
        "explanation": "Qur'ani qawaid ke mutabiq lafz par amal hone se 'الْكِتَابُ وَالْقَلَمُ' ban jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "الْكِتَابُ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "الْكِتَابُ وَالْقَلَمُ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Harkat / Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s1l13": {
    "lessonKey": "s1l13",
    "title": "S1L13: Nakirah se Ma'rifah: Kitaabun se Al-Kitaabu",
    "badge": "Tanween Drop",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">رَسُولٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asal Halat: رَسُولٌ</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">الرَّسُولُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Badli Hui Halat: الرَّسُولُ</text>\n  </svg>",
    "prediction": {
        "question": "Is sabaq (Tanween Drop) ka bunyadi qaaida kya sikhata hai?",
        "options": [
            "الرَّسُولُ ban jaata hai",
            "Koi tabdeeli nahi aati"
        ],
        "correct": 0,
        "explanation": "Qur'ani qawaid ke mutabiq lafz par amal hone se 'الرَّسُولُ' ban jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "رَسُولٌ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "الرَّسُولُ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Harkat / Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s1l14": {
    "lessonKey": "s1l14",
    "title": "S1L14: Huroof Shamsiyyah & Qamariyyah",
    "badge": "Shamsi & Qamari",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الشَّمْسُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asal Halat: الشَّمْسُ</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">الْقَمَرُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Badli Hui Halat: الْقَمَرُ</text>\n  </svg>",
    "prediction": {
        "question": "Is sabaq (Shamsi & Qamari) ka bunyadi qaaida kya sikhata hai?",
        "options": [
            "الْقَمَرُ ban jaata hai",
            "Koi tabdeeli nahi aati"
        ],
        "correct": 0,
        "explanation": "Qur'ani qawaid ke mutabiq lafz par amal hone se 'الْقَمَرُ' ban jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "الشَّمْسُ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "الْقَمَرُ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Harkat / Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s1l15": {
    "lessonKey": "s1l15",
    "title": "S1L15: Ism-e-Ishaarah: Haaza Kitaabun (Jumla)",
    "badge": "Jumla Isharah",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">هَٰذَا كِتَابٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asal Halat: هَٰذَا كِتَابٌ</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">هَٰذَا الْكِتَابُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Badli Hui Halat: هَٰذَا الْكِتَابُ</text>\n  </svg>",
    "prediction": {
        "question": "Is sabaq (Jumla Isharah) ka bunyadi qaaida kya sikhata hai?",
        "options": [
            "هَٰذَا الْكِتَابُ ban jaata hai",
            "Koi tabdeeli nahi aati"
        ],
        "correct": 0,
        "explanation": "Qur'ani qawaid ke mutabiq lafz par amal hone se 'هَٰذَا الْكِتَابُ' ban jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "هَٰذَا كِتَابٌ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "هَٰذَا الْكِتَابُ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Harkat / Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s1l16": {
    "lessonKey": "s1l16",
    "title": "S1L16: Ism-e-Ishaarah: Zaalika Kitaabun",
    "badge": "Baeed Jumla",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">ذَٰلِكَ كِتَابٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asal Halat: ذَٰلِكَ كِتَابٌ</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">ذَٰلِكَ الْكِتَابُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Badli Hui Halat: ذَٰلِكَ الْكِتَابُ</text>\n  </svg>",
    "prediction": {
        "question": "Is sabaq (Baeed Jumla) ka bunyadi qaaida kya sikhata hai?",
        "options": [
            "ذَٰلِكَ الْكِتَابُ ban jaata hai",
            "Koi tabdeeli nahi aati"
        ],
        "correct": 0,
        "explanation": "Qur'ani qawaid ke mutabiq lafz par amal hone se 'ذَٰلِكَ الْكِتَابُ' ban jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "ذَٰلِكَ كِتَابٌ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "ذَٰلِكَ الْكِتَابُ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Harkat / Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s1l17": {
    "lessonKey": "s1l17",
    "title": "S1L17: Ism-e-Ishaarah Muannath: Haazihi Aayatun",
    "badge": "Muannas Jumla",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">هَٰذِهِ آيَةٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asal Halat: هَٰذِهِ آيَةٌ</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">هَٰذِهِ الْآيَةُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Badli Hui Halat: هَٰذِهِ الْآيَةُ</text>\n  </svg>",
    "prediction": {
        "question": "Is sabaq (Muannas Jumla) ka bunyadi qaaida kya sikhata hai?",
        "options": [
            "هَٰذِهِ الْآيَةُ ban jaata hai",
            "Koi tabdeeli nahi aati"
        ],
        "correct": 0,
        "explanation": "Qur'ani qawaid ke mutabiq lafz par amal hone se 'هَٰذِهِ الْآيَةُ' ban jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "هَٰذِهِ آيَةٌ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "هَٰذِهِ الْآيَةُ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Harkat / Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s1l18": {
    "lessonKey": "s1l18",
    "title": "S1L18: Laam-e-Ta'keed: La-kitaabun",
    "badge": "Ta'keed (Laam)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">كِتَابٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asal Halat: كِتَابٌ</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">لَكِتَابٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Badli Hui Halat: لَكِتَابٌ</text>\n  </svg>",
    "prediction": {
        "question": "Is sabaq (Ta'keed (Laam)) ka bunyadi qaaida kya sikhata hai?",
        "options": [
            "لَكِتَابٌ ban jaata hai",
            "Koi tabdeeli nahi aati"
        ],
        "correct": 0,
        "explanation": "Qur'ani qawaid ke mutabiq lafz par amal hone se 'لَكِتَابٌ' ban jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "كِتَابٌ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "لَكِتَابٌ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Harkat / Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s1l19": {
    "lessonKey": "s1l19",
    "title": "S1L19: Ism-e-Tafzeel: Kabeerun se Akbaru",
    "badge": "Tafzeel (Af'alu)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Pehle)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">كَبِيرٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asal Halat: كَبِيرٌ</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Natija)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">أَكْبَرُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Badli Hui Halat: أَكْبَرُ</text>\n  </svg>",
    "prediction": {
        "question": "Is sabaq (Tafzeel (Af'alu)) ka bunyadi qaaida kya sikhata hai?",
        "options": [
            "أَكْبَرُ ban jaata hai",
            "Koi tabdeeli nahi aati"
        ],
        "correct": 0,
        "explanation": "Qur'ani qawaid ke mutabiq lafz par amal hone se 'أَكْبَرُ' ban jaata hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "كَبِيرٌ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "أَكْبَرُ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Harkat / Alamat",
            "targetId": "v-vowel"
        }
    ]
}
};

/**
 * Mount visual for a lesson in Unit 1.
 * @param {string} containerId - Container DOM ID
 * @param {string} [lessonKey] - Lesson key (e.g. "s1l1")
 * @returns {void}
 */
export function mount(containerId, lessonKey) {
  destroy();
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;

  const key = (lessonKey || 's1l1').toLowerCase();
  const config = visuals[key] || visuals['s1l1'];
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
