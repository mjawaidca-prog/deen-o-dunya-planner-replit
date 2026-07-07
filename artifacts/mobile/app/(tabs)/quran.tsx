import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { SURAHS } from '@/constants/quranData';

export default function QuranTab() {
  const colors = useColors();
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return SURAHS;
    const q = query.toLowerCase();
    return SURAHS.filter(s =>
      s.nameEnglish.toLowerCase().includes(q) ||
      s.name.includes(q) ||
      s.meaning.toLowerCase().includes(q) ||
      String(s.id).includes(q),
    );
  }, [query]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>القرآن الكريم</Text>
        <Text style={[styles.subtitle, { color: colors.gold }]}>The Holy Quran</Text>
      </View>

      {/* Search */}
      <View style={[styles.searchRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          style={[styles.searchInput, { color: colors.foreground }]}
          placeholder={t('search')}
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
        keyExtractor={s => String(s.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.row, { backgroundColor: colors.card }]}
            onPress={() => router.push(`/quran/${item.id}` as any)}
            activeOpacity={0.75}
          >
            <View style={[styles.numCircle, { backgroundColor: colors.primary }]}>
              <Text style={styles.num}>{item.id}</Text>
            </View>
            <View style={styles.info}>
              <Text style={[styles.arabicName, { color: colors.foreground }]}>{item.name}</Text>
              <Text style={[styles.engName, { color: colors.mutedForeground }]}>{item.nameEnglish} · {item.meaning}</Text>
            </View>
            <View style={styles.right}>
              <View style={[styles.badge, { backgroundColor: item.revelationType === 'Meccan' ? colors.surfaceAlt : colors.muted }]}>
                <Text style={[styles.badgeText, { color: colors.mutedForeground }]}>{item.revelationType === 'Meccan' ? t('meccan') : t('medinan')}</Text>
              </View>
              <Text style={[styles.ayahCount, { color: colors.mutedForeground }]}>{item.totalAyahs} {t('ayahs')}</Text>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
        ListFooterComponent={() => <View style={{ height: 100 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: '700' },
  subtitle: { fontSize: 13, marginTop: 2, letterSpacing: 1 },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginVertical: 10, borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 15 },
  list: { paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14 },
  numCircle: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  num: { color: '#fff', fontSize: 13, fontWeight: '700' },
  info: { flex: 1 },
  arabicName: { fontSize: 17, fontWeight: '600', textAlign: 'right', marginBottom: 2 },
  engName: { fontSize: 12 },
  right: { alignItems: 'flex-end', gap: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '600' },
  ayahCount: { fontSize: 11 },
});
