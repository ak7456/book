import AsyncStorage from '@react-native-async-storage/async-storage';
import { Highlight } from '../types';
import { STORAGE_KEYS } from '../constants/storage';
import { generateId } from '../utils/uuid';
import { nowISO } from '../utils/date';

export async function getHighlights(bookId: string): Promise<Highlight[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.HIGHLIGHTS(bookId));
  return raw ? (JSON.parse(raw) as Highlight[]) : [];
}

export async function addHighlight(
  bookId: string,
  data: Pick<Highlight, 'content' | 'pageNumber'>
): Promise<Highlight> {
  const highlight: Highlight = {
    id: generateId(),
    bookId,
    content: data.content,
    pageNumber: data.pageNumber,
    createdAt: nowISO(),
  };
  const existing = await getHighlights(bookId);
  await AsyncStorage.setItem(
    STORAGE_KEYS.HIGHLIGHTS(bookId),
    JSON.stringify([highlight, ...existing])
  );
  return highlight;
}

export async function deleteHighlight(bookId: string, highlightId: string): Promise<void> {
  const existing = await getHighlights(bookId);
  const updated = existing.filter((h) => h.id !== highlightId);
  await AsyncStorage.setItem(STORAGE_KEYS.HIGHLIGHTS(bookId), JSON.stringify(updated));
}
