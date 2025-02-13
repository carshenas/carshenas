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
  <section class="pa-4 h-100">
    <div class="w-100 d-flex align-center justify-space-between">
      <v-btn v-if="selectedOrderId === null" icon="arrow_forward_ios" variant="text" @click="$router.go(-1)" />
      <v-btn v-if="selectedOrderId !== null" icon="arrow_forward_ios" variant="text" @click="clearSelectedOrderIndex" />
      <h1>{{ $t('user.orders') }}</h1>
      <v-btn icon="" variant="text" />


    </div>
    <div class=" d-flex flex-column ga-4 mt-4" v-if="selectedOrderId === null">
      <OrderCards v-for="(order, index) in orders" :key="index" :order="order"
        :toggleOrderDetail="() => toggleOrderDetail(order.id)" :id="order.id" />
    </div>


    <OrderItemCards v-if="selectedOrderId !== null" :selectedOrderId="selectedOrderId" />
  </section>
</template>
