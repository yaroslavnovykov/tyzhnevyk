<template>
  <button
    class="absolute left-6 top-6 inline-flex items-center justify-center h-9 w-9 rounded-full bg-background hover:bg-accent hover:text-accent-foreground"
    @click="$emit('click')"
  >
    <ArrowLeft class="h-4 w-4" />
  </button>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';

defineEmits<{
  (e: 'click'): void;
}>();
</script> 