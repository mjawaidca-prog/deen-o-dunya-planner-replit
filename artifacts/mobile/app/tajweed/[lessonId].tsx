import React, { useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import LessonDetailScreen from '@/src/features/tajweed/screens/LessonDetailScreen';

export default function LessonDetailRoute() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();

  const handleBack = useCallback(() => router.back(), [router]);

  const id = parseInt(lessonId ?? '1', 10);

  return <LessonDetailScreen lessonId={id} onBack={handleBack} />;
}
