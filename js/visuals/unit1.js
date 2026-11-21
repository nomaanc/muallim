// @ts-check
import { renderVisual } from './visual-helper.js';

/**
 * Muallim ul-Qur'an — Unit 1 Grammar Visuals Module (v2.0)
 * Aligned 100% with the official Unit 1 Table of Contents (Book Pages 14–50).
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
    "title": "S1L1: Aasaan Qur'ani Alfaaz (Set 1 — Ma'rifah الْـ ki Pehchaan)",
    "badge": "Al-Ma'rifah (الْـ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">إِسْلَامٌ ، قُرْآنٌ ، إِيمَانٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Islam, Qur'an, Imaan</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Al-Ma'rifah (الْـ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">الْإِسْلَامُ ، الْقُرْآنُ ، الْإِيمَانُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Al-Islam, Al-Qur'an, Al-Imaan (Khaas Ism)</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'إِسْلَامٌ ، قُرْآنٌ ، إِيمَانٌ' par Al-Ma'rifah (الْـ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'الْإِسْلَامُ ، الْقُرْآنُ ، الْإِيمَانُ' (Al-Islam, Al-Qur'an, Al-Imaan (Khaas Ism)) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Al-Ma'rifah (الْـ) ke qaa'ide se 'إِسْلَامٌ ، قُرْآنٌ ، إِيمَانٌ' badal kar 'الْإِسْلَامُ ، الْقُرْآنُ ، الْإِيمَانُ' (Al-Islam, Al-Qur'an, Al-Imaan (Khaas Ism)) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "إِسْلَامٌ ، قُرْآنٌ ، إِيمَانٌ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "الْإِسْلَامُ ، الْقُرْآنُ ، الْإِيمَانُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Al-Ma'rifah (الْـ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. الْـ + Ism (Khaas Naam)",
        "description": "الْإِسْلَامُ / الْقُرْآنُ / الْإِيمَانُ / الْحَقُّ — Islam / Qur'an / Imaan / Sach (Haq)"
      },
      {
        "title": "2. Deeni Istilahaat",
        "description": "الْحَلَالُ / الْحَرَامُ / الصِّرَاطُ / الْحِسَابُ — Halaal / Haraam / Raasta / Hisaab"
      },
      {
        "title": "3. Kaa'inaat ke Alfaaz",
        "description": "السَّمَاءُ / الْأَرْضُ / الشَّمْسُ / الْقَمَرُ — Aasman / Zameen / Sooraj / Chaand"
      }
    ],
    "examples": [
      {
        "arabic": "الْإِسْلَامُ / الْقُرْآنُ / الْإِيمَانُ / الْحَقُّ",
        "hinglish": "Islam / Qur'an / Imaan / Sach (Haq)"
      },
      {
        "arabic": "الْحَلَالُ / الْحَرَامُ / الصِّرَاطُ / الْحِسَابُ",
        "hinglish": "Halaal / Haraam / Raasta / Hisaab"
      },
      {
        "arabic": "السَّمَاءُ / الْأَرْضُ / الشَّمْسُ / الْقَمَرُ",
        "hinglish": "Aasman / Zameen / Sooraj / Chaand"
      }
    ]
  },
  "s1l2": {
    "lessonKey": "s1l2",
    "title": "S1L2: Mazeed Aasaan Qur'ani Alfaaz (Set 2 — Gol Taa ة Mu'annas)",
    "badge": "Taa Marbootah (ة)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْجَوَابُ ، الصَّلَاةُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Jawab, Namaz</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Taa Marbootah (ة))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">الصَّلَاةُ ، الزَّكَاةُ ، الْقِيَامَةُ ، الْجَنَّةُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Namaz, Zakat, Qiyamat, Jannat (Gol ة = Mu'annas)</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'الْجَوَابُ ، الصَّلَاةُ' par Taa Marbootah (ة) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'الصَّلَاةُ ، الزَّكَاةُ ، الْقِيَامَةُ ، الْجَنَّةُ' (Namaz, Zakat, Qiyamat, Jannat (Gol ة = Mu'annas)) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Taa Marbootah (ة) ke qaa'ide se 'الْجَوَابُ ، الصَّلَاةُ' badal kar 'الصَّلَاةُ ، الزَّكَاةُ ، الْقِيَامَةُ ، الْجَنَّةُ' (Namaz, Zakat, Qiyamat, Jannat (Gol ة = Mu'annas)) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "الْجَوَابُ ، الصَّلَاةُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "الصَّلَاةُ ، الزَّكَاةُ ، الْقِيَامَةُ ، الْجَنَّةُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Taa Marbootah (ة)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Muzakkar Alfaaz",
        "description": "الْجَوَابُ / السُّؤَالُ / الثَّوَابُ / الْعَذَابُ — Jawab / Sawaal / Sawab / Azaab"
      },
      {
        "title": "2. Gol Taa (ة / ـة) = Mu'annas",
        "description": "الصَّلَاةُ / الزَّكَاةُ / الْحَيَاةُ / الْآخِرَةُ — Namaz / Zakat / Zindagi / Aakhirat"
      },
      {
        "title": "3. Mazeed Mu'annas Alfaaz",
        "description": "الْجَنَّةُ / الرَّحْمَةُ / التَّوْبَةُ / الْقِيَامَةُ — Jannat (Baagh) / Rahmat / Tauba / Qiyamat"
      }
    ],
    "examples": [
      {
        "arabic": "الْجَوَابُ / السُّؤَالُ / الثَّوَابُ / الْعَذَابُ",
        "hinglish": "Jawab / Sawaal / Sawab / Azaab"
      },
      {
        "arabic": "الصَّلَاةُ / الزَّكَاةُ / الْحَيَاةُ / الْآخِرَةُ",
        "hinglish": "Namaz / Zakat / Zindagi / Aakhirat"
      },
      {
        "arabic": "الْجَنَّةُ / الرَّحْمَةُ / التَّوْبَةُ / الْقِيَامَةُ",
        "hinglish": "Jannat (Baagh) / Rahmat / Tauba / Qiyamat"
      }
    ]
  },
  "s1l3": {
    "lessonKey": "s1l3",
    "title": "S1L3: Ma'roof Qur'ani Alfaaz (Set 3 — Ibadat wa Hidayat ke Alfaaz)",
    "badge": "Qur'ani Alfaaz (Set 3)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْقِبْلَةُ ، الشَّفَاعَةُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Qiblah, Shafa'at</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Qur'ani Alfaaz (Set 3))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">الْقِبْلَةُ ، الشَّفَاعَةُ ، الْهِدَايَةُ ، الشَّهَادَةُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Qiblah, Sifarish, Hidayat, Gawahi</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'الْقِبْلَةُ ، الشَّفَاعَةُ' par Qur'ani Alfaaz (Set 3) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'الْقِبْلَةُ ، الشَّفَاعَةُ ، الْهِدَايَةُ ، الشَّهَادَةُ' (Qiblah, Sifarish, Hidayat, Gawahi) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Qur'ani Alfaaz (Set 3) ke qaa'ide se 'الْقِبْلَةُ ، الشَّفَاعَةُ' badal kar 'الْقِبْلَةُ ، الشَّفَاعَةُ ، الْهِدَايَةُ ، الشَّهَادَةُ' (Qiblah, Sifarish, Hidayat, Gawahi) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "الْقِبْلَةُ ، الشَّفَاعَةُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "الْقِبْلَةُ ، الشَّفَاعَةُ ، الْهِدَايَةُ ، الشَّهَادَةُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Qur'ani Alfaaz (Set 3)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Ibadat wa Deen",
        "description": "الْقِبْلَةُ / الْكَعْبَةُ / الْعِبَادَةُ / الشَّهَادَةُ — Qiblah / Ka'bah / Ibadat / Gawahi"
      },
      {
        "title": "2. Akhlaaq wa Mu'amalaat",
        "description": "الْأَمَانَةُ / الْإِطَاعَةُ / الشَّفَاعَةُ / الْهِدَايَةُ — Amanat / Ita'at / Sifarish / Hidayat"
      },
      {
        "title": "3. Qudrat wa Hikmat",
        "description": "الْقُدْرَةُ / الْحِكْمَةُ / النِّعْمَةُ / الطَّاقَةُ — Qudrat / Hikmat / Ne'mat / Taaqat"
      }
    ],
    "examples": [
      {
        "arabic": "الْقِبْلَةُ / الْكَعْبَةُ / الْعِبَادَةُ / الشَّهَادَةُ",
        "hinglish": "Qiblah / Ka'bah / Ibadat / Gawahi"
      },
      {
        "arabic": "الْأَمَانَةُ / الْإِطَاعَةُ / الشَّفَاعَةُ / الْهِدَايَةُ",
        "hinglish": "Amanat / Ita'at / Sifarish / Hidayat"
      },
      {
        "arabic": "الْقُدْرَةُ / الْحِكْمَةُ / النِّعْمَةُ / الطَّاقَةُ",
        "hinglish": "Qudrat / Hikmat / Ne'mat / Taaqat"
      }
    ]
  },
  "s1l4": {
    "lessonKey": "s1l4",
    "title": "S1L4: Mash'hoor Qur'ani Alfaaz (Set 4 — Sifaat wa Kirdar)",
    "badge": "Qur'ani Alfaaz (Set 4)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الصِّدْقُ ، الْعَدْلُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Sach, Insaaf</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Qur'ani Alfaaz (Set 4))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">الصِّدْقُ ، الْعَدْلُ ، الشَّهِيدُ ، الْوَارِثُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Sach, Insaaf, Gawah, Waaris</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'الصِّدْقُ ، الْعَدْلُ' par Qur'ani Alfaaz (Set 4) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'الصِّدْقُ ، الْعَدْلُ ، الشَّهِيدُ ، الْوَارِثُ' (Sach, Insaaf, Gawah, Waaris) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Qur'ani Alfaaz (Set 4) ke qaa'ide se 'الصِّدْقُ ، الْعَدْلُ' badal kar 'الصِّدْقُ ، الْعَدْلُ ، الشَّهِيدُ ، الْوَارِثُ' (Sach, Insaaf, Gawah, Waaris) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "الصِّدْقُ ، الْعَدْلُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "الصِّدْقُ ، الْعَدْلُ ، الشَّهِيدُ ، الْوَارِثُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Qur'ani Alfaaz (Set 4)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Sachchai wa Insaaf",
        "description": "الصِّدْقُ / الْعَدْلُ / الْإِحْسَانُ / الْإِصْلَاحُ — Sachchai / Insaaf / Bhalai / Islaah"
      },
      {
        "title": "2. Insani Kirdar",
        "description": "الصَّابِرُ / الشَّاكِرُ / الظَّالِمُ / الْغَافِلُ — Sabr karne wala / Shukr karne wala / Zaalim / Ghafil"
      },
      {
        "title": "3. Sifaat",
        "description": "الشَّهِيدُ / الْحَافِظُ / الْوَارِثُ / الْقَرِيبُ — Gawah / Hifazat karne wala / Waaris / Qareeb"
      }
    ],
    "examples": [
      {
        "arabic": "الصِّدْقُ / الْعَدْلُ / الْإِحْسَانُ / الْإِصْلَاحُ",
        "hinglish": "Sachchai / Insaaf / Bhalai / Islaah"
      },
      {
        "arabic": "الصَّابِرُ / الشَّاكِرُ / الظَّالِمُ / الْغَافِلُ",
        "hinglish": "Sabr karne wala / Shukr karne wala / Zaalim / Ghafil"
      },
      {
        "arabic": "الشَّهِيدُ / الْحَافِظُ / الْوَارِثُ / الْقَرِيبُ",
        "hinglish": "Gawah / Hifazat karne wala / Waaris / Qareeb"
      }
    ]
  },
  "s1l5": {
    "lessonKey": "s1l5",
    "title": "S1L5: Aham Qur'ani Asmaa (Set 5 — A'maal wa Jaza)",
    "badge": "Qur'ani Alfaaz (Set 5)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْأَجْرُ ، النِّعْمَةُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Ajr, Ne'mat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Qur'ani Alfaaz (Set 5))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">الْأَجْرُ ، الْمَغْفِرَةُ ، التَّقْوَىٰ ، الزَّلْزَلَةُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Badla, Bakhshish, Parhezgari, Zalzalah</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'الْأَجْرُ ، النِّعْمَةُ' par Qur'ani Alfaaz (Set 5) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'الْأَجْرُ ، الْمَغْفِرَةُ ، التَّقْوَىٰ ، الزَّلْزَلَةُ' (Badla, Bakhshish, Parhezgari, Zalzalah) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Qur'ani Alfaaz (Set 5) ke qaa'ide se 'الْأَجْرُ ، النِّعْمَةُ' badal kar 'الْأَجْرُ ، الْمَغْفِرَةُ ، التَّقْوَىٰ ، الزَّلْزَلَةُ' (Badla, Bakhshish, Parhezgari, Zalzalah) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "الْأَجْرُ ، النِّعْمَةُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "الْأَجْرُ ، الْمَغْفِرَةُ ، التَّقْوَىٰ ، الزَّلْزَلَةُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Qur'ani Alfaaz (Set 5)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. In'aam wa Jaza",
        "description": "الْأَجْرُ / الْفَضْلُ / الْمَغْفِرَةُ / الرِّزْقُ — Ajr / Fazl / Bakhshish / Rizq"
      },
      {
        "title": "2. Imtihan wa Aakhirat",
        "description": "الْفِتْنَةُ / الْمُصِيبَةُ / السَّاعَةُ / الزَّلْزَلَةُ — Aazmaish / Museebat / Qiyamat ki ghadi / Bhonchaal"
      },
      {
        "title": "3. Hidayat wa Taqwa",
        "description": "التَّقْوَىٰ / الْهُدَىٰ / الذِّكْرَىٰ / الْبُشْرَىٰ — Parhezgari / Hidayat / Naseehat / Khushkhabri"
      }
    ],
    "examples": [
      {
        "arabic": "الْأَجْرُ / الْفَضْلُ / الْمَغْفِرَةُ / الرِّزْقُ",
        "hinglish": "Ajr / Fazl / Bakhshish / Rizq"
      },
      {
        "arabic": "الْفِتْنَةُ / الْمُصِيبَةُ / السَّاعَةُ / الزَّلْزَلَةُ",
        "hinglish": "Aazmaish / Museebat / Qiyamat ki ghadi / Bhonchaal"
      },
      {
        "arabic": "التَّقْوَىٰ / الْهُدَىٰ / الذِّكْرَىٰ / الْبُشْرَىٰ",
        "hinglish": "Parhezgari / Hidayat / Naseehat / Khushkhabri"
      }
    ]
  },
  "s1l6": {
    "lessonKey": "s1l6",
    "title": "S1L6: Aasaan Qur'ani Alfaaz (Set 6 — Marfoo' Pesh ـُ ki Pehchaan)",
    "badge": "Pesh (ـُ) ki Pehchaan",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْكَبِيرُ ، الْحَكِيمُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Bada, Hikmat wala</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Pesh (ـُ) ki Pehchaan)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">الْكَبِيرُ ، الْعَظِيمُ ، الْكَرِيمُ ، الْمُسْتَقِيمُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Bada, Azeem, Ba-izzat, Seedha (Aakhir mein Pesh ـُ)</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'الْكَبِيرُ ، الْحَكِيمُ' par Pesh (ـُ) ki Pehchaan ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'الْكَبِيرُ ، الْعَظِيمُ ، الْكَرِيمُ ، الْمُسْتَقِيمُ' (Bada, Azeem, Ba-izzat, Seedha (Aakhir mein Pesh ـُ)) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Pesh (ـُ) ki Pehchaan ke qaa'ide se 'الْكَبِيرُ ، الْحَكِيمُ' badal kar 'الْكَبِيرُ ، الْعَظِيمُ ، الْكَرِيمُ ، الْمُسْتَقِيمُ' (Bada, Azeem, Ba-izzat, Seedha (Aakhir mein Pesh ـُ)) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "الْكَبِيرُ ، الْحَكِيمُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "الْكَبِيرُ ، الْعَظِيمُ ، الْكَرِيمُ ، الْمُسْتَقِيمُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Pesh (ـُ) ki Pehchaan",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Azmat wa Shaan ke Alfaaz",
        "description": "الْكَبِيرُ / الْعَظِيمُ / الْكَرِيمُ / الْمَجِيدُ — Bada / Azeem / Karam wala / Buland-shaan"
      },
      {
        "title": "2. Sifaat-e-Kamaal",
        "description": "الْحَكِيمُ / الْعَلِيمُ / الْحَمِيدُ / الشَّكُورُ — Hikmat wala / Jaanne wala / Ta'reef ke laaiq / Qadr-daan"
      },
      {
        "title": "3. Raasta wa Daleel",
        "description": "الْمُسْتَقِيمُ / الْمُبِينُ / الْيَقِينُ / السَّبِيلُ — Seedha / Khula aur wazih / Yaqeen / Raasta"
      }
    ],
    "examples": [
      {
        "arabic": "الْكَبِيرُ / الْعَظِيمُ / الْكَرِيمُ / الْمَجِيدُ",
        "hinglish": "Bada / Azeem / Karam wala / Buland-shaan"
      },
      {
        "arabic": "الْحَكِيمُ / الْعَلِيمُ / الْحَمِيدُ / الشَّكُورُ",
        "hinglish": "Hikmat wala / Jaanne wala / Ta'reef ke laaiq / Qadr-daan"
      },
      {
        "arabic": "الْمُسْتَقِيمُ / الْمُبِينُ / الْيَقِينُ / السَّبِيلُ",
        "hinglish": "Seedha / Khula aur wazih / Yaqeen / Raasta"
      }
    ]
  },
  "s1l7": {
    "lessonKey": "s1l7",
    "title": "S1L7: Sada aur Mash'hoor Qur'ani Alfaaz (Set 7 — Masadir wa Asmaa)",
    "badge": "Qur'ani Alfaaz (Set 7)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الِاخْتِلَافُ ، الِاسْتِغْفَارُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Ikhtilaaf, Istighfar</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Qur'ani Alfaaz (Set 7))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">الِاخْتِلَافُ ، الِاسْتِغْفَارُ ، الرِّضْوَانُ ، الْمِيثَاقُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Ikhtilaaf, Bakhshish maangna, Khushnoodi, Pukhta ahad</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'الِاخْتِلَافُ ، الِاسْتِغْفَارُ' par Qur'ani Alfaaz (Set 7) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'الِاخْتِلَافُ ، الِاسْتِغْفَارُ ، الرِّضْوَانُ ، الْمِيثَاقُ' (Ikhtilaaf, Bakhshish maangna, Khushnoodi, Pukhta ahad) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Qur'ani Alfaaz (Set 7) ke qaa'ide se 'الِاخْتِلَافُ ، الِاسْتِغْفَارُ' badal kar 'الِاخْتِلَافُ ، الِاسْتِغْفَارُ ، الرِّضْوَانُ ، الْمِيثَاقُ' (Ikhtilaaf, Bakhshish maangna, Khushnoodi, Pukhta ahad) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "الِاخْتِلَافُ ، الِاسْتِغْفَارُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "الِاخْتِلَافُ ، الِاسْتِغْفَارُ ، الرِّضْوَانُ ، الْمِيثَاقُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Qur'ani Alfaaz (Set 7)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Masadir (Kaam ke Naam)",
        "description": "الِاخْتِلَافُ / الِاسْتِغْفَارُ / التَّفْصِيلُ / التَّكْبِيرُ — Ikhtilaaf / Bakhshish maangna / Khol kar bayaan karna / Badai bayaan karna"
      },
      {
        "title": "2. Anbiya wa Asmaa",
        "description": "آدَمُ / إِسْحَاقُ / عِيسَىٰ / الْمِلَّةُ — Adam (A.S.) / Ishaq (A.S.) / Isa (A.S.) / Deen (Millat)"
      },
      {
        "title": "3. Mu'amalaat",
        "description": "الرِّضْوَانُ / الْعَهْدُ / التِّجَارَةُ / الْحَسَنَةُ — Khushnoodi / Ahad / Tijarat / Neki (Bhalai)"
      }
    ],
    "examples": [
      {
        "arabic": "الِاخْتِلَافُ / الِاسْتِغْفَارُ / التَّفْصِيلُ / التَّكْبِيرُ",
        "hinglish": "Ikhtilaaf / Bakhshish maangna / Khol kar bayaan karna / Badai bayaan karna"
      },
      {
        "arabic": "آدَمُ / إِسْحَاقُ / عِيسَىٰ / الْمِلَّةُ",
        "hinglish": "Adam (A.S.) / Ishaq (A.S.) / Isa (A.S.) / Deen (Millat)"
      },
      {
        "arabic": "الرِّضْوَانُ / الْعَهْدُ / التِّجَارَةُ / الْحَسَنَةُ",
        "hinglish": "Khushnoodi / Ahad / Tijarat / Neki (Bhalai)"
      }
    ]
  },
  "s1l8": {
    "lessonKey": "s1l8",
    "title": "S1L8: Buniyadi Qur'ani Alfaaz (Set 8 — Mukammal Buniyadi Zakheera)",
    "badge": "Qur'ani Alfaaz (Set 8)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْغُرُورُ ، التَّسْبِيحُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Dhoka, Tasbeeh</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Qur'ani Alfaaz (Set 8))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">الْغُرُورُ ، التَّسْبِيحُ ، التَّصْدِيقُ ، الْفُرْقَانُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Dhoka, Paaki bayaan karna, Sach maanna, Furqan</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'الْغُرُورُ ، التَّسْبِيحُ' par Qur'ani Alfaaz (Set 8) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'الْغُرُورُ ، التَّسْبِيحُ ، التَّصْدِيقُ ، الْفُرْقَانُ' (Dhoka, Paaki bayaan karna, Sach maanna, Furqan) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Qur'ani Alfaaz (Set 8) ke qaa'ide se 'الْغُرُورُ ، التَّسْبِيحُ' badal kar 'الْغُرُورُ ، التَّسْبِيحُ ، التَّصْدِيقُ ، الْفُرْقَانُ' (Dhoka, Paaki bayaan karna, Sach maanna, Furqan) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "الْغُرُورُ ، التَّسْبِيحُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "الْغُرُورُ ، التَّسْبِيحُ ، التَّصْدِيقُ ، الْفُرْقَانُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Qur'ani Alfaaz (Set 8)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Tasbeeh wa Tasdeeq",
        "description": "التَّسْبِيحُ / التَّصْدِيقُ / التَّحْرِيمُ / التَّخْفِيفُ — Paaki bayaan karna / Tasdeeq karna / Haraam karna / Halka karna"
      },
      {
        "title": "2. Qur'ani Asmaa",
        "description": "الْفُرْقَانُ / الْبُرْهَانُ / السُّلْطَانُ / الْمِيزَانُ — Haq-o-baatil ka farq / Roshan daleel / Ghalba / Tarazoo"
      },
      {
        "title": "3. Imtihan wa Anjaam",
        "description": "الْغُرُورُ / الْخُسْرَانُ / النَّدَامَةُ / الْعَاقِبَةُ — Dhoka / Khasaara / Sharmindagi / Aakhri anjaam"
      }
    ],
    "examples": [
      {
        "arabic": "التَّسْبِيحُ / التَّصْدِيقُ / التَّحْرِيمُ / التَّخْفِيفُ",
        "hinglish": "Paaki bayaan karna / Tasdeeq karna / Haraam karna / Halka karna"
      },
      {
        "arabic": "الْفُرْقَانُ / الْبُرْهَانُ / السُّلْطَانُ / الْمِيزَانُ",
        "hinglish": "Haq-o-baatil ka farq / Roshan daleel / Ghalba / Tarazoo"
      },
      {
        "arabic": "الْغُرُورُ / الْخُسْرَانُ / النَّدَامَةُ / الْعَاقِبَةُ",
        "hinglish": "Dhoka / Khasaara / Sharmindagi / Aakhri anjaam"
      }
    ]
  },
  "s1l9": {
    "lessonKey": "s1l9",
    "title": "S1L9: Allah Ta'ala ki Mash'hoor Sifaat (Asmaa-ul-Husna)",
    "badge": "Asmaa-ul-Husna",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْقَادِرُ ، الْعَلِيمُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Qudrat wala, Jaanne wala</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Asmaa-ul-Husna)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">الْقَادِرُ ، الْعَلِيمُ ، السَّمِيعُ ، الْبَصِيرُ ، الرَّحِيمُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Qaadir, Aleem, Sunne wala, Dekhne wala, Meherbaan</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'الْقَادِرُ ، الْعَلِيمُ' par Asmaa-ul-Husna ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'الْقَادِرُ ، الْعَلِيمُ ، السَّمِيعُ ، الْبَصِيرُ ، الرَّحِيمُ' (Qaadir, Aleem, Sunne wala, Dekhne wala, Meherbaan) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Asmaa-ul-Husna ke qaa'ide se 'الْقَادِرُ ، الْعَلِيمُ' badal kar 'الْقَادِرُ ، الْعَلِيمُ ، السَّمِيعُ ، الْبَصِيرُ ، الرَّحِيمُ' (Qaadir, Aleem, Sunne wala, Dekhne wala, Meherbaan) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "الْقَادِرُ ، الْعَلِيمُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "الْقَادِرُ ، الْعَلِيمُ ، السَّمِيعُ ، الْبَصِيرُ ، الرَّحِيمُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Asmaa-ul-Husna",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Ilm wa Qudrat ki Sifaat",
        "description": "الْقَادِرُ / الْقَدِيرُ / الْعَلِيمُ / الْخَبِيرُ — Qudrat wala / Khoob jaanne wala / Ba-khabar"
      },
      {
        "title": "2. Rahmat wa Maghfirat",
        "description": "الرَّحْمَٰنُ / الرَّحِيمُ / الْغَفُورُ / الْغَفَّارُ / التَّوَّابُ — Bada meherbaan / Nihayat reham wala / Bakhshne wala / Tauba qabool karne wala"
      },
      {
        "title": "3. Ghalba wa Hifazat",
        "description": "الْعَزِيزُ / الْمَلِكُ / الْقُدُّوسُ / السَّمِيعُ / الْبَصِيرُ — Ghalib / Badshah / Nihayat paak / Sunne wala / Dekhne wala"
      }
    ],
    "examples": [
      {
        "arabic": "الْقَادِرُ / الْقَدِيرُ / الْعَلِيمُ / الْخَبِيرُ",
        "hinglish": "Qudrat wala / Khoob jaanne wala / Ba-khabar"
      },
      {
        "arabic": "الرَّحْمَٰنُ / الرَّحِيمُ / الْغَفُورُ / الْغَفَّارُ / التَّوَّابُ",
        "hinglish": "Bada meherbaan / Nihayat reham wala / Bakhshne wala / Tauba qabool karne wala"
      },
      {
        "arabic": "الْعَزِيزُ / الْمَلِكُ / الْقُدُّوسُ / السَّمِيعُ / الْبَصِيرُ",
        "hinglish": "Ghalib / Badshah / Nihayat paak / Sunne wala / Dekhne wala"
      }
    ]
  },
  "s1l10": {
    "lessonKey": "s1l10",
    "title": "S1L10: Jama ke Aasaan Qur'ani Alfaaz (1 — Jama Mukassar)",
    "badge": "Jama Mukassar",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">قَلَمٌ ، عَمَلٌ ، يَوْمٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Qalam, Amal, Din (Wahid)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Jama Mukassar)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">قَلَمٌ ← أَقْلَامٌ ، عَمَلٌ ← أَعْمَالٌ ، يَوْمٌ ← أَيَّامٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Qalamein, A'maal, Ayyam (Jama Mukassar)</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'قَلَمٌ ، عَمَلٌ ، يَوْمٌ' par Jama Mukassar ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'قَلَمٌ ← أَقْلَامٌ ، عَمَلٌ ← أَعْمَالٌ ، يَوْمٌ ← أَيَّامٌ' (Qalamein, A'maal, Ayyam (Jama Mukassar)) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Jama Mukassar ke qaa'ide se 'قَلَمٌ ، عَمَلٌ ، يَوْمٌ' badal kar 'قَلَمٌ ← أَقْلَامٌ ، عَمَلٌ ← أَعْمَالٌ ، يَوْمٌ ← أَيَّامٌ' (Qalamein, A'maal, Ayyam (Jama Mukassar)) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "قَلَمٌ ، عَمَلٌ ، يَوْمٌ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "قَلَمٌ ← أَقْلَامٌ ، عَمَلٌ ← أَعْمَالٌ ، يَوْمٌ ← أَيَّامٌ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Jama Mukassar",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. أَفْعَالٌ Wazan",
        "description": "قَلَمٌ ← أَقْلَامٌ / عَمَلٌ ← أَعْمَالٌ / يَوْمٌ ← أَيَّامٌ — Qalam -> Qalamein / Amal -> A'maal / Din -> Ayyam"
      },
      {
        "title": "2. فُعُولٌ / فِعَالٌ Wazan",
        "description": "قَلْبٌ ← قُلُوبٌ / نَفْسٌ ← نُفُوسٌ / جَبَلٌ ← جِبَالٌ — Dil -> Quloob / Jaan -> Nufoos / Pahad -> Jibaal"
      },
      {
        "title": "3. فُعَلَاءُ / أَفْعِلَاءُ Wazan",
        "description": "شَهِيدٌ ← شُهَدَاءُ / نَبِيٌّ ← أَنْبِيَاءُ / وَلِيٌّ ← أَوْلِيَاءُ — Gawah -> Shuhada / Nabi -> Ambiya / Dost -> Auliya"
      }
    ],
    "examples": [
      {
        "arabic": "قَلَمٌ ← أَقْلَامٌ / عَمَلٌ ← أَعْمَالٌ / يَوْمٌ ← أَيَّامٌ",
        "hinglish": "Qalam -> Qalamein / Amal -> A'maal / Din -> Ayyam"
      },
      {
        "arabic": "قَلْبٌ ← قُلُوبٌ / نَفْسٌ ← نُفُوسٌ / جَبَلٌ ← جِبَالٌ",
        "hinglish": "Dil -> Quloob / Jaan -> Nufoos / Pahad -> Jibaal"
      },
      {
        "arabic": "شَهِيدٌ ← شُهَدَاءُ / نَبِيٌّ ← أَنْبِيَاءُ / وَلِيٌّ ← أَوْلِيَاءُ",
        "hinglish": "Gawah -> Shuhada / Nabi -> Ambiya / Dost -> Auliya"
      }
    ]
  },
  "s1l11": {
    "lessonKey": "s1l11",
    "title": "S1L11: Jama ke Mazeed Qur'ani Alfaaz (2 — Jama Mu'annas Saalim ـَاتٌ)",
    "badge": "Jama Mu'annas (ـَاتٌ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْجَنَّةُ ، الْآيَةُ ، الصَّالِحَةُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Ek baagh, ek nishani, ek neki</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Jama Mu'annas (ـَاتٌ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">الْجَنَّاتُ ، الْآيَاتُ ، الصَّالِحَاتُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Baghaat, Nishaniyan, Nek a'maal (+ ـَاتٌ)</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'الْجَنَّةُ ، الْآيَةُ ، الصَّالِحَةُ' par Jama Mu'annas (ـَاتٌ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'الْجَنَّاتُ ، الْآيَاتُ ، الصَّالِحَاتُ' (Baghaat, Nishaniyan, Nek a'maal (+ ـَاتٌ)) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Jama Mu'annas (ـَاتٌ) ke qaa'ide se 'الْجَنَّةُ ، الْآيَةُ ، الصَّالِحَةُ' badal kar 'الْجَنَّاتُ ، الْآيَاتُ ، الصَّالِحَاتُ' (Baghaat, Nishaniyan, Nek a'maal (+ ـَاتٌ)) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "الْجَنَّةُ ، الْآيَةُ ، الصَّالِحَةُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "الْجَنَّاتُ ، الْآيَاتُ ، الصَّالِحَاتُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Jama Mu'annas (ـَاتٌ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. ـَةُ ← ـَاتُ (Jama Mu'annas)",
        "description": "الْجَنَّةُ ← الْجَنَّاتُ / الْآيَةُ ← الْآيَاتُ — Baagh -> Baghaat / Nishani -> Aayaat"
      },
      {
        "title": "2. A'maal wa Sifaat",
        "description": "الصَّالِحَاتُ / الطَّيِّبَاتُ / الْحَسَنَاتُ / السَّيِّئَاتُ — Nek a'maal / Paakiza cheezein / Nekiyan / Buraiyan"
      },
      {
        "title": "3. Mominaat wa Muslimaat",
        "description": "الْمُسْلِمَاتُ / الْمُؤْمِنَاتُ / الصَّادِقَاتُ / الصَّابِرَاتُ — Musalman auratein / Momin auratein / Sachchi aur sabr karne wali auratein"
      }
    ],
    "examples": [
      {
        "arabic": "الْجَنَّةُ ← الْجَنَّاتُ / الْآيَةُ ← الْآيَاتُ",
        "hinglish": "Baagh -> Baghaat / Nishani -> Aayaat"
      },
      {
        "arabic": "الصَّالِحَاتُ / الطَّيِّبَاتُ / الْحَسَنَاتُ / السَّيِّئَاتُ",
        "hinglish": "Nek a'maal / Paakiza cheezein / Nekiyan / Buraiyan"
      },
      {
        "arabic": "الْمُسْلِمَاتُ / الْمُؤْمِنَاتُ / الصَّادِقَاتُ / الصَّابِرَاتُ",
        "hinglish": "Musalman auratein / Momin auratein / Sachchi aur sabr karne wali auratein"
      }
    ]
  },
  "s1l12": {
    "lessonKey": "s1l12",
    "title": "S1L12: Harf-e-'Atf 'Waw' (Aur): الْكِتَابُ ، الْقَلَمُ ← الْكِتَابُ وَالْقَلَمُ",
    "badge": "Harf-e-'Atf (وَ = Aur)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ ، الْقَلَمُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Kitaab, Qalam</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Harf-e-'Atf (وَ = Aur))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">الْكِتَابُ وَالْقَلَمُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Kitaab aur Qalam</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'الْكِتَابُ ، الْقَلَمُ' par Harf-e-'Atf (وَ = Aur) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'الْكِتَابُ وَالْقَلَمُ' (Kitaab aur Qalam) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Harf-e-'Atf (وَ = Aur) ke qaa'ide se 'الْكِتَابُ ، الْقَلَمُ' badal kar 'الْكِتَابُ وَالْقَلَمُ' (Kitaab aur Qalam) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "الْكِتَابُ ، الْقَلَمُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "الْكِتَابُ وَالْقَلَمُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Harf-e-'Atf (وَ = Aur)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Do Alfaaz ka Jod (وَ)",
        "description": "الْكِتَابُ وَالْحِكْمَةُ / الْحَقُّ وَالْبَاطِلُ — Kitaab aur hikmat / Haq aur baatil"
      },
      {
        "title": "2. Teen Alfaaz ka Jod",
        "description": "إِبْرَاهِيمَ وَمُوسَىٰ وَعِيسَىٰ / السَّمْعَ وَالْبَصَرَ وَالْفُؤَادَ — Ibrahim, Musa aur Isa / Kaan, aankh aur dil"
      },
      {
        "title": "3. Chaar ya Paanch Alfaaz",
        "description": "اللَّيْلُ وَالنَّهَارُ وَالشَّمْسُ وَالْقَمَرُ — Raat aur din aur sooraj aur chaand"
      }
    ],
    "examples": [
      {
        "arabic": "الْكِتَابُ وَالْحِكْمَةُ / الْحَقُّ وَالْبَاطِلُ",
        "hinglish": "Kitaab aur hikmat / Haq aur baatil"
      },
      {
        "arabic": "إِبْرَاهِيمَ وَمُوسَىٰ وَعِيسَىٰ / السَّمْعَ وَالْبَصَرَ وَالْفُؤَادَ",
        "hinglish": "Ibrahim, Musa aur Isa / Kaan, aankh aur dil"
      },
      {
        "arabic": "اللَّيْلُ وَالنَّهَارُ وَالشَّمْسُ وَالْقَمَرُ",
        "hinglish": "Raat aur din aur sooraj aur chaand"
      }
    ]
  },
  "s1l13": {
    "lessonKey": "s1l13",
    "title": "S1L13: Ma'rifah se Nakirah (1): الْكِتَابُ ← كِتَابٌ (Koi / Ek)",
    "badge": "Nakirah (Tanween ـٌ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْكِتَابُ ، الرَّسُولُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Al-Kitaab (Khaas Kitaab)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Nakirah (Tanween ـٌ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">كِتَابٌ ، رَسُولٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Ek kitaab / Koi kitaab, Ek Rasool (Tanween ـٌ)</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'الْكِتَابُ ، الرَّسُولُ' par Nakirah (Tanween ـٌ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'كِتَابٌ ، رَسُولٌ' (Ek kitaab / Koi kitaab, Ek Rasool (Tanween ـٌ)) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Nakirah (Tanween ـٌ) ke qaa'ide se 'الْكِتَابُ ، الرَّسُولُ' badal kar 'كِتَابٌ ، رَسُولٌ' (Ek kitaab / Koi kitaab, Ek Rasool (Tanween ـٌ)) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "الْكِتَابُ ، الرَّسُولُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "كِتَابٌ ، رَسُولٌ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Nakirah (Tanween ـٌ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. الْـ (Khaas) ← Tanween ـٌ (Aam)",
        "description": "الْكِتَابُ ← كِتَابٌ / الرَّسُولُ ← رَسُولٌ — Khaas kitaab -> Ek (koi) kitaab / Ek Rasool"
      },
      {
        "title": "2. Do Pesh (ـٌ) = 'Ek' ya 'Koi'",
        "description": "مَلِكٌ / أُمَّةٌ / آيَةٌ / مَغْفِرَةٌ — Ek badshah / Ek ummat / Ek nishani / Bakhshish"
      },
      {
        "title": "3. وَ ke saath Nakirah Jode",
        "description": "هُدًى وَشِفَاءٌ / هُدًى وَرَحْمَةٌ وَبُشْرَىٰ — Hidayat aur shifa / Hidayat, rahmat aur khushkhabri"
      }
    ],
    "examples": [
      {
        "arabic": "الْكِتَابُ ← كِتَابٌ / الرَّسُولُ ← رَسُولٌ",
        "hinglish": "Khaas kitaab -> Ek (koi) kitaab / Ek Rasool"
      },
      {
        "arabic": "مَلِكٌ / أُمَّةٌ / آيَةٌ / مَغْفِرَةٌ",
        "hinglish": "Ek badshah / Ek ummat / Ek nishani / Bakhshish"
      },
      {
        "arabic": "هُدًى وَشِفَاءٌ / هُدًى وَرَحْمَةٌ وَبُشْرَىٰ",
        "hinglish": "Hidayat aur shifa / Hidayat, rahmat aur khushkhabri"
      }
    ]
  },
  "s1l14": {
    "lessonKey": "s1l14",
    "title": "S1L14: Ma'rifah se Nakirah (2 — Jumle mein 'Hai'): الْكِتَابُ ← كِتَابٌ ، وَاللَّهُ عَلِيمٌ",
    "badge": "Khabar (ـٌ = '... hai')",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">الْعَلِيمُ ، الْحَكِيمُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Jaanne wala (Khaas)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Khabar (ـٌ = '... hai'))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">عَلِيمٌ ، وَاللَّهُ سَمِيعٌ عَلِيمٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jaanne wala hai — Aur Allah sunne wala, jaanne wala hai</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'الْعَلِيمُ ، الْحَكِيمُ' par Khabar (ـٌ = '... hai') ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'عَلِيمٌ ، وَاللَّهُ سَمِيعٌ عَلِيمٌ' (Jaanne wala hai — Aur Allah sunne wala, jaanne wala hai) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Khabar (ـٌ = '... hai') ke qaa'ide se 'الْعَلِيمُ ، الْحَكِيمُ' badal kar 'عَلِيمٌ ، وَاللَّهُ سَمِيعٌ عَلِيمٌ' (Jaanne wala hai — Aur Allah sunne wala, jaanne wala hai) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "الْعَلِيمُ ، الْحَكِيمُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "عَلِيمٌ ، وَاللَّهُ سَمِيعٌ عَلِيمٌ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Khabar (ـٌ = '... hai')",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. Tanween (ـٌ) = '... hai'",
        "description": "عَلِيمٌ / حَكِيمٌ / قَدِيرٌ / غَفُورٌ — Jaanne wala hai / Hikmat wala hai / Qaadir hai / Bakhshne wala hai"
      },
      {
        "title": "2. وَاللَّهُ + Ek Sifat",
        "description": "وَاللَّهُ وَاسِعٌ / وَاللَّهُ عَلِيمٌ / وَاللَّهُ غَنِيٌّ — Aur Allah wus'at wala hai / Aur Allah jaanne wala hai"
      },
      {
        "title": "3. وَاللَّهُ + Do Sifaat",
        "description": "وَاللَّهُ سَمِيعٌ عَلِيمٌ / وَاللَّهُ غَفُورٌ رَحِيمٌ — Aur Allah khoob sunne wala, jaanne wala hai"
      }
    ],
    "examples": [
      {
        "arabic": "عَلِيمٌ / حَكِيمٌ / قَدِيرٌ / غَفُورٌ",
        "hinglish": "Jaanne wala hai / Hikmat wala hai / Qaadir hai / Bakhshne wala hai"
      },
      {
        "arabic": "وَاللَّهُ وَاسِعٌ / وَاللَّهُ عَلِيمٌ / وَاللَّهُ غَنِيٌّ",
        "hinglish": "Aur Allah wus'at wala hai / Aur Allah jaanne wala hai"
      },
      {
        "arabic": "وَاللَّهُ سَمِيعٌ عَلِيمٌ / وَاللَّهُ غَفُورٌ رَحِيمٌ",
        "hinglish": "Aur Allah khoob sunne wala, jaanne wala hai"
      }
    ]
  },
  "s1l15": {
    "lessonKey": "s1l15",
    "title": "S1L15: Ism-e-Ishaarah Qareeb (Muzakkar): كِتَابٌ ← هَٰذَا كِتَابٌ",
    "badge": "Ishaarah (هَٰذَا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">كِتَابٌ ، الْقُرْآنُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Ek kitaab, Qur'an</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Ishaarah (هَٰذَا))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">هَٰذَا كِتَابٌ ، هَٰذَا الْقُرْآنُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Yeh ek kitaab hai (Jumla) • Yeh Qur'an (Qat'ah)</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'كِتَابٌ ، الْقُرْآنُ' par Ishaarah (هَٰذَا) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'هَٰذَا كِتَابٌ ، هَٰذَا الْقُرْآنُ' (Yeh ek kitaab hai (Jumla) • Yeh Qur'an (Qat'ah)) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Ishaarah (هَٰذَا) ke qaa'ide se 'كِتَابٌ ، الْقُرْآنُ' badal kar 'هَٰذَا كِتَابٌ ، هَٰذَا الْقُرْآنُ' (Yeh ek kitaab hai (Jumla) • Yeh Qur'an (Qat'ah)) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "كِتَابٌ ، الْقُرْآنُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "هَٰذَا كِتَابٌ ، هَٰذَا الْقُرْآنُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Ishaarah (هَٰذَا)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. هَٰذَا + Tanween (ـٌ) = Mukammal Jumla",
        "description": "هَٰذَا كِتَابٌ / هَٰذَا بَيَانٌ / هَٰذَا صِرَاطٌ — Yeh ek kitaab hai / Yeh wazih bayaan hai / Yeh raasta hai"
      },
      {
        "title": "2. هَٰذَا + الْـ = Qat'ah (Yeh...)",
        "description": "هَٰذَا الْقُرْآنُ / هَٰذَا النَّبِيُّ / هَٰذَا الْبَلَدُ — Yeh Qur'an / Yeh Nabi / Yeh shehar (mukammal jumla nahin)"
      },
      {
        "title": "3. مَتَىٰ هَٰذَا ... (Sawaal)",
        "description": "مَتَىٰ هَٰذَا الْوَعْدُ / مَتَىٰ هَٰذَا الْفَتْحُ — Yeh waada kab poora hoga? / Yeh fatah kab hogi?"
      }
    ],
    "examples": [
      {
        "arabic": "هَٰذَا كِتَابٌ / هَٰذَا بَيَانٌ / هَٰذَا صِرَاطٌ",
        "hinglish": "Yeh ek kitaab hai / Yeh wazih bayaan hai / Yeh raasta hai"
      },
      {
        "arabic": "هَٰذَا الْقُرْآنُ / هَٰذَا النَّبِيُّ / هَٰذَا الْبَلَدُ",
        "hinglish": "Yeh Qur'an / Yeh Nabi / Yeh shehar (mukammal jumla nahin)"
      },
      {
        "arabic": "مَتَىٰ هَٰذَا الْوَعْدُ / مَتَىٰ هَٰذَا الْفَتْحُ",
        "hinglish": "Yeh waada kab poora hoga? / Yeh fatah kab hogi?"
      }
    ]
  },
  "s1l16": {
    "lessonKey": "s1l16",
    "title": "S1L16: Ism-e-Ishaarah Ba'eed (Muzakkar): كِتَابٌ ← ذَٰلِكَ كِتَابٌ",
    "badge": "Ishaarah (ذَٰلِكَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">كِتَابٌ ، الْفَضْلُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Ek kitaab, Fazl</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Ishaarah (ذَٰلِكَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">ذَٰلِكَ كِتَابٌ ، ذَٰلِكَ الْفَضْلُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Woh ek kitaab hai • Woh/Yahi bada fazl hai</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'كِتَابٌ ، الْفَضْلُ' par Ishaarah (ذَٰلِكَ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'ذَٰلِكَ كِتَابٌ ، ذَٰلِكَ الْفَضْلُ' (Woh ek kitaab hai • Woh/Yahi bada fazl hai) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Ishaarah (ذَٰلِكَ) ke qaa'ide se 'كِتَابٌ ، الْفَضْلُ' badal kar 'ذَٰلِكَ كِتَابٌ ، ذَٰلِكَ الْفَضْلُ' (Woh ek kitaab hai • Woh/Yahi bada fazl hai) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "كِتَابٌ ، الْفَضْلُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "ذَٰلِكَ كِتَابٌ ، ذَٰلِكَ الْفَضْلُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Ishaarah (ذَٰلِكَ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. ذَٰلِكَ + Tanween (ـٌ) = Jumla",
        "description": "ذَٰلِكَ كِتَابٌ / ذَٰلِكَ هُدًى / ذَٰلِكَ خَيْرٌ — Woh ek kitaab hai / Woh hidayat hai / Woh behtar hai"
      },
      {
        "title": "2. ذَٰلِكَ + الْـ (Qat'ah ya Ta'keedi Jumla)",
        "description": "ذَٰلِكَ الْكِتَابُ / ذَٰلِكَ الْفَوْزُ الْعَظِيمُ — Woh (azeem) Kitaab / Yahi badi kamyaabi hai"
      },
      {
        "title": "3. Qur'ani Misaal",
        "description": "ذَٰلِكَ الدِّينُ الْقَيِّمُ / ذَٰلِكَ الْيَوْمُ الْحَقُّ — Yahi seedha deen hai / Yahi sachcha din hai"
      }
    ],
    "examples": [
      {
        "arabic": "ذَٰلِكَ كِتَابٌ / ذَٰلِكَ هُدًى / ذَٰلِكَ خَيْرٌ",
        "hinglish": "Woh ek kitaab hai / Woh hidayat hai / Woh behtar hai"
      },
      {
        "arabic": "ذَٰلِكَ الْكِتَابُ / ذَٰلِكَ الْفَوْزُ الْعَظِيمُ",
        "hinglish": "Woh (azeem) Kitaab / Yahi badi kamyaabi hai"
      },
      {
        "arabic": "ذَٰلِكَ الدِّينُ الْقَيِّمُ / ذَٰلِكَ الْيَوْمُ الْحَقُّ",
        "hinglish": "Yahi seedha deen hai / Yahi sachcha din hai"
      }
    ]
  },
  "s1l17": {
    "lessonKey": "s1l17",
    "title": "S1L17: Ism-e-Ishaarah Mu'annas: آيَةٌ ← هَٰذِهِ آيَةٌ ، تِلْكَ آيَةٌ",
    "badge": "Mu'annas (هَٰذِهِ / تِلْكَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">آيَةٌ ، الْجَنَّةُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Ek nishani, Jannat</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Mu'annas (هَٰذِهِ / تِلْكَ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">هَٰذِهِ آيَةٌ ، تِلْكَ الْجَنَّةُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Yeh ek nishani hai • Woh Jannat</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'آيَةٌ ، الْجَنَّةُ' par Mu'annas (هَٰذِهِ / تِلْكَ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'هَٰذِهِ آيَةٌ ، تِلْكَ الْجَنَّةُ' (Yeh ek nishani hai • Woh Jannat) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Mu'annas (هَٰذِهِ / تِلْكَ) ke qaa'ide se 'آيَةٌ ، الْجَنَّةُ' badal kar 'هَٰذِهِ آيَةٌ ، تِلْكَ الْجَنَّةُ' (Yeh ek nishani hai • Woh Jannat) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "آيَةٌ ، الْجَنَّةُ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "هَٰذِهِ آيَةٌ ، تِلْكَ الْجَنَّةُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Mu'annas (هَٰذِهِ / تِلْكَ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. هَٰذِهِ + Mu'annas (Yeh... hai)",
        "description": "هَٰذِهِ آيَةٌ / هَٰذِهِ تَذْكِرَةٌ / هَٰذِهِ نَاقَةُ اللَّهِ — Yeh ek nishani hai / Yeh naseehat hai / Yeh Allah ki oontni hai"
      },
      {
        "title": "2. تِلْكَ + Mu'annas (Woh... hai)",
        "description": "تِلْكَ آيَةٌ / تِلْكَ أُمَّةٌ / تِلْكَ حُدُودُ اللَّهِ — Woh ek nishani hai / Woh ek ummat hai / Yeh Allah ki hadein hain"
      },
      {
        "title": "3. هَٰذِهِ / تِلْكَ + الْـ",
        "description": "هَٰذِهِ الْحَيَاةُ الدُّنْيَا / تِلْكَ الْجَنَّةُ — Yeh duniya ki zindagi / Woh Jannat"
      }
    ],
    "examples": [
      {
        "arabic": "هَٰذِهِ آيَةٌ / هَٰذِهِ تَذْكِرَةٌ / هَٰذِهِ نَاقَةُ اللَّهِ",
        "hinglish": "Yeh ek nishani hai / Yeh naseehat hai / Yeh Allah ki oontni hai"
      },
      {
        "arabic": "تِلْكَ آيَةٌ / تِلْكَ أُمَّةٌ / تِلْكَ حُدُودُ اللَّهِ",
        "hinglish": "Woh ek nishani hai / Woh ek ummat hai / Yeh Allah ki hadein hain"
      },
      {
        "arabic": "هَٰذِهِ الْحَيَاةُ الدُّنْيَا / تِلْكَ الْجَنَّةُ",
        "hinglish": "Yeh duniya ki zindagi / Woh Jannat"
      }
    ]
  },
  "s1l18": {
    "lessonKey": "s1l18",
    "title": "S1L18: Laam-e-Ta'keed: كِتَابٌ ← لَكِتَابٌ (Yaqeenan Kitaab hai)",
    "badge": "Laam-e-Ta'keed (لَـ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">كِتَابٌ ، الْحَقُّ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Ek kitaab, Sach</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Laam-e-Ta'keed (لَـ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">لَكِتَابٌ ، لَلْحَقُّ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Yaqeenan kitaab hai • Yaqeenan haq hi hai</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'كِتَابٌ ، الْحَقُّ' par Laam-e-Ta'keed (لَـ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'لَكِتَابٌ ، لَلْحَقُّ' (Yaqeenan kitaab hai • Yaqeenan haq hi hai) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Laam-e-Ta'keed (لَـ) ke qaa'ide se 'كِتَابٌ ، الْحَقُّ' badal kar 'لَكِتَابٌ ، لَلْحَقُّ' (Yaqeenan kitaab hai • Yaqeenan haq hi hai) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "كِتَابٌ ، الْحَقُّ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "لَكِتَابٌ ، لَلْحَقُّ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Laam-e-Ta'keed (لَـ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. لَـ + Nakirah (ـٌ)",
        "description": "لَكِتَابٌ / لَقُرْآنٌ كَرِيمٌ / لَآيَةٌ / لَغَفُورٌ — Yaqeenan kitaab hai / Yaqeenan ba-izzat Qur'an hai / Yaqeenan bakhshne wala hai"
      },
      {
        "title": "2. لَـ + الْـ (لَلْـ)",
        "description": "لَلْهُدَىٰ / لَلْحَقُّ / لَلْفَوْزُ الْعَظِيمُ — Yaqeenan hidayat hi hai / Yaqeenan haq hi hai"
      },
      {
        "title": "3. إِنَّ ... لَـ (Dohri Ta'keed)",
        "description": "إِنَّ رَبَّكَ لَسَرِيعُ الْعِقَابِ وَإِنَّهُ لَغَفُورٌ رَحِيمٌ — Beshak aapka Rabb jald saza dene wala hai aur beshak woh yaqeenan bakhshne wala meherbaan hai"
      }
    ],
    "examples": [
      {
        "arabic": "لَكِتَابٌ / لَقُرْآنٌ كَرِيمٌ / لَآيَةٌ / لَغَفُورٌ",
        "hinglish": "Yaqeenan kitaab hai / Yaqeenan ba-izzat Qur'an hai / Yaqeenan bakhshne wala hai"
      },
      {
        "arabic": "لَلْهُدَىٰ / لَلْحَقُّ / لَلْفَوْزُ الْعَظِيمُ",
        "hinglish": "Yaqeenan hidayat hi hai / Yaqeenan haq hi hai"
      },
      {
        "arabic": "إِنَّ رَبَّكَ لَسَرِيعُ الْعِقَابِ وَإِنَّهُ لَغَفُورٌ رَحِيمٌ",
        "hinglish": "Beshak aapka Rabb jald saza dene wala hai aur beshak woh yaqeenan bakhshne wala meherbaan hai"
      }
    ]
  },
  "s1l19": {
    "lessonKey": "s1l19",
    "title": "S1L19: Ism-ut-Tafzeel (Sabse / Zyada): كَبِيرٌ ← أَكْبَرُ ، عَلِيمٌ ← أَعْلَمُ",
    "badge": "Ism-ut-Tafzeel (أَفْعَلُ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (Bunyadi Halat)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">كَبِيرٌ ، عَلِيمٌ ، ظَالِمٌ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Bada, Jaanne wala, Zaalim</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">BADLA HUA (Ism-ut-Tafzeel (أَفْعَلُ))</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">أَكْبَرُ ، أَعْلَمُ ، أَظْلَمُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Sabse bada / zyada bada, Sabse zyada jaanne wala, Sabse bada zaalim</text>\n  </svg>",
    "prediction": {
      "question": "Jab 'كَبِيرٌ ، عَلِيمٌ ، ظَالِمٌ' par Ism-ut-Tafzeel (أَفْعَلُ) ka qaa'ida laagu hota hai toh kya shakl aur ma'ni banta hai?",
      "options": [
        "'أَكْبَرُ ، أَعْلَمُ ، أَظْلَمُ' (Sabse bada / zyada bada, Sabse zyada jaanne wala, Sabse bada zaalim) banta hai",
        "Lafz aur ma'ni mein koi tabdeeli nahin aati"
      ],
      "correct": 0,
      "explanation": "Ism-ut-Tafzeel (أَفْعَلُ) ke qaa'ide se 'كَبِيرٌ ، عَلِيمٌ ، ظَالِمٌ' badal kar 'أَكْبَرُ ، أَعْلَمُ ، أَظْلَمُ' (Sabse bada / zyada bada, Sabse zyada jaanne wala, Sabse bada zaalim) ban jata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "كَبِيرٌ ، عَلِيمٌ ، ظَالِمٌ (Asal)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "أَكْبَرُ ، أَعْلَمُ ، أَظْلَمُ (Natija)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "Ism-ut-Tafzeel (أَفْعَلُ)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "1. أَفْعَلُ Wazan (Zyada / Sabse...)",
        "description": "كَبِيرٌ ← أَكْبَرُ / عَلِيمٌ ← أَعْلَمُ / صَادِقٌ ← أَصْدَقُ — Sabse bada / Sabse zyada jaanne wala / Sabse zyada sachcha"
      },
      {
        "title": "2. Mazeed أَفْعَلُ Alfaaz",
        "description": "أَظْلَمُ / أَحْسَنُ / أَقْرَبُ / أَشَدُّ / أَهْدَىٰ — Sabse bada zaalim / Sabse behtar / Zyada qareeb / Zyada sakht / Zyada hidayat par"
      },
      {
        "title": "3. خَيْرٌ aur شَرٌّ (Bina أَ ke Tafzeel)",
        "description": "وَالْآخِرَةُ خَيْرٌ وَأَبْقَىٰ / شَرُّ الدَّوَابِّ — Aur aakhirat behtar aur zyada baqi rehne wali hai / Bad-tareen jaandaar"
      }
    ],
    "examples": [
      {
        "arabic": "كَبِيرٌ ← أَكْبَرُ / عَلِيمٌ ← أَعْلَمُ / صَادِقٌ ← أَصْدَقُ",
        "hinglish": "Sabse bada / Sabse zyada jaanne wala / Sabse zyada sachcha"
      },
      {
        "arabic": "أَظْلَمُ / أَحْسَنُ / أَقْرَبُ / أَشَدُّ / أَهْدَىٰ",
        "hinglish": "Sabse bada zaalim / Sabse behtar / Zyada qareeb / Zyada sakht / Zyada hidayat par"
      },
      {
        "arabic": "وَالْآخِرَةُ خَيْرٌ وَأَبْقَىٰ / شَرُّ الدَّوَابِّ",
        "hinglish": "Aur aakhirat behtar aur zyada baqi rehne wali hai / Bad-tareen jaandaar"
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