<script lang="ts" setup>
import { computed, ref } from "vue";
import { useCartStore } from "@/stores/cart";
import type { Variant } from "@/types/dto/product";
import { addToBasketService } from "@/services/carshenas/basket";
import type { BasketItem } from "@/types/dto/basket";

const props = defineProps<{
  variant: Variant;
}>();

const cartStore = useCartStore();
const isAddingToCart = ref(false);

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

const addToCart = async () => {
  if (isAddingToCart.value) return;

  try {
    isAddingToCart.value = true;
    const basketItem: BasketItem = await addToBasketService({
      variant: props.variant.id,
      quantity: 1,
    });
    cartStore.addItem({
      name:basketItem.variant.name,
      id: basketItem.id,
      variant: props.variant,
      quantity: basketItem.quantity,
    });
  } catch (error) {
    console.error("Failed to add to basket:", error);
  } finally {
    isAddingToCart.value = false;
  }
};

const add = () => {
  const basketItemId = findBasketItemId.value;
  if (basketItemId) {
    cartStore.updateQuantity(basketItemId, quantity.value + 1);
  }
};

const remove = () => {
  const basketItemId = findBasketItemId.value;
  if (!basketItemId) return;

  if (quantity.value > 1) {
    cartStore.updateQuantity(basketItemId, quantity.value - 1);
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
        @click:append-inner="remove" :disabled="cartStore.isUpdating">
        <template v-if="cartStore.isUpdating" #append>
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
