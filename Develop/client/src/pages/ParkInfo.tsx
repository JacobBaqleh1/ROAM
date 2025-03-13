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
import saveSvg from "../assets/save-svgrepo-com.svg";

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

  const isParkSaved = !!(park && userData?.me?.savedParks?.some(
    (savedPark: any) => savedPark.parkId === park.id
  ));

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
      {/* Buttons */}
      <div className="flex gap-4 mt-6 justify-center">
        <button
          onClick={() => handleSavePark(park)}
          disabled={isParkSaved}
          className={`py-2 px-4 rounded-lg transition ${isParkSaved
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          <div className='flex justify-center align-middle '>
            <img src={saveSvg} alt="save icon" className='w-8 h-8' />
            <p className='content-center'>{isParkSaved ? "Saved!" : "Save Park"}</p>
          </div>
        </button>

        {!showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            <div className='flex justify-center align-middle items-center'>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z"></path></svg>
              <p className='content-center'>  Leave a Review </p>
            </div>
          </button>
        )}
      </div>
      <div className='grid grid-cols-2 mt-6'>
        <div className=' '>
          <h2 className='text-2xl underline text-center '>Description</h2>
          <p className="mt-2 text-gray-700">{park.description}</p>
        </div>
        <div className="border-2 border-gray-200" >
          <a
            href={park.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4 text-blue-500 hover:text-blue-700"
          >
            Park Website
          </a>
          <p>{park.contacts.phoneNumbers?.[0].phoneNumber}</p>
          <p>{park.contacts.emailAddresses?.[0].emailAddress}</p>
        </div>
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
