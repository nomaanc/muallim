// @ts-check
import { renderVisual } from './visual-helper.js';

/**
 * Muallim ul-Qur'an — Unit 6 Grammar Visuals Module (v7.0)
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
    "title": "S6L1: Aham Qur'ani Af'aal: Fe'l Muzare Wahid Ghaib",
    "badge": "Fe'l Muzare (يَفْعَلُ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">عَبَدَ / سَجَدَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Maazi / Masdar (Ibadat / Sajdah)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Fe'l Muzare (يَفْعَلُ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">يَعْبُدُ / يَسْجُدُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Fe'l Muzare (Woh ibadat / sajdah karta hai)</text>\n  </svg>",
    "prediction": {
      "question": "Jab bunyadi fe'l se Fe'l Muzare Wahid Ghaib (يَفْعَلُ) banta hai toh kya shakl banti hai?",
      "options": [
        "'يَعْبُدُ / يَسْجُدُ' (Woh karta hai / karega)",
        "Maazi hi rehta hai"
      ],
      "correct": 0,
      "explanation": "Shuru mein يَـ / يُـ aur aakhir par Pesh (ـُ) aane se Fe'l Muzare Wahid Ghaib banta hai (aur يَـ ko تَـ karne se Mu'annas Ghaib 'تَعْبُدُ' banta hai)."
    },
    "chips": [
      {
        "role": "root",
        "label": "عَبَدَ / سَجَدَ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "يَعْبُدُ / يَسْجُدُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Fe'l Muzare (يَفْعَلُ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Alamat-e-Muzare (يَـ / يُـ)",
        "description": "Fe'l ke shuru mein يَـ (Yaa) lagne se 'Woh (ek mard) karta hai ya karega' ka ma'na paida hota hai."
      },
      {
        "title": "2. Aakhiri Harf par Pesh (ـُ)",
        "description": "Aam halat (Marfoo') mein Fe'l Muzare ke aakhiri harf par Pesh (Dammah ـُ) aati hai: يَعْبُدُ ، يَسْجُدُ ، يَعْلَمُ."
      },
      {
        "title": "3. Muzakkar se Mu'annas (يَـ ← تَـ)",
        "description": "Shuru ki يَـ ko تَـ mein badalne se wohi fe'l Mu'annas Ghaib ke liye ban jaata hai: يَعْبُدُ ← تَعْبُدُ (Woh aurat ibadat karti hai)."
      }
    ],
    "examples": [
      {
        "arabic": "يَعْبُدُ ← تَعْبُدُ",
        "hinglish": "Woh (mard) ibadat karta hai ← Woh (aurat) ibadat karti hai"
      },
      {
        "arabic": "يَسْجُدُ / يَشْكُرُ",
        "hinglish": "Woh sajdah karta hai / Woh shukr ada karta hai"
      },
      {
        "arabic": "يُرْسِلُ / يُؤْمِنُ",
        "hinglish": "Woh bhejta hai / Woh imaan laata hai"
      }
    ]
  },
  "s6l2": {
    "lessonKey": "s6l2",
    "title": "S6L2: Qur'ani Af'aal se Pehle Aane Waale Aham Alfaaz",
    "badge": "Muzare + Alfaaz (لَا / الَّذِي / سَـ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">يُرْسِلُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Woh bhejta hai (Bunyadi Fe'l)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Muzare + Alfaaz (لَا / الَّذِي / سَـ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">لَا يُرْسِلُ / الَّذِي يُرْسِلُ / سَيُرْسِلُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Nahi bhejta / Jo bhejta hai / Anqareeb bhejega</text>\n  </svg>",
    "prediction": {
      "question": "Fe'l Muzare (يُرْسِلُ) ke shuru mein 'سَـ' ya 'سَوْفَ' lagne se ma'na mein kya tabdeeli aati hai?",
      "options": [
        "Fe'l Mustaqbil (Future: 'Anqareeb woh bhejega') ke liye makhsoos ho jaata hai",
        "Fe'l Maazi ban jaata hai"
      ],
      "correct": 0,
      "explanation": "Fe'l Muzare se pehle لَا (nahi), الَّذِي / مَنْ (jo), مَا (jo kuch / nahi / kya?), aur سَـ / سَوْفَ / يَوْمَ (mustaqbil) aane se ma'na mein wus'at paida hoti hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "يُرْسِلُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "لَا يُرْسِلُ / الَّذِي يُرْسِلُ / سَيُرْسِلُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Muzare + Alfaaz (لَا / الَّذِي / سَـ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Manfi Banana (لَا / مَا)",
        "description": "لَا يُرْسِلُ / مَا يُرْسِلُ = Woh nahi bhejta."
      },
      {
        "title": "2. Ism-e-Mawsool & Sawaal (الَّذِي / مَنْ / مَا)",
        "description": "الَّذِي يُرْسِلُ / مَنْ يُرْسِلُ = Jo bhejta hai (ya 'Kaun bhejta hai?')."
      },
      {
        "title": "3. Mustaqbil ke Alfaaz (سَـ / سَوْفَ / يَوْمَ / يَوْمَئِذٍ)",
        "description": "سَيُرْسِلُ / سَوْفَ يُرْسِلُ / يَوْمَ يُرْسِلُ = Anqareeb / Jis roz woh bhejega."
      }
    ],
    "examples": [
      {
        "arabic": "يُرْسِلُ ← لَا يُرْسِلُ",
        "hinglish": "Woh bhejta hai ← Woh nahi bhejta"
      },
      {
        "arabic": "الَّذِي يُكَذِّبُ / مَنْ يَغْفِرُ",
        "hinglish": "Woh jo jhutlaata hai / Kaun maaf karta hai?"
      },
      {
        "arabic": "سَيَعْلَمُ / يَوْمَ يَقُومُ",
        "hinglish": "Woh anqareeb jaan lega / Jis roz khada hoga"
      }
    ]
  },
  "s6l3": {
    "lessonKey": "s6l3",
    "title": "S6L3: Fe'l Muzare ke ba'd Faa'il aur Maf'ool ka Zikr",
    "badge": "Fe'l + Faa'il (ـُ) + Maf'ool (ـَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">يَغْفِرُ اللَّهُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Fe'l + Faa'il (Pesh ـُ): Allah maaf karta hai</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Fe'l + Faa'il (ـُ) + Maf'ool (ـَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">يَغْفِرُ اللَّهُ الذُّنُوبَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Fe'l + Faa'il + Maf'ool (Zabar ـَ): Allah gunaahon ko maaf karta hai</text>\n  </svg>",
    "prediction": {
      "question": "Jumla Fe'liyyah mein Faa'il (kaam karne waala) aur Maf'ool (jis par kaam ho) ki aakhiri harakat kya hoti hai?",
      "options": [
        "Faa'il par Pesh (ـُ / ـُونَ) aur Maf'ool par Zabar (ـَ) hoti hai",
        "Dono par Zer (ـِ) hoti hai"
      ],
      "correct": 0,
      "explanation": "Arbi mein Fe'l ke ba'd Faa'il Marfoo' (Pesh ـُ ya ـُونَ) aata hai aur Maf'ool Bihi Mansoob (Zabar ـَ) aata hai: يَغْفِرُ اللَّهُ الذُّنُوبَ."
    },
    "chips": [
      {
        "role": "root",
        "label": "يَغْفِرُ اللَّهُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "يَغْفِرُ اللَّهُ الذُّنُوبَ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Fe'l + Faa'il (ـُ) + Maf'ool (ـَ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Faa'il (Kaam Karne Waala: Pesh ـُ / ـُونَ)",
        "description": "يَغْفِرُ اللَّهُ (Allah maaf karta hai), يَقُولُ الْمُنَافِقُونَ (Munafiq kehte hain)."
      },
      {
        "title": "2. Faa'il Muqaddam (Taakeed ke liye)",
        "description": "Jab Faa'il fe'l se pehle aaye toh taakeed paida hoti hai: وَاللَّهُ يَعْلَمُ (Aur Allah hi jaanta hai)."
      },
      {
        "title": "3. Maf'ool Bihi (Jis par kaam ho: Zabar ـَ)",
        "description": "يَغْفِرُ اللَّهُ الذُّنُوبَ (Allah gunaahon ko maaf karta hai), يَضْرِبُ اللَّهُ الْأَمْثَالَ."
      }
    ],
    "examples": [
      {
        "arabic": "يَغْفِرُ اللَّهُ الذُّنُوبَ جَمِيعًا",
        "hinglish": "Allah saare gunaahon ko maaf farmata hai"
      },
      {
        "arabic": "يَضْرِبُ اللَّهُ الْأَمْثَالَ لِلنَّاسِ",
        "hinglish": "Allah logon ke liye misaalein bayaan farmata hai"
      },
      {
        "arabic": "وَاللَّهُ يَعْلَمُ مَا فِي قُلُوبِكُمْ",
        "hinglish": "Aur Allah jaanta hai jo kuch tumhare dilon mein hai"
      }
    ]
  },
  "s6l4": {
    "lessonKey": "s6l4",
    "title": "S6L4: Mashhoor Qur'ani Muhawarah: Man Yashaa'u & Maa Yashaa'u",
    "badge": "Man Yashaa'u (مَنْ يَشَاءُ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">يَشَاءُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Woh chahta hai</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Man Yashaa'u (مَنْ يَشَاءُ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">مَنْ يَشَاءُ / لِمَنْ يَشَاءُ / مَا يَشَاءُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jise woh chahta hai / Jiske liye / Jo woh chahta hai</text>\n  </svg>",
    "prediction": {
      "question": "'يَغْفِرُ لِمَنْ يَشَاءُ' mein 'لِمَنْ يَشَاءُ' ka kya matlab hai?",
      "options": [
        "'Jiske liye woh chahta hai'",
        "'Jo kuch woh chahta hai'"
      ],
      "correct": 0,
      "explanation": "مَنْ يَشَاءُ (jise woh chahta hai), لِمَنْ يَشَاءُ (jiske liye woh chahta hai), عَلَىٰ مَنْ يَشَاءُ (jis par woh chahta hai), aur مَا يَشَاءُ (jo kuch woh chahta hai) Qur'an ke aham tareen muhaware hain."
    },
    "chips": [
      {
        "role": "root",
        "label": "يَشَاءُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "مَنْ يَشَاءُ / لِمَنْ يَشَاءُ / مَا يَشَاءُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Man Yashaa'u (مَنْ يَشَاءُ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. مَنْ يَشَاءُ (Jise woh chahta hai)",
        "description": "يَهْدِي مَنْ يَشَاءُ = Woh jise chahta hai hidayat deta hai."
      },
      {
        "title": "2. لِمَنْ يَشَاءُ & عَلَىٰ مَنْ يَشَاءُ",
        "description": "يَغْفِرُ لِمَنْ يَشَاءُ (Jiske liye chahta hai bakhsh deta hai), يَتُوبُ اللَّهُ عَلَىٰ مَنْ يَشَاءُ (Jis par chahta hai tauba qubool farmata hai)."
      },
      {
        "title": "3. مَا يَشَاءُ (Jo kuch woh chahta hai)",
        "description": "يَفْعَلُ اللَّهُ مَا يَشَاءُ = Allah jo kuch chahta hai karta hai."
      }
    ],
    "examples": [
      {
        "arabic": "يَهْدِي اللَّهُ لِنُورِهِ مَنْ يَشَاءُ",
        "hinglish": "Allah apne noor ki taraf jise chahta hai hidayat deta hai"
      },
      {
        "arabic": "فَيَغْفِرُ لِمَنْ يَشَاءُ وَيُعَذِّبُ مَنْ يَشَاءُ",
        "hinglish": "Pas woh jise chahta hai bakhsh deta hai aur jise chahta hai azaab deta hai"
      },
      {
        "arabic": "وَيَتُوبُ اللَّهُ عَلَىٰ مَنْ يَشَاءُ",
        "hinglish": "Aur Allah jis par chahta hai apni rahmat ke saath rujoo' farmata hai"
      }
    ]
  },
  "s6l5": {
    "lessonKey": "s6l5",
    "title": "S6L5: Fe'l Muzare ke saath Maf'ool ki Zameer (Ya'murukum)",
    "badge": "Muzare + Zameer (ـكُمْ / ـهُمْ / ـهُ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">يَأْمُرُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Woh hukm deta hai (Fe'l + Faa'il)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Muzare + Zameer (ـكُمْ / ـهُمْ / ـهُ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">يَأْمُرُكُمْ / يَأْمُرُهُمْ / يَأْمُرُهُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Woh tumhein / unhein / usey hukm deta hai</text>\n  </svg>",
    "prediction": {
      "question": "Jab fe'l 'يَأْمُرُ' ke aakhir mein zameer 'ـكُمْ' judti hai ('يَأْمُرُكُمْ') toh yeh ek lafz kitni baatein batata hai?",
      "options": [
        "Teenon baatein: Kaam (hukm), Faa'il (woh), aur Maf'ool (tum logon ko)",
        "Sirf Faa'il batata hai"
      ],
      "correct": 0,
      "explanation": "Fe'l Muzare ke aakhir mein ـكُمْ ، ـهُمْ ، ـهُ ، ـكَ ، ـنَا ، ـهَا lagne se woh zameer Maf'ool Bihi (jis par kaam hua) ban jaati hai aur ek lafz mukammal jumla ban jaata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "يَأْمُرُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "يَأْمُرُكُمْ / يَأْمُرُهُمْ / يَأْمُرُهُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Muzare + Zameer (ـكُمْ / ـهُمْ / ـهُ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Mukhaatab Zameer (ـكَ / ـكُمْ)",
        "description": "يَأْمُرُكُمْ (Woh tumhein hukm deta hai), يَعْصِمُكَ (Woh aap ko bachata hai)."
      },
      {
        "title": "2. Ghaib Zameer (ـهُ / ـهَا / ـهُمْ)",
        "description": "يَأْمُرُهُمْ (Woh unhein hukm deta hai), يُعِيدُهُ (Woh usey dobara lautaata hai)."
      },
      {
        "title": "3. Mutakallim Zameer (ـنَا)",
        "description": "يَنْصُرُنَا (Woh hamari madad karta hai), يُعِيدُنَا (Woh humein lautaata hai)."
      }
    ],
    "examples": [
      {
        "arabic": "إِنَّ اللَّهَ يَأْمُرُكُمْ أَنْ تُؤَدُّوا الْأَمَانَاتِ",
        "hinglish": "Beshak Allah tumhein hukm deta hai ke tum amanatein ada karo"
      },
      {
        "arabic": "وَاللَّهُ يَعِدُكُمْ مَغْفِرَةً مِنْهُ وَفَضْلًا",
        "hinglish": "Aur Allah tum se apni taraf se maghfirat aur fazl ka wa'da farmata hai"
      },
      {
        "arabic": "يُصَوِّرُكُمْ فِي الْأَرْحَامِ كَيْفَ يَشَاءُ",
        "hinglish": "Woh maaon ke peton mein jis tarah chahta hai tumhari soorat banata hai"
      }
    ]
  },
  "s6l6": {
    "lessonKey": "s6l6",
    "title": "S6L6: Fe'l Muzare Jama Muzakkar Ghaib (Ya'budoona)",
    "badge": "Muzare Plural (يَفْعَلُونَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">يَعْبُدُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Woh (ek) ibadat karta hai</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Muzare Plural (يَفْعَلُونَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">يَعْبُدُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Woh (sab log) ibadat karte hain</text>\n  </svg>",
    "prediction": {
      "question": "Wahid Ghaib fe'l (يَعْبُدُ) ko Jama Muzakkar Ghaib banane ke liye aakhir mein kya lagaya jaata hai?",
      "options": [
        "'ـُونَ' (Waaw + Noon) lagaya jaata hai: يَعْبُدُونَ",
        "'ـَانِ' lagaya jaata hai"
      ],
      "correct": 0,
      "explanation": "Fe'l Muzare ke aakhir mein ـُونَ ke izaafe se Jama Muzakkar Ghaib ('Woh sab karte hain') ka seegha banta hai: يَعْبُدُ ← يَعْبُدُونَ."
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
        "label": "Muzare Plural (يَفْعَلُونَ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Aakhir mein ـُونَ ka Izaafa",
        "description": "يَعْبُدُ ← يَعْبُدُونَ (Woh log ibadat karte hain), يَعْلَمُ ← يَعْلَمُونَ (Woh log jaante hain)."
      },
      {
        "title": "2. Mu'tall Af'aal mein التبديلي",
        "description": "يَدْعُو ← يَدْعُونَ ، يَبْغِي ← يَبْغُونَ ، يَرَىٰ ← يَرَوْنَ."
      },
      {
        "title": "3. Haal aur Mustaqbil Dono Ma'ani",
        "description": "يُؤْمِنُونَ = Woh imaan laate hain / laayenge."
      }
    ],
    "examples": [
      {
        "arabic": "يُؤْمِنُونَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ",
        "hinglish": "Woh Allah par aur aakhirat ke din par imaan laate hain"
      },
      {
        "arabic": "وَيَرْجُونَ رَحْمَتَهُ وَيَخَافُونَ عَذَابَهُ",
        "hinglish": "Aur woh uski rahmat ki ummeed rakhte hain aur uske azaab se darte hain"
      },
      {
        "arabic": "يَعْلَمُونَ ظَاهِرًا مِنَ الْحَيَاةِ الدُّنْيَا",
        "hinglish": "Woh dunyawi zindagi ka sirf zaahiri pehlu jaante hain"
      }
    ]
  },
  "s6l7": {
    "lessonKey": "s6l7",
    "title": "S6L7: Seegha Ya'budoona ke saath Mashhoor Qur'ani Muhaware",
    "badge": "5 Muhaware (يَعْلَمُونَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">يَعْلَمُونَ / يَعْقِلُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Woh jaante hain / samajhte hain</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (5 Muhaware (يَعْلَمُونَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">أَكْثَرُهُمْ لَا... / لِقَوْمٍ... / لَعَلَّهُمْ... / أَفَلَا...</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Aksar nahi... / Qaum ke liye / Taake woh / Toh kya nahi?</text>\n  </svg>",
    "prediction": {
      "question": "'إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِقَوْمٍ يَعْقِلُونَ' mein 'لِقَوْمٍ يَعْقِلُونَ' ka kya matlab hai?",
      "options": [
        "'Uss qaum ke liye jo aql se kaam lete hain'",
        "'Kyunki woh samajhte nahi'"
      ],
      "correct": 0,
      "explanation": "Seegha يَعْلَمُونَ ke saath 5 mashhoor muhaware aate hain: (1) أَكْثَرُ النَّاسِ لَا..., (2) لِقَوْمٍ..., (3) لَعَلَّهُمْ..., (4) أَفَلَا..., (5) ذَٰلِكَ بِأَنَّهُمْ قَوْمٌ لَا..."
    },
    "chips": [
      {
        "role": "root",
        "label": "يَعْلَمُونَ / يَعْقِلُونَ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "أَكْثَرُهُمْ لَا... / لِقَوْمٍ... / لَعَلَّهُمْ... / أَفَلَا... (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "5 Muhaware (يَعْلَمُونَ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. أَكْثَرُ النَّاسِ لَا... & لِقَوْمٍ...",
        "description": "وَلَٰكِنَّ أَكْثَرَ النَّاسِ لَا يَعْلَمُونَ (Lekin aksar log nahi jaante), لِقَوْمٍ يَعْقِلُونَ (Aql waali qaum ke liye)."
      },
      {
        "title": "2. لَعَلَّهُمْ... & أَفَلَا...",
        "description": "لَعَلَّهُمْ يَتَّقُونَ (Taake woh bach jaayein), أَفَلَا يَتَدَبَّرُونَ (Toh kya woh ghaur nahi karte?)."
      },
      {
        "title": "3. ذَٰلِكَ بِأَنَّهُمْ قَوْمٌ لَا...",
        "description": "ذَٰلِكَ بِأَنَّهُمْ قَوْمٌ لَا يَفْقَهُونَ (Yeh iss liye hai kyunki woh aisi qaum hain jo samajhte nahi)."
      }
    ],
    "examples": [
      {
        "arabic": "وَلَٰكِنَّ أَكْثَرَ النَّاسِ لَا يَشْكُرُونَ",
        "hinglish": "Lekin aksar log shukr ada nahi karte"
      },
      {
        "arabic": "كَذَٰلِكَ يُبَيِّنُ اللَّهُ آيَاتِهِ لِلنَّاسِ لَعَلَّهُمْ يَتَّقُونَ",
        "hinglish": "Isi tarah Allah logon ke liye apni aayatein bayaan karta hai taake woh taqwa ikhtiyar karein"
      },
      {
        "arabic": "أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ",
        "hinglish": "Toh kya woh Qur'an mein ghaur-o-tadabbur nahi karte?"
      }
    ]
  },
  "s6l8": {
    "lessonKey": "s6l8",
    "title": "S6L8: Ism-e-Mawsool 'Allazeena' Fe'l Muzare ke saath",
    "badge": "Allazeena + Muzare (الَّذِينَ يُؤْمِنُونَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">يُؤْمِنُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Woh imaan laate hain</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Allazeena + Muzare (الَّذِينَ يُؤْمِنُونَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">الَّذِينَ يُؤْمِنُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jo log imaan laate hain</text>\n  </svg>",
    "prediction": {
      "question": "Jama Ghaib fe'l (يُؤْمِنُونَ) se pehle 'الَّذِينَ' lagne se kya ma'na banta hai?",
      "options": [
        "'Jo log imaan laate hain' (Ism-e-Mawsool Jama)",
        "'Tum log imaan laate ho'"
      ],
      "correct": 0,
      "explanation": "الَّذِينَ + Fe'l Muzare Jama se Qur'an mein momineen ki sifaat (الَّذِينَ يُؤْمِنُونَ / يُقِيمُونَ الصَّلَاةَ) aur munharif logon ke a'maal (الَّذِينَ يَظْلِمُونَ) bayaan hote hain."
    },
    "chips": [
      {
        "role": "root",
        "label": "يُؤْمِنُونَ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "الَّذِينَ يُؤْمِنُونَ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Allazeena + Muzare (الَّذِينَ يُؤْمِنُونَ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. الَّذِينَ (Jo log) + Fe'l Jama",
        "description": "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ = Jo log bin dekhe imaan laate hain."
      },
      {
        "title": "2. Momineen ki Sifaat",
        "description": "الَّذِينَ يُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنْفِقُونَ."
      },
      {
        "title": "3. Munharif Logon ke A'maal",
        "description": "الَّذِينَ يَظْلِمُونَ ، الَّذِينَ يَصُدُّونَ عَنْ سَبِيلِ اللَّهِ."
      }
    ],
    "examples": [
      {
        "arabic": "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ",
        "hinglish": "Jo log bin dekhe imaan laate hain aur namaz qaayim karte hain"
      },
      {
        "arabic": "الَّذِينَ يَذْكُرُونَ اللَّهَ قِيَامًا وَقُعُودًا",
        "hinglish": "Jo log khade aur baithe Allah ko yaad karte hain"
      },
      {
        "arabic": "إِنَّ الَّذِينَ يَضِلُّونَ عَنْ سَبِيلِ اللَّهِ لَهُمْ عَذَابٌ شَدِيدٌ",
        "hinglish": "Beshak jo log Allah ki raah se bhatakte hain unke liye sakht azaab hai"
      }
    ]
  },
  "s6l9": {
    "lessonKey": "s6l9",
    "title": "S6L9: Fe'l Muzare Wahid Muzakkar Mukhaatab (Ta'budu)",
    "badge": "Muzare Mukhaatab (تَفْعَلُ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">يَعْبُدُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Woh ibadat karta hai (Ghaib)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Muzare Mukhaatab (تَفْعَلُ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">تَعْبُدُ / تَرَىٰ / لَا تَجِدُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Tu (Aap) ibadat karte ho / dekhte ho / nahi paate</text>\n  </svg>",
    "prediction": {
      "question": "Fe'l Muzare 'يَعْبُدُ' ke shuru ki 'يَـ' ko 'تَـ' mein badalne ('تَعْبُدُ') se Mukhaatab mein kya ma'na banta hai?",
      "options": [
        "'Tu / Aap ibadat karte ho' (Wahid Muzakkar Mukhaatab)",
        "'Main ibadat karta hoon'"
      ],
      "correct": 0,
      "explanation": "Saamne maujood ek shakhs (Wahid Mukhaatab) se khitaab ke liye يَـ ko تَـ se badalte hain: يَعْبُدُ ← تَعْبُدُ, يَرَىٰ ← تَرَىٰ (aur وَلَوْ تَرَىٰ = kaash ke tu dekh le!)."
    },
    "chips": [
      {
        "role": "root",
        "label": "يَعْبُدُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "تَعْبُدُ / تَرَىٰ / لَا تَجِدُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Muzare Mukhaatab (تَفْعَلُ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. يَـ ko تَـ se Badalna",
        "description": "يَعْبُدُ ← تَعْبُدُ (Tu ibadat karta hai), يَعْلَمُ ← تَعْلَمُ (Tu jaanta hai)."
      },
      {
        "title": "2. تَرَىٰ aur وَلَوْ تَرَىٰ",
        "description": "تَرَىٰ = Tu dekhta hai; وَلَوْ تَرَىٰ = Aur kaash ke tu dekh le!"
      },
      {
        "title": "3. إِنَّكَ لَتَهْدِي aur لَا تَجِدُ / فَلَنْ تَجِدَ",
        "description": "Beshak aap zaroor hidayat dete hain; Aap hargiz koi tabdeeli nahi paayenge."
      }
    ],
    "examples": [
      {
        "arabic": "تُؤْتِي الْمُلْكَ مَنْ تَشَاءُ وَتَنْزِعُ الْمُلْكَ مِمَّنْ تَشَاءُ",
        "hinglish": "Tu jise chahta hai badshahi deta hai aur jis se chahta hai badshahi chheen leta hai"
      },
      {
        "arabic": "وَلَوْ تَرَىٰ إِذِ الظَّالِمُونَ مَوْقُوفُونَ عِنْدَ رَبِّهِمْ",
        "hinglish": "Aur kaash ke aap dekh lein jab zaalim apne Rabb ke paas khade kiye jayenge"
      },
      {
        "arabic": "فَلَنْ تَجِدَ لِسُنَّتِ اللَّهِ تَبْدِيلًا",
        "hinglish": "Pas aap Allah ki sunnat (tareeqe) mein hargiz koi tabdeeli nahi paayenge"
      }
    ]
  },
  "s6l10": {
    "lessonKey": "s6l10",
    "title": "S6L10: Fe'l Muzare Jama Muzakkar Mukhaatab (Ta'budoona)",
    "badge": "Mukhatab Plural (تَفْعَلُونَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">تَعْبُدُ / تَعْمَلُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Tu ibadat / amal karta hai</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Mukhatab Plural (تَفْعَلُونَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">تَعْبُدُونَ / بِمَا تَعْمَلُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Tum sab ibadat karte ho / Uss se jo tum karte ho</text>\n  </svg>",
    "prediction": {
      "question": "'وَاللَّهُ بِمَا تَعْمَلُونَ خَبِيرٌ' mein 'بِمَا تَعْمَلُونَ' ka kya tarjuma hai?",
      "options": [
        "'Uss se jo kuch tum log karte ho'",
        "'Uss se jo woh log karte hain'"
      ],
      "correct": 0,
      "explanation": "تَعْبُدُ ke aakhir mein ـُونَ lagane se Jama Mukhaatab (تَعْبُدُونَ: tum log ibadat karte ho) banta hai, aur مَا / بِمَا / مِمَّا / عَمَّا ke saath ba-kasrat aata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "تَعْبُدُ / تَعْمَلُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "تَعْبُدُونَ / بِمَا تَعْمَلُونَ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Mukhatab Plural (تَفْعَلُونَ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. تَـ...ـُونَ (Tum sab karte ho)",
        "description": "تَعْبُدُ ← تَعْبُدُونَ ، تَعْلَمُ ← تَعْلَمُونَ ، تَشْكُرُ ← تَشْكُرُونَ."
      },
      {
        "title": "2. مَا تَعْمَلُونَ & بِمَا تَعْمَلُونَ",
        "description": "Jo kuch tum karte ho / Uss ki wajah se jo tum karte ho."
      },
      {
        "title": "3. مِمَّا (مِنْ + مَا) & عَمَّا (عَنْ + مَا)",
        "description": "مِمَّا تَأْكُلُونَ (Uss mein se jo tum khate ho), عَمَّا تَعْمَلُونَ (Uss se jo tum karte ho)."
      }
    ],
    "examples": [
      {
        "arabic": "وَاللَّهُ بِمَا تَعْمَلُونَ بَصِيرٌ",
        "hinglish": "Aur Allah jo kuch tum log karte ho usey khoob dekhne waala hai"
      },
      {
        "arabic": "وَمَا رَبُّكَ بِغَافِلٍ عَمَّا تَعْمَلُونَ",
        "hinglish": "Aur aap ka Rabb uss se be-khabar nahi jo tum log karte ho"
      },
      {
        "arabic": "كَلَّا سَوْفَ تَعْلَمُونَ",
        "hinglish": "Hargiz nahi! Anqareeb tum log jaan loge"
      }
    ]
  },
  "s6l11": {
    "lessonKey": "s6l11",
    "title": "S6L11: Seegha Ta'budoona ke saath Mashhoor Qur'ani Muhaware",
    "badge": "7 Muhaware (تَعْمَلُونَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">تَعْمَلُونَ / تَعْلَمُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Tum log karte ho / jaante ho</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (7 Muhaware (تَعْمَلُونَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">وَأَنْتُمْ... / لَعَلَّكُمْ... / كُنْتُمْ... / مَا لَكُمْ لَا...</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jabke tum / Taake tum / Tum karte the / Tumhein kya hua?</text>\n  </svg>",
    "prediction": {
      "question": "'بِمَا كُنْتُمْ تَعْمَلُونَ' mein 'كُنْتُمْ تَعْمَلُونَ' kis zamane ko zaahir karta hai?",
      "options": [
        "Maazi Istimraari ('Jo tum log kiya karte the')",
        "Mustaqbil ('Jo tum karoge')"
      ],
      "correct": 0,
      "explanation": "Seegha تَعْمَلُونَ ke saath 7 mashhoor Qur'ani muhaware aate hain: وَأَنْتُمْ ، لَعَلَّكُمْ ، أَفَلَا ، كُنْتُمْ ، مَا لَكُمْ لَا ، لِمَ ، لَوْلَا."
    },
    "chips": [
      {
        "role": "root",
        "label": "تَعْمَلُونَ / تَعْلَمُونَ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "وَأَنْتُمْ... / لَعَلَّكُمْ... / كُنْتُمْ... / مَا لَكُمْ لَا... (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "7 Muhaware (تَعْمَلُونَ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. وَأَنْتُمْ تَعْلَمُونَ & لَعَلَّكُمْ تَتَّقُونَ",
        "description": "Haalanke tum jaante ho / Taake tum parhezgar ban jao."
      },
      {
        "title": "2. أَفَلَا تَعْقِلُونَ & كُنْتُمْ تَعْمَلُونَ",
        "description": "Toh kya tum samajhte nahi? / Jo kuch tum kiya karte the."
      },
      {
        "title": "3. مَا لَكُمْ لَا... ، لِمَ... ، لَوْلَا...",
        "description": "Tumhein kya hua ke imaan nahi laate? / Tum kyun kehte ho? / Tum maafi kyun nahi maangte?"
      }
    ],
    "examples": [
      {
        "arabic": "كُلُوا وَاشْرَبُوا هَنِيئًا بِمَا كُنْتُمْ تَعْمَلُونَ",
        "hinglish": "Khush-gawaari se khao aur piyo uss ke badle jo tum neik a'maal kiya karte the"
      },
      {
        "arabic": "وَمَا لَكُمْ لَا تُؤْمِنُونَ بِاللَّهِ",
        "hinglish": "Aur tumhein kya hua hai ke tum Allah par imaan nahi laate?"
      },
      {
        "arabic": "لِمَ تَقُولُونَ مَا لَا تَفْعَلُونَ",
        "hinglish": "Tum woh baat kyun kehte ho jo khud karte nahi?"
      }
    ]
  },
  "s6l12": {
    "lessonKey": "s6l12",
    "title": "S6L12: Fe'l Muzare Wahid Mutakallim (A'budu & Uqsimu)",
    "badge": "Muzare Mutakallim (أَفْعَلُ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">يَعْبُدُ / يُقْسِمُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Woh ibadat karta hai / qasam khata hai</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Muzare Mutakallim (أَفْعَلُ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">أَعْبُدُ / لَا أُقْسِمُ / أَدْعُوكُمْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Main ibadat karta hoon / qasam khata hoon / tumhein bulata hoon</text>\n  </svg>",
    "prediction": {
      "question": "Fe'l Muzare 'يَعْبُدُ' ke shuru ki 'يَـ' ko Hamzah ('أَ') se badalne ('أَعْبُدُ') se kya ma'na banta hai?",
      "options": [
        "'Main ibadat karta hoon' (Wahid Mutakallim)",
        "'Hum ibadat karte hain'"
      ],
      "correct": 0,
      "explanation": "Shuru mein أَ / أُ (Hamzah) lagne se Wahid Mutakallim ('Main...') banta hai: أَعْبُدُ (Main ibadat karta hoon), أُقْسِمُ (Main qasam khata hoon), أَدْعُوكُمْ (Main tumhein bulata hoon)."
    },
    "chips": [
      {
        "role": "root",
        "label": "يَعْبُدُ / يُقْسِمُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "أَعْبُدُ / لَا أُقْسِمُ / أَدْعُوكُمْ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Muzare Mutakallim (أَفْعَلُ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. يَـ ko أَ / أُ se Badalna",
        "description": "يَعْبُدُ ← أَعْبُدُ (Main ibadat karta hoon), يَسْتَغْفِرُ ← أَسْتَغْفِرُ (Main maafi maangta hoon)."
      },
      {
        "title": "2. لَا أُقْسِمُ بِـ (Qasam ka Usloob)",
        "description": "لَا أُقْسِمُ بِيَوْمِ الْقِيَامَةِ = Nahi! Main qasam khata hoon Qayamat ke din ki."
      },
      {
        "title": "3. أَدْعُوكُمْ / أَسْأَلُكُمْ (+ Zameer)",
        "description": "Main tumhein bulata hoon / Main tum se maangta hoon."
      }
    ],
    "examples": [
      {
        "arabic": "قُلْ يَا أَيُّهَا الْكَافِرُونَ / لَا أَعْبُدُ مَا تَعْبُدُونَ",
        "hinglish": "Keh dijiye: Ae kaafiro! Main uski ibadat nahi karta jiski tum ibadat karte ho"
      },
      {
        "arabic": "لَا أُقْسِمُ بِيَوْمِ الْقِيَامَةِ",
        "hinglish": "Nahi! Main qasam khata hoon Qayamat ke din ki"
      },
      {
        "arabic": "أُبَلِّغُكُمْ رِسَالَاتِ رَبِّي وَأَنْصَحُ لَكُمْ",
        "hinglish": "Main tumhein apne Rabb ke paighamaat pahunchata hoon aur tumhari khair-khwahi karta hoon"
      }
    ]
  },
  "s6l13": {
    "lessonKey": "s6l13",
    "title": "S6L13: Fe'l Muzare Jama Mutakallim (Na'budu & Kazaalika Najzee)",
    "badge": "Muzare Mutakallim (نَفْعَلُ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">يَعْبُدُ / يَجْزِي</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Woh ibadat karta hai / badla deta hai</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Muzare Mutakallim (نَفْعَلُ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">نَعْبُدُ / كَذَٰلِكَ نَجْزِي / نَحْشُرُهُمْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Hum ibadat karte hain / Isi tarah badla dete hain / unhein ikattha karenge</text>\n  </svg>",
    "prediction": {
      "question": "Fe'l Muzare ke shuru mein 'نَـ / نُـ' (Noon) aane ('نَعْبُدُ / نَسْتَعِينُ') se kya ma'na banta hai?",
      "options": [
        "'Hum ibadat karte hain / Hum madad maangte hain' (Jama Mutakallim)",
        "'Woh ibadat karte hain'"
      ],
      "correct": 0,
      "explanation": "Shuru mein نَـ / نُـ aane se Jama Mutakallim ('Hum...') banta hai: نَعْبُدُ, كَذَٰلِكَ نَجْزِي (isi tarah hum badla dete hain), يَوْمَ نَدْعُو (jis roz hum bulayenge), إِنَّا نَعْلَمُ, aur نَحْشُرُهُمْ."
    },
    "chips": [
      {
        "role": "root",
        "label": "يَعْبُدُ / يَجْزِي (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "نَعْبُدُ / كَذَٰلِكَ نَجْزِي / نَحْشُرُهُمْ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Muzare Mutakallim (نَفْعَلُ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. يَـ ko نَـ / نُـ se Badalna",
        "description": "يَعْبُدُ ← نَعْبُدُ (Hum ibadat karte hain), يَسْتَعِينُ ← نَسْتَعِينُ (Hum madad maangte hain)."
      },
      {
        "title": "2. كَذَٰلِكَ نَجْزِي & يَوْمَ نَدْعُو",
        "description": "Isi tarah hum badla dete hain / Jis roz hum har giroh ko bulayenge."
      },
      {
        "title": "3. إِنَّا نَعْلَمُ ، لَنْ نَصْبِرَ ، نَحْشُرُهُمْ",
        "description": "Beshak hum jaante hain / Hum hargiz sabr nahi karenge / Hum unhein ikattha karenge."
      }
    ],
    "examples": [
      {
        "arabic": "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        "hinglish": "Hum teri hi ibadat karte hain aur tujh hi se madad maangte hain"
      },
      {
        "arabic": "كَذَٰلِكَ نَجْزِي الْمُحْسِنِينَ",
        "hinglish": "Isi tarah hum neiki karne waalon ko badla dete hain"
      },
      {
        "arabic": "يَوْمَ نَدْعُو كُلَّ أُنَاسٍ بِإِمَامِهِمْ",
        "hinglish": "Jis roz hum har giroh ko unke peshwa ke saath bulayenge"
      }
    ]
  },
  "s6l14": {
    "lessonKey": "s6l14",
    "title": "S6L14: Fe'l Nahi Jama Muzakkar (Laa Taqtuloo)",
    "badge": "Fe'l Nahi Jama (لَا تَفْعَلُوا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">تَقْتُلُونَ / تَظْلِمُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Tum log qatl karte ho / zulm karte ho</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Fe'l Nahi Jama (لَا تَفْعَلُوا))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">لَا تَقْتُلُوا / لَا تَظْلِمُوا</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Tum log qatl mat karo! / zulm mat karo!</text>\n  </svg>",
    "prediction": {
      "question": "Jama Mukhaatab fe'l (تَقْتُلُونَ) se Fe'l Nahi (mana karne ka seegha) kaise banta hai?",
      "options": [
        "Shuru mein 'لَا' lagakar aakhiri 'نَ' ko 'ا' (Alif) se badal dete hain: لَا تَقْتُلُوا",
        "Sirf لَا lagate hain aur نَ baqi rehta hai"
      ],
      "correct": 0,
      "explanation": "Bahut se logon ko kisi kaam se mana karne ke liye تَفْعَلُونَ ke shuru mein لَا lagate hain aur aakhiri نَ gira kar الف likhte hain: تَقْتُلُونَ ← لَا تَقْتُلُوا."
    },
    "chips": [
      {
        "role": "root",
        "label": "تَقْتُلُونَ / تَظْلِمُونَ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "لَا تَقْتُلُوا / لَا تَظْلِمُوا (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Fe'l Nahi Jama (لَا تَفْعَلُوا)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Shuru mein لَا النَّاهِيَة (Mat)",
        "description": "Mana karne ke liye fe'l ke shuru mein لَا lagaya jaata hai."
      },
      {
        "title": "2. Aakhiri نَ Gira kar الف (ـُوا)",
        "description": "تَقْتُلُونَ ← لَا تَقْتُلُوا ، تَظْلِمُونَ ← لَا تَظْلِمُوا ، تُشْرِكُونَ ← لَا تُشْرِكُوا."
      },
      {
        "title": "3. Qur'ani Ahkaam-e-Nahi",
        "description": "لَا تَقْرَبُوا الزِّنَا ، لَا تَأْكُلُوا أَمْوَالَكُمْ ، لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ."
      }
    ],
    "examples": [
      {
        "arabic": "وَلَا تَقْتُلُوا أَوْلَادَكُمْ خَشْيَةَ إِمْلَاقٍ",
        "hinglish": "Aur muflisi ke dar se apni aulaad ko qatl mat karo"
      },
      {
        "arabic": "وَلَا تُفْسِدُوا فِي الْأَرْضِ بَعْدَ إِصْلَاحِهَا",
        "hinglish": "Aur zameen mein uski islaah ke ba'd fasaad mat phailao"
      },
      {
        "arabic": "لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ",
        "hinglish": "Allah ki rahmat se mayoos (na-ummeed) mat ho"
      }
    ]
  },
  "s6l15": {
    "lessonKey": "s6l15",
    "title": "S6L15: Fe'l Nahi Wahid Muzakkar (Laa Tazlim & Laa Takhaf)",
    "badge": "Fe'l Nahi Wahid (لَا تَفْعَلْ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">تَظْلِمُ / تَدْعُو / تَخَافُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Tu zulm karta hai / pukarta hai / darta hai</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Fe'l Nahi Wahid (لَا تَفْعَلْ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">لَا تَظْلِمْ / لَا تَدْعُ / لَا تَخَفْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Tu zulm mat kar! / Mat pukar! / Mat dar!</text>\n  </svg>",
    "prediction": {
      "question": "Wahid fe'l (تَظْلِمُ / تَقُولُ) ke shuru mein mana karne ke liye 'لَا' aaye toh aakhir mein kya tabdeeli hoti hai?",
      "options": [
        "Pesh (ـُ) badal kar Jazm (ـْ) ho jaati hai aur harf-e-'illat (و/ي/ا) gir jaata hai: لَا تَظْلِمْ / لَا تَقُلْ",
        "Aakhir par Zabar (ـَ) aa jaati hai"
      ],
      "correct": 0,
      "explanation": "Ek shakhs ko mana karne ke liye تَفْعَلُ se pehle لَا aata hai aur aakhir par Jazm (ـْ) aati hai (لَا تَظْلِمْ), aur kamzor harf و/ي/ا gir jaata hai (لَا تَدْعُ ، لَا تَخَفْ ، لَا تَقُلْ)."
    },
    "chips": [
      {
        "role": "root",
        "label": "تَظْلِمُ / تَدْعُو / تَخَافُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "لَا تَظْلِمْ / لَا تَدْعُ / لَا تَخَفْ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Fe'l Nahi Wahid (لَا تَفْعَلْ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Saheeh Fe'l par Jazm (ـْ)",
        "description": "تَظْلِمُ ← لَا تَظْلِمْ (Zulm mat kar!), تَحْزَنُ ← لَا تَحْزَنْ (Gham mat kar!)."
      },
      {
        "title": "2. Aakhiri و / ي ka Girna",
        "description": "تَدْعُو ← لَا تَدْعُ (Mat pukar!), تَمْشِي ← لَا تَمْشِ (Mat chal!)."
      },
      {
        "title": "3. Darmiyani و / ي / ا ka Girna",
        "description": "تَخَافُ ← لَا تَخَفْ (Mat dar!), تَكُونُ ← لَا تَكُنْ (Mat ban!), تَقُولُ ← لَا تَقُلْ (Mat keh!)."
      }
    ],
    "examples": [
      {
        "arabic": "لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا",
        "hinglish": "Gham mat kar, beshak Allah hamare saath hai"
      },
      {
        "arabic": "يَا بُنَيَّ لَا تُشْرِكْ بِاللَّهِ",
        "hinglish": "Ae mere pyare bete! Allah ke saath shirk mat karna"
      },
      {
        "arabic": "فَلَا تَقُلْ لَهُمَا أُفٍّ وَلَا تَنْهَرْهُمَا",
        "hinglish": "Pas un dono (walidain) ko 'uff' tak mat kehna aur na unhein jhidakna"
      }
    ]
  },
  "s6l16": {
    "lessonKey": "s6l16",
    "title": "S6L16: Man Shartiyyah (Jazm) aur Lan Naasibah (Nasb)",
    "badge": "Shart (مَنْ يَفْعَلْ) & Lan (لَنْ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">يَشْكُرُ / يَجْعَلُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Woh shukr karta hai / banata hai</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Shart (مَنْ يَفْعَلْ) & Lan (لَنْ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">مَنْ يَشْكُرْ فَـ... / لَنْ يَجْعَلَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jo shukr karega toh... / Woh hargiz nahi banayega</text>\n  </svg>",
    "prediction": {
      "question": "Shart ke liye 'مَنْ' aane ('مَنْ يَتَوَكَّلْ') aur nafi ke liye 'لَنْ' aane ('لَنْ يَجْعَلَ') se fe'l ke aakhir par kya aata hai?",
      "options": [
        "'مَنْ' se Jazm (ـْ) aata hai aur 'لَنْ' se Zabar (ـَ / ـُوا) aata hai",
        "Dono mein Pesh (ـُ) rehta hai"
      ],
      "correct": 0,
      "explanation": "مَنْ الشَّرْطِيَّة fe'l ko Jazm (ـْ) deta hai aur Jawaab-e-Shart par فَـ aata hai (مَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ), jabke لَنْ mustaqbil ki pur-zor nafi ('hargiz nahi') ke saath Nasb (ـَ / ـُوا) deta hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "يَشْكُرُ / يَجْعَلُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "مَنْ يَشْكُرْ فَـ... / لَنْ يَجْعَلَ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Shart (مَنْ يَفْعَلْ) & Lan (لَنْ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. مَنْ الشَّرْطِيَّة + Jazm (ـْ)",
        "description": "يَشْكُرُ ← مَنْ يَشْكُرْ (Jo shukr karega...), يَتَّقِي ← مَنْ يَتَّقِ (Jo taqwa ikhtiyar karega...)."
      },
      {
        "title": "2. Jawaab-e-Shart par فَـ (Toh)",
        "description": "وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ (Aur jo Allah par bharosa kare toh woh uske liye kaafi hai)."
      },
      {
        "title": "3. لَنْ النَّاصِبَة (Hargiz Nahi)",
        "description": "لَنْ يَجْعَلَ (Hargiz nahi banayega), لَنْ تَنَالُوا الْبِرَّ (Tum hargiz bhalai nahi paoge)."
      }
    ],
    "examples": [
      {
        "arabic": "وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
        "hinglish": "Aur jo Allah par tawakkul kare toh woh uske liye kaafi hai"
      },
      {
        "arabic": "وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا",
        "hinglish": "Aur jo Allah se darega woh uske liye nikalne ka raasta bana dega"
      },
      {
        "arabic": "لَنْ تَنَالُوا الْبِرَّ حَتَّىٰ تُنْفِقُوا مِمَّا تُحِبُّونَ",
        "hinglish": "Tum hargiz neki (bhalai) nahi paa sakte jab tak un cheezon mein se kharch na karo jin se tum muhabbat karte ho"
      }
    ]
  },
  "s6l17": {
    "lessonKey": "s6l17",
    "title": "S6L17: Harf-e-Nasb 'An': An Yatooba & 'Asaa An",
    "badge": "An Naasibah (أَنْ يَفْعَلَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">يَتُوبُ / يَغْفِرُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Woh tauba karta hai / maaf karta hai</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (An Naasibah (أَنْ يَفْعَلَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">أَنْ يَتُوبَ / عَسَىٰ أَنْ يَغْفِرَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Ke woh tauba kare / Ummeed hai ke woh maaf kare</text>\n  </svg>",
    "prediction": {
      "question": "Fe'l Muzare (يَتُوبُ / تَصُومُونَ) se pehle 'أَنْ' (ke) aane se fe'l mein kya tabdeeli hoti hai?",
      "options": [
        "Wahid ke aakhir par Zabar (أَنْ يَتُوبَ) aur Jama mein نَ gir kar الف (أَنْ تَصُومُوا) aata hai",
        "Fe'l par Jazm (ـْ) aata hai"
      ],
      "correct": 0,
      "explanation": "Harf-e-Nasb أَنْ (ke) fe'l muzare ko Mansoob karta hai (أَنْ يَتُوبَ / أَنْ تَصُومُوا) aur عَسَىٰ أَنْ (ummeed hai ke) tatha مَا كَانَ لِـ... أَنْ (munasib na tha ke) mein ba-kasrat aata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "يَتُوبُ / يَغْفِرُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "أَنْ يَتُوبَ / عَسَىٰ أَنْ يَغْفِرَ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "An Naasibah (أَنْ يَفْعَلَ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. أَنْ + Wahid Fe'l (Zabar ـَ)",
        "description": "يَتُوبُ ← أَنْ يَتُوبَ (Ke woh tauba kare), يَغْفِرُ ← أَنْ يَغْفِرَ (Ke woh maaf kare)."
      },
      {
        "title": "2. أَنْ + Jama Fe'l (نَ ka Girna)",
        "description": "تَصُومُونَ ← أَنْ تَصُومُوا خَيْرٌ لَكُمْ (Aur tumhara roza rakhna tumhare liye behtar hai)."
      },
      {
        "title": "3. عَسَىٰ أَنْ & مَا كَانَ لِـ... أَنْ",
        "description": "عَسَىٰ رَبُّكُمْ أَنْ يَرْحَمَكُمْ (Ummeed hai ke tumhara Rabb tum par raham farmaye)."
      }
    ],
    "examples": [
      {
        "arabic": "وَاللَّهُ يُرِيدُ أَنْ يَتُوبَ عَلَيْكُمْ",
        "hinglish": "Aur Allah chahta hai ke tum par rahmat ke saath tawajjuh (tauba qubool) farmaye"
      },
      {
        "arabic": "وَأَنْ تَصُومُوا خَيْرٌ لَكُمْ إِنْ كُنْتُمْ تَعْلَمُونَ",
        "hinglish": "Aur tumhara roza rakhna tumhare haq mein behtar hai agar tum jaante ho"
      },
      {
        "arabic": "مَا كَانَ لِلَّهِ أَنْ يَتَّخِذَ مِنْ وَلَدٍ",
        "hinglish": "Allah ki shaan ke laaiq nahi ke woh kisi ko beta banaye"
      }
    ]
  },
  "s6l18": {
    "lessonKey": "s6l18",
    "title": "S6L18: Laam-ut-Ta'leel 'Li': Li-yaghfira & Li-ya'lamoo",
    "badge": "Laam Ta'leel (لِيَفْعَلَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">يَغْفِرُ / يَعْلَمُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Woh maaf karta hai / Woh jaante hain</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Laam Ta'leel (لِيَفْعَلَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">لِيَغْفِرَ / لِيَعْلَمُوا</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Taake woh maaf kare / Taake woh jaan lein</text>\n  </svg>",
    "prediction": {
      "question": "Fe'l Muzare ke shuru mein maqsad batane waala 'لِـ' (Taake) lagne se kya asar hota hai?",
      "options": [
        "Wahid par Zabar (لِيَغْفِرَ) aur Jama mein نَ gir kar الف (لِيَعْلَمُوا) aa jaata hai",
        "Fe'l Maazi ban jaata hai"
      ],
      "correct": 0,
      "explanation": "Laam-ut-Ta'leel (لِـ = Taake / Iss liye ke) fe'l muzare ke aakhir par Zabar (ـَ) laata hai aur jama mein ـُونَ ka نَ gira kar ـُوا kar deta hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "يَغْفِرُ / يَعْلَمُونَ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "لِيَغْفِرَ / لِيَعْلَمُوا (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Laam Ta'leel (لِيَفْعَلَ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. لِـ (Taake) + Wahid Fe'l",
        "description": "يَغْفِرُ ← لِيَغْفِرَ (Taake woh maaf kare), يَبْلُو ← لِيَبْلُوَكُمْ (Taake woh tumhein aazmaye)."
      },
      {
        "title": "2. لِـ + Mutakallim / Mukhaatab",
        "description": "لِنُبَيِّنَ (Taake hum bayaan karein), لِتَعْلَمَ (Taake tu jaan le)."
      },
      {
        "title": "3. لِـ + Jama Fe'l (ـُوا)",
        "description": "لِيَعْلَمُوا (Taake woh jaan lein), لِتَشْكُرُوا (Taake tum shukr ada karo)."
      }
    ],
    "examples": [
      {
        "arabic": "لِيَغْفِرَ لَكَ اللَّهُ مَا تَقَدَّمَ مِنْ ذَنْبِكَ وَمَا تَأَخَّرَ",
        "hinglish": "Taake Allah aap ke liye aap ki agle aur pichhle tamaam kotahiyan maaf farma de"
      },
      {
        "arabic": "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا",
        "hinglish": "Jisne maut aur zindagi ko paida kiya taake woh tumhein aazmaye ke tum mein a'maal ke lihaaz se kaun behtar hai"
      },
      {
        "arabic": "كَذَٰلِكَ يُبَيِّنُ اللَّهُ لَكُمُ الْآيَاتِ لَعَلَّكُمْ تَتَفَكَّرُونَ",
        "hinglish": "Isi tarah Allah tumhare liye aayatein khol kar bayaan farmata hai"
      }
    ]
  },
  "s6l19": {
    "lessonKey": "s6l19",
    "title": "S6L19: Harf-e-Jazm 'Lam': Lam Yaj'al, Alam Ya'lam & Lam Yakun",
    "badge": "Lam Jaazimah (لَمْ يَفْعَلْ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">يَجْعَلُ / يَعْلَمُ / يَكُونُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Woh banata hai / jaanta hai / hota hai</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Lam Jaazimah (لَمْ يَفْعَلْ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">لَمْ يَجْعَلْ / أَلَمْ يَعْلَمْ / لَمْ يَكُنْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Usne nahi banaya / Kya usne nahi jaana? / Woh nahi tha</text>\n  </svg>",
    "prediction": {
      "question": "Fe'l Muzare se pehle 'لَمْ' aane ('لَمْ يَلِدْ / لَمْ يَجْعَلْ') se uske zamane (tense) aur i'raab par kya asar padta hai?",
      "options": [
        "Ma'na Maazi Manfi ('Usne nahi kiya') ho jaata hai aur aakhir par Jazm (ـْ) aata hai",
        "Ma'na Mustaqbil ho jaata hai"
      ],
      "correct": 0,
      "explanation": "لَمْ fe'l muzare ke ma'na ko Maazi Manfi ('Usne nahi kiya') mein badal deta hai aur aakhir par Jazm (ـْ) deta hai (لَمْ يَجْعَلْ ، أَلَمْ تَرَ ، لَمْ يَكُنْ)."
    },
    "chips": [
      {
        "role": "root",
        "label": "يَجْعَلُ / يَعْلَمُ / يَكُونُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "لَمْ يَجْعَلْ / أَلَمْ يَعْلَمْ / لَمْ يَكُنْ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Lam Jaazimah (لَمْ يَفْعَلْ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. لَمْ + Fe'l Muzare = Maazi Manfi",
        "description": "يَلِدُ ← لَمْ يَلِدْ (Usne kisi ko nahi jana), يَجْعَلُ ← لَمْ يَجْعَلْ (Usne nahi banaya)."
      },
      {
        "title": "2. أَلَمْ (Kya nahi...?) & مَنْ لَمْ (Jisne nahi...)",
        "description": "أَلَمْ نَشْرَحْ (Kya hum ne nahi khol diya?), مَنْ لَمْ يَحْكُمْ (Aur jisne faisla na kiya)."
      },
      {
        "title": "3. Mu'tall Fe'l mein Harf-e-'Illat ka Girna",
        "description": "يَكُونُ ← لَمْ يَكُنْ ، تَرَىٰ ← أَلَمْ تَرَ ، يَسْتَطِيعُ ← لَمْ يَسْتَطِعْ."
      }
    ],
    "examples": [
      {
        "arabic": "لَمْ يَلِدْ وَلَمْ يُولَدْ / وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
        "hinglish": "Na usne kisi ko jana aur na woh jana gaya, aur na koi uska hamsar hai"
      },
      {
        "arabic": "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ",
        "hinglish": "Kya aap ne nahi dekha ke aap ke Rabb ne haathi waalon ke saath kya kiya?"
      },
      {
        "arabic": "أَلَمْ يَعْلَمْ بِأَنَّ اللَّهَ يَرَىٰ",
        "hinglish": "Kya woh nahi jaanta ke beshak Allah dekh raha hai?"
      }
    ]
  },
  "s6l20": {
    "lessonKey": "s6l20",
    "title": "S6L20: Fe'l Muzare Jama ke saath Maf'ool ki Zameerein",
    "badge": "Jama + Zameer (يَسْأَلُونَكَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">يَسْأَلُونَ / تَخْلُقُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Woh poochhte hain / Tum paida karte ho</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Jama + Zameer (يَسْأَلُونَكَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">يَسْأَلُونَكَ / يَنْصُرُونَهُمْ / تَخْلُقُونَهُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Woh aap se poochhte hain / unki madad karte hain / tum usey paida karte ho</text>\n  </svg>",
    "prediction": {
      "question": "'يَسْأَلُونَكَ عَنِ الرُّوحِ' mein 'يَسْأَلُونَكَ' kin teen ajzaa se mil kar bana hai?",
      "options": [
        "Fe'l (يَسْأَلُ) + Faa'il Jama (ـُونَ: woh log) + Maf'ool Zameer (ـكَ: aap se)",
        "Sirf Fe'l aur Faa'il se"
      ],
      "correct": 0,
      "explanation": "Jama Ghaib (يَسْأَلُونَ) aur Jama Mukhaatab (تَخْلُقُونَ) ke aakhir mein ـكَ ، ـكُمْ ، ـهُ ، ـهُمْ ، ـهَا ، ـنَا ، ـنِي jud kar mukammal jumla banate hain."
    },
    "chips": [
      {
        "role": "root",
        "label": "يَسْأَلُونَ / تَخْلُقُونَ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "يَسْأَلُونَكَ / يَنْصُرُونَهُمْ / تَخْلُقُونَهُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Jama + Zameer (يَسْأَلُونَكَ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. يَفْعَلُونَ + ـكَ / ـكُمْ",
        "description": "يَسْأَلُونَكَ (Woh aap se poochhte hain), يُقَاتِلُونَكُمْ (Woh tum se ladte hain)."
      },
      {
        "title": "2. يَفْعَلُونَ + ـهُ / ـهَا / ـهُمْ",
        "description": "يَنْصُرُونَهُ (Woh uski madad karte hain), يَعْرِفُونَهَا (Woh usko pehchante hain), يُخْرِجُونَهُمْ (Woh unhein nikaalte hain)."
      },
      {
        "title": "3. تَفْعَلُونَ + ـهُ / ـهُمْ / ـنَا",
        "description": "تَخْلُقُونَهُ (Tum usey paida karte ho), تُحِبُّونَهُمْ (Tum un se muhabbat karte ho), تَنْصُرُونَنَا (Tum hamari madad karte ho)."
      }
    ],
    "examples": [
      {
        "arabic": "وَيَسْأَلُونَكَ عَنِ الرُّوحِ / قُلِ الرُّوحُ مِنْ أَمْرِ رَبِّي",
        "hinglish": "Aur woh aap se rooh ke baare mein poochhte hain; keh dijiye: Rooh mere Rabb ke hukm se hai"
      },
      {
        "arabic": "يَعْرِفُونَ نِعْمَتَ اللَّهِ ثُمَّ يُنْكِرُونَهَا",
        "hinglish": "Woh Allah ki ne'mat ko pehchante hain phir uska inkaar karte hain"
      },
      {
        "arabic": "أَأَنْتُمْ تَخْلُقُونَهُ أَمْ نَحْنُ الْخَالِقُونَ",
        "hinglish": "Kya tum usko paida karte ho ya hum hi paida karne waale hain?"
      }
    ]
  },
  "s6l21": {
    "lessonKey": "s6l21",
    "title": "S6L21: Fe'l Ma'roof se Fe'l Majhool (Yurzaqu, Yurzaqoona, Turja'oona)",
    "badge": "Fe'l Majhool (يُفْعَلُ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"var(--border-subtle)\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"var(--ink-secondary)\" text-anchor=\"middle\">ASAL (Bunyadi Seegha)</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"28\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-root\">يَرْزُقُ / تَرْجِعُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Ma'roof: Woh rizq deta hai / Tum lautte ho</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:var(--bg-surface-elevated); border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"var(--bg-surface)\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Fe'l Majhool (يُفْعَلُ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"var(--font-arabic)\" font-size=\"26\" fill=\"var(--ink-primary)\" text-anchor=\"middle\" class=\"v-suffix\">يُرْزَقُ / يُرْزَقُونَ / تُرْجَعُونَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Majhool: Usey / Unhein rizq diya jaata hai / Tum lautaye jaoge</text>\n  </svg>",
    "prediction": {
      "question": "Fe'l Muzare Ma'roof (يَرْزُقُ / يَنْصُرُ) ko Fe'l Majhool (Passive) banane ke liye harakaat mein kya tabdeeli hoti hai?",
      "options": [
        "Pehle harf par Pesh (يُـ / تُـ) aur aakhir se pehle harf par Zabar (ـَ) aata hai: يُرْزَقُ / يُنْصَرُ",
        "Pehle harf par Zer (ـِ) aata hai"
      ],
      "correct": 0,
      "explanation": "Fe'l Muzare ke shuru mein Pesh (يُـ / تُـ) aur aakhir se pehle waale harf par Zabar (ـَ) lagane se Fe'l Majhool (Passive Voice) banta hai: يَرْزُقُ ← يُرْزَقُ ، يُرْزَقُونَ ، تُرْجَعُونَ."
    },
    "chips": [
      {
        "role": "root",
        "label": "يَرْزُقُ / تَرْجِعُونَ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "يُرْزَقُ / يُرْزَقُونَ / تُرْجَعُونَ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Fe'l Majhool (يُفْعَلُ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Wahid Majhool (يُـ...ـَ)",
        "description": "يَنْصُرُ ← يُنْصَرُ (Uski madad ki jaati hai), يَرْزُقُ ← يُرْزَقُ (Usko rizq diya jaata hai), يُقْبَلُ (Qubool kiya jaata hai)."
      },
      {
        "title": "2. Jama Ghaib Majhool (يُـ...ـُونَ)",
        "description": "يُرْزَقُونَ (Unhein rizq diya jaata hai), يُحْشَرُونَ (Woh jama kiye jayenge), لَا يُنْصَرُونَ (Unki madad nahi ki jayegi)."
      },
      {
        "title": "3. Jama Mukhaatab Majhool (تُـ...ـُونَ)",
        "description": "تُرْجَعُونَ (Tum lautaye jaoge), لَا تُظْلَمُونَ (Tum par zulm nahi kiya jayega), تُسْأَلُونَ (Tum se poochha jayega)."
      }
    ],
    "examples": [
      {
        "arabic": "بَلْ أَحْيَاءٌ عِنْدَ رَبِّهِمْ يُرْزَقُونَ",
        "hinglish": "Balke woh apne Rabb ke paas zinda hain, unhein rizq diya jaata hai"
      },
      {
        "arabic": "وَاتَّقُوا يَوْمًا تُرْجَعُونَ فِيهِ إِلَى اللَّهِ",
        "hinglish": "Aur uss din se daro jis mein tum Allah ki taraf lautaye jaoge"
      },
      {
        "arabic": "وَمَا تُنْفِقُوا مِنْ خَيْرٍ يُوَفَّ إِلَيْكُمْ وَأَنْتُمْ لَا تُظْلَمُونَ",
        "hinglish": "Aur tum jo kuch bhalai mein kharch karoge woh tumhein poora-poora milega aur tum par zulm nahi kiya jayega"
      }
    ]
  }
};

/**
 * Mount visual for a lesson in Unit 6.
 * @param {string | HTMLElement} containerId - Container DOM ID or element
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
    } catch (err) {
      console.warn('[Visual] Teardown error:', err);
    }
    _activeTeardown = null;
  }
}
