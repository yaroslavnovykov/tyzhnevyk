<template>
  <div class="min-h-screen bg-gradient-to-br from-primary/10 to-background">
    <div class="max-w-md mx-auto p-4">
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
        <button
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90"
          @click="window.location.reload()"
        >
          Спробувати знову
        </button>
      </div>

      <template v-else>
        <template v-if="upcomingAppointments.length">
          <h2 class="text-lg font-medium mb-4">Майбутні записи</h2>
          <div class="space-y-3 mb-8">
            <AppointmentCard
              v-for="appointment in upcomingAppointments"
              :key="appointment.id"
              :appointment="appointment"
              @update="fetchAppointments"
            />
          </div>
        </template>

        <template v-if="pastAppointments.length">
          <h2 class="text-lg font-medium mb-4">Історія записів</h2>
          <div class="space-y-3">
            <AppointmentCard
              v-for="appointment in pastAppointments"
              :key="appointment.id"
              :appointment="appointment"
              :is-past="true"
            />
          </div>
        </template>

        <div v-if="!appointments.length" class="text-center py-8">
          <p class="text-muted-foreground mb-4">У вас поки немає записів</p>
          <button
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90"
            @click="router.push('/services')"
          >
            Записатись
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Plus, Loader2 } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useAppointmentStore } from '@/stores/appointments';
import { api } from '@/services/api';
import AppointmentCard from '@/components/AppointmentCard.vue';

const router = useRouter();
const authStore = useAuthStore();
const appointmentStore = useAppointmentStore();
const isLoading = ref(true);
const error = ref('');

const appointments = computed(() => appointmentStore.appointments);

const upcomingAppointments = computed(() => 
  appointments.value
    .filter(a => ['pending', 'confirmed'].includes(a.status))
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
);

const pastAppointments = computed(() => 
  appointments.value
    .filter(a => ['completed', 'cancelled'].includes(a.status))
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
);

const fetchAppointments = async () => {
  if (!authStore.user?.id) {
    isLoading.value = false;
    return;
  }

  try {
    const data = await api.getAppointments(authStore.user.id);
    appointmentStore.setAppointments(data);
  } catch (err) {
    console.error('Failed to fetch appointments:', err);
    error.value = 'Не вдалося завантажити записи';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (!authStore.user) {
    router.push('/phone');
  } else {
    fetchAppointments();
  }
});
</script>