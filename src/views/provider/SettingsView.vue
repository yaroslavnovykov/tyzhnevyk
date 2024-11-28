<template>
  <div class="min-h-screen bg-background">
    <div class="max-w-[380px] mx-auto p-4">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">Налаштування</h1>
          <p class="text-sm text-muted-foreground">Керування профілем</p>
        </div>
        <button
          @click="router.push('/provider/dashboard')"
          class="btn btn-ghost btn-circle"
        >
          <ArrowLeft class="h-4 w-4" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Profile Settings -->
        <div class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Ім'я</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              class="input input-bordered w-full"
              :class="{ 'input-error': errors.name }"
              required
            />
            <label v-if="errors.name" class="label">
              <span class="label-text-alt text-error">{{ errors.name }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Стать</span>
            </label>
            <select v-model="form.gender" class="select select-bordered w-full">
              <option value="female">Жіноча</option>
              <option value="male">Чоловіча</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Спеціалізації</span>
            </label>
            <MultiSelect
              v-model="form.specializations"
              :options="specializationOptions"
              :maxItems="3"
            />
          </div>

          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Автоматичне підтвердження записів</span>
              <input
                v-model="form.auto_confirm"
                type="checkbox"
                class="toggle toggle-primary"
              />
            </label>
          </div>
        </div>

        <!-- Working Hours -->
        <div class="space-y-4">
          <h2 class="text-lg font-medium">Робочий час</h2>
          
          <div v-for="day in workingHours" :key="day.id" class="collapse collapse-arrow bg-primary/5">
            <input type="checkbox" v-model="day.isExpanded" />
            <div class="collapse-title flex items-center justify-between pr-12">
              <span>{{ day.name }}</span>
              <div class="form-control">
                <input
                  v-model="day.isWorking"
                  type="checkbox"
                  class="toggle toggle-primary toggle-sm"
                />
              </div>
            </div>
            <div class="collapse-content">
              <div v-if="day.isWorking" class="space-y-4 pt-4">
                <div v-for="(slot, index) in day.slots" :key="index" class="flex gap-2">
                  <input
                    v-model="slot.start"
                    type="time"
                    class="input input-bordered flex-1"
                  />
                  <input
                    v-model="slot.end"
                    type="time"
                    class="input input-bordered flex-1"
                  />
                  <button
                    v-if="day.slots.length > 1"
                    type="button"
                    class="btn btn-ghost btn-circle btn-sm"
                    @click="removeSlot(day, index)"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  class="btn btn-ghost btn-sm w-full"
                  @click="addSlot(day)"
                >
                  <Plus class="h-4 w-4 mr-2" />
                  Додати перерву
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-4">
          <button type="submit" class="btn btn-primary w-full">
            Зберегти зміни
          </button>
        </div>
      </form>

      <!-- Delete Account -->
      <div class="mt-8">
        <button
          @click="showDeleteModal = true"
          class="btn btn-error btn-outline w-full"
        >
          Видалити акаунт
        </button>
      </div>

      <!-- Delete Confirmation Modal -->
      <dialog :open="showDeleteModal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
          <h3 class="font-bold text-lg text-error">Видалити акаунт?</h3>
          <p class="py-4">
            Ця дія незворотна. Всі ваші дані будуть видалені.
          </p>
          <div class="modal-action">
            <button
              class="btn"
              @click="showDeleteModal = false"
            >
              Скасувати
            </button>
            <button
              class="btn btn-error"
              @click="handleDelete"
            >
              Видалити
            </button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop" @click="showDeleteModal = false">
          <button>close</button>
        </form>
      </dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, Plus, Trash2 } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useWorkingHoursStore } from '@/stores/workingHours';
import { api } from '@/services/api';
import { supabase } from '@/lib/supabase';
import MultiSelect from '@/components/ui/MultiSelect.vue';
import type { User, Specialization, WorkingHours } from '@/types';

const router = useRouter();
const authStore = useAuthStore();
const workingHoursStore = useWorkingHoursStore();
const isLoading = ref(false);
const showDeleteModal = ref(false);
const specializations = ref<Specialization[]>([]);

const specializationOptions = computed(() => 
  specializations.value.map(spec => ({
    value: form.gender === 'female' ? spec.name_female : spec.name_male,
    label: form.gender === 'female' ? spec.name_female : spec.name_male,
  }))
);

const workingHours = reactive<(WorkingHours & { isExpanded: boolean })[]>([
  { id: 1, name: 'Понеділок', slots: [{ start: '09:00', end: '19:00' }], isWorking: true, isExpanded: false },
  { id: 2, name: 'Вівторок', slots: [{ start: '09:00', end: '19:00' }], isWorking: true, isExpanded: false },
  { id: 3, name: 'Середа', slots: [{ start: '09:00', end: '19:00' }], isWorking: true, isExpanded: false },
  { id: 4, name: 'Четвер', slots: [{ start: '09:00', end: '19:00' }], isWorking: true, isExpanded: false },
  { id: 5, name: "П'ятниця", slots: [{ start: '09:00', end: '19:00' }], isWorking: true, isExpanded: false },
  { id: 6, name: 'Субота', slots: [{ start: '10:00', end: '18:00' }], isWorking: true, isExpanded: false },
  { id: 7, name: 'Неділя', slots: [{ start: '10:00', end: '18:00' }], isWorking: false, isExpanded: false },
]);

const form = reactive({
  name: authStore.user?.name || '',
  gender: authStore.user?.gender || 'female',
  auto_confirm: authStore.user?.auto_confirm || false,
  photo_url: authStore.user?.photo_url || '',
  specializations: authStore.user?.specializations || [],
});

const errors = reactive({
  name: '',
});

const fetchSpecializations = async () => {
  try {
    const { data, error } = await supabase
      .from('specializations')
      .select('*')
      .order('name_female');
    
    if (error) throw error;
    specializations.value = data;
  } catch (err) {
    console.error('Failed to fetch specializations:', err);
  }
};

// Working hours functions
const addSlot = (day: WorkingHours & { isExpanded: boolean }) => {
  const lastSlot = day.slots[day.slots.length - 1];
  day.slots.push({ start: lastSlot.end, end: lastSlot.end });
};

const removeSlot = (day: WorkingHours & { isExpanded: boolean }, index: number) => {
  day.slots.splice(index, 1);
};

const saveWorkingHours = async () => {
  if (!authStore.user?.id) return;

  try {
    await workingHoursStore.updateWorkingHours(authStore.user.id, workingHours);
  } catch (err) {
    console.error('Failed to update working hours:', err);
  }
};

const handleSubmit = async () => {
  if (!authStore.user?.id) return;

  errors.name = '';
  if (form.name.trim().length < 2) {
    errors.name = "Ім'я має містити принаймні 2 символи";
    return;
  }

  isLoading.value = true;
  try {
    const updatedUser = await api.updateUser(authStore.user.id, form);
    authStore.setUser(updatedUser);
    await saveWorkingHours();
    router.push('/provider/dashboard');
  } catch (err) {
    console.error('Failed to update profile:', err);
  } finally {
    isLoading.value = false;
  }
};

const handleDelete = async () => {
  if (!authStore.user?.id) return;

  try {
    await api.deleteUser(authStore.user.id);
    authStore.logout();
    router.push('/');
  } catch (err) {
    console.error('Failed to delete account:', err);
  }
};

onMounted(async () => {
  if (!authStore.user?.id) {
    router.push('/provider/login');
    return;
  }

  await fetchSpecializations();

  try {
    const userData = await api.getUser(authStore.user.id);
    form.auto_confirm = userData.auto_confirm || false;
    form.gender = userData.gender || 'female';
    form.photo_url = userData.photo_url || '';
    form.specializations = userData.specializations || [];

    // Fetch working hours
    const hours = await workingHoursStore.fetchWorkingHours(authStore.user.id);
    if (hours) {
      hours.forEach((hour, index) => {
        workingHours[index].slots = hour.slots || [{ start: '09:00', end: '19:00' }];
        workingHours[index].isWorking = hour.isWorking;
      });
    }
  } catch (err) {
    console.error('Failed to fetch user data:', err);
  }
});
</script>
```