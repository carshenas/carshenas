<script lang="ts" setup>
import vMobileInput from '@/directives/v-mobile-input'
import vFocus from '@/directives/v-focus'
import { mobile, required } from '@/helpers/validation'
import i18n from '@/plugins/i18n'
import type { ValidationParam, ValidationResult } from '@/types/validation'

const { t } = i18n.global
const rules = [
  (v: ValidationParam): ValidationResult => required(v, t('shared.phone')),
  (v: ValidationParam): ValidationResult => mobile(v, t('shared.phone'))
]
</script>

<template>
  <div class="h-100 d-flex flex-column">
    <div class="flex-grow-1">
      <h1 class="title-lg">{{ $t('auth.login') }}</h1>

      <p class="body-md mt-4">{{ $t('auth.enterPhone') }}</p>

      <v-text-field
        v-focus
        v-mobile-input
        :label="$t('shared.phone')"
        class="mt-8"
        :rules="rules"
      />
    </div>

    <v-btn type="submit">{{ $t('auth.login') }}</v-btn>
  </div>
</template>
