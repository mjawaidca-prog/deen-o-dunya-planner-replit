export interface Qari {
  id: string;
  name: string;
  arabicName: string;
  folder: string; // everyayah.com folder name
  style?: 'Murattal' | 'Mujawwad' | 'Muallim';
}

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
    folder: 'Maher_Al_Muaiqly_128kbps',
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
    folder: 'Menshawi_128kbps',
    style: 'Murattal',
  },
  {
    id: 'ghamdi',
    name: 'Saad Al-Ghamdi',
    arabicName: 'سعد الغامدي',
    folder: 'Saad_al-Ghamidi_128kbps',
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
    folder: 'AbdulSamad_128kbps_ketaballah.net',
    style: 'Murattal',
  },
  {
    id: 'shuraim',
    name: 'Saud Al-Shuraim',
    arabicName: 'سعود الشريم',
    folder: 'Saud_ash-Shuraim_128kbps',
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
    id: 'rifai',
    name: 'Hani Ar-Rifai',
    arabicName: 'هاني الرفاعي',
    folder: 'Hani_Ar-Rifai_192kbps',
    style: 'Murattal',
  },
  {
    id: 'matrood',
    name: 'Abdullah Al-Matrood',
    arabicName: 'عبدالله الماطرود',
    folder: 'Abdullah_Matrood_128kbps',
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
    id: 'baleela',
    name: 'Bandar Baleela',
    arabicName: 'بندر بليلة',
    folder: 'Bandar_Baleela_192kbps',
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
    id: 'qahtani',
    name: 'Khalid Al-Qahtani',
    arabicName: 'خالد القحطاني',
    folder: 'Khalid_Al-Qahtani_192kbps',
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
    id: 'kurdi',
    name: 'Raad Muhammad Al-Kurdi',
    arabicName: 'رعد محمد الكردي',
    folder: 'Raad_Mohammad_Al_Kurdi_128kbps',
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
    name: "Al-Husary (Mu'allim)",
    arabicName: 'محمود خليل الحصري (معلم)',
    folder: 'Husary_Muallim_128kbps',
    style: 'Muallim',
  },
];

export const DEFAULT_QARI = QARIS[0];

export function getAudioUrl(folder: string, surah: number, ayah: number): string {
  const s = surah.toString().padStart(3, '0');
  const a = ayah.toString().padStart(3, '0');
  return `https://everyayah.com/data/${folder}/${s}${a}.mp3`;
}
