import React, { useMemo, useState } from 'react';
import {
  FlatList, Modal, ScrollView, Share, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { LOCAL_HADITHS, HADITH_BOOKS } from '@/constants/hadithBooks';

type Grade = 'all' | 'sahih' | 'hasan' | 'daif';
const GRADE_FILTERS: Grade[] = ['all', 'sahih', 'hasan', 'daif'];

export default function HadithBookScreen() {
  const { book } = useLocalSearchParams<{ book: string }>();
  const colors = useColors();
  const { language } = useLanguage();
  const [selected, setSelected] = useState<(typeof LOCAL_HADITHS)[0] | null>(null);
  const [query, setQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<Grade>('all');
  const [showUrdu, setShowUrdu] = useState(language === 'ur');

  const bookInfo = HADITH_BOOKS.find(b => b.id === book);

  const hadiths = useMemo(() => {
    let list = LOCAL_HADITHS.filter(h => h.bookId === book);
    if (gradeFilter !== 'all') list = list.filter(h => h.grade === gradeFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(h =>
        h.english.toLowerCase().includes(q) ||
        h.arabic.includes(q) ||
        h.narrator.toLowerCase().includes(q) ||
        (h.chapter?.toLowerCase().includes(q) ?? false),
      );
    }
    return list;
  }, [book, query, gradeFilter]);

  const gradeColor = (grade: string) => {
    if (grade === 'sahih') return '#2D9B6B';
    if (grade === 'hasan') return '#C9A84C';
    if (grade === 'daif') return '#8B5CF6';
    return '#8BA3B8';
  };

  const handleShare = (h: typeof LOCAL_HADITHS[0]) => {
    Share.share({
      message: `${h.arabic}\n\n${h.english}\n\n— ${bookInfo?.name}, ${h.narrator}${h.chapter ? ` · ${h.chapter}` : ''}`,
    });
  };

  const chapterGroups = useMemo(() => {
    const chapters = new Set(hadiths.map(h => h.chapter ?? 'General'));
    return Array.from(chapters);
  }, [hadiths]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>

      {/* Book header */}
      <View style={[styles.bookHeader, { backgroundColor: colors.card }]}>
        <View style={[styles.headerDot, { backgroundColor: bookInfo?.color ?? colors.primary }]} />
        <Text style={[styles.bookArabic, { color: colors.gold }]}>{bookInfo?.arabicName}</Text>
        <Text style={[styles.bookName, { color: colors.foreground }]}>{bookInfo?.name}</Text>
        <Text style={[styles.bookAuthor, { color: colors.mutedForeground }]}>
          {bookInfo?.author} · {bookInfo?.total.toLocaleString()} total hadiths
        </Text>
        <Text style={[styles.bookDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
          {bookInfo?.description}
        </Text>
      </View>

      {/* Search */}
      <View style={[styles.searchRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Feather name="search" size={15} color={colors.mutedForeground} />
        <TextInput
          style={[styles.searchInput, { color: colors.foreground }]}
          placeholder="Search by keyword, narrator, chapter…"
          placeholderTextColor={colors.mutedForeground}
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Feather name="x" size={15} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {GRADE_FILTERS.map(g => (
          <TouchableOpacity
            key={g}
            style={[
              styles.filterPill,
              {
                backgroundColor: gradeFilter === g
                  ? (g === 'all' ? colors.primary : gradeColor(g))
                  : colors.surfaceAlt,
              },
            ]}
            onPress={() => setGradeFilter(g)}
          >
            <Text style={[styles.filterText, { color: gradeFilter === g ? '#fff' : colors.mutedForeground }]}>
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
        <Text style={[styles.countLabel, { color: colors.mutedForeground }]}>
          {hadiths.length} hadith{hadiths.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {hadiths.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 44 }}>📭</Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            {query ? `No results for "${query}"` : 'No hadiths match this filter'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={hadiths}
          keyExtractor={h => h.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: colors.card }]}
              onPress={() => setSelected(item)}
              activeOpacity={0.8}
            >
              {/* Card header */}
              <View style={styles.cardHeader}>
                <View style={[styles.numBadge, { backgroundColor: colors.surfaceAlt }]}>
                  <Text style={[styles.numText, { color: colors.mutedForeground }]}>No. {item.number}</Text>
                </View>
                <View style={[styles.gradeBadge, { backgroundColor: gradeColor(item.grade) + '22' }]}>
                  <Text style={[styles.gradeText, { color: gradeColor(item.grade) }]}>
                    {item.grade.charAt(0).toUpperCase() + item.grade.slice(1)}
                  </Text>
                </View>
                {item.chapter && (
                  <View style={[styles.chapterBadge, { backgroundColor: colors.surfaceAlt }]}>
                    <Text style={[styles.chapterText, { color: colors.mutedForeground }]} numberOfLines={1}>
                      {item.chapter}
                    </Text>
                  </View>
                )}
                <TouchableOpacity onPress={() => handleShare(item)} style={styles.shareBtn}>
                  <Feather name="share-2" size={14} color={colors.mutedForeground} />
                </TouchableOpacity>
              </View>

              {/* Arabic */}
              <Text style={[styles.arabicText, { color: colors.foreground }]} numberOfLines={3}>
                {item.arabic}
              </Text>

              {/* English */}
              <Text style={[styles.engText, { color: colors.mutedForeground }]} numberOfLines={3}>
                {item.english}
              </Text>

              {/* Narrator */}
              <Text style={[styles.narrator, { color: colors.gold }]}>
                — {item.narrator}
              </Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListFooterComponent={() => <View style={{ height: 100 }} />}
        />
      )}

      {/* ─── Detail Modal ─── */}
      <Modal visible={!!selected} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelected(null)}>
        <SafeAreaView style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                {bookInfo?.name}
              </Text>
              {selected?.chapter && (
                <Text style={[styles.modalSub, { color: colors.mutedForeground }]}>
                  {selected.chapter} · No. {selected?.number}
                </Text>
              )}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setShowUrdu(v => !v)}
                style={[styles.urduToggle, { backgroundColor: showUrdu ? colors.primary + '22' : colors.surfaceAlt }]}
              >
                <Text style={[styles.urduToggleText, { color: showUrdu ? colors.primary : colors.mutedForeground }]}>اردو</Text>
              </TouchableOpacity>
              {selected && (
                <TouchableOpacity onPress={() => handleShare(selected)} style={styles.modalShareBtn}>
                  <Feather name="share-2" size={18} color={colors.mutedForeground} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setSelected(null)}>
                <Feather name="x" size={22} color={colors.foreground} />
              </TouchableOpacity>
            </View>
          </View>

          {selected && (
            <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalContent}>
              {/* Grade + Narrator */}
              <View style={styles.modalMeta}>
                <View style={[styles.gradeBadge, { backgroundColor: gradeColor(selected.grade) + '22' }]}>
                  <Text style={[styles.gradeText, { color: gradeColor(selected.grade) }]}>
                    {selected.grade.charAt(0).toUpperCase() + selected.grade.slice(1)}
                  </Text>
                </View>
                <Text style={[styles.modalNarrator, { color: colors.gold }]}>
                  {selected.narrator}
                </Text>
              </View>

              {/* Arabic */}
              <View style={[styles.arabicBox, { backgroundColor: colors.card }]}>
                <Text style={[styles.detailArabic, { color: colors.foreground }]}>
                  {selected.arabic}
                </Text>
              </View>

              {/* English */}
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Text style={[styles.detailEng, { color: colors.foreground }]}>
                {selected.english}
              </Text>

              {/* Urdu toggle */}
              {showUrdu && selected.urdu && (
                <>
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  <View style={[styles.urduBox, { backgroundColor: colors.card }]}>
                    <Text style={[styles.detailUrdu, { color: colors.foreground }]}>
                      {selected.urdu}
                    </Text>
                  </View>
                </>
              )}

              {/* References */}
              <View style={[styles.refCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
                <View style={styles.refRow}>
                  <Text style={[styles.refLabel, { color: colors.mutedForeground }]}>📖  Book</Text>
                  <Text style={[styles.refVal, { color: colors.foreground }]}>{bookInfo?.name}</Text>
                </View>
                <View style={styles.refRow}>
                  <Text style={[styles.refLabel, { color: colors.mutedForeground }]}>🔢  Number</Text>
                  <Text style={[styles.refVal, { color: colors.foreground }]}>{selected.number}</Text>
                </View>
                <View style={styles.refRow}>
                  <Text style={[styles.refLabel, { color: colors.mutedForeground }]}>👤  Narrator</Text>
                  <Text style={[styles.refVal, { color: colors.gold }]}>{selected.narrator}</Text>
                </View>
                {selected.chapter && (
                  <View style={styles.refRow}>
                    <Text style={[styles.refLabel, { color: colors.mutedForeground }]}>📑  Chapter</Text>
                    <Text style={[styles.refVal, { color: colors.foreground }]}>{selected.chapter}</Text>
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bookHeader: { alignItems: 'center', padding: 16, gap: 4 },
  headerDot: { width: 6, height: 6, borderRadius: 3, marginBottom: 4 },
  bookArabic: { fontSize: 20, fontWeight: '700' },
  bookName: { fontSize: 15, fontWeight: '600' },
  bookAuthor: { fontSize: 12 },
  bookDesc: { fontSize: 12, textAlign: 'center', marginTop: 4, paddingHorizontal: 16 },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginTop: 10, marginBottom: 6,
    borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 9,
  },
  searchInput: { flex: 1, fontSize: 14 },
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, marginBottom: 8, flexWrap: 'wrap' },
  filterPill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  filterText: { fontSize: 12, fontWeight: '600' },
  countLabel: { fontSize: 11, marginLeft: 'auto' },
  list: { paddingHorizontal: 16 },
  card: { borderRadius: 14, padding: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10, flexWrap: 'wrap' },
  numBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  numText: { fontSize: 11, fontWeight: '600' },
  gradeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  gradeText: { fontSize: 11, fontWeight: '700' },
  chapterBadge: { flex: 1, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  chapterText: { fontSize: 11 },
  shareBtn: { padding: 4, marginLeft: 'auto' },
  arabicText: { fontSize: 16, textAlign: 'right', lineHeight: 28, marginBottom: 8 },
  engText: { fontSize: 13, lineHeight: 21, marginBottom: 6 },
  narrator: { fontSize: 12, fontWeight: '500' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  emptyText: { fontSize: 14, textAlign: 'center' },

  // Modal
  modal: { flex: 1 },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 15, fontWeight: '700' },
  modalSub: { fontSize: 12, marginTop: 2 },
  modalActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  urduToggle: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  urduToggleText: { fontSize: 13, fontWeight: '700' },
  modalShareBtn: { padding: 2 },
  modalScroll: { flex: 1 },
  modalContent: { padding: 20, gap: 16 },
  modalMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modalNarrator: { fontSize: 13, fontWeight: '600', flex: 1 },
  arabicBox: { borderRadius: 14, padding: 16 },
  detailArabic: { fontSize: 20, textAlign: 'right', lineHeight: 36 },
  divider: { height: 1 },
  detailEng: { fontSize: 15, lineHeight: 25 },
  urduBox: { borderRadius: 14, padding: 16 },
  detailUrdu: { fontSize: 15, textAlign: 'right', lineHeight: 28 },
  refCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  refRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  refLabel: { fontSize: 12, width: 80 },
  refVal: { fontSize: 12, fontWeight: '600', flex: 1 },
});
