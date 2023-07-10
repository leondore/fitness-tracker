<script setup lang="ts">
import type { ColorOpts } from '@/types/base';

export interface AlertProps {
  name: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timeout?: number;
  show?: boolean;
}
const props = withDefaults(defineProps<AlertProps>(), {
  type: undefined,
  timeout: 0,
  show: false,
});

const emits = defineEmits<{
  (e: 'update:show', value: boolean): void;
}>();

const title = computed(() => {
  return props.type
    ? props.type[0].toLocaleUpperCase() + props.type.slice(1)
    : 'Heads Up!';
});

const color = computed<ColorOpts>(() => {
  switch (props.type) {
    case 'success':
      return 'green';
    case 'error':
      return 'red';
    case 'warning':
      return 'orange';
    case 'info':
      return 'sky';
    default:
      return 'indigo';
  }
});

const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return 'i-ic-outline-check-circle-outline';
    case 'error':
      return 'i-ic-outline-error-outline';
    case 'warning':
      return 'i-ic-outline-warning-amber';
    case 'info':
      return 'i-ic-outline-info';
    default:
      return '';
  }
});
</script>

<template>
  <UNotification
    v-if="show"
    :id="name"
    :icon="icon"
    :title="title"
    :description="message"
    :color="color"
    :timeout="timeout"
    :callback="() => emits('update:show', false)"
  />
</template>
