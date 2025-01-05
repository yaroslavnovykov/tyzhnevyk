<template>
  <BaseLayout>
    <div class="flex flex-col h-full">
      <div class="w-full aspect-[2/1]">
        <img src="@/assets/images/ser.svg" alt="Confirmation" class="w-full h-full object-cover" />
      </div>

      <div class="flex-1 flex flex-col px-10">
        <div class="h-[24px]" />

        <div class="text-center space-y-2">
          <h2 class="heading">Запис підтверджено!</h2>
          <p class="text-sm text-muted-foreground">
            Чекаємо вас на {{ selectedService?.name.toLowerCase() }}
          </p>
        </div>

        <div class="h-[32px]" />

        <div class="glass-card rounded-md p-4 mb-5">
          <div class="space-y-4">
            <div>
              <p class="text-sm text-muted-foreground">Послуга</p>
              <p class="font-medium">{{ selectedService?.name }}</p>
            </div>

            <div>
              <p class="text-sm text-muted-foreground">Дата та час</p>
              <p class="font-medium">{{ formatDateTime(selectedDateTime) }}</p>
            </div>

            <div>
              <p class="text-sm text-muted-foreground">Тривалість</p>
              <p class="font-medium">{{ formatDuration(selectedService?.duration || 0) }}</p>
            </div>

            <div>
              <p class="text-sm text-muted-foreground">Вартість</p>
              <p class="font-medium">{{ selectedService?.price }} грн</p>
            </div>
          </div>
        </div>

        <Button variant="primary" @click="router.push('/')" class="w-full">
          На головну
        </Button>
      </div>

      <div class="h-[32px]" />
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useBookingStore } from '@/stores/booking';
import BaseLayout from '@/components/shared/BaseLayout.vue';
import Button from '@/components/Button.vue';
import { formatDuration } from '@/utils/format';

const router = useRouter();
const bookingStore = useBookingStore();
const { selectedService, selectedDateTime } = bookingStore;

const formatDateTime = (date: Date | null) => {
  if (!date) return '';
  
  return new Date(date).toLocaleDateString('uk-UA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(' р.', '');
};
</script>