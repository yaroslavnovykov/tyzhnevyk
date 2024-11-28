import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  phoneNumber: string | null;
  isNewUser: boolean;
  setPhoneNumber: (phone: string) => void;
  setIsNewUser: (isNew: boolean) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      phoneNumber: null,
      isNewUser: false,
      setPhoneNumber: (phone) => set({ phoneNumber: phone }),
      setIsNewUser: (isNew) => set({ isNewUser: isNew }),
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        phoneNumber: user ? user.phone : null,
        isNewUser: false 
      }),
      logout: () => set({ 
        user: null, 
        isAuthenticated: false, 
        phoneNumber: null,
        isNewUser: false 
      }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        phoneNumber: state.phoneNumber
      }),
    }
  )
);