<script setup lang="ts">
import CurrencyDisplay from '@/components/CurrencyDisplay.vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
</script>

<template>
  <v-container>
    <h2 class="my-2 title-sm">{{ $t('checkout.payment') }}</h2>

    <div class="d-flex justify-space-between">
      <p class="label-md text-outline">{{ $t('checkout.productsPrice') }}</p>

      <CurrencyDisplay
        :value="cartStore.payableAmount"
        value-class="text-primary font-weight-bold"
        unit-class="body-sm text-outline"
        class="d-flex justify-end body-md"
      />
    </div>

    <div class="d-flex justify-space-between">
      <p class="label-md text-outline">{{ $t('checkout.deliveryPrice') }}</p>

      <CurrencyDisplay
        :value="cartStore.payableAmount"
        value-class="text-primary font-weight-bold"
        unit-class="body-sm text-outline"
        class="d-flex justify-end body-md"
      />
    </div>

    <div class="d-flex justify-space-between">
      <p class="label-md text-outline">{{ $t('checkout.discount') }}</p>

      <CurrencyDisplay
        :value="cartStore.payableAmount"
        value-class="text-primary font-weight-bold"
        unit-class="body-sm text-outline"
        class="d-flex justify-end body-md"
      />
    </div>

    <v-divider class="my-2" />

    <div class="d-flex justify-space-between">
      <p class="label-md">{{ $t('checkout.payable') }} :</p>

      <CurrencyDisplay
        :value="cartStore.payableAmount"
        value-class="text-primary font-weight-bold"
        unit-class="body-sm text-outline"
        class="d-flex justify-end body-md"
      />
    </div>
  </v-container>
</template>
