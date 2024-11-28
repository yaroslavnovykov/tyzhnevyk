<template>
  <div class="min-h-screen bg-gradient-to-br from-primary/10 to-background">
    <div class="max-w-4xl mx-auto p-4">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">Розклад</h1>
          <p class="text-sm text-muted-foreground">Керування записами</p>
        </div>
        <button
          @click="router.push('/provider/dashboard')"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft class="h-4 w-4" />
        </button>
      </div>

      <!-- Calendar Navigation -->
      <div class="bg-card rounded-lg shadow-sm border p-4 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-medium">
            {{ formatDate(currentDate, 'LLLL yyyy') }}
          </h2>
          <div class="flex gap-2">
            <button
              @click="changeMonth(-1)"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronLeft class="h-4 w-4" />
            </button>
            <button
              @click="() => currentDate = new Date()"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium px-2 hover:bg-accent hover:text-accent-foreground"
            >
              Сьогодні
            </button>
            <button
              @click="changeMonth(1)"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 gap-1">
          <!-- Week days -->
          <div
            v-for="day in weekDays"
            :key="day"
            class="text-center text-sm text-muted-foreground py-2"
          >
            {{ day }}
          </div>

          <!-- Calendar days -->
          <button
            v-for="date in calendarDays"
            :key="date.toISOString()"
            class="aspect-square p-1 relative hover:bg-accent hover:text-accent-foreground rounded-md"
            :class="[
              isToday(date) && 'font-bold text-primary',
              isSameDay(date, selectedDate) && 'bg-primary text-primary-foreground hover:bg-primary',
              !isSameMonth(date, currentDate) && 'text-muted-foreground/50'
            ]"
            @click="handleDateSelect(date)"
          >
            <span class="text-sm">{{ formatDate(date, 'd') }}</span>
            <div
              v-if="getAppointmentsForDate(date).length"
              class="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5"
            >
              <div
                v-for="_ in Math.min(getAppointmentsForDate(date).length, 3)"
                :key="_"
                class="w-1 h-1 rounded-full bg-current opacity-60"
              />
            </div>
          </button>
        </div>
      </div>

      <!-- Appointments List -->
      <div v-if="selectedDate" class="space-y-4">
        <h3 class="font-medium">
          {{ formatDate(selectedDate, "d MMMM', 'EEEE") }}
        </h3>

        <div v-if="isLoading" class="flex justify-center py-8">
          <Loader2 class="h-8 w-8 animate-spin text-primary" />
        </div>

        <div
          v-else-if="selectedDateAppointments.length === 0"
          class="text-center py-8 bg-card rounded-lg border"
        >
          <CalendarOff class="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p class="text-muted-foreground">На цей день записів немає</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="appointment in selectedDateAppointments"
            :key="appointment.id"
            class="bg-card p-4 rounded-lg shadow-sm border"
          >
            <div class="flex items-start justify-between">
              <div>
                <h4 class="font-medium">{{ appointment.service_name }}</h4>
                <p class="text-sm text-muted-foreground">
                  {{ formatDate(appointment.startTime, 'HH:mm') }} - {{ formatDate(appointment.endTime, 'HH:mm') }}
                </p>
                <p class="text-sm text-muted-foreground mt-1">
                  Клієнт: {{ appointment.client?.name || 'Без імені' }}
                </p>
                <p class="text-sm text-muted-foreground">
                  Телефон: {{ appointment.client?.phone }}
                </p>
              </div>
              <div class="text-right">
                <div class="font-medium">{{ formatCurrency(appointment.service_price || 0) }}</div>
                <span
                  :class="[
                    'inline-block px-2 py-1 text-xs rounded-full mt-1',
                    appointment.status === 'confirmed' ? 'bg-primary/10 text-primary' :
                    appointment.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-muted text-muted-foreground'
                  ]"
                >
                  {{ 
                    appointment.status === 'confirmed' ? 'Підтверджено' :
                    appointment.status === 'pending' ? 'Очікує' :
                    'Скасовано'
                  }}
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div v-if="appointment.status === 'pending'" class="flex gap-2 mt-4">
              <button
                @click="updateAppointmentStatus(appointment.id, 'confirmed')"
                class="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90"
                :disabled="isUpdating"
              >
                <Check class="h-4 w-4 mr-2" />
                Підтвердити
              </button>
              <button
                @click="updateAppointmentStatus(appointment.id, 'cancelled')"
                class="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
                :disabled="isUpdating"
              >
                <X class="h-4 w-4 mr-2" />
                Скасувати
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  ArrowLeft, ChevronLeft, ChevronRight,
  CalendarOff, Loader2, Check, X
} from 'lucide-vue-next';
import { 
  format, addMonths, startOfMonth, endOfMonth, 
  eachDayOfInterval, startOfWeek, endOfWeek,
  isToday, isSameDay, isSameMonth 
} from 'date-fns';
import { uk } from 'date-fns/locale';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/services/api';
import { formatCurrency } from '@/lib/utils';
import type { Appointment } from '@/types';

const router = useRouter();
const authStore = useAuthStore();
const currentDate = ref(new Date());
const selectedDate = ref(new Date());
const appointments = ref<Appointment[]>([]);
const isLoading = ref(true);
const isUpdating = ref(false);

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

const calendarDays = computed(() => {
  const start = startOfWeek(startOfMonth(currentDate.value), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(currentDate.value), { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
});

const selectedDateAppointments = computed(() =>
  appointments.value
    .filter(a => isSameDay(a.startTime, selectedDate.value))
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
);

const formatDate = (date: Date, pattern: string) => {
  return format(date, pattern, { locale: uk });
};

const changeMonth = (delta: number) => {
  currentDate.value = addMonths(currentDate.value, delta);
};

const handleDateSelect = (date: Date) => {
  selectedDate.value = date;
};

const getAppointmentsForDate = (date: Date) => {
  return appointments.value.filter(a => isSameDay(a.startTime, date));
};

const fetchAppointments = async () => {
  if (!authStore.user?.id) return;
  
  isLoading.value = true;
  try {
    const data = await api.getAppointments(authStore.user.id, 'provider');
    appointments.value = data;
  } catch (err) {
    console.error('Failed to fetch appointments:', err);
  } finally {
    isLoading.value = false;
  }
};

const updateAppointmentStatus = async (appointmentId: string, status: 'confirmed' | 'cancelled') => {
  if (!authStore.user?.id) return;

  isUpdating.value = true;
  try {
    await api.updateAppointmentStatus(appointmentId, status);
    await fetchAppointments();
  } catch (err) {
    console.error('Failed to update appointment:', err);
  } finally {
    isUpdating.value = false;
  }
};

// Fetch appointments on mount
if (authStore.user?.id) {
  fetchAppointments();
} else {
  router.push('/provider/login');
}
</script>