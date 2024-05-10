import { MOBILE_NUMBER_REGEXP } from '@/constants/regexp'
import i18n from '@/plugins/i18n'
import type { NullableString } from '@/types/global'
import type { ValidationParam, ValidationResult } from '@/types/validation'

const { t } = i18n.global
export const getMessage = (translationKey: string, label?: NullableString, extra?: Object) =>
  t(`validation.${translationKey}.${label ? 'labeled' : 'default'}`, {
    label,
    ...extra
  })

export const required = (value: ValidationParam, label?: NullableString): ValidationResult =>
  !!value || getMessage('required', label)

export const mobile = (value: ValidationParam, label?: NullableString): ValidationResult =>
  MOBILE_NUMBER_REGEXP.test(value || '') || getMessage('invalid', label)
