import type { Nullable } from '../utilities'

export interface GetOTPBody extends FormData {
  phoneNumber: Nullable<string>
}

export interface GetOTPResponse {}

export interface ValidateOTPBody extends FormData {
  otp: Nullable<number>
  phoneNumber: Nullable<string>
}
