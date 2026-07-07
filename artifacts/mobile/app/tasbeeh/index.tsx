import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';

const DHIKR_PRESETS = [
  { label: 'Subhanallah', arabic: 'سُبْحَانَ اللَّهِ', target: 33 },
  { label: 'Alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', target: 33 },
  { label: 'Allahu Akbar', arabic: 'اللَّهُ أَكْبَرُ', target: 34 },
  { label: 'La Ilaha Illallah', arabic: 'لَا إِلَهَ إِلَّا اللَّهُ', target: 100 },
  { label: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ', target: 100 },
  { label: 'Bismillah', arabic: 'بِسْمِ اللَّهِ', target: 0 },
];

export default function TasbeehScreen() {
  const colors = useColors();
  const { t } = useLanguage();
  const [count, setCount] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [sessions, setSessions] = useState(0);

  const preset = DHIKR_PRESETS[selectedIdx];
  const progress = preset.target > 0 ? Math.min(count / preset.target, 1) : 0;

  const handleCount = async () => {
    const newCount = count + 1;
    setCount(newCount);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (preset.target > 0 && newCount >= preset.target) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSessions(s => s + 1);
      setCount(0);
    }
  };

  const handleReset = () => {
    setCount(0);
    setSessions(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    setCount(0);
    setSessions(0);
    Haptics.selectionAsync();
  };

  const circumference = 2 * Math.PI * 110;
  const strokeDash = circumference * (1 - progress);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Dhikr Presets */}
      <View style={styles.presetsRow}>
        {DHIKR_PRESETS.map((p, i) => (
          <TouchableOpacity
            key={p.label}
            style={[styles.presetBtn, { backgroundColor: i === selectedIdx ? colors.primary : colors.card }]}
            onPress={() => handleSelect(i)}
          >
            <Text style={[styles.presetText, { color: i === selectedIdx ? '#fff' : colors.mutedForeground }]} numberOfLines={1}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dhikr info */}
      <View style={styles.dhikrInfo}>
        <Text style={[styles.arabicDhikr, { color: colors.foreground }]}>{preset.arabic}</Text>
        {preset.target > 0 && (
          <Text style={[styles.targetText, { color: colors.mutedForeground }]}>Target: {preset.target} · Sessions: {sessions}</Text>
        )}
      </View>

      {/* Counter Circle */}
      <TouchableOpacity style={styles.circleContainer} onPress={handleCount} activeOpacity={0.9}>
        <View style={[styles.outerCircle, { borderColor: colors.border }]}>
          {preset.target > 0 && (
            <View style={[styles.progressRing, { borderColor: colors.primary, borderWidth: 4 }]}>
            </View>
          )}
          <View style={[styles.innerCircle, { backgroundColor: colors.card }]}>
            <Text style={[styles.countNum, { color: colors.foreground }]}>{count}</Text>
            <Text style={[styles.tapHint, { color: colors.mutedForeground }]}>Tap to count</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Progress bar */}
      {preset.target > 0 && (
        <View style={[styles.progressBar, { backgroundColor: colors.surfaceAlt }]}>
          <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${progress * 100}%` }]} />
        </View>
      )}

      {/* Reset */}
      <TouchableOpacity style={[styles.resetBtn, { backgroundColor: colors.card }]} onPress={handleReset}>
        <Text style={[styles.resetText, { color: colors.foreground }]}>Reset</Text>
      </TouchableOpacity>

      {/* Session total */}
      {sessions > 0 && (
        <Text style={[styles.sessionText, { color: colors.gold }]}>
          🎯 {sessions} complete round{sessions > 1 ? 's' : ''} · {sessions * preset.target + count} total
        </Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 8 },
  presetsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, paddingHorizontal: 16, marginBottom: 16 },
  presetBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  presetText: { fontSize: 12, fontWeight: '500' },
  dhikrInfo: { alignItems: 'center', marginBottom: 24 },
  arabicDhikr: { fontSize: 24, fontWeight: '600', textAlign: 'center' },
  targetText: { fontSize: 13, marginTop: 6 },
  circleContainer: { marginBottom: 24 },
  outerCircle: {
    width: 240, height: 240, borderRadius: 120, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  progressRing: {
    position: 'absolute', width: 240, height: 240, borderRadius: 120,
  },
  innerCircle: {
    width: 200, height: 200, borderRadius: 100, alignItems: 'center', justifyContent: 'center',
  },
  countNum: { fontSize: 64, fontWeight: '700', lineHeight: 72 },
  tapHint: { fontSize: 13 },
  progressBar: { width: '80%', height: 6, borderRadius: 3, marginBottom: 24, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3 },
  resetBtn: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 24 },
  resetText: { fontSize: 15, fontWeight: '600' },
  sessionText: { fontSize: 14, marginTop: 16, fontWeight: '500' },
});
