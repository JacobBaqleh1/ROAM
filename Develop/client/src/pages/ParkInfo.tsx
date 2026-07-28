import { useMutation, useQuery } from '@apollo/client';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { fetchParkById } from '../utils/API';
import FadeImage from '../components/ui/FadeImage';
import Button from '../components/ui/Button';
import { QUERY_ME, QUERY_PARK_REVIEWS } from '../utils/queries';
import { SAVE_PARK } from '../utils/mutations';
import LeaveReviewForm from '../components/LeaveReviewForm';
import Auth from '../utils/auth.js';
import type { GetParkReviewsData } from '../models/graphql';

import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  MapPin,
  Globe,
  Phone,
  Mail,
  Bookmark,
  BookmarkCheck,
  Star,
  PenLine,
  RotateCw,
  MountainSnow,
} from 'lucide-react';

const formatDate = (timestamp: string) => {
  if (!timestamp) return '';
  return new Date(parseInt(timestamp)).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  const filled = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
        />
      ))}
    </span>
  );
}

const ParkInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [park, setPark] = useState<any>(null);
  const [parkFailed, setParkFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [signInPrompt, setSignInPrompt] = useState<'save' | 'review' | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);
  const reviewFormRef = useRef<HTMLDivElement>(null);

  const [saveParkMutation] = useMutation(SAVE_PARK, {
    refetchQueries: [{ query: QUERY_ME }],
  });

  const { data: userData } = useQuery(QUERY_ME, {
    skip: !Auth.loggedIn(),
  });

  const {
    loading: reviewsLoading,
    error: reviewsError,
    data: reviewsData,
    refetch: refetchReviews,
  } = useQuery<GetParkReviewsData>(QUERY_PARK_REVIEWS, {
    variables: { parkId: id },
    skip: !id,
    notifyOnNetworkStatusChange: true,
  });

  const reviews = reviewsData?.getParkReviews ?? [];
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    setPark(null);
    setParkFailed(false);

    const getParkDetails = async () => {
      try {
        const data = await fetchParkById(id);
        if (cancelled) return;
        if (!data) {
          setParkFailed(true);
          return;
        }
        setPark(data);
        setCurrentImageIndex(0);
      } catch {
        if (!cancelled) setParkFailed(true);
      }
    };
    getParkDetails();

    return () => {
      cancelled = true;
    };
  }, [id, reloadKey]);

  const requireAuth = (target: 'save' | 'review', action: () => void) => {
    if (!Auth.loggedIn()) {
      setSignInPrompt(target);
      setTimeout(() => setSignInPrompt(null), 4000);
      return;
    }
    action();
  };

  const handleScrollToReviewForm = () => {
    setShowReviewForm(true);
    setTimeout(() => {
      reviewFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const handleSavePark = async (park: any) => {
    setSaveFailed(false);
    try {
      await saveParkMutation({
        variables: {
          input: {
            parkId: park.id,
            fullName: park.fullName,
            description: park.description,
            states: park.states,
            images: park.images?.map((image: any) => ({
              credit: image.credit,
              title: image.title,
              altText: image.altText,
              caption: image.caption,
              url: image.url,
            })) || [],
          },
        },
      });
    } catch {
      setSaveFailed(true);
    }
  };

  const isParkSaved = !!(park && userData?.me?.savedParks?.some(
    (savedPark: any) => savedPark.parkId === park.id
  ));

  const images: any[] = park?.images ?? [];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (parkFailed) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-forest-50 flex items-center justify-center">
          <MountainSnow className="text-forest-500" size={28} />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-gray-800">We couldn’t load this park</h1>
        <p className="mt-2 text-gray-500">
          The park directory didn’t respond. Check your connection and try again.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Button variant="primary" size="md" onClick={() => setReloadKey((k) => k + 1)}>
            <RotateCw size={16} /> Try again
          </Button>
          <Button variant="outline" size="md" onClick={() => navigate('/')}>
            Back to search
          </Button>
        </div>
      </div>
    );
  }

  if (!park) {
    return (
      <div className="animate-pulse">
        <div className="w-full h-[45vh] min-h-[320px] bg-gray-200" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid gap-8 lg:grid-cols-[1fr_320px] items-start">
          <div className="space-y-4 lg:order-1">
            <div className="h-7 bg-gray-200 rounded w-40" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-3/5" />
            </div>
            <div className="h-40 bg-gray-100 rounded-xl" />
            <div className="h-40 bg-gray-100 rounded-xl" />
          </div>
          <div className="order-first lg:order-2 space-y-3">
            <div className="h-11 bg-gray-200 rounded-xl" />
            <div className="h-11 bg-gray-200 rounded-xl" />
            <div className="h-44 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative w-full h-[55vh] min-h-[340px] max-h-[560px] bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <FadeImage
            key={currentImageIndex}
            src={images[currentImageIndex]?.url ?? ''}
            alt={images[currentImageIndex]?.altText ?? park.fullName}
            className="w-full h-full"
            fallbackLabel={park.fullName}
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40 pointer-events-none" />

        <Link
          to="/"
          className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white text-sm backdrop-blur-sm transition"
        >
          <ArrowLeft size={16} /> Back
        </Link>

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              aria-label="Previous photo"
              className="absolute top-1/2 left-3 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/35 hover:bg-black/60 text-white backdrop-blur-sm transition"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={handleNextImage}
              aria-label="Next photo"
              className="absolute top-1/2 right-3 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/35 hover:bg-black/60 text-white backdrop-blur-sm transition"
            >
              <ChevronRight size={22} />
            </button>
            <div className="absolute top-4 right-4 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  aria-label={`Photo ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
          <div className="max-w-6xl mx-auto">
            {park.designation && (
              <span className="inline-block text-xs font-semibold uppercase tracking-wide bg-forest-500 text-white px-2.5 py-1 rounded-full">
                {park.designation}
              </span>
            )}
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white text-shadow leading-tight">
              {park.fullName}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-white/90 text-sm">
              {park.states && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={15} />
                  {park.states.split(',').join(' · ')}
                </span>
              )}
              {reviews.length > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <StarRow rating={averageRating} />
                  <span className="font-semibold">{averageRating.toFixed(1)}</span>
                  <span className="text-white/70">
                    ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ──────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid gap-8 lg:grid-cols-[1fr_320px] items-start">

        {/* Main column */}
        <div className="space-y-8 lg:order-1 min-w-0">
          <section>
            <h2 className="text-xl font-bold text-gray-800">About this park</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">{park.description}</p>
          </section>

          {park.activities?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-800">Things to do</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {park.activities.map((activity: any) => (
                  <span
                    key={activity.id}
                    className="text-sm bg-sage-100 text-forest-600 px-3 py-1 rounded-full"
                  >
                    {activity.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                Reviews
                {reviews.length > 0 && (
                  <span className="ml-2 text-base font-normal text-gray-400">{reviews.length}</span>
                )}
              </h2>
              {reviews.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <StarRow rating={averageRating} />
                  <span className="font-semibold text-gray-700">{averageRating.toFixed(1)}</span>
                  out of 5
                </div>
              )}
            </div>

            {showReviewForm && (
              <div ref={reviewFormRef} className="scroll-mt-6">
                <LeaveReviewForm
                  parkFullName={park.fullName}
                  parkId={id ?? ''}
                  parkImage={images[0]?.url || ''}
                  onClose={() => setShowReviewForm(false)}
                />
              </div>
            )}

            {reviewsLoading && (
              <div className="mt-4 space-y-4 animate-pulse">
                {[1, 2].map((i) => (
                  <div key={i} className="rounded-xl border border-gray-200 p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                      <div className="space-y-2">
                        <div className="h-3.5 w-28 bg-gray-200 rounded" />
                        <div className="h-3 w-20 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <div className="h-3.5 bg-gray-200 rounded w-full" />
                    <div className="h-3.5 bg-gray-200 rounded w-4/6" />
                  </div>
                ))}
              </div>
            )}

            {!reviewsLoading && reviewsError && (
              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
                <p className="text-gray-700 font-medium">Reviews aren’t available right now</p>
                <p className="mt-1 text-sm text-gray-500">
                  Everything else about {park.fullName} is still here.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => refetchReviews().catch(() => {})}
                >
                  <RotateCw size={14} /> Try again
                </Button>
              </div>
            )}

            {!reviewsLoading && !reviewsError && reviews.length === 0 && (
              <div className="mt-4 rounded-xl border border-dashed border-gray-300 p-8 text-center">
                <p className="text-gray-700 font-medium">No reviews yet</p>
                <p className="mt-1 text-sm text-gray-500">
                  Be the first to share what this park is like.
                </p>
              </div>
            )}

            <div className="mt-4 space-y-4">
              {reviews.map((review) => (
                <article
                  key={review._id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-card"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-forest-50 text-forest-600 font-semibold flex items-center justify-center flex-shrink-0">
                      {review.username?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{review.username}</p>
                      <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                    </div>
                    <div className="ml-auto">
                      <StarRow rating={review.rating} />
                    </div>
                  </div>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    {review.comment || 'No review content available.'}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="order-first lg:order-2 lg:sticky lg:top-6 space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-card space-y-3">
            <Button
              variant={isParkSaved ? 'outline' : 'primary'}
              size="lg"
              className="w-full"
              disabled={isParkSaved}
              onClick={() => requireAuth('save', () => handleSavePark(park))}
            >
              {isParkSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              {isParkSaved ? 'Saved to your list' : 'Save park'}
            </Button>

            {!showReviewForm && (
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => requireAuth('review', handleScrollToReviewForm)}
              >
                <PenLine size={18} /> Leave a review
              </Button>
            )}

            {signInPrompt && (
              <p className="text-sm text-center text-gray-600">
                <Link to="/login" className="text-forest-500 font-semibold hover:underline">
                  Sign in
                </Link>{' '}
                {signInPrompt === 'save' ? 'to save parks to your profile.' : 'to leave a review.'}
              </p>
            )}

            {saveFailed && (
              <p className="text-sm text-center text-gray-600">
                Couldn’t save right now — please try again in a moment.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-card">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">Contact</h2>
            <div className="mt-3 space-y-3 text-sm">
              {park.url && (
                <a
                  href={park.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-forest-600 hover:underline"
                >
                  <Globe size={16} className="flex-shrink-0" />
                  Official park website
                </a>
              )}
              {park.contacts?.phoneNumbers?.[0]?.phoneNumber && (
                <p className="flex items-center gap-2.5 text-gray-600">
                  <Phone size={16} className="flex-shrink-0 text-gray-400" />
                  {park.contacts.phoneNumbers[0].phoneNumber}
                </p>
              )}
              {park.contacts?.emailAddresses?.[0]?.emailAddress && (
                <p className="flex items-center gap-2.5 text-gray-600 break-all">
                  <Mail size={16} className="flex-shrink-0 text-gray-400" />
                  {park.contacts.emailAddresses[0].emailAddress}
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ParkInfo;
