<script lang="ts" setup>
import type { Category } from '@/types/dto/category'
import { ref, onMounted } from 'vue'

// Services
import { getCategoryListService } from '@/services/carshenas/category'

const props = defineProps<{
  items?: Category[]
}>()
const loading = ref<boolean>(false)
const categories = ref<Category[]>(props.items || [])

const getCategories = async () => {
  loading.value = true

  try {
    const response = await getCategoryListService()

    categories.value = response.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  !categories.value?.length ? getCategories() : undefined
})
</script>

<template>
  <v-row no-gutters>
    <v-col v-for="category in categories" :key="category.id" cols="3" class="pa-2">
      <router-link
        class="category w-100 d-flex flex-column justify-center align-center"
        :to="{ name: 'ProductsPage', query: { categoryId: category.id } }"
      >
        <div class="icon w-100 bg-primary rounded-circle d-flex justify-center align-center">
          <ImageLoader :src="category.icon" :alt="category.name" width="32" />
        </div>

        <span class="title mt-2 text-text">{{ category.name }}</span>
      </router-link>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
.category {
  text-decoration: none;
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
