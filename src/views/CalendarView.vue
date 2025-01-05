<template>
  <BaseLayout>
    <div class="flex flex-col h-full">
      <BackButton @click="router.push('/services')" />

      <div class="w-full aspect-[2/1]">
        <img src="@/assets/images/ser.svg" alt="Calendar" class="w-full h-full object-cover illustration" />
      </div>

      <div class="flex-1 flex flex-col px-10">
        <div class="h-[24px]" />

        <div class="text-center space-y-2">
          <h2 class="heading">Вибери дату та час</h2>
          <p class="text-sm text-muted-foreground">
            Можна подивитись мій розклад на найближчі два тижні
          </p>
        </div>

        <div class="h-[32px]" />

        <!-- Calendar -->
        <div class="glass-card rounded-md overflow-hidden mb-5">
          <!-- Dates Slider -->
          <div class="bg-white/5 backdrop-blur-sm p-3 relative">
            <!-- Left Scroll Indicator -->
            <div 
              class="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0f172a]/50 via-[#0f172a]/20 to-transparent pointer-events-none z-10 transition-opacity duration-200"
              :class="[showLeftGradient ? 'opacity-100' : 'opacity-0']"
            ></div>
            
            <!-- Right Scroll Indicator -->
            <div 
              class="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0f172a]/50 via-[#0f172a]/20 to-transparent pointer-events-none z-10 transition-opacity duration-200"
              :class="[showRightGradient ? 'opacity-100' : 'opacity-0']"
            ></div>

            <div class="overflow-x-auto scrollbar-hide relative" @scroll="handleScroll">
              <div class="inline-flex gap-2 px-0.5">
                <div 
                  v-for="date in availableDates" 
                  :key="date.toISOString()"
                  class="min-w-[40px]"
                >
                  <button
                    type="button"
                    class="w-full flex flex-col items-center gap-1 p-2 rounded-md transition-colors"
                    :class="[
                      isDateSelected(date) ? 'bg-primary text-primary-foreground' : 'hover:bg-white/5',
                      !isDateAvailable(date) ? 'opacity-50 cursor-not-allowed' : ''
                    ]"
                    :disabled="!isDateAvailable(date)"
                    @click="selectDate(date)"
                  >
                    <span class="text-xs text-muted-foreground">{{ formatWeekday(date) }}</span>
                    <span class="text-base font-medium">{{ formatDay(date) }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Time Slots -->
          <div v-if="selectedDate && timeSlots.length > 0" class="p-3 space-y-4">
            <div v-for="(group, label) in groupedTimeSlots" :key="label">
              <div class="text-sm text-muted-foreground mb-2">{{ label }}</div>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="slot in group"
                  :key="slot"
                  type="button"
                  class="p-2 text-sm text-center rounded-md transition-colors"
                  :class="[
                    isTimeSelected(slot) ? 'bg-primary text-primary-foreground' : 'hover:bg-white/5'
                  ]"
                  @click="selectTime(slot)"
                >
                  {{ slot }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          :disabled="!selectedDate || !selectedTime"
          class="w-full"
          @click="handleSubmit"
        >
          Записатись
        </Button>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import BaseLayout from '@/components/shared/BaseLayout.vue';
import Button from '@/components/Button.vue';
import BackButton from '@/components/ui/BackButton.vue';

const router = useRouter();
const availableDates = ref<Date[]>([]);
const selectedDate = ref<Date | null>(null);
const selectedTime = ref<string | null>(null);
const timeSlots = ref<string[]>([]);

const showLeftGradient = ref(false);
const showRightGradient = ref(true);

const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  showLeftGradient.value = target.scrollLeft > 0;
  showRightGradient.value = target.scrollLeft < (target.scrollWidth - target.clientWidth);
};

const formatWeekday = (date: Date) => {
  return format(date, 'EEE', { locale: uk });
};

const formatDay = (date: Date) => {
  return format(date, 'dd');
};

const isDateSelected = (date: Date) => {
  if (!selectedDate.value) return false;
  return format(date, 'yyyy-MM-dd') === format(selectedDate.value, 'yyyy-MM-dd');
};

const isDateAvailable = (date: Date) => {
  // Временно все даты доступны
  return true;
};

const isTimeSelected = (time: string) => {
  return selectedTime.value === time;
};

const groupedTimeSlots = computed(() => {
  const groups: Record<string, string[]> = {
    'Ранок': [],
    'День': [],
    'Вечір': []
  };

  timeSlots.value.forEach(time => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 12) {
      groups['Ранок'].push(time);
    } else if (hour < 17) {
      groups['День'].push(time);
    } else {
      groups['Вечір'].push(time);
    }
  });

  // Удаляем пустые группы
  return Object.fromEntries(
    Object.entries(groups).filter(([_, slots]) => slots.length > 0)
  );
});

const selectDate = (date: Date) => {
  selectedDate.value = date;
  selectedTime.value = null;
  
  // Временные данные для тайм-слотов
  timeSlots.value = [
    '09:00', '09:30', '10:00',
    '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00',
    '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00',
    '16:30',
    '17:00', '17:30'
  ];
};

const selectTime = (time: string) => {
  selectedTime.value = time;
};

const handleSubmit = () => {
  if (!selectedDate.value || !selectedTime.value) return;
  router.push('/confirm');
};

onMounted(() => {
  // Временные данные для тестирования
  availableDates.value = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  // Автоматически выбираем первую доступную дату
  const firstAvailableDate = availableDates.value.find(date => isDateAvailable(date));
  if (firstAvailableDate) {
    selectDate(firstAvailableDate);
  }
});
</script>
