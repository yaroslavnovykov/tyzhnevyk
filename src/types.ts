export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'client' | 'provider';
  gender?: 'male' | 'female';
  photo_url?: string;
  specializations?: string[];
  auto_confirm?: boolean;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
}

export interface Appointment {
  id: string;
  service_id: string;
  client_id: string;
  provider_id: string;
  start_time: Date;
  end_time: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'authorized' | 'captured' | 'refunded';
  service?: Service;
  service_name?: string;
}

export interface WorkingHours {
  id: number;
  name: string;
  slots: { start: string; end: string }[];
  isWorking: boolean;
} 