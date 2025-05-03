/* eslint-disable no-console */
import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";

// Error handling link
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }

    // Return the same observable to retry the request
    return forward(operation);
  }
);

// Retry link to handle network issues
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 3000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error) => !!error && error.statusCode !== 400,
  },
});

// HTTP link to your GraphQL API
const httpLink = new HttpLink({
  uri:
    process.env.NEXT_PUBLIC_GRAPHQL_API_URL ||
    "https://www.dnd5eapi.co/graphql/2014",
  credentials: "same-origin",
  fetchOptions: {
    mode: "cors",
  },
});

// Create the Apollo Client
export const client = new ApolloClient({
  link: from([retryLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
      notifyOnNetworkStatusChange: true,
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
      notifyOnNetworkStatusChange: true,
    },
    mutate: {
      errorPolicy: "all",
    },
  },
  connectToDevTools: process.env.NODE_ENV !== "production",
});
