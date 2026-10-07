// @ts-check
import { renderVisual } from './visual-helper.js';

/**
 * Muallim ul-Qur'an — Unit 4 Grammar Visuals Module (v2.0)
 * Exports standard mount/destroy interface for all lessons in Unit 4.
 */

/** @type {(() => void) | null} */
let _activeTeardown = null;

/**
 * Visual configurations for Unit 4
 * @type {Record<string, import('./visual-helper.js').VisualConfig>}
 */
export const visuals = {
  "s4l1": {
    "lessonKey": "s4l1",
    "title": "S4L1: Zameer-e-Munfasil Huwa: Huwa Rasoolun",
    "badge": "Zameer Munfasil (هُوَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Lafz / Alag Zameer)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">رَسُولٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Zameer Munfasil (هُوَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">هُوَ رَسُولٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Zameer ka Istemal</text>\n  </svg>",
    "prediction": {
        "question": "Zameer lagne ke baad lafz ki shakl kya banti hai?",
        "options": [
            "'هُوَ رَسُولٌ' ban jaata hai",
            "Alag hi rehti hai"
        ],
        "correct": 0,
        "explanation": "Zameer muttasil hone par lafz mil kar 'هُوَ رَسُولٌ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "رَسُولٌ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "هُوَ رَسُولٌ (Zameer)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s4l2": {
    "lessonKey": "s4l2",
    "title": "S4L2: Zameer-e-Muttasil Muzakkar: Baytuhu (Uska ghar)",
    "badge": "Zameer Muttasil (ـهُ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Lafz / Alag Zameer)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">بَيْتٌ + هُوَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Zameer Muttasil (ـهُ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">بَيْتُهُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Zameer ka Istemal</text>\n  </svg>",
    "prediction": {
        "question": "Zameer lagne ke baad lafz ki shakl kya banti hai?",
        "options": [
            "'بَيْتُهُ' ban jaata hai",
            "Alag hi rehti hai"
        ],
        "correct": 0,
        "explanation": "Zameer muttasil hone par lafz mil kar 'بَيْتُهُ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "بَيْتٌ + هُوَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "بَيْتُهُ (Zameer)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s4l3": {
    "lessonKey": "s4l3",
    "title": "S4L3: Harf-e-Jarr ba-Zameer: Fii Baytihi",
    "badge": "Vowel Harmony (ـهِ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Lafz / Alag Zameer)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">بَيْتُهُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Vowel Harmony (ـهِ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">فِي بَيْتِهِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Zameer ka Istemal</text>\n  </svg>",
    "prediction": {
        "question": "Zameer lagne ke baad lafz ki shakl kya banti hai?",
        "options": [
            "'فِي بَيْتِهِ' ban jaata hai",
            "Alag hi rehti hai"
        ],
        "correct": 0,
        "explanation": "Zameer muttasil hone par lafz mil kar 'فِي بَيْتِهِ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "بَيْتُهُ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "فِي بَيْتِهِ (Zameer)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s4l4": {
    "lessonKey": "s4l4",
    "title": "S4L4: Huroof ke saath Zameer: Lahu, Minhu, Feehi",
    "badge": "Huroof + Zameer",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Lafz / Alag Zameer)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">لِـ / مِنْ / فِي</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Huroof + Zameer)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">لَهُ / مِنْهُ / فِيهِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Zameer ka Istemal</text>\n  </svg>",
    "prediction": {
        "question": "Zameer lagne ke baad lafz ki shakl kya banti hai?",
        "options": [
            "'لَهُ / مِنْهُ / فِيهِ' ban jaata hai",
            "Alag hi rehti hai"
        ],
        "correct": 0,
        "explanation": "Zameer muttasil hone par lafz mil kar 'لَهُ / مِنْهُ / فِيهِ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "لِـ / مِنْ / فِي (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "لَهُ / مِنْهُ / فِيهِ (Zameer)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s4l5": {
    "lessonKey": "s4l5",
    "title": "S4L5: Zameer-e-Munfasil Anta: Anta Yoosufu",
    "badge": "Zameer Munfasil (أَنْتَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Lafz / Alag Zameer)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">يُوسُفُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Zameer Munfasil (أَنْتَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">أَنْتَ يُوسُفُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Zameer ka Istemal</text>\n  </svg>",
    "prediction": {
        "question": "Zameer lagne ke baad lafz ki shakl kya banti hai?",
        "options": [
            "'أَنْتَ يُوسُفُ' ban jaata hai",
            "Alag hi rehti hai"
        ],
        "correct": 0,
        "explanation": "Zameer muttasil hone par lafz mil kar 'أَنْتَ يُوسُفُ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "يُوسُفُ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "أَنْتَ يُوسُفُ (Zameer)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s4l6": {
    "lessonKey": "s4l6",
    "title": "S4L6: Zameer-e-Muttasil Mukhatab: Baytuka (Tera ghar)",
    "badge": "Zameer Muttasil (ـكَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Lafz / Alag Zameer)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">بَيْتٌ + أَنْتَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Zameer Muttasil (ـكَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">بَيْتُكَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Zameer ka Istemal</text>\n  </svg>",
    "prediction": {
        "question": "Zameer lagne ke baad lafz ki shakl kya banti hai?",
        "options": [
            "'بَيْتُكَ' ban jaata hai",
            "Alag hi rehti hai"
        ],
        "correct": 0,
        "explanation": "Zameer muttasil hone par lafz mil kar 'بَيْتُكَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "بَيْتٌ + أَنْتَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "بَيْتُكَ (Zameer)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s4l7": {
    "lessonKey": "s4l7",
    "title": "S4L7: Harf-e-Jarr ba-Zameer: Fii Baytika",
    "badge": "Jarr + Baytuka",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Lafz / Alag Zameer)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">بَيْتُكَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Jarr + Baytuka)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">فِي بَيْتِكَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Zameer ka Istemal</text>\n  </svg>",
    "prediction": {
        "question": "Zameer lagne ke baad lafz ki shakl kya banti hai?",
        "options": [
            "'فِي بَيْتِكَ' ban jaata hai",
            "Alag hi rehti hai"
        ],
        "correct": 0,
        "explanation": "Zameer muttasil hone par lafz mil kar 'فِي بَيْتِكَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "بَيْتُكَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "فِي بَيْتِكَ (Zameer)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s4l8": {
    "lessonKey": "s4l8",
    "title": "S4L8: Huroof ke saath Zameer: Laka, Minka, Feeka",
    "badge": "Huroof + Ka",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Lafz / Alag Zameer)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">لِـ / مِنْ / فِي</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Huroof + Ka)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">لَكَ / مِنْكَ / فِيكَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Zameer ka Istemal</text>\n  </svg>",
    "prediction": {
        "question": "Zameer lagne ke baad lafz ki shakl kya banti hai?",
        "options": [
            "'لَكَ / مِنْكَ / فِيكَ' ban jaata hai",
            "Alag hi rehti hai"
        ],
        "correct": 0,
        "explanation": "Zameer muttasil hone par lafz mil kar 'لَكَ / مِنْكَ / فِيكَ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "لِـ / مِنْ / فِي (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "لَكَ / مِنْكَ / فِيكَ (Zameer)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s4l9": {
    "lessonKey": "s4l9",
    "title": "S4L9: Zameer-e-Munfasil Muannath: Hiya Fitnatun",
    "badge": "Zameer Munfasil (هِيَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Lafz / Alag Zameer)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">فِتْنَةٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Zameer Munfasil (هِيَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">هِيَ فِتْنَةٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Zameer ka Istemal</text>\n  </svg>",
    "prediction": {
        "question": "Zameer lagne ke baad lafz ki shakl kya banti hai?",
        "options": [
            "'هِيَ فِتْنَةٌ' ban jaata hai",
            "Alag hi rehti hai"
        ],
        "correct": 0,
        "explanation": "Zameer muttasil hone par lafz mil kar 'هِيَ فِتْنَةٌ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "فِتْنَةٌ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "هِيَ فِتْنَةٌ (Zameer)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s4l10": {
    "lessonKey": "s4l10",
    "title": "S4L10: Zameer-e-Muttasil Muannath: Baytuhaa",
    "badge": "Zameer Muttasil (ـهَا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Lafz / Alag Zameer)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">بَيْتٌ + هِيَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Zameer Muttasil (ـهَا))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">بَيْتُهَا</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Zameer ka Istemal</text>\n  </svg>",
    "prediction": {
        "question": "Zameer lagne ke baad lafz ki shakl kya banti hai?",
        "options": [
            "'بَيْتُهَا' ban jaata hai",
            "Alag hi rehti hai"
        ],
        "correct": 0,
        "explanation": "Zameer muttasil hone par lafz mil kar 'بَيْتُهَا' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "بَيْتٌ + هِيَ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "بَيْتُهَا (Zameer)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s4l11": {
    "lessonKey": "s4l11",
    "title": "S4L11: Harf-e-Jarr ba-Zameer Muannath: Fii Baytihaa",
    "badge": "Jarr + Baytuhaa",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Lafz / Alag Zameer)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">بَيْتُهَا</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Jarr + Baytuhaa)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">فِي بَيْتِهَا</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Zameer ka Istemal</text>\n  </svg>",
    "prediction": {
        "question": "Zameer lagne ke baad lafz ki shakl kya banti hai?",
        "options": [
            "'فِي بَيْتِهَا' ban jaata hai",
            "Alag hi rehti hai"
        ],
        "correct": 0,
        "explanation": "Zameer muttasil hone par lafz mil kar 'فِي بَيْتِهَا' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "بَيْتُهَا (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "فِي بَيْتِهَا (Zameer)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s4l12": {
    "lessonKey": "s4l12",
    "title": "S4L12: Huroof ke saath Zameer Muannath: Lahaa, Minhaa",
    "badge": "Huroof + Haa",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Lafz / Alag Zameer)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">لِـ / مِنْ / فِي</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Huroof + Haa)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">لَهَا / مِنْهَا / فِيهَا</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Zameer ka Istemal</text>\n  </svg>",
    "prediction": {
        "question": "Zameer lagne ke baad lafz ki shakl kya banti hai?",
        "options": [
            "'لَهَا / مِنْهَا / فِيهَا' ban jaata hai",
            "Alag hi rehti hai"
        ],
        "correct": 0,
        "explanation": "Zameer muttasil hone par lafz mil kar 'لَهَا / مِنْهَا / فِيهَا' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "لِـ / مِنْ / فِي (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "لَهَا / مِنْهَا / فِيهَا (Zameer)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s4l13": {
    "lessonKey": "s4l13",
    "title": "S4L13: Zameer-e-Munfasil Mutakallim: Ana Yoosufu",
    "badge": "Zameer Munfasil (أَنَا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Lafz / Alag Zameer)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">يُوسُفُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Zameer Munfasil (أَنَا))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">أَنَا يُوسُفُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Zameer ka Istemal</text>\n  </svg>",
    "prediction": {
        "question": "Zameer lagne ke baad lafz ki shakl kya banti hai?",
        "options": [
            "'أَنَا يُوسُفُ' ban jaata hai",
            "Alag hi rehti hai"
        ],
        "correct": 0,
        "explanation": "Zameer muttasil hone par lafz mil kar 'أَنَا يُوسُفُ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "يُوسُفُ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "أَنَا يُوسُفُ (Zameer)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s4l14": {
    "lessonKey": "s4l14",
    "title": "S4L14: Zameer-e-Muttasil Mutakallim: Baytee (Mera ghar)",
    "badge": "Yaa-e-Mutakallim (ـِي)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Lafz / Alag Zameer)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">بَيْتٌ + أَنَا</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Yaa-e-Mutakallim (ـِي))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">بَيْتِي</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Zameer ka Istemal</text>\n  </svg>",
    "prediction": {
        "question": "Zameer lagne ke baad lafz ki shakl kya banti hai?",
        "options": [
            "'بَيْتِي' ban jaata hai",
            "Alag hi rehti hai"
        ],
        "correct": 0,
        "explanation": "Zameer muttasil hone par lafz mil kar 'بَيْتِي' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "بَيْتٌ + أَنَا (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "بَيْتِي (Zameer)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s4l15": {
    "lessonKey": "s4l15",
    "title": "S4L15: Harf-e-Jarr ba-Zameer Mutakallim: Fii Baytee",
    "badge": "Jarr + Baytee",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Lafz / Alag Zameer)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">بَيْتِي</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Jarr + Baytee)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">فِي بَيْتِي</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Zameer ka Istemal</text>\n  </svg>",
    "prediction": {
        "question": "Zameer lagne ke baad lafz ki shakl kya banti hai?",
        "options": [
            "'فِي بَيْتِي' ban jaata hai",
            "Alag hi rehti hai"
        ],
        "correct": 0,
        "explanation": "Zameer muttasil hone par lafz mil kar 'فِي بَيْتِي' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "بَيْتِي (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "فِي بَيْتِي (Zameer)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s4l16": {
    "lessonKey": "s4l16",
    "title": "S4L16: Huroof ke saath Zameer Mutakallim: Lee, Minnee",
    "badge": "Huroof + Mutakallim",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Lafz / Alag Zameer)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">لِـ / مِنْ / عَلَى</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Huroof + Mutakallim)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">لِي / مِنِّي / عَلَيَّ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Zameer ka Istemal</text>\n  </svg>",
    "prediction": {
        "question": "Zameer lagne ke baad lafz ki shakl kya banti hai?",
        "options": [
            "'لِي / مِنِّي / عَلَيَّ' ban jaata hai",
            "Alag hi rehti hai"
        ],
        "correct": 0,
        "explanation": "Zameer muttasil hone par lafz mil kar 'لِي / مِنِّي / عَلَيَّ' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "لِـ / مِنْ / عَلَى (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "لِي / مِنِّي / عَلَيَّ (Zameer)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab & Rabt",
            "targetId": "v-vowel"
        }
    ]
},
  "s4l17": {
    "lessonKey": "s4l17",
    "title": "S4L17: Haalat-e-Nasb: Mujrimun se Mujriman (Do zabar)",
    "badge": "Haalat-e-Nasb (ـًا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Lafz / Alag Zameer)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">مُجْرِمٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Shuruati Halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Haalat-e-Nasb (ـًا))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">مُجْرِمًا</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Zameer ka Istemal</text>\n  </svg>",
    "prediction": {
        "question": "Zameer lagne ke baad lafz ki shakl kya banti hai?",
        "options": [
            "'مُجْرِمًا' ban jaata hai",
            "Alag hi rehti hai"
        ],
        "correct": 0,
        "explanation": "Zameer muttasil hone par lafz mil kar 'مُجْرِمًا' banta hai."
    },
    "chips": [
        {
            "role": "root",
            "label": "مُجْرِمٌ (Asal)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "مُجْرِمًا (Zameer)",
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
