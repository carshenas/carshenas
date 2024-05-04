<script lang="ts" setup>
import { reactive, ref } from 'vue'

// components
import FirstStep from './components/FirstStep.vue'
import SecondStep from './components/SecondStep.vue'
import type { VForm } from 'vuetify/components'
import { onBeforeRouteLeave } from 'vue-router'

// Services
import { getOTPService } from '@/services/carshenas/auth'

const step = ref<0 | 1>(0)
const form = ref<VForm>()
const props = reactive({
  number: '09393557744'
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
    const response = await getOTPService(activeComponent.value.getModel())
    console.log(response)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

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
