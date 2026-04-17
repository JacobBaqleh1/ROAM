import { useState } from 'react';
import {
  View, Text, FlatList, Pressable, SafeAreaView,
} from 'react-native';
import { useSearch } from '../../context/SearchContext';
import ParkCard from '../../components/ParkCard';
import ParkMap from '../../components/ParkMap';

interface Park {
  id: string;
  fullName: string;
  latitude?: string | number;
  longitude?: string | number;
  images?: { url: string }[];
}

function getRegion(parks: Park[]) {
  const valid = parks.filter((p) => p.latitude && p.longitude);
  if (!valid.length) {
    return { latitude: 39.8283, longitude: -98.5795, latitudeDelta: 30, longitudeDelta: 30 };
  }
  const avgLat = valid.reduce((s, p) => s + parseFloat(String(p.latitude)), 0) / valid.length;
  const avgLng = valid.reduce((s, p) => s + parseFloat(String(p.longitude)), 0) / valid.length;
  return { latitude: avgLat, longitude: avgLng, latitudeDelta: 8, longitudeDelta: 8 };
}

export default function ResultsScreen() {
  const { parks, query } = useSearch();
  const [showMap, setShowMap] = useState(false);

  const region = getRegion(parks);

  if (!parks.length) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500 text-lg">No results yet.</Text>
        <Text className="text-gray-400 mt-2">Go home and search for a state.</Text>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Query header */}
      <View className="px-4 py-3 border-b border-gray-200">
        <Text className="text-center text-gray-700">
          Results for <Text className="font-bold uppercase">{query}</Text>
          {' '}— {parks.length} parks
        </Text>
      </View>

      {/* Content */}
      {showMap ? (
        <ParkMap parks={parks} region={region} />
      ) : (
        <FlatList
          data={parks}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 8 }}
          renderItem={({ item }) => <ParkCard park={item} />}
        />
      )}

      {/* Toggle button */}
      <Pressable
        className="absolute bottom-6 self-center bg-blue-600 px-6 py-3 rounded-full shadow-lg"
        onPress={() => setShowMap((v) => !v)}
      >
        <Text className="text-white font-semibold">
          {showMap ? '☰  List View' : '🗺  Map View'}
        </Text>
      </Pressable>
    </View>
  );
}
