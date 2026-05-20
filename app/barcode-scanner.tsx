import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { searchByISBN as kakaoISBN } from '../src/api/kakao';
import { searchByISBN as googleISBN } from '../src/api/googleBooks';
import { useUIStore } from '../src/stores/ui';
import { Colors } from '../src/constants/colors';
import { Typography } from '../src/constants/typography';

export default function BarcodeScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const { kakaoApiKey } = useUIStore();

  async function handleBarcode({ data }: { data: string }) {
    if (scanned || loading) return;
    setScanned(true);
    setLoading(true);
    try {
      let result = null;
      if (kakaoApiKey) {
        result = await kakaoISBN(data, kakaoApiKey);
      }
      if (!result) {
        result = await googleISBN(data);
      }
      if (result) {
        router.replace({
          pathname: '/book/add-confirm',
          params: { data: JSON.stringify(result) },
        });
      } else {
        router.replace({
          pathname: '/book/add-manual',
        });
      }
    } catch {
      setScanned(false);
    } finally {
      setLoading(false);
    }
  }

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.permissionText}>카메라 권한이 필요해요.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permBtn}>
          <Text style={styles.permBtnLabel}>권한 허용</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8'] }}
        onBarcodeScanned={scanned ? undefined : handleBarcode}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        <SafeAreaView style={styles.topBar} edges={['top']}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.overlayTitle}>바코드 스캔</Text>
          <View style={{ width: 28 }} />
        </SafeAreaView>

        <View style={styles.frame}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
          {loading && <ActivityIndicator size="large" color="#fff" />}
        </View>

        <Text style={styles.hint}>책 뒷면의 바코드를 사각형 안에 맞춰주세요</Text>

        {scanned && !loading && (
          <TouchableOpacity onPress={() => setScanned(false)} style={styles.retryBtn}>
            <Text style={styles.retryLabel}>다시 스캔</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const FRAME = 240;
const CORNER = 24;
const BORDER = 3;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 60,
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  overlayTitle: {
    color: '#fff',
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
  },
  frame: {
    width: FRAME,
    height: FRAME,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: '#fff',
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: BORDER, borderLeftWidth: BORDER },
  cornerTR: { top: 0, right: 0, borderTopWidth: BORDER, borderRightWidth: BORDER },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: BORDER, borderLeftWidth: BORDER },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: BORDER, borderRightWidth: BORDER },
  hint: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: Typography.size.sm,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  retryBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  retryLabel: { color: '#fff', fontSize: Typography.size.base, fontWeight: Typography.weight.semibold },
  permissionText: {
    color: '#fff',
    fontSize: Typography.size.base,
    textAlign: 'center',
    margin: 20,
  },
  permBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 40,
    alignItems: 'center',
  },
  permBtnLabel: {
    color: Colors.textInverse,
    fontWeight: Typography.weight.semibold,
  },
});
