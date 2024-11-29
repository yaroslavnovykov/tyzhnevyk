<template>
  <button
    :class="[
      'w-full h-[40px] text-base font-normal rounded-md',
      'inline-flex items-center justify-center',
      'transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-primary/20',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variant === 'primary' 
        ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
        : 'bg-muted text-muted-foreground hover:bg-muted/80'
    ]"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary'
}>();
</script> 