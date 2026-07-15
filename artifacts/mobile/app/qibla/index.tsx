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
const ALIGNMENT_THRESHOLD = 4; // Degrees of margin to count as "perfectly aligned"

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

function getCardinalLabel(angle: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(angle / 22.5) % 16;
  return directions[index];
}

export default function QiblaScreen() {
  const colors = useColors();
  const { t } = useLanguage();
  const { location, requestLocation } = usePrayer();
  const [heading, setHeading] = useState(0);
  const [isAligned, setIsAligned] = useState(false);

  const rotateVal = useRef(new Animated.Value(0)).current;
  const lastAngle = useRef(0); // Tracks cumulative rotation to prevent 360° spin jitter
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

  // Calculate base angles
  const qiblaAngle = location ? getQiblaAngle(location.lat, location.lon) : 0;
  const distanceKm = location ? Math.round(getDistanceKm(location.lat, location.lon, MECCA_LAT, MECCA_LON)) : 0;

  // Determine if pointing exactly at Qibla (accounting for boundary wrapping)
  const rawDiff = Math.abs(((qiblaAngle - heading + 180) % 360) - 180);
  const angleDifference = Number.isNaN(rawDiff) ? 180 : rawDiff;
  const aligned = location ? angleDifference <= ALIGNMENT_THRESHOLD : false;

  useEffect(() => {
    setIsAligned(aligned);
  }, [aligned]);

  useEffect(() => {
    if (!location) return;

    // Calculate the physical needle offset
    const targetAngle = qiblaAngle - heading;

    // Shortest-path interpolation algorithm
    let diff = targetAngle - (lastAngle.current % 360);
    if (diff < -180) diff += 360;
    if (diff > 180) diff -= 360;

    const finalAngle = lastAngle.current + diff;
    lastAngle.current = finalAngle;

    Animated.spring(rotateVal, {
      toValue: finalAngle,
      useNativeDriver: true,
      damping: 18,   // Increases stability against tiny hand shakes
      stiffness: 90,
    }).start();
  }, [heading, location, qiblaAngle, rotateVal]);

  const rotate = rotateVal.interpolate({
    inputRange: [-10000, 10000],
    outputRange: ['-10000deg', '10000deg'], // Standard interpolation supporting continuous scaling
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.subtitle, { color: colors.gold }]}>{t('qiblaSubtitle').toUpperCase()}</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>{t('qibla')}</Text>

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
          <Text style={[styles.arabicLabel, { color: colors.gold }]}>القبلة</Text>

          {/* Compass Ring - Swaps to green when perfectly aligned */}
          <View style={[
            styles.compassRing,
            { borderColor: isAligned ? colors.emerald : colors.primary }
          ]}>
            {/* Cardinal directions */}
            {(['N', 'E', 'S', 'W'] as const).map((d, i) => (
              <View key={d} style={[styles.compassDir, { transform: [{ rotate: `${i * 90}deg` }, { translateY: -96 }] }]}>
                <Text style={[styles.compassDirText, { color: d === 'N' ? colors.destructive : colors.mutedForeground }]}>{d}</Text>
              </View>
            ))}

            {/* Top Kaaba marker */}
            <View style={[styles.topMarker, { backgroundColor: isAligned ? colors.emerald : colors.primary }]}>
              <Text style={styles.topMarkerIcon}>🕋</Text>
            </View>

            {/* Qibla needle - Switches colors when aligned */}
            <Animated.View style={[styles.needle, { transform: [{ rotate }] }]}>
              <View style={[
                styles.needleTip,
                { backgroundColor: isAligned ? colors.emerald : colors.gold }
              ]} />
              <View style={[styles.needleBase, { backgroundColor: colors.muted }]} />
            </Animated.View>

            {/* Center pivot */}
            <View style={[
              styles.centerDot,
              {
                backgroundColor: isAligned ? '#E8F5E9' : colors.card,
                borderColor: isAligned ? colors.emerald : colors.gold,
                transform: [{ scale: isAligned ? 1.15 : 1.0 }]
              }
            ]}>
              <View style={[styles.pivotInner, { backgroundColor: isAligned ? colors.emerald : colors.gold }]} />
            </View>
          </View>

          {/* Heading readout */}
          <View style={styles.headingReadout}>
            <Text style={[styles.headingDegrees, { color: colors.emerald }]}>
              {Math.round(heading)}°
            </Text>
            <Text style={[styles.headingLabel, { color: colors.mutedForeground }]}>
              {getCardinalLabel(heading)} {t('fromNorth')} - {t('compassLive')}
            </Text>
          </View>

          {/* Layman visual guidance banner */}
          <View style={styles.guidanceContainer}>
            {isAligned ? (
              <View style={[styles.successBanner, { backgroundColor: '#E8F5E9', borderColor: colors.emerald }]}>
                <Feather name="check-circle" size={16} color={colors.emerald} />
                <Text style={[styles.successText, { color: colors.emerald }]}>
                  {t('facingQibla')}
                </Text>
              </View>
            ) : (
              <Text style={[styles.guidanceText, { color: colors.mutedForeground }]}>
                {t('rotatePhone')}
              </Text>
            )}
          </View>

          {/* Info cards */}
          <View style={styles.infoRow}>
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{t('qiblaDirection')}</Text>
              <Text style={[styles.infoValue, { color: isAligned ? colors.emerald : colors.gold }]}>
                {Math.round(qiblaAngle)}°
              </Text>
            </View>
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{t('distanceToMecca')}</Text>
              <Text style={[styles.infoValue, { color: isAligned ? colors.emerald : colors.gold }]}>
                {distanceKm.toLocaleString()} km
              </Text>
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
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginTop: 16,
  },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  arabicLabel: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  noLoc: { fontSize: 16, textAlign: 'center', marginBottom: 16, lineHeight: 24 },
  btn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  compassRing: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  compassDir: {
    position: 'absolute',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassDirText: { fontSize: 14, fontWeight: '700' },
  topMarker: {
    position: 'absolute',
    top: 14,
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  topMarkerIcon: { fontSize: 20 },
  needle: { width: 4, height: 180, alignItems: 'center', position: 'absolute' },
  needleTip: { flex: 1, width: 4, borderRadius: 2 },
  needleBase: { flex: 1, width: 4, borderRadius: 2 },
  centerDot: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  pivotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  headingReadout: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingDegrees: {
    fontSize: 36,
    fontWeight: '700',
  },
  headingLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  guidanceContainer: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  guidanceText: {
    fontSize: 14,
    textAlign: 'center',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  successText: {
    fontWeight: '700',
    fontSize: 14,
  },
  infoRow: { flexDirection: 'row', gap: 16 },
  infoCard: { flex: 1, borderRadius: 12, padding: 16, alignItems: 'center' },
  infoLabel: { fontSize: 12, marginBottom: 4 },
  infoValue: { fontSize: 22, fontWeight: '700' },
  locCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  locText: { flex: 1, fontSize: 13 },
  changeText: { fontSize: 13, fontWeight: '600' },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 10,
    padding: 12,
    marginTop: -8,
  },
  warningText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
