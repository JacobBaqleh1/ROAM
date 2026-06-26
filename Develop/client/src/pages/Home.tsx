import AutoCarousel from '../components/SlideShow.js';
import HomeSearchBar from '../components/HomeSearchBar.js';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const SearchParks = () => {
  return (
    <div>
      <div className="relative flex min-h-[38rem] sm:h-[15rem] md:h-[62rem] flex-col items-center justify-start">
        <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
          <AutoCarousel />
        </div>

        <div className="absolute inset-0 flex flex-col justify-start items-center z-10 px-4 pt-8 overflow-hidden">
          <div className="backdrop-blur-sm bg-black/40 rounded-2xl px-8 py-6 text-center max-w-lg w-full mb-4">
            <h1 className="text-4xl md:text-5xl font-black text-center mb-3 text-white font-display">
              Explore National Parks
            </h1>
            <p className="text-white/90 text-center text-lg mb-5">
              Discover, save, and share your favorite outdoor destinations.
            </p>
            <Link to="/map">
              <Button variant="primary" size="lg" className="w-full">Map</Button>
            </Link>
          </div>
          <HomeSearchBar />
        </div>
      </div>
    </div>
  );
};

export default SearchParks;
