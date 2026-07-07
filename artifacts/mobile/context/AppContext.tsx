import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

type Theme = 'dark' | 'light' | 'system';

export interface DailyPrayers {
  fajr: boolean; dhuhr: boolean; asr: boolean; maghrib: boolean; isha: boolean;
}

export interface DailyRecord {
  date: string;
  prayers: DailyPrayers;
  quranPages: number;
  dhikrDone: boolean;
  fasting: boolean;
}

export interface Task {
  id: string; date: string; text: string; completed: boolean; createdAt: number;
}

interface AppContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  isDark: boolean;
  getDayRecord: (date: string) => DailyRecord;
  updatePrayer: (date: string, prayer: keyof DailyPrayers, done: boolean) => void;
  updateQuranPages: (date: string, pages: number) => void;
  updateDhikr: (date: string, done: boolean) => void;
  updateFasting: (date: string, fasting: boolean) => void;
  tasks: Task[];
  addTask: (date: string, text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  getTasksForDate: (date: string) => Task[];
}

const AppContext = createContext<AppContextType | null>(null);

const defaultRecord = (date: string): DailyRecord => ({
  date,
  prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
  quranPages: 0, dhikrDone: false, fasting: false,
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('dark');
  const [records, setRecords] = useState<Record<string, DailyRecord>>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  const isDark = theme === 'system' ? systemScheme === 'dark' : theme === 'dark';

  useEffect(() => {
    (async () => {
      try {
        const [savedTheme, savedRecords, savedTasks] = await Promise.all([
          AsyncStorage.getItem('theme'),
          AsyncStorage.getItem('daily_records'),
          AsyncStorage.getItem('tasks'),
        ]);
        if (savedTheme) setThemeState(savedTheme as Theme);
        if (savedRecords) setRecords(JSON.parse(savedRecords));
        if (savedTasks) setTasks(JSON.parse(savedTasks));
      } catch {}
      setLoaded(true);
    })();
  }, []);

  const persist = async (key: string, value: unknown) => {
    try { await AsyncStorage.setItem(key, JSON.stringify(value)); } catch {}
  };

  const setTheme = async (t: Theme) => {
    setThemeState(t);
    await AsyncStorage.setItem('theme', t);
  };

  const getDayRecord = useCallback((date: string): DailyRecord => {
    return records[date] ?? defaultRecord(date);
  }, [records]);

  const updateRecord = useCallback((date: string, updater: (r: DailyRecord) => DailyRecord) => {
    setRecords(prev => {
      const updated = { ...prev, [date]: updater(prev[date] ?? defaultRecord(date)) };
      persist('daily_records', updated);
      return updated;
    });
  }, []);

  const updatePrayer = useCallback((date: string, prayer: keyof DailyPrayers, done: boolean) => {
    updateRecord(date, r => ({ ...r, prayers: { ...r.prayers, [prayer]: done } }));
  }, [updateRecord]);

  const updateQuranPages = useCallback((date: string, pages: number) => {
    updateRecord(date, r => ({ ...r, quranPages: pages }));
  }, [updateRecord]);

  const updateDhikr = useCallback((date: string, done: boolean) => {
    updateRecord(date, r => ({ ...r, dhikrDone: done }));
  }, [updateRecord]);

  const updateFasting = useCallback((date: string, fasting: boolean) => {
    updateRecord(date, r => ({ ...r, fasting }));
  }, [updateRecord]);

  const addTask = useCallback((date: string, text: string) => {
    const task: Task = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
      date, text, completed: false, createdAt: Date.now(),
    };
    setTasks(prev => { const updated = [task, ...prev]; persist('tasks', updated); return updated; });
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      persist('tasks', updated);
      return updated;
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => { const updated = prev.filter(t => t.id !== id); persist('tasks', updated); return updated; });
  }, []);

  const getTasksForDate = useCallback((date: string) => {
    return tasks.filter(t => t.date === date);
  }, [tasks]);

  if (!loaded) return null;

  return (
    <AppContext.Provider value={{
      theme, setTheme, isDark, getDayRecord,
      updatePrayer, updateQuranPages, updateDhikr, updateFasting,
      tasks, addTask, toggleTask, deleteTask, getTasksForDate,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
