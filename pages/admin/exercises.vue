<script setup lang="ts">
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
  <div>Exercises go here</div>
</template>
