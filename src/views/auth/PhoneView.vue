<template>
  <BaseLayout>
    <div class="space-y-8">
      <button
        class="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-muted/10"
        @click="router.push('/')"
      >
        <ArrowLeft class="h-4 w-4" />
      </button>

      <div class="text-center">
        <div class="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Phone class="h-6 w-6 text-primary" />
        </div>
        <h2 class="mt-6 text-3xl font-bold tracking-tight">Вітаємо!</h2>
        <p class="mt-2 text-base text-muted-foreground">
          Введіть свій номер телефону для продовження
        </p>
      </div>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <PhoneInput
          v-model="phone"
          :error="error"
          clearable
          @valid="handleValidation"
        />
        
        <Button
          type="submit"
          variant="primary"
          :disabled="isLoading || !isValid"
          class="w-full"
        >
          {{ isLoading ? 'Перевірка...' : 'Продовжити' }}
        </Button>
      </form>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Phone, ArrowLeft } from 'lucide-vue-next';
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