// https://nuxt.com/docs/api/configuration/nuxt-config
const commitHash = process.env.CF_PAGES_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || require('child_process').execSync('git rev-parse HEAD').toString().trim();
const commitTime = process.env.CF_PAGES_COMMIT_TIME
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    preset: 'cloudflare-pages'
  },
  runtimeConfig: {
    public: {
      commitHash: commitHash,
      commitTime: commitTime
    }
  }
})
