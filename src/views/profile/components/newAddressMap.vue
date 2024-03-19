<script setup lang="ts">
const emit = defineEmits(['showInfo']);

const handleSubmit = () => {
  emit('showInfo');
};
</script>

<template>
  <img src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/w_1920,c_limit/GoogleMapTA.jpg" alt="" />
  <div class="pa-4">
    <v-btn block rounded="pill" color="primary" size="x-large" hide-details @click="handleSubmit">
      {{ $t('shared.submit') }}
    </v-btn>
  </div>
</template>
