import { useQuery, useMutation } from "@apollo/client";
import { QUERY_USER_REVIEWS } from "../utils/queries";
import { DELETE_REVIEW} from "../utils/mutations";
import { useState } from "react";
import EditReviewForm from "../components/EditReviewForm"; // Create this component for editing reviews

const MyReviews = () => {
  const { loading, error, data } = useQuery(QUERY_USER_REVIEWS);
  const [deleteReview] = useMutation(DELETE_REVIEW);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p className="text-red-500">Error fetching reviews: {error.message}</p>;

  const handleDelete = async (reviewId: string) => {
    try {
      await deleteReview({ variables: { reviewId } });
      window.location.reload(); // Refresh reviews after deletion
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">My Reviews</h1>
      {data?.getUserReviews?.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <div className="space-y-4 mt-4">
          {data?.getUserReviews?.map((review: any) => (
            <div key={review._id} className="border p-4 rounded-lg shadow-lg bg-white">
              <p className="text-lg">{review.comment}</p>
              <p className="text-sm text-gray-500">{new Date(parseInt(review.createdAt)).toLocaleDateString()}</p>
              
              {editingReviewId === review._id ? (
                <EditReviewForm reviewId={review._id} initialComment={review.comment} onClose={() => setEditingReviewId(null)} />
              ) : (
                <>
                  <button className="mr-2 border px-4 py-1 rounded bg-blue-500 text-white" onClick={() => setEditingReviewId(review._id)}>
                    Edit
                  </button>
                  <button className="border px-4 py-1 rounded bg-red-500 text-white" onClick={() => handleDelete(review._id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
