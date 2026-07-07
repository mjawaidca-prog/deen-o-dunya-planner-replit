import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

export default function MasjidScreen() {
  const colors = useColors();
  const { t } = useLanguage();
  const { location, requestLocation } = usePrayer();
  const [masjids, setMasjids] = useState<Masjid[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const MapView = useRef<any>(null);

  // Lazily load MapView (native only)
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

  useEffect(() => {
    if (!location) return;
    fetchMasjids(location.lat, location.lon);
  }, [location]);

  const fetchMasjids = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const query = `[out:json];node[amenity=place_of_worship][religion=muslim](around:5000,${lat},${lon});out;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const data = await res.json();
      const results: Masjid[] = (data.elements || []).map((el: any) => ({
        id: el.id,
        name: el.tags?.name || el.tags?.['name:en'] || 'Unnamed Mosque',
        lat: el.lat,
        lon: el.lon,
        distance: getDistanceKm(lat, lon, el.lat, el.lon),
      })).sort((a: Masjid, b: Masjid) => (a.distance ?? 0) - (b.distance ?? 0)).slice(0, 20);
      setMasjids(results);
    } catch (e) {
      setError('Failed to find nearby masjids. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = (m: Masjid) => {
    const url = Platform.OS === 'ios'
      ? `maps:?q=${encodeURIComponent(m.name)}&ll=${m.lat},${m.lon}`
      : `geo:${m.lat},${m.lon}?q=${encodeURIComponent(m.name)}`;
    Linking.openURL(url);
  };

  if (!location) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={styles.emoji}>🕌</Text>
        <Text style={[styles.centerTitle, { color: colors.foreground }]}>Find Nearby Masjids</Text>
        <Text style={[styles.centerSub, { color: colors.mutedForeground }]}>Enable location to discover mosques near you</Text>
        <TouchableOpacity style={[styles.locBtn, { backgroundColor: colors.primary }]} onPress={requestLocation}>
          <Text style={styles.locBtnText}>Enable Location</Text>
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
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Finding nearby masjids...</Text>
        </View>
      )}

      {/* Error */}
      {error && !loading && (
        <View style={[styles.errorRow, { backgroundColor: colors.card }]}>
          <Text style={[styles.errorText, { color: colors.foreground }]}>{error}</Text>
          <TouchableOpacity onPress={() => fetchMasjids(location.lat, location.lon)}>
            <Text style={[styles.retryText, { color: colors.primary }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Masjid List */}
      {!loading && masjids.length > 0 && (
        <View style={[styles.listContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.listTitle, { color: colors.foreground }]}>
            {masjids.length} masjids found within 5km
          </Text>
          {masjids.map((m, i) => (
            <TouchableOpacity
              key={m.id}
              style={[styles.masjidRow, { borderBottomColor: colors.border }]}
              onPress={() => openInMaps(m)}
            >
              <View style={[styles.masjidIcon, { backgroundColor: colors.primary + '22' }]}>
                <Text style={styles.masjidEmoji}>🕌</Text>
              </View>
              <View style={styles.masjidInfo}>
                <Text style={[styles.masjidName, { color: colors.foreground }]} numberOfLines={1}>{m.name}</Text>
                <Text style={[styles.masjidDist, { color: colors.mutedForeground }]}>
                  {m.distance !== undefined ? `${(m.distance * 1000).toFixed(0)}m away` : ''}
                </Text>
              </View>
              <Feather name="map-pin" size={16} color={colors.primary} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {!loading && !error && masjids.length === 0 && (
        <View style={styles.center}>
          <Text style={[styles.centerSub, { color: colors.mutedForeground }]}>No mosques found within 5km</Text>
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
