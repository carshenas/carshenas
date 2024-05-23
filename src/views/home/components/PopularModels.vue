<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type PopularModel from '@/types/dto/popular-model'
import { getPopularModelsService } from '@/services/carshenas/vehicle'

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
    <a class="ml-4" v-for="model in models" :key="model.id" href="#">
      <img :src="model.image" :alt="model.title" />
    </a>
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
