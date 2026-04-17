import { useLocation, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface Park {
  id: string;
  fullName: string;
  latitude: string;
  longitude: string;
  description?: string;
  states?: string;
  designation?: string;
  activities?: { id: string; name: string }[];
  images?: { url: string }[];
}

// ── Custom marker icon factory ────────────────────────────────
// SVG teardrop pin. Default: slate-gray. Active: forest green with glow.
const createMarkerIcon = (isActive: boolean) => {
  const color  = isActive ? '#2D6A4F' : '#475569';
  const size   = isActive ? 36 : 28;
  const filter = isActive
    ? 'drop-shadow(0 0 6px rgba(45,106,79,0.65)) drop-shadow(0 2px 4px rgba(0,0,0,0.35))'
    : 'drop-shadow(0 2px 3px rgba(0,0,0,0.30))';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${Math.round(size * 32 / 24)}" viewBox="0 0 24 32" style="filter:${filter};display:block;">
    <path d="M12 1 C6.477 1 2 5.477 2 11 c0 7.2 10 20 10 20 s10-12.8 10-20 C22 5.477 17.523 1 12 1 z"
      fill="${color}" stroke="white" stroke-width="1.5"/>
    <circle cx="12" cy="11" r="4" fill="white" opacity="0.9"/>
  </svg>`;

  const h = Math.round(size * 32 / 24);
  return L.divIcon({
    html: svg,
    className: '',
    iconSize:    [size, h],
    iconAnchor:  [size / 2, h],
    popupAnchor: [0, -(h - 4)],
  });
};

const StoreMapRef = ({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) => {
  const map = useMap();
  useEffect(() => { mapRef.current = map; }, [map]);
  return null;
};

const ResultsPage = () => {
  const location = useLocation();
  const parks: Park[] = location.state?.parks || [];
  const query = location.state?.query || '';

  const [imageIndexes, setImageIndexes]     = useState<{ [key: string]: number }>({});
  const [slideDirections, setSlideDirections] = useState<{ [key: string]: 'left' | 'right' }>({});
  const [hoveredParkId, setHoveredParkId] = useState<string | null>(null);
  const [selectedParkId, setSelectedParkId] = useState<string | null>(null);

  // ── Split-pane state ──────────────────────────────────────────
  const [splitPct, setSplitPct]     = useState(40);   // map takes 40% by default
  const [isDragging, setIsDragging] = useState(false);
  const [isDesktop, setIsDesktop]   = useState(() => window.innerWidth >= 768);

  const mapRef       = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs     = useRef<Map<string, HTMLDivElement>>(new Map());

  const isActive = (id: string) => id === hoveredParkId || id === selectedParkId;

  // Keep isDesktop in sync with viewport width
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Invalidate Leaflet tile layout after every resize
  useEffect(() => {
    if (mapRef.current) setTimeout(() => mapRef.current?.invalidateSize(), 50);
  }, [splitPct]);

  // Drag: apply new split percentage from pointer position
  const applyDrag = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect  = container.getBoundingClientRect();
    const pos   = isDesktop ? clientX - rect.left : clientY - rect.top;
    const total = isDesktop ? rect.width          : rect.height;
    setSplitPct(Math.min(75, Math.max(20, (pos / total) * 100)));
  }, [isDesktop]);

  useEffect(() => {
    if (!isDragging) return;
    const onMove  = (e: MouseEvent) => applyDrag(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => applyDrag(e.touches[0].clientX, e.touches[0].clientY);
    const onUp    = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchend',  onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchend',  onUp);
    };
  }, [isDragging, applyDrag]);

  // Pin → Card: scroll selected card into view
  useEffect(() => {
    if (!selectedParkId) return;
    cardRefs.current.get(selectedParkId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [selectedParkId]);

  const getCenter = (): [number, number] => {
    const valid = parks.filter((p) => p.latitude && p.longitude);
    if (valid.length === 0) return [39.8283, -98.5795];
    const avgLat = valid.reduce((s, p) => s + parseFloat(p.latitude), 0) / valid.length;
    const avgLng = valid.reduce((s, p) => s + parseFloat(p.longitude), 0) / valid.length;
    return [avgLat, avgLng];
  };
  const center = getCenter();

  const UpdateMapCenter = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => { map.setView(center, map.getZoom()); }, [center, map]);
    return null;
  };

  const handleImageChange = (parkId: string, direction: 'next' | 'prev', imagesLength: number) => {
    setSlideDirections((prev) => ({ ...prev, [parkId]: direction === 'next' ? 'left' : 'right' }));
    setImageIndexes((prev) => {
      const cur  = prev[parkId] || 0;
      const next = direction === 'next'
        ? (cur + 1) % imagesLength
        : (cur - 1 + imagesLength) % imagesLength;
      return { ...prev, [parkId]: next };
    });
  };

  return (
    <div
      ref={containerRef}
      className={[
        'flex flex-col h-screen md:flex-row',
        isDragging ? 'select-none ' + (isDesktop ? 'cursor-ew-resize' : 'cursor-ns-resize') : '',
      ].join(' ')}
    >
      {/* ── Map panel ─────────────────────────────────────────── */}
      <div
        style={isDesktop ? { width: `${splitPct}%` } : { height: `${splitPct}%` }}
        className="flex-shrink-0 sticky top-0 z-[1] md:static"
      >
        <MapContainer
          center={center}
          zoom={6}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <StoreMapRef mapRef={mapRef} />
          <UpdateMapCenter center={center} />
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {parks.map((park) =>
            park.latitude && park.longitude ? (
              <Marker
                key={park.id}
                position={[parseFloat(park.latitude), parseFloat(park.longitude)]}
                icon={createMarkerIcon(isActive(park.id))}
                eventHandlers={{ click: () => setSelectedParkId(park.id) }}
              >
                <Popup>
                  <strong>{park.fullName}</strong>
                  <br />
                  <Link to={`/park/${park.id}`} className="text-blue-500 underline">
                    View Details
                  </Link>
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>

      {/* ── List panel — handle + scroll area as flex siblings ── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* Drag handle — outside the scroll container so it stays fixed in place */}
        <div
          onMouseDown={(e) => { e.preventDefault(); setIsDragging(true); }}
          onTouchStart={() => setIsDragging(true)}
          className={[
            'flex-shrink-0',
            // mobile: full-width horizontal bar  |  desktop: full-height vertical bar
            'h-10 w-full md:h-full md:w-5',
            'flex items-center justify-center',
            'cursor-ns-resize md:cursor-ew-resize',
            'transition-colors duration-150',
            isDragging ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300',
          ].join(' ')}
        >
          {/* Visible pill */}
          <div className={[
            'rounded-full pointer-events-none transition-all duration-150',
            'w-16 h-[6px] md:w-[6px] md:h-16',
            isDragging ? 'bg-gray-600 md:w-[8px] w-20' : 'bg-gray-500',
          ].join(' ')} />
        </div>

        {/* Scrollable content */}
        <div className="@container flex-1 overflow-auto p-4">
          <div className="text-center w-full py-6">
            Results for <span className="font-bold ml-1 uppercase">{query}</span>
          </div>

          {parks.length === 0 ? (
            <p className="text-center text-gray-500">No parks found.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {parks.map((park) => {
                const images            = park.images || [];
                const currentImageIndex = imageIndexes[park.id] || 0;
                const currentImage      = images[currentImageIndex];
                const active            = isActive(park.id);

                return (
                  <div
                    key={park.id}
                    ref={(el) => {
                      if (el) cardRefs.current.set(park.id, el);
                      else cardRefs.current.delete(park.id);
                    }}
                    onMouseEnter={() => setHoveredParkId(park.id)}
                    onMouseLeave={() => setHoveredParkId(null)}
                    className={[
                      'group flex flex-col @sm:flex-row rounded-lg overflow-hidden shadow-md',
                      'transition-all duration-200 bg-white',
                      active
                        ? 'shadow-card-hover ring-2 ring-forest-500 ring-offset-2'
                        : 'hover:shadow-lg',
                    ].join(' ')}
                  >
                    {/* Thumbnail with carousel */}
                    <div className="relative flex-shrink-0 w-full h-44 @sm:w-28 @sm:h-auto @md:w-44 overflow-hidden">
                      <Link to={`/park/${park.id}`} className="absolute inset-0">
                        {currentImage ? (
                          <img
                            key={`${park.id}-${currentImageIndex}`}
                            src={currentImage.url}
                            alt={`Image of ${park.fullName}`}
                            className={[
                              'absolute inset-0 w-full h-full object-cover',
                              slideDirections[park.id] === 'left'  ? 'animate-slide-from-right' :
                              slideDirections[park.id] === 'right' ? 'animate-slide-from-left'  : '',
                            ].join(' ')}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </Link>
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={() => handleImageChange(park.id, 'prev', images.length)}
                            className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/90 rounded-full w-6 h-6 flex items-center justify-center transition"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleImageChange(park.id, 'next', images.length)}
                            className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/90 rounded-full w-6 h-6 flex items-center justify-center transition"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Info */}
                    <Link to={`/park/${park.id}`} className="flex-1 min-w-0 p-3 flex flex-col gap-1.5">
                      <h3 className="font-semibold text-sm leading-tight text-gray-900 line-clamp-2">
                        {park.fullName}
                      </h3>

                      <div className="flex items-center gap-2 flex-wrap">
                        {park.designation && (
                          <span className="text-xs bg-forest-500 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                            {park.designation}
                          </span>
                        )}
                        {park.states && (
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            {park.states.split(',').join(' · ')}
                          </span>
                        )}
                      </div>

                      {park.description && (
                        <p className="hidden @md:block text-xs text-gray-600 leading-relaxed line-clamp-2">
                          {park.description}
                        </p>
                      )}

                      {park.activities && park.activities.length > 0 && (
                        <div className="hidden @lg:flex flex-wrap gap-1 mt-auto pt-1">
                          {park.activities.slice(0, 4).map((a) => (
                            <span key={a.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              {a.name}
                            </span>
                          ))}
                          {park.activities.length > 4 && (
                            <span className="text-xs text-gray-400 self-center">+{park.activities.length - 4} more</span>
                          )}
                        </div>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>      {/* end scrollable content */}
      </div>      {/* end list panel */}
    </div>
  );
};

export default ResultsPage;
