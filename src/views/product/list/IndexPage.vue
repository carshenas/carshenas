<script setup lang="ts">
import { ref } from 'vue'
import ProductList from '@/components/ProductList.vue'
import { useGetFilterFromURL } from '@/composable/filter'
import type { ProductFilter } from '@/types/dto/product'
import BrandFilterBottomSheet from './components/BrandFilterBottomSheet.vue'

const filter = ref<ProductFilter>(useGetFilterFromURL())
</script>

<template>
  <v-container>
    <h1 class="title-md">
      {{ $t('product.title', { title: '' }) }}
    </h1>

    <ProductList :filter class="mt-4" />

    <BrandFilterBottomSheet />
  </v-container>
</template>
