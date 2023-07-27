<script setup lang="ts">
import { uid } from 'uid';
import type { ColorOpts } from '@/types';

const fieldId = `textarea_${uid()}`;

type ModelValue = string | number | undefined;
type InputVariant = 'outline' | 'none';

interface Props {
  modelValue?: ModelValue;
  label?: string;
  color?: ColorOpts;
  variant?: InputVariant;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
  validationStatus?: Record<string, any>;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  color: 'primary',
  variant: 'outline',
  rows: 4,
  placeholder: '',
  validationStatus: () => ({}),
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: ModelValue): void;
  (e: 'change', value: ModelValue): void;
  (e: 'blur', value: ModelValue): void;
}>();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  },
});

const fieldColor = computed(() => {
  if (props.validationStatus.$dirty) {
    return props.validationStatus.$invalid ? 'red' : 'green';
  }

  return props.color;
});

const validationIcon = computed(() => {
  return {
    name: props.validationStatus.$invalid
      ? 'i-ic-outline-error-outline'
      : 'i-ic-outline-check-circle-outline',
    color: props.validationStatus.$invalid ? 'text-red-500' : 'text-green-500',
  };
});

const displayErrors = computed(
  () =>
    props.validationStatus.$dirty && props.validationStatus.$errors.length > 0
);
</script>

<template>
  <div data-component="textarea">
    <label v-if="label" :for="fieldId" class="text-xs inline-flex mb-1.5">{{
      label
    }}</label>

    <div class="relative">
      <UTextarea
        :id="fieldId"
        v-model="value"
        :color="fieldColor"
        :variant="variant"
        :rows="rows"
        :placeholder="placeholder"
        :disabled="disabled"
        resize
        class="w-full px-3.5 py-2.5"
        @change="emits('change', value)"
        @blur="emits('blur', value)"
      />

      <small v-if="displayErrors" class="block mt-1 text-xs text-red-500">
        {{ props.validationStatus.$errors[0].$message }}
      </small>

      <UIcon
        v-if="validationStatus.$dirty"
        :name="validationIcon.name"
        class="w-5 h-5 absolute top-2 right-3.5"
        :class="validationIcon.color"
      />
    </div>
  </div>
</template>
