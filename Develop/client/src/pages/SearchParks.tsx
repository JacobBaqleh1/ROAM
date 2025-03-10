import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { fetchParks } from '../utils/API';
import {  useNavigate } from 'react-router-dom';
import searchImg from '../assets/search.svg'
import AutoCarousel from '../components/SlideShow';
import Footer from '../components/Footer';
import { QUERY_ALL_REVIEWS } from '../utils/queries.js';
import { useQuery } from '@apollo/client';

const SearchParks = () => {
  const [searchInput, setSearchInput] = useState('');
  const [err, setError] = useState('');
   const navigate = useNavigate();
const { loading, error, data, refetch } = useQuery(QUERY_ALL_REVIEWS, {
  fetchPolicy: "network-only",
});
console.log(data);
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [refetch]);




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
   const formatDate = (timestamp:any) => {
  if (!timestamp) return "Invalid date";  // handle invalid date
  const date = new Date(parseInt(timestamp)); // Convert string to number if needed
  return date.toLocaleDateString();
}

   return (
    <div>
  <div className="relative flex h-[15rem] md:h-[40rem] flex-col items-center justify-start ">
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
      {err && <p className="text-red-500 text-center">{err}</p>}
    </div>
    
  </div>
  {loading ?   <div className="flex justify-center items-center h-20">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-700"></div>
  </div> : error ? <p></p> 
  :
   <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Recent Activity</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-20 gap-4 '>
      {data.getAllReviews.map((review:any) => (
        <div key={review._id} className="border border-gray-300">
          <h3 className="font-semibold">{review.username} wrote a review</h3>
          <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
          <img src={review.image} className="w-[30rem] h-[20rem] " />
          <p>{review.parkFullName}</p>
          <p className="text-yellow-500">⭐ {review.rating}/5</p>
          <p className="mt-2">{review.comment}</p>
          
        </div>
      ))}
      </div>
    </div>  }

  <Footer /> 
  </div>
);




};


export default SearchParks;
