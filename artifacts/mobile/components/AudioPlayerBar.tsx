import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSegments } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useAudio } from '@/context/AudioContext';
import { SURAHS } from '@/constants/quranData';

export default function AudioPlayerBar() {
  const colors   = useColors();
  const insets   = useSafeAreaInsets();
  const segments = useSegments();
  const {
    isPlaying, isLoading, currentSurah, currentAyah, currentQari,
    position, duration, pause, resume, stop, playNext, playPrev,
  } = useAudio();

  if (!isPlaying && !isLoading) return null;

  const surah = SURAHS[currentSurah - 1];

  // useSegments returns raw route segments INCLUDING group names like '(tabs)'.
  // e.g. tab screen   → ['(tabs)', 'quran']
  //      stack screen → ['quran', '[surah]']
  const isInTabs   = segments[0] === '(tabs)';
  const bottomBase = isInTabs ? 83 : 0;
  const bottomPos  = bottomBase + insets.bottom;

  // Progress 0–1
  const progress = duration > 0 ? position / duration : 0;

  return (
    <View style={[styles.bar, {
      backgroundColor: colors.card,
      borderColor: colors.border,
      bottom: bottomPos,
      shadowColor: '#000',
    }]}>
      {/* Progress strip */}
      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
        <View style={[styles.progressFill, {
          backgroundColor: colors.primary,
          width: `${Math.round(progress * 100)}%`,
        }]} />
      </View>

      {/* Player body */}
      <View style={styles.body}>
        {/* Info */}
        <View style={styles.info}>
          <View style={[styles.ayahBadge, { backgroundColor: colors.primary + '22' }]}>
            <Text style={[styles.ayahBadgeText, { color: colors.primary }]}>
              {currentAyah}
            </Text>
          </View>
          <View style={styles.infoText}>
            <Text style={[styles.surahName, { color: colors.foreground }]} numberOfLines={1}>
              {surah?.nameEnglish ?? 'Quran'}
              <Text style={[styles.surahArabic, { color: colors.gold }]}>
                {'  '}{surah?.name}
              </Text>
            </Text>
            <Text style={[styles.qariName, { color: colors.mutedForeground }]} numberOfLines={1}>
              {currentQari.name}
            </Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={playPrev} style={styles.controlBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="skip-back" size={19} color={colors.foreground} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={isPlaying ? pause : resume}
            style={[styles.playBtn, { backgroundColor: colors.primary }]}
          >
            <Feather
              name={isLoading ? 'loader' : isPlaying ? 'pause' : 'play'}
              size={18}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={playNext} style={styles.controlBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="skip-forward" size={19} color={colors.foreground} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={stop}
            style={[styles.controlBtn, styles.stopBtn, { backgroundColor: colors.surfaceAlt }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0, right: 0,
    marginHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 10,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  progressTrack: {
    height: 3,
    width: '100%',
  },
  progressFill: {
    height: 3,
    minWidth: 3,
    borderRadius: 2,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },
  ayahBadge: {
    width: 32, height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  ayahBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  infoText: { flex: 1, minWidth: 0 },
  surahName: { fontSize: 13, fontWeight: '600' },
  surahArabic: { fontSize: 13, fontWeight: '500' },
  qariName: { fontSize: 11, marginTop: 1 },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  controlBtn: {
    width: 32, height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopBtn: {
    width: 28, height: 28,
    borderRadius: 14,
  },
});
