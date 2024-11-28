import { defineStore } from 'pinia';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  phoneNumber: string | null;
  isNewUser: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    phoneNumber: null,
    isNewUser: false
  }),

  actions: {
    setPhoneNumber(phone: string) {
      this.phoneNumber = phone;
    },
    setIsNewUser(isNew: boolean) {
      this.isNewUser = isNew;
    },
    setUser(user: User | null) {
      this.user = user;
      this.isAuthenticated = !!user;
      this.phoneNumber = user ? user.phone : null;
      this.isNewUser = !user?.name; // User is new if they don't have a name set
    },
    logout() {
      this.user = null;
      this.isAuthenticated = false;
      this.phoneNumber = null;
      this.isNewUser = false;
    }
  },

  persist: {
    key: 'auth-storage',
    paths: ['user', 'isAuthenticated', 'phoneNumber']
  }
});