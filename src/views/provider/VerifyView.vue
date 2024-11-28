<template>
  <div class="min-h-screen bg-gradient-to-br from-primary/10 to-background flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8">
      <div class="bg-card p-8 rounded-lg shadow-lg border relative">
        <button
          class="absolute left-4 top-4 inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground"
          @click="router.push('/provider/login')"
        >
          <ArrowLeft class="h-4 w-4" />
        </button>

        <div class="text-center">
          <div class="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
            <ShieldCheck class="h-6 w-6 text-primary" />
          </div>
          <h2 class="mt-6 text-3xl font-bold tracking-tight">Верифікація</h2>
          <p class="mt-2 text-sm text-muted-foreground">
            Ми надіслали код входу на
            <span class="font-medium">{{ authStore.phoneNumber }}</span>
          </p>
        </div>

        <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <label for="otp" class="text-sm font-medium leading-none">Код підтвердження</label>
            <input
              id="otp"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="4"
              placeholder="1111"
              v-model="otp"
              :class="[
                'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                error ? 'border-destructive' : ''
              ]"
              required
              :disabled="isLoading"
              autofocus
            />
            <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
          </div>

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
          
          <button
            type="submit"
            class="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            :disabled="isLoading"
          >
            <template v-if="isLoading">
              <span class="mr-2">Перевірка</span>
              <div class="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            </template>
            <template v-else>
              Підтвердити
            </template>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, ShieldCheck } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/services/auth';

const router = useRouter();
const authStore = useAuthStore();
const otp = ref('');
const error = ref('');
const isLoading = ref(false);
const timeLeft = ref(30);
const canResend = ref(false);
let timer: number;

onMounted(() => {
  if (!authStore.phoneNumber) {
    router.push('/provider/login');
    return;
  }
  startTimer();
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});

const startTimer = () => {
  canResend.value = false;
  timeLeft.value = 30;
  timer = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      canResend.value = true;
      clearInterval(timer);
    }
  }, 1000);
};

const handleResendCode = async () => {
  if (!authStore.phoneNumber || !canResend.value) return;
  
  canResend.value = false;
  error.value = '';
  otp.value = '';
  
  try {
    await authService.loginWithPhone(authStore.phoneNumber);
    startTimer();
  } catch (err) {
    error.value = 'Не вдалося надіслати код. Спробуйте ще раз.';
    canResend.value = true;
  }
};

const handleSubmit = async () => {
  if (!authStore.phoneNumber) return;

  error.value = '';

  if (otp.value.length !== 4) {
    error.value = 'Будь ласка, введіть 4-значний код';
    return;
  }

  isLoading.value = true;
  try {
    const user = await authService.verifyOtp(authStore.phoneNumber, otp.value);
    if (user) {
      if (user.role !== 'provider') {
        throw new Error('Доступ заборонено. Цей обліковий запис не є обліковим записом майстра.');
      }
      authStore.setUser(user);
      router.push('/provider/dashboard');
    } else {
      error.value = 'Невірний код. Спробуйте ще раз.';
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Помилка верифікації. Спробуйте ще раз.';
  } finally {
    isLoading.value = false;
  }
};
</script>