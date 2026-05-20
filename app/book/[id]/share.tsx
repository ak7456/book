import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBook } from '../../../src/hooks/useBooks';
import { useReview } from '../../../src/hooks/useReview';
import { useShareCard } from '../../../src/hooks/useShareCard';
import { ShareCard, CardTemplate } from '../../../src/components/share/ShareCard';
import { Colors } from '../../../src/constants/colors';
import { Typography } from '../../../src/constants/typography';

const TEMPLATES: { value: CardTemplate; label: string; emoji: string }[] = [
  { value: 'simple', label: '심플', emoji: '☀️' },
  { value: 'dark', label: '다크', emoji: '🌙' },
  { value: 'vintage', label: '빈티지', emoji: '📜' },
];

const RATIOS: Array<'9:16' | '1:1'> = ['9:16', '1:1'];

export default function ShareScreen() {
  const { id: bookId } = useLocalSearchParams<{ id: string }>();
  const { book } = useBook(bookId);
  const { review } = useReview(bookId);
  const { cardRef, capture, saveToGallery, share } = useShareCard();
  const [template, setTemplate] = useState<CardTemplate>('simple');
  const [ratio, setRatio] = useState<'9:16' | '1:1'>('9:16');
  const [working, setWorking] = useState(false);

  if (!book || !review?.shortReview) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>공유 카드</Text>
          <View style={{ width: 26 }} />
        </View>
        <View style={styles.noReview}>
          <Text style={styles.noReviewEmoji}>💭</Text>
          <Text style={styles.noReviewText}>한줄평을 먼저 작성해주세요.</Text>
          <Text style={styles.noReviewSub}>감상 탭에서 한줄평을 입력하면{'\n'}공유 카드를 만들 수 있어요.</Text>
        </View>
      </SafeAreaView>
    );
  }

  async function handleSave() {
    setWorking(true);
    try {
      const uri = await capture();
      const saved = await saveToGallery(uri);
      if (saved) Alert.alert('저장 완료', '카드가 갤러리에 저장되었어요.');
    } catch {
      Alert.alert('오류', '카드 생성 중 문제가 발생했어요.');
    } finally {
      setWorking(false);
    }
  }

  async function handleShare() {
    setWorking(true);
    try {
      const uri = await capture();
      await share(uri);
    } catch {
      Alert.alert('오류', '공유 중 문제가 발생했어요.');
    } finally {
      setWorking(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>공유 카드</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Card Preview */}
        <View style={styles.cardPreview} ref={cardRef} collapsable={false}>
          <ShareCard
            book={book}
            shortReview={review.shortReview}
            template={template}
            ratio={ratio}
          />
        </View>

        {/* Template Selector */}
        <View style={styles.optionSection}>
          <Text style={styles.optionLabel}>템플릿</Text>
          <View style={styles.templateRow}>
            {TEMPLATES.map((t) => (
              <TouchableOpacity
                key={t.value}
                onPress={() => setTemplate(t.value)}
                style={[styles.templateBtn, template === t.value && styles.templateBtnActive]}
                activeOpacity={0.8}
              >
                <Text style={styles.templateEmoji}>{t.emoji}</Text>
                <Text style={[styles.templateLabel, template === t.value && styles.templateLabelActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Ratio Selector */}
        <View style={styles.optionSection}>
          <Text style={styles.optionLabel}>비율</Text>
          <View style={styles.ratioRow}>
            {RATIOS.map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => setRatio(r)}
                style={[styles.ratioBtn, ratio === r && styles.ratioBtnActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.ratioLabel, ratio === r && styles.ratioLabelActive]}>
                  {r} {r === '9:16' ? '(스토리즈)' : '(피드)'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.footerBtn, styles.footerBtnSecondary]}
          disabled={working}
          activeOpacity={0.8}
        >
          {working ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <>
              <Ionicons name="download-outline" size={18} color={Colors.primary} />
              <Text style={styles.footerBtnSecondaryLabel}>저장</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleShare}
          style={[styles.footerBtn, styles.footerBtnPrimary]}
          disabled={working}
          activeOpacity={0.8}
        >
          <Ionicons name="share-outline" size={18} color={Colors.textInverse} />
          <Text style={styles.footerBtnPrimaryLabel}>공유하기</Text>
        </TouchableOpacity>
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
  content: { padding: 16, gap: 24, paddingBottom: 16 },
  cardPreview: {
    alignItems: 'center',
  },
  optionSection: { gap: 10 },
  optionLabel: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  templateRow: { flexDirection: 'row', gap: 10 },
  templateBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    gap: 4,
  },
  templateBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '11' },
  templateEmoji: { fontSize: 22 },
  templateLabel: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.textSecondary,
  },
  templateLabelActive: { color: Colors.primary, fontWeight: Typography.weight.bold },
  ratioRow: { flexDirection: 'row', gap: 10 },
  ratioBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  ratioBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '11' },
  ratioLabel: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.textSecondary,
  },
  ratioLabelActive: { color: Colors.primary, fontWeight: Typography.weight.bold },
  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.bg,
  },
  footerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    minHeight: 52,
  },
  footerBtnSecondary: {
    backgroundColor: Colors.bgMuted,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  footerBtnPrimary: { backgroundColor: Colors.primary },
  footerBtnSecondaryLabel: {
    color: Colors.primary,
    fontWeight: Typography.weight.semibold,
    fontSize: Typography.size.base,
  },
  footerBtnPrimaryLabel: {
    color: Colors.textInverse,
    fontWeight: Typography.weight.semibold,
    fontSize: Typography.size.base,
  },
  noReview: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  noReviewEmoji: { fontSize: 56, marginBottom: 16 },
  noReviewText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  noReviewSub: {
    fontSize: Typography.size.base,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: Typography.size.base * Typography.lineHeight.relaxed,
  },
});
