import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Book } from '../../types';

export type CardTemplate = 'simple' | 'dark' | 'vintage';

const TEMPLATES: Record<CardTemplate, { bg: string[]; text: string; sub: string; watermark: string }> = {
  simple: {
    bg: ['#FFFFFF', '#F5F0EB'],
    text: '#1A1208',
    sub: '#6B5744',
    watermark: '#C8BEB4',
  },
  dark: {
    bg: ['#1A1208', '#2D2018'],
    text: '#F5F0EB',
    sub: '#C8BEB4',
    watermark: '#4A3728',
  },
  vintage: {
    bg: ['#F2E8D9', '#E8D4B8'],
    text: '#2D1F0E',
    sub: '#7A5C3A',
    watermark: '#C4A882',
  },
};

interface Props {
  book: Book;
  shortReview: string;
  template: CardTemplate;
  ratio?: '9:16' | '1:1';
}

export function ShareCard({ book, shortReview, template, ratio = '9:16' }: Props) {
  const t = TEMPLATES[template];
  const isSquare = ratio === '1:1';

  return (
    <LinearGradient
      colors={t.bg as [string, string]}
      style={[styles.card, isSquare && styles.cardSquare]}
    >
      {/* Cover Image */}
      {book.coverImageUrl ? (
        <Image
          source={{ uri: book.coverImageUrl }}
          style={[styles.cover, isSquare && styles.coverSquare]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.cover, styles.coverPlaceholder, isSquare && styles.coverSquare]}>
          <Text style={[styles.placeholderText, { color: t.sub }]}>
            {book.title.slice(0, 2)}
          </Text>
        </View>
      )}

      {/* Quote */}
      <View style={styles.quoteBlock}>
        <Text style={[styles.quoteMark, { color: t.sub }]}>"</Text>
        <Text style={[styles.quoteText, { color: t.text }]} numberOfLines={6}>
          {shortReview}
        </Text>
        <Text style={[styles.quoteMark, styles.quoteMarkClose, { color: t.sub }]}>"</Text>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: t.sub + '40' }]} />

      {/* Book Info */}
      <View style={styles.bookInfo}>
        <Text style={[styles.bookTitle, { color: t.text }]} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={[styles.bookAuthor, { color: t.sub }]}>{book.author}</Text>
      </View>

      {/* Watermark */}
      <Text style={[styles.watermark, { color: t.watermark }]}>Bookshelf</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 320,
    height: 568,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  cardSquare: {
    width: 320,
    height: 320,
    padding: 24,
    gap: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cover: {
    width: 100,
    height: 148,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  coverSquare: { width: 80, height: 120 },
  coverPlaceholder: {
    backgroundColor: '#C9956A22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: { fontSize: 28, fontWeight: '700' },
  quoteBlock: { width: '100%', alignItems: 'center' },
  quoteMark: { fontSize: 40, fontWeight: '700', lineHeight: 40 },
  quoteMarkClose: { alignSelf: 'flex-end' },
  quoteText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 26,
    marginVertical: 4,
  },
  divider: { width: 48, height: 1 },
  bookInfo: { alignItems: 'center', gap: 4 },
  bookTitle: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  bookAuthor: { fontSize: 13, textAlign: 'center' },
  watermark: { position: 'absolute', bottom: 16, fontSize: 11, fontWeight: '600' },
});
