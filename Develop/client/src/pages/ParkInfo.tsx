import { useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchParkById } from '../utils/API';
import { QUERY_ME, QUERY_PARK_REVIEWS } from '../utils/queries';
import { SAVE_PARK } from '../utils/mutations';
import LeaveReviewForm from '../components/LeaveReviewForm';
import Auth from '../utils/auth.js';
import StateSearchBar from '../components/StateSearchBar.js';
import { ArrowLeft, ArrowRight } from 'lucide-react'; // Optional: For nicer arrows

const ParkInfo = () => {
  const { id } = useParams();
  const [park, setPark] = useState<any>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [saveParkMutation] = useMutation(SAVE_PARK, {
    refetchQueries: [{ query: QUERY_ME }],
  });

  const { data: userData } = useQuery(QUERY_ME, {
    skip: !Auth.loggedIn(),
  });

  const { loading, error, data } = useQuery(QUERY_PARK_REVIEWS, {
    variables: { parkId: id },
  });

  useEffect(() => {
    if (!id) return;
    setPark(null);
    const getParkDetails = async () => {
      const data = await fetchParkById(id);
      setPark(data);
      setCurrentImageIndex(0); // Reset index when loading a new park
      console.log(data);
    };
    getParkDetails();
  }, [id]);

  const handleSavePark = async (park: any) => {
    try {
      await saveParkMutation({
        variables: {
          input: {
            parkId: park.id,
            fullName: park.fullName,
            description: park.description,
            states: park.states,
            images: park.images?.map((image: any) => ({
              credit: image.credit,
              title: image.title,
              altText: image.altText,
              caption: image.caption,
              url: image.url,
            })) || [],
          },
        },
      });
    } catch (err) {
      console.error('Error saving park:', err);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Invalid date";
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString();
  };

  const renderRating = (rating: number) => {
    if (!rating || rating < 1 || rating > 5) return "No rating available";
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const isParkSaved = userData?.me?.savedParks?.some(
    (savedPark: any) => savedPark.parkId === park.id
  );

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? park.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === park.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!park) return <p>Loading park details...</p>;
  if (error) console.error("GraphQL error:", error);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Search Bar */}
      <div className="flex justify-end mb-4">
        <StateSearchBar />
      </div>

      {/* Image Carousel */}
      {park.images?.length > 0 && (
        <div className="relative w-full h-[500px] mb-6">
          <img
            src={park.images[currentImageIndex].url}
            alt={park.fullName}
            className="w-full h-full object-cover rounded-xl shadow-lg"
          />
          {/* Left Arrow */}
          <button
            onClick={handlePrevImage}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md"
          >
            <ArrowLeft size={24} />
          </button>
          {/* Right Arrow */}
          <button
            onClick={handleNextImage}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md"
          >
            <ArrowRight size={24} />
          </button>
          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {park.images.length}
          </div>
        </div>
      )}

      {/* Park Info */}
      <h1 className="text-4xl font-extrabold text-gray-800">{park.fullName}</h1>
      <p className="text-lg text-gray-600 mt-2">{park.states}</p>
      <p className="mt-4 text-gray-700">{park.description}</p>

      <a
        href={park.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-4 text-blue-500 hover:text-blue-700"
      >
        Official Website
      </a>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => handleSavePark(park)}
          disabled={isParkSaved}
          className={`py-2 px-4 rounded-lg transition ${
            isParkSaved
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isParkSaved ? "Already Saved" : "Add to Travel List"}
        </button>

        {!showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Leave a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="mt-6">
          <LeaveReviewForm
            parkFullName={park.fullName}
            parkId={id ?? ''}
            parkImage={park.images?.[0]?.url || ''}
            onClose={() => setShowReviewForm(false)}
          />
        </div>
      )}

      {/* Reviews Section */}
      <h2 className="text-3xl font-semibold mt-10 mb-4">Reviews</h2>
      {loading && <p>Loading reviews...</p>}
      {error && <p className="text-red-500">Error fetching reviews: {error.message}</p>}
      {data?.getParkReviews?.length === 0 && <p>No reviews yet. Be the first to leave one!</p>}

      {/* Reviews List */}
      <div className="space-y-6 mt-4">
        {data?.getParkReviews?.map((review: any) => (
          <div
            key={review._id}
            className="border border-gray-300 rounded-xl shadow-md p-5 bg-white"
          >
            {/* Reviewer Info */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                {review.username[0].toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{review.username}</h3>
                <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
              </div>
            </div>

            {/* Review Text */}
            <p className="text-gray-800 mb-3">{review.comment || "No review content available."}</p>

            {/* Rating */}
            <p className="text-yellow-500 text-xl">{renderRating(review.rating)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkInfo;
