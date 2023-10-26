<script setup lang="ts">
const user = useSupabaseUser();

const { data } = await useFetch('/api/dashboard', {
  lazy: true,
});
</script>

<template>
  <div>
    <h2 class="mb-5 text-xl">
      Welcome Back {{ user?.user_metadata?.first_name || 'friend' }}!
    </h2>

    <div class="grid gap-5 lg:grid-cols-3">
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
        title="Muscle Groups"
        url="/admin/muscle-groups"
        icon="i-mingcute-fitness-line"
      >
        View all ({{ data?.musclegroups || 0 }})
      </BaseCard>
    </div>
  </div>
</template>
