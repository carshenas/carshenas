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
      postalCode: string
      isDefault: boolean
      receiverName?: string
    }
  ): void
}>()

const formRef = ref<VForm | null>(null)

const address = ref(props.latLngString || '')
const plaque = ref('')
const unit = ref('')
const postalCode = ref('')
const receiverName = ref('') // Added receiver name field

const requiredRule = (value: string) => !!value || 'لطفا آدرس خود را بنویسد'

const positiveInteger = (value: string) => {
  const intValue = parseInt(value)
  return (Number.isInteger(intValue) && intValue >= 0) || 'وارد کنید '
}

const postalCodeValidation = (value: string) => {
  const regex = /^[13-9]{4}[1346-9][013-9]{5}$/
  return regex.test(value) || 'کد پستی درست وارد کنید'
}

const receiverNameValidation = (value: string) => {
  if (!value) return true // Make it optional
  return value.length >= 2 || 'نام تحویل گیرنده باید حداقل ۲ کاراکتر باشد'
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
      isDefault: false,
      receiverName: receiverName.value,
    }
    console.log('Form Data:', FormData)
    emit('submit', FormData)
  }
}
</script>

<template>
  <v-container>
    <v-form ref="formRef" class="flex-grow-1 d-flex flex-column justify-space-between" @submit.prevent="handleSubmit">
      <div>
        <!-- Receiver Name Field -->
        <v-row no-gutters>
          <v-col>
            <v-text-field v-model="receiverName" class="pa-1 mt-4" :label="$t('user.receiverName')" variant="outlined"
              :rules="[receiverNameValidation]" :placeholder="$t('user.receiverNamePlaceholder')" />
          </v-col>
        </v-row>

        <!-- Address Field -->
        <v-row no-gutters>
          <v-col>
            <v-text-field v-model="address" class="pa-1" :label="$t('user.address')" variant="outlined"
              :rules="[requiredRule]" :placeholder="latLngString?.toString()" />
          </v-col>
        </v-row>

        <!-- Plaque, Unit, and Postal Code Row -->
        <v-row no-gutters>
          <v-col cols="3">
            <v-text-field type="tel" v-model="plaque" class="pa-1" :label="$t('user.plaque')" variant="outlined"
              :rules="[positiveInteger]" />
          </v-col>

          <v-col cols="3">
            <v-text-field type="tel" v-model="unit" class="pa-1" :label="$t('user.unit')" variant="outlined"
              :rules="[positiveInteger]" />
          </v-col>

          <v-col>
            <v-text-field v-model="postalCode" type="tel" class="pa-1" :label="$t('user.postalCode')" variant="outlined"
              :rules="[postalCodeValidation]" maxlength="10" prepend-inner-icon="mdi-mailbox-outline" />
          </v-col>
        </v-row>
      </div>

      <!-- Submit Button -->
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
