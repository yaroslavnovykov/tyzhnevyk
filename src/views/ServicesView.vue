<template>
  <BaseLayout>
    <div class="flex flex-col h-full">
      <BackButton @click="router.push('/appointments')" />

      <Illustration alt="Services" />

      <div class="flex-1 flex flex-col px-10">
        <div class="h-[24px]" />

        <div class="text-center space-y-2">
          <h2 class="heading">Послуги</h2>
          <p class="text-sm text-muted-foreground">
            Оберіть послугу для запису
          </p>
        </div>

        <div class="h-[32px]" />

        <!-- Upcoming Appointments Notification -->
        <div
          v-if="upcomingAppointments.length"
          class="relative bg-[#C4B5FD] mb-4 rounded-md transition-colors cursor-pointer"
          @click="router.push('/appointments')"
        >
          <div class="flex items-center justify-center gap-2 py-2.5 px-6">
            <p class="text-xs font-medium text-[#3730A3] truncate text-center">
              У вас є запис на {{ formatShortDateTime(upcomingAppointments[0].start_time) }}
            </p>
            <ChevronRight class="h-3.5 w-3.5 text-[#3730A3]" />
          </div>
        </div>

        <!-- Services List -->
        <div class="glass-card rounded-md p-4">
          <div class="divide-y divide-border/5">
            <!-- Loading State -->
            <template v-if="isLoading">
              <div v-for="n in 3" :key="n" class="first:pt-0 pt-3 first:mt-0 mt-3">
                <SkeletonCard />
              </div>
            </template>

            <!-- Loaded State -->
            <template v-else>
              <div 
                v-for="service in services"
                :key="service.id"
                class="first:pt-0 pt-3 first:mt-0 mt-3"
              >
                <ServiceCard
                  :service="service"
                  @select="selectService(service)"
                />
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="h-10" />
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBookingStore } from '@/stores/booking';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/services/api';
import type { Service, Appointment } from '@/types';
import { ChevronRight } from 'lucide-vue-next';
import BaseLayout from '@/components/shared/BaseLayout.vue';
import Button from '@/components/Button.vue';
import BackButton from '@/components/ui/BackButton.vue';
import ServiceCard from '@/components/ui/ServiceCard.vue';
import SkeletonCard from '@/components/ui/SkeletonCard.vue';
import Illustration from '@/components/ui/Illustration.vue';

const router = useRouter();
const bookingStore = useBookingStore();
const authStore = useAuthStore();
const services = ref<Service[]>([]);
const upcomingAppointments = ref<Appointment[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const [servicesData, appointmentsData] = await Promise.all([
      api.getServices(),
      api.getAppointments(authStore.user!.id)
    ]);

    services.value = servicesData;
    upcomingAppointments.value = appointmentsData.filter(a => {
      const isConfirmed = a.status === 'confirmed';
      const isFuture = new Date(a.start_time) > new Date();
      return isConfirmed && isFuture;
    });
  } catch (error) {
    console.error('Failed to load data:', error);
  } finally {
    isLoading.value = false;
  }
});

const selectService = (service: Service) => {
  bookingStore.setSelectedService(service);
  router.push('/calendar');
};

const formatShortDateTime = (date: Date) => {
  return new Date(date).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(' р.', '');
};
</script>
