export const getAssetUrl = async (path: string) => {
  const glob = import.meta.glob('@/assets/images/**/*')

  const module = await glob[path.replace('@/', '/src/')]()
  return (module as any).default as string
}
