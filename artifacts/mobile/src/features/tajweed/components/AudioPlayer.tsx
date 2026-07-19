import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { QaidaItem } from '../types/tajweed.types';
import { TAJWEED_COLORS } from '../constants/tajweedColors';

interface AudioPlayerProps {
  currentItem: QaidaItem | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  onStop: () => void;
}

const AudioPlayer = memo(
  ({ currentItem, isPlaying, isLoading, error, onStop }: AudioPlayerProps) => {
    const colors = useColors();
    const { language } = useLanguage();
    const isUrdu = language === 'ur';
    const isRTL = language === 'ur' || language === 'ar';

    if (!currentItem && !error) return null;

    const ruleColor = currentItem
      ? TAJWEED_COLORS[currentItem.tajweedRule]
      : colors.primary;

    const label = currentItem
      ? (isUrdu ? currentItem.descriptionUr : currentItem.descriptionEn)
      : '';

    const statusText = isLoading
      ? (isUrdu ? 'لوڈ ہو رہا ہے...' : 'Loading...')
      : isPlaying
      ? (isUrdu ? 'چل رہا ہے' : 'Playing')
      : '';

    return (
      <View
        style={[
          styles.bar,
          { backgroundColor: colors.card, borderColor: colors.border },
          { flexDirection: isRTL ? 'row-reverse' : 'row' },
        ]}
      >
        {/* Animated indicator */}
        <View style={[styles.indicator, { backgroundColor: ruleColor + '33' }]}>
          <Feather
            name={isLoading ? 'loader' : isPlaying ? 'volume-2' : 'volume-x'}
            size={18}
            color={ruleColor}
          />
        </View>

        {/* Info */}
        <View style={[styles.info, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          {error ? (
            <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>
          ) : (
            <>
              <Text
                style={[
                  styles.itemText,
                  { color: colors.foreground },
                  isUrdu && styles.rtlText,
                ]}
                numberOfLines={1}
              >
                {currentItem?.text}{'  '}
                <Text style={[styles.translit, { color: colors.mutedForeground }]}>
                  {currentItem?.transliteration}
                </Text>
              </Text>
              <Text style={[styles.desc, { color: colors.mutedForeground }, isUrdu && styles.rtlText]} numberOfLines={1}>
                {label}
              </Text>
              {statusText ? (
                <Text style={[styles.status, { color: ruleColor }]}>{statusText}</Text>
              ) : null}
            </>
          )}
        </View>

        {/* Stop button */}
        <TouchableOpacity
          onPress={onStop}
          style={[styles.stopBtn, { backgroundColor: colors.surfaceAlt }]}
          accessibilityLabel="Stop audio"
          accessibilityRole="button"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="square" size={16} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>
    );
  },
);

AudioPlayer.displayName = 'AudioPlayer';
export default AudioPlayer;

const styles = StyleSheet.create({
  bar: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  indicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  info: { flex: 1, gap: 2 },
  itemText: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'AmiriQuran_400Regular',
    writingDirection: 'rtl',
  },
  rtlText: { writingDirection: 'rtl', textAlign: 'right' },
  translit: { fontSize: 12, fontWeight: '400' },
  desc: { fontSize: 12 },
  status: { fontSize: 11, fontWeight: '600' },
  error: { fontSize: 13, fontWeight: '500' },
  stopBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
