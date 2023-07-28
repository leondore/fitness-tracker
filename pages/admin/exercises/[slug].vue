<script setup lang="ts">
import type { Database } from 'types/supabase';
import type { AlertProps } from 'components/BaseAlert.vue';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';

// ---- Component State ---- //
const { params } = useRoute();

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
  image_url: '',
  video_url: '',
});

const alert = reactive<AlertProps & { show: boolean }>({
  name: 'exercises_new_alert',
  show: false,
  type: 'success',
  message: '',
});

const saving = ref(false);
const loading = ref(false);
const client = useSupabaseClient<Database>();

// ---- Form validation ---- //
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

// ---- Reset State ---- //
function clearFormData() {
  formData.name = '';
  formData.description = '';
  formData.stages = [];
  formData.bodyparts = [];
  formData.image_url = '';
  formData.video_url = '';
}

// ---- Get Stages Select Options ---- //
const {
  data: stages,
  pending: stagesPending,
  error: stagesError,
} = await useAsyncData(
  'stages',
  async () => {
    const { data, error } = await client
      .from('stages')
      .select('id, name')
      .order('name');
    if (error) throw error;
    return data;
  },
  { lazy: true }
);
const stagesOptions = computed(() => stages.value || undefined);

// ---- Get Muscles Group Select Options ---- //
const {
  data: muscles,
  pending: musclesPending,
  error: musclesError,
} = await useAsyncData(
  'bodyparts',
  async () => {
    const { data, error } = await client
      .from('bodyparts')
      .select('id, name')
      .order('name');
    if (error) throw error;
    return data;
  },
  { lazy: true }
);
const musclesOptions = computed(() => muscles.value || undefined);

// ---- Get Exercise Data ---- //
async function getExercise(slug: string | string[]) {
  loading.value = true;

  try {
    const { data, error } = await client
      .from('exercises')
      .select(
        `
        name,
        description,
        stages (
          name
        ),
        bodyparts (
          name
        ),
        image_url,
        video_url
      `
      )
      .eq('slug', slug);

    if (error) throw error;

    return data;
  } catch (error) {
    let message = 'An error occurred while trying to load the data.';
    if (error instanceof Error) {
      message = error.message;
    }

    alert.show = true;
    alert.type = 'error';
    alert.message = message;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  watchEffect(async () => {
    if (params.slug !== 'new') {
      const data = await getExercise(params.slug);
      if (data) {
        Object.assign(formData, data[0]);
      }
    }
  });
});

// ---- Submission Function ---- //
async function addExercise() {
  v$.value.$validate();
  if (v$.value.$error) return;

  loading.value = true;
  try {
    const { data, error } = await client
      .from('exercises')
      .insert({
        name: formData.name,
        slug: slugify(formData.name),
        description: formData.description,
        image_url: formData.image_url,
        video_url: formData.video_url,
      })
      .select();

    if (error) throw error;

    const exerciseId = data[0].id;

    const exercisesStages = formData.stages.map((stage) => ({
      exercise_id: exerciseId,
      stage_id: stage.id,
    }));
    const { error: esError } = await client
      .from('exercises_stages')
      .insert(exercisesStages);
    if (esError) throw esError;

    const exercisesBodyparts = formData.bodyparts.map((bodypart) => ({
      exercise_id: exerciseId,
      bodypart_id: bodypart.id,
    }));
    const { error: ebpError } = await client
      .from('exercises_bodyparts')
      .insert(exercisesBodyparts);
    if (ebpError) throw ebpError;

    if (data.length) {
      alert.show = true;
      alert.type = 'success';
      alert.message = `Exercise: ${formData.name} was successfully created.`;
    }
    clearFormData();
    v$.value.$reset();
  } catch (error) {
    let message = 'An error occurred while trying to save.';
    if (error instanceof Error) {
      message = error.message;
    }

    alert.show = true;
    alert.type = 'error';
    alert.message = message;
  } finally {
    loading.value = false;
  }
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

    <BaseAlert
      v-if="alert.show"
      class="mb-4"
      :type="alert.type"
      :name="alert.name"
      :message="alert.message"
      @close="alert.show = false"
    />

    <form
      class="grid grid-cols-2 gap-4 p-8 rounded-md border border-solid border-zinc-700 bg-zinc-950"
      @submit.prevent="addExercise"
    >
      <BaseInput
        v-model="formData.name"
        type="text"
        label="Name"
        size="lg"
        placeholder="Ex. Push-Ups"
        class="col-span-2"
        :validation-status="v$.name"
        @change="v$.name.$touch"
        @blur="v$.name.$touch"
      />

      <BaseTextarea
        v-model="formData.description"
        label="Description"
        placeholder="Push-ups are a classic and effective bodyweight exercise that targets the upper body, especially the chest, shoulders, and triceps."
        class="col-span-2"
      />

      <BaseSelect
        v-if="!musclesError"
        v-model="formData.bodyparts"
        label="Muscle Groups"
        size="lg"
        multiple
        placeholder="Select a muscle group"
        class="col-span-2 md:col-span-1"
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
        class="col-span-2 md:col-span-1"
        option-attr="name"
        :options="stagesOptions"
        :loading="stagesPending"
      />

      <BaseInput
        v-model="formData.image_url"
        type="text"
        label="Image URL"
        size="lg"
        placeholder="https://example.com/image.jpg"
        class="col-span-2 md:col-span-1"
      />

      <BaseInput
        v-model="formData.video_url"
        type="text"
        label="Video URL"
        size="lg"
        placeholder="https://www.youtube.com/watch?v=zkU6Ok44_CI"
        class="col-span-2 md:col-span-1"
      />

      <UButton
        type="submit"
        color="indigo"
        variant="solid"
        size="md"
        block
        class="col-span-2 mt-2"
        :loading="saving"
      >
        Add Exercise
      </UButton>
    </form>
  </div>
</template>