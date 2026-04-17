import { View, Pressable, Text } from 'react-native';

interface Props {
  rating: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
}

export default function StarRating({ rating, onRate, readonly = false, size = 28 }: Props) {
  return (
    <View className="flex-row">
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          onPress={() => !readonly && onRate?.(star)}
          disabled={readonly}
        >
          <Text style={{ fontSize: size, color: star <= rating ? '#EAB308' : '#D1D5DB' }}>
            ★
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
