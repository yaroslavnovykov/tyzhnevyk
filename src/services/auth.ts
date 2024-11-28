import { supabase, signInWithPhone, verifyOTP, DEMO_PROVIDER } from '@/lib/supabase';
import type { User } from '@/types';
import { api } from './api';

export const authService = {
  async checkPhoneExists(phone: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('phone', phone)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Failed to check phone:', error);
      throw error;
    }
  },

  async checkProviderExists(phone: string): Promise<boolean> {
    // For demo provider, always return true
    if (phone === DEMO_PROVIDER.phone) {
      return true;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('phone', phone)
        .eq('role', 'provider')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Failed to check provider:', error);
      throw error;
    }
  },

  async loginWithPhone(phone: string): Promise<User> {
    try {
      await signInWithPhone(phone);

      // For demo provider, return existing user
      if (phone === DEMO_PROVIDER.phone) {
        const demoUser = await api.getDemoProvider();
        if (demoUser) return demoUser;
      }

      // Return partial user info - full user will be returned after OTP verification
      return {
        id: '', // Will be set after verification
        phone,
        name: null,
        role: 'client',
        created_at: new Date(),
        auto_confirm: false,
      };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  async verifyOtp(phone: string, code: string): Promise<User | null> {
    try {
      // For demo provider, bypass verification
      if (phone === DEMO_PROVIDER.phone) {
        return api.getDemoProvider();
      }

      const { user: authUser } = await verifyOTP(phone, code);
      if (!authUser?.id) return null;

      // Get or create user after successful verification
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select()
        .eq('phone', phone)
        .single();

      if (fetchError && fetchError.code === 'PGRST116') {
        // User doesn't exist, create new one
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            phone,
            role: 'client',
            auto_confirm: false,
          })
          .select()
          .single();

        if (createError) throw createError;
        return newUser;
      } else if (fetchError) {
        throw fetchError;
      }

      return existingUser;
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    }
  },

  async registerUser(phone: string, name: string): Promise<User> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .update({ name })
        .eq('phone', phone)
        .select()
        .single();

      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }
};