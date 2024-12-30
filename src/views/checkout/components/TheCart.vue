<script setup lang="ts">
import { computed } from "vue";
import { useCartStore } from "@/stores/cart";
import ProductList from "@/components/ProductList.vue";
import PaymentCard from "./PaymentCard.vue";
import type { Product } from "@/types/dto/product";
import type { BasketItem } from "@/types/dto/basket";

const cartStore = useCartStore();
const emit = defineEmits<{
  (e: "next"): void;
}>();

const cartProducts = computed<Product[]>(() =>
  cartStore.items.map((item: BasketItem) => ({
    id: item.variant.id,
    name: item.variant.name,
    description: item.variant.description,
    price: item.variant.price,
    quantity: item.stock,
    stock: item.variant.stock,
    out_of_stock: item.variant.stock === 0,
    // If variant has images array, use that structure
    ...(item.variant.images?.length ? {
      images: item.variant.images,
      image: item.variant.image || null
    } : {
      // Otherwise, use single image structure
      image: item.variant.image || item.variant.images?.[0] || ''
    })
  }))
);
</script>

<template>
  <div class="h-100 d-flex flex-column ga-1">
    <div class="flex-grow-1">
      <!-- Pass the cart items to the ProductList component -->
      <ProductList v-if="cartProducts.length" :items="cartProducts" has-counter />
      <div class="h-100 w-100 d-flex align-center justify-center" v-else>
        {{ $t("product.noProducts") }}
      </div>
    </div>

    <v-divider thickness="8" color="divider" class="border-opacity-100" />

    <PaymentCard />

    <div class="bottom-bar pa-4">
      <v-btn class="primary" block :text="$t('shared.continue')" @click="emit('next')" />
    </div>
  </div>
</template>

<style scoped>
.bottom-bar {
  background-color: white;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
