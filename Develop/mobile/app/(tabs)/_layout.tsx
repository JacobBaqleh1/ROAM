import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../utils/useAuth';

export default function TabLayout() {
  const { isLoggedIn } = useAuth();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#1A1A1A',
        tabBarInactiveTintColor: '#A3A3A3',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#E5E5E5',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarItemStyle: { borderRadius: 999 },
        tabBarIconStyle: { marginTop: 2 },
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#1A1A1A',
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="results"
        options={{
          title: 'Parks',
          tabBarLabel: 'Parks',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarLabel: 'Community',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved Parks',
          tabBarLabel: 'Saved',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-reviews"
        options={{
          title: 'My Reviews',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="park/[id]"
        options={{
          href: null,
          title: 'Park Details',
          headerShown: true,
        }}
      />
    </Tabs>
  );
}
