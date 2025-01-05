<template>
  <BaseLayout>
    <div class="flex flex-col h-full">
      <BackButton @click="router.push('/services')" />

      <div class="w-full aspect-[2/1]">
        <img src="@/assets/images/ser.svg" alt="Appointments" class="w-full h-full object-cover" />
      </div>

      <div class="flex-1 flex flex-col px-10">
        <div class="h-[24px]" />

        <div class="text-center space-y-2">
          <h2 class="heading">{{ appointments.length ? 'Мої записи' : 'Поки немає записів' }}</h2>
          <p class="text-sm text-muted-foreground">
            {{ appointments.length ? 'Ваші заплановані та минулі записи' : 'Оберіть послугу та запишіться на зручний час' }}
          </p>
        </div>

        <div class="h-[32px]" />

        <template v-if="appointments.length">
          <!-- Appointments List -->
          <div class="divide-y divide-border">
            <!-- Loading State -->
            <template v-if="isLoading">
              <div v-for="n in 3" :key="n" class="py-4">
                <SkeletonCard />
              </div>
            </template>

            <!-- Loaded State -->
            <template v-else>
              <div 
                v-for="appointment in appointments" 
                :key="appointment.id"
                class="py-4"
              >
                <AppointmentCard
                  :appointment="appointment"
                  @click="router.push(`/appointments/${appointment.id}`)"
                />
              </div>
            </template>
          </div>
        </template>

        <template v-else>
          <div class="flex-1" />
          <Button variant="primary" class="w-full mb-5" @click="router.push('/services')">
            Обрати послугу
          </Button>
        </template>
      </div>

      <div class="h-[32px]" />
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/services/api';
import type { Appointment } from '@/types';
import BaseLayout from '@/components/shared/BaseLayout.vue';
import BackButton from '@/components/ui/BackButton.vue';
import AppointmentCard from '@/components/ui/AppointmentCard.vue';
import Button from '@/components/Button.vue';
import SkeletonCard from '@/components/ui/SkeletonCard.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const appointments = ref<Appointment[]>([]);
const isLoading = ref(true);

const fetchAppointments = async () => {
  try {
    const appointmentsData = await api.getAppointments(authStore.user!.id);
    appointments.value = appointmentsData;
  } catch (error) {
    console.error('Failed to load appointments:', error);
  } finally {
    isLoading.value = false;
  }
};

// Загружаем записи при монтировании
onMounted(fetchAppointments);

// Обновляем записи при изменении маршрута
watch(
  () => route.path,
  () => {
    if (route.name === 'appointments') {
      fetchAppointments();
    }
  },
  { immediate: true }
);
</script>