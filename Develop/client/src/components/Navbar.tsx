import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Bookmark, LogIn, LogOut, Star } from 'lucide-react';
import Auth from '../utils/auth';
import NavSearchBar from './NavSearchBar';

const navLinkClass =
  'text-white px-3 py-1.5 rounded-lg hover:bg-forest-500 hover:text-white transition-colors duration-200 text-sm font-medium';

const AppNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      <nav className="bg-black relative z-[100]">
        <div
          className={
            isHome
              ? 'hidden md:container md:mx-auto md:flex md:justify-between md:items-center md:py-4 md:px-4'
              : 'container mx-auto flex justify-between items-center py-3 px-4'
          }
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-white text-2xl font-display font-extrabold tracking-wide">
              ROAM
            </span>
          </Link>

          {/* Search bar (hidden on home page) */}
          {!isHome && (
            <div className="hidden md:block flex-1 mx-8 max-w-sm">
              <NavSearchBar />
            </div>
          )}

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={navLinkClass}>Home</Link>
            <Link to="/community" className={navLinkClass}>Community</Link>

            {Auth.loggedIn() ? (
              <>
                <Link to="/my-reviews" className={navLinkClass}>My Reviews</Link>
                <Link to="/saved" className={navLinkClass}>Saved Parks</Link>
                <button
                  onClick={Auth.logout}
                  className={navLinkClass}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-forest-500 hover:bg-forest-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors duration-200"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile search bar (non-home pages, below the top bar) */}
        {!isHome && (
          <div className="md:hidden px-4 pb-2">
            <NavSearchBar />
          </div>
        )}
      </nav>

      {/* Bottom mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-black text-white flex justify-around py-2 px-2 z-10 border-t border-gray-800">
        <Link to="/" className="flex flex-col items-center gap-0.5 text-xs px-2 py-1 rounded-lg hover:bg-forest-500 transition-colors">
          <Home size={20} />
          <span>Home</span>
        </Link>

        <Link to="/community" className="flex flex-col items-center gap-0.5 text-xs px-2 py-1 rounded-lg hover:bg-forest-500 transition-colors">
          <Users size={20} />
          <span>Community</span>
        </Link>

        {Auth.loggedIn() ? (
          <>
            <Link to="/my-reviews" className="flex flex-col items-center gap-0.5 text-xs px-2 py-1 rounded-lg hover:bg-forest-500 transition-colors">
              <Star size={20} />
              <span>Reviews</span>
            </Link>
            <Link to="/saved" className="flex flex-col items-center gap-0.5 text-xs px-2 py-1 rounded-lg hover:bg-forest-500 transition-colors">
              <Bookmark size={20} />
              <span>Saved</span>
            </Link>
            <div
              onClick={Auth.logout}
              className="flex flex-col items-center gap-0.5 text-xs px-2 py-1 rounded-lg hover:bg-forest-500 transition-colors cursor-pointer"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </div>
          </>
        ) : (
          <div
            onClick={() => navigate('/login')}
            className="flex flex-col items-center gap-0.5 text-xs px-2 py-1 rounded-lg hover:bg-forest-500 transition-colors cursor-pointer"
          >
            <LogIn size={20} />
            <span>Sign In</span>
          </div>
        )}
      </div>
    </>
  );
};

export default AppNavbar;
