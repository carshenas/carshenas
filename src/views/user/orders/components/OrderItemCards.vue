<script setup lang="ts">
import { toDisplayCurrency } from "@/helpers/currency";
import { getOrderDetail } from "@/services/carshenas/order";
import type { OrderListResponse } from "@/types/dto/order";
import { onMounted, ref } from "vue";
import ImageLoader from "@/components/ImageLoader.vue";
import { useJalaliDate } from '@/composable/use-jalali-date';

const props = defineProps<{
  selectedOrderId: number | null
}>();

const order = ref<OrderListResponse>();
const { convertToJalali } = useJalaliDate();

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'تاریخ نامعتبر';
    }
    return convertToJalali(dateString);
  } catch (e) {
    return 'تاریخ نامعتبر';
  }
}

const getOrders = async () => {
  if (props.selectedOrderId) {
    try {
      const response = await getOrderDetail(props.selectedOrderId)
      order.value = response.data
    } catch (e) {
      console.error(e)
    }
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'Created':
      return 'در انتظار پرداخت';
    case 'InProgress':
      return 'در حال پردازش';
    case 'Sent':
      return 'ارسال شده';
    case 'Delivered':
      return 'تحویل داده شده';
    case 'Canceled':
      return 'لغو شده';
    default:
      return status;
  }
}

onMounted(() => getOrders())
</script>

<template>
  <div class="receipt-container">
    <v-card class="receipt-card">
      <!-- Receipt Header -->
      <div class="receipt-header pa-4">
        <h2 class="text-center mb-2">فاکتور فروش</h2>
        <div class="text-center text-caption">
          <div>تاریخ: {{ formatDate(order?.dateCreated || '') }}</div>
          <div>شماره سفارش: #{{ order?.id }}</div>
          <div class="mt-2">
            <v-chip
              :color="order?.status === 'Created' ? 'warning' : order?.status === 'Canceled' ? 'error' : 'success'"
              size="small"
            >
              {{ getStatusText(order?.status || '') }}
            </v-chip>
          </div>
        </div>
      </div>

      <!-- Receipt Items -->
      <v-divider></v-divider>
      <div class="receipt-items pa-4">
        <div v-for="(item, index) in order?.items" :key="index" class="receipt-item mb-4">
          <div class="d-flex justify-space-between align-center">
            <div class="d-flex align-center ga-2">
              <ImageLoader 
                v-if="typeof item.variant !== 'number'" 
                :src="item.variant.image" 
                :alt="item.variant.name"
                width="64" 
                height="64"
                class="rounded"
              />
              <div class="d-flex flex-column">
                <span class="font-weight-medium">{{ typeof item.variant !== 'number' ? item.variant.name : 'Unknown' }}</span>
                <span class="text-caption text-grey">{{ typeof item.variant !== 'number' ? item.variant.warranty : '' }}</span>
              </div>
            </div>
            <div class="text-left">
              <div class="text-caption">{{ item.quantity }} عدد</div>
              <div class="font-weight-bold">{{ item.price ? toDisplayCurrency(item.price) : '' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Receipt Footer -->
      <v-divider></v-divider>
      <div class="receipt-footer pa-4">
        <div class="d-flex justify-space-between mb-2">
          <span>جمع کل:</span>
          <span class="font-weight-bold">{{ order?.price ? toDisplayCurrency(order.price) : '' }}</span>
        </div>
        <div class="d-flex justify-space-between mb-2">
          <span>هزینه ارسال:</span>
          <span class="font-weight-bold">{{ order?.finalPrice && order?.price ? toDisplayCurrency(order.finalPrice - order.price) : '' }}</span>
        </div>
        <v-divider class="my-2"></v-divider>
        <div class="d-flex justify-space-between mb-4">
          <span>مبلغ قابل پرداخت:</span>
          <span class="font-weight-bold text-primary">{{ order?.finalPrice ? toDisplayCurrency(order.finalPrice) : '' }}</span>
        </div>

        <!-- Transaction History -->
        <div v-if="order?.transactions?.length" class="transaction-history mt-4">
          <div class="text-caption text-grey mb-2">تاریخچه پرداخت:</div>
          <div v-for="(transaction, index) in order.transactions" :key="index" class="transaction-item">
            <div class="d-flex justify-space-between align-center">
              <div class="d-flex align-center">
                <v-icon
                  :icon="transaction.isSuccessful ? 'check_circle' : 'cancel'"
                  :color="transaction.isSuccessful ? 'success' : 'error'"
                  size="small"
                  class="ml-2"
                />
                <span>{{ formatDate(transaction.dateCreated) }}</span>
              </div>
              <span :class="transaction.isSuccessful ? 'text-success' : 'text-error'">
                {{ toDisplayCurrency(transaction.amount) }}
              </span>
            </div>
          </div>
        </div>

        <div class="text-center mt-4 text-caption">
          با تشکر از خرید شما
        </div>
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.receipt-container {
  max-width: 600px;
  margin: 0 auto;
}

.receipt-card {
  background-color: var(--v-theme-surface);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.receipt-header {
  background-color: var(--v-theme-background);
  border-radius: 8px 8px 0 0;
}

.receipt-item {
  border-bottom: 1px dashed var(--v-theme-divider);
  padding-bottom: 8px;
}

.receipt-footer {
  background-color: var(--v-theme-background);
  border-radius: 0 0 8px 8px;
}

.transaction-history {
  background-color: var(--v-theme-surface);
  border-radius: 4px;
  padding: 8px;
}

.transaction-item {
  padding: 4px 0;
  border-bottom: 1px solid var(--v-theme-divider);
}

.transaction-item:last-child {
  border-bottom: none;
}
</style>
