import { lazy, Suspense, useEffect, useState } from "react";
import { fetchParks } from "../utils/API";
import { useNavigate } from "react-router-dom";

const HomeSearchMap = lazy(() => import("./HomeSearchMap"));

const stateMap: Record<string, string> = {
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR",
  california: "CA", colorado: "CO", connecticut: "CT", delaware: "DE",
  florida: "FL", georgia: "GA", hawaii: "HI", idaho: "ID",
  illinois: "IL", indiana: "IN", iowa: "IA", kansas: "KS",
  kentucky: "KY", louisiana: "LA", maine: "ME", maryland: "MD",
  massachusetts: "MA", michigan: "MI", minnesota: "MN",
  mississippi: "MS", missouri: "MO", montana: "MT", nebraska: "NE",
  nevada: "NV", "new hampshire": "NH", "new jersey": "NJ",
  "new mexico": "NM", "new york": "NY", "north carolina": "NC",
  "north dakota": "ND", ohio: "OH", oklahoma: "OK", oregon: "OR",
  pennsylvania: "PA", "rhode island": "RI", "south carolina": "SC",
  "south dakota": "SD", tennessee: "TN", texas: "TX", utah: "UT",
  vermont: "VT", virginia: "VA", washington: "WA",
  "west virginia": "WV", wisconsin: "WI", wyoming: "WY",
};

const toTitle = (s: string) =>
  s.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

function MapFallback() {
  return <div className="hidden md:block h-48 rounded-lg bg-white/10 animate-pulse mb-10" />;
}

export default function HomeSearchBar() {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [err, setError] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    if (!mq.matches) return;

    const enableMap = () => setShowMap(true);
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(enableMap);
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(enableMap, 1);
    return () => clearTimeout(t);
  }, []);

  const handleStateClick = async (stateName: string) => {
    if (loading) return;
    const stateKey = stateName.toLowerCase();
    if (!stateMap[stateKey]) return;
    setLoading(stateName);
    setError("");
    try {
      const response = await fetchParks(stateKey);
      if (!response || response.length === 0) {
        setError(`No parks found for ${stateName}.`);
        setLoading(null);
        return;
      }
      navigate("/map", { state: { parks: response, query: stateKey } });
    } catch {
      setError("Error fetching parks. Please try again.");
      setLoading(null);
    }
  };

  const suggestions =
    inputValue.length > 0
      ? Object.keys(stateMap).filter(
          (s) =>
            s.startsWith(inputValue.toLowerCase()) ||
            s.split(" ").some((word) => word.startsWith(inputValue.toLowerCase()))
        )
      : [];

  return (
    <div className="w-full max-w-2xl mx-auto px-2">
      <div className="hidden md:block text-center text-white mb-1 h-7 text-lg font-semibold drop-shadow">
        {loading ? (
          <span className="animate-pulse">Loading {loading}…</span>
        ) : (
          <span className={hoveredState ? "opacity-100" : "opacity-60"}>
            {hoveredState ?? "Tap or hover a state"}
          </span>
        )}
      </div>

      <div className="relative mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && suggestions.length > 0) {
              handleStateClick(toTitle(suggestions[0]));
              setInputValue("");
              setShowSuggestions(false);
            }
          }}
          placeholder="Search for a state…"
          className="w-full px-4 py-2 rounded-full bg-white/20 text-white placeholder-white/60 border border-white/40 focus:outline-none focus:bg-white/30 text-sm backdrop-blur-sm"
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {suggestions.slice(0, 8).map((s) => (
              <button
                key={s}
                onMouseDown={() => {
                  handleStateClick(toTitle(s));
                  setInputValue("");
                  setShowSuggestions(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
              >
                <span className="capitalize">{s}</span>
                <span className="text-xs text-gray-400 font-mono">{stateMap[s]}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {err && <p className="text-red-300 text-center mb-2 text-sm">{err}</p>}

      {showMap && (
        <Suspense fallback={<MapFallback />}>
          <HomeSearchMap
            stateMap={stateMap}
            loading={loading}
            onStateClick={handleStateClick}
            onHover={setHoveredState}
          />
        </Suspense>
      )}
    </div>
  );
}
