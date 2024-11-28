export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          phone: string
          name: string | null
          role: 'client' | 'provider'
          auto_confirm: boolean
          created_at: string
        }
        Insert: {
          id?: string
          phone: string
          name?: string | null
          role?: 'client' | 'provider'
          auto_confirm?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          phone?: string
          name?: string | null
          role?: 'client' | 'provider'
          auto_confirm?: boolean
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          duration: number
          price: number
          description: string | null
          provider_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          duration: number
          price: number
          description?: string | null
          provider_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          duration?: number
          price?: number
          description?: string | null
          provider_id?: string
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          service_id: string
          client_id: string
          provider_id: string
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status: 'pending' | 'authorized' | 'captured' | 'refunded'
          created_at: string
        }
        Insert: {
          id?: string
          service_id: string
          client_id: string
          provider_id: string
          start_time: string
          end_time: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status?: 'pending' | 'authorized' | 'captured' | 'refunded'
          created_at?: string
        }
        Update: {
          id?: string
          service_id?: string
          client_id?: string
          provider_id?: string
          start_time?: string
          end_time?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status?: 'pending' | 'authorized' | 'captured' | 'refunded'
          created_at?: string
        }
      }
      working_hours: {
        Row: {
          id: string
          provider_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_working: boolean
          created_at: string
        }
        Insert: {
          id?: string
          provider_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_working?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          provider_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_working?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}