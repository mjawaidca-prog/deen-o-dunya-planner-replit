import React, { useCallback, useMemo, useState } from 'react';
import {
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
import QaidaGrid from '../components/QaidaGrid';
import AudioPlayer from '../components/AudioPlayer';
import TajweedBadge from '../components/TajweedBadge';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { qaidaLessons } from '../data/qaidaData';
import { QaidaItem, QaidaLesson } from '../types/tajweed.types';

interface LessonDetailScreenProps {
  lessonId: number;
  onBack: () => void;
}

const LessonDetailScreen = ({ lessonId, onBack }: LessonDetailScreenProps) => {
  const colors = useColors();
  const { language } = useLanguage();
  const isRTL = language === 'ur' || language === 'ar';
  const isUrdu = language === 'ur';
  const audio = useAudioPlayer();

  const [selectedItem, setSelectedItem] = useState<QaidaItem | null>(null);

  const lesson: QaidaLesson | undefined = useMemo(
    () => qaidaLessons.find(l => l.id === lessonId),
    [lessonId],
  );

  const handleItemPress = useCallback(
    (item: QaidaItem) => {
      setSelectedItem(item);
      audio.playAudio(item.id, item.text);
    },
    [audio],
  );

  const handleStop = useCallback(() => {
    audio.stopAudio();
    setSelectedItem(null);
  }, [audio]);

  // Invalid lesson
  if (!lesson) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={styles.errorWrap}>
          <Text style={[styles.errorText, { color: colors.destructive }]}>
            Lesson not found.
          </Text>
          <TouchableOpacity onPress={onBack} style={[styles.backBtn, { backgroundColor: colors.surfaceAlt }]}>
            <Feather name="arrow-left" size={18} color={colors.foreground} />
            <Text style={{ color: colors.foreground, marginLeft: 6 }}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const title    = isUrdu ? lesson.titleUr : lesson.titleEn;
  const subtitle = isUrdu ? lesson.subtitleUr : lesson.subtitleEn;
  const playingId  = audio.isPlaying || audio.isLoading ? audio.currentItemId : null;
  const loadingId  = audio.isLoading ? audio.currentItemId : null;

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { borderBottomColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' },
        ]}
      >
        <TouchableOpacity
          onPress={onBack}
          style={[styles.backBtnSmall, { backgroundColor: colors.surfaceAlt }]}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name={isRTL ? 'arrow-right' : 'arrow-left'} size={18} color={colors.foreground} />
        </TouchableOpacity>

        <View style={[styles.headerText, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <Text
            style={[
              styles.title,
              { color: colors.foreground },
              isUrdu && styles.urduText,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: colors.mutedForeground },
              isUrdu && styles.urduSmall,
            ]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        </View>

        {/* Grid info badge */}
        <View style={[styles.gridBadge, { backgroundColor: colors.gold + '22', borderColor: colors.gold + '44' }]}>
          <Feather name="grid" size={12} color={colors.gold} />
          <Text style={[styles.gridText, { color: colors.gold }]}>{lesson.gridColumns}</Text>
        </View>
      </View>

      {/* Tajweed badge for selected item */}
      {selectedItem && (
        <View style={[styles.badgeRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TajweedBadge rule={selectedItem.tajweedRule} />
        </View>
      )}

      {/* Grid */}
      <View style={{ flex: 1 }}>
        <QaidaGrid
          lesson={lesson}
          onItemPress={handleItemPress}
          playingItemId={playingId}
          loadingItemId={loadingId}
        />
      </View>

      {/* Audio bar */}
      <AudioPlayer
        currentItem={audio.currentItemId ? selectedItem : null}
        isPlaying={audio.isPlaying}
        isLoading={audio.isLoading}
        error={audio.error}
        onStop={handleStop}
      />
    </SafeAreaView>
  );
};

export default LessonDetailScreen;

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtnSmall: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerText: { flex: 1, gap: 2 },
  title: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Inter_700Bold',
  },
  urduText: {
    fontFamily: 'NotoNastaliqUrdu_400Regular',
    fontSize: 16,
    lineHeight: 32,
    writingDirection: 'rtl',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Inter_400Regular',
  },
  urduSmall: {
    fontFamily: 'NotoNastaliqUrdu_400Regular',
    fontSize: 12,
    lineHeight: 24,
    writingDirection: 'rtl',
  },
  gridBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    flexShrink: 0,
  },
  gridText: { fontSize: 12, fontWeight: '700' },
  badgeRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    alignItems: 'center',
  },
  errorWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  errorText: { fontSize: 16, fontWeight: '600' },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
});
