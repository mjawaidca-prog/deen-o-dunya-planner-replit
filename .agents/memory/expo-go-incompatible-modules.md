---
name: Expo Go incompatible native modules
description: Modules that crash Expo Go at startup with "ViewManagerAdapter must be a function (received undefined)" — must be replaced for Expo Go dev workflow
---

## Rule
`expo-blur` (BlurView) and `expo-symbols` (SymbolView) are **not available in Expo Go** despite passing `expo-doctor`. They register native view managers that don't exist in the Expo Go client binary, causing an Invariant Violation crash immediately after bundle load.

**Why:** These modules rely on native view managers that must be compiled into the host app binary. Expo Go ships a fixed set of native modules; any module not in that set fails with `ViewManagerAdapter_<ModuleName> must be a function (received undefined)`.

**How to apply:**
- Replace `BlurView` from `expo-blur` with a semi-transparent `View` (`rgba(...)` background) — works in Expo Go, production builds, and web.
- Replace `SymbolView` from `expo-symbols` with `Feather` icons from `@expo/vector-icons` — works everywhere.
- These replacements are permanent for the Deen o Dunya project; do not reintroduce expo-blur or expo-symbols imports.
- For production builds (App Store / TestFlight), both replacements look fine; SF Symbols are a nice-to-have, not required.

## Affected file
`artifacts/mobile/app/(tabs)/_layout.tsx` — the only file that used both modules.
