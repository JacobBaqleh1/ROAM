import { useEffect, useState, } from 'react';
import AutoCarousel from '../components/SlideShow.js';
import { QUERY_ALL_REVIEWS } from '../utils/queries.js';
import { useQuery } from '@apollo/client';
import HomeSearchBar from '../components/HomeSearchBar.js';
import { useNavigate } from 'react-router-dom';

const SearchParks = () => {
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(QUERY_ALL_REVIEWS);
  const [visibleReviews, setVisibleReviews] = useState(5);

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

  const handleShowMoreReviews = () => {
    setVisibleReviews((prev) => prev + 5)
  }

  const handleReviewClick = (parkId: any) => {
    navigate(`/park/${parkId}`);
  }

  return (
    <div>
      <div className="relative flex min-h-[38rem] sm:h-[15rem] md:h-[40rem] flex-col items-center justify-start ">

        {/* Background Slideshow */}
        <div className="absolute inset-0 z-0 w-full  mx-auto  h-full overflow-hidden" >
          <AutoCarousel />
        </div>

        {/* Form Container - Centering the Form */}
        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 ">

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
          <div style={{
                    backgroundImage: `url('/topograph.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  >
          <div className="max-w-5xl mx-auto p-4 bg-white "
            
        >
            <h2 className="text-2xl font-bold mb-4 text-center">Recent Activity</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-20 gap-4 '
            >
              {data.getAllReviews.slice(0, visibleReviews).map((review: any) => (
                <div
                  key={review._id}
                  className="border border-gray-300 rounded overflow-hidden"
                  
                >
                  {/* semi-opaque panel so text stays readable over the background */}
                  <div className="bg-white/80 p-4">
                    <h3 className="font-semibold">{review.username} wrote a review</h3>
                    <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                    <img
                      onClick={() => handleReviewClick(review.parkId)}
                      src={review.image}
                      className="w-full h-48 object-cover mt-2 rounded"
                    />
                    <p className="mt-2 font-medium">{review.parkFullName}</p>
                    <p className="text-yellow-500">⭐ {review.rating}/5</p>
                    <p className="mt-2">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            {visibleReviews < data.getAllReviews.length && (
              <div className='flex mt-4 justify-center'>
                <button className='py-2 px-4 rounded-lg bg-blue-600 text-white' onClick={handleShowMoreReviews}>See More Reviews</button>
              </div>
            )}
          </div></div>}


    </div>
  );




};


export default SearchParks;
