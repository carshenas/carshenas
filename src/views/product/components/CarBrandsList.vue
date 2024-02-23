<script setup lang="ts">
import type Brands from '@/types/dto/brands';

defineProps({
  carBrands: {
    type: Array as () => Brands[],
    required: true,
  },
});

const emit = defineEmits(['selectBrand']);

</script>

<template>
  <v-list>
    <v-list-item v-for="brand in carBrands" :key="brand.id" :prepend-avatar="brand.icon"
      @click="emit('selectBrand', brand)">
      <span>
        {{ brand.name }}
      </span>
    </v-list-item>
  </v-list>
</template>
