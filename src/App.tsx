import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const BookDetailPage = lazy(() => import('./pages/BookDetailPage').then(m => ({ default: m.BookDetailPage })));
const BookReviewsPage = lazy(() => import('./pages/BookReviewsPage').then(m => ({ default: m.BookReviewsPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));

function PageLoadingFallback() {
  return (
    <main className="app-layout__main-content">
      <p className="book-detail__loading">Cargand...</p>
    </main>
  );
}

function RootLayout() {
  return (
    <ThemeProvider>
      <div className="app-layout">
        <Header />
        <Suspense fallback={<PageLoadingFallback />}>
          <Outlet />
        </Suspense>
        <footer className="app-layout__footer">
          <p>JU Library &copy; {new Date().getFullYear()} — Datos provistos por Open Library</p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'book/:bookId',
        element: <BookDetailPage />,
        children: [
          {
            path: 'reviews',
            element: <BookReviewsPage />,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}


//function App() {
//  return (
//    <BrowserRouter>
//      <Header />
//      <Routes>
//        <Route path="/" element={<HomePage />} />
 //       <Route path="/about" element={<AboutPage />} />
//        <Route path="/book/:bookId" element={<BookDetailPage />} />
//      </Routes>
//      <Footer />
//    </BrowserRouter>
//  );
// }