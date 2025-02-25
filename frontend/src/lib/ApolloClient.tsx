// Import required Apollo Client dependencies
import { HttpLink } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";

// Create and export Apollo Client instance with required utilities
// - getClient: Returns the Apollo Client instance
// - query: Helper for executing GraphQL queries
// - PreloadQuery: Component for preloading queries on the server
export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    // Configure in-memory cache for storing query results
    cache: new InMemoryCache(),
    // Set up HTTP link to GraphQL endpoint using environment variable
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_BASE_URL,
    }),
  });
});
