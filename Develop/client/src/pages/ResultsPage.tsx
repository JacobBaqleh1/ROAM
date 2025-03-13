import { useLocation, Link, useNavigate } from 'react-router-dom';
import searchImg from '../assets/search.svg'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { fetchParks } from '../utils/API';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import StateSearchBar from '../components/StateSearchBar';

// Custom icon (optional)
const parkIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ResultsPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [err, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const parks = location.state?.parks || [];
  const [imageIndexes, setImageIndexes] = useState<{ [key: string]: number }>({})


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

  // Calculate center of the state based on park locations
  const getCenter = () => {
    const validParks = parks.filter((park: any) => park.latitude && park.longitude);
    if (validParks.length === 0) return [39.8283, -98.5795] as [number, number]; // Default to US center
    const avgLat = validParks.reduce((sum: number, p: { latitude: string; }) => sum + parseFloat(p.latitude), 0) / validParks.length;
    const avgLng = validParks.reduce((sum: number, p: { longitude: string; }) => sum + parseFloat(p.longitude), 0) / validParks.length;
    return [avgLat, avgLng] as [number, number];
  };

  const center = getCenter();


  return (
    <div className="flex">
      {/* Left side - Cards */}
      <div className="w-3/4 p-4 overflow-y-auto h-screen">
        <div className='flex justify-end'>
          <StateSearchBar />
        </div>
        {parks.length === 0 ? (
          <p className="text-center text-gray-500">No parks found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {parks.map((park: any) => {
              const images = park.images || [];
              const currentImageIndex = imageIndexes[park.id] || 0;
              const currentImage = images[currentImageIndex];

              return (
                <div key={park.id} className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <Link to={`/park/${park.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {currentImage ? (
                      <img src={currentImage.url} alt={`Image of ${park.fullName}`} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </Link>
                  {images.length > 1 && (
                    <>
                      <button onClick={() => handleImageChange(park.id, 'prev', images.length)} className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-50 text-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleImageChange(park.id, 'next', images.length)} className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-50 text-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <Link to={`/park/${park.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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

      {/* Right side - Map */}
      <div className="w-1/4 h-screen sticky top-0">
        <MapContainer center={center} zoom={6} scrollWheelZoom={true} className="h-full w-full z-0">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {parks.map((park: any) => (
            park.latitude && park.longitude && (
              <Marker
                key={park.id}
                position={[parseFloat(park.latitude), parseFloat(park.longitude)]}
                icon={parkIcon}
              >
                <Popup>
                  <strong>{park.fullName}</strong><br />
                  <Link to={`/park/${park.id}`}>View Details</Link>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default ResultsPage;
