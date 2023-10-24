<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});

const adminMenu = [
  {
    to: '/admin/dashboard',
    label: 'Dashboard',
  },
  {
    to: '/admin/exercises',
    label: 'Exercises',
  },
  {
    to: '/admin/stages',
    label: 'Stages',
  },
  {
    to: '/admin/muscle-groups',
    label: 'Muscle Groups',
  },
];

const navOpen = ref(false);
const navToggleIcon = computed(() =>
  navOpen.value ? 'i-ic-outline-close' : 'i-ic-outline-menu'
);
const toggleNav = () => {
  navOpen.value = !navOpen.value;
};

const client = useSupabaseClient();
async function logout() {
  await client.auth.signOut();
}

const user = useSupabaseUser();
onMounted(() => {
  watchEffect(() => {
    if (!user.value) {
      navigateTo('/');
    }
  });
});
</script>

<template>
  <div>
    <header
      class="sticky top-0 z-50 w-full backdrop-blur flex-none border-b border-gray-200 dark:border-gray-800 bg-white/75 dark:bg-gray-900/75"
    >
      <UContainer as="div" class="py-3 flex items-center justify-between">
        <h1 class="font-semibold">Fitness Tracker</h1>
        <div class="flex items-center gap-2">
          <UButton
            type="button"
            size="sm"
            variant="soft"
            class="md:hidden"
            square
            :icon="navToggleIcon"
            @click="toggleNav"
          />
          <UButton
            type="button"
            size="sm"
            icon="i-ic-outline-logout"
            variant="soft"
            class="px-4 hidden md:flex"
            @click="logout"
          >
            Logout
          </UButton>
          <UButton
            type="button"
            size="sm"
            icon="i-ic-outline-logout"
            variant="soft"
            class="md:hidden"
            square
            @click="logout"
          />
        </div>
      </UContainer>
    </header>

    <UContainer as="main" class="py-8">
      <div class="flex">
        <div
          class="hidden md:block md:flex-shrink-0 md:flex-grow-0 md:basis-48"
          :class="{ 'nav-active': navOpen }"
        >
          <p
            class="text-sm font-semibold text-gray-900 dark:text-gray-200 truncate leading-6"
          >
            Navigation
          </p>
          <UVerticalNavigation
            :links="adminMenu"
            :ui="{
              wrapper:
                'border-s border-gray-200 dark:border-gray-800 space-y-2 mt-2',
              base: 'group block border-s -ms-px lg:leading-6 flex items-center',
              padding: 'ps-4',
              rounded: '',
              font: '',
              ring: '',
              active:
                'text-primary-500 dark:text-primary-400 border-current font-semibold',
              inactive:
                'border-transparent hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300',
              icon: {
                base: 'mr-1 text-base',
                active: 'text-primary-500 dark:text-primary-400',
                inactive:
                  'text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300',
              },
            }"
          />
        </div>

        <div class="flex-1 w-full md:w-auto md:pl-6">
          <NuxtPage />
        </div>
      </div>
    </UContainer>
  </div>
</template>

<style lang="postcss" scoped>
.nav-active {
  @apply fixed top-[57px] left-0 bottom-0 w-full z-50 bg-gray-900 px-6 py-4 block;
}
</style>
