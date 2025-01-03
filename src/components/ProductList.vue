<script lang="ts" setup>
import type { Product, ProductFilter, Variant } from '@/types/dto/product'
import { ref, onMounted, watch, computed } from 'vue'
import { getProductListService } from '@/services/carshenas/product'
import CurrencyDisplay from './CurrencyDisplay.vue'
import ImageLoader from './ImageLoader.vue'
import ItemCounter from '@/components/ItemCounter.vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

const props = defineProps<{
  items?: Product[]
  loading?: boolean
  filter?: ProductFilter
  hasCounter?: boolean
  manual?: boolean
}>()

const _loading = ref<boolean>(false)
const products = ref<Product[]>(props.items || [])

const shouldFetchProducts = computed(
  () => !props.items || props.items.length === 0
)

const getProducts = async () => {
  if (!shouldFetchProducts.value) return

  _loading.value = true
  try {
    const response = await getProductListService(props.filter)
    products.value = response.data.result
  } catch (e) {
    console.error(e)
  } finally {
    _loading.value = false
  }
}

watch(
  () => props.filter,
  () => getProducts()
)

onMounted(() => {
  if (!props.manual) {
    getProducts()
  }
})

const handleItemCounter = (product: Product, quantity: number) => {
  const existingItem = cartStore.items.find((item) => item.id === product.id)
  if (existingItem) {
    if (quantity === 0) {
      cartStore.removeItem(existingItem.id)
    } else {
      cartStore.updateQuantity(existingItem.id, quantity)
    }
  }
}
// const handleWipeItem = async (productId: number) => {
//   try {
//     const itemsToWipe = cartStore.items.filter(item => item.id === productId)
//     if (itemsToWipe.length > 0) {
//       await cartStore.clearCart(itemsToWipe.map(item => item.id))
//     }
//   } catch (error) {
//     console.error('Failed to wipe items:', error)
//   }
// }
const getCartQuantity = (productId: number): number => {
  const item = cartStore.items.find((item) => item.id === productId)
  return item ? item.stock : 0
}

// In your product list component
const getCartVariant = (productId: number): Variant | null => {
  const item = cartStore.items.find((item) => item.variant.id === productId);
  if (!item) return null;

  return item.variant;  // This is now safe because item.variant is already of type Variant
};

</script>

<template>
  <div v-if="_loading || props.loading">
    <v-skeleton-loader v-for="n in 4" :key="n" class="mt-2" height="100" type="ossein" />
  </div>

  <v-list v-else>
    <v-list-item v-for="product in products" :key="product.id" class="product py-2 px-4">
      <v-row>
        <v-col cols="4" class="d-flex align-center">
          <ImageLoader :src="product.images && product.images.length > 0
            ? product.images[0]
            : product.image || 'placeholder.jpg'
            " :alt="product.name" width="86" height="86" aspectRatio="1" />
        </v-col>

        <v-col cols="8" class="d-flex flex-column">
          <div class="d-flex justify-space-between align-center">
            <h2 class="title-sm">{{ product.name }}</h2>

            <v-btn v-if="props.hasCounter && getCartQuantity(product.id) > 0" density="compact" icon="delete"
              variant="plain" class="px-0" />
          </div>

          <p class="body-sm mt-2 text-outline">{{ product.description }}</p>

          <div class="mt-2 flex-grow-1 d-flex justify-space-between align-end">
            <CurrencyDisplay :value="product.price" value-class="text-primary font-weight-bold"
              unit-class="body-sm text-outline" class="d-flex justify-end body-md py-1" />

            <ItemCounter v-if="props.hasCounter && getCartVariant(product.id)" :variant="getCartVariant(product.id)!"
              :quantity="getCartQuantity(product.id)" @update:quantity="(quantity) => handleItemCounter(product, quantity)
                " />

            <v-btn v-else :text="$t('shared.more')" variant="plain" class="px-0" append-icon="chevron_left"
              density="compact" :to="{ name: 'ProductDetailPage', params: { id: product.id } }"></v-btn>
          </div>
        </v-col>
      </v-row>
    </v-list-item>
  </v-list>
</template>

<style scoped>
.centered-input {
  width: 120px;
}
</style>

<style scoped>
.centered-input {
  width: 120px;
}
</style>
