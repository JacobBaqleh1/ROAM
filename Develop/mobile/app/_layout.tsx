import '../global.css';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { setContext } from '@apollo/client/link/context';
import * as SecureStore from 'expo-secure-store';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../utils/useAuth';
import { SearchProvider } from '../context/SearchContext';

const httpLink = createHttpLink({
  uri: `${process.env.EXPO_PUBLIC_API_URL ?? 'https://roam-ynw2.onrender.com'}/graphql`,
});

const authLink = setContext(async (_: any, prevContext: any) => {
  const token = await SecureStore.getItemAsync('id_token');
  return {
    headers: {
      ...(prevContext.headers ?? {}),
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApolloProvider client={client}>
        <AuthProvider>
          <SearchProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ title: 'Sign In', headerBackTitle: 'Back' }} />
            </Stack>
          </SearchProvider>
        </AuthProvider>
      </ApolloProvider>
    </GestureHandlerRootView>
  );
}
