<script setup lang="ts">
import type { Variant } from '@/types/dto/product'
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import PaymentCard from './PaymentCard.vue'
import type { Product } from '@/types/dto/product'
import type { BasketItem } from '@/types/dto/basket'
import ImageLoader from '@/components/ImageLoader.vue'
import ItemCounter from '@/components/ItemCounter.vue'
import CurrencyDisplay from '@/components/CurrencyDisplay.vue'

const cartStore = useCartStore()
const emit = defineEmits<{
  (e: 'next'): void
}>()

const cartProducts = computed<Product[]>(() =>
  cartStore.items.map((item: BasketItem) => ({
    id: item.variant.id,
    name: item.variant.name,
    description: item.variant.description,
    price: item.variant.price,
    quantity: item.stock,
    stock: item.variant.stock,
    out_of_stock: item.variant.stock === 0,
    // If variant has images array, use that structure
    ...(item.variant.images?.length
      ? {
          images: item.variant.images,
          image: item.variant.image || null
        }
      : {
          // Otherwise, use single image structure
          image: item.variant.image || item.variant.images?.[0] || ''
        })
  }))
)

const getCartQuantity = (productId: number): number => {
  const item = cartStore.items.find((item) => item.id === productId)
  return item ? item.stock : 0
}

// In your product list component
const getCartVariant = (productId: number): Variant | null => {
  const item = cartStore.items.find((item) => item.variant.id === productId)
  if (!item) return null

  return item.variant 
}

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
//     const itemsToWipe = cartStore.items.filter((item) => item.id === productId)
//     if (itemsToWipe.length > 0) {
//       await cartStore.clearCart(itemsToWipe.map((item) => item.id))
//     }
//   } catch (error) {
//     console.error('Failed to wipe items:', error)
//   }
// }
</script>

<template>
  <div class="h-100 d-flex flex-column ga-1">
    <div class="flex-grow-1">
      <v-list>
        <v-list-item v-for="product in cartProducts" :key="product.id">
          <div class="product py-2 px-4">
            <v-row>
              <v-col cols="4" class="d-flex align-center">
                <ImageLoader
                  :src="
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : product.image || 'placeholder.jpg'
                  "
                  :alt="product.name!"
                  width="86"
                  height="86"
                  aspectRatio="1"
                />
              </v-col>

              <v-col cols="8" class="d-flex flex-column">
                <div class="d-flex justify-space-between align-center">
                  <h2 class="title-sm">{{ product.name }}</h2>

                  <v-btn
                    v-if="getCartQuantity(product.id) > 0"
                    density="compact"
                    icon="delete"
                    variant="plain"
                    class="px-0"
                  />
                </div>

                <p class="body-sm mt-2 text-outline">
                  {{ product.description }}
                </p>

                <div
                  class="mt-2 flex-grow-1 d-flex justify-space-between align-end"
                >
                  <CurrencyDisplay
                    :value="product.price"
                    value-class="text-primary font-weight-bold"
                    unit-class="body-sm text-outline"
                    class="d-flex justify-end body-md py-1"
                  />

                  <ItemCounter
                    v-if="getCartVariant(product.id)"
                    :variant="getCartVariant(product.id)!"
                    :quantity="getCartQuantity(product.id)"
                    @update:quantity="
                      (quantity: number) => handleItemCounter(product, quantity)
                    "
                  />
                </div>
              </v-col>
            </v-row>
          </div>
        </v-list-item>
      </v-list>
    </div>

    <v-divider thickness="8" color="divider" class="border-opacity-100" />

    <PaymentCard />

    <div class="bottom-bar pa-4">
      <v-btn
        class="primary"
        block
        :text="$t('shared.continue')"
        @click="emit('next')"
      />
    </div>
  </div>
</template>

<style scoped>
.bottom-bar {
  background-color: white;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
