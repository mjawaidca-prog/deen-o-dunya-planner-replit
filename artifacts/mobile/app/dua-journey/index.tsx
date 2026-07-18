import React from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';
import { useColors } from '@/hooks/useColors';
import { DUA_JOURNEYS, JOURNEY_UI, MoodEntry } from '@/constants/duaJourneys';

const NUM_COLUMNS = 2;

export default function DuaJourneyMoodSelector() {
  const { language, isRTL } = useLanguage();
  const colors = useColors();
  const router = useRouter();

  const header = JOURNEY_UI.header[language as keyof typeof JOURNEY_UI.header] ?? JOURNEY_UI.header.en;

  const renderCard = ({ item }: { item: MoodEntry }) => {
    const label =
      item.mood_text[language as keyof typeof item.mood_text] ??
      item.mood_text.en;
    const [bgLight] = item.palette;

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: bgLight }]}
        activeOpacity={0.75}
        onPress={() =>
          router.push({
            pathname: '/dua-journey/[mood]',
            params: { mood: item.mood_id },
          })
        }
      >
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text
          style={[
            styles.cardLabel,
            { color: '#1A1A2E', textAlign: isRTL ? 'right' : 'center' },
            language === 'ur' && styles.urduLabel,
            language === 'ar' && styles.arabicLabel,
          ]}
          numberOfLines={2}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <View style={styles.headerWrap}>
        <Text
          style={[
            styles.header,
            { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' },
            language === 'ur' && styles.urduHeader,
            language === 'ar' && styles.arabicHeader,
          ]}
        >
          {header}
        </Text>
        <View style={[styles.headerUnderline, { backgroundColor: colors.gold }]} />
      </View>

      {/* Mood grid */}
      <FlatList
        data={DUA_JOURNEYS}
        keyExtractor={(item) => item.mood_id}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={renderCard}
        ListFooterComponent={<View style={{ height: 40 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  headerWrap: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Inter_700Bold',
    lineHeight: 34,
    marginBottom: 10,
  },
  urduHeader: {
    fontFamily: 'NotoNastaliqUrdu_400Regular',
    fontSize: 24,
    lineHeight: 44,
  },
  arabicHeader: {
    fontFamily: 'NotoSansArabic_400Regular',
    fontSize: 24,
    lineHeight: 40,
  },
  headerUnderline: {
    width: 40,
    height: 3,
    borderRadius: 2,
  },

  grid: { paddingHorizontal: 16 },
  row: { gap: 14, marginBottom: 14 },

  card: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    // Soft elevation
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  emoji: {
    fontSize: 42,
    lineHeight: 50,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Inter_600SemiBold',
    letterSpacing: 0.1,
  },
  urduLabel: {
    fontFamily: 'NotoNastaliqUrdu_400Regular',
    fontSize: 16,
    lineHeight: 32,
  },
  arabicLabel: {
    fontFamily: 'NotoSansArabic_400Regular',
    fontSize: 16,
    lineHeight: 28,
  },
});
