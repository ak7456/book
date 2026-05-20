import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, Image, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { searchBooks as kakaoSearch } from '../../src/api/kakao';
import { searchBooks as googleSearch } from '../../src/api/googleBooks';
import { BookSearchResult } from '../../src/api/kakao';
import { useUIStore } from '../../src/stores/ui';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';

export default function BookAddSearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { kakaoApiKey } = useUIStore();

  const search = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      let books: BookSearchResult[] = [];
      if (kakaoApiKey) {
        books = await kakaoSearch(query, kakaoApiKey);
      }
      if (books.length === 0) {
        books = await googleSearch(query);
      }
      setResults(books);
    } catch {
      setError('검색 중 오류가 발생했어요. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }, [query, kakaoApiKey]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>책 검색</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="제목, 저자, ISBN으로 검색"
          placeholderTextColor={Colors.textMuted}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={search}
          autoFocus
        />
        <TouchableOpacity onPress={search} style={styles.searchBtn} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.textInverse} />
          ) : (
            <Ionicons name="search" size={20} color={Colors.textInverse} />
          )}
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            !loading && results.length === 0 && query ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>검색 결과가 없어요</Text>
                <TouchableOpacity onPress={() => router.push('/book/add-manual')}>
                  <Text style={styles.manualLink}>직접 입력하기</Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() =>
                router.push({
                  pathname: '/book/add-confirm',
                  params: { data: JSON.stringify(item) },
                })
              }
              activeOpacity={0.8}
            >
              {item.thumbnail ? (
                <Image source={{ uri: item.thumbnail }} style={styles.cover} resizeMode="cover" />
              ) : (
                <View style={[styles.cover, styles.coverPlaceholder]}>
                  <Text style={styles.placeholderText}>{item.title.slice(0, 2)}</Text>
                </View>
              )}
              <View style={styles.info}>
                <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.bookAuthor} numberOfLines={1}>{item.authors.join(', ')}</Text>
                {item.publisher && (
                  <Text style={styles.bookPublisher} numberOfLines={1}>{item.publisher}</Text>
                )}
              </View>
              <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
          )}
        />
      )}
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
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  cover: { width: 48, height: 68, borderRadius: 6 },
  coverPlaceholder: {
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.primary,
  },
  info: { flex: 1 },
  bookTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  bookAuthor: { fontSize: Typography.size.sm, color: Colors.textSecondary, marginBottom: 2 },
  bookPublisher: { fontSize: Typography.size.xs, color: Colors.textMuted },
  error: { color: Colors.error, paddingHorizontal: 16, marginTop: 8 },
  empty: { alignItems: 'center', paddingTop: 40 },
  emptyText: { fontSize: Typography.size.base, color: Colors.textMuted, marginBottom: 12 },
  manualLink: {
    fontSize: Typography.size.base,
    color: Colors.primary,
    fontWeight: Typography.weight.semibold,
  },
});
