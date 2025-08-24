<!-- AuthBottomSheet.vue -->
<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'

// components
import FirstStep from './FirstStep.vue'
import SecondStep from './SecondStep.vue'
import type { VForm } from 'vuetify/components'

// Services
import { getOTPService, validateOTPService } from '@/services/carshenas/auth'
import type { GetOTPBody, ValidateOTPBody } from '@/types/dto/auth'
import { useUserStore } from '@/stores/user'
import { useSnackbar } from '@/stores/snackbar'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import type { Nullable } from '@/types/utilities'

// Props for bottom sheet control
interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'complete': [data: { phoneNumber: string }]
}>()

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { t } = useI18n()
const snackbarStore = useSnackbar()

const step = ref<0 | 1>(0)
const form = ref<VForm>()
const loading = ref<boolean>(false)

const formData = reactive<{
  phoneNumber: Nullable<string>
  otpExpireTime: Nullable<number>
}>({
  phoneNumber: null,
  otpExpireTime: null
})

// Control bottom sheet visibility
const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal
})

watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal)
  // Reset step and form data when closing
  if (!newVal) {
    step.value = 0
    formData.phoneNumber = null
    formData.otpExpireTime = null
    loading.value = false
  }
})

const next = async () => {
  const { valid: isValid } = await form.value!.validate()

  if (!isValid) return

  if (step.value === 0) {
    await getOTP()
  }
}

const getOTP = async () => {
  loading.value = true
  try {
    const body = new FormData()
    body.append('phone_number', formData.phoneNumber!)
    
    const response = await getOTPService(body as GetOTPBody)

    formData.otpExpireTime = response.data.otpExp
    step.value++
  } catch (e) {
    console.error('Failed to get OTP:', e)
    snackbarStore.show(t('message.otpRequestFailed'))
  } finally {
    loading.value = false
  }
}

const sendOTP = async (otp: string) => {
  loading.value = true
  try {
    const body = new FormData()
    body.append('phone_number', formData.phoneNumber!)
    body.append('otp', otp)
    
    const response = await validateOTPService(body as ValidateOTPBody)
    
    // Update user store
    userStore.user.token = response.data.access
    userStore.user.refreshToken = response.data.refresh
    userStore.user.phoneNumber = formData.phoneNumber
    userStore.updateStoredData()

    // Close bottom sheet
    close()
    
    // Emit complete event
    emit('complete', { phoneNumber: formData.phoneNumber! })
    
    // Show success message
    snackbarStore.show(t('message.loginSuccessfully'))
    
    // Handle redirect if needed
    if (route.query.redirect) {
      router.replace(route.query.redirect as string)
    }
  } catch (e) {
    console.error('Failed to validate OTP:', e)
    snackbarStore.show(t('message.invalidOtp'))
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  if (step.value > 0) {
    step.value--
    formData.phoneNumber = null
    formData.otpExpireTime = null
  }
}

const close = () => {
  isOpen.value = false
}

const updatePhoneNumber = (value: string) => {
  formData.phoneNumber = value
}

const handleResendOTP = async () => {
  await getOTP()
}
</script>

<template>
  <v-bottom-sheet
    v-model="isOpen"
    persistent
    :scrim="true"
    :max-height="600"
  >
    <v-card>
      <!-- Header with close button -->
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6">
          {{ step === 0 ? $t('auth.login') : $t('auth.verificationCode') }}
        </span>
        <v-btn
          icon="close"
          variant="text"
          size="small"
          @click="close"
          :disabled="loading"
        />
      </v-card-title>

      <!-- Form content -->
      <v-card-text>
        <v-form ref="form" @submit.prevent="next">
          <FirstStep 
            v-if="step === 0"
            :modelValue="formData.phoneNumber"
            :loading="loading"
            @update:modelValue="updatePhoneNumber"
          />
          
          <SecondStep 
            v-else
            :phoneNumber="formData.phoneNumber!"
            :otpExpireTime="formData.otpExpireTime!"
            :loading="loading"
            @back="goBack"
            @submit-otp="sendOTP"
            @resend="handleResendOTP"
          />
        </v-form>
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>
