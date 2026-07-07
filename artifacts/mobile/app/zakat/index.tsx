import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

// Nisab in grams of silver (595g at ~$0.80/g ≈ $476)
const NISAB_SILVER_GRAMS = 595;
const ZAKAT_RATE = 0.025;

interface ZakatResult {
  totalWealth: number;
  nisabUSD: number;
  zakatDue: number;
  isAboveNisab: boolean;
}

const FIELDS = [
  { key: 'cash', label: 'Cash & Bank Savings', icon: '💵' },
  { key: 'gold', label: 'Gold Value (USD)', icon: '🥇' },
  { key: 'silver', label: 'Silver Value (USD)', icon: '🥈' },
  { key: 'investments', label: 'Investments & Stocks', icon: '📈' },
  { key: 'business', label: 'Business Assets', icon: '🏪' },
  { key: 'receivable', label: 'Money Owed to You', icon: '📋' },
  { key: 'debt', label: 'Debts You Owe (deduct)', icon: '📉' },
];

export default function ZakatScreen() {
  const colors = useColors();
  const [silverPricePerGram, setSilverPricePerGram] = useState('0.90');
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ZakatResult | null>(null);

  const calculate = () => {
    const cash = parseFloat(values.cash || '0');
    const gold = parseFloat(values.gold || '0');
    const silver = parseFloat(values.silver || '0');
    const investments = parseFloat(values.investments || '0');
    const business = parseFloat(values.business || '0');
    const receivable = parseFloat(values.receivable || '0');
    const debt = parseFloat(values.debt || '0');

    const totalAssets = cash + gold + silver + investments + business + receivable;
    const totalWealth = Math.max(0, totalAssets - debt);

    const silverPerGram = parseFloat(silverPricePerGram || '0.90');
    const nisabUSD = NISAB_SILVER_GRAMS * silverPerGram;

    const isAboveNisab = totalWealth >= nisabUSD;
    const zakatDue = isAboveNisab ? totalWealth * ZAKAT_RATE : 0;

    setResult({ totalWealth, nisabUSD, zakatDue, isAboveNisab });
  };

  const reset = () => { setValues({}); setResult(null); setSilverPricePerGram('0.90'); };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderLeftColor: colors.gold }]}>
            <Text style={[styles.infoTitle, { color: colors.gold }]}>Zakat Calculator</Text>
            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
              Zakat is 2.5% of your total zakatable wealth held for one lunar year, above the Nisab threshold.
            </Text>
          </View>

          {/* Silver price input */}
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Silver Price</Text>
          <View style={[styles.inputRow, { backgroundColor: colors.card }]}>
            <Text style={styles.fieldIcon}>🥈</Text>
            <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Silver (per gram, USD)</Text>
            <TextInput
              style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
              value={silverPricePerGram}
              onChangeText={setSilverPricePerGram}
              keyboardType="decimal-pad"
              placeholder="0.90"
              placeholderTextColor={colors.mutedForeground}
            />
          </View>

          {/* Nisab indicator */}
          <Text style={[styles.nisabHint, { color: colors.mutedForeground }]}>
            Current Nisab ≈ ${(NISAB_SILVER_GRAMS * parseFloat(silverPricePerGram || '0.90')).toFixed(0)}
          </Text>

          {/* Asset fields */}
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Your Assets (USD)</Text>
          <View style={[styles.fieldsGroup, { backgroundColor: colors.card }]}>
            {FIELDS.map((f, i) => (
              <View key={f.key} style={[styles.inputRow, i < FIELDS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <Text style={styles.fieldIcon}>{f.icon}</Text>
                <Text style={[styles.fieldLabel, { color: colors.foreground }]}>{f.label}</Text>
                <TextInput
                  style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                  value={values[f.key] || ''}
                  onChangeText={v => setValues(prev => ({ ...prev, [f.key]: v }))}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={colors.mutedForeground}
                />
              </View>
            ))}
          </View>

          {/* Calculate button */}
          <TouchableOpacity style={[styles.calcBtn, { backgroundColor: colors.primary }]} onPress={calculate}>
            <Text style={styles.calcBtnText}>Calculate Zakat</Text>
          </TouchableOpacity>

          {/* Result */}
          {result && (
            <View style={[styles.resultCard, { backgroundColor: result.isAboveNisab ? colors.primary + '22' : colors.card, borderColor: result.isAboveNisab ? colors.primary : colors.border }]}>
              <Text style={[styles.resultTitle, { color: colors.foreground }]}>
                {result.isAboveNisab ? '✅ Zakat is Due' : '❌ Below Nisab — No Zakat Due'}
              </Text>
              <View style={styles.resultRow}>
                <Text style={[styles.resultLabel, { color: colors.mutedForeground }]}>Total Zakatable Wealth</Text>
                <Text style={[styles.resultVal, { color: colors.foreground }]}>${result.totalWealth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={[styles.resultLabel, { color: colors.mutedForeground }]}>Nisab Threshold</Text>
                <Text style={[styles.resultVal, { color: colors.foreground }]}>${result.nisabUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
              </View>
              {result.isAboveNisab && (
                <View style={[styles.zakatDueBox, { backgroundColor: colors.primary }]}>
                  <Text style={styles.zakatDueLabel}>Zakat Due (2.5%)</Text>
                  <Text style={styles.zakatDueVal}>${result.zakatDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                </View>
              )}
            </View>
          )}

          <TouchableOpacity style={[styles.resetBtn, { borderColor: colors.border }]} onPress={reset}>
            <Text style={[styles.resetText, { color: colors.mutedForeground }]}>Reset</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  infoCard: { borderLeftWidth: 4, borderRadius: 12, padding: 16, marginBottom: 20, gap: 6 },
  infoTitle: { fontSize: 16, fontWeight: '700' },
  infoText: { fontSize: 13, lineHeight: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 8, marginTop: 16 },
  fieldsGroup: { borderRadius: 14, overflow: 'hidden', marginBottom: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  fieldIcon: { fontSize: 18, width: 28, textAlign: 'center' },
  fieldLabel: { flex: 1, fontSize: 13 },
  input: { width: 90, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, fontSize: 14, textAlign: 'right' },
  nisabHint: { fontSize: 12, marginBottom: 8, textAlign: 'right' },
  calcBtn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 16 },
  calcBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  resultCard: { borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 12, gap: 10 },
  resultTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultLabel: { fontSize: 13 },
  resultVal: { fontSize: 14, fontWeight: '600' },
  zakatDueBox: { borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 4, gap: 4 },
  zakatDueLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  zakatDueVal: { color: '#fff', fontSize: 28, fontWeight: '700' },
  resetBtn: { borderRadius: 14, paddingVertical: 12, alignItems: 'center', borderWidth: 1 },
  resetText: { fontSize: 15 },
});
