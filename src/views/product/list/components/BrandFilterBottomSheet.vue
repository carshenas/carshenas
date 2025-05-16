<script lang="ts" setup>
import FabBtn from '@/components/FabBtn.vue'
import { ref } from 'vue'
import CarBrands from './CarBrands.vue'

const isOpen = ref<boolean>()
</script>

<template>
  <v-bottom-sheet v-model="isOpen">
    <template v-slot:activator="{ props }">
      <FabBtn
        v-bind="props"
        icon="directions_car"
        :text="$t('product.vehicleFilter')"
        :delay="5"
        right
        bottom
      />
    </template>

    <v-card>
      <CarBrands @close="isOpen = false" />
    </v-card>
  </v-bottom-sheet>
</template>
