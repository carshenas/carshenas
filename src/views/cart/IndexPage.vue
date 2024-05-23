<script setup lang="ts">
import CurrencyDisplay from '@/components/CurrencyDisplay.vue'
import { useCartStore } from '@/stores/cart'
import ProductList from '@/components/ProductList.vue'

const cartStore = useCartStore()
</script>

<template>
  <v-container>
    <ProductList :items="cartStore.items" />

    <v-card class="bottom-bar pa-4">
      <div class="d-flex justify-space-between">
        <p>{{ $t('cart.payable') }} :</p>

        <CurrencyDisplay
          :value="cartStore.payableAmount"
          value-class="text-primary font-weight-bold"
          unit-class="body-sm text-outline"
          class="d-flex justify-end body-md"
        />
      </div>

      <v-btn class="primary mt-4" block :text="$t('cart.pay')" :to="{ name: 'CartPage' }" />>
    </v-card>
  </v-container>
</template>

<style scoped>
.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
