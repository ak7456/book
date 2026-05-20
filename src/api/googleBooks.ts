import { BookSearchResult } from './kakao';

interface GoogleVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    industryIdentifiers?: { type: string; identifier: string }[];
  };
}

interface GoogleBooksResponse {
  items?: GoogleVolume[];
  totalItems: number;
}

const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

function toBookSearchResult(vol: GoogleVolume): BookSearchResult {
  const info = vol.volumeInfo;
  const isbn =
    info.industryIdentifiers?.find((i) => i.type === 'ISBN_13')?.identifier ??
    info.industryIdentifiers?.find((i) => i.type === 'ISBN_10')?.identifier ??
    '';
  return {
    title: info.title,
    authors: info.authors ?? [],
    publisher: info.publisher ?? '',
    datetime: info.publishedDate ?? '',
    thumbnail: info.imageLinks?.thumbnail?.replace('http://', 'https://') ?? '',
    isbn,
  };
}

export async function searchBooks(query: string): Promise<BookSearchResult[]> {
  const url = `${BASE_URL}?q=${encodeURIComponent(query)}&maxResults=20&langRestrict=ko`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google Books API error: ${res.status}`);
  const data: GoogleBooksResponse = await res.json();
  return (data.items ?? []).map(toBookSearchResult);
}

export async function searchByISBN(isbn: string): Promise<BookSearchResult | null> {
  const url = `${BASE_URL}?q=isbn:${isbn}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google Books API error: ${res.status}`);
  const data: GoogleBooksResponse = await res.json();
  const vol = data.items?.[0];
  return vol ? toBookSearchResult(vol) : null;
}
