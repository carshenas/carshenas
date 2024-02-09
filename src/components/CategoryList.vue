<script lang="ts" setup>
import CategoryItem from '@/components/CategoryItem.vue'
import type Category from '@/types/dto/category'
import { ref } from 'vue'

const categories = ref<Category[]>([
  { id: 1, title: 'باتری خودرو', icon: '' },
  { id: 2, title: 'باتری خودرو', icon: '' },
  { id: 3, title: 'باتری خودرو', icon: '' },
  { id: 4, title: 'باتری خودرو', icon: '' },
  { id: 5, title: 'باتری خودرو', icon: '' },
  { id: 6, title: 'باتری خودرو', icon: '' },
  { id: 7, title: 'باتری خودرو', icon: '' },
  { id: 8, title: 'باتری خودرو', icon: '' }
])
</script>

<template>
  <v-row no-gutters>
    <v-col v-for="category in categories" :key="category.id" cols="3" class="pa-2">
      <CategoryItem v-bind="category" />
    </v-col>
  </v-row>
</template>
