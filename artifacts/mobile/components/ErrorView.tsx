import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

interface ErrorViewProps { message?: string; onRetry?: () => void; }

export default function ErrorView({ message = 'Something went wrong', onRetry }: ErrorViewProps) {
  const colors = useColors();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Feather name="alert-circle" size={48} color={colors.mutedForeground} />
      <Text style={[styles.message, { color: colors.foreground }]}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={onRetry}>
          <Text style={[styles.btnText, { color: colors.primaryForeground }]}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 },
  message: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  btn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 8 },
  btnText: { fontSize: 15, fontWeight: '600' as const },
});
