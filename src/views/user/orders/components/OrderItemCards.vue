<script setup lang="ts">
import type { OrderItems } from "@/types/dto/order";

const props = defineProps<{
  orderDetail: OrderItems[]
}>();

</script>

<template>
  <div class="d-flex flex-column pa-4 ga-4">
    <v-card v-for="(item, index) in props.orderDetail" :key="index">
      <v-card-text class="d-flex justify-space-between">
        <div class="d-flex align-center ga-2">
          <v-img :width="64" aspect-ratio="1/1" :src="item.itemImage" :alt="item.itemName" />
          <span>{{ item.itemName }}</span>
        </div>
        <div class="d-flex align-center ga-12">
          <span>X{{ item.itemAmount }}</span>
          <span>{{ item.itemPrice }}</span>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>