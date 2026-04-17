import { useEffect, useState } from 'react';
import AutoCarousel from '../components/SlideShow.js';
import { QUERY_ALL_REVIEWS } from '../utils/queries.js';
import { useQuery } from '@apollo/client';
import HomeSearchBar from '../components/HomeSearchBar.js';
import ReviewCard from '../components/ui/ReviewCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import Button from '../components/ui/Button';
import type { GetAllReviewsData } from '../models/graphql';

const SearchParks = () => {
  const { loading, error, data, refetch } = useQuery<GetAllReviewsData>(QUERY_ALL_REVIEWS);
  const [visibleReviews, setVisibleReviews] = useState(6);

  useEffect(() => {
    const timer = setTimeout(() => { refetch(); }, 2000);
    return () => clearTimeout(timer);
  }, [refetch]);

  const handleShowMoreReviews = () => {
    setVisibleReviews((prev) => prev + 6);
  };

  return (
    <div>
      {/* Hero section */}
      <div className="relative flex min-h-[38rem] sm:h-[15rem] md:h-[40rem] flex-col items-center justify-start">
        <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
          <AutoCarousel />
        </div>

        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-black text-center mb-4 text-white text-shadow font-display">
            Explore National Parks
          </h1>
          <p className="text-white text-shadow text-center text-lg mb-6 max-w-md">
            Discover, save, and share your favorite outdoor destinations.
          </p>
          <HomeSearchBar />
        </div>
      </div>

      {/* Recent Activity */}
      {!error && (
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
      )}
    </div>
  );
};

export default SearchParks;
