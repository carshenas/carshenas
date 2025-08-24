<script lang="ts" setup>
import type { Category, CategoryFilter } from '@/types/dto/category'
import { ref, onMounted, computed } from 'vue'
import { useMotion } from '@vueuse/motion'

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
  <div v-if="!_loading && !props.loading" class="categories-grid">
    <router-link 
      v-for="(category, index) in limitedCategories" 
      :key="category.id" 
      class="category"
      v-motion
      :initial="{
        opacity: 0,
        scale: 0.5,
        y: 50
      }"
      :enter="{
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 250,
          damping: 25,
          mass: 0.5,
          delay: index * 50
        }
      }"
      :hover="{
        scale: 1.05,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 10
        }
      }"
      :to="{
        name: 'ProductsPage',
        query: {
          category: category.id,
          categoryName: category.name
        }
      }"
    >
      <div class="icon" v-motion-pop-visible :delay="index * 50 + 100">
        <ImageLoader :src="category.image" :alt="category.name" width="120" class="catag_image" />
      </div>
      <span class="title text-text" v-motion-fade-visible :delay="index * 50 + 200">
        {{ category.name }}
      </span>
    </router-link>
  </div>

  <div v-else class="skeleton-grid">
    <div 
      v-for="n in 9" 
      :key="n" 
      class="skeleton-item"
      v-motion
      :initial="{ opacity: 0, scale: 0.8 }"
      :enter="{
        opacity: 1,
        scale: 1,
        transition: {
          delay: n * 50
        }
      }"
    >
      <v-skeleton-loader type="avatar"></v-skeleton-loader>
    </div>
  </div>
</template>

<style lang="scss">
.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  align-items: start;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.skeleton-item {
  padding: 8px;
}

.category {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  max-width: 64px;
  margin: 0 auto;
  cursor: pointer;
  transition: transform 0.2s ease;

  .icon {
    width: 100%;
    aspect-ratio: 1;
    background: #ffeee4;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: visible;
    transition: all 0.3s ease;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }
  }

  &:hover .icon {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    
    &::before {
      width: 100%;
      height: 100%;
    }
  }

  .title {
    margin-top: 8px;
    font-size: 12px;
    font-weight: 500;
    text-wrap: wrap;
    text-align: center;
    width: 100%;
    transition: color 0.3s ease;
  }

  &:hover .title {
    color: var(--primary-color, #ff6b6b);
  }
}

.catag_image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  transition: transform 0.3s ease;

  img {
    width: 70px;
    margin: -4px;
  }
}

.category:hover .catag_image {
  transform: scale(1.1) rotate(5deg);
}

// Responsive grid
@media (max-width: 480px) {
  .categories-grid,
  .skeleton-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
