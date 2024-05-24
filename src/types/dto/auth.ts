import type { NullableNumber, NullableString } from '../global'

export interface GetOTPBody extends FormData {
  phoneNumber: NullableString
}

export interface GetOTPResponse {}

export interface ValidateOTPBody extends FormData {
  otp: NullableString
  phoneNumber: NullableString
}
