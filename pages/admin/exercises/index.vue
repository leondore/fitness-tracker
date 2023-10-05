<script setup lang="ts">
import type { ExerciseJoined } from '~/db/schema';
import { useAlert } from '@/composables/alert';

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

const menuItems = (row: ExerciseJoined) => [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => navigateTo(`/admin/exercises/${row.slug}`),
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: () => deleteExercise(row.id),
    },
  ],
];

async function deleteExercise(id: number) {
  try {
    const { error } = await client.from('exercises').delete().eq('id', id);

    if (error) throw error;

    alert.show = true;
    alert.type = 'success';
    alert.message = 'Exercise was deleted successfully.';
    await refreshNuxtData();
  } catch (error) {
    let message = 'An error occurred while trying to delete.';
    if (error instanceof Error) {
      message = error.message;
    }

    alert.show = true;
    alert.type = 'error';
    alert.message = message;
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
      type="error"
      name="Error"
      class="mb-4"
      :message="alert.message"
      @close="alert.show = false"
    />

    <div class="w-full overflow-x-auto">
      <UTable :loading="pending" :columns="columns" :rows="rows">
        <template #stages-data="{ row }: { row: ExerciseJoined }">
          <div class="flex items-center gap-1.5">
            <UBadge
              v-for="(stage, index) in row.exercisesToStages"
              :key="`ex${row.id}_stage${index}`"
              size="sm"
              >{{ stage.stages.name }}</UBadge
            >
          </div>
        </template>

        <template #musclegroups-data="{ row }">
          <div class="flex items-center gap-1.5">
            <UBadge
              v-for="(musclegroup, index) in row.exercisesToMuscleGroups"
              :key="`ex${row.id}_musclegroup${index}`"
              size="sm"
              >{{ musclegroup.muscleGroups.name }}</UBadge
            >
          </div>
        </template>

        <template #actions-data="{ row }">
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
