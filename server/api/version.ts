export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  return {
    version: runtimeConfig.public.commitHash,
    updateAt: runtimeConfig.public.commitTime,
  }
})
