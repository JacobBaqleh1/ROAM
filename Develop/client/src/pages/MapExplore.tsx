import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, ZoomControl, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchAllParks, fetchParkById, fetchParks } from '../utils/API';
import NavSearchBar from '../components/NavSearchBar';
import FadeImage from '../components/ui/FadeImage';

const PHOTO_ZOOM    = 7;   // zoom level at which photo circles appear
const BOUNDS_PAD    = 0.5; // 50% buffer beyond viewport edges to prevent pop-in
const DEBOUNCE_MS   = 150; // ms to wait after movement stops before React re-renders

const dotMarker = L.divIcon({
  html: `<div style="width:10px;height:10px;border-radius:50%;background:#2D6A4F;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);cursor:pointer;"></div>`,
  className: '',
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

const highlightedDotMarker = L.divIcon({
  html: `<div style="width:10px;height:10px;border-radius:50%;background:#2D6A4F;border:2px solid white;box-shadow:0 0 0 4px rgba(45,106,79,0.45),0 0 10px rgba(45,106,79,0.6);cursor:pointer;"></div>`,
  className: '',
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

const makePhotoIcon = (url: string) =>
  L.divIcon({
    html: `<div style="width:48px;height:48px;border-radius:50%;border:2.5px solid white;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.35);background:url('${url}') center/cover no-repeat;cursor:pointer;"></div>`,
    className: '',
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });

const makeHighlightedPhotoIcon = (url: string) =>
  L.divIcon({
    html: `<div style="width:48px;height:48px;border-radius:50%;border:3px solid #2D6A4F;overflow:hidden;box-shadow:0 0 0 3px rgba(45,106,79,0.35),0 0 14px rgba(45,106,79,0.7);background:url('${url}') center/cover no-repeat;cursor:pointer;"></div>`,
    className: '',
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });

function MapController({ onUpdate }: { onUpdate: (z: number, b: L.LatLngBounds) => void }) {
  const map = useMapEvents({
    moveend: () => onUpdate(map.getZoom(), map.getBounds()),
    zoomend: () => onUpdate(map.getZoom(), map.getBounds()),
  });
  useEffect(() => { onUpdate(map.getZoom(), map.getBounds()); }, []);
  return null;
}

function ResultsPanel({
  parks, onParkClick, hoveredParkId, onHover,
}: {
  parks: any[];
  onParkClick: (id: string) => void;
  hoveredParkId: string | null;
  onHover: (id: string | null) => void;
}) {
  if (!parks.length) return <p className="text-sm text-gray-500 text-center mt-8">No parks found.</p>;
  return (
    <div className="flex flex-col gap-3">
      {parks.map(park => (
        <button
          key={park.id}
          onClick={() => onParkClick(park.id)}
          onMouseEnter={() => onHover(park.id)}
          onMouseLeave={() => onHover(null)}
          className={[
            'flex gap-3 rounded-lg overflow-hidden shadow-sm bg-white border transition text-left w-full',
            hoveredParkId === park.id
              ? 'border-forest-500 shadow-md ring-1 ring-forest-500/30'
              : 'border-gray-100 hover:shadow-md',
          ].join(' ')}
        >
          <div className="w-24 h-20 flex-shrink-0">
            <FadeImage
              src={park.images?.[0]?.url ?? ''}
              alt={park.fullName}
              className="w-full h-full"
              fallbackLabel={park.fullName}
            />
          </div>
          <div className="flex-1 min-w-0 p-2 flex flex-col gap-1">
            <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">{park.fullName}</p>
            {park.designation && (
              <span className="text-xs bg-forest-500 text-white px-2 py-0.5 rounded-full w-fit">{park.designation}</span>
            )}
            {park.states && (
              <span className="text-xs text-gray-500 uppercase tracking-wide">{park.states.split(',').join(' · ')}</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

function ParkPanel({ park, onShowState }: { park: any; onShowState: (parks: any[], query: string) => void }) {
  const [loadingState,  setLoadingState]  = useState(false);
  const [imageIndex,    setImageIndex]    = useState(0);

  useEffect(() => { setImageIndex(0); }, [park?.id]);

  const handleMoreParks = async () => {
    if (!park?.states) return;
    const code = park.states.split(',')[0].trim();
    setLoadingState(true);
    const results = await fetchParks(code);
    setLoadingState(false);
    onShowState(results, code);
  };

  if (!park) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-8 h-8 border-4 border-forest-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const images     = park.images ?? [];
  const firstState = park.states?.split(',')[0].trim();

  return (
    <div className="flex flex-col gap-4">
      {firstState && (
        <button
          onClick={handleMoreParks}
          disabled={loadingState}
          className="text-xs font-semibold text-forest-700 bg-forest-50 border border-forest-200 rounded-lg px-3 py-2 hover:bg-forest-100 transition-colors disabled:opacity-60 text-left"
        >
          {loadingState ? 'Loading…' : `← More parks in ${firstState}`}
        </button>
      )}
      {images.length > 0 && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden flex-shrink-0">
          <FadeImage
            key={imageIndex}
            src={images[imageIndex]?.url ?? ''}
            alt={park.fullName}
            className="w-full h-full"
            fallbackLabel={park.fullName}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={() => setImageIndex(i => (i - 1 + images.length) % images.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/95 rounded-full w-7 h-7 flex items-center justify-center shadow transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setImageIndex(i => (i + 1) % images.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/95 rounded-full w-7 h-7 flex items-center justify-center shadow transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_: any, i: number) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imageIndex ? 'bg-white' : 'bg-white/50'}`} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-bold text-gray-900">{park.fullName}</h3>
        {park.designation && (
          <span className="text-xs bg-forest-500 text-white px-2 py-0.5 rounded-full w-fit">{park.designation}</span>
        )}
        {park.states && (
          <span className="text-xs text-gray-500 uppercase tracking-wide">{park.states.split(',').join(' · ')}</span>
        )}
        {park.description && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-5">{park.description}</p>
        )}
        {park.activities?.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {park.activities.slice(0, 6).map((a: any) => (
              <span key={a.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{a.name}</span>
            ))}
          </div>
        )}
        <Link
          to={`/park/${park.id}`}
          className="mt-2 text-sm text-forest-600 hover:underline font-medium"
        >
          View full page →
        </Link>
      </div>
    </div>
  );
}

export default function MapExplore() {
  const [parks,       setParks]       = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [zoom,        setZoom]        = useState(4);
  const [bounds,      setBounds]      = useState<L.LatLngBounds | null>(null);
  const [panelType,   setPanelType]   = useState<'results' | 'park' | null>(null);
  const [panelParks,  setPanelParks]  = useState<any[]>([]);
  const [panelQuery,  setPanelQuery]  = useState('');
  const [panelParkId, setPanelParkId] = useState<string | null>(null);
  const [panelPark,   setPanelPark]   = useState<any>(null);
  const [showAttrib,    setShowAttrib]    = useState(false);
  const [hoveredParkId, setHoveredParkId] = useState<string | null>(null);
  const location = useLocation();

  const debounceRef          = useRef<ReturnType<typeof setTimeout>>();
  const mapRef               = useRef<L.Map | null>(null);
  const photoIconCache       = useRef<Map<string, L.DivIcon>>(new Map());
  const highlightedIconCache = useRef<Map<string, L.DivIcon>>(new Map());

  const getPhotoIcon = useCallback((url: string) => {
    if (!photoIconCache.current.has(url)) {
      photoIconCache.current.set(url, makePhotoIcon(url));
    }
    return photoIconCache.current.get(url)!;
  }, []);

  const getHighlightedPhotoIcon = useCallback((url: string) => {
    if (!highlightedIconCache.current.has(url)) {
      highlightedIconCache.current.set(url, makeHighlightedPhotoIcon(url));
    }
    return highlightedIconCache.current.get(url)!;
  }, []);

  useEffect(() => {
    fetchAllParks().then(data => {
      setParks(data);
      setLoading(false);
    });
  }, []);

  // Open results panel when navigated here from HomeSearchBar / NavSearchBar.
  // Delay flyToParks so the Leaflet map has fully painted before fitBounds runs.
  useEffect(() => {
    const s = location.state as { parks?: any[]; query?: string } | null;
    if (!s?.parks?.length) return;
    setPanelParks(s.parks);
    setPanelQuery(s.query ?? '');
    setPanelType('results');
    const t = setTimeout(() => flyToParks(s.parks!), 300);
    return () => clearTimeout(t);
  }, []);

  // Fetch park detail whenever panelParkId changes
  useEffect(() => {
    if (!panelParkId) return;
    setPanelPark(null);
    fetchParkById(panelParkId).then(setPanelPark);
  }, [panelParkId]);

  const handleMapUpdate = useCallback((z: number, b: L.LatLngBounds) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setZoom(z);
      setBounds(b);
    }, DEBOUNCE_MS);
  }, []);

  const bufferedBounds = useMemo(
    () => bounds?.pad(BOUNDS_PAD) ?? null,
    [bounds]
  );

  const visibleParks = useMemo(() =>
    parks.filter(park => {
      const lat = parseFloat(park.latitude);
      const lng = parseFloat(park.longitude);
      if (!park.latitude || !park.longitude || isNaN(lat) || isNaN(lng)) return false;
      return bufferedBounds ? bufferedBounds.contains([lat, lng]) : true;
    }),
    [parks, bufferedBounds]
  );

  const openParkPanel = useCallback((id: string) => {
    setPanelParkId(id);
    setPanelType('park');
  }, []);

  const flyToParks = useCallback((list: any[]) => {
    if (!mapRef.current) return;
    // Prefer single-state parks for bounds — multi-state trails can have coordinates
    // far from the searched state and blow out the zoom. Fall back progressively.
    const singleState = list.filter(p => p.states && p.states.split(',').length === 1);
    const fewStates   = list.filter(p => !p.states || p.states.split(',').length <= 3);
    const source      = singleState.length ? singleState : fewStates.length ? fewStates : list;
    const coords      = source
      .filter(p => p.latitude && p.longitude)
      .map(p => [parseFloat(p.latitude), parseFloat(p.longitude)] as [number, number]);
    if (!coords.length) return;
    mapRef.current.fitBounds(L.latLngBounds(coords), { padding: [10, 10] });
  }, []);

  const panelTitle = panelType === 'results'
    ? `Results for ${panelQuery}`
    : panelPark?.fullName ?? 'Loading…';

  return (
    <div className="relative h-full w-full">
      {/* Map — always full width/height underneath */}
      <div className="absolute inset-0">
        <div className="absolute top-4 left-4 z-[500] w-72">
          <NavSearchBar onResults={(parks, query) => {
            setPanelParks(parks);
            setPanelQuery(query);
            setPanelType('results');
            flyToParks(parks);
          }} />
        </div>

        {loading && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="w-10 h-10 border-4 border-forest-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <MapContainer
          ref={mapRef}
          center={[39.8283, -98.5795]}
          zoom={4}
          scrollWheelZoom={true}
          zoomControl={false}
          attributionControl={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"
            maxZoom={16}
          />
          <ZoomControl position="bottomleft" />
          <MapController onUpdate={handleMapUpdate} />
          {visibleParks.map(park => {
            const lat = parseFloat(park.latitude);
            const lng = parseFloat(park.longitude);
            const showPhoto = zoom >= PHOTO_ZOOM && !!park.images?.[0]?.url;
            const hovered   = park.id === hoveredParkId;
            return (
              <Marker
                key={park.id}
                position={[lat, lng]}
                icon={
                  showPhoto
                    ? (hovered ? getHighlightedPhotoIcon(park.images[0].url) : getPhotoIcon(park.images[0].url))
                    : (hovered ? highlightedDotMarker : dotMarker)
                }
                eventHandlers={{ click: () => {
                  openParkPanel(park.id);
                  mapRef.current?.flyTo([lat, lng], 9);
                } }}
              />
            );
          })}
        </MapContainer>

        {/* Custom attribution toggle */}
        <div className="absolute bottom-4 right-4 z-[400] flex flex-row items-center gap-2">
          {showAttrib && (
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-600 shadow-md max-w-xs leading-relaxed">
              Tiles &copy; <a href="https://www.esri.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">Esri</a> — National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC
            </div>
          )}
          <button
            onClick={() => setShowAttrib(v => !v)}
            className="w-7 h-7 rounded-full bg-white border-2 border-gray-700 text-gray-700 flex items-center justify-center text-xs font-bold shadow-md hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            i
          </button>
        </div>
      </div>

      {/* Content panel — bottom sheet on mobile, floating card on desktop */}
      {panelType && (
        <div className="absolute z-[500] flex flex-col
          bottom-0 left-0 right-0 h-[62vh]
          md:top-5 md:right-5 md:bottom-5 md:left-auto md:h-auto md:w-[420px]">
          <div className="flex flex-col bg-white shadow-2xl overflow-hidden h-full
            rounded-t-2xl md:rounded-2xl">
            {/* Mobile drag handle */}
            <div className="md:hidden flex justify-center pt-2 pb-0 flex-shrink-0">
              <div className="w-8 h-1 rounded-full bg-gray-300" />
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
              <h2 className="font-semibold text-sm text-gray-800 truncate capitalize">{panelTitle}</h2>
              <button
                onClick={() => setPanelType(null)}
                className="p-1 rounded-full hover:bg-gray-100 flex-shrink-0 ml-2"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {panelType === 'results' && (
                <ResultsPanel
                  parks={panelParks}
                  onParkClick={openParkPanel}
                  hoveredParkId={hoveredParkId}
                  onHover={setHoveredParkId}
                />
              )}
              {panelType === 'park' && (
                <ParkPanel
                  park={panelPark}
                  onShowState={(parks, query) => {
                    setPanelParks(parks);
                    setPanelQuery(query);
                    setPanelType('results');
                    flyToParks(parks);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
