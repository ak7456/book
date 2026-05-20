import { useState, useEffect, useCallback } from 'react';
import { Review } from '../types';
import { getReview, saveReview } from '../storage/reviews';

export function useReview(bookId: string) {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setReview(await getReview(bookId));
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (data: Pick<Review, 'shortReview' | 'fullReview'>) => {
      const updated = await saveReview(bookId, data);
      setReview(updated);
      return updated;
    },
    [bookId]
  );

  return { review, loading, save, reload: load };
}
