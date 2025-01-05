<template>
  <BaseLayout>
    <div class="flex flex-col h-full">
      <BackButton @click="router.push('/verify')" />

      <div class="w-full aspect-[2/1]">
        <img src="@/assets/images/ser.svg" alt="Registration" class="w-full h-full object-cover" />
      </div>

      <div class="flex-1 flex flex-col px-10">
        <div class="h-[24px]" />

        <div class="text-center space-y-2">
          <h2 class="heading">Давайте познайомимось!</h2>
          <p class="text-sm text-muted-foreground">
            Як до вас звертатися?
          </p>
        </div>

        <div class="h-[32px]" />

        <div class="space-y-6">
          <Input
            v-model="name"
            placeholder="Марія"
            :error="error"
            clearable
            :disabled="isLoading"
            autofocus
          />

          <Button
            variant="primary"
            :disabled="isLoading || !name.trim()"
            class="w-full"
            @click="handleSubmit"
          >
            {{ isLoading ? 'Зберігаємо...' : 'Продовжити' }}
          </Button>
        </div>
      </div>

      <div class="h-[32px]" />
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/services/auth';
import BaseLayout from '@/components/shared/BaseLayout.vue';
import Button from '@/components/Button.vue';
import BackButton from '@/components/ui/BackButton.vue';
import Input from '@/components/ui/Input.vue';

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
  if (!authStore.phoneNumber || !name.value.trim()) return;

  error.value = '';
  if (name.value.trim().length < 2) {
    error.value = "Ім'я має містити принаймні 2 символи";
    return;
  }

  isLoading.value = true;
  try {
    const user = await authService.registerUser(authStore.phoneNumber, name.value.trim());
    authStore.setUser(user);
    router.push('/services');
  } catch (err) {
    error.value = 'Не вдалося зберегти. Спробуйте ще раз.';
  } finally {
    isLoading.value = false;
  }
};
</script>