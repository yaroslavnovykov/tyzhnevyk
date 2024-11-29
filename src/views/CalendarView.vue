<template>
  <BaseLayout>
    <div class="mb-6 flex items-center">
      <button
        class="mr-2 inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground"
        @click="router.push('/services')"
      >
        <ArrowLeft class="h-4 w-4" />
      </button>
      <h1 class="text-2xl font-bold">Оберіть час</h1>
    </div>

    <!-- Calendar -->
    <div class="mb-8 bg-muted/30 rounded-lg p-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-medium">
          {{ formatMonth(selectedDate) }}
        </h2>
        <div class="flex gap-1">
          <button
            class="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground"
            @click="previousMonth"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>
          <button
            class="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground"
            @click="nextMonth"
          >
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Days Grid -->
      <div class="grid grid-cols-7 gap-1 mb-4">
        <div
          v-for="day in daysOfWeek"
          :key="day"
          class="text-center text-sm text-muted-foreground"
        >
          {{ day }}
        </div>
        <button
          v-for="date in calendarDays"
          :key="date.toISOString()"
          :class="[
            'inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9',
            isToday(date) ? 'bg-primary text-primary-foreground' : '',
            isSameMonth(date, selectedDate) ? '' : 'text-muted-foreground opacity-50',
            isSameDay(date, selectedDate) ? 'bg-primary-light text-primary-foreground' : '',
          ]"
          @click="selectDate(date)"
        >
          {{ date.getDate() }}
        </button>
      </div>

      <!-- Time Slots -->
      <div class="space-y-2">
        <button
          v-for="time in availableTimeSlots"
          :key="time.toISOString()"
          :class="[
            'w-full text-left px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground',
            isSameTime(time, selectedTime) ? 'bg-primary text-primary-foreground' : '',
          ]"
          @click="selectTime(time)"
        >
          {{ formatTime(time) }}
        </button>
      </div>
    </div>

    <!-- Confirm Button -->
    <Button
      variant="primary"
      :disabled="!selectedTime"
      @click="confirmBooking"
      class="w-full"
    >
      Підтвердити
    </Button>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import BaseLayout from '@/components/shared/BaseLayout.vue';
import Button from '@/components/Button.vue';
import { useBookingStore } from '@/stores/booking';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  addMinutes,
  setHours,
  setMinutes
} from 'date-fns';

const router = useRouter();
const bookingStore = useBookingStore();
const selectedDate = ref(new Date());
const selectedTime = ref<Date | null>(null);

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

const calendarDays = computed(() => {
  const start = startOfWeek(startOfMonth(selectedDate.value), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(selectedDate.value), { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
});

const availableTimeSlots = computed(() => {
  const slots: Date[] = [];
  let time = setMinutes(setHours(selectedDate.value, 9), 0); // Start at 9:00
  const end = setMinutes(setHours(selectedDate.value, 18), 0); // End at 18:00

  while (time <= end) {
    slots.push(new Date(time));
    time = addMinutes(time, 30);
  }
  return slots;
});

function formatMonth(date: Date): string {
  return new Intl.DateTimeFormat('uk-UA', { month: 'long' }).format(date);
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('uk-UA', { hour: 'numeric', minute: 'numeric' }).format(date);
}

function previousMonth() {
  selectedDate.value = subMonths(selectedDate.value, 1);
}

function nextMonth() {
  selectedDate.value = addMonths(selectedDate.value, 1);
}

function selectDate(date: Date) {
  selectedDate.value = date;
  selectedTime.value = null;
}

function selectTime(time: Date) {
  selectedTime.value = time;
}

function isSameTime(date1: Date, date2: Date | null): boolean {
  if (!date2) return false;
  return date1.getHours() === date2.getHours() && 
         date1.getMinutes() === date2.getMinutes();
}

function confirmBooking() {
  if (!selectedTime.value) return;
  bookingStore.setSelectedDateTime(selectedTime.value);
  router.push('/confirm');
}
</script>