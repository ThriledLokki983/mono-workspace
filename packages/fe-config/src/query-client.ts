import { QueryClient } from "@tanstack/react-query";

export interface QueryClientOptions {
  staleTime?: number;
  cacheTime?: number;
  retry?: number;
  refetchOnWindowFocus?: boolean;
}

export function createQueryClient(
  options: QueryClientOptions = {}
): QueryClient {
  const {
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
    retry = 2,
    refetchOnWindowFocus = false,
  } = options;

  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime,
        gcTime: cacheTime, // React Query v5 uses gcTime instead of cacheTime
        retry,
        refetchOnWindowFocus,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

// Common query keys factory
export const queryKeys = {
  all: ["queries"] as const,
  lists: () => [...queryKeys.all, "list"] as const,
  list: (filters: string) => [...queryKeys.lists(), { filters }] as const,
  details: () => [...queryKeys.all, "detail"] as const,
  detail: (id: string | number) => [...queryKeys.details(), id] as const,
} as const;
