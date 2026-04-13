export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  error: string | null;

  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  clearError: () => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
