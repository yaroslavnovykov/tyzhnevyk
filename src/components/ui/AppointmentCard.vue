<template>
  <div
    class="bg-card/80 rounded-md cursor-pointer"
    @click="router.push({ name: 'appointment-details', params: { id: appointment.id } })"
  >
    <div class="flex items-center justify-between p-4 hover:bg-white/5 rounded-md transition-colors">
      <div class="flex-1">
        <h3 class="text-base font-medium">{{ appointment.service_name }}</h3>
        <div class="flex items-center gap-2 mt-1">
          <p class="text-sm text-muted-foreground">
            {{ formatDateTime(appointment.start_time) }}
          </p>
          <span :class="[
            'text-xs px-2 py-0.5 rounded',
            appointment.status === 'confirmed' ? 'bg-[#6366F1]/10 text-[#6366F1]' :
            appointment.status === 'cancelled' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
            'bg-muted/10 text-muted-foreground'
          ]">
            {{ formatStatus(appointment.status) }}
          </span>
        </div>
      </div>

      <ChevronRight class="h-4 w-4 text-muted-foreground" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ChevronRight } from 'lucide-vue-next';
import type { Appointment } from '@/types';

const router = useRouter();

defineProps<{
  appointment: Appointment;
}>();

function formatDateTime(date: Date): string {
  return new Date(date).toLocaleDateString('uk-UA', { 
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(' р.', '');
}

function formatStatus(status: string): string {
  const statuses: Record<string, string> = {
    pending: 'Очікує',
    confirmed: 'Підтверджено',
    cancelled: 'Скасовано',
    completed: 'Завершено'
  };
  return statuses[status] || status;
}
</script> 