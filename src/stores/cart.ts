import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import {
  deleteBasketService,
  getBasketService,
  patchBasketService,
} from "@/services/carshenas/basket";
import type { BasketItem } from "@/types/dto/basket";

const CART_STORAGE_KEY = "cart-items";

// Load the cart from local storage
const loadCartFromLocalStorage = (): BasketItem[] => {
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);
  return storedCart ? JSON.parse(storedCart) : [];
};

// Save the cart to local storage
const saveCartToLocalStorage = (items: BasketItem[]) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

export const useCartStore = defineStore("cart", () => {
  const items = ref<BasketItem[]>(loadCartFromLocalStorage());
  const isUpdating = ref(false);
  const updateQueue = ref<{ cartId: number; stock: number }[]>([]);

  // Process the update queue
  const processUpdateQueue = async () => {
    if (isUpdating.value || updateQueue.value.length === 0) return;

    isUpdating.value = true;
    const update = updateQueue.value[0];

    try {
      const item = items.value.find((item) => item.id === update.cartId);
      if (!item) throw new Error("Item not found");

      await patchBasketService(update.cartId, { stock: update.stock });
      item.stock = update.stock;
      saveCartToLocalStorage(items.value);

      // Remove the processed update from the queue
      updateQueue.value.shift();
    } catch (error) {
      console.error("Failed to update item quantity:", error);
      // In case of error, we might want to retry or handle it differently
    } finally {
      isUpdating.value = false;
      // Process next update if any
      if (updateQueue.value.length > 0) {
        processUpdateQueue();
      }
    }
  };

  // Fetch cart items from the API
  const fetchCart = async () => {
    try {
      const response = await getBasketService();
      items.value = response.data.map((item: BasketItem) => ({
        id: item.id,
        stock: item.stock,
        variant: {
          name: item.variant.name,
          id: item.variant.id,
          price: item.variant.price,
          warranty: item.variant.warranty,
          color: item.variant.color,
          image: item.variant.image || null,
          images: item.variant.images || [],
          quantity: item.variant.quantity || 0,
          out_of_stock: item.variant.out_of_stock || false,
          is_unlimited: item.variant.is_unlimited || false,
          specification: item.variant.specification || {},
          brand: item.variant.brand || "",
        },
      }));
      saveCartToLocalStorage(items.value);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  const addItem = (newItem: BasketItem) => {
    const existingItem = items.value.find(
      (item) => item.variant.id === newItem.variant.id
    );

    if (existingItem) {
      existingItem.stock += newItem.stock;
    } else {
      items.value.push({
        id: newItem.id,
        stock: newItem.stock,
        variant: {
          name: newItem.variant.name,
          id: newItem.variant.id,
          price: newItem.variant.price,
          warranty: newItem.variant.warranty,
          color: newItem.variant.color,
          image: newItem.variant.image || null,
          images: newItem.variant.images || [],
          quantity: newItem.variant.quantity || 0,
          out_of_stock: newItem.variant.out_of_stock || false,
          is_unlimited: newItem.variant.is_unlimited || false,
          specification: newItem.variant.specification || {},
          brand: newItem.variant.brand || "",
        },
      });
    }
    saveCartToLocalStorage(items.value);
  };

  const updateQuantity = async (cartId: number, stock: number) => {
    // Add the update to the queue
    updateQueue.value.push({ cartId, stock });

    // If this is the only update, start processing
    if (updateQueue.value.length === 1 && !isUpdating.value) {
      processUpdateQueue();
    }
  };

  const removeItem = async (cartId: number) => {
    // Wait for any pending updates to complete
    if (isUpdating.value) {
      updateQueue.value = updateQueue.value.filter(
        (update) => update.cartId !== cartId
      );
      await new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!isUpdating.value) {
            clearInterval(checkInterval);
            resolve(true);
          }
        }, 100);
      });
    }

    const index = items.value.findIndex((item) => item.id === cartId);
    if (index === -1) return;

    try {
      await deleteBasketService(cartId);
      items.value.splice(index, 1);
      saveCartToLocalStorage(items.value);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const clearCart = async () => {
    // Wait for any pending updates to complete
    if (isUpdating.value) {
      await new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!isUpdating.value) {
            clearInterval(checkInterval);
            resolve(true);
          }
        }, 100);
      });
    }

    updateQueue.value = []; // Clear the queue

    try {
      const deletePromises = items.value.map((item) =>
        deleteBasketService(item.id)
      );
      await Promise.all(deletePromises);
      items.value = [];
      saveCartToLocalStorage(items.value);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const payableAmount = computed(() =>
    items.value.reduce(
      (total, item) => total + (item.variant.price ?? 0) * item.stock,
      0
    )
  );

  const isItemInCart = (variantId: number) =>
    items.value.some((item) => item.variant.id === variantId);

  const getItemQuantity = (variantId: number) => {
    const item = items.value.find((item) => item.variant.id === variantId);
    return item ? item.stock : 0;
  };

  // Watch for changes and save to localStorage
  watch(items, (newItems) => saveCartToLocalStorage(newItems), { deep: true });

  // Fetch cart initially
  fetchCart();

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    payableAmount,
    isItemInCart,
    getItemQuantity,
    fetchCart,
    isUpdating, // Exposed for UI feedback if needed
  };
});
