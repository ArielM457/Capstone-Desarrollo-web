import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { fetchBooks } from '../store/booksSlice';
import { filterByCategory } from '../utils/filterBooks';
import { sortByTitleAsc, sortByAuthorAsc, sortByYearDesc, sortByPopularityDesc } from '../utils/sortBooks';
import { BookCard } from './BookCard';

function renderLoadingSkeletonGrid() {
  return (
    <div className="book-list__skeleton-grid" aria-label="Cargando libros..." role="status">
      {Array.from({ length: 12 }).map((_, skeletonIndex) => (
        <div key={skeletonIndex} className="book-card-skeleton">
          <div className="book-card-skeleton__cover" />
          <div className="book-card-skeleton__line book-card-skeleton__line--title" />
          <div className="book-card-skeleton__line book-card-skeleton__line--author" />
          <div className="book-card-skeleton__line book-card-skeleton__line--year" />
        </div>
      ))}
    </div>
  );
}

function renderEmptyResultsMessage(searchQuery: string) {
  return (
    <div className="book-list__empty-state" role="status">
      <span className="book-list__empty-state-icon" aria-hidden="true">🔎</span>
      <p className="book-list__empty-state-text">
        {searchQuery
          ? `No se encontraron libros para "${searchQuery}"`
          : 'No hay libros disponibles con los filtros seleccionados'}
      </p>
    </div>
  );
}

export function BookList() {
  const dispatch = useDispatch<AppDispatch>();
  const { books, searchQuery, filterCategory, sortCriterion, isLoading, errorMessage } = useSelector(
    (state: RootState) => state.books
  );

  useEffect(() => {
    dispatch(fetchBooks(''));
  }, [dispatch]);

  let displayedBooks = filterByCategory(books, filterCategory);

  if (sortCriterion === 'title_asc') displayedBooks = sortByTitleAsc([...displayedBooks]);
  else if (sortCriterion === 'author_asc') displayedBooks = sortByAuthorAsc([...displayedBooks]);
  else if (sortCriterion === 'year_desc') displayedBooks = sortByYearDesc([...displayedBooks]);
  else displayedBooks = sortByPopularityDesc([...displayedBooks]);

  if (isLoading) {
    return renderLoadingSkeletonGrid();
  }

  if (errorMessage) {
    return (
      <div className="book-list__error-state" role="alert">
        <span className="book-list__error-icon" aria-hidden="true">⚠️</span>
        <p className="book-list__error-text">{errorMessage}</p>
      </div>
    );
  }

  if (displayedBooks.length === 0) {
    return renderEmptyResultsMessage(searchQuery);
  }

  return (
    <section aria-label={`${displayedBooks.length} libros encontrados`}>
      <p className="book-list__results-count">
        {displayedBooks.length} libro{displayedBooks.length !== 1 ? 's' : ''} encontrado{displayedBooks.length !== 1 ? 's' : ''}
      </p>
      <div className="book-list__grid">
        {displayedBooks.map(libraryBook => (
          <BookCard key={libraryBook.bookId} book={libraryBook} />
        ))}
      </div>
    </section>
  );
}
