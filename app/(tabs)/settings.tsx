import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUIStore } from '../../src/stores/ui';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';

export default function SettingsScreen() {
  const { kakaoApiKey, setKakaoApiKey } = useUIStore();
  const [apiKeyInput, setApiKeyInput] = useState(kakaoApiKey);

  function saveApiKey() {
    setKakaoApiKey(apiKeyInput.trim());
    Alert.alert('저장됨', 'API 키가 저장되었습니다.');
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <Text style={styles.title}>설정</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>책 검색 API</Text>
          <Text style={styles.sectionDesc}>
            카카오 도서 검색 API 키를 입력하면 한국 도서를 더 잘 검색할 수 있어요.{'\n'}
            키 없이도 Google Books로 검색이 가능합니다.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="KakaoAK REST API 키 입력"
            placeholderTextColor={Colors.textMuted}
            value={apiKeyInput}
            onChangeText={setApiKeyInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity onPress={saveApiKey} style={styles.saveBtn} activeOpacity={0.8}>
            <Text style={styles.saveBtnLabel}>저장</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>앱 정보</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>버전</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  title: {
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  section: {
    backgroundColor: Colors.bgCard,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  sectionDesc: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    lineHeight: Typography.size.sm * Typography.lineHeight.relaxed,
    marginBottom: 12,
  },
  input: {
    backgroundColor: Colors.bgMuted,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveBtnLabel: {
    color: Colors.textInverse,
    fontWeight: Typography.weight.semibold,
    fontSize: Typography.size.base,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: Typography.size.base,
    color: Colors.textMuted,
  },
});
