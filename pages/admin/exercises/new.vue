<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';

interface Exercise {
  name: string;
  description: string;
  stages: { id: number; name: string }[];
  bodyparts: { id: number; name: string }[];
  video_url: string;
  image_url: string;
}

const formData = reactive<Exercise>({
  name: '',
  description: '',
  stages: [],
  bodyparts: [],
  video_url: '',
  image_url: '',
});

const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage(
        'You must enter a name for the exercise',
        required
      ),
    },
  };
});
const v$ = useVuelidate(rules, formData);

const client = useSupabaseClient();
const {
  data: stages,
  pending: stagesPending,
  error: stagesError,
} = await useAsyncData(
  'stages',
  async () => {
    const { data, error } = await client.from('stages').select('id, name');
    if (error) throw error;
    return data;
  },
  { lazy: true }
);
const stagesOptions = computed<Exercise['stages'] | undefined>(
  () => stages.value || undefined
);

const {
  data: muscles,
  pending: musclesPending,
  error: musclesError,
} = await useAsyncData(
  'bodyparts',
  async () => {
    const { data, error } = await client.from('bodyparts').select('id, name');
    if (error) throw error;
    return data;
  },
  { lazy: true }
);
const musclesOptions = computed<Exercise['bodyparts'] | undefined>(
  () => muscles.value || undefined
);

function addExercise() {
  v$.value.$validate();
  if (v$.value.$error) return;

  console.log(formData);
}
</script>

<template>
  <div>
    <header class="flex item-center justify-between pb-6">
      <h2 class="text-xl mb-0">Add New Exercise</h2>
      <UButton
        type="button"
        variant="solid"
        size="sm"
        icon="i-heroicons-arrow-left-20-solid"
        class="w-32 justify-center"
        @click="navigateTo('/admin/exercises')"
      >
        Back to List
      </UButton>
    </header>

    <form
      class="grid grid-cols-2 gap-3 p-8 rounded-md border border-solid border-zinc-700 bg-zinc-950"
      @submit.prevent="addExercise"
    >
      <BaseInput
        v-model="formData.name"
        type="text"
        label="Name"
        size="lg"
        placeholder="Enter a Name"
        class="col-span-2"
        :validation-status="v$.name"
        @change="v$.name.$touch"
        @blur="v$.name.$touch"
      />

      <BaseTextarea
        v-model="formData.description"
        label="Description"
        placeholder="Enter a Description"
        class="col-span-2"
      />

      <BaseSelect
        v-if="!musclesError"
        v-model="formData.bodyparts"
        label="Muscle Groups"
        size="lg"
        multiple
        placeholder="Select a muscle group"
        class="col-span-1"
        option-attr="name"
        :options="musclesOptions"
        :loading="musclesPending"
      />

      <BaseSelect
        v-if="!stagesError"
        v-model="formData.stages"
        label="Routine Stages"
        size="lg"
        multiple
        placeholder="Select applicable stages"
        class="col-span-1"
        option-attr="name"
        :options="stagesOptions"
        :loading="stagesPending"
      />
    </form>
  </div>
</template>
