<script setup lang="ts">
import useAppConfig from '@/composable/app-config'
import { toDisplayCurrency } from '@/helpers/currency'
import type { NullableNumber, NullableString } from '@/types/global'
import { computed } from 'vue'

const appConfig = useAppConfig()

const props = withDefaults(
  defineProps<{
    value: NullableNumber | NullableString
    valueClass?: string | string[]
    unitClass?: string | string[]
    showUnit?: boolean
  }>(),
  { showUnit: true }
)
const computedValue = computed(() => {
  return toDisplayCurrency(props.value)
})
</script>

<template>
  <div class="d-flex">
    <span :class="props.valueClass" data-test="value">
      {{ computedValue }}
    </span>

    <span v-if="props.showUnit" :class="['ms-1', props.unitClass]" data-test="unit">
      {{ $t(`currency.${appConfig.displayCurrencyUnit}`) }}
    </span>
  </div>
</template>
