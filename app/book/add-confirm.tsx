import React, { useState } from 'react';
import {
  View, Text, Image, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BookSearchResult } from '../../src/api/kakao';
import { addBook } from '../../src/storage/books';
import { StatusSelector } from '../../src/components/books/StatusSelector';
import { Button } from '../../src/components/ui/Button';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';
import { ReadingStatus } from '../../src/types';

export default function BookAddConfirmScreen() {
  const { data } = useLocalSearchParams<{ data: string }>();
  const book: BookSearchResult = JSON.parse(data);
  const [status, setStatus] = useState<ReadingStatus>('WANT_TO_READ');
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    setSaving(true);
    try {
      const saved = await addBook({
        title: book.title,
        author: book.authors.join(', '),
        publisher: book.publisher || undefined,
        publishedDate: book.datetime ? book.datetime.slice(0, 10) : undefined,
        coverImageUrl: book.thumbnail || undefined,
        isbn: book.isbn || undefined,
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
        <Text style={styles.title}>책 확인</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.bookCard}>
          {book.thumbnail ? (
            <Image source={{ uri: book.thumbnail }} style={styles.cover} resizeMode="cover" />
          ) : (
            <View style={[styles.cover, styles.coverPlaceholder]}>
              <Text style={styles.placeholderText}>{book.title.slice(0, 2)}</Text>
            </View>
          )}
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>{book.authors.join(', ')}</Text>
          {book.publisher ? (
            <Text style={styles.bookMeta}>{book.publisher}</Text>
          ) : null}
          {book.datetime ? (
            <Text style={styles.bookMeta}>{book.datetime.slice(0, 10)}</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>독서 상태</Text>
          <StatusSelector value={status} onChange={setStatus} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="서재에 추가하기" onPress={handleAdd} loading={saving} style={styles.addBtn} />
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
  content: { padding: 16, gap: 20 },
  bookCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  cover: {
    width: 100,
    height: 148,
    borderRadius: 8,
    marginBottom: 8,
  },
  coverPlaceholder: {
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.primary,
  },
  bookTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  bookAuthor: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  bookMeta: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
  },
  section: { gap: 8 },
  sectionLabel: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.bg,
  },
  addBtn: { width: '100%' },
});
