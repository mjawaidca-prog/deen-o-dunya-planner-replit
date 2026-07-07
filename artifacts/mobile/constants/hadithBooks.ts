export interface HadithBook {
  id: string;
  name: string;
  arabicName: string;
  author: string;
  total: number;
  description: string;
  color: string;
}

export const HADITH_BOOKS: HadithBook[] = [
  { id: 'bukhari', name: 'Sahih Al-Bukhari', arabicName: 'صحيح البخاري', author: 'Imam Al-Bukhari', total: 7563, description: 'The most authentic collection of hadith, compiled over 16 years by Imam Muhammad ibn Ismail Al-Bukhari.', color: '#2D9B6B' },
  { id: 'muslim', name: 'Sahih Muslim', arabicName: 'صحيح مسلم', author: 'Imam Muslim', total: 7563, description: 'Second most authentic hadith collection. Imam Muslim spent 15 years compiling this monumental work.', color: '#3A7BD5' },
  { id: 'tirmidhi', name: "Jami' At-Tirmidhi", arabicName: 'جامع الترمذي', author: 'Imam At-Tirmidhi', total: 3956, description: 'Comprehensive collection with detailed grading. A student of Imam Bukhari and Abu Dawud.', color: '#8B5CF6' },
  { id: 'abudawud', name: 'Sunan Abu Dawud', arabicName: 'سنن أبي داود', author: 'Imam Abu Dawud', total: 5274, description: 'Focus on jurisprudential hadiths. Contains 4,800 hadiths selected from 500,000.', color: '#D97706' },
  { id: 'ibnmajah', name: 'Sunan Ibn Majah', arabicName: 'سنن ابن ماجه', author: 'Imam Ibn Majah', total: 4341, description: 'Important collection of prophetic traditions covering all aspects of Islamic law.', color: '#DC2626' },
  { id: 'nasai', name: "Sunan An-Nasa'i", arabicName: 'سنن النسائي', author: "Imam An-Nasa'i", total: 5761, description: "Known for strictness in accepting narrators. Called 'Al-Mujtaba' (the selected).  ", color: '#0891B2' },
  { id: 'malik', name: 'Muwatta Imam Malik', arabicName: 'موطأ الإمام مالك', author: 'Imam Malik', total: 1594, description: 'Earliest compiled hadith collection, "The Smoothed Path". Praised by Imam Shafi\'i.', color: '#059669' },
  { id: 'ahmad', name: 'Musnad Ahmad', arabicName: 'مسند أحمد', author: 'Imam Ahmad ibn Hanbal', total: 27647, description: "Largest collection of prophetic traditions. Imam Ahmad said: 'I compiled this from 750,000 hadiths.'", color: '#7C3AED' },
];

export interface Hadith {
  id: string;
  bookId: string;
  number: number;
  arabic: string;
  english: string;
  urdu: string;
  grade: 'sahih' | 'hasan' | 'daif' | 'mawdu';
  narrator: string;
  chapter?: string;
}

export const LOCAL_HADITHS: Hadith[] = [
  // ─────────────────────────────────────────────
  // SAHIH AL-BUKHARI (15 hadiths)
  // ─────────────────────────────────────────────
  {
    id: 'b1', bookId: 'bukhari', number: 1,
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    english: 'Actions are judged by intentions, and every person will get what they intended.',
    urdu: 'اعمال کا دارومدار نیتوں پر ہے، اور ہر شخص کو وہی ملے گا جو اس نے نیت کی۔',
    grade: 'sahih', narrator: 'Umar ibn al-Khattab (RA)', chapter: 'Revelation',
  },
  {
    id: 'b2', bookId: 'bukhari', number: 8,
    arabic: 'بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَالْحَجِّ، وَصَوْمِ رَمَضَانَ',
    english: 'Islam is built upon five pillars: testifying that there is no god but Allah and that Muhammad is His messenger, establishing prayer, paying Zakat, performing Hajj, and fasting Ramadan.',
    urdu: 'اسلام پانچ ستونوں پر قائم ہے: اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اللہ کے رسول ہیں کی گواہی، نماز قائم کرنا، زکوٰۃ دینا، حج کرنا اور رمضان کے روزے رکھنا۔',
    grade: 'sahih', narrator: 'Ibn Umar (RA)', chapter: 'Pillars of Islam',
  },
  {
    id: 'b3', bookId: 'bukhari', number: 13,
    arabic: 'لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    english: 'None of you will have faith until he loves for his brother what he loves for himself.',
    urdu: 'تم میں سے کوئی شخص اس وقت تک مومن نہیں ہو سکتا جب تک اپنے بھائی کے لیے وہی پسند نہ کرے جو اپنے لیے پسند کرتا ہے۔',
    grade: 'sahih', narrator: 'Anas ibn Malik (RA)', chapter: 'Faith',
  },
  {
    id: 'b4', bookId: 'bukhari', number: 59,
    arabic: 'مَنْ كَذَبَ عَلَيَّ مُتَعَمِّدًا فَلْيَتَبَوَّأْ مَقْعَدَهُ مِنَ النَّارِ',
    english: 'Whoever intentionally lies about me (attributes a false statement to me), let him take his seat in the Fire.',
    urdu: 'جو شخص جان بوجھ کر مجھ پر جھوٹ باندھے وہ اپنا ٹھکانہ جہنم میں تیار کر لے۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Knowledge',
  },
  {
    id: 'b5', bookId: 'bukhari', number: 79,
    arabic: 'مَثَلُ مَا بَعَثَنِي اللَّهُ بِهِ مِنَ الْهُدَى وَالْعِلْمِ كَمَثَلِ الْغَيْثِ الْكَثِيرِ',
    english: 'The example of what Allah has sent me with of guidance and knowledge is like heavy rain that falls on the earth; some of it is fertile soil that absorbs the rain and produces vegetation.',
    urdu: 'جو ہدایت اور علم دے کر اللہ نے مجھے مبعوث کیا ہے اس کی مثال اس بارش کی طرح ہے جو زمین پر برسے۔',
    grade: 'sahih', narrator: 'Abu Musa Al-Ashari (RA)', chapter: 'Knowledge',
  },
  {
    id: 'b6', bookId: 'bukhari', number: 5063,
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    english: 'The best among you are those who learn the Quran and teach it.',
    urdu: 'تم میں سے بہترین وہ ہے جو قرآن سیکھے اور سکھائے۔',
    grade: 'sahih', narrator: 'Uthman ibn Affan (RA)', chapter: 'Quran',
  },
  {
    id: 'b7', bookId: 'bukhari', number: 2442,
    arabic: 'اللَّهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيهِ',
    english: 'Allah helps the servant as long as the servant helps his brother.',
    urdu: 'اللہ اس وقت تک بندے کی مدد کرتا رہتا ہے جب تک بندہ اپنے بھائی کی مدد کرتا رہے۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Brotherhood',
  },
  {
    id: 'b8', bookId: 'bukhari', number: 6018,
    arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    english: 'Whoever believes in Allah and the Last Day should say something good or remain silent.',
    urdu: 'جو اللہ اور آخرت کے دن پر ایمان رکھتا ہو اسے چاہیے کہ اچھی بات کہے یا خاموش رہے۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Good Character',
  },
  {
    id: 'b9', bookId: 'bukhari', number: 6412,
    arabic: 'كُلُّ ابْنِ آدَمَ خَطَّاءٌ، وَخَيْرُ الْخَطَّائِينَ التَّوَّابُونَ',
    english: 'Every son of Adam makes mistakes, and the best of those who make mistakes are those who repent.',
    urdu: 'ہر انسان خطاکار ہے، اور بہترین خطاکار وہ ہیں جو توبہ کرتے ہیں۔',
    grade: 'hasan', narrator: 'Anas ibn Malik (RA)', chapter: 'Repentance',
  },
  {
    id: 'b10', bookId: 'bukhari', number: 2767,
    arabic: 'لاَ يَدْخُلُ الْجَنَّةَ مَنْ لاَ يَأْمَنُ جَارُهُ بَوَائِقَهُ',
    english: 'He will not enter Paradise whose neighbor is not safe from his evil.',
    urdu: 'وہ شخص جنت میں نہیں جائے گا جس کا پڑوسی اس کی تکلیفوں سے محفوظ نہ ہو۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Good Character',
  },
  {
    id: 'b11', bookId: 'bukhari', number: 3,
    arabic: 'وَإِذَا جَاءَ رَمَضَانُ، فُتِّحَتْ أَبْوَابُ الْجَنَّةِ، وَغُلِّقَتْ أَبْوَابُ جَهَنَّمَ، وَسُلْسِلَتِ الشَّيَاطِينُ',
    english: 'When Ramadan comes, the gates of Paradise are opened, the gates of Hell are closed, and the devils are chained.',
    urdu: 'جب رمضان آتا ہے تو جنت کے دروازے کھول دیے جاتے ہیں، جہنم کے دروازے بند کر دیے جاتے ہیں اور شیاطین کو زنجیروں میں جکڑ دیا جاتا ہے۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Fasting',
  },
  {
    id: 'b12', bookId: 'bukhari', number: 6502,
    arabic: 'يَقُولُ اللَّهُ تَعَالَى: أَنَا عِنْدَ ظَنِّ عَبْدِي بِي، وَأَنَا مَعَهُ إِذَا ذَكَرَنِي',
    english: 'Allah says: "I am as My servant expects Me to be, and I am with him when he remembers Me."',
    urdu: 'اللہ تعالیٰ فرماتا ہے: میں اپنے بندے کے گمان کے مطابق ہوں، اور جب وہ مجھے یاد کرتا ہے تو میں اس کے ساتھ ہوتا ہوں۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Remembrance of Allah',
  },
  {
    id: 'b13', bookId: 'bukhari', number: 1385,
    arabic: 'مَا مِنْ مَوْلُودٍ إِلَّا يُولَدُ عَلَى الْفِطْرَةِ، فَأَبَوَاهُ يُهَوِّدَانِهِ أَوْ يُنَصِّرَانِهِ أَوْ يُمَجِّسَانِهِ',
    english: 'Every child is born upon the natural disposition (fitrah), then his parents make him Jewish, Christian, or Zoroastrian.',
    urdu: 'ہر بچہ فطرت پر پیدا ہوتا ہے، پھر اس کے والدین اسے یہودی، عیسائی یا مجوسی بناتے ہیں۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Funerals',
  },
  {
    id: 'b14', bookId: 'bukhari', number: 6940,
    arabic: 'لَيْسَ الْمُؤْمِنُ بِالطَّعَّانِ وَلاَ اللَّعَّانِ وَلاَ الْفَاحِشِ وَلاَ الْبَذِيءِ',
    english: 'The believer does not taunt others, does not curse them, is not obscene, and is not rude.',
    urdu: 'مومن طعنہ باز نہیں ہوتا، لعنت کرنے والا نہیں ہوتا، فحش گو نہیں ہوتا اور بدزبان نہیں ہوتا۔',
    grade: 'sahih', narrator: 'Abdullah ibn Masood (RA)', chapter: 'Good Character',
  },
  {
    id: 'b15', bookId: 'bukhari', number: 2647,
    arabic: 'الْمُسْلِمُ أَخُو الْمُسْلِمِ، لاَ يَظْلِمُهُ وَلاَ يُسْلِمُهُ',
    english: 'A Muslim is the brother of a Muslim; he does not wrong him nor does he hand him over (to the enemy).',
    urdu: 'مسلمان مسلمان کا بھائی ہے، وہ نہ اس پر ظلم کرتا ہے اور نہ اسے دشمن کے حوالے کرتا ہے۔',
    grade: 'sahih', narrator: 'Abdullah ibn Umar (RA)', chapter: 'Oppression',
  },

  // ─────────────────────────────────────────────
  // SAHIH MUSLIM (10 hadiths)
  // ─────────────────────────────────────────────
  {
    id: 'm1', bookId: 'muslim', number: 223,
    arabic: 'الطَّهُورُ شَطْرُ الإِيمَانِ',
    english: 'Purity is half of faith.',
    urdu: 'پاکی ایمان کا نصف ہے۔',
    grade: 'sahih', narrator: 'Abu Malik Al-Ashari (RA)', chapter: 'Purification',
  },
  {
    id: 'm2', bookId: 'muslim', number: 2553,
    arabic: 'إِنَّ اللَّهَ لاَ يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ، وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ',
    english: 'Allah does not look at your appearance or wealth, but He looks at your hearts and deeds.',
    urdu: 'اللہ تمہاری صورتوں اور مالوں کو نہیں دیکھتا، بلکہ تمہارے دلوں اور اعمال کو دیکھتا ہے۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Virtue',
  },
  {
    id: 'm3', bookId: 'muslim', number: 2577,
    arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    english: 'A Muslim is one from whose tongue and hand other Muslims are safe.',
    urdu: 'مسلمان وہ ہے جس کی زبان اور ہاتھ سے دوسرے مسلمان محفوظ ہوں۔',
    grade: 'sahih', narrator: 'Abdullah ibn Amr (RA)', chapter: 'Faith',
  },
  {
    id: 'm4', bookId: 'muslim', number: 1006,
    arabic: 'إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلاَّ مِنْ ثَلاَثَةٍ: إِلاَّ مِنْ صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ',
    english: 'When a person dies, all their deeds end except three: a continuing charity, knowledge that others benefit from, or a righteous child who prays for them.',
    urdu: 'جب انسان مر جاتا ہے تو اس کے اعمال منقطع ہو جاتے ہیں سوائے تین کے: صدقہ جاریہ، یا وہ علم جس سے فائدہ اٹھایا جائے، یا نیک اولاد جو اس کے لیے دعا کرے۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Charity',
  },
  {
    id: 'm5', bookId: 'muslim', number: 55,
    arabic: 'لاَ تَحَاسَدُوا، وَلاَ تَنَاجَشُوا، وَلاَ تَبَاغَضُوا، وَلاَ تَدَابَرُوا، وَكُونُوا عِبَادَ اللَّهِ إِخْوَانًا',
    english: 'Do not envy each other, do not outbid each other (in prices), do not hate each other, do not turn away from each other, and be slaves of Allah as brothers.',
    urdu: 'ایک دوسرے سے حسد نہ کرو، ایک دوسرے کی بولی نہ لگاؤ، ایک دوسرے سے بغض نہ رکھو، ایک دوسرے سے منہ نہ موڑو، اور اللہ کے بندے بھائی بھائی بن کر رہو۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Brotherhood',
  },
  {
    id: 'm6', bookId: 'muslim', number: 2564,
    arabic: 'احْرِصْ عَلَى مَا يَنْفَعُكَ، وَاسْتَعِنْ بِاللَّهِ وَلاَ تَعْجَزْ',
    english: 'Be keen to do what benefits you, seek Allah\'s help, and do not give up.',
    urdu: 'اس چیز پر حریص رہو جو تمہیں فائدہ دے، اللہ سے مدد مانگو اور عاجز نہ ہو۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Destiny',
  },
  {
    id: 'm7', bookId: 'muslim', number: 4677,
    arabic: 'إِنَّ الدِّينَ يُسْرٌ، وَلَنْ يُشَادَّ الدِّينَ أَحَدٌ إِلاَّ غَلَبَهُ',
    english: 'Religion is easy, and whoever makes it difficult will be overcome by it.',
    urdu: 'دین آسان ہے، جو شخص دین میں مشقت ڈالے گا وہ اس پر غالب نہیں آ سکے گا۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Prayer',
  },
  {
    id: 'm8', bookId: 'muslim', number: 681,
    arabic: 'أَفْضَلُ الصَّلاَةِ صَلاَةُ الْمَرْءِ فِي بَيْتِهِ إِلاَّ الْمَكْتُوبَةَ',
    english: 'The best prayer of a person is that which he prays in his home, except for the obligatory prayers.',
    urdu: 'آدمی کی بہترین نماز وہ ہے جو وہ اپنے گھر میں پڑھے، سوائے فرض نماز کے۔',
    grade: 'sahih', narrator: 'Zayd ibn Thabit (RA)', chapter: 'Prayer',
  },
  {
    id: 'm9', bookId: 'muslim', number: 2699,
    arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ',
    english: 'Whoever travels a path seeking knowledge, Allah will make easy for him a path to Paradise.',
    urdu: 'جو شخص علم حاصل کرنے کے لیے کوئی راستہ اختیار کرے اللہ اس کے لیے جنت کا راستہ آسان کر دیتا ہے۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Knowledge',
  },
  {
    id: 'm10', bookId: 'muslim', number: 2865,
    arabic: 'الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ',
    english: 'The world is a prison for the believer and a paradise for the disbeliever.',
    urdu: 'دنیا مومن کے لیے قید خانہ اور کافر کے لیے جنت ہے۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Renunciation',
  },

  // ─────────────────────────────────────────────
  // JAMI' AT-TIRMIDHI (10 hadiths)
  // ─────────────────────────────────────────────
  {
    id: 't1', bookId: 'tirmidhi', number: 2516,
    arabic: 'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ',
    english: 'Fear Allah wherever you are, follow a bad deed with a good one and it will wipe it out, and treat people with good character.',
    urdu: 'جہاں بھی ہو اللہ سے ڈرو، برائی کے بعد نیکی کرو جو اسے مٹا دے گی، اور لوگوں کے ساتھ اچھے اخلاق سے پیش آؤ۔',
    grade: 'hasan', narrator: 'Muadh ibn Jabal (RA)', chapter: 'Good Character',
  },
  {
    id: 't2', bookId: 'tirmidhi', number: 2375,
    arabic: 'كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ',
    english: 'Be in this world as if you were a stranger or a wayfarer.',
    urdu: 'دنیا میں اس طرح رہو جیسے کوئی اجنبی یا مسافر ہو۔',
    grade: 'sahih', narrator: 'Abdullah ibn Umar (RA)', chapter: 'Renunciation',
  },
  {
    id: 't3', bookId: 'tirmidhi', number: 2004,
    arabic: 'الدُّنْيَا مَتَاعٌ، وَخَيْرُ مَتَاعِ الدُّنْيَا الْمَرْأَةُ الصَّالِحَةُ',
    english: 'The world is but a provision, and the best provision of the world is a righteous spouse.',
    urdu: 'دنیا سامان ہے، اور دنیا کا بہترین سامان نیک بیوی ہے۔',
    grade: 'sahih', narrator: 'Abdullah ibn Amr (RA)', chapter: 'Marriage',
  },
  {
    id: 't4', bookId: 'tirmidhi', number: 1987,
    arabic: 'أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا، وَخِيَارُكُمْ خِيَارُكُمْ لِنِسَائِهِمْ',
    english: 'The most perfect believers in faith are those who are best in character, and the best of you are those who are best to their wives.',
    urdu: 'ایمان کے اعتبار سے مکمل ترین مومن وہ ہے جو اخلاق میں سب سے اچھا ہو، اور تم میں بہترین وہ ہے جو اپنی بیویوں کے ساتھ بہترین ہو۔',
    grade: 'hasan', narrator: 'Abu Hurayrah (RA)', chapter: 'Marriage',
  },
  {
    id: 't5', bookId: 'tirmidhi', number: 3545,
    arabic: 'أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ، فَأَكْثِرُوا الدُّعَاءَ',
    english: 'The closest a servant is to his Lord is when he is in prostration, so make much supplication.',
    urdu: 'بندہ اپنے رب کے سب سے قریب سجدے کی حالت میں ہوتا ہے، پس کثرت سے دعا کرو۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Supplication',
  },
  {
    id: 't6', bookId: 'tirmidhi', number: 2346,
    arabic: 'انْظُرُوا إِلَى مَنْ هُوَ أَسْفَلَ مِنْكُمْ وَلاَ تَنْظُرُوا إِلَى مَنْ هُوَ فَوْقَكُمْ',
    english: 'Look at those below you (in worldly matters) and do not look at those above you, for that is more likely to prevent you from undervaluing the blessings of Allah.',
    urdu: 'ان لوگوں کو دیکھو جو تم سے نیچے ہیں اور ان کو نہ دیکھو جو تم سے اوپر ہیں، کیونکہ یہ اللہ کی نعمتوں کو حقیر سمجھنے سے بچانے میں زیادہ مناسب ہے۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Renunciation',
  },
  {
    id: 't7', bookId: 'tirmidhi', number: 1924,
    arabic: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ',
    english: 'The most beloved deeds to Allah are those that are most consistent, even if they are few.',
    urdu: 'اللہ کے نزدیک سب سے محبوب عمل وہ ہے جو ہمیشہ کیا جائے، چاہے تھوڑا ہو۔',
    grade: 'sahih', narrator: 'Aisha (RA)', chapter: 'Good Character',
  },
  {
    id: 't8', bookId: 'tirmidhi', number: 3600,
    arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    english: "O Allah, You are Forgiving and love forgiveness, so forgive me.",
    urdu: 'اے اللہ! بے شک تو معاف کرنے والا ہے اور معافی کو پسند کرتا ہے، پس مجھے معاف فرما۔',
    grade: 'sahih', narrator: 'Aisha (RA)', chapter: 'Night of Power',
  },
  {
    id: 't9', bookId: 'tirmidhi', number: 2388,
    arabic: 'التَّائِبُ مِنَ الذَّنْبِ كَمَنْ لاَ ذَنْبَ لَهُ',
    english: 'The one who repents from sin is like one who has no sin.',
    urdu: 'گناہ سے توبہ کرنے والا ایسا ہے جیسے اس نے کوئی گناہ کیا ہی نہ ہو۔',
    grade: 'hasan', narrator: 'Abdullah ibn Masood (RA)', chapter: 'Repentance',
  },
  {
    id: 't10', bookId: 'tirmidhi', number: 2687,
    arabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
    english: 'Seeking knowledge is an obligation upon every Muslim.',
    urdu: 'علم حاصل کرنا ہر مسلمان پر فرض ہے۔',
    grade: 'sahih', narrator: 'Anas ibn Malik (RA)', chapter: 'Knowledge',
  },

  // ─────────────────────────────────────────────
  // SUNAN ABU DAWUD (8 hadiths)
  // ─────────────────────────────────────────────
  {
    id: 'ad1', bookId: 'abudawud', number: 4800,
    arabic: 'إِنَّ مِنْ أَحَبِّكُمْ إِلَيَّ وَأَقْرَبِكُمْ مِنِّي مَجْلِسًا يَوْمَ الْقِيَامَةِ أَحَاسِنَكُمْ أَخْلاَقًا',
    english: 'The most beloved of you to me and the closest to me in the Hereafter are those who are best in character.',
    urdu: 'تم میں سے مجھے سب سے زیادہ محبوب اور قیامت میں میرے سب سے قریب وہ ہوگا جس کے اخلاق سب سے اچھے ہوں۔',
    grade: 'hasan', narrator: 'Jabir ibn Abdullah (RA)', chapter: 'Good Character',
  },
  {
    id: 'ad2', bookId: 'abudawud', number: 1495,
    arabic: 'مَا مِنْ مُسْلِمٍ يَدْعُو بِدَعْوَةٍ لَيْسَ فِيهَا إِثْمٌ وَلاَ قَطِيعَةُ رَحِمٍ إِلاَّ أَعْطَاهُ اللَّهُ بِهَا إِحْدَى ثَلاَثٍ',
    english: 'No Muslim supplicates with a prayer that is free from sin or cutting family ties except that Allah gives him one of three things: He answers his prayer, He stores it for him in the Hereafter, or He averts evil from him equal to it.',
    urdu: 'کوئی مسلمان ایسی دعا نہیں کرتا جس میں نہ گناہ ہو اور نہ رشتہ توڑنا ہو، مگر اللہ اسے تین میں سے ایک چیز دیتا ہے۔',
    grade: 'sahih', narrator: 'Abu Said Al-Khudri (RA)', chapter: 'Supplication',
  },
  {
    id: 'ad3', bookId: 'abudawud', number: 4702,
    arabic: 'لاَ يَكُونُ الْمُؤْمِنُ لَعَّانًا',
    english: 'The believer is not one who frequently curses.',
    urdu: 'مومن بہت زیادہ لعنت کرنے والا نہیں ہوتا۔',
    grade: 'sahih', narrator: 'Abdullah ibn Masood (RA)', chapter: 'Good Character',
  },
  {
    id: 'ad4', bookId: 'abudawud', number: 1522,
    arabic: 'مَنْ لَمْ يَشْكُرِ النَّاسَ لَمْ يَشْكُرِ اللَّهَ',
    english: 'Whoever does not thank people has not thanked Allah.',
    urdu: 'جو لوگوں کا شکریہ ادا نہیں کرتا وہ اللہ کا شکر بھی ادا نہیں کرتا۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Good Character',
  },
  {
    id: 'ad5', bookId: 'abudawud', number: 2626,
    arabic: 'مَنْ رَأَى مِنْكُمْ مُنْكَرًا فَلْيُغَيِّرْهُ بِيَدِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِلِسَانِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِقَلْبِهِ',
    english: 'Whoever of you sees an evil must change it with his hand; if he is unable to, then with his tongue; if he is unable to, then with his heart — and that is the weakest degree of faith.',
    urdu: 'تم میں سے جو کوئی برائی دیکھے اسے اپنے ہاتھ سے بدل دے، اگر نہ کر سکے تو زبان سے، اگر یہ بھی نہ کر سکے تو دل سے، اور یہ ایمان کا کمزور ترین درجہ ہے۔',
    grade: 'sahih', narrator: 'Abu Said Al-Khudri (RA)', chapter: 'Commanding Good',
  },
  {
    id: 'ad6', bookId: 'abudawud', number: 3855,
    arabic: 'تَصَدَّقُوا وَلَوْ بِشِقِّ تَمْرَةٍ',
    english: 'Give in charity, even if it is half a date.',
    urdu: 'صدقہ دو، چاہے کھجور کا آدھا ٹکڑا ہی ہو۔',
    grade: 'sahih', narrator: 'Adi ibn Hatim (RA)', chapter: 'Zakat',
  },
  {
    id: 'ad7', bookId: 'abudawud', number: 2178,
    arabic: 'أَبْغَضُ الْحَلاَلِ إِلَى اللَّهِ الطَّلاَقُ',
    english: 'The most hated permissible thing to Allah is divorce.',
    urdu: 'اللہ کو سب سے زیادہ ناپسند حلال چیز طلاق ہے۔',
    grade: 'hasan', narrator: 'Ibn Umar (RA)', chapter: 'Divorce',
  },
  {
    id: 'ad8', bookId: 'abudawud', number: 1474,
    arabic: 'مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا',
    english: 'Whoever recites a letter of the Book of Allah will receive a good deed, and each good deed is multiplied by ten.',
    urdu: 'جو شخص اللہ کی کتاب کا ایک حرف پڑھے اسے اس کی وجہ سے ایک نیکی ملتی ہے، اور نیکی دس گنا ملتی ہے۔',
    grade: 'sahih', narrator: 'Abdullah ibn Masood (RA)', chapter: 'Quran',
  },

  // ─────────────────────────────────────────────
  // SUNAN IBN MAJAH (8 hadiths)
  // ─────────────────────────────────────────────
  {
    id: 'im1', bookId: 'ibnmajah', number: 4105,
    arabic: 'كُلُّ الْمُسْلِمِ عَلَى الْمُسْلِمِ حَرَامٌ: دَمُهُ وَمَالُهُ وَعِرْضُهُ',
    english: 'Everything of a Muslim is forbidden for another Muslim: his blood, his property, and his honor.',
    urdu: 'ہر مسلمان کا خون، مال اور عزت دوسرے مسلمان پر حرام ہے۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Rights',
  },
  {
    id: 'im2', bookId: 'ibnmajah', number: 224,
    arabic: 'الْعُلَمَاءُ وَرَثَةُ الأَنْبِيَاءِ',
    english: 'The scholars are the inheritors of the Prophets.',
    urdu: 'علما انبیاء کے وارث ہیں۔',
    grade: 'sahih', narrator: 'Abu Darda (RA)', chapter: 'Knowledge',
  },
  {
    id: 'im3', bookId: 'ibnmajah', number: 1846,
    arabic: 'خَيْرُكُمْ خَيْرُكُمْ لأَهْلِهِ، وَأَنَا خَيْرُكُمْ لأَهْلِي',
    english: 'The best of you is the one who is best to his family, and I am the best of you to my family.',
    urdu: 'تم میں بہترین وہ ہے جو اپنے گھر والوں کے ساتھ بہترین ہو، اور میں اپنے گھر والوں کے ساتھ تم میں سب سے بہتر ہوں۔',
    grade: 'sahih', narrator: 'Aisha (RA)', chapter: 'Marriage',
  },
  {
    id: 'im4', bookId: 'ibnmajah', number: 3660,
    arabic: 'مَنْ مَاتَ وَهُوَ يَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ دَخَلَ الْجَنَّةَ',
    english: 'Whoever dies while bearing witness that there is no god but Allah will enter Paradise.',
    urdu: 'جو شخص اس حال میں مرے کہ وہ گواہی دیتا ہو کہ اللہ کے سوا کوئی معبود نہیں، وہ جنت میں داخل ہوگا۔',
    grade: 'sahih', narrator: 'Muadh ibn Jabal (RA)', chapter: 'Paradise',
  },
  {
    id: 'im5', bookId: 'ibnmajah', number: 4341,
    arabic: 'الصَّبْرُ نِصْفُ الإِيمَانِ',
    english: 'Patience is half of faith.',
    urdu: 'صبر ایمان کا نصف ہے۔',
    grade: 'hasan', narrator: 'Abu Hurayrah (RA)', chapter: 'Patience',
  },
  {
    id: 'im6', bookId: 'ibnmajah', number: 2340,
    arabic: 'لاَ ضَرَرَ وَلاَ ضِرَارَ',
    english: 'There should be neither harm nor reciprocating harm.',
    urdu: 'نہ نقصان پہنچانا اور نہ نقصان اٹھانا۔',
    grade: 'sahih', narrator: 'Ibn Abbas (RA)', chapter: 'Islamic Law',
  },
  {
    id: 'im7', bookId: 'ibnmajah', number: 3303,
    arabic: 'الْبَرَكَةُ مَعَ أَكَابِرِكُمْ',
    english: 'Blessing is with your elders.',
    urdu: 'برکت تمہارے بڑوں کے ساتھ ہے۔',
    grade: 'sahih', narrator: 'Ibn Abbas (RA)', chapter: 'Good Character',
  },
  {
    id: 'im8', bookId: 'ibnmajah', number: 4028,
    arabic: 'اغْتَنِمْ خَمْسًا قَبْلَ خَمْسٍ: شَبَابَكَ قَبْلَ هَرَمِكَ، وَصِحَّتَكَ قَبْلَ سَقَمِكَ، وَغِنَاكَ قَبْلَ فَقْرِكَ، وَفَرَاغَكَ قَبْلَ شُغْلِكَ، وَحَيَاتَكَ قَبْلَ مَوْتِكَ',
    english: 'Take advantage of five before five: your youth before old age, your health before illness, your wealth before poverty, your free time before being occupied, and your life before death.',
    urdu: 'پانچ چیزوں کو پانچ سے پہلے غنیمت سمجھو: جوانی کو بڑھاپے سے پہلے، صحت کو بیماری سے پہلے، دولت کو غربت سے پہلے، فراغت کو مشغولیت سے پہلے اور زندگی کو موت سے پہلے۔',
    grade: 'sahih', narrator: 'Ibn Abbas (RA)', chapter: 'Renunciation',
  },

  // ─────────────────────────────────────────────
  // SUNAN AN-NASAI (8 hadiths)
  // ─────────────────────────────────────────────
  {
    id: 'n1', bookId: 'nasai', number: 5,
    arabic: 'مِفْتَاحُ الصَّلاَةِ الطُّهُورُ، وَتَحْرِيمُهَا التَّكْبِيرُ، وَتَحْلِيلُهَا التَّسْلِيمُ',
    english: 'The key to prayer is purity, its beginning is Takbeer (Allahu Akbar) and its ending is Tasleem (Assalamu Alaikum).',
    urdu: 'نماز کی چابی پاکی ہے، اس کا آغاز تکبیر سے ہوتا ہے اور اختتام سلام سے۔',
    grade: 'sahih', narrator: 'Ali ibn Abi Talib (RA)', chapter: 'Prayer',
  },
  {
    id: 'n2', bookId: 'nasai', number: 1306,
    arabic: 'الصَّلاَةُ عَلَى وَقْتِهَا',
    english: 'Prayer at its proper time is the most beloved deed to Allah.',
    urdu: 'وقت پر نماز پڑھنا اللہ کے نزدیک سب سے محبوب عمل ہے۔',
    grade: 'sahih', narrator: 'Abdullah ibn Masood (RA)', chapter: 'Prayer Times',
  },
  {
    id: 'n3', bookId: 'nasai', number: 2236,
    arabic: 'صُومُوا لِرُؤْيَتِهِ وَأَفْطِرُوا لِرُؤْيَتِهِ، فَإِنْ غُمَّ عَلَيْكُمْ فَأَكْمِلُوا الْعِدَّةَ ثَلاَثِينَ',
    english: 'Fast when you sight it (the crescent) and break your fast when you sight it, and if it is obscured, then complete thirty days.',
    urdu: 'چاند دیکھ کر روزہ رکھو اور چاند دیکھ کر روزہ کھولو، اگر ابر چھا جائے تو تیس دن پورے کرو۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Fasting',
  },
  {
    id: 'n4', bookId: 'nasai', number: 2512,
    arabic: 'الصِّيَامُ جُنَّةٌ مِنَ النَّارِ كَجُنَّةِ أَحَدِكُمْ مِنَ الْقِتَالِ',
    english: 'Fasting is a shield from the Fire, just as a shield in battle.',
    urdu: 'روزہ جہنم سے ڈھال ہے جیسے جنگ میں ڈھال ہوتی ہے۔',
    grade: 'sahih', narrator: 'Uthman ibn Abi Al-As (RA)', chapter: 'Fasting',
  },
  {
    id: 'n5', bookId: 'nasai', number: 2437,
    arabic: 'مَنْ صَامَ يَوْمًا فِي سَبِيلِ اللَّهِ، بَعَّدَ اللَّهُ وَجْهَهُ عَنِ النَّارِ سَبْعِينَ خَرِيفًا',
    english: 'Whoever fasts one day for the sake of Allah, Allah will keep his face away from the Fire by a distance of seventy years.',
    urdu: 'جو شخص اللہ کی راہ میں ایک دن روزہ رکھے، اللہ اس کے چہرے کو ستر سال کی مسافت تک آگ سے دور کر دیتا ہے۔',
    grade: 'sahih', narrator: 'Abu Said Al-Khudri (RA)', chapter: 'Fasting',
  },
  {
    id: 'n6', bookId: 'nasai', number: 1631,
    arabic: 'أَوَّلُ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ صَلاَتُهُ',
    english: 'The first thing a servant will be held accountable for on the Day of Resurrection is his prayer.',
    urdu: 'قیامت کے دن بندے سے سب سے پہلے نماز کا حساب لیا جائے گا۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Prayer',
  },
  {
    id: 'n7', bookId: 'nasai', number: 3943,
    arabic: 'خُذُوا الزَّكَاةَ مِنَ الأَغْنِيَاءِ وَرُدُّوهَا فِي الْفُقَرَاءِ',
    english: 'Take the Zakat from the wealthy and give it to the poor.',
    urdu: 'مالداروں سے زکوٰۃ لو اور فقراء میں تقسیم کرو۔',
    grade: 'sahih', narrator: 'Ibn Abbas (RA)', chapter: 'Zakat',
  },
  {
    id: 'n8', bookId: 'nasai', number: 5761,
    arabic: 'إِنَّ أَحَبَّ الْكَلاَمِ إِلَى اللَّهِ أَنْ يَقُولَ الْعَبْدُ: سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ',
    english: "The most beloved words to Allah are when a servant says: 'Subhanakallahumma wa bihamdika' (Glory be to You, O Allah, and all praise is due to You).",
    urdu: 'اللہ کو سب سے محبوب کلام وہ ہے جب بندہ کہے: سبحانک اللہم وبحمدک۔',
    grade: 'sahih', narrator: 'Jubayr ibn Mutim (RA)', chapter: 'Remembrance',
  },

  // ─────────────────────────────────────────────
  // MUWATTA IMAM MALIK (8 hadiths)
  // ─────────────────────────────────────────────
  {
    id: 'mk1', bookId: 'malik', number: 1614,
    arabic: 'تَرَكْتُ فِيكُمْ أَمْرَيْنِ لَنْ تَضِلُّوا مَا تَمَسَّكْتُمْ بِهِمَا: كِتَابَ اللَّهِ وَسُنَّةَ نَبِيِّهِ',
    english: 'I have left among you two things; you will never go astray as long as you hold fast to them: the Book of Allah and the Sunnah of His Prophet.',
    urdu: 'میں تم میں دو چیزیں چھوڑ کر جا رہا ہوں، جب تک تم انہیں تھامے رہو گے گمراہ نہ ہو گے: اللہ کی کتاب اور اس کے نبی ﷺ کی سنت۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Prophetic Will',
  },
  {
    id: 'mk2', bookId: 'malik', number: 8,
    arabic: 'إِنَّمَا بُعِثْتُ لأُتَمِّمَ حُسْنَ الأَخْلاَقِ',
    english: 'I was only sent to perfect good character.',
    urdu: 'مجھے صرف اس لیے بھیجا گیا ہے کہ میں اچھے اخلاق کو مکمل کروں۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Good Character',
  },
  {
    id: 'mk3', bookId: 'malik', number: 1864,
    arabic: 'التَّسْلِيمُ قَبْلَ الْكَلاَمِ',
    english: 'Greeting (with Salam) comes before speech.',
    urdu: 'سلام بات سے پہلے ہے۔',
    grade: 'sahih', narrator: 'Jabir ibn Abdullah (RA)', chapter: 'Good Character',
  },
  {
    id: 'mk4', bookId: 'malik', number: 1726,
    arabic: 'لاَ يَكُونُ الرَّجُلُ عَالِمًا حَتَّى لاَ يَحْسُدَ مَنْ فَوْقَهُ وَلاَ يَحْقِرَ مَنْ دُونَهُ',
    english: 'A man does not become a true scholar until he does not envy those above him and does not despise those below him.',
    urdu: 'آدمی اس وقت تک عالم نہیں ہوتا جب تک وہ اپنے سے بڑوں سے حسد نہ کرے اور اپنے سے چھوٹوں کو حقیر نہ سمجھے۔',
    grade: 'sahih', narrator: 'Malik ibn Anas', chapter: 'Knowledge',
  },
  {
    id: 'mk5', bookId: 'malik', number: 1578,
    arabic: 'مَنْ تَوَاضَعَ لِلَّهِ رَفَعَهُ اللَّهُ',
    english: 'Whoever humbles himself for the sake of Allah, Allah will raise him.',
    urdu: 'جو شخص اللہ کے لیے تواضع اختیار کرے اللہ اسے بلند کرتا ہے۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Humility',
  },
  {
    id: 'mk6', bookId: 'malik', number: 1760,
    arabic: 'الدِّينُ النَّصِيحَةُ',
    english: 'Religion is sincere advice (nasihah).',
    urdu: 'دین خیرخواہی کا نام ہے۔',
    grade: 'sahih', narrator: 'Tamim Ad-Dari (RA)', chapter: 'Faith',
  },
  {
    id: 'mk7', bookId: 'malik', number: 1597,
    arabic: 'الْبَيِّعَانِ بِالْخِيَارِ مَا لَمْ يَتَفَرَّقَا',
    english: 'Both parties in a transaction have the right to annul it as long as they have not separated.',
    urdu: 'بیع کرنے والے دونوں جب تک جدا نہ ہوں اختیار رکھتے ہیں۔',
    grade: 'sahih', narrator: 'Malik ibn Anas', chapter: 'Trade',
  },
  {
    id: 'mk8', bookId: 'malik', number: 1700,
    arabic: 'مَنْ أَكَلَ مِمَّا يَقُومُ عَلَيْهِ غَيْرُهُ خَيْرٌ مِنْ أَنْ يَسْأَلَ النَّاسَ',
    english: 'Eating from the work of one\'s own hands is better than asking of people.',
    urdu: 'اپنے ہاتھ کی محنت سے کھانا لوگوں سے مانگنے سے بہتر ہے۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Livelihood',
  },

  // ─────────────────────────────────────────────
  // MUSNAD AHMAD (8 hadiths)
  // ─────────────────────────────────────────────
  {
    id: 'ah1', bookId: 'ahmad', number: 6650,
    arabic: 'إِنَّ مِنْ أَشَدِّ النَّاسِ عَذَابًا يَوْمَ الْقِيَامَةِ الْمُصَوِّرُونَ',
    english: 'The people who will receive the severest punishment on the Day of Resurrection will be those who imitate Allah\'s creation (image-makers who defy God).',
    urdu: 'قیامت کے دن سب سے زیادہ عذاب انہیں ملے گا جو تصویریں بناتے ہیں۔',
    grade: 'sahih', narrator: 'Abdullah ibn Masood (RA)', chapter: 'Prohibitions',
  },
  {
    id: 'ah2', bookId: 'ahmad', number: 8043,
    arabic: 'اتَّقُوا النَّارَ وَلَوْ بِشِقِّ تَمْرَةٍ، فَإِنْ لَمْ تَجِدُوا فَبِكَلِمَةٍ طَيِّبَةٍ',
    english: 'Guard yourselves against the Fire even by giving half a date in charity; if you cannot find that, then with a kind word.',
    urdu: 'جہنم سے بچو چاہے کھجور کا آدھا ٹکڑا دے کر، اگر نہ ملے تو اچھی بات کہہ کر۔',
    grade: 'sahih', narrator: 'Adi ibn Hatim (RA)', chapter: 'Charity',
  },
  {
    id: 'ah3', bookId: 'ahmad', number: 19389,
    arabic: 'الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ',
    english: 'The strong believer is better and more beloved to Allah than the weak believer, while there is good in both.',
    urdu: 'طاقتور مومن کمزور مومن سے بہتر اور اللہ کو زیادہ محبوب ہے، اگرچہ دونوں میں خیر ہے۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Faith',
  },
  {
    id: 'ah4', bookId: 'ahmad', number: 6610,
    arabic: 'مَا أَصَابَ الْمُسْلِمَ مِنْ نَصَبٍ، وَلاَ وَصَبٍ، وَلاَ هَمٍّ، وَلاَ حَزَنٍ، وَلاَ أَذًى، وَلاَ غَمٍّ، حَتَّى الشَّوْكَةِ يُشَاكُهَا إِلاَّ كَفَّرَ اللَّهُ بِهَا مِنْ خَطَايَاهُ',
    english: 'No fatigue, illness, anxiety, grief, harm, or distress befalls a Muslim — not even a thorn that pricks him — except that Allah expiates some of his sins by it.',
    urdu: 'کوئی تھکاوٹ، بیماری، فکر، غم، تکلیف یا رنج مسلمان کو نہیں پہنچتا، حتی کہ کانٹا بھی جو اسے چبھے، مگر اللہ اس کے ذریعے اس کے گناہ معاف کرتا ہے۔',
    grade: 'sahih', narrator: 'Abu Said & Abu Hurayrah (RA)', chapter: 'Patience',
  },
  {
    id: 'ah5', bookId: 'ahmad', number: 17471,
    arabic: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَنْ تَمُوتَ وَلِسَانُكَ رَطْبٌ مِنْ ذِكْرِ اللَّهِ',
    english: 'The most beloved deeds to Allah is that you die while your tongue is moist with the remembrance of Allah.',
    urdu: 'اللہ کو سب سے محبوب عمل یہ ہے کہ تم مرو اور تمہاری زبان اللہ کے ذکر سے تر ہو۔',
    grade: 'sahih', narrator: 'Abdullah ibn Lahi\'ah (RA)', chapter: 'Remembrance',
  },
  {
    id: 'ah6', bookId: 'ahmad', number: 3600,
    arabic: 'إِنَّ اللَّهَ كَتَبَ الإِحْسَانَ عَلَى كُلِّ شَيْءٍ',
    english: 'Indeed Allah has prescribed excellence (Ihsan) in all things.',
    urdu: 'اللہ نے ہر چیز میں احسان کو فرض کیا ہے۔',
    grade: 'sahih', narrator: 'Shaddad ibn Aws (RA)', chapter: 'Good Character',
  },
  {
    id: 'ah7', bookId: 'ahmad', number: 27647,
    arabic: 'لاَ تَحْتَقِرَنَّ مِنَ الْمَعْرُوفِ شَيْئًا وَلَوْ أَنْ تَلْقَى أَخَاكَ بِوَجْهٍ طَلِقٍ',
    english: 'Do not belittle any act of kindness, even meeting your brother with a cheerful face.',
    urdu: 'کسی نیک کام کو حقیر نہ سمجھو، چاہے اپنے بھائی سے خوش چہرے کے ساتھ ملنا ہی ہو۔',
    grade: 'sahih', narrator: 'Abu Dharr Al-Ghifari (RA)', chapter: 'Good Character',
  },
  {
    id: 'ah8', bookId: 'ahmad', number: 12495,
    arabic: 'أَطِعِ اللَّهَ وَرَسُولَهُ، وَلاَ تَنَازَعُوا فَتَفْشَلُوا وَتَذْهَبَ رِيحُكُمْ',
    english: 'Obey Allah and His Messenger, and do not dispute with one another, lest you lose courage and your strength departs.',
    urdu: 'اللہ اور اس کے رسول کی اطاعت کرو اور آپس میں جھگڑا نہ کرو ورنہ بزدل ہو جاؤ گے اور تمہاری ہوا اکھڑ جائے گی۔',
    grade: 'sahih', narrator: 'Abu Said Al-Khudri (RA)', chapter: 'Unity',
  },
];
