<script lang="ts" setup>
import TheCart from './components/TheCart.vue'
import TheTransport from './components/TheTransport.vue'
import TheGateway from './components/TheGateway.vue'
import { ref, computed } from 'vue'

const step = ref<0 | 1 | 2>(0)
const component = computed(() => [TheCart, TheTransport, TheGateway][step.value])

const onNext = () => step.value++
</script>

<template>
  <div class="h-100 d-flex flex-column">
    <v-stepper class="h-fit" v-model="step" alt-labels editable>
      <v-stepper-header>
        <v-stepper-item :title="$t('checkout.cart')" value="0" color="primary" edit-icon="local_mall"
          :complete="step > 0"></v-stepper-item>

        <v-divider></v-divider>

        <v-stepper-item :title="$t('checkout.transport')" value="1" color="primary" edit-icon="local_shipping"
          :complete="step > 1"></v-stepper-item>

        <v-divider></v-divider>

        <v-stepper-item :title="$t('checkout.pay')" value="2" color="primary" edit-icon="credit_card"></v-stepper-item>
      </v-stepper-header>
    </v-stepper>

    <v-divider thickness="8" color="divider" class="border-opacity-100" />

    <div class="flex-grow-1 overflow-auto">
      <component :is="component" @next="onNext" />
    </div>
  </div>
</template>
<style scoped>
.h-fit {
  max-height: 104px;
  height: 104px;
  min-height: 104px;
}
</style>