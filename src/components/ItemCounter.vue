<script lang="ts" setup>
import { ref, computed } from "vue";
import { useCartStore } from "@/stores/cart";
import type { Variant } from "@/types/dto/product";

const props = defineProps<{
  variant: Variant;
}>();

const cartStore = useCartStore();
console.log(cartStore);
const isInCart = computed(() => {
  return cartStore.items.some((item) => item.id === props.variant.id);
});

const quantity = computed({
  get: () => {
    const item = cartStore.items.find((item) => item.id === props.variant.id);
    return item ? item.quantity : 0;
  },
  set: (value: number) => {
    cartStore.updateCount(props.variant.id, value);
  },
});

const addToCart = () => {
  cartStore.addItem({ ...props.variant, quantity: 1 });
};

const add = () => {
  quantity.value += 1;
};

const remove = () => {
  if (quantity.value > 1) {
    quantity.value -= 1;
  } else {
    cartStore.removeItem(props.variant.id);
  }
};
</script>
<template>
  <div>
    <div v-if="!isInCart">
      <v-btn @click="addToCart" prepend-icon="add" size="large">
        {{ $t("product.addToCart") }}
      </v-btn>
    </div>

    <div v-else>
      <v-text-field
        v-model.number="quantity"
        v-number-input
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
    </div>
  </div>
</template>

<style scoped>
.centered-input {
  width: 120px;
}
</style>
