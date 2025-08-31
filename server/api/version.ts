export default defineEventHandler(async (event) => {
  // 取得 Nuxt 應用程式的 runtimeConfig
  const runtimeConfig = useRuntimeConfig();
  return {
    version: '1.0.0',
    commitHash: runtimeConfig.public.commitHash,
    timestamp: new Date().toISOString()
  }
})
