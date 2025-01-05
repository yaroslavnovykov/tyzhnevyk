<template>
  <div 
    class="flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer"
    @click="$emit('select')"
  >
    <div>
      <h3 class="font-medium">{{ service.name }}</h3>
      <div class="flex items-center gap-2 text-sm text-muted-foreground mt-1">
        <span>{{ formatDuration(service.duration) }}</span>
        <span class="w-1 h-1 rounded-full bg-muted-foreground/50" />
        <span>{{ service.price }} грн</span>
      </div>
    </div>
    <ChevronRight class="h-4 w-4 text-muted-foreground" />
  </div>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';
import type { Service } from '@/types';
import { formatDuration } from '@/utils/format';

defineProps<{
  service: Service;
}>();

defineEmits<{
  (e: 'select'): void;
}>();
</script> 