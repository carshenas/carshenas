<script lang="ts" setup>
import TheCart from './components/TheCart.vue'
import TheTransport from './components/TheTransport.vue'
import TheGateway from './components/TheGateway.vue'
import { ref, computed, watch } from 'vue'
import { useUserStore } from "@/stores/user"
import { useRouter } from 'vue-router'
import { useSnackbar } from '@/stores/snackbar'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const step = ref<0 | 1 | 2>(0)
const snackbarStore = useSnackbar()
const component = computed(() => [TheCart, TheTransport, TheGateway][step.value])

watch(step, (newStep) => {
  if (newStep > 0 && !userStore.isLoggedIn) {
    step.value = 0
    router.push('/login?redirect=/checkout')
  }
})

const onNext = () => {
  if (!userStore.isLoggedIn && step.value === 0) {
    router.push('/authentication?redirect=/checkout')
    snackbarStore.show(t('message.loginNeeded'))
    return
  }
  step.value++
}
</script>

<template>
  <div class="h-100 d-flex flex-column">
    <v-stepper class="h-fit" v-model="step" alt-labels :editable="userStore.isLoggedIn">
      <v-stepper-header>
        <v-stepper-item :title="$t('checkout.cart')" value="0" color="primary" edit-icon="local_mall"
          :complete="step > 0" />

        <v-divider />

        <v-stepper-item :title="$t('checkout.transport')" value="1" color="primary" edit-icon="local_shipping"
          :complete="step > 1" :disabled="!userStore.isLoggedIn" />

        <v-divider />

        <v-stepper-item :title="$t('checkout.pay')" value="2" color="primary" edit-icon="credit_card"
          :disabled="!userStore.isLoggedIn" />
      </v-stepper-header>
    </v-stepper>

    <v-divider thickness="8" color="divider" class="border-opacity-100" />

    <div class="flex-grow-1 overflow-auto">
      <component :is="component" @next="onNext" />
    </div>

    <!-- Optional: Show login prompt when user is not logged in -->
    <!-- <v-alert v-if="!userStore.isLoggedIn && step === 0" color="warning" class="ma-4">
      {{ $t('checkout.loginRequired') }}
    </v-alert> -->
  </div>
</template>

<style scoped>
.h-fit {
  max-height: 104px;
  height: 104px;
  min-height: 104px;
}
</style>