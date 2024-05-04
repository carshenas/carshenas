import carshenasService from '@/services'
import type { GetOTPBody } from '@/types/dto/auth'

export const getOTPService = (body: GetOTPBody) => carshenasService.post('/user/otp', { body })
