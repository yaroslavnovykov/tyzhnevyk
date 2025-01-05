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

      console.log('Verifying OTP for:', phone);
      // First verify the OTP
      const { user: authUser, session } = await verifyOTP(phone, code);
      console.log('OTP verification result:', { authUser, session });

      if (!authUser?.id || !session) {
        console.error('Missing user ID or session after verification');
        throw new Error('Помилка верифікації. Спробуйт ще раз.');
      }

      // Try to get existing user by auth ID first
      console.log('Checking for existing user by auth ID:', authUser.id);
      let { data: userByAuthId, error: authIdError } = await supabase
        .from('users')
        .select()
        .eq('id', authUser.id)
        .single();

      if (!authIdError && userByAuthId) {
        console.log('Found user by auth ID:', userByAuthId);
        return userByAuthId;
      }

      // Then try by phone
      console.log('Checking for existing user by phone:', phone);
      const { data: userByPhone, error: phoneError } = await supabase
        .from('users')
        .select()
        .eq('phone', phone)
        .single();

      if (!phoneError && userByPhone) {
        console.log('Found user by phone:', userByPhone);
        // Update user's auth ID if it's different
        if (userByPhone.id !== authUser.id) {
          console.log('Updating user auth ID');
          const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({ id: authUser.id })
            .eq('phone', phone)
            .select()
            .single();

          if (updateError) {
            console.error('Error updating user auth ID:', updateError);
            throw updateError;
          }
          return updatedUser;
        }
        return userByPhone;
      }

      // If no user exists, create a temporary one without a name
      console.log('Creating temporary user with ID:', authUser.id);
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          phone,
          role: 'client',
          auto_confirm: false,
          name: null // Explicitly set name to null for new users
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        throw createError;
      }

      console.log('Successfully created new user:', newUser);
      return newUser;
    } catch (error) {
      console.error('OTP verification failed:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Помилка верифікації. Спробуйте ще раз.');
      }
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