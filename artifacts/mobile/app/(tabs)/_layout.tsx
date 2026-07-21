import React from 'react';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';

// NativeTabs (expo-router/unstable-native-tabs) renders screen content in a
// native host outside the React provider tree, breaking all contexts. Always
// use ClassicTabLayout (stable expo-router Tabs) which inherits providers correctly.

// expo-symbols (SymbolView) and expo-blur (BlurView) are not available in Expo Go —
// use Feather icons and a semi-transparent View instead, which work everywhere.

function ClassicTabLayout() {
  const colors = useColors();
  const { t } = useLanguage();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: isIOS ? 'transparent' : colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
          height: isWeb ? 84 : 64,
          paddingBottom: isWeb ? 16 : 8,
        },
        tabBarBackground: () => (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: isIOS
                  ? isDark
                    ? 'rgba(18,18,18,0.88)'
                    : 'rgba(255,255,255,0.88)'
                  : colors.surface,
              },
            ]}
          />
        ),
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color }) => <Feather name="home" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          title: t('quran'),
          tabBarIcon: ({ color }) => <Feather name="book-open" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: t('library'),
          tabBarIcon: ({ color }) => <Feather name="archive" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="planner"
        options={{
          title: t('planner'),
          tabBarIcon: ({ color }) => <Feather name="check-square" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: t('more'),
          tabBarIcon: ({ color }) => <Feather name="grid" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return <ClassicTabLayout />;
}
