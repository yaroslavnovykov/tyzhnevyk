<template>
  <BaseLayout>
    <div class="text-center">
      <div class="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 class="h-6 w-6 text-primary" />
      </div>

      <h2 class="text-2xl font-bold mb-2">Запис підтверджено!</h2>
      <p class="text-muted-foreground mb-6">
        Чекаємо вас на {{ selectedService?.name.toLowerCase() }}
      </p>

      <div class="bg-muted/30 rounded-lg p-4 mb-6 text-left">
        <div class="space-y-3">
          <div>
            <div class="text-sm text-muted-foreground">Послуга</div>
            <div class="font-medium">{{ selectedService?.name }}</div>
          </div>
          <div>
            <div class="text-sm text-muted-foreground">Дата та час</div>
            <div class="font-medium">{{ formatDateTime(selectedDateTime) }}</div>
          </div>
          <div>
            <div class="text-sm text-muted-foreground">Тривалість</div>
            <div class="font-medium">{{ selectedService?.duration }} хв</div>
          </div>
          <div>
            <div class="text-sm text-muted-foreground">Вартість</div>
            <div class="font-medium">{{ selectedService?.price }} грн</div>
          </div>
        </div>
      </div>

      <Button variant="primary" @click="router.push('/')" class="w-full">
        На головну
      </Button>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBookingStore } from '@/stores/booking';
import { CheckCircle2 } from 'lucide-vue-next';
import Button from '@/components/Button.vue';
import BaseLayout from '@/components/shared/BaseLayout.vue';

const router = useRouter();
const bookingStore = useBookingStore();

const selectedService = computed(() => bookingStore.selectedService);
const selectedDateTime = computed(() => bookingStore.selectedDateTime);

function formatDateTime(date: Date | null): string {
  if (!date) return '';
  return new Intl.DateTimeFormat('uk-UA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
}
</script>