<script setup lang="ts">
import ImageLoader from '@/components/ImageLoader.vue'
import type { Category } from '@/types/dto/category'

defineProps<{ items: Category[] }>()
const emit = defineEmits<{ (e: 'select', payload: number): void }>()

const onClick = (categoryId: number) => {
  emit('select', categoryId)
}
</script>

<template>
  <v-list>
    <v-list-item
      v-for="category in items"
      :key="category.id"
      :title="category.name"
      class="pa-4"
      append-icon="navigate_before"
      @click="onClick(category.id)"
    >
      <template v-slot:prepend>
        <ImageLoader
          :src="category.image"
          :alt="category.name"
          width="24"
          aspect-ratio="1"
          class="ml-2"
        />
      </template>
    </v-list-item>
  </v-list>
</template>

<style scoped>
:deep(.v-list-item__prepend) {
  width: 32px;
}
</style>
