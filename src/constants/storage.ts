export const STORAGE_KEYS = {
  BOOKS_ALL: '@books:all',
  BOOK: (id: string) => `@book:${id}`,
  HIGHLIGHTS: (bookId: string) => `@highlights:${bookId}`,
  REVIEW: (bookId: string) => `@review:${bookId}`,
} as const;
