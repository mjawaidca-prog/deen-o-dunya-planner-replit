import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  Linking,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { Qari, getAudioUrl } from "@/constants/qaris";
import { getAppOrigin } from "@/lib/runtime";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export interface QuranClipAyah {
  numberInSurah: number;
  text: string;
  /** Generic translation (used as English fallback) */
  translation: string;
  /** Explicit English translation — shown when user picks "English" */
  translationEn?: string;
  /** Explicit Urdu translation — shown when user picks "Urdu" */
  translationUr?: string;
}

export interface HadithClipItem {
  number: number;
  arabic: string;
  translation: string;
  narrator: string;
  chapter?: string;
}

interface QuranClipSource {
  surahNumber: number;
  surahName: string;
  surahEnglishName: string;
  ayahs: QuranClipAyah[];
  defaultStartAyah: number;
  defaultEndAyah: number;
  translationLabel: string;
  qaris: Qari[];
  currentQariId: string;
}

interface HadithClipSource {
  bookName: string;
  bookArabicName: string;
  item: HadithClipItem;
  translationLabel: string;
}

type Props =
  | {
      visible: boolean;
      onClose: () => void;
      mode: "quran";
      appName?: string;
      quran: QuranClipSource;
      hadith?: never;
    }
  | {
      visible: boolean;
      onClose: () => void;
      mode: "hadith";
      appName?: string;
      quran?: never;
      hadith: HadithClipSource;
    };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizeRange(start: number, end: number, max: number) {
  const safeStart = clamp(Number.isFinite(start) ? start : 1, 1, max);
  const safeEnd = clamp(Number.isFinite(end) ? end : safeStart, 1, max);
  return safeStart <= safeEnd
    ? { start: safeStart, end: safeEnd }
    : { start: safeEnd, end: safeStart };
}

export default function ClipModal(props: Props) {
  const appName = props.appName?.trim() || "Deen o Dunya Planner";
  const [startAyah, setStartAyah] = useState(
    props.mode === "quran" ? props.quran.defaultStartAyah : 1,
  );
  const [endAyah, setEndAyah] = useState(
    props.mode === "quran" ? props.quran.defaultEndAyah : 1,
  );
  const [selectedQariId, setSelectedQariId] = useState(
    props.mode === "quran" ? props.quran.currentQariId : "",
  );
  const [selectedTranslationId, setSelectedTranslationId] = useState<"en" | "ur" | "none">("en");
  const [showQariPicker, setShowQariPicker] = useState(false);
  const [creating, setCreating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!props.visible) {
      setShowQariPicker(false);
      setCreating(false);
      setError(null);
      setDownloadUrl("");
      return;
    }

    if (props.mode === "quran") {
      setStartAyah(props.quran.defaultStartAyah);
      setEndAyah(props.quran.defaultEndAyah);
      setSelectedQariId(props.quran.currentQariId);
      // Default to first available translation
      const ayahs = props.quran.ayahs;
      if (ayahs.some((a) => a.translationEn != null || a.translation)) {
        setSelectedTranslationId("en");
      } else if (ayahs.some((a) => a.translationUr != null)) {
        setSelectedTranslationId("ur");
      } else {
        setSelectedTranslationId("none");
      }
    }
  }, [props.visible, props.mode]);

  const availableTranslations = useMemo<{ id: "en" | "ur" | "none"; label: string }[]>(() => {
    if (props.mode !== "quran") return [];
    const ayahs = props.quran.ayahs;
    const opts: { id: "en" | "ur" | "none"; label: string }[] = [];
    if (ayahs.some((a) => a.translationEn != null || a.translation)) {
      opts.push({ id: "en", label: "English" });
    }
    if (ayahs.some((a) => a.translationUr != null)) {
      opts.push({ id: "ur", label: "Urdu اردو" });
    }
    opts.push({ id: "none", label: "Arabic Only" });
    return opts;
  }, [props]);

  const ayahBounds = useMemo(() => {
    if (props.mode !== "quran" || props.quran.ayahs.length === 0) return { min: 1, max: 1 };
    const nums = props.quran.ayahs.map((a) => a.numberInSurah);
    return { min: Math.min(...nums), max: Math.max(...nums) };
  }, [props.mode, props.mode === "quran" ? props.quran.ayahs : undefined]);

  const quranRange = useMemo(() => {
    if (props.mode !== "quran") return { start: 1, end: 1 };
    return normalizeRange(startAyah, endAyah, ayahBounds.max);
  }, [props.mode, startAyah, endAyah, ayahBounds]);

  const selectedQari = useMemo(() => {
    if (props.mode !== "quran") return null;
    return (
      props.quran.qaris.find((q) => q.id === selectedQariId) ??
      props.quran.qaris[0] ??
      null
    );
  }, [props.mode, selectedQariId, props]);

  const selectedSegments = useMemo(() => {
    if (props.mode !== "quran") {
      const hadith = props.hadith.item;
      return [
        {
          reference: `${props.hadith.bookName} - ${hadith.narrator}${
            hadith.chapter ? ` - ${hadith.chapter}` : ""
          }`,
          arabic: hadith.arabic,
          translation: hadith.translation,
        },
      ];
    }

    const range = quranRange;
    return props.quran.ayahs
      .filter(
        (ayah) =>
          ayah.numberInSurah >= range.start && ayah.numberInSurah <= range.end,
      )
      .map((ayah) => {
        let translation = "";
        if (selectedTranslationId === "en") {
          translation = ayah.translationEn ?? ayah.translation ?? "";
        } else if (selectedTranslationId === "ur") {
          translation = ayah.translationUr ?? "";
        }
        return {
          reference: `${props.quran.surahEnglishName} ${props.quran.surahNumber}:${ayah.numberInSurah}`,
          arabic: ayah.text,
          translation,
          audioUrl: selectedQari
            ? getAudioUrl(
                selectedQari.folder,
                props.quran.surahNumber,
                ayah.numberInSurah,
              )
            : undefined,
        };
      });
  }, [props, quranRange, selectedQari, selectedTranslationId]);

  const title =
    props.mode === "quran"
      ? props.quran.surahEnglishName
      : props.hadith.bookName;
  const subtitle =
    props.mode === "quran"
      ? `${props.quran.surahName} ${props.quran.surahNumber}:${quranRange.start}-${
          quranRange.end
        }`
      : `${props.hadith.item.narrator}${
          props.hadith.item.chapter ? ` - ${props.hadith.item.chapter}` : ""
        }`;
  const sourceLabel = props.mode === "quran" ? "Quran Clip" : "Hadith Clip";
  const translationLabel =
    props.mode === "quran"
      ? selectedTranslationId === "ur"
        ? "Urdu"
        : selectedTranslationId === "none"
        ? "Arabic Only"
        : "English"
      : props.hadith.translationLabel;

  const handleGenerate = async () => {
    const origin = getAppOrigin();
    if (!origin) {
      Alert.alert("Error", "Could not resolve the app URL.");
      return;
    }

    setCreating(true);
    setError(null);
    setDownloadUrl("");

    try {
      const response = await fetch(`${origin}/api/clips/render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appName,
          sourceLabel,
          title,
          subtitle: `${subtitle} - ${translationLabel}`,
          reciterLabel:
            props.mode === "quran" && selectedQari
              ? selectedQari.name
              : undefined,
          segments: selectedSegments,
        }),
      });

      const data = (await response.json()) as
        | { downloadUrl: string; error?: string }
        | { error: string };

      if (!response.ok) {
        throw new Error("error" in data ? data.error : "Clip render failed");
      }

      setDownloadUrl(`${origin}${(data as { downloadUrl: string }).downloadUrl}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Clip render failed");
    } finally {
      setCreating(false);
    }
  };

  const openClip = async () => {
    if (!downloadUrl) return;
    await Linking.openURL(downloadUrl);
  };

  const shareClip = async () => {
    if (!downloadUrl) return;
    await Share.share({
      message: downloadUrl,
      url: downloadUrl,
      title: `${appName} clip`,
    });
  };

  if (!props.visible) return null;

  return (
    <Modal
      visible={props.visible}
      transparent
      animationType="slide"
      onRequestClose={props.onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create Clip</Text>
            <TouchableOpacity onPress={props.onClose} style={styles.closeBtn}>
              <Feather name="x" size={18} color="#6B7869" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>{title}</Text>
              <Text style={styles.summarySub}>{subtitle}</Text>
              <Text style={styles.summaryMeta}>{translationLabel}</Text>
            </View>

            {props.mode === "quran" && (
              <>
                <View style={styles.row}>
                  <View style={styles.rowHalf}>
                    <Text style={styles.label}>Start Ayah</Text>
                    <TextInput
                      value={String(startAyah)}
                      onChangeText={(text) => setStartAyah(Number.parseInt(text || "1", 10))}
                      keyboardType="number-pad"
                      style={styles.input}
                      placeholderTextColor="#8C938C"
                    />
                  </View>
                  <View style={styles.rowHalf}>
                    <Text style={styles.label}>End Ayah</Text>
                    <TextInput
                      value={String(endAyah)}
                      onChangeText={(text) => setEndAyah(Number.parseInt(text || "1", 10))}
                      keyboardType="number-pad"
                      style={styles.input}
                      placeholderTextColor="#8C938C"
                    />
                  </View>
                </View>

                <View style={styles.rangeHintRow}>
                  <TouchableOpacity
                    onPress={() => setStartAyah((value) => Math.max(ayahBounds.min, value - 1))}
                    style={styles.stepBtn}
                  >
                    <Feather name="minus" size={14} color="#0C5A3B" />
                  </TouchableOpacity>
                  <Text style={styles.rangeHint}>
                    {quranRange.start === quranRange.end
                      ? `1 ayah selected`
                      : `${quranRange.end - quranRange.start + 1} ayahs selected`}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      setEndAyah((value) =>
                        Math.min(ayahBounds.max, value + 1),
                      )
                    }
                    style={styles.stepBtn}
                  >
                    <Feather name="plus" size={14} color="#0C5A3B" />
                  </TouchableOpacity>
                </View>

                <View style={styles.fieldBlock}>
                  <Text style={styles.label}>Reciter</Text>
                  <TouchableOpacity
                    style={styles.pickerBtn}
                    onPress={() => setShowQariPicker((value) => !value)}
                  >
                    <Text style={styles.pickerText} numberOfLines={1}>
                      {selectedQari?.name ?? "Select reciter"}
                    </Text>
                    <Feather name="chevron-down" size={14} color="#0C5A3B" />
                  </TouchableOpacity>
                  {showQariPicker && (
                    <View style={styles.dropdown}>
                      {props.quran.qaris.map((qari) => {
                        const active = qari.id === selectedQariId;
                        return (
                          <TouchableOpacity
                            key={qari.id}
                            onPress={() => {
                              setSelectedQariId(qari.id);
                              setShowQariPicker(false);
                            }}
                            style={[
                              styles.dropdownItem,
                              active && styles.dropdownItemActive,
                            ]}
                          >
                            <View style={{ flex: 1 }}>
                              <Text
                                style={[
                                  styles.dropdownLabel,
                                  active && styles.dropdownLabelActive,
                                ]}
                              >
                                {qari.name}
                              </Text>
                              <Text style={styles.dropdownSub}>
                                {qari.arabicName}
                              </Text>
                            </View>
                            {active && (
                              <Feather name="check" size={14} color="#0C5A3B" />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>

                {availableTranslations.length > 1 && (
                  <View style={styles.fieldBlock}>
                    <Text style={styles.label}>Translation</Text>
                    <View style={styles.pillRow}>
                      {availableTranslations.map((opt) => {
                        const active = selectedTranslationId === opt.id;
                        return (
                          <TouchableOpacity
                            key={opt.id}
                            onPress={() => setSelectedTranslationId(opt.id)}
                            style={[styles.pill, active && styles.pillActive]}
                          >
                            <Text style={[styles.pillText, active && styles.pillTextActive]}>
                              {opt.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}
              </>
            )}

            {props.mode === "hadith" && (
              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Source</Text>
                <View style={styles.textPill}>
                  <Text style={styles.textPillText}>
                    {props.hadith.bookArabicName}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.previewCard}>
              <Text style={styles.previewLabel}>Preview</Text>
              <Text style={styles.previewText} numberOfLines={2}>
                {selectedSegments[0]?.reference}
              </Text>
              <Text style={styles.previewText} numberOfLines={3}>
                {selectedSegments[0]?.translation}
              </Text>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {!downloadUrl ? (
              <TouchableOpacity
                onPress={handleGenerate}
                disabled={creating}
                style={[styles.primaryBtn, creating && { opacity: 0.72 }]}
              >
                <Feather name="video" size={16} color="#fff" />
                <Text style={styles.primaryBtnText}>
                  {creating ? "Rendering..." : "Generate MP4"}
                </Text>
              </TouchableOpacity>
            ) : null}

            {downloadUrl ? (
              <View style={styles.resultBlock}>
                <Video
                  source={{ uri: downloadUrl }}
                  style={styles.video}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  shouldPlay={false}
                />
                <View style={styles.resultActions}>
                  <TouchableOpacity
                    style={[styles.secondaryBtn, styles.flexBtn]}
                    onPress={openClip}
                  >
                    <Feather name="play" size={15} color="#0C5A3B" />
                    <Text style={styles.secondaryBtnText}>Open MP4</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.secondaryBtn, styles.flexBtn]}
                    onPress={shareClip}
                  >
                    <Feather name="share-2" size={15} color="#0C5A3B" />
                    <Text style={styles.secondaryBtnText}>Share Link</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FDFAF6",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingBottom: 24,
    maxHeight: SCREEN_HEIGHT * 0.92,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#21302A",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EDE8DE",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  summaryCard: {
    backgroundColor: "#F5EEDB",
    borderWidth: 1,
    borderColor: "#C9A84C55",
    borderRadius: 18,
    padding: 16,
    gap: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#21302A",
  },
  summarySub: {
    fontSize: 13,
    color: "#44543C",
    fontWeight: "600",
  },
  summaryMeta: {
    fontSize: 12,
    color: "#0C5A3B",
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  rowHalf: {
    flex: 1,
  },
  fieldBlock: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7869",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#C9A84C55",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    color: "#21302A",
  },
  rangeHintRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  stepBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EDE8DE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#C9A84C55",
  },
  rangeHint: {
    flex: 1,
    textAlign: "center",
    color: "#0C5A3B",
    fontWeight: "700",
  },
  pickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#C9A84C55",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  pickerText: {
    flex: 1,
    color: "#21302A",
    fontSize: 14,
    fontWeight: "600",
  },
  dropdown: {
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#C9A84C55",
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE6D6",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dropdownItemActive: {
    backgroundColor: "#0C5A3B14",
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#21302A",
  },
  dropdownLabelActive: {
    color: "#0C5A3B",
  },
  dropdownSub: {
    marginTop: 2,
    fontSize: 11,
    color: "#6B7869",
  },
  textPill: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#C9A84C55",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textPillText: {
    color: "#21302A",
    fontWeight: "600",
    fontSize: 14,
  },
  previewCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E8DDC3",
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#C9A84C",
    letterSpacing: 1,
  },
  previewText: {
    fontSize: 13,
    color: "#44543C",
    lineHeight: 20,
  },
  errorText: {
    color: "#B42318",
    fontSize: 13,
    fontWeight: "600",
  },
  primaryBtn: {
    backgroundColor: "#0C5A3B",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  resultBlock: {
    gap: 12,
  },
  video: {
    width: "100%",
    aspectRatio: 9 / 16,
    borderRadius: 18,
    backgroundColor: "#000",
  },
  resultActions: {
    flexDirection: "row",
    gap: 10,
  },
  flexBtn: {
    flex: 1,
  },
  secondaryBtn: {
    backgroundColor: "#EDE8DE",
    borderWidth: 1,
    borderColor: "#C9A84C55",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  secondaryBtnText: {
    color: "#0C5A3B",
    fontWeight: "700",
    fontSize: 14,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#C9A84C55",
  },
  pillActive: {
    backgroundColor: "#0C5A3B",
    borderColor: "#0C5A3B",
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#21302A",
  },
  pillTextActive: {
    color: "#FFFFFF",
  },
});
