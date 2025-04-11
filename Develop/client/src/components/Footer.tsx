import { Link } from 'react-router-dom';
import jakeImg from '../assets/jake.png';
import samImg from '../assets/sam.png';
import roam from '../assets/roamLogo.jpg';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 mb-8 sm:mb-0">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="text-center md:text-left">
            <img src={roam} alt="ROAM Logo" className="mx-auto md:mx-0 h-28 mb-4" />
            <p className="text-gray-400">
              Explore the beauty of national parks and connect with nature. Your adventure starts here.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-yellow-500 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-yellow-500 transition">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/saved" className="hover:text-yellow-500 transition">
                  Saved Parks
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-yellow-500 transition">
                  Login/Sign Up
                </Link>
              </li>
            </ul>
          </div>


        </div>

        {/* Meet the Devs Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-6">Meet the Devs</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="text-center">
              <img src={samImg} alt="Sam" className="w-24 h-24 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Sam</h3>
            </div>
            <div className="text-center">
              <img src="https://via.placeholder.com/100" alt="David" className="w-24 h-24 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold">David</h3>
            </div>
            <div className="text-center">
              <img src={jakeImg} alt="Jacob" className="w-24 h-24 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Jacob</h3>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 text-center text-gray-400">
          &copy; {new Date().getFullYear()} ROAM. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;