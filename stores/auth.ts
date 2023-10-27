import type { AuthUser } from '~/types/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = useSupabaseUser() as Ref<AuthUser | null>;

  const isMember = computed(
    () => user.value?.app_metadata?.role && user.value?.app_metadata?.role >= 1
  );
  const isAdmin = computed(() => user.value?.app_metadata?.role === 2);

  return { isMember, isAdmin };
});
