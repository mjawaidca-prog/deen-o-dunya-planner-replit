import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, Keyboard, Share,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColors } from '@/hooks/useColors';
import { SURAHS } from '@/constants/quranData';

// ─── Types ───────────────────────────────────────────────────────────────────

interface SearchLang {
  id: string;
  label: string;
  labelNative: string;
  edition: string;   // AlQuran.cloud edition to search in
}

const SEARCH_LANGS: SearchLang[] = [
  { id: 'en', label: 'English',  labelNative: 'English', edition: 'en.sahih'    },
  { id: 'ur', label: 'Urdu',     labelNative: 'اردو',    edition: 'ur.maududi'  },
  { id: 'ar', label: 'Arabic',   labelNative: 'عربي',    edition: 'ar.uthmani'  },
];

interface RawMatch {
  number: number;
  text: string; // text in searched edition
  surah: {
    number: number;
    name: string;          // Arabic name
    englishName: string;
    englishNameTranslation: string;
  };
  numberInSurah: number;
}

interface EnrichedResult extends RawMatch {
  arabic: string;    // ar.uthmani text (fetched after search)
  loading: boolean;  // still fetching arabic?
}

const BOOKMARKS_KEY = 'quran_bookmarks_v2';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeShareText(result: EnrichedResult, lang: SearchLang): string {
  const surahInfo = SURAHS.find(s => s.id === result.surah.number);
  const ref = `${result.surah.englishName} (${result.surah.name}) ${result.surah.number}:${result.numberInSurah}`;
  const meaning = surahInfo?.meaning ?? result.surah.englishNameTranslation;
  const divider = '─────────────────────';

  const lines = [
    `🌙 ${divider} 🌙`,
    '',
    result.arabic || result.surah.name,
    '',
    lang.id !== 'ar' ? result.text : '',
    lang.id !== 'ar' ? '' : '',
    `📖 ${ref}`,
    `   "${meaning}"`,
    '',
    divider,
    '✨ Deen o Dunya — Holy Quran',
  ].filter((l, i, arr) => !(l === '' && arr[i - 1] === ''));

  return lines.join('\n');
}

function highlight(text: string, query: string, highlightColor: string): React.ReactNode {
  if (!query.trim() || !text) return <Text>{text}</Text>;
  const lower = text.toLowerCase();
  const lowerQ = query.trim().toLowerCase();
  const idx = lower.indexOf(lowerQ);
  if (idx < 0) return <Text>{text}</Text>;
  return (
    <Text>
      <Text>{text.slice(0, idx)}</Text>
      <Text style={{ backgroundColor: highlightColor + '44', color: highlightColor, fontWeight: '700' }}>
        {text.slice(idx, idx + query.trim().length)}
      </Text>
      <Text>{text.slice(idx + query.trim().length)}</Text>
    </Text>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function QuranSearchScreen() {
  const colors = useColors();
  const [query, setQuery] = useState('');
  const [lang, setLang] = useState<SearchLang>(SEARCH_LANGS[0]);
  const [results, setResults] = useState<EnrichedResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedKeys, setBookmarkedKeys] = useState<Set<string>>(new Set());
  const inputRef = useRef<TextInput>(null);
  const abortRef = useRef<AbortController | null>(null);

  // ── Search ──────────────────────────────────────────────────────────────────
  const doSearch = useCallback(async (q: string, searchLang: SearchLang) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    Keyboard.dismiss();

    // Cancel any in-flight request
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    setError(null);
    setSearched(true);
    setResults([]);

    try {
      const url = `https://api.alquran.cloud/v1/search/${encodeURIComponent(trimmed)}/all/${searchLang.edition}`;
      const res = await fetch(url, { signal: ctrl.signal });
      const data = await res.json();

      if (ctrl.signal.aborted) return;

      if (data.code !== 200 || !data.data?.matches) {
        setResults([]);
        setLoading(false);
        return;
      }

      const raw: RawMatch[] = data.data.matches.slice(0, 50); // cap at 50

      // Build enriched results with placeholder arabic
      const enriched: EnrichedResult[] = raw.map(r => ({
        ...r,
        arabic: searchLang.id === 'ar' ? r.text : '',  // if searching Arabic, we already have it
        loading: searchLang.id !== 'ar',
      }));
      setResults(enriched);
      setLoading(false);

      // If not searching Arabic, fetch Arabic text in parallel for each ayah
      if (searchLang.id !== 'ar') {
        const fetches = raw.map(async r => {
          try {
            const ref = `${r.surah.number}:${r.numberInSurah}`;
            const ar = await fetch(
              `https://api.alquran.cloud/v1/ayah/${ref}/ar.uthmani`,
              { signal: ctrl.signal }
            );
            const arData = await ar.json();
            return { number: r.number, arabic: arData.data?.text ?? '' };
          } catch {
            return { number: r.number, arabic: '' };
          }
        });

        // Update each result as Arabic text arrives
        const resolved = await Promise.all(fetches);
        if (ctrl.signal.aborted) return;
        const arabicMap = new Map(resolved.map(r => [r.number, r.arabic]));
        setResults(prev =>
          prev.map(r => ({
            ...r,
            arabic: arabicMap.get(r.number) ?? r.arabic,
            loading: false,
          }))
        );
      }
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') return;
      setError('Search failed. Please check your internet connection.');
      setLoading(false);
    }
  }, []);

  const handleSearch = () => doSearch(query, lang);

  const handleLangChange = (newLang: SearchLang) => {
    setLang(newLang);
    // Re-search if already searched
    if (searched && query.trim()) doSearch(query, newLang);
  };

  // ── Bookmark ────────────────────────────────────────────────────────────────
  const handleBookmark = useCallback(async (item: EnrichedResult) => {
    const key = `${item.surah.number}:${item.numberInSurah}`;
    try {
      const raw = await AsyncStorage.getItem(BOOKMARKS_KEY);
      let list: {
        surah: number; ayah: number; surahName: string; surahNameEnglish: string;
        arabicText: string; translation: string; savedAt: string;
      }[] = raw ? JSON.parse(raw) : [];

      const existsIdx = list.findIndex(
        b => b.surah === item.surah.number && b.ayah === item.numberInSurah
      );

      if (existsIdx >= 0) {
        list.splice(existsIdx, 1);
      } else {
        list.push({
          surah: item.surah.number,
          ayah: item.numberInSurah,
          surahName: item.surah.name,
          surahNameEnglish: item.surah.englishName,
          arabicText: item.arabic || '',
          translation: item.text,
          savedAt: new Date().toISOString(),
        });
      }
      // Persist first, then update UI — prevents inconsistency on storage failure
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
      setBookmarkedKeys(new Set(list.map(b => `${b.surah}:${b.ayah}`)));
    } catch {
      Alert.alert('Error', 'Could not save bookmark.');
    }
  }, []);

  // Load saved bookmarks on mount; abort in-flight requests on unmount
  React.useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(BOOKMARKS_KEY).then(raw => {
      if (!alive || !raw) return;
      try {
        const list: { surah: number; ayah: number }[] = JSON.parse(raw);
        setBookmarkedKeys(new Set(list.map(b => `${b.surah}:${b.ayah}`)));
      } catch { /* ignore */ }
    });
    return () => {
      alive = false;
      abortRef.current?.abort();
    };
  }, []);

  // ── Share / Poster ──────────────────────────────────────────────────────────
  const handleShare = useCallback(async (item: EnrichedResult) => {
    const text = makeShareText(item, lang);
    try {
      await Share.share({ message: text });
    } catch { /* user cancelled */ }
  }, [lang]);

  // ── Render ──────────────────────────────────────────────────────────────────
  const renderResult = useCallback(({ item }: { item: EnrichedResult }) => {
    const bKey = `${item.surah.number}:${item.numberInSurah}`;
    const isBookmarked = bookmarkedKeys.has(bKey);
    const isArabicSearch = lang.id === 'ar';

    return (
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        {/* Header row: reference + actions */}
        <View style={styles.cardHeader}>
          <TouchableOpacity
            style={[styles.refPill, { backgroundColor: colors.primary + '22' }]}
            onPress={() => router.push(`/quran/${item.surah.number}` as any)}
            activeOpacity={0.75}
          >
            <Text style={[styles.refText, { color: colors.primary }]}>
              {item.surah.englishName}  {item.surah.number}:{item.numberInSurah}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.surahArabicSmall, { color: colors.gold }]}>
            {item.surah.name}
          </Text>

          <View style={styles.cardActions}>
            <TouchableOpacity onPress={() => handleBookmark(item)} style={styles.actionBtn}>
              <Feather
                name={isBookmarked ? 'bookmark' : 'bookmark'}
                size={16}
                color={isBookmarked ? colors.gold : colors.mutedForeground}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleShare(item)} style={styles.actionBtn}>
              <Feather name="share-2" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.openBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push(`/quran/${item.surah.number}` as any)}
            >
              <Feather name="book-open" size={13} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Arabic text — always shown */}
        {item.loading ? (
          <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 6 }} />
        ) : item.arabic ? (
          <Text style={[styles.arabicText, { color: colors.foreground }]}>
            {isArabicSearch
              ? highlight(item.arabic, query, colors.gold)
              : item.arabic}
          </Text>
        ) : null}

        {/* Divider between Arabic and translation */}
        {item.arabic && !isArabicSearch && (
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        )}

        {/* Translation / matched text */}
        {!isArabicSearch && (
          <Text style={[styles.translationText, { color: colors.mutedForeground }]} numberOfLines={5}>
            {highlight(item.text, query, colors.gold)}
          </Text>
        )}

        {/* Meaning subtitle */}
        <Text style={[styles.surahMeaning, { color: colors.mutedForeground }]}>
          {item.surah.englishNameTranslation}
        </Text>
      </View>
    );
  }, [bookmarkedKeys, lang, colors, query, handleBookmark, handleShare]);

  // ── Empty / loading / error states ──────────────────────────────────────────

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.stateTitle, { color: colors.mutedForeground }]}>
            Searching Quran…
          </Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.center}>
          <Feather name="wifi-off" size={48} color={colors.mutedForeground} />
          <Text style={[styles.stateTitle, { color: colors.foreground }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.retryBtn, { backgroundColor: colors.primary }]}
            onPress={handleSearch}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (searched && results.length === 0) {
      return (
        <View style={styles.center}>
          <Text style={{ fontSize: 48 }}>📭</Text>
          <Text style={[styles.stateTitle, { color: colors.foreground }]}>No results found</Text>
          <Text style={[styles.stateSub, { color: colors.mutedForeground }]}>
            Try a different keyword or switch language
          </Text>
        </View>
      );
    }
    if (!searched) {
      return (
        <View style={styles.center}>
          <Text style={{ fontSize: 56 }}>🔍</Text>
          <Text style={[styles.stateTitle, { color: colors.foreground }]}>Search the Quran</Text>
          <Text style={[styles.stateSub, { color: colors.mutedForeground }]}>
            Search all 6,236 verses by keyword{'\n'}in English, Urdu or Arabic
          </Text>
          <View style={styles.tipGrid}>
            {['mercy', 'prayer', 'paradise', 'رحمة', 'صلاة', 'رحم'].map(tip => (
              <TouchableOpacity
                key={tip}
                style={[styles.tipChip, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => {
                  setQuery(tip);
                  setTimeout(() => doSearch(tip, lang), 50);
                }}
              >
                <Text style={[styles.tipText, { color: colors.primary }]}>{tip}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

      {/* ── Search bar ── */}
      <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Feather name="search" size={18} color={colors.primary} />
        <TextInput
          ref={inputRef}
          style={[styles.searchInput, { color: colors.foreground }]}
          placeholder="Search Quran by keyword…"
          placeholderTextColor={colors.mutedForeground}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          autoFocus
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => {
            setQuery('');
            setResults([]);
            setSearched(false);
            setError(null);
            inputRef.current?.focus();
          }}>
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Language + Search button row ── */}
      <View style={styles.controlRow}>
        <View style={[styles.langPills, { backgroundColor: colors.surfaceAlt }]}>
          {SEARCH_LANGS.map(l => {
            const active = l.id === lang.id;
            return (
              <TouchableOpacity
                key={l.id}
                style={[styles.langBtn, active && { backgroundColor: colors.primary }]}
                onPress={() => handleLangChange(l)}
              >
                <Text style={[styles.langText, { color: active ? '#fff' : colors.mutedForeground }]}>
                  {l.labelNative}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[
            styles.searchBtn,
            { backgroundColor: query.trim() ? colors.primary : colors.surfaceAlt },
          ]}
          onPress={handleSearch}
          disabled={!query.trim()}
        >
          <Feather name="search" size={16} color={query.trim() ? '#fff' : colors.mutedForeground} />
          <Text style={[styles.searchBtnText, { color: query.trim() ? '#fff' : colors.mutedForeground }]}>
            Search
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Results ── */}
      <FlatList
        data={results}
        keyExtractor={r => `${r.surah.number}:${r.numberInSurah}`}
        renderItem={renderResult}
        contentContainerStyle={results.length > 0 ? styles.list : styles.emptyList}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          results.length > 0 ? (
            <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
              {results.length === 50 ? ' (showing top 50)' : ''}
            </Text>
          ) : null
        }
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={() => <View style={{ height: 120 }} />}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Search bar
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginTop: 12, marginBottom: 8,
    borderRadius: 14, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 12,
  },
  searchInput: { flex: 1, fontSize: 16 },

  // Controls
  controlRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, marginBottom: 12,
  },
  langPills: {
    flexDirection: 'row', borderRadius: 22, overflow: 'hidden', flex: 1,
  },
  langBtn: {
    flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 22,
  },
  langText: { fontSize: 13, fontWeight: '600' },
  searchBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 22,
  },
  searchBtnText: { fontSize: 13, fontWeight: '700' },

  // List
  list: { paddingHorizontal: 16 },
  emptyList: { flex: 1 },
  resultCount: { fontSize: 12, fontWeight: '600', marginBottom: 10 },

  // Card
  card: { borderRadius: 16, padding: 14 },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, marginBottom: 10, flexWrap: 'wrap',
  },
  refPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  refText: { fontSize: 12, fontWeight: '700' },
  surahArabicSmall: { fontSize: 14, fontWeight: '700', flex: 1 },
  cardActions: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  actionBtn: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
  },
  openBtn: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  arabicText: {
    fontSize: 20, textAlign: 'right', lineHeight: 36,
    fontWeight: '500', marginBottom: 8,
  },
  divider: { height: 1, marginBottom: 8 },
  translationText: { fontSize: 14, lineHeight: 22, marginBottom: 4 },
  surahMeaning: { fontSize: 11, marginTop: 4 },

  // Empty / loading states
  center: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 32, gap: 12,
  },
  stateTitle: { fontSize: 17, fontWeight: '700', textAlign: 'center' },
  stateSub: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20, marginTop: 4 },
  tipGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
    justifyContent: 'center', marginTop: 8,
  },
  tipChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1,
  },
  tipText: { fontSize: 14, fontWeight: '600' },
});
