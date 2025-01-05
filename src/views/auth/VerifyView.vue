<template>
  <BaseLayout>
    <div class="flex flex-col h-full">
      <BackButton @click="router.push('/phone')" />

      <Illustration alt="OTP" />

      <div class="flex-1 flex flex-col px-10">
        <div class="h-[24px]" />

        <div class="text-center space-y-2">
          <h2 class="heading">Вітаємо!</h2>
          <p class="text-sm text-muted-foreground">
            Ми надіслали код входу на <span class="font-medium">{{ authStore.phoneNumber }}</span>
          </p>
        </div>

        <div class="h-[32px]" />

        <div class="space-y-3">
          <div class="space-y-2">
            <input
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="4"
              placeholder="••••"
              v-model="otp"
              :class="[
                'flex h-12 w-full rounded-md text-center text-2xl tracking-[1.5em] caret-transparent',
                'bg-input backdrop-blur-2xl border border-border/50',
                'outline-none transition-all duration-200',
                'hover:bg-white/5',
                'focus:bg-white/5 focus:border-primary/50 focus:ring-2 focus:ring-primary/20',
                'active:bg-white/10',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'pl-[2.25em] pr-[0.75em] py-1',
                'placeholder:text-muted-foreground',
                error ? 'border-destructive/50 focus:border-destructive focus:ring-destructive/20 animate-shake' : ''
              ]"
              required
              :disabled="isLoading"
              autofocus
              @input="handleOtpInput"
            />
            <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
          </div>

          <Button
            type="submit"
            variant="primary"
            :disabled="isLoading || otp.length !== 4"
            class="w-full"
            @click="handleSubmit"
          >
            {{ isLoading ? 'Перевірка...' : 'Підтвердити' }}
          </Button>

          <div class="text-center">
            <p v-if="timeLeft > 0" class="text-sm text-muted-foreground">
              Надіслати код повторно через {{ timeLeft }}с
            </p>
            <button
              v-else
              type="button"
              class="text-sm text-primary hover:text-primary/80"
              @click="handleResendCode"
              :disabled="!canResend"
            >
              Надіслати код повторно
            </button>
          </div>
        </div>
      </div>

      <div class="h-10" />
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/services/auth';
import BaseLayout from '@/components/shared/BaseLayout.vue';
import Button from '@/components/Button.vue';
import BackButton from '@/components/ui/BackButton.vue';
import Illustration from '@/components/ui/Illustration.vue';

const router = useRouter();
const authStore = useAuthStore();

const otp = ref('');
const error = ref('');
const isLoading = ref(false);
const timeLeft = ref(20);
const canResend = ref(true);
let timer: number | null = null;

const startTimer = () => {
  timeLeft.value = 20;
  canResend.value = false;
  
  timer = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      canResend.value = true;
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
  }, 1000);
};

const handleOtpInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  value = value.slice(0, 4);
  otp.value = value;
  
  if (value.length === 4) {
    handleSubmit();
  }
};

const handleSubmit = async () => {
  if (otp.value.length !== 4 || isLoading.value || !authStore.phoneNumber) return;
  
  error.value = '';
  isLoading.value = true;

  try {
    await authService.verifyOtp(authStore.phoneNumber, otp.value);
    router.push('/services');
  } catch (err) {
    console.error('OTP verification failed:', err);
    error.value = err instanceof Error ? err.message : 'Невірний код. Спробуйте ще раз.';
  } finally {
    isLoading.value = false;
  }
};

const handleResendCode = async () => {
  if (!canResend.value || !authStore.phoneNumber) return;
  
  error.value = '';
  canResend.value = false;

  try {
    await authService.loginWithPhone(authStore.phoneNumber);
    startTimer();
  } catch (err) {
    console.error('Code resend failed:', err);
    error.value = err instanceof Error ? err.message : 'Не вдалося надіслати код. Спробуйте ще раз.';
    canResend.value = true;
  }
};

onMounted(() => {
  if (!authStore.phoneNumber) {
    router.push('/phone');
    return;
  }
  startTimer();
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(4px); }
  75% { transform: translateX(-4px); }
}

.animate-shake {
  animation: shake 0.2s ease-in-out 0s 2;
}
</style> 