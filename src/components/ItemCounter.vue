<script lang="ts" setup>
import { computed, ref } from "vue";
import { useCartStore } from "@/stores/cart";
import type { Variant } from "@/types/dto/product";
import { addToBasketService } from "@/services/carshenas/basket";
import type { BasketItem } from "@/types/dto/basket";

const props = defineProps<{
  variant: Variant;
}>();

// Access the cart store
const cartStore = useCartStore();

// Loading states for buttons
const isAddingToCart = ref(false);
const isUpdatingQuantity = ref(false);

// Debounce utility function
const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

// Find the basket item ID using variant ID
const findBasketItemId = computed(() => {
  const item = cartStore.items.find(item => item.variant.id === props.variant.id);
  return item?.id;
});

// Check if the item is already in the cart
const isInCart = computed(() =>
  cartStore.items.some((item) => item.variant.id === props.variant.id)
);

const quantity = computed({
  get: () => {
    const item = cartStore.items.find(
      (item) => item.variant.id === props.variant.id
    );
    return item ? item.stock : 0;
  },
  set: (value: number) => {
    const basketItemId = findBasketItemId.value;
    if (!basketItemId) return;

    if (value > 0) {
      updateQuantityDebounced(basketItemId, value);
    } else {
      removeItemDebounced(basketItemId);
    }
  },
});

const addToCart = async () => {
  if (isAddingToCart.value) return;

  try {
    isAddingToCart.value = true;
    const basketItem: BasketItem = await addToBasketService({
      variant: props.variant.id,
      stock: 1,
    });
    cartStore.addItem({
      id: basketItem.id,
      variant: props.variant,
      stock: basketItem.stock,
    });
  } catch (error) {
    console.error("Failed to add to basket:", error);
  } finally {
    isAddingToCart.value = false;
  }
};

// Debounced update quantity function
const updateQuantityDebounced = debounce(async (basketItemId: number, newQuantity: number) => {
  if (isUpdatingQuantity.value) return;

  try {
    isUpdatingQuantity.value = true;
    await cartStore.updateQuantity(basketItemId, newQuantity);
  } catch (error) {
    console.error("Failed to update quantity:", error);
  } finally {
    isUpdatingQuantity.value = false;
  }
}, 500);

// Debounced remove item function
const removeItemDebounced = debounce(async (basketItemId: number) => {
  if (isUpdatingQuantity.value) return;

  try {
    isUpdatingQuantity.value = true;
    await cartStore.removeItem(basketItemId);
  } catch (error) {
    console.error("Failed to remove item:", error);
  } finally {
    isUpdatingQuantity.value = false;
  }
}, 500);

// Function to increment the quantity of an item in the cart
const add = () => {
  const basketItemId = findBasketItemId.value;
  if (basketItemId) {
    updateQuantityDebounced(basketItemId, quantity.value + 1);
  }
};

// Function to decrement the quantity of an item in the cart or remove it
const remove = () => {
  const basketItemId = findBasketItemId.value;
  if (!basketItemId) return;

  if (quantity.value > 1) {
    updateQuantityDebounced(basketItemId, quantity.value - 1);
  } else {
    removeItemDebounced(basketItemId);
  }
};
</script>

<template>
  <div>
    <!-- Show "Add to Cart" button if the item is not in the cart -->
    <div v-if="!isInCart">
      <v-btn @click="addToCart" rounded="xs" prepend-icon="add" :loading="isAddingToCart" :disabled="isAddingToCart">
        {{ $t("product.addToCart") }}
      </v-btn>
    </div>

    <!-- Show quantity controls if the item is in the cart -->
    <div v-else>
      <v-text-field :value="quantity" readonly :clearable="false" variant="outlined" density="compact" hide-details
        class="centered-input" prepend-inner-icon="add" append-inner-icon="remove" @click:prepend-inner="add"
        @click:append-inner="remove" :disabled="isUpdatingQuantity">
        <template v-if="isUpdatingQuantity" #append>
          <v-progress-circular indeterminate size="20" width="2"></v-progress-circular>
        </template>
      </v-text-field>
    </div>
  </div>
</template>

<style scoped>
.centered-input {
  width: 120px;
}
</style>
