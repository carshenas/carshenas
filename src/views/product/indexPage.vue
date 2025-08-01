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
import ItemCounter from '@/components/ItemCounter.vue'
import { useUserStore } from '@/stores/user'

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
const snackbar = ref(false)
const userStore = useUserStore();
const isLoggedIn = userStore.isLoggedIn;

console.log(variants)
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
    console.log('Fetched product.value:', product.value.outOfStock)
    // Filter out variants without an id
    const validVariants = (product.value.variants || []).filter((variant: Variant) => variant && variant.id)
    console.log('Filtered validVariants:', validVariants)
    variants.value = validVariants.map((variant: Variant) => ({
      ...variant,
      images: product.value.images, // Example of copying overall product data
      title: product.value.name
    }))
    spec.value = product.value.specification
    // Auto-select the single variant if only one exists
    if (variants.value.length === 1) {
      selectedWarranty.value = null
      selectedBrand.value = null
      selectedColorCode.value = null
      // Explicitly set selectedVariant by setting the selection state
      // If your UI expects selectedWarranty/Brand/Color, set them here
      // For now, just log
      console.log('Auto-selected single variant:', variants.value[0])
    }
  } catch (error) {
    console.error('Failed to fetch product details:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSelectColor = (colorCode: string) => {
  selectedColorCode.value = colorCode
}

const hasColorVariants = computed<boolean>(() => {
  return variants.value.some((variant) => !!variant.color)
})

const tabItems = computed(() => {
  const items = []
  
  // Only add summary tab if there's a description
  if (product.value.description) {
    items.push({ title: 'product.summery', href: '#summery' })
  }
  
  // Only add details tab if there are specifications
  if (Object.keys(spec.value).length > 0) {
    items.push({ title: 'product.details', href: '#spec' })
  }
  
  // Only add comments tab if user is logged in and there are comments
  if (isLoggedIn && product.value.feedbacks?.length > 0) {
    items.push({ title: 'product.comments', href: '#comments' })
  }
  
  return items
})

// Add computed property to check if content is short
const shouldShowTabs = computed(() => {
  // Get the total content height
  const contentHeight = document.documentElement.scrollHeight - window.innerHeight
  // Show tabs only if content height is more than 500px
  return contentHeight > 500
})

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

  return (
    variants.value.find((variant: Variant) => {
      const matchesColor =
        !selectedColorCode.value ||
        variant.color?.code === selectedColorCode.value
      const matchesBrand =
        selectedBrand.value && variant.brand === selectedBrand.value.name
      const matchesWarranty = warranty && variant.warranty === warranty.name
      return matchesColor && matchesBrand && matchesWarranty
    }) || null
  )
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

// Method to add a selected variant to the cart
const snackbarMessage = ref('')

const showSnackbar = (message: string) => {
  snackbarMessage.value = message
  snackbar.value = true
}

// Add a computed property for outOfStock
const isOutOfStock = computed(() => Boolean(product.value && product.value.outOfStock));

function handleAddToCartClick() {
  console.log('Show add to cart button, outOfStock:', product.value.outOfStock)
  showSnackbar('Added to cart')
}
function handleNotAvailableClick() {
  console.log('Show نا موجود, outOfStock:', product.value.outOfStock)
}
</script>

<template>
  <v-carousel v-if="product.images && product.images.length > 0" show-arrows="hover" hide-delimiter-background
    class="gallery">
    <v-carousel-item height="360" min-height="360" v-for="(image, index) in product.images" :key="index">
      <ImageLoader :src="image" height="360" width="100%" :alt="`${product.title} ${index + 1}`" />
    </v-carousel-item>
  </v-carousel>
  <v-skeleton-loader v-else class="mx-auto" max-width="300" elevation="0" type="image" boilerplate></v-skeleton-loader>
  <h1 class="px-4 title-md">{{ product.name }}</h1>

  <v-tabs v-if="shouldShowTabs && tabItems.length > 0" v-model="selectedTab" bg-color="white" align-tabs="center" class="position-sticky tab-pdp"
    slider-color="primary" comfortable>
    <v-tab v-for="(tab, index) in tabItems" :key="index" :href="tab.href" rounded="5" color="red-darken-3">
      {{ $t(tab.title) }}
    </v-tab>
  </v-tabs>

  <div class="d-flex flex-column t-4 px-4 ga-8">
    <p>
      <v-icon icon="mdi_star" />
      <span>{{ product.score }} </span>
      <span>
        {{
          $t('product.scoreText', {
            count: product.votersCount
          })
        }}
      </span>
    </p>
  </div>

  <div>
    <v-skeleton-loader v-if="isLoading" class="mx-auto" max-width="300" type="avatar"></v-skeleton-loader>
    <div v-else>
      <ColorSelector v-if="hasColorVariants" :variants="variants" @selectColor="handleSelectColor"
        :selectedWarranty="selectedWarranty" />
    </div>
  </div>

  <div>
    <v-skeleton-loader v-if="isLoading" class="mx-auto" max-width="300" type="article"></v-skeleton-loader>
    <BrandsWarranty v-else :variants="variants" :selectedColorCode="selectedColorCode"
      @updateWarranty="handleSelectedWarranty" @updateBrand="handleSelectedBrand" />
  </div>

  <ProductReview v-if="product.description !== ''" :desc="product.description" />

  <SpecSection :spec="spec" v-if="Object.keys(spec).length" />

  <CommentSection v-if="isLoggedIn" :comments="product.feedbacks" :id="product.id"
    @feedbackSubmitted="fetchProductDetails" />
  <div class="pa-4 text-center" v-else>
    <span>برای ثبت نظر
      <RouterLink :to="{ name: 'AuthPage' }">
        وارد
      </RouterLink>
      شوید
    </span>
  </div>
  
  <!-- Show message when logged in but no comments -->
  <div v-if="isLoggedIn && (!product.feedbacks || product.feedbacks.length === 0)" class="pa-4 text-center">
    <span class="text-medium-emphasis">نظری ثبت نشده است</span>
  </div>
  <div class="d-flex justify-space-between align-center px-4 py-3 elevation-5 position-sticky bottom-0 bg-surface">
    <ItemCounter :variant="selectedVariant" v-if="selectedVariant && !isOutOfStock" />
    <div v-else>
      <v-btn v-if="!isOutOfStock" rounded="xs" @click="handleAddToCartClick" prepend-icon="add" color="#fd9d9c">
        {{ $t('product.addToCart') }}
      </v-btn>
      <span v-else class="text-error font-weight-bold" @click="handleNotAvailableClick">نا موجود</span>
    </div>
    <v-snackbar v-model="snackbar" :timeout="3000" color="error" bottom right>
      {{ $t('product.alert') }}
    </v-snackbar>

    <CurrencyDisplay :value="displayPrice" value-class="text-primary font-weight-bold" class="d-flex justify-end" />
  </div>
</template>

<style lang="scss" scoped>
.gallery {
  height: 360px;
}

.v-carousel {
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
  top: 0rem;
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
