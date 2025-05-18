<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useCartStore } from "@/stores/cart";
import { useSnackbar } from '@/stores/snackbar';
import type { Variant } from "@/types/dto/product";
import { addToBasketService } from "@/services/carshenas/basket";
import type { BasketItem } from "@/types/dto/basket";

const props = defineProps<{
  variant: Variant;
}>();

const cartStore = useCartStore();
const isAddingToCart = ref(false);
const isUpdatingQuantity = ref(false);
const snackbar = useSnackbar();

const findBasketItemId = computed(() => {
  const item = cartStore.items.find(item => item.variant.id === props.variant.id);
  return item?.id;
});

const isInCart = computed(() =>
  cartStore.items.some((item) => item.variant.id === props.variant.id)
);

const quantity = computed(() => {
  const item = cartStore.items.find(
    (item) => item.variant.id === props.variant.id
  );
  return item ? item.quantity : 0;
});

// Watch for errors and display them
watch(() => {
  // Only check for errors if we have a basket item
  const basketItemId = findBasketItemId.value;
  if (!basketItemId) return null;

  // Return the error for this item if it exists
  return cartStore.updateErrors?.get(basketItemId);
}, (error) => {
  if (error) {
    // Show error in snackbar
    snackbar.show(error, {
      color: "error",
      timeout: 3000
    });
  }
});

const addToCart = async () => {
  if (isAddingToCart.value) return;

  // Check stock before adding to cart
  if (!props.variant.is_unlimited &&
    props.variant.quantity !== undefined &&
    props.variant.quantity <= 0) {
    snackbar.show("Item is out of stock", {
      color: "error",
      timeout: 3000
    });
    return;
  }

  try {
    isAddingToCart.value = true;
    const basketItem: BasketItem = await addToBasketService({
      variant: props.variant.id,
      quantity: 1,
    });
    cartStore.addItem({
      name: basketItem.variant.name,
      id: basketItem.id,
      variant: props.variant,
      quantity: basketItem.quantity,
    });
  } catch (error) {
    console.error("Failed to add to basket:", error);
    snackbar.show(error instanceof Error ? error.message : "Failed to add to basket", {
      color: "error",
      timeout: 3000
    });
  } finally {
    isAddingToCart.value = false;
  }
};

const add = () => {
  if (isUpdatingQuantity.value || cartStore.isUpdating) return;

  const basketItemId = findBasketItemId.value;
  if (basketItemId) {
    isUpdatingQuantity.value = true;

    // Calculate new quantity
    const newQuantity = quantity.value + 1;

    // Update quantity in store
    cartStore.updateQuantity(basketItemId, newQuantity);

    setTimeout(() => {
      isUpdatingQuantity.value = false;
    }, 300);
  }
};
const remove = () => {
  if (isUpdatingQuantity.value || cartStore.isUpdating) return;

  const basketItemId = findBasketItemId.value;
  if (!basketItemId) return;

  if (quantity.value > 1) {
    isUpdatingQuantity.value = true;

    // Calculate new quantity
    const newQuantity = quantity.value - 1;

    // Update quantity in store
    cartStore.updateQuantity(basketItemId, newQuantity);

    setTimeout(() => {
      isUpdatingQuantity.value = false;
    }, 300);
  } else {
    cartStore.removeItem(basketItemId);
  }
};
</script>

<template>
  <div>
    <div v-if="!isInCart">
      <v-btn @click="addToCart" rounded="xs" prepend-icon="add" :loading="isAddingToCart" :disabled="isAddingToCart">
        {{ $t("product.addToCart") }}
      </v-btn>
    </div>

    <div v-else>
      <v-text-field :value="quantity" readonly :clearable="false" variant="outlined" density="compact" hide-details
        class="centered-input" prepend-inner-icon="add" append-inner-icon="remove" @click:prepend-inner="add"
        @click:append-inner="remove" :disabled="cartStore.isUpdating || isUpdatingQuantity">
        <template v-if="cartStore.isUpdating" #append>
          <v-progress-circular indeterminate size="20" width="2"></v-progress-circular>
        </template>
      </v-text-field>
    </div>
  </div>
</template>

<style scoped>
.centered-input {
  width: fit-content;
  text-align: center;
}
</style>
