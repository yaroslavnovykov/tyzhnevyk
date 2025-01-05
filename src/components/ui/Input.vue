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
          'w-full bg-input backdrop-blur-2xl rounded-md px-4 h-[52px] text-base text-foreground placeholder:text-muted-foreground',
          'border border-border/50',
          'outline-none transition-all duration-200',
          'hover:bg-input-focus',
          'focus:bg-input-focus focus:border-primary/50 focus:ring-2 focus:ring-primary/20',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-destructive/50 focus:border-destructive focus:ring-destructive/20 animate-shake' : '',
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

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(4px); }
  75% { transform: translateX(-4px); }
}

.animate-shake {
  animation: shake 0.2s ease-in-out 0s 2;
}
</style> 