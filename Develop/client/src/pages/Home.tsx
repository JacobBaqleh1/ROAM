import AutoCarousel from '../components/SlideShow.js';
import HomeSearchBar from '../components/HomeSearchBar.js';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
// import { useEffect, useState } from 'react';
// import { QUERY_ALL_REVIEWS } from '../utils/queries.js';
// import { useQuery } from '@apollo/client';
// import ReviewCard from '../components/ui/ReviewCard';
// import SkeletonCard from '../components/ui/SkeletonCard';
// import Button from '../components/ui/Button';
// import type { GetAllReviewsData } from '../models/graphql';

const SearchParks = () => {
  // const { loading, error, data, refetch } = useQuery<GetAllReviewsData>(QUERY_ALL_REVIEWS);
  // const [visibleReviews, setVisibleReviews] = useState(6);

  // useEffect(() => {
  //   const timer = setTimeout(() => { refetch(); }, 2000);
  //   return () => clearTimeout(timer);
  // }, [refetch]);

  // const handleShowMoreReviews = () => {
  //   setVisibleReviews((prev) => prev + 6);
  // };

  return (
    <div>
      {/* Hero section */}
      <div className="relative flex min-h-[38rem] sm:h-[15rem] md:h-[62rem] flex-col items-center justify-start">
        <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
          <AutoCarousel />
        </div>

        <div className="absolute inset-0 flex flex-col justify-start items-center z-10 px-4 pt-8 overflow-hidden">
          <div className="backdrop-blur-sm bg-black/40 rounded-2xl px-8 py-6 text-center max-w-lg w-full mb-4">
            <h1 className="text-4xl md:text-5xl font-black text-center mb-3 text-white font-display">
              Explore National Parks
            </h1>
            <p className="text-white/90 text-center text-lg mb-5">
              Discover, save, and share your favorite outdoor destinations.
            </p>
            <Link to="/map">
              <Button variant="primary" size="lg" className="w-full">Map</Button>
            </Link>
          </div>
          <HomeSearchBar />
        </div>
      </div>

      {/* Recent Activity — disabled, re-enable when ready */}
      {/* {!error && (
        <div
          style={{ backgroundImage: `url('/topograph.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="max-w-5xl mx-auto px-4 py-8 bg-white/90">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Recent Activity</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : data?.getAllReviews.slice(0, visibleReviews).map((review) => (
                    <ReviewCard
                      key={review._id}
                      review={review}
                      linkToPark
                    />
                  ))
              }
            </div>

            {!loading && data && visibleReviews < data.getAllReviews.length && (
              <div className="flex mt-8 justify-center">
                <Button variant="primary" size="md" onClick={handleShowMoreReviews}>
                  See More Reviews
                </Button>
              </div>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default SearchParks;
