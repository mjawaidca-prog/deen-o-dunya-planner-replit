import React, { useMemo, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { LOCAL_HADITHS, HADITH_BOOKS } from '@/constants/hadithBooks';

export default function HadithBookScreen() {
  const { book } = useLocalSearchParams<{ book: string }>();
  const colors = useColors();
  const { language } = useLanguage();
  const [selected, setSelected] = useState<(typeof LOCAL_HADITHS)[0] | null>(null);

  const bookInfo = HADITH_BOOKS.find(b => b.id === book);
  const hadiths = useMemo(() => LOCAL_HADITHS.filter(h => h.bookId === book), [book]);

  const gradeColor = (grade: string) => {
    if (grade === 'sahih') return '#2D9B6B';
    if (grade === 'hasan') return '#C9A84C';
    return '#8BA3B8';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Book header */}
      <View style={[styles.bookHeader, { backgroundColor: colors.card }]}>
        <Text style={[styles.bookArabic, { color: colors.gold }]}>{bookInfo?.arabicName}</Text>
        <Text style={[styles.bookName, { color: colors.foreground }]}>{bookInfo?.name}</Text>
        <Text style={[styles.bookAuthor, { color: colors.mutedForeground }]}>by {bookInfo?.author} · {hadiths.length} hadiths</Text>
      </View>

      {hadiths.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📚</Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            Full hadith collection coming soon.\nCurrently showing curated hadiths only.
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
              <View style={styles.cardHeader}>
                <View style={[styles.numBadge, { backgroundColor: colors.surfaceAlt }]}>
                  <Text style={[styles.numText, { color: colors.mutedForeground }]}>#{index + 1}</Text>
                </View>
                <View style={[styles.gradeBadge, { backgroundColor: gradeColor(item.grade) + '22' }]}>
                  <Text style={[styles.gradeText, { color: gradeColor(item.grade) }]}>
                    {item.grade.charAt(0).toUpperCase() + item.grade.slice(1)}
                  </Text>
                </View>
              </View>
              <Text style={[styles.arabicText, { color: colors.foreground }]} numberOfLines={3}>{item.arabic}</Text>
              <Text style={[styles.engText, { color: colors.mutedForeground }]} numberOfLines={3}>{item.english}</Text>
              <Text style={[styles.narrator, { color: colors.gold }]}>{item.narrator}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListFooterComponent={() => <View style={{ height: 100 }} />}
        />
      )}

      {/* Detail Modal */}
      <Modal visible={!!selected} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelected(null)}>
        <SafeAreaView style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Hadith Detail</Text>
            <TouchableOpacity onPress={() => setSelected(null)}>
              <Feather name="x" size={22} color={colors.foreground} />
            </TouchableOpacity>
          </View>
          {selected && (
            <View style={styles.modalContent}>
              <View style={[styles.gradeBadge, { backgroundColor: gradeColor(selected.grade) + '22', alignSelf: 'flex-start', marginBottom: 16 }]}>
                <Text style={[styles.gradeText, { color: gradeColor(selected.grade) }]}>
                  {selected.grade.charAt(0).toUpperCase() + selected.grade.slice(1)}
                </Text>
              </View>
              <Text style={[styles.detailArabic, { color: colors.foreground }]}>{selected.arabic}</Text>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Text style={[styles.detailEng, { color: colors.foreground }]}>{selected.english}</Text>
              {language === 'ur' && selected.urdu && (
                <>
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  <Text style={[styles.detailUrdu, { color: colors.foreground }]}>{selected.urdu}</Text>
                </>
              )}
              <View style={[styles.refRow, { borderTopColor: colors.border }]}>
                <Text style={[styles.refLabel, { color: colors.mutedForeground }]}>Narrator:</Text>
                <Text style={[styles.refVal, { color: colors.gold }]}>{selected.narrator}</Text>
              </View>
              {selected.chapter && (
                <View style={styles.refRow}>
                  <Text style={[styles.refLabel, { color: colors.mutedForeground }]}>Chapter:</Text>
                  <Text style={[styles.refVal, { color: colors.mutedForeground }]}>{selected.chapter}</Text>
                </View>
              )}
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bookHeader: { padding: 20, alignItems: 'center', gap: 4 },
  bookArabic: { fontSize: 22, fontWeight: '700' },
  bookName: { fontSize: 16, fontWeight: '600' },
  bookAuthor: { fontSize: 13 },
  list: { paddingHorizontal: 16, paddingTop: 12 },
  card: { borderRadius: 14, padding: 14 },
  cardHeader: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  numBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  numText: { fontSize: 12, fontWeight: '600' },
  gradeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  gradeText: { fontSize: 12, fontWeight: '600' },
  arabicText: { fontSize: 16, textAlign: 'right', lineHeight: 28, marginBottom: 8 },
  engText: { fontSize: 14, lineHeight: 22, marginBottom: 6 },
  narrator: { fontSize: 12, fontWeight: '500' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 15, textAlign: 'center', lineHeight: 24 },
  modal: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  modalTitle: { fontSize: 17, fontWeight: '700' },
  modalContent: { padding: 20 },
  detailArabic: { fontSize: 20, textAlign: 'right', lineHeight: 36, marginBottom: 16 },
  divider: { height: 1, marginBottom: 16 },
  detailEng: { fontSize: 15, lineHeight: 24, marginBottom: 16 },
  detailUrdu: { fontSize: 15, textAlign: 'right', lineHeight: 28, marginBottom: 16 },
  refRow: { flexDirection: 'row', gap: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'transparent' },
  refLabel: { fontSize: 13 },
  refVal: { fontSize: 13, fontWeight: '500', flex: 1 },
});
