<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ phoneNumber: string; otpExpireTime: number; loading: boolean }>()
const emit = defineEmits<{
  (event: 'resend'): void;
  (event: 'submit-otp', otp: string): void
}>()

const router = useRouter()

const otp = ref<string>('')
const counterInitiateValue = props.otpExpireTime
const counter = ref(counterInitiateValue)
let refreshIntervalId: NodeJS.Timeout

const startTimer = () =>
(refreshIntervalId = setInterval(() => {
  if (counter.value > 0) counter.value--
  else clearInterval(refreshIntervalId)
}, 1000))

const receiveCodeAgain = () => {
  emit('resend')
  clearInterval(refreshIntervalId)
  counter.value = counterInitiateValue
  startTimer()
}

watch(otp, (newValue) => {
  if (newValue.length === 4 && !props.loading) {
    emit('submit-otp', newValue)
  }
})

const timer = computed(() => new Date(counter.value * 1000).toISOString().substring(14, 19))

onMounted(() => {
  startTimer()
})

const getOTP = () => otp.value

defineExpose({ getOTP })
</script>

<template>
  <div class="h-100 d-flex flex-column">
    <div class="flex-grow-1">
      <h1 class="title-lg">{{ $t('auth.verificationCode') }}</h1>

      <p class="body-md mt-4">
        {{ $t('auth.enterTheVerificationCodeSent', { number: props.phoneNumber }) }}
      </p>

      <v-btn :text="$t('auth.editPhone')" variant="plain" @click="router.back()" />

      <v-otp-input v-model="otp" dir="ltr" class="mt-8" autofocus :length="4" />

      <div class="counter mt-4 d-flex justify-center align-center">
        <p v-if="counter">
          {{ $t('auth.leftToReceiveTheCodeAgain', { timer }) }}
        </p>

        <v-btn v-else :text="$t('auth.receiveTheCodeAgain')" variant="plain" @click="receiveCodeAgain()" />
      </div>
    </div>

    <!-- Submit button kept for fallback but not needed for normal flow anymore -->
    <v-btn :loading="props.loading" type="submit">{{ $t('auth.login') }}</v-btn>
  </div>
</template>
