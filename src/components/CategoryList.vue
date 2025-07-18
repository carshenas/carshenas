<script lang="ts" setup>
import type { Category, CategoryFilter } from '@/types/dto/category'
import { ref, onMounted, computed } from 'vue'

// Services
import { getCategoryListService } from '@/services/carshenas/category'

// Global components
import ImageLoader from './ImageLoader.vue'

const props = defineProps<{
  items?: Category[]
  loading?: boolean
  filter?: CategoryFilter
  manual?: boolean
  rows?: number // Optional prop to limit the number of rows
}>()

const _loading = ref<boolean>(false)
const categories = ref<Category[]>()

// Compute the limited categories based on the rows prop
const limitedCategories = computed(() => {
  if (!categories.value && props.items) {
    return props.rows
      ? props.items.slice(0, props.rows * 4) // Limit by rows * 4 (4 categories per row)
      : props.items
  }
  return props.rows
    ? categories.value?.slice(0, props.rows * 4) // Limit by rows * 4
    : categories.value
})

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
  if (!props.manual) {
    getCategories()
  }
})
</script>

<template>
  <v-row class="align-start" v-if="!_loading && !props.loading" no-gutters>
    <v-col
      v-for="category in limitedCategories"
      :key="category.id"
      cols="3"
      class="d-flex justify-center"
    >
      <router-link
        class="category w-100 d-flex flex-column justify-center align-center"
        :to="{ name: 'ProductsPage', query: { category: category.id } }"
      >
        <div
          class="icon w-100 bg-category rounded-circle d-flex justify-center align-center"
        >
          <ImageLoader :src="category.image" :alt="category.name" width="44" />
        </div>

        <span class="title mt-2 text-text w-100">{{ category.name }}</span>
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
.bg-category {
  background: #ffeee4;
}

.category {
  text-decoration: none;
  max-width: 64px;

  .icon {
    aspect-ratio: 1;
  }

  .title {
    font-size: 0.8rem;
    font-weight: 500;
    text-wrap: wrap;
    text-align: center;
  }
}
</style>
