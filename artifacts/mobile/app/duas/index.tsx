import React, { useMemo, useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { DUAS, DUA_CATEGORIES, Dua } from '@/constants/duasData';

export default function DuasScreen() {
  const colors = useColors();
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selected, setSelected] = useState<Dua | null>(null);

  const filteredDuas = useMemo(() =>
    activeCategory === 'all' ? DUAS : DUAS.filter(d => d.category === activeCategory),
    [activeCategory],
  );

  const allCategories = ['all', ...DUA_CATEGORIES];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Category tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs} contentContainerStyle={styles.tabsContent}>
        {allCategories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, { backgroundColor: activeCategory === cat ? colors.primary : colors.card }]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.tabText, { color: activeCategory === cat ? '#fff' : colors.mutedForeground }]}>
              {cat === 'all' ? 'All' : cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredDuas}
        keyExtractor={d => d.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.duaCard, { backgroundColor: colors.card }]}
            onPress={() => setSelected(item)}
            activeOpacity={0.8}
          >
            <View style={[styles.catBadge, { backgroundColor: colors.surfaceAlt }]}>
              <Text style={[styles.catText, { color: colors.mutedForeground }]}>{item.category}</Text>
            </View>
            <Text style={[styles.duaTitle, { color: colors.foreground }]}>{item.title}</Text>
            <Text style={[styles.duaArabic, { color: colors.gold }]} numberOfLines={2}>{item.arabic}</Text>
            <Text style={[styles.duaEng, { color: colors.mutedForeground }]} numberOfLines={2}>{item.english}</Text>
            {item.reference && (
              <Text style={[styles.duaRef, { color: colors.mutedForeground }]}>{item.reference}</Text>
            )}
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No duas in this category</Text>
          </View>
        )}
        ListFooterComponent={() => <View style={{ height: 100 }} />}
      />

      {/* Detail Modal */}
      <Modal visible={!!selected} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelected(null)}>
        <SafeAreaView style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>{selected?.title}</Text>
            <TouchableOpacity onPress={() => setSelected(null)}>
              <Feather name="x" size={22} color={colors.foreground} />
            </TouchableOpacity>
          </View>
          {selected && (
            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={[styles.arabicBox, { backgroundColor: colors.card }]}>
                <Text style={[styles.modalArabic, { color: colors.gold }]}>{selected.arabic}</Text>
              </View>
              <View style={[styles.translitBox, { borderColor: colors.border }]}>
                <Text style={[styles.modalTranslit, { color: colors.mutedForeground }]}>{selected.transliteration}</Text>
              </View>
              <Text style={[styles.modalEng, { color: colors.foreground }]}>{selected.english}</Text>
              {language === 'ur' && selected.urdu && (
                <Text style={[styles.modalUrdu, { color: colors.foreground }]}>{selected.urdu}</Text>
              )}
              {selected.reference && (
                <Text style={[styles.modalRef, { color: colors.gold }]}>— {selected.reference}</Text>
              )}
              <View style={{ height: 40 }} />
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabs: { maxHeight: 48 },
  tabsContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  tabText: { fontSize: 13, fontWeight: '500' },
  list: { paddingHorizontal: 16, paddingTop: 8 },
  duaCard: { borderRadius: 14, padding: 14 },
  catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 6 },
  catText: { fontSize: 11, fontWeight: '500' },
  duaTitle: { fontSize: 15, fontWeight: '700', marginBottom: 6 },
  duaArabic: { fontSize: 16, textAlign: 'right', lineHeight: 28, marginBottom: 6 },
  duaEng: { fontSize: 13, lineHeight: 20, marginBottom: 6 },
  duaRef: { fontSize: 11 },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 15 },
  modal: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  modalTitle: { fontSize: 17, fontWeight: '700', flex: 1 },
  modalContent: { padding: 20, gap: 16 },
  arabicBox: { borderRadius: 14, padding: 20 },
  modalArabic: { fontSize: 22, textAlign: 'right', lineHeight: 38 },
  translitBox: { borderTopWidth: 1, borderBottomWidth: 1, paddingVertical: 12 },
  modalTranslit: { fontSize: 15, lineHeight: 24, fontStyle: 'italic' },
  modalEng: { fontSize: 16, lineHeight: 26 },
  modalUrdu: { fontSize: 16, textAlign: 'right', lineHeight: 28 },
  modalRef: { fontSize: 13, fontWeight: '500' },
});
