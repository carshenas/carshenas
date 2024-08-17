<script lang="ts" setup>
import vNumberInput from '@/directives/v-number-input'
import { watchEffect } from 'vue'

const modelValue = defineModel<number>('modelValue', { default: 1 })
const props = defineProps<{ max: number }>()

const add = () => modelValue.value++
const remove = () => modelValue.value--

watchEffect(() => {
  modelValue.value > 1 || (modelValue.value = 1)
  modelValue.value < props.max || (modelValue.value = props.max)
})
</script>

<template>
  <v-responsive max-width="108">
    <v-text-field
      v-number-input
      v-model.number="modelValue"
      :clearable="false"
      variant="outlined"
      density="compact"
      hide-details
      class="centered-input"
      prepend-inner-icon="add"
      append-inner-icon="remove"
      @click:prepend-inner="add"
      @click:append-inner="remove"
    />
  </v-responsive>
</template>

<style scoped>
.centered-input:deep(input) {
  text-align: center;
}
</style>
