<template>
  <div class="min-h-screen bg-background noise flex items-center justify-center p-4">
    <div class="max-w-[380px] w-full">
      <div class="glass-card rounded-[32px] p-8">
        <!-- Logo -->
        <div class="flex justify-start mb-12">
          <Logo @click="router.push('/provider/login')" class="cursor-pointer" />
        </div>

        <!-- Greeting -->
        <div class="space-y-2">
          <p class="font-['IBM_Plex_Serif'] font-extralight italic text-[40px] leading-[46px] text-foreground">Вітаю!</p>
          <div class="flex items-center gap-2 mt-[12px]">
            <p class="text-[40px] leading-[32px] text-foreground">Я</p>
            <div v-if="provider?.photo_url" class="w-[64px] h-[40px] relative overflow-hidden mx-2">
              <img
                :src="provider.photo_url"
                :alt="provider.name || ''"
                class="absolute inset-0 w-full h-full object-cover rounded-full"
              />
            </div>
            <p class="text-[40px] leading-[32px] text-primary">{{ provider?.name || 'Майстер' }}</p>
          </div>
          <p class="text-[40px] leading-[46px] text-foreground mt-[12px]">
            {{ formatSpecializations(provider?.specializations) }}
          </p>
        </div>

        <!-- Book Button -->
        <button
          @click="router.push('/phone')"
          class="btn btn-primary btn-lg w-full rounded-full mt-14"
        >
          Записатись
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Logo from '@/components/Logo.vue';
import { api } from '@/services/api';
import type { User } from '@/types';

const router = useRouter();
const provider = ref<User | null>(null);

function formatSpecializations(specs?: string[]): string {
  if (!specs?.length) return '';
  
  return specs
    .map((spec, index) => {
      if (index === 0) return spec;
      if (index === specs.length - 1) return `та ${spec.toLowerCase()}`;
      return spec.toLowerCase();
    })
    .join(', ');
}

onMounted(async () => {
  try {
    const data = await api.getDemoProvider();
    provider.value = data;
  } catch (err) {
    console.error('Failed to fetch provider:', err);
  }
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Serif:ital,wght@0,200;1,200&display=swap');

.font-['IBM_Plex_Serif'] {
  font-family: 'IBM Plex Serif', serif;
}

:root {
  font-family: 'IBM Plex Sans', sans-serif;
}
</style>