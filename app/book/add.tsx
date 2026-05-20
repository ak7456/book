import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';

const OPTIONS = [
  {
    icon: 'barcode-outline' as const,
    label: '바코드 스캔',
    desc: 'ISBN 바코드로 빠르게 등록',
    onPress: () => router.push('/barcode-scanner'),
  },
  {
    icon: 'search-outline' as const,
    label: '제목으로 검색',
    desc: '책 제목이나 저자로 검색',
    onPress: () => router.push('/book/add-search'),
  },
  {
    icon: 'create-outline' as const,
    label: '직접 입력',
    desc: '검색되지 않는 책을 직접 입력',
    onPress: () => router.push('/book/add-manual'),
  },
];

export default function BookAddScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>책 추가</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>어떻게 추가하시겠어요?</Text>
        {OPTIONS.map((opt) => (
          <TouchableOpacity key={opt.label} onPress={opt.onPress} style={styles.option} activeOpacity={0.8}>
            <View style={styles.optionIcon}>
              <Ionicons name={opt.icon} size={26} color={Colors.primary} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <Text style={styles.optionDesc}>{opt.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  content: { padding: 16, gap: 12 },
  subtitle: {
    fontSize: Typography.size.base,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: { flex: 1 },
  optionLabel: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  optionDesc: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
  },
});
