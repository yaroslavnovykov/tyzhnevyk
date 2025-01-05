<template>
  <BaseLayout>
    <div class="flex flex-col h-full">
      <BackButton @click="router.push('/')" />

      <Illustration alt="Phone" />

      <div class="flex-1 flex flex-col px-10">
        <div class="h-[24px]" />

        <div class="text-center space-y-2">
          <h2 class="heading">Вітаємо!</h2>
          <p class="text-sm text-muted-foreground">
            Введіть номер телефону для входу
          </p>
        </div>

        <div class="h-[32px]" />

        <div class="space-y-3">
          <div class="space-y-2">
            <PhoneInput
              v-model="phoneNumber"
              :error="error"
              :disabled="isLoading"
              @submit="handleSubmit"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            :disabled="isLoading || !phoneNumber"
            class="w-full"
            @click="handleSubmit"
          >
            {{ isLoading ? 'Надсилання...' : 'Продовжити' }}
          </Button>
        </div>
      </div>

      <div class="h-10" />
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/services/auth';
import BaseLayout from '@/components/shared/BaseLayout.vue';
import Button from '@/components/Button.vue';
import BackButton from '@/components/ui/BackButton.vue';
import PhoneInput from '@/components/ui/PhoneInput.vue';
import Illustration from '@/components/ui/Illustration.vue';

const router = useRouter();
const authStore = useAuthStore();

const phoneNumber = ref('');
const error = ref('');
const isLoading = ref(false);

const handleSubmit = async () => {
  if (!phoneNumber.value || isLoading.value) return;
  
  error.value = '';
  isLoading.value = true;

  try {
    await authService.loginWithPhone(phoneNumber.value);
    authStore.setPhoneNumber(phoneNumber.value);
    router.push('/verify');
  } catch (err) {
    console.error('Phone login failed:', err);
    error.value = err instanceof Error ? err.message : 'Не вдалося надіслати код. Спробуйте ще раз.';
  } finally {
    isLoading.value = false;
  }
};
</script> 