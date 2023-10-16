<script setup lang="ts">
import { uid } from 'uid';
import type { ColorOpts, SizeOpts } from '@/types';

const fieldId = `input_${uid()}`;

type ModelValue = string | number | null | undefined;
type InputVariant = 'outline' | 'none';

interface Props {
  modelValue?: ModelValue;
  type?: HTMLInputElement['type'];
  name?: string;
  required?: boolean;
  label?: string;
  leadingIcon?: `i-${string}`;
  trailingIcon?: `i-${string}`;
  color?: ColorOpts;
  variant?: InputVariant;
  size?: SizeOpts;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  name: '',
  required: false,
  label: '',
  leadingIcon: undefined,
  trailingIcon: undefined,
  color: 'primary',
  variant: 'outline',
  size: 'md',
  placeholder: '',
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: ModelValue): void;
  (e: 'change', value: ModelValue): void;
  (e: 'blur', value: ModelValue): void;
  (e: 'focus', value: ModelValue): void;
}>();

const value = computed({
  get() {
    return props.modelValue === null ? '' : props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  },
});

const nameProp = computed(() => {
  return props.name || fieldId;
});

const formErrors =
  inject<Ref<{ path: string; message: string }[]>>('form-errors');
const errors = computed(() => {
  return (
    formErrors?.value.filter((error) => error.path === nameProp.value) || []
  );
});

const suffixIcon = computed(() => {
  if (errors.value.length) {
    return 'i-ic-outline-error-outline';
  }

  return props.trailingIcon;
});
</script>

<template>
  <UFormGroup :label="label" :name="nameProp" :required="required" size="xs">
    <UInput
      v-model="value"
      :type="type"
      :leading-icon="leadingIcon"
      :trailing-icon="suffixIcon"
      :color="color"
      :variant="variant"
      :size="size"
      :placeholder="placeholder"
      :disabled="disabled"
      :loading="loading"
      loading-icon="i-ic-outline-sync"
      @change="emits('change', value)"
      @blur="emits('blur', value)"
    />
  </UFormGroup>
</template>
