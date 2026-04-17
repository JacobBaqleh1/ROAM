import { useState } from 'react';
import {
  View, Text, FlatList, Pressable, ActivityIndicator, SafeAreaView, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation } from '@apollo/client/react';
import { QUERY_USER_REVIEWS } from '../../utils/queries';
import { DELETE_REVIEW } from '../../utils/mutations';
import { useAuth } from '../../utils/useAuth';
import EditReviewForm from '../../components/EditReviewForm';
import StarRating from '../../components/StarRating';

function formatDate(timestamp: string) {
  if (!timestamp) return '';
  return new Date(parseInt(timestamp)).toLocaleDateString();
}

export default function MyReviewsScreen() {
  const { isLoggedIn, loading: authLoading, user } = useAuth();
  const { loading, error, data } = useQuery(QUERY_USER_REVIEWS, { skip: !isLoggedIn });
  const [deleteReview] = useMutation(DELETE_REVIEW, {
    refetchQueries: [{ query: QUERY_USER_REVIEWS }],
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDelete = async (reviewId: string) => {
    Alert.alert('Delete Review', 'Are you sure you want to delete this review?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteReview({ variables: { reviewId } });
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Could not delete review.');
          }
        },
      },
    ]);
  };

  if (authLoading || loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center px-6 bg-white">
        <Text className="text-2xl font-bold mb-2">Sign in to see your reviews</Text>
        <Pressable
          className="bg-blue-600 px-8 py-3 rounded-xl mt-4"
          onPress={() => router.push('/login')}
        >
          <Text className="text-white font-bold">Sign In</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error loading reviews.</Text>
      </View>
    );
  }

  const reviews = (data as any)?.getUserReviews ?? [];

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={reviews}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <View className="mb-4">
            {user && (
              <Text className="text-gray-500 text-sm">@{user.username}</Text>
            )}
            <Text className="text-2xl font-bold mt-1">My Reviews</Text>
          </View>
        }
        ListEmptyComponent={
          <Text className="text-gray-400 text-center mt-8 text-lg">No reviews yet.</Text>
        }
        renderItem={({ item }) => (
          <View className="border border-gray-200 rounded-xl p-4 mb-4 bg-white shadow-sm">
            <Text className="text-lg font-semibold text-gray-800">{item.parkFullName}</Text>
            <Text className="text-xs text-gray-400 mb-1">{formatDate(item.createdAt)}</Text>
            <StarRating rating={item.rating} readonly size={18} />
            <Text className="text-gray-700 mt-1">{item.comment}</Text>

            {editingId === item._id ? (
              <EditReviewForm
                reviewId={item._id}
                initialComment={item.comment}
                initialRating={item.rating}
                onClose={() => setEditingId(null)}
              />
            ) : (
              <View className="flex-row gap-2 mt-3">
                <Pressable
                  className="flex-1 bg-blue-500 py-2 rounded-lg items-center"
                  onPress={() => setEditingId(item._id)}
                >
                  <Text className="text-white font-semibold">Edit</Text>
                </Pressable>
                <Pressable
                  className="flex-1 bg-red-500 py-2 rounded-lg items-center"
                  onPress={() => handleDelete(item._id)}
                >
                  <Text className="text-white font-semibold">Delete</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}
