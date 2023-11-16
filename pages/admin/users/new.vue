<script setup lang="ts">
import { signupSchema, type UserSignup } from '~/db/schema';
import { useAlert } from '@/composables/alert';
import { handleError } from '@/utils';

useHead({
  title: 'Add User | Fitness Tracker',
});

const { alert, showAlert } = useAlert('users_insert_alert');

// ---- Component State ---- //
const formData = reactive<UserSignup>({
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: '',
});

// ---- Reset State ---- //
function clearFormData() {
  formData.email = '';
  formData.firstName = '';
  formData.lastName = '';
  formData.password = '';
  formData.confirmPassword = '';
}

const saving = ref(false);

// ---- Submission Function ---- //
async function save() {
  saving.value = true;

  try {
    const { user } = await $fetch('/api/signup', {
      method: 'POST',
      body: formData,
    });

    navigateTo('/admin/users');
    showAlert(`User: ${user.email} was successfully created.`);

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
</script>

<template>
  <div>
    <header class="item-center flex justify-between pb-6">
      <h2 class="mb-0 text-xl">Add User</h2>
      <div>
        <UButton
          type="button"
          variant="solid"
          size="sm"
          icon="i-heroicons-arrow-left-20-solid"
          class="w-32 justify-center"
          @click="navigateTo('/admin/users')"
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
      :schema="signupSchema"
      :state="formData"
      @submit="save"
    >
      <BaseInput
        v-model="formData.email"
        type="email"
        name="email"
        label="Email Address"
        leading-icon="i-ic-outline-alternate-email"
        size="lg"
        class="col-span-2"
        required
      />

      <BaseInput
        v-model="formData.firstName"
        type="text"
        name="firstName"
        label="First Name"
        leading-icon="i-ic-outline-person"
        size="lg"
        class="col-span-2 md:col-span-1"
        required
      />

      <BaseInput
        v-model="formData.lastName"
        type="text"
        name="lastName"
        label="Last Name"
        leading-icon="i-ic-outline-person"
        size="lg"
        class="col-span-2 md:col-span-1"
      />

      <BaseInput
        v-model="formData.password"
        type="password"
        name="password"
        label="Password"
        leading-icon="i-ic-outline-key"
        size="lg"
        class="col-span-2 md:col-span-1"
        required
      />

      <BaseInput
        v-model="formData.confirmPassword"
        type="password"
        name="confirmPassword"
        label="Confirm Password"
        leading-icon="i-ic-outline-key"
        size="lg"
        class="col-span-2 md:col-span-1"
        required
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
        Add User
      </UButton>
    </UForm>
  </div>
</template>
