import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useLanguage } from '@/context/LanguageContext';
import { useColors } from '@/hooks/useColors';
import { DUA_JOURNEYS, JOURNEY_UI, MoodEntry } from '@/constants/duaJourneys';

export default function DuaJourneyScreen() {
  const { mood } = useLocalSearchParams<{ mood: string }>();
  const { language, isRTL } = useLanguage();
  const colors = useColors();
  const router = useRouter();
  const [playing, setPlaying] = useState(false);

  const entry: MoodEntry | undefined = DUA_JOURNEYS.find(
    (m) => m.mood_id === mood,
  );

  if (!entry) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground, textAlign: 'center', marginTop: 40 }}>
          Journey not found.
        </Text>
      </SafeAreaView>
    );
  }

  const breathe =
    JOURNEY_UI.breathe[language as keyof typeof JOURNEY_UI.breathe] ??
    JOURNEY_UI.breathe.en;
  const backLabel =
    JOURNEY_UI.back[language as keyof typeof JOURNEY_UI.back] ??
    JOURNEY_UI.back.en;
  const audioLabel = playing
    ? (JOURNEY_UI.pauseAudio[language as keyof typeof JOURNEY_UI.pauseAudio] ?? JOURNEY_UI.pauseAudio.en)
    : (JOURNEY_UI.playAudio[language as keyof typeof JOURNEY_UI.playAudio] ?? JOURNEY_UI.playAudio.en);

  const translation =
    entry.dua_translation[language as keyof typeof entry.dua_translation] ??
    entry.dua_translation.en;

  const [bgLight, bgDark] = entry.palette;
  // Derive a very subtle background from the mood palette
  const screenBg = colors.background;
  const accentBg = bgLight;

  const isUrdu = language === 'ur';
  const isArabic = language === 'ar';
  const rtlText = isRTL;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: screenBg }]} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces
      >
        {/* Back button */}
        <TouchableOpacity
          style={[
            styles.backBtn,
            { alignSelf: isRTL ? 'flex-end' : 'flex-start' },
          ]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Feather
            name={isRTL ? 'arrow-right' : 'arrow-left'}
            size={16}
            color={colors.mutedForeground}
          />
          <Text
            style={[
              styles.backLabel,
              { color: colors.mutedForeground },
              isUrdu && styles.urduUI,
              isArabic && styles.arabicUI,
            ]}
          >
            {backLabel}
          </Text>
        </TouchableOpacity>

        {/* Breathe prompt */}
        <Text
          style={[
            styles.breathe,
            { color: colors.mutedForeground, textAlign: rtlText ? 'right' : 'center' },
            isUrdu && styles.urduUI,
            isArabic && styles.arabicUI,
          ]}
        >
          {breathe}
        </Text>

        {/* Mood badge */}
        <View style={[styles.moodBadge, { backgroundColor: accentBg, alignSelf: 'center' }]}>
          <Text style={styles.moodEmoji}>{entry.emoji}</Text>
          <Text
            style={[
              styles.moodBadgeText,
              { color: '#1A1A2E' },
              isUrdu && styles.urduUI,
              isArabic && styles.arabicUI,
            ]}
          >
            {entry.mood_text[language as keyof typeof entry.mood_text] ?? entry.mood_text.en}
          </Text>
        </View>

        {/* Dua card */}
        <View
          style={[
            styles.duaCard,
            {
              backgroundColor: colors.card,
              borderColor: bgDark,
              shadowColor: bgDark,
            },
          ]}
        >
          {/* Arabic text */}
          <Text style={[styles.arabicText, { color: colors.gold }]}>
            {entry.dua_arabic}
          </Text>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Translation */}
          <Text
            style={[
              styles.translation,
              {
                color: colors.foreground,
                textAlign: rtlText ? 'right' : 'center',
                direction: rtlText ? 'rtl' : 'ltr',
              },
              isUrdu && styles.urduTranslation,
              isArabic && styles.arabicTranslation,
            ]}
          >
            {translation}
          </Text>
        </View>

        {/* Audio button */}
        <TouchableOpacity
          style={[
            styles.audioBtn,
            {
              backgroundColor: playing ? colors.surfaceAlt : colors.primary,
              borderColor: playing ? colors.border : 'transparent',
              borderWidth: playing ? 1 : 0,
            },
          ]}
          activeOpacity={0.8}
          onPress={() => setPlaying((p) => !p)}
        >
          <Feather
            name={playing ? 'pause-circle' : 'play-circle'}
            size={20}
            color={playing ? colors.foreground : '#FFFFFF'}
          />
          <Text
            style={[
              styles.audioBtnText,
              { color: playing ? colors.foreground : '#FFFFFF' },
              isUrdu && styles.urduUI,
              isArabic && styles.arabicUI,
            ]}
          >
            {audioLabel}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 24,
    alignItems: 'stretch',
  },

  /* Back */
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  backLabel: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Inter_500Medium',
  },

  /* Breathe */
  breathe: {
    fontSize: 16,
    letterSpacing: 0.3,
    fontStyle: 'italic',
    marginTop: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Inter_400Regular',
  },

  /* Mood badge */
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
  },
  moodEmoji: { fontSize: 24 },
  moodBadgeText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Inter_600SemiBold',
  },

  /* Dua card */
  duaCard: {
    borderRadius: 24,
    padding: 28,
    gap: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  arabicText: {
    fontFamily: 'NotoSansArabic_400Regular',
    fontSize: 28,
    lineHeight: 52,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  divider: {
    width: '40%',
    height: 1.5,
    borderRadius: 1,
  },
  translation: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Inter_400Regular',
  },
  urduTranslation: {
    fontFamily: 'NotoNastaliqUrdu_400Regular',
    fontSize: 17,
    lineHeight: 38,
  },
  arabicTranslation: {
    fontFamily: 'NotoSansArabic_400Regular',
    fontSize: 17,
    lineHeight: 36,
  },

  /* Audio button */
  audioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignSelf: 'center',
    minWidth: 180,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  audioBtnText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Inter_600SemiBold',
  },

  /* RTL / font overrides for UI elements */
  urduUI: {
    fontFamily: 'NotoNastaliqUrdu_400Regular',
    fontSize: 15,
    lineHeight: 30,
  },
  arabicUI: {
    fontFamily: 'NotoSansArabic_400Regular',
    lineHeight: 28,
  },
});
