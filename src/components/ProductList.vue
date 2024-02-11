<script lang="ts" setup>
import type Product from '@/types/dto/product'
import ProductItem from './ProductItem.vue'
import { ref } from 'vue'

const products = ref<Product[]>([{ id: 1, image: '', title: 'باتری ۵۰ آمپر پراید', price: 100000 }])
</script>

<template>
  <div>
    <ProductItem v-for="product in products" v-bind="product" :key="product.id" />
  </div>
</template>
