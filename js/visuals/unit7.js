// @ts-check
import { renderVisual } from './visual-helper.js';

/**
 * Muallim ul-Qur'an — Unit 7 Grammar Visuals Module (v2.0)
 * Aligned 100% with the official 10-lesson Unit 7 Table of Contents (Book Pages 9–175).
 * Exports standard mount/destroy interface for all lessons in Unit 7.
 */

/** @type {(() => void) | null} */
let _activeTeardown = null;

/**
 * Visual configurations for Unit 7 (s7l1–s7l10)
 * @type {Record<string, import('./visual-helper.js').VisualConfig>}
 */
export const visuals = {
  "s7l1": {
    "lessonKey": "s7l1",
    "title": "S7L1: Fe'l Maazi ki Pehli Shakl (Wahid Muzakkar Ghaib): عَمِلَ ، جَاهَدَ ، أَنْزَلَ ، اسْتَغْفَرَ",
    "badge": "Maazi Wahid (فَعَلَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">ASAL (3, 4, 5/6 Harfi Maazi)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">خَلَقَ / أَنْزَلَ / اسْتَغْفَرَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Usne paida kiya / utara / bakhshish maangi</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">QUR'ANI MURAKKAB (Maazi + Huroof)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">الَّذِي خَلَقَ • قَدْ أَنْزَلَ • مَنْ عَمِلَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jisne paida kiya • Yaqeenan utara • Jisne amal kiya</text>\n  </svg>",
    "prediction": {
      "question": "Fe'l Maazi ki pehli shakl (جیسے خَلَقَ، أَنْزَلَ، اسْتَغْفَرَ) ke aakhri harf par kya harkat hoti hai aur iska tarjuma kya hota hai?",
      "options": [
        "Aakhri harf par Zabar (ـَ) hota hai aur tarjuma 'Usne kiya' (Past Tense) hota hai",
        "Aakhri harf par Pesh (ـُ) hota hai aur tarjuma 'Woh karta hai' hota hai"
      ],
      "correct": 0,
      "explanation": "Bilkul durust! 3, 4, ya 5/6 harfi Fe'l Maazi ki pehli shakl ke aakhri harf par Zabar (ـَ) hota hai aur ma'ni 'Usne ... kiya' banta hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "خَلَقَ ، جَعَلَ ، عَلِمَ (3-Harfi Maazi)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "أَنْزَلَ ، أَرْسَلَ ، جَاهَدَ (4-Harfi Maazi)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "اتَّبَعَ ، اهْتَدَىٰ ، اسْتَغْفَرَ (5/6-Harfi Maazi)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "Step 1: 3-, 4-, aur 5/6-Harfi Maazi Af'aal",
        "desc": "Chahe fe'l 3 harfi ho (خَلَقَ) ya 4-6 harfi (أَنْزَلَ، اسْتَغْفَرَ), aakhri harf par Zabar aata hai aur ma'ni 'Usne kiya' hota hai.",
        "description": "Chahe fe'l 3 harfi ho (خَلَقَ) ya 4-6 harfi (أَنْزَلَ، اسْتَغْفَرَ), aakhri harf par Zabar aata hai aur ma'ni 'Usne kiya' hota hai."
      },
      {
        "title": "Step 2: Shuru ke Huroof (فَـ، قَدْ، إِذْ، إِذَا، لَمَّا، الَّذِي، مَنْ)",
        "desc": "Maazi se pehle فَـ (toh), قَدْ (yaqeenan), إِذْ (jab), الَّذِي (jisne), aur مَنْ (jis kisi ne) lag kar bade qat'aat bante hain.",
        "description": "Maazi se pehle فَـ (toh), قَدْ (yaqeenan), إِذْ (jab), الَّذِي (jisne), aur مَنْ (jis kisi ne) lag kar bade qat'aat bante hain."
      },
      {
        "title": "Step 3: Fa'il (Pesh wala) aur Maf'ool (Zabar wala)",
        "desc": "Maazi ke baad kaam karne wale (Fa'il) par Pesh (خَلَقَ اللَّهُ) aur jis par kaam hua (Maf'ool) par Zabar (ضَرَبَ اللَّهُ مَثَلًا) hota hai.",
        "description": "Maazi ke baad kaam karne wale (Fa'il) par Pesh (خَلَقَ اللَّهُ) aur jis par kaam hua (Maf'ool) par Zabar (ضَرَبَ اللَّهُ مَثَلًا) hota hai."
      }
    ],
    "examples": [
      {
        "arabic": "الْحَمْدُ لِلَّهِ الَّذِي خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ وَجَعَلَ الظُّلُمَاتِ وَالنُّورَ",
        "hinglish": "Tamaam ta'reefein Allah ke liye hain jisne aasmanon aur zameen ko paida kiya aur andheron aur roshni ko banaya"
      },
      {
        "arabic": "تَبَارَكَ الَّذِي نَزَّلَ الْفُرْقَانَ عَلَىٰ عَبْدِهِ لِيَكُونَ لِلْعَالَمِينَ نَذِيرًا",
        "hinglish": "Bada ba-barkat hai woh jisne apne bande par Furqan naazil farmaya taake woh tamaam jahanon ke liye darane wala ho"
      },
      {
        "arabic": "مَنْ عَمِلَ صَالِحًا فَلِنَفْسِهِ وَمَنْ أَسَاءَ فَعَلَيْهَا",
        "hinglish": "Jisne nek amal kiya toh apne hi faide ke liye aur jisne burai ki toh uska wabaal usi par hai"
      }
    ]
  },
  "s7l2": {
    "lessonKey": "s7l2",
    "title": "S7L2: Fe'l Maazi ki Doosri Shakl (Jama Muzakkar Ghaib): عَبَدَ ← عَبَدُوا",
    "badge": "Maazi Jama (فَعَلُوا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">WAHID (Usne kiya)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">عَبَدَ / آمَنَ / كَفَرَ / قَالَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Wahid Muzakkar Ghaib</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">JAMA (+ وْا : Unhon ne kiya)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">عَبَدُوا / آمَنُوا / كَفَرُوا / قَالُوا</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Jama Muzakkar Ghaib (Waw + Alif)</text>\n  </svg>",
    "prediction": {
      "question": "Jab Fe'l Maazi (عَبَدَ، آمَنَ، كَفَرَ) ke aakhir mein وْا lagaya jata hai (عَبَدُوا، آمَنُوا، كَفَرُوا) toh ma'ni mein kya tabdeeli aati hai?",
      "options": [
        "'Unhon ne kiya' (Jama Muzakkar Ghaib — They did)",
        "'Hamne kiya' (Jama Mutakallim — We did)"
      ],
      "correct": 0,
      "explanation": "Shabash! Fe'l Maazi ke aakhir mein وْا lagane se jama ('Unhon ne kiya') ka mafhoom banta hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "عَبَدَ ← عَبَدُوا (Unhon ne ibaadat ki)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ (Jo log imaan laaye aur nek amal kiye)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "وَالَّذِينَ كَفَرُوا وَكَذَّبُوا بِآيَاتِنَا (Aur jinhon ne kufr kiya aur jhutlaya)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "Step 1: Aakhir mein وْا ka Izafa",
        "desc": "عَبَدَ se عَبَدُوا، ظَلَمَ se ظَلَمُوا، آمَنَ se آمَنُوا — Waw ke baad Alif sirf likhne mein aata hai, padha nahin jata.",
        "description": "عَبَدَ se عَبَدُوا، ظَلَمَ se ظَلَمُوا، آمَنَ se آمَنُوا — Waw ke baad Alif sirf likhne mein aata hai, padha nahin jata."
      },
      {
        "title": "Step 2: الَّذِينَ آمَنُوا aur الَّذِينَ كَفَرُوا ka Muwazana",
        "desc": "Qur'an Majeed mein mominon aur kaafiron ke a'maal aur anjaam ka muwazana isi shakl ke zariye aata hai.",
        "description": "Qur'an Majeed mein mominon aur kaafiron ke a'maal aur anjaam ka muwazana isi shakl ke zariye aata hai."
      },
      {
        "title": "Step 3: قَالُوا aur كَانُوا + Muzaare",
        "desc": "كَانُوا ke baad Fe'l Muzaare aane se (جیسے كَانُوا يَعْمَلُونَ، بِمَا كَانُوا يَكْسِبُونَ) 'Woh kiya karte thay' ka mafhoom banta hai.",
        "description": "كَانُوا ke baad Fe'l Muzaare aane se (جیسے كَانُوا يَعْمَلُونَ، بِمَا كَانُوا يَكْسِبُونَ) 'Woh kiya karte thay' ka mafhoom banta hai."
      }
    ],
    "examples": [
      {
        "arabic": "إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ كَانَتْ لَهُمْ جَنَّاتُ الْفِرْدَوْسِ نُزُلًا",
        "hinglish": "Beshak jo log imaan laaye aur nek a'maal kiye unke liye Firdaus ke baghaat mehmaan-nawazi hain"
      },
      {
        "arabic": "أُولَٰئِكَ الَّذِينَ اشْتَرَوُا الضَّلَالَةَ بِالْهُدَىٰ فَمَا رَبِحَتْ تِجَارَتُهُمْ وَمَا كَانُوا مُهْتَدِينَ",
        "hinglish": "Yahi woh log hain jinhon ne hidayat ke badle gumraahi khareed li, pas na unki tijarat ne nafa diya aur na woh hidayat paane wale thay"
      },
      {
        "arabic": "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تَتَّبِعُوا خُطُوَاتِ الشَّيْطَانِ",
        "hinglish": "Aye logo jo imaan laaye ho! Shaytan ke qadmon ki pairwi mat karo"
      }
    ]
  },
  "s7l3": {
    "lessonKey": "s7l3",
    "title": "S7L3: Fe'l Maazi ki Teesri Shakl (Jama Mutakallim): ذَهَبْنَا ، كَتَبْنَا ، جَعَلْنَا",
    "badge": "Maazi Mutakallim (فَعَلْنَا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">WAHID (Usne kiya)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">جَعَلَ / أَنْزَلَ / خَلَقَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Bunyadi Fe'l Maazi</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">JAMA MUTAKALLIM (+ نَا : Hamne kiya)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">جَعَلْنَا / أَنْزَلْنَا / خَلَقْنَاكُمْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Hamne banaya / utara / tumhein paida kiya</text>\n  </svg>",
    "prediction": {
      "question": "Jab Fe'l Maazi ke aakhir mein نَا lagta hai (جیسے خَلَقْنَا، أَنْزَلْنَا، جَعَلْنَا) toh iska kya ma'ni banta hai?",
      "options": [
        "'Hamne paida kiya / Hamne naazil kiya / Hamne banaya' (We did)",
        "'Unhon ne paida kiya' (They did)"
      ],
      "correct": 0,
      "explanation": "Bilkul sahi! Fe'l Maazi ke aakhir mein نَا lagne se 'Hamne kiya' (Jama Mutakallim) banta hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "خَلَقَ ← خَلَقْنَا ← خَلَقْنَاكُمْ (Hamne tumhein paida kiya)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "أَنْزَلَ ← أَنْزَلْنَا ← أَنْزَلْنَاهُ (Hamne usey naazil kiya)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "كَانَ ← كُنَّا / إِنَّا كُنَّا (Beshak ham thay)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "Step 1: + نَا se 'Hamne kiya'",
        "desc": "نَا lagne se pehle wala harf saakin ho jata hai: عَبَدَ ← عَبَدْنَا، خَلَقَ ← خَلَقْنَا، قَالَ ← قُلْنَا، كَانَ ← كُنَّا.",
        "description": "نَا lagne se pehle wala harf saakin ho jata hai: عَبَدَ ← عَبَدْنَا، خَلَقَ ← خَلَقْنَا، قَالَ ← قُلْنَا، كَانَ ← كُنَّا."
      },
      {
        "title": "Step 2: Aakhir mein Maf'ooli Zamair (ـكَ، ـكُمْ، ـهُ، ـهُمْ)",
        "desc": "خَلَقْنَاكُمْ (Hamne tumhein paida kiya), رَزَقْنَاهُمْ (Hamne unhein rizq diya), أَنْزَلْنَاهُ (Hamne usey utara).",
        "description": "خَلَقْنَاكُمْ (Hamne tumhein paida kiya), رَزَقْنَاهُمْ (Hamne unhein rizq diya), أَنْزَلْنَاهُ (Hamne usey utara)."
      },
      {
        "title": "Step 3: وَكَذَٰلِكَ جَعَلْنَا aur إِنَّا كُنَّا",
        "desc": "Qur'an Majeed mein Allah Ta'ala apni qudrat, wahi aur ne'maton ka bayan isi shakl mein farmate hain.",
        "description": "Qur'an Majeed mein Allah Ta'ala apni qudrat, wahi aur ne'maton ka bayan isi shakl mein farmate hain."
      }
    ],
    "examples": [
      {
        "arabic": "إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ",
        "hinglish": "Beshak hamne is (Qur'an) ko Shab-e-Qadr mein naazil farmaya"
      },
      {
        "arabic": "وَلَقَدْ خَلَقْنَا الْإِنْسَانَ فِي أَحْسَنِ تَقْوِيمٍ",
        "hinglish": "Aur yaqeenan hamne insaan ko behtareen saakht par paida farmaya"
      },
      {
        "arabic": "وَكَذَٰلِكَ جَعَلْنَاكُمْ أُمَّةً وَسَطًا لِتَكُونُوا شُهَدَاءَ عَلَى النَّاسِ",
        "hinglish": "Aur isi tarah hamne tumhein ek mo'tadil (behtareen) ummat banaya taake tum logon par gawah bano"
      }
    ]
  },
  "s7l4": {
    "lessonKey": "s7l4",
    "title": "S7L4: Fe'l Maazi ki Chauthi Shakl (Jama Muzakkar Mukhaatab): عَبَدَ ← عَبَدْتُمْ",
    "badge": "Maazi Mukhaatab Jama (فَعَلْتُمْ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">WAHID (Usne kiya)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">عَبَدَ / ظَلَمَ / قَالَ / كَانَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Bunyadi Fe'l Maazi</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">JAMA MUKHAATAB (+ تُمْ : Tumne kiya)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">عَبَدْتُمْ / ظَلَمْتُمْ / قُلْتُمْ / كُنْتُمْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Tum logon ne ibaadat ki / kaha / tum thay</text>\n  </svg>",
    "prediction": {
      "question": "بِمَا كُنْتُمْ تَعْمَلُونَ aur إِنْ كُنْتُمْ مُؤْمِنِينَ mein كُنْتُمْ kis fe'l se bana hai aur iska kya ma'ni hai?",
      "options": [
        "كَانَ se bana hai aur ma'ni 'Tum thay / Tum kiya karte thay' hai",
        "كَتَبَ se bana hai aur ma'ni 'Tumne likha' hai"
      ],
      "correct": 0,
      "explanation": "Bilkul durust! كَانَ (woh tha) ke aakhir mein تُمْ lagne se كُنْتُمْ (tum thay) banta hai, aur بِمَا كُنْتُمْ تَعْمَلُونَ ka ma'ni 'uske badle jo tum kiya karte thay' hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "عَبَدَ ← عَبَدْتُمْ / ظَلَمْتُمْ (Tum logon ne ibaadat ki / zulm kiya)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "إِذَا قُمْتُمْ / إِذَا ضَرَبْتُمْ (Jab tum khade ho / safar karo)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "وَإِذْ قُلْتُمْ يَا مُوسَىٰ (Aur jab tumne kaha aye Musa)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "Step 1: + تُمْ se 'Tum logon ne kiya'",
        "desc": "عَبَدَ se عَبَدْتُمْ، قَالَ se قُلْتُمْ، كَانَ se كُنْتُمْ، جَاءَ se جِئْتُمْ.",
        "description": "عَبَدَ se عَبَدْتُمْ، قَالَ se قُلْتُمْ، كَانَ se كُنْتُمْ، جَاءَ se جِئْتُمْ."
      },
      {
        "title": "Step 2: إِذَا aur إِذْ ke Muhaware",
        "desc": "إِذَا قُمْتُمْ إِلَى الصَّلَاةِ (Jab tum namaz ke liye khade ho) aur وَإِذْ قُلْتُمْ (Aur yaad karo jab tumne kaha).",
        "description": "إِذَا قُمْتُمْ إِلَى الصَّلَاةِ (Jab tum namaz ke liye khade ho) aur وَإِذْ قُلْتُمْ (Aur yaad karo jab tumne kaha)."
      },
      {
        "title": "Step 3: إِنْ كُنْتُمْ aur بِمَا كُنْتُمْ تَعْمَلُونَ",
        "desc": "كُنْتُمْ ke baad ism ya fe'l muzaare lag kar Qur'an ke nihayat mash'hoor jumle bante hain.",
        "description": "كُنْتُمْ ke baad ism ya fe'l muzaare lag kar Qur'an ke nihayat mash'hoor jumle bante hain."
      }
    ],
    "examples": [
      {
        "arabic": "كَيْفَ تَكْفُرُونَ بِاللَّهِ وَكُنْتُمْ أَمْوَاتًا فَأَحْيَاكُمْ",
        "hinglish": "Tum Allah ka inkaar kaise karte ho halanke tum be-jaan thay toh Usne tumhein zindagi bakhshi"
      },
      {
        "arabic": "وَإِذْ كُنْتُمْ أَعْدَاءً فَأَلَّفَ بَيْنَ قُلُوبِكُمْ فَأَصْبَحْتُمْ بِنِعْمَتِهِ إِخْوَانًا",
        "hinglish": "Aur yaad karo jab tum aapas mein dushman thay toh Usne tumhare dilon mein ulfat daal di pas tum Uski ne'mat se bhai-bhai ban gaye"
      },
      {
        "arabic": "إِلَى اللَّهِ مَرْجِعُكُمْ جَمِيعًا فَيُنَبِّئُكُمْ بِمَا كُنْتُمْ تَعْمَلُونَ",
        "hinglish": "Allah hi ki taraf tum sab ko laut kar jaana hai, pas woh tumhein bata dega jo kuch tum kiya karte thay"
      }
    ]
  },
  "s7l5": {
    "lessonKey": "s7l5",
    "title": "S7L5: Fe'l Maazi ki Paanchveen Shakl (Wahid Mutakallim): عَبَدَ ← عَبَدْتُ",
    "badge": "Maazi Wahid Mutakallim (فَعَلْتُ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">WAHID GHAIB (Usne kiya)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">عَبَدَ / آمَنَ / خَلَقَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Bunyadi Fe'l Maazi</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">WAHID MUTAKALLIM (+ تُ : Maine kiya)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">عَبَدْتُ / آمَنْتُ / خَلَقْتُكَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Maine ibaadat ki / imaan laya / tujhe paida kiya</text>\n  </svg>",
    "prediction": {
      "question": "إِنِّي آمَنْتُ بِرَبِّكُمْ aur خَلَقْتُكَ mein Taa ke upar Pesh (تُ) kis baat ki nishani hai?",
      "options": [
        "Wahid Mutakallim ('Maine kiya' — I did)",
        "Wahid Mukhaatab ('Tu ne kiya' — You did)"
      ],
      "correct": 0,
      "explanation": "Shabash! Taa par Pesh (تُ) hamesha 'Maine kiya' (I did) ki alamat hai, jabke Taa par Zabar (تَ) 'Tu ne kiya' aur Taa saakin (تْ) 'Us aurat ne kiya' ki alamat hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "عَبَدَ ← عَبَدْتُ / ظَلَمْتُ (Maine ibaadat ki / zulm kiya)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "إِنِّي آمَنْتُ / عَلَيْهِ تَوَكَّلْتُ (Main imaan laya / Maine bharosa kiya)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "خَلَقْتُكَ / عَلَّمْتُكَ / اصْطَفَيْتُكَ (Maine tujhe paida kiya / sikhaya / chuna)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "Step 1: + تُ (Pesh wali Taa) = 'Maine kiya'",
        "desc": "عَبَدْتُ (Maine ibaadat ki), آمَنْتُ (Main imaan laya), تُبْتُ (Maine tauba ki), أَكْمَلْتُ (Maine mukammal kar diya).",
        "description": "عَبَدْتُ (Maine ibaadat ki), آمَنْتُ (Main imaan laya), تُبْتُ (Maine tauba ki), أَكْمَلْتُ (Maine mukammal kar diya)."
      },
      {
        "title": "Step 2: Aakhir mein Maf'ooli Zamair (ـكَ، ـكُمْ، ـهُ، ـهَا، ـهُمْ)",
        "desc": "خَلَقْتُكَ (Maine tujhe paida kiya), جِئْتُكُمْ (Main tumhare paas laya), رَأَيْتُهُمْ (Maine unhein dekha).",
        "description": "خَلَقْتُكَ (Maine tujhe paida kiya), جِئْتُكُمْ (Main tumhare paas laya), رَأَيْتُهُمْ (Maine unhein dekha)."
      },
      {
        "title": "Step 3: Ambiya (A.S.) ki Dua'ein aur Mukalmaat",
        "desc": "Qur'an Majeed mein Hazrat Nuh, Ibrahim, Yusuf, Musa aur Шу'aib (A.S.) ke mukalmaat mein yeh shakl bakasrat aati hai.",
        "description": "Qur'an Majeed mein Hazrat Nuh, Ibrahim, Yusuf, Musa aur Шу'aib (A.S.) ke mukalmaat mein yeh shakl bakasrat aati hai."
      }
    ],
    "examples": [
      {
        "arabic": "الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ وَأَتْمَمْتُ عَلَيْكُمْ نِعْمَتِي وَرَضِيتُ لَكُمُ الْإِسْلَامَ دِينًا",
        "hinglish": "Aaj Maine tumhare liye tumhara deen mukammal kar diya aur tum par Apni ne'mat poori kar di aur Islam ko tumhare liye deen pasand kar liya"
      },
      {
        "arabic": "إِنِّي وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيفًا",
        "hinglish": "Beshak maine apna rukh yaksoo ho kar Us Zaat ki taraf kar liya jisne aasmanon aur zameen ko paida kiya"
      },
      {
        "arabic": "وَأَلْقَيْتُ عَلَيْكَ مَحَبَّةً مِنِّي وَلِتُصْنَعَ عَلَىٰ عَيْنِي",
        "hinglish": "Aur Maine Apni taraf se tujh par muhabbat daal di taake teri parwarish Meri nigah ke saamne ho"
      }
    ]
  },
  "s7l6": {
    "lessonKey": "s7l6",
    "title": "S7L6: Fe'l Maazi ki Chhati Shakl (Wahid Muzakkar Mukhaatab): عَبَدَ ← عَبَدْتَ",
    "badge": "Maazi Wahid Mukhaatab (فَعَلْتَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">WAHID MUTAKALLIM (تُ : Maine)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">عَبَدْتُ / أَنْعَمْتُ / رَأَيْتُ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Taa par Pesh = Maine kiya</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">WAHID MUKHAATAB (+ تَ : Tu ne kiya)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">عَبَدْتَ / أَنْعَمْتَ / أَرَأَيْتَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Taa par Zabar = Tu ne / Aapne kiya</text>\n  </svg>",
    "prediction": {
      "question": "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ aur أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ mein تَ (Taa par Zabar) ka kya mafhoom hai?",
      "options": [
        "'Tu ne / Aapne kiya' (Wahid Muzakkar Mukhaatab — You did)",
        "'Maine kiya' (Wahid Mutakallim — I did)"
      ],
      "correct": 0,
      "explanation": "Bilkul durust! Taa par Zabar (تَ) wahid mukhaatab ('Tu ne / Aapne kiya') ke liye aata hai: أَنْعَمْتَ عَلَيْهِمْ (jin par Tu ne in'aam farmaya), أَرَأَيْتَ (kya aapne dekha)."
    },
    "chips": [
      {
        "role": "root",
        "label": "أَنْعَمْتَ / خَلَقْتَ / أَنْزَلْتَ (Tu ne in'aam kiya / paida kiya / utara)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "أَرَأَيْتَ / أَفَرَأَيْتَ (Kya aapne dekha / ghaur kiya?)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "وَلَئِنِ اتَّبَعْتَ أَهْوَاءَهُمْ (Aur agar aapne unki khwahishon ki pairwi ki)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "Step 1: + تَ (Zabar wali Taa) = 'Tu ne / Aapne kiya'",
        "desc": "Dua'on mein Allah se khitaab (أَنْعَمْتَ، خَلَقْتَ، أَنْزَلْتَ) aur Nabi ﷺ se khitaab (رَأَيْتَ، قَرَأْتَ) isi shakl mein aata hai.",
        "description": "Dua'on mein Allah se khitaab (أَنْعَمْتَ، خَلَقْتَ، أَنْزَلْتَ) aur Nabi ﷺ se khitaab (رَأَيْتَ، قَرَأْتَ) isi shakl mein aata hai."
      },
      {
        "title": "Step 2: أَرَأَيْتَ aur أَفَرَأَيْتَ ka Muhawara",
        "desc": "رَأَيْتَ se pehle sawaal ka أَ lag kar 'Kya aapne dekha / bhala dekho toh!' (Surah Al-Ma'un, Surah Al-'Alaq) banta hai.",
        "description": "رَأَيْتَ se pehle sawaal ka أَ lag kar 'Kya aapne dekha / bhala dekho toh!' (Surah Al-Ma'un, Surah Al-'Alaq) banta hai."
      },
      {
        "title": "Step 3: سَوَاءٌ عَلَيْهِمْ أَأَنْذَرْتَهُمْ",
        "desc": "سَوَاءٌ عَلَيْهِمْ ke baad أَأَنْذَرْتَهُمْ أَمْ لَمْ تُنْذِرْهُمْ ka ma'ni 'khwah aap unhein darayein ya na darayein' hota hai.",
        "description": "سَوَاءٌ عَلَيْهِمْ ke baad أَأَنْذَرْتَهُمْ أَمْ لَمْ تُنْذِرْهُمْ ka ma'ni 'khwah aap unhein darayein ya na darayein' hota hai."
      }
    ],
    "examples": [
      {
        "arabic": "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ",
        "hinglish": "Hamein seedha raasta dikha, un logon ka raasta jin par Tu ne in'aam farmaya"
      },
      {
        "arabic": "رَبَّنَا مَا خَلَقْتَ هَٰذَا بَاطِلًا سُبْحَانَكَ فَقِنَا عَذَابَ النَّارِ",
        "hinglish": "Aye hamare Rabb! Tu ne yeh sab be-maqsad paida nahin kiya, Tu paak hai, pas hamein dozakh ke azaab se bacha"
      },
      {
        "arabic": "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ",
        "hinglish": "Kya aapne us shakhs ko dekha jo jaza ke din ko jhutlata hai? Pas wahi hai jo yateem ko dhakke deta hai"
      }
    ]
  },
  "s7l7": {
    "lessonKey": "s7l7",
    "title": "S7L7: Fe'l Maazi ki Saatveen Shakl (Wahid Mu'annas Ghaib): عَبَدَ ← عَبَدَتْ",
    "badge": "Maazi Mu'annas (فَعَلَتْ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">WAHID MUZAKKAR (عَبَدَ / قَالَ)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">عَبَدَ / قَالَ / حَبِطَ / خَلَا</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Muzakkar Ghaib (Usne kiya)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">WAHID MU'ANNAS (+ تْ : عَبَدَتْ / قَالَتْ)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">قَالَتْ • حَبِطَتْ أَعْمَالُهُمْ • قَدْ خَلَتْ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Saakin Taa (تْ) = Mu'annas / Nafs / Jama</text>\n  </svg>",
    "prediction": {
      "question": "حَبِطَتْ أَعْمَالُهُمْ، كَذَّبَتْ ثَمُودُ aur تِلْكَ أُمَّةٌ قَدْ خَلَتْ mein fe'l ke aakhir mein saakin تْ kyun aaya hai?",
      "options": [
        "Kyunki Arbi mein mu'annas alfaaz (أُمَّةٌ، نَفْسٌ), qom (ثَمُودُ) aur jama mukassar (أَعْمَالُهُمْ) ke liye تْ wali mu'annas shakl aati hai",
        "Kyunki yeh mukhaatab ('Tu ne kiya') ka seegha hai"
      ],
      "correct": 0,
      "explanation": "Bilkul sahi! Saakin تْ (تاء التأنيث) aurat ke alawa نَفْسٌ، أُمَّةٌ، قَرْيَةٌ، السَّاعَةُ aur jama mukassar (أَعْمَالُهُمْ، الرُّسُلُ) ke liye bhi aata hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "قَالَتْ / كَانَتْ / وَضَعَتْ (Us (aurat) ne kaha / woh thi / janam diya)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "عَلِمَتْ نَفْسٌ / بِمَا كَسَبَتْ (Har nafs ne jaan liya / Jo usne kamaya)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "حَبِطَتْ أَعْمَالُهُمْ / كَذَّبَتْ ثَمُودُ (Unke a'maal zaya hue / Samood ne jhutlaya)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "Step 1: Saakin Taa (تْ) ki Pehchaan",
        "desc": "عَبَدَ se عَبَدَتْ، قَالَ se قَالَتْ، كَانَ se كَانَتْ. Agar aage الـ ho toh milane ke liye تِ padha jata hai (قَالَتِ الْمَلَائِكَةُ).",
        "description": "عَبَدَ se عَبَدَتْ، قَالَ se قَالَتْ، كَانَ se كَانَتْ. Agar aage الـ ho toh milane ke liye تِ padha jata hai (قَالَتِ الْمَلَائِكَةُ)."
      },
      {
        "title": "Step 2: Nafs, Ummat, Qaryah aur Qiyamat ke Alfaaz",
        "desc": "عَلِمَتْ نَفْسٌ مَا قَدَّمَتْ وَأَخَّرَتْ، اقْتَرَبَتِ السَّاعَةُ، إِذَا وَقَعَتِ الْوَاقِعَةُ.",
        "description": "عَلِمَتْ نَفْسٌ مَا قَدَّمَتْ وَأَخَّرَتْ، اقْتَرَبَتِ السَّاعَةُ، إِذَا وَقَعَتِ الْوَاقِعَةُ."
      },
      {
        "title": "Step 3: حَبِطَتْ أَعْمَالُهُمْ، كَذَّبَتْ aur قَدْ خَلَتْ",
        "desc": "Jama mukassar (أَعْمَالُهُمْ، الرُّسُلُ) aur aqwaam (ثَمُودُ، عَادٌ) ke saath bhi yahi shakl aati hai.",
        "description": "Jama mukassar (أَعْمَالُهُمْ، الرُّسُلُ) aur aqwaam (ثَمُودُ، عَادٌ) ke saath bhi yahi shakl aati hai."
      }
    ],
    "examples": [
      {
        "arabic": "تِلْكَ أُمَّةٌ قَدْ خَلَتْ لَهَا مَا كَسَبَتْ وَلَكُمْ مَا كَسَبْتُمْ",
        "hinglish": "Woh ek ummat thi jo guzar chuki, uske liye woh hai jo usne kamaya aur tumhare liye woh hai jo tumne kamaya"
      },
      {
        "arabic": "أُولَٰئِكَ الَّذِينَ كَفَرُوا بِآيَاتِ رَبِّهِمْ وَلِقَائِهِ فَحَبِطَتْ أَعْمَالُهُمْ",
        "hinglish": "Yahi woh log hain jinhon ne apne Rabb ki aayaton aur Us-se mulaqat ka inkaar kiya pas unke a'maal zaya ho gaye"
      },
      {
        "arabic": "إِذْ قَالَتِ الْمَلَائِكَةُ يَا مَرْيَمُ إِنَّ اللَّهَ اصْطَفَاكِ وَطَهَّرَكِ",
        "hinglish": "Jab farishton ne kaha: Aye Maryam (A.S.)! Beshak Allah ne tujhe chun liya hai aur tujhe paakiza banaya hai"
      }
    ]
  },
  "s7l8": {
    "lessonKey": "s7l8",
    "title": "S7L8: Fe'l Maazi Majhool Wahid (Bina Nisbat Fe'l Maazi): أَنْزَلَ ← أُنْزِلَ",
    "badge": "Maazi Majhool (فُعِلَ)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">MA'ROOF (Usne kiya)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">أَنْزَلَ / كَتَبَ / خَلَقَ / قَالَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Fa'il ma'loom hai (Active)</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">MAJHOOL (Pesh + Zair : Kiya gaya)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">أُنْزِلَ / كُتِبَ / خُلِقَ / قِيلَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Utara gaya / Farz kiya gaya / Kaha gaya</text>\n  </svg>",
    "prediction": {
      "question": "أَنْزَلَ (usne utara) aur كَتَبَ (usne likha) ko جب أُنْزِلَ aur كُتِبَ banaya jata hai toh kya tabdeeli hoti hai?",
      "options": [
        "Pehle harf par Pesh (ـُ) aur aakhri se pehle harf par Zair (ـِ) aati hai, aur ma'ni 'Utara gaya / Farz kiya gaya' banta hai",
        "Aakhir mein وْا lagta hai aur ma'ni 'Unhon ne likha' banta hai"
      ],
      "correct": 0,
      "explanation": "MashaAllah! Pehle harf par Pesh (ـُ) aur aakhri se pehle harf par Zair (ـِ) lagane se Fe'l Maazi Majhool ('Kiya gaya') banta hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "كَتَبَ ← كُتِبَ عَلَيْكُمُ الصِّيَامُ (Tum par roze farz kiye gaye)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "أَنْزَلَ ← شَهْرُ رَمَضَانَ الَّذِي أُنْزِلَ فِيهِ الْقُرْآنُ (Jismein Qur'an naazil kiya gaya)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "إِذَا الشَّمْسُ كُوِّرَتْ / وَإِذَا السَّمَاءُ كُشِطَتْ (Manazir-e-Qiyamat)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "Step 1: Do Harkaton ki Tabdeeli (Pesh + Zair)",
        "desc": "خَلَقَ ← خُلِقَ (paida kiya gaya), كَتَبَ ← كُتِبَ (farz kiya gaya), أَنْزَلَ ← أُنْزِلَ (utara gaya), قَالَ ← قِيلَ (kaha gaya).",
        "description": "خَلَقَ ← خُلِقَ (paida kiya gaya), كَتَبَ ← كُتِبَ (farz kiya gaya), أَنْزَلَ ← أُنْزِلَ (utara gaya), قَالَ ← قِيلَ (kaha gaya)."
      },
      {
        "title": "Step 2: Ahkaam aur Qiyamat ke Manazir",
        "desc": "كُتِبَ عَلَيْكُمْ، حُرِّمَتْ عَلَيْكُمْ، أُحِلَّ لَكُمْ aur پارہ عمّ ki suraton mein إِذَا الشَّمْسُ كُوِّرَتْ، وَإِذَا الْقُبُورُ بُعْثِرَتْ.",
        "description": "كُتِبَ عَلَيْكُمْ، حُرِّمَتْ عَلَيْكُمْ، أُحِلَّ لَكُمْ aur پارہ عمّ ki suraton mein إِذَا الشَّمْسُ كُوِّرَتْ، وَإِذَا الْقُبُورُ بُعْثِرَتْ."
      },
      {
        "title": "Step 3: لَوْلَا أُنْزِلَ aur وَإِذَا قِيلَ لَهُمْ",
        "desc": "وَقَالُوا لَوْلَا أُنْزِلَ عَلَيْهِ آيَةٌ (Koi nishani kyun na utari gayi?) aur وَإِذَا قِيلَ لَهُمْ (Aur jab unse kaha jata hai).",
        "description": "وَقَالُوا لَوْلَا أُنْزِلَ عَلَيْهِ آيَةٌ (Koi nishani kyun na utari gayi?) aur وَإِذَا قِيلَ لَهُمْ (Aur jab unse kaha jata hai)."
      }
    ],
    "examples": [
      {
        "arabic": "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِنْ قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ",
        "hinglish": "Aye imaan walo! Tum par roze farz kiye gaye jaise tumse pehle logon par farz kiye gaye thay taake tum taqwa ikhtiyar karo"
      },
      {
        "arabic": "وَإِذَا قُرِئَ الْقُرْآنُ فَاسْتَمِعُوا لَهُ وَأَنْصِتُوا لَعَلَّكُمْ تُرْحَمُونَ",
        "hinglish": "Aur jab Qur'an padha jaye toh usey ghaur se suno aur khamosh raho taake tum par reham kiya jaye"
      },
      {
        "arabic": "وَإِذَا قِيلَ لَهُمْ لَا تُفْسِدُوا فِي الْأَرْضِ قَالُوا إِنَّمَا نَحْنُ مُصْلِحُونَ",
        "hinglish": "Aur jab unse kaha jata hai ke zameen mein fasaad na phailao toh woh kehte hain ke ham toh sirf islaah karne wale hain"
      }
    ]
  },
  "s7l9": {
    "lessonKey": "s7l9",
    "title": "S7L9: Fe'l Maazi Majhool Jama: أُخْرِجَ ← أُخْرِجُوا ، الَّذِينَ أُوتُوا الْكِتَابَ",
    "badge": "Majhool Jama (فُعِلُوا)",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">MAJHOOL WAHID (Usey ... gaya)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">أُخْرِجَ / قُتِلَ / ذُكِّرَ / أُوتِيَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Usey nikala / qatl kiya / diya gaya</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">MAJHOOL JAMA (+ وْا : Unhein ... gaya)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">أُخْرِجُوا • قُتِلُوا • الَّذِينَ أُوتُوا الْكِتَابَ</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Unhein nikala gaya • Jinhein Kitaab di gayi</text>\n  </svg>",
    "prediction": {
      "question": "الَّذِينَ أُخْرِجُوا مِنْ دِيَارِهِمْ aur الَّذِينَ أُوتُوا الْكِتَابَ mein أُخْرِجُوا aur أُوتُوا ka kya mafhoom hai?",
      "options": [
        "'Jinhein nikala gaya' aur 'Jinhein (Kitaab) di gayi' (Passive Past Plural)",
        "'Jinhon ne nikala' aur 'Jinhon ne diya' (Active Past Plural)"
      ],
      "correct": 0,
      "explanation": "Bilkul sahi! أُخْرِجَ (usey nikala gaya) se أُخْرِجُوا (unhein nikala gaya) aur أُوتِيَ (usey diya gaya) se أُوتُوا (unhein diya gaya) banta hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "أُخْرِجَ ← أُخْرِجُوا مِنْ دِيَارِهِمْ (Jinhein unke gharon se nikala gaya)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "قُتِلَ ← وَالَّذِينَ قُتِلُوا فِي سَبِيلِ اللَّهِ (Jo Allah ki raah mein shaheed kiye gaye)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "ذُكِّرَ ← إِذَا ذُكِّرُوا بِهَا (Jab unhein naseehat ki jati hai)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "Step 1: Maazi Majhool + وْا = 'Unhein ... kiya gaya'",
        "desc": "أُخْرِجَ ← أُخْرِجُوا، قُتِلَ ← قُتِلُوا، ذُكِّرَ ← ذُكِّرُوا، حُمِّلَ ← حُمِّلُوا، أُغْرِقَ ← أُغْرِقُوا.",
        "description": "أُخْرِجَ ← أُخْرِجُوا، قُتِلَ ← قُتِلُوا، ذُكِّرَ ← ذُكِّرُوا، حُمِّلَ ← حُمِّلُوا، أُغْرِقَ ← أُغْرِقُوا."
      },
      {
        "title": "Step 2: Khaas Muhawara — الَّذِينَ أُوتُوا الْكِتَابَ / الْعِلْمَ",
        "desc": "أُوتُوا (unhein diya gaya) Qur'an Majeed mein Ahl-e-Kitaab aur Ahl-e-Ilm ke zikr mein bakasrat aata hai.",
        "description": "أُوتُوا (unhein diya gaya) Qur'an Majeed mein Ahl-e-Kitaab aur Ahl-e-Ilm ke zikr mein bakasrat aata hai."
      },
      {
        "title": "Step 3: أَلَمْ تَرَ إِلَى الَّذِينَ أُوتُوا نَصِيبًا مِنَ الْكِتَابِ",
        "desc": "Unit 6 ke muhaware أَلَمْ تَرَ ke saath أُوتُوا نَصِيبًا مِنَ الْكِتَابِ mil kar lambi aayatein aasan kar deta hai.",
        "description": "Unit 6 ke muhaware أَلَمْ تَرَ ke saath أُوتُوا نَصِيبًا مِنَ الْكِتَابِ mil kar lambi aayatein aasan kar deta hai."
      }
    ],
    "examples": [
      {
        "arabic": "الَّذِينَ أُخْرِجُوا مِنْ دِيَارِهِمْ بِغَيْرِ حَقٍّ إِلَّا أَنْ يَقُولُوا رَبُّنَا اللَّهُ",
        "hinglish": "Woh log jinhein unke gharon se na-haq nikala gaya sirf is baat par ke woh kehte hain hamara Rabb Allah hai"
      },
      {
        "arabic": "وَالَّذِينَ قُتِلُوا فِي سَبِيلِ اللَّهِ فَلَنْ يُضِلَّ أَعْمَالَهُمْ",
        "hinglish": "Aur jo log Allah ki raah mein shaheed kiye gaye toh Allah unke a'maal hargiz zaya na karega"
      },
      {
        "arabic": "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنْكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ",
        "hinglish": "Allah tum mein se imaan laane walon ke aur jinhein ilm diya gaya hai unke darje buland farmata hai"
      }
    ]
  },
  "s7l10": {
    "lessonKey": "s7l10",
    "title": "S7L10: Fe'l Maazi se Munsalik 10 Khaas Qur'ani Asaleeb aur Muhaware",
    "badge": "10 Maazi Asaleeb",
    "svgOriginal": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#e2e8f0\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#64748b\" text-anchor=\"middle\">SHART WA SABAB (لَوْ / لَوْلَا / فَإِنْ / بِمَا)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"28\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-root\">لَوْلَا فَضْلُ اللَّهِ • فَإِنْ تَوَلَّوْا • ذَٰلِكَ بِمَا</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#dc2626\" text-anchor=\"middle\" class=\"v-vowel\">Agar na hota • Agar woh phir jayein • Is sabab se ke</text>\n  </svg>",
    "svgTransformed": "<svg viewBox=\"0 0 360 160\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc; border-radius:10px;\">\n    <rect x=\"20\" y=\"20\" width=\"320\" height=\"120\" rx=\"12\" fill=\"#ffffff\" stroke=\"#059669\" stroke-width=\"2\"/>\n    <text x=\"180\" y=\"50\" font-size=\"13\" font-weight=\"700\" fill=\"#059669\" text-anchor=\"middle\">MUWAZANA WA HAQEEQAT (أَفَمَنْ...كَمَنْ / إِنَّهُ)</text>\n    <text x=\"180\" y=\"95\" font-family=\"'Traditional Arabic', serif\" font-size=\"26\" fill=\"#0f172a\" text-anchor=\"middle\" class=\"v-suffix\">أَفَمَنْ كَانَ مُؤْمِنًا كَمَنْ كَانَ فَاسِقًا</text>\n    <text x=\"180\" y=\"125\" font-size=\"12\" font-weight=\"600\" fill=\"#059669\" text-anchor=\"middle\" class=\"v-vowel\">Sawaliya Muwazana • ابْتِغَاءَ • إِنَّهُ لَا يُفْلِحُ</text>\n  </svg>",
    "prediction": {
      "question": "أَفَمَنْ كَانَ مُؤْمِنًا كَمَنْ كَانَ فَاسِقًا لَا يَسْتَوُونَ mein أَفَمَنْ ... كَمَنْ ka usloob kis maqsad ke liye aata hai?",
      "options": [
        "Do mutazaad rawaiyyon ke sawaliya muwazane ('Kya toh woh jo... uski tarah ho sakta hai jo...?') ke liye",
        "Sirf maazi ki nafi karne ke liye"
      ],
      "correct": 0,
      "explanation": "Bilkul durust! أَفَمَنْ (Kya toh woh jo...) aur كَمَنْ (us shakhs ki tarah ho sakta hai jo...) Qur'an Majeed ka khaas sawaliya muwazana hai."
    },
    "chips": [
      {
        "role": "root",
        "label": "لَوْ أَنْزَلْنَا / وَلَوْلَا فَضْلُ اللَّهِ (Agar ham utarte / Agar Allah ka fazl na hota)",
        "targetId": "v-root"
      },
      {
        "role": "suffix",
        "label": "فَإِنْ تَوَلَّوْا / ذَٰلِكَ بِمَا قَدَّمَتْ (Agar woh phir jayein / Yeh tumhare kiye ke sabab hai)",
        "targetId": "v-suffix"
      },
      {
        "role": "vowel",
        "label": "أَفَمَنْ كَانَ مُؤْمِنًا كَمَنْ كَانَ فَاسِقًا (Kya momin faasiq jaisa ho sakta hai?)",
        "targetId": "v-vowel"
      }
    ],
    "steps": [
      {
        "title": "Step 1: Shartiyyah Asaleeb (لَوْ، لَوْلَا، فَإِنْ تَوَلَّوْا، مَنْ جَاءَ/أُوتِيَ، وَلَوْ أَنَّهُمْ)",
        "desc": "لَوْ aur لَوْلَا ke jawab mein لَـ يا مَا aata hai (لَوْلَا فَضْلُ اللَّهِ... لَاتَّبَعْتُمْ), aur فَإِنْ/مَنْ ke jawab mein فَـ aata hai.",
        "description": "لَوْ aur لَوْلَا ke jawab mein لَـ يا مَا aata hai (لَوْلَا فَضْلُ اللَّهِ... لَاتَّبَعْتُمْ), aur فَإِنْ/مَنْ ke jawab mein فَـ aata hai."
      },
      {
        "title": "Step 2: Sabab aur Misal ke Asaleeb (ذَٰلِكَ بِمَا، كَذَٰلِكَ، ابْتِغَاءَ)",
        "desc": "ذَٰلِكَ بِمَا كَفَرُوا (yeh is liye ke unhon ne kufr kiya) aur ابْتِغَاءَ مَرْضَاتِ اللَّهِ (Allah ki raza ki talash mein).",
        "description": "ذَٰلِكَ بِمَا كَفَرُوا (yeh is liye ke unhon ne kufr kiya) aur ابْتِغَاءَ مَرْضَاتِ اللَّهِ (Allah ki raza ki talash mein)."
      },
      {
        "title": "Step 3: Muwazana (أَفَمَنْ...كَمَنْ) aur Attal Haqeeqat (إِنَّهُ لَا يُفْلِحُ)",
        "desc": "أَفَمَنْ ... كَمَنْ do kirdaron ka muwazana karta hai, aur إِنَّهُ / فَإِنَّهَا attal haqeeqat bayan karta hai.",
        "description": "أَفَمَنْ ... كَمَنْ do kirdaron ka muwazana karta hai, aur إِنَّهُ / فَإِنَّهَا attal haqeeqat bayan karta hai."
      }
    ],
    "examples": [
      {
        "arabic": "وَلَوْلَا فَضْلُ اللَّهِ عَلَيْكُمْ وَرَحْمَتُهُ مَا زَكَىٰ مِنْكُمْ مِنْ أَحَدٍ أَبَدًا",
        "hinglish": "Aur agar tum par Allah ka fazl aur Uski rahmat na hoti toh tum mein se koi ek bhi kabhi paak na ho sakta"
      },
      {
        "arabic": "أَفَمَنْ كَانَ مُؤْمِنًا كَمَنْ كَانَ فَاسِقًا لَا يَسْتَوُونَ",
        "hinglish": "Kya toh jo shakhs momin ho us shakhs ki tarah ho sakta hai jo naafarman ho? Woh barabar nahin ho sakte"
      },
      {
        "arabic": "وَالَّذِينَ صَبَرُوا ابْتِغَاءَ وَجْهِ رَبِّهِمْ وَأَقَامُوا الصَّلَاةَ",
        "hinglish": "Aur jin logon ne apne Rabb ki raza talash karne ki khatir sabr kiya aur namaz qaim ki"
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