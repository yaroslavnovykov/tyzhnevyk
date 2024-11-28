<template>
  <button
    class="fixed bottom-4 right-4 inline-flex items-center justify-center rounded-full w-10 h-10 bg-card dark:bg-card/95 border dark:border-primary/10 shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
    @click="themeStore.toggleTheme()"
  >
    <Sun v-if="themeStore.isDark" class="h-5 w-5 text-foreground" />
    <Moon v-else class="h-5 w-5 text-foreground" />
  </button>
</template>

<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
</script>