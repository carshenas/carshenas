<script lang="ts" setup>
import type {
  Product,
  ProductFilter,
  Variant,
  Color,
} from "@/types/dto/product";
import { ref, onMounted, watch } from "vue";
import { getProductListService } from "@/services/carshenas/product";
import CurrencyDisplay from "./CurrencyDisplay.vue";
import ImageLoader from "./ImageLoader.vue";
import ItemCounter from "@/components/ItemCounter.vue";
import { useCartStore } from "@/stores/cart";

const cartStore = useCartStore();

const props = defineProps<{
  items?: Product[];
  loading?: boolean;
  filter?: ProductFilter;
  hasCounter?: boolean;
  manual?: boolean;
}>();

const _loading = ref<boolean>(false);
const products = ref<Product[]>(props.items || []);

const getProducts = async () => {
  _loading.value = true;

  try {
    const response = await getProductListService(props.filter);
    products.value = response.data.result;
  } catch (e) {
    console.error(e);
  } finally {
    _loading.value = false;
  }
};

watch(
  () => props.filter,
  () => getProducts()
);

onMounted(() => {
  !props.manual ? getProducts() : undefined;
});

const getDefaultVariant = (product: Product): Variant => {
  return {
    id: product.id,
    price: product.price,
    stock: product.stock,
    quantity: 1,
    is_unlimited: false, // You might want to adjust this based on your business logic
    specification: {}, // Add default or empty specification
    brand: "", // Add default brand or extract from product if available
    warranty: "", // Add default warranty or extract from product if available
    color: { name: "", code: "" }, // Add default color or extract from product if available
    image: product.image || null,
  };
};

const handleItemCounter = (product: Product, quantity: number) => {
  const variant = getDefaultVariant(product);
  const existingItem = cartStore.items.find((item) => item.id === variant.id);

  if (existingItem) {
    if (quantity === 0) {
      cartStore.removeItem(variant.id);
    } else {
      cartStore.updateCount(variant.id, quantity);
    }
  } else if (quantity > 0) {
    cartStore.addItem({ ...variant, quantity });
  }
};

const getCartQuantity = (productId: number): number => {
  const item = cartStore.items.find((item) => item.id === productId);
  return item ? item.quantity : 0;
};
</script>

<template>
  <div v-if="_loading || props.loading">
    <v-skeleton-loader
      v-for="n in 4"
      :key="n"
      class="mt-2"
      height="100"
      type="ossein"
    />
  </div>

  <v-list v-else>
    <v-list-item
      v-for="product in products"
      :key="product.id"
      class="product py-2 px-4"
    >
      <v-row>
        <v-col cols="4" class="d-flex align-center">
          <ImageLoader
            :src="product.image"
            :alt="product.title"
            width="86"
            height="86"
            aspectRatio="1"
          />
        </v-col>

        <v-col cols="8" class="d-flex flex-column">
          <div class="d-flex justify-space-between align-center">
            <h2 class="title-sm">{{ product.title }}</h2>

            <v-btn
              v-if="props.hasCounter && getCartQuantity(product.id) > 0"
              density="compact"
              icon="delete"
              variant="plain"
              class="px-0"
              @click="handleItemCounter(product, 0)"
            />
          </div>

          <p class="body-sm mt-2 text-outline">{{ product.description }}</p>

          <div class="mt-2 flex-grow-1 d-flex justify-space-between align-end">
            <CurrencyDisplay
              :value="product.price"
              value-class="text-primary font-weight-bold"
              unit-class="body-sm text-outline"
              class="d-flex justify-end body-md py-1"
            />

            <ItemCounter
              v-if="props.hasCounter"
              :variant="getDefaultVariant(product)"
              :quantity="getCartQuantity(product.id)"
              @update:quantity="
                (quantity) => handleItemCounter(product, quantity)
              "
            />

            <v-btn
              v-else
              :text="$t('shared.more')"
              variant="plain"
              class="px-0"
              append-icon="chevron_left"
              density="compact"
              :to="{ name: 'ProductDetailPage', params: { id: product.id } }"
            ></v-btn>
          </div>
        </v-col>
      </v-row>
    </v-list-item>
  </v-list>
</template>

<style lang="scss" scoped>
.product {
  border-bottom: 1px solid rgb(238, 238, 238);
}

.product:nth-child(2n) {
  background-color: rgba(238, 238, 238, 0.384);
}
</style>
