<script lang="ts" setup>
import vNumberInput from '@/directives/v-number-input'
const quantity = defineModel<number>('quantity', { default: 1 })

const add = () => quantity.value++
const remove = () => quantity.value--
</script>

<template>
  <v-responsive max-width="108">
    <v-text-field
      v-number-input
      v-model="quantity"
      :clearable="false"
      variant="outlined"
      density="compact"
      hide-details
      prepend-inner-icon="add"
      append-inner-icon="remove"
      @click:prepend-inner="add"
      @click:append-inner="remove"
    />
  </v-responsive>
</template>
