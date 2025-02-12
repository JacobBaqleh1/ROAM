import { useState } from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';

import Auth from '../utils/auth';

const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);
  

  const [isOpen, setIsOpen] = useState(false);
  
  //setIsOpen(false);

 

  return (
    <>
      <nav className="bg-black p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/"  className="flex items-center space-x-4 ">

            <span className="text-white text-2xl font-semibold">ROAM</span>
          </Link>

          <div className="hidden md:block flex space-x-6">
            <Link 
              to="/" 
              className="text-white px-2 py-1 rounded hover:bg-yellow-500 hover:text-gray-800 transition-colors duration-200"
            >
              Search National Parks
            </Link>
            {/* if user is logged in show saved parks and logout */}
            {Auth.loggedIn() ? (
              <>
                <Link 
                
                  to="/my-reviews" 
                  className="text-white mx-2 px-2 py-1 rounded hover:bg-yellow-500 hover:text-gray-800 transition-colors duration-200 no-underline"
                >
                  My Reviews
                </Link>
                <Link 
                  to="/saved" 
                  className="text-white px-2 py-1 rounded hover:bg-yellow-500 hover:text-gray-800 transition-colors duration-200"
                >
                  See Your Parks
                </Link>
                <button 
                  onClick={Auth.logout} 
                  className="text-white px-2 py-1 rounded hover:bg-yellow-500 hover:text-gray-800 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={() => setShowModal(true)} 
                className="text-white px-2 py-1 rounded hover:bg-yellow-500 hover:text-gray-800 transition-colors duration-200"
              >
                Login/Sign Up
              </button>
            )}
          </div>
            
            
             {/* hamburger popup */}
  {isOpen && 
  <div className='md:hidden block absolute top-15 right-0 text-white bg-black flex flex-col items-center py-4 space-y-2 rounded'>
                 <Link 
              to="/" 
              className="text-white px-2 py-1 rounded hover:bg-yellow-500 hover:text-gray-800 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Search National Parks
            </Link>
            {/* if user is logged in show saved parks and logout */}
            {Auth.loggedIn() ? (
              <>
                <Link 
                  to="/my-reviews" 
                  className=" text-white mx-2 px-2 py-1 rounded hover:bg-yellow-500 hover:text-gray-800 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  My Reviews
                </Link>
                <Link 
                  to="/saved" 
                  className="text-white px-2 py-1 rounded hover:bg-yellow-500 hover:text-gray-800 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  See Your Parks
                </Link>
                <button 
                  onClick={Auth.logout} 
                  className="text-white px-2 py-1 rounded hover:bg-yellow-500 hover:text-gray-800 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={() => setShowModal(true)} 
                className="text-white px-2 py-1 rounded hover:bg-yellow-500 hover:text-gray-800 transition-colors duration-200"
              >
                Login/Sign Up
              </button>
            )}
  
  </div>}
            
            
            
            
            {/* mobile view */}

<div className="block md-hidden text-white">
  <button  onClick={() => setIsOpen(!isOpen)} className="text-[#FFF4E5] lg:hidden text-6xl">
  ☰
  </button>
</div>


        </div>
      </nav>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col space-x-4">
                <button
                  className="text-gray-700 font-semibold"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <br />
                <h2 className="text-gray-700 font-semibold ">Login</h2>
                
              </div>
            </div>
            {/* Tab Content */}
            <div className="mt-4">
              <div className="space-y-6">
                <div>
                  <LoginForm handleModalClose={() => setShowModal(false)} />
                </div>
                <h2 className="text-gray-700 font-semibold">Sign Up</h2>
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
