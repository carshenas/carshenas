import type { Feedback } from '@/types/dto/feedback'
import carshenasService from '@/services'

export const updateFeedback = (productId: number, body: Feedback) => {
  const formData = new FormData()

  // Assuming `Feedback` has properties like `message`, `rating`, etc.
  // Append each property of `Feedback` to the `formData`
  Object.entries(body).forEach(([key, value]) => {
    formData.append(key, value as string | Blob)
  })

  return carshenasService.post<Feedback>(`/feedback/${productId}/`, {
    body: formData
  })
}