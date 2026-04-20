import { View, Text, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
      className="bg-white rounded-2xl overflow-hidden mb-3 mx-4"
      style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3 }}
      onPress={() => router.push(`/(tabs)/park/${park.id}`)}
    >
      {/* Image with save button overlay */}
      <View className="relative">
        {image ? (
          <Image
            source={{ uri: image }}
            style={{ width: '100%', height: 200 }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ width: '100%', height: 200 }} className="bg-gray-100 justify-center items-center">
            <Ionicons name="image-outline" size={40} color="#A3A3A3" />
          </View>
        )}
        {/* Heart button */}
        <View
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white justify-center items-center"
          style={{ shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
        >
          <Ionicons name="heart-outline" size={18} color="#1A1A1A" />
        </View>
      </View>

      {/* Info */}
      <View className="p-3">
        <Text className="font-bold text-base text-gray-900" numberOfLines={2}>
          {park.fullName}
        </Text>
        {park.states ? (
          <Text className="text-sm mt-0.5" style={{ color: '#737373' }}>
            {park.states}
          </Text>
        ) : null}
        {/* Metadata row */}
        <View className="flex-row items-center mt-1.5 gap-1">
          <Ionicons name="star" size={12} color="#EAB308" />
          <Text className="text-xs" style={{ color: '#737373' }}>—</Text>
          <Text className="text-xs" style={{ color: '#A3A3A3' }}>·</Text>
          <Text className="text-xs" style={{ color: '#737373' }}>National Park</Text>
        </View>
      </View>
    </Pressable>
  );
}
