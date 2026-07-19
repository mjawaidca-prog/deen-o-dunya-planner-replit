import React, { memo, useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { QaidaLesson, QaidaItem } from '../types/tajweed.types';
import QaidaItemCell from './QaidaItem';

interface QaidaGridProps {
  lesson: QaidaLesson;
  onItemPress: (item: QaidaItem) => void;
  playingItemId: string | null;
  loadingItemId: string | null;
}

const QaidaGrid = memo(
  ({ lesson, onItemPress, playingItemId, loadingItemId }: QaidaGridProps) => {
    const cols = lesson.gridColumns;

    const handlePress = useCallback(
      (item: QaidaItem) => onItemPress(item),
      [onItemPress],
    );

    // Chunk items into rows
    const rows: QaidaItem[][] = [];
    for (let i = 0; i < lesson.items.length; i += cols) {
      rows.push(lesson.items.slice(i, i + cols));
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map(item => (
              <QaidaItemCell
                key={item.id}
                item={item}
                isPlaying={playingItemId === item.id}
                isLoading={loadingItemId === item.id}
                onPress={() => handlePress(item)}
                columnCount={cols}
              />
            ))}
            {/* Pad last row so flex layout stays aligned */}
            {row.length < cols &&
              Array.from({ length: cols - row.length }).map((_, i) => (
                <View key={`pad-${i}`} style={{ flex: 1 }} />
              ))}
          </View>
        ))}
        <View style={{ height: 48 }} />
      </ScrollView>
    );
  },
);

QaidaGrid.displayName = 'QaidaGrid';
export default QaidaGrid;

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingTop: 12 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
});
