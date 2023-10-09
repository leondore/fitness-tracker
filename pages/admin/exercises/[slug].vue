<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import type { ExerciseInsertFull } from '~/db/schema';
import { useAlert } from '@/composables/alert';

const { alert, showAlert } = useAlert('exercises_insert_alert');

interface ExerciseBody extends ExerciseInsertFull {
  stages?: { id: number; name: string }[];
  musclegroups?: { id: number; name: string }[];
}

// ---- Component State ---- //
const { params } = useRoute();

const formData = reactive<ExerciseBody>({
  name: '',
  slug: '',
  description: '',
  image_url: '',
  video_url: '',
  stages: [],
  musclegroups: [],
});

const saving = ref(false);
const loading = ref(false);

const content = computed(() =>
  params.slug === 'new'
    ? { title: 'Add New Exercise', btn: 'Add Exercise' }
    : { title: 'Edit Exercise', btn: 'Save Changes' }
);

function handleError(error: unknown, defaultMessage = '') {
  let message = defaultMessage;
  if (error instanceof Error) {
    message = error.message;
  }

  showAlert(message, 'error');
}

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
  formData.slug = '';
  formData.description = '';
  formData.image_url = '';
  formData.video_url = '';
  formData.stages = [];
  formData.musclegroups = [];
}

// ---- Get Stages Select Options ---- //
const {
  data: stages,
  pending: stagesPending,
  error: stagesError,
} = await useFetch('/api/stages', {
  lazy: true,
});
const stagesOptions = computed(() => stages.value || undefined);

// ---- Get Muscles Group Select Options ---- //
const {
  data: muscles,
  pending: musclesPending,
  error: musclesError,
} = await useFetch('/api/muscle-groups', {
  lazy: true,
});
const musclesOptions = computed(() => muscles.value || undefined);

// ---- Get Exercise Data ---- //
async function getExercise(slug: string | string[]) {
  loading.value = true;

  try {
    const data = await $fetch(`/api/exercises/${slug}`);

    if (!data.length) {
      throw new Error('Exercise not found.');
    }

    const exercise: ExerciseBody = data[0];
    if (
      exercise.exercisesToMuscleGroups &&
      exercise.exercisesToMuscleGroups.length
    ) {
      exercise.musclegroups = [];
      exercise.exercisesToMuscleGroups.forEach((muscleGroup) => {
        exercise.musclegroups?.push(muscleGroup.muscleGroups);
      });
      delete exercise.exercisesToMuscleGroups;
    }
    if (exercise.exercisesToStages && exercise.exercisesToStages.length) {
      exercise.stages = [];
      exercise.exercisesToStages.forEach((stage) => {
        exercise.stages?.push(stage.stages);
      });
      delete exercise.exercisesToStages;
    }

    return exercise;
  } catch (error) {
    handleError(error, 'An error occurred while trying to load the data.');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  watchEffect(async () => {
    if (params.slug !== 'new') {
      const data = await getExercise(params.slug);
      if (data) {
        Object.assign(formData, data);
      }
    }
  });
});

// ---- Submission Function ---- //
async function addExercise() {
  v$.value.$validate();
  if (v$.value.$error) return;

  saving.value = true;
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
    saving.value = false;
  }
}
</script>

<template>
  <div>
    <BaseLoader v-if="loading" :full-page="true" />

    <header class="flex item-center justify-between pb-6">
      <h2 class="text-xl mb-0">{{ content.title }}</h2>
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
        v-model="formData.musclegroups"
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
        {{ content.btn }}
      </UButton>
    </form>
  </div>
</template>
