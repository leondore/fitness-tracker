// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver } from 'nuxt/kit';
const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  runtimeConfig: {
    databaseUrl: '',
    databaseAuthToken: '',
    dbDir: resolve('db'),
  },
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/eslint-module',
    '@nuxt/image',
    '@nuxtjs/google-fonts',
    '@nuxthq/ui',
  ],
  app: {
    head: {
      title: 'Fitness Tracker | NinjaLion',
    },
  },
  ui: {
    icons: ['ic', 'lucide', 'mdi'],
    safelistColors: ['indigo', 'red', 'green', 'orange', 'sky', 'gray'],
  },
  googleFonts: {
    families: {
      Poppins: [300, 400, 500, 600],
      display: 'swap',
      prefetch: true,
    },
  },
});
