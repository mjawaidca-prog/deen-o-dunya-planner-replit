---
name: Deen o Dunya Planner — app architecture
description: Key architectural decisions and non-obvious caveats for the Islamic planner Expo app
---

## Onboarding + RTL reload ordering
`setLanguage()` calls `reloadAppAsync()` when RTL changes. Always persist onboarding BEFORE calling `setLanguage()` to avoid the user being stuck after an RTL reload.

## expo-sensors on web
`Magnetometer` crashes on web at module-load time if imported as a top-level static import. Use conditional require and type the subscription ref concretely — never `ReturnType<typeof Magnetometer.addListener>` (fails when Magnetometer can be null).
**Why:** Metro bundles all route modules upfront, so module-level native imports execute even before the route is visited.

## expo-notifications 57.x compat
- `setNotificationHandler` callback must return `shouldShowBanner` and `shouldShowList` (new required fields).
- Permission check: `granted` / `status` properties are missing from typings — use `(result as unknown as { granted?: boolean; status?: string })` cast.
**Why:** 57.x ships ahead of the Expo SDK 52 expected version (~0.32.x); type shapes differ.

## Colors palette
No `error` key — use `colors.destructive`. AppContext exports `AppContext` (raw context object) so `useColors` can read `isDark` without a hook call inside a hook.
