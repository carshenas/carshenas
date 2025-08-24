<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type PopularModel from '@/types/dto/popular-model'
import { getPopularModelsService } from '@/services/carshenas/vehicle'
import ImageLoader from '@/components/ImageLoader.vue'
import { RouterLink } from 'vue-router'
import { useMotion } from '@vueuse/motion'

const loading = ref(false)
const models = ref<PopularModel[]>()
const containerRef = ref<HTMLElement>()

// Container animation for scroll reveal
const { variant } = useMotion(containerRef, {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 500,
      ease: 'easeOut'
    }
  }
})

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
  <div ref="containerRef">
    <div v-if="!loading" class="models-container">
      <RouterLink
        v-for="(model, index) in models"
        :key="model.id"
        v-motion
        :initial="{
          opacity: 0,
          x: -20,
          scale: 0.95
        }"
        :enter="{
          opacity: 1,
          x: 0,
          scale: 1,
          transition: {
            duration: 400,
            delay: index * 100,
            ease: 'easeOut'
          }
        }"
        :tap="{
          scale: 0.95,
          transition: {
            duration: 150,
            ease: 'easeOut'
          }
        }"
        class="model-card"
        :to="{
          name: 'ProductsPage',
          query: { 
            vehicle: model.id,
            vehicleName: model.name
          }
        }"
      >
        <div class="image-wrapper">
          <ImageLoader
            :src="model.image"
            :alt="model.name"
            class="model-image"
            width="264"
            height="328"
          />
          <div class="model-overlay">
            <span class="model-name">{{ model.name }}</span>
          </div>
        </div>
      </RouterLink>
    </div>

    <div v-if="loading" class="skeletons-container">
      <div
        v-for="n in 5"
        :key="n"
        v-motion
        :initial="{ opacity: 0, scale: 0.9 }"
        :enter="{
          opacity: 1,
          scale: 1,
          transition: {
            duration: 300,
            delay: (n - 1) * 100,
            ease: 'easeOut'
          }
        }"
        class="skeleton-wrapper"
      >
        <v-skeleton-loader
          height="164"
          width="132"
          color="background"
          class="skeleton-item"
          type="ossein"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.models-container {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  gap: 16px;
  padding: 16px 0;
  margin-top: 24px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  
  // Hide scrollbar but keep functionality
  &::-webkit-scrollbar {
    height: 0;
  }
  
  // Add padding for first/last items
  &::before,
  &::after {
    content: '';
    min-width: 16px;
  }
}

.model-card {
  flex: 0 0 auto;
  text-decoration: none;
  scroll-snap-align: start;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  // Ensure touch target size
  min-width: 132px;
  min-height: 164px;
  
  // Focus state for accessibility
  &:focus-visible {
    outline: 2px solid var(--v-theme-primary);
    outline-offset: 2px;
  }
}

.image-wrapper {
  position: relative;
  width: 132px;
  height: 164px;
  border-radius: 10px;
  overflow: hidden;
  background: var(--v-theme-surface-variant);
}

.model-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  :deep(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.model-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.model-name {
  color: white;
  font-size: 14px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

// Show overlay on hover (desktop) or tap (mobile)
.model-card:active .model-overlay,
.model-card:focus-visible .model-overlay {
  transform: translateY(0);
}

// Desktop hover enhancement
@media (hover: hover) {
  .model-card:hover .model-overlay {
    transform: translateY(0);
  }
  
  // .model-card:hover .model-image {
  //   transform: scale(1.05);
  // }
}

// Skeleton loading
.skeletons-container {
  display: flex;
  overflow: hidden;
  gap: 16px;
  padding: 16px;
  margin-top: 24px;
}

.skeleton-wrapper {
  flex: 0 0 auto;
}

.skeleton-item {
  border-radius: 10px;
  border: 1px solid var(--v-theme-divider);
}

// Mobile optimizations
@media (max-width: 600px) {
  .models-container {
    gap: 12px;
    padding: 12px 0;
    margin-top: 16px;
  }
  
  .model-card {
    // Slightly smaller on mobile for better visibility
    min-width: 120px;
  }
  
  .image-wrapper {
    width: 120px;
    height: 150px;
  }
  
  .model-overlay {
    padding: 8px;
  }
  
  .model-name {
    font-size: 12px;
  }
}

// Dark theme adjustments
:deep(.v-theme--dark) {
  .model-overlay {
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 100%);
  }
  
  .image-wrapper {
    background: rgba(255, 255, 255, 0.05);
  }
}
</style>
