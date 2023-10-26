<script setup lang="ts">
import { signupSchema } from '~/db/schema';
import { useAlert } from '@/composables/alert';
import { handleError } from '@/utils';

const { alert, showAlert } = useAlert('signup_alert');

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

const loading = ref(false);
const signUp = async () => {
  loading.value = true;

  try {
    const user = await $fetch('/api/signup', {
      method: 'POST',
      body: formData,
    });

    if (user) {
      showAlert(
        "You've signed up successfully! Please check your email so you can verify your account."
      );
    }
    clearFormData();
  } catch (error) {
    handleError({
      error,
      callback: showAlert,
      defaultMessage: 'An error occurred while signing up. Please try again.',
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <UContainer as="div" class="py-4">
    <h2 class="mb-5 text-center text-2xl">Signup</h2>
    <BaseAlert
      v-if="alert.show"
      :type="alert.type"
      :name="alert.name"
      :message="alert.message"
      class="mb-4"
      @close="alert.show = false"
    />

    <UForm
      class="rounded border border-solid border-gray-700 bg-gray-950 p-8"
      :schema="signupSchema"
      :state="formData"
      @submit="signUp"
    >
      <div class="mb-3 grid grid-cols-2 gap-3">
        <BaseInput
          v-model="formData.firstName"
          name="firstName"
          leading-icon="i-ic-outline-person"
          size="lg"
          placeholder="First Name"
        />

        <BaseInput
          v-model="formData.lastName"
          name="lastName"
          leading-icon="i-ic-outline-person"
          size="lg"
          placeholder="Last Name"
        />
      </div>

      <BaseInput
        v-model="formData.email"
        type="email"
        name="email"
        leading-icon="i-ic-outline-alternate-email"
        size="lg"
        placeholder="Email Address"
        class="mb-3"
      />

      <BaseInput
        v-model="formData.password"
        type="password"
        name="password"
        leading-icon="i-ic-outline-key"
        size="lg"
        placeholder="Password"
        class="mb-3"
      />

      <BaseInput
        v-model="formData.confirmPassword"
        type="password"
        name="confirmPassword"
        leading-icon="i-ic-outline-key"
        size="lg"
        placeholder="Confirm Password"
        class="mb-3"
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

      <p class="mt-3 text-center text-sm">
        Already have an account?
        <NuxtLink to="/" class="text-indigo-300 hover:underline"
          >Login Here</NuxtLink
        >
      </p>
    </UForm>
  </UContainer>
</template>
