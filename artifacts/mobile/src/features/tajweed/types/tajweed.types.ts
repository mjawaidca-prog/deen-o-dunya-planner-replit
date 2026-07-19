/**
 * Tajweed rule categories for visual color-coding
 */
export enum TajweedRule {
  NONE = 'none',
  IKHFA = 'ikhfa',       // Green  - hidden nasalization
  QALQALAH = 'qalqalah', // Blue   - bouncing sound
  MADD = 'madd',         // Red    - prolongation
  GUNNAH = 'gunnah',     // Orange - nasalization
  IDGHAAM = 'idghaam',   // Purple - merging
  IZHAAR = 'izhaar',     // Yellow - clear pronunciation
}

/**
 * Single item in a lesson (one letter or word)
 */
export interface QaidaItem {
  id: string;               // Unique: "L1_I001", "L3_W005"
  text: string;             // Arabic text
  transliteration: string;  // Latin
  audioFileName: string;    // "l1_alif.mp3"
  descriptionEn: string;
  descriptionUr: string;
  tajweedRule: TajweedRule;
  isCompound: boolean;      // false = single letter, true = word/phrase
}

/**
 * One of the 17 Noorani Qaida lessons
 */
export interface QaidaLesson {
  id: number;           // 1–17
  titleEn: string;
  titleUr: string;
  subtitleEn: string;
  subtitleUr: string;
  descriptionEn: string;
  descriptionUr: string;
  items: QaidaItem[];
  gridColumns: number;  // 1, 2, 3, 4, or 5
  hasAudio: boolean;
}

/**
 * Audio playback state
 */
export interface AudioState {
  isPlaying: boolean;
  currentItemId: string | null;
  isLoading: boolean;
  error: string | null;
}
