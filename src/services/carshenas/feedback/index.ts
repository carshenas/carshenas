import type { Feedback } from '@/types/dto/feedback'
import carshenasService from '@/services'

export const updateFeedback = (productId: number, body: Feedback) =>
  carshenasService.post<Feedback>(`/feedback/${productId}/`, {
    body: body
  })
