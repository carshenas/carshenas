<script setup lang="ts">
import type Order from "@/types/dto/order";

const props = defineProps<{
  order: Order;
  toggleOrderDetail: (index: number) => void;
  index: number;
}>();

const getStateData = (state: string) => {
  switch (state) {
    case 'successful':
      return {
        class: 'text-green-darken-4',
        text: 'تحویل داده شد',
        icon: 'done'
      };
    case 'doing':
      return {
        class: 'text-orange',
        text: 'درجریان',
        icon: 'pending'
      };
    case 'canceled':
      return {
        class: 'text-red-darken-4',
        text: 'لغو شده',
        icon: 'close'
      };
    default:
      return {
        class: '',
        text: '',
        icon: ''
      };
  }
}
</script>

<template>
  <v-card class="mx-auto w-100 pa-2">
    <div class="d-flex align-center justify-space-between">
      <span :class="getStateData(order.state).class">{{ getStateData(order.state).text }}
        <v-icon :icon="getStateData(order.state).icon" size="x-small" />
      </span>
      <v-btn icon="more_horiz" variant="text" @click="() => toggleOrderDetail(index)" />
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
</template>
