import { useState, useEffect, useCallback } from 'react';
import { Highlight } from '../types';
import { getHighlights, addHighlight, deleteHighlight } from '../storage/highlights';

export function useHighlights(bookId: string) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setHighlights(await getHighlights(bookId));
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(
    async (data: Pick<Highlight, 'content' | 'pageNumber'>) => {
      const h = await addHighlight(bookId, data);
      setHighlights((prev) => [h, ...prev]);
      return h;
    },
    [bookId]
  );

  const remove = useCallback(
    async (highlightId: string) => {
      await deleteHighlight(bookId, highlightId);
      setHighlights((prev) => prev.filter((h) => h.id !== highlightId));
    },
    [bookId]
  );

  return { highlights, loading, add, remove, reload: load };
}
