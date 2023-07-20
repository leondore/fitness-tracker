<script setup lang="ts">
const client = useSupabaseClient();
const { data, pending, error } = await useAsyncData(
  'exercises',
  async () => {
    const { data, error } = await client.from('exercises').select(`
      id,
      name,
      stages (
        name
      ),
      bodyparts (
        name
      )
    `);
    if (error) throw error;
    return data;
  },
  { lazy: true }
);

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
    key: 'id',
    label: 'Actions',
  },
];

const rows = computed<{ [key: string]: any }[] | undefined>(
  () => data.value || undefined
);
</script>

<template>
  <div>
    <h2 class="text-xl mb-5">Exercises List</h2>
    <BaseAlert
      v-if="error"
      type="error"
      name="Error"
      class="mb-4"
      :message="error.message"
      :closeable="false"
    />
    <UTable :loading="pending" :columns="columns" :rows="rows" />
  </div>
</template>
