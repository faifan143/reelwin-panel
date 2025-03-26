// store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define the store's state shape
interface StoreState {
  // Authentication state
  isAuthenticated: boolean;
  token: string | null;
  userRole: string | null;

  // App state
  isAddingContent: boolean;
  activeTab: string;

  // Actions
  login: (token: string, role?: string) => void;
  logout: () => void;
  setIsAddingContent: (isAdding: boolean) => void;
  setActiveTab: (tab: string) => void;
}

// Create the store with persistence
const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      token: null,
      userRole: null,
      isAddingContent: false,
      activeTab: "content",

      // Actions
      login: (token, role = "admin") =>
        set({
          isAuthenticated: true,
          token,
          userRole: role,
        }),

      logout: () =>
        set({
          isAuthenticated: false,
          token: null,
          userRole: null,
        }),

      setIsAddingContent: (isAdding) =>
        set({
          isAddingContent: isAdding,
        }),

      setActiveTab: (tab) =>
        set({
          activeTab: tab,
        }),
    }),
    {
      name: "reel-win-storage", // name of the item in storage
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
