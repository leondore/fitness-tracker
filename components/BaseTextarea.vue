<script setup lang="ts">
import { uid } from 'uid';
import type { ColorOpts, SizeOpts } from '@/types';

const fieldId = `textarea_${uid()}`;

type ModelValue = string | number | null | undefined;
type InputVariant = 'outline' | 'none';

interface Props {
  modelValue?: ModelValue;
  name?: string;
  required?: boolean;
  label?: string;
  color?: ColorOpts;
  variant?: InputVariant;
  size?: SizeOpts;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  name: '',
  required: false,
  label: '',
  color: 'primary',
  variant: 'outline',
  size: 'md',
  rows: 4,
  placeholder: '',
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: ModelValue): void;
  (e: 'change', value: ModelValue): void;
  (e: 'blur', value: ModelValue): void;
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
</script>

<template>
  <UFormGroup :label="label" :name="nameProp" :required="required" size="xs">
    <UTextarea
      v-model="value"
      :color="color"
      :variant="variant"
      :size="size"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      resize
      class="w-full"
      @change="emits('change', value)"
      @blur="emits('blur', value)"
    />
  </UFormGroup>
</template>
