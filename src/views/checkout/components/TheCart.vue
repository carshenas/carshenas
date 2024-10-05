<script setup lang="ts">
import { computed } from "vue";
import { useCartStore } from "@/stores/cart";
import ProductList from "@/components/ProductList.vue";
import PaymentCard from "./PaymentCard.vue";
import type { Variant } from "@/types/dto/product";

const cartStore = useCartStore();
const emit = defineEmits<{
  (e: "next"): void;
}>();

// Use computed to directly access cartStore.items as they are now of type Variant[], which includes Product properties
const cartProducts = computed(() => cartStore.items as Variant[]);
</script>

<template>
  <div class="h-100 d-flex flex-column ga-1">
    <div class="flex-grow-1">
      <!-- Pass the cart items to the ProductList component -->
      <ProductList
        v-if="cartProducts.length"
        :items="cartProducts"
        has-counter
      />
      <div class="h-100 w-100 d-flex align-center justify-center" v-else>
        {{ $t("product.noProducts") }}
      </div>
    </div>

    <v-divider thickness="8" color="divider" class="border-opacity-100" />

    <PaymentCard />

    <div class="bottom-bar pa-4">
      <v-btn
        class="primary"
        block
        :text="$t('shared.continue')"
        @click="emit('next')"
      />
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
