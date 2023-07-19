<script setup lang="ts">
import type { AlertProps } from 'components/BaseAlert.vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';
import { userKey } from '@/utils/auth';

const formData = reactive({
  email: '',
  password: '',
});

function clearFormData() {
  formData.email = '';
  formData.password = '';
}

const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage('The email field is required', required),
      email: helpers.withMessage('The email is incorrectly formatted', email),
    },
    password: {
      required: helpers.withMessage('The password field is required', required),
    },
  };
});
const v$ = useVuelidate(rules, formData);

const alert = reactive<AlertProps>({
  name: 'login_alert',
  show: false,
  type: 'error',
  message: '',
});

const loading = ref(false);
const client = useSupabaseClient();
const login = async () => {
  v$.value.$validate();
  if (v$.value.$error) return;

  loading.value = true;
  try {
    const { error } = await client.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) throw error;

    clearFormData();
    v$.value.$reset();
  } catch (error) {
    let message = 'An error occurred while logging in.';
    if (error instanceof Error) {
      message = error.message;
    }

    alert.show = true;
    alert.message = message;
  } finally {
    loading.value = false;
  }
};

const user = inject(userKey);
onMounted(() => {
  watchEffect(() => {
    if (user && user.value) {
      navigateTo('/admin');
    }
  });
});
</script>

<template>
  <UContainer as="div" class="py-4">
    <h2 class="text-2xl text-center mb-5">Login</h2>
    <BaseAlert
      :show="alert.show"
      :type="alert.type"
      :name="alert.name"
      :message="alert.message"
      class="mb-4"
      @update:show="alert.show = $event"
    />

    <form
      class="p-8 rounded border border-solid border-gray-700 bg-gray-950"
      @submit.prevent="login"
    >
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

      <UButton
        type="submit"
        color="indigo"
        variant="solid"
        size="md"
        block
        :loading="loading"
      >
        Login
      </UButton>

      <p class="text-center mt-3 text-sm">
        Don't have an account?
        <NuxtLink to="/signup" class="text-indigo-300 hover:underline"
          >Signup Now</NuxtLink
        >
      </p>
    </form>
  </UContainer>
</template>
