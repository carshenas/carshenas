import carshenasService from '@/services'
import type { GetOTPBody } from '@/types/dto/auth'
import type { NullableNumber } from '@/types/global'

export const getOTPService = (body: GetOTPBody) =>
  carshenasService.post<{ detail: string; otpExp: NullableNumber }, GetOTPBody>('/user/otp', {
    body
  })
