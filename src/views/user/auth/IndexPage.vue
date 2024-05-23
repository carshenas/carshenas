<script lang="ts" setup>
import { reactive, ref } from 'vue'

// components
import FirstStep from './components/FirstStep.vue'
import SecondStep from './components/SecondStep.vue'
import type { VForm } from 'vuetify/components'
import { onBeforeRouteLeave } from 'vue-router'

// Services
import { getOTPService } from '@/services/carshenas/auth'
import type { NullableNumber, NullableString } from '@/types/global'
import { snakeCaseObjectToCamelCase } from '@/helpers/general'

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
    const phoneNumber = activeComponent.value.getModel()
    const response = await getOTPService(phoneNumber)

    console.log(response)

    props.phoneNumber = phoneNumber
    props.otpExpireTime = response.data.otpExp
    step.value++
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

let test = snakeCaseObjectToCamelCase<{
  hello_world: string
  hello_world1: string
  hello_world2: string
}>({
  hello_world: 'check',
  hello_world1: 'check',
  hello_world2: 'check'
})

console.log(test)

const sendOTP = () => ''

onBeforeRouteLeave((_, _2, next) => {
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
        />
      </KeepAlive>
    </v-form>
  </v-container>
</template>

<style scoped>
.counter {
  height: var(--v-btn-height);
}
</style>
