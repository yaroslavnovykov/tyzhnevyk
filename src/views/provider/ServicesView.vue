<template>
  <div class="min-h-screen bg-gradient-to-br from-primary/10 to-background">
    <div class="max-w-4xl mx-auto p-4">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">Послуги</h1>
          <p class="text-sm text-muted-foreground">Керування послугами та цінами</p>
        </div>
        <button
          @click="router.push('/provider/dashboard')"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft class="h-4 w-4" />
        </button>
      </div>

      <div v-if="isLoading" class="flex justify-center py-8">
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
      </div>

      <div v-else-if="error" class="text-center py-8">
        <p class="text-destructive mb-4">{{ error }}</p>
        <button
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90"
          @click="fetchServices"
        >
          Спробувати знову
        </button>
      </div>

      <div v-else>
        <!-- Service List -->
        <div class="space-y-4 mb-8">
          <div
            v-for="service in services"
            :key="service.id"
            class="bg-card p-4 rounded-lg shadow-sm border group"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-4">
                  <h3 class="font-medium">{{ service.name }}</h3>
                  <span
                    class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"
                  >
                    {{ service.duration }} хв
                  </span>
                </div>
                <p class="text-sm text-muted-foreground mt-1">
                  {{ service.description }}
                </p>
              </div>
              <div class="text-right">
                <div class="font-medium">{{ formatCurrency(service.price) }}</div>
                <button
                  class="text-sm text-primary hover:text-primary/80 opacity-0 group-hover:opacity-100 transition-opacity"
                  @click="editService(service)"
                >
                  Редагувати
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Service Button -->
        <button
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 w-full"
          @click="showAddModal = true"
        >
          <Plus class="h-4 w-4 mr-2" />
          Додати послугу
        </button>

        <!-- Add/Edit Service Modal -->
        <div
          v-if="showAddModal || editingService"
          class="fixed inset-0 bg-background/80 backdrop-blur-sm"
        >
          <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
            <div class="flex flex-col space-y-1.5 text-center sm:text-left">
              <h3 class="text-lg font-semibold leading-none tracking-tight">
                {{ editingService ? 'Редагування послуги' : 'Нова послуга' }}
              </h3>
              <p class="text-sm text-muted-foreground">
                {{ editingService ? 'Змініть дані послуги' : 'Додайте нову послугу до списку' }}
              </p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-medium leading-none">Назва</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium leading-none">Опис</label>
                <textarea
                  v-model="form.description"
                  class="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium leading-none">Тривалість (хв)</label>
                  <input
                    v-model.number="form.duration"
                    type="number"
                    min="1"
                    class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium leading-none">Ціна (₴)</label>
                  <input
                    v-model.number="form.price"
                    type="number"
                    min="0"
                    class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>
              </div>

              <div class="flex justify-end gap-2">
                <button
                  type="button"
                  class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
                  @click="closeModal"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'Збереження...' : (editingService ? 'Зберегти' : 'Додати') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, Plus, Loader2 } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/services/api';
import { formatCurrency } from '@/lib/utils';
import type { Service } from '@/types';

const router = useRouter();
const authStore = useAuthStore();
const services = ref<Service[]>([]);
const isLoading = ref(true);
const error = ref('');
const showAddModal = ref(false);
const editingService = ref<Service | null>(null);
const isSubmitting = ref(false);

const form = reactive({
  name: '',
  description: '',
  duration: 60,
  price: 0,
});

const fetchServices = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    const data = await api.getServices();
    services.value = data;
  } catch (err) {
    error.value = 'Не вдалося завантажити послуги';
    console.error('Failed to fetch services:', err);
  } finally {
    isLoading.value = false;
  }
};

const editService = (service: Service) => {
  editingService.value = service;
  form.name = service.name;
  form.description = service.description || '';
  form.duration = service.duration;
  form.price = service.price;
};

const closeModal = () => {
  showAddModal.value = false;
  editingService.value = null;
  form.name = '';
  form.description = '';
  form.duration = 60;
  form.price = 0;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    // Here will be API call to create/update service
    // For now just update local state
    if (editingService.value) {
      const index = services.value.findIndex(s => s.id === editingService.value?.id);
      if (index !== -1) {
        services.value[index] = {
          ...editingService.value,
          ...form,
        };
      }
    } else {
      services.value.push({
        id: Date.now().toString(),
        ...form,
        providerId: authStore.user?.id || '',
      });
    }
    closeModal();
  } catch (err) {
    console.error('Failed to save service:', err);
    error.value = 'Не вдалося зберегти послугу';
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  if (!authStore.user?.id) {
    router.push('/provider/login');
    return;
  }
  fetchServices();
});
</script>