export const MOBILE_NUMBER_REGEXP = /^(0|\+98|0098)9[0-9]{9}$/
export const PHONE_NUMBER_REGEXP = /^((0|\+98|0098)[1-9]{2})?[1-9][0-9]{3,7}$/g
export const NATIONAL_ID_REGEXP = /^(?!(\d)\1{9})[0-9]{10}$/
export const EMAIL_REGEXP =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g
export const PERSIAN_NUMBERS_REGEXP = /[۰-۹]/g
export const ARABIC_NUMBERS_REGEXP = /[٠-٩]/g
export const IMAGE_FILE_EXTENSIONS_REGEXP = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/
