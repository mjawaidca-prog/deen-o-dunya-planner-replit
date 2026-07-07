import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert, FlatList, Share, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColors } from '@/hooks/useColors';

interface BookmarkedAyah {
  surah: number;
  ayah: number;
  surahName: string;
  surahNameEnglish: string;
  arabicText: string;
  translation: string;
  savedAt: string;
}

const BOOKMARKS_KEY = 'quran_bookmarks_v2';

export default function QuranBookmarksScreen() {
  const colors = useColors();
  const [bookmarks, setBookmarks] = useState<BookmarkedAyah[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(BOOKMARKS_KEY);
      if (raw) {
        const list: BookmarkedAyah[] = JSON.parse(raw);
        list.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
        setBookmarks(list);
      } else {
        setBookmarks([]);
      }
    } catch {
      setBookmarks([]);
    }
    setLoaded(true);
  }, []);

  useEffect(() => { load(); }, [load]);

  const removeBookmark = async (surah: number, ayah: number) => {
    Alert.alert('Remove Bookmark', 'Remove this ayah from bookmarks?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          const raw = await AsyncStorage.getItem(BOOKMARKS_KEY);
          let list: BookmarkedAyah[] = raw ? JSON.parse(raw) : [];
          list = list.filter(b => !(b.surah === surah && b.ayah === ayah));
          await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
          setBookmarks(prev => prev.filter(b => !(b.surah === surah && b.ayah === ayah)));
        },
      },
    ]);
  };

  const clearAll = () => {
    Alert.alert('Clear All Bookmarks', 'Remove all saved ayahs?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem(BOOKMARKS_KEY);
          setBookmarks([]);
        },
      },
    ]);
  };

  const shareAyah = (item: BookmarkedAyah) => {
    Share.share({
      message: `${item.arabicText}\n\n${item.translation}\n\n— Quran, ${item.surahNameEnglish} (${item.surahName}) ${item.surah}:${item.ayah}`,
    });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderItem = ({ item }: { item: BookmarkedAyah }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => router.push(`/quran/${item.surah}` as any)}
      activeOpacity={0.8}
    >
      {/* Header row */}
      <View style={styles.cardHeader}>
        <View style={[styles.refPill, { backgroundColor: colors.primary + '22' }]}>
          <Text style={[styles.refText, { color: colors.primary }]}>
            {item.surahNameEnglish} {item.surah}:{item.ayah}
          </Text>
        </View>
        <Text style={[styles.surahArabic, { color: colors.gold }]}>{item.surahName}</Text>
      </View>

      {/* Arabic */}
      <Text style={[styles.arabicText, { color: colors.foreground }]}>{item.arabicText}</Text>

      {/* Translation */}
      <Text style={[styles.translationText, { color: colors.mutedForeground }]} numberOfLines={3}>
        {item.translation}
      </Text>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <Text style={[styles.dateText, { color: colors.mutedForeground }]}>
          Saved {formatDate(item.savedAt)}
        </Text>
        <View style={styles.footerActions}>
          <TouchableOpacity onPress={() => shareAyah(item)} style={styles.footerBtn}>
            <Feather name="share-2" size={15} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeBookmark(item.surah, item.ayah)} style={styles.footerBtn}>
            <Feather name="trash-2" size={15} color={colors.destructive} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!loaded) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {bookmarks.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 60 }}>🔖</Text>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No bookmarks yet</Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            While reading a surah, tap the bookmark icon on any ayah to save it here.
          </Text>
          <TouchableOpacity
            style={[styles.browseBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.browseBtnText}>Browse Quran</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={b => `${b.surah}-${b.ayah}`}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View style={styles.listHeader}>
              <Text style={[styles.listTitle, { color: colors.foreground }]}>
                {bookmarks.length} Saved Ayah{bookmarks.length !== 1 ? 's' : ''}
              </Text>
              <TouchableOpacity onPress={clearAll}>
                <Text style={[styles.clearText, { color: colors.destructive }]}>Clear all</Text>
              </TouchableOpacity>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListFooterComponent={() => <View style={{ height: 100 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingHorizontal: 16, paddingTop: 8 },
  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  listTitle: { fontSize: 16, fontWeight: '700' },
  clearText: { fontSize: 13, fontWeight: '600' },
  card: { borderRadius: 16, padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  refPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  refText: { fontSize: 12, fontWeight: '700' },
  surahArabic: { fontSize: 15, fontWeight: '700' },
  arabicText: { fontSize: 20, textAlign: 'right', lineHeight: 36, marginBottom: 8 },
  translationText: { fontSize: 14, lineHeight: 21, marginBottom: 10 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateText: { fontSize: 11 },
  footerActions: { flexDirection: 'row', gap: 12 },
  footerBtn: { padding: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '700' },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  browseBtn: { paddingHorizontal: 28, paddingVertical: 12, borderRadius: 22, marginTop: 8 },
  browseBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
