// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver } from 'nuxt/kit';
const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  runtimeConfig: {
    databaseUrl: '',
    databaseAuthToken: '',
    superAdmin: '',
    jwtSecret: '',
    openaiApiKey: '',
    dbDir: resolve('db'),
    public: {
      accessToken: '',
    },
  },
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/eslint-module',
    '@nuxt/image',
    '@nuxtjs/google-fonts',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxt/ui',
  ],
  app: {
    head: {
      title: 'Fitness Tracker | NinjaLion',
    },
  },
  ui: {
    icons: ['ic', 'mingcute'],
    safelistColors: ['indigo', 'red', 'green', 'orange', 'sky', 'gray'],
  },
  googleFonts: {
    families: {
      Poppins: [300, 400, 500, 600],
    },
    display: 'swap',
    prefetch: true,
  },
  supabase: {
    redirect: false,
  },
});
