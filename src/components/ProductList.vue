<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import CurrencyDisplay from './CurrencyDisplay.vue';
import ImageLoader from './ImageLoader.vue';
import FilterChips from './FilterChips.vue'; // Import the FilterChips component
import { useProductList } from '@/composable/useProductList';
import type { ProductFilter } from '@/types/dto/product';
import { useRouter, useRoute } from 'vue-router';

const props = defineProps<{
  loading?: boolean;
  filter?: ProductFilter;
  hasCounter?: boolean;
  noPagination?: boolean;
  limit?: number;
}>();

const {
  products,
  isListVisible,
  getProducts,
  resetList,
  handleScroll,
  debugLogs,
} = useProductList(props);

const emit = defineEmits<{
  (e: 'update:filter', filter: ProductFilter): void
}>();

const router = useRouter();
const route = useRoute();



const getVehicleBadges = (vehicles: string[]) => {
  if (!vehicles || vehicles.length === 0) return {
    visible: [],
    hasMore: false,
    totalCount: 0
  };

  const maxVisible = 2;
  const visibleVehicles = vehicles.slice(0, maxVisible);
  const hasMore = vehicles.length > maxVisible;

  return {
    visible: visibleVehicles,
    hasMore,
    totalCount: vehicles.length
  };
};

const handleFilterRemove = (key: string) => {
  if (!props.filter) return;

  const newFilter = { ...props.filter };
  delete newFilter[key as keyof ProductFilter];

  // Update URL parameters
  const query = { ...route.query };
  if (key === 'vehicleName') {
    delete query.vehicle;
    delete query.vehicleName;
  } else if (key === 'categoryName') {
    delete query.category;
    delete query.categoryName;
  } else {
    delete query[key];
  }

  router.push({ query });
  emit('update:filter', newFilter);
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// Expose debugging utilities
defineExpose({
  debugLogs,
  resetList,
});
</script>

<template>
  <div>
    <!-- Add FilterChips component to display active filters -->
    <FilterChips :filter="props.filter" @remove="handleFilterRemove" />

    <v-infinite-scroll v-if="isListVisible" @load="getProducts">
      <template v-for="product in products" :key="product.id">
        <v-card variant="flat" elevation="1" shadow class="product py-2 px-4 mt-2 ma-1 bg-surface"
          @click="() => $router.push({ name: 'ProductDetailPage', params: { id: product.id } })"
          style="cursor: pointer">
          <v-row>
            <v-col cols="4" class="d-flex align-center">
              <ImageLoader :src="product.images && product.images.length > 0
                ? product.images[0]
                : product.image || 'placeholder.jpg'" :alt="product.name!" width="86" height="86" aspectRatio="1" />
            </v-col>

            <v-col cols="8" class="d-flex flex-column">
              <div class="d-flex justify-space-between align-center">
                <h2 class="title-sm">{{ product.name }}</h2>
              </div>

              <!-- Vehicle Badges -->


              <p class="body-sm mt-2 text-outline">{{ product.description }}</p>

              <div class="mt-2 flex-grow-1 d-flex justify-space-between align-end">
                <CurrencyDisplay :value="product.price" value-class="text-primary font-weight-bold"
                  unit-class="body-sm text-outline" class="d-flex justify-end body-md py-1" />
                <div v-if="product.vehicles && product.vehicles.length > 0" class="mt-2">
                  <div class="d-flex flex-nowrap gap-1">
                    <v-chip rounded="lg" variant="tonal" v-for="(vehicle) in getVehicleBadges(product.vehicles).visible"
                      :key="vehicle" color="deep-orange" size="small" class=" text-caption font-weight-medium">
                      {{ vehicle }}
                    </v-chip>
                    <v-chip rounded="lg" variant="tonal" v-if="getVehicleBadges(product.vehicles).hasMore" size="small" color="deep-orange"
                      class="text-caption font-weight-medium">
                      غیره
                    </v-chip>
                  </div>
                </div>
                <!-- <v-btn
                  :text="$t('shared.more')"
                  variant="plain"
                  class="px-0"
                  append-icon="chevron_left"
                  density="compact"
                  @click.stop
                /> -->
              </div>
            </v-col>
          </v-row>
        </v-card>
      </template>

      <template #loading>
        <v-row>
          <v-col cols="12">
            <v-skeleton-loader v-for="n in 4" :key="n" class="mt-2 mx-0 pa-0" height="100" width="315" type="ossein" />
          </v-col>
        </v-row>
      </template>

      <template #empty>
        <div style="height: 24px"></div>
      </template>
    </v-infinite-scroll>
  </div>
</template>

<style scoped>
.centered-input {
  width: 120px;
}

.v-infinite-scroll {
  overflow: hidden;
}

.gap-1 {
  gap: 2px;
}
</style>