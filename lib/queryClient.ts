import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // With SSR, we want to set a higher staleTime to avoid 
            // refetching immediately on the client
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
            // Disable refetching on window focus in production
            refetchOnWindowFocus: process.env.NODE_ENV !== 'production',
        },
        mutations: {
            // Disable retries on mutations
            retry: false,
        },
    },
}); 