<template>
  <BaseLayout>
    <div class="flex flex-col h-full">
      <button
        class="absolute left-6 top-6 inline-flex items-center justify-center h-9 w-9"
        @click="router.push('/')"
      >
        <ArrowLeft class="h-4 w-4" />
      </button>

      <div class="w-full aspect-[2/1]">
        <img src="@/assets/images/tel.svg" alt="Phone" class="w-full h-full object-cover" />
      </div>

      <div class="flex-1 flex flex-col px-10">
        <div class="h-[24px]" />

        <div class="text-center space-y-2">
          <h2 class="heading">Вітаємо!</h2>
          <p class="text-sm text-muted-foreground">
            Введіть свій номер телефону для продовження
          </p>
        </div>

        <div class="h-[32px]" />

        <div class="pb-10">
          <PhoneInput
            v-model="phone"
            :error="error"
            clearable
            @valid="handleValidation"
            class="w-full"
          />
          
          <div class="h-2" />
          
          <Button
            type="submit"
            variant="primary"
            :disabled="isLoading || !isValid"
            class="w-full mt-3"
            @click="handleSubmit"
          >
            {{ isLoading ? 'Перевірка...' : 'Продовжити' }}
          </Button>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/services/auth';
import BaseLayout from '@/components/shared/BaseLayout.vue';
import Button from '@/components/Button.vue';
import PhoneInput from '@/components/ui/PhoneInput.vue';

const router = useRouter();
const authStore = useAuthStore();
const phone = ref('');
const error = ref('');
const isLoading = ref(false);
const isValid = ref(false);

const handleValidation = (valid: boolean) => {
  isValid.value = valid;
};

const handleSubmit = async () => {
  if (!isValid.value) return;
  
  error.value = '';
  isLoading.value = true;

  try {
    authStore.setPhoneNumber(phone.value);
    await authService.loginWithPhone(phone.value);
    router.push('/verify');
  } catch (err) {
    console.error('Phone verification failed:', err);
    error.value = err instanceof Error ? err.message : 'Щось пішло не так. Спробуйте ще раз.';
  } finally {
    isLoading.value = false;
  }
};
</script>