import './App.css';
import { Outlet, useLocation, ScrollRestoration } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const location = useLocation();
  const hideFooter = location.pathname === '/map';

  return (
    <>
      <ScrollRestoration />
      <div className={`flex flex-col ${hideFooter ? 'h-screen' : 'min-h-screen'}`}>
        <Navbar />
        <div className={`flex-1 min-h-0 ${hideFooter ? 'overflow-hidden' : ''}`}>
          <Outlet />
          {!hideFooter && <Footer />}
        </div>
      </div>
    </>
  );
}

export default App;
