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
          images: item.variant.images || [], // Default to empty array
          quantity: item.variant.quantity || 0, // Default to 0
          out_of_stock: item.variant.out_of_stock || false, // Default to false
          is_unlimited: item.variant.is_unlimited || false, // Default to false
          specification: item.variant.specification || {}, // Default to empty object
          brand: item.variant.brand || "", // Default to an empty string
        },
      }));
      saveCartToLocalStorage(items.value); // Sync with local storage
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  const addItem = (newItem: BasketItem) => {
    // Check if the variant already exists in the cart
    const existingItem = items.value.find(
      (item) => item.variant.id === newItem.variant.id
    );

    if (existingItem) {
      // If the variant exists, increase the stock
      existingItem.stock += newItem.stock;
    } else {
      // Add a new item to the cart
      items.value.push({
        id: newItem.id,
        stock: newItem.stock,
        variant: {
          id: newItem.variant.id,
          price: newItem.variant.price,
          warranty: newItem.variant.warranty,
          color: newItem.variant.color,
          image: newItem.variant.image || null,
          images: newItem.variant.images || [], // Default to empty array
          quantity: newItem.variant.quantity || 0, // Default to 0
          out_of_stock: newItem.variant.out_of_stock || false, // Default to false
          is_unlimited: newItem.variant.is_unlimited || false, // Default to false
          specification: newItem.variant.specification || {}, // Default to empty object
          brand: newItem.variant.brand || "", // Default to an empty string
        },
      });
    }
    saveCartToLocalStorage(items.value);
  };

  const updateQuantity = async (cartId: number, stock: number) => {
    const item = items.value.find((item) => item.id === cartId);
    console.log(item);
    if (!item) return;
    try {
      await patchBasketService(cartId, { stock });
      item.stock = stock;
      saveCartToLocalStorage(items.value);
    } catch (error) {
      console.error("Failed to update item quantity:", error);
    }
  };

  const removeItem = async (cartId: number) => {
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

  // Automatically save to localStorage whenever items change
  watch(items, (newItems) => saveCartToLocalStorage(newItems), { deep: true });

  // Fetch cart initially when the store is created
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
  };
});
