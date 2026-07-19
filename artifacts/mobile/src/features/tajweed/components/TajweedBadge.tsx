import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TajweedRule } from '../types/tajweed.types';
import { TAJWEED_COLORS, TAJWEED_LABELS } from '../constants/tajweedColors';
import { useLanguage } from '@/context/LanguageContext';

interface TajweedBadgeProps {
  rule: TajweedRule;
}

const TajweedBadge = memo(({ rule }: TajweedBadgeProps) => {
  const { language } = useLanguage();
  if (rule === TajweedRule.NONE) return null;

  const color = TAJWEED_COLORS[rule];
  const label = TAJWEED_LABELS[rule];
  const text = language === 'ur' ? label.ur : label.en;

  return (
    <View style={[styles.badge, { borderColor: color, backgroundColor: color + '18' }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{text}</Text>
    </View>
  );
});

TajweedBadge.displayName = 'TajweedBadge';
export default TajweedBadge;

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 5,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
});
