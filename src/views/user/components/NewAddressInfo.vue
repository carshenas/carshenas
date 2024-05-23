<script setup lang="ts">
import { ref } from 'vue'
import NewAddressMap from './NewAddressMap.vue'

const position = ref<{ lat: number; lng: number } | null>(null)
const address = ref('')
const plaque = ref('')
const unit = ref('')
const postalCode = ref('')

// Define the function to handle the emitted position update
const handleMapPositionUpdate = (newPosition: { lat: number; lng: number }) => {
  position.value = newPosition
}

const handleSubmit = () => {
  const formData = {
    address: address.value,
    plaque: plaque.value,
    unit: unit.value,
    postalCode: postalCode.value,
    position: position.value
  }
  console.log('Form Data:', formData)
}
</script>

<template>
  <v-container>
    <v-form
      class="flex-grow-1 d-flex flex-column justify-space-between"
      @submit.prevent="handleSubmit"
    >
      <newAddressMap @update:position="handleMapPositionUpdate" />
      <div>
        <v-row no-gutters>
          <v-col>
            <v-text-field
              v-model="address"
              class="pa-1 mt-4"
              :label="$t('profile.address')"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="3">
            <v-text-field
              v-model="plaque"
              class="pa-1"
              :label="$t('profile.plaque')"
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field
              v-model="unit"
              class="pa-1"
              :label="$t('profile.unit')"
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col>
            <v-text-field
              v-model="postalCode"
              class="pa-1"
              :label="$t('profile.postalCode')"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>

      <div>
        <v-btn block rounded="pill" color="primary" size="x-large" hide-details type="submit">
          {{ $t('shared.submit') }}
        </v-btn>
      </div>
    </v-form>
  </v-container>
</template>
