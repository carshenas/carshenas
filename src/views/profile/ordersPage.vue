<script setup lang="ts">
import { ref } from 'vue';
import type Order from "@/types/dto/order";

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
        itemPrice: '50.00'
      },
      {
        itemId: 102,
        itemAmount: 2,
        itemName: 'Product B',
        itemPrice: '25.00'
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
        itemPrice: '30.00'
      }
    ]
  }
  ,
  {
    OrderId: 3,
    state: 'canceled',
    date: '2024-03-20',
    price: '75.00',
    postalCode: '54321',
    orderDetail: [
      {
        itemId: 201,
        itemAmount: 1,
        itemName: 'Product C',
        itemPrice: '30.00'
      }
    ]
  },
]);

const getStateClass = (state: string) => {
  switch (state) {
    case 'successful':
      return 'text-green-darken-4';
    case 'canceled':
      return 'text-red-darken-4';
    case 'doing':
      return 'text-orange';
    default:
      return '';
  }
}

const getStateText = (state: string) => {
  switch (state) {
    case 'successful':
      return 'تحویل داده شد';
    case 'doing':
      return 'درجریان';
    case 'canceled':
      return 'لغو شده';
    default:
      return '';
  }
}

const getStateIcon = (state: string) => {
  switch (state) {
    case 'successful':
      return 'done';
    case 'doing':
      return 'pending';
    case 'canceled':
      return 'close';
    default:
      return '';
  }
}
</script>

<template>

  <section class="pa-4 d-flex flex-column ga-8 h-100">
    <div class="w-100 d-flex align-center justify-space-between">
      <v-btn icon="arrow_forward_ios" variant="text" @click="$router.go(-1)" />
      <h1>{{ $t('profile.orders') }}</h1>
      <v-btn icon="" variant="text" />
    </div>
    <div class="d-flex flex-column ga-4">

      <v-card class="mx-auto w-100 pa-2" v-for="(order, index) in Orders" :key="index">
        <div class="d-flex align-center justify-space-between">
          <span :class="getStateClass(order.state)">{{ getStateText(order.state) }}
            <v-icon :icon=getStateIcon(order.state) size="x-small" />
          </span>

          <v-btn icon="more_horiz" variant="text" />
        </div>

        <v-card-text class="title-md">{{ order.OrderId }}</v-card-text>

        <div class="d-flex w-100 justify-space-between text-grey">
          <div>
            <span>{{ order.date }}</span>
          </div>
          <div>
            <span>{{ order.price }}</span>
          </div>
        </div>
      </v-card>
    </div>
  </section>

</template>