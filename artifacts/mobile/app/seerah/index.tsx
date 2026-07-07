import React, { useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { SEERAH_STORIES, SeerahStory } from '@/constants/seerahData';

const CATEGORY_ICONS: Record<string, string> = {
  Seerah: '🌙',
  Companions: '⭐',
  Miracles: '✨',
  Character: '💎',
  Prophets: '📜',
};

export default function SeerahScreen() {
  const colors = useColors();
  const [selected, setSelected] = useState<SeerahStory | null>(null);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={SEERAH_STORIES}
        keyExtractor={s => s.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.listHeader}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>Islamic Stories</Text>
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>{SEERAH_STORIES.length} stories</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.storyCard, { backgroundColor: colors.card }]}
            onPress={() => setSelected(item)}
            activeOpacity={0.8}
          >
            <View style={[styles.catBadge, { backgroundColor: colors.surfaceAlt }]}>
              <Text style={[styles.catText, { color: colors.mutedForeground }]}>
                {CATEGORY_ICONS[item.category] ?? '📖'} {item.category}
              </Text>
            </View>
            <Text style={[styles.storyTitle, { color: colors.foreground }]}>{item.title}</Text>
            {item.arabicTitle && <Text style={[styles.storyArabicTitle, { color: colors.gold }]}>{item.arabicTitle}</Text>}
            <Text style={[styles.storyPreview, { color: colors.mutedForeground }]} numberOfLines={3}>{item.content}</Text>
            <View style={styles.storyFooter}>
              <Text style={[styles.storyRef, { color: colors.mutedForeground }]}>{item.reference}</Text>
              <View style={styles.readMore}>
                <Text style={[styles.readMoreText, { color: colors.primary }]}>Read more</Text>
                <Feather name="chevron-right" size={14} color={colors.primary} />
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={() => <View style={{ height: 100 }} />}
      />

      {/* Story Detail Modal */}
      <Modal visible={!!selected} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelected(null)}>
        <SafeAreaView style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              {selected && (
                <View style={[styles.catBadge, { backgroundColor: colors.surfaceAlt, alignSelf: 'flex-start', marginBottom: 4 }]}>
                  <Text style={[styles.catText, { color: colors.mutedForeground }]}>
                    {CATEGORY_ICONS[selected.category] ?? '📖'} {selected.category}
                  </Text>
                </View>
              )}
              <Text style={[styles.modalTitle, { color: colors.foreground }]} numberOfLines={2}>{selected?.title}</Text>
            </View>
            <TouchableOpacity onPress={() => setSelected(null)}>
              <Feather name="x" size={22} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {selected && (
            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              {selected.arabicTitle && (
                <Text style={[styles.modalArabicTitle, { color: colors.gold }]}>{selected.arabicTitle}</Text>
              )}
              <Text style={[styles.modalBody, { color: colors.foreground }]}>{selected.content}</Text>

              {selected.moral && (
                <View style={[styles.moralBox, { backgroundColor: colors.card, borderLeftColor: colors.gold }]}>
                  <Text style={[styles.moralTitle, { color: colors.gold }]}>💡 Lesson & Moral</Text>
                  <Text style={[styles.moralText, { color: colors.mutedForeground }]}>{selected.moral}</Text>
                </View>
              )}

              <Text style={[styles.modalRef, { color: colors.mutedForeground }]}>
                Reference: {selected.reference}
              </Text>

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
  list: { paddingHorizontal: 16, paddingTop: 8 },
  listHeader: { marginBottom: 16 },
  headerTitle: { fontSize: 26, fontWeight: '700' },
  headerSub: { fontSize: 13, marginTop: 4 },
  storyCard: { borderRadius: 16, padding: 16, gap: 6 },
  catBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  catText: { fontSize: 12, fontWeight: '500' },
  storyTitle: { fontSize: 17, fontWeight: '700', lineHeight: 24 },
  storyArabicTitle: { fontSize: 14, fontWeight: '600' },
  storyPreview: { fontSize: 14, lineHeight: 22 },
  storyFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  storyRef: { fontSize: 11 },
  readMore: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  readMoreText: { fontSize: 13, fontWeight: '600' },
  modal: { flex: 1 },
  modalHeader: { flexDirection: 'row', alignItems: 'flex-start', padding: 20, gap: 12, borderBottomWidth: 1 },
  modalTitle: { fontSize: 20, fontWeight: '700', lineHeight: 28 },
  modalContent: { padding: 20, gap: 16 },
  modalArabicTitle: { fontSize: 20, fontWeight: '600', textAlign: 'right' },
  modalBody: { fontSize: 16, lineHeight: 28 },
  moralBox: { borderLeftWidth: 4, borderRadius: 12, padding: 16, gap: 8 },
  moralTitle: { fontSize: 15, fontWeight: '700' },
  moralText: { fontSize: 15, lineHeight: 24 },
  modalRef: { fontSize: 13, fontStyle: 'italic' },
});
