import { useContext } from 'react';
import { useColorScheme } from 'react-native';
import colors from '@/constants/colors';
import { AppContext } from '@/context/AppContext';

/**
 * Returns design tokens for the current color scheme.
 * Respects user theme preference from AppContext when available,
 * falls back to system color scheme otherwise.
 */
export function useColors() {
  const scheme = useColorScheme();
  const appCtx = useContext(AppContext);

  let isDark: boolean;
  if (appCtx) {
    isDark = appCtx.isDark;
  } else {
    isDark = scheme === 'dark';
  }

  // Direct palette access avoids any unsafe Record<> cast
  const palette = isDark ? colors.dark : colors.light;
  return { ...palette, radius: colors.radius };
}
