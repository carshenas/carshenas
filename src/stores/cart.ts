import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

// types
import type { Variant } from "@/types/dto/product";

export const useCartStore = defineStore("cart", () => {
  const items = ref<Variant[]>([]);
  const address = ref<string>(
    "تهران،تیموری، خ. حبیب الله جنوبی، بعد از خ. تیموری غربی، خ. عزیزی"
  );

  // Log function
  const logCartChange = (action: string, details: any) => {
    console.log(`Cart ${action}:`, details);
    console.log("Current cart state:", JSON.parse(JSON.stringify(items.value)));
  };

  const addItem = (product: Variant) => {
    items.value.push(product);
    logCartChange("Item added", product);
  };

  const updateCount = (id: number, quantity: number) => {
    const index = items.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      const oldQuantity = items.value[index].quantity;
      items.value[index].quantity = quantity;
      logCartChange("Quantity updated", {
        id,
        oldQuantity,
        newQuantity: quantity,
      });
    } else {
      console.warn(
        `Attempted to update quantity for non-existent item with id ${id}`
      );
    }
  };

  const removeItem = (id: number) => {
    const index = items.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      const removedItem = items.value[index];
      items.value.splice(index, 1);
      logCartChange("Item removed", removedItem);
    } else {
      console.warn(`Attempted to remove non-existent item with id ${id}`);
    }
  };

  const wipeItems = () => {
    const oldItems = [...items.value];
    items.value = [];
    logCartChange("Cart wiped", { removedItems: oldItems });
  };

  const payableAmount = computed(() =>
    items.value.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  // Log when payableAmount changes
  watch(payableAmount, (newValue, oldValue) => {
    console.log("Payable amount changed:", { oldValue, newValue });
  });

  // Log initial state
  console.log(
    "Cart store initialized:",
    JSON.parse(JSON.stringify(items.value))
  );

  return {
    items,
    addItem,
    updateCount,
    removeItem,
    wipeItems,
    address,
    payableAmount,
  };
});
