1. PROJECT CONTEXT & CONSTRAINTS
| Item                 | Value                                                        |
| -------------------- | ------------------------------------------------------------ |
| **Framework**        | React Native with Expo (managed workflow)                    |
| **Navigation**       | React Navigation (assumed existing: Stack + Tab/Drawer)      |
| **Audio Library**    | `expo-av` (already available in Expo)                        |
| **Styling**          | React Native StyleSheet (consistent with existing app theme) |
| **Language Support** | English + Urdu (dual titles everywhere)                      |
| **Data Storage**     | Local static TypeScript files (no API calls)                 |

2. FILE STRUCTURE TO CREATE

Create these files exactly in these locations. Do not change paths:

src/
├── features/tajweed/
│   ├── data/
│   │   └── qaidaData.ts          ← All 17 lessons with items
│   ├── types/
│   │   └── tajweed.types.ts      ← TypeScript interfaces
│   ├── components/
│   │   ├── LessonCard.tsx        ← Lesson list item
│   │   ├── QaidaGrid.tsx         ← Interactive letter grid
│   │   ├── QaidaItem.tsx         ← Single grid cell
│   │   ├── AudioPlayer.tsx       ← Sound playback controller
│   │   └── TajweedBadge.tsx      ← Color-coded rule indicator
│   ├── screens/
│   │   ├── TajweedHomeScreen.tsx ← Lesson list (17 chapters)
│   │   └── LessonDetailScreen.tsx← Grid workspace
│   ├── hooks/
│   │   └── useAudioPlayer.ts     ← Audio state management
│   ├── constants/
│   │   └── tajweedColors.ts      ← Tajweed rule color mapping
│   └── index.ts                  ← Barrel export
├── navigation/
│   └── (modify existing)         ← Add Tajweed stack
└── assets/audio/qaida/           ← Empty folder for future MP3s

3. TYPE DEFINITIONS (src/features/tajweed/types/tajweed.types.ts)

/**
 * Tajweed rule categories for visual color-coding
 */
export enum TajweedRule {
  NONE = 'none',
  IKHFA = 'ikhfa',           // Green - hidden nasalization
  QALQALAH = 'qalqalah',     // Blue - bouncing sound
  MADD = 'madd',             // Red - prolongation
  GUNNAH = 'gunnah',         // Orange - nasalization
  IDGHAAM = 'idghaam',       // Purple - merging
  IZHAAR = 'izhaar',         // Yellow - clear pronunciation
}

/**
 * Single item in a lesson (one letter or word)
 */
export interface QaidaItem {
  id: string;                 // Unique: "L1_I001", "L3_W005"
  text: string;               // Arabic text: "ا", "بَ", "اَب"
  transliteration: string;    // Latin: "Alif", "Ba", "Ab"
  audioFileName: string;      // "l1_alif.mp3", "l3_ab.mp3"
  descriptionEn: string;      // "Alif - throat letter"
  descriptionUr: string;      // "الف - حلقی حرف"
  tajweedRule: TajweedRule;   // Color-coding rule
  isCompound: boolean;        // false=single letter, true=word
}

/**
 * One of the 17 Noorani Qaida lessons
 */
export interface QaidaLesson {
  id: number;                 // 1 through 17
  titleEn: string;            // "Lesson 1: Individual Letters"
  titleUr: string;            // "سبق ۱: مفردات"
  subtitleEn: string;         // "Learning the Arabic alphabet"
  subtitleUr: string;         // "عربی حروف تہجی"
  descriptionEn: string;      // Longer explanation
  descriptionUr: string;
  items: QaidaItem[];         // Ordered array of lesson content
  gridColumns: number;        // 2, 3, 4, or 5 depending on lesson
  hasAudio: boolean;          // true if all items have audio
}

/**
 * Audio playback state
 */
export interface AudioState {
  isPlaying: boolean;
  currentItemId: string | null;
  isLoading: boolean;
  error: string | null;
}


4. COMPLETE DATA FILE (src/features/tajweed/data/qaidaData.ts)
CRITICAL: Generate all 17 lessons with realistic content. Do NOT leave lessons empty. Use authentic Noorani Qaida progression:

| Lesson # | Title (En/Ur)                   | Content Type           | Grid Columns | Item Count |
| -------- | ------------------------------- | ---------------------- | ------------ | ---------- |
| 1        | Individual Letters / مفردات     | Single Arabic letters  | 5            | 29         |
| 2        | Compound Letters / مرکبات       | Two-letter joins       | 4            | 20         |
| 3        | Harakat (Fatha) / حرکات (فتحہ)  | Letters + Fatha        | 4            | 15         |
| 4        | Harakat (Kasra) / حرکات (کسرہ)  | Letters + Kasra        | 4            | 15         |
| 5        | Harakat (Damma) / حرکات (ضمہ)   | Letters + Damma        | 4            | 15         |
| 6        | Tanween Fatha / تنوین فتحہ      | Letters + Double Fatha | 4            | 10         |
| 7        | Tanween Kasra / تنوین کسرہ      | Letters + Double Kasra | 4            | 10         |
| 8        | Tanween Damma / تنوین ضمہ       | Letters + Double Damma | 4            | 10         |
| 9        | Madd Letters / حروف مدہ         | Long vowels            | 3            | 8          |
| 10       | Leen Letters / حروف لین         | Soft letters           | 3            | 6          |
| 11       | Huroof Muqatta'at / حروف مقطعات | Disjointed letters     | 3            | 10         |
| 12       | Sukun / ساکن                    | Letters with Sukun     | 4            | 12         |
| 13       | Shaddah / شدہ                   | Letters with Shaddah   | 4            | 12         |
| 14       | Shaddah + Tanween / شدہ + تنوین | Combined               | 3            | 10         |
| 15       | Short Words / مختصر کلمات       | 2-3 letter words       | 3            | 15         |
| 16       | Longer Words / طویل کلمات       | 4-5 letter words       | 2            | 12         |
| 17       | Complete Phrases / مکمل عبارات  | Full sentences         | 1            | 8          |

Data schema example for Lesson 1 (generate all 29 items):

export const qaidaLessons: QaidaLesson[] = [
  {
    id: 1,
    titleEn: "Lesson 1: Individual Letters",
    titleUr: "سبق ۱: مفردات",
    subtitleEn: "The Arabic Alphabet",
    subtitleUr: "عربی حروف تہجی",
    descriptionEn: "Learn the 29 Arabic letters with their correct pronunciation (Makhraj).",
    descriptionUr: "29 عربی حروف کو ان کے صحیح مخارج کے ساتھ سیکھیں۔",
    gridColumns: 5,
    hasAudio: false,
    items: [
      {
        id: "L1_I001",
        text: "ا",
        transliteration: "Alif",
        audioFileName: "l1_alif.mp3",
        descriptionEn: "Alif - Throat letter, open sound",
        descriptionUr: "الف - حلقی حرف",
        tajweedRule: TajweedRule.MADD,
        isCompound: false,
      },
      {
        id: "L1_I002",
        text: "ب",
        transliteration: "Baa",
        audioFileName: "l1_baa.mp3",
        descriptionEn: "Baa - Lip letter with slight bounce",
        descriptionUr: "با - لبی حرف",
        tajweedRule: TajweedRule.QALQALAH,
        isCompound: false,
      },
      // ... continue through all 29 letters
    ],
  },
  // ... Lessons 2 through 17 with FULL item arrays
];

Audio path helper (include in same file):

export const getAudioPath = (fileName: string): any => {
  // Placeholder: User will replace with actual require() paths
  // Return null to indicate placeholder
  return null;
};

5. COLOR CONSTANTS (src/features/tajweed/constants/tajweedColors.ts)

import { TajweedRule } from '../types/tajweed.types';

export const TAJWEED_COLORS: Record<TajweedRule, string> = {
  [TajweedRule.NONE]: '#2C3E50',      // Dark slate
  [TajweedRule.IKHFA]: '#27AE60',     // Green
  [TajweedRule.QALQALAH]: '#3498DB',  // Blue
  [TajweedRule.MADD]: '#E74C3C',      // Red
  [TajweedRule.GUNNAH]: '#E67E22',    // Orange
  [TajweedRule.IDGHAAM]: '#9B59B6',   // Purple
  [TajweedRule.IZHAAR]: '#F1C40F',    // Yellow
};

export const TAJWEED_LABELS: Record<TajweedRule, { en: string; ur: string }> = {
  [TajweedRule.NONE]: { en: 'Normal', ur: 'عام' },
  [TajweedRule.IKHFA]: { en: 'Ikhfa', ur: 'اخفاء' },
  [TajweedRule.QALQALAH]: { en: 'Qalqalah', ur: 'قلقلہ' },
  [TajweedRule.MADD]: { en: 'Madd', ur: 'مد' },
  [TajweedRule.GUNNAH]: { en: 'Gunnah', ur: 'غنہ' },
  [TajweedRule.IDGHAAM]: { en: 'Idghaam', ur: 'ادغام' },
  [TajweedRule.IZHAAR]: { en: 'Izhaar', ur: 'اظہار' },
};

6. AUDIO HOOK (src/features/tajweed/hooks/useAudioPlayer.ts)
REQUIREMENTS:
Use expo-av Audio.Sound
Handle: play, stop, unload, error, completion
Prevent multiple simultaneous playback
Show loading state while buffering
Auto-unload sound on component unmount
Track which item is currently playing

import { useState, useCallback, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import { AudioState } from '../types/tajweed.types';

export const useAudioPlayer = () => {
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    currentItemId: null,
    isLoading: false,
    error: null,
  });
  
  const soundRef = useRef<Audio.Sound | null>(null);

  // Configure audio mode once
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const playAudio = useCallback(async (itemId: string, audioSource: any) => {
    // Stop current if playing
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    setState({ isPlaying: false, currentItemId: itemId, isLoading: true, error: null });

    try {
      // Handle placeholder (null source)
      if (!audioSource) {
        // Simulate playback for placeholder
        setTimeout(() => {
          setState({ isPlaying: false, currentItemId: null, isLoading: false, error: null });
        }, 1000);
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        audioSource,
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded && status.didJustFinish) {
            setState(prev => ({ ...prev, isPlaying: false, currentItemId: null }));
          }
        }
      );

      soundRef.current = sound;
      setState({ isPlaying: true, currentItemId: itemId, isLoading: false, error: null });
    } catch (err) {
      setState({
        isPlaying: false,
        currentItemId: null,
        isLoading: false,
        error: 'Failed to play audio',
      });
    }
  }, []);

  const stopAudio = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
    }
    setState({ isPlaying: false, currentItemId: null, isLoading: false, error: null });
  }, []);

  return { ...state, playAudio, stopAudio };
};


7. UI COMPONENTS (Create all of these)
A. LessonCard.tsx
Display: Lesson number, dual titles, subtitle, item count, progress indicator
Style: Card with shadow, right-to-left Urdu support
Tap: Navigate to LessonDetailScreen with lessonId param
B. QaidaGrid.tsx
Props: lesson: QaidaLesson, onItemPress: (item: QaidaItem) => void, playingItemId: string | null
Layout: Dynamic columns based on lesson.gridColumns
Gap: 12px between items
Scroll: Vertical ScrollView with padding
C. QaidaItem.tsx
Props: item: QaidaItem, isPlaying: boolean, isLoading: boolean, onPress: () => void, columnCount: number
Display: Large Arabic text (min 32px), transliteration below, colored border based on tajweedRule
Playing state: Pulsing animation or highlighted background
Loading state: ActivityIndicator overlay
Tap feedback: Scale down to 0.95 on press
D. TajweedBadge.tsx
Props: rule: TajweedRule
Display: Small pill/badge with color dot + rule name (En/Ur)
Show on item detail or long-press tooltip
8. SCREENS (Create both)
A. TajweedHomeScreen.tsx
Header: "Learn Tajweed" / "تجوید سیکھیں" with back button
List: FlatList of 17 LessonCards
Empty state: Not applicable (static data)
Scroll: Vertical, safe area insets respected
B. LessonDetailScreen.tsx
Route params: { lessonId: number }
Header: Lesson title (dual), back button, grid column indicator
Body: QaidaGrid with all lesson items
Audio: Integrated via useAudioPlayer hook
Info bar: Show current playing item name + stop button
Error: Toast/inline message if audio fails
9. NAVIGATION INTEGRATION
Modify existing navigation files:

// In your main navigator (Tab or Drawer)
{
  name: 'Tajweed',
  component: TajweedStackNavigator,
  icon: 'book-open', // or suitable icon
  label: 'Learn Tajweed / تجوید سیکھیں',
}

// TajweedStackNavigator
<Stack.Navigator>
  <Stack.Screen name="TajweedHome" component={TajweedHomeScreen} />
  <Stack.Screen 
    name="LessonDetail" 
    component={LessonDetailScreen}
    options={{ headerShown: false }} // Custom header in screen
  />
</Stack.Navigator>

10. ASSET PLACEHOLDER SETUP
Create empty directory structure:
assets/audio/qaida/
├── l1_alif.mp3 (placeholder - user adds real files later)
├── l1_baa.mp3
└── ... (all mapped in qaidaData.ts)

Migration path for real audio:
When user adds MP3s, they only need to:
Drop files into assets/audio/qaida/
Update getAudioPath() to: return require('../assets/audio/qaida/' + fileName);
11. STYLING REQUIREMENTS
Arabic font: Use system font or specify a font like Amiri or Scheherazade if loaded
Text direction: Arabic/Urdu text must be writingDirection: 'rtl'
Minimum touch target: 48x48dp for each grid item
Color scheme: Respect existing app theme (dark/light mode if implemented)
Accessibility: accessibilityLabel on every item, accessibilityRole="button"
Safe areas: Use SafeAreaView on all screens
12. PERFORMANCE REQUIREMENTS
Memoize all components with React.memo
Use useCallback for all event handlers
FlatList for lesson list (not ScrollView)
Lazy load audio only on tap (not on mount)
Grid items should render in <16ms
13. ERROR HANDLING

| Scenario                | Behavior                                                                  |
| ----------------------- | ------------------------------------------------------------------------- |
| Audio file missing      | Show "Audio coming soon" toast, highlight item visually                   |
| Audio permission denied | Request permission on first tap, show settings link if denied permanently |
| Playback error          | Auto-retry once, then show error message                                  |
| Invalid lessonId        | Navigate back to home with error toast                                    |

14. TESTING CHECKLIST FOR AGENT
After implementation, verify:
[ ] All 17 lessons render in list
[ ] Each lesson navigates to detail
[ ] Grid displays correct number of columns per lesson
[ ] Tapping item shows loading → playing → stopped states
[ ] Only one audio plays at a time
[ ] Back navigation works from all screens
[ ] No console errors or warnings
[ ] Works on both iOS and Android
[ ] Dark mode compatible (if app supports it)

FINAL PROMPT TO PASTE:

Implement the "Learn Tajweed" feature exactly per this specification:

1. Create the complete file structure under src/features/tajweed/ with all subdirectories
2. Define all TypeScript types in tajweed.types.ts using the exact interfaces provided
3. Generate the FULL qaidaData.ts with all 17 lessons and realistic content for each - do not leave any lesson empty or with placeholder comments
4. Implement useAudioPlayer hook using expo-av with proper cleanup, error handling, and single-playback enforcement
5. Build all 4 UI components (LessonCard, QaidaGrid, QaidaItem, TajweedBadge) with memoization
6. Build both screens (TajweedHomeScreen, LessonDetailScreen) with SafeAreaView and proper navigation
7. Add the Tajweed stack to existing navigation with appropriate icons
8. Create the assets/audio/qaida/ directory structure
9. Use the exact color constants for tajweed rules
10. Ensure all Arabic/Urdu text has RTL direction
11. Add accessibility labels to all interactive elements
12. Test that tapping items cycles through loading/playing/stopped states correctly
13. Do not use any external APIs - all data is local
14. Use placeholder audio paths that can be easily replaced later with real MP3 files

Generate all code now. Do not ask questions. Do not skip any lessons. Make it production-ready.





