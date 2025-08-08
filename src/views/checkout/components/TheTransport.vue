<script setup lang="ts">
import { computed, ref } from 'vue';
import PaymentCard from './PaymentCard.vue'
import AddressCard from './AddressCard.vue'
// import DeliveryTime from './DeliveryTime.vue'

const emit = defineEmits<{
  (e: 'next'): void
}>()

const isAddressValid = ref(false);

const handleAddressValidation = (isValid: boolean) => {
  isAddressValid.value = isValid;
  console.log('Address validation changed:', isValid);
};

// Optional: Add more specific validation logic
const canProceed = computed(() => {
  console.log('Checking if can proceed:', isAddressValid.value);
  return isAddressValid.value;
});

const handleNext = () => {
  if (!canProceed.value) {
    console.log('Cannot proceed - validation failed');
    return;
  }
  console.log('Proceeding to next step');
  emit('next');
};
</script>

<template>
  <div style="padding-bottom: 72px">
    <AddressCard v-model="isAddressValid" @validation="handleAddressValidation" />

    <v-divider thickness="8" color="divider" class="border-opacity-100" />


    <v-divider thickness="8" color="divider" class="border-opacity-100" />

    <PaymentCard />

    <div class="bottom-bar pa-4">
      <v-btn class="primary mt-4" block :text="$t('shared.continue')" :disabled="!canProceed" @click="handleNext" />
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
