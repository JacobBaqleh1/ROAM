import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Pressable, ActivityIndicator, ImageBackground, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@apollo/client/react';
import { QUERY_ALL_REVIEWS } from '../../utils/queries';
import { fetchParks } from '../../utils/API';
import { useSearch } from '../../context/SearchContext';
import StatePickerModal from '../../components/StatePickerModal';
import ReviewCard from '../../components/ReviewCard';

const HERO_IMAGES = [
  'https://www.nps.gov/common/uploads/structured_data/3C7B45AE-1DD8-B71B-0BED299D5B9F3B44.jpg',
  'https://www.nps.gov/common/uploads/structured_data/3C84CA1D-1DD8-B71B-0B79E9C9A0E7E9E2.jpg',
  'https://www.nps.gov/common/uploads/structured_data/3C86CE3E-1DD8-B71B-0B24E7B1B2127A4D.jpg',
];

export default function HomeScreen() {
  const { setSearchResults } = useSearch();
  const { loading, error, data, refetch } = useQuery(QUERY_ALL_REVIEWS);
  const [visibleCount, setVisibleCount] = useState(6);
  const [heroIndex, setHeroIndex] = useState(0);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => refetch(), 2000);
    return () => clearTimeout(timer);
  }, [refetch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleStateSelect = async (state: string) => {
    setSearching(true);
    try {
      const parks = await fetchParks(state);
      if (!parks || parks.length === 0) {
        Alert.alert('No parks found', 'Try selecting a different state.');
        return;
      }
      setSearchResults(parks, state);
      router.push('/(tabs)/results');
    } catch {
      Alert.alert('Error', 'Could not fetch parks. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const reviews = (data as any)?.getAllReviews ?? [];

  return (
    <FlatList
      data={reviews.slice(0, visibleCount)}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View className="px-4">
          <ReviewCard review={item} />
        </View>
      )}
      ListHeaderComponent={
        <View>
          {/* Hero */}
          <ImageBackground
            source={{ uri: HERO_IMAGES[heroIndex] }}
            className="h-64 justify-center items-center"
          >
            <View className="absolute inset-0 bg-black/40" />
            <Text className="text-3xl font-black text-white text-center z-10 px-4">
              Explore National Parks
            </Text>
            <View className="mt-4 z-10 px-8 w-full">
              {searching ? (
                <ActivityIndicator color="white" />
              ) : (
                <StatePickerModal onSelect={handleStateSelect} />
              )}
            </View>
          </ImageBackground>

          {/* Section header */}
          <View className="px-4 pt-6 pb-2">
            <Text className="text-2xl font-bold text-gray-900">Recent Activity</Text>
          </View>

          {loading && (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#2563EB" />
            </View>
          )}
        </View>
      }
      ListFooterComponent={
        visibleCount < reviews.length ? (
          <View className="px-4 pb-6">
            <Pressable
              className="bg-blue-600 rounded-lg py-3 items-center"
              onPress={() => setVisibleCount((v) => v + 6)}
            >
              <Text className="text-white font-semibold">See More Reviews</Text>
            </Pressable>
          </View>
        ) : null
      }
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
}
