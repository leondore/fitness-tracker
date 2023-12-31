<script setup lang="ts">
import type { MuscleGroup } from '~/db/schema';
import { useAlert } from '@/composables/alert';
import { handleError } from '@/utils';

useHead({
  title: 'Muscle Groups | Fitness Tracker',
});

const { alert, showAlert } = useAlert('bodyparts_alert');

// ---- Component State ---- //
const showNew = ref(false);
const newItem = reactive({ name: '' });
const toEdit = reactive({
  id: 0,
  name: '',
});

const saving = ref(false);

// ---- Reset State ---- //
function clearFormData() {
  newItem.name = '';
  toEdit.id = 0;
  toEdit.name = '';
  showNew.value = false;
}

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
      click: () => remove(row.id),
    },
  ],
];

function toggleAddNew() {
  showNew.value = !showNew.value;
  alert.show = false;
}

// ---- Get Muscle Groups Data ---- //
type PartialMuscleGroup = Pick<MuscleGroup, 'id' | 'name'>;
const {
  data: musclegroups,
  pending,
  error,
} = await useFetch<PartialMuscleGroup[]>('/api/muscle-groups', {
  lazy: true,
});

async function add() {
  saving.value = true;

  try {
    const [createdItem] = await $fetch('/api/muscle-groups', {
      method: 'POST',
      body: { name: newItem.name },
    });

    showAlert(`Muscle group: ${createdItem?.name} was added successfully.`);

    clearFormData();
    if (musclegroups.value) {
      musclegroups.value.push(createdItem);
      musclegroups.value.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      await refreshNuxtData();
    }
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

async function edit() {
  saving.value = true;

  try {
    const [updatedItem] = await $fetch('/api/muscle-groups', {
      method: 'PUT',
      body: { name: toEdit.name, id: toEdit.id },
    });

    showAlert(`Muscle group: ${updatedItem?.name} was updated successfully.`);

    clearFormData();
    if (musclegroups.value) {
      musclegroups.value?.splice(
        musclegroups.value?.findIndex((item) => item.id === updatedItem.id),
        1,
        updatedItem
      );
    } else {
      await refreshNuxtData();
    }
  } catch (error) {
    handleError({
      error,
      callback: showAlert,
      defaultMessage: 'An error occurred while trying to delete.',
    });
  } finally {
    saving.value = false;
  }
}

async function remove(id: number) {
  try {
    const [deletedItem] = await $fetch('/api/muscle-groups', {
      method: 'DELETE',
      body: { id },
    });

    showAlert(`Muscle group: ${deletedItem?.name} was deleted successfully.`);
    if (musclegroups.value) {
      musclegroups.value = musclegroups.value.filter(
        (item) => item.id !== deletedItem?.id
      );
    } else {
      await refreshNuxtData();
    }
  } catch (error) {
    handleError({
      error,
      callback: showAlert,
      defaultMessage: 'An error occurred while trying to delete.',
    });
  }
}
</script>

<template>
  <div>
    <header class="item-center flex justify-between pb-6">
      <h2 class="mb-0 text-xl">Muscle Groups</h2>
      <UButton
        type="button"
        variant="solid"
        size="sm"
        :icon="showNew ? 'i-heroicons-x-circle' : 'i-heroicons-plus-circle'"
        class="w-32 justify-center"
        @click="toggleAddNew"
      >
        {{ showNew ? 'Close' : 'Add New' }}
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

    <div v-if="showNew" class="relative pb-5 pt-3">
      <BaseInput
        v-model="newItem.name"
        type="text"
        size="md"
        placeholder="Enter a Name"
        class="w-full"
      />
      <UButton
        color="indigo"
        variant="solid"
        icon="i-ic-outline-save"
        size="2xs"
        class="absolute right-1.5 top-[18px]"
        :disabled="!newItem.name"
        :loading="saving"
        @click="add"
      >
        Add New
      </UButton>
    </div>

    <div class="relative mt-3 border-t border-gray-600">
      <BaseLoader v-if="pending" :full-page="false" />

      <div v-if="error" class="text-center">
        There was a problem loading your data. Please try again.
      </div>

      <template v-else>
        <div
          v-for="item in musclegroups"
          :key="`muscle_${item.id}`"
          class="flex items-center justify-between border-b border-gray-600 p-2"
        >
          <div>
            <div v-if="toEdit.id === item.id" class="flex items-center gap-2">
              <BaseInput v-model="toEdit.name" type="text" size="sm" />
              <UButton
                color="indigo"
                variant="solid"
                icon="i-ic-outline-save"
                size="sm"
                square
                :loading="saving"
                @click="edit"
              />
              <UButton
                color="red"
                variant="solid"
                icon="i-heroicons-x-circle"
                size="sm"
                square
                @click="clearFormData"
              />
            </div>

            <UBadge v-else size="sm">{{ item.name }}</UBadge>
          </div>

          <UDropdown :items="menuItems(item)">
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
