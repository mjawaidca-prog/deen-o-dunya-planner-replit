export interface AudioTranslator {
  id: string;
  name: string;
  arabicName: string;
  language: 'en' | 'ur' | 'none';
  /** Islamic Network CDN edition string, empty string means no audio translation */
  edition: string;
}

export const AUDIO_TRANSLATORS: AudioTranslator[] = [
  {
    id: 'none',
    name: 'None (Arabic Only)',
    arabicName: 'بدون ترجمة',
    language: 'none',
    edition: '',
  },
  {
    id: 'ahmedali',
    name: 'Ahmed Ali (English)',
    arabicName: 'أحمد علي',
    language: 'en',
    edition: 'en.ahmedali',
  },
  {
    id: 'pickthall',
    name: 'Pickthall (English)',
    arabicName: 'بيكثال',
    language: 'en',
    edition: 'en.pickthall',
  },
  {
    id: 'maududi',
    name: 'Maududi (Urdu)',
    arabicName: 'مودودی',
    language: 'ur',
    edition: 'ur.maududi',
  },
  {
    id: 'jalandhry',
    name: 'Jalandhry (Urdu)',
    arabicName: 'جالندھری',
    language: 'ur',
    edition: 'ur.jalandhry',
  },
];

export const DEFAULT_AUDIO_TRANSLATOR = AUDIO_TRANSLATORS[0]; // None

// ─── Quran ayah counts per surah (1-indexed, 114 surahs) ─────────────────────
const SURAH_AYAH_COUNTS: number[] = [
  7, 286, 200, 176, 120, 165, 206,  75, 129, 109,
  123, 111,  43,  52,  99, 128, 111, 110,  98, 135,
  112,  78, 118,  64,  77, 227,  93,  88,  69,  60,
   34,  30,  73,  54,  45,  83, 182,  88,  75,  85,
   54,  53,  89,  59,  37,  35,  38,  29,  18,  45,
   60,  49,  62,  55,  78,  96,  29,  22,  24,  13,
   14,  11,  11,  18,  12,  12,  30,  52,  52,  44,
   28,  28,  20,  56,  40,  31,  50,  40,  46,  42,
   29,  19,  36,  25,  43,  68,  16,  60,  10,  15,
   19,  71,  11,  11,   8,  20,   5,   8,   8,  11,
   11,   8,   3,   9,   5,   4,   7,   3,   6,   3,
    5,   4,   5,   6,
];

/**
 * Convert surah number (1–114) + ayah number to global ayah number (1–6236).
 * Used by the Islamic Network CDN audio URL.
 */
export function globalAyahNumber(surah: number, ayah: number): number {
  let offset = 0;
  for (let s = 1; s < surah; s++) {
    offset += SURAH_AYAH_COUNTS[s - 1] ?? 0;
  }
  return offset + ayah;
}

/**
 * Returns the CDN audio URL for a spoken translation, or null when edition is empty.
 * URL pattern: https://cdn.islamic.network/quran/audio/64/{edition}/{globalAyahNumber}.mp3
 */
export function getAudioTranslationUrl(
  edition: string,
  surah: number,
  ayah: number,
): string | null {
  if (!edition) return null;
  const num = globalAyahNumber(surah, ayah);
  return `https://cdn.islamic.network/quran/audio/64/${edition}/${num}.mp3`;
}
