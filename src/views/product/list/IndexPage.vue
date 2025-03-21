<script setup lang="ts">
import ProductList from '@/components/ProductList.vue'
import type { ProductFilter } from '@/types/dto/product'
import BrandFilterBottomSheet from './components/BrandFilterBottomSheet.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const filter = computed((): ProductFilter => route.query)

</script>

<template>
  <v-container>
    <h1 class="title-md">
      {{ $t('product.title', { title: '' }) }}
    </h1>

    <ProductList :filter />

    <BrandFilterBottomSheet />
  </v-container>
</template>
