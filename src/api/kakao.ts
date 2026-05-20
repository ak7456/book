export interface BookSearchResult {
  title: string;
  authors: string[];
  publisher: string;
  datetime: string;
  thumbnail: string;
  isbn: string;
}

interface KakaoResponse {
  documents: {
    title: string;
    authors: string[];
    publisher: string;
    datetime: string;
    thumbnail: string;
    isbn: string;
  }[];
  meta: { total_count: number; pageable_count: number; is_end: boolean };
}

const BASE_URL = 'https://dapi.kakao.com/v3/search/book';

export async function searchBooks(
  query: string,
  apiKey: string,
  page = 1
): Promise<BookSearchResult[]> {
  const url = `${BASE_URL}?query=${encodeURIComponent(query)}&page=${page}&size=20`;
  const res = await fetch(url, {
    headers: { Authorization: `KakaoAK ${apiKey}` },
  });
  if (!res.ok) throw new Error(`Kakao API error: ${res.status}`);
  const data: KakaoResponse = await res.json();
  return data.documents;
}

export async function searchByISBN(isbn: string, apiKey: string): Promise<BookSearchResult | null> {
  const url = `${BASE_URL}?query=${encodeURIComponent(isbn)}&target=isbn`;
  const res = await fetch(url, {
    headers: { Authorization: `KakaoAK ${apiKey}` },
  });
  if (!res.ok) throw new Error(`Kakao API error: ${res.status}`);
  const data: KakaoResponse = await res.json();
  return data.documents[0] ?? null;
}
