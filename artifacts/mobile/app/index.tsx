import { Redirect } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';

export default function Index() {
  const { isOnboarded } = useLanguage();
  return <Redirect href={isOnboarded ? '/(tabs)' : '/onboarding'} />;
}
