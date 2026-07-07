import React, { useMemo, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { NAMES_OF_ALLAH, Name } from '@/constants/namesData';

export default function NamesScreen() {
  const colors = useColors();
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Name | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return NAMES_OF_ALLAH;
    const q = query.toLowerCase();
    return NAMES_OF_ALLAH.filter(n =>
      n.transliteration.toLowerCase().includes(q) ||
      n.meaning.toLowerCase().includes(q) ||
      n.arabic.includes(q),
    );
  }, [query]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.headerBanner, { backgroundColor: colors.card }]}>
        <Text style={[styles.headerTitle, { color: colors.gold }]}>أَسْمَاءُ اللَّهِ الْحُسْنَى</Text>
        <Text style={[styles.headerSub, { color: colors.foreground }]}>99 Beautiful Names of Allah</Text>
        <Text style={[styles.headerCount, { color: colors.mutedForeground }]}>{NAMES_OF_ALLAH.length} names</Text>
      </View>

      {/* Search */}
      <View style={[styles.searchRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          style={[styles.searchInput, { color: colors.foreground }]}
          placeholder="Search by name or meaning..."
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

      <FlatList
        data={filtered}
        keyExtractor={n => String(n.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={() => setSelected(item)}
            activeOpacity={0.8}
          >
            <View style={[styles.numBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.numText}>{item.id}</Text>
            </View>
            <Text style={[styles.arabic, { color: colors.gold }]}>{item.arabic}</Text>
            <Text style={[styles.transliteration, { color: colors.foreground }]}>{item.transliteration}</Text>
            <Text style={[styles.meaning, { color: colors.mutedForeground }]} numberOfLines={2}>{item.meaning}</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={() => <View style={{ height: 100 }} />}
      />

      {/* Detail Modal */}
      <Modal visible={!!selected} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelected(null)}>
        <SafeAreaView style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setSelected(null)}>
              <Feather name="x" size={22} color={colors.foreground} />
            </TouchableOpacity>
            {selected && (
              <View style={[styles.numBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.numText}>{selected.id}</Text>
              </View>
            )}
          </View>
          {selected && (
            <View style={styles.modalContent}>
              <Text style={[styles.detailArabic, { color: colors.gold }]}>{selected.arabic}</Text>
              <Text style={[styles.detailTranslit, { color: colors.foreground }]}>{selected.transliteration}</Text>
              <Text style={[styles.detailMeaning, { color: colors.foreground }]}>"{selected.meaning}"</Text>
              {language === 'ur' && selected.urduMeaning && (
                <Text style={[styles.detailUrdu, { color: colors.foreground }]}>"{selected.urduMeaning}"</Text>
              )}
              {selected.benefit && (
                <View style={[styles.benefitBox, { backgroundColor: colors.card, borderLeftColor: colors.gold }]}>
                  <Text style={[styles.benefitTitle, { color: colors.gold }]}>Benefit</Text>
                  <Text style={[styles.benefitText, { color: colors.mutedForeground }]}>{selected.benefit}</Text>
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
  headerBanner: { padding: 16, alignItems: 'center', gap: 4 },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  headerSub: { fontSize: 15, fontWeight: '600' },
  headerCount: { fontSize: 12 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, margin: 12, borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10 },
  searchInput: { flex: 1, fontSize: 15 },
  list: { paddingHorizontal: 12 },
  row: { gap: 8, marginBottom: 8 },
  card: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', gap: 4 },
  numBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  numText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  arabic: { fontSize: 22, fontWeight: '700' },
  transliteration: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  meaning: { fontSize: 11, textAlign: 'center', lineHeight: 16 },
  modal: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  modalContent: { padding: 24, alignItems: 'center', gap: 12 },
  detailArabic: { fontSize: 48, fontWeight: '700' },
  detailTranslit: { fontSize: 22, fontWeight: '600' },
  detailMeaning: { fontSize: 18, fontStyle: 'italic', textAlign: 'center' },
  detailUrdu: { fontSize: 18, textAlign: 'center' },
  benefitBox: { width: '100%', borderLeftWidth: 4, borderRadius: 12, padding: 16, marginTop: 8, gap: 6 },
  benefitTitle: { fontSize: 14, fontWeight: '700' },
  benefitText: { fontSize: 14, lineHeight: 22 },
});
