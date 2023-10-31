import { useStorage } from '@vueuse/core';
import type { AuthUser } from '~/types/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = useSupabaseUser() as Ref<AuthUser | null>;

  const isMember = computed(
    () => user.value?.app_metadata?.role && user.value?.app_metadata?.role >= 1
  );
  const isAdmin = computed(() => user.value?.app_metadata?.role === 2);

  const config = useRuntimeConfig();
  const accessToken = useStorage(config.public.accessToken, {
    access_token: '',
  });
  const token = computed(() => accessToken.value.access_token);

  return { isMember, isAdmin, token };
});
