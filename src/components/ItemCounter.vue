<script lang="ts" setup>
import { computed } from "vue";
import { useCartStore } from "@/stores/cart";
import type { Variant } from "@/types/dto/product";

const props = defineProps<{
  variant: Variant;
}>();

const cartStore = useCartStore();

// Use store's getter to determine if the item is in the cart
const isInCart = computed(() => cartStore.isItemInCart(props.variant.id));

// Using store's getter to access item quantity
const quantity = computed({
  get: () => cartStore.getItemQuantity(props.variant.id),
  set: (value: number) => {
    cartStore.updateCount(props.variant.id, value);
  },
});

// Function to add item to cart
const addToCart = () => {
  const variantWithQuantity = {
    ...props.variant,
    quantity: 1,
  };
  cartStore.addItem(variantWithQuantity);
};

// Using store's actions for updating quantities
const add = () => {
  cartStore.updateCount(props.variant.id, quantity.value + 1);
};

const remove = () => {
  const currentQuantity = quantity.value;
  if (currentQuantity > 1) {
    cartStore.updateCount(props.variant.id, currentQuantity - 1);
  } else {
    cartStore.removeItem(props.variant.id);
  }
};
</script>

<template>
  <div>
    <div v-if="!isInCart">
      <v-btn @click="addToCart" rounded="xs" prepend-icon="add">
        {{ $t("product.addToCart") }}
      </v-btn>
    </div>

    <div v-else>
      <v-text-field :value="quantity" readonly :clearable="false" variant="outlined" density="compact" hide-details
        class="centered-input" prepend-inner-icon="add" append-inner-icon="remove" @click:prepend-inner="add"
        @click:append-inner="remove" />
    </div>
  </div>
</template>

<style scoped>
.centered-input {
  width: 120px;
}
</style>
