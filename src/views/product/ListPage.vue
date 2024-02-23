<script setup lang="ts">
import { ref } from 'vue';
import CarBottomSheet from "./components/CarBottomSheet.vue";
import ProductList from '@/components/ProductList.vue'

const modelName = ref('');

const updateModelName = (newModelName: string) => {
  modelName.value = newModelName;
};

</script>
<template>
  <div class="pa-4 h-screen">
    <div>
      <h1 class="title-md">
        {{ $t('productList.products') }}
        {{ modelName }}
      </h1>
      <ProductList class="mt-4" />
      <CarBottomSheet @modelSelected="updateModelName" />
    </div>
  </div>
</template>
