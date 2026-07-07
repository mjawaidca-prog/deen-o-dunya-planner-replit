import React, { useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/constants/translations';

const LANGUAGES: { code: Language; label: string; nativeLabel: string; flag: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇺🇸' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', flag: '🇸🇦' },
  { code: 'ur', label: 'Urdu', nativeLabel: 'اردو', flag: '🇵🇰' },
];

export default function Onboarding() {
  const { setLanguage, completeOnboarding, language } = useLanguage();
  const [selected, setSelected] = useState<Language>(language);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      // Persist onboarding BEFORE setLanguage — setLanguage may trigger
      // reloadAppAsync() for RTL switches which would prevent completeOnboarding
      // from running and leave the user stuck in the onboarding loop.
      await completeOnboarding();
      await setLanguage(selected);
      // Navigate to root; app/index.tsx sees isOnboarded=true and redirects to /(tabs).
      // This is more reliable than targeting /(tabs) directly from here.
      router.replace('/');
    } catch {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logoRing}>
          <Text style={styles.logoEmoji}>☪️</Text>
        </View>
        <Text style={styles.appName}>Deen o Dunya</Text>
        <Text style={styles.subtitle}>Your Complete Islamic Companion</Text>
        <Text style={styles.arabicSub}>رفيقك الإسلامي الشامل</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Select Your Language / اپنی زبان منتخب کریں / اختر لغتك</Text>

        {LANGUAGES.map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.langCard, selected === lang.code && styles.langCardActive]}
            onPress={() => setSelected(lang.code)}
            activeOpacity={0.8}
          >
            <Text style={styles.flag}>{lang.flag}</Text>
            <View style={styles.langInfo}>
              <Text style={[styles.langLabel, selected === lang.code && styles.langLabelActive]}>
                {lang.nativeLabel}
              </Text>
              <Text style={styles.langSub}>{lang.label}</Text>
            </View>
            {selected === lang.code && (
              <View style={styles.checkCircle}>
                <Text style={styles.checkMark}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.startBtn} onPress={handleStart} activeOpacity={0.85} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.startBtnText}>
            {selected === 'ar' ? 'ابدأ الآن' : selected === 'ur' ? 'شروع کریں' : 'Get Started'}
          </Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footer}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628', paddingHorizontal: 24 },
  hero: { alignItems: 'center', paddingTop: 48, paddingBottom: 32 },
  logoRing: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#1A2B40', borderWidth: 2, borderColor: '#C9A84C',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  logoEmoji: { fontSize: 48 },
  appName: { fontSize: 28, fontWeight: '700', color: '#F0EDE5', letterSpacing: 0.5 },
  subtitle: { fontSize: 14, color: '#8BA3B8', marginTop: 6 },
  arabicSub: { fontSize: 14, color: '#C9A84C', marginTop: 4 },
  section: { flex: 1, justifyContent: 'center', gap: 12 },
  sectionLabel: { fontSize: 12, color: '#8BA3B8', textAlign: 'center', marginBottom: 8, lineHeight: 18 },
  langCard: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: '#132235', borderRadius: 16,
    padding: 16, borderWidth: 1.5, borderColor: '#1E3348',
  },
  langCardActive: { borderColor: '#C9A84C', backgroundColor: '#1A2B40' },
  flag: { fontSize: 32 },
  langInfo: { flex: 1 },
  langLabel: { fontSize: 18, fontWeight: '600', color: '#F0EDE5' },
  langLabelActive: { color: '#C9A84C' },
  langSub: { fontSize: 13, color: '#8BA3B8', marginTop: 2 },
  checkCircle: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#C9A84C',
    alignItems: 'center', justifyContent: 'center',
  },
  checkMark: { color: '#0A1628', fontWeight: '700', fontSize: 16 },
  startBtn: {
    backgroundColor: '#2D9B6B', borderRadius: 16, paddingVertical: 18,
    alignItems: 'center', marginBottom: 12,
  },
  startBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
  footer: { textAlign: 'center', color: '#C9A84C', fontSize: 16, marginBottom: 24, letterSpacing: 1 },
});
