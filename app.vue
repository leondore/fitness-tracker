<script setup lang="ts">
import { userKey } from '@/utils/auth';

const user = useSupabaseUser();
provide(userKey, user);
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
