<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ImageLoader from '@/components/ImageLoader.vue'
import { useRouter } from 'vue-router'
import { getSlider } from '@/services/carshenas/common'

interface Banner {
  alt: string
  action: string
  image: string
}

const router = useRouter()
const banners = ref<Banner[]>([])
const loading = ref<boolean>(false)
const error = ref<string | null>(null)

const fetchBanners = async (): Promise<void> => {
  loading.value = true
  error.value = null
  
  try {
    const response = await getSlider()
    banners.value = response.data || response // Adjust based on your API response structure
  } catch (e) {
    error.value = 'خطا در بارگذاری بنرها'
    console.error('Failed to fetch banners:', e)
  } finally {
    loading.value = false
  }
}

const handleBannerClick = (banner: Banner) => {
  if (banner.action) {
    // Check if it's an external URL or internal route
    if (banner.action.startsWith('http')) {
      window.open(banner.action, '_blank')
    } else {
      router.push(banner.action)
    }
  }
}

onMounted(() => {
  fetchBanners()
})
</script>

<template>
  <div class="banner-carousel">
    <!-- Loading state -->
    <div v-if="loading" class="banner-loading">
      <v-skeleton-loader type="image" height="200" class="banner-skeleton"></v-skeleton-loader>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="banner-error">
      <v-alert type="error" variant="tonal" class="mb-0">
        {{ error }}
        <template #append>
          <v-btn size="small" variant="text" @click="fetchBanners">
            تلاش مجدد
          </v-btn>
        </template>
      </v-alert>
    </div>

    <!-- Banners carousel -->
    <v-carousel 
      v-else-if="banners.length > 0"
      cycle 
      height="200" 
      hide-delimiter-background 
      show-arrows="hover" 
      class="banner-carousel-vuetify"
    >
      <v-carousel-item 
        v-for="(banner, index) in banners" 
        :key="index" 
        class="banner-slide"
        @click="handleBannerClick(banner)"
      >
        <ImageLoader 
          :src="banner.image" 
          :alt="banner.alt" 
          class="banner-image" 
          width="100%" 
          height="200"
          imgClass="banner-image" 
        />
      </v-carousel-item>
    </v-carousel>

    <!-- No banners state -->
    <div v-else class="no-banners">
      <v-card height="200" class="d-flex align-center justify-center" variant="tonal">
        <v-card-text class="text-center">
          <v-icon size="48" class="mb-2">mdi-image-off</v-icon>
          <div>هیچ بنری موجود نیست</div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<style>
.banner-carousel-vuetify {
  border-radius: 12px;
  overflow: hidden;
}

.banner-slide {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-skeleton {
  border-radius: 12px;
  overflow: hidden;
}

.banner-loading,
.banner-error,
.no-banners {
  margin-bottom: 0;
}

.banner-error .v-alert {
  border-radius: 12px;
}

.no-banners .v-card {
  border-radius: 12px;
  color: var(--v-theme-on-surface-variant);
}

/* Responsive design */
@media (max-width: 768px) {
  .banner-carousel-vuetify {
    height: 200px !important;
  }
}
</style>
