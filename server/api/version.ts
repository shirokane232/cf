export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  return {
    version: runtimeConfig.public.commitHash,
    updatedAt: runtimeConfig.public.commitTime,
  }
})
