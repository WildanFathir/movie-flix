import { getDemoUserByCredentials } from '@/api/user';
import type { AuthState, AuthUser } from '@/types/auth';
import { validateLoginInput, validateRegisterInput } from '@/utils/validators/auth';
import { create } from 'zustand';

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  error: null,

  // LOGIN - Sync, hardcoded validation
  login: (email: string, password: string) => {
    const validationError = validateLoginInput(email, password);
    if (validationError) {
      set({ error: validationError });
      return;
    }

    // Check hardcoded credentials
    const user = getDemoUserByCredentials(email, password);
    if (!user) {
      set({ error: 'Email atau password salah' });
      return;
    }

    // Success
    const loggedInUser: AuthUser = {
      id: email,
      email,
      name: user.name,
    };

    set({
      user: loggedInUser,
      isAuthenticated: true,
      error: null,
    });
    console.log('✅ Login berhasil:', email);
  },

  // REGISTER - Sync, bisa create user baru
  register: (name: string, email: string, password: string) => {
    const validationError = validateRegisterInput(name, email, password);
    if (validationError) {
      set({ error: validationError });
      return;
    }

    const newUser: AuthUser = {
      id: email,
      email,
      name,
    };

    set({
      user: newUser,
      isAuthenticated: true,
      error: null,
    });
    console.log('✅ Register berhasil:', email);
  },

  // LOGOUT - instantly clear
  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
    console.log('👋 Logging out');
  },

  // CLEAR ERROR
  clearError: () => {
    set({ error: null });
  },
}));
