import {
  ARABIC_NUMBERS_REGEXP,
  PERSIAN_NUMBERS_REGEXP
} from '@/constants/regexp'
import type { Nullable } from '@/types/utilities'

const persianNumbers = '۰۱۲۳۴۵۶۷۸۹'
const arabicNumbers = '٠١٢٣٤٥٦٧٨٩'

const convert = (value: string, regex: RegExp, numberSource: string) => {
  return value.replace(regex, (d) => numberSource.indexOf(d).toString())
}

export const toEnglishNumbers = (value: Nullable<string>) => {
  if (value) {
    return convert(
      convert(value, PERSIAN_NUMBERS_REGEXP, persianNumbers),
      ARABIC_NUMBERS_REGEXP,
      arabicNumbers
    )
  }

  return value
}
