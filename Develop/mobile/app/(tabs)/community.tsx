import { useState } from 'react';
import {
  View, Text, FlatList, Pressable, ActivityIndicator,
} from 'react-native';
import { useQuery } from '@apollo/client/react';
import { QUERY_ALL_REVIEWS } from '../../utils/queries';
import ReviewCard from '../../components/ReviewCard';

export default function CommunityScreen() {
  const { loading, error, data } = useQuery(QUERY_ALL_REVIEWS);
  const [visibleCount, setVisibleCount] = useState(10);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500">Error loading reviews.</Text>
      </View>
    );
  }

  const reviews = (data as any)?.getAllReviews ?? [];

  return (
    <FlatList
      data={reviews.slice(0, visibleCount)}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ padding: 16 }}
      ListHeaderComponent={
        <Text className="text-2xl font-bold mb-4 text-center">Community Reviews</Text>
      }
      ListEmptyComponent={
        <Text className="text-gray-400 text-center mt-8">No reviews yet.</Text>
      }
      renderItem={({ item }) => <ReviewCard review={item} />}
      ListFooterComponent={
        visibleCount < reviews.length ? (
          <Pressable
            className="bg-blue-600 rounded-lg py-3 items-center mb-4"
            onPress={() => setVisibleCount((v) => v + 10)}
          >
            <Text className="text-white font-semibold">See More Reviews</Text>
          </Pressable>
        ) : null
      }
    />
  );
}
