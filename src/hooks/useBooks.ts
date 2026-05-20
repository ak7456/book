import { useState, useEffect, useCallback } from 'react';
import { Book } from '../types';
import {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
  sortBooks,
  filterBooksByStatus,
} from '../storage/books';
import { useUIStore } from '../stores/ui';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { statusFilter, sortOrder } = useUIStore();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await getAllBooks();
      const filtered = filterBooksByStatus(all, statusFilter);
      setBooks(sortBooks(filtered, sortOrder));
    } finally {
      setLoading(false);
    }
  }, [statusFilter, sortOrder]);

  useEffect(() => {
    load();
  }, [load]);

  return { books, loading, reload: load };
}

export function useBook(id: string) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { getBook } = await import('../storage/books');
      setBook(await getBook(id));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const update = useCallback(
    async (updates: Partial<Book>) => {
      const updated = await updateBook(id, updates);
      setBook(updated);
      return updated;
    },
    [id]
  );

  const remove = useCallback(async () => {
    await deleteBook(id);
  }, [id]);

  return { book, loading, update, remove, reload: load };
}
