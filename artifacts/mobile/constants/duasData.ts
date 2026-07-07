export interface Dua {
  id: string;
  category: string;
  title: string;
  arabic: string;
  transliteration: string;
  english: string;
  urdu: string;
  reference: string;
}

export const DUA_CATEGORIES = [
  'Morning Adhkar', 'Evening Adhkar', 'After Prayer', 'Before Sleep', 'After Waking Up',
  'Before Eating', 'After Eating', 'Entering Home', 'Leaving Home', 'Travel',
  'Seeking Forgiveness', 'Distress & Anxiety', 'Quran Duas',
];

export const DUAS: Dua[] = [
  // Morning Adhkar
  {
    id: 'mor1', category: 'Morning Adhkar',
    title: 'Morning Remembrance',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ',
    transliteration: 'Asbahna wa asbahal mulku lillah walhamdu lillah, la ilaha illallah wahdahu la sharika lah',
    english: 'We have entered the morning and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. None has the right to be worshipped but Allah, alone, without partner.',
    urdu: 'ہم نے صبح کی اور ہماری اور تمام کائنات کی صبح اللہ کی ملکیت میں ہوئی، تمام تعریفیں اللہ کے لیے ہیں۔ اللہ کے سوا کوئی معبود نہیں، اکیلا ہے، اس کا کوئی شریک نہیں۔',
    reference: 'Abu Dawud 5076',
  },
  {
    id: 'mor2', category: 'Morning Adhkar',
    title: 'Ayatul Kursi',
    arabic: 'اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ',
    transliteration: 'Allahu la ilaha illa huwal hayyul qayyum, la ta\'khudhuhu sinatun wa la nawm',
    english: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep.',
    urdu: 'اللہ - اس کے سوا کوئی معبود نہیں، وہ ہمیشہ زندہ رہنے والا ہے، قائم رکھنے والا ہے۔ اسے نہ اونگھ آتی ہے نہ نیند۔',
    reference: 'Quran 2:255',
  },
  {
    id: 'mor3', category: 'Morning Adhkar',
    title: 'Morning Supplication',
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    transliteration: 'Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu wa ilaykan nushur',
    english: 'O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.',
    urdu: 'اے اللہ! تیری توفیق سے ہم نے صبح کی اور تیری توفیق سے شام کریں گے، تیری توفیق سے جیتے ہیں اور تیری توفیق سے مریں گے اور تیری طرف ہی لوٹنا ہے۔',
    reference: 'Abu Dawud 5068, Tirmidhi 3391',
  },
  // Evening Adhkar
  {
    id: 'eve1', category: 'Evening Adhkar',
    title: 'Evening Remembrance',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ',
    transliteration: 'Amsayna wa amsal mulku lillah walhamdu lillah, la ilaha illallah wahdahu la sharika lah',
    english: 'We have entered the evening and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. None has the right to be worshipped but Allah, alone, without partner.',
    urdu: 'ہم نے شام کی اور ہماری شام اللہ کی ملکیت میں ہوئی، تمام تعریفیں اللہ کے لیے ہیں۔ اللہ کے سوا کوئی معبود نہیں، اکیلا ہے۔',
    reference: 'Abu Dawud 5076',
  },
  {
    id: 'eve2', category: 'Evening Adhkar',
    title: 'Sayyidul Istighfar',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ',
    transliteration: 'Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana abduk, wa ana ala ahdika wa wadika mastata\'tu, audhu bika min sharri ma sanatu',
    english: 'O Allah, You are my Lord, none has the right to be worshipped except You, You created me and I am Your servant and I abide to Your covenant and promise as best I can, I take refuge with You from the evil of which I have committed.',
    urdu: 'اے اللہ! تو میرا رب ہے، تیرے سوا کوئی معبود نہیں۔ تو نے مجھے پیدا کیا اور میں تیرا بندہ ہوں۔',
    reference: 'Bukhari 6306',
  },
  // After Prayer
  {
    id: 'apr1', category: 'After Prayer',
    title: 'Tasbih After Prayer',
    arabic: 'سُبْحَانَ اللَّهِ (٣٣) الْحَمْدُ لِلَّهِ (٣٣) اللَّهُ أَكْبَرُ (٣٣)',
    transliteration: 'SubhanAllah (33) Alhamdulillah (33) Allahu Akbar (33)',
    english: 'Glory be to Allah (33 times), All praise is for Allah (33 times), Allah is the Greatest (33 times).',
    urdu: 'سبحان اللہ (٣٣ بار)، الحمد للہ (٣٣ بار)، اللہ اکبر (٣٣ بار)۔',
    reference: 'Muslim 597',
  },
  {
    id: 'apr2', category: 'After Prayer',
    title: 'After Tasbih',
    arabic: 'لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'La ilaha illallah wahdahu la sharika lah, lahul mulku wa lahul hamdu wa huwa ala kulli shayin qadir',
    english: 'None has the right to be worshipped except Allah, alone, without partner. His is the dominion and His is the praise, and He is over all things omnipotent.',
    urdu: 'اللہ کے سوا کوئی معبود نہیں، اکیلا ہے کوئی شریک نہیں، اسی کی سلطنت ہے اور اسی کی تعریف ہے اور وہ ہر چیز پر قادر ہے۔',
    reference: 'Muslim 597',
  },
  // Before Sleep
  {
    id: 'slp1', category: 'Before Sleep',
    title: 'Sleeping Dua',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya',
    english: 'In Your name O Allah, I die and I live.',
    urdu: 'اے اللہ! تیرے نام سے مرتا ہوں اور جیتا ہوں۔',
    reference: 'Bukhari 6312',
  },
  {
    id: 'slp2', category: 'Before Sleep',
    title: 'Surah Al-Ikhlas, Al-Falaq, An-Nas Before Sleep',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ... (٣ مرات)',
    transliteration: "Qul Huwallahu Ahad... (3 times) + Qul A'udhu Birabbil Falaq... + Qul A'udhu Birabbin Nas...",
    english: 'Recite Surah Al-Ikhlas, Al-Falaq and An-Nas three times each before sleeping.',
    urdu: 'سونے سے پہلے سورۃ الاخلاص، الفلق اور الناس تین تین بار پڑھیں۔',
    reference: 'Bukhari 5017',
  },
  // After Waking Up
  {
    id: 'wak1', category: 'After Waking Up',
    title: 'Waking Up Dua',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Alhamdu lillahilladhi ahyana bada ma amatana wa ilayhin nushur',
    english: 'All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.',
    urdu: 'تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں موت کے بعد زندہ کیا اور اسی کی طرف لوٹنا ہے۔',
    reference: 'Bukhari 6312',
  },
  // Before Eating
  {
    id: 'eat1', category: 'Before Eating',
    title: 'Bismillah Before Eating',
    arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
    transliteration: 'Bismillahi wa ala barakatillah',
    english: 'In the name of Allah and with the blessings of Allah.',
    urdu: 'اللہ کے نام سے اور اللہ کی برکت سے۔',
    reference: 'Abu Dawud 3767',
  },
  // After Eating
  {
    id: 'eat2', category: 'After Eating',
    title: 'Dua After Eating',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    transliteration: 'Alhamdu lillahilladhi atamana wa saqana wa jaalana muslimeen',
    english: 'All praise is for Allah who fed us and gave us drink and made us Muslims.',
    urdu: 'تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں کھلایا، پلایا اور مسلمان بنایا۔',
    reference: 'Abu Dawud 3850',
  },
  // Entering Home
  {
    id: 'hom1', category: 'Entering Home',
    title: 'Entering the Home',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلَجِ وَخَيْرَ الْمَخْرَجِ، بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا',
    transliteration: 'Allahumma inni asaluka khayral mawlaji wa khayral makhraji, bismillahi walajna wa bismillahi kharajna',
    english: 'O Allah, I ask You for the good of the entering and the good of the leaving, in the name of Allah we enter and in the name of Allah we leave.',
    urdu: 'اے اللہ! میں تجھ سے داخل ہونے اور نکلنے کی بھلائی مانگتا ہوں، اللہ کے نام سے داخل ہوئے اور اللہ کے نام سے نکلے۔',
    reference: 'Abu Dawud 5096',
  },
  // Leaving Home
  {
    id: 'hom2', category: 'Leaving Home',
    title: 'Leaving the Home',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، وَلاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ',
    transliteration: 'Bismillahi tawakkaltu alallah, wa la hawla wa la quwwata illa billah',
    english: 'In the name of Allah, I place my trust in Allah, and there is no might or power except with Allah.',
    urdu: 'اللہ کے نام سے، اللہ پر بھروسہ کیا، طاقت اور قوت صرف اللہ سے ہے۔',
    reference: 'Tirmidhi 3426',
  },
  // Travel
  {
    id: 'trv1', category: 'Travel',
    title: 'Dua for Travel',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration: 'Subhanalladhi sakhkhara lana hadha wa ma kunna lahu muqrinina wa inna ila rabbina lamunqalibun',
    english: 'Glory be to the One Who has subjected this to us, and we could not have done it ourselves. And verily, to our Lord we are returning.',
    urdu: 'پاک ہے وہ جس نے اسے ہمارے لیے مسخر کیا اور ہم اسے قابو نہیں کر سکتے تھے اور بے شک ہم اپنے رب کی طرف لوٹنے والے ہیں۔',
    reference: 'Muslim 1342',
  },
  // Seeking Forgiveness
  {
    id: 'forg1', category: 'Seeking Forgiveness',
    title: 'Istighfar',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullaha al-azeemal-ladhi la ilaha illa huwal hayyul qayyumu wa atubu ilayh',
    english: 'I seek forgiveness from Allah the Mighty, Whom there is none worthy of worship except Him, the Living, the Eternal, and I repent to Him.',
    urdu: 'میں اللہ عظیم سے مغفرت طلب کرتا ہوں جس کے سوا کوئی معبود نہیں، وہ ہمیشہ زندہ اور قائم رہنے والا ہے اور میں اس کی طرف توبہ کرتا ہوں۔',
    reference: 'Tirmidhi 3577',
  },
  // Distress & Anxiety
  {
    id: 'dis1', category: 'Distress & Anxiety',
    title: 'Dua for Anxiety',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحُزْنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ',
    transliteration: 'Allahumma inni audhu bika minal hammi wal huzni, wa audhu bika minal ajzi wal kasali',
    english: 'O Allah, I seek refuge in You from grief and sadness, from weakness and from laziness.',
    urdu: 'اے اللہ! میں تیری پناہ مانگتا ہوں غم اور اداسی سے، عاجزی اور سستی سے۔',
    reference: 'Bukhari 6369',
  },
  {
    id: 'dis2', category: 'Distress & Anxiety',
    title: 'Dua of Prophet Yunus',
    arabic: 'لاَ إِلَهَ إِلاَّ أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: 'La ilaha illa anta subhanaka inni kuntu minaz zalimeen',
    english: 'There is no deity worthy of worship except You; Glory be to You. Indeed, I have been of the wrongdoers.',
    urdu: 'تیرے سوا کوئی معبود نہیں، تو پاک ہے، بے شک میں ظالموں میں سے تھا۔',
    reference: 'Quran 21:87',
  },
  // Quran Duas
  {
    id: 'qur1', category: 'Quran Duas',
    title: 'Dua for Guidance',
    arabic: 'رَبَّنَا لاَ تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً',
    transliteration: "Rabbana la tuzigh qulubana bada idh hadaytana wa hab lana milladunka rahma",
    english: 'Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy.',
    urdu: 'اے ہمارے رب! ہدایت دینے کے بعد ہمارے دلوں کو کج نہ کر اور ہمیں اپنے پاس سے رحمت عطا فرما۔',
    reference: 'Quran 3:8',
  },
  {
    id: 'qur2', category: 'Quran Duas',
    title: 'Dua for Dunya and Akhira',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: 'Rabbana atina fid dunya hasanatan wa fil akhirati hasanatan wa qina adhaban nar',
    english: 'Our Lord, give us in this world good and in the Hereafter good and protect us from the punishment of the Fire.',
    urdu: 'اے ہمارے رب! ہمیں دنیا میں بھی بھلائی دے اور آخرت میں بھی بھلائی دے اور آگ کے عذاب سے بچا۔',
    reference: 'Quran 2:201',
  },
  {
    id: 'qur3', category: 'Quran Duas',
    title: 'Dua for Parents',
    arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbir hamhuma kama rabbayani saghira',
    english: 'My Lord, have mercy upon them as they brought me up when I was small.',
    urdu: 'اے میرے رب! ان پر رحم فرما جیسے انہوں نے مجھے بچپن میں پالا پوسا۔',
    reference: 'Quran 17:24',
  },
  {
    id: 'qur4', category: 'Quran Duas',
    title: 'Dua for Righteous Children',
    arabic: 'رَبِّ هَبْ لِي مِنَ الصَّالِحِينَ',
    transliteration: 'Rabbi hab li minas salihin',
    english: 'My Lord, grant me righteous offspring.',
    urdu: 'اے میرے رب! مجھے نیک اولاد عطا فرما۔',
    reference: 'Quran 37:100',
  },
];
