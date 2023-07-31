<script setup lang="ts">
import { Database } from 'types/supabase';

const user = useSupabaseUser();
const client = useSupabaseClient<Database>();

const { data } = await useAsyncData(
  'counts',
  async () => {
    const exercisesQuery = client
      .from('exercises')
      .select('*', { count: 'exact', head: true });
    const stagesQuery = client
      .from('stages')
      .select('*', { count: 'exact', head: true });
    const partsQuery = client
      .from('bodyparts')
      .select('*', { count: 'exact', head: true });

    const [exercisesRes, stagesRes, partsRes] = await Promise.all([
      exercisesQuery,
      stagesQuery,
      partsQuery,
    ]);

    return {
      exercises: exercisesRes.count,
      stages: stagesRes.count,
      parts: partsRes.count,
    };
  },
  { lazy: true }
);
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
