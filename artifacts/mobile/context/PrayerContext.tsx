import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

// expo-notifications was removed from Expo Go in SDK 53.
// Use a try-catch require so the module loads fine in Expo Go and in dev builds.
type NotificationsModule = typeof import('expo-notifications');
let Notifications: NotificationsModule | null = null;
try {
  if (Platform.OS !== 'web') {
    Notifications = require('expo-notifications') as NotificationsModule;
    // Register handler immediately after successful load
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }
} catch {
  // Not available in Expo Go SDK 53+ — notifications silently disabled
}

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
  adhanEnabled: boolean;
  loading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  setCalculationMethod: (method: number) => void;
  setAdhanEnabled: (enabled: boolean) => Promise<void>;
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
const ADHAN_CHANNEL_ID = 'adhan-channel';

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

const PrayerContext = createContext<PrayerContextType | null>(null);

export function PrayerProvider({ children }: { children: React.ReactNode }) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [nextPrayer, setNextPrayer] = useState<NextPrayer | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [calculationMethod, setCalcMethod] = useState(5);
  const [adhanEnabled, setAdhanEnabledState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [savedLoc, savedMethod, savedAdhan] = await Promise.all([
          AsyncStorage.getItem('prayer_location'),
          AsyncStorage.getItem('calc_method'),
          AsyncStorage.getItem('adhan_enabled'),
        ]);
        if (savedLoc) setLocation(JSON.parse(savedLoc));
        if (savedMethod) setCalcMethod(Number(savedMethod));
        if (savedAdhan) setAdhanEnabledState(savedAdhan === 'true');
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
      }
      if (hijriData.code === 200) {
        const h = hijriData.data.hijri;
        setHijriDate({
          day: Number(h.day), month: Number(h.month.number), year: Number(h.year),
          monthNameAr: h.month.ar, monthNameEn: h.month.en, weekdayEn: h.weekday.en,
        });
      }
      // Fetch monthly calendar for accurate Adhan scheduling across days
      await fetchMonthlyCalendar(lat, lon, method, adhanEnabled);
    } catch {
      try {
        const cached = await AsyncStorage.getItem('cached_prayer_times');
        if (cached) { const { times } = JSON.parse(cached); setPrayerTimes(times); }
        else setError('Could not load prayer times. Please check your connection.');
      } catch { setError('Could not load prayer times.'); }
    } finally { setLoading(false); }
  };

  const fetchMonthlyCalendar = async (lat: number, lon: number, method: number, enabled: boolean) => {
    if (!Notifications) return;
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const res = await fetch(
        `https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${lon}&method=${method}&month=${month}&year=${year}`
      );
      const data = await res.json();
      if (data.code === 200 && Array.isArray(data.data)) {
        const calendar = data.data.map((day: any) => ({
          date: day.date.gregorian.date,
          timings: day.timings as PrayerTimes,
        }));
        await AsyncStorage.setItem('cached_prayer_calendar', JSON.stringify({ calendar, month, year, method, lat, lon }));
        await scheduleAdhanNotifications(calendar, enabled);
      }
    } catch {
      // Fallback to today's cached times if calendar fails
      try {
        const cached = await AsyncStorage.getItem('cached_prayer_times');
        if (cached) {
          const { times } = JSON.parse(cached);
          await scheduleAdhanNotifications([{ date: formatDateKey(new Date()), timings: times }], enabled);
        }
      } catch {}
    }
  };

  const scheduleAdhanNotifications = async (calendar: { date: string; timings: PrayerTimes }[], enabled: boolean) => {
    if (!Notifications) return;
    try {
      const permResult = await Notifications.getPermissionsAsync();
      const isGranted = (permResult as unknown as { granted?: boolean; status?: string }).granted
        ?? (permResult as unknown as { status?: string }).status === 'granted';
      if (!isGranted) return;

      await Notifications.cancelAllScheduledNotificationsAsync();
      if (!enabled) return;

      // Android: create a high-priority channel that plays the bundled Adhan sound.
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(ADHAN_CHANNEL_ID, {
          name: 'Adhan Prayer Alerts',
          importance: Notifications.AndroidImportance.HIGH,
          sound: 'adhan.mp3',
          vibrationPattern: [0, 250, 250, 250],
          enableVibrate: true,
          enableLights: true,
          bypassDnd: true,
        });
      }

      const now = new Date();
      let scheduled = 0;
      for (const day of calendar) {
        const [dayNum, monthNum, yearNum] = day.date.split('-').map(Number);
        const baseDate = new Date(yearNum, monthNum - 1, dayNum);
        for (const prayer of PRAYER_NAMES) {
          const prayerDate = parseTime(day.timings[prayer as keyof PrayerTimes], baseDate);
          if (prayerDate > now && scheduled < 100) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: `${prayer} — Adhan`,
                body: `It is time for ${prayer} prayer`,
                sound: 'adhan.mp3',
                ...(Platform.OS === 'android' && { channelId: ADHAN_CHANNEL_ID }),
                priority: Notifications.AndroidNotificationPriority.HIGH,
              },
              trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: prayerDate },
            });
            scheduled++;
          }
        }
      }
    } catch {}
  };

  const formatDateKey = (date: Date) => {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const setAdhanEnabled = async (enabled: boolean) => {
    setAdhanEnabledState(enabled);
    await AsyncStorage.setItem('adhan_enabled', String(enabled));
    if (location) {
      // Reschedule with current calendar or cached times
      try {
        const cachedCalendar = await AsyncStorage.getItem('cached_prayer_calendar');
        if (cachedCalendar) {
          const { calendar } = JSON.parse(cachedCalendar);
          await scheduleAdhanNotifications(calendar, enabled);
        } else if (prayerTimes) {
          await scheduleAdhanNotifications([{ date: formatDateKey(new Date()), timings: prayerTimes }], enabled);
        }
      } catch {}
    }
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
      // Request notification permission after location (no-op in Expo Go)
      if (Notifications) {
        await Notifications.requestPermissionsAsync();
      }
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
      prayerTimes, hijriDate, nextPrayer, location, calculationMethod, adhanEnabled,
      loading, error, requestLocation, setCalculationMethod, setAdhanEnabled, refreshPrayerTimes,
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
