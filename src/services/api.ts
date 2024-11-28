import { supabase, DEMO_PROVIDER } from '@/lib/supabase';
import type { User, Service, Appointment, WorkingHours } from '@/types';

export const api = {
  // Demo provider
  async getDemoProvider(): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('id', DEMO_PROVIDER.id)
      .single();

    if (error) {
      console.error('Failed to get demo provider:', error);
      throw error;
    }

    return data;
  },

  // Users
  async getUserByPhone(phone: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('phone', phone)
      .single();

    if (error) throw error;
    return data;
  },

  async getUser(id: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    // For demo provider, handle the update differently
    if (id === DEMO_PROVIDER.id) {
      const { data: existingUser } = await supabase
        .from('users')
        .select()
        .eq('id', id)
        .single();

      if (!existingUser) {
        // Insert demo provider if doesn't exist
        const { data, error } = await supabase
          .from('users')
          .insert({
            id,
            phone: DEMO_PROVIDER.phone,
            role: 'provider',
            ...updates
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      // Update existing demo provider
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    // For regular users
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Services
  async getServices(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select()
      .order('name');

    if (error) throw error;
    return data;
  },

  // Appointments
  async getAppointments(userId: string, role: 'client' | 'provider' = 'client'): Promise<Appointment[]> {
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        *,
        service:services(
          name,
          price,
          duration
        ),
        client:users!client_id(
          id,
          name,
          phone
        )
      `)
      .eq(role === 'client' ? 'client_id' : 'provider_id', userId)
      .order('start_time');

    if (error) throw error;

    return appointments.map(appointment => ({
      ...appointment,
      startTime: new Date(appointment.start_time),
      endTime: new Date(appointment.end_time),
      service_name: appointment.service?.name || 'Невідома послуга',
      service_price: appointment.service?.price || 0,
      service_duration: appointment.service?.duration || 0,
      client: appointment.client,
    }));
  },

  async createAppointment(appointment: {
    serviceId: string;
    clientId: string;
    providerId: string;
    startTime: Date;
    endTime: Date;
    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    paymentStatus?: 'pending' | 'authorized' | 'captured' | 'refunded';
  }): Promise<void> {
    if (!appointment.clientId) {
      throw new Error('ID користувача обов\'язковий');
    }

    // Check if auto-confirm is enabled for the provider
    const { data: provider } = await supabase
      .from('users')
      .select('auto_confirm')
      .eq('id', appointment.providerId)
      .single();

    const { error } = await supabase
      .from('appointments')
      .insert({
        service_id: appointment.serviceId,
        client_id: appointment.clientId,
        provider_id: appointment.providerId,
        start_time: appointment.startTime.toISOString(),
        end_time: appointment.endTime.toISOString(),
        status: provider?.auto_confirm ? 'confirmed' : (appointment.status || 'pending'),
        payment_status: appointment.paymentStatus || 'pending',
      });

    if (error) throw error;
  },

  async updateAppointmentStatus(id: string, status: 'confirmed' | 'cancelled'): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  },

  // Working hours
  async getWorkingHours(providerId: string): Promise<WorkingHours[]> {
    const { data, error } = await supabase
      .from('working_hours')
      .select()
      .eq('provider_id', providerId)
      .order('day_of_week');

    if (error) throw error;

    // If no working hours set, return default
    if (!data?.length) {
      return [
        { id: 1, name: 'Понеділок', slots: [{ start: '09:00', end: '19:00' }], isWorking: true },
        { id: 2, name: 'Вівторок', slots: [{ start: '09:00', end: '19:00' }], isWorking: true },
        { id: 3, name: 'Середа', slots: [{ start: '09:00', end: '19:00' }], isWorking: true },
        { id: 4, name: 'Четвер', slots: [{ start: '09:00', end: '19:00' }], isWorking: true },
        { id: 5, name: "П'ятниця", slots: [{ start: '09:00', end: '19:00' }], isWorking: true },
        { id: 6, name: 'Субота', slots: [{ start: '10:00', end: '18:00' }], isWorking: true },
        { id: 7, name: 'Неділя', slots: [{ start: '10:00', end: '18:00' }], isWorking: false },
      ];
    }

    return data.map(hours => ({
      id: hours.day_of_week,
      name: getDayName(hours.day_of_week),
      slots: hours.slots || [{ start: hours.start_time, end: hours.end_time }],
      isWorking: hours.is_working,
    }));
  },

  async updateWorkingHours(providerId: string, hours: WorkingHours[]): Promise<void> {
    const { error: deleteError } = await supabase
      .from('working_hours')
      .delete()
      .eq('provider_id', providerId);

    if (deleteError) throw deleteError;

    const { error: insertError } = await supabase
      .from('working_hours')
      .insert(
        hours.map(hour => ({
          provider_id: providerId,
          day_of_week: hour.id,
          slots: hour.slots,
          is_working: hour.isWorking,
        }))
      );

    if (insertError) throw insertError;
  },
};

function getDayName(dayOfWeek: number): string {
  const days = [
    'Понеділок',
    'Вівторок',
    'Середа',
    'Четвер',
    "П'ятниця",
    'Субота',
    'Неділя',
  ];
  return days[dayOfWeek - 1];
}