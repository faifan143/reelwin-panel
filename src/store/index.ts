import { create } from 'zustand';
import { createAuthSlice } from './auth';
import { createUiSlice } from './ui';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the root store type
export type RootState = ReturnType<typeof createAuthSlice> & ReturnType<typeof createUiSlice>;

// Create the store with persistence
const useStore = create<RootState>()(
  persist(
    (...args) => ({
      ...createAuthSlice(...args),
      ...createUiSlice(...args),
    }),
    {
      name: 'radar-storage', // name of the item in storage
      storage: createJSONStorage(() => localStorage), // use localStorage
      partialize: (state) => ({
        // Only persist these fields
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        userRole: state.userRole,
        activeTab: state.activeTab,
        // Don't persist loading states
      }),
    }
  )
);

export default useStore;