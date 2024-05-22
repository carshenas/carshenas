<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps<{
  desc: { summeryImages: string; summery: string; review: string }
}>()
const isReviewVisible = ref(false)

function toggleReviewVisibility() {
  isReviewVisible.value = !isReviewVisible.value
}
</script>
<template>
  <div id="summery" class="d-flex flex-column t-4 px-4 ga-4">
    <div class="d-flex align-center">
      <h4 role="heading" class="text-no-wrap">{{ $t('productDetail.summery') }}</h4>
      <div class="w-100 border h-0 mx-2"></div>
    </div>

    <p class="text-justify">{{ desc.summery }}</p>

    <v-container>
      <v-img :width="400" aspect-ratio="16/9" cover :src="desc.summeryImages"></v-img>
    </v-container>
    
    <v-btn variant="text" color="primary" @click="toggleReviewVisibility">
      {{ isReviewVisible ? $t('shared.close') : $t('productDetail.readMore') }}
    </v-btn>

    <p v-if="isReviewVisible" class="text-justify text-body-2">{{ desc.review }}</p>
  </div>
</template>

<style lang="scss" scoped></style>
