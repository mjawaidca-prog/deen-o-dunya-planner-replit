import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { usePrayer } from '@/context/PrayerContext';

const FEATURES = [
  { icon: '🧭', label: 'qibla', route: '/qibla', color: '#1A6B45', desc: 'Find Mecca direction' },
  { icon: '📿', label: 'tasbeeh', route: '/tasbeeh', color: '#C9A84C', desc: 'Dhikr counter' },
  { icon: '🕌', label: 'masjid', route: '/masjid', color: '#2563EB', desc: 'Find nearby mosques' },
  { icon: '💰', label: 'zakat', route: '/zakat', color: '#7C3AED', desc: 'Calculate your zakat' },
  { icon: '🕐', label: 'prayerTimes', route: '/prayer', color: '#DB2777', desc: 'Full prayer schedule' },
  { icon: '📖', label: 'seerah', route: '/seerah', color: '#059669', desc: 'Islamic stories' },
  { icon: '🤲', label: 'duas', route: '/duas', color: '#D97706', desc: 'Daily supplications' },
  { icon: '✨', label: 'namesOfAllah', route: '/names', color: '#9333EA', desc: 'Asmaul Husna' },
];

export default function MoreTab() {
  const colors = useColors();
  const { t } = useLanguage();
  const { hijriDate } = usePrayer();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.foreground }]}>{t('more')}</Text>

        {/* Hijri Calendar Card */}
        {hijriDate && (
          <View style={[styles.calCard, { backgroundColor: colors.card }]}>
            <Text style={styles.calEmoji}>🌙</Text>
            <View style={styles.calInfo}>
              <Text style={[styles.calTitle, { color: colors.foreground }]}>{t('islamicCalendar')}</Text>
              <Text style={[styles.calDate, { color: colors.gold }]}>
                {hijriDate.day} {hijriDate.monthNameAr} {hijriDate.year} هـ
              </Text>
              <Text style={[styles.calSub, { color: colors.mutedForeground }]}>
                {hijriDate.day} {hijriDate.monthNameEn} {hijriDate.year} AH
              </Text>
            </View>
          </View>
        )}

        {/* Feature Grid */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Islamic Tools</Text>
        <View style={styles.grid}>
          {FEATURES.map(f => (
            <TouchableOpacity
              key={f.route}
              style={[styles.tile, { backgroundColor: colors.card }]}
              onPress={() => router.push(f.route as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.tileIconBg, { backgroundColor: f.color + '22' }]}>
                <Text style={styles.tileIcon}>{f.icon}</Text>
              </View>
              <Text style={[styles.tileLabel, { color: colors.foreground }]}>{t(f.label as any)}</Text>
              <Text style={[styles.tileDesc, { color: colors.mutedForeground }]} numberOfLines={1}>{f.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings */}
        <TouchableOpacity
          style={[styles.settingsRow, { backgroundColor: colors.card }]}
          onPress={() => router.push('/settings')}
          activeOpacity={0.8}
        >
          <Text style={styles.settingsEmoji}>⚙️</Text>
          <View style={styles.settingsInfo}>
            <Text style={[styles.settingsLabel, { color: colors.foreground }]}>{t('settings')}</Text>
            <Text style={[styles.settingsSub, { color: colors.mutedForeground }]}>Language, theme, calculation method</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 8 },
  title: { fontSize: 26, fontWeight: '700', marginHorizontal: 16, marginBottom: 16 },
  calCard: { flexDirection: 'row', alignItems: 'center', gap: 14, marginHorizontal: 16, marginBottom: 20, borderRadius: 16, padding: 16 },
  calEmoji: { fontSize: 36 },
  calInfo: { flex: 1 },
  calTitle: { fontSize: 13, fontWeight: '600', marginBottom: 2 },
  calDate: { fontSize: 16, fontWeight: '700' },
  calSub: { fontSize: 12, marginTop: 2 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginHorizontal: 16, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8, marginBottom: 20 },
  tile: { width: '47%', borderRadius: 16, padding: 16, gap: 8 },
  tileIconBg: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  tileIcon: { fontSize: 26 },
  tileLabel: { fontSize: 14, fontWeight: '700' },
  tileDesc: { fontSize: 11 },
  settingsRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 16 },
  settingsEmoji: { fontSize: 28 },
  settingsInfo: { flex: 1 },
  settingsLabel: { fontSize: 15, fontWeight: '700' },
  settingsSub: { fontSize: 12, marginTop: 2 },
});
