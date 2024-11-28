// This service is no longer needed as we're using Supabase Auth
// It's kept only for type definitions
export interface OtpResponse {
  success: boolean;
  error?: string;
  expiresIn?: number;
}