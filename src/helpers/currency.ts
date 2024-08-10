import useAppConfig from '@/composable/app-config'
import type { NullableNumber, NullableString } from '@/types/global'

export const rates = {
  IRR: 1,
  IRT: 10
}

const converter = (
  value: NullableNumber | NullableString,
  fromRate: number,
  toRate: number,
  format?: boolean
) => {
  if (value) {
    const numberValue = Number(value.toString().replace(/,/g, ''))

    if (fromRate !== toRate) {
      const result = fromRate < toRate ? numberValue / toRate : numberValue * fromRate
      return format ? formatCurrency(result) : result
    }

    return format ? formatCurrency(numberValue) : numberValue
  }

  return 0
}

export const formatCurrency = (value: NullableNumber | NullableString) =>
  value ? Number(value.toString().replace(/,/g, '')).toLocaleString() : '0'

export const toDisplayCurrency = (value: NullableNumber | NullableString) =>
  converter(
    value,
    rates[useAppConfig().baseCurrencyUnit],
    rates[useAppConfig().displayCurrencyUnit],
    true
  )

export const toBaseCurrency = (value: NullableNumber | NullableString, format?: boolean) =>
  converter(
    value,
    rates[useAppConfig().displayCurrencyUnit],
    rates[useAppConfig().baseCurrencyUnit],
    format
  )
