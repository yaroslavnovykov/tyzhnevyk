<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
  <ThemeToggle />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { useThemeStore } from '@/stores/theme';
import { useAuthStore } from '@/stores/auth';

const themeStore = useThemeStore();
const authStore = useAuthStore();

onMounted(async () => {
  themeStore.init();
  await authStore.init();
});
</script>

<script lang="ts">
export default {
  name: 'App'
}
</script>