import { useQuery, useMutation } from "@apollo/client";
import { QUERY_USER_REVIEWS } from "../utils/queries";
import { DELETE_REVIEW } from "../utils/mutations";
import { useState } from "react";
import EditReviewForm from "../components/EditReviewForm";
import ReviewCard from "../components/ui/ReviewCard";
import SkeletonCard from "../components/ui/SkeletonCard";
import type { GetUserReviewsData } from "../models/graphql";

const MyReviews = () => {
  const { loading, error, data } = useQuery<GetUserReviewsData>(QUERY_USER_REVIEWS);
  const [deleteReview] = useMutation(DELETE_REVIEW, {
    refetchQueries: [{ query: QUERY_USER_REVIEWS }],
  });
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const handleDelete = async (reviewId: string) => {
    try {
      await deleteReview({ variables: { reviewId } });
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Reviews</h1>

      {error && (
        <p className="text-red-500">Error fetching reviews: {error.message}</p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : data?.getUserReviews?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-xl mb-2">No reviews yet.</p>
          <p className="text-sm">Visit a park and share your experience!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {data?.getUserReviews?.map((review) => (
            <div key={review._id}>
              {editingReviewId === review._id ? (
                <div className="rounded-xl border border-gray-200 bg-white shadow-card p-4">
                  <p className="font-semibold text-gray-800 mb-1">{review.parkFullName}</p>
                  <EditReviewForm
                    reviewId={review._id}
                    initialComment={review.comment}
                    initialRating={review.rating}
                    onClose={() => setEditingReviewId(null)}
                  />
                </div>
              ) : (
                <ReviewCard
                  review={review}
                  linkToPark
                  onEdit={(id) => setEditingReviewId(id)}
                  onDelete={handleDelete}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
