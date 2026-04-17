import { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_REVIEW } from "../utils/mutations";
import Button from "./ui/Button";
import { Textarea } from "./ui/Input";

interface Props {
  reviewId: string;
  initialComment: string;
  initialRating: number;
  onClose: () => void;
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Rating</label>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const star = i + 1;
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="text-2xl leading-none transition-colors"
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
            >
              <span className={(hovered || value) >= star ? 'text-yellow-400' : 'text-gray-300'}>
                ★
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const EditReviewForm = ({ reviewId, initialComment, initialRating, onClose }: Props) => {
  const [comment, setComment] = useState(initialComment);
  const [rating, setRating] = useState(initialRating);
  const [updateReview, { loading }] = useMutation(UPDATE_REVIEW);

  const handleUpdate = async () => {
    try {
      await updateReview({ variables: { reviewId, comment, rating } });
      onClose();
      window.location.reload();
    } catch (err) {
      console.error("Error updating review:", err);
    }
  };

  return (
    <div className="mt-3 flex flex-col gap-4 border border-gray-200 rounded-xl p-4 bg-gray-50">
      <StarPicker value={rating} onChange={setRating} />

      <Textarea
        label="Comment"
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <div className="flex gap-3">
        <Button variant="primary" size="sm" loading={loading} onClick={handleUpdate}>
          Save Changes
        </Button>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditReviewForm;
