<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import type { Color, Variant } from '@/types/dto/product'

const props = defineProps<{ variants: Variant[] }>()
const emit = defineEmits(['selectColor'])

const colors = computed<Color[]>(() => {
  const seen = new Set()
  return (
    props.variants.reduce((acc: any[], variant: Variant) => {
      if (!seen.has(variant.color.code)) {
        seen.add(variant.color.code)
        acc.push(variant.color)
      }
      return acc
    }, []) || []
  )
})

const selectedColor = ref<string>('')

const selectedColorTitle = computed(() => {
  const color = colors.value.find((color) => color.code === selectedColor.value)
  return color ? color.name : ''
})
function updateSelectedColor(colorCode: string) {
  selectedColor.value = colorCode
  emit('selectColor', colorCode)
}
</script>

<template>
  <div class="d-flex flex-column ga-4 pa-4">
    <div class="d-flex">
      <h4 role="heading">{{ $t('productDetail.color') }}</h4>
      <span> {{ selectedColorTitle }}</span>
    </div>
    <div class="d-flex ga-4">
      <div v-for="color in colors" :key="color.code" class="d-flex ga-2">
        <label class="container">
          <input type="radio" ref="radio" name="radio" @change="updateSelectedColor(color.code)" />
          <span class="checkmark" :style="{ backgroundColor: color.code }"
            ><v-icon class="d-none" icon="done" size="x-small"></v-icon
          ></span>
        </label>
        <span>{{ color.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: block;
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 100%;
}

.container:hover input ~ .checkmark {
  background-color: #ccc;
}
.container input:checked ~ .checkmark {
  border: 2px solid #262626;
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

.container input:checked ~ .checkmark:after {
  display: block;
}

.container input:checked ~ .checkmark i {
  display: block !important;
  font-size: 1.1rem;
  right: 2px;
  top: 1px;
  font-weight: bolder;
}
</style>
