export interface User {
  id: string;
  name: string | null;
  phone: string;
  role: 'client' | 'provider';
  auto_confirm: boolean;
  gender?: 'male' | 'female';
  photo_url?: string;
  specializations?: string[];
  createdAt: Date;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  providerId: string;
}

export interface Appointment {
  id: string;
  serviceId: string;
  clientId: string;
  providerId: string;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'authorized' | 'captured' | 'refunded';
  service_name?: string;
  service_price?: number;
  service_duration?: number;
  client?: {
    name: string | null;
    phone: string;
  };
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface WorkingHours {
  id: number;
  name: string;
  slots: TimeSlot[];
  isWorking: boolean;
}

export interface Specialization {
  id: string;
  name_male: string;
  name_female: string;
}