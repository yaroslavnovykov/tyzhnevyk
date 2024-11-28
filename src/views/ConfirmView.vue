<template>
  <div class="min-h-screen bg-gradient-to-br from-primary/10 to-background flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8">
      <div class="bg-card p-8 rounded-lg shadow-lg border text-center">
        <div class="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 class="h-6 w-6 text-primary" />
        </div>

        <h2 class="text-2xl font-bold mb-2">Запис підтверджено!</h2>
        <p class="text-muted-foreground mb-6">
          Чекаємо вас на {{ selectedService?.name.toLowerCase() }}
        </p>

        <div class="bg-muted/30 rounded-lg p-4 mb-6 text-left">
          <div class="space-y-3">
            <div>
              <div class="text-sm text-muted-foreground">Послуга</div>
              <div class="font-medium">{{ selectedService?.name }}</div>
            </div>
            <div>
              <div class="text-sm text-muted-foreground">Дата та час</div>
              <div class="font-medium">
                {{ formatDate(selectedDateTime, "d MMMM', 'EEEE', 'HH:mm") }}
              </div>
            </div>
            <div>
              <div class="text-sm text-muted-foreground">Тривалість</div>
              <div class="font-medium">{{ selectedService?.duration }} хв</div>
            </div>
            <div>
              <div class="text-sm text-muted-foreground">Вартість</div>
              <div class="font-medium">{{ formatCurrency(selectedService?.price || 0) }}</div>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <button
            @click="generateIcsFile"
            class="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            <Calendar class="h-4 w-4 mr-2" />
            Додати в календар
          </button>

          <button
            @click="router.push('/appointments')"
            class="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90"
          >
            Мої записи
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { CheckCircle2, Calendar } from 'lucide-vue-next';
import { format, addMinutes } from 'date-fns';
import { uk } from 'date-fns/locale';
import { useAppointmentStore } from '@/stores/appointments';
import { useAuthStore } from '@/stores/auth';
import { formatCurrency } from '@/lib/utils';

export default defineComponent({
  name: 'ConfirmView',
  components: { CheckCircle2, Calendar },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const appointmentStore = useAppointmentStore();
    const isProcessed = ref(false);
    const error = ref<string | null>(null);

    const selectedService = computed(() => appointmentStore.selectedService);
    const selectedDateTime = computed(() => appointmentStore.selectedDateTime);

    onMounted(async () => {
      if (!selectedService.value || !selectedDateTime.value || !authStore.user) {
        router.push('/services');
        return;
      }

      if (!isProcessed.value) {
        const appointment = {
          serviceId: selectedService.value.id,
          clientId: authStore.user.id,
          providerId: '00000000-0000-0000-0000-000000000001', // Demo provider UUID
          startTime: selectedDateTime.value,
          endTime: addMinutes(selectedDateTime.value, selectedService.value.duration),
          status: 'pending' as const,
          paymentStatus: 'pending' as const,
        };

        try {
          await appointmentStore.addAppointment(appointment);
          isProcessed.value = true;
        } catch (err) {
          console.error('Failed to create appointment:', err);
          error.value = err instanceof Error ? err.message : 'Не вдалося створити запис';
        }
      }
    });

    const formatDate = (date: Date | null, pattern: string) => {
      if (!date) return '';
      return format(date, pattern, { locale: uk });
    };

    const generateIcsFile = () => {
      if (!selectedService.value || !selectedDateTime.value) return;

      const appointment = {
        startTime: selectedDateTime.value,
        endTime: addMinutes(selectedDateTime.value, selectedService.value.duration),
        service: selectedService.value.name,
        provider: 'Маша',
        location: 'вул. Хрещатик, 1, Київ',
      };

      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `DTSTART:${format(appointment.startTime, "yyyyMMdd'T'HHmmss")}`,
        `DTEND:${format(appointment.endTime, "yyyyMMdd'T'HHmmss")}`,
        `SUMMARY:${appointment.service} у ${appointment.provider}`,
        `LOCATION:${appointment.location}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'appointment.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    };

    return {
      selectedService,
      selectedDateTime,
      router,
      formatDate,
      formatCurrency,
      generateIcsFile,
      error,
    };
  },
});
</script>