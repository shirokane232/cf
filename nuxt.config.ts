// https://nuxt.com/docs/api/configuration/nuxt-config
const commitHash = require('child_process').execSync('git rev-parse HEAD').toString().trim();
const commitTime = require('child_process').execSync('git log -1 --format=%cI').toString().trim();

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    preset: 'cloudflare-pages'
  },
  runtimeConfig: {
    threadsClientSecret: process.env.THREADS_CLIENT_SECRET,
    public: {
      threadsClientId: 'threadsClientId',
      threadsRedirectUri: 'threadsClientId',
      commitHash: commitHash,
      commitTime: commitTime,
    }
  }
})
