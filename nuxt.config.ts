// https://nuxt.com/docs/api/configuration/nuxt-config
const commitHash = require('child_process').execSync('git rev-parse HEAD').toString().trim();
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    preset: 'cloudflare-pages'
  },
  runtimeConfig: {
    public: {
      commitHash: commitHash,
    }
  }
})
