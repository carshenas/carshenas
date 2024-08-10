<script lang="ts" setup>
import { reactive, ref } from 'vue'

// components
import FirstStep from './components/FirstStep.vue'
import SecondStep from './components/SecondStep.vue'
import type { VForm } from 'vuetify/components'
import { useRouter } from 'vue-router'

// Services
import { getOTPService, validateOTPService } from '@/services/carshenas/auth'
import type { NullableNumber, NullableString } from '@/types/global'
import type { GetOTPBody, ValidateOTPBody } from '@/types/dto/auth'
import { useUserStore } from '@/stores/user'
import useOnBack from '@/composable/on-back'

const router = useRouter()
const userStore = useUserStore()
const step = ref<0 | 1>(0)
const form = ref<VForm>()

const props = reactive<{
  phoneNumber: NullableString
  otpExpireTime: NullableNumber
}>({
  phoneNumber: null,
  otpExpireTime: null
})

const loading = ref<boolean>(false)
const next = async () => {
  const { valid: isValid } = await form.value!.validate()

  if (!isValid) return

  step.value ? sendOTP() : getOTP()
}

const activeComponent = ref()
const getOTP = async () => {
  loading.value = true
  try {
    const phoneNumber = props.phoneNumber || activeComponent.value.getPhoneNumber()
    const body = new FormData()

    body.append('phone_number', phoneNumber)
    const response = await getOTPService(body as GetOTPBody)

    props.phoneNumber = phoneNumber
    props.otpExpireTime = response.data.otpExp
    step.value++
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const sendOTP = async () => {
  loading.value = true
  try {
    const otp = activeComponent.value.getOTP()

    const body = new FormData()

    body.append('phone_number', props.phoneNumber || '')
    body.append('otp', otp)
    const response = await validateOTPService(body as ValidateOTPBody)

    userStore.user.token = response.data.access
    userStore.user.phoneNumber = props.phoneNumber

    userStore.updateStoredData()
    router.replace({ name: 'HomePage' })
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

useOnBack((_, _2, next) => {
  if (!step.value) next()
  else {
    next(false)
    step.value--
  }
})
</script>

<template>
  <v-container class="h-100">
    <v-form ref="form" class="h-100" @submit.prevent="next">
      <KeepAlive>
        <component
          ref="activeComponent"
          v-bind="props"
          :is="step ? SecondStep : FirstStep"
          :loading="loading"
          @resend="getOTP"
        />
      </KeepAlive>
    </v-form>
  </v-container>
</template>
