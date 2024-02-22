<script setup lang="ts">
import { defineProps } from 'vue'
import type Brands from '@/types/dto/brands'

defineProps({
  selectedBrand: {
    type: Object as () => Brands | null,
    required: true
  }
})

</script>

<template>
  <v-list>
    <v-btn variant="text" color="text" @click="$emit('goBack')" v-if="selectedBrand">
      <template v-slot:prepend>
        <v-icon color="primary" icon="arrow_forward_ios" />
      </template>
      {{ selectedBrand.name }}
    </v-btn>
    <div v-if="selectedBrand">
      <v-list-item v-for="model in selectedBrand.models" :key="model">
        {{ model }}
      </v-list-item>
    </div>
  </v-list>
</template>
