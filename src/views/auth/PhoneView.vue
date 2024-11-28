<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8">
      <div class="space-y-8">
        <button
          class="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground"
          @click="router.push('/')"
        >
          <ArrowLeft class="h-4 w-4" />
        </button>

        <div class="text-center">
          <div class="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Phone class="h-6 w-6 text-primary" />
          </div>
          <h2 class="mt-6 text-3xl font-bold tracking-tight">Вітаємо!</h2>
          <p class="mt-2 text-sm text-muted-foreground">
            Введіть свій номер телефону для продовження
          </p>
        </div>

        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <label for="phone" class="text-sm font-medium leading-none">Номер телефону</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-3 flex items-center">
                <span :class="`fi fi-${countryCode} h-4 rounded-sm`"></span>
              </div>
              <input
                id="phone"
                type="tel"
                placeholder="+380 XX XXX XX XX"
                v-model="phone"
                @input="handlePhoneChange"
                :class="[
                  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-12',
                  error ? 'border-destructive' : ''
                ]"
                required
                :maxlength="MAX_LENGTH"
                :disabled="isLoading"
              />
            </div>
            <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
          </div>
          
          <button
            type="submit"
            class="inline-flex w-full items-center justify-center whitespace-nowrap rounded-full text-sm font-medium h-12 px-4 py-2 bg-primary text-white shadow hover:bg-primary-light focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Перевірка...' : 'Продовжити' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Phone, ArrowLeft } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import { authService } from '@/services/auth';
import '/node_modules/flag-icons/css/flag-icons.min.css';

const MAX_LENGTH = 16;
const router = useRouter();
const authStore = useAuthStore();
const phone = ref('');
const error = ref('');
const countryCode = ref('ua');
const isLoading = ref(false);

const formatPhoneNumber = (value: string) => {
  let cleaned = value.startsWith('+') ? value : '+' + value.replace(/^\+/, '');
  cleaned = cleaned.replace(/[^\d+]/g, '');
  cleaned = cleaned.slice(0, MAX_LENGTH);

  try {
    const formatter = new AsYouType();
    const formatted = formatter.input(cleaned);
    const phoneNumber = parsePhoneNumberFromString(formatted);
    if (phoneNumber?.country) {
      countryCode.value = phoneNumber.country.toLowerCase();
    }
    return formatted;
  } catch (err) {
    return cleaned;
  }
};

const handlePhoneChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  phone.value = formatPhoneNumber(target.value);
  error.value = '';
};

const handleSubmit = async () => {
  error.value = '';
  isLoading.value = true;

  try {
    const phoneNumber = parsePhoneNumberFromString(phone.value);
    if (!phoneNumber?.isValid()) {
      throw new Error('Будь ласка, введіть коректний номер телефону');
    }

    const formattedPhone = phoneNumber.format('E.164');
    authStore.setPhoneNumber(formattedPhone);
    
    await authService.loginWithPhone(formattedPhone);
    router.push('/verify');
  } catch (err) {
    console.error('Phone verification failed:', err);
    error.value = err instanceof Error ? err.message : 'Щось пішло не так. Спробуйте ще раз.';
  } finally {
    isLoading.value = false;
  }
};
</script>