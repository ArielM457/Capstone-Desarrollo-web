import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { BookList } from '../components/BookList';

export function HomePage() {
  return (
    <main className="app-layout__main-content">
      <div className="app-layout__controls-section">
        <SearchBar />
        <FilterPanel />
      </div>
      <BookList />
    </main>
  );
}
