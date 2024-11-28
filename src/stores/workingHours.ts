import { defineStore } from 'pinia';
import type { WorkingHours } from '@/types';
import { api } from '@/services/api';

interface WorkingHoursState {
  hours: WorkingHours[];
  isLoading: boolean;
  error: string | null;
}

export const useWorkingHoursStore = defineStore('workingHours', {
  state: (): WorkingHoursState => ({
    hours: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchWorkingHours(providerId: string) {
      this.isLoading = true;
      this.error = null;
      try {
        this.hours = await api.getWorkingHours(providerId);
      } catch (err) {
        console.error('Failed to fetch working hours:', err);
        this.error = err instanceof Error ? err.message : 'Не вдалося завантажити робочий час';
      } finally {
        this.isLoading = false;
      }
    },

    async updateWorkingHours(providerId: string, hours: WorkingHours[]) {
      this.isLoading = true;
      this.error = null;
      try {
        await api.updateWorkingHours(providerId, hours);
        this.hours = hours;
      } catch (err) {
        console.error('Failed to update working hours:', err);
        this.error = err instanceof Error ? err.message : 'Не вдалося оновити робочий час';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
  },
});