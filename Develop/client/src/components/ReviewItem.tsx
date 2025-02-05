import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_REVIEW, DELETE_REVIEW } from '../utils/mutations';
import { QUERY_PARK_REVIEWS } from '../utils/queries';

const ReviewItem = ({ review, currentUserId, parkId }: { review: any, currentUserId: string, parkId: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState(review.comment);

  const [updateReview] = useMutation(UPDATE_REVIEW, {
    refetchQueries: [{ query: QUERY_PARK_REVIEWS, variables: { parkId } }],
  });

  const [deleteReview] = useMutation(DELETE_REVIEW, {
    refetchQueries: [{ query: QUERY_PARK_REVIEWS, variables: { parkId } }],
  });

  const handleEdit = async () => {
    if (newComment.trim() && newComment !== review.comment) {
      try {
        await updateReview({ variables: { reviewId: review._id, content: newComment } });
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating review:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview({ variables: { reviewId: review._id } });
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg shadow-lg p-4 bg-white">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div>
          <h3 className="text-lg font-semibold">{review.username}</h3>
          <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {isEditing ? (
        <div>
          <textarea
            className="border p-2 mt-2 w-full"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleEdit} className="bg-green-500 text-white px-3 py-1 mt-2">
            Save
          </button>
          <button onClick={() => setIsEditing(false)} className="bg-gray-300 px-3 py-1 mt-2">
            Cancel
          </button>
        </div>
      ) : (
        <p className="mt-3 text-gray-700">{review.comment || "No review content available."}</p>
      )}

      <p className="mt-2 text-yellow-500">
        {'⭐️'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
      </p>

      {review.userId === currentUserId && (
        <div className="mt-3 flex gap-2">
          <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-3 py-1">
            Edit
          </button>
          <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
