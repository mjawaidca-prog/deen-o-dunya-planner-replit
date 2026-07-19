import React, { useMemo } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { DayActivity, dayToAyahRef } from '@/hooks/useDailyAyah';

interface Props {
  visible: boolean;
  onClose: () => void;
  history: Record<number, DayActivity>;
  currentDay: number;
  onGoToDay: (day: number) => void;
}

export default function DailyAyahLogModal({ visible, onClose, history, currentDay, onGoToDay }: Props) {
  const colors = useColors();

  const { totalRead, totalListened, totalCompleted, streak, entries } = useMemo(() => {
    const days = Object.keys(history).map(Number).sort((a, b) => b - a); // newest first

    let totalRead = 0;
    let totalListened = 0;
    let totalCompleted = 0;

    for (const d of days) {
      const h = history[d];
      if (h.readAt) totalRead++;
      if (h.listenedAt) totalListened++;
      if (h.readAt || h.listenedAt) totalCompleted++;
    }

    // Streak: consecutive days from currentDay backwards where readAt or listenedAt exists
    let streak = 0;
    for (let d = currentDay; d >= 1; d--) {
      const h = history[d];
      if (h?.readAt || h?.listenedAt) streak++; else break;
    }

    const entries = days.slice(0, 100).map((d) => ({
      day: d,
      ref: dayToAyahRef(d),
      ...history[d],
    }));

    return { totalRead, totalListened, totalCompleted, streak, entries };
  }, [history, currentDay]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.surfaceAlt }]}>
            <Text style={[styles.title, { color: colors.foreground }]}>Ayah Activity Log</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.surfaceAlt }]}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={[styles.statsRow, { borderBottomColor: colors.surfaceAlt }]}>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.statNum, { color: colors.primary }]}>{streak}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>🔥 Streak</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.statNum, { color: colors.primary }]}>{totalCompleted}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>✨ Done</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.statNum, { color: colors.primary }]}>{totalRead}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>📖 Read</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.statNum, { color: colors.primary }]}>{totalListened}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>🎧 Heard</Text>
            </View>
          </View>

          {/* Current day banner */}
          <View style={[styles.currentBanner, { backgroundColor: colors.primary + '18' }]}>
            <Text style={[styles.currentText, { color: colors.primary }]}>
              Currently on Day {currentDay} — tap any entry below to jump to that day
            </Text>
          </View>

          {/* History list */}
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {entries.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={{ fontSize: 36 }}>📖</Text>
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  No activity yet.{'\n'}Read or listen to your first ayah!
                </Text>
              </View>
            ) : (
              entries.map((entry) => (
                <TouchableOpacity
                  key={entry.day}
                  onPress={() => onGoToDay(entry.day)}
                  activeOpacity={0.75}
                  style={[
                    styles.row,
                    {
                      backgroundColor: entry.day === currentDay ? colors.primary + '14' : colors.card,
                      borderColor: entry.day === currentDay ? colors.primary + '44' : 'transparent',
                    },
                  ]}
                >
                  {/* Day badge */}
                  <View style={[styles.dayBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.dayBadgeText}>{entry.day}</Text>
                  </View>

                  {/* Reference */}
                  <View style={styles.rowMid}>
                    <Text style={[styles.rowRef, { color: colors.foreground }]}>
                      {entry.ref.surahNameEnglish} {entry.ref.surahId}:{entry.ref.ayahNum}
                    </Text>
                    <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>
                      {entry.ref.surahName}
                    </Text>
                  </View>

                  {/* Checkmarks */}
                  <View style={styles.rowRight}>
                    <View style={styles.checkItem}>
                      <Feather
                        name={entry.readAt ? 'check-circle' : 'circle'}
                        size={16}
                        color={entry.readAt ? colors.primary : colors.mutedForeground}
                      />
                      <Text style={[styles.checkLabel, { color: colors.mutedForeground }]}>Read</Text>
                    </View>
                    <View style={styles.checkItem}>
                      <Feather
                        name={entry.listenedAt ? 'check-circle' : 'circle'}
                        size={16}
                        color={entry.listenedAt ? '#C9A84C' : colors.mutedForeground}
                      />
                      <Text style={[styles.checkLabel, { color: colors.mutedForeground }]}>Heard</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '88%', paddingBottom: 8 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  title: { fontSize: 17, fontWeight: '700' },
  closeBtn: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    padding: 14,
    borderBottomWidth: 1,
  },
  statCard: { flex: 1, borderRadius: 12, paddingVertical: 10, alignItems: 'center', gap: 2 },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '500', textAlign: 'center' },
  currentBanner: {
    marginHorizontal: 14,
    marginVertical: 8,
    padding: 10,
    borderRadius: 10,
  },
  currentText: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  list: { flex: 1, paddingHorizontal: 14 },
  emptyBox: { alignItems: 'center', paddingTop: 40, gap: 12 },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    gap: 10,
  },
  dayBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBadgeText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  rowMid: { flex: 1, gap: 2 },
  rowRef: { fontSize: 13, fontWeight: '600' },
  rowSub: { fontSize: 11 },
  rowRight: { flexDirection: 'row', gap: 10 },
  checkItem: { alignItems: 'center', gap: 2 },
  checkLabel: { fontSize: 10 },
});
