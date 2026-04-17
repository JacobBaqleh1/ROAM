import { View, Text, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import StarRating from './StarRating';

interface Review {
  _id: string;
  parkId: string;
  parkFullName: string;
  username: string;
  comment: string;
  rating: number;
  image?: string;
  createdAt: string;
}

interface Props {
  review: Review;
}

function formatDate(timestamp: string) {
  if (!timestamp) return '';
  return new Date(parseInt(timestamp)).toLocaleDateString();
}

export default function ReviewCard({ review }: Props) {
  return (
    <Pressable
      className="border border-gray-200 rounded-xl overflow-hidden bg-white mb-4 shadow-sm"
      onPress={() => router.push(`/(tabs)/park/${review.parkId}`)}
    >
      {review.image ? (
        <Image
          source={{ uri: review.image }}
          className="w-full h-44"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-44 bg-gray-200 justify-center items-center">
          <Text className="text-gray-400">No image</Text>
        </View>
      )}
      <View className="p-3">
        <Text className="font-semibold text-gray-800" numberOfLines={1}>
          {review.parkFullName}
        </Text>
        <Text className="text-sm text-gray-500 mt-0.5">
          {review.username} · {formatDate(review.createdAt)}
        </Text>
        <StarRating rating={review.rating} readonly size={16} />
        <Text className="text-gray-700 mt-1 text-sm" numberOfLines={2}>
          {review.comment}
        </Text>
      </View>
    </Pressable>
  );
}
