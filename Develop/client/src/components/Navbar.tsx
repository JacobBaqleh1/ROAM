import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';


import Auth from '../utils/auth';
import NavSearchBar from './NavSearchBar';

const AppNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const [isOpen, setIsOpen] = useState(false);





  return (
    <>
      <nav className='bg-black'>
        <div className={location.pathname === '/' ? "hidden md:container md:mx-auto md:flex md:justify-between md:items-center md:py-4" : "container mx-auto flex justify-between items-center md:py-4"}>
          <Link to="/" className="flex items-center space-x-4 ">
            <div className='flex justify-center items-center'>
              {/* <img src={logo} className='w-20 h-20' alt="logo" /> */}
              <span className="text-white text-2xl font-semibold ml-0.5">ROAM</span>
            </div>
          </Link>
          <div className={location.pathname === '/' ? "hidden" : "block my-2"} >
            <NavSearchBar />
          </div>


          <div className='hidden md:block' >
            <Link
              to="/"
              className="text-white px-2 py-1 rounded hover:bg-yellow-500 hover:text-gray-800 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/community"
              className="text-white px-2 py-1 rounded hover:bg-yellow-500 hover:text-gray-800 transition-colors duration-200"
            >
              Community
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
                onClick={() => navigate('/login')}
                className="text-white px-2 py-1 rounded hover:bg-yellow-500 hover:text-gray-800 transition-colors duration-200"
              >
                Login/Sign Up
              </button>
            )}
          </div>


          {/* hamburger popup */}
          {isOpen &&
            <div className='md:hidden block absolute top-15 right-0 text-white bg-black flex-col items-center py-4 space-y-2 rounded'>
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
                  onClick={() => navigate('/login')}
                  className="text-white px-2 py-1 rounded hover:bg-yellow-500 hover:text-gray-800 transition-colors duration-200"
                >
                  Login/Sign Up
                </button>
              )}

            </div>}




          {/* mobile view */}

          {/* <div className="block md:hidden text-white">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#FFF4E5]  text-6xl">
              ☰
            </button>
          </div> */}





        </div>

        {/* bottom navbar */}
        <div className="md:hidden fixed  bottom-0 left-0 w-full bg-black text-white flex justify-around py-3 px-4 z-10 ">

          <Link to="/">
            <div className='flex flex-col items-center '>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"></path></svg>
              Home
            </div>
          </Link>
          <Link to="/community">
            <div className='flex flex-col items-center '>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.995-.944v-.002.002zM7.022 13h7.956a.274.274 0 00.014-.002l.008-.002c-.002-.264-.167-1.03-.76-1.72C13.688 10.629 12.718 10 11 10c-1.717 0-2.687.63-3.24 1.276-.593.69-.759 1.457-.76 1.72a1.05 1.05 0 00.022.004zm7.973.056v-.002.002zM11 7a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0zM6.936 9.28a5.88 5.88 0 00-1.23-.247A7.35 7.35 0 005 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 015 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10c-1.668.02-2.615.64-3.16 1.276C1.163 11.97 1 12.739 1 13h3c0-1.045.323-2.086.92-3zM1.5 5.5a3 3 0 116 0 3 3 0 01-6 0zm3-2a2 2 0 100 4 2 2 0 000-4z" clip-rule="evenodd"></path></svg>
              Community
            </div>
          </Link>





          {Auth.loggedIn() ? (
            <>
              <Link to="/saved">
                <div className='flex flex-col items-center '>
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M336 0H48C21.49 0 0 21.49 0 48v464l192-112 192 112V48c0-26.51-21.49-48-48-48zm0 428.43l-144-84-144 84V54a6 6 0 0 1 6-6h276c3.314 0 6 2.683 6 5.996V428.43z"></path></svg>
                  Saved
                </div>
              </ Link>
              <div
                onClick={Auth.logout}
                className="flex flex-col items-center "
              >
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 13L16 11 7 11 7 8 2 12 7 16 7 13z"></path><path d="M20,3h-9C9.897,3,9,3.897,9,5v4h2V5h9v14h-9v-4H9v4c0,1.103,0.897,2,2,2h9c1.103,0,2-0.897,2-2V5C22,3.897,21.103,3,20,3z"></path></svg>
                Logout
              </div>
            </>)
            : (
              <div
                onClick={() => navigate('/login')}
                className='flex flex-col items-center '
              >
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M13 16L18 12 13 8 13 11 4 11 4 13 13 13z"></path><path d="M20,3h-9C9.897,3,9,3.897,9,5v4h2V5h9v14h-9v-4H9v4c0,1.103,0.897,2,2,2h9c1.103,0,2-0.897,2-2V5C22,3.897,21.103,3,20,3z"></path></svg>
                Login/Sign Up
              </div>
            )
          }

        </div>
      </nav>

      {/* Modal */}
      {/* {showModal && (
        <div className="min-h-screen max-h-screen fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-8  ">
            <div className="flex justify-between items-center mb-2">
              <div className="flex flex-col space-x-4">
                <button
                  className="text-gray-700 font-semibold cursor-pointer"
                  onClick={() => setShowModal(false)}
                >
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="2.5em" width="2.5em" xmlns="http://www.w3.org/2000/svg"><path d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 0 0-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z"></path><path d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path></svg>
                </button>

                <br />


              </div>
            </div>
            <div className='flex justify-center text-center text-3xl'>
              Sign up or log in
              <br />
              to access your profile
            </div>


            <div className="mt-6 ">



              <div className=''>
                <h2 className="text-gray-700 font-semibold text-center  ">Login</h2>
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </div>
              <p className='text-center mt-4'>or</p>
              <div className='mt-6'>
                <h2 className="text-gray-700 font-semibold text-center">Sign Up</h2>
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </div>

            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default AppNavbar;
