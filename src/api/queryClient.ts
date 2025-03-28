import {
  QueryClient,
  QueryCache,
  MutationCache,
  QueryKey,
} from "@tanstack/react-query";
import { toast } from "sonner";

interface QueryMeta {
  successMessage?: string;
  errorMessage?: string;
  invalidateQueries?: QueryKey | QueryKey[];
  mutationId?: string;
}

/**
 * Configure and create the React Query client
 * Includes global configuration for queries and mutations
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Disable automatic refetch on window focus
      staleTime: 30000, // Consider data fresh for 30 seconds
    },
  },

  /**
   * Global query cache configuration
   * Handles success and error states for all queries
   */
  queryCache: new QueryCache({
    onSuccess: (_data, query) => {
      // Handle successful queries
      const meta = query.meta as QueryMeta | undefined;
      if (meta?.successMessage) {
        toast.success(meta.successMessage);
      }
    },
    onError: (error, query) => {
      // Handle query errors
      const meta = query.meta as QueryMeta | undefined;
      const errorMessage = meta?.errorMessage || (error as Error).message;
      toast.error(`${errorMessage}: ${(error as Error).message}`);

      // Log error for debugging
      console.error("Query Error:", {
        queryKey: query.queryKey,
        error,
        meta: query.meta,
      });
    },
  }),

  /**
   * Global mutation cache configuration
   * Handles success and error states for all mutations
   */
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      // Handle successful mutations
      const meta = mutation.meta as QueryMeta | undefined;
      if (meta?.successMessage) {
        toast.success(meta.successMessage);
      }

      // Invalidate relevant queries if specified
      if (meta?.invalidateQueries) {
        const queriesToInvalidate = Array.isArray(meta.invalidateQueries)
          ? meta.invalidateQueries
          : [meta.invalidateQueries];

        queriesToInvalidate.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
    },
    onError: (error, _variables, _context, mutation) => {
      // Handle mutation errors
      const meta = mutation.meta as QueryMeta | undefined;
      const errorMessage = meta?.errorMessage || "Operation failed";
      toast.error(`${errorMessage}: ${(error as Error).message}`);

      // Log error for debugging
      console.error("Mutation Error:", {
        mutation: meta?.mutationId,
        error,
      });
    },
  }),
});

/**
 * Query key factory
 * Provides consistent query keys across the application
 */
export const queryKeys = {
  products: {
    all: ["products"] as const,
    byId: (id: string) => ["products", id] as const,
    byCategory: (category: string) =>
      ["products", "category", category] as const,
  },
  orders: {
    all: ["orders"] as const,
    byId: (id: string) => ["orders", id] as const,
    byUser: (userId: string) => ["orders", "user", userId] as const,
  },
  users: {
    all: ["users"] as const,
    byId: (id: string) => ["users", id] as const,
  },
};
