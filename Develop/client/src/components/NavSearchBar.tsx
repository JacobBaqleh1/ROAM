import { FormEvent, useState } from "react";
import { fetchParks } from "../utils/API";
import { useNavigate } from "react-router-dom";
import searchImg from '../assets/search.svg'
// import logo from '../assets/roam-logo.svg'

export default function NavSearchBar() {

  const [searchInput, setSearchInput] = useState('');
  const [err, setError] = useState('');
  const navigate = useNavigate();
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
    <div >
      <form
        onSubmit={handleFormSubmit}
        className="w-full max-w-2xl mx-auto px-4"
      >
        <div className="flex  sm:flex-row items-stretch bg-white rounded-full overflow-hidden shadow-md">
          <input
            name="searchInput"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Enter your state"
            className="flex-1 p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-5 py-3 sm:rounded-r-full hover:bg-green-700 transition flex items-center justify-center"
          >
            <img src={searchImg} alt="Search" className="h-5 w-5" />
          </button>
        </div>
      </form>


      {err && <p className="text-red-500 text-center">{err}</p>}
    </div>
  )
}