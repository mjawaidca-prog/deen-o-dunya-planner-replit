import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { useAudio } from '@/context/AudioContext';
import { SURAHS } from '@/constants/quranData';
import { QARIS } from '@/constants/qaris';

interface Ayah {
  numberInSurah: number;
  text: string;
  translation?: string;
}

export default function QuranSurahScreen() {
  const { surah: surahParam } = useLocalSearchParams<{ surah: string }>();
  const surahNum = parseInt(surahParam || '1', 10);
  const surahInfo = SURAHS.find(s => s.id === surahNum);
  const colors = useColors();
  const { t, language } = useLanguage();
  const { play, stop, isPlaying, currentSurah, currentAyah, currentQari, setQari, qaris } = useAudio();
  const navigation = useNavigation();

  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQariPicker, setShowQariPicker] = useState(false);

  useEffect(() => {
    if (surahInfo) {
      navigation.setOptions({ title: `${surahNum}. ${surahInfo.nameEnglish}` });
    }
  }, [surahInfo, navigation, surahNum]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/editions/ar.uthmani,en.sahih`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        if (data.code !== 200) throw new Error('API error');
        const arAyahs: { numberInSurah: number; text: string }[] = data.data[0].ayahs;
        const enAyahs: { numberInSurah: number; text: string }[] = data.data[1].ayahs;
        const merged = arAyahs.map((a, i) => ({ numberInSurah: a.numberInSurah, text: a.text, translation: enAyahs[i]?.text }));
        setAyahs(merged);
      })
      .catch(e => { if (!cancelled) setError('Failed to load surah. Check your internet connection.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [surahNum]);

  const isSurahPlaying = isPlaying && currentSurah === surahNum;

  const handlePlayAll = () => {
    if (isSurahPlaying) { stop(); }
    else { play(surahNum, 1, ayahs.length); }
  };

  const renderAyah = useCallback(({ item }: { item: Ayah }) => {
    const isActive = isSurahPlaying && currentAyah === item.numberInSurah;
    return (
      <View style={[styles.ayahCard, { backgroundColor: isActive ? colors.primary + '22' : colors.card, borderColor: isActive ? colors.primary : 'transparent', borderWidth: 1 }]}>
        <View style={styles.ayahHeader}>
          <View style={[styles.ayahNum, { backgroundColor: colors.primary }]}>
            <Text style={styles.ayahNumText}>{item.numberInSurah}</Text>
          </View>
          <TouchableOpacity
            onPress={() => isSurahPlaying && currentAyah === item.numberInSurah ? stop() : play(surahNum, item.numberInSurah, ayahs.length)}
            style={[styles.ayahPlayBtn, { backgroundColor: colors.surfaceAlt }]}
          >
            <Feather name={isSurahPlaying && currentAyah === item.numberInSurah ? 'pause' : 'play'} size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.arabicText, { color: colors.foreground }]}>{item.text}</Text>
        {item.translation && (
          <Text style={[styles.translationText, { color: colors.mutedForeground }]}>{item.translation}</Text>
        )}
      </View>
    );
  }, [isSurahPlaying, currentAyah, colors, surahNum, ayahs.length, stop, play]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>{t('loading')}</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <Feather name="wifi-off" size={48} color={colors.mutedForeground} />
        <Text style={[styles.errorText, { color: colors.foreground }]}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Surah Header */}
      <View style={[styles.surahHeader, { backgroundColor: colors.card }]}>
        <View style={styles.surahInfo}>
          <Text style={[styles.surahArabic, { color: colors.gold }]}>{surahInfo?.name}</Text>
          <Text style={[styles.surahMeta, { color: colors.mutedForeground }]}>
            {surahInfo?.revelationType} · {ayahs.length} verses
          </Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.qariBtn, { backgroundColor: colors.surfaceAlt }]}
            onPress={() => setShowQariPicker(v => !v)}
          >
            <Feather name="mic" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.playAllBtn, { backgroundColor: isSurahPlaying ? colors.destructive : colors.primary }]}
            onPress={handlePlayAll}
          >
            <Feather name={isSurahPlaying ? 'square' : 'play'} size={16} color="#fff" />
            <Text style={styles.playAllText}>{isSurahPlaying ? 'Stop' : 'Play All'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Qari picker */}
      {showQariPicker && (
        <View style={[styles.qariPicker, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {QARIS.map(q => (
            <TouchableOpacity
              key={q.id}
              style={[styles.qariItem, currentQari.id === q.id && { backgroundColor: colors.primary + '22' }]}
              onPress={() => { setQari(q); setShowQariPicker(false); }}
            >
              <Text style={[styles.qariName, { color: currentQari.id === q.id ? colors.primary : colors.foreground }]}>{q.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FlatList
        data={ayahs}
        keyExtractor={a => String(a.numberInSurah)}
        renderItem={renderAyah}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={[styles.basmalah, { backgroundColor: colors.card }]}>
            <Text style={[styles.basmalahText, { color: colors.gold }]}>
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </Text>
          </View>
        }
        ListFooterComponent={() => <View style={{ height: 120 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 15, marginTop: 8 },
  errorText: { fontSize: 15, textAlign: 'center', marginTop: 12, paddingHorizontal: 32 },
  surahHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  surahInfo: { flex: 1 },
  surahArabic: { fontSize: 20, fontWeight: '700' },
  surahMeta: { fontSize: 12, marginTop: 2 },
  controls: { flexDirection: 'row', gap: 8 },
  qariBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  playAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18 },
  playAllText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  qariPicker: { borderBottomWidth: 1, maxHeight: 200 },
  qariItem: { paddingHorizontal: 20, paddingVertical: 12 },
  qariName: { fontSize: 14 },
  list: { paddingHorizontal: 16, paddingTop: 8 },
  basmalah: { padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  basmalahText: { fontSize: 18, textAlign: 'center', lineHeight: 30 },
  ayahCard: { borderRadius: 14, padding: 16, marginBottom: 10 },
  ayahHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  ayahNum: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  ayahNumText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  ayahPlayBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  arabicText: { fontSize: 20, textAlign: 'right', lineHeight: 36, marginBottom: 10 },
  translationText: { fontSize: 14, lineHeight: 22 },
});
