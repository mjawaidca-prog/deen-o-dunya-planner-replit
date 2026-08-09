import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { AppState, Linking, Platform } from 'react-native';

// expo-notifications is unavailable in Expo Go on recent SDKs. The dynamic
// require keeps Expo Go/web previews usable while native builds get Adhan alerts.
type NotificationsModule = typeof import('expo-notifications');
let Notifications: NotificationsModule | null = null;
try {
  if (Platform.OS !== 'web') {
    Notifications = require('expo-notifications') as NotificationsModule;
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
  // Native notification APIs are intentionally unavailable in Expo Go/web.
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

type NotificationPermission = 'granted' | 'denied' | 'undetermined' | 'unavailable';
interface LocationData { lat: number; lon: number; city: string; country: string; }

interface PrayerContextType {
  prayerTimes: PrayerTimes | null;
  hijriDate: HijriDate | null;
  nextPrayer: NextPrayer | null;
  location: LocationData | null;
  calculationMethod: number;
  loading: boolean;
  error: string | null;
  adhanEnabled: boolean;
  notificationPermission: NotificationPermission;
  scheduledNotificationCount: number;
  notificationError: string | null;
  requestLocation: () => Promise<void>;
  setCalculationMethod: (method: number) => void;
  refreshPrayerTimes: () => Promise<void>;
  setAdhanEnabled: (enabled: boolean) => Promise<void>;
  testAdhan: () => Promise<void>;
  openNotificationSettings: () => Promise<void>;
  refreshNotificationStatus: () => Promise<void>;
}

export const CALC_METHODS = [
  { id: 2, name: 'Islamic Society of North America (ISNA)' },
  { id: 1, name: 'Muslim World League (MWL)' },
  { id: 3, name: 'Egyptian General Authority' },
  { id: 4, name: 'Umm Al-Qura, Makkah' },
  { id: 5, name: 'University of Islamic Sciences, Karachi' },
  { id: 7, name: 'Institute of Geophysics, Tehran' },
];

const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
const ADHAN_SOUND = 'adhan.wav';
const ADHAN_CHANNEL_ID = 'adhan_v1';
const ADHAN_ENABLED_KEY = 'adhan_enabled';
const SCHEDULE_DAYS = 7;

function parseTime(timeStr: string, baseDate: Date): Date {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  const d = new Date(baseDate);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function formatApiDate(date: Date): string {
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

function getNextPrayer(times: PrayerTimes): NextPrayer | null {
  const now = new Date();
  const prayers = PRAYER_NAMES.map(name => ({ name, date: parseTime(times[name], now) }));
  const upcoming = prayers.find(p => p.date > now);
  if (!upcoming) return null;
  return {
    name: upcoming.name,
    time: times[upcoming.name],
    remainingMs: upcoming.date.getTime() - now.getTime(),
  };
}

type PermissionSnapshot = { granted?: boolean; status?: string; ios?: { status?: number } };

function getPermissionSnapshot(result: unknown): PermissionSnapshot {
  return result as PermissionSnapshot;
}

function isNotificationPermissionGranted(result: unknown): boolean {
  const permission = getPermissionSnapshot(result);
  if (permission.granted || permission.status === 'granted') return true;
  const iosStatus = permission.ios?.status;
  return iosStatus === 2 || iosStatus === 3 || iosStatus === 4;
}

const PrayerContext = createContext<PrayerContextType | null>(null);

export function PrayerProvider({ children }: { children: React.ReactNode }) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [nextPrayer, setNextPrayer] = useState<NextPrayer | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [calculationMethod, setCalcMethod] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adhanEnabled, setAdhanEnabledState] = useState(true);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    Notifications ? 'undetermined' : 'unavailable',
  );
  const [scheduledNotificationCount, setScheduledNotificationCount] = useState(0);
  const [notificationError, setNotificationError] = useState<string | null>(null);

  const configureAndroidChannel = useCallback(async () => {
    if (!Notifications || Platform.OS !== 'android') return;
    await Notifications.setNotificationChannelAsync(ADHAN_CHANNEL_ID, {
      name: 'Prayer time Adhan',
      importance: Notifications.AndroidImportance.MAX,
      sound: ADHAN_SOUND,
      vibrationPattern: [0, 250, 250, 250],
      enableVibrate: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }, []);

  const refreshNotificationStatus = useCallback(async () => {
    if (!Notifications) {
      setNotificationPermission('unavailable');
      setScheduledNotificationCount(0);
      return;
    }
    try {
      const permissions = await Notifications.getPermissionsAsync();
      const permission = getPermissionSnapshot(permissions);
      setNotificationPermission(
        isNotificationPermissionGranted(permissions)
          ? 'granted'
          : permission.status === 'denied' ? 'denied' : 'undetermined',
      );
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      setScheduledNotificationCount(scheduled.length);
    } catch (notificationStatusError) {
      setNotificationError(
        notificationStatusError instanceof Error ? notificationStatusError.message : 'Could not read notification status.',
      );
    }
  }, []);

  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    if (!Notifications) {
      setNotificationPermission('unavailable');
      setNotificationError('Adhan alerts require an installed iOS or Android development/store build.');
      return false;
    }
    const current = await Notifications.getPermissionsAsync();
    const result = isNotificationPermissionGranted(current)
      ? current
      : await Notifications.requestPermissionsAsync();
    const permission = getPermissionSnapshot(result);
    const granted = isNotificationPermissionGranted(result);
    setNotificationPermission(granted ? 'granted' : permission.status === 'denied' ? 'denied' : 'undetermined');
    if (!granted) setNotificationError('Notification permission is required for Adhan alerts.');
    return granted;
  }, []);

  const schedulePrayerNotifications = useCallback(async (lat: number, lon: number, method: number) => {
    if (!Notifications) return;
    try {
      const savedEnabled = await AsyncStorage.getItem(ADHAN_ENABLED_KEY);
      if (savedEnabled === 'false') return;
      const permissions = await Notifications.getPermissionsAsync();
      if (!isNotificationPermissionGranted(permissions)) {
        const permission = getPermissionSnapshot(permissions);
        setNotificationPermission(permission.status === 'denied' ? 'denied' : 'undetermined');
        return;
      }

      setNotificationError(null);
      await configureAndroidChannel();

      const now = new Date();
      const days = Array.from({ length: SCHEDULE_DAYS }, (_, offset) => {
        const date = new Date(now);
        date.setDate(now.getDate() + offset);
        return date;
      });
      const responses = await Promise.all(days.map(date =>
        fetch(`https://api.aladhan.com/v1/timings/${formatApiDate(date)}?latitude=${lat}&longitude=${lon}&method=${method}`),
      ));
      const payloads = await Promise.all(responses.map(response => response.json()));
      if (payloads.some(payload => payload.code !== 200)) {
        throw new Error('Could not retrieve future prayer times.');
      }

      await Notifications.cancelAllScheduledNotificationsAsync();

      for (let dayIndex = 0; dayIndex < days.length; dayIndex += 1) {
        const payload = payloads[dayIndex];
        const timings = payload.data.timings as PrayerTimes;
        for (const prayer of PRAYER_NAMES) {
          const prayerDate = parseTime(timings[prayer], days[dayIndex]);
          if (prayerDate <= now) continue;
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `${prayer} Time`,
              body: `It is time for ${prayer} prayer. Allahu Akbar!`,
              sound: ADHAN_SOUND,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: prayerDate,
              channelId: Platform.OS === 'android' ? ADHAN_CHANNEL_ID : undefined,
            },
          });
        }
      }
      await refreshNotificationStatus();
    } catch (schedulingError) {
      const message = schedulingError instanceof Error ? schedulingError.message : 'Could not schedule Adhan alerts.';
      setNotificationError(message);
      console.warn('Adhan scheduling failed:', schedulingError);
      await refreshNotificationStatus();
    }
  }, [configureAndroidChannel, refreshNotificationStatus]);

  const fetchPrayerTimes = useCallback(async (lat: number, lon: number, method: number) => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date();
      const dateStr = formatApiDate(today);
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
        await schedulePrayerNotifications(lat, lon, method);
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
  }, [schedulePrayerNotifications]);

  useEffect(() => {
    (async () => {
      try {
        const [savedLoc, savedMethod, savedAdhan] = await Promise.all([
          AsyncStorage.getItem('prayer_location'),
          AsyncStorage.getItem('calc_method'),
          AsyncStorage.getItem(ADHAN_ENABLED_KEY),
        ]);
        if (savedAdhan !== null) setAdhanEnabledState(savedAdhan === 'true');
        if (savedMethod) setCalcMethod(Number(savedMethod));
        if (savedLoc) setLocation(JSON.parse(savedLoc));
        await refreshNotificationStatus();
      } catch {}
    })();
  }, [refreshNotificationStatus]);

  useEffect(() => {
    if (location) fetchPrayerTimes(location.lat, location.lon, calculationMethod);
  }, [location, calculationMethod, fetchPrayerTimes]);

  useEffect(() => {
    if (!prayerTimes) return;
    setNextPrayer(getNextPrayer(prayerTimes));
    const interval = setInterval(() => setNextPrayer(getNextPrayer(prayerTimes)), 10000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        refreshNotificationStatus();
        if (location && adhanEnabled) {
          schedulePrayerNotifications(location.lat, location.lon, calculationMethod);
        }
      }
    });
    return () => subscription.remove();
  }, [adhanEnabled, calculationMethod, location, refreshNotificationStatus, schedulePrayerNotifications]);

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
        if (adhanEnabled) await requestNotificationPermission();
      }
      const reverseRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords!.latitude}&longitude=${coords!.longitude}&localityLanguage=en`);
      const geo = await reverseRes.json();
      const locData: LocationData = {
        lat: coords!.latitude, lon: coords!.longitude,
        city: geo.city || geo.locality || 'Unknown', country: geo.countryName || '',
      };
      setLocation(locData);
      await AsyncStorage.setItem('prayer_location', JSON.stringify(locData));
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

  const setAdhanEnabled = async (enabled: boolean) => {
    setAdhanEnabledState(enabled);
    await AsyncStorage.setItem(ADHAN_ENABLED_KEY, String(enabled));
    if (!Notifications) {
      if (enabled) setNotificationError('Adhan alerts require an installed iOS or Android development/store build.');
      return;
    }
    if (!enabled) {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setScheduledNotificationCount(0);
      setNotificationError(null);
      return;
    }
    const granted = await requestNotificationPermission();
    if (granted && location) await schedulePrayerNotifications(location.lat, location.lon, calculationMethod);
    else await refreshNotificationStatus();
  };

  const testAdhan = async () => {
    try {
      const granted = await requestNotificationPermission();
      if (!granted || !Notifications) return;
      setNotificationError(null);
      await configureAndroidChannel();
      const testDate = new Date(Date.now() + 10000);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Adhan Test',
          body: 'Your Deen o Dunya prayer alerts are working.',
          sound: ADHAN_SOUND,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: testDate,
          channelId: Platform.OS === 'android' ? ADHAN_CHANNEL_ID : undefined,
        },
      });
      await refreshNotificationStatus();
    } catch (testError) {
      const message = testError instanceof Error ? testError.message : 'Could not schedule the Adhan test.';
      setNotificationError(message);
      console.warn('Adhan test failed:', testError);
    }
  };

  const openNotificationSettings = async () => {
    await Linking.openSettings();
  };

  return (
    <PrayerContext.Provider value={{
      prayerTimes, hijriDate, nextPrayer, location, calculationMethod,
      loading, error, adhanEnabled, notificationPermission, scheduledNotificationCount,
      notificationError, requestLocation, setCalculationMethod, refreshPrayerTimes,
      setAdhanEnabled, testAdhan, openNotificationSettings, refreshNotificationStatus,
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
