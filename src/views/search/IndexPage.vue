<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from "vue";
import { debounce } from "lodash";
import { useCartStore } from "@/stores/cart";
import type { Variant } from "@/types/dto/product";
import { addToBasketService } from "@/services/carshenas/basket";
import type { BasketItem } from "@/types/dto/basket";

const props = defineProps<{
  variant: Variant;
}>();

const cartStore = useCartStore();
const localQuantity = ref(0);
const pendingUpdate = ref(false);
const queuedQuantity = ref(0);

const findBasketItemId = computed(() => {
  const item = cartStore.items.find(item => item.variant.id === props.variant.id);
  return item?.id;
});

const isInCart = computed(() =>
  cartStore.items.some((item) => item.variant.id === props.variant.id)
);

const quantity = computed({
  get: () => {
    if (pendingUpdate.value) {
      return queuedQuantity.value;
    }
    const item = cartStore.items.find(
      (item) => item.variant.id === props.variant.id
    );
    return item ? item.stock : 0;
  },
  set: (value: number) => {
    const basketItemId = findBasketItemId.value;
    if (!basketItemId) return;

    queuedQuantity.value = value;
    pendingUpdate.value = true;

    if (value > 0) {
      debouncedUpdateQuantity(basketItemId, value);
    } else {
      debouncedRemoveItem(basketItemId);
    }
  },
});

const addToCart = async () => {
  try {
    const basketItem = await addToBasketService({
      variant: props.variant.id,
      stock: 1,
    });
    cartStore.addItem({
      id: basketItem.id,
      variant: props.variant,
      stock: basketItem.stock,
    });
    queuedQuantity.value = 1;
  } catch (error) {
    console.error("Failed to add to basket:", error);
  }
};

const handleUpdateQuantity = async (basketItemId: number, newQuantity: number) => {
  try {
    await cartStore.updateQuantity(basketItemId, newQuantity);
    localQuantity.value = newQuantity;
  } catch (error) {
    console.error("Failed to update quantity:", error);
    queuedQuantity.value = quantity.value;
  } finally {
    pendingUpdate.value = false;
  }
};

const handleRemoveItem = async (basketItemId: number) => {
  try {
    await cartStore.removeItem(basketItemId);
    queuedQuantity.value = 0;
    localQuantity.value = 0;
  } catch (error) {
    console.error("Failed to remove item:", error);
    queuedQuantity.value = quantity.value;
  } finally {
    pendingUpdate.value = false;
  }
};

const debouncedUpdateQuantity = debounce(handleUpdateQuantity, 1500);
const debouncedRemoveItem = debounce(handleRemoveItem, 1500);

const add = () => {
  const basketItemId = findBasketItemId.value;
  if (basketItemId) {
    queuedQuantity.value = (queuedQuantity.value || quantity.value) + 1;
    pendingUpdate.value = true;
    debouncedUpdateQuantity(basketItemId, queuedQuantity.value);
  }
};

const remove = () => {
  const basketItemId = findBasketItemId.value;
  if (!basketItemId) return;

  queuedQuantity.value = Math.max(0, (queuedQuantity.value || quantity.value) - 1);
  pendingUpdate.value = true;

  if (queuedQuantity.value > 0) {
    debouncedUpdateQuantity(basketItemId, queuedQuantity.value);
  } else {
    debouncedRemoveItem(basketItemId);
  }
};

onBeforeUnmount(() => {
  debouncedUpdateQuantity.cancel();
  debouncedRemoveItem.cancel();
});
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
        @click:append-inner="remove">
      </v-text-field>
    </div>
  </div>
</template>

<style scoped>
.centered-input {
  width: 120px;
}
</style>