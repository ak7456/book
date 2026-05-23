import { useRef, useCallback } from 'react';
import { View, Alert } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

export function useShareCard() {
  const cardRef = useRef<View>(null);

  const capture = useCallback(async (): Promise<string> => {
    if (!cardRef.current) throw new Error('Card ref not ready');
    // 동적 import: Expo Go에서 네이티브 모듈 부재로 인한 시작 크래시 방지
    const { captureRef } = await import('react-native-view-shot');
    return captureRef(cardRef, {
      format: 'png',
      quality: 1.0,
      result: 'tmpfile',
    });
  }, []);

  const saveToGallery = useCallback(async (uri: string) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '갤러리에 저장하려면 미디어 라이브러리 접근 권한이 필요해요.');
      return false;
    }
    await MediaLibrary.saveToLibraryAsync(uri);
    return true;
  }, []);

  const share = useCallback(async (uri: string) => {
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      Alert.alert('공유 불가', '이 기기에서는 공유 기능을 사용할 수 없어요.');
      return;
    }
    await Sharing.shareAsync(uri, {
      mimeType: 'image/png',
      dialogTitle: '독서 카드 공유하기',
      UTI: 'public.png',
    });
  }, []);

  return { cardRef, capture, saveToGallery, share };
}
