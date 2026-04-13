import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { setSearchQuery, fetchBooks } from '../store/booksSlice';

function buildSearchInputAriaLabel(currentQuery: string): string {
  return currentQuery
    ? `Buscando: ${currentQuery}. Modifica para nueva búsqueda`
    : 'Buscar libros por título, autor o palabras clave';
}

export function SearchBar() {
  const dispatch = useDispatch<AppDispatch>();
  const searchQuery = useSelector((state: RootState) => state.books.searchQuery);

  useEffect(() => {
    if (!searchQuery.trim()) {
      dispatch(fetchBooks(''));
      return;
    }
    const timer = setTimeout(() => {
      dispatch(fetchBooks(searchQuery));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  function handleSearchInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch(setSearchQuery(event.target.value));
  }

  function clearSearchInputField() {
    dispatch(setSearchQuery(''));
  }

  return (
    <div className="search-bar">
      <div className="search-bar__input-wrapper">
        <span className="search-bar__search-icon" aria-hidden="true"></span>
        <input
          type="text"
          className="search-bar__input"
          value={searchQuery}
          onChange={handleSearchInputChange}
          placeholder="Buscar por título, autor o palabras clave..."
          aria-label={buildSearchInputAriaLabel(searchQuery)}
        />
        {searchQuery && (
          <button
            className="search-bar__clear-button"
            onClick={clearSearchInputField}
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
