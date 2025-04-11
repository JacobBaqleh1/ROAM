import { useNavigate } from "react-router-dom";
import { QUERY_ALL_REVIEWS } from "../utils/queries";
import { useQuery } from "@apollo/client";
import { useState } from "react";

export default function Community() {
    const navigate = useNavigate();
    const { loading, error, data, } = useQuery(QUERY_ALL_REVIEWS);
    const [visibleReviews, setVisibleReviews] = useState(5);

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "Invalid date";  // handle invalid date
        const date = new Date(parseInt(timestamp)); // Convert string to number if needed
        return date.toLocaleDateString();
    }

    const handleShowMoreReviews = () => {
        setVisibleReviews((prev) => prev + 5)
    }

    const handleReviewClick = (parkId: any) => {
        navigate(`/park/${parkId}`);
    }
    return (
        <div className="max-w-5xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Community Reviews</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-20 gap-4 '>
                {data.getAllReviews.slice(0, visibleReviews).map((review: any) => (
                    <div key={review._id} className="border border-gray-300">
                        <h3 className="font-semibold">{review.username} wrote a review</h3>
                        <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                        <img onClick={() => handleReviewClick(review.parkId)} src={review.image} className="w-[30rem] h-[20rem] " />
                        <p>{review.parkFullName}</p>
                        <p className="text-yellow-500">⭐ {review.rating}/5</p>
                        <p className="mt-2">{review.comment}</p>

                    </div>
                ))}
            </div>
            {visibleReviews < data.getAllReviews.length && (
                <div className='flex mt-4 justify-center'>
                    <button className='py-2 px-4 rounded-lg bg-blue-600 text-white' onClick={handleShowMoreReviews}>See More Reviews</button>
                </div>
            )}
        </div>
    )
}