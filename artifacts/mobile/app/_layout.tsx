import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { LanguageProvider } from '@/context/LanguageContext';
import { AppProvider } from '@/context/AppContext';
import { PrayerProvider } from '@/context/PrayerContext';
import { AudioProvider } from '@/context/AudioContext';
import AudioPlayerBar from '@/components/AudioPlayerBar';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0A1628' },
        headerTintColor: '#F0EDE5',
        headerBackTitle: 'Back',
        contentStyle: { backgroundColor: '#0A1628' },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Quran */}
      <Stack.Screen name="quran/[surah]" options={{ title: 'Quran Reader' }} />
      <Stack.Screen name="quran/search" options={{ title: 'Search Quran' }} />
      <Stack.Screen name="quran/bookmarks" options={{ title: 'Bookmarked Ayahs' }} />

      {/* Hadith */}
      <Stack.Screen name="hadith/[book]" options={{ title: 'Hadith' }} />

      {/* Settings & tools */}
      <Stack.Screen name="settings/index" options={{ title: 'Settings' }} />
      <Stack.Screen name="qibla/index" options={{ title: 'Qibla Direction' }} />
      <Stack.Screen name="tasbeeh/index" options={{ title: 'Tasbeeh' }} />
      <Stack.Screen name="zakat/index" options={{ title: 'Zakat Calculator' }} />
      <Stack.Screen name="names/index" options={{ title: '99 Names of Allah' }} />
      <Stack.Screen name="duas/index" options={{ title: 'Duas & Adhkar' }} />
      <Stack.Screen name="seerah/index" options={{ title: 'Seerah' }} />
      <Stack.Screen name="masjid/index" options={{ title: 'Nearby Masjids' }} />
      <Stack.Screen name="prayer/index" options={{ title: 'Prayer Times' }} />

      {/* Kids mode & Ramadan */}
      <Stack.Screen name="quran/kids" options={{ title: 'Kids Quran', headerShown: false }} />
      <Stack.Screen name="planner/ramadan" options={{ title: 'Ramadan Tracker', headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <LanguageProvider>
                <AppProvider>
                  <PrayerProvider>
                    <AudioProvider>
                      <StatusBar style="light" />
                      <RootLayoutNav />
                      <AudioPlayerBar />
                    </AudioProvider>
                  </PrayerProvider>
                </AppProvider>
              </LanguageProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
