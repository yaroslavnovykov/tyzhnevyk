<template>
  <BaseLayout>
    <div class="flex flex-col h-full">
      <div class="flex-1 flex flex-col px-10 py-10">
        <!-- Logo -->
        <div>
          <Logo @click="router.push('/provider/login')" class="cursor-pointer" />
        </div>

        <div class="h-[32px]" />

        <!-- Greeting -->
        <div class="space-y-2 mt-6">
          <p class="heading">Вітаю!</p>
          <div class="flex items-center gap-2">
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
          <p class="text-[40px] leading-[48px] text-foreground">
            {{ formatSpecializations(provider?.specializations) }}
          </p>
        </div>

        <div class="h-[36px]" />

        <!-- Book Button -->
        <Button
          variant="primary"
          @click="router.push('/phone')"
          class="w-full mt-auto"
        >
          Записатись
        </Button>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Logo from '@/components/Logo.vue';
import Button from '@/components/Button.vue';
import BaseLayout from '@/components/shared/BaseLayout.vue';
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
</style>