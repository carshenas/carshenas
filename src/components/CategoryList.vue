<script lang="ts" setup>
import CategoryItem from '@/components/CategoryItem.vue'
import type Category from '@/types/dto/category'
import { ref } from 'vue'

const categories = ref<Category[]>([{ id: 1, title: 'باتری خودرو', icon: '' }])
</script>

<template>
  <div>
    <CategoryItem v-for="category in categories" :key="category.id" v-bind="category" />
  </div>
</template>
