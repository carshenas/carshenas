<script lang="ts" setup>
import type { Category, CategoryFilter } from '@/types/dto/category'
import { ref, onMounted } from 'vue'

// Services
import { getCategoryListService } from '@/services/carshenas/category'

// Global components
import ImageLoader from './ImageLoader.vue'

const props = defineProps<{
  items?: Category[]
  loading?: boolean
  filter?: CategoryFilter
  manual?: boolean
}>()
const _loading = ref<boolean>(false)
const categories = ref<Category[]>()

const getCategories = async () => {
  _loading.value = true

  try {
    const response = await getCategoryListService(props.filter)

    categories.value = response.data
  } catch (e) {
    console.error(e)
  } finally {
    _loading.value = false
  }
}

onMounted(() => {
  !props.manual ? getCategories() : undefined
})
</script>

<template>
  <v-row v-if="!_loading && !props.loading" no-gutters>
    <v-col
      v-for="category in categories || props.items"
      :key="category.id"
      cols="3"
      class="pa-2 d-flex justify-center"
    >
      <router-link
        class="category w-100 d-flex flex-column justify-center align-center"
        :to="{ name: 'ProductsPage', query: { categoryId: category.id } }"
      >
        <div class="icon w-100 bg-primary rounded-circle d-flex justify-center align-center">
          <ImageLoader :src="category.image" :alt="category.name" width="32" />
        </div>

        <span class="title mt-2 text-text">{{ category.name }}</span>
      </router-link>
    </v-col>
  </v-row>

  <v-row v-else>
    <v-col v-for="n in 8" :key="n" cols="3" class="pa-2">
      <v-skeleton-loader type="avatar"></v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
.category {
  text-decoration: none;
  max-width: 64px;

  .icon {
    aspect-ratio: 1;
  }
  .title {
    font-size: 0.875rem;
    font-weight: 500;
    text-wrap: wrap;
    text-align: center;
  }
}
</style>
