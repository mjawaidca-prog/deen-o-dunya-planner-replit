export interface AudioTranslator {
  id: string;
  name: string;
  arabicName: string;
  /**
   * BCP-47 language tag used for Google TTS (e.g. "en", "ur").
   * "none" means no spoken translation — Arabic recitation only.
   */
  language: 'en' | 'ur' | 'none';
}

export const AUDIO_TRANSLATORS: AudioTranslator[] = [
  {
    id: 'none',
    name: 'None (Arabic Only)',
    arabicName: 'بدون ترجمة',
    language: 'none',
  },
  {
    id: 'en',
    name: 'English',
    arabicName: 'الترجمة الإنجليزية',
    language: 'en',
  },
  {
    id: 'ur',
    name: 'Urdu اردو',
    arabicName: 'الترجمة الأردية',
    language: 'ur',
  },
];

export const DEFAULT_AUDIO_TRANSLATOR = AUDIO_TRANSLATORS[0]; // None
