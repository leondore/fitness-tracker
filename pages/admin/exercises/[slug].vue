<script setup lang="ts">
import { submitExerciseSchema, type ExerciseSubmitBody } from '~/db/schema';
import { useAlert } from '@/composables/alert';
import { handleError } from '@/utils';

const { alert, showAlert } = useAlert('exercises_insert_alert');

// ---- Component State ---- //
const { params } = useRoute();

const formData = reactive<ExerciseSubmitBody>({
  name: '',
  description: undefined,
  image_url: undefined,
  video_url: undefined,
  stages: [],
  musclegroups: [],
});

const saving = ref(false);
const loading = ref(false);
const generating = ref(false);

const content = computed(() =>
  params.slug === 'new'
    ? { title: 'Add New Exercise', btn: 'Add Exercise' }
    : { title: 'Edit Exercise', btn: 'Save Changes' }
);

// ---- Reset State ---- //
function clearFormData() {
  formData.name = '';
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

    const exercise: ExerciseSubmitBody = data[0];
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
    handleError({
      error,
      callback: showAlert,
      defaultMessage: 'An error occurred while trying to load the data.',
    });
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
async function save() {
  saving.value = true;

  type SubmitParams = {
    url: '/api/exercises' | `/api/exercises/${string}`;
    method: 'POST' | 'PUT';
  };
  const apiUrl: SubmitParams['url'] =
    params.slug === 'new' ? '/api/exercises' : `/api/exercises/${params.slug}`;
  const method: SubmitParams['method'] = params.slug === 'new' ? 'POST' : 'PUT';

  try {
    const savedItem = await $fetch(apiUrl, {
      method,
      body: formData,
    });

    navigateTo('/admin/exercises');
    showAlert(`Exercise: ${savedItem.name} was successfully created.`);

    clearFormData();
  } catch (error) {
    handleError({
      error,
      callback: showAlert,
      defaultMessage: 'An error occurred while trying to save.',
    });
  } finally {
    saving.value = false;
  }
}

async function generateDescription() {
  generating.value = true;

  try {
    const { data } = await $fetch('/api/generate-content', {
      method: 'POST',
      body: {
        message: `Can you write a 70 word description of this exercise: ${formData.name}?`,
      },
    });

    if (data) {
      formData.description = data;
    }
  } catch (error) {
    handleError({
      error,
      callback: showAlert,
      defaultMessage: 'An error occurred while trying to generate.',
    });
  } finally {
    generating.value = false;
  }
}
</script>

<template>
  <div>
    <BaseLoader v-if="loading" :full-page="true" />

    <header class="item-center flex justify-between pb-6">
      <h2 class="mb-0 text-xl">{{ content.title }}</h2>
      <div>
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
      </div>
    </header>

    <BaseAlert
      v-if="alert.show"
      class="mb-4"
      :type="alert.type"
      :name="alert.name"
      :message="alert.message"
      @close="alert.show = false"
    />

    <UForm
      class="grid grid-cols-2 gap-4 rounded-md border border-solid border-zinc-700 bg-zinc-950 p-8"
      :schema="submitExerciseSchema"
      :state="formData"
      @submit="save"
    >
      <BaseInput
        v-model="formData.name"
        type="text"
        name="name"
        label="Name"
        size="lg"
        placeholder="Ex. Push-Ups"
        class="col-span-2"
        required
      />

      <div class="group relative col-span-2">
        <BaseTextarea
          v-model="formData.description"
          name="description"
          label="Description"
          size="lg"
          placeholder="Push-ups are a classic and effective bodyweight exercise that targets the upper body, especially the chest, shoulders, and triceps."
          :rows="5"
        />

        <UButton
          type="button"
          color="sky"
          variant="solid"
          size="xs"
          icon="i-mingcute-openai-line"
          class="z-10 mt-2 w-full justify-center transition-opacity duration-200 ease-in-out sm:absolute sm:bottom-2.5 sm:right-2.5 sm:mt-0 sm:w-auto sm:!opacity-0 sm:group-focus-within:!opacity-100 sm:group-hover:!opacity-100"
          :disabled="!formData.name"
          :loading="generating"
          @click="generateDescription"
        >
          Generate Description
        </UButton>
      </div>

      <BaseSelect
        v-if="!musclesError"
        v-model="formData.musclegroups"
        name="musclegroups"
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
        name="stages"
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
        name="image_url"
        label="Image URL"
        size="lg"
        placeholder="https://example.com/image.jpg"
        class="col-span-2 md:col-span-1"
      />

      <BaseInput
        v-model="formData.video_url"
        type="text"
        name="video_url"
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
    </UForm>
  </div>
</template>
