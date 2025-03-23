import { useLocation, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import StateSearchBar from '../components/StateSearchBar';

// Define the Park type
interface Park {
  id: string;
  fullName: string;
  latitude: string;
  longitude: string;
  images?: { url: string }[];
}

// Custom icon for Leaflet markers
const parkIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ResultsPage = () => {
  const location = useLocation();
  const parks: Park[] = location.state?.parks || [];
  const [imageIndexes, setImageIndexes] = useState<{ [key: string]: number }>({});
  const [contentWidth, setContentWidth] = useState<'w-full' | 'lg:w-3/4' | 'lg:w-1/4'>('lg:w-3/4');
  const [isContentShort, setIsContentShort] = useState<boolean>(false);

  // Function to toggle content width and height
  const toggleContent = () => {
    setContentWidth(prev => (prev === 'lg:w-3/4' ? 'lg:w-1/4' : 'lg:w-3/4'));
    setIsContentShort(prev => !prev);
  };

  // Function to handle image change
  const handleImageChange = (parkId: string, direction: 'next' | 'prev', imagesLength: number) => {
    setImageIndexes(prevIndexes => {
      const currentIndex = prevIndexes[parkId] || 0;
      const newIndex = direction === 'next'
        ? (currentIndex + 1) % imagesLength
        : (currentIndex - 1 + imagesLength) % imagesLength;
      return { ...prevIndexes, [parkId]: newIndex };
    });
  };

  // Calculate the center of the map based on park locations
  const getCenter = () => {
    const validParks = parks.filter((park: { latitude: any; longitude: any; }) => park.latitude && park.longitude);
    if (validParks.length === 0) return [39.8283, -98.5795] as [number, number]; // Default center (USA)
    const avgLat = validParks.reduce((sum: number, p: { latitude: string; }) => sum + parseFloat(p.latitude), 0) / validParks.length;
    const avgLng = validParks.reduce((sum: number, p: { longitude: string; }) => sum + parseFloat(p.longitude), 0) / validParks.length;
    return [avgLat, avgLng] as [number, number];
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Map Section */}
      <div className="w-full h-[300px] lg:w-1/2 lg:h-auto sticky top-0">
        <MapContainer center={getCenter()} zoom={6} scrollWheelZoom={true} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {parks.map((park) =>
            park.latitude && park.longitude ? (
              <Marker key={park.id} position={[parseFloat(park.latitude), parseFloat(park.longitude)]} icon={parkIcon}>
                <Popup>
                  <strong>{park.fullName}</strong>
                  <br />
                  <Link to={`/park/${park.id}`} className="text-blue-500 underline">View Details</Link>
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>

      {/* Content Section */}
      <div
        className={`p-4 transition-all duration-300 ${contentWidth} lg:w-1/2 overflow-auto ${isContentShort ? 'max-h-64' : 'max-h-full'}`}
      >
        <div className="flex justify-between items-center mb-4">
          <StateSearchBar />
          <button
            onClick={toggleContent}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
          >
            Toggle Width & Height
          </button>
        </div>

        {parks.length === 0 ? (
          <p className="text-center text-gray-500">No parks found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2">
            {parks.map((park: Park) => {
              const images = park.images || [];
              const currentImageIndex = imageIndexes[park.id] || 0;
              const currentImage = images[currentImageIndex];

              return (
                <div key={park.id} className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <Link to={`/park/${park.id}`} className="block">
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
                      <button
                        onClick={() => handleImageChange(park.id, 'prev', images.length)}
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-50 text-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleImageChange(park.id, 'next', images.length)}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-50 text-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <Link to={`/park/${park.id}`} className="block">
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
    </div>
  );
};

export default ResultsPage;
