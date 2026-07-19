import React, { useCallback } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import LessonCard from '../components/LessonCard';
import { QaidaLesson } from '../types/tajweed.types';
import { qaidaLessons } from '../data/qaidaData';

interface TajweedHomeScreenProps {
  onBack: () => void;
  onSelectLesson: (lessonId: number) => void;
}

const TajweedHomeScreen = ({ onBack, onSelectLesson }: TajweedHomeScreenProps) => {
  const colors = useColors();
  const { language } = useLanguage();
  const isRTL = language === 'ur' || language === 'ar';
  const isUrdu = language === 'ur';

  const title      = isUrdu ? 'تجوید سیکھیں'   : language === 'ar' ? 'تعلم التجويد' : 'Learn Tajweed';
  const subtitle   = isUrdu ? 'نورانی قاعدہ — ۱۷ اسباق' : '17 Noorani Qaida lessons';

  const handleSelect = useCallback(
    (lessonId: number) => onSelectLesson(lessonId),
    [onSelectLesson],
  );

  const renderItem = useCallback(
    ({ item }: { item: QaidaLesson }) => (
      <LessonCard lesson={item} onPress={handleSelect} />
    ),
    [handleSelect],
  );

  const keyExtractor = useCallback(
    (item: QaidaLesson) => String(item.id),
    [],
  );

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity
          onPress={onBack}
          style={[styles.backBtn, { backgroundColor: colors.surfaceAlt }]}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name={isRTL ? 'arrow-right' : 'arrow-left'} size={18} color={colors.foreground} />
        </TouchableOpacity>

        <View style={[styles.headerText, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <Text style={[styles.title, { color: colors.foreground }, isUrdu && styles.urduTitle]}>
            {title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }, isUrdu && styles.urduSubtitle]}>
            {subtitle}
          </Text>
        </View>

        {/* Quran icon accent */}
        <View style={[styles.iconWrap, { backgroundColor: colors.primary + '18' }]}>
          <Text style={styles.icon}>📖</Text>
        </View>
      </View>

      <FlatList
        data={qaidaLessons}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={<View style={{ height: 48 }} />}
      />
    </SafeAreaView>
  );
};

export default TajweedHomeScreen;

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerText: { flex: 1, gap: 2 },
  title: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Inter_700Bold',
  },
  urduTitle: {
    fontFamily: 'NotoNastaliqUrdu_400Regular',
    fontSize: 20,
    lineHeight: 38,
    writingDirection: 'rtl',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Inter_400Regular',
  },
  urduSubtitle: {
    fontFamily: 'NotoNastaliqUrdu_400Regular',
    fontSize: 13,
    lineHeight: 26,
    writingDirection: 'rtl',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: { fontSize: 20 },
  list: { paddingHorizontal: 16, paddingTop: 14 },
});
