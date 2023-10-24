<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import {
  required,
  email,
  sameAs,
  minLength,
  helpers,
} from '@vuelidate/validators';
import type { AlertProps } from '@/components/BaseAlert.vue';

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
});

function clearFormData() {
  formData.firstName = '';
  formData.lastName = '';
  formData.email = '';
  formData.password = '';
  formData.confirmPassword = '';
}

const rules = computed(() => {
  return {
    firstName: {
      required: helpers.withMessage(
        'The first name field is required',
        required
      ),
    },
    email: {
      required: helpers.withMessage('The email field is required', required),
      email: helpers.withMessage('The email is incorrectly formatted', email),
    },
    password: {
      required: helpers.withMessage('The password field is required', required),
      minLength: helpers.withMessage(
        'The password must be at least 8 characters long',
        minLength(8)
      ),
    },
    confirm_password: {
      required: helpers.withMessage(
        'The password confirmation field is required',
        required
      ),
      sameAs: helpers.withMessage(
        "Passwords don't match",
        sameAs(formData.password)
      ),
    },
  };
});
const v$ = useVuelidate(rules, formData);

const alert = reactive<AlertProps & { show: boolean }>({
  name: 'signup_alert',
  show: false,
  type: 'success',
  message: '',
});

const loading = ref(false);
const signUp = async () => {
  v$.value.$validate();
  if (v$.value.$error) return;

  loading.value = true;

  try {
    const user = await $fetch('/api/signup', {
      method: 'POST',
      body: formData,
    });

    if (user) {
      alert.show = true;
      alert.type = 'success';
      alert.message =
        "You've signed up successfully! Please check your email so you can verify your account.";
    }
    clearFormData();
    v$.value.$reset();
  } catch (error) {
    let message = 'An error occurred while signing up. Please try again.';
    if (error instanceof Error) {
      message = error.message;
    }
    alert.show = true;
    alert.type = 'error';
    alert.message = message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <UContainer as="div" class="py-4">
    <h2 class="text-2xl text-center mb-5">Signup</h2>
    <BaseAlert
      v-if="alert.show"
      :type="alert.type"
      :name="alert.name"
      :message="alert.message"
      class="mb-4"
      @close="alert.show = false"
    />

    <form
      class="p-8 rounded border border-solid border-gray-700 bg-gray-950"
      @submit.prevent="signUp"
    >
      <div class="grid grid-cols-2 gap-3 mb-3">
        <BaseInput
          v-model="formData.firstName"
          leading-icon="i-ic-outline-person"
          size="lg"
          placeholder="First Name"
          :validation-status="v$.firstName"
          @change="v$.firstName.$touch"
          @blur="v$.firstName.$touch"
        />

        <BaseInput
          v-model="formData.lastName"
          leading-icon="i-ic-outline-person"
          size="lg"
          placeholder="Last Name"
        />
      </div>

      <BaseInput
        v-model="formData.email"
        type="email"
        leading-icon="i-ic-outline-alternate-email"
        size="lg"
        placeholder="Email Address"
        class="mb-3"
        :validation-status="v$.email"
        @change="v$.email.$touch"
        @blur="v$.email.$touch"
      />

      <BaseInput
        v-model="formData.password"
        type="password"
        leading-icon="i-ic-outline-key"
        size="lg"
        placeholder="Password"
        class="mb-3"
        :validation-status="v$.password"
        @change="v$.password.$touch"
        @blur="v$.password.$touch"
      />

      <BaseInput
        v-model="formData.confirmPassword"
        type="password"
        leading-icon="i-ic-outline-key"
        size="lg"
        placeholder="Confirm Password"
        class="mb-3"
        :validation-status="v$.confirm_password"
        @change="v$.confirm_password.$touch"
        @blur="v$.confirm_password.$touch"
      />

      <UButton
        type="submit"
        color="indigo"
        variant="solid"
        size="md"
        block
        :loading="loading"
      >
        Signup
      </UButton>

      <p class="text-center mt-3 text-sm">
        Already have an account?
        <NuxtLink to="/" class="text-indigo-300 hover:underline"
          >Login Here</NuxtLink
        >
      </p>
    </form>
  </UContainer>
</template>
