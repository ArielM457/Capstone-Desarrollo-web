import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import type { LibraryBook } from '../types';
import { buildBookCoverImageUrl } from '../api';

function resolveAvailabilityStatusDisplayText(status: LibraryBook['availabilityStatus']): string {
  return status === 'available' ? 'Disponible' : 'Prestado';
}

function formatAuthorNamesForDisplay(authorNames: string[]): string {
  if (authorNames.length === 0) return 'Autor desconocido';
  if (authorNames.length === 1) return authorNames[0];
  return `${authorNames[0]} y ${authorNames.length - 1} más`;
}

interface BookCardProps {
  book: LibraryBook;
}

export const BookCard = memo(function BookCard({ book }: BookCardProps) {
  const [hasCoverImageLoadFailed, setHasCoverImageLoadFailed] = useState(false);

  function handleCoverImageLoadError() {
    setHasCoverImageLoadFailed(true);
  }

  const shouldRenderCoverPlaceholder = !book.coverImageId || hasCoverImageLoadFailed;

  const workId = book.bookId.replace('/works/', '');

  return (
    <article className="book-card">
      <div className="book-card__cover-container">
        {shouldRenderCoverPlaceholder ? (
          <div className="book-card__cover-placeholder" aria-label="Sin portada disponible">
            <span className="book-card__cover-placeholder-icon">📖</span>
          </div>
        ) : (
          <img
            className="book-card__cover-image"
            src={buildBookCoverImageUrl(book.coverImageId!, 'M')}
            alt={`Portada de ${book.bookTitle}`}
            onError={handleCoverImageLoadError}
            loading="lazy"
          />
        )}
        <span
          className={`book-card__availability-badge book-card__availability-badge--${book.availabilityStatus}`}
          aria-label={`Estado: ${resolveAvailabilityStatusDisplayText(book.availabilityStatus)}`}
        >
          {resolveAvailabilityStatusDisplayText(book.availabilityStatus)}
        </span>
      </div>
      <div className="book-card__info-section">
        <h2 className="book-card__title" title={book.bookTitle}>
          <Link to={`/book/${workId}`} className="book-card__title-link">
            {book.bookTitle}
          </Link>
        </h2>
        <p className="book-card__author-name">
          {formatAuthorNamesForDisplay(book.authorNames)}
        </p>
        {book.firstPublishedYear && (
          <p className="book-card__publication-year">{book.firstPublishedYear}</p>
        )}
        {book.subjectCategories.length > 0 && (
          <ul className="book-card__subject-tags" aria-label="Categorías">
            {book.subjectCategories.slice(0, 3).map(subject => (
              <li key={subject} className="book-card__subject-tag">
                {subject}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
});
