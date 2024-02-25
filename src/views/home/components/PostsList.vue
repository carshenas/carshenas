<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type Posts from '@/types/dto/post'
import { getPostsListService } from '@/services/carshenas/post'

const loading = ref(false)
const posts = ref<Posts[]>()

const getPosts = async () => {
  loading.value = true

  try {
    const response = await getPostsListService()
    posts.value = response
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => getPosts())
</script>

<template>
  <div v-if="!loading" class="mt-4 d-flex overflow-auto over">
    <v-card
      class="ml-4"
      v-for="post in posts"
      :key="post.id"
      width="258"
      min-width="258"
      height="145"
    >
      <v-img
        class="px-3 py-2 text-white"
        :src="post.image"
        cover
        gradient=" rgba(12,6,52,.6), rgba(12,6,52,.6)"
      >
        <div class="d-flex justify-end">
          <v-btn density="compact" icon="more_vert" variant="text"> </v-btn>
        </div>
        <h3 class="mt-7 title-sm">
          {{ post.title }}
        </h3>

        <div class="d-flex justify-space-between mt-2">
          <span class="subtitle">
            {{ post.tag }}
          </span>

          <span class="subtitle">
            {{ post.date }}
          </span>
        </div>
      </v-img>
    </v-card>
  </div>
  <div v-if="loading" class="mt-4 d-flex overflow-hidden over">
    <v-skeleton-loader
      v-for="n in 5"
      :key="n"
      min-width="258"
      height="146"
      color="background"
      class="ml-4 border"
      type="ossein"
    >
    </v-skeleton-loader>
  </div>
</template>

<style lang="scss" scoped>
.subtitle {
  font-size: 0.75rem;
  font-weight: 400;
}
</style>
