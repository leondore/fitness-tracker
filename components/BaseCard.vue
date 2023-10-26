<script setup lang="ts">
import type { ColorOpts } from '@/types';

interface Props {
  title: string;
  url: string;
  icon?: `i-${string}`;
  color?: ColorOpts;
}
withDefaults(defineProps<Props>(), {
  icon: 'i-ic-outline-local-fire-department',
  color: 'primary',
});

const colorClass = {
  primary: 'bg-primary-500',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  green: 'bg-green-500',
  sky: 'bg-sky-500',
  indigo: 'bg-indigo-500',
  gray: 'bg-gray-500',
};
</script>

<template>
  <NuxtLink
    :to="url"
    class="flex items-center justify-between rounded-md border border-solid border-gray-700 bg-gray-950 px-6 py-5"
  >
    <div>
      <h4 class="mb-1 text-lg font-semibold text-gray-100">{{ title }}</h4>
      <p class="m-0 text-[0.8125rem] text-gray-400"><slot /></p>
    </div>

    <div
      class="flex h-12 w-12 items-center justify-center rounded"
      :class="colorClass[color]"
    >
      <UIcon :name="icon" class="text-3xl text-white" />
    </div>
  </NuxtLink>
</template>
