import { useState } from 'react';
import {
  View, Text, FlatList, Pressable, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSearch } from '../../context/SearchContext';
import ParkCard from '../../components/ParkCard';
import ParkMap from '../../components/ParkMap';
import ParkListSheet from '../../components/ParkListSheet';
import StatePickerModal from '../../components/StatePickerModal';
import { fetchParks } from '../../utils/API';
import { router } from 'expo-router';

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
  const { parks, query, setSearchResults } = useSearch();
  const [showMap, setShowMap] = useState(false);
  const [searching, setSearching] = useState(false);

  const region = getRegion(parks);

  const handleStateSelect = async (state: string) => {
    setSearching(true);
    try {
      const results = await fetchParks(state);
      if (results?.length) {
        setSearchResults(results, state);
        router.replace('/(tabs)/results');
      }
    } finally {
      setSearching(false);
    }
  };

  // Empty state — show search UI instead of error
  if (!parks.length) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-4 pt-4 pb-3">
          <StatePickerModal onSelect={handleStateSelect} searching={searching} />
        </View>
        <View className="flex-1 justify-center items-center px-8">
          <Ionicons name="search-outline" size={48} color="#A3A3A3" />
          <Text className="text-xl font-bold text-gray-800 mt-4 text-center">Find your next adventure</Text>
          <Text className="text-sm text-center mt-2" style={{ color: '#737373' }}>
            Select a state above to discover national parks and recreation areas.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Search bar + count row */}
      <SafeAreaView edges={['top'] as any}>
        <View className="px-4 pt-2 pb-2">
          <StatePickerModal onSelect={handleStateSelect} searching={searching} />
        </View>
        <View className="flex-row justify-between items-center px-4 pb-2">
          <Text className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>
            {parks.length}+ parks in{' '}
            <Text className="uppercase">{query}</Text>
          </Text>
        </View>
      </SafeAreaView>

      {/* Content */}
      {showMap ? (
        <View style={{ flex: 1 }}>
          <ParkMap parks={parks} region={region} />
          <ParkListSheet parks={parks} onClose={() => setShowMap(false)} />
        </View>
      ) : (
        <>
          <FlatList
            data={parks}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingTop: 4, paddingBottom: 100 }}
            renderItem={({ item }) => <ParkCard park={item} />}
          />
          {/* Floating Map toggle pill */}
          <Pressable
            style={{
              position: 'absolute',
              bottom: 96,
              alignSelf: 'center',
              backgroundColor: '#2ECC71',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 999,
              gap: 6,
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 6,
            }}
            onPress={() => setShowMap(true)}
          >
            <Ionicons name="map-outline" size={18} color="white" />
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>Map</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
