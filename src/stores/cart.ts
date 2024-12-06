import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import type { Variant } from "@/types/dto/product";

export const useCartStore = defineStore("cart", () => {
  const items = ref<Variant[]>([]);
  const address = ref<string>("");

  const logCartChange = (action: string, details: any) => {
    console.log(`Cart ${action}:`, details);
    console.log("Current cart state:", JSON.parse(JSON.stringify(items.value)));
  };

  // Add item to cart
  const addItem = (product: Variant) => {
    items.value.push(product);
    logCartChange("Item added", product);
  };

  // Update item's quantity in cart
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

  // Remove item from cart
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

  // Clear all items from the cart
  const wipeItems = () => {
    const oldItems = [...items.value];
    items.value = [];
    logCartChange("Cart wiped", { removedItems: oldItems });
  };

  // Compute the total payable amount
  const payableAmount = computed(() =>
    items.value.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  // Watch for changes in the payable amount
  watch(payableAmount, (newValue, oldValue) => {
    console.log("Payable amount changed:", { oldValue, newValue });
  });

  // Initial cart state log
  console.log(
    "Cart store initialized:",
    JSON.parse(JSON.stringify(items.value))
  );

  // Helper getter to check if item is in the cart
  const isItemInCart = (id: number) => items.value.some(item => item.id === id);

  // Get the quantity of a specific item in the cart
  const getItemQuantity = (id: number) => {
    const item = items.value.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  return {
    items,
    addItem,
    updateCount,
    removeItem,
    wipeItems,
    address,
    payableAmount,
    isItemInCart,
    getItemQuantity
  };
});
