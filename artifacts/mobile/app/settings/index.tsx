import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import { usePrayer } from '@/context/PrayerContext';
import { Language } from '@/constants/translations';

const LANGUAGES: { code: Language; label: string; native: string; flag: string }[] = [
  { code: 'en', label: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'ar', label: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'ur', label: 'Urdu', native: 'اردو', flag: '🇵🇰' },
];

const CALC_METHODS = [
  { id: 2, label: 'Islamic Society of North America (ISNA)' },
  { id: 1, label: 'Muslim World League (MWL)' },
  { id: 3, label: 'Egyptian General Authority' },
  { id: 4, label: 'Umm al-Qura (Saudi Arabia)' },
  { id: 5, label: 'University of Islamic Sciences, Karachi' },
];

type ThemeOpt = 'dark' | 'light' | 'system';

export default function SettingsScreen() {
  const colors = useColors();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useApp();
  const { calculationMethod, setCalculationMethod, adhanEnabled, setAdhanEnabled, testAdhanNotification, scheduledCount } = usePrayer();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Language */}
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{t('language').toUpperCase()}</Text>
        <View style={[styles.group, { backgroundColor: colors.card }]}>
          {LANGUAGES.map((lang, i) => (
            <TouchableOpacity
              key={lang.code}
              style={[styles.row, i < LANGUAGES.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
              onPress={() => setLanguage(lang.code)}
            >
              <Text style={styles.langFlag}>{lang.flag}</Text>
              <View style={styles.rowInfo}>
                <Text style={[styles.rowLabel, { color: colors.foreground }]}>{lang.native}</Text>
                <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>{lang.label}</Text>
              </View>
              {language === lang.code && <Feather name="check" size={18} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Theme */}
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{t('theme').toUpperCase()}</Text>
        <View style={[styles.group, { backgroundColor: colors.card }]}>
          {(['dark', 'light', 'system'] as ThemeOpt[]).map((opt, i) => (
            <TouchableOpacity
              key={opt}
              style={[styles.row, i < 2 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
              onPress={() => setTheme(opt)}
            >
              <Text style={styles.themeEmoji}>{opt === 'dark' ? '🌙' : opt === 'light' ? '☀️' : '🌓'}</Text>
              <Text style={[styles.rowLabel, { color: colors.foreground, flex: 1 }]}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </Text>
              {theme === opt && <Feather name="check" size={18} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Calculation Method */}
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{t('calcMethod').toUpperCase()}</Text>
        <View style={[styles.group, { backgroundColor: colors.card }]}>
          {CALC_METHODS.map((m, i) => (
            <TouchableOpacity
              key={m.id}
              style={[styles.row, styles.rowWrap, i < CALC_METHODS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
              onPress={() => setCalculationMethod(m.id)}
            >
              <Text style={[styles.rowLabel, { color: colors.foreground, flex: 1, fontSize: 13, lineHeight: 18 }]}>{m.label}</Text>
              {calculationMethod === m.id && <Feather name="check" size={18} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Adhan Notifications */}
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{t('notifications').toUpperCase()}</Text>
        <View style={[styles.group, { backgroundColor: colors.card }]}>
          <View style={styles.row}>
            <Text style={styles.bellEmoji}>🔔</Text>
            <View style={styles.rowInfo}>
              <Text style={[styles.rowLabel, { color: colors.foreground }]}>{t('enableNotifications')}</Text>
              <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>Play Adhan at prayer time, even when the app is closed</Text>
            </View>
            <Switch
              value={adhanEnabled}
              onValueChange={setAdhanEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
          <View style={[styles.row, { borderTopWidth: 1, borderTopColor: colors.border }]}>
            <View style={styles.rowInfo}>
              <Text style={[styles.rowLabel, { color: colors.foreground }]}>Test Adhan</Text>
              <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>
                {adhanEnabled ? `${scheduledCount} notifications scheduled` : 'Enable Adhan above to test'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={testAdhanNotification}
              disabled={!adhanEnabled}
              activeOpacity={0.7}
              style={[styles.testBtn, { backgroundColor: adhanEnabled ? colors.primary : colors.border }]}
            >
              <Text style={[styles.testBtnText, { color: adhanEnabled ? '#fff' : colors.mutedForeground }]}>Play</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>ABOUT</Text>
        <View style={[styles.group, { backgroundColor: colors.card }]}>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutEmoji}>☪️</Text>
            <Text style={[styles.aboutTitle, { color: colors.foreground }]}>Deen o Dunya Planner</Text>
            <Text style={[styles.aboutVer, { color: colors.mutedForeground }]}>Version 1.0.0</Text>
            <Text style={[styles.aboutQuote, { color: colors.gold }]}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 16 },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginHorizontal: 16, marginBottom: 6, marginTop: 16 },
  group: { marginHorizontal: 16, borderRadius: 14, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  rowWrap: { paddingVertical: 12 },
  langFlag: { fontSize: 22 },
  themeEmoji: { fontSize: 20 },
  bellEmoji: { fontSize: 20 },
  rowInfo: { flex: 1 },
  rowLabel: { fontSize: 15 },
  rowSub: { fontSize: 12, marginTop: 1 },
  testBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  testBtnText: { fontSize: 13, fontWeight: '600' },
  aboutCard: { alignItems: 'center', padding: 24, gap: 6 },
  aboutEmoji: { fontSize: 40 },
  aboutTitle: { fontSize: 18, fontWeight: '700' },
  aboutVer: { fontSize: 13 },
  aboutQuote: { fontSize: 16, marginTop: 8, letterSpacing: 1 },
});
