<script setup lang="ts">
import useAppConfig from "@/composable/app-config";
import { computed, onMounted, ref, watch } from "vue";
import IMAGES_TYPES from "@/constants/supported-image-types";
import type { ImageExtension } from "@/types/image.ts";
import type { NullableString } from "@/types/global";
import { getAssetUrl } from "@/helpers/files";
import { WIDTH_PATTERN, HEIGHT_PATTERN } from "@/constants/regexp";

const appConfig = useAppConfig();
const props = defineProps<{
  src: NullableString;
  width?: string;
  height?: string;
  alt: string;
  types?: ImageExtension[];
  aspectRatio?: string;
}>();
const picture = ref<HTMLPictureElement>();
const images = ref<any[]>([]);
const defaultImage = ref<string | undefined>();

const filteredImageTypes = computed(() =>
  props.types?.length
    ? IMAGES_TYPES.filter((item) => props.types!.includes(item.extension))
    : []
);

const generateSrc = async (path: string): Promise<string> => {
  if (path.startsWith("@")) return await getAssetUrl(path);
  if (path.startsWith("http") && !path.startsWith(appConfig.staticFileServer))
    return (defaultImage.value = props.src!);

  const width = props.width?.includes("%")
    ? picture.value?.offsetWidth
    : props.width;
  const height = props.width?.includes("%")
    ? picture.value?.offsetWidth
    : props.width;

  return path
    .replace(WIDTH_PATTERN, String(width))
    .replace(HEIGHT_PATTERN, String(height));
};

const generateImagesUrl = async () => {
  if (!props.src) return;
  images.value = [];
  filteredImageTypes.value.forEach(async (type) =>
    props.src
      ? images.value?.push({ src: await generateSrc(props.src), ...type })
      : undefined
  );
  defaultImage.value = props.src ? await generateSrc(props.src) : undefined;
};

onMounted(() => generateImagesUrl());

watch(
  () => props.src,
  () => generateImagesUrl()
);
</script>

<template>
  <picture v-if="props.src" ref="picture">
    <source
      v-for="image in images"
      :key="image.type"
      :srcset="image.src"
      :type="image.type"
    />

    <img
      :src="defaultImage"
      :alt="props.alt"
      :width="props.width"
      :height="props.height"
      :style="`aspect-ratio: ${props.aspectRatio};`"
    />
  </picture>

  <v-icon v-else icon="hide_image" />
</template>
