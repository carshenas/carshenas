<!-- FirstStep.vue -->
<script lang="ts" setup>
import vMobileInput from '@/directives/v-mobile-input'
import vFocus from '@/directives/v-focus'
import { useI18n } from 'vue-i18n'
import validator from '@/helpers/validator'

interface Props {
  modelValue: string | null
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()
const rules = [
  (v: any) => validator(v, 'required', t('shared.phone')),
  (v: any) => validator(v, 'mobile', t('shared.phone'))
]

const updateValue = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="h-100 d-flex flex-column ga-8">
    <div class="flex-grow-1">
      <h1 class="title-lg">{{ $t('auth.login') }}</h1>

      <p class="body-md mt-4">{{ $t('auth.enterPhone') }}</p>

      <v-text-field
        v-focus
        v-mobile-input
        :label="$t('shared.phone')"
        class="mt-8"
        :rules="rules"
        :modelValue="modelValue"
        @update:modelValue="updateValue"
        :disabled="loading"
      />
    </div>

    <v-btn 
      type="submit" 
      :loading="loading"
      :disabled="!modelValue"
    >
      {{ $t('auth.login') }}
    </v-btn>
  </div>
</template>
