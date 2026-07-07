---
name: Deen o Dunya app architecture
description: Islamic planner Expo app — screens, providers, data sources, known caveats, feature inventory
---

## Stack
- Expo SDK 52/53, expo-router v6, React Native 0.81
- Dark Islamic theme: bg `#0A1628`, primary `#2D9B6B`, gold `#C9A84C`
- AsyncStorage for all local persistence (no backend)
- Free APIs: AlQuran.cloud, AlAdhan, Overpass (masjids)
- react-native-reanimated v4 (already installed) — use for animations
- react-native-view-shot (installed this session) — use for poster/image capture
- expo-linear-gradient (installed) — use for gradient backgrounds

## Provider Stack (root `_layout.tsx`)
`LanguageProvider → AppProvider → PrayerProvider → AudioProvider → Stack + AudioPlayerBar`

**Critical rule**: `completeOnboarding()` must be called BEFORE `setLanguage()` because `setLanguage` may call `reloadAppAsync()` for RTL switches.

## Navigation / Routing
- `app/index.tsx` — redirects based on `isOnboarded` flag
- Onboarding: navigates to `/` (not directly to `/(tabs)`) after completing
- Five-tab layout always uses stable `Tabs` (not NativeTabs which broke contexts)
- All routes registered in `app/_layout.tsx` Stack

## AudioContext — Design Rules (CRITICAL)
**Problem solved**: `play()` was a `useCallback` closing over stale `currentQari` state, causing wrong reciter to play.

**Solution**: Every mutable value that `play()` or `onPlaybackStatusUpdate()` reads uses a `useRef` in addition to `useState`:
- `currentQariRef` — setQari updates this synchronously BEFORE React re-renders
- `currentSurahRef`, `currentAyahRef`, `totalAyahsRef` — auto-advance reads these refs
- `playRef` — onPlaybackStatusUpdate calls this to avoid circular useCallback deps

**Rule**: `onPlaybackStatusUpdate` must have `[]` deps (uses refs only). `play` depends only on `onPlaybackStatusUpdate`. Never add state values as deps to these two callbacks.

**setQari() contract**: ALWAYS update `currentQariRef.current` synchronously alongside `setCurrentQari(qari)`. The ref is what `play()` reads.

## AudioPlayerBar — Positioning
Uses `useSegments()` (NOT `usePathname`) to detect tab vs stack screens:
- `segments[0] === '(tabs)'` → tab screen: `bottom = 83 + insets.bottom` (clears tab bar)
- otherwise → stack screen (surah reader): `bottom = 0 + insets.bottom`

**Why useSegments**: Expo Router strips group names like `(tabs)` from `pathname`, but `useSegments` returns raw segments including group names. `pathname.includes('(tabs)')` is WRONG.

## Known Expo Go Limitations
- `expo-notifications` — push removed SDK 53; loaded via `try-catch require()`, null in Expo Go
- `expo-sensors Magnetometer` — also `try-catch require()`, shows warning card in Qibla
- `expo-av` deprecated (warning only) — use expo-audio in SDK 54+

## Quran Feature Inventory (Step 1 complete, bug-fixed)

### Qaris (22 verified — all tested 200 on everyayah.com)
Key fixed folder names:
- Maher Al-Muaiqly: `MaherAlMuaiqly128kbps` (not Maher_Al_Muaiqly_128kbps)
- Abdul Basit Murattal: `Abdul_Basit_Murattal_64kbps` (not AbdulSamad...)
- Minshawi: `Menshawi_32kbps` (128kbps was 404)
- Saad Al-Ghamdi: `Ghamadi_40kbps` (all 128kbps variants were 404)
- Khalid Al-Qahtani: `Khaalid_Abdullaah_al-Qahtaanee_192kbps`
- Reciters completely removed (no working URL found): Shuraim, Hani Rifai, Abdullah Matrood, Bandar Baleela, Raad Kurdi

**Audio translation audio**: NOT available per-ayah on everyayah.com. All tested Urdu/English translation audio folders return 404. Needs a different CDN if this feature is wanted.

### Tafsir editions (7 verified on AlQuran.cloud)
`en.maududi`, `ar.muyassar`, `ar.jalalayn`, `ar.qurtubi`, `ar.baghawi`, `ar.waseet`, `ar.miqbas`
Javed Ghamidi tafsir: NOT on AlQuran.cloud, no API available.

### Surah Reader (`app/quran/[surah].tsx`)
- `AyahCard` extracted as separate memo'd component — required for Reanimated hooks
- Pulsing animated border: `useSharedValue` + `withRepeat(withSequence(...))` in AyahCard
- Auto-scroll: `useEffect` watches `currentAyah + isSurahPlaying`, scrolls FlatList with 150ms delay
- Poster: `PosterModal` uses `captureRef` from react-native-view-shot + LinearGradient
- FlatList footer: `PLAYER_BAR_H + 80` px to prevent player bar covering last ayah
- `BOOKMARKS_KEY = 'quran_bookmarks_v2'` — same in reader and bookmarks screen

### Global Search (`app/quran/search.tsx`)
- Language tabs: English (en.sahih), Urdu (ur.maududi), Arabic (ar.uthmani)
- After search: parallel fetches Arabic text for each result (Promise.all up to 50)
- AbortController cancels stale requests on language switch
- Poster: launches PosterModal from search results too
- Quick-search chips on empty state

### Search Entry Point (`app/(tabs)/quran.tsx`)
Prominent green banner "Search Quran Verses" navigates to `/quran/search`. Separate inline search for surah name/number filter.

## Constants Field Names (DO NOT CHANGE — screens depend on these)
- `colors.ts`: uses `destructive` not `error`; no `radius` key
- `translations.ts`: key is `calcMethod` not `calculationMethod`
- `quranData.ts`: `SURAHS[]` with `id, name, nameEnglish, meaning, revelationType, totalAyahs`
- `quranData.ts`: `TRANSLATION_EDITIONS[]` (5) and `TAFSEER_EDITIONS[]` (7)
- `duasData.ts`: `DUA_CATEGORIES: string[]` (flat); `DUAS[]` with `title, category, arabic, transliteration, english, urdu, reference`
- `namesData.ts`: `NAMES_OF_ALLAH[]` with `id, arabic, transliteration, meaning, urduMeaning, benefit`
- `seerahData.ts`: `SEERAH_STORIES[]` — no `subtitle` field; uses `arabicTitle`
- `hadithBooks.ts`: `LOCAL_HADITHS[]` with `id, bookId, number, arabic, english, urdu, grade, narrator, chapter?` — no `reference` field; `HADITH_BOOKS[]` has `color` field
- `qaris.ts`: `QARIS[]` with `id, name, arabicName, folder, style?` — 22 reciters (all verified 200)
