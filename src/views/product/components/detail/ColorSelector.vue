<script setup lang="ts">
import { computed } from 'vue'


const selectedColorId = defineModel<number>()

const selectedColorTitle = computed(() => {
  const selectedColor = props.items.find((item) => item.id === selectedColorId.value)
  return selectedColor?.title || '' // Return an empty string if selectedColor is undefined
})
function updateSelectedColor(colorId: number) {
  selectedColorId.value = colorId
}
</script>

<template>
  <div class="d-flex flex-column ga-4 pa-4">
    <div class="d-flex">
      <h4 role="heading">{{ $t('productDetail.color') }} </h4>
      <span> {{ selectedColorTitle }}</span>
    </div>
    <div class="d-flex ga-4">
      <div v-for="color in props.items" :key="color.id" class="d-flex ga-2">
        <label class="container">
          <input
            type="radio"
            ref="radio"
            name="radio"
            @change="updateSelectedColor(color.id)"
          />
          <span class="checkmark" :style="{ backgroundColor: color.code }"
            ><v-icon class="d-none" icon="done" size="x-small"></v-icon
          ></span>
        </label>
        <span>{{ color.title }}</span>
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
