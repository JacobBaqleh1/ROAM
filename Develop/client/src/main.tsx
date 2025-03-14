import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { AuthProvider } from './utils/useAuth.js';
import App from './App.jsx'
import SearchParks from './pages/SearchParks.js'
import SavedParks from './pages/SavedParks.js'
import ParkInfo from './pages/ParkInfo.js'
import MyReviews from './pages/MyReviews.js';
import ResultsPage from './pages/ResultsPage.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1 className='display-2'>Wrong page!</h1>,
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
        element: <ParkInfo  />
      }
      ,
      {
        path: '/my-reviews', 
        element: <MyReviews />
      }
      ,
      {
         path:'/results',
          element: <ResultsPage /> 
        },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
   <AuthProvider>
  <RouterProvider router={router} />
  </AuthProvider>
)
