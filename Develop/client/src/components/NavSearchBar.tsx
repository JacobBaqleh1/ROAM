import { useState } from "react";
import { fetchParks } from "../utils/API";
import { useNavigate } from "react-router-dom";

const stateMap: Record<string, string> = {
  "alabama": "AL", "alaska": "AK", "arizona": "AZ", "arkansas": "AR", "california": "CA",
  "colorado": "CO", "connecticut": "CT", "delaware": "DE", "florida": "FL", "georgia": "GA",
  "hawaii": "HI", "idaho": "ID", "illinois": "IL", "indiana": "IN", "iowa": "IA",
  "kansas": "KS", "kentucky": "KY", "louisiana": "LA", "maine": "ME", "maryland": "MD",
  "massachusetts": "MA", "michigan": "MI", "minnesota": "MN", "mississippi": "MS", "missouri": "MO",
  "montana": "MT", "nebraska": "NE", "nevada": "NV", "new hampshire": "NH", "new jersey": "NJ",
  "new mexico": "NM", "new york": "NY", "north carolina": "NC", "north dakota": "ND", "ohio": "OH",
  "oklahoma": "OK", "oregon": "OR", "pennsylvania": "PA", "rhode island": "RI", "south carolina": "SC",
  "south dakota": "SD", "tennessee": "TN", "texas": "TX", "utah": "UT", "vermont": "VT",
  "virginia": "VA", "washington": "WA", "west virginia": "WV", "wisconsin": "WI", "wyoming": "WY"
};

export default function NavSearchBar() {
  const [selectedState, setSelectedState] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown visibility
  const [err, setError] = useState('');
  const navigate = useNavigate();

  const handleStateSelect = async (state: string) => {
    setSelectedState(state);
    setIsDropdownOpen(false); // Close the dropdown after selecting a state
    setError('');

    try {
      const response = await fetchParks(state);
      if (!response || response.length === 0) {
        setError('No parks found. Try another state.');
        return;
      }
      navigate('/results', { state: { parks: response, query: state } });
    } catch (err) {
      setError('Error fetching parks. Please try again.');
      console.error('Error fetching parks:', err);
    }
  };

  return (
    <div>
      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown visibility
            className="w-full p-3 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-lg text-center flex items-center justify-between"
          >
            <span>{selectedState || "Select a state"}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {isDropdownOpen && ( // Only show the dropdown if isDropdownOpen is true
            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-[16rem] overflow-y-auto">
              {Object.keys(stateMap).map((state) => (
                <div
                  key={state}
                  onClick={() => handleStateSelect(state)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {state.charAt(0).toUpperCase() + state.slice(1)} {/* Capitalize */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {err && <p className="text-red-500 text-center mt-2">{err}</p>}
    </div>
  );
}