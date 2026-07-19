import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SURAHS } from '@/constants/quranData';

const STORAGE_KEY = 'daily_ayah_v1';

// ─── Day → Ayah mapping ──────────────────────────────────────────────────────
// Day 1 = Al-Fatihah 1:2  (skip Bismillah which is 1:1)
// Day 2 = Al-Fatihah 1:3  … Day 6 = 1:7  … Day 7 = Al-Baqarah 1:1 …
// Sequence goes through all 114 surahs, 6 235 total days.

interface SurahOffset {
  surahId: number;
  surahName: string;
  surahNameEnglish: string;
  startDay: number;    // 1-indexed day when this surah begins
  firstAyah: number;   // ayah number to start from (2 for Fatihah, 1 for all others)
  ayahCount: number;   // how many ayahs contribute days from this surah
  globalStart: number; // global ayah number of the very first ayah of this surah
}

function buildOffsetTable(): SurahOffset[] {
  const table: SurahOffset[] = [];
  let currentDay = 1;
  let globalStart = 1;

  for (const surah of SURAHS) {
    const firstAyah = surah.id === 1 ? 2 : 1;
    const ayahCount = surah.totalAyahs - firstAyah + 1;
    table.push({
      surahId: surah.id,
      surahName: surah.name,
      surahNameEnglish: surah.nameEnglish,
      startDay: currentDay,
      firstAyah,
      ayahCount,
      globalStart,
    });
    currentDay += ayahCount;
    globalStart += surah.totalAyahs;
  }
  return table;
}

const OFFSET_TABLE = buildOffsetTable();
export const TOTAL_AYAH_DAYS = OFFSET_TABLE[OFFSET_TABLE.length - 1].startDay
  + OFFSET_TABLE[OFFSET_TABLE.length - 1].ayahCount - 1;

export interface DailyAyahRef {
  surahId: number;
  ayahNum: number;
  surahName: string;
  surahNameEnglish: string;
  /** 1-indexed sequential number counting from the first ayah of Quran */
  globalNum: number;
}

export function dayToAyahRef(day: number): DailyAyahRef {
  const clamped = Math.max(1, Math.min(day, TOTAL_AYAH_DAYS));

  // Binary search for the right surah
  let lo = 0;
  let hi = OFFSET_TABLE.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (OFFSET_TABLE[mid].startDay <= clamped) lo = mid; else hi = mid - 1;
  }

  const entry = OFFSET_TABLE[lo];
  const offset = clamped - entry.startDay;       // 0-indexed within surah
  const ayahNum = entry.firstAyah + offset;
  const globalNum = entry.globalStart + ayahNum - 1;

  return {
    surahId: entry.surahId,
    ayahNum,
    surahName: entry.surahName,
    surahNameEnglish: entry.surahNameEnglish,
    globalNum,
  };
}

// ─── Persistent state ────────────────────────────────────────────────────────

export interface DayActivity {
  readAt?: string;      // ISO timestamp
  listenedAt?: string;  // ISO timestamp
}

export interface DailyAyahState {
  dayNumber: number;
  history: Record<number, DayActivity>;
}

const DEFAULT_STATE: DailyAyahState = { dayNumber: 1, history: {} };

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDailyAyah() {
  const [state, setState] = useState<DailyAyahState>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);
  const ready = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Partial<DailyAyahState>;
          setState({
            dayNumber: typeof parsed.dayNumber === 'number' ? parsed.dayNumber : 1,
            history: parsed.history ?? {},
          });
        } catch {}
      }
      setLoading(false);
      ready.current = true;
    });
  }, []);

  const persist = useCallback((next: DailyAyahState) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const setDayNumber = useCallback((day: number) => {
    const clamped = Math.max(1, Math.min(day, TOTAL_AYAH_DAYS));
    setState((prev) => {
      const next = { ...prev, dayNumber: clamped };
      persist(next);
      return next;
    });
  }, [persist]);

  const advance = useCallback(() => setDayNumber(
    Math.min((state.dayNumber ?? 1) + 1, TOTAL_AYAH_DAYS)
  ), [setDayNumber, state.dayNumber]);

  const back = useCallback(() => setDayNumber(
    Math.max((state.dayNumber ?? 1) - 1, 1)
  ), [setDayNumber, state.dayNumber]);

  const markRead = useCallback((day: number) => {
    setState((prev) => {
      const next: DailyAyahState = {
        ...prev,
        history: {
          ...prev.history,
          [day]: { ...prev.history[day], readAt: new Date().toISOString() },
        },
      };
      persist(next);
      return next;
    });
  }, [persist]);

  const markListened = useCallback((day: number) => {
    setState((prev) => {
      const next: DailyAyahState = {
        ...prev,
        history: {
          ...prev.history,
          [day]: { ...prev.history[day], listenedAt: new Date().toISOString() },
        },
      };
      persist(next);
      return next;
    });
  }, [persist]);

  const dayActivity = state.history[state.dayNumber] ?? {};

  return {
    loading,
    dayNumber: state.dayNumber,
    history: state.history,
    isRead: !!dayActivity.readAt,
    isListened: !!dayActivity.listenedAt,
    ayahRef: dayToAyahRef(state.dayNumber),
    totalDays: TOTAL_AYAH_DAYS,
    setDayNumber,
    advance,
    back,
    markRead,
    markListened,
  };
}
