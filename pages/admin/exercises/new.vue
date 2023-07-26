<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';

const formData = reactive({
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
        label="Exercise Name"
        size="lg"
        placeholder="Enter Name"
        class="col-span-2"
        :validation-status="v$.name"
        @change="v$.name.$touch"
        @blur="v$.name.$touch"
      />
    </form>
  </div>
</template>
