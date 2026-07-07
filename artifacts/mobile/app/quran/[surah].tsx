import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, Modal, Platform, ScrollView,
  Share, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withTiming, interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureRef } from 'react-native-view-shot';
import * as ExpoSharing from 'expo-sharing';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { useAudio } from '@/context/AudioContext';
import { SURAHS, TRANSLATION_EDITIONS, TAFSEER_EDITIONS } from '@/constants/quranData';
import { QARIS } from '@/constants/qaris';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Ayah {
  numberInSurah: number;
  text: string;
  translation: string;
  tafsir?: string;
}

interface BookmarkedAyah {
  surah: number;
  ayah: number;
  surahName: string;
  surahNameEnglish: string;
  arabicText: string;
  translation: string;
  savedAt: string;
}

const BOOKMARKS_KEY   = 'quran_bookmarks_v2';
const FONT_SIZE_KEY   = 'quran_font_size';
const TRANSLATION_KEY = 'quran_translation';
const MIN_FONT = 16;
const MAX_FONT = 34;
// Height of AudioPlayerBar (used to pad the bottom of the list)
const PLAYER_BAR_H = 70;

// ─── AyahCard ─────────────────────────────────────────────────────────────────
// Extracted as its own component so it can use hooks (useSharedValue etc.)

interface AyahCardProps {
  item: Ayah;
  isActive: boolean;
  isBookmarked: boolean;
  isSurahPlaying: boolean;
  arabicFontSize: number;
  tafsirEnabled: boolean;
  tafsirText: string;
  colors: ReturnType<typeof import('@/hooks/useColors').useColors>;
  surahNum: number;
  totalAyahs: number;
  onBookmark: (item: Ayah) => void;
  onShare: (item: Ayah) => void;
  onPoster: (item: Ayah) => void;
  onPlay: (ayah: number) => void;
  onStop: () => void;
}

const AyahCard = memo(function AyahCard({
  item, isActive, isBookmarked, arabicFontSize, tafsirEnabled, tafsirText,
  colors, surahNum, totalAyahs, onBookmark, onShare, onPoster, onPlay, onStop,
}: AyahCardProps) {
  // Animated glow — pulses when this ayah is the active one
  const glow = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      glow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 650 }),
          withTiming(0.25, { duration: 650 }),
        ),
        -1,
        true,
      );
    } else {
      glow.value = withTiming(0, { duration: 300 });
    }
  }, [isActive]);

  const animStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      glow.value,
      [0, 1],
      ['transparent', colors.primary],
    );
    return {
      borderColor,
      borderWidth: 1.5,
      backgroundColor: isActive
        ? colors.primary + '18'
        : colors.card,
    };
  });

  return (
    <Animated.View style={[styles.ayahCard, animStyle]}>
      {/* Header row */}
      <View style={styles.ayahHeader}>
        <View style={[styles.ayahNum, { backgroundColor: isActive ? colors.primary : colors.surfaceAlt }]}>
          <Text style={[styles.ayahNumText, { color: isActive ? '#fff' : colors.mutedForeground }]}>
            {item.numberInSurah}
          </Text>
        </View>
        <View style={styles.ayahActions}>
          <TouchableOpacity onPress={() => onBookmark(item)} style={styles.actionBtn} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <Feather name="bookmark" size={16} color={isBookmarked ? colors.gold : colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onShare(item)} style={styles.actionBtn} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <Feather name="share-2" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPoster(item)} style={styles.actionBtn} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <Feather name="image" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => isActive ? onStop() : onPlay(item.numberInSurah)}
            style={[styles.playBtn, { backgroundColor: isActive ? colors.primary : colors.surfaceAlt }]}
          >
            <Feather name={isActive ? 'pause' : 'play'} size={14} color={isActive ? '#fff' : colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Arabic text */}
      <Text style={[styles.arabicText, { color: colors.foreground, fontSize: arabicFontSize, lineHeight: arabicFontSize * 1.8 }]}>
        {item.text}
      </Text>

      {/* Translation */}
      <Text style={[styles.translationText, { color: colors.mutedForeground }]}>
        {item.translation}
      </Text>

      {/* Tafsir */}
      {tafsirEnabled && tafsirText ? (
        <View style={[styles.tafsirBox, { backgroundColor: colors.surfaceAlt, borderLeftColor: colors.gold }]}>
          <Text style={[styles.tafsirLabel, { color: colors.gold }]}>📖 Tafsir</Text>
          <Text style={[styles.tafsirText, { color: colors.foreground }]}>{tafsirText}</Text>
        </View>
      ) : null}
    </Animated.View>
  );
});

// ─── Poster Modal ─────────────────────────────────────────────────────────────

interface PosterProps {
  visible: boolean;
  item: Ayah | null;
  surahName: string;
  surahNameArabic: string;
  surahNum: number;
  colors: ReturnType<typeof import('@/hooks/useColors').useColors>;
  onClose: () => void;
}

function PosterModal({ visible, item, surahName, surahNameArabic, surahNum, colors, onClose }: PosterProps) {
  const posterRef = useRef<View>(null);
  const [sharing, setSharing] = useState(false);

  const handleShareImage = async () => {
    if (!posterRef.current) return;
    setSharing(true);
    try {
      const uri = await captureRef(posterRef, {
        format: 'jpg',
        quality: 0.95,
        result: 'tmpfile',
      });
      if (await ExpoSharing.isAvailableAsync()) {
        await ExpoSharing.shareAsync(uri, { mimeType: 'image/jpeg' });
      } else {
        Alert.alert('Sharing not supported', 'Your device does not support image sharing.');
      }
    } catch (e) {
      console.warn('Poster capture error:', e);
      Alert.alert('Error', 'Could not create poster. Try sharing as text instead.');
    } finally {
      setSharing(false);
    }
  };

  const handleShareText = () => {
    if (!item) return;
    const ref = `Quran ${surahName} (${surahNameArabic}) ${surahNum}:${item.numberInSurah}`;
    Share.share({
      message: `${item.text}\n\n${item.translation}\n\n— ${ref}\n\n✨ Deen o Dunya`,
    });
  };

  if (!item) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.posterOverlay}>
        <View style={[styles.posterSheet, { backgroundColor: colors.background }]}>
          {/* Sheet header */}
          <View style={styles.posterSheetHeader}>
            <Text style={[styles.posterSheetTitle, { color: colors.foreground }]}>Share Poster</Text>
            <TouchableOpacity onPress={onClose} style={[styles.posterCloseBtn, { backgroundColor: colors.surfaceAlt }]}>
              <Feather name="x" size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          {/* ── The poster itself — captured by captureRef ── */}
          <View ref={posterRef} collapsable={false} style={styles.posterCapture}>
            <LinearGradient
              colors={['#0A1628', '#0E2340', '#0D3B2E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.posterGradient}
            >
              {/* Decorative top band */}
              <View style={styles.posterTopBand}>
                <Text style={styles.posterBismillah}>﷽</Text>
              </View>

              {/* Gold ornament line */}
              <View style={styles.posterOrnamentRow}>
                <View style={[styles.posterLine, { backgroundColor: '#C9A84C44' }]} />
                <Text style={styles.posterStar}>✦</Text>
                <View style={[styles.posterLine, { backgroundColor: '#C9A84C44' }]} />
              </View>

              {/* Surah reference badge */}
              <View style={styles.posterRefRow}>
                <View style={styles.posterRefBadge}>
                  <Text style={styles.posterRefText}>
                    {surahName}  {surahNum}:{item.numberInSurah}
                  </Text>
                </View>
                <Text style={styles.posterRefArabic}>{surahNameArabic}</Text>
              </View>

              {/* Arabic ayah text */}
              <Text style={styles.posterArabic}>{item.text}</Text>

              {/* Ornament divider */}
              <View style={styles.posterOrnamentRow}>
                <View style={[styles.posterLine, { backgroundColor: '#C9A84C33' }]} />
                <Text style={[styles.posterStar, { opacity: 0.7 }]}>❧</Text>
                <View style={[styles.posterLine, { backgroundColor: '#C9A84C33' }]} />
              </View>

              {/* Translation */}
              <Text style={styles.posterTranslation}>{item.translation}</Text>

              {/* Footer */}
              <View style={styles.posterFooter}>
                <Text style={styles.posterApp}>✨  Deen o Dunya</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Action buttons */}
          <View style={styles.posterActions}>
            <TouchableOpacity
              style={[styles.posterActionBtn, { backgroundColor: colors.primary }]}
              onPress={handleShareImage}
              disabled={sharing}
            >
              <Feather name="image" size={16} color="#fff" />
              <Text style={styles.posterActionText}>
                {sharing ? 'Creating…' : 'Share as Image'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.posterActionBtn, { backgroundColor: colors.surfaceAlt }]}
              onPress={handleShareText}
            >
              <Feather name="share-2" size={16} color={colors.foreground} />
              <Text style={[styles.posterActionText, { color: colors.foreground }]}>Share as Text</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function QuranSurahScreen() {
  const { surah: surahParam } = useLocalSearchParams<{ surah: string }>();
  const surahNum  = parseInt(surahParam || '1', 10);
  const surahInfo = SURAHS.find(s => s.id === surahNum);
  const colors    = useColors();
  const { language } = useLanguage();
  const { play, stop, isPlaying, currentSurah, currentAyah, currentQari, setQari } = useAudio();
  const navigation = useNavigation();

  const [ayahs,   setAyahs]   = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Settings
  const [selectedTranslation,    setSelectedTranslation]    = useState(TRANSLATION_EDITIONS[0]);
  const [arabicFontSize,         setArabicFontSize]         = useState(22);
  const [showSettings,           setShowSettings]           = useState(false);
  const [showQariPicker,         setShowQariPicker]         = useState(false);
  const [showTranslationPicker,  setShowTranslationPicker]  = useState(false);

  // Tafsir
  const [tafsirEnabled,  setTafsirEnabled]  = useState(false);
  const [selectedTafsir, setSelectedTafsir] = useState(TAFSEER_EDITIONS[0]);
  const [tafsirData,     setTafsirData]     = useState<Record<number, string>>({});
  const [tafsirLoading,  setTafsirLoading]  = useState(false);

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());

  // Jump to ayah
  const [showJumpModal, setShowJumpModal] = useState(false);
  const [jumpInput,     setJumpInput]     = useState('');

  // Poster
  const [posterItem, setPosterItem] = useState<Ayah | null>(null);

  const flatListRef = useRef<FlatList>(null);
  const isSurahPlaying = isPlaying && currentSurah === surahNum;

  // ── Load persisted settings ────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const [storedFont, storedTrans] = await Promise.all([
        AsyncStorage.getItem(FONT_SIZE_KEY),
        AsyncStorage.getItem(TRANSLATION_KEY),
      ]);
      if (storedFont) setArabicFontSize(parseInt(storedFont, 10));
      if (storedTrans) {
        const found = TRANSLATION_EDITIONS.find(e => e.id === storedTrans);
        if (found) setSelectedTranslation(found);
      }
    })();
  }, []);

  // ── Load bookmarks ─────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(BOOKMARKS_KEY);
        if (raw) {
          const list: BookmarkedAyah[] = JSON.parse(raw);
          setBookmarks(new Set(list.filter(b => b.surah === surahNum).map(b => b.ayah)));
        }
      } catch { /* ignore */ }
    })();
  }, [surahNum]);

  // ── Nav title ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (surahInfo) navigation.setOptions({ title: `${surahNum}. ${surahInfo.nameEnglish}` });
  }, [surahInfo, navigation, surahNum]);

  // ── Fetch ayahs ───────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null); setAyahs([]); setTafsirData({});
    const editions = `ar.uthmani,${selectedTranslation.id}`;
    fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/editions/${editions}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        if (data.code !== 200) throw new Error('API error');
        const arAyahs: { numberInSurah: number; text: string }[] = data.data[0].ayahs;
        const trAyahs: { numberInSurah: number; text: string }[] = data.data[1].ayahs;
        setAyahs(arAyahs.map((a, i) => ({
          numberInSurah: a.numberInSurah,
          text: a.text,
          translation: trAyahs[i]?.text ?? '',
        })));
      })
      .catch(() => { if (!cancelled) setError('Failed to load surah. Check your connection.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [surahNum, selectedTranslation.id, retryCount]);

  // ── Auto-scroll to active ayah when playback advances ─────────────────────
  useEffect(() => {
    if (!isSurahPlaying || ayahs.length === 0) return;
    const index = ayahs.findIndex(a => a.numberInSurah === currentAyah);
    if (index < 0) return;
    // Short delay so the list has rendered before scrolling
    const t = setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.35 });
    }, 150);
    return () => clearTimeout(t);
  }, [currentAyah, isSurahPlaying, ayahs.length]);

  // ── Fetch tafsir ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!tafsirEnabled || ayahs.length === 0) return;
    let cancelled = false;
    setTafsirLoading(true);
    fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/${selectedTafsir.id}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        if (data.code !== 200) throw new Error();
        const map: Record<number, string> = {};
        (data.data.ayahs as { numberInSurah: number; text: string }[]).forEach(a => {
          map[a.numberInSurah] = a.text;
        });
        setTafsirData(map);
      })
      .catch(() => {
        if (!cancelled) Alert.alert('Tafsir unavailable', 'Could not load this tafsir.');
      })
      .finally(() => { if (!cancelled) setTafsirLoading(false); });
    return () => { cancelled = true; };
  }, [tafsirEnabled, selectedTafsir.id, surahNum, ayahs.length]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleFontChange = (delta: number) => {
    setArabicFontSize(prev => {
      const next = Math.min(MAX_FONT, Math.max(MIN_FONT, prev + delta));
      AsyncStorage.setItem(FONT_SIZE_KEY, String(next));
      return next;
    });
  };

  const handleTranslationSelect = (edition: typeof TRANSLATION_EDITIONS[0]) => {
    setSelectedTranslation(edition);
    AsyncStorage.setItem(TRANSLATION_KEY, edition.id);
    setShowTranslationPicker(false);
    setShowSettings(false);
  };

  const handleTafsirEditionSelect = (edition: typeof TAFSEER_EDITIONS[0]) => {
    setSelectedTafsir(edition);
    setTafsirData({});
  };

  const toggleBookmark = useCallback(async (item: Ayah) => {
    try {
      const raw = await AsyncStorage.getItem(BOOKMARKS_KEY);
      let list: BookmarkedAyah[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex(b => b.surah === surahNum && b.ayah === item.numberInSurah);
      if (idx >= 0) {
        list.splice(idx, 1);
      } else {
        list.push({
          surah: surahNum, ayah: item.numberInSurah,
          surahName: surahInfo?.name ?? '',
          surahNameEnglish: surahInfo?.nameEnglish ?? '',
          arabicText: item.text, translation: item.translation,
          savedAt: new Date().toISOString(),
        });
      }
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
      setBookmarks(new Set(list.filter(b => b.surah === surahNum).map(b => b.ayah)));
    } catch { /* ignore */ }
  }, [surahNum, surahInfo]);

  const handleShare = useCallback((item: Ayah) => {
    Share.share({
      message: `${item.text}\n\n${item.translation}\n\n— Quran, ${surahInfo?.nameEnglish} ${surahNum}:${item.numberInSurah}`,
    });
  }, [surahNum, surahInfo]);

  const handleJump = () => {
    const n = parseInt(jumpInput, 10);
    if (isNaN(n) || n < 1 || n > ayahs.length) return;
    flatListRef.current?.scrollToIndex({ index: n - 1, animated: true, viewPosition: 0 });
    setShowJumpModal(false);
    setJumpInput('');
  };

  const handlePlayAll = () => {
    if (isSurahPlaying) stop();
    else play(surahNum, 1, ayahs.length);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const renderAyah = useCallback(({ item }: { item: Ayah }) => (
    <AyahCard
      item={item}
      isActive={isSurahPlaying && currentAyah === item.numberInSurah}
      isBookmarked={bookmarks.has(item.numberInSurah)}
      isSurahPlaying={isSurahPlaying}
      arabicFontSize={arabicFontSize}
      tafsirEnabled={tafsirEnabled}
      tafsirText={tafsirData[item.numberInSurah] ?? ''}
      colors={colors}
      surahNum={surahNum}
      totalAyahs={ayahs.length}
      onBookmark={toggleBookmark}
      onShare={handleShare}
      onPoster={setPosterItem}
      onPlay={(ayah) => play(surahNum, ayah, ayahs.length)}
      onStop={stop}
    />
  ), [isSurahPlaying, currentAyah, bookmarks, arabicFontSize, tafsirEnabled, tafsirData,
      colors, surahNum, ayahs.length, toggleBookmark, handleShare, play, stop]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Loading surah…</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <Feather name="wifi-off" size={48} color={colors.mutedForeground} />
        <Text style={[styles.errorText, { color: colors.foreground }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryBtn, { backgroundColor: colors.primary }]}
          onPress={() => setRetryCount(c => c + 1)}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>

      {/* ── Surah header ── */}
      <View style={[styles.surahHeader, { backgroundColor: colors.card }]}>
        <View style={styles.surahInfo}>
          <Text style={[styles.surahArabic, { color: colors.gold }]}>{surahInfo?.name}</Text>
          <Text style={[styles.surahMeta, { color: colors.mutedForeground }]}>
            {surahInfo?.revelationType} · {ayahs.length} verses
          </Text>
        </View>
        <View style={styles.headerControls}>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => setShowJumpModal(true)}>
            <Feather name="hash" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => setShowSettings(v => !v)}>
            <Feather name="sliders" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.playAllBtn, { backgroundColor: isSurahPlaying ? colors.destructive : colors.primary }]}
            onPress={handlePlayAll}
          >
            <Feather name={isSurahPlaying ? 'square' : 'play'} size={15} color="#fff" />
            <Text style={styles.playAllText}>{isSurahPlaying ? 'Stop' : 'Play All'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Settings panel ── */}
      {showSettings && (
        <View style={[styles.settingsPanel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Font size */}
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.foreground }]}>Arabic Font</Text>
            <View style={styles.fontControls}>
              <TouchableOpacity onPress={() => handleFontChange(-2)} style={[styles.fontBtn, { backgroundColor: colors.surfaceAlt }]}>
                <Text style={[styles.fontBtnText, { color: colors.foreground }]}>A−</Text>
              </TouchableOpacity>
              <Text style={[styles.fontSize, { color: colors.mutedForeground }]}>{arabicFontSize}px</Text>
              <TouchableOpacity onPress={() => handleFontChange(2)} style={[styles.fontBtn, { backgroundColor: colors.surfaceAlt }]}>
                <Text style={[styles.fontBtnText, { color: colors.foreground }]}>A+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Translation */}
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.foreground }]}>Translation</Text>
            <TouchableOpacity onPress={() => setShowTranslationPicker(v => !v)} style={[styles.pickerBtn, { backgroundColor: colors.surfaceAlt }]}>
              <Text style={[styles.pickerBtnText, { color: colors.primary }]} numberOfLines={1}>{selectedTranslation.name}</Text>
              <Feather name="chevron-down" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
          {showTranslationPicker && (
            <View style={[styles.dropdownList, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {TRANSLATION_EDITIONS.map(ed => (
                <TouchableOpacity
                  key={ed.id}
                  style={[styles.dropdownItem, ed.id === selectedTranslation.id && { backgroundColor: colors.primary + '22' }]}
                  onPress={() => handleTranslationSelect(ed)}
                >
                  <Text style={[styles.dropdownText, { color: ed.id === selectedTranslation.id ? colors.primary : colors.foreground }]}>{ed.name}</Text>
                  {ed.id === selectedTranslation.id && <Feather name="check" size={14} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Tafsir */}
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.foreground }]}>
              Tafsir {tafsirLoading ? '(loading…)' : ''}
            </Text>
            <View style={styles.tafsirRow}>
              {TAFSEER_EDITIONS.map(ed => (
                <TouchableOpacity
                  key={ed.id}
                  style={[
                    styles.tafsirEdBtn, { backgroundColor: colors.surfaceAlt },
                    selectedTafsir.id === ed.id && tafsirEnabled && { backgroundColor: colors.primary + '33', borderColor: colors.primary },
                  ]}
                  onPress={() => {
                    if (tafsirEnabled && selectedTafsir.id === ed.id) {
                      setTafsirEnabled(false);
                    } else {
                      handleTafsirEditionSelect(ed);
                      setTafsirEnabled(true);
                    }
                  }}
                >
                  <Text style={[styles.tafsirEdText, { color: selectedTafsir.id === ed.id && tafsirEnabled ? colors.primary : colors.mutedForeground }]}>
                    {ed.name.split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              ))}
              {tafsirEnabled && (
                <TouchableOpacity onPress={() => setTafsirEnabled(false)} style={[styles.tafsirEdBtn, { backgroundColor: colors.destructive + '22' }]}>
                  <Text style={{ color: colors.destructive, fontSize: 11 }}>Off</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Reciter */}
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.foreground }]}>Reciter</Text>
            <TouchableOpacity onPress={() => setShowQariPicker(v => !v)} style={[styles.pickerBtn, { backgroundColor: colors.surfaceAlt }]}>
              <Text style={[styles.pickerBtnText, { color: colors.primary }]} numberOfLines={1}>{currentQari.name}</Text>
              <Feather name="chevron-down" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
          {showQariPicker && (
            <ScrollView style={[styles.dropdownList, { backgroundColor: colors.card, borderColor: colors.border, maxHeight: 220 }]}>
              {QARIS.map(q => (
                <TouchableOpacity
                  key={q.id}
                  style={[styles.dropdownItem, q.id === currentQari.id && { backgroundColor: colors.primary + '22' }]}
                  onPress={() => { setQari(q); setShowQariPicker(false); }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.dropdownText, { color: q.id === currentQari.id ? colors.primary : colors.foreground }]}>{q.name}</Text>
                    <Text style={[styles.dropdownSub, { color: colors.mutedForeground }]}>{q.arabicName} · {q.style}</Text>
                  </View>
                  {q.id === currentQari.id && <Feather name="check" size={14} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* ── Ayah list ── */}
      <FlatList
        ref={flatListRef}
        data={ayahs}
        keyExtractor={a => String(a.numberInSurah)}
        renderItem={renderAyah}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        onScrollToIndexFailed={({ index }) => {
          setTimeout(() => flatListRef.current?.scrollToIndex({ index, animated: true }), 400);
        }}
        ListHeaderComponent={
          surahNum !== 9 ? (
            <View style={[styles.basmalah, { backgroundColor: colors.card }]}>
              <Text style={[styles.basmalahText, { color: colors.gold }]}>
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={() => (
          // Extra space = player bar + bottom safe area clearance
          <View style={{ height: PLAYER_BAR_H + 80 }} />
        )}
      />

      {/* ── Jump to ayah modal ── */}
      <Modal visible={showJumpModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowJumpModal(false)}>
          <View style={[styles.jumpModal, { backgroundColor: colors.card }]}>
            <Text style={[styles.jumpTitle, { color: colors.foreground }]}>Go to Ayah</Text>
            <Text style={[styles.jumpSub, { color: colors.mutedForeground }]}>1 – {ayahs.length}</Text>
            <TextInput
              style={[styles.jumpInput, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]}
              keyboardType="number-pad"
              value={jumpInput}
              onChangeText={setJumpInput}
              placeholder="Ayah number"
              placeholderTextColor={colors.mutedForeground}
              autoFocus
            />
            <TouchableOpacity style={[styles.jumpBtn, { backgroundColor: colors.primary }]} onPress={handleJump}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Go</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── Poster modal ── */}
      <PosterModal
        visible={posterItem !== null}
        item={posterItem}
        surahName={surahInfo?.nameEnglish ?? ''}
        surahNameArabic={surahInfo?.name ?? ''}
        surahNum={surahNum}
        colors={colors}
        onClose={() => setPosterItem(null)}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 15, marginTop: 8 },
  errorText: { fontSize: 15, textAlign: 'center', marginTop: 12, paddingHorizontal: 32 },
  retryBtn: { marginTop: 12, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },

  surahHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  surahInfo: { flex: 1 },
  surahArabic: { fontSize: 20, fontWeight: '700' },
  surahMeta: { fontSize: 12, marginTop: 2 },
  headerControls: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  iconBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  playAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18 },
  playAllText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  settingsPanel: { borderBottomWidth: 1, paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 36 },
  settingLabel: { fontSize: 13, fontWeight: '600', flex: 1 },
  fontControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  fontBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  fontBtnText: { fontSize: 13, fontWeight: '700' },
  fontSize: { fontSize: 12, minWidth: 36, textAlign: 'center' },
  pickerBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, maxWidth: 180 },
  pickerBtnText: { fontSize: 12, fontWeight: '600', flex: 1 },
  dropdownList: { borderRadius: 10, borderWidth: 1, marginTop: 4, overflow: 'hidden' },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 10 },
  dropdownText: { fontSize: 13, fontWeight: '500' },
  dropdownSub: { fontSize: 11, marginTop: 2 },
  tafsirRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tafsirEdBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: 'transparent' },
  tafsirEdText: { fontSize: 11, fontWeight: '600' },

  list: { paddingHorizontal: 16, paddingTop: 8 },
  basmalah: { padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  basmalahText: { fontSize: 18, textAlign: 'center', lineHeight: 30 },

  // AyahCard styles
  ayahCard: { borderRadius: 14, padding: 16, marginBottom: 10 },
  ayahHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  ayahNum: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  ayahNumText: { fontSize: 13, fontWeight: '700' },
  ayahActions: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  actionBtn: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  playBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  arabicText: { textAlign: 'right', marginBottom: 10 },
  translationText: { fontSize: 14, lineHeight: 22, marginBottom: 4 },
  tafsirBox: { marginTop: 10, padding: 12, borderRadius: 10, borderLeftWidth: 3 },
  tafsirLabel: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  tafsirText: { fontSize: 13, lineHeight: 21 },

  // Jump modal
  modalOverlay: { flex: 1, backgroundColor: '#00000088', alignItems: 'center', justifyContent: 'center' },
  jumpModal: { width: 260, borderRadius: 18, padding: 24, alignItems: 'center', gap: 12 },
  jumpTitle: { fontSize: 17, fontWeight: '700' },
  jumpSub: { fontSize: 12 },
  jumpInput: { width: '100%', borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 20, textAlign: 'center' },
  jumpBtn: { width: '100%', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },

  // Poster modal
  posterOverlay: { flex: 1, backgroundColor: '#000000CC', justifyContent: 'flex-end' },
  posterSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 36 },
  posterSheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16,
  },
  posterSheetTitle: { fontSize: 18, fontWeight: '700' },
  posterCloseBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  posterCapture: { marginHorizontal: 16, borderRadius: 20, overflow: 'hidden' },
  posterGradient: { padding: 28 },
  posterTopBand: { alignItems: 'center', marginBottom: 12 },
  posterBismillah: { fontSize: 26, color: '#C9A84C', textAlign: 'center' },
  posterOrnamentRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 12 },
  posterLine: { flex: 1, height: 1 },
  posterStar: { fontSize: 14, color: '#C9A84C' },
  posterRefRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  posterRefBadge: { backgroundColor: '#C9A84C22', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 5 },
  posterRefText: { color: '#C9A84C', fontSize: 12, fontWeight: '700' },
  posterRefArabic: { color: '#C9A84C', fontSize: 14, fontWeight: '700' },
  posterArabic: { color: '#F0EDE5', fontSize: 22, textAlign: 'right', lineHeight: 40, fontWeight: '500', marginBottom: 16 },
  posterTranslation: { color: 'rgba(240,237,229,0.82)', fontSize: 13, lineHeight: 22, textAlign: 'center' },
  posterFooter: { alignItems: 'center', marginTop: 20 },
  posterApp: { color: 'rgba(201,168,76,0.7)', fontSize: 12, letterSpacing: 1 },
  posterActions: {
    flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginTop: 16,
  },
  posterActionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 13, borderRadius: 14,
  },
  posterActionText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
