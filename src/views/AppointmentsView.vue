<template>
  <BaseLayout>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Мої записи</h1>
      <button
        @click="router.push('/services')"
        class="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
      >
        <Plus class="h-4 w-4" />
      </button>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center">
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
    </div>

    <div v-else-if="error" class="text-center">
      <p class="text-destructive mb-4">{{ error }}</p>
      <Button variant="primary" @click="fetchAppointments">
        Спробувати знову
      </Button>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="appointment in appointments"
        :key="appointment.id"
        class="bg-muted/30 rounded-lg p-4"
      >
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-medium">{{ appointment.service_name }}</h3>
          <span :class="[
            'text-xs px-2 py-1 rounded-full',
            appointment.status === 'confirmed' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
          ]">
            {{ formatStatus(appointment.status) }}
          </span>
        </div>
        <p class="text-sm text-muted-foreground">
          {{ formatDateTime(appointment.startTime) }}
        </p>
        <div class="mt-4 flex justify-end gap-2">
          <button
            v-if="appointment.status === 'pending'"
            @click="cancelAppointment(appointment.id)"
            class="text-sm text-destructive hover:text-destructive/80"
          >
            Скасувати
          </button>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Plus, Loader2 } from 'lucide-vue-next';
import BaseLayout from '@/components/shared/BaseLayout.vue';
import Button from '@/components/Button.vue';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import type { Appointment } from '@/types';

const router = useRouter();
const authStore = useAuthStore();
const appointments = ref<Appointment[]>([]);
const isLoading = ref(true);
const error = ref('');

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('uk-UA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
}

function formatStatus(status: string): string {
  const statuses: Record<string, string> = {
    pending: 'Очікує',
    confirmed: 'Підтверджено',
    cancelled: 'Скасовано',
    completed: 'Завершено'
  };
  return statuses[status] || status;
}

async function fetchAppointments() {
  if (!authStore.user) {
    error.value = 'Увійдіть, щоб переглянути записи';
    return;
  }

  isLoading.value = true;
  error.value = '';
  try {
    const data = await api.getAppointments(authStore.user.id);
    appointments.value = data;
  } catch (err) {
    error.value = 'Не вдалося завантажити записи';
    console.error('Failed to fetch appointments:', err);
  } finally {
    isLoading.value = false;
  }
}

async function cancelAppointment(id: string) {
  try {
    await api.cancelAppointment(id);
    await fetchAppointments();
  } catch (err) {
    console.error('Failed to cancel appointment:', err);
  }
}

onMounted(fetchAppointments);
</script>