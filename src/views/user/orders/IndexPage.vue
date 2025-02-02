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

console.log(orders)
const selectedOrderIndex = ref<number | null>(null);

const toggleOrderDetail = (index: number) => {
  selectedOrderIndex.value = index;
}

const clearSelectedOrderIndex = () => {
  selectedOrderIndex.value = null;
};

</script>

<template>
  <section class="pa-4 h-100">
    <div class="w-100 d-flex align-center justify-space-between">
      <v-btn v-if="selectedOrderIndex === null" icon="arrow_forward_ios" variant="text" @click="$router.go(-1)" />
      <v-btn v-if="selectedOrderIndex !== null" icon="arrow_forward_ios" variant="text"
        @click="clearSelectedOrderIndex" />
      <h1>{{ $t('user.orders') }}</h1>
      <v-btn icon="" variant="text" />


    </div>
    <div class=" d-flex flex-column ga-4 mt-4" v-if="selectedOrderIndex === null">
      <OrderCards v-for="(order, index) in orders" :key="index" :order="order"
        :toggleOrderDetail="() => toggleOrderDetail(index)" :index="index" />
    </div>


    <OrderItemCards v-if="selectedOrderIndex !== null" :orderDetail="orders[selectedOrderIndex]" />
  </section>
</template>
