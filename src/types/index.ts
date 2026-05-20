export type ReadingStatus = 'WANT_TO_READ' | 'READING' | 'DONE';

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher?: string;
  publishedDate?: string;
  coverImageUrl?: string;
  isbn?: string;
  status: ReadingStatus;
  finishedAt?: string;
  addedAt: string;
}

export interface Highlight {
  id: string;
  bookId: string;
  content: string;
  pageNumber?: number;
  createdAt: string;
}

export interface Review {
  id: string;
  bookId: string;
  shortReview?: string;
  fullReview?: string;
  updatedAt: string;
}

export type SortOrder = 'addedAt' | 'title' | 'finishedAt';
export type ViewMode = 'grid' | 'list';
