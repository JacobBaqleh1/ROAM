import { useLocation, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


interface Park {
  id: string;
  fullName: string;
  latitude: string;
  longitude: string;
  images?: { url: string }[];
}

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
  const [isExpanded, setIsExpanded] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const query = location.state?.query || '';

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 300); // Slight delay to allow for transition
    }
  }, [isExpanded]);
  const handleImageChange = (parkId: string, direction: 'next' | 'prev', imagesLength: number) => {
    setImageIndexes(prevIndexes => {
      const currentIndex = prevIndexes[parkId] || 0;
      const newIndex = direction === 'next'
        ? (currentIndex + 1) % imagesLength
        : (currentIndex - 1 + imagesLength) % imagesLength;
      return { ...prevIndexes, [parkId]: newIndex };
    });
  };

  const getCenter = () => {
    const validParks = parks.filter((park) => park.latitude && park.longitude);
    if (validParks.length === 0) return [39.8283, -98.5795] as [number, number];
    const avgLat = validParks.reduce((sum, p) => sum + parseFloat(p.latitude), 0) / validParks.length;
    const avgLng = validParks.reduce((sum, p) => sum + parseFloat(p.longitude), 0) / validParks.length;
    return [avgLat, avgLng] as [number, number];
  };

  return (
    <>

      <div className="flex flex-col h-screen relative transition-all duration-300 md:flex-row md:flex-wrap ">
        <div className='bg-black text-white text-center w-full' >
          Results for <span className='font-bold ml-1 uppercase'>{query}</span>
        </div>

        {/* Map Section */}
        <div className={`transition-all duration-300 ${isExpanded ? "h-3/4 md:h-full md:w-2/3" : "h-1/4 md:h-full lg:w-1/3"} w-full sticky top-0 md:static`}>
          <MapContainer
            center={getCenter()}
            zoom={6}
            scrollWheelZoom={true}
            className="h-full w-full"
            whenReady={() => {
              if (mapRef.current) {
                mapRef.current = mapRef.current;
              }
            }}
          >
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
        <div className={`transition-all duration-300 ${isExpanded ? "h-1/4 md:w-1/3 md:h-full" : "h-3/4 md:h-full md:w-2/3 "} w-full overflow-auto p-4 `}>

          {parks.length === 0 ? (
            <p className="text-center text-gray-500">No parks found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2">
              {parks.map((park) => {
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

        {/* Floating Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 z-[9999]"
        >
          <div className='flex flex-col justify-center items-center'>
            Map View
            <ArrowUpDown className="w-6 h-6 md:rotate-90" />

          </div>
        </button>
      </div>
    </>
  );
};

export default ResultsPage;
