import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, Pressable, ActivityIndicator, SafeAreaView, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation } from '@apollo/client/react';
import { QUERY_ME } from '../../utils/queries';
import { DELETE_PARK } from '../../utils/mutations';
import { useAuth } from '../../utils/useAuth';
import { Park } from '../../models/Park';

export default function SavedParksScreen() {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { loading, error, data } = useQuery(QUERY_ME, { skip: !isLoggedIn });
  const [deletePark] = useMutation(DELETE_PARK, {
    refetchQueries: [{ query: QUERY_ME }],
  });
  const [localParks, setLocalParks] = useState<Park[]>([]);

  useEffect(() => {
    if ((data as any)?.me?.savedParks) {
      setLocalParks((data as any).me.savedParks);
    }
  }, [data]);

  const handleDelete = async (parkId: string) => {
    try {
      await deletePark({ variables: { parkId } });
      setLocalParks((prev) => prev.filter((p) => p.parkId !== parkId));
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not remove park.');
    }
  };

  if (authLoading || loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center px-6 bg-white">
        <Text className="text-2xl font-bold mb-2">Sign in to view saved parks</Text>
        <Text className="text-gray-500 text-center mb-6">
          Create an account to start building your travel list.
        </Text>
        <Pressable
          className="bg-blue-600 px-8 py-3 rounded-xl"
          onPress={() => router.push('/login')}
        >
          <Text className="text-white font-bold">Sign In</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error loading saved parks.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={localParks}
        keyExtractor={(item) => item.parkId}
        numColumns={1}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <Text className="text-xl font-semibold mb-4 text-center">
            {localParks.length
              ? `${localParks.length} saved ${localParks.length === 1 ? 'park' : 'parks'}`
              : 'No saved parks yet'}
          </Text>
        }
        ListEmptyComponent={
          <View className="items-center mt-8">
            <Text className="text-gray-400 text-lg text-center">
              Explore some parks and save them to your list!
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="rounded-xl overflow-hidden shadow-sm border border-gray-200 mb-4 bg-white">
            {item.images?.length > 0 && (
              <Pressable onPress={() => router.push(`/(tabs)/park/${item.parkId}`)}>
                <Image
                  source={{ uri: item.images[0].url }}
                  className="w-full h-48"
                  resizeMode="cover"
                />
              </Pressable>
            )}
            <View className="p-3">
              <Pressable onPress={() => router.push(`/(tabs)/park/${item.parkId}`)}>
                <Text className="text-lg font-semibold text-gray-800">{item.fullName}</Text>
                <Text className="text-sm text-gray-500 mt-0.5">{item.states}</Text>
              </Pressable>
              <Pressable
                className="mt-3 bg-red-600 py-2 rounded-lg items-center"
                onPress={() => handleDelete(item.parkId)}
              >
                <Text className="text-white font-semibold">Remove from Travel List</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}
