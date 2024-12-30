import i18n from '@/plugins/i18n'

import type { Nullable } from '@/types/utilities'
import {
  EMAIL_REGEXP,
  MOBILE_NUMBER_REGEXP,
  NATIONAL_ID_REGEXP,
  PHONE_NUMBER_REGEXP
} from '../../constants/regexp'
import type { RuleMapper, ValidatorValue } from './types'

// helpers
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

// rules
export const required = (value: ValidatorValue, label?: Nullable<string>) =>
  !!value || getMessage('required', label)

export const mobile = (value: ValidatorValue, label?: Nullable<string>) =>
  value
    ? value.match(MOBILE_NUMBER_REGEXP) !== null || getMessage('invalid', label)
    : true

export const phone = (value: ValidatorValue, label?: Nullable<string>) =>
  value
    ? value.match(PHONE_NUMBER_REGEXP) !== null || getMessage('invalid', label)
    : true

export const length = (
  value: ValidatorValue,
  label?: Nullable<string>,
  params?: string[]
) => {
  if (!params || !params.length) throw Error('Required param not provided')
  const length = Number(params[0])

  return value
    ? value.length === length || getMessage('length', label, { length })
    : true
}

export const minLength = (
  value: ValidatorValue,
  label?: Nullable<string>,
  params?: string[]
) => {
  if (!params || !params.length) throw Error('Required param not provided')
  const length = Number(params[0])

  return value
    ? value.length >= length || getMessage('minLength', label, { length })
    : true
}

export const maxLength = (
  value: ValidatorValue,
  label?: Nullable<string>,
  params?: string[]
) => {
  if (!params || !params.length) throw Error('Required param not provided')
  const length = Number(params[0])

  return value
    ? value.length <= length || getMessage('maxLength', label, { length })
    : true
}

export const equalTo = (
  value: ValidatorValue,
  label?: Nullable<string>,
  params?: string[]
) => {
  if (!params || !params.length || params.length < 2)
    throw Error('Required param not provided')
  const [otherValue, otherLabel] = params

  return value === otherValue || getMessage('equalTo', label, { otherLabel })
}

export const nationalId = (value: ValidatorValue, label?: Nullable<string>) => {
  if (value === undefined || value === null) return true

  const checkValue = String(value)

  // check national-id length and repeat numbers
  if (!NATIONAL_ID_REGEXP.test(checkValue)) return getMessage('invalid', label)

  // check that if it's a valid national-id
  const check = parseInt(checkValue[9])
  let sum = 0
  checkValue
    .slice(0, 9)
    .split('')
    .forEach((char, index) => {
      sum += parseInt(char) * (10 - index)
    })
  sum %= 11

  return (
    (sum < 2 && check === sum) ||
    (sum >= 2 && check + sum === 11) ||
    getMessage('invalid', label)
  )
}

export const email = (value: ValidatorValue, label?: Nullable<string>) =>
  value
    ? value.match(EMAIL_REGEXP) !== null || getMessage('invalid', label)
    : true

export const min = (
  value: ValidatorValue,
  label?: Nullable<string>,
  params?: string[]
) => {
  if (!params || !params.length) throw Error('Required param not provided')
  const minValue = Number(params[0])

  return value
    ? Number(value.toString().replaceAll(',', '')) >= minValue ||
        getMessage('min', label, { min: minValue.toLocaleString() })
    : true
}

export const max = (
  value: ValidatorValue,
  label?: Nullable<string>,
  params?: string[]
) => {
  if (!params || !params.length) throw Error('Required param not provided')
  const maxValue = Number(params[0])

  return value
    ? Number(value.toString().replaceAll(',', '')) <= maxValue ||
        getMessage('max', label, { max: maxValue.toLocaleString() })
    : true
}

export const ruleMapper: RuleMapper = {
  required,
  mobile,
  phone,
  length,
  minLength,
  maxLength,
  equalTo,
  nationalId,
  email,
  min,
  max
}
