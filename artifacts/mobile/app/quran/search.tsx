import React, { useState, useRef } from 'react';
import {
  ActivityIndicator, FlatList, Keyboard, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { TRANSLATION_EDITIONS } from '@/constants/quranData';

interface SearchResult {
  number: number;
  text: string;
  surah: { number: number; name: string; englishName: string; englishNameTranslation: string };
  numberInSurah: number;
}

const EDITIONS = [
  { id: 'en.sahih', label: 'English' },
  { id: 'ur.maududi', label: 'Urdu' },
];

export default function QuranSearchScreen() {
  const colors = useColors();
  const [query, setQuery] = useState('');
  const [edition, setEdition] = useState(EDITIONS[0]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    Keyboard.dismiss();
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const url = `https://api.alquran.cloud/v1/search/${encodeURIComponent(q)}/all/${edition.id}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.code === 200 && data.data?.matches) {
        setResults(data.data.matches);
      } else {
        setResults([]);
      }
    } catch {
      setError('Search failed. Check your internet connection.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const highlightQuery = (text: string, q: string): React.ReactNode => {
    if (!q.trim()) return <Text>{text}</Text>;
    const lower = text.toLowerCase();
    const lowerQ = q.toLowerCase();
    const idx = lower.indexOf(lowerQ);
    if (idx < 0) return <Text style={{ color: 'inherit' }}>{text}</Text>;
    return (
      <Text>
        <Text>{text.slice(0, idx)}</Text>
        <Text style={{ backgroundColor: '#C9A84C44', color: '#C9A84C', fontWeight: '700' }}>
          {text.slice(idx, idx + q.length)}
        </Text>
        <Text>{text.slice(idx + q.length)}</Text>
      </Text>
    );
  };

  const renderResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={[styles.resultCard, { backgroundColor: colors.card }]}
      onPress={() => router.push(`/quran/${item.surah.number}` as any)}
      activeOpacity={0.8}
    >
      <View style={styles.resultMeta}>
        <View style={[styles.refPill, { backgroundColor: colors.primary + '22' }]}>
          <Text style={[styles.refText, { color: colors.primary }]}>
            {item.surah.englishName} {item.surah.number}:{item.numberInSurah}
          </Text>
        </View>
        <Text style={[styles.surahArabic, { color: colors.gold }]}>{item.surah.name}</Text>
      </View>
      <Text style={[styles.resultText, { color: colors.foreground }]} numberOfLines={4}>
        {highlightQuery(item.text, query.trim())}
      </Text>
      <Text style={[styles.surahSub, { color: colors.mutedForeground }]}>
        {item.surah.englishNameTranslation}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search bar */}
      <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Feather name="search" size={18} color={colors.primary} />
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: colors.foreground }]}
          placeholder="Search Quran by keyword…"
          placeholderTextColor={colors.mutedForeground}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setSearched(false); }}>
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>

      {/* Language toggle + search button */}
      <View style={styles.controlRow}>
        <View style={[styles.editionToggle, { backgroundColor: colors.surfaceAlt }]}>
          {EDITIONS.map(ed => (
            <TouchableOpacity
              key={ed.id}
              style={[styles.editionBtn, ed.id === edition.id && { backgroundColor: colors.primary }]}
              onPress={() => setEdition(ed)}
            >
              <Text style={[styles.editionText, { color: ed.id === edition.id ? '#fff' : colors.mutedForeground }]}>
                {ed.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.searchBtn, { backgroundColor: colors.primary, opacity: query.trim() ? 1 : 0.5 }]}
          onPress={handleSearch}
          disabled={!query.trim()}
        >
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.hint, { color: colors.mutedForeground }]}>Searching Quran…</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.center}>
          <Feather name="wifi-off" size={40} color={colors.mutedForeground} />
          <Text style={[styles.hint, { color: colors.foreground }]}>{error}</Text>
        </View>
      )}

      {!loading && !error && searched && results.length === 0 && (
        <View style={styles.center}>
          <Text style={{ fontSize: 40 }}>📭</Text>
          <Text style={[styles.hint, { color: colors.mutedForeground }]}>No results for "{query}"</Text>
          <Text style={[styles.hint2, { color: colors.mutedForeground }]}>Try a different keyword or switch to Urdu</Text>
        </View>
      )}

      {!loading && !searched && (
        <View style={styles.center}>
          <Text style={{ fontSize: 48 }}>🔍</Text>
          <Text style={[styles.hint, { color: colors.mutedForeground }]}>Search across all 6,236 ayahs</Text>
          <Text style={[styles.hint2, { color: colors.mutedForeground }]}>
            Try: "mercy", "prayer", "paradise", "صلاة"
          </Text>
        </View>
      )}

      {!loading && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={r => String(r.number)}
          renderItem={renderResult}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </Text>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListFooterComponent={() => <View style={{ height: 100 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginTop: 12, marginBottom: 8,
    borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12,
  },
  input: { flex: 1, fontSize: 16 },
  controlRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, marginBottom: 12 },
  editionToggle: { flexDirection: 'row', borderRadius: 20, overflow: 'hidden', flex: 1 },
  editionBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 20 },
  editionText: { fontSize: 13, fontWeight: '600' },
  searchBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  searchBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 32 },
  hint: { fontSize: 15, textAlign: 'center', fontWeight: '600' },
  hint2: { fontSize: 13, textAlign: 'center' },
  list: { paddingHorizontal: 16 },
  resultCount: { fontSize: 12, fontWeight: '600', marginBottom: 8 },
  resultCard: { borderRadius: 14, padding: 14 },
  resultMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  refPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  refText: { fontSize: 12, fontWeight: '700' },
  surahArabic: { fontSize: 15, fontWeight: '700' },
  resultText: { fontSize: 14, lineHeight: 22, marginBottom: 4 },
  surahSub: { fontSize: 11 },
});
