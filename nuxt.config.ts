import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  routeRules: {
    '/dashboard': { redirect: '/' },
  },
  modules: [
    '@nuxt/fonts',
    '@nuxt/eslint',
    '@nuxt/image',
    'shadcn-nuxt',
    '@nuxtjs/color-mode'
  ],
  css: ['~/assets/css/app.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})