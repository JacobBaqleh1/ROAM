import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_REVIEW } from '../utils/mutations'; // Import the mutation
import { QUERY_PARK_REVIEWS, QUERY_USER_REVIEWS } from '../utils/queries'; // Ensure the UI updates after submission


const LeaveReviewForm = ({ parkId, onClose }: { parkId: string; onClose: () => void }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

   // Apollo Client mutation hook
  const [addReview, { loading, error }] = useMutation(ADD_REVIEW, {
    refetchQueries: [{ query: QUERY_PARK_REVIEWS, variables: { parkId } },
      { query: QUERY_USER_REVIEWS } 
    ], // Refresh reviews after submission
  });

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addReview({
        variables: {   
             input: { 
          parkId,
          rating,
          comment,
        }, },
      });

      console.log('Review submitted:', { parkId, rating, comment });

      // Close form after successful submission
      onClose();
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  return (
    <div className="border border-gray-300 p-4 mt-4">
      <h2 className="text-xl font-bold">Leave a Review</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <label>
          Rating:
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{num} Stars</option>
            ))}
          </select>
        </label>
        <label>
          Comment:
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="border p-1 w-full" />
        </label>
        {error && <p className="text-red-500">Error submitting review. Try again.</p>}
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default LeaveReviewForm;
