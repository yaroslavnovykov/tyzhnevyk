<template>
  <BaseLayout>
    <!-- Upcoming Appointments Notification -->
    <div
      v-if="upcomingAppointments.length"
      class="mb-6 bg-primary/10 rounded-lg p-4 border border-primary/20"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium">
            У вас є запис на {{ formatDateTime(upcomingAppointments[0].startTime) }}
          </p>
          <p class="text-sm text-muted-foreground">
            {{ upcomingAppointments[0].service_name }}
          </p>
        </div>
        <button
          class="text-sm text-primary hover:text-primary/80"
          @click="router.push('/appointments')"
        >
          Переглянути
        </button>
      </div>
    </div>

    <!-- Services List -->
    <div class="space-y-4">
      <div
        v-for="service in services"
        :key="service.id"
        class="bg-muted/30 rounded-lg p-4 cursor-pointer hover:bg-muted/40 transition-colors"
        @click="selectService(service)"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium">{{ service.name }}</h3>
            <p class="text-sm text-muted-foreground">{{ service.duration }} хв</p>
          </div>
          <p class="font-medium">{{ service.price }} грн</p>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BaseLayout from '@/components/shared/BaseLayout.vue';
import { useBookingStore } from '@/stores/booking';
import { useAuthStore } from '@/stores/auth';
import type { Service, Appointment } from '@/types';
import { api } from '@/services/api';

const router = useRouter();
const bookingStore = useBookingStore();
const authStore = useAuthStore();
const services = ref<Service[]>([]);
const upcomingAppointments = ref<Appointment[]>([]);

function selectService(service: Service) {
  bookingStore.setSelectedService(service);
  router.push(`/calendar/${service.id}`);
}

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
}

onMounted(async () => {
  try {
    const [servicesData, appointmentsData] = await Promise.all([
      api.getServices(),
      authStore.user ? api.getUpcomingAppointments(authStore.user.id) : Promise.resolve([])
    ]);
    services.value = servicesData;
    upcomingAppointments.value = appointmentsData;
  } catch (err) {
    console.error('Failed to fetch data:', err);
  }
});
</script>