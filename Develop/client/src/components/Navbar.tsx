import { useState } from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';

import Auth from '../utils/auth';

const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-semibold">
            ROAM
          </Link>
          <div className="flex space-x-6">
            <Link to="/" className="text-white hover:text-gray-400">
              Search National Parks
            </Link>
            {/* if user is logged in show saved parks and logout */}
            {Auth.loggedIn() ? (
              <>
              <Link to="/my-reviews" className="mx-2">My Reviews</Link>
                <Link to="/saved" className="text-white hover:text-gray-400">
                  See Your Parks
                </Link>
                <button onClick={Auth.logout} className="text-white hover:text-gray-400">
                  Logout
                </button>
              </>
            ) : (
              <button onClick={() => setShowModal(true)} className="text-white hover:text-gray-400">
                Login/Sign Up
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-4">
                <button
                  className="text-gray-700 font-semibold"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button className="text-gray-700 font-semibold">Login</button>
                <button className="text-gray-700 font-semibold">Sign Up</button>
              </div>
            </div>
            {/* Tab Content */}
            <div className="mt-4">
              <div className="space-y-6">
                <div>
                  <LoginForm handleModalClose={() => setShowModal(false)} />
                </div>
                <div>
                  <SignUpForm handleModalClose={() => setShowModal(false)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppNavbar;
