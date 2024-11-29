<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
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

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<script lang="ts">
export default {
  name: 'App'
}
</script>