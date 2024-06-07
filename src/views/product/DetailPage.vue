<script lang="ts" setup>
import ImageLoader from '@/components/ImageLoader.vue'
import ColorSelector from './components/detail/ColorSelector.vue'
import CurrencyDisplay from '@/components/CurrencyDisplay.vue'
import CommentSection from './components/detail/CommentSection.vue'
import BrandsWarranty from './components/detail/BrandsWarranty.vue'
import ProductReview from './components/detail/ProductReview.vue'
import { useRoute } from 'vue-router'
import { getProductDetailsService } from '@/services/carshenas/product'
import { ref, computed, onMounted, watch } from 'vue'
import type { Brand, Color, Variant, Warranty } from '@/types/dto/product'
const route = useRoute()
const product = ref<Record<string, any>>({})
const spec = ref<Record<string, any>>({})
const variants = ref<Variant[]>([])
const selectedWarrantyPrice = ref<number | null>(null)
const selectedColorCode = ref<string | null>(null)
const handleSelectedWarranty = (selectedWarranty: { warranty: Warranty; brand: Brand }) => {
  const { warranty, brand } = selectedWarranty
  const selectedWarrantyObj = brand.warranties.find((w) => w.name === warranty.name)
  if (selectedWarrantyObj) {
    const selectedPrice = selectedWarrantyObj.price
    selectedWarrantyPrice.value = selectedPrice
  }
}

const productId = Number(route.params.id)
onMounted(() => {
  fetchProductDetails()
})

const fetchProductDetails = async () => {
  try {
    const response = await getProductDetailsService(productId)
    product.value = response.data
    spec.value = product.value.specification
    variants.value = product.value.variants
  } catch (error) {
    console.error('Failed to fetch product details:', error)
  }
}
const handleSelectColor = (colorCode: string) => {
  selectedColorCode.value = colorCode
}
const minPrice = computed<number>(() => {
  let minPrice = Infinity
  product.value.variants?.forEach((variant: Variant) => {
    if (variant.price < minPrice) {
      minPrice = variant.price
    }
  })
  return minPrice !== Infinity ? minPrice : 0
})

const displayPrice = computed<number>(() => {
  return selectedWarrantyPrice.value !== null ? selectedWarrantyPrice.value : minPrice.value
})
</script>

<template>
  <v-carousel show-arrows="hover" hide-delimiter-background>
    <v-carousel-item v-for="(image, index) in product.images" :key="index">
      <ImageLoader :src="image" height="100%" width="100%" :alt="`${product.title} ${index + 1}`" />
    </v-carousel-item>
  </v-carousel>

  <!-- <v-breadcrumbs :items="product.parent">
    <template v-slot:title="{ item }">
      {{ item.title }}
    </template>
  </v-breadcrumbs> -->

  <h1 class="px-4 title-md">{{ product.name }}</h1>

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

  <ColorSelector :variants="variants" @selectColor="handleSelectColor" key="variants" />

  <BrandsWarranty
    :variants="variants"
    :selectedColorCode="selectedColorCode"
    @updateWarranty="handleSelectedWarranty"
  />

  <ProductReview :desc="product.description" />

  <div id="spec" class="d-flex flex-column t-4 px-4 ga-8">
    <div class="d-flex align-center">
      <h4 role="heading" class="text-no-wrap">{{ $t('productDetail.details') }}</h4>
      <div class="w-100 border h-0 mx-2"></div>
    </div>
    <div class="d-flex flex-column">
      <div
        v-for="(value, key, index) in spec"
        :key="index"
        :class="[
          'd-flex',
          'justify-space-between',
          'rounded',
          'px-2',
          'py-4',
          index % 2 === 0 ? 'spec-even-bg' : ''
        ]"
      >
        <span>{{ key }}:</span>
        <span>{{ value }}</span>
      </div>
    </div>
  </div>

  <CommentSection :comments="product.comments" id="comments" />

  <div
    class="d-flex justify-space-between align-center px-4 py-3 elevation-5 position-sticky bottom-0 bg-white"
  >
    <v-btn prepend-icon="add" size="large">{{ $t('productDetail.addToCart') }}</v-btn>
    <CurrencyDisplay
      :value="displayPrice"
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
