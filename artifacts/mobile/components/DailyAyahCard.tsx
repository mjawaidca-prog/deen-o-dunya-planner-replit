import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { useDailyAyah } from '@/hooks/useDailyAyah';
import DailyAyahLogModal from '@/components/DailyAyahLogModal';

// ─── API types ───────────────────────────────────────────────────────────────

interface AyahEditionData {
  text: string;
  edition: { identifier: string };
}

interface FetchedAyah {
  arabic: string;
  english: string;
  urdu: string;
}

async function fetchAyah(surahId: number, ayahNum: number): Promise<FetchedAyah> {
  const url = `https://api.alquran.cloud/v1/ayah/${surahId}:${ayahNum}/editions/ar.uthmani,en.sahih,ur.jalandhry`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json() as { data: AyahEditionData[] };
  const [ar, en, ur] = json.data;
  return { arabic: ar?.text ?? '', english: en?.text ?? '', urdu: ur?.text ?? '' };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function DailyAyahCard() {
  const colors = useColors();
  const { language } = useLanguage();
  const {
    loading: stateLoading,
    dayNumber,
    history,
    isRead,
    isListened,
    ayahRef,
    totalDays,
    advance,
    back,
    setDayNumber,
    markRead,
    markListened,
  } = useDailyAyah();

  const [ayah, setAyah] = useState<FetchedAyah | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [showLog, setShowLog] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);

  // Stop & unload audio helper
  const stopAudio = useCallback(async () => {
    setIsPlaying(false);
    if (soundRef.current) {
      try { await soundRef.current.stopAsync(); } catch {}
      try { await soundRef.current.unloadAsync(); } catch {}
      soundRef.current = null;
    }
  }, []);

  // Unload on unmount
  useEffect(() => {
    return () => { stopAudio(); };
  }, []);

  // Re-fetch when the ayah changes
  useEffect(() => {
    if (stateLoading) return;
    setAyah(null);
    setFetchError(false);
    setFetchLoading(true);
    stopAudio();

    let cancelled = false;
    fetchAyah(ayahRef.surahId, ayahRef.ayahNum)
      .then((data) => { if (!cancelled) { setAyah(data); setFetchLoading(false); } })
      .catch(() => { if (!cancelled) { setFetchError(true); setFetchLoading(false); } });

    return () => { cancelled = true; };
  }, [ayahRef.surahId, ayahRef.ayahNum, stateLoading]);

  // ── Audio playback ──────────────────────────────────────────────────────────
  const handlePlay = useCallback(async () => {
    if (isPlaying) {
      await stopAudio();
      return;
    }

    setAudioLoading(true);
    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound } = await Audio.Sound.createAsync(
        { uri: `https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/${ayahRef.globalNum}` },
        { shouldPlay: true },
      );
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) {
          setIsPlaying(false);
          markListened(dayNumber);
        }
      });
      setIsPlaying(true);
      markListened(dayNumber);
    } catch {
      // Fallback: TTS
      try {
        Speech.speak(ayah?.arabic ?? '', { language: 'ar', rate: 0.75 });
        markListened(dayNumber);
      } catch {}
    } finally {
      setAudioLoading(false);
    }
  }, [isPlaying, ayahRef.globalNum, ayah, dayNumber, markListened, stopAudio]);

  // ── Share ───────────────────────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    if (!ayah) return;
    const translation = language === 'ur' ? ayah.urdu || ayah.english : ayah.english;
    try {
      await Share.share({
        title: `Daily Ayah – Day ${dayNumber}`,
        message:
          `✨ Daily Ayah – Day ${dayNumber}\n` +
          `${ayahRef.surahNameEnglish} ${ayahRef.surahId}:${ayahRef.ayahNum}\n\n` +
          `${ayah.arabic}\n\n` +
          `${translation}\n\n` +
          `📱 Deen o Dunya Planner`,
      });
    } catch {}
  }, [ayah, language, dayNumber, ayahRef]);

  // ── Reset ───────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    Alert.prompt(
      'Go to Day',
      `Enter a day number (1 – ${totalDays})`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Go',
          onPress: (value) => {
            const num = parseInt(value ?? '', 10);
            if (!isNaN(num)) setDayNumber(num);
          },
        },
      ],
      'plain-text',
      String(dayNumber),
      'number-pad',
    );
  }, [dayNumber, totalDays, setDayNumber]);

  // ── Render ──────────────────────────────────────────────────────────────────
  const translation = language === 'ur'
    ? (ayah?.urdu || ayah?.english)
    : ayah?.english;

  const totalRead = Object.values(history).filter((h) => h.readAt).length;
  const totalListened = Object.values(history).filter((h) => h.listenedAt).length;

  return (
    <>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        {/* Header row */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>📖  Daily Ayah</Text>
            <Text style={[styles.dayBadge, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
              Day {dayNumber}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setShowLog(true)} style={styles.logBtn}>
            <Feather name="bar-chart-2" size={14} color="rgba(255,255,255,0.85)" />
            <Text style={styles.logBtnText}>Log</Text>
          </TouchableOpacity>
        </View>

        {/* Reference + stats */}
        <View style={[styles.refRow, { borderBottomColor: colors.surfaceAlt }]}>
          <Text style={[styles.refText, { color: colors.primary }]}>
            {ayahRef.surahName}  ·  {ayahRef.surahNameEnglish} {ayahRef.surahId}:{ayahRef.ayahNum}
          </Text>
          <View style={styles.miniStats}>
            <Text style={[styles.miniStat, { color: colors.mutedForeground }]}>
              ✓ {totalRead}
            </Text>
            <Text style={[styles.miniStat, { color: colors.mutedForeground }]}>
              ▶ {totalListened}
            </Text>
          </View>
        </View>

        {/* Content */}
        {fetchLoading || stateLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : fetchError ? (
          <View style={styles.loadingBox}>
            <Text style={[styles.errorText, { color: colors.mutedForeground }]}>
              Could not load ayah. Check your connection.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setFetchError(false);
                setFetchLoading(true);
                fetchAyah(ayahRef.surahId, ayahRef.ayahNum)
                  .then((d) => { setAyah(d); setFetchLoading(false); })
                  .catch(() => { setFetchError(true); setFetchLoading(false); });
              }}
            >
              <Text style={[styles.retryText, { color: colors.primary }]}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : ayah ? (
          <View style={styles.ayahBox}>
            <Text style={[styles.arabic, { color: colors.foreground }]}>
              {ayah.arabic}
            </Text>
            {translation ? (
              <Text style={[
                styles.translation,
                { color: colors.mutedForeground },
                language === 'ur' && styles.urduTranslation,
              ]}>
                {translation}
              </Text>
            ) : null}
          </View>
        ) : null}

        {/* Action bar */}
        <View style={[styles.actionBar, { borderTopColor: colors.surfaceAlt }]}>
          {/* Back */}
          <TouchableOpacity
            onPress={back}
            disabled={dayNumber <= 1}
            style={[styles.navBtn, { opacity: dayNumber <= 1 ? 0.35 : 1 }]}
          >
            <Feather name="chevron-left" size={20} color={colors.foreground} />
          </TouchableOpacity>

          {/* Read */}
          <TouchableOpacity
            onPress={() => markRead(dayNumber)}
            style={[
              styles.actionBtn,
              { backgroundColor: isRead ? colors.primary : colors.surfaceAlt },
            ]}
          >
            <Feather name={isRead ? 'check-circle' : 'book-open'} size={15}
              color={isRead ? '#fff' : colors.mutedForeground} />
            <Text style={[styles.actionBtnText, { color: isRead ? '#fff' : colors.mutedForeground }]}>
              Read
            </Text>
          </TouchableOpacity>

          {/* Listen */}
          <TouchableOpacity
            onPress={handlePlay}
            disabled={audioLoading}
            style={[
              styles.actionBtn,
              { backgroundColor: isListened && !isPlaying ? colors.primary : isPlaying ? '#C9A84C' : colors.surfaceAlt },
            ]}
          >
            {audioLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Feather
                name={isPlaying ? 'pause-circle' : isListened ? 'check-circle' : 'play-circle'}
                size={15}
                color={isListened || isPlaying ? '#fff' : colors.mutedForeground}
              />
            )}
            <Text style={[styles.actionBtnText, { color: isListened || isPlaying ? '#fff' : colors.mutedForeground }]}>
              {isPlaying ? 'Stop' : 'Listen'}
            </Text>
          </TouchableOpacity>

          {/* Share */}
          <TouchableOpacity
            onPress={handleShare}
            disabled={!ayah}
            style={[styles.actionBtn, { backgroundColor: colors.surfaceAlt, opacity: ayah ? 1 : 0.4 }]}
          >
            <Feather name="share-2" size={15} color={colors.mutedForeground} />
            <Text style={[styles.actionBtnText, { color: colors.mutedForeground }]}>Share</Text>
          </TouchableOpacity>

          {/* Forward */}
          <TouchableOpacity
            onPress={advance}
            disabled={dayNumber >= totalDays}
            style={[styles.navBtn, { opacity: dayNumber >= totalDays ? 0.35 : 1 }]}
          >
            <Feather name="chevron-right" size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Jump to day */}
        <TouchableOpacity onPress={handleReset} style={styles.jumpRow}>
          <Text style={[styles.jumpText, { color: colors.mutedForeground }]}>
            Jump to any day  ·  {dayNumber} / {totalDays}
          </Text>
          <Feather name="edit-2" size={11} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      <DailyAyahLogModal
        visible={showLog}
        onClose={() => setShowLog(false)}
        history={history}
        currentDay={dayNumber}
        onGoToDay={(d) => { setDayNumber(d); setShowLog(false); }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 18,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  dayBadge: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  logBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  logBtnText: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600' },
  refRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  refText: { fontSize: 13, fontWeight: '600', flex: 1 },
  miniStats: { flexDirection: 'row', gap: 10 },
  miniStat: { fontSize: 12, fontWeight: '500' },
  loadingBox: { minHeight: 100, alignItems: 'center', justifyContent: 'center', padding: 20 },
  errorText: { fontSize: 13, textAlign: 'center', marginBottom: 8 },
  retryText: { fontSize: 13, fontWeight: '700' },
  ayahBox: { paddingHorizontal: 16, paddingVertical: 16, gap: 10 },
  arabic: {
    fontSize: 22,
    lineHeight: 38,
    textAlign: 'right',
    fontWeight: '500',
    writingDirection: 'rtl',
  },
  translation: { fontSize: 14, lineHeight: 22 },
  urduTranslation: { textAlign: 'right', writingDirection: 'rtl' },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 6,
  },
  navBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 10,
  },
  actionBtnText: { fontSize: 12, fontWeight: '600' },
  jumpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingBottom: 10,
  },
  jumpText: { fontSize: 11 },
});
