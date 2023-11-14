<script setup lang="ts">
import { submitUserSchema, type UserSubmit } from '~/db/schema';
import { useAlert } from '@/composables/alert';
import { handleError } from '@/utils';
import { Role } from '~/types/auth';

const { alert, showAlert } = useAlert('users_insert_alert');

// ---- Component State ---- //
const { params } = useRoute();

const formData = reactive<UserSubmit>({
  email: '',
  firstName: '',
  lastName: '',
  roleId: 1,
});

const saving = ref(false);

// ---- Reset State ---- //
function clearFormData() {
  formData.email = '';
  formData.firstName = '';
  formData.lastName = '';
  formData.roleId = 1;
}

const roleOptions: { id: Role; label: string }[] = [
  { id: 1, label: 'Member' },
  { id: 2, label: 'Admin' },
];

// ---- Get User Data ---- //
const { data: user, pending } = await useFetch(`/api/users/${params.id}`, {
  lazy: true,
});

watchEffect(() => {
  if (user.value) {
    Object.assign(formData, user.value);
  }
});

// ---- Submission Function ---- //
async function save() {
  saving.value = true;

  try {
    const { user } = await $fetch(`/api/users/${params.id}`, {
      method: 'PUT',
      body: formData,
    });

    navigateTo('/admin/users');
    showAlert(`User: : ${user.email} was successfully created.`);

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
    <BaseLoader v-if="pending" :full-page="true" />

    <header class="item-center flex justify-between pb-6">
      <h2 class="mb-0 text-xl">Edit User</h2>
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
      :schema="submitUserSchema"
      :state="formData"
      @submit="save"
    >
      <BaseInput
        v-model="formData.email"
        type="email"
        name="email"
        label="Email Address"
        size="lg"
        class="col-span-2 md:col-span-1"
        disabled
      />

      <BaseSelect
        v-model="formData.roleId"
        name="roleId"
        label="Role"
        size="lg"
        class="col-span-2 md:col-span-1"
        value-attr="id"
        option-attr="label"
        :options="roleOptions"
      />

      <BaseInput
        v-model="formData.firstName"
        type="text"
        name="firstName"
        label="First Name"
        size="lg"
        class="col-span-2 md:col-span-1"
        required
      />

      <BaseInput
        v-model="formData.lastName"
        type="text"
        name="lastName"
        label="Last Name"
        size="lg"
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
        Save Changes
      </UButton>
    </UForm>
  </div>
</template>
