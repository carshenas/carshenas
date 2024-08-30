<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Color, Variant, Warranty } from "@/types/dto/product";

// Define component props
const props = defineProps<{
  variants: Variant[];
  selectedWarranty?: Warranty[] | null;
}>();

// Define event emitter
const emit = defineEmits(["selectColor"]);

// Compute unique colors from variants, prioritizing those in the warranty
const colors = computed<Color[]>(() => {
  const seen = new Set<Color["code"]>();
  const allColors = props.variants.reduce((acc: Color[], variant: Variant) => {
    if (!seen.has(variant.color.code)) {
      seen.add(variant.color.code);
      acc.push(variant.color);
    }
    return acc;
  }, []);

  // Sort colors: prioritize colors in the warranty
  return allColors.sort((a, b) =>
    isColorInWarranty(a.code) && !isColorInWarranty(b.code)
      ? -1
      : !isColorInWarranty(a.code) && isColorInWarranty(b.code)
        ? 1
        : 0
  );
});

// Reactive reference to the selected color's code
const selectedColor = ref<string>("");

// Compute the name of the selected color
const selectedColorTitle = computed(
  () =>
    colors.value.find((color) => color.code === selectedColor.value)?.name || ""
);

// Update the selected color and emit event
const updateSelectedColor = (colorCode: string) => {
  selectedColor.value = colorCode;
  emit("selectColor", colorCode);
};
// Check if a color is in the selected warranty
const isColorInWarranty = (colorCode: string): boolean =>
  props.selectedWarranty?.some((warranty) =>
    warranty.color.some((color) => color.code === colorCode)
  ) ?? false;

// Watch for changes in selectedWarranty and update selectedColor if necessary
watch(
  () => props.selectedWarranty,
  (selectedWarranty) => {
    if (selectedWarranty && selectedColor.value) {
      const hasMatchingColor = selectedWarranty.some((warranty) =>
        warranty.color.some((color) => color.code === selectedColor.value)
      );
      if (!hasMatchingColor) {
        selectedColor.value = "";
        emit("selectColor", "");
        document
          .getElementsByName("radio")
          .forEach((radio) => ((radio as HTMLInputElement).checked = false));
      }
    }
  }
);
</script>

<template>
  <div class="d-flex flex-column ga-4 pa-4">
    <div class="d-flex">
      <h2 class="title-md" role="heading">{{ $t("product.color") }}</h2>

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
            isColorInWarranty(color.code),
        }"
        :style="{
          opacity:
            !props.selectedWarranty ||
            props.selectedWarranty.length === 0 ||
            isColorInWarranty(color.code)
              ? 1
              : 0.6,
        }"
        class="d-flex ga-2 list-item"
      >
        <label class="container">
          <input
            type="radio"
            ref="radio"
            name="radio"
            @change="updateSelectedColor(color.code)"
          />

          <span class="checkmark" :style="{ backgroundColor: color.code }">
            <v-icon class="d-none red" icon="done" size="x-small"></v-icon>
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
  transition: transform 1s;
}
.not-in-warranty .checkmark {
  transition: all ease 1s;
  box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.5);
  scale: 1.1;
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
  transition: all ease 0.8s;
  scale: 1;
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
  border: 2px solid #000000;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.container input:checked ~ .checkmark:after {
  display: block;
}

.container input:checked ~ .checkmark i {
  color: black;
  display: block !important;
  font-size: 1.1rem;
  right: 2px;
  top: 1px;
  font-weight: bolder;
}
</style>
