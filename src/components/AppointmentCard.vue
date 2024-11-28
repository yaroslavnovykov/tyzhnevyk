<template>
  <div class="card bg-primary/5 hover:bg-primary/10 transition-colors">
    <div class="card-body p-4">
      <!-- More Actions Button -->
      <button
        v-if="!isPast && appointment.status !== 'cancelled'"
        class="btn btn-ghost btn-circle btn-sm absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
        @click.stop="showActions = true"
      >
        <MoreVertical class="h-4 w-4" />
      </button>

      <div class="flex justify-between items-start">
        <h3 class="font-medium">{{ appointment.service_name }}</h3>
        <div class="font-medium">
          {{ formatCurrency(appointment.service_price || 0) }}
        </div>
      </div>

      <div class="space-y-1 text-muted-foreground text-sm">
        <div class="flex items-center">
          <Calendar class="h-4 w-4 mr-2" />
          {{ formatDate(appointment.startTime, "d MMMM', 'EEEE") }}
        </div>
        <div class="flex items-center">
          <Clock class="h-4 w-4 mr-2" />
          {{ formatDate(appointment.startTime, 'HH:mm') }} - {{ formatDate(appointment.endTime, 'HH:mm') }}
        </div>
      </div>

      <!-- Status Badge -->
      <div 
        v-if="appointment.status === 'pending' || appointment.status === 'cancelled'"
        class="badge absolute top-2 right-2"
        :class="[
          appointment.status === 'pending' ? 'badge-warning' : 'badge-error'
        ]"
      >
        {{ appointment.status === 'pending' ? 'Очікує' : 'Скасовано' }}
      </div>
    </div>
  </div>

  <!-- Actions Modal -->
  <dialog :open="showActions" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Керування записом</h3>
      <p class="py-4">{{ formatDate(appointment.startTime, "d MMMM', 'HH:mm") }}</p>
      
      <div class="space-y-2">
        <button 
          @click="handleReschedule"
          class="btn btn-primary w-full"
        >
          <CalendarClock class="h-4 w-4 mr-2" />
          Перенести запис
        </button>

        <button 
          @click="confirmCancel"
          class="btn btn-error w-full"
        >
          <X class="h-4 w-4 mr-2" />
          Скасувати запис
        </button>
      </div>

      <div class="modal-action">
        <button class="btn" @click="showActions = false">Закрити</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop" @click="showActions = false">
      <button>close</button>
    </form>
  </dialog>

  <!-- Cancel Confirmation Modal -->
  <dialog :open="showCancelConfirm" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <h3 class="font-bold text-lg text-error">Скасувати запис?</h3>
      <p class="py-4">Ця дія незворотна. Ви впевнені, що хочете скасувати запис?</p>
      
      <div class="modal-action">
        <button 
          class="btn"
          @click="showCancelConfirm = false"
        >
          Ні, залишити
        </button>
        <button
          class="btn btn-error"
          @click="handleCancel"
          :disabled="isLoading"
        >
          <template v-if="isLoading">
            <span class="loading loading-spinner"></span>
            Скасування...
          </template>
          <template v-else>
            Так, скасувати
          </template>
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop" @click="showCancelConfirm = false">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Calendar, Clock, MoreVertical, CalendarClock, X } from 'lucide-vue-next';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';
import { api } from '@/services/api';
import { useAppointmentStore } from '@/stores/appointments';
import type { Appointment } from '@/types';

const props = defineProps<{
  appointment: Appointment;
  isPast?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update'): void;
}>();

const router = useRouter();
const appointmentStore = useAppointmentStore();
const showActions = ref(false);
const showCancelConfirm = ref(false);
const isLoading = ref(false);

const formatDate = (date: Date, pattern: string) => {
  return format(date, pattern, { locale: uk });
};

const handleReschedule = () => {
  showActions.value = false;
  appointmentStore.setSelectedService({
    id: props.appointment.serviceId,
    name: props.appointment.service_name || '',
    duration: props.appointment.service_duration || 60,
    price: props.appointment.service_price || 0,
    description: '',
    providerId: props.appointment.providerId,
  });
  router.push(`/calendar/${props.appointment.serviceId}`);
};

const confirmCancel = () => {
  showActions.value = false;
  showCancelConfirm.value = true;
};

const handleCancel = async () => {
  isLoading.value = true;
  try {
    await api.updateAppointmentStatus(props.appointment.id, 'cancelled');
    showCancelConfirm.value = false;
    emit('update');
  } catch (err) {
    console.error('Failed to cancel appointment:', err);
  } finally {
    isLoading.value = false;
  }
};
</script>