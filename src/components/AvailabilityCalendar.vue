<template>
  <div class="bg-black/[0.03] border border-black/[0.05] rounded-2xl p-4">
    <p class="text-sm font-medium mb-4">Мої найближчі робочі дні</p>
    <div class="grid grid-cols-7 gap-1 text-center">
      <div v-for="day in weekDays" :key="day" class="text-xs text-black/40">
        {{ day }}
      </div>
      <div
        v-for="date in calendarDays"
        :key="date.toISOString()"
        class="relative"
      >
        <div
          class="w-8 h-6 mx-auto flex items-center justify-center text-sm"
          :class="[
            isToday(date) ? 'bg-black text-white rounded-full' : '',
            isPastDate(date) ? 'text-black/40' : '',
            !isWorkingDay(date) ? 'text-black/40' : ''
          ]"
        >
          {{ formatDate(date, 'd') }}
        </div>
        <svg
          v-if="isWorkingDay(date) && !isPastDate(date) && !isToday(date)"
          class="absolute inset-0 w-full h-full"
          viewBox="0 0 32 24"
          fill="none"
        >
          <rect
            x="2"
            y="2"
            width="28"
            height="20"
            rx="10"
            :stroke="getGradientId(date)"
            stroke-width="2"
            stroke-dasharray="96"
            :stroke-dashoffset="getDayLoad(date)"
            pathLength="96"
          />
          <rect
            x="2"
            y="2"
            width="28"
            height="20"
            rx="10"
            stroke="url(#load-gradient)"
            stroke-width="2"
            stroke-dasharray="96"
            :stroke-dashoffset="getDayLoad(date)"
            pathLength="96"
          />
        </svg>
      </div>
    </div>

    <!-- Градиенты -->
    <svg width="0" height="0" class="hidden">
      <defs>
        <linearGradient id="load-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FFB800" />
          <stop offset="100%" stop-color="#FF8A00" />
        </linearGradient>
        <linearGradient id="load-1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FFB800" />
          <stop offset="100%" stop-color="#FF8A00" />
        </linearGradient>
        <linearGradient id="load-2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FF8A00" />
          <stop offset="100%" stop-color="#FF5C00" />
        </linearGradient>
        <linearGradient id="load-3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FFD600" />
          <stop offset="100%" stop-color="#FFB800" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { format, addDays, startOfWeek, isToday as isDateToday, isBefore, startOfDay } from 'date-fns';
import { uk } from 'date-fns/locale';

// Calendar data
const weekDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд'];
const calendarDays = computed(() => {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  return Array.from({ length: 14 }, (_, i) => addDays(start, i));
});

// Helper functions
const formatDate = (date: Date, pattern: string) => {
  return format(date, pattern, { locale: uk });
};

const isToday = (date: Date) => isDateToday(date);

const isPastDate = (date: Date) => {
  return isBefore(date, startOfDay(new Date()));
};

const isWorkingDay = (date: Date) => {
  const day = date.getDay();
  return day !== 0; // Sunday is not working
};

const getDayLoad = (date: Date) => {
  // Demo data - random load between 0 and 96
  // 0 means fully booked (full circle), 96 means empty
  if (isPastDate(date) || !isWorkingDay(date)) return 96;
  return Math.floor(Math.random() * 96);
};

const getGradientId = (date: Date) => {
  // Demo data - random gradient
  const load = getDayLoad(date);
  if (load > 64) return 'url(#load-1)';
  if (load > 32) return 'url(#load-2)';
  return 'url(#load-3)';
};
</script></content>