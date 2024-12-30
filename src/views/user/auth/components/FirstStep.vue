<script lang="ts" setup>
import vMobileInput from '@/directives/v-mobile-input'
import vFocus from '@/directives/v-focus'
import validator from '@/helpers/validator'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

defineProps<{
  loading: boolean
}>()
const { t } = useI18n()
const phoneNumber = ref<string>()
const rules = [
  (v: any) => validator(v, 'required', t('shared.title')),
  (v: any) => validator(v, 'mobile', t('shared.title'))
]

const getPhoneNumber = () => phoneNumber.value
defineExpose({ getPhoneNumber })
</script>

<template>
  <div class="h-100 d-flex flex-column">
    <div class="flex-grow-1">
      <h1 class="title-lg">{{ $t('auth.login') }}</h1>

      <p class="body-md mt-4">{{ $t('auth.enterPhone') }}</p>

      <v-text-field
        v-focus
        v-mobile-input
        v-model="phoneNumber"
        :label="$t('shared.phone')"
        class="mt-8"
        :rules="rules"
      />
    </div>

    <v-btn :loading="loading" type="submit">{{ $t('auth.login') }}</v-btn>
  </div>
</template>
