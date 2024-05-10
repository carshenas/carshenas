import { ARABIC_NUMBERS_REGEXP, PERSIAN_NUMBERS_REGEXP } from '@/constants/regexp'
import type { NullableString } from '@/types/global'

const persianNumbers = '۰۱۲۳۴۵۶۷۸۹'
const arabicNumbers = '٠١٢٣٤٥٦٧٨٩'

const convert = (value: string, regex: RegExp, numberSource: string) => {
  return value.replace(regex, (d) => numberSource.indexOf(d).toString())
}

export const toEnglishNumbers = (value: NullableString) => {
  if (value) {
    return convert(
      convert(value, PERSIAN_NUMBERS_REGEXP, persianNumbers),
      ARABIC_NUMBERS_REGEXP,
      arabicNumbers
    )
  }

  return value
}
