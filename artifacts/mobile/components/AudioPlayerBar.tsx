import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useAudio } from '@/context/AudioContext';
import { SURAHS } from '@/constants/quranData';

export default function AudioPlayerBar() {
  const colors = useColors();
  const { isPlaying, currentSurah, currentAyah, currentQari, pause, resume, stop, playNext, playPrev, isLoading } = useAudio();

  if (!isPlaying && !isLoading) return null;

  const surah = SURAHS[currentSurah - 1];

  return (
    <View style={[styles.bar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      <View style={styles.info}>
        <Text style={[styles.surahName, { color: colors.foreground }]} numberOfLines={1}>
          {surah?.nameEnglish ?? 'Quran'}
        </Text>
        <Text style={[styles.ayah, { color: colors.mutedForeground }]}>
          Ayah {currentAyah} • {currentQari.name}
        </Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={playPrev} style={styles.btn}>
          <Feather name="skip-back" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={isPlaying ? pause : resume}
          style={[styles.playBtn, { backgroundColor: colors.primary }]}
        >
          <Feather name={isLoading ? 'loader' : isPlaying ? 'pause' : 'play'} size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={playNext} style={styles.btn}>
          <Feather name="skip-forward" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <TouchableOpacity onPress={stop} style={styles.btn}>
          <Feather name="x" size={20} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    borderTopWidth: 1,
  },
  info: { flex: 1 },
  surahName: { fontSize: 14, fontWeight: '600' as const },
  ayah: { fontSize: 12, marginTop: 2 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btn: { padding: 4 },
  playBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
