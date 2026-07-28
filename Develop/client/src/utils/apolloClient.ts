import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// In dev, stay same-origin and let the Vite proxy forward to the API server
// (see vite.config.ts) — an absolute host here breaks whenever the machine's
// LAN address changes or Vite isn't bound to it.
const httpLink = createHttpLink({
  uri: import.meta.env.DEV
    ? '/graphql'
    : import.meta.env.VITE_GRAPHQL_URI ?? 'https://roam-ynw2.onrender.com/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
