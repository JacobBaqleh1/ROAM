import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchParkById } from '../utils/API';
import { QUERY_PARK_REVIEWS } from '../utils/queries';
import LeaveReviewForm from '../components/LeaveReviewForm';
// import ReviewItem from '../components/ReviewItem';
// import  {useAuth} from '../utils/useAuth'

const ParkInfo = () => {
  const { id } = useParams();
  const [park, setPark] = useState<any>(null);
const [showReviewForm, setShowReviewForm] = useState(false);
// const { user } = useAuth();  // Access the logged-in user
  useEffect(() => {
 console.log("Current park ID:", id);
    if (!id) return;
setPark(null);
 console.log("Current park ID:", id);
    const getParkDetails = async () => {
      const data = await fetchParkById(id);
      console.log("Fetched park data:", data);
      setPark(data);
    };

    getParkDetails();
  }, [id]);

   const { loading, error, data } = useQuery(QUERY_PARK_REVIEWS, {
    variables: { parkId: id },
  });
if (error) {
  console.error("GraphQL error:", error);
}
  if (!park) return <p>Loading park details...</p>;

  const formatDate = (timestamp:any) => {
  if (!timestamp) return "Invalid date";  // handle invalid date
  const date = new Date(parseInt(timestamp)); // Convert string to number if needed
  return date.toLocaleDateString();
}
const renderRating = (rating: number) => {
  if (!rating || rating < 1 || rating > 5) return "No rating available";

  const stars = "★".repeat(rating) + "☆".repeat(5 - rating); // Fill with stars up to 5
  return <span className="text-yellow-500">{stars}</span>;
};

  return (
 <div className="container mx-auto p-6">
  <h1 className="text-4xl font-extrabold text-gray-800 mb-4">{park.fullName}</h1>
  <p className="text-lg text-gray-700 mb-6">{park.description}</p>

  {park.images?.length > 0 && (
    <img className="w-full h-auto rounded-lg shadow-lg mb-6" src={park.images[0].url} alt={park.fullName} />
  )}

  <a href={park.url} target="_blank" className="text-blue-500 hover:text-blue-700 font-semibold mb-4 inline-block">
    Official Website
  </a>

  {/* Buttons Wrapper */}
  <div className="flex gap-4 mb-6 flex-wrap">
    {/* Add to Travel List Button */}
    <button className="w-full sm:w-auto bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300">
      ADD TO TRAVEL LIST
    </button>

    {/* Leave a Review Button */}
    {!showReviewForm ? (
      <button
        className="w-full sm:w-auto border border-gray-300 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-100 transition duration-300"
        onClick={() => setShowReviewForm(true)}
      >
        Leave a REVIEW
      </button>
    ) : null}
  </div>

  {/* Leave Review Form */}
  {showReviewForm && (
    <div className="w-full sm:w-auto mt-4">
      <LeaveReviewForm parkId={id ?? ''} onClose={() => setShowReviewForm(false)} />
    </div>
  )}

  {/* Display Reviews */}
  <h2 className="text-2xl font-semibold mt-6">Reviews</h2>
  {loading && <p>Loading reviews...</p>}
  {error && <p className="text-red-500">Error fetching reviews: {error.message}</p>}
  {data?.getParkReviews?.length === 0 && <p>No reviews yet.</p>}

  <div className="space-y-4 mt-4">
    {data?.getParkReviews?.map((review: any) => (
      <div key={review._id} className="border border-gray-300 rounded-lg shadow-lg p-4 bg-white">
        {/* Review Item Components (if needed) */}

        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div>
            <h3 className="text-lg font-semibold">{review.username}</h3>
            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>

        {/* Review Text */}
        <p className="mt-3 text-gray-700">{review.comment || "No review content available."}</p>

        {/* Display Rating */}
        <p className="mt-2 text-yellow-500">{renderRating(review.rating)}</p>
      </div>
    ))}
  </div>





  {/* Display Reviews */}
<h2 className="text-2xl font-semibold mt-6">Reviews</h2>
{loading && <p>Loading reviews...</p>}
{error && <p className="text-red-500">Error fetching reviews: {error.message}</p>}
{data?.getParkReviews?.length === 0 && <p>No reviews yet.</p>}

<div className="space-y-4 mt-4">
  {data?.getParkReviews?.map((review: any) => {
    return (  // Explicitly returning the JSX
      <div key={review._id} className="border border-gray-300 rounded-lg shadow-lg p-4 bg-white">
        {/* ReviewItem Component */}
        {/* <ReviewItem 
          review={review} 
          currentUserId={user?.id ?? ''} 
          parkId={id ?? ''} 
        /> */}

        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div>
            <h3 className="text-lg font-semibold">{review.username}</h3>
            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>

        {/* Review Text */}
        <p className="mt-3 text-gray-700">{review.comment || "No review content available."}</p>

        {/* Display Rating */}
        <p className="mt-2 text-yellow-500">{renderRating(review.rating)}</p>

   
      </div>
    );
  })}
</div>
       
    </div>
  );
};

export default ParkInfo;
