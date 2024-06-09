<script lang="ts" setup>
import FabBtn from '@/components/FabBtn.vue'
import { ref } from 'vue'
import CarBrands from './CarBrands.vue'
import CarModels from './CarModels.vue'

const selectedBrandId = ref<number>()
const isOpen = ref<boolean>()

const selectBrand = (...args: unknown[]): void => {
  selectedBrandId.value = args[0] as number
}
</script>

<template>
  <v-bottom-sheet v-model="isOpen">
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

    <v-card>
      <component
        :is="!selectedBrandId ? CarBrands : CarModels"
        @select="selectBrand"
        @close="isOpen = false"
      />
    </v-card>
  </v-bottom-sheet>
</template>
