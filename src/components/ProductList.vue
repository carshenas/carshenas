<script lang="ts" setup>
import type { Product } from '@/types/dto/product'
import { ref, onMounted } from 'vue'

// Services
import { getProductListService } from '@/services/carshenas/product'

// Global components
import CurrencyDisplay from './CurrencyDisplay.vue'
import ImageLoader from './ImageLoader.vue'
import ItemCounter from '@/components/ItemCounter.vue'

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
  <div>
    <v-row class="product" v-for="product in products" :key="product.id">
      <v-col cols="4">
        <ImageLoader :src="product.image" :alt="product.title" width="100%" aspectRatio="1" />
      </v-col>

      <v-col cols="8">
        <div class="d-flex justify-space-between">
          <h2 class="title-sm">{{ product.title }}</h2>

          <v-btn density="compact" icon="delete" variant="plain" class="px-0" />
        </div>

        <p class="body-sm mt-2 text-outline">{{ product.description }}</p>

        <div class="mt-4 d-flex justify-space-between align-center">
          <CurrencyDisplay
            :value="product.price * product.quantity"
            value-class="text-primary font-weight-bold"
            unit-class="body-sm text-outline"
            class="d-flex justify-end body-md"
          />

          <ItemCounter v-model="product.quantity" :max="product.stock" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss" scoped>
.product {
  border-bottom: 1px solid rgb(238, 238, 238);
}

.product:nth-child(2n) {
  background-color: rgba(238, 238, 238, 0.384);
}
</style>
