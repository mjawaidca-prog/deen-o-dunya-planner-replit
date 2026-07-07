export interface Qari {
  id: string;
  name: string;
  arabicName: string;
  folder: string; // verified everyayah.com folder — all tested 200 OK
  style?: 'Murattal' | 'Mujawwad' | 'Muallim';
}

// All folders verified live against everyayah.com/data/{folder}/001001.mp3
export const QARIS: Qari[] = [
  {
    id: 'alafasy',
    name: 'Mishary Rashid Alafasy',
    arabicName: 'مشاري راشد العفاسي',
    folder: 'Alafasy_128kbps',
    style: 'Murattal',
  },
  {
    id: 'sudais',
    name: 'Abdul Rahman Al-Sudais',
    arabicName: 'عبد الرحمن السديس',
    folder: 'Abdurrahmaan_As-Sudais_192kbps',
    style: 'Murattal',
  },
  {
    id: 'muaiqly',
    name: 'Maher Al-Muaiqly',
    arabicName: 'ماهر المعيقلي',
    folder: 'MaherAlMuaiqly128kbps',   // verified 200
    style: 'Murattal',
  },
  {
    id: 'husary',
    name: 'Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري',
    folder: 'Husary_128kbps',
    style: 'Murattal',
  },
  {
    id: 'minshawi',
    name: 'Muhammad Siddiq Al-Minshawi',
    arabicName: 'محمد صديق المنشاوي',
    folder: 'Menshawi_32kbps',          // verified 200 (128 was 404)
    style: 'Murattal',
  },
  {
    id: 'abdulbasit_mujawwad',
    name: 'Abdul Basit (Mujawwad)',
    arabicName: 'عبد الباسط عبد الصمد',
    folder: 'Abdul_Basit_Mujawwad_128kbps',
    style: 'Mujawwad',
  },
  {
    id: 'abdulbasit_murattal',
    name: 'Abdul Basit (Murattal)',
    arabicName: 'عبد الباسط عبد الصمد',
    folder: 'Abdul_Basit_Murattal_64kbps', // verified 200 (old folder was 404)
    style: 'Murattal',
  },
  {
    id: 'dosari',
    name: 'Yasser Al-Dosari',
    arabicName: 'ياسر الدوسري',
    folder: 'Yasser_Ad-Dussary_128kbps',
    style: 'Murattal',
  },
  {
    id: 'basfar',
    name: 'Abdullah Basfar',
    arabicName: 'عبدالله بصفر',
    folder: 'Abdullah_Basfar_192kbps',
    style: 'Murattal',
  },
  {
    id: 'ajmy',
    name: 'Ahmed Al-Ajamy',
    arabicName: 'أحمد بن علي العجمي',
    folder: 'Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net',
    style: 'Murattal',
  },
  {
    id: 'hudhaify',
    name: 'Ali Al-Hudhaifi',
    arabicName: 'علي بن عبدالرحمن الحذيفي',
    folder: 'Hudhaify_128kbps',
    style: 'Murattal',
  },
  {
    id: 'shaatree',
    name: 'Abu Bakr Al-Shatri',
    arabicName: 'أبو بكر الشاطري',
    folder: 'Abu_Bakr_Ash-Shaatree_128kbps',
    style: 'Murattal',
  },
  {
    id: 'qatami',
    name: 'Nasser Al-Qatami',
    arabicName: 'ناصر القطامي',
    folder: 'Nasser_Alqatami_128kbps',
    style: 'Murattal',
  },
  {
    id: 'ayyoub',
    name: 'Muhammad Ayyoub',
    arabicName: 'محمد أيوب',
    folder: 'Muhammad_Ayyoub_128kbps',
    style: 'Murattal',
  },
  {
    id: 'qasim',
    name: 'Muhsin Al-Qasim',
    arabicName: 'محسن القاسم',
    folder: 'Muhsin_Al_Qasim_192kbps',
    style: 'Murattal',
  },
  {
    id: 'fares',
    name: 'Fares Abbad',
    arabicName: 'فارس عباد',
    folder: 'Fares_Abbad_64kbps',
    style: 'Murattal',
  },
  {
    id: 'muallim',
    name: "Al-Husary (Mu'allim / Teaching)",
    arabicName: 'محمود خليل الحصري (معلم)',
    folder: 'Husary_Muallim_128kbps',
    style: 'Muallim',
  },
  {
    id: 'budair',
    name: 'Salah Al-Budair',
    arabicName: 'صلاح البدير',
    folder: 'Salah_Al_Budair_128kbps',  // verified 200
    style: 'Murattal',
  },
  {
    id: 'qahtani',
    name: 'Khalid Al-Qahtani',
    arabicName: 'خالد القحطاني',
    folder: 'Khaalid_Abdullaah_al-Qahtaanee_192kbps', // verified 200
    style: 'Murattal',
  },
  {
    id: 'akhdar',
    name: 'Ibrahim Al-Akhdar',
    arabicName: 'إبراهيم الأخضر',
    folder: 'Ibrahim_Akhdar_32kbps',    // verified 200
    style: 'Murattal',
  },
  {
    id: 'sahl',
    name: 'Sahl Yassin',
    arabicName: 'سهل ياسين',
    folder: 'Sahl_Yassin_128kbps',      // verified 200
    style: 'Murattal',
  },
  {
    id: 'ghamdi',
    name: 'Saad Al-Ghamdi',
    arabicName: 'سعد الغامدي',
    folder: 'Ghamadi_40kbps',           // verified 200 (128kbps was 404)
    style: 'Murattal',
  },
];

export const DEFAULT_QARI = QARIS[0]; // Mishary Alafasy

export function getAudioUrl(folder: string, surah: number, ayah: number): string {
  const s = surah.toString().padStart(3, '0');
  const a = ayah.toString().padStart(3, '0');
  return `https://everyayah.com/data/${folder}/${s}${a}.mp3`;
}
