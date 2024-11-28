<template>
  <div class="min-h-screen bg-background">
    <div class="max-w-[380px] mx-auto p-4">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">Вітаю, {{ authStore.user?.name || 'Майстер' }}!</h1>
          <p class="text-sm text-muted-foreground">{{ formatDate(new Date(), "EEEE',' d MMMM") }}</p>
        </div>
        <button
          @click="router.push('/provider/settings')"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground"
        >
          <Settings class="h-4 w-4" />
        </button>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-primary/5 p-4 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <Calendar class="h-4 w-4 text-primary" />
            <span class="text-xs text-muted-foreground">Сьогодні</span>
          </div>
          <div class="text-2xl font-bold">{{ todayAppointments.length }}</div>
          <div class="text-sm text-muted-foreground">записів</div>
        </div>

        <div class="bg-primary/5 p-4 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <Wallet class="h-4 w-4 text-primary" />
            <span class="text-xs text-muted-foreground">Дохід</span>
          </div>
          <div class="text-2xl font-bold">{{ formatCurrency(todayIncome) }}</div>
          <div class="text-sm text-muted-foreground">за сьогодні</div>
        </div>
      </div>

      <!-- Pending Appointments -->
      <div v-if="pendingAppointments.length > 0" class="mb-6">
        <h2 class="text-lg font-medium mb-4">Очікують підтвердження</h2>
        <div class="space-y-4">
          <div
            v-for="appointment in pendingAppointments"
            :key="appointment.id"
            class="bg-primary/5 p-4 rounded-lg"
          >
            <div class="flex items-start justify-between mb-3">
              <div>
                <h4 class="font-medium">{{ appointment.service_name }}</h4>
                <p class="text-sm text-muted-foreground">
                  {{ formatDate(appointment.startTime, "d MMMM', 'HH:mm") }}
                </p>
                <p class="text-sm text-muted-foreground">
                  {{ appointment.client?.name || 'Без імені' }} · {{ appointment.client?.phone }}
                </p>
              </div>
              <div class="text-right">
                <div class="font-medium">{{ formatCurrency(appointment.service_price || 0) }}</div>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                @click="updateAppointmentStatus(appointment.id, 'confirmed')"
                class="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium h-10 px-4 py-2 bg-primary text-white shadow hover:bg-primary-light"
                :disabled="isUpdating"
              >
                <Check class="h-4 w-4 mr-2" />
                Підтвердити
              </button>
              <button
                @click="updateAppointmentStatus(appointment.id, 'cancelled')"
                class="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium h-10 px-4 py-2 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground"
                :disabled="isUpdating"
              >
                <X class="h-4 w-4 mr-2" />
                Скасувати
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Today's Appointments -->
      <div class="bg-primary/5 rounded-lg overflow-hidden">
        <div class="p-4 border-b flex items-center justify-between">
          <h2 class="font-medium">Сьогоднішні записи</h2>
          <button
            @click="router.push('/provider/schedule')"
            class="text-sm text-primary hover:text-primary-light"
          >
            Календар
          </button>
        </div>

        <div v-if="isLoading" class="flex justify-center py-8">
          <Loader2 class="h-8 w-8 animate-spin text-primary" />
        </div>

        <div
          v-else-if="todayAppointments.length === 0"
          class="text-center py-8"
        >
          <CalendarOff class="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p class="text-muted-foreground">На сьогодні записів немає</p>
        </div>

        <div v-else>
          <!-- Active Appointments -->
          <div class="divide-y divide-primary/10">
            <div
              v-for="appointment in activeAppointments"
              :key="appointment.id"
              class="p-4 hover:bg-primary/10 transition-colors"
            >
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{{ formatDate(appointment.startTime, 'HH:mm') }}</span>
                    <span
                      v-if="appointment.status === 'pending'"
                      class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-status-pending-bg text-status-pending-text"
                    >
                      Очікує
                    </span>
                  </div>
                  <h4 class="font-medium mt-1">{{ appointment.service_name }}</h4>
                  <p class="text-sm text-muted-foreground">
                    {{ appointment.client?.name || 'Без імені' }} · {{ appointment.client?.phone }}
                  </p>
                </div>
                <div class="text-right">
                  <div class="font-medium">{{ formatCurrency(appointment.service_price || 0) }}</div>
                  <div class="text-sm text-muted-foreground">
                    {{ appointment.service_duration }} хв
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Cancelled Appointments -->
          <div v-if="cancelledAppointments.length > 0">
            <button
              @click="showCancelled = !showCancelled"
              class="w-full p-4 text-left text-sm text-muted-foreground hover:bg-primary/10 transition-colors flex items-center"
            >
              <ChevronRight
                class="h-4 w-4 mr-2 transition-transform"
                :class="{ 'rotate-90': showCancelled }"
              />
              Скасовані записи ({{ cancelledAppointments.length }})
            </button>

            <div v-show="showCancelled" class="divide-y divide-primary/10">
              <div
                v-for="appointment in cancelledAppointments"
                :key="appointment.id"
                class="p-4 hover:bg-primary/10 transition-colors bg-primary/5"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-medium">{{ formatDate(appointment.startTime, 'HH:mm') }}</span>
                      <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-status-cancelled-bg text-status-cancelled-text">
                        Скасовано
                      </span>
                    </div>
                    <h4 class="font-medium mt-1">{{ appointment.service_name }}</h4>
                    <p class="text-sm text-muted-foreground">
                      {{ appointment.client?.name || 'Без імені' }} · {{ appointment.client?.phone }}
                    </p>
                  </div>
                  <div class="text-right">
                    <div class="font-medium">{{ formatCurrency(appointment.service_price || 0) }}</div>
                    <div class="text-sm text-muted-foreground">
                      {{ appointment.service_duration }} хв
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 gap-4 mt-6">
        <button
          @click="router.push('/provider/services')"
          class="bg-primary/5 p-4 rounded-lg hover:bg-primary/10 transition-colors text-left group"
        >
          <div class="flex items-center justify-between mb-2">
            <Scissors class="h-4 w-4 text-primary transition-colors" />
            <span class="text-xs text-muted-foreground">Послуги та ціни</span>
          </div>
          <p class="text-sm font-medium">
            Керування послугами
          </p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Calendar, Settings, Loader2, CalendarOff,
  Scissors, Wallet, Check, X, ChevronRight
} from 'lucide-vue-next';
import { format, isToday } from 'date-fns';
import { uk } from 'date-fns/locale';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/services/api';
import { formatCurrency } from '@/lib/utils';
import type { Appointment } from '@/types';

const router = useRouter();
const authStore = useAuthStore();
const appointments = ref<Appointment[]>([]);
const isLoading = ref(true);
const isUpdating = ref(false);
const showCancelled = ref(false);

const todayAppointments = computed(() => 
  appointments.value
    .filter(a => isToday(a.startTime))
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
);

const activeAppointments = computed(() =>
  todayAppointments.value.filter(a => a.status !== 'cancelled')
);

const cancelledAppointments = computed(() =>
  todayAppointments.value.filter(a => a.status === 'cancelled')
);

const pendingAppointments = computed(() =>
  appointments.value
    .filter(a => a.status === 'pending')
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
);

const todayIncome = computed(() => 
  todayAppointments.value
    .filter(a => a.status !== 'cancelled')
    .reduce((sum, a) => sum + (a.service_price || 0), 0)
);

const formatDate = (date: Date, pattern: string) => {
  return format(date, pattern, { locale: uk });
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

onMounted(async () => {
  if (!authStore.user?.id) {
    router.push('/provider/login');
    return;
  }
  await fetchAppointments();
});
</script>