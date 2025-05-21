// Authentication related types
export interface LoginFormData {
  phone: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userRole: string | null;
}

export interface AuthActions {
  login: (token: string, role?: string) => void;
  logout: () => void;
}
