import { View, Text } from 'react-native';

interface Park {
  id: string;
  fullName: string;
  latitude?: string | number;
  longitude?: string | number;
}

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface Props {
  parks: Park[];
  region: Region;
}

export default function ParkMap({ parks }: Props) {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-gray-500 text-base">Map view is only available on mobile.</Text>
      <Text className="text-gray-400 text-sm mt-1">{parks.length} parks found.</Text>
    </View>
  );
}
