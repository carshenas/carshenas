<script lang="ts" setup>
import ImageLoader from "@/components/ImageLoader.vue";
</script>

<template>
  <v-container class="d-flex flex-column justify-center align-center">
    <ImageLoader
      src="@/assets/images/404-image.svg"
      width="100%"
      alt="404-image"
    />
    <h1 class="mt-12 title-lg">{{ $t("pageNotFound.pageNotFoundError") }}</h1>
    <p class="body-md mt-2">{{ $t("pageNotFound.wrongPath") }}</p>
    <router-link class="mt-4 d-block" to="/">{{
      $t("pageNotFound.returnHome")
    }}</router-link>
  </v-container>
</template>
