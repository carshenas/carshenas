<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{ desc: string }>();

const isReviewVisible = ref(false);

function toggleReviewVisibility() {
  isReviewVisible.value = !isReviewVisible.value;
}
</script>

<template>
  <div id="summery" class="d-flex flex-column t-4 px-4 ga-4">
    <div class="d-flex align-center">
      <h4 role="heading" class="text-no-wrap">{{ $t("product.summery") }}</h4>
      <div class="w-100 border h-0 mx-2"></div>
    </div>
    <p
      :class="{ clamped: !isReviewVisible, unclamped: isReviewVisible }"
      class="text-justify desc"
    >
      {{ props.desc }}
    </p>
    <!-- <v-container>
      <v-img :width="400" aspect-ratio="16/9" cover :src="desc.summeryImages"></v-img>
    </v-container> -->
    <v-btn variant="text" color="primary" @click="toggleReviewVisibility">
      {{ isReviewVisible ? $t("shared.close") : $t("product.readMore") }}
    </v-btn>
  </div>
</template>

<style lang="scss" scoped>
.desc {
  overflow: hidden;
  transition: height 5s ease;
  transition: min-height 1s ease;
  height: 6em;
  min-height: 6em;
}

.desc.unclamped {
  -webkit-line-clamp: unset;
  height: 100%;
  min-height: 20rem;
}
</style>
