import { defineStore } from 'pinia';
import type { Appointment, Service } from '@/types';
import { api } from '@/services/api';

interface AppointmentState {
  selectedService: Service | null;
  selectedDateTime: Date | null;
  appointments: Appointment[];
}

export const useAppointmentStore = defineStore('appointments', {
  state: (): AppointmentState => ({
    selectedService: null,
    selectedDateTime: null,
    appointments: []
  }),

  actions: {
    setSelectedService(service: Service) {
      this.selectedService = service;
    },
    setSelectedDateTime(date: Date) {
      this.selectedDateTime = date;
    },
    setAppointments(appointments: Appointment[]) {
      this.appointments = appointments;
    },
    async addAppointment(appointment: Appointment) {
      try {
        await api.createAppointment(appointment);
        this.appointments.push(appointment);
      } catch (error) {
        console.error('Failed to create appointment:', error);
        throw error;
      }
    },
    reset() {
      this.selectedService = null;
      this.selectedDateTime = null;
    }
  },

  persist: {
    key: 'appointment-storage',
    paths: ['appointments'],
    afterRestore: (ctx) => {
      ctx.store.appointments = ctx.store.appointments.map(appointment => ({
        ...appointment,
        startTime: new Date(appointment.startTime),
        endTime: new Date(appointment.endTime),
      }));
    }
  }
});