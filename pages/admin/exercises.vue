<script setup lang="ts">
const client = useSupabaseClient();
const { data: exercises } = await useAsyncData('exercises', async () => {
  return await client.from('exercises').select(`
      *,
      stages (
        name
      ),
      bodyparts (
        name
      )
    `);
});
</script>

<template>
  <div>
    <pre>{{ exercises }}</pre>
  </div>
</template>
