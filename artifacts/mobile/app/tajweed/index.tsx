import React, { useCallback } from 'react';
import { useRouter } from 'expo-router';
import TajweedHomeScreen from '@/src/features/tajweed/screens/TajweedHomeScreen';

export default function TajweedHomeRoute() {
  const router = useRouter();

  const handleBack = useCallback(() => router.back(), [router]);

  const handleSelectLesson = useCallback(
    (lessonId: number) => {
      router.push({
        pathname: '/tajweed/[lessonId]',
        params: { lessonId: String(lessonId) },
      });
    },
    [router],
  );

  return (
    <TajweedHomeScreen
      onBack={handleBack}
      onSelectLesson={handleSelectLesson}
    />
  );
}
