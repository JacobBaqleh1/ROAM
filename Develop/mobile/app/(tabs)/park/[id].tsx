import { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable, Linking, Alert, ActivityIndicator, Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery } from '@apollo/client/react';
import { fetchParkById } from '../../../utils/API';
import { QUERY_ME, QUERY_PARK_REVIEWS } from '../../../utils/queries';
import { useSearch } from '../../../context/SearchContext';
import { SAVE_PARK } from '../../../utils/mutations';
import { useAuth } from '../../../utils/useAuth';
import ImageCarousel from '../../../components/ImageCarousel';
import LeaveReviewForm from '../../../components/LeaveReviewForm';
import StarRating from '../../../components/StarRating';

function formatDate(timestamp: string) {
  if (!timestamp) return '';
  return new Date(parseInt(timestamp)).toLocaleDateString();
}

function stripHtml(html: string): string {
  return html
    .replace(/<\/?(h[1-6]|p|li|ul|ol|br|div|section)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#\d+;/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export default function ParkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { getParkById } = useSearch();
  const [park, setPark] = useState<any>(null);
  const [loadingPark, setLoadingPark] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [nudgeContext, setNudgeContext] = useState<'save' | 'review' | null>(null);
  const nudgeOpacity = useRef(new Animated.Value(0)).current;
  const nudgeOffset = useRef(new Animated.Value(-8)).current;
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNudge = useCallback((context: 'save' | 'review') => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    setNudgeContext(context);
    Animated.parallel([
      Animated.spring(nudgeOpacity, { toValue: 1, useNativeDriver: true }),
      Animated.spring(nudgeOffset, { toValue: 0, useNativeDriver: true }),
    ]).start();
    dismissTimer.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(nudgeOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(nudgeOffset, { toValue: -8, duration: 300, useNativeDriver: true }),
      ]).start();
    }, 3000);
  }, []);

  const [saveParkMutation] = useMutation(SAVE_PARK, {
    refetchQueries: [{ query: QUERY_ME }],
  });

  const { data: userData } = useQuery(QUERY_ME, { skip: !isLoggedIn });

  const { loading: reviewsLoading, data: reviewsData } = useQuery(QUERY_PARK_REVIEWS, {
    variables: { parkId: id },
  });

  useEffect(() => {
    if (!id) return;
    // Check context cache first (covers RIDB parks that NPS API can't fetch)
    const cached = getParkById(id);
    if (cached) {
      setPark(cached);
      setLoadingPark(false);
      return;
    }
    setLoadingPark(true);
    fetchParkById(id).then((data) => {
      setPark(data);
      setLoadingPark(false);
    });
  }, [id]);

  const isParkSaved = !!(park && (userData as any)?.me?.savedParks?.some(
    (s: any) => s.parkId === park.id
  ));

  const handleSave = async () => {
    if (!isLoggedIn) {
      showNudge('save');
      return;
    }
    try {
      await saveParkMutation({
        variables: {
          input: {
            parkId: park.id,
            fullName: park.fullName,
            description: park.description,
            states: park.states,
            images: park.images?.map((img: any) => ({
              credit: img.credit,
              title: img.title,
              altText: img.altText,
              caption: img.caption,
              url: img.url,
            })) || [],
          },
        },
      });
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not save park.');
    }
  };

  if (loadingPark) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-gray-500 mt-3">Loading park details...</Text>
      </View>
    );
  }

  if (!park) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Park not found.</Text>
      </View>
    );
  }

  const reviews = (reviewsData as any)?.getParkReviews ?? [];

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Image carousel */}
      {park.images?.length > 0 && (
        <ImageCarousel images={park.images} height={280} />
      )}

      <View className="px-4 pt-4">
        {/* Park name + state */}
        <Text className="text-3xl font-extrabold text-gray-800">{park.fullName}</Text>
        <View className="flex-row items-center gap-2 mt-1 flex-wrap">
          {park.states ? <Text className="text-base text-gray-500">{park.states}</Text> : null}
          {park.facilityType ? (
            <View className="bg-green-100 px-2 py-0.5 rounded-full">
              <Text className="text-green-700 text-xs font-medium">{park.facilityType}</Text>
            </View>
          ) : null}
        </View>

        <View className="h-px bg-gray-200 my-4" />

        {/* Save button */}
        <Pressable
          onPress={handleSave}
          disabled={isParkSaved}
          className={`py-3 rounded-xl items-center ${isParkSaved ? 'bg-gray-300' : 'bg-blue-600'}`}
        >
          <Text className="text-white font-bold text-base">
            {isParkSaved ? 'Saved' : 'Save Park'}
          </Text>
        </Pressable>

        {/* Save nudge banner */}
        {nudgeContext === 'save' && (
          <Animated.View
            style={{ opacity: nudgeOpacity, transform: [{ translateY: nudgeOffset }] }}
            className="mt-2 mb-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
          >
            <View className="flex-row items-center gap-2 mb-3">
<View>
                <Text className="text-amber-800 font-semibold text-sm">Sign in to save parks</Text>
                <Text className="text-amber-600 text-xs">Create an account to build your park list.</Text>
              </View>
            </View>
            <Pressable onPress={() => router.push('/login')} className="bg-amber-500 rounded-lg py-2 items-center">
              <Text className="text-white font-bold text-sm">Sign In / Sign Up</Text>
            </Pressable>
          </Animated.View>
        )}

        {/* Description */}
        <Text className="text-xl font-semibold text-center underline mb-2">Description</Text>
        <Text className="text-gray-700 leading-6">{stripHtml(park.description ?? '')}</Text>

        {/* Activities (RIDB) */}
        {park.activities?.length > 0 && (
          <>
            <View className="h-px bg-gray-200 my-4" />
            <Text className="text-xl font-semibold text-center underline mb-3">Activities</Text>
            <View className="flex-row flex-wrap gap-2">
              {park.activities.map((a: string) => (
                <View key={a} className="bg-gray-100 px-3 py-1 rounded-full">
                  <Text className="text-gray-700 text-sm">{a}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View className="h-px bg-gray-200 my-4" />

        {/* Contact */}
        <View className="bg-white shadow-sm rounded-xl p-4 border border-gray-100">
          <Text className="text-xl font-semibold text-center underline mb-3">Contact</Text>

          {/* Website — NPS uses park.url, RIDB uses park.url as reservation link */}
          {park.url ? (
            <Pressable className="mb-2" onPress={() => Linking.openURL(park.url)}>
              <Text className="text-blue-600">
                {park.source === 'ridb' ? 'Reserve / Book' : 'Official Park Website'}
              </Text>
            </Pressable>
          ) : null}

          {/* Phone — NPS */}
          {park.contacts?.phoneNumbers?.[0]?.phoneNumber && (
            <Text className="text-gray-700 mb-1">{park.contacts.phoneNumbers[0].phoneNumber}</Text>
          )}
          {/* Phone — RIDB */}
          {park.phone ? (
            <Text className="text-gray-700 mb-1">{park.phone}</Text>
          ) : null}

          {/* Email — NPS */}
          {park.contacts?.emailAddresses?.[0]?.emailAddress && (
            <Text className="text-gray-700">{park.contacts.emailAddresses[0].emailAddress}</Text>
          )}
          {/* Email — RIDB */}
          {park.email ? (
            <Text className="text-gray-700">{park.email}</Text>
          ) : null}

          {/* Address — RIDB */}
          {park.address ? (
            <Text className="text-gray-500 text-sm mt-2">{park.address}</Text>
          ) : null}
        </View>

        <View className="h-px bg-gray-200 my-4" />

        {/* Reviews header */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-semibold text-gray-800">Reviews</Text>
          {!showReviewForm && (
            <Pressable
              className="flex-row items-center border border-gray-300 px-3 py-2 rounded-lg"
              onPress={() => isLoggedIn ? setShowReviewForm(true) : showNudge('review')}
            >
              <Text className="text-sm text-gray-700">★ Leave a Review</Text>
            </Pressable>
          )}
        </View>

        {/* Review nudge banner */}
        {nudgeContext === 'review' && (
          <Animated.View
            style={{ opacity: nudgeOpacity, transform: [{ translateY: nudgeOffset }] }}
            className="mb-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
          >
            <View className="flex-row items-center gap-2 mb-3">
<View>
                <Text className="text-amber-800 font-semibold text-sm">Sign in to leave a review</Text>
                <Text className="text-amber-600 text-xs">Share your experience with the community.</Text>
              </View>
            </View>
            <Pressable onPress={() => router.push('/login')} className="bg-amber-500 rounded-lg py-2 items-center">
              <Text className="text-white font-bold text-sm">Sign In / Sign Up</Text>
            </Pressable>
          </Animated.View>
        )}

        {/* Review form */}
        {showReviewForm && (
          <LeaveReviewForm
            parkFullName={park.fullName}
            parkId={id ?? ''}
            parkImage={park.images?.[0]?.url || ''}
            onClose={() => setShowReviewForm(false)}
          />
        )}

        {/* Reviews list */}
        {reviewsLoading && <ActivityIndicator color="#2563EB" />}
        {reviews.length === 0 && !reviewsLoading && (
          <Text className="text-gray-400 my-4">No reviews yet. Be the first!</Text>
        )}
        {reviews.map((review: any) => (
          <View key={review._id} className="border border-gray-200 rounded-xl p-4 mb-4">
            <View className="flex-row items-center gap-3 mb-2">
              <View className="w-10 h-10 rounded-full bg-gray-200 justify-center items-center">
                <Text className="text-gray-600 font-bold">
                  {review.username?.[0]?.toUpperCase()}
                </Text>
              </View>
              <View>
                <Text className="font-semibold text-gray-800">{review.username}</Text>
                <Text className="text-xs text-gray-400">{formatDate(review.createdAt)}</Text>
              </View>
            </View>
            <Text className="text-gray-700 mb-2">{review.comment}</Text>
            <StarRating rating={review.rating} readonly size={18} />
          </View>
        ))}

        <View className="h-8" />
      </View>
    </ScrollView>
  );
}
