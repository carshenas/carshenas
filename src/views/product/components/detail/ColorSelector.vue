<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Color, Variant, Warranty } from '@/types/dto/product'

const props = defineProps<{
  variants: Variant[]
  selectedWarranty?: Warranty[] | null
}>()
const emit = defineEmits(['selectColor'])

const colors = computed<Color[]>(() => {
  const seen = new Set<Color['code']>()
  const allColors = props.variants.reduce((acc: Color[], variant: Variant) => {
    if (!seen.has(variant.color.code)) {
      seen.add(variant.color.code)
      acc.push(variant.color)
    }
    return acc
  }, [])

  return allColors.sort((a, b) => {
    const isAInWarranty = isColorInWarranty(a.code)
    const isBInWarranty = isColorInWarranty(b.code)

    if (isAInWarranty && !isBInWarranty) {
      return -1
    } else if (!isAInWarranty && isBInWarranty) {
      return 1
    } else {
      return 0
    }
  })
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

function isColorInWarranty(colorCode: string): boolean {
  return (
    props.selectedWarranty !== undefined &&
    props.selectedWarranty !== null &&
    props.selectedWarranty.some((warranty) =>
      warranty.color.some((color) => color.code === colorCode)
    )
  )
}

watch(
  () => props.selectedWarranty,
  (selectedWarranty) => {
    if (selectedWarranty && selectedColor.value) {
      const hasMatchingColor = selectedWarranty.some((warranty) =>
        warranty.color.some((color) => color.code === selectedColor.value)
      )
      if (!hasMatchingColor) {
        selectedColor.value = ''
        emit('selectColor', '')
        const radioButtons = document.getElementsByName('radio')
        radioButtons.forEach((radio: any) => {
          radio.checked = false
        })
      }
    }
  }
)
</script>

<template>
  <div class="d-flex flex-column ga-4 pa-4">
    <div class="d-flex">
      <h4 role="heading">{{ $t('productDetail.color') }}</h4>
      <span>{{ selectedColorTitle }}</span>
    </div>
    <transition-group name="list" tag="div" class="d-flex flex-wrap ga-4">
      <div
        v-for="color in colors"
        :key="color.code"
        :class="{
          'not-in-warranty':
            !props.selectedWarranty ||
            props.selectedWarranty.length === 0 ||
            isColorInWarranty(color.code)
        }"
        :style="{
          opacity:
            !props.selectedWarranty ||
            props.selectedWarranty.length === 0 ||
            isColorInWarranty(color.code)
              ? 1
              : 0.7
        }"
        class="d-flex ga-2 list-item"
      >
        <label class="container">
          <input type="radio" ref="radio" name="radio" @change="updateSelectedColor(color.code)" />
          <span class="checkmark" :style="{ backgroundColor: color.code }">
            <v-icon class="d-none" icon="done" size="x-small"></v-icon>
          </span>
        </label>
        <p>{{ color.name }}</p>
      </div>
    </transition-group>
  </div>
</template>

<style scoped lang="scss">
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-move {
  transition: transform 0.3s;
}
.not-in-warranty span {
  transition: all ease 1s;
  box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.15);
  scale: 1.2;
  opacity: 1;
}

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
