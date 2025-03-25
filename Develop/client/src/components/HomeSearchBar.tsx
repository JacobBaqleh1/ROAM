import { FormEvent, useState } from "react";
import { fetchParks } from "../utils/API";
import { useNavigate } from "react-router-dom";
import searchImg from '../assets/search.svg'

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


export default function HomeSearchBar() {
    const [searchInput, setSearchInput] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [err, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setSearchInput(value);

        if (value.length > 0) {
            const filteredStates = Object.keys(stateMap)
                .filter(state => state.includes(value))
                .slice(0, 5); // Limit to 5 suggestions
            setSuggestions(filteredStates);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (state: string) => {
        setSearchInput(state);
        setSuggestions([]); // Hide suggestions
    };


    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        if (!searchInput) {
            console.error('Please enter a location.');
            return;
        };

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
        <div className="flex flex-col justify-center w-screen md:w-full " >
            <form onSubmit={handleFormSubmit} className="relative flex gap-2 items-center">
                <div className="flex items-center bg-white rounded-full overflow-hidden shadow-md w-full h-[5rem] ">
                    <input
                        name="searchInput"
                        value={searchInput}
                        onChange={handleInputChange}
                        type="text"
                        autoComplete="off"
                        placeholder="Enter your state"
                        className="w-full md:w-2/3 p-3 rounded-lg border border-white focus:outline-none focus:ring-2 focus:ring-green-500 h-full text-lg text-center "
                    />

                    <button
                        type="submit"
                        className="w-[5rem] md:w-[8rem]  h-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
                    >
                        <img src={searchImg} alt="Search" className="h-6 w-6 inline-block" />

                    </button>

                </div>

            </form>
            {suggestions.length > 0 && (
                <ul className=" absolute left-[20%]  right-[20%] top-90 bg-white border max-h-40 overflow-y-auto mt-2 z-10 shadow-lg rounded-lg text-center">
                    {suggestions.map((state) => (
                        <li
                            key={state}
                            onClick={() => handleSuggestionClick(state)}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                        >
                            {state.charAt(0).toUpperCase() + state.slice(1)} {/* Capitalize */}
                        </li>
                    ))}
                </ul>
            )}

            {err && <p className="text-red-500 text-center">{err}</p>}
        </div>
    )
}