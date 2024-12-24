<script setup lang="ts">
import { ref, computed } from 'vue'
import 'leaflet/dist/leaflet.css'
import type { LatLng } from '@/types/dto/the-map'
import type { VForm } from 'vuetify/components'

const props = defineProps<{
  position: LatLng
  latLngString: string | null
  loading: boolean
}>()

const emit = defineEmits<{
  (
    e: 'submit',
    address: {
      name: string
      address: string
      latitude: number
      longitude: number
      postal_code: string
      is_default: boolean
    }
  ): void
}>()
const formRef = ref<VForm | null>(null)

const address = ref(props.latLngString || '')
const plaque = ref('')
const unit = ref('')
const postal_code = ref('')

const requiredRule = (value: string) => !!value || 'لطفا آدرس خود را بنویسد'

const positiveInteger = (value: string) => {
  const intValue = parseInt(value)
  return (Number.isInteger(intValue) && intValue >= 0) || ''
}

const postal_codeValidation = (value: string) => {
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
      postal_code: postal_code.value,
      is_default: false
    }
    emit('submit', FormData)
  }
}
</script>

<template>
  <v-container>
    <v-form ref="formRef" class="flex-grow-1 d-flex flex-column justify-space-between" @submit.prevent="handleSubmit">
      <div>
        <v-row no-gutters>
          <v-col>
            <v-text-field v-model="address" class="pa-1 mt-4" :label="$t('user.address')" variant="outlined"
              :rules="[requiredRule]" :placeholder="latLngString?.toString()"></v-text-field>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="3">
            <v-text-field type="tel" v-model="plaque" class="pa-1" :label="$t('user.plaque')" variant="outlined"
              :rules="[positiveInteger]"></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field type="tel" v-model="unit" class="pa-1" :label="$t('user.unit')" variant="outlined"
              :rules="[positiveInteger]"></v-text-field>
          </v-col>

          <v-col>
            <v-text-field v-model="postal_code" type="tel" class="pa-1" :label="$t('user.postal_code')"
              variant="outlined" :rules="[postal_codeValidation]" maxlength="10"></v-text-field>
          </v-col>
        </v-row>
      </div>
      <div>
        <v-btn block rounded="pill" color="primary" size="x-large" hide-details type="submit" :disabled="loading">
          <template v-if="loading">
            <v-progress-circular indeterminate size="20" color="white" />
          </template>
          <template v-else>
            {{ $t('shared.submit') }}
          </template>
        </v-btn>

      </div>
    </v-form>
  </v-container>
</template>
