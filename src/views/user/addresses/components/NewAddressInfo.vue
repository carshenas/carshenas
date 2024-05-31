<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue'
import 'leaflet/dist/leaflet.css'
import type { LatLng } from '@/types/dto/the-map'
import type { VForm } from 'vuetify/components'

const props = defineProps<{
  position: LatLng
  latLngString: string | null
}>()

const emit = defineEmits<{
  (
    e: 'submit',
    address: {
      name: string
      address: string
      latitude: number
      longitude: number
      postalCode: string
      is_default: boolean
    }
  ): void
}>()
const formRef = ref<VForm | null>(null)

const address = ref(props.latLngString || '')
const plaque = ref('')
const unit = ref('')
const postalCode = ref('')

const requiredRule = (value: string) => !!value || 'لطفا آدرس خود را بنویسد'

const positiveInteger = (value: string) => {
  const intValue = parseInt(value)
  return (Number.isInteger(intValue) && intValue >= 0) || ''
}

const postalCodeValidation = (value: string) => {
  const regex = /^[13-9]{4}[1346-9][013-9]{5}$/
  return regex.test(value) || 'کد پستی درست وارد کنید'
}

const concatenatedAddress = computed(() => {
  return `${address.value} پلاک: ${plaque.value} واحد: ${unit.value}`
})

const handleSubmit = async () => {
  const { valid: isValid } = await formRef.value!.validate()

  if (isValid) {
    const FormData = {
      name: 'test',
      address: concatenatedAddress.value,
      latitude: props.position.lat,
      longitude: props.position.lng,
      postalCode: postalCode.value,
      is_default: false
    }
    emit('submit', FormData)
  }
}
</script>

<template>
  <v-container>
    <v-form
      ref="formRef"
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
              :rules="[requiredRule]"
              :placeholder="latLngString"
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
              :rules="[positiveInteger]"
            ></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field
              type="tel"
              v-model="unit"
              class="pa-1"
              :label="$t('profile.unit')"
              variant="outlined"
              :rules="[positiveInteger]"
            ></v-text-field>
          </v-col>

          <v-col>
            <v-text-field
              v-model="postalCode"
              type="tel"
              class="pa-1"
              :label="$t('profile.postalCode')"
              variant="outlined"
              :rules="[postalCodeValidation]"
              maxlength="10"
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
