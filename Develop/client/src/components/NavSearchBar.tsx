import { useState } from "react";
import { fetchParks } from "../utils/API";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const stateMap: Record<string, string> = {
  "alabama": "AL", "alaska": "AK", "arizona": "AZ", "arkansas": "AR",
  "california": "CA", "colorado": "CO", "connecticut": "CT", "delaware": "DE",
  "florida": "FL", "georgia": "GA", "hawaii": "HI", "idaho": "ID",
  "illinois": "IL", "indiana": "IN", "iowa": "IA", "kansas": "KS",
  "kentucky": "KY", "louisiana": "LA", "maine": "ME", "maryland": "MD",
  "massachusetts": "MA", "michigan": "MI", "minnesota": "MN",
  "mississippi": "MS", "missouri": "MO", "montana": "MT", "nebraska": "NE",
  "nevada": "NV", "new hampshire": "NH", "new jersey": "NJ",
  "new mexico": "NM", "new york": "NY", "north carolina": "NC",
  "north dakota": "ND", "ohio": "OH", "oklahoma": "OK", "oregon": "OR",
  "pennsylvania": "PA", "rhode island": "RI", "south carolina": "SC",
  "south dakota": "SD", "tennessee": "TN", "texas": "TX", "utah": "UT",
  "vermont": "VT", "virginia": "VA", "washington": "WA",
  "west virginia": "WV", "wisconsin": "WI", "wyoming": "WY",
};

const toTitle = (s: string) =>
  s.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

export default function NavSearchBar() {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [err, setError] = useState("");
  const navigate = useNavigate();

  const handleStateClick = async (stateName: string) => {
    if (loading) return;
    const stateKey = stateName.toLowerCase();
    if (!stateMap[stateKey]) return;
    setLoading(stateName);
    setError("");
    setInputValue(stateName);
    setShowSuggestions(false);
    try {
      const response = await fetchParks(stateKey);
      if (!response || response.length === 0) {
        setError("No parks found.");
        setLoading(null);
        return;
      }
      navigate("/results", { state: { parks: response, query: stateKey } });
    } catch {
      setError("Error fetching parks.");
      setLoading(null);
    }
  };

  const suggestions =
    inputValue.length > 0
      ? Object.keys(stateMap).filter(
          s =>
            s.startsWith(inputValue.toLowerCase()) ||
            s.split(" ").some(w => w.startsWith(inputValue.toLowerCase()))
        )
      : [];

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search size={15} className="absolute left-3 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={loading ? `Loading ${inputValue}…` : inputValue}
          onChange={e => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
            setError("");
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onKeyDown={e => {
            if (e.key === "Enter" && suggestions.length > 0) {
              handleStateClick(toTitle(suggestions[0]));
            }
          }}
          disabled={!!loading}
          placeholder="Search a state…"
          className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-forest-500 disabled:opacity-60"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg max-h-56 overflow-y-auto">
          {suggestions.slice(0, 8).map(s => (
            <button
              key={s}
              onMouseDown={() => handleStateClick(toTitle(s))}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
            >
              <span className="capitalize">{s}</span>
              <span className="text-xs text-gray-400 font-mono">{stateMap[s]}</span>
            </button>
          ))}
        </div>
      )}

      {err && <p className="text-red-400 text-xs mt-1 pl-1">{err}</p>}
    </div>
  );
}
