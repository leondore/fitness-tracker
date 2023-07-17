<script setup lang="ts">
import type { ColorOpts } from 'types/base';

interface Props {
  title: string;
  url: string;
  icon?: `i-ic-${string}`;
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
    class="flex items-center justify-between rounded-md border border-solid border-gray-700 bg-gray-950 py-5 px-6"
  >
    <div>
      <h4 class="font-semibold text-lg text-gray-100 mb-1">{{ title }}</h4>
      <p class="m-0 text-[0.8125rem] text-gray-400"><slot /></p>
    </div>

    <div
      class="rounded w-12 h-12 flex items-center justify-center"
      :class="colorClass[color]"
    >
      <UIcon :name="icon" class="text-white text-3xl" />
    </div>
  </NuxtLink>
</template>
