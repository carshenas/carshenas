import carshenasService from '@/services'
import type { GetOTPBody, ValidateOTPBody } from '@/types/dto/auth'
import type { Nullable } from '@/types/utilities'

export const getOTPService = (body: GetOTPBody) =>
  carshenasService.post<{ detail: string; otpExp: Nullable<number> }>(
    '/user/otp/',
    {
      body
    }
  )

export const validateOTPService = (body: ValidateOTPBody) =>
  carshenasService.post<{ access: string; refresh: string }>('/user/verify/', {
    body
  })
