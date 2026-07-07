import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import { reloadAppAsync } from 'expo';
import { translations, Language, TranslationKey } from '@/constants/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
  isOnboarded: boolean;
  completeOnboarding: () => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [savedLang, onboarded] = await Promise.all([
          AsyncStorage.getItem('language'),
          AsyncStorage.getItem('onboarded'),
        ]);
        if (savedLang) setLanguageState(savedLang as Language);
        if (onboarded === 'true') setIsOnboarded(true);
      } catch {}
      setLoaded(true);
    })();
  }, []);

  const isRTL = language === 'ar' || language === 'ur';

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem('language', lang);
      setLanguageState(lang);
      const newIsRTL = lang === 'ar' || lang === 'ur';
      if (I18nManager.isRTL !== newIsRTL) {
        I18nManager.forceRTL(newIsRTL);
        await reloadAppAsync();
      }
    } catch {}
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('onboarded', 'true');
    setIsOnboarded(true);
  };

  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] ?? translations.en[key] ?? key;
  };

  if (!loaded) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, isOnboarded, completeOnboarding }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
