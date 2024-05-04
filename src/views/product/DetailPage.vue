<script lang="ts" setup>
import { ref } from 'vue'
import ImageLoader from '@/components/ImageLoader.vue'
import ColorSelector from './components/detail/ColorSelector.vue'

const product = {
  images: ['@/assets/images/logo.svg', '@/assets/images/logo.svg'],
  title: 'باتری ماشین',
  description: 'این تست است برای توضیحات باتری خودرو',
  price: 250000,
  parent: [
    { title: 'باتری', id: 1 },
    { title: 'باتری پراید', id: 2 }
  ],
  score: 3.8,
  votersCount: 256,
  comprehensiveDescription: '',
  colors: [
    { id: 1, code: '#ff0000', title: 'قرمز' },
    { id: 2, code: '#00ff00', title: 'سبز' },
    { id: 3, code: '#0000ff', title: 'آبی' }
  ],
  warranty: [
    { id: 1, icon: '', title: 'ایران خودرو' },
    { id: 2, icon: '', title: 'سایپا' }
  ],
  summeeryImages:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Saipa_Quik_001.jpg/1280px-Saipa_Quik_001.jpg',
  summery:
    'باتری پراید بصورت فابریک یک باتری ۵۰ آمپر است. ولتاژ باطری پراید مانند تمام خودروهای سبک با پلتفرم مشابه نظیر تیبا، ساینا و کوئیک ۱۲ ولت است. ضمنا فضایی که در داخل کاپوت پراید برای باتری آن در نظر گرفته شده است ۲۵*۱۸*۲۳ سانتی متر است.'
}
</script>

<template>
  <v-carousel show-arrows="hover" hide-delimiter-background>
    <v-carousel-item v-for="(image, index) in product.images" :key="index">
      <ImageLoader :src="image" height="100%" width="100%" :alt="`${product.title} ${index + 1}`" />
    </v-carousel-item>
  </v-carousel>

  <v-breadcrumbs :items="product.parent">
    <template v-slot:title="{ item }">
      {{ item.title }}
    </template>
  </v-breadcrumbs>

  <h1 class="px-4 title-md">{{ product.title }}</h1>

  <div class="mt-4 px-4 d-flex flex-column ga-8">
    <p>
      <v-icon icon="mdi_star" />
      <span>{{ product.score }} </span>

      <span>
        {{
          $t('productDetail.scoreText', {
            count: product.votersCount
          })
        }}
      </span>
    </p>
  </div>

  <ColorSelector :items="product.colors" />

  <div class="mt-4 px-4 d-flex flex-column ga-8">
    <div class="d-flex align-center">
      <h4 role="heading">{{ $t('productDetail.warranty') }}</h4>
      <div class="w-100 border h-0 mx-2"></div>
    </div>
    <v-radio-group dir="ltr">
      <v-radio
        class="d-flex w-100 justify-space-between"
        v-for="warranty in product.warranty"
        :key="warranty.id"
        :label="warranty.title"
        :value="warranty.id"
        color="primary"
      />
    </v-radio-group>
  </div>

  <div class="mt-4 px-4 d-flex flex-column ga-8">
    <div class="d-flex align-center">
      <h4 role="heading" class="text-no-wrap">{{ $t('productDetail.summery') }}</h4>
      <div class="w-100 border h-0 mx-2"></div>
    </div>
    <p class="text-justify">{{ product.summery }}</p>
    <v-container>
      <v-img :width="400" aspect-ratio="16/9" cover :src="product.summeeryImages"></v-img>
    </v-container>
  </div>
</template>

<style lang="scss">
.v-carousel {
  aspect-ratio: 16/9;
  width: 100%;
  height: auto !important;

  .v-window__container {
    width: 100%;
    height: 100%;
  }
}
.text-summery {
  text-align: justify;
  font-size: 14px;
  line-height: 28px;
  width: 400;
}
</style>
