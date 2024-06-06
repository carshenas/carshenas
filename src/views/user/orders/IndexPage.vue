<script setup lang="ts">
import { ref } from 'vue';
import type Order from "@/types/dto/order";
import OrderCards from "./components/OrderCards.vue";
import OrderItemCards from './components/OrderItemCards.vue';

const Orders = ref<Order[]>([
  {
    OrderId: 1,
    state: 'successful',
    date: '2024-03-19',
    price: '100.00',
    postalCode: '12345',
    orderDetail: [
      {
        itemId: 101,
        itemAmount: 1,
        itemName: 'Product A',
        itemPrice: '100000',
        itemImage: 'https://images.tayna.com/prod-images/1200/Powerline/065-powerline-45-435.jpg'
      },
      {
        itemId: 102,
        itemAmount: 2,
        itemName: 'Product B',
        itemPrice: '100000',
        itemImage: 'https://images.tayna.com/prod-images/1200/Powerline/065-powerline-45-435.jpg'
      }
    ]
  },
  {
    OrderId: 2,
    state: 'doing',
    date: '2024-03-20',
    price: '75.00',
    postalCode: '54321',
    orderDetail: [
      {
        itemId: 201,
        itemAmount: 1,
        itemName: 'Product C',
        itemPrice: '100000',
        itemImage: 'https://images.tayna.com/prod-images/1200/Powerline/065-powerline-45-435.jpg'
      }
    ]
  },
  {
    OrderId: 3,
    state: 'canceled',
    date: '2024-03-20',
    price: '75.00',
    postalCode: '54321',
    orderDetail: [
      {
        itemId: 301,
        itemAmount: 1,
        itemName: 'Product D',
        itemPrice: '100000',
        itemImage: 'https://images.tayna.com/prod-images/1200/Powerline/065-powerline-45-435.jpg'
      }
    ]
  },
]);

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
      <h1>{{ $t('profile.orders') }}</h1>
      <v-btn icon="" variant="text" />


    </div>
    <div class=" d-flex flex-column ga-4 mt-4" v-if="selectedOrderIndex === null">
      <OrderCards v-for="(order, index) in Orders" :key="index" :order="order"
        :toggleOrderDetail="() => toggleOrderDetail(index)" :index="index" />
    </div>


    <OrderItemCards v-if="selectedOrderIndex !== null" :orderDetail="Orders[selectedOrderIndex].orderDetail" />
  </section>
</template>
