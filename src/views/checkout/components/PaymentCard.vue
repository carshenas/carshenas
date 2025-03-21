<script setup lang="ts">
import CurrencyDisplay from '@/components/CurrencyDisplay.vue'
import { useCartStore } from '@/stores/cart'
import { ref } from 'vue'

const cartStore = useCartStore()
const discountCode = ref('')
const loading = ref(false)
const showDiscountInput = ref(false)
const appliedDiscount = ref<{ code: string; amount: number } | null>(null)

const applyDiscountCode = async () => {
  if (!discountCode.value) return
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    appliedDiscount.value = {
      code: discountCode.value,
      amount: 1000
    }
    showDiscountInput.value = false
    discountCode.value = ''
  } catch (error) {
    console.error('Error applying discount:', error)
  } finally {
    loading.value = false
  }
}

const removeDiscount = () => {
  appliedDiscount.value = null
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
            </div>
          </div>
          <div class="d-flex align-center gap-2">
            <div class="text-primary font-weight-medium">
              <CurrencyDisplay :value="appliedDiscount.amount" value-class="text-primary font-weight-bold"
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
      <CurrencyDisplay :value="appliedDiscount?.amount || 0" value-class="text-primary font-weight-bold"
        unit-class="body-sm text-outline" class="d-flex justify-end body-md" />
    </div>

    <v-divider class="my-2" />

    <div class="d-flex justify-space-between">
      <p class="label-md">{{ $t('checkout.payable') }} :</p>
      <CurrencyDisplay
        :value="(cartStore.payableAmount + cartStore.deliveryPriceComputed) - (appliedDiscount?.amount || 0)"
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
