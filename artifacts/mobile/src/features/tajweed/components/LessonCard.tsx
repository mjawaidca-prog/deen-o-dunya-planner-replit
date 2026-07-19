import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { QaidaLesson } from '../types/tajweed.types';
import { useLanguage } from '@/context/LanguageContext';
import { useColors } from '@/hooks/useColors';

interface LessonCardProps {
  lesson: QaidaLesson;
  onPress: (lessonId: number) => void;
}

const LessonCard = memo(({ lesson, onPress }: LessonCardProps) => {
  const { language } = useLanguage();
  const colors = useColors();
  const isUrdu = language === 'ur';
  const isRTL = language === 'ur' || language === 'ar';

  const handlePress = useCallback(() => onPress(lesson.id), [onPress, lesson.id]);

  const title = isUrdu ? lesson.titleUr : lesson.titleEn;
  const subtitle = isUrdu ? lesson.subtitleUr : lesson.subtitleEn;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={handlePress}
      activeOpacity={0.75}
      accessibilityLabel={`Lesson ${lesson.id}: ${lesson.titleEn}`}
      accessibilityRole="button"
    >
      {/* Number badge */}
      <View style={[styles.badge, { backgroundColor: colors.primary }]}>
        <Text style={styles.badgeText}>{lesson.id}</Text>
      </View>

      {/* Content */}
      <View style={[styles.content, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
        <Text
          style={[styles.title, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' },
            isUrdu && styles.urduText]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text
          style={[styles.subtitle, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' },
            isUrdu && styles.urduText]}
          numberOfLines={1}
        >
          {subtitle}
        </Text>
        <View style={[styles.meta, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.metaText, { color: colors.gold }]}>
            {lesson.items.length} {isUrdu ? 'حروف' : 'items'}
          </Text>
          <View style={[styles.dot, { backgroundColor: colors.border }]} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            {lesson.gridColumns} {isUrdu ? 'کالم' : 'col grid'}
          </Text>
        </View>
      </View>

      {/* Arrow */}
      <Feather
        name={isRTL ? 'chevron-left' : 'chevron-right'}
        size={18}
        color={colors.mutedForeground}
        style={styles.arrow}
      />
    </TouchableOpacity>
  );
});

LessonCard.displayName = 'LessonCard';
export default LessonCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  content: { flex: 1, gap: 3 },
  title: { fontSize: 15, fontWeight: '700' },
  subtitle: { fontSize: 13 },
  urduText: { writingDirection: 'rtl' },
  meta: { alignItems: 'center', gap: 6, marginTop: 2 },
  metaText: { fontSize: 11, fontWeight: '500' },
  dot: { width: 4, height: 4, borderRadius: 2 },
  arrow: { flexShrink: 0 },
});
