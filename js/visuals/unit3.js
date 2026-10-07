// @ts-check
import { renderVisual } from './visual-helper.js';

/**
 * Muallim ul-Qur'an — Unit 3 Grammar Visuals Module (v2.0)
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
    "title": "S3L1: Murakkab-e-Tawseefi: Shay'un Azeemun (Badi cheez)",
    "badge": "Mawsoof & Sifat",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Juzv-e-Awwal)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">شَيْءٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Juzv</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Mukammal Murakkab)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">شَيْءٌ عَظِيمٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Mawsoof & Sifat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Mawsoof & Sifat banta hai toh donon hisson ke darmiyan kya talluq hota hai?",
        "options": [
            "Mil kar 'شَيْءٌ عَظِيمٌ' banta hai",
            "Koi talluq nahi hota"
        ],
        "correct": 0,
        "explanation": "Mawsoof & Sifat mein dono ajza aapas mein mil kar murakkab banate hain."
    },
    "chips": [
        {
            "role": "root",
            "label": "شَيْءٌ (Juzv 1)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "شَيْءٌ عَظِيمٌ (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab Agreement",
            "targetId": "v-vowel"
        }
    ]
},
  "s3l2": {
    "lessonKey": "s3l2",
    "title": "S3L2: Sifat-o-Mawsoof: Azaabun Shadeedun (Sakht azaab)",
    "badge": "Sifat Matching",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Juzv-e-Awwal)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">عَذَابٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Juzv</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Mukammal Murakkab)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">عَذَابٌ شَدِيدٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Sifat Matching</text>\n  </svg>",
    "prediction": {
        "question": "Jab Sifat Matching banta hai toh donon hisson ke darmiyan kya talluq hota hai?",
        "options": [
            "Mil kar 'عَذَابٌ شَدِيدٌ' banta hai",
            "Koi talluq nahi hota"
        ],
        "correct": 0,
        "explanation": "Sifat Matching mein dono ajza aapas mein mil kar murakkab banate hain."
    },
    "chips": [
        {
            "role": "root",
            "label": "عَذَابٌ (Juzv 1)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "عَذَابٌ شَدِيدٌ (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab Agreement",
            "targetId": "v-vowel"
        }
    ]
},
  "s3l3": {
    "lessonKey": "s3l3",
    "title": "S3L3: Harf-e-Jarr ba-Murakkab-e-Tawseefi: Fii Azaabin Azeemin",
    "badge": "Jarr in Tawseefi",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Juzv-e-Awwal)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">عَذَابٌ شَدِيدٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Juzv</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Mukammal Murakkab)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">فِي عَذَابٍ أَلِيمٍ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jarr in Tawseefi</text>\n  </svg>",
    "prediction": {
        "question": "Jab Jarr in Tawseefi banta hai toh donon hisson ke darmiyan kya talluq hota hai?",
        "options": [
            "Mil kar 'فِي عَذَابٍ أَلِيمٍ' banta hai",
            "Koi talluq nahi hota"
        ],
        "correct": 0,
        "explanation": "Jarr in Tawseefi mein dono ajza aapas mein mil kar murakkab banate hain."
    },
    "chips": [
        {
            "role": "root",
            "label": "عَذَابٌ شَدِيدٌ (Juzv 1)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "فِي عَذَابٍ أَلِيمٍ (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab Agreement",
            "targetId": "v-vowel"
        }
    ]
},
  "s3l4": {
    "lessonKey": "s3l4",
    "title": "S3L4: Murakkab-e-Izaafi: Rabbul-Mashriqi (Mashriq ka Rabb)",
    "badge": "Mudaaf & Mudaaf Ilayh",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Juzv-e-Awwal)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الرَّبُّ + الْمَشْرِقُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Juzv</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Mukammal Murakkab)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">رَبُّ الْمَشْرِقِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Mudaaf & Mudaaf Ilayh</text>\n  </svg>",
    "prediction": {
        "question": "Jab Mudaaf & Mudaaf Ilayh banta hai toh donon hisson ke darmiyan kya talluq hota hai?",
        "options": [
            "Mil kar 'رَبُّ الْمَشْرِقِ' banta hai",
            "Koi talluq nahi hota"
        ],
        "correct": 0,
        "explanation": "Mudaaf & Mudaaf Ilayh mein dono ajza aapas mein mil kar murakkab banate hain."
    },
    "chips": [
        {
            "role": "root",
            "label": "الرَّبُّ + الْمَشْرِقُ (Juzv 1)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "رَبُّ الْمَشْرِقِ (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab Agreement",
            "targetId": "v-vowel"
        }
    ]
},
  "s3l5": {
    "lessonKey": "s3l5",
    "title": "S3L5: Mudaaf-o-Mudaaf Ilaih: Kitaabullaahi (Allah ki kitaab)",
    "badge": "Izaafat-e-Khaas",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Juzv-e-Awwal)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">كِتَابٌ + اللَّهُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Juzv</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Mukammal Murakkab)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">كِتَابُ اللَّهِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Izaafat-e-Khaas</text>\n  </svg>",
    "prediction": {
        "question": "Jab Izaafat-e-Khaas banta hai toh donon hisson ke darmiyan kya talluq hota hai?",
        "options": [
            "Mil kar 'كِتَابُ اللَّهِ' banta hai",
            "Koi talluq nahi hota"
        ],
        "correct": 0,
        "explanation": "Izaafat-e-Khaas mein dono ajza aapas mein mil kar murakkab banate hain."
    },
    "chips": [
        {
            "role": "root",
            "label": "كِتَابٌ + اللَّهُ (Juzv 1)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "كِتَابُ اللَّهِ (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab Agreement",
            "targetId": "v-vowel"
        }
    ]
},
  "s3l6": {
    "lessonKey": "s3l6",
    "title": "S3L6: Harf-e-Jarr ba-Murakkab-e-Izaafi: Fii Kitaabillaahi",
    "badge": "Jarr in Izaafat",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Juzv-e-Awwal)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">كِتَابُ اللَّهِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Juzv</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Mukammal Murakkab)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">فِي كِتَابِ اللَّهِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jarr in Izaafat</text>\n  </svg>",
    "prediction": {
        "question": "Jab Jarr in Izaafat banta hai toh donon hisson ke darmiyan kya talluq hota hai?",
        "options": [
            "Mil kar 'فِي كِتَابِ اللَّهِ' banta hai",
            "Koi talluq nahi hota"
        ],
        "correct": 0,
        "explanation": "Jarr in Izaafat mein dono ajza aapas mein mil kar murakkab banate hain."
    },
    "chips": [
        {
            "role": "root",
            "label": "كِتَابُ اللَّهِ (Juzv 1)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "فِي كِتَابِ اللَّهِ (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab Agreement",
            "targetId": "v-vowel"
        }
    ]
},
  "s3l7": {
    "lessonKey": "s3l7",
    "title": "S3L7: Kullu Kitaabin — Lafz 'Kull' ka Istemal (Har kitaab)",
    "badge": "Istemal-e-Kull",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Juzv-e-Awwal)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">كِتَابٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Juzv</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Mukammal Murakkab)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">كُلُّ كِتَابٍ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Istemal-e-Kull</text>\n  </svg>",
    "prediction": {
        "question": "Jab Istemal-e-Kull banta hai toh donon hisson ke darmiyan kya talluq hota hai?",
        "options": [
            "Mil kar 'كُلُّ كِتَابٍ' banta hai",
            "Koi talluq nahi hota"
        ],
        "correct": 0,
        "explanation": "Istemal-e-Kull mein dono ajza aapas mein mil kar murakkab banate hain."
    },
    "chips": [
        {
            "role": "root",
            "label": "كِتَابٌ (Juzv 1)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "كُلُّ كِتَابٍ (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab Agreement",
            "targetId": "v-vowel"
        }
    ]
},
  "s3l8": {
    "lessonKey": "s3l8",
    "title": "S3L8: Asmaa-ul-Faa'il: Haafizun, Raaziqun, Khaaliqun",
    "badge": "Ism Faa'il (فَاعِلٌ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Juzv-e-Awwal)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">حَفِظَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Juzv</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Mukammal Murakkab)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">حَافِظٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Ism Faa'il (فَاعِلٌ)</text>\n  </svg>",
    "prediction": {
        "question": "Jab Ism Faa'il (فَاعِلٌ) banta hai toh donon hisson ke darmiyan kya talluq hota hai?",
        "options": [
            "Mil kar 'حَافِظٌ' banta hai",
            "Koi talluq nahi hota"
        ],
        "correct": 0,
        "explanation": "Ism Faa'il (فَاعِلٌ) mein dono ajza aapas mein mil kar murakkab banate hain."
    },
    "chips": [
        {
            "role": "root",
            "label": "حَفِظَ (Juzv 1)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "حَافِظٌ (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab Agreement",
            "targetId": "v-vowel"
        }
    ]
},
  "s3l9": {
    "lessonKey": "s3l9",
    "title": "S3L9: Mazeed Asmaa-ul-Faa'il: Muntazirun, Muhaajirun",
    "badge": "Ism Faa'il Mazeed",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Juzv-e-Awwal)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">أَسْلَمَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Juzv</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Mukammal Murakkab)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">مُسْلِمٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Ism Faa'il Mazeed</text>\n  </svg>",
    "prediction": {
        "question": "Jab Ism Faa'il Mazeed banta hai toh donon hisson ke darmiyan kya talluq hota hai?",
        "options": [
            "Mil kar 'مُسْلِمٌ' banta hai",
            "Koi talluq nahi hota"
        ],
        "correct": 0,
        "explanation": "Ism Faa'il Mazeed mein dono ajza aapas mein mil kar murakkab banate hain."
    },
    "chips": [
        {
            "role": "root",
            "label": "أَسْلَمَ (Juzv 1)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "مُسْلِمٌ (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab Agreement",
            "targetId": "v-vowel"
        }
    ]
},
  "s3l10": {
    "lessonKey": "s3l10",
    "title": "S3L10: Tasniyah (Dual): Mu'minaani se Mu'minun (Do momin)",
    "badge": "Tasniyah (ـَانِ / ـَيْنِ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Juzv-e-Awwal)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">مُؤْمِنٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Pehla Juzv</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"14\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Mukammal Murakkab)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"34\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">مُؤْمِنَانِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"13\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Tasniyah (ـَانِ / ـَيْنِ)</text>\n  </svg>",
    "prediction": {
        "question": "Jab Tasniyah (ـَانِ / ـَيْنِ) banta hai toh donon hisson ke darmiyan kya talluq hota hai?",
        "options": [
            "Mil kar 'مُؤْمِنَانِ' banta hai",
            "Koi talluq nahi hota"
        ],
        "correct": 0,
        "explanation": "Tasniyah (ـَانِ / ـَيْنِ) mein dono ajza aapas mein mil kar murakkab banate hain."
    },
    "chips": [
        {
            "role": "root",
            "label": "مُؤْمِنٌ (Juzv 1)",
            "targetId": "v-root"
        },
        {
            "role": "suffix",
            "label": "مُؤْمِنَانِ (Murakkab)",
            "targetId": "v-suffix"
        },
        {
            "role": "vowel",
            "label": "I'raab Agreement",
            "targetId": "v-vowel"
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
