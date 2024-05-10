<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps<{ number: string; loading: boolean }>()
const router = useRouter()
const counterInitiateValue = 5
const counter = ref(counterInitiateValue)
let refreshIntervalId: NodeJS.Timeout

const startTimer = () =>
  (refreshIntervalId = setInterval(() => {
    if (counter.value > 0) counter.value--
    else clearInterval(refreshIntervalId)
  }, 1000))

const receiveCodeAgain = () => {
  clearInterval(refreshIntervalId)
  counter.value = counterInitiateValue
  startTimer()
}

const timer = computed(() => new Date(counter.value * 1000).toISOString().substring(14, 19))

onMounted(() => {
  startTimer()
})
</script>

<template>
  <div class="h-100 d-flex flex-column">
    <div class="flex-grow-1">
      <h1 class="title-lg">{{ $t('auth.verificationCode') }}</h1>

      <p class="body-md mt-4">
        {{ $t('auth.enterTheVerificationCodeSent', { number }) }}
      </p>

      <v-btn :text="$t('auth.editPhone')" variant="plain" @click="router.back()" />

      <v-otp-input dir="ltr" class="mt-8" autofocus :length="5" />

      <div class="counter mt-4 d-flex justify-center align-center">
        <p v-if="counter">
          {{ $t('auth.leftToReceiveTheCodeAgain', { timer }) }}
        </p>

        <v-btn
          v-else
          :text="$t('auth.receiveTheCodeAgain')"
          variant="plain"
          @click="receiveCodeAgain()"
        />
      </div>
    </div>

    <v-btn :loading="loading">{{ $t('auth.login') }}</v-btn>
  </div>
</template>
