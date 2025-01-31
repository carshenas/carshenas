import { MOBILE_NUMBER_REGEXP } from '@/constants/regexp'
import i18n from '@/plugins/i18n'
import type {
  ValidatorValue,
  ValidationResult
} from '@/helpers/validator/types.ts'
import type { Nullable } from '@/types/utilities'

const { t } = i18n.global
export const getMessage = (
  translationKey: string,
  label?: Nullable<string>,
  extra?: Object
) =>
  t(`validator.${translationKey}.${label ? 'labeled' : 'default'}`, {
    label,
    ...extra
  })

export const required = (
  value: ValidatorValue,
  label?: Nullable<string>
): ValidationResult => !!value || getMessage('required', label)

export const mobile = (
  value: ValidatorValue,
  label?: Nullable<string>
): ValidationResult =>
  MOBILE_NUMBER_REGEXP.test(value || '') || getMessage('invalid', label)
