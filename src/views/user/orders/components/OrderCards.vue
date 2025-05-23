<script setup lang="ts">
import type { OrderListResponse } from "@/types/dto/order";
import { toDisplayCurrency } from "@/helpers/currency";
import { useJalaliDate } from '@/composable/use-jalali-date'

const props = defineProps<{
  order: OrderListResponse;
  toggleOrderDetail: (id: number) => void;
  id: number;
}>();

const getStateData = (status: string) => {
  switch (status) {
    case 'Created':
      return {
        class: 'text-amber-darken-2',
        text: 'در انتظار پرداخت',
        icon: 'schedule'
      };
    case 'InProgress':
      return {
        class: 'text-orange-darken-4',
        text: 'درجریان',
        icon: 'pending'
      };
    case 'Sent':
      return {
        class: 'text-green-darken-2',
        text: 'ارسال شده',
        icon: 'local_shipping'
      };
    case 'Delivered':
      return {
        class: 'text-green-darken-2',
        text: 'تحویل داده شده',
        icon: 'done_all'
      };
    case 'Canceled':
      return {
        class: 'text-red-darken-2',
        text: 'لغو شده',
        icon: 'cancel'
      };
    default:
      return {
        class: 'text-grey-darken-2',
        text: status,
        icon: 'help'
      };
  }
}

const { convertToJalali } = useJalaliDate()
</script>

<template>
  <v-card class="order-card" elevation="2" @click="toggleOrderDetail">
    <v-card-text class="pa-4">
      <!-- Order Status -->
      <div class="d-flex align-center justify-space-between mb-4">
        <div class="d-flex align-center">
          <v-icon :icon="getStateData(order.status).icon" :color="getStateData(order.status).class"   :class="[getStateData(order.status).class, 'font-weight-medium ml-2']"/>
          <span :class="[getStateData(order.status).class, 'font-weight-medium']">
            {{ getStateData(order.status).text }}
          </span>
        </div>
        <v-icon icon="chevron_left" color="grey" />
      </div>

      <!-- Order Details -->
      <div class="order-details">
        <div class="d-flex justify-space-between align-center mb-2">
          <span class="text-caption text-grey">شماره سفارش:</span>
          <span class="font-weight-medium">#{{ order.id }}</span>
        </div>
        
        <div class="d-flex justify-space-between align-center mb-2">
          <span class="text-caption text-grey">تاریخ:</span>
          <span>{{ convertToJalali(order.dateCreated) }}</span>
        </div>

        <div class="d-flex justify-space-between align-center">
          <span class="text-caption text-grey">مبلغ کل:</span>
          <span class="font-weight-bold text-primary">{{ toDisplayCurrency(order.finalPrice) }}</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.order-card {
  height: 100%;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.order-card:hover {
  transform: translateY(-2px);
}

.order-details {
  border-top: 1px solid #e0e0e0;
  padding-top: 12px;
}
</style>
