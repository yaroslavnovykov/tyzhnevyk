<template>
  <div class="w-full aspect-[2/1]">
    <img :src="illustration" :alt="alt" class="w-full h-full object-cover illustration" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getRandomIllustration } from '@/utils/illustrations';

const props = defineProps<{
  alt: string;
}>();

const illustration = ref<string>('');

onMounted(() => {
  illustration.value = getRandomIllustration();
});
</script> 