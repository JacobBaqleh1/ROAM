import { useState } from 'react';
import {
  View, Text, FlatList, Pressable, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useQuery, useMutation } from '@apollo/client/react';
import { Ionicons } from '@expo/vector-icons';
import { QUERY_USER_REVIEWS, QUERY_ME } from '../../utils/queries';
import { DELETE_REVIEW } from '../../utils/mutations';
import { useAuth } from '../../utils/useAuth';
import EditReviewForm from '../../components/EditReviewForm';
import StarRating from '../../components/StarRating';

function formatDate(timestamp: string) {
  if (!timestamp) return '';
  return new Date(parseInt(timestamp)).toLocaleDateString();
}

const SUB_TABS = ['Reviews', 'Activity'];

export default function MyReviewsScreen() {
  const { isLoggedIn, loading: authLoading, user, logout } = useAuth();
  const { loading, error, data: reviewsData } = useQuery(QUERY_USER_REVIEWS, { skip: !isLoggedIn });
  const { data: meData } = useQuery(QUERY_ME, { skip: !isLoggedIn });
  const [deleteReview] = useMutation(DELETE_REVIEW, {
    refetchQueries: [{ query: QUERY_USER_REVIEWS }],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Reviews');

  const handleDelete = async (reviewId: string) => {
    Alert.alert('Delete Review', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await deleteReview({ variables: { reviewId } });
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Could not delete review.');
          }
        },
      },
    ]);
  };

  const handleSettingsPress = () => {
    Alert.alert('Settings', undefined, [
      { text: 'Log Out', style: 'destructive', onPress: logout },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  if (authLoading || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name="person-circle-outline" size={64} color="#A3A3A3" />
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#1A1A1A', marginTop: 16, textAlign: 'center' }}>
          Sign in to see your profile
        </Text>
        <Pressable
          style={{ marginTop: 24, backgroundColor: '#1A1A1A', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 999 }}
          onPress={() => router.push('/login')}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>Sign In</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <Text style={{ color: '#DC2626' }}>Error loading reviews.</Text>
      </View>
    );
  }

  const reviews = (reviewsData as any)?.getUserReviews ?? [];
  const savedParksCount = (meData as any)?.me?.savedParks?.length ?? 0;
  const initials = user?.username?.[0]?.toUpperCase() ?? '?';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Settings row */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, paddingTop: 4, gap: 8 }}>
        <Pressable
          style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F5F0', justifyContent: 'center', alignItems: 'center' }}
          onPress={handleSettingsPress}
        >
          <Ionicons name="settings-outline" size={18} color="#1A1A1A" />
        </Pressable>
        <Pressable
          style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F5F0', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => {}}
        >
          <Ionicons name="ellipsis-horizontal" size={18} color="#1A1A1A" />
        </Pressable>
      </View>

      <FlatList
        data={activeTab === 'Reviews' ? reviews : []}
        keyExtractor={(item: any) => item._id}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <View>
            {/* Avatar + name */}
            <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
              <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#2ECC71', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 28, fontWeight: '800', color: 'white' }}>{initials}</Text>
              </View>
              <Text style={{ fontSize: 26, fontWeight: '800', color: '#1A1A1A', marginTop: 10 }}>
                {user?.username}
              </Text>
              <Text style={{ fontSize: 14, color: '#737373', marginTop: 2 }}>{user?.email}</Text>

              {/* Stats row */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14, gap: 20 }}>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1A1A' }}>{reviews.length}</Text>
                  <Text style={{ fontSize: 12, color: '#737373' }}>Reviews</Text>
                </View>
                <View style={{ width: 1, height: 28, backgroundColor: '#E5E5E5' }} />
                <View>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1A1A' }}>{savedParksCount}</Text>
                  <Text style={{ fontSize: 12, color: '#737373' }}>Parks Saved</Text>
                </View>
              </View>
            </View>

            {/* Sub-tab row */}
            <View style={{ flexDirection: 'row', marginTop: 16, borderBottomWidth: 1, borderBottomColor: '#E5E5E5', paddingHorizontal: 16, gap: 24 }}>
              {SUB_TABS.map((tab) => (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={{ paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: activeTab === tab ? '#1A1A1A' : 'transparent' }}
                >
                  <Text style={{ fontWeight: activeTab === tab ? '700' : '400', fontSize: 15, color: activeTab === tab ? '#1A1A1A' : '#737373' }}>
                    {tab}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          activeTab === 'Activity' ? (
            <View style={{ alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 }}>
              <Ionicons name="trending-up-outline" size={48} color="#A3A3A3" />
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginTop: 16, textAlign: 'center' }}>No activity yet</Text>
            </View>
          ) : (
            <View style={{ alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 }}>
              <Ionicons name="star-outline" size={48} color="#A3A3A3" />
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginTop: 16, textAlign: 'center' }}>No reviews yet</Text>
              <Text style={{ fontSize: 14, color: '#737373', marginTop: 8, textAlign: 'center', lineHeight: 20 }}>
                Visit a park and share your experience.
              </Text>
            </View>
          )
        }
        renderItem={({ item }: any) => (
          <View style={{ marginHorizontal: 16, marginTop: 12, backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E5E5' }}>
            <Text style={{ fontWeight: '700', fontSize: 15, color: '#1A1A1A' }}>{item.parkFullName}</Text>
            <Text style={{ fontSize: 12, color: '#A3A3A3', marginTop: 2 }}>{formatDate(item.createdAt)}</Text>
            <View style={{ marginTop: 6 }}>
              <StarRating rating={item.rating} readonly size={16} />
            </View>
            <Text style={{ color: '#737373', marginTop: 6, lineHeight: 20 }}>{item.comment}</Text>

            {editingId === item._id ? (
              <EditReviewForm
                reviewId={item._id}
                initialComment={item.comment}
                initialRating={item.rating}
                onClose={() => setEditingId(null)}
              />
            ) : (
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                <Pressable
                  style={{ flex: 1, borderWidth: 1.5, borderColor: '#E5E5E5', paddingVertical: 8, borderRadius: 8, alignItems: 'center' }}
                  onPress={() => setEditingId(item._id)}
                >
                  <Text style={{ fontWeight: '600', color: '#1A1A1A', fontSize: 13 }}>Edit</Text>
                </Pressable>
                <Pressable
                  style={{ flex: 1, borderWidth: 1.5, borderColor: '#FCA5A5', paddingVertical: 8, borderRadius: 8, alignItems: 'center' }}
                  onPress={() => handleDelete(item._id)}
                >
                  <Text style={{ fontWeight: '600', color: '#DC2626', fontSize: 13 }}>Delete</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}
