<script setup lang="ts">
import { uid } from 'uid';
import type { ColorOpts, SizeOpts } from '@/types';

const fieldId = `select_${uid()}`;

type ModelValue = string | number | Record<string, any> | undefined;
type InputVariant = 'outline' | 'none';

interface Props {
  modelValue?: ModelValue;
  options?: string[] | { [key: string]: any; disabled?: boolean }[];
  label?: string;
  multiple?: boolean;
  leadingIcon?: `i-${string}`;
  trailingIcon?: `i-${string}`;
  color?: ColorOpts;
  variant?: InputVariant;
  size?: SizeOpts;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  searchable?: boolean;
  validationStatus?: Record<string, any>;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  options: () => [],
  label: '',
  multiple: false,
  leadingIcon: undefined,
  trailingIcon: undefined,
  color: 'primary',
  variant: 'outline',
  size: 'md',
  placeholder: '',
  searchable: true,
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

const suffixIcon = computed(() => {
  if (props.validationStatus.$dirty) {
    return props.validationStatus.$invalid
      ? 'i-ic-outline-error-outline'
      : 'i-ic-outline-check-circle-outline';
  }

  return props.trailingIcon;
});

const displayErrors = computed(
  () =>
    props.validationStatus.$dirty && props.validationStatus.$errors.length > 0
);
</script>

<template>
  <div data-component="select">
    <label v-if="label" :for="fieldId" class="text-xs inline-flex mb-1">{{
      label
    }}</label>

    <div class="relative pb-5">
      <USelectMenu
        :id="fieldId"
        v-model="value"
        :options="options"
        :multiple="multiple"
        :leading-icon="leadingIcon"
        :trailing-icon="suffixIcon"
        :color="fieldColor"
        :variant="variant"
        :size="size"
        :placeholder="placeholder"
        :searchable="searchable"
        :disabled="disabled"
        :loading="loading"
        loading-icon="i-ic-outline-sync"
        @change="emits('change', value)"
        @blur="emits('blur', value)"
      />

      <small
        v-if="displayErrors"
        class="block mt-1 text-xs text-red-500 absolute bottom-0"
      >
        {{ props.validationStatus.$errors[0].$message }}
      </small>
    </div>
  </div>
</template>
