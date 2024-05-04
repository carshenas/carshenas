<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ items: { id: number; code: string; title: string }[] }>()

const selectedColorId = defineModel<number>()

const selectedColorTitle = computed(() => {
  const selectedColor = props.items.find((item) => item.id === selectedColorId.value)
  return selectedColor?.title || '' // Return an empty string if selectedColor is undefined
})
</script>

<template>
  <div class="pa-4">
    <div class="d-flex">
      <h3 class="title" role="heading">{{ $t('productDetail.color') }}:</h3>
      <span> {{ selectedColorTitle }}</span>
    </div>
    <div class="d-flex ga-4">
      <div v-for="color in props.items" :key="color.id" class="d-flex ga-2">
        <label class="container">
          <input type="radio" checked="checked" name="radio-tes" />
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
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default radio button */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom radio button */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 100%;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}
.container input:checked ~ .checkmark {
  border: 2px solid #262626;
}

/* Create the indicator (the dot/circle - hidden when not checked) */
.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}
/* Show the indicator (dot/circle) when checked */
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
