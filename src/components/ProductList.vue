<script lang="ts" setup>
import type { Product } from '@/types/dto/product'
import { ref, onMounted } from 'vue'

// Services
import { getProductListService } from '@/services/carshenas/product'

// Global components
import CurrencyDisplay from './CurrencyDisplay.vue'
import ImageLoader from './ImageLoader.vue'

const props = defineProps<{
  items?: Product[]
  loading?: boolean
}>()
const _loading = ref<boolean>(false)
const products = ref<Product[]>(props.items || [])

const getCategories = async () => {
  _loading.value = true

  try {
    const response = await getProductListService()

    products.value = response.data
  } catch (e) {
    console.error(e)
  } finally {
    _loading.value = false
  }
}

onMounted(() => {
  !products.value?.length ? getCategories() : undefined
})
</script>

<template>
  <div class="d-flex flex-column ga-4">
    <div v-for="product in products" :key="product.id" class="product-card pa-3">
      <v-row no-gutters>
        <v-col cols="4">
          <ImageLoader
            :src="product.image"
            :alt="product.title"
            aspect-ratio="1"
            width="100%"
            class="rounded"
            style="aspect-ratio: 1"
          />
        </v-col>

        <v-col cols="8" class="pr-2 d-flex flex-column justify-space-between">
          <span role="heading" class="body-lg">
            {{ product.title }}
          </span>

          <CurrencyDisplay
            :value="product.price"
            value-class="text-primary font-weight-bold"
            class="d-flex justify-end"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.product-card {
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.15) !important;
}
</style>
