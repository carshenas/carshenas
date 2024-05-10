<script setup lang="ts">
import { ref } from 'vue'
import type Brands from '@/types/dto/brands'
import CarBrandsList from './CarBrandsList.vue'
import SelectedBrandModels from './SelectedBrandModels.vue'

const sheet = ref(false)
const carBrands = ref<Brands[]>([
  {
    id: 1,
    icon: '../../../../public/icons/battery.svg',
    name: 'سایپا',
    models: ['کوییک', 'ساینا', 'پراید']
  },
  {
    id: 2,
    icon: '../../../../public/icons/battery.svg',
    name: 'ایرانخودرو',
    models: ['تارا', 'سمند', 'دنا']
  }
])
const selectedBrand = ref<Brands | null>(null)

const selectBrand = (brand: Brands) => {
  selectedBrand.value = brand
}

const goBack = () => {
  selectedBrand.value = null
}

const emit = defineEmits(['modelSelected'])

const handleModelSelected = (modelName: string) => {
  emit('modelSelected', modelName)
}
</script>

<template>
  <v-bottom-sheet v-model="sheet">
    <template v-slot:activator="{ props }">
      <div class="fabBtnContainer">
        <v-btn
          v-bind="props"
          color="white"
          rounded="pill"
          size="x-large"
          class="fabBtn-text pr-8"
          variant="text"
          key="showText"
        >
          {{ $t('shared.carFilter') }}
          <template v-slot:prepend>
            <v-icon icon="directions_car" />
          </template>
        </v-btn>
        <v-btn
          v-bind="props"
          size="large"
          class="fabBtn-icon"
          icon="directions_car"
          color="primary"
          rounded="pill"
        />
      </div>
    </template>

    <CarBrandsList v-if="!selectedBrand" :carBrands="carBrands" @selectBrand="selectBrand" />
    <SelectedBrandModels
      v-if="selectedBrand"
      :selectedBrand="selectedBrand"
      @goBack="goBack"
      @modelSelected="handleModelSelected"
    />
  </v-bottom-sheet>
</template>

<style lang="scss" scoped>
@keyframes changeWidth {
  0% {
    width: 10rem;
  }

  100% {
    width: 3.5rem;
  }
}

.fabBtnContainer {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  overflow: hidden;
  height: 3.5rem;
  width: 10rem;
  z-index: 1000;
  animation-name: changeWidth;
  animation-duration: 0.5s;
  animation-delay: 5s;
  animation-fill-mode: forwards;
  background-color: #fb4847;
  border-radius: 999px;
}

.fabBtn-text {
  position: absolute;
  left: 0;
}

.fabBtn-icon {
  position: absolute;
  right: 0;
}
</style>
