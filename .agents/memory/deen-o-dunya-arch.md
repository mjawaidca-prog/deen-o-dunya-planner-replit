---
name: Deen o Dunya app architecture
description: Islamic planner Expo app — screens, providers, data sources, known caveats, feature inventory
---

## Stack
- Expo SDK 52/53, expo-router v6, React Native 0.81
- Dark Islamic theme: bg `#0A1628`, primary `#2D9B6B`, gold `#C9A84C`
- AsyncStorage for all local persistence (no backend)
- Free APIs: AlQuran.cloud, AlAdhan, Overpass (masjids)

## Provider Stack (root `_layout.tsx`)
`LanguageProvider → AppProvider → PrayerProvider → AudioProvider → Stack + AudioPlayerBar`

**Critical rule**: `completeOnboarding()` must be called BEFORE `setLanguage()` because `setLanguage` may call `reloadAppAsync()` for RTL switches.

## Navigation / Routing
- `app/index.tsx` — redirects based on `isOnboarded` flag; goes to `/(tabs)` if true, `/onboarding` if false
- Onboarding: navigates to `/` (not directly to `/(tabs)`) after completing — lets index re-evaluate
- Five-tab layout always uses stable `Tabs` (not NativeTabs which broke contexts)
- All routes registered in `app/_layout.tsx` Stack

## Known Expo Go Limitations
- `expo-notifications` — push removed SDK 53; loaded via `try-catch require()`, null in Expo Go, guarded throughout PrayerContext
- `expo-sensors Magnetometer` — also `try-catch require()`, shows warning card in Qibla when unavailable
- `expo-av` deprecated (warning only) — use expo-audio in SDK 54+

## Feature Inventory (Step 1 — Quran + Hadith complete)

### Quran
- **Surah list**: 114 surahs, search + Meccan/Medinan filter, bookmarks + search header buttons
- **Surah reader** (`app/quran/[surah].tsx`): 
  - 5 translations: Sahih Int'l, Pickthall, Yusuf Ali, Urdu Maududi, Urdu Jalandhri
  - 3 tafsir editions: Maududi (en), Al-Muyassar (ar), Jalalayn (ar) — loaded on demand
  - 24 reciters (everyayah.com) — 8 → 24
  - Per-ayah: bookmark, share, play, font-size adjust
  - Jump-to-ayah modal
  - Retry uses `retryCount` state in useEffect deps (not cloned object)
- **Global search** (`app/quran/search.tsx`): AlQuran.cloud search API, EN + UR toggle
- **Bookmarks** (`app/quran/bookmarks.tsx`): AsyncStorage key `quran_bookmarks_v2`, share/delete/clear all

### Hadith
- 75 hadiths across 8 books (was 18): Bukhari×15, Muslim×10, Tirmidhi×10, AbuDawud×8, IbnMajah×8, Nasai×8, Malik×8, Ahmad×8
- Screen: search by keyword/narrator/chapter, grade filter (all/sahih/hasan/daif), share, Urdu toggle

### Other screens (unchanged in Step 1)
- Prayer: full timetable, next-prayer highlight
- Planner: fasting toggle, prayer checkboxes, Quran stepper, task CRUD
- Library: hadith books grid, Duas (23), 99 Names, Seerah
- More: Tasbeeh, Zakat, Qibla, Masjid finder, Hijri calendar, Settings

## Constants Field Names (DO NOT CHANGE — screens depend on these)
- `colors.ts`: uses `destructive` not `error`; no `radius` key at palette level
- `translations.ts`: key is `calcMethod` not `calculationMethod`
- `quranData.ts`: `SURAHS[]` with `id, name, nameEnglish, meaning, revelationType, totalAyahs`
- `quranData.ts`: `TRANSLATION_EDITIONS[]` and `TAFSEER_EDITIONS[]` — both used by surah reader
- `duasData.ts`: `DUA_CATEGORIES: string[]` (flat); `DUAS[]` with `title, category, arabic, transliteration, english, urdu, reference`
- `namesData.ts`: `NAMES_OF_ALLAH[]` with `id, arabic, transliteration, meaning, urduMeaning, benefit`
- `seerahData.ts`: `SEERAH_STORIES[]` — no `subtitle` field; uses `arabicTitle`
- `hadithBooks.ts`: `LOCAL_HADITHS[]` with `id, bookId, number, arabic, english, urdu, grade, narrator, chapter?` — no `reference` field; `HADITH_BOOKS[]` has `color` field
- `qaris.ts`: `QARIS[]` with `id, name, arabicName, folder, style?` — 24 reciters
