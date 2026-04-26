import { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path, Rect } from 'react-native-svg';
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

function ImagePlaceholder() {
  return (
    <View className="w-full h-44 bg-[#EEF2EE] justify-center items-center">
      <Svg width="100%" height="100%" viewBox="0 0 400 176" preserveAspectRatio="xMidYMid slice">
        <Rect width="400" height="176" fill="#EEF2EE" />
        {/* Sky */}
        <Path d="M0 0 H400 V176 H0 Z" fill="#EEF2EE" />
        {/* Back range */}
        <Path d="M0,176 L80,90 L140,130 L220,60 L300,110 L370,75 L400,100 L400,176 Z" fill="#C8D8C8" />
        {/* Front range */}
        <Path d="M0,176 L60,130 L110,155 L180,105 L240,140 L310,95 L360,125 L400,110 L400,176 Z" fill="#B0C4B0" />
      </Svg>
    </View>
  );
}

export default function ReviewCard({ review }: Props) {
  const [imgError, setImgError] = useState(false);

  return (
    <Pressable
      className="border border-gray-200 rounded-xl overflow-hidden bg-white mb-4 shadow-sm"
      onPress={() => router.push(`/(tabs)/park/${review.parkId}`)}
    >
      {review.image && !imgError ? (
        <Image
          source={{ uri: review.image }}
          className="w-full h-44"
          resizeMode="cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <ImagePlaceholder />
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
