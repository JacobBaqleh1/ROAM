import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useMutation } from '@apollo/client/react';
import { ADD_REVIEW } from '../utils/mutations';
import { QUERY_PARK_REVIEWS, QUERY_USER_REVIEWS } from '../utils/queries';
import StarRating from './StarRating';

interface Props {
  parkFullName: string;
  parkId: string;
  parkImage: string;
  onClose: () => void;
}

export default function LeaveReviewForm({ parkFullName, parkId, parkImage, onClose }: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const [addReview, { loading }] = useMutation(ADD_REVIEW, {
    refetchQueries: [
      { query: QUERY_PARK_REVIEWS, variables: { parkId } },
      { query: QUERY_USER_REVIEWS },
    ],
  });

  const handleSubmit = async () => {
    try {
      await addReview({
        variables: {
          input: { parkId, parkFullName, image: parkImage, rating, comment },
        },
      });
      onClose();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Make sure you are signed in.');
    }
  };

  return (
    <View className="border border-gray-300 rounded-xl p-4 bg-white mt-4">
      <Text className="text-lg font-bold mb-3">Leave a Review</Text>
      <Text className="text-sm text-gray-600 mb-1">Rating</Text>
      <StarRating rating={rating} onRate={setRating} />
      <Text className="text-sm text-gray-600 mt-3 mb-1">Comment</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-2 text-base min-h-[80px]"
        value={comment}
        onChangeText={setComment}
        multiline
        textAlignVertical="top"
        placeholder="Write your review..."
      />
      <View className="flex-row gap-3 mt-3">
        <Pressable
          className={`flex-1 py-2 rounded-lg items-center ${loading ? 'bg-gray-300' : 'bg-blue-600'}`}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text className="text-white font-semibold">
            {loading ? 'Submitting...' : 'Submit'}
          </Text>
        </Pressable>
        <Pressable
          className="flex-1 py-2 rounded-lg items-center bg-gray-200"
          onPress={onClose}
        >
          <Text className="text-gray-700 font-semibold">Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}
