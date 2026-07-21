---
name: expo-speech lazy require
description: expo-speech must never be statically imported in files loaded at app startup — use a lazy try-catch require instead
---

## Rule
Never use `import * as Speech from 'expo-speech'` in any file that is loaded at app startup (e.g. a home-screen component or a route rendered immediately). Always use a lazy try-catch require:

```ts
type SpeechModule = typeof import('expo-speech');
let Speech: SpeechModule | null = null;
try {
  Speech = require('expo-speech') as SpeechModule;
} catch {
  // Not available in this environment
}
```

Then guard every call site: `Speech?.speak(...)`, `Speech?.stop()`.

**Why:** Even with the correct SDK-54 version (~14.0.8), a static `import` causes the native module to initialise synchronously at app startup. If the native side is unavailable or in an inconsistent state (e.g. certain Expo Go simulator builds), this throws a native exception that closes the app with no JS error shown. The try-catch require defers initialisation and makes TTS gracefully unavailable instead of crashing.

**How to apply:** Any component that uses TTS (currently `DailyAyahCard.tsx` and `app/dua-journey/[mood].tsx`) must use this pattern. The same rule applies to any other native-only module imported in startup-path files.
