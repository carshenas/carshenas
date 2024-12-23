<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type PopularModel from '@/types/dto/popular-model'
import { getPopularModelsService } from '@/services/carshenas/vehicle'
import ImageLoader from '@/components/ImageLoader.vue'
import { RouterLink } from 'vue-router'

const loading = ref(false)
const models = ref<PopularModel[]>()

const getModels = async () => {
  loading.value = true

  try {
    const response = await getPopularModelsService()
    models.value = response.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => getModels())
</script>

<template>
  <div v-if="!loading" class="mt-6 d-flex overflow-auto">
    <RouterLink
      class="ml-4"
      v-for="model in models"
      :key="model.id"
      :to="{
        name: 'ProductsPage',
        query: { vehicle: model.id }
      }"
    >
      <ImageLoader
        :src="model.image"
        :alt="model.title"
        class="rounded-lg pop-models"
        width="132"
        height="164"
      />
    </RouterLink>
  </div>

  <div v-if="loading" class="mt-4 d-flex overflow-hidden over">
    <v-skeleton-loader
      v-for="n in 5"
      :key="n"
      height="164"
      min-width="132"
      color="background"
      class="ml-4 border"
      type="ossein"
    >
    </v-skeleton-loader>
  </div>
</template>

<style>
.pop-models img {
  border-radius: 10px;
}
</style>
