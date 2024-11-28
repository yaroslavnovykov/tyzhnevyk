import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Demo provider credentials
export const DEMO_PROVIDER = {
  phone: '+380501234567',
  id: '00000000-0000-0000-0000-000000000001'
};

// Auth helpers
export async function signInWithPhone(phone: string) {
  // For demo provider, bypass OTP
  if (phone === DEMO_PROVIDER.phone) {
    return { user: { id: DEMO_PROVIDER.id }, session: null };
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      channel: 'sms'
    }
  });

  if (error) {
    console.error('SignIn error:', error);
    throw error;
  }

  return data;
}

export async function verifyOTP(phone: string, token: string) {
  // For demo provider, bypass verification
  if (phone === DEMO_PROVIDER.phone) {
    return {
      user: { id: DEMO_PROVIDER.id },
      session: null
    };
  }

  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms'
  });

  if (error) {
    console.error('Verification error:', error);
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}