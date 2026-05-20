import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book, ReadingStatus, SortOrder } from '../types';
import { STORAGE_KEYS } from '../constants/storage';
import { generateId } from '../utils/uuid';
import { nowISO } from '../utils/date';

async function getAllIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.BOOKS_ALL);
  return raw ? JSON.parse(raw) : [];
}

export async function getAllBooks(): Promise<Book[]> {
  const ids = await getAllIds();
  if (ids.length === 0) return [];
  const pairs = await AsyncStorage.multiGet(ids.map(STORAGE_KEYS.BOOK));
  return pairs
    .map(([, v]) => (v ? (JSON.parse(v) as Book) : null))
    .filter((b): b is Book => b !== null);
}

export async function getBook(id: string): Promise<Book | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.BOOK(id));
  return raw ? (JSON.parse(raw) as Book) : null;
}

export async function addBook(data: Omit<Book, 'id' | 'addedAt' | 'status'>): Promise<Book> {
  const book: Book = {
    ...data,
    id: generateId(),
    status: 'WANT_TO_READ',
    addedAt: nowISO(),
  };
  const ids = await getAllIds();
  await AsyncStorage.multiSet([
    [STORAGE_KEYS.BOOK(book.id), JSON.stringify(book)],
    [STORAGE_KEYS.BOOKS_ALL, JSON.stringify([book.id, ...ids])],
  ]);
  return book;
}

export async function updateBook(id: string, updates: Partial<Book>): Promise<Book> {
  const book = await getBook(id);
  if (!book) throw new Error(`Book ${id} not found`);

  const updated: Book = { ...book, ...updates };

  // Auto-record finishedAt when status changes to DONE
  if (updates.status === 'DONE' && !book.finishedAt) {
    updated.finishedAt = nowISO();
  }
  // Clear finishedAt when status moves away from DONE
  if (updates.status && updates.status !== 'DONE') {
    updated.finishedAt = undefined;
  }

  await AsyncStorage.setItem(STORAGE_KEYS.BOOK(id), JSON.stringify(updated));
  return updated;
}

export async function deleteBook(id: string): Promise<void> {
  const ids = await getAllIds();
  const newIds = ids.filter((i) => i !== id);
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.BOOK(id),
    STORAGE_KEYS.HIGHLIGHTS(id),
    STORAGE_KEYS.REVIEW(id),
  ]);
  await AsyncStorage.setItem(STORAGE_KEYS.BOOKS_ALL, JSON.stringify(newIds));
}

export function sortBooks(books: Book[], order: SortOrder): Book[] {
  return [...books].sort((a, b) => {
    if (order === 'title') return a.title.localeCompare(b.title, 'ko');
    if (order === 'finishedAt') {
      if (!a.finishedAt) return 1;
      if (!b.finishedAt) return -1;
      return b.finishedAt.localeCompare(a.finishedAt);
    }
    return b.addedAt.localeCompare(a.addedAt);
  });
}

export function filterBooksByStatus(books: Book[], status: ReadingStatus | 'ALL'): Book[] {
  if (status === 'ALL') return books;
  return books.filter((b) => b.status === status);
}
