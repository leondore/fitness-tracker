<script setup lang="ts">
import { uid } from 'uid';
import type { ColorOpts, SizeOpts } from '@/types';

const fieldId = `select_${uid()}`;

type ModelValue = string | number | Record<string, any> | unknown[] | undefined;
type InputVariant = 'outline' | 'none';

interface Props {
  modelValue?: ModelValue;
  options?: string[] | { [key: string]: any; disabled?: boolean }[];
  by?: string;
  optionAttr?: string;
  name?: string;
  required?: boolean;
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
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  options: () => [],
  by: 'id',
  optionAttr: 'label',
  name: '',
  required: false,
  label: '',
  multiple: false,
  leadingIcon: undefined,
  trailingIcon: undefined,
  color: 'primary',
  variant: 'outline',
  size: 'md',
  placeholder: 'Select...',
  searchable: true,
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

const selected = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.map((selected) => selected[props.optionAttr]);
  }

  if (typeof props.modelValue === 'object') {
    return props.modelValue[props.optionAttr];
  }

  return props.modelValue;
});

const isSelected = computed(() => {
  if (typeof props.modelValue === 'number') return true;

  if (Array.isArray(props.modelValue)) {
    return props.modelValue.length > 0;
  }

  return !!props.modelValue;
});

const nameProp = computed(() => {
  return props.name || fieldId;
});

const formErrors = inject<Ref<{ path: string; message: string }[]>>(
  'form-errors',
  ref([])
);
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
    <USelectMenu
      v-model="value"
      :options="options"
      :by="by"
      :option-attribute="optionAttr"
      :multiple="multiple"
      :leading-icon="leadingIcon"
      :trailing-icon="suffixIcon"
      :variant="variant"
      :size="size"
      :placeholder="placeholder"
      :searchable="searchable"
      :disabled="disabled"
      :loading="loading"
      loading-icon="i-ic-outline-sync"
      @change="emits('change', value)"
      @blur="emits('blur', value)"
    >
      <template #label>
        <template v-if="isSelected">
          <div v-if="multiple" class="flex items-center gap-1">
            <UBadge
              v-for="item in selected"
              :key="`${fieldId}_${item}`"
              color="gray"
              size="xs"
              >{{ item }}</UBadge
            >
          </div>
          <div v-else>
            <UBadge color="gray" size="xs">{{ selected }}</UBadge>
          </div>
        </template>

        <template v-else>
          <div class="text-gray-500">{{ placeholder }}</div>
        </template>
      </template>
    </USelectMenu>
  </UFormGroup>
</template>
