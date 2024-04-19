<script lang="ts" setup>
import { reactive, ref } from 'vue'

// components
import FirstStep from './components/FirstStep.vue'
import SecondStep from './components/SecondStep.vue'
import type { VForm } from 'vuetify/components'
import { onBeforeRouteLeave } from 'vue-router'

const step = ref<0 | 1>(0)
const form = ref<VForm>()
const props = reactive({
  number: '09393557744'
})

const next = async () => {
  const { valid: isValid } = await form.value!.validate()

  !isValid || step.value++
}

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
    <VForm ref="form" class="h-100" @submit.prevent="next">
      <KeepAlive>
        <component :is="step ? SecondStep : FirstStep" v-bind="props" />
      </KeepAlive>
    </VForm>
  </v-container>
</template>

<style scoped>
.counter {
  height: var(--v-btn-height);
}
</style>
