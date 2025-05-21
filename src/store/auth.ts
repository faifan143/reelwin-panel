import { StateCreator } from 'zustand';
import { AuthState, AuthActions } from '@/types/auth';

// Auth slice type
export type AuthSlice = AuthState & AuthActions;

// Create auth slice
export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  // Initial state
  isAuthenticated: false,
  token: null,
  userRole: null,

  // Actions
  login: (token, role = 'admin') =>
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
});