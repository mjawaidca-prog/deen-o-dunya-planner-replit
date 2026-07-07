import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { useApp, DailyPrayers } from '@/context/AppContext';

const PRAYERS: { key: keyof DailyPrayers; label: string; arabic: string }[] = [
  { key: 'fajr', label: 'Fajr', arabic: 'الفجر' },
  { key: 'dhuhr', label: 'Dhuhr', arabic: 'الظهر' },
  { key: 'asr', label: 'Asr', arabic: 'العصر' },
  { key: 'maghrib', label: 'Maghrib', arabic: 'المغرب' },
  { key: 'isha', label: 'Isha', arabic: 'العشاء' },
];

function todayKey() { return new Date().toISOString().split('T')[0]; }
function todayLabel() { return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }); }

export default function PlannerTab() {
  const colors = useColors();
  const { t } = useLanguage();
  const { getDayRecord, updatePrayer, updateFasting, updateQuranPages, addTask, toggleTask, deleteTask, getTasksForDate } = useApp();
  const [taskText, setTaskText] = useState('');
  const today = todayKey();
  const record = getDayRecord(today);
  const tasks = getTasksForDate(today);

  const handleAddTask = () => {
    if (taskText.trim()) { addTask(today, taskText.trim()); setTaskText(''); }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>{t('planner')}</Text>
            <Text style={[styles.dateStr, { color: colors.mutedForeground }]}>{todayLabel()}</Text>
          </View>

          {/* Fasting Toggle */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.row}>
              <Text style={styles.rowEmoji}>🌙</Text>
              <Text style={[styles.rowLabel, { color: colors.foreground }]}>{t('fasting')}</Text>
              <Switch
                value={record.fasting}
                onValueChange={v => updateFasting(today, v)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={record.fasting ? colors.gold : '#fff'}
              />
            </View>
          </View>

          {/* Prayers */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t('prayersDone')}</Text>
            {PRAYERS.map(p => (
              <TouchableOpacity key={p.key} style={styles.checkRow} onPress={() => updatePrayer(today, p.key, !record.prayers[p.key])}>
                <View style={[styles.checkbox, { borderColor: colors.primary, backgroundColor: record.prayers[p.key] ? colors.primary : 'transparent' }]}>
                  {record.prayers[p.key] && <Feather name="check" size={14} color="#fff" />}
                </View>
                <Text style={[styles.checkLabel, { color: colors.foreground }]}>{p.label}</Text>
                <Text style={[styles.checkArabic, { color: colors.gold }]}>{p.arabic}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quran Pages */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t('quranPages')}</Text>
            <View style={styles.counter}>
              <TouchableOpacity
                style={[styles.counterBtn, { backgroundColor: colors.surfaceAlt }]}
                onPress={() => updateQuranPages(today, Math.max(0, record.quranPages - 1))}
              >
                <Feather name="minus" size={18} color={colors.foreground} />
              </TouchableOpacity>
              <Text style={[styles.counterVal, { color: colors.foreground }]}>{record.quranPages}</Text>
              <TouchableOpacity
                style={[styles.counterBtn, { backgroundColor: colors.primary }]}
                onPress={() => updateQuranPages(today, record.quranPages + 1)}
              >
                <Feather name="plus" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tasks */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t('tasks')}</Text>
            <View style={[styles.inputRow, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}>
              <TextInput
                style={[styles.taskInput, { color: colors.foreground }]}
                placeholder={t('taskPlaceholder')}
                placeholderTextColor={colors.mutedForeground}
                value={taskText}
                onChangeText={setTaskText}
                onSubmitEditing={handleAddTask}
                returnKeyType="done"
              />
              <TouchableOpacity onPress={handleAddTask} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
                <Feather name="plus" size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            {tasks.length === 0 && (
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{t('noTasks')}</Text>
            )}
            {tasks.map(task => (
              <View key={task.id} style={[styles.taskItem, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => toggleTask(task.id)} style={[styles.checkbox, { borderColor: task.completed ? colors.primary : colors.border, backgroundColor: task.completed ? colors.primary : 'transparent' }]}>
                  {task.completed && <Feather name="check" size={14} color="#fff" />}
                </TouchableOpacity>
                <Text style={[styles.taskText, { color: task.completed ? colors.mutedForeground : colors.foreground, textDecorationLine: task.completed ? 'line-through' : 'none' }]} numberOfLines={2}>{task.text}</Text>
                <TouchableOpacity onPress={() => deleteTask(task.id)}>
                  <Feather name="trash-2" size={16} color={colors.mutedForeground} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 8 },
  header: { marginHorizontal: 16, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '700' },
  dateStr: { fontSize: 14, marginTop: 4 },
  card: { marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowEmoji: { fontSize: 22 },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  checkLabel: { flex: 1, fontSize: 15 },
  checkArabic: { fontSize: 15, fontWeight: '500' },
  counter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 },
  counterBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  counterVal: { fontSize: 36, fontWeight: '700', minWidth: 60, textAlign: 'center' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 8 },
  taskInput: { flex: 1, fontSize: 15, paddingVertical: 6 },
  addBtn: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  emptyText: { textAlign: 'center', fontSize: 14, paddingVertical: 12 },
  taskItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1 },
  taskText: { flex: 1, fontSize: 15, lineHeight: 20 },
});
