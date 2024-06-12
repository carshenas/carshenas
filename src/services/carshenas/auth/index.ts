import carshenasService from '@/services'
import type { GetOTPBody, ValidateOTPBody } from '@/types/dto/auth'
import type { NullableNumber } from '@/types/global'

export const getOTPService = (body: GetOTPBody) =>
  carshenasService.post<{ detail: string; otpExp: NullableNumber }>('/user/otp/', {
    body
  })

export const validateOTPService = (body: ValidateOTPBody) =>
  carshenasService.post<{ access: string; refresh: string }>('/user/verify/', {
    body
  })
