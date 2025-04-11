import ReactDOM from 'react-dom/client'
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom'

import { AuthProvider } from './utils/useAuth.js';
import App from './App.jsx'
import SearchParks from './pages/Home.js'
import SavedParks from './pages/SavedParks.js'
import ParkInfo from './pages/ParkInfo.js'
import MyReviews from './pages/MyReviews.js';
import ResultsPage from './pages/ResultsPage.js';
import Login from './pages/Login.js';
import Community from './pages/Community.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1 className='display-2'>Wrong page! <span className='text-blue-500'><Link to='/'>Return Home</Link></span></h1>,
    children: [
      {
        index: true,
        element: <SearchParks />
      }, {
        path: '/saved',
        element: <SavedParks />
      }
      , {
        path: '/park/:id',
        element: <ParkInfo />
      }
      ,
      {
        path: '/my-reviews',
        element: <MyReviews />
      }
      ,
      {
        path: '/results',
        element: <ResultsPage />
      },
      {
        path: '/login',
        element: <Login />
      }
      ,
      {
        path: '/community',
        element: <Community />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
)
