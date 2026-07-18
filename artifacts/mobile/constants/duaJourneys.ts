export interface MoodEntry {
  mood_id: string;
  emoji: string;
  mood_text: { en: string; ur: string; ar: string };
  dua_arabic: string;
  dua_translation: { en: string; ur: string; ar?: string };
  /** Pastel background pair for the card [light, dark] */
  palette: [string, string];
}

export const DUA_JOURNEYS: MoodEntry[] = [
  {
    mood_id: 'anxious',
    emoji: '😟',
    mood_text: { en: 'Anxious', ur: 'پریشان', ar: 'قلق' },
    dua_arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    dua_translation: {
      en: 'Sufficient for us is Allah, and He is the best Disposer of affairs.',
      ur: 'ہمارے لیے اللہ کافی ہے، اور وہ بہترین کارساز ہے۔',
      ar: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    },
    palette: ['#E8F4FD', '#B8D9F0'],
  },
  {
    mood_id: 'sad',
    emoji: '😢',
    mood_text: { en: 'Sad', ur: 'غمگین', ar: 'حزين' },
    dua_arabic: 'إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللَّهِ',
    dua_translation: {
      en: 'I only complain of my suffering and my grief to Allah.',
      ur: 'میں اپنی پریشانی اور غم صرف اللہ سے بیان کرتا ہوں۔',
      ar: 'إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللَّهِ',
    },
    palette: ['#EEF0FF', '#C5CCF8'],
  },
  {
    mood_id: 'grateful',
    emoji: '🤲',
    mood_text: { en: 'Grateful', ur: 'شکر گزار', ar: 'شاكر' },
    dua_arabic: 'الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ',
    dua_translation: {
      en: 'All praise is due to Allah, by whose grace good deeds are completed.',
      ur: 'تمام تعریفیں اللہ کے لیے ہیں، جس کی نعمت سے اچھے کام مکمل ہوتے ہیں۔',
      ar: 'الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ',
    },
    palette: ['#EDF7EE', '#BBE5BC'],
  },
  {
    mood_id: 'exam_prep',
    emoji: '📚',
    mood_text: { en: 'Exam Prep', ur: 'امتحان کی تیاری', ar: 'الاستعداد للامتحان' },
    dua_arabic: 'رَبِّ زِدْنِي عِلْمًا',
    dua_translation: {
      en: 'My Lord, increase me in knowledge.',
      ur: 'اے میرے رب، مجھے علم میں اضافہ فرما۔',
      ar: 'رَبِّ زِدْنِي عِلْمًا',
    },
    palette: ['#FFF8E8', '#F5DFA0'],
  },
  {
    mood_id: 'seeking_forgiveness',
    emoji: '📿',
    mood_text: { en: 'Seeking Forgiveness', ur: 'استغفار', ar: 'طلب المغفرة' },
    dua_arabic:
      'أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ',
    dua_translation: {
      en: 'I seek forgiveness from Allah, whom there is no deity except Him, the Ever-Living, the Sustainer, and I repent to Him.',
      ur: 'میں اللہ سے مغفرت طلب کرتا ہوں جس کے سوا کوئی معبود نہیں، وہ زندہ ہے، قائم رہنے والا ہے اور میں اسی کی طرف رجوع کرتا ہوں۔',
      ar: 'أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ',
    },
    palette: ['#F9EEF7', '#E8C6E3'],
  },
];

export type Language = 'en' | 'ur' | 'ar';

export const JOURNEY_UI = {
  header: {
    en: 'How are you feeling today?',
    ur: 'آج آپ کیسا محسوس کر رہے ہیں؟',
    ar: 'كيف تشعر اليوم؟',
  },
  breathe: {
    en: 'Take a deep breath...',
    ur: 'لمبی سانس لیں...',
    ar: 'خذ نفسًا عميقًا...',
  },
  playAudio: {
    en: 'Play Audio',
    ur: 'آڈیو چلائیں',
    ar: 'تشغيل الصوت',
  },
  pauseAudio: {
    en: 'Pause Audio',
    ur: 'آڈیو روکیں',
    ar: 'إيقاف مؤقت',
  },
  back: {
    en: 'Back',
    ur: 'واپس جائیں',
    ar: 'العودة',
  },
} as const;
