<template>
  <div class="min-h-screen bg-gradient-to-br from-primary/10 to-background">
    <div class="max-w-md mx-auto p-4">
      <div class="mb-6 flex items-center">
        <button
          class="mr-2 inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground"
          @click="router.push('/services')"
        >
          <ArrowLeft class="h-4 w-4" />
        </button>
        <h1 class="text-2xl font-bold">Оберіть час</h1>
      </div>

      <!-- Календар -->
      <div class="mb-8 bg-card rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-medium">
            {{ formatDate(selectedDate, 'LLLL') }}
          </h2>
          <div class="flex gap-1">
            <button
              class="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 hover:bg-accent hover:text-accent-foreground"
              @click="scroll('left')"
            >
              <ChevronLeft class="h-4 w-4" />
            </button>
            <button
              class="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 hover:bg-accent hover:text-accent-foreground"
              @click="scroll('right')"
            >
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div 
          ref="sliderRef"
          class="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory touch-pan-x"
          style="scrollbar-width: none; -ms-overflow-style: none"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div class="flex gap-2 px-0.5">
            <button
              v-for="date in dates"
              :key="date.toISOString()"
              class="h-16 w-14 p-0 flex-shrink-0 snap-start relative hover:bg-primary/10 rounded-md transition-colors"
              :class="[
                isSelectedDate(date) && 'bg-primary text-primary-foreground hover:bg-primary',
                isToday(date) && !isSelectedDate(date) && 'text-primary font-bold'
              ]"
              @click="handleDateSelect(date)"
            >
              <div class="text-center">
                <div class="text-xs mb-1">
                  {{ formatDate(date, 'EEE') }}
                </div>
                <div class="text-base font-medium">
                  {{ formatDate(date, 'd') }}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Доступний час -->
      <div class="bg-card rounded-xl p-4 shadow-sm">
        <h2 class="font-medium mb-4">Доступний час</h2>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="time in timeSlots"
            :key="time.toISOString()"
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 transition-colors"
            :class="[
              selectedTime?.getTime() === time.getTime()
                ? 'bg-primary text-primary-foreground'
                : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
            ]"
            @click="handleTimeSelect(time)"
          >
            {{ formatDate(time, 'HH:mm') }}
          </button>
        </div>
      </div>

      <!-- Кнопка підтвердження -->
      <button
        class="w-full mt-8 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!selectedTime"
        @click="handleContinue"
      >
        Підтвердити запис
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { format, addDays, isSameDay, startOfDay, addMinutes, isToday } from 'date-fns';
import { uk } from 'date-fns/locale';
import { useAppointmentStore } from '@/stores/appointments';

const WORKING_HOURS = {
  start: 9,
  end: 19,
};

const generateTimeSlots = (date: Date, serviceDuration: number = 60) => {
  const slots: Date[] = [];
  let currentSlot = new Date(date);
  currentSlot.setHours(WORKING_HOURS.start, 0, 0, 0);

  while (currentSlot.getHours() < WORKING_HOURS.end) {
    slots.push(new Date(currentSlot));
    currentSlot = addMinutes(currentSlot, serviceDuration);
  }

  return slots;
};

export default defineComponent({
  name: 'CalendarView',
  components: { ArrowLeft, ChevronLeft, ChevronRight },
  setup() {
    const router = useRouter();
    const appointmentStore = useAppointmentStore();
    const selectedDate = ref(startOfDay(new Date()));
    const selectedTime = ref<Date | null>(null);
    const sliderRef = ref<HTMLDivElement | null>(null);
    const touchStart = ref<number>(0);
    const touchEnd = ref<number>(0);

    const dates = computed(() => 
      Array.from({ length: 30 }, (_, i) => addDays(new Date(), i))
    );

    const timeSlots = computed(() => 
      generateTimeSlots(selectedDate.value, appointmentStore.selectedService?.duration)
    );

    onMounted(() => {
      if (!appointmentStore.selectedService) {
        router.push('/services');
      }
    });

    const formatDate = (date: Date, pattern: string) => {
      return format(date, pattern, { locale: uk });
    };

    const isSelectedDate = (date: Date) => isSameDay(date, selectedDate.value);

    const handleDateSelect = (date: Date) => {
      selectedDate.value = date;
      selectedTime.value = null;
    };

    const handleTimeSelect = (time: Date) => {
      selectedTime.value = time;
    };

    const handleContinue = () => {
      if (selectedTime.value) {
        appointmentStore.setSelectedDateTime(selectedTime.value);
        router.push('/confirm');
      }
    };

    const scroll = (direction: 'left' | 'right') => {
      if (sliderRef.value) {
        const scrollAmount = direction === 'left' ? -280 : 280;
        sliderRef.value.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    };

    // Touch handlers for swipe
    const handleTouchStart = (e: TouchEvent) => {
      touchStart.value = e.changedTouches[0].screenX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEnd.value = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = () => {
      const minSwipeDistance = 50;
      const swipeDistance = touchEnd.value - touchStart.value;
      
      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
          scroll('left');
        } else {
          scroll('right');
        }
      }
    };

    return {
      selectedDate,
      selectedTime,
      sliderRef,
      dates,
      timeSlots,
      router,
      formatDate,
      isSelectedDate,
      isToday,
      handleDateSelect,
      handleTimeSelect,
      handleContinue,
      scroll,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
    };
  },
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>