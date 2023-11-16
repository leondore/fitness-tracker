<script setup lang="ts">
import { loginSchema } from '~/db/schema';
import { useAlert } from '@/composables/alert';
import { handleError } from '@/utils';

useHead({
  title: 'Login | Fitness Tracker',
});

const { alert, showAlert } = useAlert('login_alert');

const formData = reactive({
  email: '',
  password: '',
});

function clearFormData() {
  formData.email = '';
  formData.password = '';
}

const loading = ref(false);
const client = useSupabaseClient();
const login = async () => {
  loading.value = true;

  try {
    const { error } = await client.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) throw error;

    clearFormData();
  } catch (error) {
    handleError({
      error,
      callback: showAlert,
      defaultMessage: 'An error occurred while logging in.',
    });
  } finally {
    loading.value = false;
  }
};

const user = useSupabaseUser();
onMounted(() => {
  watchEffect(() => {
    if (user.value) {
      navigateTo('/admin/dashboard');
    }
  });
});
</script>

<template>
  <UContainer as="div" class="py-4">
    <h2 class="mb-5 text-center text-2xl">Login</h2>
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
      :schema="loginSchema"
      :state="formData"
      @submit="login"
    >
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

      <p class="mt-3 text-center text-sm">
        Don't have an account?
        <NuxtLink to="/signup" class="text-indigo-300 hover:underline"
          >Signup Now</NuxtLink
        >
      </p>
    </UForm>
  </UContainer>
</template>
