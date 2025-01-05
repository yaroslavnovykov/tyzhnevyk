<template>
  <BaseLayout>
    <div class="flex flex-col h-full">
      <BackButton @click="goBack" />

      <div class="w-full aspect-[2/1]">
        <img src="@/assets/images/ser.svg" alt="Appointment Details" class="w-full h-full object-cover" />
      </div>

      <div class="flex-1 flex flex-col px-10">
        <div class="h-[24px]" />

        <div class="text-center space-y-2">
          <h2 class="heading">Запис</h2>
          <p class="text-sm text-muted-foreground">
            Деталі вашого запису
          </p>
        </div>

        <div class="h-[32px]" />

        <div class="glass-card rounded-md p-5 mb-5">
          <div class="space-y-6">
            <!-- Service Info -->
            <div>
              <h3 class="font-medium text-lg">{{ appointment?.service_name }}</h3>
              <div class="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <span>{{ appointment?.service?.duration }} хв</span>
                <span class="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span>{{ appointment?.service?.price }} грн</span>
              </div>
            </div>

            <!-- Status -->
            <div>
              <span :class="[
                'text-xs px-2 py-0.5 rounded',
                appointment?.status === 'confirmed' ? 'bg-[#6366F1]/10 text-[#6366F1]' :
                appointment?.status === 'cancelled' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                'bg-muted/10 text-muted-foreground'
              ]">
                {{ formatStatus(appointment?.status) }}
              </span>
            </div>

            <!-- Date & Time -->
            <div class="space-y-1">
              <p class="text-sm text-muted-foreground">Дата та час</p>
              <p class="font-medium">{{ formatDateTime(appointment?.start_time) }}</p>
            </div>
          </div>

          <!-- Cancel Button -->
          <div v-if="appointment?.status === 'confirmed'" class="mt-8">
            <Button
              variant="secondary"
              class="w-full text-destructive hover:text-destructive"
              @click="showCancelConfirm = true"
            >
              Скасувати запис
            </Button>
          </div>
        </div>
      </div>

      <div class="h-[32px]" />
    </div>
  </BaseLayout>

  <!-- Cancel Confirmation Dialog -->
  <div v-if="showCancelConfirm" class="fixed inset-0 z-50">
    <div class="fixed inset-0 bg-background/80 backdrop-blur-sm" />
    <div class="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-6">
      <div class="rounded-lg border bg-background shadow-lg">
        <div class="p-6 space-y-4">
          <div class="text-center">
            <h2 class="text-lg font-semibold text-foreground">Скасувати запис?</h2>
            <p class="text-sm text-muted-foreground mt-2">
              Ця дія незворотна. Ви впевнені, що хочете скасувати запис?
            </p>
          </div>
          <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              variant="secondary"
              @click="showCancelConfirm = false"
            >
              Ні, залишити
            </Button>
            <Button
              variant="primary"
              class="bg-destructive hover:bg-destructive/90"
              :disabled="isLoading"
              @click="handleCancel"
            >
              {{ isLoading ? 'Скасування...' : 'Так, скасувати' }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/services/api';
import type { Appointment } from '@/types';
import BaseLayout from '@/components/shared/BaseLayout.vue';
import BackButton from '@/components/ui/BackButton.vue';
import Button from '@/components/Button.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const appointment = ref<Appointment | null>(null);
const showCancelConfirm = ref(false);
const isLoading = ref(false);

const goBack = () => {
  router.push('/appointments');
};

onMounted(async () => {
  try {
    const appointmentsData = await api.getAppointments(authStore.user!.id);
    appointment.value = appointmentsData.find(a => a.id === route.params.id);
    if (!appointment.value) {
      goBack();
    }
  } catch (error) {
    console.error('Failed to load appointment:', error);
    goBack();
  }
});

function formatDateTime(date: Date | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('uk-UA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(' р.', '');
}

function formatStatus(status: string | undefined): string {
  if (!status) return '';
  const statuses: Record<string, string> = {
    pending: 'Очікує',
    confirmed: 'Підтверджено',
    cancelled: 'Скасовано',
    completed: 'Завершено'
  };
  return statuses[status] || status;
}

async function handleCancel() {
  if (!appointment.value?.id) return;
  
  isLoading.value = true;
  try {
    await api.cancelAppointment(appointment.value.id);
    await api.getAppointments(authStore.user!.id);
    goBack();
  } catch (error) {
    console.error('Failed to cancel appointment:', error);
  } finally {
    isLoading.value = false;
  }
}
</script> 