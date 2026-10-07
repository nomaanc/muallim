// @ts-check
import { renderVisual } from './visual-helper.js';

/**
 * Muallim ul-Qur'an — Unit 5 Grammar Visuals Module (v2.0)
 * Exports standard mount/destroy interface for all lessons in Unit 5.
 */

/** @type {(() => void) | null} */
let _activeTeardown = null;

/**
 * Visual configurations for Unit 5
 * @type {Record<string, import('./visual-helper.js').VisualConfig>}
 */
export const visuals = {
  "s5l1": {
    "lessonKey": "s5l1",
    "title": "S5L1: Jama Muzakkar Salim: Al-Muslimoona (ـُونَ)",
    "badge": "Jama Marfoo (ـُونَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْمُسْلِمُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Jama Marfoo (ـُونَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">الْمُسْلِمُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Jama Marfoo (ـُونَ) laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'الْمُسْلِمُونَ' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Jama Marfoo (ـُونَ) laagu hone se lafz badal kar 'الْمُسْلِمُونَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "الْمُسْلِمُ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "الْمُسْلِمُونَ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s5l2": {
    "lessonKey": "s5l2",
    "title": "S5L2: Jama Muzakkar Salim: Al-Muslimeena (ـِينَ)",
    "badge": "Jama Mansoob/Majroor (ـِينَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْمُسْلِمُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Jama Mansoob/Majroor (ـِينَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">الْمُسْلِمِينَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Jama Mansoob/Majroor (ـِينَ) laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'الْمُسْلِمِينَ' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Jama Mansoob/Majroor (ـِينَ) laagu hone se lafz badal kar 'الْمُسْلِمِينَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "الْمُسْلِمُونَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "الْمُسْلِمِينَ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s5l3": {
    "lessonKey": "s5l3",
    "title": "S5L3: Murakkab-e-Izaafi Jama: Ajrul-Muslimeena",
    "badge": "Izaafat + Jama",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">أَجْرٌ + الْمُسْلِمُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Izaafat + Jama)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">أَجْرُ الْمُسْلِمِينَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Izaafat + Jama laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'أَجْرُ الْمُسْلِمِينَ' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Izaafat + Jama laagu hone se lafz badal kar 'أَجْرُ الْمُسْلِمِينَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "أَجْرٌ + الْمُسْلِمُونَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "أَجْرُ الْمُسْلِمِينَ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s5l4": {
    "lessonKey": "s5l4",
    "title": "S5L4: Jama Mukassar (Broken Plurals): Ulamaa'u, Hukkaamun",
    "badge": "Jama Mukassar",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">عَالِمٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Jama Mukassar)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">عُلَمَاءُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Jama Mukassar laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'عُلَمَاءُ' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Jama Mukassar laagu hone se lafz badal kar 'عُلَمَاءُ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "عَالِمٌ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "عُلَمَاءُ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s5l5": {
    "lessonKey": "s5l5",
    "title": "S5L5: Zameer-e-Munfasil Jama: Hum Muslimoona",
    "badge": "Zameer (هُمْ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">مُسْلِمُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Zameer (هُمْ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">هُمْ مُسْلِمُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Zameer (هُمْ) laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'هُمْ مُسْلِمُونَ' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Zameer (هُمْ) laagu hone se lafz badal kar 'هُمْ مُسْلِمُونَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "مُسْلِمُونَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "هُمْ مُسْلِمُونَ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s5l6": {
    "lessonKey": "s5l6",
    "title": "S5L6: Kitaabun : Kitaabuhum (Unki Kitaab)",
    "badge": "Zameer (ـهُمْ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">كِتَابٌ + هُمْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Zameer (ـهُمْ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">كِتَابُهُمْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Zameer (ـهُمْ) laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'كِتَابُهُمْ' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Zameer (ـهُمْ) laagu hone se lafz badal kar 'كِتَابُهُمْ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "كِتَابٌ + هُمْ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "كِتَابُهُمْ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s5l7": {
    "lessonKey": "s5l7",
    "title": "S5L7: Kitaabuhum : Fii Kitaabihim (Unki Kitaab Mein)",
    "badge": "Kasrah Harmony (ـهِمْ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">كِتَابُهُمْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Kasrah Harmony (ـهِمْ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">فِي كِتَابِهِمْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Kasrah Harmony (ـهِمْ) laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'فِي كِتَابِهِمْ' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Kasrah Harmony (ـهِمْ) laagu hone se lafz badal kar 'فِي كِتَابِهِمْ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "كِتَابُهُمْ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "فِي كِتَابِهِمْ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s5l8": {
    "lessonKey": "s5l8",
    "title": "S5L8: Huroof ke saath Zameer Jama: Lahum, Minhum, Innahum",
    "badge": "Huroof + Hum",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">لِـ / مِنْ / إِنَّ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Huroof + Hum)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">لَهُمْ / مِنْهُمْ / إِنَّهُمْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Huroof + Hum laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'لَهُمْ / مِنْهُمْ / إِنَّهُمْ' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Huroof + Hum laagu hone se lafz badal kar 'لَهُمْ / مِنْهُمْ / إِنَّهُمْ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "لِـ / مِنْ / إِنَّ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "لَهُمْ / مِنْهُمْ / إِنَّهُمْ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s5l9": {
    "lessonKey": "s5l9",
    "title": "S5L9: Muslimoona : Antum Muslimoona",
    "badge": "Zameer (أَنْتُمْ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">مُسْلِمُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Zameer (أَنْتُمْ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">أَنْتُمْ مُسْلِمُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Zameer (أَنْتُمْ) laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'أَنْتُمْ مُسْلِمُونَ' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Zameer (أَنْتُمْ) laagu hone se lafz badal kar 'أَنْتُمْ مُسْلِمُونَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "مُسْلِمُونَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "أَنْتُمْ مُسْلِمُونَ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s5l10": {
    "lessonKey": "s5l10",
    "title": "S5L10: Kitaabun : Kitaabukum (Tumhari Kitaab)",
    "badge": "Zameer (ـكُمْ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">كِتَابٌ + أَنْتُمْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Zameer (ـكُمْ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">كِتَابُكُمْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Zameer (ـكُمْ) laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'كِتَابُكُمْ' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Zameer (ـكُمْ) laagu hone se lafz badal kar 'كِتَابُكُمْ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "كِتَابٌ + أَنْتُمْ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "كِتَابُكُمْ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s5l11": {
    "lessonKey": "s5l11",
    "title": "S5L11: Kitaabukum : Fii Kitaabikum (Tumhari Kitaab Mein)",
    "badge": "Jarr + Kum",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">كِتَابُكُمْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Jarr + Kum)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">فِي كِتَابِكُمْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Jarr + Kum laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'فِي كِتَابِكُمْ' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Jarr + Kum laagu hone se lafz badal kar 'فِي كِتَابِكُمْ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "كِتَابُكُمْ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "فِي كِتَابِكُمْ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s5l12": {
    "lessonKey": "s5l12",
    "title": "S5L12: Huroof ke saath Zameer: Lakum, Minkum, Innakum",
    "badge": "Huroof + Kum",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">لِـ / مِنْ / إِنَّ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Huroof + Kum)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">لَكُمْ / مِنْكُمْ / إِنَّكُمْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Huroof + Kum laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'لَكُمْ / مِنْكُمْ / إِنَّكُمْ' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Huroof + Kum laagu hone se lafz badal kar 'لَكُمْ / مِنْكُمْ / إِنَّكُمْ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "لِـ / مِنْ / إِنَّ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "لَكُمْ / مِنْكُمْ / إِنَّكُمْ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s5l13": {
    "lessonKey": "s5l13",
    "title": "S5L13: Muslimoona : Nahnu Muslimoona",
    "badge": "Zameer (نَحْنُ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">مُسْلِمُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Zameer (نَحْنُ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">نَحْنُ مُسْلِمُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Zameer (نَحْنُ) laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'نَحْنُ مُسْلِمُونَ' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Zameer (نَحْنُ) laagu hone se lafz badal kar 'نَحْنُ مُسْلِمُونَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "مُسْلِمُونَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "نَحْنُ مُسْلِمُونَ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s5l14": {
    "lessonKey": "s5l14",
    "title": "S5L14: Kitaabun : Kitaabunaa (Hamari Kitaab)",
    "badge": "Zameer (ـنَا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">كِتَابٌ + نَحْنُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Zameer (ـنَا))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">كِتَابُنَا</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Zameer (ـنَا) laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'كِتَابُنَا' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Zameer (ـنَا) laagu hone se lafz badal kar 'كِتَابُنَا' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "كِتَابٌ + نَحْنُ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "كِتَابُنَا (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s5l15": {
    "lessonKey": "s5l15",
    "title": "S5L15: Kitaabunaa : Fii Kitaabinaa (Hamari Kitaab Mein)",
    "badge": "Jarr + Naa",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">كِتَابُنَا</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Jarr + Naa)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">فِي كِتَابِنَا</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Jarr + Naa laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'فِي كِتَابِنَا' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Jarr + Naa laagu hone se lafz badal kar 'فِي كِتَابِنَا' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "كِتَابُنَا (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "فِي كِتَابِنَا (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s5l16": {
    "lessonKey": "s5l16",
    "title": "S5L16: Huroof ke saath Zameer: Lanaa, Minnaa, Innaa",
    "badge": "Huroof + Naa",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">لِـ / مِنْ / إِنَّ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Huroof + Naa)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">لَنَا / مِنَّا / إِنَّا</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Huroof + Naa laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'لَنَا / مِنَّا / إِنَّا' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Huroof + Naa laagu hone se lafz badal kar 'لَنَا / مِنَّا / إِنَّا' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "لِـ / مِنْ / إِنَّ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "لَنَا / مِنَّا / إِنَّا (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s5l17": {
    "lessonKey": "s5l17",
    "title": "S5L17: Muslimoona : Ulaa'ika Muslimoona",
    "badge": "Ishaarah + Jama",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">مُسْلِمُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Ishaarah + Jama)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">أُولَٰئِكَ مُسْلِمُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Ishaarah + Jama laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'أُولَٰئِكَ مُسْلِمُونَ' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Ishaarah + Jama laagu hone se lafz badal kar 'أُولَٰئِكَ مُسْلِمُونَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "مُسْلِمُونَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "أُولَٰئِكَ مُسْلِمُونَ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s5l18": {
    "lessonKey": "s5l18",
    "title": "S5L18: Muslimoona : Haa'ulaa'i Muslimoona",
    "badge": "Ishaarah + Jama",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">مُسْلِمُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Ishaarah + Jama)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">هَٰؤُلَاءِ مُسْلِمُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Ishaarah + Jama laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'هَٰؤُلَاءِ مُسْلِمُونَ' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Ishaarah + Jama laagu hone se lafz badal kar 'هَٰؤُلَاءِ مُسْلِمُونَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "مُسْلِمُونَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "هَٰؤُلَاءِ مُسْلِمُونَ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s5l19": {
    "lessonKey": "s5l19",
    "title": "S5L19: Mashhoor Qur'ani Usloob: Hasr-o-Ta'keed",
    "badge": "Hasr (إِنَّمَا / إِلَّا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">مَا / إِنْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Hasr (إِنَّمَا / إِلَّا))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Hasr (إِنَّمَا / إِلَّا) laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Hasr (إِنَّمَا / إِلَّا) laagu hone se lafz badal kar 'إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "مَا / إِنْ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s5l20": {
    "lessonKey": "s5l20",
    "title": "S5L20: Qur'ani Jumlon ke Shuru Wale Alfaaz (Laysa, Maa)",
    "badge": "Alfaaz-e-Ibtida",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">لَيْسَ / مَا / هَلْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Alfaaz-e-Ibtida)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">لَيْسَ الْبِرَّ / هَلْ جَزَاءُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Alfaaz-e-Ibtida laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'لَيْسَ الْبِرَّ / هَلْ جَزَاءُ' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Alfaaz-e-Ibtida laagu hone se lafz badal kar 'لَيْسَ الْبِرَّ / هَلْ جَزَاءُ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "لَيْسَ / مَا / هَلْ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "لَيْسَ الْبِرَّ / هَلْ جَزَاءُ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s5l21": {
    "lessonKey": "s5l21",
    "title": "S5L21: Chand Mashhoor Qur'ani Muhaware",
    "badge": "Qur'ani Muhaware",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">أَلَا / سُبْحَانَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Qur'ani Muhaware)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">سُبْحَانَ اللَّهِ / أَلَا إِنَّ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Qur'ani Muhaware laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'سُبْحَانَ اللَّهِ / أَلَا إِنَّ' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Qur'ani Muhaware laagu hone se lafz badal kar 'سُبْحَانَ اللَّهِ / أَلَا إِنَّ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "أَلَا / سُبْحَانَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "سُبْحَانَ اللَّهِ / أَلَا إِنَّ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s5l22": {
    "lessonKey": "s5l22",
    "title": "S5L22: Ism-e-Tafzeel aur Tamyeez (Ashaddu Quwwatan)",
    "badge": "Tamyeez (ـًا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">أَشَدُّ + قُوَّةٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Tamyeez (ـًا))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">أَشَدُّ قُوَّةً</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Tamyeez (ـًا) laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'أَشَدُّ قُوَّةً' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Tamyeez (ـًا) laagu hone se lafz badal kar 'أَشَدُّ قُوَّةً' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "أَشَدُّ + قُوَّةٌ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "أَشَدُّ قُوَّةً (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s5l23": {
    "lessonKey": "s5l23",
    "title": "S5L23: Nafi-e-Aam aur 'Min' Taakeed",
    "badge": "Min Ta'keed",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Wahid / Mufrad)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">وَلِيٌّ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Min Ta'keed)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">مِنْ وَلِيٍّ وَلَا نَصِيرٍ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama / Tarkeeb ki Halat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Min Ta'keed laagu hota hai toh kya shakl banti hai?",
        "options": [
            "'مِنْ وَلِيٍّ وَلَا نَصِيرٍ' ban jaata hai",
            "Wahid hi rehta hai"
        ],
        "correct": 0,
        "explanation": "Min Ta'keed laagu hone se lafz badal kar 'مِنْ وَلِيٍّ وَلَا نَصِيرٍ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "وَلِيٌّ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "مِنْ وَلِيٍّ وَلَا نَصِيرٍ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
}
};

/**
 * Mount visual for a lesson in Unit 5.
 * @param {string} containerId - Container DOM ID
 * @param {string} [lessonKey] - Lesson key (e.g. "s5l1")
 * @returns {void}
 */
export function mount(containerId, lessonKey) {
  destroy();
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;

  const key = (lessonKey || 's5l1').toLowerCase();
  const config = visuals[key] || visuals['s5l1'];
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
