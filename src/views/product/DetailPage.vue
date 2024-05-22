<script lang="ts" setup>
import ImageLoader from '@/components/ImageLoader.vue'
import ColorSelector from './components/detail/ColorSelector.vue'
import CurrencyDisplay from '@/components/CurrencyDisplay.vue'
import CommentSection from './components/detail/CommentSection.vue'
import BrandsWarranty from './components/detail/BrandsWarranty.vue'
import ProductReview from './components/detail/ProductReview.vue'

import { ref, computed, watch } from 'vue'

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
  brands: [
    {
      id: 1,
      icon: '',
      title: 'ایران خودرو',
      warranties: [
        { name: 'گارانتی 1', price: 400000 },
        { name: 'گارانتی 2', price: 450000 },
        { name: 'گارانتی 3', price: 400000 }
      ]
    },
    {
      id: 2,
      icon: '',
      title: 'سایپا',
      warranties: [
        { name: 'گارانتی سگ 1', price: 420000 },
        { name: 'گارانتی سگ2', price: 450000 },
        { name: 'گارانتی سگ 3', price: 500000 }
      ]
    },
    {
      id: 3,
      icon: '',
      title: 'مدیران خودرو',
      warranties: [{ name: 'گارانتی ,وزغ 1', price: 600000 }]
    }
  ],
  specs: [
    { id: 1, title: '10kg', desc: 'وزن' },
    { id: 2, title: 'روسیه', desc: 'کشور مبدا' },
    { id: 3, title: '100m', desc: 'طول' }
  ],
  desc: {
    summeryImages:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Saipa_Quik_001.jpg/1280px-Saipa_Quik_001.jpg',
    summery:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است',
    review:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.'
  },
  comments: [
    { id: 1, author: 'فرزاد', rating: 4, date: '1398/02/03', text: 'عالیییییییییییییی' },
    { id: 2, author: 'فرهاد', rating: 2, date: '1398/02/03', text: 'شت' }
  ]
}
const selectedWarrantyPrice = ref<number | null>(null)
const handleSelectedWarrantyPrice = (selectedPrice: number) => {
  selectedWarrantyPrice.value = selectedPrice
}

const lowestWarrantyPrice = computed(() => {
  let minPrice = Infinity
  product.brands.forEach((brand) => {
    brand.warranties.forEach((warranty) => {
      if (warranty.price < minPrice) {
        minPrice = warranty.price
      }
    })
  })
  return minPrice === Infinity ? 0 : minPrice
})
selectedWarrantyPrice.value = lowestWarrantyPrice.value

const displayedPrice = computed(() => {
  return selectedWarrantyPrice.value ?? lowestWarrantyPrice.value
})
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

  <v-tabs bg-color="white" fixed-tabs class="position-sticky tab-pdp">
    <v-tab href="#summery">{{ $t('productDetail.summery') }}</v-tab>
    <v-tab href="#spec">{{ $t('productDetail.details') }}</v-tab>
    <v-tab href="#comments">{{ $t('productDetail.comments') }}</v-tab>
  </v-tabs>

  <div class="d-flex flex-column t-4 px-4 ga-8">
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

  <BrandsWarranty :brands="product.brands" @updateWarrantyPrice="handleSelectedWarrantyPrice" />

  <ProductReview :desc="product.desc" />

  <div id="spec" class="d-flex flex-column t-4 px-4 ga-8">
    <div class="d-flex align-center">
      <h4 role="heading" class="text-no-wrap">{{ $t('productDetail.details') }}</h4>
      <div class="w-100 border h-0 mx-2"></div>
    </div>
    <div class="d-flex flex-column">
      <div
        v-for="(spec, index) in product.specs"
        :key="spec.id"
        :class="[
          'd-flex',
          'justify-space-between',
          'rounded',
          'px-2',
          'py-4',
          index % 2 === 0 ? 'spec-even-bg' : ''
        ]"
      >
        <span>{{ spec.desc }}</span>
        <span>{{ spec.title }}</span>
      </div>
    </div>
  </div>

  <CommentSection :comments="product.comments" id="comments" />

  <div
    class="d-flex justify-space-between align-center px-4 py-3 elevation-5 position-sticky bottom-0 bg-white"
  >
    <v-btn prepend-icon="add" size="large">{{ $t('productDetail.addToCart') }}</v-btn>
    <CurrencyDisplay
      :value="displayedPrice"
      value-class="text-primary font-weight-bold"
      class="d-flex justify-end"
    />
  </div>
</template>

<style lang="scss" scoped>
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
.spec-even-bg {
  background-color: rgba(38, 38, 38, 0.1);
}
.bottom-0 {
  bottom: 0;
}
.tab-pdp {
  top: 3.9rem;
  z-index: 10;
  margin: 1rem 0;
}

#summery,
#spec,
#comments {
  scroll-margin-top: 8rem;
}
</style>
