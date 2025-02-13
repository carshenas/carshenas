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
        class: 'text-yellow-darken-2',
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
        text: 'لغو شده',
        icon: 'done'
      };
    default:
      return {
        class: '',
        text: '',
        icon: ''
      };
  }
}

const { convertToJalali } = useJalaliDate()
</script>

<template>
  <v-card class="mx-auto w-100 pa-2">
    <div class="d-flex align-center justify-space-between">
      <span :class="getStateData(order.status).class">{{ getStateData(order.status).text }}
        <v-icon :icon="getStateData(order.status).icon" size="x-small" />
      </span>
      <v-btn icon="more_horiz" variant="text" @click="() => toggleOrderDetail(order.id)" />
    </div>
    <div class="d-flex w-100 justify-space-between text-grey">
      <v-card-text class="title-md">{{ order.id }}</v-card-text>

      <div class='d-flex justify-space-between w-50 align-center'>
        <span>{{ toDisplayCurrency(order.finalPrice) }}</span>
        <div>
        </div>
        <div>
          <span>{{ convertToJalali(order.dateCreated) }}</span>
        </div>
      </div>

    </div>
  </v-card>
</template>
