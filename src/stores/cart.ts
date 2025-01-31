// stores/cart.ts
import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { debounce } from "lodash";
import {
  deleteBasketService,
  getBasketService,
  patchBasketService,
} from "@/services/carshenas/basket";
import type { BasketItem } from "@/types/dto/basket";

const CART_STORAGE_KEY = "cart-items";
const DEBOUNCE_DELAY = 500;

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
  const pendingUpdates = ref<Map<number, number>>(new Map());

  // Debounced function to process all pending updates
  const processPendingUpdates = debounce(async () => {
    if (isUpdating.value || pendingUpdates.value.size === 0) return;

    isUpdating.value = true;
    const updates = Array.from(pendingUpdates.value.entries());
    pendingUpdates.value.clear();

    try {
      // Process all updates in parallel
      await Promise.all(
        updates.map(async ([cartId, stock]) => {
          const item = items.value.find((item) => item.id === cartId);
          if (!item) return;

          try {
            await patchBasketService(cartId, { stock });
            item.stock = stock;
          } catch (error) {
            console.error(`Failed to update item ${cartId}:`, error);
            // Revert the local state if the update fails
            pendingUpdates.value.set(cartId, item.stock);
          }
        })
      );

      saveCartToLocalStorage(items.value);
    } finally {
      isUpdating.value = false;
      // If there are any new pending updates that came in during processing,
      // trigger another process cycle
      if (pendingUpdates.value.size > 0) {
        processPendingUpdates();
      }
    }
  }, DEBOUNCE_DELAY);

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
    console.log(newItem);
    if (existingItem) {
      existingItem.stock += newItem.stock;
    } else {
      items.value.push({
        id: newItem.id,
        stock: newItem.stock,
        variant: {
          name: newItem.name,
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
    console.log(items.value);
    saveCartToLocalStorage(items.value);
  };

  const updateQuantity = (cartId: number, stock: number) => {
    const item = items.value.find((item) => item.id === cartId);
    if (!item) return;

    // Update local state immediately
    item.stock = stock;
    // Add to pending updates
    pendingUpdates.value.set(cartId, stock);
    // Trigger debounced update
    processPendingUpdates();
  };

  const removeItem = async (cartId: number) => {
    // Remove any pending updates for this item
    pendingUpdates.value.delete(cartId);

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
    // Clear all pending updates
    pendingUpdates.value.clear();

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
    isUpdating,
  };
});
