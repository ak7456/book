import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBook } from '../../src/hooks/useBooks';
import { useHighlights } from '../../src/hooks/useHighlights';
import { useReview } from '../../src/hooks/useReview';
import { StatusSelector } from '../../src/components/books/StatusSelector';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';
import { ReadingStatus } from '../../src/types';
import { formatDate, formatDateShort } from '../../src/utils/date';

type Tab = 'info' | 'highlights' | 'review';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { book, loading, update, remove } = useBook(id);
  const { highlights } = useHighlights(id);
  const { review } = useReview(id);
  const [tab, setTab] = useState<Tab>('info');

  if (loading || !book) {
    return <View style={styles.container} />;
  }

  async function handleStatusChange(status: ReadingStatus) {
    await update({ status });
  }

  async function handleDelete() {
    Alert.alert('책 삭제', `"${book!.title}"을(를) 서재에서 삭제할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          await remove();
          router.back();
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} hitSlop={8}>
          <Ionicons name="trash-outline" size={22} color={Colors.error} />
        </TouchableOpacity>
      </View>

      {/* Book Cover + Title */}
      <ScrollView>
        <View style={styles.hero}>
          {book.coverImageUrl ? (
            <Image source={{ uri: book.coverImageUrl }} style={styles.cover} resizeMode="cover" />
          ) : (
            <View style={[styles.cover, styles.coverPlaceholder]}>
              <Text style={styles.placeholderText}>{book.title.slice(0, 2)}</Text>
            </View>
          )}
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>{book.author}</Text>
          {book.publisher && <Text style={styles.bookMeta}>{book.publisher}</Text>}
          {book.finishedAt && (
            <Text style={styles.finishedDate}>{formatDate(book.finishedAt)} 완독</Text>
          )}
        </View>

        {/* Status */}
        <View style={styles.section}>
          <StatusSelector value={book.status} onChange={handleStatusChange} />
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['info', 'highlights', 'review'] as Tab[]).map((t) => (
            <TouchableOpacity key={t} onPress={() => setTab(t)} style={styles.tabItem}>
              <Text style={[styles.tabLabel, tab === t && styles.tabLabelActive]}>
                {t === 'info' ? '정보' : t === 'highlights' ? `발췌 ${highlights.length}` : '감상'}
              </Text>
              {tab === t && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {tab === 'info' && (
          <View style={styles.infoContent}>
            {[
              { label: '저자', value: book.author },
              { label: '출판사', value: book.publisher },
              { label: '출판일', value: book.publishedDate },
              { label: 'ISBN', value: book.isbn },
              { label: '추가일', value: book.addedAt ? formatDateShort(book.addedAt) : undefined },
            ]
              .filter((row) => row.value)
              .map((row) => (
                <View key={row.label} style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{row.label}</Text>
                  <Text style={styles.infoValue}>{row.value}</Text>
                </View>
              ))}
          </View>
        )}

        {tab === 'highlights' && (
          <View style={styles.tabContent}>
            <TouchableOpacity
              onPress={() => router.push(`/book/${id}/highlight/add`)}
              style={styles.actionBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={18} color={Colors.primary} />
              <Text style={styles.actionBtnLabel}>발췌 추가</Text>
            </TouchableOpacity>
            {highlights.length === 0 ? (
              <EmptyState
                emoji="✏️"
                title="발췌 문장이 없어요"
                description="인상 깊은 문장을 기록해보세요."
              />
            ) : (
              highlights.map((h) => (
                <View key={h.id} style={styles.highlightCard}>
                  <Text style={styles.highlightContent}>{h.content}</Text>
                  {h.pageNumber && (
                    <Text style={styles.highlightPage}>p.{h.pageNumber}</Text>
                  )}
                </View>
              ))
            )}
          </View>
        )}

        {tab === 'review' && (
          <View style={styles.tabContent}>
            <TouchableOpacity
              onPress={() => router.push(`/book/${id}/review`)}
              style={styles.actionBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={18} color={Colors.primary} />
              <Text style={styles.actionBtnLabel}>
                {review ? '감상 수정' : '감상 작성'}
              </Text>
            </TouchableOpacity>
            {review?.shortReview ? (
              <View style={styles.reviewCard}>
                <Text style={styles.shortReview}>"{review.shortReview}"</Text>
                {review.fullReview ? (
                  <Text style={styles.fullReview}>{review.fullReview}</Text>
                ) : null}
              </View>
            ) : (
              <EmptyState
                emoji="💭"
                title="감상이 없어요"
                description="이 책에 대한 생각을 기록해보세요."
              />
            )}
          </View>
        )}
      </ScrollView>

      {/* Share Button */}
      {review?.shortReview && (
        <View style={styles.shareFooter}>
          <TouchableOpacity
            onPress={() => router.push(`/book/${id}/share`)}
            style={styles.shareBtn}
            activeOpacity={0.8}
          >
            <Ionicons name="share-outline" size={18} color={Colors.textInverse} />
            <Text style={styles.shareBtnLabel}>공유 카드 만들기</Text>
          </TouchableOpacity>
        </View>
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
  hero: { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, gap: 6 },
  cover: {
    width: 110,
    height: 162,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
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
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  bookAuthor: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  bookMeta: { fontSize: Typography.size.sm, color: Colors.textMuted },
  finishedDate: {
    fontSize: Typography.size.sm,
    color: Colors.done,
    fontWeight: Typography.weight.medium,
  },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  tabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    marginTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    position: 'relative',
  },
  tabLabel: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    color: Colors.textMuted,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: Typography.weight.bold,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
  tabContent: { padding: 16, gap: 12 },
  infoContent: { padding: 16, gap: 0 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoLabel: {
    fontSize: Typography.size.base,
    color: Colors.textMuted,
    fontWeight: Typography.weight.medium,
  },
  infoValue: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  actionBtnLabel: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.primary,
  },
  highlightCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  highlightContent: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    lineHeight: Typography.size.base * Typography.lineHeight.relaxed,
  },
  highlightPage: {
    marginTop: 8,
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    textAlign: 'right',
  },
  reviewCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  shortReview: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.medium,
    color: Colors.textPrimary,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: Typography.size.lg * Typography.lineHeight.relaxed,
  },
  fullReview: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    lineHeight: Typography.size.base * Typography.lineHeight.relaxed,
  },
  shareFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.bg,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
  },
  shareBtnLabel: {
    color: Colors.textInverse,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
  },
});
