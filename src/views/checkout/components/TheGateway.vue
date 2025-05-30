<script setup lang="ts">
import { ref, computed } from 'vue';
import PaymentCard from './PaymentCard.vue';
import { createOrderService } from '@/services/carshenas/order';
import type { OrderRequest } from '@/types/dto/order';
import { useCartStore } from '@/stores/cart'
import { useAddressStore } from '@/stores/address';
import { useSnackbar } from '@/stores/snackbar';

const emit = defineEmits<{
  (e: 'next'): void;
}>();

const cartStore = useCartStore()
const addressStore = useAddressStore()
const snackbar = useSnackbar()
const item = cartStore.items
const loading = ref(false);

const selectedAddress = computed(() => {
  const address = addressStore.selectedAddress
  if (!address) {
    throw new Error('No address selected')
  }
  return address
})

const handleAddOrder = async () => {
  try {
    loading.value = true;
    console.log('Selected Shipment ID:', addressStore.selectedShipping);
    if (!selectedAddress.value) {
      throw new Error('Please select a delivery address')
    }

    const orderData: OrderRequest = {
      variants: cartStore.items.map(item => ({
        quantity: item.quantity,
        variant: item.variant.id
      })),
      location: selectedAddress.value.id,
      shipping: addressStore.selectedShipping ?? 0,
      discount: cartStore.discountCode || undefined
    };

    console.log('Prepared Order Data:', orderData);

    const response = await createOrderService(orderData);
    console.log('Payment URL received:', response.data.url);
    if (response.data) {
      window.location.href = response.data.url;
    } else {
      throw new Error('No payment URL received');
    }

  } catch (error) {
    console.error('Error processing order:', error);
    snackbar.show('خطا در ثبت سفارش', {
      color: 'error',
      timeout: 3000
    });
  } finally {
    loading.value = false;
  }
};
</script>


<template>
  <div style="padding-bottom: 72px">
    <PaymentCard />

    <div class="bottom-bar pa-4">
      <v-btn class="primary mt-4" block :text="$t('shared.continue')" @click=handleAddOrder />
    </div>

  </div>
</template>