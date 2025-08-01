<script setup lang="ts">
import { ref } from 'vue'
import ImageLoader from '@/components/ImageLoader.vue'
import { useRouter } from 'vue-router'

interface Banner {
  id: number
  image: string
  title?: string
  link?: string
  alt: string
}
const router = useRouter()

// Sample banner data - you can replace this with API data
const banners = ref<Banner[]>([
  {
    id: 1,
    image: '/banner.jpg',
    title: 'پیشنهادات ویژه',
    link: '/product/99',
    alt: 'پیشنهادات ویژه'
  }
])

const handleBannerClick = (banner: Banner) => {
  if (banner.link) {
    router.push(banner.link)
  }
}
</script>

<template>
  <div class="banner-carousel">
    <v-carousel cycle height="200" hide-delimiter-background show-arrows="hover" class="banner-carousel-vuetify">
      <v-carousel-item v-for="banner in banners" :key="banner.id" class="banner-slide"
        @click="handleBannerClick(banner)">
        <ImageLoader :src="banner.image" :alt="banner.alt" class="banner-image" width="100%" height="200"
          imgClass="banner-image" />
        <div v-if="banner.title" class="banner-overlay">
          <h3 class="banner-title">{{ banner.title }}</h3>
        </div>
      </v-carousel-item>
    </v-carousel>
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

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 20px 16px 16px;
  color: white;
}

.banner-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

/* Responsive design */
@media (max-width: 768px) {
  .banner-carousel-vuetify {
    height: 200px !important;
  }

  .banner-title {
    font-size: 16px;
  }
}
</style>