import { useState } from 'react';
import {
  View, Text, FlatList, Pressable, ActivityIndicator, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useQuery } from '@apollo/client/react';
import { Ionicons } from '@expo/vector-icons';
import { QUERY_ALL_REVIEWS } from '../../utils/queries';
import { fetchParks } from '../../utils/API';
import { useSearch } from '../../context/SearchContext';
import StatePickerModal from '../../components/StatePickerModal';
import ReviewCard from '../../components/ReviewCard';

const FILTER_CHIPS = ['Nearby', 'National Parks', 'Recreation Areas', 'Camping'];

export default function HomeScreen() {
  const { setSearchResults } = useSearch();
  const { loading, data } = useQuery(QUERY_ALL_REVIEWS);
  const [visibleCount, setVisibleCount] = useState(6);
  const [searching, setSearching] = useState(false);
  const [activeChip, setActiveChip] = useState('National Parks');

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
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={reviews.slice(0, visibleCount)}
        keyExtractor={(item: any) => item._id}
        renderItem={({ item }: any) => (
          <View className="px-4">
            <ReviewCard review={item} />
          </View>
        )}
        ListHeaderComponent={
          <View>
            {/* Search bar */}
            <View className="px-4 pt-4 pb-3">
              <StatePickerModal onSelect={handleStateSelect} searching={searching} />
            </View>

            {/* Filter chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 4 }}
            >
              {FILTER_CHIPS.map((chip) => (
                <Pressable
                  key={chip}
                  onPress={() => setActiveChip(chip)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 999,
                    borderWidth: 1.5,
                    borderColor: activeChip === chip ? '#1A1A1A' : '#E5E5E5',
                    backgroundColor: activeChip === chip ? '#1A1A1A' : 'white',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '500',
                      color: activeChip === chip ? 'white' : '#1A1A1A',
                    }}
                  >
                    {chip}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Section header */}
            <View className="px-4 pt-5 pb-2 flex-row justify-between items-center">
              <Text className="text-xl font-bold text-gray-900">Recent Activity</Text>
            </View>

            {loading && (
              <View className="py-8 items-center">
                <ActivityIndicator size="large" color="#2ECC71" />
              </View>
            )}

            {!loading && reviews.length === 0 && (
              <View className="py-12 items-center px-8">
                <Ionicons name="leaf-outline" size={40} color="#A3A3A3" />
                <Text className="text-base font-semibold text-gray-700 mt-3 text-center">No reviews yet</Text>
                <Text className="text-sm text-center mt-1" style={{ color: '#737373' }}>
                  Be the first to explore and leave a review.
                </Text>
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          visibleCount < reviews.length ? (
            <View className="px-4 pb-8 pt-2">
              <Pressable
                style={{
                  borderWidth: 1.5,
                  borderColor: '#E5E5E5',
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: 'center',
                }}
                onPress={() => setVisibleCount((v) => v + 6)}
              >
                <Text style={{ fontWeight: '600', color: '#1A1A1A' }}>See More Reviews</Text>
              </Pressable>
            </View>
          ) : <View style={{ height: 32 }} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
