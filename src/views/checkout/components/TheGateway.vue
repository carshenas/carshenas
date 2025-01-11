<script setup lang="ts">
import PaymentCard from './PaymentCard.vue'

const emit = defineEmits<{
  (e: 'next'): void
}>()
</script>

<template>
  <div style="padding-bottom: 72px">
    <PaymentCard />

    <div class="bottom-bar pa-4">
      <v-btn class="primary mt-4" block :text="$t('shared.continue')" @click="emit('next')" />
    </div>

  </div>
</template>

<style scoped>
.bottom-bar {
  background-color: white;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
