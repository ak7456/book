import AsyncStorage from '@react-native-async-storage/async-storage';
import { Review } from '../types';
import { STORAGE_KEYS } from '../constants/storage';
import { generateId } from '../utils/uuid';
import { nowISO } from '../utils/date';

export async function getReview(bookId: string): Promise<Review | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.REVIEW(bookId));
  return raw ? (JSON.parse(raw) as Review) : null;
}

export async function saveReview(
  bookId: string,
  data: Pick<Review, 'shortReview' | 'fullReview'>
): Promise<Review> {
  const existing = await getReview(bookId);
  const review: Review = {
    id: existing?.id ?? generateId(),
    bookId,
    shortReview: data.shortReview,
    fullReview: data.fullReview,
    updatedAt: nowISO(),
  };
  await AsyncStorage.setItem(STORAGE_KEYS.REVIEW(bookId), JSON.stringify(review));
  return review;
}

export async function deleteReview(bookId: string): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.REVIEW(bookId));
}
