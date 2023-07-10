// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/eslint-module',
    '@nuxt/image',
    '@nuxtjs/google-fonts',
    '@nuxthq/ui',
    '@nuxtjs/supabase',
  ],
  ui: {
    icons: ['ic'],
    safelistColors: ['indigo', 'red', 'green', 'orange', 'sky'],
  },
  googleFonts: {
    families: {
      Poppins: [300, 400, 500, 600],
      display: 'swap',
      prefetch: true,
    },
  },
});
