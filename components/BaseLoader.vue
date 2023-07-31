<script setup lang="ts">
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

interface Props {
  fullPage: boolean;
}
defineProps<Props>();

const isLoading = ref(true);
</script>

<template>
  <loading
    v-model:active="isLoading"
    color="#1e1b4b"
    :can-cancel="false"
    :is-full-page="fullPage"
  />
</template>
