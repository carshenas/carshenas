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
    <template v-for="category in items" :key="category.id">
      <v-list-group v-if="category.children" :value="category.name">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" :title="category.name">
            <template v-slot:prepend>

            </template>
          </v-list-item>
        </template>

        <v-list-item
          v-for="subCategory in category.children"
          :key="subCategory.id"
          :title="subCategory.name"
        />
      </v-list-group>

      <v-list-item v-else :title="category.name">
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
    </template>
  </v-list>
</template>

<style scoped>
:deep(.v-list-item__prepend) {
  width: 32px;
}
</style>
