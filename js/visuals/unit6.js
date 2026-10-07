// @ts-check
import { renderVisual } from './visual-helper.js';

/**
 * Muallim ul-Qur'an — Unit 6 Grammar Visuals Module (v2.0)
 * Exports standard mount/destroy interface for all lessons in Unit 6.
 */

/** @type {(() => void) | null} */
let _activeTeardown = null;

/**
 * Visual configurations for Unit 6
 * @type {Record<string, import('./visual-helper.js').VisualConfig>}
 */
export const visuals = {
  "s6l1": {
    "lessonKey": "s6l1",
    "title": "S6L1: Aham Qur'ani Af'al — Fe'l Muzare (Ya'budu, Yasjudu)",
    "badge": "Fe'l Muzare (يَفْعَلُ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">عَبَدَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Seegha</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Fe'l Muzare (يَفْعَلُ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">يَعْبُدُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Gardaan ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Fe'l Muzare (يَفْعَلُ) banta hai toh fe'l ka seegha kya ban jaata hai?",
        "options": [
            "'يَعْبُدُ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Fe'l Muzare (يَفْعَلُ) ke tehat fe'l badal kar 'يَعْبُدُ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "عَبَدَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "يَعْبُدُ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Muzare Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s6l2": {
    "lessonKey": "s6l2",
    "title": "S6L2: Fe'l Muzare ke saath Aane Wale Alfaaz (Laa, Allazee, Maa)",
    "badge": "Muzare + Alfaaz",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">يَعْبُدُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Seegha</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Muzare + Alfaaz)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">لَا يَعْبُدُ / الَّذِي يَعْلَمُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Gardaan ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Muzare + Alfaaz banta hai toh fe'l ka seegha kya ban jaata hai?",
        "options": [
            "'لَا يَعْبُدُ / الَّذِي يَعْلَمُ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Muzare + Alfaaz ke tehat fe'l badal kar 'لَا يَعْبُدُ / الَّذِي يَعْلَمُ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "يَعْبُدُ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "لَا يَعْبُدُ / الَّذِي يَعْلَمُ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Muzare Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s6l3": {
    "lessonKey": "s6l3",
    "title": "S6L3: Fe'l Muzare ke Baad Faa'il aur Maf'ool (Yaghfirullaahu)",
    "badge": "Faa'il & Maf'ool",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">يَغْفِرُ + اللَّهُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Seegha</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Faa'il & Maf'ool)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">يَغْفِرُ اللَّهُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Gardaan ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Faa'il & Maf'ool banta hai toh fe'l ka seegha kya ban jaata hai?",
        "options": [
            "'يَغْفِرُ اللَّهُ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Faa'il & Maf'ool ke tehat fe'l badal kar 'يَغْفِرُ اللَّهُ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "يَغْفِرُ + اللَّهُ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "يَغْفِرُ اللَّهُ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Muzare Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s6l4": {
    "lessonKey": "s6l4",
    "title": "S6L4: Mashhoor Qur'ani Muhawarah: Man Yashaa'u",
    "badge": "Man Yashaa'u",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">يَشَاءُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Seegha</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Man Yashaa'u)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">مَنْ يَشَاءُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Gardaan ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Man Yashaa'u banta hai toh fe'l ka seegha kya ban jaata hai?",
        "options": [
            "'مَنْ يَشَاءُ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Man Yashaa'u ke tehat fe'l badal kar 'مَنْ يَشَاءُ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "يَشَاءُ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "مَنْ يَشَاءُ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Muzare Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s6l5": {
    "lessonKey": "s6l5",
    "title": "S6L5: Fe'l Muzare ke saath Maf'ool ki Zameer (Ya'murukum)",
    "badge": "Muzare + Zameer",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">يَأْمُرُ + كُمْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Seegha</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Muzare + Zameer)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">يَأْمُرُكُمْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Gardaan ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Muzare + Zameer banta hai toh fe'l ka seegha kya ban jaata hai?",
        "options": [
            "'يَأْمُرُكُمْ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Muzare + Zameer ke tehat fe'l badal kar 'يَأْمُرُكُمْ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "يَأْمُرُ + كُمْ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "يَأْمُرُكُمْ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Muzare Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s6l6": {
    "lessonKey": "s6l6",
    "title": "S6L6: Muzare Jama Muzakkar Ghaib: Ya'budoona",
    "badge": "Muzare Plural (ـُونَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">يَعْبُدُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Seegha</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Muzare Plural (ـُونَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">يَعْبُدُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Gardaan ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Muzare Plural (ـُونَ) banta hai toh fe'l ka seegha kya ban jaata hai?",
        "options": [
            "'يَعْبُدُونَ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Muzare Plural (ـُونَ) ke tehat fe'l badal kar 'يَعْبُدُونَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "يَعْبُدُ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "يَعْبُدُونَ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Muzare Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s6l7": {
    "lessonKey": "s6l7",
    "title": "S6L7: Seegha 'Ya'budoona' ke sath Mashhoor Muhaware",
    "badge": "Muhaware Jama",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">يَعْلَمُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Seegha</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Muhaware Jama)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">لَا يَعْلَمُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Gardaan ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Muhaware Jama banta hai toh fe'l ka seegha kya ban jaata hai?",
        "options": [
            "'لَا يَعْلَمُونَ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Muhaware Jama ke tehat fe'l badal kar 'لَا يَعْلَمُونَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "يَعْلَمُونَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "لَا يَعْلَمُونَ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Muzare Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s6l8": {
    "lessonKey": "s6l8",
    "title": "S6L8: Ism-e-Mawsool 'Allazeena' Fe'l Muzare ke saath",
    "badge": "Allazeena + Muzare",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">يُؤْمِنُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Seegha</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Allazeena + Muzare)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">الَّذِينَ يُؤْمِنُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Gardaan ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Allazeena + Muzare banta hai toh fe'l ka seegha kya ban jaata hai?",
        "options": [
            "'الَّذِينَ يُؤْمِنُونَ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Allazeena + Muzare ke tehat fe'l badal kar 'الَّذِينَ يُؤْمِنُونَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "يُؤْمِنُونَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "الَّذِينَ يُؤْمِنُونَ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Muzare Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s6l9": {
    "lessonKey": "s6l9",
    "title": "S6L9: Muzare Wahid Muzakkar Mukhatab: Ta'budu",
    "badge": "Muzare Mukhatab (تَـ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">يَعْبُدُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Seegha</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Muzare Mukhatab (تَـ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">تَعْبُدُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Gardaan ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Muzare Mukhatab (تَـ) banta hai toh fe'l ka seegha kya ban jaata hai?",
        "options": [
            "'تَعْبُدُ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Muzare Mukhatab (تَـ) ke tehat fe'l badal kar 'تَعْبُدُ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "يَعْبُدُ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "تَعْبُدُ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Muzare Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s6l10": {
    "lessonKey": "s6l10",
    "title": "S6L10: Muzare Jama Muzakkar Mukhatab: Ta'budoona",
    "badge": "Mukhatab Plural (تَـ...ـُونَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">تَعْبُدُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Seegha</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Mukhatab Plural (تَـ...ـُونَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">تَعْبُدُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Gardaan ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Mukhatab Plural (تَـ...ـُونَ) banta hai toh fe'l ka seegha kya ban jaata hai?",
        "options": [
            "'تَعْبُدُونَ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Mukhatab Plural (تَـ...ـُونَ) ke tehat fe'l badal kar 'تَعْبُدُونَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "تَعْبُدُ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "تَعْبُدُونَ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Muzare Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s6l11": {
    "lessonKey": "s6l11",
    "title": "S6L11: Seegha 'Ta'budoona' ke sath Mashhoor Muhaware",
    "badge": "Ta'budoona Muhaware",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">تَعْلَمُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Seegha</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Ta'budoona Muhaware)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">وَأَنْتُمْ تَعْلَمُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Gardaan ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Ta'budoona Muhaware banta hai toh fe'l ka seegha kya ban jaata hai?",
        "options": [
            "'وَأَنْتُمْ تَعْلَمُونَ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Ta'budoona Muhaware ke tehat fe'l badal kar 'وَأَنْتُمْ تَعْلَمُونَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "تَعْلَمُونَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "وَأَنْتُمْ تَعْلَمُونَ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Muzare Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s6l12": {
    "lessonKey": "s6l12",
    "title": "S6L12: Muzare Wahid Mutakallim: A'budu",
    "badge": "Muzare Mutakallim (أَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">يَعْبُدُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Seegha</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Muzare Mutakallim (أَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">أَعْبُدُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Gardaan ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Muzare Mutakallim (أَ) banta hai toh fe'l ka seegha kya ban jaata hai?",
        "options": [
            "'أَعْبُدُ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Muzare Mutakallim (أَ) ke tehat fe'l badal kar 'أَعْبُدُ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "يَعْبُدُ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "أَعْبُدُ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Muzare Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s6l13": {
    "lessonKey": "s6l13",
    "title": "S6L13: Muzare Jama Mutakallim: Na'budu",
    "badge": "Muzare Mutakallim (نَـ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">يَعْبُدُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Seegha</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Muzare Mutakallim (نَـ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">نَعْبُدُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Gardaan ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Muzare Mutakallim (نَـ) banta hai toh fe'l ka seegha kya ban jaata hai?",
        "options": [
            "'نَعْبُدُ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Muzare Mutakallim (نَـ) ke tehat fe'l badal kar 'نَعْبُدُ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "يَعْبُدُ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "نَعْبُدُ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Muzare Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s6l14": {
    "lessonKey": "s6l14",
    "title": "S6L14: Fe'l Nahi Jama Muzakkar: Laa Taqtuloo",
    "badge": "Fe'l Nahi (لَا تَـ...ـُوا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">تَقْتُلُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Seegha</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Fe'l Nahi (لَا تَـ...ـُوا))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">لَا تَقْتُلُوا</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Gardaan ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Fe'l Nahi (لَا تَـ...ـُوا) banta hai toh fe'l ka seegha kya ban jaata hai?",
        "options": [
            "'لَا تَقْتُلُوا' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Fe'l Nahi (لَا تَـ...ـُوا) ke tehat fe'l badal kar 'لَا تَقْتُلُوا' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "تَقْتُلُونَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "لَا تَقْتُلُوا (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Muzare Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s6l15": {
    "lessonKey": "s6l15",
    "title": "S6L15: Fe'l Nahi Wahid aur Maf'ool ki Zama'ir",
    "badge": "Nahi + Zameer",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">تَنْصُرُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Seegha</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Nahi + Zameer)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">تَنْصُرُونَهُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Gardaan ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Nahi + Zameer banta hai toh fe'l ka seegha kya ban jaata hai?",
        "options": [
            "'تَنْصُرُونَهُ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Nahi + Zameer ke tehat fe'l badal kar 'تَنْصُرُونَهُ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "تَنْصُرُونَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "تَنْصُرُونَهُ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Muzare Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s6l16": {
    "lessonKey": "s6l16",
    "title": "S6L16: Man Shartiyyah aur Lan Naasibah: Lan Tanaaloo",
    "badge": "Lan Naasibah (لَنْ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">تَنَالُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Seegha</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Lan Naasibah (لَنْ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">لَنْ تَنَالُوا</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Gardaan ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Lan Naasibah (لَنْ) banta hai toh fe'l ka seegha kya ban jaata hai?",
        "options": [
            "'لَنْ تَنَالُوا' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Lan Naasibah (لَنْ) ke tehat fe'l badal kar 'لَنْ تَنَالُوا' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "تَنَالُونَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "لَنْ تَنَالُوا (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Muzare Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s6l17": {
    "lessonKey": "s6l17",
    "title": "S6L17: Harf-e-Nasibah 'An': An Yatooba",
    "badge": "An Naasibah (أَنْ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">يَتُوبُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Seegha</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (An Naasibah (أَنْ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">أَنْ يَتُوبَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Gardaan ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab An Naasibah (أَنْ) banta hai toh fe'l ka seegha kya ban jaata hai?",
        "options": [
            "'أَنْ يَتُوبَ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "An Naasibah (أَنْ) ke tehat fe'l badal kar 'أَنْ يَتُوبَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "يَتُوبُ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "أَنْ يَتُوبَ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Muzare Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s6l18": {
    "lessonKey": "s6l18",
    "title": "S6L18: Laam-ut-Ta'leel 'Li': Li-yaghfira",
    "badge": "Laam Ta'leel (لِـ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">يَغْفِرُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Seegha</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Laam Ta'leel (لِـ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">لِيَغْفِرَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Gardaan ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Laam Ta'leel (لِـ) banta hai toh fe'l ka seegha kya ban jaata hai?",
        "options": [
            "'لِيَغْفِرَ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Laam Ta'leel (لِـ) ke tehat fe'l badal kar 'لِيَغْفِرَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "يَغْفِرُ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "لِيَغْفِرَ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Muzare Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s6l19": {
    "lessonKey": "s6l19",
    "title": "S6L19: Harf-e-Jazm 'Lam': Lam Yaj'al",
    "badge": "Lam Jaazimah (لَمْ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">يَجْعَلُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Seegha</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Lam Jaazimah (لَمْ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">لَمْ يَجْعَلْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Gardaan ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Lam Jaazimah (لَمْ) banta hai toh fe'l ka seegha kya ban jaata hai?",
        "options": [
            "'لَمْ يَجْعَلْ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Lam Jaazimah (لَمْ) ke tehat fe'l badal kar 'لَمْ يَجْعَلْ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "يَجْعَلُ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "لَمْ يَجْعَلْ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Muzare Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s6l20": {
    "lessonKey": "s6l20",
    "title": "S6L20: Muzare Jama ke saath Maf'ool ki Zameerein: Yas'aloonaka",
    "badge": "Muzare + Ka",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">يَسْأَلُونَ + كَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Seegha</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Muzare + Ka)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">يَسْأَلُونَكَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Gardaan ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Muzare + Ka banta hai toh fe'l ka seegha kya ban jaata hai?",
        "options": [
            "'يَسْأَلُونَكَ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Muzare + Ka ke tehat fe'l badal kar 'يَسْأَلُونَكَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "يَسْأَلُونَ + كَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "يَسْأَلُونَكَ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Muzare Alamat",
            "targetId": "v-vowel"
        }
    ]
},
  "s6l21": {
    "lessonKey": "s6l21",
    "title": "S6L21: Fe'l Ma'roof se Fe'l Majhool: Yurzaqoon",
    "badge": "Fe'l Majhool (يُفْعَلُ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">يَرْزُقُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Seegha</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Fe'l Majhool (يُفْعَلُ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">يُرْزَقُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Gardaan ka Badla Hua Seegha</text>\n  </svg>",
    "prediction": {
        "question": "Jab Fe'l Majhool (يُفْعَلُ) banta hai toh fe'l ka seegha kya ban jaata hai?",
        "options": [
            "'يُرْزَقُونَ' ban jaata hai",
            "Seegha badalta nahi"
        ],
        "correct": 0,
        "explanation": "Fe'l Majhool (يُفْعَلُ) ke tehat fe'l badal kar 'يُرْزَقُونَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "يَرْزُقُونَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "يُرْزَقُونَ (Natija)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "Muzare Alamat",
            "targetId": "v-vowel"
        }
    ]
}
};

/**
 * Mount visual for a lesson in Unit 6.
 * @param {string} containerId - Container DOM ID
 * @param {string} [lessonKey] - Lesson key (e.g. "s6l1")
 * @returns {void}
 */
export function mount(containerId, lessonKey) {
  destroy();
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;

  const key = (lessonKey || 's6l1').toLowerCase();
  const config = visuals[key] || visuals['s6l1'];
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
