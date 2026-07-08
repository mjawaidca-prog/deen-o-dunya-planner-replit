/**
 * ISLAMIC_TERMS — a curated multilingual glossary of common Quran / Hadith
 * terminology and proper nouns, used to power "quick search" chips across
 * the Quran and Hadith search screens.
 *
 * en  — English word/phrase as it usually appears in English translations
 * ar  — Arabic script term as it appears in the Arabic Quran/Hadith text
 * ur  — Urdu script term as it appears in Urdu translations
 * transliteration — common Latin transliteration (e.g. "Salah", "Isa")
 */
export interface IslamicTerm {
  id: string;
  category: 'worship' | 'prophet' | 'concept' | 'place' | 'angel';
  en: string;
  ar: string;
  ur: string;
  transliteration?: string;
}

export const ISLAMIC_TERMS: IslamicTerm[] = [
  { id: 'prayer',      category: 'worship', en: 'prayer',      ar: 'الصلاة',   ur: 'نماز',   transliteration: 'Salah' },
  { id: 'fasting',     category: 'worship', en: 'fasting',     ar: 'الصيام',   ur: 'روزہ',   transliteration: 'Sawm' },
  { id: 'charity',     category: 'worship', en: 'charity',     ar: 'الزكاة',   ur: 'زکوٰۃ',  transliteration: 'Zakat' },
  { id: 'pilgrimage',  category: 'worship', en: 'pilgrimage',  ar: 'الحج',     ur: 'حج',     transliteration: 'Hajj' },
  { id: 'faith',       category: 'concept', en: 'faith',       ar: 'الإيمان',  ur: 'ایمان',  transliteration: 'Iman' },
  { id: 'patience',    category: 'concept', en: 'patience',    ar: 'الصبر',    ur: 'صبر',    transliteration: 'Sabr' },
  { id: 'mercy',       category: 'concept', en: 'mercy',       ar: 'الرحمة',   ur: 'رحمت',   transliteration: 'Rahmah' },
  { id: 'forgiveness', category: 'concept', en: 'forgiveness', ar: 'المغفرة',  ur: 'معافی',  transliteration: 'Maghfirah' },
  { id: 'repentance',  category: 'concept', en: 'repentance',  ar: 'التوبة',   ur: 'توبہ',   transliteration: 'Tawbah' },
  { id: 'paradise',    category: 'place',   en: 'paradise',    ar: 'الجنة',    ur: 'جنت',    transliteration: 'Jannah' },
  { id: 'hellfire',    category: 'place',   en: 'hellfire',    ar: 'جهنم',     ur: 'جہنم',   transliteration: 'Jahannam' },
  { id: 'knowledge',   category: 'concept', en: 'knowledge',   ar: 'العلم',    ur: 'علم',    transliteration: 'Ilm' },
  { id: 'justice',     category: 'concept', en: 'justice',     ar: 'العدل',    ur: 'انصاف',  transliteration: 'Adl' },
  { id: 'guidance',    category: 'concept', en: 'guidance',    ar: 'الهدى',    ur: 'ہدایت',  transliteration: 'Huda' },
  { id: 'gratitude',   category: 'concept', en: 'gratitude',   ar: 'الشكر',    ur: 'شکر',    transliteration: 'Shukr' },
  { id: 'truth',       category: 'concept', en: 'truth',       ar: 'الحق',     ur: 'حق',     transliteration: 'Haqq' },
  { id: 'orphan',      category: 'concept', en: 'orphan',      ar: 'اليتيم',   ur: 'یتیم',   transliteration: 'Yateem' },
  { id: 'judgment',    category: 'concept', en: 'day of judgment', ar: 'يوم القيامة', ur: 'روزِ قیامت', transliteration: 'Qiyamah' },
  { id: 'satan',       category: 'concept', en: 'Satan',       ar: 'الشيطان',  ur: 'شیطان',  transliteration: 'Shaytan' },
  { id: 'gabriel',     category: 'angel',   en: 'Gabriel',     ar: 'جبريل',    ur: 'جبرائیل', transliteration: 'Jibreel' },
  { id: 'angels',      category: 'angel',   en: 'angels',      ar: 'الملائكة', ur: 'فرشتے',  transliteration: 'Malaika' },
  { id: 'adam',        category: 'prophet', en: 'Adam',        ar: 'آدم',      ur: 'آدم',    transliteration: 'Adam' },
  { id: 'noah',        category: 'prophet', en: 'Noah',        ar: 'نوح',      ur: 'نوح',    transliteration: 'Nuh' },
  { id: 'abraham',     category: 'prophet', en: 'Abraham',     ar: 'إبراهيم',  ur: 'ابراہیم', transliteration: 'Ibrahim' },
  { id: 'joseph',      category: 'prophet', en: 'Joseph',      ar: 'يوسف',     ur: 'یوسف',   transliteration: 'Yusuf' },
  { id: 'moses',       category: 'prophet', en: 'Moses',       ar: 'موسى',     ur: 'موسیٰ',  transliteration: 'Musa' },
  { id: 'david',       category: 'prophet', en: 'David',       ar: 'داود',     ur: 'داؤد',   transliteration: 'Dawud' },
  { id: 'solomon',     category: 'prophet', en: 'Solomon',     ar: 'سليمان',   ur: 'سلیمان', transliteration: 'Sulaiman' },
  { id: 'mary',        category: 'prophet', en: 'Mary',        ar: 'مريم',     ur: 'مریم',   transliteration: 'Maryam' },
  { id: 'jesus',       category: 'prophet', en: 'Jesus',       ar: 'عيسى',     ur: 'عیسیٰ',  transliteration: 'Isa' },
  { id: 'muhammad',    category: 'prophet', en: 'Muhammad',    ar: 'محمد',     ur: 'محمد',   transliteration: 'Muhammad (SAW)' },
];
