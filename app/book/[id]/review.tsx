import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useReview } from '../../../src/hooks/useReview';
import { Colors } from '../../../src/constants/colors';
import { Typography } from '../../../src/constants/typography';

const MAX_SHORT = 100;

export default function ReviewScreen() {
  const { id: bookId } = useLocalSearchParams<{ id: string }>();
  const { review, save } = useReview(bookId);
  const [shortReview, setShortReview] = useState('');
  const [fullReview, setFullReview] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (review) {
      setShortReview(review.shortReview ?? '');
      setFullReview(review.fullReview ?? '');
    }
  }, [review]);

  async function handleSave() {
    setSaving(true);
    try {
      await save({ shortReview: shortReview.trim() || undefined, fullReview: fullReview.trim() || undefined });
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
          <Text style={styles.title}>감상 작성</Text>
          <TouchableOpacity onPress={handleSave} disabled={saving} hitSlop={8}>
            <Text style={[styles.saveBtn, saving && styles.saveBtnDisabled]}>저장</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>한줄평</Text>
              <Text style={[styles.counter, shortReview.length > MAX_SHORT && styles.counterOver]}>
                {shortReview.length}/{MAX_SHORT}
              </Text>
            </View>
            <TextInput
              style={styles.shortInput}
              placeholder="이 책을 한 줄로 표현한다면..."
              placeholderTextColor={Colors.textMuted}
              value={shortReview}
              onChangeText={(t) => setShortReview(t.slice(0, MAX_SHORT))}
              maxLength={MAX_SHORT}
              returnKeyType="done"
            />
            <Text style={styles.hint}>공유 카드에 표시되는 문구예요.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>긴 감상</Text>
            <TextInput
              style={styles.fullInput}
              placeholder="이 책에 대한 더 자세한 감상을 자유롭게 적어보세요..."
              placeholderTextColor={Colors.textMuted}
              value={fullReview}
              onChangeText={setFullReview}
              multiline
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
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
  content: { padding: 16, gap: 24, paddingBottom: 48 },
  section: { gap: 8 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionLabel: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  counter: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
  },
  counterOver: { color: Colors.error },
  shortInput: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 52,
  },
  hint: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
  },
  fullInput: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 200,
    textAlignVertical: 'top',
  },
});
