import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { HADITH_BOOKS } from '@/constants/hadithBooks';

const FEATURE_CARDS = [
  { icon: '🤲', title: 'Duas & Adhkar', subtitle: 'Daily supplications by category', route: '/duas', color: '#1A6B45' },
  { icon: '✨', title: '99 Names of Allah', subtitle: 'Asmaul Husna with meanings', route: '/names', color: '#8B4513' },
  { icon: '📜', title: 'Seerah', subtitle: 'Stories from Islamic history', route: '/seerah', color: '#4B0082' },
];

export default function LibraryTab() {
  const colors = useColors();
  const { t } = useLanguage();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.foreground }]}>{t('library')}</Text>

        {/* Hadith Books Section */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('hadithBooks')}</Text>
        <View style={styles.booksGrid}>
          {HADITH_BOOKS.map(book => (
            <TouchableOpacity
              key={book.id}
              style={[styles.bookCard, { backgroundColor: colors.card }]}
              onPress={() => router.push(`/hadith/${book.id}` as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.bookEmoji}>📚</Text>
              <Text style={[styles.bookArabic, { color: colors.gold }]}>{book.arabicName}</Text>
              <Text style={[styles.bookName, { color: colors.foreground }]} numberOfLines={2}>{book.name}</Text>
              <Text style={[styles.bookAuthor, { color: colors.mutedForeground }]} numberOfLines={1}>{book.author}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Feature Cards */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>More Resources</Text>
        {FEATURE_CARDS.map(card => (
          <TouchableOpacity
            key={card.route}
            style={[styles.featureCard, { backgroundColor: colors.card }]}
            onPress={() => router.push(card.route as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.featureIcon, { backgroundColor: card.color + '22' }]}>
              <Text style={styles.featureEmoji}>{card.icon}</Text>
            </View>
            <View style={styles.featureInfo}>
              <Text style={[styles.featureTitle, { color: colors.foreground }]}>{card.title}</Text>
              <Text style={[styles.featureSub, { color: colors.mutedForeground }]}>{card.subtitle}</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 8 },
  title: { fontSize: 26, fontWeight: '700', marginHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginHorizontal: 16, marginBottom: 12 },
  booksGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8, marginBottom: 24 },
  bookCard: { width: '47%', borderRadius: 14, padding: 14, gap: 4 },
  bookEmoji: { fontSize: 24, marginBottom: 4 },
  bookArabic: { fontSize: 13, fontWeight: '600' },
  bookName: { fontSize: 12, fontWeight: '600', lineHeight: 16 },
  bookAuthor: { fontSize: 11 },
  featureCard: { flexDirection: 'row', alignItems: 'center', gap: 14, marginHorizontal: 16, marginBottom: 10, borderRadius: 16, padding: 16 },
  featureIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  featureEmoji: { fontSize: 24 },
  featureInfo: { flex: 1 },
  featureTitle: { fontSize: 15, fontWeight: '700' },
  featureSub: { fontSize: 12, marginTop: 2 },
});
