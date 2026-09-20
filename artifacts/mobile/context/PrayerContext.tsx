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
  adhanEnabled: boolean;
  loading: boolean;
  error: string | null;
  notificationPermission: NotificationPermission;
  scheduledNotificationCount: number;
  notificationError: string | null;
  requestLocation: () => Promise<void>;
  setCalculationMethod: (method: number) => void;
  setAdhanEnabled: (enabled: boolean) => Promise<void>;
  refreshPrayerTimes: () => Promise<void>;
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
// iOS keeps at most 64 pending local notifications. Twelve days of five
// prayers leaves four slots for the test alert and other app notifications.
const SCHEDULE_DAYS = 12;

type CalendarDate = { year: number; month: number; day: number };

function parseClock(timeStr: string): { hours: number; minutes: number } {
  const match = timeStr.match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i);
  if (!match) throw new Error(`Invalid prayer time: ${timeStr}`);
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3]?.toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  if (hours > 23 || minutes > 59) throw new Error(`Invalid prayer time: ${timeStr}`);
  return { hours, minutes };
}

function parseTime(timeStr: string, baseDate: Date): Date {
  const { hours, minutes } = parseClock(timeStr);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function datePartsInTimeZone(date: Date, timeZone: string): CalendarDate {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find(part => part.type === type)?.value);
  return { year: value('year'), month: value('month'), day: value('day') };
}

function addCalendarDays(date: CalendarDate, offset: number): CalendarDate {
  const shifted = new Date(Date.UTC(date.year, date.month - 1, date.day + offset));
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

function timeZoneOffsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find(part => part.type === type)?.value);
  return Date.UTC(
    value('year'),
    value('month') - 1,
    value('day'),
    value('hour'),
    value('minute'),
    value('second'),
  ) - date.getTime();
}

function prayerDateInTimeZone(timeStr: string, date: CalendarDate, timeZone: string): Date {
  const { hours, minutes } = parseClock(timeStr);
  const wallClockUtc = Date.UTC(date.year, date.month - 1, date.day, hours, minutes);
  let instant = wallClockUtc;
  // Recalculate once so DST transitions use the offset at the prayer instant.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    instant = wallClockUtc - timeZoneOffsetMs(new Date(instant), timeZone);
  }
  return new Date(instant);
}

function formatApiDate(date: Date): string {
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

function formatApiCalendarDate(date: CalendarDate): string {
  return `${date.day}-${date.month}-${date.year}`;
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

type PermissionSnapshot = {
  granted?: boolean;
  status?: string;
  ios?: { status?: number; allowsSound?: boolean | null };
};

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
      if (
        Platform.OS === 'ios' &&
        isNotificationPermissionGranted(permissions) &&
        permission.ios?.allowsSound === false
      ) {
        setNotificationError('Notifications are allowed, but Sounds are off. Enable Sounds in iOS Settings.');
      }
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
      : await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
    const permission = getPermissionSnapshot(result);
    const authorized = isNotificationPermissionGranted(result);
    const soundAllowed = Platform.OS !== 'ios' || permission.ios?.allowsSound !== false;
    setNotificationPermission(authorized ? 'granted' : permission.status === 'denied' ? 'denied' : 'undetermined');
    if (!authorized) {
      setNotificationError('Notification permission is required for Adhan alerts.');
    } else if (!soundAllowed) {
      setNotificationError('Notifications are allowed, but Sounds are off. Enable Sounds in iOS Settings.');
    } else {
      setNotificationError(null);
    }
    return authorized && soundAllowed;
  }, []);

  const schedulePrayerNotifications = useCallback(async (lat: number, lon: number, method: number) => {
    if (!Notifications) return;
    try {
      const savedEnabled = await AsyncStorage.getItem(ADHAN_ENABLED_KEY);
      if (savedEnabled === 'false') return;
      let permissions = await Notifications.getPermissionsAsync();
      if (!isNotificationPermissionGranted(permissions)) {
        const currentPermission = getPermissionSnapshot(permissions);
        if (currentPermission.status !== 'denied') {
          permissions = await Notifications.requestPermissionsAsync({
            ios: {
              allowAlert: true,
              allowBadge: true,
              allowSound: true,
            },
          });
        }
      }
      if (!isNotificationPermissionGranted(permissions)) {
        const permission = getPermissionSnapshot(permissions);
        setNotificationPermission(permission.status === 'denied' ? 'denied' : 'undetermined');
        setNotificationError('Enable notifications and Sounds in iOS Settings to hear the Adhan.');
        return;
      }
      const permission = getPermissionSnapshot(permissions);
      if (Platform.OS === 'ios' && permission.ios?.allowsSound === false) {
        setNotificationPermission('granted');
        setNotificationError('Notifications are allowed, but Sounds are off. Enable Sounds in iOS Settings.');
        return;
      }
      setNotificationPermission('granted');

      setNotificationError(null);
      await configureAndroidChannel();

      const now = new Date();
      // Resolve the coordinate's IANA timezone before constructing absolute
      // notification dates. Device timezone can differ while travelling.
      const timezoneProbe = await fetch(
        `https://api.aladhan.com/v1/timings/${formatApiDate(now)}?latitude=${lat}&longitude=${lon}&method=${method}`,
      );
      const timezonePayload = await timezoneProbe.json();
      if (timezonePayload.code !== 200 || !timezonePayload.data?.meta?.timezone) {
        throw new Error('Could not determine the prayer location timezone.');
      }
      const timeZone = String(timezonePayload.data.meta.timezone);
      const todayAtLocation = datePartsInTimeZone(now, timeZone);
      const days = Array.from(
        { length: SCHEDULE_DAYS },
        (_, offset) => addCalendarDays(todayAtLocation, offset),
      );
      const responses = await Promise.all(days.map(date =>
        fetch(`https://api.aladhan.com/v1/timings/${formatApiCalendarDate(date)}?latitude=${lat}&longitude=${lon}&method=${method}`),
      ));
      if (responses.some(response => !response.ok)) {
        throw new Error('Could not retrieve future prayer times.');
      }
      const payloads = await Promise.all(responses.map(response => response.json()));
      if (payloads.some(payload => payload.code !== 200)) {
        throw new Error('Could not retrieve future prayer times.');
      }

      await Notifications.cancelAllScheduledNotificationsAsync();

      for (let dayIndex = 0; dayIndex < days.length; dayIndex += 1) {
        const payload = payloads[dayIndex];
        const timings = payload.data.timings as PrayerTimes;
        for (const prayer of PRAYER_NAMES) {
          const prayerDate = prayerDateInTimeZone(timings[prayer], days[dayIndex], timeZone);
          if (prayerDate <= now) continue;
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `${prayer} Time`,
              body: `It is time for ${prayer} prayer. Allahu Akbar!`,
              sound: ADHAN_SOUND,
              data: { kind: 'adhan', prayer, timeZone },
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
