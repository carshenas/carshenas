<!-- SecondStep.vue -->
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

interface Props {
  phoneNumber: string
  otpExpireTime: number
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'back': []
  'submit-otp': [otp: string]
  'resend': []
}>()

// Calculate initial counter value from expiry time
const calculateInitialCounter = () => {
  const now = Date.now()
  const expireTime = props.otpExpireTime * 1000 // Convert to milliseconds
  const remainingTime = Math.max(0, Math.floor((expireTime - now) / 1000))
  return remainingTime
}

const counter = ref(calculateInitialCounter())
const otpValue = ref('')
let refreshIntervalId: NodeJS.Timeout | undefined

const startTimer = () => {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId)
  }
  
  refreshIntervalId = setInterval(() => {
    if (counter.value > 0) {
      counter.value--
    } else {
      clearInterval(refreshIntervalId)
    }
  }, 1000)
}

const receiveCodeAgain = async () => {
  otpValue.value = ''
  emit('resend')
  // Counter will be reset when new otpExpireTime is received
}

const timer = computed(() => {
  const minutes = Math.floor(counter.value / 60)
  const seconds = counter.value % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

const goBack = () => {
  emit('back')
}

const submitOtp = () => {
  if (otpValue.value.length === 4) {
    emit('submit-otp', otpValue.value)
  }
}

// Watch for changes in otpExpireTime (when resending OTP)
watch(() => props.otpExpireTime, () => {
  counter.value = calculateInitialCounter()
  startTimer()
})

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId)
  }
})
</script>

<template>
  <div class="h-100 d-flex flex-column">
    <div class="flex-grow-1">

      <p class="body-md mt-4">
        {{ $t('auth.enterTheVerificationCodeSent', { number: phoneNumber }) }}
      </p>

      <v-btn 
        :text="$t('auth.editPhone')" 
        variant="plain" 
        @click="goBack"
        :disabled="loading"
      />

      <v-otp-input 
        v-model="otpValue"
        dir="ltr" 
        class="mt-8" 
        autofocus 
        :length="4"
        :disabled="loading"
        @finish="submitOtp"
      />

      <div class="counter mt-4 d-flex justify-center align-center">
        <p v-if="counter">
          {{ $t('auth.leftToReceiveTheCodeAgain', { timer }) }}
        </p>

        <v-btn
          v-else
          :text="$t('auth.receiveTheCodeAgain')"
          variant="plain"
          @click="receiveCodeAgain"
          :loading="loading"
        />
      </div>
    </div>

    <v-btn 
      :disabled="otpValue.length !== 4"
      :loading="loading"
      @click="submitOtp"
    >
      {{ $t('auth.login') }}
    </v-btn>
  </div>
</template>
