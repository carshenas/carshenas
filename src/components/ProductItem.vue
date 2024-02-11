<script lang="ts" setup>
import CurrencyDisplay from './CurrencyDisplay.vue'

defineProps<{
  image: string
  title: string
  price: number
}>()
</script>

<template>
  <v-card class="product-card pa-2" elevation="0">
    <v-row no-gutters>
      <v-col cols="4">
        <img
          src="https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGltYWdlfGVufDB8fDB8fHww"
          :alt="title"
          width="100%"
          class="rounded"
          style="aspect-ratio: 1"
        />
      </v-col>

      <v-col cols="8" class="pr-2 d-flex flex-column justify-space-between">
        <span role="heading" class="body-lg">
          {{ title }}
        </span>

        <CurrencyDisplay
          :value="price"
          value-class="text-primary font-weight-bold"
          class="d-flex justify-end"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<style lang="scss" scoped>
.product-card {
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.15) !important;
}
</style>
