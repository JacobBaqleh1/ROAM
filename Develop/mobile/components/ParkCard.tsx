import { View, Text, Image, Pressable } from 'react-native';
import { router } from 'expo-router';

interface Park {
  id: string;
  fullName: string;
  images?: { url: string }[];
  states?: string;
  latitude?: string;
  longitude?: string;
}

interface Props {
  park: Park;
}

export default function ParkCard({ park }: Props) {
  const image = park.images?.[0]?.url;

  return (
    <Pressable
      className="rounded-xl overflow-hidden shadow-md bg-white mb-4 mx-1"
      onPress={() => router.push(`/(tabs)/park/${park.id}`)}
      style={{ flex: 1 }}
    >
      {image ? (
        <Image
          source={{ uri: image }}
          className="w-full h-36"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-36 bg-gray-200 justify-center items-center">
          <Text className="text-gray-400 text-xs">No Image</Text>
        </View>
      )}
      <View className="p-2">
        <Text className="font-semibold text-gray-800 text-xs" numberOfLines={2}>
          {park.fullName}
        </Text>
      </View>
    </Pressable>
  );
}
