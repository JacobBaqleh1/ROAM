import { useLocation, Link, useNavigate } from 'react-router-dom';
import searchImg from '../assets/search.svg'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { fetchParks } from '../utils/API';

const ResultsPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [err, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const parks = location.state?.parks || [];
const [imageIndexes, setImageIndexes] = useState<{[key: string]:number}>({})
 

// Function to handle image change
  const handleImageChange = (parkId: string, direction: 'next' | 'prev', imagesLength: number) => {
    setImageIndexes((prevIndexes) => {
      const currentIndex = prevIndexes[parkId] || 0;
      let newIndex;

      if (direction === 'next') {
        newIndex = (currentIndex + 1) % imagesLength; // Loop back to start
      } else {
        newIndex = (currentIndex - 1 + imagesLength) % imagesLength; // Loop to end
      }

      return { ...prevIndexes, [parkId]: newIndex };
    });
  };
const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
setError('');
    if (!searchInput) {
      console.error('Please enter a location.');
      return;
    }

    try {
      const response = await fetchParks(searchInput);
        if (!response || response.length === 0) {
        setError('No parks found. Try another location.');
        return;
      }
      navigate('/results', { state: { parks: response } });
      // setSearchedParks(response || []);
    } catch (err) {
        setError('Error fetching parks. Please try again.');
      console.error('Error fetching parks:', err);
    }
  };

 

  return (
    <div>
      <div className='flex justify-between items-center px-4 my-8 '>
      <h1 className="text-center text-4xl flex-1">Search Results</h1>
      
          <form onSubmit={handleFormSubmit} className="flex gap-2 items-center">
        <input
          name="searchInput"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
          placeholder="Enter your state"
          className="w-full md:w-2/3 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100"
        />
        <button
          type="submit"
          className="w-[5rem] bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
        >
           <img src={searchImg} alt="Search" className="h-6 w-4 inline-block" />

        </button>
      </form>
     
       {err && <p className="text-red-500 text-center">{err}</p>}
      </div>

      {parks.length === 0 ? (
        <p className="text-center text-gray-500">No parks found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-4">
          {parks.map((park: any) => {
            const images = park.images || [];
            const currentImageIndex = imageIndexes[park.id] || 0;
            const currentImage = images[currentImageIndex];

            return (
              <div
                key={park.id}
                className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                {/* Image Section */}
                <Link
                  to={`/park/${park.id}`}
                  className="block"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {currentImage ? (
                    <img
                      src={currentImage.url}
                      alt={`Image of ${park.fullName}`}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </Link>

                {/* Arrows for navigation */}
                {images.length > 1 && (
                  <>
                    {/* Left Arrow */}
                    <button
                      onClick={() => handleImageChange(park.id, 'prev', images.length)}
                      className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-50 text-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition"
                    >
                       <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Right Arrow */}
                    <button
                      onClick={() => handleImageChange(park.id, 'next', images.length)}
                     className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-50 text-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition"
                    >
                       <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Park Name Overlay */}
                <Link
                  to={`/park/${park.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-2 text-sm group-hover:bg-opacity-80 transition duration-300">
                    {park.fullName}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      
    </div>
  );
};

export default ResultsPage;
