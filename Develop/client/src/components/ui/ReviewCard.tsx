import { useNavigate } from 'react-router-dom';
import Button from './Button';

export interface ReviewData {
  _id: string;
  parkId: string;
  parkFullName?: string;
  username: string;
  rating: number;
  comment: string;
  image?: string;
  createdAt: string;
}

interface ReviewCardProps {
  review: ReviewData;
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
  /** When true, clicking the image navigates to the park page */
  linkToPark?: boolean;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400 text-sm tracking-tight">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < rating ? '★' : '☆'}</span>
      ))}
    </span>
  );
}

function formatDate(timestamp: string) {
  if (!timestamp) return '';
  return new Date(parseInt(timestamp)).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ReviewCard({ review, onEdit, onDelete, linkToPark = false }: ReviewCardProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-card hover:shadow-card-hover transition-shadow duration-300 flex flex-col">
      {review.image && (
        <div
          className={`overflow-hidden ${linkToPark ? 'cursor-pointer' : ''}`}
          onClick={linkToPark ? () => navigate(`/park/${review.parkId}`) : undefined}
        >
          <img
            src={review.image}
            alt={review.parkFullName ?? 'Park photo'}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-4 flex flex-col flex-grow gap-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-800 text-sm">{review.username}</span>
          <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
        </div>

        {review.parkFullName && (
          <p
            className={`text-sm font-medium text-forest-600 ${linkToPark ? 'cursor-pointer hover:underline' : ''}`}
            onClick={linkToPark ? () => navigate(`/park/${review.parkId}`) : undefined}
          >
            {review.parkFullName}
          </p>
        )}

        <StarRow rating={review.rating} />

        <p className="text-sm text-gray-600 leading-relaxed flex-grow">{review.comment}</p>

        {(onEdit || onDelete) && (
          <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(review._id)}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" size="sm" onClick={() => onDelete(review._id)}>
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
