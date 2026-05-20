import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useHighlights } from '../../../../src/hooks/useHighlights';
import { Colors } from '../../../../src/constants/colors';
import { Typography } from '../../../../src/constants/typography';

export default function HighlightAddScreen() {
  const { id: bookId } = useLocalSearchParams<{ id: string }>();
  const { add } = useHighlights(bookId);
  const [content, setContent] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [saving, setSaving] = useState(false);

  const canSave = content.trim().length > 0;

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    try {
      await add({
        content: content.trim(),
        pageNumber: pageNumber ? parseInt(pageNumber, 10) : undefined,
      });
      router.back();
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="close" size={26} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>발췌 추가</Text>
          <TouchableOpacity onPress={handleSave} disabled={!canSave || saving} hitSlop={8}>
            <Text style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}>저장</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <TextInput
            style={styles.contentInput}
            placeholder="인상 깊은 문장을 입력하세요..."
            placeholderTextColor={Colors.textMuted}
            value={content}
            onChangeText={setContent}
            multiline
            autoFocus
            textAlignVertical="top"
          />

          <View style={styles.pageRow}>
            <Text style={styles.pageLabel}>페이지</Text>
            <TextInput
              style={styles.pageInput}
              placeholder="선택"
              placeholderTextColor={Colors.textMuted}
              value={pageNumber}
              onChangeText={setPageNumber}
              keyboardType="number-pad"
            />
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  title: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  saveBtn: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    color: Colors.primary,
  },
  saveBtnDisabled: { color: Colors.textMuted },
  content: { flex: 1, padding: 16, gap: 16 },
  contentInput: {
    flex: 1,
    fontSize: Typography.size.lg,
    color: Colors.textPrimary,
    lineHeight: Typography.size.lg * Typography.lineHeight.relaxed,
    textAlignVertical: 'top',
  },
  pageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  pageLabel: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.medium,
    width: 48,
  },
  pageInput: {
    flex: 1,
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    backgroundColor: Colors.bgMuted,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 40,
  },
});
