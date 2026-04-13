import type { LibraryBook } from './types';
import { BOOK_DEFAULTS } from './utils/enums';

const search_endpoint = 'https://openlibrary.org/search.json';
const cover_endpoint = 'https://covers.openlibrary.org/b/id';
const fields_book = 'key,title,author_name,cover_i,subject,first_publish_year,edition_count';

function transformOpenLibraryDocumentToLibraryBook(rawDocument: Record<string, unknown>): LibraryBook {
  return {
    bookId: String(rawDocument.key ?? `generated-${Math.random().toString(36).slice(2)}`),
    bookTitle: String(rawDocument.title ?? BOOK_DEFAULTS.title),
    authorNames: Array.isArray(rawDocument.author_name)
      ? (rawDocument.author_name as string[]).slice(0, 3)
      : BOOK_DEFAULTS.authors,
    coverImageId: typeof rawDocument.cover_i === 'number' ? rawDocument.cover_i : BOOK_DEFAULTS.coverImageId,
    subjectCategories: Array.isArray(rawDocument.subject)
      ? (rawDocument.subject as string[]).slice(0, 6)
      : BOOK_DEFAULTS.subjects,
    firstPublishedYear: typeof rawDocument.first_publish_year === 'number' ? rawDocument.first_publish_year : BOOK_DEFAULTS.year,
    editionCount: typeof rawDocument.edition_count === 'number' ? rawDocument.edition_count : BOOK_DEFAULTS.editions,
    availabilityStatus: BOOK_DEFAULTS.availabilityStatus,
  };
}

export function buildBookCoverImageUrl(coverImageId: number, imageSize: 'S' | 'M' | 'L' = 'M'): string {
  return `${cover_endpoint}/${coverImageId}-${imageSize}.jpg`;
}

function buildOpenLibrarySearchRequestUrl(searchQuery: string, pageNumber: number): string {
  return `${search_endpoint}?q=${encodeURIComponent(searchQuery)}&limit=24&page=${pageNumber}&fields=${fields_book}`;
}

export async function fetchBooksBySearchQuery(
  searchQuery: string,
  pageNumber = 1
): Promise<LibraryBook[]> {
  const requestUrl = buildOpenLibrarySearchRequestUrl(searchQuery, pageNumber);
  const apiResponse = await fetch(requestUrl);

  if (!apiResponse.ok) {
    throw new Error(`Open Library API request failed with status ${apiResponse.status}`);
  }

  const responsePayload = await apiResponse.json();
  console.log('API response:', responsePayload);
  const rawDocuments: Record<string, unknown>[] = responsePayload.docs ?? [];
  return rawDocuments.map(transformOpenLibraryDocumentToLibraryBook);
}

export async function fetchDefaultLibraryCatalog(): Promise<LibraryBook[]> {
  return fetchBooksBySearchQuery('classic world literature fiction science');
}
