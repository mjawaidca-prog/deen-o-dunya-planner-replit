export interface HadithBook {
  id: string;
  name: string;
  arabicName: string;
  author: string;
  total: number;
  description: string;
}

export const HADITH_BOOKS: HadithBook[] = [
  { id: 'bukhari', name: 'Sahih Al-Bukhari', arabicName: 'صحيح البخاري', author: 'Imam Al-Bukhari', total: 7563, description: 'The most authentic collection of hadith.' },
  { id: 'muslim', name: 'Sahih Muslim', arabicName: 'صحيح مسلم', author: 'Imam Muslim', total: 7563, description: 'Second most authentic hadith collection.' },
  { id: 'tirmidhi', name: "Jami' At-Tirmidhi", arabicName: 'جامع الترمذي', author: 'Imam At-Tirmidhi', total: 3956, description: 'Comprehensive collection with hadith grades.' },
  { id: 'abudawud', name: 'Sunan Abu Dawud', arabicName: 'سنن أبي داود', author: 'Imam Abu Dawud', total: 5274, description: 'Focus on jurisprudential hadiths.' },
  { id: 'ibnmajah', name: 'Sunan Ibn Majah', arabicName: 'سنن ابن ماجه', author: 'Imam Ibn Majah', total: 4341, description: 'Important collection of prophetic traditions.' },
  { id: 'nasai', name: "Sunan An-Nasa'i", arabicName: 'سنن النسائي', author: "Imam An-Nasa'i", total: 5761, description: 'Known for strictness in accepting narrators.' },
  { id: 'malik', name: 'Muwatta Imam Malik', arabicName: 'موطأ الإمام مالك', author: 'Imam Malik', total: 1594, description: 'Earliest compiled hadith collection.' },
  { id: 'ahmad', name: 'Musnad Ahmad', arabicName: 'مسند أحمد', author: 'Imam Ahmad ibn Hanbal', total: 27647, description: 'Largest collection of prophetic traditions.' },
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
  {
    id: 'b1', bookId: 'bukhari', number: 1, arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    english: 'Actions are judged by intentions, and every person will get what they intended.',
    urdu: 'اعمال کا دارومدار نیتوں پر ہے، اور ہر شخص کو وہی ملے گا جو اس نے نیت کی۔',
    grade: 'sahih', narrator: 'Umar ibn al-Khattab (RA)', chapter: 'Revelation',
  },
  {
    id: 'b2', bookId: 'bukhari', number: 8, arabic: 'بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَالْحَجِّ، وَصَوْمِ رَمَضَانَ',
    english: 'Islam is built upon five pillars: testifying that there is no god but Allah and that Muhammad is His messenger, establishing prayer, paying Zakat, performing Hajj, and fasting Ramadan.',
    urdu: 'اسلام پانچ ستونوں پر قائم ہے: اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اللہ کے رسول ہیں کی گواہی، نماز قائم کرنا، زکوٰۃ دینا، حج کرنا اور رمضان کے روزے رکھنا۔',
    grade: 'sahih', narrator: 'Ibn Umar (RA)', chapter: 'Pillars of Islam',
  },
  {
    id: 'b3', bookId: 'bukhari', number: 13, arabic: 'لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    english: 'None of you will have faith until he loves for his brother what he loves for himself.',
    urdu: 'تم میں سے کوئی شخص اس وقت تک مومن نہیں ہو سکتا جب تک اپنے بھائی کے لیے وہی پسند نہ کرے جو اپنے لیے پسند کرتا ہے۔',
    grade: 'sahih', narrator: 'Anas ibn Malik (RA)', chapter: 'Faith',
  },
  {
    id: 'b4', bookId: 'bukhari', number: 6412, arabic: 'كُلُّ ابْنِ آدَمَ خَطَّاءٌ، وَخَيْرُ الْخَطَّائِينَ التَّوَّابُونَ',
    english: 'Every son of Adam makes mistakes, and the best of those who make mistakes are those who repent.',
    urdu: 'ہر انسان خطاکار ہے، اور بہترین خطاکار وہ ہیں جو توبہ کرتے ہیں۔',
    grade: 'hasan', narrator: 'Anas ibn Malik (RA)', chapter: 'Repentance',
  },
  {
    id: 'b5', bookId: 'bukhari', number: 5063, arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    english: 'The best among you are those who learn the Quran and teach it.',
    urdu: 'تم میں سے بہترین وہ ہے جو قرآن سیکھے اور سکھائے۔',
    grade: 'sahih', narrator: 'Uthman ibn Affan (RA)', chapter: 'Quran',
  },
  {
    id: 'm1', bookId: 'muslim', number: 223, arabic: 'الطَّهُورُ شَطْرُ الإِيمَانِ',
    english: 'Purity is half of faith.',
    urdu: 'پاکی ایمان کا نصف ہے۔',
    grade: 'sahih', narrator: 'Abu Malik Al-Ashari (RA)', chapter: 'Purification',
  },
  {
    id: 'm2', bookId: 'muslim', number: 2553, arabic: 'إِنَّ اللَّهَ لاَ يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ، وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ',
    english: 'Allah does not look at your appearance or wealth, but He looks at your hearts and deeds.',
    urdu: 'اللہ تمہاری صورتوں اور مالوں کو نہیں دیکھتا، بلکہ تمہارے دلوں اور اعمال کو دیکھتا ہے۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Virtue',
  },
  {
    id: 'm3', bookId: 'muslim', number: 2577, arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    english: 'A Muslim is one from whose tongue and hand other Muslims are safe.',
    urdu: 'مسلمان وہ ہے جس کی زبان اور ہاتھ سے دوسرے مسلمان محفوظ ہوں۔',
    grade: 'sahih', narrator: 'Abdullah ibn Amr (RA)', chapter: 'Character',
  },
  {
    id: 't1', bookId: 'tirmidhi', number: 2516, arabic: 'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ',
    english: 'Fear Allah wherever you are, follow a bad deed with a good one and it will wipe it out, and treat people with good character.',
    urdu: 'جہاں بھی ہو اللہ سے ڈرو، برائی کے بعد نیکی کرو جو اسے مٹا دے گی، اور لوگوں کے ساتھ اچھے اخلاق سے پیش آؤ۔',
    grade: 'hasan', narrator: 'Muadh ibn Jabal (RA)', chapter: 'Character',
  },
  {
    id: 't2', bookId: 'tirmidhi', number: 2375, arabic: 'كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ',
    english: 'Be in this world as if you were a stranger or a wayfarer.',
    urdu: 'دنیا میں اس طرح رہو جیسے کوئی اجنبی یا مسافر ہو۔',
    grade: 'sahih', narrator: 'Abdullah ibn Umar (RA)', chapter: 'Zuhd',
  },
  {
    id: 'ad1', bookId: 'abudawud', number: 4800, arabic: 'إِنَّ مِنْ أَحَبِّكُمْ إِلَيَّ وَأَقْرَبِكُمْ مِنِّي مَجْلِسًا يَوْمَ الْقِيَامَةِ أَحَاسِنَكُمْ أَخْلاَقًا',
    english: 'The most beloved of you to me and the closest to me in the Hereafter are those of you who are best in character.',
    urdu: 'تم میں سے مجھے سب سے زیادہ محبوب اور قیامت میں میرے سب سے قریب وہ ہوگا جس کے اخلاق سب سے اچھے ہوں۔',
    grade: 'hasan', narrator: 'Jabir ibn Abdullah (RA)', chapter: 'Character',
  },
  {
    id: 'im1', bookId: 'ibnmajah', number: 4105, arabic: 'كُلُّ الْمُسْلِمِ عَلَى الْمُسْلِمِ حَرَامٌ: دَمُهُ وَمَالُهُ وَعِرْضُهُ',
    english: 'Everything of a Muslim is forbidden for another Muslim: his blood, his property, and his honor.',
    urdu: 'ہر مسلمان کا خون، مال اور عزت دوسرے مسلمان پر حرام ہے۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Rights',
  },
  {
    id: 'n1', bookId: 'nasai', number: 5, arabic: 'مِفْتَاحُ الصَّلاَةِ الطُّهُورُ، وَتَحْرِيمُهَا التَّكْبِيرُ، وَتَحْلِيلُهَا التَّسْلِيمُ',
    english: 'The key to prayer is purity, its beginning is Takbeer (Allahu Akbar) and its ending is Tasleem (Assalamu Alaikum).',
    urdu: 'نماز کی چابی پاکی ہے، اس کا آغاز تکبیر سے ہوتا ہے اور اختتام سلام سے۔',
    grade: 'sahih', narrator: 'Ali ibn Abi Talib (RA)', chapter: 'Prayer',
  },
  {
    id: 'mk1', bookId: 'malik', number: 1614, arabic: 'تَرَكْتُ فِيكُمْ أَمْرَيْنِ لَنْ تَضِلُّوا مَا تَمَسَّكْتُمْ بِهِمَا: كِتَابَ اللَّهِ وَسُنَّةَ نَبِيِّهِ',
    english: 'I have left among you two things; you will never go astray as long as you hold fast to them: the Book of Allah and the Sunnah of His Prophet.',
    urdu: 'میں تم میں دو چیزیں چھوڑ کر جا رہا ہوں، جب تک تم انہیں تھامے رہو گے گمراہ نہ ہو گے: اللہ کی کتاب اور اس کے نبی ﷺ کی سنت۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Prophetic Will',
  },
  {
    id: 'b6', bookId: 'bukhari', number: 2442, arabic: 'اللَّهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيهِ',
    english: 'Allah helps the servant as long as the servant helps his brother.',
    urdu: 'اللہ اس وقت تک بندے کی مدد کرتا رہتا ہے جب تک بندہ اپنے بھائی کی مدد کرتا رہے۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Brotherhood',
  },
  {
    id: 'm4', bookId: 'muslim', number: 1006, arabic: 'إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلاَّ مِنْ ثَلاَثَةٍ: إِلاَّ مِنْ صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ',
    english: 'When a person dies, all their deeds end except three: a continuing charity, knowledge that others benefit from, or a righteous child who prays for them.',
    urdu: 'جب انسان مر جاتا ہے تو اس کے اعمال منقطع ہو جاتے ہیں سوائے تین کے: صدقہ جاریہ، یا وہ علم جس سے فائدہ اٹھایا جائے، یا نیک اولاد جو اس کے لیے دعا کرے۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Charity',
  },
  {
    id: 'b7', bookId: 'bukhari', number: 6018, arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    english: 'Whoever believes in Allah and the Last Day should say something good or remain silent.',
    urdu: 'جو اللہ اور آخرت کے دن پر ایمان رکھتا ہو اسے چاہیے کہ اچھی بات کہے یا خاموش رہے۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Speech',
  },
  {
    id: 't3', bookId: 'tirmidhi', number: 2004, arabic: 'الدُّنْيَا مَتَاعٌ، وَخَيْرُ مَتَاعِ الدُّنْيَا الْمَرْأَةُ الصَّالِحَةُ',
    english: 'The world is but a provision, and the best provision of the world is a righteous spouse.',
    urdu: 'دنیا سامان ہے، اور دنیا کا بہترین سامان نیک بیوی ہے۔',
    grade: 'sahih', narrator: 'Abdullah ibn Amr (RA)', chapter: 'Marriage',
  },
  {
    id: 'b8', bookId: 'bukhari', number: 2767, arabic: 'لاَ يَدْخُلُ الْجَنَّةَ مَنْ لاَ يَأْمَنُ جَارُهُ بَوَائِقَهُ',
    english: 'He will not enter Paradise whose neighbor is not safe from his evil.',
    urdu: 'وہ شخص جنت میں نہیں جائے گا جس کا پڑوسی اس کی تکلیفوں سے محفوظ نہ ہو۔',
    grade: 'sahih', narrator: 'Abu Hurayrah (RA)', chapter: 'Neighbors',
  },
];
