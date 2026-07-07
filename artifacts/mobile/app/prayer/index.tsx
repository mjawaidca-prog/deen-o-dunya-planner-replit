import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { usePrayer } from '@/context/PrayerContext';

const PRAYER_ENTRIES = [
  { key: 'Fajr', arabicName: 'الفجر', label: 'Fajr', icon: '🌅' },
  { key: 'Sunrise', arabicName: 'الشروق', label: 'Sunrise', icon: '🌤️' },
  { key: 'Dhuhr', arabicName: 'الظهر', label: 'Dhuhr', icon: '☀️' },
  { key: 'Asr', arabicName: 'العصر', label: 'Asr', icon: '🌇' },
  { key: 'Maghrib', arabicName: 'المغرب', label: 'Maghrib', icon: '🌆' },
  { key: 'Isha', arabicName: 'العشاء', label: 'Isha', icon: '🌙' },
];

export default function PrayerTimesScreen() {
  const colors = useColors();
  const { t } = useLanguage();
  const { prayerTimes, nextPrayer, hijriDate, location, loading, error, requestLocation, refreshPrayerTimes, calculationMethod } = usePrayer();

  if (!location) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={styles.emoji}>🕐</Text>
        <Text style={[styles.centerTitle, { color: colors.foreground }]}>Prayer Times</Text>
        <Text style={[styles.centerSub, { color: colors.mutedForeground }]}>Enable location to see prayer times</Text>
        <TouchableOpacity style={[styles.locBtn, { backgroundColor: colors.primary }]} onPress={requestLocation}>
          <Text style={styles.locBtnText}>Enable Location</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Date & Location */}
        <View style={[styles.headerCard, { backgroundColor: colors.card }]}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.locationLabel, { color: colors.mutedForeground }]}>
                <Feather name="map-pin" size={12} color={colors.mutedForeground} /> {location.city}, {location.country}
              </Text>
              {hijriDate && (
                <Text style={[styles.hijriDate, { color: colors.gold }]}>
                  {hijriDate.day} {hijriDate.monthNameEn} {hijriDate.year} AH
                </Text>
              )}
              <Text style={[styles.gregorianDate, { color: colors.mutedForeground }]}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Text>
            </View>
            <TouchableOpacity onPress={refreshPrayerTimes} style={[styles.refreshBtn, { backgroundColor: colors.surfaceAlt }]}>
              <Feather name="refresh-cw" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Next Prayer */}
        {nextPrayer && (
          <View style={[styles.nextCard, { backgroundColor: colors.primary }]}>
            <Text style={styles.nextLabel}>Next Prayer</Text>
            <Text style={styles.nextName}>{nextPrayer.name}</Text>
            <Text style={styles.nextTime}>{nextPrayer.time}</Text>
            <Text style={styles.nextRemaining}>
              in {Math.floor(nextPrayer.remainingMs / 3600000)}h {Math.floor((nextPrayer.remainingMs % 3600000) / 60000)}m
            </Text>
          </View>
        )}

        {/* Loading */}
        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>{t('loading')}</Text>
          </View>
        )}

        {/* Error */}
        {error && (
          <View style={[styles.errorBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.errorText, { color: colors.foreground }]}>{error}</Text>
            <TouchableOpacity onPress={refreshPrayerTimes}>
              <Text style={[styles.retryText, { color: colors.primary }]}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Prayer Times Table */}
        {prayerTimes && (
          <View style={[styles.timesCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.timesTitle, { color: colors.foreground }]}>Today's Prayer Times</Text>
            {PRAYER_ENTRIES.map((p, i) => {
              const time = prayerTimes[p.key as keyof typeof prayerTimes];
              const isNext = nextPrayer?.name === p.key;
              const isPrayer = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(p.key);
              return (
                <View
                  key={p.key}
                  style={[
                    styles.prayerRow,
                    { borderBottomColor: colors.border },
                    i < PRAYER_ENTRIES.length - 1 && { borderBottomWidth: 1 },
                    isNext && { backgroundColor: colors.primary + '22' },
                  ]}
                >
                  <Text style={styles.prayerIcon}>{p.icon}</Text>
                  <View style={styles.prayerInfo}>
                    <Text style={[styles.prayerArabic, { color: colors.gold }]}>{p.arabicName}</Text>
                    <Text style={[styles.prayerLabel, { color: isNext ? colors.primary : colors.foreground }]}>
                      {p.label}{isNext ? ' ← Next' : ''}
                    </Text>
                  </View>
                  <Text style={[styles.prayerTime, { color: isNext ? colors.primary : colors.foreground }]}>{time}</Text>
                  {!isPrayer && (
                    <View style={[styles.sunBadge, { backgroundColor: colors.surfaceAlt }]}>
                      <Text style={[styles.sunBadgeText, { color: colors.mutedForeground }]}>Sun</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Calculation Method */}
        <View style={[styles.methodCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.methodLabel, { color: colors.mutedForeground }]}>Calculation Method</Text>
          <Text style={[styles.methodVal, { color: colors.foreground }]}>Method #{calculationMethod}</Text>
          <Text style={[styles.methodHint, { color: colors.mutedForeground }]}>Change in Settings</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  emoji: { fontSize: 48 },
  centerTitle: { fontSize: 20, fontWeight: '700' },
  centerSub: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  locBtn: { marginTop: 8, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14 },
  locBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  content: { padding: 16, gap: 12 },
  headerCard: { borderRadius: 14, padding: 16 },
  headerTop: { flexDirection: 'row', alignItems: 'flex-start' },
  locationLabel: { fontSize: 13, marginBottom: 4 },
  hijriDate: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  gregorianDate: { fontSize: 12 },
  refreshBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  nextCard: { borderRadius: 14, padding: 20, alignItems: 'center', gap: 4 },
  nextLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  nextName: { color: '#fff', fontSize: 24, fontWeight: '700' },
  nextTime: { color: 'rgba(255,255,255,0.9)', fontSize: 18, fontWeight: '600' },
  nextRemaining: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center', paddingVertical: 20 },
  loadingText: { fontSize: 14 },
  errorBox: { borderRadius: 12, padding: 16, gap: 8 },
  errorText: { fontSize: 14, lineHeight: 20 },
  retryText: { fontSize: 14, fontWeight: '600' },
  timesCard: { borderRadius: 14, overflow: 'hidden' },
  timesTitle: { fontSize: 15, fontWeight: '700', padding: 14, paddingBottom: 0 },
  prayerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  prayerIcon: { fontSize: 22, width: 30, textAlign: 'center' },
  prayerInfo: { flex: 1 },
  prayerArabic: { fontSize: 13, fontWeight: '600' },
  prayerLabel: { fontSize: 15, fontWeight: '500' },
  prayerTime: { fontSize: 16, fontWeight: '700' },
  sunBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  sunBadgeText: { fontSize: 11 },
  methodCard: { borderRadius: 14, padding: 14, gap: 2 },
  methodLabel: { fontSize: 12 },
  methodVal: { fontSize: 14, fontWeight: '600' },
  methodHint: { fontSize: 12 },
});
