<script lang="ts" setup>
import { reactive, ref } from 'vue'

// components
import FirstStep from './components/FirstStep.vue'
import SecondStep from './components/SecondStep.vue'
import type { VForm } from 'vuetify/components'
import { useRoute, useRouter } from 'vue-router'

// Services
import { getOTPService, validateOTPService } from '@/services/carshenas/auth'
import type { GetOTPBody, ValidateOTPBody } from '@/types/dto/auth'
import { useUserStore } from '@/stores/user'
import useOnBack from '@/composable/on-back'
import { useSnackbar } from '@/stores/snackbar'
import { useI18n } from 'vue-i18n'
import type { Nullable } from '@/types/utilities'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const step = ref<0 | 1>(0)
const form = ref<VForm>()

const props = reactive<{
  phoneNumber: Nullable<string>
  otpExpireTime: Nullable<number>
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
    const phoneNumber =
      props.phoneNumber || activeComponent.value.getPhoneNumber()
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

const { t } = useI18n()
const snackbarStore = useSnackbar()
const sendOTP = async (providedOtp?: string) => {
  loading.value = true
  try {
    const otp = providedOtp || activeComponent.value.getOTP()

    const body = new FormData()

    body.append('phone_number', props.phoneNumber || '')
    body.append('otp', otp)
    const response = await validateOTPService(body as ValidateOTPBody)
    userStore.user.token = response.data.access
    userStore.user.refreshToken = response.data.refresh
    userStore.user.phoneNumber = props.phoneNumber

    userStore.updateStoredData()

    if (route.query.redirect)
      return router.replace(route.query.redirect as string)

    router.replace({ name: 'HomePage' })

    snackbarStore.show(t('message.loginSuccessfully'))
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}


const handleSubmitOtp = (otpValue: unknown) => {
  if (typeof otpValue === "string") {
    sendOTP(otpValue)
  } else {
    console.error("OTP must be a string");
  }
};

useOnBack((_, _2, next) => {
  if (!step.value) next()
  else {
    next(false)
    step.value--,
    props.phoneNumber = null

  }
})
</script>

<template>
  <v-container class="h-100">
    <v-form ref="form" class="h-100" @submit.prevent="next">
      <KeepAlive>
        <component ref="activeComponent" v-bind="props" :is="step ? SecondStep : FirstStep" :loading="loading"
          @resend="getOTP" @submit-otp="handleSubmitOtp" />
      </KeepAlive>
    </v-form>
  </v-container>
</template>
