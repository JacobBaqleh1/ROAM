import { useState } from 'react';
import type { FormEvent } from 'react';
import { fetchParks } from '../utils/API';
import {  useNavigate } from 'react-router-dom';

import AutoCarousel from '../components/SlideShow';

const SearchParks = () => {
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState('');
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
  <div className="relative min-h-screen flex items-center justify-center">
    {/* Background Slideshow */}
    <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden">
      <AutoCarousel />
    </div>

    {/* Form Container - Centering the Form */}
    <div className="relative bg-black bg-opacity-50 w-full max-w-4xl mx-auto p-5 rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4 text-white">
        Search for National Parks near you!
      </h1>
      <form onSubmit={handleFormSubmit} className="flex flex-col md:flex-row gap-4">
        <input
          name="searchInput"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
          placeholder="Enter your state"
          className="w-full md:w-2/3 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="w-full md:w-1/3 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
        >
          Submit Search
        </button>
      </form>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  </div>
);


 

};

export default SearchParks;
