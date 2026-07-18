/**
 * PosterModal — Islamic-style shareable poster (parchment / gold design).
 * Matches the Deen o Dunya brand aesthetic: cream parchment, gold borders,
 * forest-green Arabic, warm-green translation text.
 *
 * Uses react-native-view-shot to capture the poster as a real JPG image,
 * then shares via expo-sharing.
 */

import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const SCREEN_HEIGHT = Dimensions.get("window").height;
import { Feather } from "@expo/vector-icons";
import { captureRef } from "react-native-view-shot";
import * as ExpoSharing from "expo-sharing";

export interface PosterItem {
  /** Surah reference label, e.g. "Al-Baqarah 2:255" */
  eyebrow: string;
  /** Arabic ayah / hadith text */
  ar: string;
  /** English translation */
  en?: string;
  /** Urdu translation */
  ur?: string;
}

interface Props {
  visible: boolean;
  item: PosterItem | null;
  onClose: () => void;
}

export default function PosterModal({ visible, item, onClose }: Props) {
  const posterRef = useRef<View>(null);
  const [sharing, setSharing] = useState(false);
  const [selectedLangs, setSelectedLangs] = useState<Set<"ar" | "en" | "ur">>(
    new Set(["ar", "en", "ur"]),
  );
  const [manualLangOverride, setManualLangOverride] = useState(false);
  React.useEffect(() => {
    setManualLangOverride(false);
  }, [item?.eyebrow]);
  React.useEffect(() => {
    if (!item || manualLangOverride) return;
    const ids: ("ar" | "en" | "ur")[] = ["ar"];
    if (item.en) ids.push("en");
    if (item.ur) ids.push("ur");
    setSelectedLangs(new Set(ids));
  }, [item, manualLangOverride]);
  const toggleLang = (id: "ar" | "en" | "ur") => {
    setManualLangOverride(true);
    setSelectedLangs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (!item) return null;

  const handleShareImage = async () => {
    if (!posterRef.current) return;
    setSharing(true);
    try {
      const uri = await captureRef(posterRef, {
        format: "jpg",
        quality: 0.97,
        result: "tmpfile",
      });
      if (await ExpoSharing.isAvailableAsync()) {
        await ExpoSharing.shareAsync(uri, { mimeType: "image/jpeg" });
      } else {
        Alert.alert(
          "Not supported",
          "Image sharing is not available on this device.",
        );
      }
    } catch (e) {
      console.warn("Poster capture error:", e);
      Alert.alert(
        "Error",
        'Could not create image — try "Share as Text" instead.',
      );
    } finally {
      setSharing(false);
    }
  };

  const handleShareText = () => {
    const lines: string[] = [];
    if (selectedLangs.has("ar")) lines.push(item.ar);
    if (item.en && selectedLangs.has("en")) lines.push("\n" + item.en);
    if (item.ur && selectedLangs.has("ur")) lines.push("\n" + item.ur);
    lines.push("\n— " + item.eyebrow);
    lines.push("\n☾ Deen o Dunya Planner");
    Share.share({ message: lines.join("\n") });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Sheet header — always visible */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Share Poster</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={18} color="#6B7869" />
            </TouchableOpacity>
          </View>
          {item.en || item.ur ? (
            <View style={styles.langToggleRow}>
              {(["ar", "en", "ur"] as const)
                .filter(
                  (id) => id === "ar" || (id === "en" ? item.en : item.ur),
                )
                .map((id) => {
                  const active = selectedLangs.has(id);
                  const label =
                    id === "ar" ? "Arabic" : id === "en" ? "English" : "Urdu";
                  return (
                    <TouchableOpacity
                      key={id}
                      onPress={() => toggleLang(id)}
                      style={[
                        styles.langToggleChip,
                        active && styles.langToggleChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.langToggleText,
                          active && styles.langToggleTextActive,
                        ]}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          ) : null}
          {/* Poster — scrollable so it never hides the buttons */}
          <ScrollView
            style={styles.posterScroll}
            contentContainerStyle={{ paddingBottom: 4 }}
            showsVerticalScrollIndicator={false}
          >
            <View
              ref={posterRef}
              collapsable={false}
              style={styles.captureWrapper}
            >
              <LinearGradient
                colors={["#FDFAF1", "#F5EDD8", "#F2EAD6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.posterBg}
              >
                <View style={styles.outerBorder}>
                  <View style={styles.innerBorder}>
                    <Text style={styles.bismillah}>﷽</Text>
                    <View style={styles.ornamentRow}>
                      <View style={styles.ornLine} />
                      <Text style={styles.ornStar}>✦</Text>
                      <View style={styles.ornLine} />
                    </View>
                    <View style={styles.eyebrowRow}>
                      <Text style={styles.eyebrowText}>
                        {item.eyebrow.toUpperCase()}
                      </Text>
                    </View>
                    {selectedLangs.has("ar") && (
                      <Text style={styles.arabicText}>{item.ar}</Text>
                    )}
                    {((item.en && selectedLangs.has("en")) ||
                      (item.ur && selectedLangs.has("ur"))) && (
                      <View
                        style={[styles.ornamentRow, { marginVertical: 10 }]}
                      >
                        <View style={[styles.ornLine, { opacity: 0.5 }]} />
                        <Text
                          style={[
                            styles.ornStar,
                            { opacity: 0.6, fontSize: 11 },
                          ]}
                        >
                          ❧
                        </Text>
                        <View style={[styles.ornLine, { opacity: 0.5 }]} />
                      </View>
                    )}
                    {item.en && selectedLangs.has("en") ? (
                      <Text style={styles.englishText}>{item.en}</Text>
                    ) : null}
                    {item.ur && selectedLangs.has("ur") ? (
                      <>
                        {item.en && selectedLangs.has("en") ? (
                          <View style={{ height: 10 }} />
                        ) : null}
                        <Text style={styles.urduText}>{item.ur}</Text>
                      </>
                    ) : null}
                    <View
                      style={[
                        styles.ornamentRow,
                        { marginTop: 18, marginBottom: 10 },
                      ]}
                    >
                      <View
                        style={[
                          styles.ornLine,
                          { backgroundColor: "#BD9A4E66" },
                        ]}
                      />
                    </View>
                    <Text style={styles.footerText}>
                      ☾ Deen o Dunya Planner
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </ScrollView>
          {/* Action buttons — always visible */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnPrimary]}
              onPress={handleShareImage}
              disabled={sharing}
            >
              <Feather name="image" size={16} color="#fff" />
              <Text style={styles.actionBtnTextPrimary}>
                {sharing ? "Creating…" : "Share Image"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnSecondary]}
              onPress={handleShareText}
            >
              <Feather name="share-2" size={15} color="#0C5A3B" />
              <Text style={styles.actionBtnTextSecondary}>Share Text</Text>
            </TouchableOpacity>
          </View>
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
    paddingBottom: 36,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  posterScroll: {
    flexShrink: 1,
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

  /* Poster */
  captureWrapper: {
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: "hidden",
  },
  posterBg: {
    padding: 14,
  },
  outerBorder: {
    borderWidth: 2,
    borderColor: "#BD9A4E99",
    borderRadius: 14,
    padding: 6,
  },
  innerBorder: {
    borderWidth: 1,
    borderColor: "#BD9A4E55",
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 18,
    alignItems: "center",
  },

  bismillah: {
    fontSize: 22,
    color: "#BD9A4E",
    textAlign: "center",
    marginBottom: 10,
  },
  ornamentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
    marginVertical: 6,
  },
  ornLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#BD9A4E88",
  },
  ornStar: {
    fontSize: 13,
    color: "#BD9A4E",
  },

  eyebrowRow: {
    marginVertical: 8,
  },
  eyebrowText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#BD9A4E",
    letterSpacing: 1.5,
    textAlign: "center",
  },

  arabicText: {
    fontSize: 24,
    lineHeight: 48,
    color: "#21302A",
    textAlign: "center",
    fontFamily: "AmiriQuran_400Regular",
    writingDirection: "rtl",
    marginVertical: 8,
  },
  englishText: {
    fontSize: 13,
    lineHeight: 21,
    color: "#44543C",
    textAlign: "center",
    fontStyle: "italic",
  },
  urduText: {
    fontSize: 16,
    lineHeight: 36,
    color: "#44543C",
    textAlign: "center",
    fontFamily: "NotoNastaliqUrdu_400Regular",
    writingDirection: "rtl",
  },

  footerText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0C5A3B",
    textAlign: "center",
    letterSpacing: 0.5,
  },

  langToggleRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
    marginBottom: 4,
  },
  langToggleChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#EDE8DE",
    borderWidth: 1,
    borderColor: "#BD9A4E55",
  },
  langToggleChipActive: { backgroundColor: "#0C5A3B", borderColor: "#0C5A3B" },
  langToggleText: { fontSize: 12, fontWeight: "700", color: "#6B7869" },
  langToggleTextActive: { color: "#fff" } /* Buttons */,
  actions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
  },
  actionBtnPrimary: {
    backgroundColor: "#0C5A3B",
  },
  actionBtnSecondary: {
    backgroundColor: "#EDE8DE",
    borderWidth: 1,
    borderColor: "#BD9A4E66",
  },
  actionBtnTextPrimary: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  actionBtnTextSecondary: {
    color: "#0C5A3B",
    fontWeight: "700",
    fontSize: 14,
  },
});
