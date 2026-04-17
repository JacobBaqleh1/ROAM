import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useMutation } from '@apollo/client/react';
import { UPDATE_REVIEW } from '../utils/mutations';
import { QUERY_USER_REVIEWS } from '../utils/queries';
import StarRating from './StarRating';

interface Props {
  reviewId: string;
  initialComment: string;
  initialRating: number;
  onClose: () => void;
}

export default function EditReviewForm({ reviewId, initialComment, initialRating, onClose }: Props) {
  const [comment, setComment] = useState(initialComment);
  const [rating, setRating] = useState(initialRating);

  const [updateReview, { loading }] = useMutation(UPDATE_REVIEW, {
    refetchQueries: [{ query: QUERY_USER_REVIEWS }],
  });

  const handleUpdate = async () => {
    try {
      await updateReview({ variables: { reviewId, comment, rating } });
      onClose();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not update review.');
    }
  };

  return (
    <View className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
      <StarRating rating={rating} onRate={setRating} />
      <TextInput
        className="border border-gray-300 rounded-lg p-2 text-base mt-2 min-h-[60px] bg-white"
        value={comment}
        onChangeText={setComment}
        multiline
        textAlignVertical="top"
      />
      <View className="flex-row gap-2 mt-2">
        <Pressable
          className={`flex-1 py-2 rounded-lg items-center ${loading ? 'bg-gray-300' : 'bg-green-500'}`}
          onPress={handleUpdate}
          disabled={loading}
        >
          <Text className="text-white font-semibold">Save</Text>
        </Pressable>
        <Pressable
          className="flex-1 py-2 rounded-lg items-center bg-gray-400"
          onPress={onClose}
        >
          <Text className="text-white font-semibold">Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}
