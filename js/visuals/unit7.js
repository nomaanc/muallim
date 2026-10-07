// @ts-check
import { renderVisual } from './visual-helper.js';

/**
 * Muallim ul-Qur'an — Unit 7 Grammar Visuals Module (v2.0)
 * Exports standard mount/destroy interface for all lessons in Unit 7.
 */

/** @type {(() => void) | null} */
let _activeTeardown = null;

/**
 * Visual configurations for Unit 7
 * @type {Record<string, import('./visual-helper.js').VisualConfig>}
 */
export const visuals = {
  "s7l1": {
    "lessonKey": "s7l1",
    "title": "S7L1: Fe'l Mazi Wahid Muzakkar Ghaib: Alima, Jaahada, Anzala",
    "badge": "Mazi Wahid (فَعَلَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">عِلْمٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asli Bunyad</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Mazi Wahid (فَعَلَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">عَلِمَ / أَنْزَلَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Mazi ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Mazi Wahid (فَعَلَ) banta hai toh fe'l mazi ka seegha kya ban jaata hai?",
        "options": [
            "'عَلِمَ / أَنْزَلَ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Mazi Wahid (فَعَلَ) laagu hone se fe'l mazi badal kar 'عَلِمَ / أَنْزَلَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "عِلْمٌ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "عَلِمَ / أَنْزَلَ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Mazi Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s7l2": {
    "lessonKey": "s7l2",
    "title": "S7L2: Fe'l Mazi Jama Muzakkar Ghaib: Abadoo (Unhon ne Ibadat Ki)",
    "badge": "Mazi Jama (ـُوا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">عَبَدَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asli Bunyad</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Mazi Jama (ـُوا))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">عَبَدُوا</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Mazi ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Mazi Jama (ـُوا) banta hai toh fe'l mazi ka seegha kya ban jaata hai?",
        "options": [
            "'عَبَدُوا' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Mazi Jama (ـُوا) laagu hone se fe'l mazi badal kar 'عَبَدُوا' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "عَبَدَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "عَبَدُوا (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Mazi Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s7l3": {
    "lessonKey": "s7l3",
    "title": "S7L3: Mazi Jama Ghaib ke Murakkabat aur Aayat: Allazeena Kafaroo",
    "badge": "Mawsool + Mazi",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">كَفَرُوا</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asli Bunyad</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Mawsool + Mazi)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">الَّذِينَ كَفَرُوا</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Mazi ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Mawsool + Mazi banta hai toh fe'l mazi ka seegha kya ban jaata hai?",
        "options": [
            "'الَّذِينَ كَفَرُوا' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Mawsool + Mazi laagu hone se fe'l mazi badal kar 'الَّذِينَ كَفَرُوا' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "كَفَرُوا (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "الَّذِينَ كَفَرُوا (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Mazi Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s7l4": {
    "lessonKey": "s7l4",
    "title": "S7L4: Fe'l Mazi Jama ke sath Mukhtalif Waqiaat: Attakhazoo, Ataw",
    "badge": "Mazi Waqiaat",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">اتَّخَذَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asli Bunyad</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Mazi Waqiaat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">اتَّخَذُوا</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Mazi ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Mazi Waqiaat banta hai toh fe'l mazi ka seegha kya ban jaata hai?",
        "options": [
            "'اتَّخَذُوا' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Mazi Waqiaat laagu hone se fe'l mazi badal kar 'اتَّخَذُوا' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "اتَّخَذَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "اتَّخَذُوا (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Mazi Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s7l5": {
    "lessonKey": "s7l5",
    "title": "S7L5: Fe'l Mazi Jama Mutakallim: Aghraqnaa, Najjaynaa, Baaraknaa",
    "badge": "Mazi Mutakallim (ـنَا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">أَغْرَقَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asli Bunyad</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Mazi Mutakallim (ـنَا))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">أَغْرَقْنَا / نَجَّيْنَا</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Mazi ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Mazi Mutakallim (ـنَا) banta hai toh fe'l mazi ka seegha kya ban jaata hai?",
        "options": [
            "'أَغْرَقْنَا / نَجَّيْنَا' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Mazi Mutakallim (ـنَا) laagu hone se fe'l mazi badal kar 'أَغْرَقْنَا / نَجَّيْنَا' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "أَغْرَقَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "أَغْرَقْنَا / نَجَّيْنَا (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Mazi Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s7l6": {
    "lessonKey": "s7l6",
    "title": "S7L6: Fe'l Mazi Wahid Muzakkar Mukhatab: Abadta (Tu ne Ibadat Ki)",
    "badge": "Mazi Mukhatab (ـْتَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">عَبَدَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asli Bunyad</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Mazi Mukhatab (ـْتَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">عَبَدْتَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Mazi ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Mazi Mukhatab (ـْتَ) banta hai toh fe'l mazi ka seegha kya ban jaata hai?",
        "options": [
            "'عَبَدْتَ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Mazi Mukhatab (ـْتَ) laagu hone se fe'l mazi badal kar 'عَبَدْتَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "عَبَدَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "عَبَدْتَ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Mazi Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s7l7": {
    "lessonKey": "s7l7",
    "title": "S7L7: Shartiyyah Usloob: In Kuntum Mu'mineen",
    "badge": "Usloob Shart (إِنْ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">كُنْتُمْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asli Bunyad</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Usloob Shart (إِنْ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">إِنْ كُنْتُمْ مُؤْمِنِينَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Mazi ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Usloob Shart (إِنْ) banta hai toh fe'l mazi ka seegha kya ban jaata hai?",
        "options": [
            "'إِنْ كُنْتُمْ مُؤْمِنِينَ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Usloob Shart (إِنْ) laagu hone se fe'l mazi badal kar 'إِنْ كُنْتُمْ مُؤْمِنِينَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "كُنْتُمْ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "إِنْ كُنْتُمْ مُؤْمِنِينَ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Mazi Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s7l8": {
    "lessonKey": "s7l8",
    "title": "S7L8: Fe'l Mazi Majhool Wahid: Unzila (Naazil Kiya Gaya)",
    "badge": "Mazi Majhool (فُعِلَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">أَنْزَلَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asli Bunyad</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Mazi Majhool (فُعِلَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">أُنْزِلَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Mazi ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Mazi Majhool (فُعِلَ) banta hai toh fe'l mazi ka seegha kya ban jaata hai?",
        "options": [
            "'أُنْزِلَ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Mazi Majhool (فُعِلَ) laagu hone se fe'l mazi badal kar 'أُنْزِلَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "أَنْزَلَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "أُنْزِلَ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Mazi Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s7l9": {
    "lessonKey": "s7l9",
    "title": "S7L9: Fe'l Mazi Majhool Jama: Ukhrijoo (Nikaale Gaye)",
    "badge": "Majhool Jama (فُعِلُوا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">أُخْرِجَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asli Bunyad</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Majhool Jama (فُعِلُوا))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">أُخْرِجُوا</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Mazi ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Majhool Jama (فُعِلُوا) banta hai toh fe'l mazi ka seegha kya ban jaata hai?",
        "options": [
            "'أُخْرِجُوا' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Majhool Jama (فُعِلُوا) laagu hone se fe'l mazi badal kar 'أُخْرِجُوا' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "أُخْرِجَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "أُخْرِجُوا (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Mazi Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s7l10": {
    "lessonKey": "s7l10",
    "title": "S7L10: Mazi se Munsalik Quranic Usloob aur Aayat",
    "badge": "Master Capstone",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">أُوتِيَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Asli Bunyad</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Master Capstone)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">فَأَمَّا مَنْ أُوتِيَ كِتَابَهُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Mazi ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Master Capstone banta hai toh fe'l mazi ka seegha kya ban jaata hai?",
        "options": [
            "'فَأَمَّا مَنْ أُوتِيَ كِتَابَهُ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Master Capstone laagu hone se fe'l mazi badal kar 'فَأَمَّا مَنْ أُوتِيَ كِتَابَهُ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "أُوتِيَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "فَأَمَّا مَنْ أُوتِيَ كِتَابَهُ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Mazi Alamat",
            "targetId": "v-vowel"
        }
    ]
}
};

/**
 * Mount visual for a lesson in Unit 7.
 * @param {string} containerId - Container DOM ID
 * @param {string} [lessonKey] - Lesson key (e.g. "s7l1")
 * @returns {void}
 */
export function mount(containerId, lessonKey) {
  destroy();
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;

  const key = (lessonKey || 's7l1').toLowerCase();
  const config = visuals[key] || visuals['s7l1'];
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
