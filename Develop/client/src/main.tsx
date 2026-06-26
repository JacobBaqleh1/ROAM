import { lazy, Suspense, type ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';

import { AuthProvider } from './utils/useAuth.js';
import App from './App.jsx';
import SearchParks from './pages/Home.js';

const SavedParks = lazy(() => import('./pages/SavedParks.js'));
const ParkInfo = lazy(() => import('./pages/ParkInfo.js'));
const MyReviews = lazy(() => import('./pages/MyReviews.js'));
const MapExplore = lazy(() => import('./pages/MapExplore.js'));
const Login = lazy(() => import('./pages/Login.js'));
const Community = lazy(() => import('./pages/Community.js'));
const Privacy = lazy(() => import('./pages/Privacy.js'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-10 h-10 border-4 border-forest-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: (
      <h1 className="display-2">
        Wrong page!{' '}
        <span className="text-blue-500">
          <Link to="/">Return Home</Link>
        </span>
      </h1>
    ),
    children: [
      {
        index: true,
        element: <SearchParks />,
      },
      {
        path: '/saved',
        element: (
          <LazyPage>
            <SavedParks />
          </LazyPage>
        ),
      },
      {
        path: '/park/:id',
        element: (
          <LazyPage>
            <ParkInfo />
          </LazyPage>
        ),
      },
      {
        path: '/my-reviews',
        element: (
          <LazyPage>
            <MyReviews />
          </LazyPage>
        ),
      },
      {
        path: '/map',
        element: (
          <LazyPage>
            <MapExplore />
          </LazyPage>
        ),
      },
      {
        path: '/login',
        element: (
          <LazyPage>
            <Login />
          </LazyPage>
        ),
      },
      {
        path: '/community',
        element: (
          <LazyPage>
            <Community />
          </LazyPage>
        ),
      },
      {
        path: '/privacy',
        element: (
          <LazyPage>
            <Privacy />
          </LazyPage>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
