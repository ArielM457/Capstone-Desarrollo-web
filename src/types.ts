import type { AvailabilityStatus } from './utils/enums';

export interface LibraryBook {
  bookId: string;
  bookTitle: string;
  authorNames: string[];
  coverImageId: number | null;
  subjectCategories: string[];
  firstPublishedYear: number | null;
  editionCount: number;
  availabilityStatus: AvailabilityStatus;
}
