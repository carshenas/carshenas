<script setup lang="ts">
import type { OrderListResponse } from "@/types/dto/order";
import { toDisplayCurrency } from "@/helpers/currency";

const props = defineProps<{
  orderDetail: OrderListResponse
}>();
console.log(props.orderDetail)
</script>

<template>
  <div class="d-flex flex-column pa-4 ga-8 text-right	">
    <v-card v-for="(item, index) in props.orderDetail.items" :key="index">
      <v-card-text class="d-flex flex-column justify-space-between ga-4">
        <div class="d-flex align-center ga-2">
          <span>{{ typeof item.variant !== 'number' ? item.variant.name : 'Unknown' }}</span>

          <ImageLoader
              :src="typeof item.variant !== 'number' ? item.variant.image : ''"
              :alt="typeof item.variant !== 'number' ? item.variant.name : 'Unknown Product'"
              width="86"
              height="86"
              aspectRatio="1"
            />
        </div>
        <div class="d-flex justify-space-between align-center ga-12">
          <span>{{ item.quantity }} عدد</span>
          <span>{{ toDisplayCurrency(props.orderDetail.price) }}</span>

        </div>

      </v-card-text>
    </v-card>
  </div>
</template>
