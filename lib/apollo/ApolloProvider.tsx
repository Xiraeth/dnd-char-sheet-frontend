"use client";

import { ApolloProvider as BaseApolloProvider } from "@apollo/client";
import { client } from "./client";
import { ReactNode, FC } from "react";

interface ApolloProviderProps {
  children: ReactNode;
}

/**
 * Apollo Provider component that wraps the application with the Apollo client
 * @param {ReactNode} children - The child components to be wrapped
 * @returns {FC<ApolloProviderProps>} The Apollo provider component
 */
export const ApolloProvider: FC<ApolloProviderProps> = ({ children }) => {
  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
};
