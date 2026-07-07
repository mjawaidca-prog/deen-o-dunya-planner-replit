/**
 * Ramadan Tracker
 * - Shows Ramadan status (active / days until)
 * - 30-day fasting grid (fasted / missed / exempt with reason)
 * - Taraweeh tracking per day
 * - Suhoor & Iftar countdowns (from PrayerContext)
 * - Summary stats at top
 * - Stores data in AsyncStorage per Hijri year
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert, Modal, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePrayer } from '@/context/PrayerContext';

type FastStatus = 'none' | 'fasted' | 'missed' | 'exempt';
type ExemptReason = 'travel' | 'illness' | 'menses' | 'pregnancy' | 'other';

interface DayRecord {
  status: FastStatus;
  exemptReason?: ExemptReason;
  taraweeh: boolean;
}

function emptyDay(): DayRecord { return { status: 'none', taraweeh: false }; }
function storageKey(year: number) { return `ramadan_${year}`; }

const EXEMPT_LABELS: Record<ExemptReason, string> = {
  travel: 'Travel', illness: 'Illness', menses: 'Menses',
  pregnancy: 'Pregnancy', other: 'Other',
};

const STATUS_COLORS = {
  none:    '#E8E0D0',
  fasted:  '#0C5A3B',
  missed:  '#C0392B',
  exempt:  '#BD9A4E',
};

const STATUS_ICONS = {
  none: '○', fasted: '✓', missed: '✗', exempt: '~',
};

export default function RamadanScreen() {
  const { hijriDate, prayerTimes } = usePrayer();

  const [records, setRecords] = useState<DayRecord[]>(
    Array.from({ length: 30 }, emptyDay),
  );
  const [editDay, setEditDay] = useState<number | null>(null); // 1-based
  const [year, setYear] = useState(1446); // will be set from hijriDate

  // Determine Hijri year + Ramadan status
  useEffect(() => {
    if (hijriDate?.year) setYear(hijriDate.year);
  }, [hijriDate?.year]);

  const isRamadan  = hijriDate?.month === 9;
  const todayDay   = isRamadan ? Math.min(hijriDate!.day, 30) : null;

  // Calculate days until next Ramadan (approximate)
  const daysUntil = useMemo(() => {
    if (isRamadan) return 0;
    if (!hijriDate) return null;
    const { month, day } = hijriDate;
    if (month < 9) {
      // count remaining days in each month (approx 29.5 days/month)
      return Math.round((9 - month - 1) * 29.5 + (29 - day));
    }
    // past Ramadan this year
    return Math.round((12 - month + 8) * 29.5 + (29 - day));
  }, [hijriDate, isRamadan]);

  // Load / save — always reset to empty when no valid payload exists for the year
  useEffect(() => {
    AsyncStorage.getItem(storageKey(year)).then(raw => {
      if (raw) {
        try {
          const saved: DayRecord[] = JSON.parse(raw);
          if (Array.isArray(saved) && saved.length === 30) {
            setRecords(saved);
            return;
          }
        } catch { /* corrupted — fall through to reset */ }
      }
      // No data for this year → show a clean empty grid
      setRecords(Array.from({ length: 30 }, emptyDay));
    });
  }, [year]);

  const save = useCallback((updated: DayRecord[]) => {
    setRecords(updated);
    AsyncStorage.setItem(storageKey(year), JSON.stringify(updated));
  }, [year]);

  const updateDay = (dayIdx: number, patch: Partial<DayRecord>) => {
    const updated = records.map((r, i) => i === dayIdx ? { ...r, ...patch } : r);
    save(updated);
  };

  const summary = useMemo(() => {
    const fasted   = records.filter(r => r.status === 'fasted').length;
    const missed   = records.filter(r => r.status === 'missed').length;
    const exempt   = records.filter(r => r.status === 'exempt').length;
    const taraweeh = records.filter(r => r.taraweeh).length;
    const makeUp   = missed + exempt;
    return { fasted, missed, exempt, taraweeh, makeUp };
  }, [records]);

  // Suhoor = Fajr time; Iftar = Maghrib time
  const suhoor = prayerTimes?.Fajr ?? '—';
  const iftar  = prayerTimes?.Maghrib ?? '—';

  const editRecord = editDay !== null ? records[editDay - 1] : null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#F9F5ED' }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="chevron-left" size={24} color="#0C5A3B" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Ramadan</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Status banner */}
        <View style={styles.bannerCard}>
          {isRamadan ? (
            <>
              <Text style={styles.bannerMoon}>☪</Text>
              <Text style={styles.bannerTitle}>Ramadan Mubarak!</Text>
              <Text style={styles.bannerSub}>Day {todayDay} of 30 · {hijriDate!.year} AH</Text>
              <View style={styles.timesRow}>
                <View style={styles.timeBox}>
                  <Text style={styles.timeLabel}>Suhoor (Fajr)</Text>
                  <Text style={styles.timeValue}>{suhoor}</Text>
                </View>
                <View style={[styles.timeBox, styles.timeBoxRight]}>
                  <Text style={styles.timeLabel}>Iftar (Maghrib)</Text>
                  <Text style={styles.timeValue}>{iftar}</Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.bannerMoon}>🌙</Text>
              <Text style={styles.bannerTitle}>Ramadan Coming</Text>
              {daysUntil !== null
                ? <Text style={styles.bannerSub}>~{daysUntil} days away</Text>
                : <Text style={styles.bannerSub}>Check Islamic calendar for exact date</Text>
              }
            </>
          )}
        </View>

        {/* Summary stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Fasted',   val: summary.fasted,   color: '#0C5A3B' },
            { label: 'Missed',   val: summary.missed,   color: '#C0392B' },
            { label: 'Exempt',   val: summary.exempt,   color: '#BD9A4E' },
            { label: 'Taraweeh',val: summary.taraweeh, color: '#7C3AED' },
            { label: 'Make-up',  val: summary.makeUp,   color: '#6B7869' },
          ].map(s => (
            <View key={s.label} style={[styles.statBox, { borderTopColor: s.color }]}>
              <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* 30-day grid */}
        <Text style={styles.sectionTitle}>30-Day Tracker</Text>
        <View style={styles.grid}>
          {records.map((rec, i) => {
            const dayNum = i + 1;
            const isToday = todayDay === dayNum;
            return (
              <TouchableOpacity
                key={dayNum}
                style={[
                  styles.dayCell,
                  { backgroundColor: STATUS_COLORS[rec.status] },
                  isToday && styles.dayCellToday,
                ]}
                onPress={() => setEditDay(dayNum)}
              >
                <Text style={[styles.dayNum, rec.status !== 'none' && { color: '#fff' }]}>{dayNum}</Text>
                <Text style={[styles.dayIcon, rec.status !== 'none' && { color: '#fff' }]}>
                  {STATUS_ICONS[rec.status]}
                </Text>
                {rec.taraweeh && <View style={styles.taraweehDot} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            status !== 'none' ? (
              <View key={status} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: color }]} />
                <Text style={styles.legendText}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
              </View>
            ) : null
          ))}
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#7C3AED', borderRadius: 3 }]} />
            <Text style={styles.legendText}>Taraweeh</Text>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notesCard}>
          <Text style={styles.notesTitle}>💜 Make-up Fasts</Text>
          <Text style={styles.notesText}>
            You owe {summary.makeUp} make-up fast{summary.makeUp !== 1 ? 's' : ''} (missed + exempt days).
            {summary.makeUp === 0 ? ' MashaAllah — all fasts accounted for!' : ' These should be made up before next Ramadan.'}
          </Text>
        </View>

      </ScrollView>

      {/* Day edit modal */}
      <Modal visible={editDay !== null} transparent animationType="slide" onRequestClose={() => setEditDay(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Day {editDay}</Text>
              <TouchableOpacity onPress={() => setEditDay(null)} style={styles.modalClose}>
                <Feather name="x" size={18} color="#6B7869" />
              </TouchableOpacity>
            </View>

            {editRecord && editDay !== null && (
              <>
                {/* Status buttons */}
                <Text style={styles.modalLabel}>Fasting status</Text>
                <View style={styles.statusRow}>
                  {(['fasted', 'missed', 'exempt', 'none'] as FastStatus[]).map(s => (
                    <TouchableOpacity
                      key={s}
                      style={[styles.statusBtn, editRecord.status === s && { backgroundColor: STATUS_COLORS[s] }]}
                      onPress={() => updateDay(editDay - 1, { status: s, exemptReason: s === 'exempt' ? (editRecord.exemptReason || 'other') : undefined })}
                    >
                      <Text style={[styles.statusBtnText, editRecord.status === s && s !== 'none' && { color: '#fff' }]}>
                        {s === 'none' ? 'Clear' : s.charAt(0).toUpperCase() + s.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Exempt reason */}
                {editRecord.status === 'exempt' && (
                  <>
                    <Text style={styles.modalLabel}>Reason for exemption</Text>
                    <View style={styles.statusRow}>
                      {(Object.keys(EXEMPT_LABELS) as ExemptReason[]).map(r => (
                        <TouchableOpacity
                          key={r}
                          style={[styles.statusBtn, editRecord.exemptReason === r && { backgroundColor: '#BD9A4E' }]}
                          onPress={() => updateDay(editDay - 1, { exemptReason: r })}
                        >
                          <Text style={[styles.statusBtnText, editRecord.exemptReason === r && { color: '#fff' }]}>
                            {EXEMPT_LABELS[r]}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                )}

                {/* Taraweeh */}
                <View style={styles.taraweehRow}>
                  <Text style={styles.taraweehLabel}>🌙 Taraweeh prayed</Text>
                  <Switch
                    value={editRecord.taraweeh}
                    onValueChange={v => updateDay(editDay - 1, { taraweeh: v })}
                    trackColor={{ false: '#E8E0D0', true: '#7C3AED' }}
                    thumbColor={editRecord.taraweeh ? '#fff' : '#fff'}
                  />
                </View>

                <TouchableOpacity style={styles.doneBtn} onPress={() => setEditDay(null)}>
                  <Text style={styles.doneBtnText}>Done</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E8F3EE', alignItems: 'center', justifyContent: 'center' },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#0C5A3B' },

  bannerCard: { margin: 16, padding: 24, backgroundColor: '#0C5A3B', borderRadius: 22, alignItems: 'center', gap: 6 },
  bannerMoon: { fontSize: 36 },
  bannerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  bannerSub: { fontSize: 14, color: 'rgba(255,255,255,0.75)' },
  timesRow: { flexDirection: 'row', gap: 12, marginTop: 12, width: '100%' },
  timeBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: 12, alignItems: 'center' },
  timeBoxRight: {},
  timeLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  timeValue: { fontSize: 18, fontWeight: '800', color: '#fff', marginTop: 4 },

  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  statBox: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 10, alignItems: 'center', borderTopWidth: 3 },
  statVal: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 10, color: '#6B7869', fontWeight: '600', marginTop: 2 },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#21302A', paddingHorizontal: 16, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, gap: 6 },
  dayCell: {
    width: '13%', aspectRatio: 1,
    borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'transparent', position: 'relative',
  },
  dayCellToday: { borderColor: '#0C5A3B', borderWidth: 2 },
  dayNum: { fontSize: 11, fontWeight: '700', color: '#44543C' },
  dayIcon: { fontSize: 11, color: '#44543C' },
  taraweehDot: { position: 'absolute', top: 2, right: 2, width: 5, height: 5, borderRadius: 3, backgroundColor: '#7C3AED' },

  legend: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12, marginTop: 12, marginBottom: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: '#6B7869', fontWeight: '600' },

  notesCard: { margin: 16, padding: 16, backgroundColor: '#EEE8FA', borderRadius: 16 },
  notesTitle: { fontSize: 14, fontWeight: '700', color: '#5B21B6', marginBottom: 6 },
  notesText: { fontSize: 13, color: '#44375A', lineHeight: 20 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FDFAF6', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40, gap: 14 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#21302A' },
  modalClose: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EDE8DE', alignItems: 'center', justifyContent: 'center' },
  modalLabel: { fontSize: 13, fontWeight: '700', color: '#6B7869' },
  statusRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  statusBtn: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12, backgroundColor: '#F0EBE0', borderWidth: 1, borderColor: '#E8E0D0' },
  statusBtnText: { fontSize: 13, fontWeight: '700', color: '#44543C' },
  taraweehRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  taraweehLabel: { fontSize: 15, fontWeight: '600', color: '#21302A' },
  doneBtn: { backgroundColor: '#0C5A3B', borderRadius: 14, paddingVertical: 13, alignItems: 'center', marginTop: 4 },
  doneBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
