<script setup lang="ts">
const user = useSupabaseUser();
const client = useSupabaseClient();

const { data } = await useAsyncData('counts', async () => {
  const { count: exercises } = await client
    .from('exercises')
    .select('*', { count: 'exact', head: true });
  const { count: stages } = await client
    .from('stages')
    .select('*', { count: 'exact', head: true });
  const { count: parts } = await client
    .from('bodyparts')
    .select('*', { count: 'exact', head: true });

  return {
    exercises,
    stages,
    parts,
  };
});
</script>

<template>
  <div>
    <h2 class="text-xl mb-5">
      Welcome Back {{ user?.user_metadata?.first_name || 'friend' }}!
    </h2>

    <div class="grid grid-cols-3 gap-5">
      <BaseCard
        title="Exercises"
        url="/admin/exercises"
        icon="i-ic-outline-fitness-center"
      >
        View all ({{ data?.exercises || 0 }})
      </BaseCard>

      <BaseCard
        title="Stages"
        url="/admin/stages"
        icon="i-ic-outline-compare-arrows"
      >
        View all ({{ data?.stages || 0 }})
      </BaseCard>

      <BaseCard
        title="Body Parts"
        url="/admin/parts"
        icon="i-ic-outline-person-search"
      >
        View all ({{ data?.parts || 0 }})
      </BaseCard>
    </div>
  </div>
</template>
