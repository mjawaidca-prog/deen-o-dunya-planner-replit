export interface Qari {
  id: string;
  name: string;
  arabicName: string;
  folder: string; // everyayah.com folder name
  cdnId: string; // islamic.network CDN id
}

export const QARIS: Qari[] = [
  {
    id: 'alafasy',
    name: 'Mishary Rashid Alafasy',
    arabicName: 'مشاري راشد العفاسي',
    folder: 'Alafasy_128kbps',
    cdnId: 'ar.alafasy',
  },
  {
    id: 'sudais',
    name: 'Abdul Rahman Al-Sudais',
    arabicName: 'عبد الرحمن السديس',
    folder: 'Abdurrahmaan_As-Sudais_192kbps',
    cdnId: 'ar.abdurrahmaansudais',
  },
  {
    id: 'muaiqly',
    name: 'Maher Al-Muaiqly',
    arabicName: 'ماهر المعيقلي',
    folder: 'Maher_Al_Muaiqly_128kbps',
    cdnId: 'ar.mahermuaiqly',
  },
  {
    id: 'husary',
    name: 'Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري',
    folder: 'Husary_128kbps',
    cdnId: 'ar.husary',
  },
  {
    id: 'minshawi',
    name: 'Muhammad Siddiq Al-Minshawi',
    arabicName: 'محمد صديق المنشاوي',
    folder: 'Menshawi_128kbps',
    cdnId: 'ar.minshawi',
  },
  {
    id: 'ghamdi',
    name: 'Saad Al-Ghamdi',
    arabicName: 'سعد الغامدي',
    folder: 'Saad_al-Ghamidi_128kbps',
    cdnId: 'ar.saadalghamdi',
  },
  {
    id: 'abdulbasit',
    name: 'Abdul Basit (Mujawwad)',
    arabicName: 'عبد الباسط عبد الصمد',
    folder: 'Abdul_Basit_Mujawwad_128kbps',
    cdnId: 'ar.abdulsamad',
  },
  {
    id: 'shuraim',
    name: 'Saud Al-Shuraim',
    arabicName: 'سعود الشريم',
    folder: 'Saud_ash-Shuraim_128kbps',
    cdnId: 'ar.shuraim',
  },
];

export const DEFAULT_QARI = QARIS[0];

export function getAudioUrl(folder: string, surah: number, ayah: number): string {
  const s = surah.toString().padStart(3, '0');
  const a = ayah.toString().padStart(3, '0');
  return `https://everyayah.com/data/${folder}/${s}${a}.mp3`;
}
