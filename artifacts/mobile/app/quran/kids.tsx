/**
 * Kids Quran Mode
 * Simple, large-text Quran screen for children (ages 4–10) and
 * elderly users who want maximum simplicity.
 *
 * - Short, universally-taught surahs only
 * - Daily duas (9 key ones from Hisnul Muslim)
 * - Big fonts, gentle design, NO ads
 * - 5-prayer + Quran + Dua simple star tracker
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, FlatList, ScrollView, StyleSheet,
  Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColors } from '@/hooks/useColors';
import { useAudio } from '@/context/AudioContext';
import { SURAHS } from '@/constants/quranData';

// ── Short surahs taught to every child ──────────────────────────────────────
const KIDS_SURAH_IDS = [1, 112, 113, 114, 108, 103, 105, 106, 107, 109, 110, 97, 94, 93, 102];

// ── 9 daily duas every child learns ─────────────────────────────────────────
const KIDS_DUAS = [
  { id: 'waking',      en: 'Waking up',          ar: 'الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور' },
  { id: 'sleeping',    en: 'Before sleeping',    ar: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا' },
  { id: 'eat_before',  en: 'Before eating',      ar: 'بِسْمِ اللَّهِ' },
  { id: 'eat_after',   en: 'After eating',       ar: 'الحمد لله الذي أطعمني هذا ورزقنيه من غير حول مني ولا قوة' },
  { id: 'home_leave',  en: 'Leaving home',       ar: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ' },
  { id: 'home_enter',  en: 'Entering home',      ar: 'بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى رَبِّنَا تَوَكَّلْنَا' },
  { id: 'wc_enter',    en: 'Entering bathroom',  ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ' },
  { id: 'wc_exit',     en: 'Leaving bathroom',   ar: 'غُفْرَانَكَ' },
  { id: 'travel',      en: 'Travelling',         ar: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ' },
];

const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const TODAY_KEY = () => 'kids_day_' + new Date().toISOString().split('T')[0];

interface DayRecord { prayers: boolean[]; quran: boolean; dua: boolean }

function emptyDay(): DayRecord {
  return { prayers: [false, false, false, false, false], quran: false, dua: false };
}

export default function KidsQuranScreen() {
  const colors = useColors();
  const { play, stop, isPlaying, currentSurah } = useAudio();

  const [day, setDay] = useState<DayRecord>(emptyDay());
  const [tab, setTab] = useState<'surahs' | 'duas'>('surahs');
  const [openDua, setOpenDua] = useState<string | null>(null);
  const [loadingAyahs, setLoadingAyahs] = useState<Record<number, boolean>>({});

  // Load today's record
  useEffect(() => {
    AsyncStorage.getItem(TODAY_KEY()).then(raw => {
      if (raw) {
        try { setDay(JSON.parse(raw)); } catch { /* corrupted — start fresh */ }
      }
    });
  }, []);

  const saveDay = (updated: DayRecord) => {
    setDay(updated);
    AsyncStorage.setItem(TODAY_KEY(), JSON.stringify(updated));
  };

  const togglePrayer = (i: number) => {
    const updated = { ...day, prayers: [...day.prayers] };
    updated.prayers[i] = !updated.prayers[i];
    saveDay(updated);
  };

  const kidsSurahs = SURAHS.filter(s => KIDS_SURAH_IDS.includes(s.id));

  const handlePlaySurah = useCallback(async (surahId: number) => {
    const isThisPlaying = isPlaying && currentSurah === surahId;
    if (isThisPlaying) { stop(); return; }

    // Find total ayahs
    const surah = SURAHS.find(s => s.id === surahId);
    if (!surah) return;

    setLoadingAyahs(p => ({ ...p, [surahId]: true }));
    try {
      play(surahId, 1, surah.totalAyahs);
      saveDay({ ...day, quran: true });
    } finally {
      setLoadingAyahs(p => ({ ...p, [surahId]: false }));
    }
  }, [isPlaying, currentSurah, day, play, stop]);

  const starsTotal = day.prayers.filter(Boolean).length + (day.quran ? 1 : 0) + (day.dua ? 1 : 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#F9F5ED' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="chevron-left" size={24} color="#0C5A3B" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Kids Mode</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Star progress */}
        <View style={styles.starsCard}>
          <Text style={styles.starsLabel}>Today's stars ✨</Text>
          <View style={styles.starsRow}>
            {Array.from({ length: 7 }).map((_, i) => (
              <Text key={i} style={[styles.star, i < starsTotal && styles.starLit]}>★</Text>
            ))}
          </View>
          <Text style={styles.starsCount}>{starsTotal}/7 — {starsTotal === 7 ? '🌟 Amazing!' : starsTotal >= 4 ? '👍 Good job!' : 'Keep going!'}</Text>
        </View>

        {/* Prayer tracker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🕌 Prayers</Text>
          <View style={styles.prayerRow}>
            {PRAYERS.map((p, i) => (
              <TouchableOpacity
                key={p}
                style={[styles.prayerBtn, day.prayers[i] && styles.prayerBtnDone]}
                onPress={() => togglePrayer(i)}
              >
                <Text style={[styles.prayerBtnText, day.prayers[i] && { color: '#fff' }]}>{p}</Text>
                {day.prayers[i] && <Text style={styles.prayerCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'surahs' && styles.tabBtnActive]}
            onPress={() => setTab('surahs')}
          >
            <Text style={[styles.tabBtnText, tab === 'surahs' && styles.tabBtnTextActive]}>📖 Short Surahs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'duas' && styles.tabBtnActive]}
            onPress={() => setTab('duas')}
          >
            <Text style={[styles.tabBtnText, tab === 'duas' && styles.tabBtnTextActive]}>🤲 Daily Duas</Text>
          </TouchableOpacity>
        </View>

        {/* Surahs */}
        {tab === 'surahs' && (
          <View style={styles.list}>
            {kidsSurahs.map(s => {
              const playing = isPlaying && currentSurah === s.id;
              return (
                <View key={s.id} style={styles.surahCard}>
                  <TouchableOpacity
                    style={styles.surahInfo}
                    onPress={() => router.push(`/quran/${s.id}` as any)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.surahNumBadge}>
                      <Text style={styles.surahNumText}>{s.id}</Text>
                    </View>
                    <View style={styles.surahText}>
                      <Text style={styles.surahArabic}>{s.name}</Text>
                      <Text style={styles.surahEnglish}>{s.nameEnglish} • {s.totalAyahs} verses</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.playBtn, playing && styles.playBtnActive]}
                    onPress={() => handlePlaySurah(s.id)}
                  >
                    {loadingAyahs[s.id]
                      ? <ActivityIndicator size="small" color={playing ? '#fff' : '#0C5A3B'} />
                      : <Feather name={playing ? 'pause' : 'play'} size={18} color={playing ? '#fff' : '#0C5A3B'} />
                    }
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {/* Duas */}
        {tab === 'duas' && (
          <View style={styles.list}>
            {KIDS_DUAS.map(dua => (
              <TouchableOpacity
                key={dua.id}
                style={styles.duaCard}
                onPress={() => {
                  setOpenDua(openDua === dua.id ? null : dua.id);
                  if (openDua !== dua.id) saveDay({ ...day, dua: true });
                }}
                activeOpacity={0.85}
              >
                <View style={styles.duaHeader}>
                  <Text style={styles.duaEn}>{dua.en}</Text>
                  <Feather name={openDua === dua.id ? 'chevron-up' : 'chevron-down'} size={16} color="#6B8C6B" />
                </View>
                {openDua === dua.id && (
                  <Text style={styles.duaAr}>{dua.ar}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E8F3EE', alignItems: 'center', justifyContent: 'center' },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#0C5A3B' },

  starsCard: {
    margin: 16, padding: 20, backgroundColor: '#fff', borderRadius: 20,
    borderWidth: 1.5, borderColor: '#BD9A4E55', alignItems: 'center', gap: 8,
  },
  starsLabel: { fontSize: 14, fontWeight: '600', color: '#6B8C6B' },
  starsRow: { flexDirection: 'row', gap: 8 },
  star: { fontSize: 28, color: '#E0D8C0' },
  starLit: { color: '#F5B800' },
  starsCount: { fontSize: 14, fontWeight: '700', color: '#0C5A3B' },

  section: { paddingHorizontal: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#21302A', marginBottom: 12 },
  prayerRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  prayerBtn: {
    flex: 1, minWidth: 58, paddingVertical: 10, paddingHorizontal: 6,
    borderRadius: 14, backgroundColor: '#F0EBE0', alignItems: 'center', borderWidth: 1.5, borderColor: 'transparent',
  },
  prayerBtnDone: { backgroundColor: '#0C5A3B', borderColor: '#0C5A3B' },
  prayerBtnText: { fontSize: 12, fontWeight: '700', color: '#44543C' },
  prayerCheck: { fontSize: 12, color: '#fff', marginTop: 2 },

  tabs: { flexDirection: 'row', marginHorizontal: 16, marginVertical: 12, gap: 10 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 14, backgroundColor: '#F0EBE0', alignItems: 'center' },
  tabBtnActive: { backgroundColor: '#0C5A3B' },
  tabBtnText: { fontSize: 13, fontWeight: '700', color: '#6B8C6B' },
  tabBtnTextActive: { color: '#fff' },

  list: { paddingHorizontal: 16, gap: 10 },

  surahCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: '#E8E0D0',
  },
  surahInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  surahNumBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8F3EE', alignItems: 'center', justifyContent: 'center' },
  surahNumText: { fontSize: 16, fontWeight: '800', color: '#0C5A3B' },
  surahText: { flex: 1 },
  surahArabic: { fontSize: 18, fontWeight: '700', color: '#21302A', textAlign: 'left' },
  surahEnglish: { fontSize: 12, color: '#6B8C6B', marginTop: 2 },
  playBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8F3EE', alignItems: 'center', justifyContent: 'center' },
  playBtnActive: { backgroundColor: '#0C5A3B' },

  duaCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#E8E0D0',
  },
  duaHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  duaEn: { fontSize: 15, fontWeight: '700', color: '#21302A' },
  duaAr: { fontSize: 19, lineHeight: 36, color: '#0C5A3B', textAlign: 'right', marginTop: 12, fontWeight: '500' },
});
