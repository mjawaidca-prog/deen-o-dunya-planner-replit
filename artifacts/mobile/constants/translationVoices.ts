/**
 * Translation audio voices — per-ayah audio in non-Arabic languages.
 * All folders verified live on everyayah.com.
 * URL format: https://everyayah.com/data/{folder}/{surah3}{ayah3}.mp3
 */

export interface TranslationVoice {
  id: string;
  lang: 'en' | 'ur';
  langLabel: string;
  name: string;
  sub: string;
  folder: string;
}

export const TRANSLATION_VOICES: TranslationVoice[] = [
  {
    id: 'en_sahih_ibrahim',
    lang: 'en',
    langLabel: 'English',
    name: 'Sahih International',
    sub: 'Clear modern English • Ibrahim Walk',
    folder: 'English/Sahih_Intnl_Ibrahim_Walk_192kbps',
  },
  {
    id: 'shamshad_ali',
    lang: 'ur',
    langLabel: 'اردو',
    name: 'Shamshad Ali Khan',
    sub: 'اردو ترجمہ',
    folder: 'translations/urdu_shamshad_ali_khan_46kbps',  // verified 200
  },
  {
    id: 'farhat_hashmi',
    lang: 'ur',
    langLabel: 'اردو',
    name: 'Farhat Hashmi',
    sub: 'اردو لفظی ترجمہ',
    folder: 'translations/urdu_farhat_hashmi',              // verified 200
  },
];

/** Pad a number to 3 digits: 1 → "001" */
const p3 = (n: number) => String(n).padStart(3, '0');

/** Build the everyayah.com URL for a translation voice */
export function translationAudioUrl(
  voice: TranslationVoice,
  surah: number,
  ayah: number,
): string {
  return `https://everyayah.com/data/${voice.folder}/${p3(surah)}${p3(ayah)}.mp3`;
}
