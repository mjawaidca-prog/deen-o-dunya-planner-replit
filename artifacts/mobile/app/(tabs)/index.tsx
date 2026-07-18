import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { usePrayer } from '@/context/PrayerContext';
import { useApp, DailyPrayers } from '@/context/AppContext';
import PrayerCountdown from '@/components/PrayerCountdown';
import { LOCAL_HADITHS } from '@/constants/hadithBooks';
import { Language } from '@/constants/translations';

const LANGUAGES: { code: Language; native: string }[] = [
  { code: 'en', native: 'English' },
  { code: 'ar', native: 'العربية' },
  { code: 'ur', native: 'اردو' },
];

const PRAYERS: { key: keyof DailyPrayers; label: string; arabic: string }[] = [
  { key: 'fajr', label: 'Fajr', arabic: 'الفجر' },
  { key: 'dhuhr', label: 'Dhuhr', arabic: 'الظهر' },
  { key: 'asr', label: 'Asr', arabic: 'العصر' },
  { key: 'maghrib', label: 'Maghrib', arabic: 'المغرب' },
  { key: 'isha', label: 'Isha', arabic: 'العشاء' },
];

const QUICK_TILES = [
  { icon: '🧭', label: 'Qibla', route: '/qibla' },
  { icon: '📿', label: 'Tasbeeh', route: '/tasbeeh' },
  { icon: '🤲', label: 'Duas', route: '/duas' },
  { icon: '✨', label: '99 Names', route: '/names' },
  { icon: '📖', label: 'Seerah', route: '/seerah' },
  { icon: '🕌', label: 'Masjids', route: '/masjid' },
  { icon: '💰', label: 'Zakat', route: '/zakat' },
  { icon: '🌙', label: 'Prayer Times', route: '/prayer' },
  { icon: '🖼️', label: 'Image Maker', route: '/quran/search' },
  { icon: '🎬', label: 'Clip Maker', route: '/quran/search' },
];

function todayKey() {
  return new Date().toISOString().split('T')[0];
}

export default function HomeScreen() {
  const colors = useColors();
  const { t, language, setLanguage } = useLanguage();
  const { hijriDate, location, requestLocation } = usePrayer();
  const { getDayRecord, updatePrayer } = useApp();
  const today = todayKey();
  const record = getDayRecord(today);

  const hadithOfDay = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return LOCAL_HADITHS[dayOfYear % LOCAL_HADITHS.length];
  }, []);

  const prayersDoneCount = Object.values(record.prayers).filter(Boolean).length;
  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>{t('assalamu')}</Text>
            <Text style={[styles.date, { color: colors.foreground }]}>{todayStr}</Text>
            {hijriDate && (
              <Text style={[styles.hijri, { color: colors.gold }]}>
                {hijriDate.day} {hijriDate.monthNameEn} {hijriDate.year} AH
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={() => router.push('/settings')} style={[styles.settingsBtn, { backgroundColor: colors.surface }]}>
            <Feather name="settings" size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        {/* Language Selector */}
        <View style={[styles.langBar, { backgroundColor: colors.card }]}>
          {LANGUAGES.map(lang => {
            const active = language === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                onPress={() => setLanguage(lang.code)}
                activeOpacity={0.7}
                style={[
                  styles.langPill,
                  active && { backgroundColor: colors.primary },
                ]}
              >
                <Text style={[styles.langPillText, { color: active ? '#fff' : colors.foreground }]}>
                  {lang.native}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Prayer Countdown */}
        {location ? (
          <PrayerCountdown />
        ) : (
          <TouchableOpacity
            style={[styles.locationCard, { backgroundColor: colors.primary }]}
            onPress={requestLocation}
            activeOpacity={0.85}
          >
            <Feather name="map-pin" size={24} color="#fff" />
            <Text style={styles.locationText}>{t('getLocation')}</Text>
          </TouchableOpacity>
        )}

        {/* Prayer Tracker */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t('prayersDone')}</Text>
            <Text style={[styles.cardBadge, { color: colors.gold }]}>{prayersDoneCount}/5</Text>
          </View>
          <View style={styles.prayerRow}>
            {PRAYERS.map(p => (
              <TouchableOpacity
                key={p.key}
                style={[styles.prayerBtn, { backgroundColor: record.prayers[p.key] ? colors.primary : colors.surfaceAlt }]}
                onPress={() => updatePrayer(today, p.key, !record.prayers[p.key])}
              >
                <Text style={[styles.prayerArabic, { color: record.prayers[p.key] ? '#fff' : colors.mutedForeground }]}>{p.arabic}</Text>
                <Text style={[styles.prayerLabel, { color: record.prayers[p.key] ? 'rgba(255,255,255,0.85)' : colors.mutedForeground }]}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Access */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('quickAccess')}</Text>
        <View style={styles.grid}>
          {QUICK_TILES.map(tile => (
            <TouchableOpacity
              key={tile.label}
              style={[styles.tile, { backgroundColor: colors.card }]}
              onPress={() => router.push(tile.route as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.tileIcon}>{tile.icon}</Text>
              <Text style={[styles.tileLabel, { color: colors.foreground }]}>{tile.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Hadith of Day */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('hadithOfDay')}</Text>
        <View style={[styles.hadithCard, { backgroundColor: colors.card, borderLeftColor: colors.gold }]}>
          <Text style={[styles.hadithArabic, { color: colors.foreground }]}>{hadithOfDay.arabic}</Text>
          <Text style={[styles.hadithEnglish, { color: colors.mutedForeground }]}>{hadithOfDay.english}</Text>
          <View style={styles.hadithFooter}>
            <Text style={[styles.hadithNarrator, { color: colors.gold }]}>{hadithOfDay.narrator}</Text>
            <Text style={[styles.hadithGrade, { color: hadithOfDay.grade === 'sahih' ? colors.emerald : colors.gold }]}>
              {hadithOfDay.grade.charAt(0).toUpperCase() + hadithOfDay.grade.slice(1)}
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16, marginBottom: 16 },
  greeting: { fontSize: 13, marginBottom: 2 },
  date: { fontSize: 18, fontWeight: '700' },
  hijri: { fontSize: 13, marginTop: 2 },
  settingsBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  locationCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginBottom: 16, padding: 20, borderRadius: 16 },
  locationText: { color: '#fff', fontSize: 15, fontWeight: '600', flex: 1 },
  card: { marginHorizontal: 16, marginBottom: 16, borderRadius: 16, padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '600' },
  cardBadge: { fontSize: 15, fontWeight: '700' },
  prayerRow: { flexDirection: 'row', gap: 6 },
  prayerBtn: { flex: 1, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  prayerArabic: { fontSize: 12, fontWeight: '600', marginBottom: 2 },
  prayerLabel: { fontSize: 10 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginHorizontal: 16, marginBottom: 12, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8, marginBottom: 16 },
  tile: { width: '22%', aspectRatio: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center', gap: 6 },
  tileIcon: { fontSize: 26 },
  tileLabel: { fontSize: 10, fontWeight: '500', textAlign: 'center' },
  hadithCard: { marginHorizontal: 16, marginBottom: 16, borderRadius: 16, padding: 16, borderLeftWidth: 4 },
  hadithArabic: { fontSize: 16, textAlign: 'right', lineHeight: 28, marginBottom: 10, fontWeight: '500' },
  hadithEnglish: { fontSize: 14, lineHeight: 22, marginBottom: 10 },
  hadithFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hadithNarrator: { fontSize: 12, fontWeight: '500' },
  hadithGrade: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  langBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginBottom: 16, padding: 6, borderRadius: 12 },
  langPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 },
  langPillText: { fontSize: 13, fontWeight: '600' },
});
