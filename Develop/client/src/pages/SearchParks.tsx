import { useEffect, } from 'react';
import AutoCarousel from '../components/SlideShow';
import { QUERY_ALL_REVIEWS } from '../utils/queries.js';
import { useQuery } from '@apollo/client';
import HomeSearchBar from '../components/HomeSearchBar.js';

const SearchParks = () => {

  const { loading, error, data, refetch } = useQuery(QUERY_ALL_REVIEWS);

  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, 2000);

    return () => clearTimeout(timer);
  }, [refetch]);






  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Invalid date";  // handle invalid date
    const date = new Date(parseInt(timestamp)); // Convert string to number if needed
    return date.toLocaleDateString();
  }

  return (
    <div>
      <div className="relative flex min-h-[38rem] sm:h-[15rem] md:h-[40rem] flex-col items-center justify-start ">

        {/* Background Slideshow */}
        <div className="absolute inset-0 -z-10 w-full  mx-auto  h-full overflow-hidden" >
          <AutoCarousel />
        </div>

        {/* Form Container - Centering the Form */}
        <div className="absolute inset-0 flex flex-col justify-center items-center ">

          <h1 className="text-3xl font-black text-center mb-4 text-white ">
            Exlpore National Parks
          </h1>
          <div>
            <HomeSearchBar />
          </div>


        </div>

      </div>
      {loading ? <div className="flex justify-center items-center h-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-700"></div>
      </div>
        :
        error ? <div></div>
          :
          <div className="max-w-5xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Recent Activity</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-20 gap-4 '>
              {data.getAllReviews.map((review: any) => (
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
          </div>}


    </div>
  );




};


export default SearchParks;
