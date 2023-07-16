<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});

const adminMenu = [
  {
    to: '/admin',
    label: 'Dashboard',
  },
  {
    to: '/admin/exercises',
    label: 'Exercises',
  },
  {
    to: '/admin/stages',
    label: 'Stages',
  },
  {
    to: '/admin/parts',
    label: 'Body Parts',
  },
];
</script>

<template>
  <UContainer as="div" class="py-4">
    <div class="flex basis">
      <div class="flex-shrink-0 flex-grow-0 basis-48">
        <p
          class="text-sm font-semibold text-gray-900 dark:text-gray-200 truncate leading-6"
        >
          Navigation
        </p>
        <UVerticalNavigation
          :links="adminMenu"
          :ui="{
            wrapper:
              'border-s border-gray-200 dark:border-gray-800 space-y-2 mt-2',
            base: 'group block border-s -ms-px lg:leading-6',
            padding: 'ps-4',
            rounded: '',
            font: '',
            ring: '',
            active:
              'text-primary-500 dark:text-primary-400 border-current font-semibold',
            inactive:
              'border-transparent hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300',
          }"
        />
      </div>

      <div class="flex-1">
        <NuxtPage />
      </div>
    </div>
  </UContainer>
</template>
