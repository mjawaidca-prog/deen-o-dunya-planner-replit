import { TajweedRule } from '../types/tajweed.types';

export const TAJWEED_COLORS: Record<TajweedRule, string> = {
  [TajweedRule.NONE]:     '#2C3E50',
  [TajweedRule.IKHFA]:    '#27AE60',
  [TajweedRule.QALQALAH]: '#3498DB',
  [TajweedRule.MADD]:     '#E74C3C',
  [TajweedRule.GUNNAH]:   '#E67E22',
  [TajweedRule.IDGHAAM]:  '#9B59B6',
  [TajweedRule.IZHAAR]:   '#F1C40F',
};

export const TAJWEED_LABELS: Record<TajweedRule, { en: string; ur: string }> = {
  [TajweedRule.NONE]:     { en: 'Normal',   ur: 'عام' },
  [TajweedRule.IKHFA]:    { en: 'Ikhfa',    ur: 'اخفاء' },
  [TajweedRule.QALQALAH]: { en: 'Qalqalah', ur: 'قلقلہ' },
  [TajweedRule.MADD]:     { en: 'Madd',     ur: 'مد' },
  [TajweedRule.GUNNAH]:   { en: 'Gunnah',   ur: 'غنہ' },
  [TajweedRule.IDGHAAM]:  { en: 'Idghaam',  ur: 'ادغام' },
  [TajweedRule.IZHAAR]:   { en: 'Izhaar',   ur: 'اظہار' },
};
