<script lang="ts" setup>
import { computed } from "vue";
import { useCartStore } from "@/stores/cart";
import type { Variant } from "@/types/dto/product";
import { addToBasketService } from "@/services/carshenas/basket";

const props = defineProps<{
  variant: Variant;
}>();

// Access the cart store
const cartStore = useCartStore();

// Check if the item is already in the cart
const isInCart = computed(() =>
  cartStore.items.some((item) => item.variant.id === props.variant.id)
);

// Get and set the quantity of the item in the cart
const quantity = computed({
  get: () => {
    const item = cartStore.items.find(
      (item) => item.variant.id === props.variant.id
    );
    return item ? item.stock : 0;
  },
  set: (value: number) => {
    if (value > 0) {
      cartStore.updateQuantity(props.variant.id, value);
    } else {
      cartStore.removeItem(props.variant.id);
    }
  },
});

// Function to add item to the cart and call the API
const addToCart = async () => {
  try {
    // Call the API to add the item to the backend cart
    await addToBasketService({
      variant: props.variant.id,
      stock: 1,
    });

    // Add the item to the store
    cartStore.addItem({
      id: props.variant.id,
      variant: props.variant,
      stock: 1,
    });
  } catch (error) {
    console.error("Failed to add to basket:", error);
  }
};

// Function to increment the quantity of an item in the cart
const add = () => {
  cartStore.updateQuantity(props.variant.id, quantity.value + 1);
};

// Function to decrement the quantity of an item in the cart or remove it
const remove = () => {
  if (quantity.value > 1) {
    cartStore.updateQuantity(props.variant.id, quantity.value - 1);
  } else {
    cartStore.removeItem(props.variant.id);
  }
};
</script>

<template>
  <div>
    <!-- Show "Add to Cart" button if the item is not in the cart -->
    <div v-if="!isInCart">
      <v-btn @click="addToCart" rounded="xs" prepend-icon="add">
        {{ $t("product.addToCart") }}
      </v-btn>
    </div>

    <!-- Show quantity controls if the item is in the cart -->
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
