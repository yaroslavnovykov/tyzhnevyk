<template>
  <button
    @click="toggleTheme"
    class="fixed bottom-6 right-6 p-2 rounded-full bg-background border border-border hover:bg-accent transition-colors"
    title="Toggle theme"
  >
    <Sun v-if="isDark" class="h-4 w-4" />
    <Moon v-else class="h-4 w-4" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Sun, Moon } from 'lucide-vue-next';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);

const toggleTheme = () => {
  themeStore.toggle();
};
</script> 