import React, { useMemo, useState } from 'react';
import {
  FlatList, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { SURAHS } from '@/constants/quranData';

const FILTERS = ['All', 'Meccan', 'Medinan'] as const;
type Filter = typeof FILTERS[number];

export default function QuranTab() {
  const colors = useColors();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All');

  const filtered = useMemo(() => {
    let list = SURAHS;
    if (filter !== 'All') list = list.filter(s => s.revelationType === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(s =>
        s.nameEnglish.toLowerCase().includes(q) ||
        s.name.includes(q) ||
        s.meaning.toLowerCase().includes(q) ||
        String(s.id).includes(q),
      );
    }
    return list;
  }, [query, filter]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

      {/* ─── Header ─── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.title, { color: colors.foreground }]}>القرآن الكريم</Text>
            <Text style={[styles.subtitle, { color: colors.gold }]}>The Holy Quran</Text>
          </View>
          <TouchableOpacity
            style={[styles.bookmarkBtn, { backgroundColor: colors.card }]}
            onPress={() => router.push('/quran/bookmarks' as any)}
          >
            <Feather name="bookmark" size={18} color={colors.gold} />
          </TouchableOpacity>
        </View>

        {/* ── Global Verse Search Banner ── */}
        <TouchableOpacity
          style={[styles.verseSearchBanner, {
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
          }]}
          onPress={() => router.push('/quran/search' as any)}
          activeOpacity={0.85}
        >
          <Feather name="search" size={18} color="#fff" />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Search Quran Verses</Text>
            <Text style={styles.bannerSub}>Search all 6,236 ayahs in English, Urdu or Arabic</Text>
          </View>
          <Feather name="arrow-right" size={18} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        {/* ── Surah name/number search ── */}
        <View style={[styles.searchRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Feather name="list" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Filter by surah name or number…"
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Filter pills ── */}
        <View style={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterPill,
                { backgroundColor: filter === f ? colors.primary : colors.surfaceAlt },
              ]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, { color: filter === f ? '#fff' : colors.mutedForeground }]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
          <Text style={[styles.countLabel, { color: colors.mutedForeground }]}>
            {filtered.length} surahs
          </Text>
        </View>
      </View>

      {/* ─── Surah List ─── */}
      <FlatList
        data={filtered}
        keyExtractor={s => String(s.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.row, { backgroundColor: colors.card }]}
            onPress={() => router.push(`/quran/${item.id}` as any)}
            activeOpacity={0.75}
          >
            {/* Surah number with gold ring */}
            <View style={[styles.numWrap, { borderColor: colors.gold + '66' }]}>
              <View style={[styles.numCircle, { backgroundColor: colors.primary }]}>
                <Text style={styles.num}>{item.id}</Text>
              </View>
            </View>

            <View style={styles.info}>
              <Text style={[styles.arabicName, { color: colors.foreground }]}>{item.name}</Text>
              <Text style={[styles.engName, { color: colors.mutedForeground }]}>
                {item.nameEnglish} · {item.meaning}
              </Text>
            </View>

            <View style={styles.right}>
              <View style={[
                styles.badge,
                {
                  backgroundColor: item.revelationType === 'Meccan'
                    ? colors.primary + '22'
                    : colors.gold + '22',
                },
              ]}>
                <Text style={[
                  styles.badgeText,
                  { color: item.revelationType === 'Meccan' ? colors.primary : colors.gold },
                ]}>
                  {item.revelationType === 'Meccan' ? 'Meccan' : 'Medinan'}
                </Text>
              </View>
              <Text style={[styles.ayahCount, { color: colors.mutedForeground }]}>
                {item.totalAyahs} verses
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={{ fontSize: 32 }}>🔍</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No surahs found</Text>
          </View>
        )}
        ListFooterComponent={() => <View style={{ height: 100 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingBottom: 4 },

  headerTop: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10,
  },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 13, marginTop: 2, letterSpacing: 0.8 },
  bookmarkBtn: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
  },

  // Global verse search banner
  verseSearchBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginHorizontal: 16, marginBottom: 10,
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  bannerTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  bannerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 1 },

  // Surah filter search
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginBottom: 10, borderRadius: 12, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 14 },

  filterRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, marginBottom: 6,
  },
  filterPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  filterText: { fontSize: 13, fontWeight: '600' },
  countLabel: { fontSize: 12, marginLeft: 'auto' },

  list: { paddingHorizontal: 16 },
  row: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, padding: 12, borderRadius: 14,
  },
  numWrap: {
    width: 42, height: 42, borderRadius: 21,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  numCircle: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
  },
  num: { color: '#fff', fontSize: 12, fontWeight: '700' },
  info: { flex: 1 },
  arabicName: { fontSize: 17, fontWeight: '600', textAlign: 'right', marginBottom: 3 },
  engName: { fontSize: 12 },
  right: { alignItems: 'flex-end', gap: 5 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  ayahCount: { fontSize: 11 },
  empty: { alignItems: 'center', justifyContent: 'center', marginTop: 80, gap: 12 },
  emptyText: { fontSize: 15 },
});
