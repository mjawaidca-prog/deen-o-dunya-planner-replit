import { QaidaLesson, TajweedRule } from '../types/tajweed.types';

export const getAudioPath = (_fileName: string): any => {
  // Placeholder — drop real MP3s into assets/audio/qaida/ and change to:
  // return require(`../../../assets/audio/qaida/${fileName}`);
  return null;
};

export const qaidaLessons: QaidaLesson[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 1 — Individual Letters (29 items)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 1,
    titleEn: 'Lesson 1: Individual Letters',
    titleUr: 'سبق ۱: مفردات',
    subtitleEn: 'The Arabic Alphabet',
    subtitleUr: 'عربی حروف تہجی',
    descriptionEn: 'Learn the 29 Arabic letters with their correct pronunciation (Makhraj).',
    descriptionUr: '29 عربی حروف کو ان کے صحیح مخارج کے ساتھ سیکھیں۔',
    gridColumns: 5,
    hasAudio: false,
    items: [
      { id:'L1_I001', text:'ا', transliteration:'Alif',    audioFileName:'l1_alif.mp3',    descriptionEn:'Alif – Throat letter, open sound',      descriptionUr:'الف – حلقی حرف',    tajweedRule:TajweedRule.MADD,     isCompound:false },
      { id:'L1_I002', text:'ب', transliteration:'Baa',     audioFileName:'l1_baa.mp3',     descriptionEn:'Baa – Lip letter with slight bounce',   descriptionUr:'با – لبی حرف',      tajweedRule:TajweedRule.QALQALAH, isCompound:false },
      { id:'L1_I003', text:'ت', transliteration:'Taa',     audioFileName:'l1_taa.mp3',     descriptionEn:'Taa – Tongue tip to upper teeth',       descriptionUr:'تا – زبان کا حرف',  tajweedRule:TajweedRule.NONE,     isCompound:false },
      { id:'L1_I004', text:'ث', transliteration:'Thaa',    audioFileName:'l1_thaa.mp3',    descriptionEn:'Thaa – Tongue between teeth',           descriptionUr:'ثا – دانتوں کا حرف', tajweedRule:TajweedRule.NONE,    isCompound:false },
      { id:'L1_I005', text:'ج', transliteration:'Jeem',    audioFileName:'l1_jeem.mp3',    descriptionEn:'Jeem – Middle of tongue to palate',     descriptionUr:'جیم – تالو کا حرف', tajweedRule:TajweedRule.QALQALAH, isCompound:false },
      { id:'L1_I006', text:'ح', transliteration:'Haa',     audioFileName:'l1_haa.mp3',     descriptionEn:'Haa – Deep throat letter',              descriptionUr:'حا – حلقی حرف',     tajweedRule:TajweedRule.IZHAAR,   isCompound:false },
      { id:'L1_I007', text:'خ', transliteration:'Khaa',    audioFileName:'l1_khaa.mp3',    descriptionEn:'Khaa – Upper throat',                   descriptionUr:'خا – حلقی حرف',     tajweedRule:TajweedRule.NONE,     isCompound:false },
      { id:'L1_I008', text:'د', transliteration:'Daal',    audioFileName:'l1_daal.mp3',    descriptionEn:'Daal – Tongue tip to upper gums',       descriptionUr:'دال – زبان کا حرف', tajweedRule:TajweedRule.QALQALAH, isCompound:false },
      { id:'L1_I009', text:'ذ', transliteration:'Dhaal',   audioFileName:'l1_dhaal.mp3',   descriptionEn:'Dhaal – Tongue between teeth, voiced',  descriptionUr:'ذال – دانتوں کا حرف', tajweedRule:TajweedRule.NONE,  isCompound:false },
      { id:'L1_I010', text:'ر', transliteration:'Raa',     audioFileName:'l1_raa.mp3',     descriptionEn:'Raa – Rolled tongue tip sound',         descriptionUr:'را – زبان کا حرف',  tajweedRule:TajweedRule.NONE,     isCompound:false },
      { id:'L1_I011', text:'ز', transliteration:'Zaay',    audioFileName:'l1_zaay.mp3',    descriptionEn:'Zaay – Buzzing sound',                  descriptionUr:'زای – حرف',          tajweedRule:TajweedRule.NONE,     isCompound:false },
      { id:'L1_I012', text:'س', transliteration:'Seen',    audioFileName:'l1_seen.mp3',    descriptionEn:'Seen – Hissing sibilant',               descriptionUr:'سین – حرف',          tajweedRule:TajweedRule.NONE,     isCompound:false },
      { id:'L1_I013', text:'ش', transliteration:"Sheen",   audioFileName:'l1_sheen.mp3',   descriptionEn:"Sheen – Shushing sound",                descriptionUr:'شین – حرف',          tajweedRule:TajweedRule.NONE,     isCompound:false },
      { id:'L1_I014', text:'ص', transliteration:'Saad',    audioFileName:'l1_saad.mp3',    descriptionEn:'Saad – Emphatic S sound',               descriptionUr:'صاد – مُفَخَّم حرف', tajweedRule:TajweedRule.NONE,    isCompound:false },
      { id:'L1_I015', text:'ض', transliteration:'Daad',    audioFileName:'l1_daad.mp3',    descriptionEn:'Daad – Unique emphatic letter',         descriptionUr:'ضاد – مُفَخَّم حرف', tajweedRule:TajweedRule.NONE,    isCompound:false },
      { id:'L1_I016', text:'ط', transliteration:'Taa\'',   audioFileName:'l1_tain.mp3',    descriptionEn:"Taa' – Emphatic T sound",               descriptionUr:'طاء – مُفَخَّم حرف', tajweedRule:TajweedRule.QALQALAH, isCompound:false },
      { id:'L1_I017', text:'ظ', transliteration:'Dhaa\'',  audioFileName:'l1_dhain.mp3',   descriptionEn:"Dhaa' – Emphatic Dh sound",             descriptionUr:'ظاء – مُفَخَّم حرف', tajweedRule:TajweedRule.NONE,    isCompound:false },
      { id:'L1_I018', text:'ع', transliteration:"'Ayn",    audioFileName:'l1_ayn.mp3',     descriptionEn:"'Ayn – Deep mid-throat",                descriptionUr:'عین – حلقی حرف',    tajweedRule:TajweedRule.IZHAAR,   isCompound:false },
      { id:'L1_I019', text:'غ', transliteration:'Ghayn',   audioFileName:'l1_ghayn.mp3',   descriptionEn:'Ghayn – Gargled back of throat',        descriptionUr:'غین – حلقی حرف',    tajweedRule:TajweedRule.NONE,     isCompound:false },
      { id:'L1_I020', text:'ف', transliteration:'Faa',     audioFileName:'l1_faa.mp3',     descriptionEn:'Faa – Lower lip to upper teeth',        descriptionUr:'فاء – لبی حرف',     tajweedRule:TajweedRule.NONE,     isCompound:false },
      { id:'L1_I021', text:'ق', transliteration:'Qaaf',    audioFileName:'l1_qaaf.mp3',    descriptionEn:'Qaaf – Back of tongue, heavy sound',    descriptionUr:'قاف – قلقلہ حرف',   tajweedRule:TajweedRule.QALQALAH, isCompound:false },
      { id:'L1_I022', text:'ك', transliteration:'Kaaf',    audioFileName:'l1_kaaf.mp3',    descriptionEn:'Kaaf – Back of tongue, light sound',    descriptionUr:'کاف – حرف',          tajweedRule:TajweedRule.NONE,     isCompound:false },
      { id:'L1_I023', text:'ل', transliteration:'Laam',    audioFileName:'l1_laam.mp3',    descriptionEn:'Laam – Tongue sides to molars',         descriptionUr:'لام – حرف',          tajweedRule:TajweedRule.NONE,     isCompound:false },
      { id:'L1_I024', text:'م', transliteration:'Meem',    audioFileName:'l1_meem.mp3',    descriptionEn:'Meem – Closed lips, nasal sound',       descriptionUr:'میم – غنہ حرف',      tajweedRule:TajweedRule.GUNNAH,   isCompound:false },
      { id:'L1_I025', text:'ن', transliteration:'Noon',    audioFileName:'l1_noon.mp3',    descriptionEn:'Noon – Tongue tip, nasal resonance',    descriptionUr:'نون – غنہ حرف',      tajweedRule:TajweedRule.GUNNAH,   isCompound:false },
      { id:'L1_I026', text:'ه', transliteration:'Haa',     audioFileName:'l1_ha.mp3',      descriptionEn:'Haa – Soft throat letter',              descriptionUr:'ہاء – حلقی حرف',    tajweedRule:TajweedRule.IZHAAR,   isCompound:false },
      { id:'L1_I027', text:'و', transliteration:'Waaw',    audioFileName:'l1_waaw.mp3',    descriptionEn:'Waaw – Lip letter, long U vowel',       descriptionUr:'واو – مدی حرف',      tajweedRule:TajweedRule.MADD,     isCompound:false },
      { id:'L1_I028', text:'ي', transliteration:'Yaa',     audioFileName:'l1_yaa.mp3',     descriptionEn:'Yaa – Long I vowel sound',              descriptionUr:'یاء – مدی حرف',      tajweedRule:TajweedRule.MADD,     isCompound:false },
      { id:'L1_I029', text:'لا', transliteration:'Laa',    audioFileName:'l1_laa.mp3',     descriptionEn:'Laa – Laam-Alif ligature',              descriptionUr:'لا – لام الف',       tajweedRule:TajweedRule.NONE,     isCompound:true  },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 2 — Compound Letters (20 items)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 2,
    titleEn: 'Lesson 2: Compound Letters',
    titleUr: 'سبق ۲: مرکبات',
    subtitleEn: 'Two-Letter Joins',
    subtitleUr: 'دو حرفی مرکبات',
    descriptionEn: 'Learn how Arabic letters connect to form two-letter combinations.',
    descriptionUr: 'سیکھیں کہ عربی حروف کیسے جوڑ کر دو حرفی مرکبات بناتے ہیں۔',
    gridColumns: 4,
    hasAudio: false,
    items: [
      { id:'L2_I001', text:'بت', transliteration:'Ba-Ta',    audioFileName:'l2_bata.mp3',   descriptionEn:'Baa joined with Taa',    descriptionUr:'با اور تا کا جوڑ',    tajweedRule:TajweedRule.NONE,     isCompound:true },
      { id:'L2_I002', text:'تث', transliteration:'Ta-Tha',   audioFileName:'l2_tatha.mp3',  descriptionEn:'Taa joined with Thaa',   descriptionUr:'تا اور ثا کا جوڑ',    tajweedRule:TajweedRule.NONE,     isCompound:true },
      { id:'L2_I003', text:'جح', transliteration:'Ja-Ha',    audioFileName:'l2_jaha.mp3',   descriptionEn:'Jeem joined with Haa',   descriptionUr:'جیم اور حا کا جوڑ',   tajweedRule:TajweedRule.NONE,     isCompound:true },
      { id:'L2_I004', text:'حخ', transliteration:'Ha-Kha',   audioFileName:'l2_hakha.mp3',  descriptionEn:'Haa joined with Khaa',   descriptionUr:'حا اور خا کا جوڑ',    tajweedRule:TajweedRule.NONE,     isCompound:true },
      { id:'L2_I005', text:'دذ', transliteration:'Da-Dha',   audioFileName:'l2_dadha.mp3',  descriptionEn:'Daal joined with Dhaal', descriptionUr:'دال اور ذال کا جوڑ',  tajweedRule:TajweedRule.NONE,     isCompound:true },
      { id:'L2_I006', text:'رز', transliteration:'Ra-Za',    audioFileName:'l2_raza.mp3',   descriptionEn:'Raa joined with Zaay',   descriptionUr:'را اور زا کا جوڑ',    tajweedRule:TajweedRule.NONE,     isCompound:true },
      { id:'L2_I007', text:'سش', transliteration:'Sa-Sha',   audioFileName:'l2_sasha.mp3',  descriptionEn:'Seen joined with Sheen', descriptionUr:'سین اور شین کا جوڑ',  tajweedRule:TajweedRule.NONE,     isCompound:true },
      { id:'L2_I008', text:'صض', transliteration:'Sa-Da',    audioFileName:'l2_sada.mp3',   descriptionEn:'Saad joined with Daad',  descriptionUr:'صاد اور ضاد کا جوڑ',  tajweedRule:TajweedRule.NONE,     isCompound:true },
      { id:'L2_I009', text:'طظ', transliteration:'Ta-Dha',   audioFileName:'l2_tadha.mp3',  descriptionEn:'Taa joined with Dhaa',   descriptionUr:'طاء اور ظاء کا جوڑ',  tajweedRule:TajweedRule.NONE,     isCompound:true },
      { id:'L2_I010', text:'عغ', transliteration:"'Ay-Gha",  audioFileName:'l2_aygha.mp3',  descriptionEn:"'Ayn joined with Ghayn",descriptionUr:'عین اور غین کا جوڑ',  tajweedRule:TajweedRule.NONE,     isCompound:true },
      { id:'L2_I011', text:'فق', transliteration:'Fa-Qa',    audioFileName:'l2_faqa.mp3',   descriptionEn:'Faa joined with Qaaf',   descriptionUr:'فاء اور قاف کا جوڑ',  tajweedRule:TajweedRule.NONE,     isCompound:true },
      { id:'L2_I012', text:'كل', transliteration:'Ka-La',    audioFileName:'l2_kala.mp3',   descriptionEn:'Kaaf joined with Laam',  descriptionUr:'کاف اور لام کا جوڑ',  tajweedRule:TajweedRule.NONE,     isCompound:true },
      { id:'L2_I013', text:'لم', transliteration:'La-Ma',    audioFileName:'l2_lama.mp3',   descriptionEn:'Laam joined with Meem',  descriptionUr:'لام اور میم کا جوڑ',  tajweedRule:TajweedRule.GUNNAH,   isCompound:true },
      { id:'L2_I014', text:'من', transliteration:'Ma-Na',    audioFileName:'l2_mana.mp3',   descriptionEn:'Meem joined with Noon',  descriptionUr:'میم اور نون کا جوڑ',  tajweedRule:TajweedRule.GUNNAH,   isCompound:true },
      { id:'L2_I015', text:'نه', transliteration:'Na-Ha',    audioFileName:'l2_naha.mp3',   descriptionEn:'Noon joined with Haa',   descriptionUr:'نون اور ہاء کا جوڑ',  tajweedRule:TajweedRule.NONE,     isCompound:true },
      { id:'L2_I016', text:'هو', transliteration:'Ha-Wa',    audioFileName:'l2_hawa.mp3',   descriptionEn:'Haa joined with Waaw',   descriptionUr:'ہاء اور واو کا جوڑ',  tajweedRule:TajweedRule.NONE,     isCompound:true },
      { id:'L2_I017', text:'وي', transliteration:'Wa-Ya',    audioFileName:'l2_waya.mp3',   descriptionEn:'Waaw joined with Yaa',   descriptionUr:'واو اور یاء کا جوڑ',  tajweedRule:TajweedRule.MADD,     isCompound:true },
      { id:'L2_I018', text:'يا', transliteration:'Ya-Alif',  audioFileName:'l2_yaalif.mp3', descriptionEn:'Yaa joined with Alif',   descriptionUr:'یاء اور الف کا جوڑ',  tajweedRule:TajweedRule.MADD,     isCompound:true },
      { id:'L2_I019', text:'أب', transliteration:'A-Ba',     audioFileName:'l2_aba.mp3',    descriptionEn:'Hamza-Alif with Baa',    descriptionUr:'ہمزہ الف اور با',     tajweedRule:TajweedRule.NONE,     isCompound:true },
      { id:'L2_I020', text:'لا', transliteration:'Laa',      audioFileName:'l2_laa.mp3',    descriptionEn:'Laam-Alif special ligature',descriptionUr:'لام الف کا خاص جوڑ', tajweedRule:TajweedRule.MADD,  isCompound:true },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 3 — Harakat (Fatha) (15 items)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 3,
    titleEn: 'Lesson 3: Harakat – Fatha',
    titleUr: 'سبق ۳: حرکات – فتحہ',
    subtitleEn: 'Short "A" Vowel',
    subtitleUr: 'زبر – مختصر آواز "اَ"',
    descriptionEn: 'Fatha (ـَ) is the short "a" sound placed above a letter. Practise each letter with Fatha.',
    descriptionUr: 'فتحہ (ـَ) حرف کے اوپر لگائی جانے والی زبر ہے۔ ہر حرف کو فتحہ کے ساتھ پڑھیں۔',
    gridColumns: 4,
    hasAudio: false,
    items: [
      { id:'L3_I001', text:'بَ', transliteration:'Ba',  audioFileName:'l3_ba.mp3',  descriptionEn:'Baa with Fatha – "ba"',  descriptionUr:'بَ – فتحہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L3_I002', text:'تَ', transliteration:'Ta',  audioFileName:'l3_ta.mp3',  descriptionEn:'Taa with Fatha – "ta"',  descriptionUr:'تَ – فتحہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L3_I003', text:'ثَ', transliteration:'Tha', audioFileName:'l3_tha.mp3', descriptionEn:'Thaa with Fatha – "tha"',descriptionUr:'ثَ – فتحہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L3_I004', text:'جَ', transliteration:'Ja',  audioFileName:'l3_ja.mp3',  descriptionEn:'Jeem with Fatha – "ja"', descriptionUr:'جَ – فتحہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L3_I005', text:'حَ', transliteration:'Ha',  audioFileName:'l3_ha.mp3',  descriptionEn:'Haa with Fatha – "ha"',  descriptionUr:'حَ – فتحہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L3_I006', text:'خَ', transliteration:'Kha', audioFileName:'l3_kha.mp3', descriptionEn:'Khaa with Fatha – "kha"',descriptionUr:'خَ – فتحہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L3_I007', text:'دَ', transliteration:'Da',  audioFileName:'l3_da.mp3',  descriptionEn:'Daal with Fatha – "da"', descriptionUr:'دَ – فتحہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L3_I008', text:'ذَ', transliteration:'Dha', audioFileName:'l3_dha.mp3', descriptionEn:'Dhaal with Fatha – "dha"',descriptionUr:'ذَ – فتحہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L3_I009', text:'رَ', transliteration:'Ra',  audioFileName:'l3_ra.mp3',  descriptionEn:'Raa with Fatha – "ra"',  descriptionUr:'رَ – فتحہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L3_I010', text:'زَ', transliteration:'Za',  audioFileName:'l3_za.mp3',  descriptionEn:'Zaay with Fatha – "za"', descriptionUr:'زَ – فتحہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L3_I011', text:'سَ', transliteration:'Sa',  audioFileName:'l3_sa.mp3',  descriptionEn:'Seen with Fatha – "sa"', descriptionUr:'سَ – فتحہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L3_I012', text:'شَ', transliteration:'Sha', audioFileName:'l3_sha.mp3', descriptionEn:'Sheen with Fatha – "sha"',descriptionUr:'شَ – فتحہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L3_I013', text:'صَ', transliteration:'Sa\'',audioFileName:'l3_saa.mp3', descriptionEn:'Saad with Fatha – "sa"', descriptionUr:'صَ – فتحہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L3_I014', text:'ضَ', transliteration:'Da\'',audioFileName:'l3_daa.mp3', descriptionEn:'Daad with Fatha – "da"', descriptionUr:'ضَ – فتحہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L3_I015', text:'طَ', transliteration:'Ta\'',audioFileName:'l3_taa.mp3', descriptionEn:'Taa\' with Fatha – "ta"',descriptionUr:'طَ – فتحہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 4 — Harakat (Kasra) (15 items)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 4,
    titleEn: 'Lesson 4: Harakat – Kasra',
    titleUr: 'سبق ۴: حرکات – کسرہ',
    subtitleEn: 'Short "I" Vowel',
    subtitleUr: 'زیر – مختصر آواز "اِ"',
    descriptionEn: 'Kasra (ـِ) is the short "i" sound placed below a letter. Practise each letter with Kasra.',
    descriptionUr: 'کسرہ (ـِ) حرف کے نیچے لگائی جانے والی زیر ہے۔ ہر حرف کو کسرہ کے ساتھ پڑھیں۔',
    gridColumns: 4,
    hasAudio: false,
    items: [
      { id:'L4_I001', text:'بِ', transliteration:'Bi',  audioFileName:'l4_bi.mp3',  descriptionEn:'Baa with Kasra – "bi"',  descriptionUr:'بِ – کسرہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L4_I002', text:'تِ', transliteration:'Ti',  audioFileName:'l4_ti.mp3',  descriptionEn:'Taa with Kasra – "ti"',  descriptionUr:'تِ – کسرہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L4_I003', text:'ثِ', transliteration:'Thi', audioFileName:'l4_thi.mp3', descriptionEn:'Thaa with Kasra – "thi"',descriptionUr:'ثِ – کسرہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L4_I004', text:'جِ', transliteration:'Ji',  audioFileName:'l4_ji.mp3',  descriptionEn:'Jeem with Kasra – "ji"', descriptionUr:'جِ – کسرہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L4_I005', text:'حِ', transliteration:'Hi',  audioFileName:'l4_hi.mp3',  descriptionEn:'Haa with Kasra – "hi"',  descriptionUr:'حِ – کسرہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L4_I006', text:'خِ', transliteration:'Khi', audioFileName:'l4_khi.mp3', descriptionEn:'Khaa with Kasra – "khi"',descriptionUr:'خِ – کسرہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L4_I007', text:'دِ', transliteration:'Di',  audioFileName:'l4_di.mp3',  descriptionEn:'Daal with Kasra – "di"', descriptionUr:'دِ – کسرہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L4_I008', text:'ذِ', transliteration:'Dhi', audioFileName:'l4_dhi.mp3', descriptionEn:'Dhaal with Kasra – "dhi"',descriptionUr:'ذِ – کسرہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L4_I009', text:'رِ', transliteration:'Ri',  audioFileName:'l4_ri.mp3',  descriptionEn:'Raa with Kasra – "ri"',  descriptionUr:'رِ – کسرہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L4_I010', text:'زِ', transliteration:'Zi',  audioFileName:'l4_zi.mp3',  descriptionEn:'Zaay with Kasra – "zi"', descriptionUr:'زِ – کسرہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L4_I011', text:'سِ', transliteration:'Si',  audioFileName:'l4_si.mp3',  descriptionEn:'Seen with Kasra – "si"', descriptionUr:'سِ – کسرہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L4_I012', text:'شِ', transliteration:'Shi', audioFileName:'l4_shi.mp3', descriptionEn:'Sheen with Kasra – "shi"',descriptionUr:'شِ – کسرہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L4_I013', text:'صِ', transliteration:'Si\'',audioFileName:'l4_sii.mp3', descriptionEn:'Saad with Kasra – "si"', descriptionUr:'صِ – کسرہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L4_I014', text:'ضِ', transliteration:'Di\'',audioFileName:'l4_dii.mp3', descriptionEn:'Daad with Kasra – "di"', descriptionUr:'ضِ – کسرہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L4_I015', text:'طِ', transliteration:'Ti\'',audioFileName:'l4_tii.mp3', descriptionEn:'Taa\' with Kasra – "ti"',descriptionUr:'طِ – کسرہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 5 — Harakat (Damma) (15 items)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 5,
    titleEn: 'Lesson 5: Harakat – Damma',
    titleUr: 'سبق ۵: حرکات – ضمہ',
    subtitleEn: 'Short "U" Vowel',
    subtitleUr: 'پیش – مختصر آواز "اُ"',
    descriptionEn: 'Damma (ـُ) is the short "u" sound placed above a letter. Practise each letter with Damma.',
    descriptionUr: 'ضمہ (ـُ) حرف کے اوپر لگائی جانے والی پیش ہے۔ ہر حرف کو ضمہ کے ساتھ پڑھیں۔',
    gridColumns: 4,
    hasAudio: false,
    items: [
      { id:'L5_I001', text:'بُ', transliteration:'Bu',  audioFileName:'l5_bu.mp3',  descriptionEn:'Baa with Damma – "bu"',  descriptionUr:'بُ – ضمہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L5_I002', text:'تُ', transliteration:'Tu',  audioFileName:'l5_tu.mp3',  descriptionEn:'Taa with Damma – "tu"',  descriptionUr:'تُ – ضمہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L5_I003', text:'ثُ', transliteration:'Thu', audioFileName:'l5_thu.mp3', descriptionEn:'Thaa with Damma – "thu"',descriptionUr:'ثُ – ضمہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L5_I004', text:'جُ', transliteration:'Ju',  audioFileName:'l5_ju.mp3',  descriptionEn:'Jeem with Damma – "ju"', descriptionUr:'جُ – ضمہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L5_I005', text:'حُ', transliteration:'Hu',  audioFileName:'l5_hu.mp3',  descriptionEn:'Haa with Damma – "hu"',  descriptionUr:'حُ – ضمہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L5_I006', text:'خُ', transliteration:'Khu', audioFileName:'l5_khu.mp3', descriptionEn:'Khaa with Damma – "khu"',descriptionUr:'خُ – ضمہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L5_I007', text:'دُ', transliteration:'Du',  audioFileName:'l5_du.mp3',  descriptionEn:'Daal with Damma – "du"', descriptionUr:'دُ – ضمہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L5_I008', text:'ذُ', transliteration:'Dhu', audioFileName:'l5_dhu.mp3', descriptionEn:'Dhaal with Damma – "dhu"',descriptionUr:'ذُ – ضمہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L5_I009', text:'رُ', transliteration:'Ru',  audioFileName:'l5_ru.mp3',  descriptionEn:'Raa with Damma – "ru"',  descriptionUr:'رُ – ضمہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L5_I010', text:'زُ', transliteration:'Zu',  audioFileName:'l5_zu.mp3',  descriptionEn:'Zaay with Damma – "zu"', descriptionUr:'زُ – ضمہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L5_I011', text:'سُ', transliteration:'Su',  audioFileName:'l5_su.mp3',  descriptionEn:'Seen with Damma – "su"', descriptionUr:'سُ – ضمہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L5_I012', text:'شُ', transliteration:'Shu', audioFileName:'l5_shu.mp3', descriptionEn:'Sheen with Damma – "shu"',descriptionUr:'شُ – ضمہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L5_I013', text:'صُ', transliteration:'Su\'',audioFileName:'l5_suu.mp3', descriptionEn:'Saad with Damma – "su"', descriptionUr:'صُ – ضمہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L5_I014', text:'ضُ', transliteration:'Du\'',audioFileName:'l5_duu.mp3', descriptionEn:'Daad with Damma – "du"', descriptionUr:'ضُ – ضمہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L5_I015', text:'طُ', transliteration:'Tu\'',audioFileName:'l5_tuu.mp3', descriptionEn:'Taa\' with Damma – "tu"',descriptionUr:'طُ – ضمہ کے ساتھ', tajweedRule:TajweedRule.NONE, isCompound:false },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 6 — Tanween Fatha (10 items)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 6,
    titleEn: 'Lesson 6: Tanween Fatha',
    titleUr: 'سبق ۶: تنوین فتحہ',
    subtitleEn: 'Double Fatha (an sound)',
    subtitleUr: 'دو فتحہ (ن کی آواز)',
    descriptionEn: "Learn Tanween Fatha - two Fatha marks creating 'an' sound with nasalization.",
    descriptionUr: "تنوین فتحہ سیکھیں - دو فتحے جو 'ن' کی آواز بناتے ہیں۔",
    gridColumns: 4,
    hasAudio: false,
    items: [
      { id:'L6_I001', text:'بًـ', transliteration:'Ban',  audioFileName:'l6_ban.mp3',  descriptionEn:'Baa with Tanween Fatha',  descriptionUr:'با پر تنوین فتحہ',  tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L6_I002', text:'تًـ', transliteration:'Tan',  audioFileName:'l6_tan.mp3',  descriptionEn:'Taa with Tanween Fatha',  descriptionUr:'تا پر تنوین فتحہ',  tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L6_I003', text:'ثًـ', transliteration:'Than', audioFileName:'l6_than.mp3', descriptionEn:'Thaa with Tanween Fatha', descriptionUr:'ثا پر تنوین فتحہ',  tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L6_I004', text:'جًـ', transliteration:'Jan',  audioFileName:'l6_jan.mp3',  descriptionEn:'Jeem with Tanween Fatha', descriptionUr:'جیم پر تنوین فتحہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L6_I005', text:'حًـ', transliteration:'Han',  audioFileName:'l6_han.mp3',  descriptionEn:'Haa with Tanween Fatha',  descriptionUr:'حا پر تنوین فتحہ',  tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L6_I006', text:'خًـ', transliteration:'Khan', audioFileName:'l6_khan.mp3', descriptionEn:'Khaa with Tanween Fatha', descriptionUr:'خا پر تنوین فتحہ',  tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L6_I007', text:'دً',  transliteration:'Dan',  audioFileName:'l6_dan.mp3',  descriptionEn:'Dal with Tanween Fatha',  descriptionUr:'دال پر تنوین فتحہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L6_I008', text:'ذً',  transliteration:'Dhan', audioFileName:'l6_dhan.mp3', descriptionEn:'Dhal with Tanween Fatha', descriptionUr:'ذال پر تنوین فتحہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L6_I009', text:'رً',  transliteration:'Ran',  audioFileName:'l6_ran.mp3',  descriptionEn:'Ra with Tanween Fatha',   descriptionUr:'را پر تنوین فتحہ',  tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L6_I010', text:'زً',  transliteration:'Zan',  audioFileName:'l6_zan.mp3',  descriptionEn:'Zay with Tanween Fatha',  descriptionUr:'زا پر تنوین فتحہ',  tajweedRule:TajweedRule.GUNNAH, isCompound:false },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 7 — Tanween Kasra (10 items)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 7,
    titleEn: 'Lesson 7: Tanween – Kasra',
    titleUr: 'سبق ۷: تنوین – کسرہ',
    subtitleEn: 'Double Kasra (-in)',
    subtitleUr: 'تنوین کسرہ – دوہری زیر',
    descriptionEn: 'Tanween Kasra (ـٍ) adds an "in" sound to the end of a word.',
    descriptionUr: 'تنوین کسرہ (ـٍ) کلمے کے آخر میں "اِن" کی آواز بناتی ہے۔',
    gridColumns: 4,
    hasAudio: false,
    items: [
      { id:'L7_I001', text:'بٍ', transliteration:'Bin', audioFileName:'l7_bin.mp3', descriptionEn:'Baa with Tanween Kasra – "bin"', descriptionUr:'بٍ – تنوین کسرہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L7_I002', text:'تٍ', transliteration:'Tin', audioFileName:'l7_tin.mp3', descriptionEn:'Taa with Tanween Kasra – "tin"', descriptionUr:'تٍ – تنوین کسرہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L7_I003', text:'ثٍ', transliteration:'Thin',audioFileName:'l7_thin.mp3',descriptionEn:'Thaa with Tanween Kasra – "thin"',descriptionUr:'ثٍ – تنوین کسرہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L7_I004', text:'جٍ', transliteration:'Jin', audioFileName:'l7_jin.mp3', descriptionEn:'Jeem with Tanween Kasra – "jin"', descriptionUr:'جٍ – تنوین کسرہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L7_I005', text:'حٍ', transliteration:'Hin', audioFileName:'l7_hin.mp3', descriptionEn:'Haa with Tanween Kasra – "hin"',  descriptionUr:'حٍ – تنوین کسرہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L7_I006', text:'خٍ', transliteration:'Khin',audioFileName:'l7_khin.mp3',descriptionEn:'Khaa with Tanween Kasra – "khin"',descriptionUr:'خٍ – تنوین کسرہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L7_I007', text:'دٍ', transliteration:'Din', audioFileName:'l7_din.mp3', descriptionEn:'Daal with Tanween Kasra – "din"', descriptionUr:'دٍ – تنوین کسرہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L7_I008', text:'ذٍ', transliteration:'Dhin',audioFileName:'l7_dhin.mp3',descriptionEn:'Dhaal with Tanween Kasra – "dhin"',descriptionUr:'ذٍ – تنوین کسرہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L7_I009', text:'رٍ', transliteration:'Rin', audioFileName:'l7_rin.mp3', descriptionEn:'Raa with Tanween Kasra – "rin"',  descriptionUr:'رٍ – تنوین کسرہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L7_I010', text:'زٍ', transliteration:'Zin', audioFileName:'l7_zin.mp3', descriptionEn:'Zaay with Tanween Kasra – "zin"', descriptionUr:'زٍ – تنوین کسرہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 8 — Tanween Damma (10 items)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 8,
    titleEn: 'Lesson 8: Tanween – Damma',
    titleUr: 'سبق ۸: تنوین – ضمہ',
    subtitleEn: 'Double Damma (-un)',
    subtitleUr: 'تنوین ضمہ – دوہری پیش',
    descriptionEn: 'Tanween Damma (ـٌ) adds a "un" sound to the end of a word.',
    descriptionUr: 'تنوین ضمہ (ـٌ) کلمے کے آخر میں "اُن" کی آواز بناتی ہے۔',
    gridColumns: 4,
    hasAudio: false,
    items: [
      { id:'L8_I001', text:'بٌ', transliteration:'Bun', audioFileName:'l8_bun.mp3', descriptionEn:'Baa with Tanween Damma – "bun"', descriptionUr:'بٌ – تنوین ضمہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L8_I002', text:'تٌ', transliteration:'Tun', audioFileName:'l8_tun.mp3', descriptionEn:'Taa with Tanween Damma – "tun"', descriptionUr:'تٌ – تنوین ضمہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L8_I003', text:'ثٌ', transliteration:'Thun',audioFileName:'l8_thun.mp3',descriptionEn:'Thaa with Tanween Damma – "thun"',descriptionUr:'ثٌ – تنوین ضمہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L8_I004', text:'جٌ', transliteration:'Jun', audioFileName:'l8_jun.mp3', descriptionEn:'Jeem with Tanween Damma – "jun"', descriptionUr:'جٌ – تنوین ضمہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L8_I005', text:'حٌ', transliteration:'Hun', audioFileName:'l8_hun.mp3', descriptionEn:'Haa with Tanween Damma – "hun"',  descriptionUr:'حٌ – تنوین ضمہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L8_I006', text:'خٌ', transliteration:'Khun',audioFileName:'l8_khun.mp3',descriptionEn:'Khaa with Tanween Damma – "khun"',descriptionUr:'خٌ – تنوین ضمہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L8_I007', text:'دٌ', transliteration:'Dun', audioFileName:'l8_dun.mp3', descriptionEn:'Daal with Tanween Damma – "dun"', descriptionUr:'دٌ – تنوین ضمہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L8_I008', text:'ذٌ', transliteration:'Dhun',audioFileName:'l8_dhun.mp3',descriptionEn:'Dhaal with Tanween Damma – "dhun"',descriptionUr:'ذٌ – تنوین ضمہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L8_I009', text:'رٌ', transliteration:'Run', audioFileName:'l8_run.mp3', descriptionEn:'Raa with Tanween Damma – "run"',  descriptionUr:'رٌ – تنوین ضمہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L8_I010', text:'زٌ', transliteration:'Zun', audioFileName:'l8_zun.mp3', descriptionEn:'Zaay with Tanween Damma – "zun"', descriptionUr:'زٌ – تنوین ضمہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 9 — Madd Letters (8 items)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 9,
    titleEn: 'Lesson 9: Madd Letters',
    titleUr: 'سبق ۹: حروفِ مدہ',
    subtitleEn: 'Long Vowels',
    subtitleUr: 'لمبی آوازیں',
    descriptionEn: 'Madd letters (ا، و، ي) stretch the vowel sound to at least 2 counts. Learn to elongate correctly.',
    descriptionUr: 'حروف مدہ (ا، و، ي) کے ساتھ آواز کو کم از کم دو الف تک کھینچیں۔',
    gridColumns: 3,
    hasAudio: false,
    items: [
      { id:'L9_I001', text:'بَا', transliteration:'Baa', audioFileName:'l9_baa_long.mp3', descriptionEn:'Baa + Alif – long "aa" sound',  descriptionUr:'بَا – لمبی آواز', tajweedRule:TajweedRule.MADD, isCompound:true },
      { id:'L9_I002', text:'بِي', transliteration:'Bee', audioFileName:'l9_bee_long.mp3', descriptionEn:'Baa + Yaa – long "ee" sound',   descriptionUr:'بِي – لمبی آواز', tajweedRule:TajweedRule.MADD, isCompound:true },
      { id:'L9_I003', text:'بُو', transliteration:'Boo', audioFileName:'l9_boo_long.mp3', descriptionEn:'Baa + Waaw – long "oo" sound',  descriptionUr:'بُو – لمبی آواز', tajweedRule:TajweedRule.MADD, isCompound:true },
      { id:'L9_I004', text:'تَا', transliteration:'Taa', audioFileName:'l9_taa_long.mp3', descriptionEn:'Taa + Alif – long "aa" sound',  descriptionUr:'تَا – لمبی آواز', tajweedRule:TajweedRule.MADD, isCompound:true },
      { id:'L9_I005', text:'تِي', transliteration:'Tee', audioFileName:'l9_tee_long.mp3', descriptionEn:'Taa + Yaa – long "ee" sound',   descriptionUr:'تِي – لمبی آواز', tajweedRule:TajweedRule.MADD, isCompound:true },
      { id:'L9_I006', text:'تُو', transliteration:'Too', audioFileName:'l9_too_long.mp3', descriptionEn:'Taa + Waaw – long "oo" sound',  descriptionUr:'تُو – لمبی آواز', tajweedRule:TajweedRule.MADD, isCompound:true },
      { id:'L9_I007', text:'نَا', transliteration:'Naa', audioFileName:'l9_naa_long.mp3', descriptionEn:'Noon + Alif – long "aa" sound', descriptionUr:'نَا – لمبی آواز', tajweedRule:TajweedRule.MADD, isCompound:true },
      { id:'L9_I008', text:'مَا', transliteration:'Maa', audioFileName:'l9_maa_long.mp3', descriptionEn:'Meem + Alif – long "aa" sound', descriptionUr:'مَا – لمبی آواز', tajweedRule:TajweedRule.MADD, isCompound:true },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 10 — Leen Letters (6 items)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 10,
    titleEn: 'Lesson 10: Leen Letters',
    titleUr: 'سبق ۱۰: حروفِ لین',
    subtitleEn: 'Soft Glide Letters',
    subtitleUr: 'نرم حرف',
    descriptionEn: 'Leen letters are Waaw and Yaa with Sukun preceded by Fatha. They produce a soft gliding sound.',
    descriptionUr: 'حروفِ لین وہ واو اور یاء ہیں جن پر سکون ہو اور اُن سے پہلے فتحہ ہو۔',
    gridColumns: 3,
    hasAudio: false,
    items: [
      { id:'L10_I001', text:'بَوْ', transliteration:'Baw', audioFileName:'l10_baw.mp3', descriptionEn:'Baa-Fatha + Waaw-Sukun – soft "ow"', descriptionUr:'بَوْ – حرف لین', tajweedRule:TajweedRule.NONE, isCompound:true },
      { id:'L10_I002', text:'بَيْ', transliteration:'Bay', audioFileName:'l10_bay.mp3', descriptionEn:'Baa-Fatha + Yaa-Sukun – soft "ay"',  descriptionUr:'بَيْ – حرف لین', tajweedRule:TajweedRule.NONE, isCompound:true },
      { id:'L10_I003', text:'خَوْف',transliteration:'Khawf',audioFileName:'l10_khawf.mp3',descriptionEn:'Khawf – fear, Leen example',       descriptionUr:'خَوْف – مثال',  tajweedRule:TajweedRule.NONE, isCompound:true },
      { id:'L10_I004', text:'بَيْت',transliteration:'Bayt',audioFileName:'l10_bayt.mp3', descriptionEn:'Bayt – house, Leen example',        descriptionUr:'بَيْت – مثال', tajweedRule:TajweedRule.NONE, isCompound:true },
      { id:'L10_I005', text:'صَوْت',transliteration:'Sawt',audioFileName:'l10_sawt.mp3', descriptionEn:'Sawt – sound, Leen example',        descriptionUr:'صَوْت – مثال', tajweedRule:TajweedRule.NONE, isCompound:true },
      { id:'L10_I006', text:'لَيْل',transliteration:'Layl',audioFileName:'l10_layl.mp3', descriptionEn:'Layl – night, Leen example',        descriptionUr:'لَيْل – مثال', tajweedRule:TajweedRule.NONE, isCompound:true },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 11 — Huroof Muqatta'at (10 items)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 11,
    titleEn: "Lesson 11: Huroof Muqatta'at",
    titleUr: 'سبق ۱۱: حروفِ مقطعات',
    subtitleEn: 'Disjointed Opening Letters',
    subtitleUr: 'قرآنی مقطعات',
    descriptionEn: "These are the unique letters that open certain Quranic chapters. Each letter is read individually by its name.",
    descriptionUr: 'یہ وہ منفرد حروف ہیں جو بعض قرآنی سورتوں کے شروع میں آتے ہیں۔',
    gridColumns: 3,
    hasAudio: false,
    items: [
      { id:'L11_I001', text:'الم',  transliteration:"Alif-Lam-Meem",  audioFileName:'l11_alm.mp3',  descriptionEn:'Opening of Surah Al-Baqarah', descriptionUr:'سورہ بقرہ کا آغاز',   tajweedRule:TajweedRule.MADD, isCompound:true },
      { id:'L11_I002', text:'الر',  transliteration:"Alif-Lam-Ra",    audioFileName:'l11_alr.mp3',  descriptionEn:'Opening of Surah Yunus',      descriptionUr:'سورہ یونس کا آغاز',    tajweedRule:TajweedRule.MADD, isCompound:true },
      { id:'L11_I003', text:'المر', transliteration:"Alif-Lam-Meem-Ra",audioFileName:'l11_almr.mp3',descriptionEn:'Opening of Surah Ar-Ra\'d',   descriptionUr:"سورہ رعد کا آغاز",    tajweedRule:TajweedRule.MADD, isCompound:true },
      { id:'L11_I004', text:'طه',   transliteration:"Ta-Ha",           audioFileName:'l11_taha.mp3', descriptionEn:'Opening of Surah Ta-Ha',      descriptionUr:'سورہ طٰہٰ کا آغاز',    tajweedRule:TajweedRule.MADD, isCompound:true },
      { id:'L11_I005', text:'يس',   transliteration:"Ya-Seen",         audioFileName:'l11_yaseen.mp3',descriptionEn:'Opening of Surah Ya-Seen',   descriptionUr:'سورہ یٰسین کا آغاز',   tajweedRule:TajweedRule.MADD, isCompound:true },
      { id:'L11_I006', text:'ص',    transliteration:"Saad",            audioFileName:'l11_saad.mp3', descriptionEn:'Opening of Surah Saad',       descriptionUr:'سورہ صٓ کا آغاز',      tajweedRule:TajweedRule.MADD, isCompound:false },
      { id:'L11_I007', text:'حم',   transliteration:"Ha-Meem",         audioFileName:'l11_hameem.mp3',descriptionEn:'Opening of Ha-Meem surahs',  descriptionUr:'حٰمٓ سورتوں کا آغاز',  tajweedRule:TajweedRule.MADD, isCompound:true },
      { id:'L11_I008', text:'عسق',  transliteration:"'Ayn-Seen-Qaf",   audioFileName:'l11_asq.mp3',  descriptionEn:'Opening of Surah Ash-Shura', descriptionUr:'سورہ شوری کا آغاز',    tajweedRule:TajweedRule.MADD, isCompound:true },
      { id:'L11_I009', text:'ق',    transliteration:"Qaaf",            audioFileName:'l11_qaaf.mp3', descriptionEn:'Opening of Surah Qaaf',       descriptionUr:'سورہ قٓ کا آغاز',      tajweedRule:TajweedRule.MADD, isCompound:false },
      { id:'L11_I010', text:'ن',    transliteration:"Noon",            audioFileName:'l11_noon.mp3', descriptionEn:'Opening of Surah Al-Qalam',   descriptionUr:'سورہ قلم کا آغاز',     tajweedRule:TajweedRule.MADD, isCompound:false },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 12 — Sukun (12 items)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 12,
    titleEn: 'Lesson 12: Sukun',
    titleUr: 'سبق ۱۲: سکون',
    subtitleEn: 'The Resting Sign',
    subtitleUr: 'حروف ساکنہ',
    descriptionEn: 'Sukun (ـْ) means the letter has no vowel — it rests. The sound stops sharply.',
    descriptionUr: 'سکون (ـْ) کا مطلب ہے کہ حرف پر کوئی حرکت نہیں — یہ ساکن ہے۔',
    gridColumns: 4,
    hasAudio: false,
    items: [
      { id:'L12_I001', text:'بْ', transliteration:"B'",  audioFileName:'l12_b_sukun.mp3',  descriptionEn:'Baa with Sukun',  descriptionUr:'بْ – ساکن', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L12_I002', text:'تْ', transliteration:"T'",  audioFileName:'l12_t_sukun.mp3',  descriptionEn:'Taa with Sukun',  descriptionUr:'تْ – ساکن', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L12_I003', text:'ثْ', transliteration:"Th'", audioFileName:'l12_th_sukun.mp3', descriptionEn:'Thaa with Sukun', descriptionUr:'ثْ – ساکن', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L12_I004', text:'جْ', transliteration:"J'",  audioFileName:'l12_j_sukun.mp3',  descriptionEn:'Jeem with Sukun', descriptionUr:'جْ – ساکن', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L12_I005', text:'حْ', transliteration:"H'",  audioFileName:'l12_h_sukun.mp3',  descriptionEn:'Haa with Sukun',  descriptionUr:'حْ – ساکن', tajweedRule:TajweedRule.IZHAAR,isCompound:false },
      { id:'L12_I006', text:'خْ', transliteration:"Kh'", audioFileName:'l12_kh_sukun.mp3', descriptionEn:'Khaa with Sukun', descriptionUr:'خْ – ساکن', tajweedRule:TajweedRule.IZHAAR,isCompound:false },
      { id:'L12_I007', text:'دْ', transliteration:"D'",  audioFileName:'l12_d_sukun.mp3',  descriptionEn:'Daal with Sukun', descriptionUr:'دْ – ساکن', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L12_I008', text:'ذْ', transliteration:"Dh'", audioFileName:'l12_dh_sukun.mp3', descriptionEn:'Dhaal with Sukun',descriptionUr:'ذْ – ساکن', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L12_I009', text:'رْ', transliteration:"R'",  audioFileName:'l12_r_sukun.mp3',  descriptionEn:'Raa with Sukun',  descriptionUr:'رْ – ساکن', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L12_I010', text:'زْ', transliteration:"Z'",  audioFileName:'l12_z_sukun.mp3',  descriptionEn:'Zaay with Sukun', descriptionUr:'زْ – ساکن', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L12_I011', text:'سْ', transliteration:"S'",  audioFileName:'l12_s_sukun.mp3',  descriptionEn:'Seen with Sukun', descriptionUr:'سْ – ساکن', tajweedRule:TajweedRule.NONE, isCompound:false },
      { id:'L12_I012', text:'شْ', transliteration:"Sh'", audioFileName:'l12_sh_sukun.mp3', descriptionEn:'Sheen with Sukun',descriptionUr:'شْ – ساکن', tajweedRule:TajweedRule.NONE, isCompound:false },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 13 — Shaddah (12 items)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 13,
    titleEn: 'Lesson 13: Shaddah',
    titleUr: 'سبق ۱۳: شدہ',
    subtitleEn: 'Doubled Consonants',
    subtitleUr: 'تشدید – حرف کا دوہرانا',
    descriptionEn: 'Shaddah (ـّ) doubles the letter. Hold the sound for two counts before releasing.',
    descriptionUr: 'شدہ (ـّ) حرف کو دوہراتی ہے۔ آواز کو دو الف تک روک کر چھوڑیں۔',
    gridColumns: 4,
    hasAudio: false,
    items: [
      { id:'L13_I001', text:'بَّ', transliteration:'Bba', audioFileName:'l13_bba.mp3', descriptionEn:'Baa doubled with Fatha',  descriptionUr:'بَّ – مشدد', tajweedRule:TajweedRule.NONE,   isCompound:false },
      { id:'L13_I002', text:'تَّ', transliteration:'Tta', audioFileName:'l13_tta.mp3', descriptionEn:'Taa doubled with Fatha',  descriptionUr:'تَّ – مشدد', tajweedRule:TajweedRule.NONE,   isCompound:false },
      { id:'L13_I003', text:'ثَّ', transliteration:'Ttha',audioFileName:'l13_ttha.mp3',descriptionEn:'Thaa doubled with Fatha', descriptionUr:'ثَّ – مشدد', tajweedRule:TajweedRule.NONE,   isCompound:false },
      { id:'L13_I004', text:'جَّ', transliteration:'Jja', audioFileName:'l13_jja.mp3', descriptionEn:'Jeem doubled with Fatha', descriptionUr:'جَّ – مشدد', tajweedRule:TajweedRule.NONE,   isCompound:false },
      { id:'L13_I005', text:'حَّ', transliteration:'Hha', audioFileName:'l13_hha.mp3', descriptionEn:'Haa doubled with Fatha',  descriptionUr:'حَّ – مشدد', tajweedRule:TajweedRule.NONE,   isCompound:false },
      { id:'L13_I006', text:'خَّ', transliteration:'Khkha',audioFileName:'l13_khkha.mp3',descriptionEn:'Khaa doubled with Fatha',descriptionUr:'خَّ – مشدد', tajweedRule:TajweedRule.NONE,  isCompound:false },
      { id:'L13_I007', text:'دَّ', transliteration:'Dda', audioFileName:'l13_dda.mp3', descriptionEn:'Daal doubled with Fatha', descriptionUr:'دَّ – مشدد', tajweedRule:TajweedRule.NONE,   isCompound:false },
      { id:'L13_I008', text:'رَّ', transliteration:'Rra', audioFileName:'l13_rra.mp3', descriptionEn:'Raa doubled with Fatha',  descriptionUr:'رَّ – مشدد', tajweedRule:TajweedRule.NONE,   isCompound:false },
      { id:'L13_I009', text:'سَّ', transliteration:'Ssa', audioFileName:'l13_ssa.mp3', descriptionEn:'Seen doubled with Fatha', descriptionUr:'سَّ – مشدد', tajweedRule:TajweedRule.NONE,   isCompound:false },
      { id:'L13_I010', text:'مَّ', transliteration:'Mma', audioFileName:'l13_mma.mp3', descriptionEn:'Meem doubled – Gunnah applies',descriptionUr:'مَّ – مشدد غنہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L13_I011', text:'نَّ', transliteration:'Nna', audioFileName:'l13_nna.mp3', descriptionEn:'Noon doubled – Gunnah applies',descriptionUr:'نَّ – مشدد غنہ', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L13_I012', text:'لَّ', transliteration:'Lla', audioFileName:'l13_lla.mp3', descriptionEn:'Laam doubled with Fatha',  descriptionUr:'لَّ – مشدد', tajweedRule:TajweedRule.NONE,   isCompound:false },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 14 — Shaddah + Tanween (10 items)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 14,
    titleEn: 'Lesson 14: Shaddah + Tanween',
    titleUr: 'سبق ۱۴: شدہ اور تنوین',
    subtitleEn: 'Doubled Letters with Nunation',
    subtitleUr: 'مشدد اور تنوین',
    descriptionEn: 'Combining Shaddah with Tanween creates a doubled letter followed by a nasal "n" sound.',
    descriptionUr: 'شدہ اور تنوین کا مجموعہ مشدد حرف بناتا ہے جس کے بعد غنہ آتی ہے۔',
    gridColumns: 3,
    hasAudio: false,
    items: [
      { id:'L14_I001', text:'بَّ ً', transliteration:"Bban", audioFileName:'l14_bban.mp3', descriptionEn:'Baa doubled + Tanween Fatha',  descriptionUr:'بَّ ً – مشدد تنوین', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L14_I002', text:'تَّ ً', transliteration:"Ttan", audioFileName:'l14_ttan.mp3', descriptionEn:'Taa doubled + Tanween Fatha',  descriptionUr:'تَّ ً – مشدد تنوین', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L14_I003', text:'جَّ ً', transliteration:"Jjan", audioFileName:'l14_jjan.mp3', descriptionEn:'Jeem doubled + Tanween Fatha', descriptionUr:'جَّ ً – مشدد تنوین', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L14_I004', text:'دَّ ً', transliteration:"Ddan", audioFileName:'l14_ddan.mp3', descriptionEn:'Daal doubled + Tanween Fatha', descriptionUr:'دَّ ً – مشدد تنوین', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L14_I005', text:'رَّ ً', transliteration:"Rran", audioFileName:'l14_rran.mp3', descriptionEn:'Raa doubled + Tanween Fatha',  descriptionUr:'رَّ ً – مشدد تنوین', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L14_I006', text:'سَّ ً', transliteration:"Ssan", audioFileName:'l14_ssan.mp3', descriptionEn:'Seen doubled + Tanween Fatha', descriptionUr:'سَّ ً – مشدد تنوین', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L14_I007', text:'مَّ ً', transliteration:"Mman", audioFileName:'l14_mman.mp3', descriptionEn:'Meem doubled + Tanween Fatha – strong Gunnah',descriptionUr:'مَّ ً – مشدد غنہ تنوین', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L14_I008', text:'نَّ ً', transliteration:"Nnan", audioFileName:'l14_nnan.mp3', descriptionEn:'Noon doubled + Tanween Fatha – strong Gunnah',descriptionUr:'نَّ ً – مشدد غنہ تنوین', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L14_I009', text:'لَّ ً', transliteration:"Llan", audioFileName:'l14_llan.mp3', descriptionEn:'Laam doubled + Tanween Fatha', descriptionUr:'لَّ ً – مشدد تنوین', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
      { id:'L14_I010', text:'كَّ ً', transliteration:"Kkan", audioFileName:'l14_kkan.mp3', descriptionEn:'Kaaf doubled + Tanween Fatha', descriptionUr:'كَّ ً – مشدد تنوین', tajweedRule:TajweedRule.GUNNAH, isCompound:false },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 15 — Short Words (15 items)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 15,
    titleEn: 'Lesson 15: Short Words',
    titleUr: 'سبق ۱۵: مختصر کلمات',
    subtitleEn: '2–3 Letter Words',
    subtitleUr: 'دو یا تین حرفی الفاظ',
    descriptionEn: 'Practise reading short, common Arabic words from the Quran and daily use.',
    descriptionUr: 'قرآنی اور روزمرہ کے مختصر عربی الفاظ پڑھنے کی مشق کریں۔',
    gridColumns: 3,
    hasAudio: false,
    items: [
      { id:'L15_I001', text:'مَن',  transliteration:'Man',  audioFileName:'l15_man.mp3',  descriptionEn:'Who',          descriptionUr:'کون',         tajweedRule:TajweedRule.NONE,   isCompound:true },
      { id:'L15_I002', text:'فِي',  transliteration:'Fee',  audioFileName:'l15_fee.mp3',  descriptionEn:'In / Within',   descriptionUr:'میں',         tajweedRule:TajweedRule.MADD,   isCompound:true },
      { id:'L15_I003', text:'مِن',  transliteration:'Min',  audioFileName:'l15_min.mp3',  descriptionEn:'From',          descriptionUr:'سے',          tajweedRule:TajweedRule.NONE,   isCompound:true },
      { id:'L15_I004', text:'عَن',  transliteration:"'An",  audioFileName:'l15_an.mp3',   descriptionEn:'About / From',  descriptionUr:'سے',          tajweedRule:TajweedRule.NONE,   isCompound:true },
      { id:'L15_I005', text:'لَا',  transliteration:'Laa',  audioFileName:'l15_laa.mp3',  descriptionEn:'No / Not',      descriptionUr:'نہیں',        tajweedRule:TajweedRule.MADD,   isCompound:true },
      { id:'L15_I006', text:'قَد',  transliteration:'Qad',  audioFileName:'l15_qad.mp3',  descriptionEn:'Indeed',        descriptionUr:'تحقیق',       tajweedRule:TajweedRule.NONE,   isCompound:true },
      { id:'L15_I007', text:'إِن',  transliteration:'In',   audioFileName:'l15_in.mp3',   descriptionEn:'If',            descriptionUr:'اگر',         tajweedRule:TajweedRule.NONE,   isCompound:true },
      { id:'L15_I008', text:'أَن',  transliteration:'An',   audioFileName:'l15_an2.mp3',  descriptionEn:'That (conjunction)',descriptionUr:'کہ',       tajweedRule:TajweedRule.NONE,   isCompound:true },
      { id:'L15_I009', text:'هُو',  transliteration:'Huw',  audioFileName:'l15_huw.mp3',  descriptionEn:'He / It',       descriptionUr:'وہ',          tajweedRule:TajweedRule.MADD,   isCompound:true },
      { id:'L15_I010', text:'هِي',  transliteration:'Hiy',  audioFileName:'l15_hiy.mp3',  descriptionEn:'She / It',      descriptionUr:'وہ (مؤنث)',   tajweedRule:TajweedRule.MADD,   isCompound:true },
      { id:'L15_I011', text:'رَب',  transliteration:'Rabb', audioFileName:'l15_rabb.mp3', descriptionEn:'Lord',          descriptionUr:'رب',          tajweedRule:TajweedRule.NONE,   isCompound:true },
      { id:'L15_I012', text:'حَق',  transliteration:'Haqq', audioFileName:'l15_haqq.mp3', descriptionEn:'Truth / Right', descriptionUr:'حق',          tajweedRule:TajweedRule.QALQALAH,isCompound:true },
      { id:'L15_I013', text:'نُور', transliteration:'Noor', audioFileName:'l15_noor.mp3', descriptionEn:'Light',         descriptionUr:'نور',         tajweedRule:TajweedRule.MADD,   isCompound:true },
      { id:'L15_I014', text:'عَلى', transliteration:"'Ala", audioFileName:'l15_ala.mp3',  descriptionEn:'Upon / Over',   descriptionUr:'پر',          tajweedRule:TajweedRule.MADD,   isCompound:true },
      { id:'L15_I015', text:'إِلى', transliteration:'Ila',  audioFileName:'l15_ila.mp3',  descriptionEn:'To / Towards',  descriptionUr:'کی طرف',      tajweedRule:TajweedRule.MADD,   isCompound:true },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 16 — Longer Words (12 items)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 16,
    titleEn: 'Lesson 16: Longer Words',
    titleUr: 'سبق ۱۶: طویل کلمات',
    subtitleEn: '4–5 Letter Quranic Words',
    subtitleUr: 'چار سے پانچ حرفی قرآنی الفاظ',
    descriptionEn: 'Practise longer Arabic words that appear frequently in the Quran.',
    descriptionUr: 'قرآن میں کثرت سے آنے والے طویل عربی الفاظ کی مشق کریں۔',
    gridColumns: 2,
    hasAudio: false,
    items: [
      { id:'L16_I001', text:'كِتَاب',  transliteration:'Kitaab',  audioFileName:'l16_kitaab.mp3',  descriptionEn:'Book',              descriptionUr:'کتاب',        tajweedRule:TajweedRule.MADD,   isCompound:true },
      { id:'L16_I002', text:'إِيمَان', transliteration:'Eemaan',  audioFileName:'l16_eemaan.mp3',  descriptionEn:'Faith / Belief',    descriptionUr:'ایمان',       tajweedRule:TajweedRule.MADD,   isCompound:true },
      { id:'L16_I003', text:'إِسْلَام',transliteration:'Islaam',  audioFileName:'l16_islaam.mp3',  descriptionEn:'Islam / Submission', descriptionUr:'اسلام',       tajweedRule:TajweedRule.MADD,   isCompound:true },
      { id:'L16_I004', text:'صَلَاة',  transliteration:'Salaah',  audioFileName:'l16_salaah.mp3',  descriptionEn:'Prayer',            descriptionUr:'نماز',        tajweedRule:TajweedRule.MADD,   isCompound:true },
      { id:'L16_I005', text:'زَكَاة',  transliteration:'Zakaah',  audioFileName:'l16_zakaah.mp3',  descriptionEn:'Charity / Purification',descriptionUr:'زکاۃ',     tajweedRule:TajweedRule.MADD,   isCompound:true },
      { id:'L16_I006', text:'رَحْمَة', transliteration:'Rahmah',  audioFileName:'l16_rahmah.mp3',  descriptionEn:'Mercy / Compassion',descriptionUr:'رحمت',        tajweedRule:TajweedRule.NONE,   isCompound:true },
      { id:'L16_I007', text:'نِعْمَة', transliteration:'Ni\'mah', audioFileName:'l16_nimah.mp3',   descriptionEn:'Blessing / Grace',  descriptionUr:'نعمت',        tajweedRule:TajweedRule.NONE,   isCompound:true },
      { id:'L16_I008', text:'جَنَّة',  transliteration:'Jannah',  audioFileName:'l16_jannah.mp3',  descriptionEn:'Paradise / Garden', descriptionUr:'جنت',         tajweedRule:TajweedRule.GUNNAH, isCompound:true },
      { id:'L16_I009', text:'قُرْآن',  transliteration:"Qur'aan", audioFileName:'l16_quran.mp3',   descriptionEn:'The Quran',         descriptionUr:'قرآن',        tajweedRule:TajweedRule.MADD,   isCompound:true },
      { id:'L16_I010', text:'تَقْوَى', transliteration:'Taqwa',   audioFileName:'l16_taqwa.mp3',   descriptionEn:'Piety / God-consciousness',descriptionUr:'تقوٰی',   tajweedRule:TajweedRule.NONE,   isCompound:true },
      { id:'L16_I011', text:'نَبِيّ',  transliteration:'Nabiyy',  audioFileName:'l16_nabiy.mp3',   descriptionEn:'Prophet',           descriptionUr:'نبی',         tajweedRule:TajweedRule.GUNNAH, isCompound:true },
      { id:'L16_I012', text:'حِكْمَة', transliteration:'Hikmah',  audioFileName:'l16_hikmah.mp3',  descriptionEn:'Wisdom',            descriptionUr:'حکمت',        tajweedRule:TajweedRule.NONE,   isCompound:true },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 17 — Complete Phrases (8 items)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 17,
    titleEn: 'Lesson 17: Complete Phrases',
    titleUr: 'سبق ۱۷: مکمل عبارات',
    subtitleEn: 'Islamic Phrases & Du\'as',
    subtitleUr: 'اسلامی عبارات اور دعائیں',
    descriptionEn: "Practise complete Islamic phrases with correct Tajweed, pronunciation, and meaning.",
    descriptionUr: 'اسلامی عبارات کو صحیح تجوید کے ساتھ پڑھنے کی مشق کریں۔',
    gridColumns: 1,
    hasAudio: false,
    items: [
      { id:'L17_I001', text:'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ',        transliteration:"Bismillahir-Rahmanir-Raheem",  audioFileName:'l17_bismillah.mp3',    descriptionEn:'In the name of Allah, the Most Gracious, the Most Merciful', descriptionUr:'اللہ کے نام سے جو بہت مہربان اور رحم کرنے والا ہے', tajweedRule:TajweedRule.IDGHAAM, isCompound:true },
      { id:'L17_I002', text:'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',       transliteration:"Al-Hamdu Lillahi Rabbil-'Alameen", audioFileName:'l17_alhamdulillah.mp3',descriptionEn:'All praise is due to Allah, Lord of all the worlds',           descriptionUr:'تمام تعریفیں اللہ کے لیے ہیں جو سارے جہانوں کا رب ہے', tajweedRule:TajweedRule.IDGHAAM, isCompound:true },
      { id:'L17_I003', text:'سُبْحَانَ اللهِ وَبِحَمْدِهِ',                transliteration:"Subhanallahi Wabihamdih",        audioFileName:'l17_subhanallah.mp3',  descriptionEn:'Glory be to Allah and praise be to Him',                     descriptionUr:'اللہ پاک ہے اور اس کی تعریف ہے', tajweedRule:TajweedRule.NONE, isCompound:true },
      { id:'L17_I004', text:'اللهُ أَكْبَر',                                transliteration:"Allahu Akbar",                   audioFileName:'l17_allahuakbar.mp3',  descriptionEn:'Allah is the Greatest',                                       descriptionUr:'اللہ سب سے بڑا ہے', tajweedRule:TajweedRule.NONE, isCompound:true },
      { id:'L17_I005', text:'لَا إِلٰهَ إِلَّا اللهُ',                     transliteration:"La ilaha illallah",              audioFileName:'l17_lailaha.mp3',      descriptionEn:'There is no deity worthy of worship except Allah',            descriptionUr:'اللہ کے سوا کوئی معبود نہیں', tajweedRule:TajweedRule.IDGHAAM, isCompound:true },
      { id:'L17_I006', text:'أَسْتَغْفِرُ اللهَ',                          transliteration:"Astaghfirullah",                  audioFileName:'l17_astaghfirullah.mp3',descriptionEn:'I seek forgiveness from Allah',                               descriptionUr:'میں اللہ سے معافی مانگتا ہوں', tajweedRule:TajweedRule.NONE, isCompound:true },
      { id:'L17_I007', text:'إِنَّ لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ', transliteration:"Inna lillahi wa inna ilayhi raji'oon", audioFileName:'l17_innalillahi.mp3', descriptionEn:'Indeed, we belong to Allah, and to Him we shall return',     descriptionUr:'بیشک ہم اللہ کے لیے ہیں اور اسی کی طرف لوٹنے والے ہیں', tajweedRule:TajweedRule.GUNNAH, isCompound:true },
      { id:'L17_I008', text:'مَا شَاءَ اللهُ',                              transliteration:"Masha Allah",                     audioFileName:'l17_mashaallah.mp3',   descriptionEn:'What Allah has willed',                                       descriptionUr:'جو اللہ نے چاہا', tajweedRule:TajweedRule.NONE, isCompound:true },
    ],
  },
];
