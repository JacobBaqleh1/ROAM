import { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_REVIEW } from "../utils/mutations";

const EditReviewForm = ({ reviewId, initialComment, initialRating, onClose }: { reviewId: string; initialComment: string;initialRating: number; onClose: () => void }) => {
  const [comment, setComment] = useState(initialComment);
  const [rating, setRating] = useState(initialRating);
  const [updateReview] = useMutation(UPDATE_REVIEW);

  const handleUpdate = async () => {
    try {
      await updateReview({ variables: { reviewId, comment, rating } });
      onClose(); // Close the form after updating
      window.location.reload(); // Refresh reviews after editing
    } catch (err) {
      console.error("Error updating review:", err);
    }
  };

  return (
    <div className="mt-2">
      <textarea
        className="w-full p-2 border rounded"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <input
        type="number"
        className="w-full p-2 border rounded mt-2"
        value={rating}
        min="1"
        max="5"
        onChange={(e) => setRating(parseInt(e.target.value))}
      />
      <button className="mr-2 border px-4 py-1 rounded bg-green-500 text-white" onClick={handleUpdate}>
        Save
      </button>
      <button className="border px-4 py-1 rounded bg-gray-500 text-white" onClick={onClose}>
        Cancel
      </button>
    </div>
  );
};

export default EditReviewForm;
