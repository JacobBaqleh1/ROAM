import { ActivityIndicator, View } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  color?: string;
  size?: 'small' | 'large';
}

export default function LoadingSpinner({ color = Colors.blue, size = 'large' }: Props) {
  return (
    <View className="flex-1 justify-center items-center py-8">
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}
