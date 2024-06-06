<script lang="ts" setup>
import FabBtn from '@/components/FabBtn.vue'
import { ref } from 'vue'
import CarBrands from './CarBrands.vue'
import CarModels from './CarModels.vue'

const selectedBrandId = ref<number>()

const submit = (e: number) => {
  selectedBrandId.value = e
}
</script>

<template>
  <v-bottom-sheet>
    <template v-slot:activator="{ props }">
      <FabBtn
        v-bind="props"
        icon="directions_car"
        :text="$t('product.vehicleFilter')"
        :delay="5"
        left
        bottom
      />
    </template>

    <component :is="!selectedBrandId ? CarBrands : CarModels" @submit="submit" />
  </v-bottom-sheet>
</template>
