<script setup lang="ts">
const formData = reactive({
  email: '',
  password: '',
});
</script>

<template>
  <UContainer as="div" class="py-4">
    <h2 class="text-2xl text-center mb-5">Login</h2>
    <form class="p-8 rounded border border-solid border-gray-700 bg-gray-950">
      <UInput
        v-model="formData.email"
        type="email"
        icon="i-ic-outline-alternate-email"
        color="indigo"
        variant="outline"
        size="lg"
        placeholder="Email Address"
        class="mb-3"
      />
      <UInput
        v-model="formData.password"
        type="password"
        icon="i-ic-outline-key"
        color="indigo"
        variant="outline"
        size="lg"
        placeholder="Password"
        class="mb-3"
      />
      <UButton type="submit" color="indigo" variant="solid" size="md" block>
        Login
      </UButton>

      <p class="text-center mt-3 text-sm">
        Don't have an account?
        <NuxtLink to="/signup" class="text-indigo-300 hover:underline"
          >Signup Now</NuxtLink
        >
      </p>
    </form>
  </UContainer>
</template>
