


<script setup lang="ts">
import { ref } from 'vue'
import type Brands from '@/types/dto/brands'
const sheet = ref(false)
const showText = ref(true)

setTimeout(() => {
  showText.value = false
}, 1000)

const carBrands = ref<Brands[]>([
  { id: 1, icon: "../../../../public/icons/battery.svg", name: "سایپا", models: ["کوییک", "ساینا", "پراید"] },
  { id: 1, icon: "../../../../public/icons/battery.svg", name: "ایرانخودرو", models: ["تارا", "سمند", "دنا"] },
])
const selectedBrand = ref<Brands | null>(null)
const selectBrand = (brand: Brands) => {
  selectedBrand.value = brand
}
const goBack = () => {
  selectedBrand.value = null
}
</script>
  

<template>
  <v-bottom-sheet v-model="sheet">
    <template v-slot:activator="{ props }">

      <div class="text-center position-fixed carFitlerPlaceHolder">
        <v-btn v-if="showText" v-bind="props" color="primary" rounded="pill" size="x-large" class="position-fixed"
          :key="showText">
          {{ $t('shared.carFilter') }}
          <template v-slot:prepend>
            <v-icon icon="directions_car" />
          </template>
        </v-btn>

        <v-btn cl v-else v-bind="props" icon="directions_car" color="primary" rounded="pill" class="position-fixed" />
      </div>
    </template>

    <v-list v-if="!selectedBrand">
      <v-list-item v-for="Brands in carBrands " :key="Brands.id" :prepend-avatar="Brands.icon"
        @click="selectBrand(Brands)">

        <span>
          {{ Brands.name }}
        </span>
      </v-list-item>
    </v-list>
    
    <v-list v-if="selectedBrand">
      <v-btn variant="text" color="text" @click="goBack">
        <template v-slot:prepend>
          <v-icon color="primary" icon="arrow_forward_ios" />
        </template>
        {{ selectedBrand.name }}
      </v-btn>
      <v-list-item v-for="model in selectedBrand.models" :key="model">
        {{ model }}
      </v-list-item>
    </v-list>
  </v-bottom-sheet>
</template>



