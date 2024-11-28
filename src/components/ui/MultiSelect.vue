<template>
  <div class="relative">
    <button
      type="button"
      @click="isOpen = !isOpen"
      class="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span class="block truncate">
        {{ selectedItems.length ? `Обрано ${selectedItems.length}` : 'Оберіть спеціалізації' }}
      </span>
      <ChevronDown
        class="h-4 w-4 opacity-50 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-card py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
    >
      <!-- Search input -->
      <div class="sticky top-0 z-10 bg-card px-2 pb-1">
        <input
          type="search"
          class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Пошук..."
          v-model="searchQuery"
          @click.stop
        />
      </div>

      <!-- Options list -->
      <div class="space-y-1 px-2">
        <button
          v-for="option in filteredOptions"
          :key="option.value"
          @click.stop="toggleOption(option)"
          class="relative w-full cursor-default select-none rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
          :class="{ 'bg-accent/50': isSelected(option) }"
        >
          <span class="block truncate">{{ option.label }}</span>
          <span
            v-if="isSelected(option)"
            class="absolute inset-y-0 left-0 flex items-center pl-2 text-primary"
          >
            <Check class="h-4 w-4" />
          </span>
        </button>
      </div>

      <!-- Empty state -->
      <div
        v-if="filteredOptions.length === 0"
        class="relative cursor-default select-none px-4 py-2 text-sm text-muted-foreground"
      >
        Нічого не знайдено
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Check, ChevronDown } from 'lucide-vue-next';
import { onClickOutside } from '@vueuse/core';

interface Option {
  value: string;
  label: string;
}

const props = defineProps<{
  modelValue: string[];
  options: Option[];
  maxItems?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();

const isOpen = ref(false);
const searchQuery = ref('');

const selectedItems = computed(() => props.modelValue);

const filteredOptions = computed(() => {
  return props.options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const isSelected = (option: Option) => {
  return selectedItems.value.includes(option.value);
};

const toggleOption = (option: Option) => {
  const selected = [...selectedItems.value];
  const index = selected.indexOf(option.value);

  if (index === -1) {
    if (!props.maxItems || selected.length < props.maxItems) {
      selected.push(option.value);
    }
  } else {
    selected.splice(index, 1);
  }

  emit('update:modelValue', selected);
};

// Close dropdown when clicking outside
const dropdownRef = ref<HTMLElement | null>(null);
onClickOutside(dropdownRef, () => {
  isOpen.value = false;
});
</script>