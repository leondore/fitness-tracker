<script setup lang="ts">
import type { AlertProps } from 'components/BaseAlert.vue';

// ---- Component State ---- //
const showNew = ref(false);
const newItem = reactive({ name: '' });
const toEdit = reactive({
  id: 0,
  name: '',
});

const alert = reactive<AlertProps & { show: boolean }>({
  name: 'bodyparts_alert',
  show: false,
  type: 'success',
  message: '',
});

const saving = ref(false);
const client = useSupabaseClient();

// ---- Reset State ---- //
function clearFormData() {
  newItem.name = '';
  toEdit.id = 0;
  toEdit.name = '';
  showNew.value = false;
}

// ---- Get Stages Data ---- //
const { data, pending, error } = await useAsyncData(
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

const menuItems = (row: { id: number; name: string }) => [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => Object.assign(toEdit, row),
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: () => deleteBodyPart(row.id),
    },
  ],
];

async function addBodyPart() {
  saving.value = true;

  try {
    const { error } = await client.from('bodyparts').insert({
      name: newItem.name,
      slug: slugify(newItem.name),
    });

    if (error) throw error;

    alert.show = true;
    alert.type = 'success';
    alert.message = 'Muscle group was added successfully.';

    clearFormData();
    await refreshNuxtData();
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

async function editBodyPart() {
  saving.value = true;

  try {
    const { error } = await client
      .from('bodyparts')
      .update({
        name: toEdit.name,
        slug: slugify(newItem.name),
      })
      .eq('id', toEdit.id);

    if (error) throw error;

    alert.show = true;
    alert.type = 'success';
    alert.message = 'Muscle group was updated successfully.';

    clearFormData();
    await refreshNuxtData();
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

async function deleteBodyPart(id: number) {
  try {
    const { error } = await client.from('bodyparts').delete().eq('id', id);

    if (error) throw error;

    alert.show = true;
    alert.type = 'success';
    alert.message = 'Muscle group was deleted successfully.';
    await refreshNuxtData();
  } catch (error) {
    let message = 'An error occurred while trying to delete.';
    if (error instanceof Error) {
      message = error.message;
    }

    alert.show = true;
    alert.type = 'error';
    alert.message = message;
  }
}
</script>

<template>
  <div>
    <header class="flex item-center justify-between pb-6">
      <h2 class="text-xl mb-0">Muscle Groups</h2>
      <UButton
        type="button"
        variant="solid"
        size="sm"
        icon="i-heroicons-plus-circle"
        class="w-32 justify-center"
        @click="
          showNew = true;
          alert.show = false;
        "
      >
        Add New
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

    <div v-if="showNew" class="flex item-center gap-2 pb-5 pt-3">
      <BaseInput
        v-model="newItem.name"
        type="text"
        size="md"
        placeholder="Enter a Name"
        class="flex-auto"
      />
      <UButton
        color="indigo"
        variant="solid"
        icon="i-ic-outline-save"
        size="md"
        class="w-32 basis-32 flex-shrink-0 flex-grow-0 justify-center"
        :loading="saving"
        @click="addBodyPart"
      >
        Add New
      </UButton>
    </div>

    <div class="relative border-t border-gray-600 mt-3">
      <BaseLoader v-if="pending" :full-page="false" />

      <div v-if="error" class="text-center">
        There was a problem loading your data. Please try again.
      </div>

      <template v-else>
        <div
          v-for="part in data"
          :key="`part${part.id}`"
          class="flex items-center justify-between p-2 border-b border-gray-600"
        >
          <div>
            <div v-if="toEdit.id === part.id" class="flex items-center gap-2">
              <BaseInput v-model="toEdit.name" type="text" size="sm" />
              <UButton
                color="indigo"
                variant="solid"
                icon="i-ic-outline-save"
                size="sm"
                square
                :loading="saving"
                @click="editBodyPart"
              />
            </div>

            <UBadge v-else size="sm">{{ part.name }}</UBadge>
          </div>

          <UDropdown :items="menuItems(part)">
            <UButton
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal-20-solid"
            />
          </UDropdown>
        </div>
      </template>
    </div>
  </div>
</template>