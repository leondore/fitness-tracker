<script setup lang="ts">
import type { ColorOpts, Alert } from '@/types';

const props = withDefaults(defineProps<Alert>(), {
  type: undefined,
  timeout: 0,
  closeable: true,
});

const emits = defineEmits<{
  (e: 'close'): void;
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
      return 'primary';
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
    :id="name"
    :icon="icon"
    :title="title"
    :description="message"
    :color="color"
    :timeout="timeout"
    :class="{ 'no-close': !closeable }"
    :callback="() => emits('close')"
  />
</template>

<style scoped>
.no-close :deep(button) {
  display: none;
}
</style>
