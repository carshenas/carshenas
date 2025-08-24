<!-- SecondStep.vue -->
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

interface Props {
  phoneNumber: string
  otpExpireTime: number // This is seconds, not a timestamp!
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'back': []
  'submit-otp': [otp: string]
  'resend': []
}>()

// Since otpExpireTime is already in seconds (60), just use it directly
const calculateInitialCounter = () => {
  // The otpExpireTime prop is the number of seconds, not a timestamp
  return props.otpExpireTime || 60
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

// Auto-submit when 4 digits are entered
watch(otpValue, (newValue) => {
  if (newValue.length === 4) {
    submitOtp()
  }
})

// Watch for changes in otpExpireTime (when resending OTP)
watch(() => props.otpExpireTime, (newExpireTime) => {
  console.log('OTP Expire Time Changed:', newExpireTime)
  counter.value = newExpireTime || 60
  startTimer()
})

onMounted(() => {
  console.log('Component mounted, otpExpireTime:', props.otpExpireTime)
  console.log('Initial counter:', counter.value)
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
        :disabled="loading || counter === 0"
        @finish="submitOtp" 
      />

      <div class="counter mt-4 d-flex justify-center align-center">
        <p v-if="counter" class="timer-text">
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
      :disabled="otpValue.length !== 4 || loading"
      :loading="loading" 
      @click="submitOtp"
      block
      size="large"
      class="mt-4"
    >
      {{ $t('auth.login') }}
    </v-btn>
  </div>
</template>

<style scoped>
.timer-text {
  color: rgb(var(--v-theme-on-surface));
  font-size: 0.875rem;
}
</style>
