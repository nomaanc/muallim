// @ts-check
import { renderVisual } from './visual-helper.js';

/**
 * Muallim ul-Qur'an — Unit 2 Grammar Visuals Module (v7.0)
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
    "title": "S2L1: Harf-e-Ta'keed 'Inna': الْكِتَابُ ← إِنَّ الْكِتَابَ",
    "badge": "Inna (إِنَّ + ـَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ ، اللَّهُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Kitaab, Allah (Pesh ـُ)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Inna (إِنَّ + ـَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">إِنَّ الْكِتَابَ ، إِنَّ اللَّهَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Beshak Kitaab, Beshak Allah (Zabar ـَ)</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'الْكِتَابُ ، اللَّهُ' par Inna (إِنَّ + ـَ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'إِنَّ الْكِتَابَ ، إِنَّ اللَّهَ' (Beshak Kitaab, Beshak Allah (Zabar ـَ)) banta hai",
        "Aakhir par pesh (ـُ) barqarar rehti hai: 'إِنَّ الْكِتَابُ'"
      ],
      "correct": 0,
      "explanation": "Inna (إِنَّ + ـَ) ke qaa'ide se 'الْكِتَابُ ، اللَّهُ' badal kar 'إِنَّ الْكِتَابَ ، إِنَّ اللَّهَ' (Beshak Kitaab, Beshak Allah (Zabar ـَ)) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "الْكِتَابُ ، اللَّهُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "إِنَّ الْكِتَابَ ، إِنَّ اللَّهَ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Inna (إِنَّ + ـَ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. إِنَّ + Ism (Zabar ـَ)",
        "description": "إِنَّ اللَّهَ / إِنَّ الْكِتَابَ / إِنَّ الْإِنْسَانَ: Beshak Allah / Beshak Kitaab / Beshak insaan"
      },
      {
        "title": "2. فَإِنَّ (Toh beshak)",
        "description": "فَإِنَّ اللَّهَ غَفُورٌ رَحِيمٌ: Pas beshak Allah bakhshne wala meherbaan hai"
      },
      {
        "title": "3. إِنَّ ... لَـ (Dohri Ta'keed)",
        "description": "إِنَّ هَٰذَا لَسَاحِرٌ / إِنَّ الْأَبْرَارَ لَفِي نَعِيمٍ: Beshak yeh yaqeenan jaadugar hai / Beshak nek log ne'mat mein hain"
      }
    ],
    "examples": [
      {
        "arabic": "إِنَّ اللَّهَ / إِنَّ الْكِتَابَ / إِنَّ الْإِنْسَانَ",
        "hinglish": "Beshak Allah / Beshak Kitaab / Beshak insaan"
      },
      {
        "arabic": "فَإِنَّ اللَّهَ غَفُورٌ رَحِيمٌ",
        "hinglish": "Pas beshak Allah bakhshne wala meherbaan hai"
      },
      {
        "arabic": "إِنَّ هَٰذَا لَسَاحِرٌ / إِنَّ الْأَبْرَارَ لَفِي نَعِيمٍ",
        "hinglish": "Beshak yeh yaqeenan jaadugar hai / Beshak nek log ne'mat mein hain"
      }
    ]
  },
  "s2l2": {
    "lessonKey": "s2l2",
    "title": "S2L2: Harf-e-Jarr 'Li' (Ke liye): الْكِتَابُ ← لِلْكِتَابِ",
    "badge": "Harf-e-Jarr (لِـ + ـِ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ ، اللَّهُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Kitaab, Allah</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Harf-e-Jarr (لِـ + ـِ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">لِلْكِتَابِ ، لِلَّهِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Kitaab ke liye, Allah ke liye</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'الْكِتَابُ ، اللَّهُ' par Harf-e-Jarr (لِـ + ـِ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'لِلْكِتَابِ ، لِلَّهِ' (Kitaab ke liye, Allah ke liye) banta hai",
        "Aakhir par zabar (ـَ) aati hai aur ma'na 'beshak' ho jaata hai"
      ],
      "correct": 0,
      "explanation": "Harf-e-Jarr (لِـ + ـِ) ke qaa'ide se 'الْكِتَابُ ، اللَّهُ' badal kar 'لِلْكِتَابِ ، لِلَّهِ' (Kitaab ke liye, Allah ke liye) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "الْكِتَابُ ، اللَّهُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "لِلْكِتَابِ ، لِلَّهِ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Harf-e-Jarr (لِـ + ـِ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. لِـ + الْـ (Alif gir jata hai)",
        "description": "لِلَّهِ / لِلْكِتَابِ / لِلنَّاسِ / لِلْمُتَّقِينَ: Allah ke liye / Kitaab ke liye / Logon ke liye / Parhezgaron ke liye"
      },
      {
        "title": "2. لِـ + Nakirah (Tanween Zair ـٍ)",
        "description": "لِقَوْمٍ / لِأُمَّةٍ / لِنَفْسٍ: Kisi qom ke liye / Ek ummat ke liye / Kisi jaan ke liye"
      },
      {
        "title": "3. وَلِلَّهِ / فَلِلَّهِ (Muqaddam = Hasr)",
        "description": "الْحَمْدُ لِلَّهِ / وَلِلَّهِ الْعِزَّةُ: Sab ta'reef Allah ke liye hai / Aur izzat sirf Allah ke liye hai"
      }
    ],
    "examples": [
      {
        "arabic": "لِلَّهِ / لِلْكِتَابِ / لِلنَّاسِ / لِلْمُتَّقِينَ",
        "hinglish": "Allah ke liye / Kitaab ke liye / Logon ke liye / Parhezgaron ke liye"
      },
      {
        "arabic": "لِقَوْمٍ / لِأُمَّةٍ / لِنَفْسٍ",
        "hinglish": "Kisi qom ke liye / Ek ummat ke liye / Kisi jaan ke liye"
      },
      {
        "arabic": "الْحَمْدُ لِلَّهِ / وَلِلَّهِ الْعِزَّةُ",
        "hinglish": "Sab ta'reef Allah ke liye hai / Aur izzat sirf Allah ke liye hai"
      }
    ]
  },
  "s2l3": {
    "lessonKey": "s2l3",
    "title": "S2L3: Harf-e-Jarr 'Fii' (Mein): الْكِتَابُ ← فِي الْكِتَابِ",
    "badge": "Harf-e-Jarr (فِي + ـِ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ ، الْأَرْضُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Kitaab, Zameen</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Harf-e-Jarr (فِي + ـِ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">فِي الْكِتَابِ ، فِي الْأَرْضِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Kitaab mein, Zameen mein</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'الْكِتَابُ ، الْأَرْضُ' par Harf-e-Jarr (فِي + ـِ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'فِي الْكِتَابِ ، فِي الْأَرْضِ' (Kitaab mein, Zameen mein) banta hai",
        "Aakhir par pesh (ـُ) aati hai aur ma'na 'par' ho jaata hai"
      ],
      "correct": 0,
      "explanation": "Harf-e-Jarr (فِي + ـِ) ke qaa'ide se 'الْكِتَابُ ، الْأَرْضُ' badal kar 'فِي الْكِتَابِ ، فِي الْأَرْضِ' (Kitaab mein, Zameen mein) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "الْكِتَابُ ، الْأَرْضُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "فِي الْكِتَابِ ، فِي الْأَرْضِ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Harf-e-Jarr (فِي + ـِ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. فِي + الْـ (Zair ـِ)",
        "description": "فِي الْكِتَابِ / فِي السَّمَاوَاتِ وَالْأَرْضِ: Kitaab mein / Aasmanon aur zameen mein"
      },
      {
        "title": "2. فِي + Nakirah (Do Zair ـٍ)",
        "description": "فِي كِتَابٍ / فِي ضَلَالٍ / فِي شَكٍّ: Ek kitaab mein / Kisi gumraahi mein / Kisi shak mein"
      },
      {
        "title": "3. لَفِي (Yaqeenan ... mein)",
        "description": "لَفِي خُسْرٍ / لَفِي نَعِيمٍ / لَفِي ضَلَالٍ مُبِينٍ: Yaqeenan khasaare mein / Yaqeenan ne'mat mein"
      }
    ],
    "examples": [
      {
        "arabic": "فِي الْكِتَابِ / فِي السَّمَاوَاتِ وَالْأَرْضِ",
        "hinglish": "Kitaab mein / Aasmanon aur zameen mein"
      },
      {
        "arabic": "فِي كِتَابٍ / فِي ضَلَالٍ / فِي شَكٍّ",
        "hinglish": "Ek kitaab mein / Kisi gumraahi mein / Kisi shak mein"
      },
      {
        "arabic": "لَفِي خُسْرٍ / لَفِي نَعِيمٍ / لَفِي ضَلَالٍ مُبِينٍ",
        "hinglish": "Yaqeenan khasaare mein / Yaqeenan ne'mat mein"
      }
    ]
  },
  "s2l4": {
    "lessonKey": "s2l4",
    "title": "S2L4: Harf-e-Jarr 'Alaa' (Par): الْكِتَابُ ← عَلَى الْكِتَابِ",
    "badge": "Harf-e-Jarr (عَلَىٰ + ـِ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ ، الْعَرْشُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Kitaab, Arsh</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Harf-e-Jarr (عَلَىٰ + ـِ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">عَلَى الْكِتَابِ ، عَلَى الْعَرْشِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Kitaab par, Arsh par</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'الْكِتَابُ ، الْعَرْشُ' par Harf-e-Jarr (عَلَىٰ + ـِ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'عَلَى الْكِتَابِ ، عَلَى الْعَرْشِ' (Kitaab par, Arsh par) banta hai",
        "Ma'na 'ke andar' hota hai aur ism ke aakhir par zabar aati hai"
      ],
      "correct": 0,
      "explanation": "Harf-e-Jarr (عَلَىٰ + ـِ) ke qaa'ide se 'الْكِتَابُ ، الْعَرْشُ' badal kar 'عَلَى الْكِتَابِ ، عَلَى الْعَرْشِ' (Kitaab par, Arsh par) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "الْكِتَابُ ، الْعَرْشُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "عَلَى الْكِتَابِ ، عَلَى الْعَرْشِ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Harf-e-Jarr (عَلَىٰ + ـِ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. عَلَىٰ + الْـ (Zair ـِ)",
        "description": "عَلَى الْكِتَابِ / عَلَى الْعَرْشِ / عَلَى النَّبِيِّ: Kitaab par / Arsh par / Nabi par"
      },
      {
        "title": "2. عَلَىٰ + Nakirah (Do Zair ـٍ)",
        "description": "عَلَىٰ هُدًى / عَلَىٰ بَيِّنَةٍ / عَلَىٰ صِرَاطٍ: Hidayat par / Roshan daleel par / Ek raaste par"
      },
      {
        "title": "3. لَعَلَىٰ (Yaqeenan ... par)",
        "description": "وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ: Aur beshak aap bade azeem akhlaaq par fa'iz hain"
      }
    ],
    "examples": [
      {
        "arabic": "عَلَى الْكِتَابِ / عَلَى الْعَرْشِ / عَلَى النَّبِيِّ",
        "hinglish": "Kitaab par / Arsh par / Nabi par"
      },
      {
        "arabic": "عَلَىٰ هُدًى / عَلَىٰ بَيِّنَةٍ / عَلَىٰ صِرَاطٍ",
        "hinglish": "Hidayat par / Roshan daleel par / Ek raaste par"
      },
      {
        "arabic": "وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ",
        "hinglish": "Aur beshak aap bade azeem akhlaaq par fa'iz hain"
      }
    ]
  },
  "s2l5": {
    "lessonKey": "s2l5",
    "title": "S2L5: Harf-e-Jarr 'Min' (Se): الْكِتَابُ ← مِنَ الْكِتَابِ",
    "badge": "Harf-e-Jarr (مِنْ + ـِ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ ، السَّمَاءُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Kitaab, Aasman</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Harf-e-Jarr (مِنْ + ـِ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">مِنَ الْكِتَابِ ، مِنَ السَّمَاءِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Kitaab se, Aasman se</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'الْكِتَابُ ، السَّمَاءُ' par Harf-e-Jarr (مِنْ + ـِ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'مِنَ الْكِتَابِ ، مِنَ السَّمَاءِ' (Kitaab se, Aasman se) banta hai",
        "Ma'na 'ki taraf' hota hai aur 'الْـ' hat jaata hai"
      ],
      "correct": 0,
      "explanation": "Harf-e-Jarr (مِنْ + ـِ) ke qaa'ide se 'الْكِتَابُ ، السَّمَاءُ' badal kar 'مِنَ الْكِتَابِ ، مِنَ السَّمَاءِ' (Kitaab se, Aasman se) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "الْكِتَابُ ، السَّمَاءُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "مِنَ الْكِتَابِ ، مِنَ السَّمَاءِ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Harf-e-Jarr (مِنْ + ـِ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. مِنَ + الْـ (Zair ـِ)",
        "description": "مِنَ الْكِتَابِ / مِنَ السَّمَاءِ / مِنَ النَّاسِ: Kitaab se / Aasman se / Logon mein se"
      },
      {
        "title": "2. مِنْ + Nakirah (Do Zair ـٍ)",
        "description": "مِنْ مَاءٍ / مِنْ طِينٍ / مِنْ عِلْمٍ: Paani se / Mitti se / Kisi ilm se"
      },
      {
        "title": "3. مِنْ ba'd Ism-ut-Tafzeel",
        "description": "وَالْفِتْنَةُ أَكْبَرُ مِنَ الْقَتْلِ: Aur fitna qatl se bada hai ('se' muwazane ke liye)"
      }
    ],
    "examples": [
      {
        "arabic": "مِنَ الْكِتَابِ / مِنَ السَّمَاءِ / مِنَ النَّاسِ",
        "hinglish": "Kitaab se / Aasman se / Logon mein se"
      },
      {
        "arabic": "مِنْ مَاءٍ / مِنْ طِينٍ / مِنْ عِلْمٍ",
        "hinglish": "Paani se / Mitti se / Kisi ilm se"
      },
      {
        "arabic": "وَالْفِتْنَةُ أَكْبَرُ مِنَ الْقَتْلِ",
        "hinglish": "Aur fitna qatl se bada hai ('se' muwazane ke liye)"
      }
    ]
  },
  "s2l6": {
    "lessonKey": "s2l6",
    "title": "S2L6: Harf-e-Jarr 'Ilaa' (Ki taraf / Tak): الْكِتَابُ ← إِلَى الْكِتَابِ",
    "badge": "Harf-e-Jarr (إِلَىٰ + ـِ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ ، الصِّرَاطُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Kitaab, Raasta</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Harf-e-Jarr (إِلَىٰ + ـِ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">إِلَى الْكِتَابِ ، إِلَى الصِّرَاطِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Kitaab ki taraf, Raaste ki taraf</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'الْكِتَابُ ، الصِّرَاطُ' par Harf-e-Jarr (إِلَىٰ + ـِ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'إِلَى الْكِتَابِ ، إِلَى الصِّرَاطِ' (Kitaab ki taraf, Raaste ki taraf) banta hai",
        "Ma'na 'se' hota hai aur ism par do pesh (ـٌ) lag jaati hai"
      ],
      "correct": 0,
      "explanation": "Harf-e-Jarr (إِلَىٰ + ـِ) ke qaa'ide se 'الْكِتَابُ ، الصِّرَاطُ' badal kar 'إِلَى الْكِتَابِ ، إِلَى الصِّرَاطِ' (Kitaab ki taraf, Raaste ki taraf) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "الْكِتَابُ ، الصِّرَاطُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "إِلَى الْكِتَابِ ، إِلَى الصِّرَاطِ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Harf-e-Jarr (إِلَىٰ + ـِ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. إِلَىٰ + الْـ (Zair ـِ)",
        "description": "إِلَى الْكِتَابِ / إِلَى اللَّهِ / إِلَى النُّورِ: Kitaab ki taraf / Allah ki taraf / Roshni ki taraf"
      },
      {
        "title": "2. إِلَىٰ + Nakirah (Do Zair ـٍ)",
        "description": "إِلَىٰ عَذَابٍ / إِلَىٰ صِرَاطٍ مُسْتَقِيمٍ: Ek azaab ki taraf / Seedhe raaste ki taraf"
      },
      {
        "title": "3. مِنْ ... إِلَىٰ ... (Se ... Tak)",
        "description": "مِنَ الظُّلُمَاتِ إِلَى النُّورِ / مِنَ السَّمَاءِ إِلَى الْأَرْضِ: Andheron se roshni ki taraf / Aasman se zameen tak"
      }
    ],
    "examples": [
      {
        "arabic": "إِلَى الْكِتَابِ / إِلَى اللَّهِ / إِلَى النُّورِ",
        "hinglish": "Kitaab ki taraf / Allah ki taraf / Roshni ki taraf"
      },
      {
        "arabic": "إِلَىٰ عَذَابٍ / إِلَىٰ صِرَاطٍ مُسْتَقِيمٍ",
        "hinglish": "Ek azaab ki taraf / Seedhe raaste ki taraf"
      },
      {
        "arabic": "مِنَ الظُّلُمَاتِ إِلَى النُّورِ / مِنَ السَّمَاءِ إِلَى الْأَرْضِ",
        "hinglish": "Andheron se roshni ki taraf / Aasman se zameen tak"
      }
    ]
  },
  "s2l7": {
    "lessonKey": "s2l7",
    "title": "S2L7: Harf-e-Jarr 'Bi' (Se / Ke saath / Par): الْكِتَابُ ← بِالْكِتَابِ",
    "badge": "Harf-e-Jarr (بِـ + ـِ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ ، الْحَقُّ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Kitaab, Haq</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Harf-e-Jarr (بِـ + ـِ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">بِالْكِتَابِ ، بِالْحَقِّ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Kitaab ke saath, Haq ke saath</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'الْكِتَابُ ، الْحَقُّ' par Harf-e-Jarr (بِـ + ـِ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'بِالْكِتَابِ ، بِالْحَقِّ' (Kitaab ke saath, Haq ke saath) banta hai",
        "Ism ke aakhir par zabar (ـَ) aati hai aur ma'na 'siwaaye' hota hai"
      ],
      "correct": 0,
      "explanation": "Harf-e-Jarr (بِـ + ـِ) ke qaa'ide se 'الْكِتَابُ ، الْحَقُّ' badal kar 'بِالْكِتَابِ ، بِالْحَقِّ' (Kitaab ke saath, Haq ke saath) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "الْكِتَابُ ، الْحَقُّ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "بِالْكِتَابِ ، بِالْحَقِّ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Harf-e-Jarr (بِـ + ـِ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. بِـ + الْـ (Zair ـِ)",
        "description": "بِالْكِتَابِ / بِالْحَقِّ / بِالْإِيمَانِ / بِالصَّبْرِ: Kitaab ke saath / Haq ke saath / Imaan ke saath / Sabr ke zariye"
      },
      {
        "title": "2. بِـ + Nakirah (Do Zair ـٍ)",
        "description": "بِسُلْطَانٍ / بِشَيْءٍ / بِغَيْرِ حِسَابٍ: Kisi daleel ke saath / Kisi cheez ke saath / Be-hisaab"
      },
      {
        "title": "3. بِـ (Ke badle mein)",
        "description": "النَّفْسَ بِالنَّفْسِ وَالْعَيْنَ بِالْعَيْنِ: Jaan ke badle jaan aur aankh ke badle aankh"
      }
    ],
    "examples": [
      {
        "arabic": "بِالْكِتَابِ / بِالْحَقِّ / بِالْإِيمَانِ / بِالصَّبْرِ",
        "hinglish": "Kitaab ke saath / Haq ke saath / Imaan ke saath / Sabr ke zariye"
      },
      {
        "arabic": "بِسُلْطَانٍ / بِشَيْءٍ / بِغَيْرِ حِسَابٍ",
        "hinglish": "Kisi daleel ke saath / Kisi cheez ke saath / Be-hisaab"
      },
      {
        "arabic": "النَّفْسَ بِالنَّفْسِ وَالْعَيْنَ بِالْعَيْنِ",
        "hinglish": "Jaan ke badle jaan aur aankh ke badle aankh"
      }
    ]
  },
  "s2l8": {
    "lessonKey": "s2l8",
    "title": "S2L8: Harf-e-Nafy-e-Jins 'Laa' (Koi ... nahin): كِتَابٌ ← لَا كِتَابَ",
    "badge": "Laa Nafy-e-Jins (لَا + ـَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">كِتَابٌ ، رَيْبٌ ، إِكْرَاهٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Ek kitaab, shak, zabardasti (ـٌ)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Laa Nafy-e-Jins (لَا + ـَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">لَا كِتَابَ ، لَا رَيْبَ ، لَا إِكْرَاهَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Koi kitaab nahin, koi shak nahin, koi zabardasti nahin (ـَ)</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'كِتَابٌ ، رَيْبٌ ، إِكْرَاهٌ' par Laa Nafy-e-Jins (لَا + ـَ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'لَا كِتَابَ ، لَا رَيْبَ ، لَا إِكْرَاهَ' (Koi kitaab nahin, koi shak nahin, koi zabardasti nahin (ـَ)) banta hai",
        "Tanween (ـٌ) barqarar rehti hai aur ma'na 'haan, ek kitaab hai' hota hai"
      ],
      "correct": 0,
      "explanation": "Laa Nafy-e-Jins (لَا + ـَ) ke qaa'ide se 'كِتَابٌ ، رَيْبٌ ، إِكْرَاهٌ' badal kar 'لَا كِتَابَ ، لَا رَيْبَ ، لَا إِكْرَاهَ' (Koi kitaab nahin, koi shak nahin, koi zabardasti nahin (ـَ)) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "كِتَابٌ ، رَيْبٌ ، إِكْرَاهٌ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "لَا كِتَابَ ، لَا رَيْبَ ، لَا إِكْرَاهَ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Laa Nafy-e-Jins (لَا + ـَ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. لَا + Ism (Ek Zabar ـَ)",
        "description": "لَا رَيْبَ / لَا إِكْرَاهَ / لَا خَوْفٌ / لَا ظُلْمَ: Koi shak nahin / Koi zabardasti nahin / Koi zulm nahin"
      },
      {
        "title": "2. فَلَا / وَلَا + Ism",
        "description": "فَلَا خَوْفٌ / وَلَا جِدَالَ فِي الْحَجِّ: Pas koi khauf nahin / Aur Hajj mein koi jhagda nahin"
      },
      {
        "title": "3. Qur'ani Qaanoon",
        "description": "لَا إِكْرَاهَ فِي الدِّينِ / ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ: Deen mein koi zabardasti nahin / Yeh woh Kitaab hai jismein koi shak nahin"
      }
    ],
    "examples": [
      {
        "arabic": "لَا رَيْبَ / لَا إِكْرَاهَ / لَا خَوْفٌ / لَا ظُلْمَ",
        "hinglish": "Koi shak nahin / Koi zabardasti nahin / Koi zulm nahin"
      },
      {
        "arabic": "فَلَا خَوْفٌ / وَلَا جِدَالَ فِي الْحَجِّ",
        "hinglish": "Pas koi khauf nahin / Aur Hajj mein koi jhagda nahin"
      },
      {
        "arabic": "لَا إِكْرَاهَ فِي الدِّينِ / ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ",
        "hinglish": "Deen mein koi zabardasti nahin / Yeh woh Kitaab hai jismein koi shak nahin"
      }
    ]
  },
  "s2l9": {
    "lessonKey": "s2l9",
    "title": "S2L9: Harf-e-Istisna 'Illaa' (Magar / Siwaaye): الْكِتَابُ ← إِلَّا الْكِتَابَ",
    "badge": "Istisna (إِلَّا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ ، قَلِيلٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Kitaab, Thode</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Istisna (إِلَّا))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">إِلَّا الْكِتَابَ ، إِلَّا قَلِيلًا</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Magar Kitaab, Magar thode</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'الْكِتَابُ ، قَلِيلٌ' par Istisna (إِلَّا) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'إِلَّا الْكِتَابَ ، إِلَّا قَلِيلًا' (Magar Kitaab, Magar thode) banta hai",
        "Iska ma'na 'aur' hota hai aur baad wala ism hamesha majroor rehta hai"
      ],
      "correct": 0,
      "explanation": "Istisna (إِلَّا) ke qaa'ide se 'الْكِتَابُ ، قَلِيلٌ' badal kar 'إِلَّا الْكِتَابَ ، إِلَّا قَلِيلًا' (Magar Kitaab, Magar thode) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "الْكِتَابُ ، قَلِيلٌ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "إِلَّا الْكِتَابَ ، إِلَّا قَلِيلًا (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Istisna (إِلَّا)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. إِلَّا + Ism (Siwaaye / Magar)",
        "description": "إِلَّا اللَّهُ / إِلَّا الْبَلَاغُ / إِلَّا قَلِيلًا: Siwaaye Allah ke / Siwaaye paigham pahunchane ke / Magar thode"
      },
      {
        "title": "2. لَا ... إِلَّا ... (Nafi + Istisna)",
        "description": "لَا إِلَٰهَ إِلَّا اللَّهُ / لَا قُوَّةَ إِلَّا بِاللَّهِ: Allah ke siwa koi ma'bood nahin / Allah ke baghair koi quwwat nahin"
      },
      {
        "title": "3. مَا / إِنْ ... إِلَّا ... (Sirf / Bas)",
        "description": "مَا هَٰذَا إِلَّا بَشَرٌ / إِنْ هُوَ إِلَّا وَحْيٌ: Yeh toh bas ek insaan hai / Woh toh sirf wahi hai"
      }
    ],
    "examples": [
      {
        "arabic": "إِلَّا اللَّهُ / إِلَّا الْبَلَاغُ / إِلَّا قَلِيلًا",
        "hinglish": "Siwaaye Allah ke / Siwaaye paigham pahunchane ke / Magar thode"
      },
      {
        "arabic": "لَا إِلَٰهَ إِلَّا اللَّهُ / لَا قُوَّةَ إِلَّا بِاللَّهِ",
        "hinglish": "Allah ke siwa koi ma'bood nahin / Allah ke baghair koi quwwat nahin"
      },
      {
        "arabic": "مَا هَٰذَا إِلَّا بَشَرٌ / إِنْ هُوَ إِلَّا وَحْيٌ",
        "hinglish": "Yeh toh bas ek insaan hai / Woh toh sirf wahi hai"
      }
    ]
  },
  "s2l10": {
    "lessonKey": "s2l10",
    "title": "S2L10: Waw-e-Qasam (Ki Qasam): الْكِتَابُ ← وَالْكِتَابِ ، وَالْعَصْرِ",
    "badge": "Waw-e-Qasam (وَ + ـِ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ ، الْعَصْرُ ، التِّينُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Kitaab, Zamana, Injeer (ـُ)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Waw-e-Qasam (وَ + ـِ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">وَالْكِتَابِ ، وَالْعَصْرِ ، وَالتِّينِ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Kitaab ki qasam, Zamane ki qasam, Injeer ki qasam (ـِ)</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'الْكِتَابُ ، الْعَصْرُ ، التِّينُ' par Waw-e-Qasam (وَ + ـِ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'وَالْكِتَابِ ، وَالْعَصْرِ ، وَالتِّينِ' (Kitaab ki qasam, Zamane ki qasam, Injeer ki qasam (ـِ)) banta hai",
        "Harf-e-'atf 'aur' ka ma'na deta hai aur aakhir par pesh aati hai"
      ],
      "correct": 0,
      "explanation": "Waw-e-Qasam (وَ + ـِ) ke qaa'ide se 'الْكِتَابُ ، الْعَصْرُ ، التِّينُ' badal kar 'وَالْكِتَابِ ، وَالْعَصْرِ ، وَالتِّينِ' (Kitaab ki qasam, Zamane ki qasam, Injeer ki qasam (ـِ)) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "الْكِتَابُ ، الْعَصْرُ ، التِّينُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "وَالْكِتَابِ ، وَالْعَصْرِ ، وَالتِّينِ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Waw-e-Qasam (وَ + ـِ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. وَ + الْـ (Qasam + Zair ـِ)",
        "description": "وَالْعَصْرِ / وَالْفَجْرِ / وَالشَّمْسِ / وَاللَّيْلِ: Zamane ki qasam / Fajr ki qasam / Sooraj ki qasam / Raat ki qasam"
      },
      {
        "title": "2. وَ + Nakirah (Do Zair ـٍ)",
        "description": "وَشَاهِدٍ وَمَشْهُودٍ / وَوَالِدٍ وَمَا وَلَدَ: Gawah aur haazri ke din ki qasam / Baap aur aulad ki qasam"
      },
      {
        "title": "3. Qasam + Jawaab-e-Qasam (إِنَّ...لَـ)",
        "description": "وَالْعَصْرِ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ: Zamane ki qasam! Beshak insaan yaqeenan khasaare mein hai"
      }
    ],
    "examples": [
      {
        "arabic": "وَالْعَصْرِ / وَالْفَجْرِ / وَالشَّمْسِ / وَاللَّيْلِ",
        "hinglish": "Zamane ki qasam / Fajr ki qasam / Sooraj ki qasam / Raat ki qasam"
      },
      {
        "arabic": "وَشَاهِدٍ وَمَشْهُودٍ / وَوَالِدٍ وَمَا وَلَدَ",
        "hinglish": "Gawah aur haazri ke din ki qasam / Baap aur aulad ki qasam"
      },
      {
        "arabic": "وَالْعَصْرِ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ",
        "hinglish": "Zamane ki qasam! Beshak insaan yaqeenan khasaare mein hai"
      }
    ]
  },
  "s2l11": {
    "lessonKey": "s2l11",
    "title": "S2L11: Harf 'Anna' (Ke): الْكِتَابُ ← أَنَّ الْكِتَابَ ، أَنَّ اللَّهَ",
    "badge": "Anna (أَنَّ + ـَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ ، اللَّهُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Kitaab, Allah (ـُ)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Anna (أَنَّ + ـَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">أَنَّ الْكِتَابَ ، أَنَّ اللَّهَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Ke Kitaab, Ke beshak Allah (ـَ)</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'الْكِتَابُ ، اللَّهُ' par Anna (أَنَّ + ـَ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'أَنَّ الْكِتَابَ ، أَنَّ اللَّهَ' (Ke Kitaab, Ke beshak Allah (ـَ)) banta hai",
        "Aakhir par zer (ـِ) aati hai aur ma'na 'kya' (sawaal) hota hai"
      ],
      "correct": 0,
      "explanation": "Anna (أَنَّ + ـَ) ke qaa'ide se 'الْكِتَابُ ، اللَّهُ' badal kar 'أَنَّ الْكِتَابَ ، أَنَّ اللَّهَ' (Ke Kitaab, Ke beshak Allah (ـَ)) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "الْكِتَابُ ، اللَّهُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "أَنَّ الْكِتَابَ ، أَنَّ اللَّهَ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Anna (أَنَّ + ـَ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. أَنَّ + Ism (Zabar ـَ)",
        "description": "أَنَّ اللَّهَ / أَنَّ الْقُوَّةَ / أَنَّ السَّاعَةَ: Ke Allah / Ke saari quwwat / Ke Qiyamat ki ghadi"
      },
      {
        "title": "2. بِأَنَّ (Is wajah se ke)",
        "description": "ذَٰلِكَ بِأَنَّ اللَّهَ هُوَ الْحَقُّ: Yeh is wajah se hai ke Allah hi Haq hai"
      },
      {
        "title": "3. Qur'ani Jumle",
        "description": "أَنَّ الْقُوَّةَ لِلَّهِ جَمِيعًا وَأَنَّ اللَّهَ شَدِيدُ الْعَذَابِ: Ke saari quwwat Allah hi ke liye hai aur yeh ke Allah sakht azaab dene wala hai"
      }
    ],
    "examples": [
      {
        "arabic": "أَنَّ اللَّهَ / أَنَّ الْقُوَّةَ / أَنَّ السَّاعَةَ",
        "hinglish": "Ke Allah / Ke saari quwwat / Ke Qiyamat ki ghadi"
      },
      {
        "arabic": "ذَٰلِكَ بِأَنَّ اللَّهَ هُوَ الْحَقُّ",
        "hinglish": "Yeh is wajah se hai ke Allah hi Haq hai"
      },
      {
        "arabic": "أَنَّ الْقُوَّةَ لِلَّهِ جَمِيعًا وَأَنَّ اللَّهَ شَدِيدُ الْعَذَابِ",
        "hinglish": "Ke saari quwwat Allah hi ke liye hai aur yeh ke Allah sakht azaab dene wala hai"
      }
    ]
  },
  "s2l12": {
    "lessonKey": "s2l12",
    "title": "S2L12: Fe'l Naaqis 'Kaana' (Tha / Hai): رَسُولٌ ← كَانَ رَسُولًا",
    "badge": "Kaana (كَانَ + ـًا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">رَسُولٌ ، غَفُورٌ رَحِيمٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Ek Rasool, Bakhshne wala (ـٌ)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Kaana (كَانَ + ـًا))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">كَانَ رَسُولًا ، وَكَانَ اللَّهُ غَفُورًا رَحِيمًا</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Woh ek Rasool tha, Aur Allah bakhshne wala hai (ـًا)</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'رَسُولٌ ، غَفُورٌ رَحِيمٌ' par Kaana (كَانَ + ـًا) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'كَانَ رَسُولًا ، وَكَانَ اللَّهُ غَفُورًا رَحِيمًا' (Woh ek Rasool tha, Aur Allah bakhshne wala hai (ـًا)) banta hai",
        "Khabar par pesh (ـٌ) rehti hai aur ma'na haal ya mustaqbil ka hota hai"
      ],
      "correct": 0,
      "explanation": "Kaana (كَانَ + ـًا) ke qaa'ide se 'رَسُولٌ ، غَفُورٌ رَحِيمٌ' badal kar 'كَانَ رَسُولًا ، وَكَانَ اللَّهُ غَفُورًا رَحِيمًا' (Woh ek Rasool tha, Aur Allah bakhshne wala hai (ـًا)) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "رَسُولٌ ، غَفُورٌ رَحِيمٌ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "كَانَ رَسُولًا ، وَكَانَ اللَّهُ غَفُورًا رَحِيمًا (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Kaana (كَانَ + ـًا)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. كَانَ + Khabar (Do Zabar ـًا)",
        "description": "كَانَ رَسُولًا / كَانَ صِدِّيقًا نَبِيًّا: Woh ek Rasool thay / Woh sachche Nabi thay"
      },
      {
        "title": "2. وَكَانَ اللَّهُ ... (Hamesha se hai)",
        "description": "وَكَانَ اللَّهُ غَفُورًا رَحِيمًا / عَلِيمًا حَكِيمًا: Aur Allah hamesha se bakhshne wala meherbaan hai"
      },
      {
        "title": "3. مَا كَانَ ... (Nahin tha)",
        "description": "مَا كَانَ إِبْرَاهِيمُ يَهُودِيًّا وَلَا نَصْرَانِيًّا: Ibrahim (A.S.) na Yahoodi thay aur na Nasrani"
      }
    ],
    "examples": [
      {
        "arabic": "كَانَ رَسُولًا / كَانَ صِدِّيقًا نَبِيًّا",
        "hinglish": "Woh ek Rasool thay / Woh sachche Nabi thay"
      },
      {
        "arabic": "وَكَانَ اللَّهُ غَفُورًا رَحِيمًا / عَلِيمًا حَكِيمًا",
        "hinglish": "Aur Allah hamesha se bakhshne wala meherbaan hai"
      },
      {
        "arabic": "مَا كَانَ إِبْرَاهِيمُ يَهُودِيًّا وَلَا نَصْرَانِيًّا",
        "hinglish": "Ibrahim (A.S.) na Yahoodi thay aur na Nasrani"
      }
    ]
  },
  "s2l13": {
    "lessonKey": "s2l13",
    "title": "S2L13: Harf-e-Nida 'Yaa' aur 'Yaa Ayyuha': آدَمُ ← يَا آدَمُ ، يَا أَيُّهَا النَّاسُ",
    "badge": "Nida (يَا / يَا أَيُّهَا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">آدَمُ ، النَّاسُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Adam, Log</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Nida (يَا / يَا أَيُّهَا))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">يَا آدَمُ ، يَا أَيُّهَا النَّاسُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Aye Adam!, Aye logo!</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'آدَمُ ، النَّاسُ' par Nida (يَا / يَا أَيُّهَا) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'يَا آدَمُ ، يَا أَيُّهَا النَّاسُ' (Aye Adam!, Aye logo!) banta hai",
        "Ism ke aakhir par do zer (ـٍ) aati hai aur pukarne ka ma'na nahin hota"
      ],
      "correct": 0,
      "explanation": "Nida (يَا / يَا أَيُّهَا) ke qaa'ide se 'آدَمُ ، النَّاسُ' badal kar 'يَا آدَمُ ، يَا أَيُّهَا النَّاسُ' (Aye Adam!, Aye logo!) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "آدَمُ ، النَّاسُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "يَا آدَمُ ، يَا أَيُّهَا النَّاسُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Nida (يَا / يَا أَيُّهَا)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. يَا + Naam (Ek Pesh ـُ)",
        "description": "يَا آدَمُ / يَا مُوسَىٰ / يَا مَرْيَمُ / يَا نُوحُ: Aye Adam! / Aye Musa! / Aye Maryam! / Aye Nuh!"
      },
      {
        "title": "2. يَا أَيُّهَا + الْـ (Muzakkar)",
        "description": "يَا أَيُّهَا النَّاسُ / يَا أَيُّهَا النَّبِيُّ / يَا أَيُّهَا الْمُزَّمِّلُ: Aye logo! / Aye Nabi! / Aye kapda lapetne wale!"
      },
      {
        "title": "3. يَا أَيَّتُهَا + الْـ (Mu'annas)",
        "description": "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ: Aye itminan paane wali jaan!"
      }
    ],
    "examples": [
      {
        "arabic": "يَا آدَمُ / يَا مُوسَىٰ / يَا مَرْيَمُ / يَا نُوحُ",
        "hinglish": "Aye Adam! / Aye Musa! / Aye Maryam! / Aye Nuh!"
      },
      {
        "arabic": "يَا أَيُّهَا النَّاسُ / يَا أَيُّهَا النَّبِيُّ / يَا أَيُّهَا الْمُزَّمِّلُ",
        "hinglish": "Aye logo! / Aye Nabi! / Aye kapda lapetne wale!"
      },
      {
        "arabic": "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ",
        "hinglish": "Aye itminan paane wali jaan!"
      }
    ]
  }
};

/**
 * Mount visual for a lesson in Unit 2.
 * @param {string | HTMLElement} containerId - Container DOM ID or element
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
    } catch (err) {
      console.warn('[Visual] Teardown error:', err);
    }
    _activeTeardown = null;
  }
}
