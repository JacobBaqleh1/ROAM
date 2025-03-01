import { useState } from 'react';
import type { FormEvent } from 'react';
import { fetchParks } from '../utils/API';
import {  useNavigate } from 'react-router-dom';
import searchImg from '../assets/search.svg'
import AutoCarousel from '../components/SlideShow';
import Footer from '../components/Footer';

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
    <div>
  <div className="relative min-h-screen flex flex-col items-center justify-start ">
    {/* Background Slideshow */}
    <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden">
      <AutoCarousel />
    </div>

    {/* Form Container - Centering the Form */}
    <div className="relative  bg-opacity-50 w-full max-w-4xl mx-auto p-5 rounded-lg">
       <div className="flex flex-col md:flex-row items-center gap-4">
      <h1 className="text-3xl font-black text-center mb-4 text-white ">
        Search for National Parks near you!
      </h1>
      <form onSubmit={handleFormSubmit} className="flex flex-col md:flex-row gap-4">
        <input
          name="searchInput"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
          placeholder="Enter your state"
          className="w-full md:w-2/3 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100"
        />
        <button
          type="submit"
          className="w-[5rem] bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
        >
           <img src={searchImg} alt="Search" className="h-6 w-4 inline-block" />

        </button>
      </form>
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
    
  </div>
  <Footer /> 
  </div>
);




};


export default SearchParks;
