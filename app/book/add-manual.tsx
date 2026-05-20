import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { addBook } from '../../src/storage/books';
import { Button } from '../../src/components/ui/Button';
import { StatusSelector } from '../../src/components/books/StatusSelector';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';
import { ReadingStatus } from '../../src/types';

export default function BookAddManualScreen() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [publishedDate, setPublishedDate] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [status, setStatus] = useState<ReadingStatus>('WANT_TO_READ');
  const [saving, setSaving] = useState(false);

  const canSave = title.trim().length > 0 && author.trim().length > 0;

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    try {
      const saved = await addBook({
        title: title.trim(),
        author: author.trim(),
        publisher: publisher.trim() || undefined,
        publishedDate: publishedDate.trim() || undefined,
        coverImageUrl: coverUrl.trim() || undefined,
      });
      await import('../../src/storage/books').then(({ updateBook }) =>
        updateBook(saved.id, { status })
      );
      router.dismissAll();
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>직접 입력</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {[
          { label: '제목 *', value: title, onChange: setTitle, placeholder: '책 제목' },
          { label: '저자 *', value: author, onChange: setAuthor, placeholder: '저자명' },
          { label: '출판사', value: publisher, onChange: setPublisher, placeholder: '출판사 (선택)' },
          { label: '출판일', value: publishedDate, onChange: setPublishedDate, placeholder: 'YYYY-MM-DD (선택)' },
          { label: '표지 이미지 URL', value: coverUrl, onChange: setCoverUrl, placeholder: 'https://... (선택)' },
        ].map((field) => (
          <View key={field.label} style={styles.field}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              placeholderTextColor={Colors.textMuted}
              value={field.value}
              onChangeText={field.onChange}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        ))}

        <View style={styles.field}>
          <Text style={styles.label}>독서 상태</Text>
          <StatusSelector value={status} onChange={setStatus} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="서재에 추가하기"
          onPress={handleSave}
          loading={saving}
          disabled={!canSave}
          style={{ width: '100%' }}
        />
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
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  field: { gap: 6 },
  label: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.textSecondary,
  },
  input: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 44,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.bg,
  },
});
