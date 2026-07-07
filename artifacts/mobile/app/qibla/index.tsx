import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { usePrayer } from '@/context/PrayerContext';

// Magnetometer is native-only and unavailable in Expo Go — guard with try-catch
type MagnetometerType = typeof import('expo-sensors').Magnetometer;
let Magnetometer: MagnetometerType | null = null;
try {
  if (Platform.OS !== 'web') {
    Magnetometer = (require('expo-sensors') as typeof import('expo-sensors')).Magnetometer;
  }
} catch {
  // Not available in this environment
}

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
    try {
      Magnetometer.setUpdateInterval(100);
      subRef.current = Magnetometer.addListener(({ x, y }) => {
        let angle = Math.atan2(y, x) * (180 / Math.PI);
        if (angle < 0) angle += 360;
        setHeading(angle);
      });
    } catch {}
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.foreground }]}>🕌 {t('qibla')}</Text>

      {!location ? (
        <View style={styles.center}>
          <Text style={[styles.noLoc, { color: colors.mutedForeground }]}>
            Location needed to find Qibla direction
          </Text>
          <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={requestLocation}>
            <Text style={styles.btnText}>Get My Location</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.center}>
          {/* Compass Ring */}
          <View style={[styles.compassRing, { borderColor: colors.primary }]}>
            {/* Cardinal directions */}
            {(['N', 'E', 'S', 'W'] as const).map((d, i) => (
              <View
                key={d}
                style={[styles.compassDir, { transform: [{ rotate: `${i * 90}deg` }, { translateY: -80 }] }]}
              >
                <Text style={[styles.compassDirText, { color: d === 'N' ? colors.destructive : colors.mutedForeground }]}>{d}</Text>
              </View>
            ))}

            {/* Qibla needle */}
            <Animated.View style={[styles.needle, { transform: [{ rotate }] }]}>
              <View style={[styles.needleTip, { backgroundColor: colors.gold }]} />
              <View style={[styles.needleBase, { backgroundColor: colors.muted }]} />
            </Animated.View>

            {/* Center Kaaba icon */}
            <View style={[styles.centerDot, { backgroundColor: colors.card, borderColor: colors.gold }]}>
              <Text style={styles.kaabaEmoji}>🕋</Text>
            </View>
          </View>

          {/* Info cards */}
          <View style={styles.infoRow}>
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Direction</Text>
              <Text style={[styles.infoValue, { color: colors.gold }]}>{Math.round(qiblaAngle)}°</Text>
            </View>
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Distance</Text>
              <Text style={[styles.infoValue, { color: colors.gold }]}>{distanceKm.toLocaleString()} km</Text>
            </View>
          </View>

          <View style={[styles.locCard, { backgroundColor: colors.card }]}>
            <Feather name="map-pin" size={14} color={colors.primary} />
            <Text style={[styles.locText, { color: colors.mutedForeground }]}>
              {location.city}, {location.country}
            </Text>
            <TouchableOpacity onPress={requestLocation}>
              <Text style={[styles.changeText, { color: colors.primary }]}>Change</Text>
            </TouchableOpacity>
          </View>

          {!Magnetometer && (
            <View style={[styles.warningCard, { backgroundColor: colors.card }]}>
              <Feather name="alert-circle" size={14} color={colors.gold} />
              <Text style={[styles.warningText, { color: colors.mutedForeground }]}>
                Compass unavailable in Expo Go. Install a development build for live compass.
              </Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  title: { fontSize: 22, fontWeight: '700', marginTop: 16, marginBottom: 24, textAlign: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 },
  noLoc: { fontSize: 16, textAlign: 'center', marginBottom: 16, lineHeight: 24 },
  btn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  compassRing: {
    width: 220, height: 220, borderRadius: 110,
    borderWidth: 3, alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  compassDir: {
    position: 'absolute',
    width: 24, height: 24, alignItems: 'center', justifyContent: 'center',
  },
  compassDirText: { fontSize: 14, fontWeight: '700' },
  needle: { width: 4, height: 160, alignItems: 'center', position: 'absolute' },
  needleTip: { flex: 1, width: 4, borderRadius: 2 },
  needleBase: { flex: 1, width: 4, borderRadius: 2 },
  centerDot: {
    width: 48, height: 48, borderRadius: 24,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
    position: 'absolute',
  },
  kaabaEmoji: { fontSize: 24 },
  infoRow: { flexDirection: 'row', gap: 16 },
  infoCard: { flex: 1, borderRadius: 12, padding: 16, alignItems: 'center' },
  infoLabel: { fontSize: 12, marginBottom: 4 },
  infoValue: { fontSize: 22, fontWeight: '700' },
  locCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
  },
  locText: { flex: 1, fontSize: 13 },
  changeText: { fontSize: 13, fontWeight: '600' },
  warningCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    borderRadius: 10, padding: 12, marginTop: -8,
  },
  warningText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
