import React, { memo, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { QaidaItem as QaidaItemType } from '../types/tajweed.types';
import { TAJWEED_COLORS } from '../constants/tajweedColors';
import { useColors } from '@/hooks/useColors';

interface QaidaItemProps {
  item: QaidaItemType;
  isPlaying: boolean;
  isLoading: boolean;
  onPress: () => void;
  columnCount: number;
}

const QaidaItemCell = memo(
  ({ item, isPlaying, isLoading, onPress, columnCount }: QaidaItemProps) => {
    const colors = useColors();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = useCallback(() => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        speed: 30,
        bounciness: 4,
      }).start();
    }, [scaleAnim]);

    const handlePressOut = useCallback(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
        bounciness: 4,
      }).start();
    }, [scaleAnim]);

    const ruleColor = TAJWEED_COLORS[item.tajweedRule];
    const minSize = Math.max(64, 260 / columnCount - 12);

    const bg = isPlaying
      ? ruleColor + '28'
      : colors.card;
    const borderColor = isPlaying ? ruleColor : colors.border;

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }], flex: 1 }}>
        <TouchableOpacity
          style={[
            styles.cell,
            {
              backgroundColor: bg,
              borderColor,
              minHeight: minSize,
              minWidth: minSize,
            },
          ]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          accessibilityLabel={`${item.transliteration} – ${item.descriptionEn}`}
          accessibilityRole="button"
          accessibilityState={{ selected: isPlaying }}
        >
          {/* Arabic text */}
          <Text
            style={[
              styles.arabic,
              { color: isPlaying ? ruleColor : colors.gold },
            ]}
          >
            {item.text}
          </Text>

          {/* Transliteration */}
          <Text style={[styles.translit, { color: colors.mutedForeground }]}>
            {item.transliteration}
          </Text>

          {/* Colored rule indicator bar */}
          <View style={[styles.ruleBar, { backgroundColor: ruleColor }]} />

          {/* Loading overlay */}
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color={ruleColor} />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

QaidaItemCell.displayName = 'QaidaItemCell';
export default QaidaItemCell;

const styles = StyleSheet.create({
  cell: {
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: 'hidden',
  },
  arabic: {
    fontSize: 34,
    lineHeight: 48,
    textAlign: 'center',
    writingDirection: 'rtl',
    fontFamily: 'AmiriQuran_400Regular',
  },
  translit: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  ruleBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
});
