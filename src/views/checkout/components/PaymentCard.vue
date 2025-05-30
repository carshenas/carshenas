<script setup lang="ts">
import CurrencyDisplay from '@/components/CurrencyDisplay.vue'
import { useCartStore } from '@/stores/cart'
import { ref, computed, onMounted } from 'vue'
import { checkDiscount } from '@/services/carshenas/order'
import type { DiscountResponse } from '@/types/dto/order'
import { useSnackbar } from '@/stores/snackbar'

const emit = defineEmits<{
  (e: 'discount-applied', code: string): void;
}>();

const cartStore = useCartStore()
const discountCode = ref('')
const loading = ref(false)
const showDiscountInput = ref(false)
const appliedDiscount = ref<DiscountResponse | null>(null)
const snackbar = useSnackbar()

// Initialize discount code from store if it exists
onMounted(async () => {
  if (cartStore.discountCode) {
    try {
      const response = await checkDiscount(cartStore.discountCode)
      appliedDiscount.value = response.data
    } catch (error) {
      cartStore.discountCode = null
    }
  }
})

const calculateDiscountAmount = computed(() => {
  if (!appliedDiscount.value) return 0
  
  const totalPrice = cartStore.payableAmount + cartStore.deliveryPriceComputed
  if (appliedDiscount.value.type === 'Percentage') {
    return (totalPrice * appliedDiscount.value.amount) / 100
  }
  return appliedDiscount.value.amount
})

const applyDiscountCode = async () => {
  if (!discountCode.value) return
  loading.value = true
  try {
    const response = await checkDiscount(discountCode.value)
    appliedDiscount.value = response.data
    cartStore.discountCode = discountCode.value
    showDiscountInput.value = false
    emit('discount-applied', discountCode.value)
    discountCode.value = ''
  } catch (error) {
    snackbar.show('کد تخفیف درست نیست', {
      color: 'error',
      timeout: 3000
    })
  } finally {
    loading.value = false
  }
}

const removeDiscount = () => {
  appliedDiscount.value = null
  cartStore.discountCode = null
  emit('discount-applied', '')
}
</script>

<template>
  <v-container>
    <h2 class="my-2 title-sm">{{ $t('checkout.payment') }}</h2>

    <!-- Discount Code Section -->
    <div v-if="!appliedDiscount" class="mb-4">
      <v-expand-transition>
        <div v-if="showDiscountInput">
          <div class="d-flex align-center gap-2">
            <v-text-field v-model="discountCode" :placeholder="$t('checkout.enterDiscountCode')" variant="outlined"
              density="compact" hide-details :loading="loading" @keyup.enter="applyDiscountCode" />
            <v-btn color="primary" :loading="loading" @click="applyDiscountCode" min-width="80">
              {{ $t('checkout.apply') }}
            </v-btn>
          </div>
        </div>
      </v-expand-transition>

      <v-btn v-if="!showDiscountInput" variant="text" color="primary" prepend-icon="local_offer" class="px-0"
        @click="showDiscountInput = true">
        {{ $t('checkout.addDiscountCode') }}
      </v-btn>
    </div>

    <!-- Applied Discount Card -->
    <v-expand-transition>
      <v-card v-if="appliedDiscount" variant="outlined" class="mb-4" color="primary">
        <v-card-text class="d-flex justify-space-between align-center">
          <div>
            <div class="text-primary font-weight-medium">
              {{ $t('checkout.discountApplied') }}
            </div>
            <div class="text-caption text-primary">
              {{ appliedDiscount.code }}
              <span v-if="appliedDiscount.type === 'Percentage'">({{ appliedDiscount.amount }}%)</span>
            </div>
          </div>
          <div class="d-flex align-center gap-2">
            <div class="text-primary font-weight-medium">
              <CurrencyDisplay :value="calculateDiscountAmount" value-class="text-primary font-weight-bold"
                unit-class="body-sm text-primary" class="d-flex justify-end body-md" />
            </div>
            <v-btn icon="close" variant="text" density="compact" color="primary" @click="removeDiscount" />
          </div>
        </v-card-text>
      </v-card>
    </v-expand-transition>

    <!-- Existing Price Summary -->
    <div class="d-flex justify-space-between">
      <p class="label-md text-outline">{{ $t('checkout.productsPrice') }}</p>
      <CurrencyDisplay :value="cartStore.payableAmount" value-class="text-primary font-weight-bold"
        unit-class="body-sm text-outline" class="d-flex justify-end body-md" />
    </div>

    <div class="d-flex justify-space-between">
      <p class="label-md text-outline">{{ $t('checkout.deliveryPrice') }}</p>
      <CurrencyDisplay :value="cartStore.deliveryPriceComputed" value-class="text-primary font-weight-bold"
        unit-class="body-sm text-outline" class="d-flex justify-end body-md" />
    </div>

    <div class="d-flex justify-space-between">
      <p class="label-md text-outline">{{ $t('checkout.discount') }}</p>
      <CurrencyDisplay :value="calculateDiscountAmount" value-class="text-primary font-weight-bold"
        unit-class="body-sm text-outline" class="d-flex justify-end body-md" />
    </div>

    <v-divider class="my-2" />

    <div class="d-flex justify-space-between">
      <p class="label-md">{{ $t('checkout.payable') }} :</p>
      <CurrencyDisplay
        :value="(cartStore.payableAmount + cartStore.deliveryPriceComputed) - calculateDiscountAmount"
        value-class="text-primary font-weight-bold" unit-class="body-sm text-outline"
        class="d-flex justify-end body-md" />
    </div>
  </v-container>
</template>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
