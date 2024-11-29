<template>
  <div class="space-y-2">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-foreground"
    >
      {{ label }}
    </label>

    <div class="relative">
      <input
        :id="id"
        ref="input"
        v-bind="$attrs"
        :value="modelValue"
        :placeholder="placeholder"
        :class="[
          'w-full bg-card/50 backdrop-blur-xl rounded-2xl px-4 h-[52px] text-base text-foreground placeholder:text-muted-foreground',
          'border border-border/50 focus:border-primary/50',
          'outline-none transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-destructive/50 focus:border-destructive' : '',
          $attrs.class
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      
      <!-- Clear button -->
      <button
        v-if="modelValue && clearable && !disabled"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
        @click="clear"
      >
        <X class="h-4 w-4" />
      </button>

      <!-- Error message -->
      <p
        v-if="error"
        class="text-sm text-destructive mt-1"
      >
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps<{
  modelValue?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  clearable?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const input = ref<HTMLInputElement | null>(null);
const id = `input-${Math.random().toString(36).slice(2, 11)}`;

const clear = () => {
  emit('update:modelValue', '');
  input.value?.focus();
};
</script> 