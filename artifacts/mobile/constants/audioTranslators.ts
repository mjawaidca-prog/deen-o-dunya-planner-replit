export interface AudioTranslator {
  id: string;
  name: string;
  arabicName: string;
  /**
   * Which translation text field to display on screen.
   * "none" = Arabic only, no translation shown/played.
   */
  language: 'en' | 'ur' | 'none';
  /**
   * EveryAyah CDN folder path used to build per-ayah audio URLs.
   * e.g. "English/Sahih_Intnl_Ibrahim_Walk_192kbps"
   * Undefined for the "none" option.
   */
  everyAyahFolder?: string;
}

/** Build a verse-by-verse translation audio URL from EveryAyah. */
export function getTranslationAudioUrl(
  folder: string,
  surahNumber: number,
  ayahNumber: number,
): string {
  const s = String(surahNumber).padStart(3, '0');
  const a = String(ayahNumber).padStart(3, '0');
  return `https://www.everyayah.com/data/${folder}/${s}${a}.mp3`;
}

export const AUDIO_TRANSLATORS: AudioTranslator[] = [
  {
    id: 'none',
    name: 'None (Arabic Only)',
    arabicName: 'بدون ترجمة',
    language: 'none',
  },
  {
    id: 'en-walk',
    name: 'English – Ibrahim Walk',
    arabicName: 'الترجمة الإنجليزية',
    language: 'en',
    everyAyahFolder: 'English/Sahih_Intnl_Ibrahim_Walk_192kbps',
  },
  {
    id: 'ur-farhat',
    name: 'Urdu – Farhat Hashmi',
    arabicName: 'اردو – فرحت ہاشمی',
    language: 'ur',
    everyAyahFolder: 'translations/urdu_farhat_hashmi',
  },
  {
    id: 'ur-shamshad',
    name: 'Urdu – Shamshad Ali Khan',
    arabicName: 'اردو – شمشاد علی خان',
    language: 'ur',
    everyAyahFolder: 'translations/urdu_shamshad_ali_khan_46kbps',
  },
];

export const DEFAULT_AUDIO_TRANSLATOR = AUDIO_TRANSLATORS[0]; // None
