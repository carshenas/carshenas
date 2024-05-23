<script setup lang="ts">
import ImageLoader from '@/components/ImageLoader.vue'
import ItemCounter from '@/components/ItemCounter.vue'
import CurrencyDisplay from '@/components/CurrencyDisplay.vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
</script>

<template>
  <v-container>
    <v-row class="product" v-for="item in cartStore.items" :key="item.id">
      <v-col cols="4">
        <ImageLoader :src="item.image" :alt="item.title" width="100%" aspectRatio="1" />
      </v-col>

      <v-col cols="8">
        <div class="d-flex justify-space-between">
          <h2 class="title-sm">{{ item.title }}</h2>

          <v-btn density="compact" icon="delete" variant="plain" class="px-0" />
        </div>

        <p class="body-sm mt-2 text-outline">{{ item.description }}</p>

        <div class="mt-4 d-flex justify-space-between align-center">
          <CurrencyDisplay
            :value="item.price * item.quantity"
            value-class="text-primary font-weight-bold"
            unit-class="body-sm text-outline"
            class="d-flex justify-end body-md"
          />

          <ItemCounter v-model="item.quantity" :max="item.stock" />
        </div>
      </v-col>
    </v-row>

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

<style lang="scss">
.product {
  border-bottom: 1px solid rgb(238, 238, 238);
}

.product:nth-child(2n) {
  background-color: rgba(238, 238, 238, 0.384);
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
