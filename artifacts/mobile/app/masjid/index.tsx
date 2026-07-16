import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ActivityIndicator, Linking, Platform, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { usePrayer } from '@/context/PrayerContext';

interface Masjid {
  id: number;
  name: string;
  lat: number;
  lon: number;
  distance?: number;
}

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(km?: number): string {
  if (km === undefined || Number.isNaN(km)) return '';
  if (km < 1) return `${(km * 1000).toFixed(0)}m`;
  return `${km.toFixed(1)}km`;
}

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

export default function MasjidScreen() {
  const colors = useColors();
  const { t } = useLanguage();
  const { location, requestLocation } = usePrayer();
  const [masjids, setMasjids] = useState<Masjid[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [MapComponent, setMapComponent] = useState<React.ComponentType<any> | null>(null);
  const [MarkerComponent, setMarkerComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      import('react-native-maps').then(maps => {
        setMapComponent(() => maps.default);
        setMarkerComponent(() => maps.Marker);
      }).catch(() => {});
    }
  }, []);

  const fetchMasjids = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      // Broaden search: mosque tags + place_of_worship with religion=muslim, across nodes, ways and relations.
      const query = `[out:json][timeout:15];(
        node["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${lat},${lon});
        node["amenity"="mosque"](around:5000,${lat},${lon});
        node["building"="mosque"](around:5000,${lat},${lon});
        way["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${lat},${lon});
        way["amenity"="mosque"](around:5000,${lat},${lon});
        way["building"="mosque"](around:5000,${lat},${lon});
        relation["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${lat},${lon});
        relation["amenity"="mosque"](around:5000,${lat},${lon});
        relation["building"="mosque"](around:5000,${lat},${lon});
      );out center;`;

      let data: any = null;
      let lastErr: any = null;
      for (const endpoint of OVERPASS_ENDPOINTS) {
        try {
          const url = `${endpoint}?data=${encodeURIComponent(query)}`;
          const res = await fetch(url, { method: 'GET' });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          data = await res.json();
          if (data && Array.isArray(data.elements)) break;
        } catch (e) {
          lastErr = e;
        }
      }

      if (!data || !Array.isArray(data.elements)) {
        throw lastErr || new Error('No data');
      }

      const seen = new Set<number>();
      const results: Masjid[] = [];
      for (const el of data.elements) {
        if (seen.has(el.id)) continue;
        seen.add(el.id);
        const elLat = el.lat ?? el.center?.lat;
        const elLon = el.lon ?? el.center?.lon;
        if (elLat === undefined || elLon === undefined) continue;
        const name =
          el.tags?.name ||
          el.tags?.['name:en'] ||
          el.tags?.['name:ar'] ||
          el.tags?.['name:ur'] ||
          t('nearbyMasjids');
        results.push({
          id: el.id,
          name,
          lat: elLat,
          lon: elLon,
          distance: getDistanceKm(lat, lon, elLat, elLon),
        });
      }

      results.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
      setMasjids(results.slice(0, 25));
    } catch (e) {
      console.warn('[Masjid] fetch failed', e);
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (location) fetchMasjids(location.lat, location.lon);
  }, [location, fetchMasjids]);

  const openInMaps = (m: Masjid) => {
    const label = m.name || 'Mosque';
    const url = Platform.OS === 'ios'
      ? `maps:?q=${encodeURIComponent(label)}&ll=${m.lat},${m.lon}`
      : `geo:${m.lat},${m.lon}?q=${encodeURIComponent(label)}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(label)}&query=${m.lat},${m.lon}`);
    });
  };

  const searchInGoogleMaps = () => {
    if (!location) return;
    const url = `https://www.google.com/maps/search/mosque/@${location.lat},${location.lon},14z`;
    Linking.openURL(url).catch(() => Alert.alert(t('error'), 'Could not open maps.'));
  };

  if (!location) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]} edges={['bottom']}>
        <Text style={styles.emoji}>🕌</Text>
        <Text style={[styles.centerTitle, { color: colors.foreground }]}>{t('nearbyMasjids')}</Text>
        <Text style={[styles.centerSub, { color: colors.mutedForeground }]}>{t('locationPermission')}</Text>
        <TouchableOpacity style={[styles.locBtn, { backgroundColor: colors.primary }]} onPress={requestLocation}>
          <Text style={styles.locBtnText}>{t('getLocation')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Map */}
      {MapComponent && MarkerComponent && (
        <MapComponent
          style={styles.map}
          initialRegion={{ latitude: location.lat, longitude: location.lon, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
          mapType="standard"
        >
          <MarkerComponent coordinate={{ latitude: location.lat, longitude: location.lon }} title="You" pinColor="blue" />
          {masjids.map(m => (
            <MarkerComponent key={m.id} coordinate={{ latitude: m.lat, longitude: m.lon }} title={m.name} pinColor="green" />
          ))}
        </MapComponent>
      )}

      {/* Loading */}
      {loading && (
        <View style={[styles.loadingRow, { backgroundColor: colors.card }]}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>{t('findingMasjids')}</Text>
        </View>
      )}

      {/* Error */}
      {error && !loading && (
        <View style={[styles.errorRow, { backgroundColor: colors.card }]}>
          <Text style={[styles.errorText, { color: colors.foreground }]}>{error}</Text>
          <View style={styles.errorActions}>
            <TouchableOpacity onPress={() => fetchMasjids(location.lat, location.lon)}>
              <Text style={[styles.retryText, { color: colors.primary }]}>{t('retry')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={searchInGoogleMaps}>
              <Text style={[styles.retryText, { color: colors.gold }]}>Open Maps</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Masjid List */}
      {!loading && masjids.length > 0 && (
        <View style={[styles.listContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.listTitle, { color: colors.foreground }]}>
            {masjids.length} {t('nearbyMasjids').toLowerCase()} (5km)
          </Text>
          {masjids.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[styles.masjidRow, { borderBottomColor: colors.border }]}
              onPress={() => openInMaps(m)}
              activeOpacity={0.8}
            >
              <View style={[styles.masjidIcon, { backgroundColor: colors.primary + '22' }]}>
                <Text style={styles.masjidEmoji}>🕌</Text>
              </View>
              <View style={styles.masjidInfo}>
                <Text style={[styles.masjidName, { color: colors.foreground }]} numberOfLines={1}>{m.name}</Text>
                <Text style={[styles.masjidDist, { color: colors.mutedForeground }]}>
                  {formatDistance(m.distance)} {t('away')}
                </Text>
              </View>
              <Feather name="map-pin" size={16} color={colors.primary} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {!loading && !error && masjids.length === 0 && (
        <View style={styles.center}>
          <Text style={styles.emoji}>🕌</Text>
          <Text style={[styles.centerSub, { color: colors.mutedForeground }]}>{t('noMasjidsFound')}</Text>
          <TouchableOpacity style={[styles.locBtn, { backgroundColor: colors.gold }]} onPress={searchInGoogleMaps}>
            <Text style={styles.locBtnText}>Search in Google Maps</Text>
          </TouchableOpacity>
        </View>
      )}
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
  map: { height: 260 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, margin: 12, borderRadius: 10 },
  loadingText: { fontSize: 14 },
  errorRow: { margin: 12, padding: 16, borderRadius: 12, gap: 8 },
  errorText: { fontSize: 14, lineHeight: 20 },
  errorActions: { flexDirection: 'row', gap: 16 },
  retryText: { fontSize: 14, fontWeight: '600' },
  listContainer: { flex: 1, paddingTop: 8 },
  listTitle: { fontSize: 13, fontWeight: '600', paddingHorizontal: 16, paddingVertical: 6 },
  masjidRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12, borderBottomWidth: 1 },
  masjidIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  masjidEmoji: { fontSize: 20 },
  masjidInfo: { flex: 1 },
  masjidName: { fontSize: 15, fontWeight: '500' },
  masjidDist: { fontSize: 12, marginTop: 2 },
});
