<script setup lang="ts">
import useAppConfig from '@/composables/app-config'
import { computed, ref } from 'vue'
import IMAGES_TYPES from '@/constants/supported-image-types'
import type { ImageExtension } from '@/types/image.ts'

const appConfig = useAppConfig()
const props = defineProps<{
  src: string
  width?: string
  height?: string
  alt: string
  types?: ImageExtension[]
}>()
const picture = ref<HTMLPictureElement>()

const pathGenerator = (path: string, extension?: ImageExtension): string => {
  let isLocal = path.startsWith('@')
  let localPath = isLocal ? path.replace('@', '/src') : path

  const width = props.width?.includes('%') ? picture.value?.offsetWidth : props.width
  const height = props.width?.includes('%') ? picture.value?.offsetWidth : props.width

  // Replace path extension with new extension
  if (extension) {
    const urlPath = localPath.split('.')
    urlPath[urlPath.length - 1] = extension
    localPath = urlPath.join('.')
  }

  localPath = isLocal
    ? new URL(localPath, import.meta.url).toString()
    : `${appConfig.staticFileServer}/size:${width}*${height}/${localPath}`

  return localPath
}

const filteredImageTypes = computed(() =>
  props.types?.length ? IMAGES_TYPES.filter((item) => props.types!.includes(item.extension)) : []
)
</script>

<template>
  <picture ref="picture">
    <source
      v-for="source in filteredImageTypes"
      :key="source.type"
      :srcset="pathGenerator(props.src, source.extension)"
      :type="source.type"
    />

    <img
      :src="pathGenerator(props.src)"
      :alt="props.alt"
      :width="props.width"
      :height="props.height"
    />
  </picture>
</template>
