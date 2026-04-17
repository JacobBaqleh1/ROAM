import { useNavigate } from "react-router-dom";
import { QUERY_ALL_REVIEWS } from "../utils/queries";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import ReviewCard from "../components/ui/ReviewCard";
import SkeletonCard from "../components/ui/SkeletonCard";
import Button from "../components/ui/Button";
import type { GetAllReviewsData } from "../models/graphql";

export default function Community() {
    const navigate = useNavigate();
    const { loading, error, data } = useQuery<GetAllReviewsData>(QUERY_ALL_REVIEWS);
    const [visibleReviews, setVisibleReviews] = useState(6);

    const handleShowMoreReviews = () => {
        setVisibleReviews((prev) => prev + 6);
    };

    if (error) {
        return (
            <div className="max-w-5xl mx-auto p-8 text-center">
                <p className="text-red-500">Failed to load community reviews. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Community Reviews</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading
                    ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                    : data?.getAllReviews.slice(0, visibleReviews).map((review) => (
                        <ReviewCard
                            key={review._id}
                            review={review}
                            linkToPark
                        />
                    ))
                }
            </div>

            {!loading && data && visibleReviews < data.getAllReviews.length && (
                <div className="flex mt-8 justify-center">
                    <Button variant="primary" size="md" onClick={handleShowMoreReviews}>
                        See More Reviews
                    </Button>
                </div>
            )}
        </div>
    );
}
