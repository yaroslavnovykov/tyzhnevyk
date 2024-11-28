<template>
  <div class="min-h-screen bg-gradient-to-br from-primary/10 to-background flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8">
      <div class="bg-card p-8 rounded-lg shadow-lg border relative">
        <button
          class="absolute left-4 top-4 inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground"
          @click="router.push('/verify')"
        >
          <ArrowLeft class="h-4 w-4" />
        </button>

        <div class="text-center">
          <div class="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
            <UserCircle class="h-6 w-6 text-primary" />
          </div>
          <h2 class="mt-6 text-3xl font-bold tracking-tight">Давайте познайомимось!</h2>
          <p class="mt-2 text-sm text-muted-foreground">
            Як до вас звертатися?
          </p>
        </div>

        <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <label for="name" class="text-sm font-medium leading-none">Ваше ім'я</label>
            <input
              id="name"
              type="text"
              placeholder="Марія"
              v-model="name"
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
          
          <button
            type="submit"
            class="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            :disabled="isLoading"
          >
            <template v-if="isLoading">
              <span class="mr-2">Зберігаємо</span>
              <div class="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            </template>
            <template v-else>
              Продовжити
            </template>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, UserCircle } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/services/auth';

const router = useRouter();
const authStore = useAuthStore();
const name = ref('');
const error = ref('');
const isLoading = ref(false);

onMounted(() => {
  if (!authStore.phoneNumber) {
    router.push('/phone');
  }
});

const handleSubmit = async () => {
  error.value = '';

  if (name.value.trim().length < 2) {
    error.value = "Ім'я має містити принаймні 2 символи";
    return;
  }

  isLoading.value = true;
  try {
    const user = await authService.registerUser(authStore.phoneNumber!, name.value);
    authStore.setUser(user);
    router.push('/services');
  } catch (err) {
    error.value = 'Не вдалося зареєструватися. Спробуйте ще раз.';
  } finally {
    isLoading.value = false;
  }
};
</script>