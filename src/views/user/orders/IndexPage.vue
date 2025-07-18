<script setup lang="ts">
import { onMounted, ref } from 'vue';
import OrderCards from "./components/OrderCards.vue";
import OrderItemCards from './components/OrderItemCards.vue';
import { getOrderList } from '@/services/carshenas/order';
import type { OrderListResponse } from '@/types/dto/order';

const orders = ref<OrderListResponse[]>([])

const getOrders = async () => {
  try {
    const response = await getOrderList()
    orders.value = response.data
  } catch (e) {
    console.error(e)
  }
}
onMounted(() => getOrders())

const selectedOrderId = ref<number | null>(null);
const toggleOrderDetail = (id: number) => {
  selectedOrderId.value = id;
}

const clearSelectedOrderIndex = () => {
  selectedOrderId.value = null;
};

</script>

<template>
  <section class="orders-page">
    <!-- Header Section -->
    <div class="orders-header">
      <div class="d-flex align-center justify-space-between pa-4">
        <v-btn v-if="selectedOrderId === null" icon="arrow_forward_ios" variant="text" @click="$router.go(-1)" />
        <v-btn v-if="selectedOrderId !== null" icon="arrow_forward_ios" variant="text"
          @click="clearSelectedOrderIndex" />
        <h1 class="text-h5 font-weight-bold">{{ $t('user.orders') }}</h1>
        <div style="width: 40px"></div> <!-- Spacer for alignment -->
      </div>
    </div>

    <!-- Main Content -->
    <div class="orders-content">
      <!-- Order List View -->
      <div v-if="selectedOrderId === null" class="orders-list">
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="4" v-for="(order, index) in orders" :key="index">
              <OrderCards :order="order" :toggleOrderDetail="() => toggleOrderDetail(order.id)" :id="order.id" />
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- Order Detail View -->
      <div v-else class="order-detail">
        <OrderItemCards :selectedOrderId="selectedOrderId" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.orders-page {
  min-height: 100vh;
  background-color: var(--v-theme-surface);
}

.orders-header {
  background-color: var(--v-theme-background);
  border-bottom: 1px dashed var(--v-theme-divider);
  position: sticky;
  top: 0;
  z-index: 1;
}

.orders-content {
  padding: 16px 0;
}

.orders-list {
  max-width: 1200px;
  margin: 0 auto;
}

.order-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
}

@media (max-width: 600px) {
  .orders-content {
    padding: 8px 0;
  }

  .order-detail {
    padding: 0 8px;
  }
}
</style>
