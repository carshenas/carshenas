import useAppConfig from '@/composable/app-config'
import type { Nullable } from '@/types/utilities'

export const rates = {
  IRR: 1,
  IRT: 10
}

const converter = (
  value: Nullable<number> | Nullable<string>,
  fromRate: number,
  toRate: number,
  format?: boolean
) => {
  if (value) {
    const numberValue = Number(value.toString().replace(/,/g, ''))

    if (fromRate !== toRate) {
      const result =
        fromRate < toRate ? numberValue / toRate : numberValue * fromRate
      return format ? formatCurrency(result) : result
    }

    return format ? formatCurrency(numberValue) : numberValue
  }

  return 0
}

export const formatCurrency = (value: Nullable<number> | Nullable<string>) =>
  value ? Number(value.toString().replace(/,/g, '')).toLocaleString() : '0'

export const toDisplayCurrency = (value: Nullable<number> | Nullable<string>) =>
  converter(
    value,
    rates[useAppConfig().baseCurrencyUnit],
    rates[useAppConfig().displayCurrencyUnit],
    true
  )

export const toBaseCurrency = (
  value: Nullable<number> | Nullable<string>,
  format?: boolean
) =>
  converter(
    value,
    rates[useAppConfig().displayCurrencyUnit],
    rates[useAppConfig().baseCurrencyUnit],
    format
  )
