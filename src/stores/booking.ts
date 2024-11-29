import { defineStore } from 'pinia';
import type { Service } from '@/types';

interface BookingState {
  selectedService: Service | null;
  selectedDateTime: Date | null;
}

export const useBookingStore = defineStore('booking', {
  state: (): BookingState => ({
    selectedService: null,
    selectedDateTime: null,
  }),

  actions: {
    setSelectedService(service: Service) {
      this.selectedService = service;
    },

    setSelectedDateTime(dateTime: Date) {
      this.selectedDateTime = dateTime;
    },

    reset() {
      this.selectedService = null;
      this.selectedDateTime = null;
    },
  },
}); 