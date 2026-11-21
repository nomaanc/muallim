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
    ],
    "steps": [
      {
        "title": "1. Misaal 1",
        "description": "الصَّابِرُ → sabr karne waala → الصَّابِرُونَ → sabr karne waale"
      },
      {
        "title": "2. Misaal 2",
        "description": "الْخَالِقُ → paida karne waala → الْخَالِقُونَ → paida karne waale"
      },
      {
        "title": "3. Misaal 3",
        "description": "الْمُنَافِقُ → munaafiq shakhs → الْمُنَافِقُونَ → munaafiq log"
      }
    ],
    "examples": [
      {
        "arabic": "الصَّابِرُوْنَ",
        "hinglish": "sabr karne wale"
      },
      {
        "arabic": "الشَّاکِرُوْنَ",
        "hinglish": "shukr karne wale"
      },
      {
        "arabic": "الذَّاکِرُوْنَ",
        "hinglish": "yaad karne wale"
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
    ],
    "steps": [
      {
        "title": "1. Misaal 1",
        "description": "الْكَافِرُونَ → kaafiron → إِنَّ الْكَافِرِينَ → beshak kaafiron"
      },
      {
        "title": "2. Misaal 2",
        "description": "الظَّالِمُونَ → zaalimon → مِنَ الظَّالِمِينَ → zaalimon se"
      },
      {
        "title": "3. Misaal 3",
        "description": "الْجَاهِلُونَ → jaahilon → إِلَى الْجَاهِلِينَ → jaahilon ki taraf"
      }
    ],
    "examples": [
      {
        "arabic": "الْمُشْرِکُوْنَ / الْمُشْرِکِیْنَ",
        "hinglish": "shirk karne wale"
      },
      {
        "arabic": "النَّادِمُوْنَ / النَّادِمِیْنَ",
        "hinglish": "sharminda hone wale"
      },
      {
        "arabic": "الْمُقَرَّبُوْنَ / الْمُقَرَّبِیْنَ",
        "hinglish": "qareeb kiye gaye log"
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
    ],
    "steps": [
      {
        "title": "1. Misaal 1",
        "description": "الْمُحْسِنُونَ → ehsaan karne waale → أَجْرُ الْمُحْسِنِينَ → ehsaan karne waalon ka ajar"
      },
      {
        "title": "2. Misaal 2",
        "description": "الظَّالِمُونَ → zaalim log → جَزَاءُ الظَّالِمِينَ → zaalimon ki jaza (badla)"
      },
      {
        "title": "3. Misaal 3",
        "description": "الْمُؤْمِنُونَ → momineen / ahl-e-imaan → سَبِيلُ الْمُؤْمِنِينَ → mominon ka raasta"
      }
    ],
    "examples": [
      {
        "arabic": "سَبِيلُ الْمُؤْمِنِينَ",
        "hinglish": "mominon ka rasta"
      },
      {
        "arabic": "سَبِيلُ الْمُجْرِمِينَ",
        "hinglish": "mujrimon ka rasta"
      },
      {
        "arabic": "سَبِيلُ الْمُفْسِدِينَ",
        "hinglish": "fasad karne walon ka rasta"
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
    ],
    "steps": [
      {
        "title": "1. Misaal 1",
        "description": "نَبِيٌّ → nabi → أَنْبِيَاءُ → anbiya (sab nabi)"
      },
      {
        "title": "2. Misaal 2",
        "description": "عَالِمٌ → aalim → عُلَمَاءُ → ulama (sab aalim)"
      },
      {
        "title": "3. Misaal 3",
        "description": "حَاكِمٌ → haakim → حُكَّامٌ → hukkaam (sab haakim)"
      }
    ],
    "examples": [
      {
        "arabic": "كَافِرٌ : كُفَّار",
        "hinglish": "kafir : kafir log"
      },
      {
        "arabic": "عَالِمٌ : عُلَمَاء",
        "hinglish": "alim : ulema"
      },
      {
        "arabic": "فَقِيرٌ : فُقَرَاء",
        "hinglish": "faqeer : ghareeb log"
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
    ],
    "steps": [
      {
        "title": "1. Misaal 1",
        "description": "مُسْلِمُونَ → musalman → هُمْ مُسْلِمُونَ → woh log musalman hain"
      },
      {
        "title": "2. Misaal 2",
        "description": "مُجَاهِدُونَ → jihaad karne waale → هُمْ مُجَاهِدُونَ → woh log mujaahid hain"
      },
      {
        "title": "3. Misaal 3",
        "description": "شَاكِرُونَ → shukr-guzaar log → هُمْ شَاكِرُونَ → woh log shukr-guzaar hain"
      }
    ],
    "examples": [
      {
        "arabic": "خَالِدُونَ ← هُمْ خَالِدُونَ",
        "hinglish": "woh hamesha rehne wale hain"
      },
      {
        "arabic": "مُظْلِمُونَ ← هُمْ مُظْلِمُونَ",
        "hinglish": "woh andhere mein hain"
      },
      {
        "arabic": "مُحْسِنُونَ ← هُمْ مُحْسِنُونَ",
        "hinglish": "woh ehsan karne wale hain"
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
    ],
    "steps": [
      {
        "title": "1. Misaal 1",
        "description": "رَبٌّ → Rabb → رَبُّهُمْ → unka Rabb"
      },
      {
        "title": "2. Misaal 2",
        "description": "بَيْتٌ → ghar → بَيْتُهُمْ → unka ghar"
      },
      {
        "title": "3. Misaal 3",
        "description": "رَسُولٌ → rasool → رَسُولُهُمْ → unka rasool"
      }
    ],
    "examples": [
      {
        "arabic": "رَبٌّ : رَبُّهُمْ",
        "hinglish": "Rabb : unka Rabb"
      },
      {
        "arabic": "لِبَاسٌ : لِبَاسُهُمْ",
        "hinglish": "Libaas : unka libaas"
      },
      {
        "arabic": "صَلَاةٌ : صَلَاتُهُمْ",
        "hinglish": "Salaah : unki namaaz"
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
    ],
    "steps": [
      {
        "title": "1. Misaal 1",
        "description": "بَيْتُهُمْ → unka ghar → فِي بَيْتِهِمْ → unke ghar mein"
      },
      {
        "title": "2. Misaal 2",
        "description": "رَبُّهُمْ → unka Rabb → إِلَىٰ رَبِّهِمْ → unke Rabb ki taraf"
      },
      {
        "title": "3. Misaal 3",
        "description": "رَسُولُهُمْ → unka rasool → مِنْ رَسُولِهِمْ → unke rasool se"
      }
    ],
    "examples": [
      {
        "arabic": "عَلَى صَلَاتِهِمْ",
        "hinglish": "Apni namaz par"
      },
      {
        "arabic": "عَلَى ظُلْمِهِمْ",
        "hinglish": "Unke zulm par"
      },
      {
        "arabic": "عَلَى أَمْرِهِمْ",
        "hinglish": "Unke kaam/maamle par"
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
    ],
    "steps": [
      {
        "title": "1. قَلَمٌ",
        "description": "qalam → (قَلَمٌ + هُمْ) → قَلَمُهُمْ → unka qalam"
      },
      {
        "title": "2. إِنَّ",
        "description": "beshak → (إِنَّ + هُمْ) → إِنَّهُمْ → beshak woh"
      },
      {
        "title": "3. أَنَّ",
        "description": "ke → (أَنَّ + هُمْ) → أَنَّهُمْ → ke woh"
      }
    ],
    "examples": [
      {
        "arabic": "لَهُمْ فِي الْأَرْضِ",
        "hinglish": "unke liye zameen mein"
      },
      {
        "arabic": "لَهُمْ مِنْ جَهَنَّمَ",
        "hinglish": "unke liye jahannam se"
      },
      {
        "arabic": "لَهُمْ جَهَنَّمُ",
        "hinglish": "unke liye jahannam hai"
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
    ],
    "steps": [
      {
        "title": "1. Misaal 1",
        "description": "مُسْلِمُونَ → musalman → أَنْتُمْ مُسْلِمُونَ → tum log musalman ho"
      },
      {
        "title": "2. Misaal 2",
        "description": "مُجَاهِدُونَ → jihaad karne waale → أَنْتُمْ مُجَاهِدُونَ → tum log mujaahid ho"
      },
      {
        "title": "3. Misaal 3",
        "description": "شَاكِرُونَ → shukr-guzaar log → أَنْتُمْ شَاكِرُونَ → tum log shukr-guzaar ho"
      }
    ],
    "examples": [
      {
        "arabic": "مُسْلِمُونَ ← أَنْتُمْ مُسْلِمُونَ",
        "hinglish": "Musalman → Tum musalman ho"
      },
      {
        "arabic": "ظَالِمُونَ ← أَنْتُمْ ظَالِمُونَ",
        "hinglish": "Zalim → Tum zalim ho"
      },
      {
        "arabic": "عَابِدُونَ ← أَنْتُمْ عَابِدُونَ",
        "hinglish": "Ibadat karne wale → Tum ibadat karne wale ho"
      }
    ]
  },
  "s5l10": {
    "lessonKey": "s5l10",
    "title": "S5L10 (Pages 69–71): كِتَابٌ ← كِتَابُكُمْ (Tum Logon ki Kitaab)",
    "badge": "Ism + Zameer (ـكُمْ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 165\" width=\"100%\" height=\"165\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:12px;\">\n    <rect x=\"16\" y=\"16\" width=\"328\" height=\"133\" rx=\"12\" fill=\"#ffffff\" stroke=\"#475569\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"44\" font-size=\"12.5\" font-weight=\"700\" fill=\"#475569\" text-anchor=\"middle\">ASAL ISM (Mufrad / Jama)</text>\n    <text x=\"180\" y=\"96\" font-family=\"'Amiri','Traditional Arabic',serif\" font-size=\"30\" font-weight=\"bold\" fill=\"#475569\" text-anchor=\"middle\" direction=\"rtl\" class=\"v-root\">كِتَابٌ  •  رَبٌّ  •  بَيْتٌ</text>\n    <text x=\"180\" y=\"130\" font-size=\"12.5\" font-weight=\"600\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-vowel\">kitaab  •  Rabb  •  ghar</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 165\" width=\"100%\" height=\"165\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ecfdf5; border-radius:12px;\">\n    <rect x=\"16\" y=\"16\" width=\"328\" height=\"133\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"44\" font-size=\"12.5\" font-weight=\"700\" fill=\"#475569\" text-anchor=\"middle\">ZAMEER (ـكُمْ) KE SAATH</text>\n    <text x=\"180\" y=\"96\" font-family=\"'Amiri','Traditional Arabic',serif\" font-size=\"30\" font-weight=\"bold\" fill=\"#059669\" text-anchor=\"middle\" direction=\"rtl\" class=\"v-root\">كِتَابُكُمْ  •  رَبُّكُمْ  •  بَيْتُكُمْ</text>\n    <text x=\"180\" y=\"130\" font-size=\"12.5\" font-weight=\"600\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-vowel\">tum logon ki kitaab  •  tumhara Rabb  •  tumhara ghar</text>\n  </svg>",
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
    ],
    "steps": [
      {
        "title": "1. Misaal 1",
        "description": "رَبٌّ → Rabb → رَبُّكُمْ → tum logon ka Rabb"
      },
      {
        "title": "2. Misaal 2",
        "description": "بَيْتٌ → ghar → بَيْتُكُمْ → tum logon ka ghar"
      },
      {
        "title": "3. Misaal 3",
        "description": "رَسُولٌ → rasool → رَسُولُكُمْ → tum logon ka rasool"
      }
    ],
    "examples": [
      {
        "arabic": "إِلَٰهُ : إِلَٰهُكُمْ",
        "hinglish": "tum logon ka ma'bood"
      },
      {
        "arabic": "دِينٌ : دِينُكُمْ",
        "hinglish": "tum logon ka deen"
      },
      {
        "arabic": "رَبٌّ : رَبُّكُمْ",
        "hinglish": "tum logon ka Rabb"
      }
    ]
  },
  "s5l11": {
    "lessonKey": "s5l11",
    "title": "S5L11 (Pages 72–73): كِتَابُكُمْ ← فِي كِتَابِكُمْ (Tumhari Kitaab Mein)",
    "badge": "Harf-e-Jarr + ـِكُمْ",
    "svgOriginal": "<svg viewBox=\"0 0 360 165\" width=\"100%\" height=\"165\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:12px;\">\n    <rect x=\"16\" y=\"16\" width=\"328\" height=\"133\" rx=\"12\" fill=\"#ffffff\" stroke=\"#475569\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"44\" font-size=\"12.5\" font-weight=\"700\" fill=\"#475569\" text-anchor=\"middle\">ISM + ZAMEER (ـُكُمْ)</text>\n    <text x=\"180\" y=\"96\" font-family=\"'Amiri','Traditional Arabic',serif\" font-size=\"30\" font-weight=\"bold\" fill=\"#475569\" text-anchor=\"middle\" direction=\"rtl\" class=\"v-root\">بَيْتُكُمْ  •  رَبُّكُمْ  •  رَسُولُكُمْ</text>\n    <text x=\"180\" y=\"130\" font-size=\"12.5\" font-weight=\"600\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-vowel\">tumhara ghar  •  tumhara Rabb  •  tumhara rasool</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 165\" width=\"100%\" height=\"165\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f0f9ff; border-radius:12px;\">\n    <rect x=\"16\" y=\"16\" width=\"328\" height=\"133\" rx=\"12\" fill=\"#ffffff\" stroke=\"#0284c7\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"44\" font-size=\"12.5\" font-weight=\"700\" fill=\"#475569\" text-anchor=\"middle\">HARF-E-JARR / INNA KE BAAD</text>\n    <text x=\"180\" y=\"96\" font-family=\"'Amiri','Traditional Arabic',serif\" font-size=\"30\" font-weight=\"bold\" fill=\"#0284c7\" text-anchor=\"middle\" direction=\"rtl\" class=\"v-root\">فِي بَيْتِكُمْ  •  إِلَىٰ رَبِّكُمْ  •  إِنَّ رَبَّكُمْ</text>\n    <text x=\"180\" y=\"130\" font-size=\"12.5\" font-weight=\"600\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-vowel\">كُمْ se pehle zer (ـِكُمْ) ya Inna se zabar (ـَكُمْ)</text>\n  </svg>",
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
    ],
    "steps": [
      {
        "title": "1. Misaal 1",
        "description": "بَيْتُكُمْ → tum logon ka ghar → فِي بَيْتِكُمْ → tum logon ke ghar mein"
      },
      {
        "title": "2. Misaal 2",
        "description": "رَبُّكُمْ → tum logon ka Rabb → إِلَىٰ رَبِّكُمْ → tum logon ke Rabb ki taraf"
      },
      {
        "title": "3. Misaal 3",
        "description": "رَسُولُكُمْ → tum logon ka rasool → مِنْ رَسُولِكُمْ → tum logon ke rasool se"
      }
    ],
    "examples": [
      {
        "arabic": "عَلَى إِخْرَاجِكُمْ",
        "hinglish": "tum logon ke nikalne par"
      },
      {
        "arabic": "عَلَى أَنْفُسِكُمْ",
        "hinglish": "tum logon ki janon par"
      },
      {
        "arabic": "عَلَى قُلُوبِكُمْ",
        "hinglish": "tum logon ke dilon par"
      }
    ]
  },
  "s5l12": {
    "lessonKey": "s5l12",
    "title": "S5L12 (Pages 74–79): لِـ ← لَكُمْ ، مِنْ ← مِنْكُمْ ، إِنَّ ← إِنَّكُمْ",
    "badge": "Huroof + ـكُمْ",
    "svgOriginal": "<svg viewBox=\"0 0 360 165\" width=\"100%\" height=\"165\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:12px;\">\n    <rect x=\"16\" y=\"16\" width=\"328\" height=\"133\" rx=\"12\" fill=\"#ffffff\" stroke=\"#475569\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"44\" font-size=\"12.5\" font-weight=\"700\" fill=\"#475569\" text-anchor=\"middle\">HUROOF (Prepositions & Particles)</text>\n    <text x=\"180\" y=\"96\" font-family=\"'Amiri','Traditional Arabic',serif\" font-size=\"30\" font-weight=\"bold\" fill=\"#475569\" text-anchor=\"middle\" direction=\"rtl\" class=\"v-root\">لِـ  •  مِنْ  •  إِنَّ  •  عَلَىٰ  •  إِلَىٰ</text>\n    <text x=\"180\" y=\"130\" font-size=\"12.5\" font-weight=\"600\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-vowel\">liye  •  se  •  beshak  •  par  •  ki taraf</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 165\" width=\"100%\" height=\"165\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f5f3ff; border-radius:12px;\">\n    <rect x=\"16\" y=\"16\" width=\"328\" height=\"133\" rx=\"12\" fill=\"#ffffff\" stroke=\"#7c3aed\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"44\" font-size=\"12.5\" font-weight=\"700\" fill=\"#475569\" text-anchor=\"middle\">HUROOF + ZAMEER (ـكُمْ)</text>\n    <text x=\"180\" y=\"96\" font-family=\"'Amiri','Traditional Arabic',serif\" font-size=\"30\" font-weight=\"bold\" fill=\"#7c3aed\" text-anchor=\"middle\" direction=\"rtl\" class=\"v-root\">لَكُمْ  •  مِنْكُمْ  •  إِنَّكُمْ  •  عَلَيْكُمْ</text>\n    <text x=\"180\" y=\"130\" font-size=\"12.5\" font-weight=\"600\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-vowel\">tumhare liye  •  tum se  •  beshak tum  •  tum par</text>\n  </svg>",
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
    ],
    "steps": [
      {
        "title": "1. قَلَمٌ",
        "description": "qalam → (قَلَمٌ + كُمْ) → قَلَمُكُمْ → tumhara qalam"
      },
      {
        "title": "2. إِنَّ",
        "description": "beshak → (إِنَّ + كُمْ) → إِنَّكُمْ → beshak tum"
      },
      {
        "title": "3. أَنَّ",
        "description": "ke → (أَنَّ + كُمْ) → أَنَّكُمْ → ke tum"
      }
    ],
    "examples": [
      {
        "arabic": "عَلَيْكُم مِسْكِينٌ",
        "hinglish": "tum par miskeen"
      },
      {
        "arabic": "عَلَيْكُم فِي الْكِتَابِ",
        "hinglish": "tum par kitab mein"
      },
      {
        "arabic": "عَلَيْكُمُ اللَّيْلَ",
        "hinglish": "tum par raat"
      }
    ]
  },
  "s5l13": {
    "lessonKey": "s5l13",
    "title": "S5L13 (Page 80): مُسْلِمُونَ ← نَحْنُ مُسْلِمُونَ (Hum Musalman Hain)",
    "badge": "Zameer (نَحْنُ — Hum)",
    "svgOriginal": "<svg viewBox=\"0 0 360 165\" width=\"100%\" height=\"165\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:12px;\">\n    <rect x=\"16\" y=\"16\" width=\"328\" height=\"133\" rx=\"12\" fill=\"#ffffff\" stroke=\"#475569\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"44\" font-size=\"12.5\" font-weight=\"700\" fill=\"#475569\" text-anchor=\"middle\">JAMA KA LAFZ (Khabar)</text>\n    <text x=\"180\" y=\"96\" font-family=\"'Amiri','Traditional Arabic',serif\" font-size=\"30\" font-weight=\"bold\" fill=\"#475569\" text-anchor=\"middle\" direction=\"rtl\" class=\"v-root\">مُسْلِمُونَ  •  مُجَاهِدُونَ  •  شَاكِرُونَ</text>\n    <text x=\"180\" y=\"130\" font-size=\"12.5\" font-weight=\"600\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-vowel\">musalman  •  mujaahid  •  shukr-guzaar</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 165\" width=\"100%\" height=\"165\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ecfdf5; border-radius:12px;\">\n    <rect x=\"16\" y=\"16\" width=\"328\" height=\"133\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"44\" font-size=\"12.5\" font-weight=\"700\" fill=\"#475569\" text-anchor=\"middle\">نَحْنُ KE SAATH MUKAMMAL JUMLA</text>\n    <text x=\"180\" y=\"96\" font-family=\"'Amiri','Traditional Arabic',serif\" font-size=\"30\" font-weight=\"bold\" fill=\"#059669\" text-anchor=\"middle\" direction=\"rtl\" class=\"v-root\">نَحْنُ مُسْلِمُونَ  •  نَحْنُ الْغَالِبُونَ</text>\n    <text x=\"180\" y=\"130\" font-size=\"12.5\" font-weight=\"600\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-vowel\">hum musalman hain  •  hum hi ghaalib hain</text>\n  </svg>",
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
    ],
    "steps": [
      {
        "title": "1. Misaal 1",
        "description": "مُسْلِمُونَ → musalman → نَحْنُ مُسْلِمُونَ → hum musalman hain"
      },
      {
        "title": "2. Misaal 2",
        "description": "مُجَاهِدُونَ → jihaad karne waale → نَحْنُ مُجَاهِدُونَ → hum mujaahid hain"
      },
      {
        "title": "3. Misaal 3",
        "description": "شَاكِرُونَ → shukr-guzaar log → نَحْنُ شَاكِرُونَ → hum shukr-guzaar hain"
      }
    ],
    "examples": [
      {
        "arabic": "أَغْنِيَاءُ ← نَحْنُ أَغْنِيَاءُ",
        "hinglish": "maaldaar ← hum maaldaar hain"
      },
      {
        "arabic": "مَحْرُومُونَ ← نَحْنُ مَحْرُومُونَ",
        "hinglish": "mehroom ← hum mehroom hain"
      },
      {
        "arabic": "أَعْلَمُ ← نَحْنُ أَعْلَمُ",
        "hinglish": "zyaada jaanne waale ← hum khoob jaante hain"
      }
    ]
  },
  "s5l14": {
    "lessonKey": "s5l14",
    "title": "S5L14 (Pages 81–82): كِتَابٌ ← كِتَابُنَا (Hamaari Kitaab)",
    "badge": "Ism + Zameer (ـنَا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 165\" width=\"100%\" height=\"165\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:12px;\">\n    <rect x=\"16\" y=\"16\" width=\"328\" height=\"133\" rx=\"12\" fill=\"#ffffff\" stroke=\"#475569\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"44\" font-size=\"12.5\" font-weight=\"700\" fill=\"#475569\" text-anchor=\"middle\">ASAL ISM (Mufrad / Jama)</text>\n    <text x=\"180\" y=\"96\" font-family=\"'Amiri','Traditional Arabic',serif\" font-size=\"30\" font-weight=\"bold\" fill=\"#475569\" text-anchor=\"middle\" direction=\"rtl\" class=\"v-root\">رَبٌّ  •  بَيْتٌ  •  رَسُولٌ  •  ذُنُوبٌ</text>\n    <text x=\"180\" y=\"130\" font-size=\"12.5\" font-weight=\"600\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-vowel\">Rabb  •  ghar  •  rasool  •  gunaah</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 165\" width=\"100%\" height=\"165\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f0f9ff; border-radius:12px;\">\n    <rect x=\"16\" y=\"16\" width=\"328\" height=\"133\" rx=\"12\" fill=\"#ffffff\" stroke=\"#0284c7\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"44\" font-size=\"12.5\" font-weight=\"700\" fill=\"#475569\" text-anchor=\"middle\">ZAMEER (ـنَا) KE SAATH</text>\n    <text x=\"180\" y=\"96\" font-family=\"'Amiri','Traditional Arabic',serif\" font-size=\"30\" font-weight=\"bold\" fill=\"#0284c7\" text-anchor=\"middle\" direction=\"rtl\" class=\"v-root\">رَبُّنَا  •  بَيْتُنَا  •  رَسُولُنَا  •  ذُنُوبُنَا</text>\n    <text x=\"180\" y=\"130\" font-size=\"12.5\" font-weight=\"600\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-vowel\">hamaara Rabb  •  hamaara ghar  •  hamaare gunaah</text>\n  </svg>",
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
    ],
    "steps": [
      {
        "title": "1. Misaal 1",
        "description": "رَبٌّ → Rabb → رَبُّنَا → hamaara Rabb"
      },
      {
        "title": "2. Misaal 2",
        "description": "بَيْتٌ → ghar → بَيْتُنَا → hamaara ghar"
      },
      {
        "title": "3. Misaal 3",
        "description": "رَسُولٌ → rasool → رَسُولُنَا → hamaara rasool"
      }
    ],
    "examples": [
      {
        "arabic": "رَحْمَتُنَا",
        "hinglish": "Hamari rahmat"
      },
      {
        "arabic": "رَسُولُنَا",
        "hinglish": "Hamara Rasool"
      },
      {
        "arabic": "رَبُّنَا",
        "hinglish": "Hamara Rabb"
      }
    ]
  },
  "s5l15": {
    "lessonKey": "s5l15",
    "title": "S5L15: كِتَابُنَا ← فِي كِتَابِنَا (Hamaari Kitaab → Hamaari Kitaab Mein)",
    "badge": "Harf + Ism + نَا",
    "svgOriginal": "<svg viewBox=\"0 0 420 185\" width=\"100%\" height=\"185\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"15\" y=\"15\" width=\"390\" height=\"155\" rx=\"12\" fill=\"#ffffff\" stroke=\"#cbd5e1\" stroke-width=\"2\"/>\n    <text x=\"210\" y=\"42\" font-size=\"13\" font-weight=\"700\" fill=\"#475569\" text-anchor=\"middle\">ASAL HALAT: Ism + نَا (hamaara / hamaari)</text>\n    <text x=\"210\" y=\"88\" font-family=\"'Traditional Arabic', 'Amiri', serif\" font-size=\"30\" font-weight=\"700\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">كِتَابُنَا • بَيْتُنَا • رَبُّنَا • عَذَابُنَا</text>\n    <text x=\"210\" y=\"118\" font-size=\"12.5\" font-weight=\"600\" fill=\"#334155\" text-anchor=\"middle\">hamaari kitaab • hamaara ghar • hamaara Rabb • hamaara azaab</text>\n    <text x=\"210\" y=\"148\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">نَا se pehle Pesh (ـُ) ki aam halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 420 185\" width=\"100%\" height=\"185\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"15\" y=\"15\" width=\"390\" height=\"155\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"210\" y=\"40\" font-size=\"12.5\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">SHURU MEIN HARF (فِي، مِنْ، إِلَىٰ، لِـ، عَلَىٰ، إِنَّ) AANE PAR</text>\n    <text x=\"210\" y=\"84\" font-family=\"'Traditional Arabic', 'Amiri', serif\" font-size=\"25\" font-weight=\"700\" fill=\"#c0392b\" text-anchor=\"middle\" class=\"v-suffix\">فِي كِتَابِنَا • فِي بَيْتِنَا • إِلَىٰ رَبِّنَا • إِنَّ عَذَابَنَا</text>\n    <text x=\"210\" y=\"115\" font-size=\"12\" font-weight=\"600\" fill=\"#065f46\" text-anchor=\"middle\">hamaari kitaab mein • ghar mein • Rabb ki taraf • beshak hamaara azaab</text>\n    <text x=\"210\" y=\"146\" font-size=\"11.5\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Harf-e-Jarr se Zer (ـِنَا) aur إِنَّ se Zabar (ـَنَا) aata hai</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'كِتَابُنَا' (hamaari kitaab) se pehle 'فِي' (mein) aata hai toh kya qat'ah banta hai?",
      "options": [
        "'فِي كِتَابِنَا' (hamaari kitaab mein — ب ke neeche zer aa jaati hai)",
        "Ma'ni badal kar wahid ho jaata hai"
      ],
      "correct": 0,
      "explanation": "'فِي' aane se (نَا) se pehle wale harf ke neeche zer aa jaati hai aur 'فِي كِتَابِنَا' (hamaari kitaab mein) banta hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "كِتَابُنَا / بَيْتُنَا (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "فِي كِتَابِنَا / إِلَىٰ رَبِّنَا (Qat'ah)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Zer (ـِنَا) / Zabar (ـَنَا)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Asal Lafz ki Pehchan",
        "description": "Bunyadi lafz aur tarkeeb: كِتَابُنَا ← فِي كِتَابِنَا"
      },
      {
        "title": "2. Qaida aur Tabdeeli",
        "description": "hamaari kitaab ← hamaari kitaab mein"
      }
    ],
    "examples": []
  },
  "s5l16": {
    "lessonKey": "s5l16",
    "title": "S5L16: لِـ ← لَنَا | عَلَىٰ ← عَلَيْنَا | إِنَّ ← إِنَّا (Huroof + نَا)",
    "badge": "Harf + نَا = Naya Lafz",
    "svgOriginal": "<svg viewBox=\"0 0 420 185\" width=\"100%\" height=\"185\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"15\" y=\"15\" width=\"390\" height=\"155\" rx=\"12\" fill=\"#ffffff\" stroke=\"#cbd5e1\" stroke-width=\"2\"/>\n    <text x=\"210\" y=\"40\" font-size=\"13\" font-weight=\"700\" fill=\"#475569\" text-anchor=\"middle\">1. ALAG ALAG DO ALFAAZ (Harf + نَا)</text>\n    <text x=\"210\" y=\"84\" font-family=\"'Traditional Arabic', 'Amiri', serif\" font-size=\"26\" font-weight=\"700\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">(لِـ + نَا) • (عَلَىٰ + نَا) • (إِنَّ + نَا) • (مِنْ + نَا)</text>\n    <text x=\"210\" y=\"115\" font-size=\"12\" font-weight=\"600\" fill=\"#334155\" text-anchor=\"middle\">liye + ham • par + ham • beshak + ham • se + ham</text>\n    <text x=\"210\" y=\"146\" font-size=\"11.5\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Harf ke aakhir mein (نَا) judne se pehle ki halat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 420 185\" width=\"100%\" height=\"185\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"15\" y=\"15\" width=\"390\" height=\"155\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"210\" y=\"40\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">2. JUD KAR BANNE WALA TEESRA NAYA LAFZ</text>\n    <text x=\"210\" y=\"82\" font-family=\"'Traditional Arabic', 'Amiri', serif\" font-size=\"26\" font-weight=\"700\" fill=\"#c0392b\" text-anchor=\"middle\" class=\"v-suffix\">لَنَا • عَلَيْنَا • إِنَّا • مِنَّا • إِلَيْنَا • فِينَا • عَنَّا</text>\n    <text x=\"210\" y=\"114\" font-size=\"11.5\" font-weight=\"600\" fill=\"#065f46\" text-anchor=\"middle\">hamaare liye • ham par • beshak ham • ham se • hamaari taraf • ham mein</text>\n    <text x=\"210\" y=\"146\" font-size=\"11.5\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Do alfaaz mil kar ek naya mukammal Qur'ani lafz banate hain</text>\n  </svg>",
    "prediction": {
      "question": "Jab (لِـ : liye), (عَلَىٰ : par) aur (إِنَّ : beshak) ke aakhir mein (نَا) judta hai toh kya naye alfaaz bante hain?",
      "options": [
        "'لَنَا' (hamaare liye), 'عَلَيْنَا' (ham par) aur 'إِنَّا' (beshak ham)",
        "Alfaaz mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "لِـ + نَا = لَنَا (hamaare liye), عَلَىٰ + نَا = عَلَيْنَا (ham par), aur إِنَّ + نَا = إِنَّنَا / إِنَّا (beshak ham) banta hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "لِـ / عَلَىٰ / إِنَّ + نَا (Jor)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "لَنَا / عَلَيْنَا / إِنَّا (Naya Lafz)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Idghaam wa Ittiqaal",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Asal Lafz ki Pehchan",
        "description": "Bunyadi lafz aur tarkeeb: لِـ ← لَنَا ، مِنْ ← مِنَّا ، إِنَّ ← إِنَّنَا / إِنَّا"
      },
      {
        "title": "2. Qaida aur Tabdeeli",
        "description": "liye ← hamaare liye  |  se ← hum se  |  beshak ← beshak hum"
      }
    ],
    "examples": []
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
    ],
    "steps": [
      {
        "title": "1. Misaal 1",
        "description": "مُسْلِمُونَ → musalman → أُولَٰئِكَ مُسْلِمُونَ → woh log / yeh log musalman hain"
      },
      {
        "title": "2. Misaal 2",
        "description": "أَصْحَابٌ → saathi / waale → أُولَٰئِكَ أَصْحَابُ الْجَنَّةِ → woh log / yeh log Jannat waale hain"
      },
      {
        "title": "3. Misaal 3",
        "description": "فِي الْعَذَابِ → azaab mein → أُولَٰئِكَ فِي الْعَذَابِ → woh log / yeh log azaab mein hain"
      }
    ],
    "examples": [
      {
        "arabic": "أُولَائِكَ أَصْحَابُ الْجَنَّةِ",
        "hinglish": "Yeh log jannat wale hain"
      },
      {
        "arabic": "أُولَائِكَ أَصْحَابُ النَّارِ",
        "hinglish": "Yeh log aag wale hain"
      },
      {
        "arabic": "وَأُولَائِكَ أَصْحَابُ النَّارِ",
        "hinglish": "Aur woh log dozaqh wale hain"
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
    ],
    "steps": [
      {
        "title": "1. Misaal 1",
        "description": "مُجْرِمُونَ → mujrim log → هَٰؤُلَاءِ مُجْرِمُونَ → yeh log mujrim hain"
      },
      {
        "title": "2. Misaal 2",
        "description": "شُفَعَاءُ → sifaarish karne waale → هَٰؤُلَاءِ شُفَعَاءُ → yeh log sifaarishi hain"
      },
      {
        "title": "3. Misaal 3",
        "description": "آلِهَةٌ → ma'boodon → هَٰؤُلَاءِ آلِهَةٌ → yeh sab ma'bood hain"
      }
    ],
    "examples": [
      {
        "arabic": "هَؤُلَاءِ آلِهَةٌ",
        "hinglish": "Yeh mabood hain"
      },
      {
        "arabic": "إِنَّ هَؤُلَاءِ لَضَالُّونَ",
        "hinglish": "Ke yeh log mujrim qaum hain"
      },
      {
        "arabic": "هَؤُلَاءِ شُرَكَاؤُنَا",
        "hinglish": "Yeh hamare shareek hain"
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
    ],
    "steps": [
      {
        "title": "1. Misaal 1",
        "description": "مُحَمَّدٌ رَسُولٌ → Muhammad ﷺ ek rasool hain → مَا مُحَمَّدٌ إِلَّا رَسُولٌ → Muhammad ﷺ nahin hain magar ek rasool"
      },
      {
        "title": "2. Misaal 2",
        "description": "هَٰذَا بَشَرٌ → yeh ek insaan hai → مَا هَٰذَا إِلَّا بَشَرٌ → nahin hai yeh magar ek insaan"
      },
      {
        "title": "3. Misaal 3",
        "description": "هُوَ ذِكْرٌ → woh zikr (naseehat) hai → مَا هُوَ إِلَّا ذِكْرٌ → woh nahin hai magar ek zikr"
      }
    ],
    "examples": [
      {
        "arabic": "وَمَا مُحَمَّدٌ إِلَّا رَسُولٌ",
        "hinglish": "Wa maa Muhammadun illaa rasool"
      },
      {
        "arabic": "مَا هٰذَا إِلَّا سِحْرٌ",
        "hinglish": "Nahi hai yeh magar ek jaadu"
      },
      {
        "arabic": "مَا هٰذَا إِلَّا بَشَرٌ",
        "hinglish": "Nahi hai yeh magar ek insaan"
      }
    ]
  },
  "s5l20": {
    "lessonKey": "s5l20",
    "title": "S5L20 (Pages 95–98): Jumlon ke Shuru ke 7 Aham Alfaaz (لَيْسَ، مَا، أَ/هَلْ، أَمْ، أَنَّىٰ، بَلْ، كَأَنَّ)",
    "badge": "7 Sentence Starters",
    "svgOriginal": "<svg viewBox=\"0 0 360 165\" width=\"100%\" height=\"165\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ecfdf5; border-radius:12px;\">\n    <rect x=\"16\" y=\"16\" width=\"328\" height=\"133\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"44\" font-size=\"12.5\" font-weight=\"700\" fill=\"#475569\" text-anchor=\"middle\">NAFI & SAWAAL STARTERS (1–5)</text>\n    <text x=\"180\" y=\"96\" font-family=\"'Amiri','Traditional Arabic',serif\" font-size=\"30\" font-weight=\"bold\" fill=\"#059669\" text-anchor=\"middle\" direction=\"rtl\" class=\"v-root\">لَيْسَ  •  مَا...بِـ  •  أَ / هَلْ  •  أَمْ  •  أَنَّىٰ</text>\n    <text x=\"180\" y=\"130\" font-size=\"12.5\" font-weight=\"600\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-vowel\">nahin hai  •  hargiz nahin  •  kya?  •  ya?  •  kaise?</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 165\" width=\"100%\" height=\"165\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f5f3ff; border-radius:12px;\">\n    <rect x=\"16\" y=\"16\" width=\"328\" height=\"133\" rx=\"12\" fill=\"#ffffff\" stroke=\"#7c3aed\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"44\" font-size=\"12.5\" font-weight=\"700\" fill=\"#475569\" text-anchor=\"middle\">TARDEED & TASHBEEH (6–7)</text>\n    <text x=\"180\" y=\"96\" font-family=\"'Amiri','Traditional Arabic',serif\" font-size=\"30\" font-weight=\"bold\" fill=\"#7c3aed\" text-anchor=\"middle\" direction=\"rtl\" class=\"v-root\">بَلْ (balke)  •  كَأَنَّ (goya ke)</text>\n    <text x=\"180\" y=\"130\" font-size=\"12.5\" font-weight=\"600\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-vowel\">balke / dar-haqeeqat  •  goya ke / jaise ke</text>\n  </svg>",
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
    ],
    "steps": [
      {
        "title": "1. Asal Lafz ki Pehchan",
        "description": "Bunyadi lafz aur tarkeeb: لَيْسَ ، مَا ، أَ / هَلْ ، أَمْ ، أَنَّىٰ ، بَلْ ، كَأَنَّ"
      },
      {
        "title": "2. Qaida aur Tabdeeli",
        "description": "nahin hai (لَيْسَ / مَا) • kya (أَ / هَلْ) • ya (أَمْ) • kaise (أَنَّىٰ) • balke (بَلْ) • goya ke (كَأَنَّ)"
      }
    ],
    "examples": [
      {
        "arabic": "لَيْسَ عَلَيْكُمْ جُنَاحٌ",
        "hinglish": "Tum par koi gunaah nahin hai"
      },
      {
        "arabic": "لَيْسَ عَلَيْهِمْ جُنَاحٌ",
        "hinglish": "Un par koi gunaah nahin hai"
      },
      {
        "arabic": "لَيْسَ عَلَيْكَ هُدَاهُمْ",
        "hinglish": "Aap ke zimme unki hidaayat nahin hai"
      }
    ]
  },
  "s5l21": {
    "lessonKey": "s5l21",
    "title": "S5L21 (Pages 99–106): 15 Mashhoor Qur'ani Muhaaware (أَلَا، أَلَيْسَ، سُبْحَانَ، قُلْ، إِذًا...)",
    "badge": "15 Qur'ani Idioms",
    "svgOriginal": "<svg viewBox=\"0 0 360 165\" width=\"100%\" height=\"165\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f0f9ff; border-radius:12px;\">\n    <rect x=\"16\" y=\"16\" width=\"328\" height=\"133\" rx=\"12\" fill=\"#ffffff\" stroke=\"#0284c7\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"44\" font-size=\"12.5\" font-weight=\"700\" fill=\"#475569\" text-anchor=\"middle\">SECTIONS 1–8 (Pages 99–103)</text>\n    <text x=\"180\" y=\"96\" font-family=\"'Amiri','Traditional Arabic',serif\" font-size=\"30\" font-weight=\"bold\" fill=\"#0284c7\" text-anchor=\"middle\" direction=\"rtl\" class=\"v-root\">أَلَا • أَلَيْسَ • الْيَوْمَ • يَوْمَئِذٍ • سُبْحَانَ • قُلْ • إِذًا</text>\n    <text x=\"180\" y=\"130\" font-size=\"12.5\" font-weight=\"600\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-vowel\">khabardaar • kya nahin? • aaj • us roz • paak hai • keh do • tab to</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 165\" width=\"100%\" height=\"165\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ecfdf5; border-radius:12px;\">\n    <rect x=\"16\" y=\"16\" width=\"328\" height=\"133\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"44\" font-size=\"12.5\" font-weight=\"700\" fill=\"#475569\" text-anchor=\"middle\">SECTIONS 9–15 (Pages 104–106)</text>\n    <text x=\"180\" y=\"96\" font-family=\"'Amiri','Traditional Arabic',serif\" font-size=\"30\" font-weight=\"bold\" fill=\"#059669\" text-anchor=\"middle\" direction=\"rtl\" class=\"v-root\">بِئْسَ • نِعْمَ • كَلَّا • مَا أَدْرَاكَ • حَسْبُ • أَعْلَمُ • مَصِير</text>\n    <text x=\"180\" y=\"130\" font-size=\"12.5\" font-weight=\"600\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-vowel\">bura • shaandaar • hargiz nahin • kya pata • kaafi • behtar jaanne waala</text>\n  </svg>",
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
    ],
    "steps": [
      {
        "title": "1. Asal Lafz ki Pehchan",
        "description": "Bunyadi lafz aur tarkeeb: أَلَا ، أَلَيْسَ ، الْيَوْمَ ، يَوْمَئِذٍ ، سُبْحَانَ ، وَمَا بَيْنَهُمَا ، قُلْ ، إِذًا ، بِئْسَ ، نِعْمَ ، كَلَّا ، مَا أَدْرَاكَ مَا ، حَسْبُ ، أَعْلَمُ بِـ ، الْمَصِير"
      },
      {
        "title": "2. Qaida aur Tabdeeli",
        "description": "15 Mashhoor Qur'ani Muhaaware aur Unke Zariye Samajh Aane Waali Darjanon Aayaat"
      }
    ],
    "examples": [
      {
        "arabic": "أَلَا / إِنَّ نَصْرَ اللَّهِ قَرِيبٌ",
        "hinglish": "aagah raho, beshak Allah ki madad qareeb hai"
      },
      {
        "arabic": "أَلَا / إِنَّ وَعْدَ اللَّهِ حَقٌّ",
        "hinglish": "khabardar, beshak Allah ka waada sach hai"
      },
      {
        "arabic": "أَلَا / لِلَّهِ الدِّينُ الْخَالِصُ",
        "hinglish": "khabardar, Allah hi ke liye deen-e-khalis hai"
      }
    ]
  },
  "s5l22": {
    "lessonKey": "s5l22",
    "title": "S5L22 (Pages 107–109): دِينٌ ← دِينًا (Ism-e-Tafzeel aur Tamyeez)",
    "badge": "Tamyeez (ـًا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 165\" width=\"100%\" height=\"165\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:12px;\">\n    <rect x=\"16\" y=\"16\" width=\"328\" height=\"133\" rx=\"12\" fill=\"#ffffff\" stroke=\"#475569\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"44\" font-size=\"12.5\" font-weight=\"700\" fill=\"#475569\" text-anchor=\"middle\">ASAL ISM (Do Pesh ـٌ)</text>\n    <text x=\"180\" y=\"96\" font-family=\"'Amiri','Traditional Arabic',serif\" font-size=\"30\" font-weight=\"bold\" fill=\"#475569\" text-anchor=\"middle\" direction=\"rtl\" class=\"v-root\">دِينٌ  •  قُوَّةٌ  •  ثَوَابٌ  •  حَدِيثٌ</text>\n    <text x=\"180\" y=\"130\" font-size=\"12.5\" font-weight=\"600\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-vowel\">deen  •  quwwat  •  sawaab  •  baat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 165\" width=\"100%\" height=\"165\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ecfdf5; border-radius:12px;\">\n    <rect x=\"16\" y=\"16\" width=\"328\" height=\"133\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"44\" font-size=\"12.5\" font-weight=\"700\" fill=\"#475569\" text-anchor=\"middle\">DO ZABAR (ـًا) KE SAATH TAMYEEZ</text>\n    <text x=\"180\" y=\"96\" font-family=\"'Amiri','Traditional Arabic',serif\" font-size=\"30\" font-weight=\"bold\" fill=\"#059669\" text-anchor=\"middle\" direction=\"rtl\" class=\"v-root\">أَحْسَنُ دِينًا  •  أَشَدُّ قُوَّةً  •  وَكَفَىٰ بِاللَّهِ وَكِيلًا</text>\n    <text x=\"180\" y=\"130\" font-size=\"12.5\" font-weight=\"600\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-vowel\">deen ke e'tibaar se behtar  •  quwwat mein zyaada sakht</text>\n  </svg>",
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
    ],
    "steps": [
      {
        "title": "1. Misaal 1",
        "description": "قُوَّةٌ → quwwat → أَشَدُّ قُوَّةً → quwwat ke lihaaz se zyaada sakht"
      },
      {
        "title": "2. Misaal 2",
        "description": "ثَوَابٌ → sawaab → خَيْرٌ ثَوَابًا → sawaab ke e'tibaar se behtar"
      },
      {
        "title": "3. Misaal 3",
        "description": "حَدِيثٌ → baat → أَصْدَقُ حَدِيثًا → baat ke lihaaz se zyaada sachcha"
      }
    ],
    "examples": [
      {
        "arabic": "أَشَدُّ بَطْشًا",
        "hinglish": "zyada sakht pakad"
      },
      {
        "arabic": "أَشَدُّ عَذَابًا",
        "hinglish": "zyada sakht azab"
      },
      {
        "arabic": "أَشَدُّ قُوَّةً",
        "hinglish": "zyada sakht quwwat"
      }
    ]
  },
  "s5l23": {
    "lessonKey": "s5l23",
    "title": "S5L23 (Pages 110–112): خَالِقٌ ← مِنْ خَالِقٍ (Nafi-e-Aam aur Min Taakeed)",
    "badge": "Min Zaa'idah (مِنْ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 165\" width=\"100%\" height=\"165\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:12px;\">\n    <rect x=\"16\" y=\"16\" width=\"328\" height=\"133\" rx=\"12\" fill=\"#ffffff\" stroke=\"#475569\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"44\" font-size=\"12.5\" font-weight=\"700\" fill=\"#475569\" text-anchor=\"middle\">SAADA NAKIRAH LAFZ</text>\n    <text x=\"180\" y=\"96\" font-family=\"'Amiri','Traditional Arabic',serif\" font-size=\"30\" font-weight=\"bold\" fill=\"#475569\" text-anchor=\"middle\" direction=\"rtl\" class=\"v-root\">خَالِقٌ  •  وَلِيٌّ  •  نَاصِرٌ</text>\n    <text x=\"180\" y=\"130\" font-size=\"12.5\" font-weight=\"600\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-vowel\">paida karne waala  •  dost  •  madadgaar</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 165\" width=\"100%\" height=\"165\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f5f3ff; border-radius:12px;\">\n    <rect x=\"16\" y=\"16\" width=\"328\" height=\"133\" rx=\"12\" fill=\"#ffffff\" stroke=\"#7c3aed\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"44\" font-size=\"12.5\" font-weight=\"700\" fill=\"#475569\" text-anchor=\"middle\">MANFI / SAWAALIYA JUMLE MEIN (مِنْ)</text>\n    <text x=\"180\" y=\"96\" font-family=\"'Amiri','Traditional Arabic',serif\" font-size=\"30\" font-weight=\"bold\" fill=\"#7c3aed\" text-anchor=\"middle\" direction=\"rtl\" class=\"v-root\">مِنْ خَالِقٍ  •  مَا لَهُ مِنْ وَلِيٍّ وَلَا نَصِيرٍ</text>\n    <text x=\"180\" y=\"130\" font-size=\"12.5\" font-weight=\"600\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-vowel\">koi bhi paida karne waala  •  na koi dost aur na koi madadgaar</text>\n  </svg>",
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
    ],
    "steps": [
      {
        "title": "1. Misaal 1",
        "description": "خَالِقٌ → paida karne waala → مِنْ خَالِقٍ → koi bhi paida karne waala"
      },
      {
        "title": "2. Misaal 2",
        "description": "وَلِيٌّ → dost / kaarsaaz → مِنْ وَلِيٍّ → koi bhi dost / kaarsaaz"
      },
      {
        "title": "3. Misaal 3",
        "description": "نَاصِرٌ → madadgaar → مِنْ نَاصِرٍ → koi bhi madadgaar"
      }
    ],
    "examples": [
      {
        "arabic": "شَرِيكٌ / مِنْ شَرِيكٍ",
        "hinglish": "koi bhi shareek"
      },
      {
        "arabic": "وَلِيٌّ / مِنْ وَلِيٍّ",
        "hinglish": "koi bhi dost"
      },
      {
        "arabic": "إِلَهٌ / مِنْ إِلَهٍ",
        "hinglish": "koi bhi mabood"
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