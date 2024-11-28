<template>
  <div class="min-h-screen bg-gradient-to-br from-primary/10 to-background p-4">
    <div class="max-w-md mx-auto">
      <!-- Upcoming Appointments Notification -->
      <div
        v-if="upcomingAppointments.length"
        class="mb-6 bg-primary/10 rounded-lg p-4 border border-primary/20"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium">
              У вас є запис на {{ formatDate(upcomingAppointments[0].startTime, "d MMMM', 'HH:mm") }}
            </p>
            <p class="text-sm text-muted-foreground">
              {{ upcomingAppointments[0].service_name }}
            </p>
          </div>
          <button
            class="text-sm text-primary hover:text-primary/80"
            @click="router.push('/appointments')"
          >
            Всі записи
          </button>
        </div>
      </div>

      <div class="mb-6 flex items-center">
        <button
          class="mr-2 inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground"
          @click="router.push('/appointments')"
        >
          <ArrowLeft class="h-4 w-4" />
        </button>
        <h1 class="text-2xl font-bold">Оберіть послугу</h1>
      </div>

      <div v-if="isLoading" class="flex items-center justify-center">
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
      </div>

      <div v-else-if="error" class="text-center">
        <p class="text-destructive mb-4">{{ error }}</p>
        <button
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90"
          @click="fetchServices"
        >
          Спробувати знову
        </button>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="service in services"
          :key="service.id"
          class="bg-card p-4 rounded-lg shadow-sm border hover:border-primary/50 transition-colors cursor-pointer"
          @click="handleServiceSelect(service)"
        >
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-medium">{{ service.name }}</h3>
              <p class="text-sm text-muted-foreground mt-1">
                {{ service.description }}
              </p>
              <p class="text-sm text-muted-foreground mt-1">
                {{ service.duration }} хв
              </p>
            </div>
            <div class="text-right">
              <div class="font-medium">{{ formatCurrency(service.price) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, Loader2 } from 'lucide-vue-next';
import { useAppointmentStore } from '@/stores/appointments';
import { api } from '@/services/api';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import type { Service } from '@/types';

export default defineComponent({
  name: 'ServicesView',
  components: { ArrowLeft, Loader2 },
  setup() {
    const router = useRouter();
    const appointmentStore = useAppointmentStore();
    const services = ref<Service[]>([]);
    const isLoading = ref(true);
    const error = ref('');

    const upcomingAppointments = computed(() => 
      appointmentStore.appointments
        .filter(a => 
          ['pending', 'confirmed'].includes(a.status) &&
          new Date(a.startTime) > new Date()
        )
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    );

    const formatDate = (date: Date, pattern: string) => {
      return format(date, pattern, { locale: uk });
    };

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

    const handleServiceSelect = (service: Service) => {
      appointmentStore.setSelectedService(service);
      router.push(`/calendar/${service.id}`);
    };

    onMounted(fetchServices);

    return {
      services,
      isLoading,
      error,
      upcomingAppointments,
      router,
      formatCurrency,
      formatDate,
      fetchServices,
      handleServiceSelect,
    };
  },
});
</script>