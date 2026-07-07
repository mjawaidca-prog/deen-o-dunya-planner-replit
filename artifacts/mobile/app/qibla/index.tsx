import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

// Magnetometer only works on native — lazy-require to avoid web crash
const Magnetometer: typeof import('expo-sensors').Magnetometer | null =
  Platform.OS !== 'web' ? require('expo-sensors').Magnetometer : null;
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { usePrayer } from '@/context/PrayerContext';

const MECCA_LAT = 21.4225;
const MECCA_LON = 39.8262;

function getQiblaAngle(lat: number, lon: number): number {
  const mLat = MECCA_LAT * (Math.PI / 180);
  const mLon = MECCA_LON * (Math.PI / 180);
  const uLat = lat * (Math.PI / 180);
  const uLon = lon * (Math.PI / 180);
  const dLon = mLon - uLon;
  const y = Math.sin(dLon) * Math.cos(mLat);
  const x = Math.cos(uLat) * Math.sin(mLat) - Math.sin(uLat) * Math.cos(mLat) * Math.cos(dLon);
  return ((Math.atan2(y, x) * (180 / Math.PI)) + 360) % 360;
}

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function QiblaScreen() {
  const colors = useColors();
  const { t } = useLanguage();
  const { location, requestLocation } = usePrayer();
  const [heading, setHeading] = useState(0);
  const rotateVal = useRef(new Animated.Value(0)).current;
  const subRef = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    if (!Magnetometer) return;
    Magnetometer.setUpdateInterval(100);
    subRef.current = Magnetometer.addListener(({ x, y }) => {
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      if (angle < 0) angle += 360;
      setHeading(angle);
    });
    return () => subRef.current?.remove();
  }, []);

  useEffect(() => {
    if (!location) return;
    const qibla = getQiblaAngle(location.lat, location.lon);
    const needle = (qibla - heading + 360) % 360;
    Animated.spring(rotateVal, { toValue: needle, useNativeDriver: true, damping: 15, stiffness: 100 }).start();
  }, [heading, location, rotateVal]);

  const qiblaAngle = location ? getQiblaAngle(location.lat, location.lon) : 0;
  const distanceKm = location ? Math.round(getDistanceKm(location.lat, location.lon, MECCA_LAT, MECCA_LON)) : 0;

  const rotate = rotateVal.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });

  if (!location) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={styles.locEmoji}>📍</Text>
        <Text style={[styles.locTitle, { color: colors.foreground }]}>Location Required</Text>
        <Text style={[styles.locSub, { color: colors.mutedForeground }]}>Enable location to find the Qibla direction</Text>
        <TouchableOpacity style={[styles.locBtn, { backgroundColor: colors.primary }]} onPress={requestLocation}>
          <Text style={styles.locBtnText}>Enable Location</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Location info */}
      <View style={styles.infoRow}>
        <View style={[styles.infoPill, { backgroundColor: colors.card }]}>
          <Feather name="map-pin" size={14} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            {location.city || `${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}`}
          </Text>
        </View>
        <View style={[styles.infoPill, { backgroundColor: colors.card }]}>
          <Text style={[styles.infoText, { color: colors.gold }]}>{distanceKm.toLocaleString()} km to Mecca</Text>
        </View>
      </View>

      {/* Compass */}
      <View style={styles.compassContainer}>
        {/* Compass ring */}
        <View style={[styles.compassRing, { borderColor: colors.border }]}>
          {['N', 'E', 'S', 'W'].map((d, i) => (
            <View key={d} style={[styles.compassDir, { transform: [{ rotate: `${i * 90}deg` }, { translateY: -80 }] }]}>
              <Text style={[styles.compassDirText, { color: d === 'N' ? colors.destructive : colors.mutedForeground }]}>{d}</Text>
            </View>
          ))}

          {/* Qibla needle */}
          <Animated.View style={[styles.needle, { transform: [{ rotate }] }]}>
            <View style={styles.needleTop} />
            <View style={[styles.needleKaaba]}>
              <Text style={styles.kaabaEmoji}>🕋</Text>
            </View>
          </Animated.View>

          {/* Center dot */}
          <View style={[styles.centerDot, { backgroundColor: colors.primary }]} />
        </View>
      </View>

      {/* Direction info */}
      <View style={[styles.dirCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.dirLabel, { color: colors.mutedForeground }]}>Qibla Direction</Text>
        <Text style={[styles.dirDeg, { color: colors.gold }]}>{Math.round(qiblaAngle)}°</Text>
        <Text style={[styles.dirSub, { color: colors.mutedForeground }]}>Compass Heading: {Math.round(heading)}°</Text>
        <Text style={[styles.arabicMecca, { color: colors.foreground }]}>اتجاه القبلة</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  locEmoji: { fontSize: 48, marginBottom: 8 },
  locTitle: { fontSize: 20, fontWeight: '700' },
  locSub: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  locBtn: { marginTop: 8, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14 },
  locBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  infoRow: { flexDirection: 'row', gap: 8, padding: 16, width: '100%' },
  infoPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  infoText: { fontSize: 13, fontWeight: '500' },
  compassContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  compassRing: {
    width: 260, height: 260, borderRadius: 130, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  compassDir: { position: 'absolute', width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  compassDirText: { fontSize: 14, fontWeight: '700' },
  needle: { position: 'absolute', alignItems: 'center', width: 4, height: 160 },
  needleTop: { width: 4, height: 80, backgroundColor: '#2D9B6B', borderRadius: 2 },
  needleKaaba: { marginTop: -4 },
  kaabaEmoji: { fontSize: 24 },
  centerDot: { width: 16, height: 16, borderRadius: 8, position: 'absolute' },
  dirCard: { width: '90%', borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 32, gap: 4 },
  dirLabel: { fontSize: 13 },
  dirDeg: { fontSize: 42, fontWeight: '700' },
  dirSub: { fontSize: 13 },
  arabicMecca: { fontSize: 18, fontWeight: '600', marginTop: 4 },
});
