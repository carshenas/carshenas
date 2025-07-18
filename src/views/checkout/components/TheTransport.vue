<script setup lang="ts">
import { ref } from 'vue';
import PaymentCard from './PaymentCard.vue'
import AddressCard from './AddressCard.vue'
// import DeliveryTime from './DeliveryTime.vue'

const emit = defineEmits<{
  (e: 'next'): void
}>()

const isAddressValid = ref(false);

const handleAddressValidation = (isValid: boolean) => {
  isAddressValid.value = isValid;
};

const handleNext = () => {
  if (!isAddressValid.value) {
    // Show error message or snackbar
    return;
  }
  emit('next');
};
</script>

<template>
  <div style="padding-bottom: 72px">
    <AddressCard
      v-model="isAddressValid"
      @validation="handleAddressValidation"
    />

    <v-divider thickness="8" color="divider" class="border-opacity-100" />


    <v-divider thickness="8" color="divider" class="border-opacity-100" />

    <PaymentCard />

    <div class="bottom-bar pa-4">
      <v-btn 
        class="primary mt-4" 
        block 
        :text="$t('shared.continue')" 
        :disabled="!isAddressValid"
        @click="handleNext"
      />
    </div>
  </div>
</template>

<style scoped>
.bottom-bar {
  background-color: var(--v-theme-surface);
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
