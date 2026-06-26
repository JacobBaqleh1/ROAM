import { Link, useLocation, useNavigate } from 'react-router-dom';
import Auth from '../utils/auth';
import NavSearchBar from './NavSearchBar';

const navLinkClass =
  'text-white px-3 py-1.5 rounded-lg hover:bg-forest-500 hover:text-white transition-colors duration-200 text-sm font-medium';

const iconClass = 'w-5 h-5';

function IconHome() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function IconBookmark() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconLogOut() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function IconLogIn() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" x2="3" y1="12" y2="12" />
    </svg>
  );
}

const AppNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isMap = location.pathname === '/map';

  return (
    <>
      <nav className="bg-black sticky top-0 z-[100]">
        <div
          className={
            isHome
              ? 'hidden md:container md:mx-auto md:flex md:justify-between md:items-center md:py-4 md:px-4'
              : 'container mx-auto flex justify-between items-center py-3 px-4'
          }
        >
          <Link to="/" className="flex items-center gap-2">
            <span className="text-white text-2xl font-display font-extrabold tracking-wide">
              ROAM
            </span>
          </Link>

          {!isHome && !isMap && (
            <div className="hidden md:block flex-1 mx-8 max-w-sm">
              <NavSearchBar />
            </div>
          )}

          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={navLinkClass}>Home</Link>
            <Link to="/community" className={navLinkClass}>Community</Link>

            {Auth.loggedIn() ? (
              <>
                <Link to="/my-reviews" className={navLinkClass}>My Reviews</Link>
                <Link to="/saved" className={navLinkClass}>Saved Parks</Link>
                <button onClick={Auth.logout} className={navLinkClass}>
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

        {!isHome && !isMap && (
          <div className="md:hidden px-4 pb-2">
            <NavSearchBar />
          </div>
        )}
      </nav>

      <div className="md:hidden fixed bottom-0 left-0 w-full bg-black text-white flex justify-around py-2 px-2 z-10 border-t border-gray-800">
        <Link to="/" className="flex flex-col items-center gap-0.5 text-xs px-2 py-1 rounded-lg hover:bg-forest-500 transition-colors">
          <IconHome />
          <span>Home</span>
        </Link>

        <Link to="/community" className="flex flex-col items-center gap-0.5 text-xs px-2 py-1 rounded-lg hover:bg-forest-500 transition-colors">
          <IconUsers />
          <span>Community</span>
        </Link>

        {Auth.loggedIn() ? (
          <>
            <Link to="/my-reviews" className="flex flex-col items-center gap-0.5 text-xs px-2 py-1 rounded-lg hover:bg-forest-500 transition-colors">
              <IconStar />
              <span>Reviews</span>
            </Link>
            <Link to="/saved" className="flex flex-col items-center gap-0.5 text-xs px-2 py-1 rounded-lg hover:bg-forest-500 transition-colors">
              <IconBookmark />
              <span>Saved</span>
            </Link>
            <div
              onClick={Auth.logout}
              className="flex flex-col items-center gap-0.5 text-xs px-2 py-1 rounded-lg hover:bg-forest-500 transition-colors cursor-pointer"
            >
              <IconLogOut />
              <span>Logout</span>
            </div>
          </>
        ) : (
          <div
            onClick={() => navigate('/login')}
            className="flex flex-col items-center gap-0.5 text-xs px-2 py-1 rounded-lg hover:bg-forest-500 transition-colors cursor-pointer"
          >
            <IconLogIn />
            <span>Sign In</span>
          </div>
        )}
      </div>
    </>
  );
};

export default AppNavbar;
