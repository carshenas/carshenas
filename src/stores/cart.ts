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

export const useCartStore = defineStore("cart", () => {
  const items = ref<BasketItem[]>([]);
  const isUpdating = ref(false);
  const pendingUpdates = ref<Map<number, number>>(new Map());
  const updateErrors = ref<Map<number, string>>(new Map());
  const deliveryPrice = ref(0); // Reactive variable for delivery price
  const originalQuantities = ref<Map<number, number>>(new Map());
  const discountCode = ref<string | null>(null);

  const deliveryPriceComputed = computed({
    get: () => deliveryPrice.value, // Getter to retrieve the delivery price
    set: (newPrice: number) => {
      deliveryPrice.value = newPrice; // Setter to update the delivery price
      console.log("Delivery price updated:", newPrice); // Optional: Log the updated price
    },
  });

  // Save cart with error handling
  const saveCartToLocalStorage = (cartItems: BasketItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  };

  const processPendingUpdates = debounce(async () => {
    if (isUpdating.value || pendingUpdates.value.size === 0) return;

    isUpdating.value = true;
    const updates = Array.from(pendingUpdates.value.entries());
    pendingUpdates.value.clear();

    try {
      await Promise.all(
        updates.map(async ([cartId, newQuantity]) => {
          const item = items.value.find((item) => item.id === cartId);
          if (!item) return;

          // Get the stored original quantity
          const originalQuantity = originalQuantities.value.get(cartId) || item.quantity;

          console.log(`Updating item ${cartId}:`, {
            originalQuantity,
            requestedQuantity: newQuantity,
            currentItemQuantity: item.quantity
          });

          try {
            // Send update to server
            await patchBasketService(cartId, { quantity: newQuantity });

            // Update successful
            console.log(`Update successful for item ${cartId}:`, {
              originalQuantity,
              requestedQuantity: newQuantity,
              finalQuantity: item.quantity
            });

            // Clear stored original quantity
            originalQuantities.value.delete(cartId);

            // Clear any errors
            updateErrors.value.delete(cartId);
          } catch (error) {
            // Revert to original quantity on error
            item.quantity = originalQuantity;

            console.log(`Update failed for item ${cartId}, reverting:`, {
              originalQuantity,
              attemptedQuantity: newQuantity,
              revertedToQuantity: originalQuantity,
              error: error instanceof Error ? error.message : "Unknown error"
            });

            // Set error message
            let errorMessage = "Failed to update quantity";
            if (error instanceof Error) {
              errorMessage = error.message;

              // Make the error message more user-friendly for stock limitations
              if (error.message.includes("Not enough stock")) {
                errorMessage = "Not enough stock available";
              }
            }

            updateErrors.value.set(cartId, errorMessage);
          }
        })
      );

      saveCartToLocalStorage(items.value);
    } finally {
      isUpdating.value = false;
    }
  }, DEBOUNCE_DELAY);
  const fetchCart = async () => {
    try {
      const response = await getBasketService();
      items.value = response.data.map((item: BasketItem) => ({
        id: item.id,
        quantity: item.quantity,
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
      existingItem.quantity += newItem.quantity;
    } else {
      items.value.push({
        id: newItem.id,
        quantity: newItem.quantity,
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

  const updateQuantity = (cartId: number, newQuantity: number) => {
    const item = items.value.find((item) => item.id === cartId);
    if (!item) return;

    // Clear any previous errors for this item
    updateErrors.value.delete(cartId);

    // Store the current quantity before changing it
    // Only store if we don't already have an original quantity for this item
    if (!originalQuantities.value.has(cartId)) {
      originalQuantities.value.set(cartId, item.quantity);
    }

    const originalQuantity = originalQuantities.value.get(cartId) || item.quantity;

    // Only update if the quantity is actually different
    if (originalQuantity === newQuantity) {
      console.log(`Quantity unchanged for item ${cartId}: ${originalQuantity}`);
      originalQuantities.value.delete(cartId);
      return;
    }

    console.log(`Updating quantity for item ${cartId}: ${originalQuantity} -> ${newQuantity}`);

    // Update UI optimistically
    item.quantity = newQuantity;

    // Add to pending updates
    pendingUpdates.value.set(cartId, newQuantity);

    // Process the updates
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
      (total, item) => total + (item.variant.price ?? 0) * item.quantity,
      0
    ) 
  );

  const isItemInCart = (variantId: number) =>
    items.value.some((item) => item.variant.id === variantId);

  const getItemQuantity = (variantId: number) => {
    const item = items.value.find((item) => item.variant.id === variantId);
    return item ? item.quantity : 0;
  };

  // Watch for changes and save to localStorage
  watch(items, (newItems) => saveCartToLocalStorage(newItems), { deep: true });

  // Watch for changes in deliveryPriceComputed and update payableAmount
  watch(
    () => deliveryPriceComputed.value, // Watch the delivery price
    (newDeliveryPrice) => {
      console.log("Delivery price changed:", newDeliveryPrice);
      // The `payableAmount` computed property will automatically update
      // because it depends on `deliveryPriceComputed.value`.
    }
  );

  // Fetch cart initially
  fetchCart();

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    deliveryPrice, // Expose the getter and setter
    deliveryPriceComputed,
    payableAmount,
    isItemInCart,
    getItemQuantity,
    fetchCart,
    isUpdating,
    updateErrors,
    discountCode
  };
});
