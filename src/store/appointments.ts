import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Appointment, Service } from '../types';
import { api } from '../services/api';

interface AppointmentState {
  selectedService: Service | null;
  selectedDateTime: Date | null;
  appointments: Appointment[];
  setSelectedService: (service: Service) => void;
  setSelectedDateTime: (date: Date) => void;
  setAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Appointment) => Promise<void>;
  reset: () => void;
}

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set) => ({
      selectedService: null,
      selectedDateTime: null,
      appointments: [],
      setSelectedService: (service) => set({ selectedService: service }),
      setSelectedDateTime: (date) => set({ selectedDateTime: date }),
      setAppointments: (appointments) => set({ appointments }),
      addAppointment: async (appointment) => {
        try {
          await api.createAppointment(appointment);
          set((state) => ({
            appointments: [...state.appointments, appointment]
          }));
        } catch (error) {
          console.error('Failed to create appointment:', error);
          throw error;
        }
      },
      reset: () => set({ selectedService: null, selectedDateTime: null })
    }),
    {
      name: 'appointment-storage',
      partialize: (state) => ({
        appointments: state.appointments.map(appointment => ({
          ...appointment,
          startTime: appointment.startTime.toISOString(),
          endTime: appointment.endTime.toISOString(),
        })),
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.appointments) {
          state.appointments = state.appointments.map(appointment => ({
            ...appointment,
            startTime: new Date(appointment.startTime),
            endTime: new Date(appointment.endTime),
          }));
        }
      },
    }
  )
);