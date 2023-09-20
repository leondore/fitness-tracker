<script setup lang="ts">
import type { AlertProps } from 'components/BaseAlert.vue';

const client = useSupabaseClient();
const { data, pending } = await useAsyncData(
  'exercises',
  async () => {
    const { data, error } = await client
      .from('exercises')
      .select(
        `
      id,
      name,
      slug,
      stages (
        name
      ),
      bodyparts (
        name
      )
    `
      )
      .order('name', { ascending: true })
      .order('name', { foreignTable: 'bodyparts', ascending: true })
      .order('name', { foreignTable: 'stages', ascending: true });

    if (error) {
      alert.message = error.message;
      alert.show = true;
    }
    return data;
  },
  { lazy: true }
);

interface Exercise {
  id: number;
  name: string;
  slug: string;
  stages: { name: string }[];
  bodyparts: { name: string }[];
}
const rows = computed(() => data.value || undefined);

const alert = reactive<AlertProps & { show: boolean }>({
  name: 'exercises_alert',
  show: false,
  type: 'error',
  message: '',
});

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
    key: 'bodyparts',
    label: 'Muscle Groups',
  },
  {
    key: 'actions',
    label: 'Actions',
  },
];

const menuItems = (row: Exercise) => [
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
        <template #stages-data="{ row }">
          <div class="flex items-center gap-1.5">
            <UBadge
              v-for="(stage, index) in row.stages"
              :key="`ex${row.id}_stage${index}`"
              size="sm"
              >{{ stage.name }}</UBadge
            >
          </div>
        </template>

        <template #bodyparts-data="{ row }">
          <div class="flex items-center gap-1.5">
            <UBadge
              v-for="(bodypart, index) in row.bodyparts"
              :key="`ex${row.id}_bodypart${index}`"
              size="sm"
              >{{ bodypart.name }}</UBadge
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
