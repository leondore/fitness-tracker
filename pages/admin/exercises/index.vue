<script setup lang="ts">
import type { ExerciseFull } from '~/db/schema';
import { useAlert } from '@/composables/alert';
import { handleError } from '@/utils';

const { alert, showAlert } = useAlert('exercises_alert');

const { data: exercises, pending } = await useFetch('/api/exercises', {
  lazy: true,
});

const rows = computed(() => exercises.value || undefined);

const columns = [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'stages',
    label: 'Routine Stages',
  },
  {
    key: 'musclegroups',
    label: 'Muscle Groups',
  },
  {
    key: 'actions',
    label: 'Actions',
  },
];

const menuItems = (row: ExerciseFull) => [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => navigateTo(`/admin/exercises/${row.slug}`),
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: () => remove(row.id),
    },
  ],
];

async function remove(id: number) {
  try {
    const [deletedItem] = await $fetch('/api/exercises', {
      method: 'DELETE',
      body: { id },
    });

    showAlert(`Exercise: ${deletedItem?.name} was deleted successfully.`);
    if (exercises.value) {
      exercises.value = exercises.value.filter(
        (item) => item.id !== deletedItem?.id
      );
    } else {
      await refreshNuxtData();
    }
  } catch (error) {
    handleError({
      error,
      callback: showAlert,
      defaultMessage: 'An error occurred while trying to delete.',
    });
  }
}
</script>

<template>
  <div>
    <header class="flex item-center justify-between pb-6">
      <h2 class="text-xl mb-0">Exercises List</h2>
      <UButton
        type="button"
        variant="solid"
        size="sm"
        icon="i-heroicons-plus-circle"
        class="w-32 justify-center"
        @click="navigateTo('/admin/exercises/new')"
      >
        Add New
      </UButton>
    </header>

    <BaseAlert
      v-if="alert.show"
      class="mb-4"
      :type="alert.type"
      :name="alert.name"
      :message="alert.message"
      @close="alert.show = false"
    />

    <div class="w-full overflow-x-auto">
      <UTable :loading="pending" :columns="columns" :rows="rows">
        <template #stages-data="{ row }: { row: ExerciseFull }">
          <div class="flex items-center gap-1.5">
            <UBadge
              v-for="(stage, index) in row.exercisesToStages"
              :key="`ex${row.id}_stage${index}`"
              size="sm"
              >{{ stage.stages.name }}</UBadge
            >
          </div>
        </template>

        <template #musclegroups-data="{ row }: { row: ExerciseFull }">
          <div class="flex items-center gap-1.5">
            <UBadge
              v-for="(musclegroup, index) in row.exercisesToMuscleGroups"
              :key="`ex${row.id}_musclegroup${index}`"
              size="sm"
              >{{ musclegroup.muscleGroups.name }}</UBadge
            >
          </div>
        </template>

        <template #actions-data="{ row }: { row: ExerciseFull }">
          <UDropdown :items="menuItems(row)">
            <UButton
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal-20-solid"
            />
          </UDropdown>
        </template>
      </UTable>
    </div>
  </div>
</template>
