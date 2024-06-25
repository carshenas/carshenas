<script lang="ts" setup>
import ImageLoader from '@/components/ImageLoader.vue'
import ColorSelector from './components/ColorSelector.vue'
import CurrencyDisplay from '@/components/CurrencyDisplay.vue'
import CommentSection from './components/CommentSection.vue'
import BrandsWarranty from './components/BrandsWarranty.vue'
import ProductReview from './components/ProductReview.vue'
import { useRoute } from 'vue-router'
import { getProductDetailsService } from '@/services/carshenas/product'
import { ref, computed, onMounted } from 'vue'
import type { Variant, Warranty, Brand } from '@/types/dto/product'
import SpecSection from './components/SpecSection.vue'

const route = useRoute()
const product = ref<Record<string, any>>({})
const spec = ref<Record<string, any>>({})
const variants = ref<Variant[]>([])
const selectedWarrantyPrice = ref<number | null>(null)
const selectedColorCode = ref<string | null>(null)
const selectedWarranty = ref<Warranty[] | null>(null)
const selectedBrand = ref<Brand | null>(null)
const selectedTab = ref(0)
const isLoading = ref(true)

const handleSelectedWarranty = (selectedWarrantyData: Warranty | null) => {
  if (selectedWarrantyData) {
    selectedWarrantyPrice.value = Math.min(...selectedWarrantyData.price)
    selectedWarranty.value = [selectedWarrantyData]
  } else {
    selectedWarrantyPrice.value = null
    selectedWarranty.value = null
  }
}

const handleSelectedBrand = (selectedBrandData: Brand) => {
  selectedBrand.value = selectedBrandData
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
  } finally {
    isLoading.value = false
  }
}

const handleSelectColor = (colorCode: string) => {
  selectedColorCode.value = colorCode
}

const tabItems = ref([
  { title: 'productDetail.summery', href: '#summery' },
  { title: 'productDetail.details', href: '#spec' },
  { title: 'productDetail.comments', href: '#comments' }
])

const minPrice = computed<number>(() => {
  let minPrice = Infinity
  product.value.variants?.forEach((variant: Variant) => {
    if (variant.price < minPrice) {
      minPrice = variant.price
    }
  })
  return minPrice !== Infinity ? minPrice : 0
})

const selectedVariant = computed<Variant | null>(() => {
  const warranty = selectedWarranty.value && selectedWarranty.value[0]
  if (selectedColorCode.value && selectedBrand.value && warranty) {
    return (
      variants.value.find(
        (variant: Variant) =>
          variant.color.code === selectedColorCode.value &&
          variant.brand === selectedBrand.value?.name &&
          variant.warranty === warranty.name
      ) || null
    )
  }
  return null
})

const displayPrice = computed<number>(() => {
  if (selectedColorCode.value && selectedVariant.value) {
    return selectedVariant.value.price
  } else if (selectedWarrantyPrice.value !== null) {
    return selectedWarrantyPrice.value
  } else {
    return minPrice.value
  }
})

const addToCart = () => {
  console.log(selectedVariant.value)
}
</script>

<template>
  <v-carousel show-arrows="hover" hide-delimiter-background>
    <v-carousel-item v-for="(image, index) in product.images" :key="index">
      <ImageLoader :src="image" height="100%" width="100%" :alt="`${product.title} ${index + 1}`" />
    </v-carousel-item>
  </v-carousel>

  <h1 class="px-4 title-md">{{ product.name }}</h1>

  <v-tabs
    v-model="selectedTab"
    bg-color="white"
    align-tabs="center"
    class="position-sticky tab-pdp"
    slider-color="primary"
    comfortable
  >
    <v-tab
      v-for="(tab, index) in tabItems"
      :key="index"
      :href="tab.href"
      rounded="5"
      color="red-darken-3"
    >
      {{ $t(tab.title) }}
    </v-tab>
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

  <div>
    <v-skeleton-loader
      v-if="isLoading"
      class="mx-auto"
      max-width="300"
      type="avatar"
    ></v-skeleton-loader>
    <ColorSelector
      v-else
      :variants="variants"
      @selectColor="handleSelectColor"
      :selectedWarranty="selectedWarranty"
    />
  </div>
  <div>
    <v-skeleton-loader
      v-if="isLoading"
      class="mx-auto"
      max-width="300"
      type="article"
    ></v-skeleton-loader>
    <BrandsWarranty
      v-else
      :variants="variants"
      :selectedColorCode="selectedColorCode"
      @updateWarranty="handleSelectedWarranty"
      @updateBrand="handleSelectedBrand"
    />
  </div>

  <ProductReview :desc="product.description" />

  <SpecSection :spec="spec" v-if="Object.keys(spec).length" />

  <CommentSection
    :comments="product.feedbacks"
    :id="product.id"
    @feedbackSubmitted="fetchProductDetails"
  />

  <div
    class="d-flex justify-space-between align-center px-4 py-3 elevation-5 position-sticky bottom-0 bg-white"
  >
    <v-btn @click="addToCart" prepend-icon="add" size="large">{{
      $t('productDetail.addToCart')
    }}</v-btn>
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

.bottom-0 {
  bottom: 0;
}
.tab-pdp {
  top: 3.9rem;
  z-index: 10;
  margin: 1rem 0;
  border-radius: 0 !important;
}
.tab-pdp .v-tab--selected {
  color: #fb4f4e;
}

#summery #spec,
#comments {
  scroll-margin-top: 20 rem;
}
</style>
