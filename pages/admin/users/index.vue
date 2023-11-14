<script setup lang="ts">
import type { User } from '~/db/schema';
import { Role } from '~/types/auth';
import { useAlert } from '@/composables/alert';
import { handleError } from '@/utils';

const { alert, showAlert } = useAlert('users_alert');

const { data: users, pending } = await useFetch('/api/users', {
  lazy: true,
});

const rows = computed(() => users.value || undefined);

const columns = [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'role',
    label: 'Role',
  },
  {
    key: 'id',
    label: 'User UID',
  },
  {
    key: 'actions',
    label: 'Actions',
  },
];

const menuItems = (row: User) => [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => navigateTo(`/admin/users/${row.id}`),
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: () => remove(row.id),
    },
  ],
];

async function remove(id: string) {
  try {
    const { user } = await $fetch('/api/users', {
      method: 'DELETE',
      body: { id },
    });

    showAlert(`User: ${user.email} was deleted successfully.`);
    if (users.value) {
      users.value = users.value.filter((item) => item.id !== user.id);
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

const idToCopy = ref('');
const { copy, copied } = useClipboard();

function copyId(id: string) {
  idToCopy.value = id;
  copy(idToCopy.value);
}
</script>

<template>
  <div>
    <header class="item-center flex justify-between pb-6">
      <h2 class="mb-0 text-xl">Users</h2>
      <UButton
        type="button"
        variant="solid"
        size="sm"
        icon="i-heroicons-plus-circle"
        class="w-32 justify-center"
        @click="navigateTo('/signup')"
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

    <div class="w-full overflow-x-auto">
      <UTable :loading="pending" :columns="columns" :rows="rows">
        <template #name-data="{ row }: { row: User }">
          <span>{{ row.firstName }}</span> <span>{{ row.lastName }}</span>
        </template>

        <template #role-data="{ row }: { row: User }">
          <div class="flex items-center gap-1.5">
            <UBadge v-if="row.roleId === Role.Admin" size="sm">Admin</UBadge>
            <UBadge v-else size="sm">Member</UBadge>
          </div>
        </template>

        <template #id-data="{ row }: { row: User }">
          <div
            class="group relative w-32 items-center overflow-hidden overflow-ellipsis whitespace-nowrap py-4"
          >
            {{ row.id }}
            <UButton
              color="indigo"
              variant="soft"
              icon="i-mingcute-copy-2-line"
              size="2xs"
              class="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 transition-opacity ease-out group-hover:opacity-100"
              @click="copyId(row.id)"
            >
              {{ copied ? 'Copied' : 'Copy' }}
            </UButton>
          </div>
        </template>

        <template #actions-data="{ row }: { row: User }">
          <UDropdown :items="menuItems(row)">
            <UButton
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal-20-solid"
            />
          </UDropdown>
        </template>
      </UTable>
    </div>
  </div>
</template>
