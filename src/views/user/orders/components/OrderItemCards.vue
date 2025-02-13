<script setup lang="ts">
import { toDisplayCurrency } from "@/helpers/currency";
import { getOrderDetail } from "@/services/carshenas/order";
import type { OrderListResponse } from "@/types/dto/order";
import { onMounted, ref } from "vue";
import ImageLoader from "@/components/ImageLoader.vue";

const props = defineProps<{
  selectedOrderId: number | null
}>();
const order = ref<OrderListResponse>()
const getOrders = async () => {
  if (props.selectedOrderId) {
    try {
      const response = await getOrderDetail(props.selectedOrderId)
      order.value = response.data
      console.log(order.value.items)
    } catch (e) {
      console.error(e)
    }
  }
}
onMounted(() => getOrders())
</script>

<template>
  <div class="d-flex flex-column pa-4 ga-8 text-right	">
    <v-card v-for="(item, index) in order?.items" :key="index">
      <v-card-text class="d-flex flex-column justify-space-between ga-4">
        <div class="d-flex align-center ga-2">
          <ImageLoader v-if="typeof item.variant !== 'number'" :src="item.variant.image" :alt="item.variant.name"
            width="48" />

          <span>{{ typeof item.variant !== 'number' ? item.variant.name : 'Unknown' }}</span>
        </div>
        <div class="d-flex justify-space-between align-center ga-12">
          <span>{{ item.quantity }} عدد</span>
          <span>{{ item.price !== undefined ? toDisplayCurrency(item.price) : '' }}</span>

        </div>

      </v-card-text>
    </v-card>
  </div>
</template>
