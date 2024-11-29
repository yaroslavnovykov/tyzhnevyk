<template>
  <div class="space-y-2">
    <label
      v-if="label"
      :for="id"
      class="block text-base font-medium text-foreground/80"
    >
      {{ label }}
    </label>

    <div class="relative">
      <!-- Flag icon -->
      <div class="absolute left-4 top-1/2 -translate-y-1/2 flex items-center z-[999]">
        <img 
          src="/assets/flags/flagUA.png" 
          alt="UA" 
          width="20"
          height="16"
          class="object-cover object-center rounded-[1px] border border-border/20" 
        />
      </div>

      <input
        :id="id"
        ref="input"
        type="tel"
        inputmode="numeric"
        v-bind="$attrs"
        :value="displayValue"
        placeholder="+380"
        :maxlength="17"
        :class="[
          'w-full bg-input backdrop-blur-2xl rounded-md pl-12 pr-4 h-[52px] text-base text-foreground placeholder:text-muted-foreground',
          'border border-border/50',
          'outline-none transition-all duration-200',
          'focus:bg-input-focus focus:border-primary/50 focus:ring-2 focus:ring-primary/20',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-destructive/50 focus:border-destructive focus:ring-destructive/20 animate-shake' : '',
          $attrs.class
        ]"
        @input="handleInput"
        @focus="handleFocus"
        @keypress="handleKeyPress"
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
        class="text-sm text-destructive mt-2"
      >
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { X } from 'lucide-vue-next';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';

const props = defineProps<{
  modelValue?: string;
  label?: string;
  error?: string;
  clearable?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'valid': [isValid: boolean];
}>();

const input = ref<HTMLInputElement | null>(null);
const id = `phone-input-${Math.random().toString(36).slice(2, 11)}`;
const wasValid = ref(false);

// Проверяем поддержку вибрации
const canVibrate = computed(() => {
  return 'vibrate' in navigator;
});

// Вибрация при валидном номере (одна очень легкая)
const vibrateSuccess = () => {
  if (canVibrate.value) {
    navigator.vibrate(15);
  }
};

// Форматирование для отображения
const displayValue = computed(() => {
  if (!props.modelValue) return '';
  return props.modelValue;
});

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 2) return '+38';
  if (digits.length <= 5) return `+${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (digits.length <= 8) return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
  return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 12)}`;
};

// Проверка валидности номера
const isValid = computed(() => {
  if (!props.modelValue) return false;
  const digits = props.modelValue.replace(/\D/g, '');
  const isValidLength = digits.length === 12;
  const hasValidPrefix = digits.startsWith('380');
  return isValidLength && hasValidPrefix;
});

const handleInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  let value = input.value;
  
  // Убираем все нецифровые символы
  let digits = value.replace(/\D/g, '');
  
  // Защищаем префикс 380
  if (digits.length <= 3) {
    digits = '380';
  } else if (!digits.startsWith('380')) {
    // Если префикс был частично удален, восстанавливаем его
    const remainingDigits = digits.slice(0, 12);
    digits = '380' + remainingDigits.slice(digits.startsWith('38') ? 2 : digits.startsWith('3') ? 1 : 0);
  }
  
  // Ограничиваем длину до 12 цифр
  digits = digits.slice(0, 12);
  
  // Форматируем номер
  value = formatPhoneNumber(digits);
  
  const currentlyValid = digits.length === 12;

  if (currentlyValid && !wasValid.value) {
    vibrateSuccess();
  }

  wasValid.value = currentlyValid;
  emit('valid', currentlyValid);
  emit('update:modelValue', value);
};

const handleKeyPress = (e: KeyboardEvent) => {
  const input = e.target as HTMLInputElement;
  const digits = input.value.replace(/\D/g, '');
  
  // Предотвращаем ввод после достижения максимальной длины
  if (digits.length >= 12) {
    e.preventDefault();
    return;
  }
  
  const charCode = e.charCode || e.keyCode;
  if (charCode < 48 || charCode > 57) {
    e.preventDefault();
  }
};

const handleFocus = () => {
  if (!props.modelValue) {
    emit('update:modelValue', '+380');
  }
};

const clear = () => {
  emit('update:modelValue', '+380');
  emit('valid', false);
  wasValid.value = false;
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