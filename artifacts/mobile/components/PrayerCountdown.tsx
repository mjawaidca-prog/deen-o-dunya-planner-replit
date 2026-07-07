import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { usePrayer } from '@/context/PrayerContext';
import { useLanguage } from '@/context/LanguageContext';

function formatMs(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function PrayerCountdown() {
  const colors = useColors();
  const { nextPrayer, prayerTimes, location } = usePrayer();
  const { t } = useLanguage();
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    if (!nextPrayer) return;
    const update = () => {
      const ms = nextPrayer.remainingMs - (Date.now() - Date.now());
      const now = Date.now();
      const end = now + nextPrayer.remainingMs;
      setRemaining(formatMs(Math.max(0, end - Date.now())));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [nextPrayer]);

  useEffect(() => {
    if (!nextPrayer) return;
    const end = Date.now() + nextPrayer.remainingMs;
    const tick = () => setRemaining(formatMs(Math.max(0, end - Date.now())));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [nextPrayer]);

  if (!prayerTimes) return null;

  return (
    <LinearGradient
      colors={['#1A6B45', '#0D4F33']}
      style={styles.card}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.overlay} />
      {nextPrayer ? (
        <>
          <Text style={styles.label}>{t('nextPrayer')}</Text>
          <Text style={styles.prayerName}>{nextPrayer.name}</Text>
          <Text style={styles.countdown}>{remaining}</Text>
          <Text style={styles.time}>{nextPrayer.time}</Text>
        </>
      ) : (
        <Text style={styles.prayerName}>{t('allPrayersDone')}</Text>
      )}
      {location && (
        <Text style={styles.location}>{location.city}, {location.country}</Text>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, padding: 24, marginHorizontal: 16, marginBottom: 16, overflow: 'hidden' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.15)' },
  label: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '500' as const, letterSpacing: 1 },
  prayerName: { color: '#FFFFFF', fontSize: 32, fontWeight: '700' as const, marginTop: 4 },
  countdown: { color: '#C9A84C', fontSize: 40, fontWeight: '300' as const, letterSpacing: 4, fontFamily: 'Inter_400Regular', marginTop: 8 },
  time: { color: 'rgba(255,255,255,0.7)', fontSize: 16, marginTop: 4 },
  location: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 12, letterSpacing: 0.5 },
});
