<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import 'leaflet/dist/leaflet.css'
import type { LatLng } from '@/types/dto/the-map'
import type { VForm } from 'vuetify/components'

const props = defineProps<{ position: LatLng | null }>()
const emit = defineEmits<{
  (
    e: 'submit',
    address: {
      id: number
      address: string
      plaque: number
      unit: number
      postalCode: string
      position: LatLng | null
    }
  ): void
}>()

const address = ref('')
const plaque = ref('')
const unit = ref('')
const postalCode = ref('')

const handleSubmit = () => {
  const plaqueNumber = parseInt(plaque.value)
  const unitNumber = parseInt(unit.value)
  const formData = {
    id: Date.now(),
    address: address.value,
    plaque: isNaN(plaqueNumber) ? 0 : plaqueNumber,
    unit: isNaN(unitNumber) ? 0 : unitNumber,
    postalCode: postalCode.value,
    position: props.position
  }
  emit('submit', formData)
}
</script>

<template>
  <v-container>
    <v-form
      class="flex-grow-1 d-flex flex-column justify-space-between"
      @submit.prevent="handleSubmit"
    >
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
              type="tel"
              v-model="plaque"
              class="pa-1"
              :label="$t('profile.plaque')"
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field
              type="tel"
              v-model="unit"
              class="pa-1"
              :label="$t('profile.unit')"
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col>
            <v-text-field
              type="tel"
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
