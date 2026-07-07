import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export interface PrayerTimes {
  Fajr: string; Sunrise: string; Dhuhr: string; Asr: string; Maghrib: string; Isha: string;
}

export interface HijriDate {
  day: number; month: number; year: number;
  monthNameAr: string; monthNameEn: string; weekdayEn: string;
}

export interface NextPrayer {
  name: string; time: string; remainingMs: number;
}

interface LocationData { lat: number; lon: number; city: string; country: string; }

interface PrayerContextType {
  prayerTimes: PrayerTimes | null;
  hijriDate: HijriDate | null;
  nextPrayer: NextPrayer | null;
  location: LocationData | null;
  calculationMethod: number;
  loading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  setCalculationMethod: (method: number) => void;
  refreshPrayerTimes: () => Promise<void>;
}

export const CALC_METHODS = [
  { id: 2, name: 'Islamic Society of North America (ISNA)' },
  { id: 1, name: 'Muslim World League (MWL)' },
  { id: 3, name: 'Egyptian General Authority' },
  { id: 4, name: 'Umm Al-Qura, Makkah' },
  { id: 5, name: 'University of Islamic Sciences, Karachi' },
  { id: 7, name: 'Institute of Geophysics, Tehran' },
];

const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

function parseTime(timeStr: string, baseDate: Date): Date {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  const d = new Date(baseDate);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function getNextPrayer(times: PrayerTimes): NextPrayer | null {
  const now = new Date();
  const prayers = PRAYER_NAMES.map(name => ({
    name,
    date: parseTime(times[name as keyof PrayerTimes], now),
  }));
  const upcoming = prayers.find(p => p.date > now);
  if (!upcoming) return null;
  return {
    name: upcoming.name,
    time: times[upcoming.name as keyof PrayerTimes],
    remainingMs: upcoming.date.getTime() - now.getTime(),
  };
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const PrayerContext = createContext<PrayerContextType | null>(null);

export function PrayerProvider({ children }: { children: React.ReactNode }) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [nextPrayer, setNextPrayer] = useState<NextPrayer | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [calculationMethod, setCalcMethod] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [savedLoc, savedMethod] = await Promise.all([
          AsyncStorage.getItem('prayer_location'),
          AsyncStorage.getItem('calc_method'),
        ]);
        if (savedLoc) setLocation(JSON.parse(savedLoc));
        if (savedMethod) setCalcMethod(Number(savedMethod));
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (location) fetchPrayerTimes(location.lat, location.lon, calculationMethod);
  }, [location, calculationMethod]);

  useEffect(() => {
    if (!prayerTimes) return;
    setNextPrayer(getNextPrayer(prayerTimes));
    const interval = setInterval(() => {
      setNextPrayer(getNextPrayer(prayerTimes));
    }, 10000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  const fetchPrayerTimes = async (lat: number, lon: number, method: number) => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date();
      const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      const [timingsRes, hijriRes] = await Promise.all([
        fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=${method}`),
        fetch(`https://api.aladhan.com/v1/gToH/${dateStr}`),
      ]);
      const timingsData = await timingsRes.json();
      const hijriData = await hijriRes.json();
      if (timingsData.code === 200) {
        const t = timingsData.data.timings;
        const times: PrayerTimes = { Fajr: t.Fajr, Sunrise: t.Sunrise, Dhuhr: t.Dhuhr, Asr: t.Asr, Maghrib: t.Maghrib, Isha: t.Isha };
        setPrayerTimes(times);
        await AsyncStorage.setItem('cached_prayer_times', JSON.stringify({ times, date: dateStr, lat, lon, method }));
        schedulePrayerNotifications(times);
      }
      if (hijriData.code === 200) {
        const h = hijriData.data.hijri;
        setHijriDate({
          day: Number(h.day), month: Number(h.month.number), year: Number(h.year),
          monthNameAr: h.month.ar, monthNameEn: h.month.en, weekdayEn: h.weekday.en,
        });
      }
    } catch {
      try {
        const cached = await AsyncStorage.getItem('cached_prayer_times');
        if (cached) { const { times } = JSON.parse(cached); setPrayerTimes(times); }
        else setError('Could not load prayer times. Please check your connection.');
      } catch { setError('Could not load prayer times.'); }
    } finally { setLoading(false); }
  };

  const schedulePrayerNotifications = async (times: PrayerTimes) => {
    if (Platform.OS === 'web') return;
    try {
      const permResult = await Notifications.getPermissionsAsync();
      // Use type-safe access compatible with expo-notifications 57.x and 0.32.x
      const isGranted = (permResult as unknown as { granted?: boolean; status?: string }).granted
        ?? (permResult as unknown as { status?: string }).status === 'granted';
      if (!isGranted) return;
      await Notifications.cancelAllScheduledNotificationsAsync();
      const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
      const now = new Date();
      for (const prayer of prayers) {
        const prayerDate = parseTime(times[prayer], now);
        if (prayerDate > now) {
          await Notifications.scheduleNotificationAsync({
            content: { title: `${prayer} Time`, body: `It is time for ${prayer} prayer. Allahu Akbar!`, sound: true },
            trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: prayerDate },
          });
        }
      }
    } catch {}
  };

  const requestLocation = async () => {
    setLoading(true);
    try {
      let coords: { latitude: number; longitude: number };
      if (Platform.OS === 'web') {
        await new Promise<void>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(p => { coords = p.coords; resolve(); }, reject);
        });
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') { setError('Location permission denied.'); setLoading(false); return; }
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        coords = pos.coords;
      }
      const reverseRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords!.latitude}&longitude=${coords!.longitude}&localityLanguage=en`);
      const geo = await reverseRes.json();
      const locData: LocationData = {
        lat: coords!.latitude, lon: coords!.longitude,
        city: geo.city || geo.locality || 'Unknown', country: geo.countryName || '',
      };
      setLocation(locData);
      await AsyncStorage.setItem('prayer_location', JSON.stringify(locData));
      await fetchPrayerTimes(locData.lat, locData.lon, calculationMethod);
      await Notifications.requestPermissionsAsync();
    } catch { setError('Could not get location.'); }
    setLoading(false);
  };

  const setCalculationMethod = async (method: number) => {
    setCalcMethod(method);
    await AsyncStorage.setItem('calc_method', String(method));
  };

  const refreshPrayerTimes = async () => {
    if (location) await fetchPrayerTimes(location.lat, location.lon, calculationMethod);
  };

  return (
    <PrayerContext.Provider value={{
      prayerTimes, hijriDate, nextPrayer, location, calculationMethod,
      loading, error, requestLocation, setCalculationMethod, refreshPrayerTimes,
    }}>
      {children}
    </PrayerContext.Provider>
  );
}

export function usePrayer() {
  const ctx = useContext(PrayerContext);
  if (!ctx) throw new Error('usePrayer must be used within PrayerProvider');
  return ctx;
}
