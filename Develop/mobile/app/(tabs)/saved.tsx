import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, Pressable, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useQuery, useMutation } from '@apollo/client/react';
import { Ionicons } from '@expo/vector-icons';
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
    Alert.alert('Remove park?', 'This will remove it from your saved list.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: async () => {
          try {
            await deletePark({ variables: { parkId } });
            setLocalParks((prev) => prev.filter((p) => p.parkId !== parkId));
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Could not remove park.');
          }
        },
      },
    ]);
  };

  if (authLoading || loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <SafeAreaView className="flex-1 bg-white px-6 justify-center items-center">
        <Ionicons name="bookmark-outline" size={52} color="#A3A3A3" />
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#1A1A1A', marginTop: 16, textAlign: 'center' }}>
          Save parks to your list
        </Text>
        <Text style={{ fontSize: 14, color: '#737373', marginTop: 8, textAlign: 'center', lineHeight: 20 }}>
          Sign in to keep track of parks you want to visit.
        </Text>
        <Pressable
          style={{
            marginTop: 24,
            backgroundColor: '#1A1A1A',
            paddingHorizontal: 32,
            paddingVertical: 14,
            borderRadius: 999,
          }}
          onPress={() => router.push('/login')}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>Sign In</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text style={{ color: '#DC2626' }}>Error loading saved parks.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={localParks}
        keyExtractor={(item) => item.parkId}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}>
            <Text style={{ fontSize: 32, fontWeight: '800', color: '#1A1A1A' }}>Saved</Text>
            {/* Sub-tab row */}
            <View style={{ flexDirection: 'row', gap: 24, marginTop: 12, borderBottomWidth: 1, borderBottomColor: '#E5E5E5' }}>
              {['Parks'].map((tab) => (
                <View key={tab} style={{ paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: '#1A1A1A' }}>
                  <Text style={{ fontWeight: '700', fontSize: 15, color: '#1A1A1A' }}>{tab}</Text>
                </View>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 }}>
            <Ionicons name="map-outline" size={48} color="#A3A3A3" />
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginTop: 16, textAlign: 'center' }}>
              No saved parks yet
            </Text>
            <Text style={{ fontSize: 14, color: '#737373', marginTop: 8, textAlign: 'center', lineHeight: 20 }}>
              Search for parks to add them to your list.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/(tabs)/park/${item.parkId}`)}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#F5F5F0',
              backgroundColor: pressed ? '#F5F5F0' : 'white',
              gap: 12,
            })}
          >
            {/* Thumbnail */}
            {item.images?.[0]?.url ? (
              <Image
                source={{ uri: item.images[0].url }}
                style={{ width: 64, height: 64, borderRadius: 10, backgroundColor: '#F5F5F0' }}
                resizeMode="cover"
              />
            ) : (
              <View style={{ width: 64, height: 64, borderRadius: 10, backgroundColor: '#F5F5F0', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="image-outline" size={24} color="#A3A3A3" />
              </View>
            )}
            {/* Text */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', fontSize: 15, color: '#1A1A1A' }} numberOfLines={2}>
                {item.fullName}
              </Text>
              <Text style={{ fontSize: 13, color: '#737373', marginTop: 2 }}>{item.states}</Text>
            </View>
            {/* Actions */}
            <Pressable
              onPress={() => handleDelete(item.parkId)}
              hitSlop={12}
            >
              <Ionicons name="trash-outline" size={20} color="#A3A3A3" />
            </Pressable>
            <Ionicons name="chevron-forward" size={18} color="#A3A3A3" />
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
