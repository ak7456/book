import React from 'react';
import {
  View, FlatList, TouchableOpacity, Text, StyleSheet,
  ScrollView, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBooks } from '../../src/hooks/useBooks';
import { useUIStore } from '../../src/stores/ui';
import { BookGridItem } from '../../src/components/books/BookGridItem';
import { BookListItem } from '../../src/components/books/BookListItem';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Button } from '../../src/components/ui/Button';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';
import { ReadingStatus } from '../../src/types';

const STATUS_FILTERS: { value: ReadingStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'WANT_TO_READ', label: '읽고 싶다' },
  { value: 'READING', label: '읽는 중' },
  { value: 'DONE', label: '완독' },
];

const COLUMN_COUNT = 3;
const GAP = 12;
const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = (SCREEN_WIDTH - 32 - GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

export default function LibraryScreen() {
  const { books, loading, reload } = useBooks();
  const { statusFilter, sortOrder, viewMode, setStatusFilter, setSortOrder, setViewMode } =
    useUIStore();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>서재</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            style={styles.iconBtn}
            hitSlop={8}
          >
            <Ionicons
              name={viewMode === 'grid' ? 'list-outline' : 'grid-outline'}
              size={22}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/book/add')}
            style={[styles.iconBtn, styles.addBtn]}
            hitSlop={8}
          >
            <Ionicons name="add" size={22} color={Colors.textInverse} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Status Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {STATUS_FILTERS.map((f) => (
          <TouchableOpacity
            key={f.value}
            onPress={() => setStatusFilter(f.value)}
            style={[styles.filterChip, statusFilter === f.value && styles.filterChipActive]}
          >
            <Text
              style={[styles.filterLabel, statusFilter === f.value && styles.filterLabelActive]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort Row */}
      <View style={styles.sortRow}>
        <Text style={styles.bookCount}>{books.length}권</Text>
        <View style={styles.sortButtons}>
          {(['addedAt', 'title', 'finishedAt'] as const).map((order) => (
            <TouchableOpacity key={order} onPress={() => setSortOrder(order)} hitSlop={4}>
              <Text
                style={[styles.sortBtn, sortOrder === order && styles.sortBtnActive]}
              >
                {order === 'addedAt' ? '최근 추가' : order === 'title' ? '제목순' : '완독일순'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Book List */}
      {books.length === 0 && !loading ? (
        <EmptyState
          emoji="📚"
          title="아직 책이 없어요"
          description="첫 번째 책을 추가해 독서 기록을 시작해보세요."
          action={
            <Button
              label="책 추가하기"
              onPress={() => router.push('/book/add')}
            />
          }
        />
      ) : viewMode === 'grid' ? (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          numColumns={COLUMN_COUNT}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          onRefresh={reload}
          refreshing={loading}
          renderItem={({ item }) => (
            <View style={{ width: ITEM_WIDTH }}>
              <BookGridItem
                book={item}
                onPress={() => router.push(`/book/${item.id}`)}
              />
            </View>
          )}
        />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onRefresh={reload}
          refreshing={loading}
          renderItem={({ item }) => (
            <BookListItem
              book={item}
              onPress={() => router.push(`/book/${item.id}`)}
            />
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
  headerTitle: {
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: { backgroundColor: Colors.primary },
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.bgMuted,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterLabel: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.textSecondary,
  },
  filterLabelActive: { color: Colors.textInverse },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  bookCount: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    fontWeight: Typography.weight.medium,
  },
  sortButtons: { flexDirection: 'row', gap: 12 },
  sortBtn: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    fontWeight: Typography.weight.medium,
  },
  sortBtnActive: {
    color: Colors.primary,
    fontWeight: Typography.weight.bold,
  },
  gridContent: { padding: 16, gap: GAP },
  gridRow: { gap: GAP },
  listContent: { paddingVertical: 8 },
});
