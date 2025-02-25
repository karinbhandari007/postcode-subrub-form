"use client";

import { HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";

/**
 * Creates and configures an Apollo Client instance
 * @returns {ApolloClient} Configured Apollo Client instance
 */
function makeClient() {
  // Create HTTP link with GraphQL endpoint from environment variable
  // Disable caching at HTTP level since we use Apollo's cache
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_BASE_URL,
    fetchOptions: { cache: "no-store" },
  });

  // Return new Apollo Client with in-memory cache and HTTP link
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  });
}

/**
 * Wrapper component that provides Apollo Client context to the app
 * @param {React.PropsWithChildren} props - Component props containing children
 * @returns {JSX.Element} ApolloNextAppProvider wrapped around children
 */
export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
