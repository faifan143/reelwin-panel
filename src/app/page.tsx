'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import useStore from '@/store';
import LoginPage from '@/components/pages/LoginPage';
import ContentManagementPage from '@/components/pages/ContentManagementPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function Home() {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const activeTab = useStore((state) => state.activeTab);
  
  return (
    <QueryClientProvider client={queryClient}>
      {!isAuthenticated ? (
        <LoginPage />
      ) : (
        <div>
          {activeTab === 'content' && <ContentManagementPage />}
          {/* Add other tabs here as they are refactored */}
        </div>
      )}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}