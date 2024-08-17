<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import ProductList from '@/components/ProductList.vue'
import PaymentCard from './PaymentCard.vue'

const cartStore = useCartStore()
const emit = defineEmits<{
  (e: 'next'): void
}>()
</script>

<template>
  <div style="padding-bottom: 72px" class="h-100 d-flex flex-column">
    <div class="flex-grow-1">
      <ProductList v-if="cartStore.items.length" has-counter  />

      <div class="h-100 w-100 d-flex align-center justify-center" v-else>
        {{ $t('product.noProducts') }}
      </div>
    </div>

    <v-divider thickness="8" color="divider" class="border-opacity-100" />

    <PaymentCard />

    <div class="bottom-bar pa-4">
      <v-btn class="primary" block :text="$t('shared.continue')" @click="emit('next')" />
    </div>
  </div>
</template>

<style scoped>
.bottom-bar {
  background-color: white;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
