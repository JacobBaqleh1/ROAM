import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_REVIEW } from '../utils/mutations';
import { QUERY_PARK_REVIEWS, QUERY_USER_REVIEWS } from '../utils/queries';
import Button from './ui/Button';
import { Textarea, Select } from './ui/Input';

const LeaveReviewForm = ({ parkFullName, parkId, parkImage, onClose }: {
  parkFullName: string;
  parkId: string;
  parkImage: string;
  onClose: () => void;
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const [addReview, { loading, error }] = useMutation(ADD_REVIEW, {
    refetchQueries: [
      { query: QUERY_PARK_REVIEWS, variables: { parkId } },
      { query: QUERY_USER_REVIEWS },
    ],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addReview({
        variables: {
          input: { parkId, parkFullName, image: parkImage, rating, comment },
        },
      });
      onClose();
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 mt-4 bg-white shadow-card">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Leave a Review</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select
          label="Rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((num) => (
            <option key={num} value={num}>
              {'★'.repeat(num)}{'☆'.repeat(5 - num)} — {num} star{num > 1 ? 's' : ''}
            </option>
          ))}
        </Select>

        <Textarea
          label="Comment"
          rows={4}
          placeholder="Share your experience at this park…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {error && (
          <p className="text-sm text-red-500">
            Error submitting review. Make sure you are signed in.
          </p>
        )}

        <div className="flex gap-3">
          <Button type="submit" variant="primary" size="md" loading={loading}>
            Submit Review
          </Button>
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeaveReviewForm;
