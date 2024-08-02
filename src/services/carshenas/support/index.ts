import carshenasService from '@/services'
import type { TicketList, TicketMessages, Message } from '@/types/dto/tickets'

export const getTicketListService = () => carshenasService.get<TicketList>('/support/')

export const getTicketService = (id: number) =>
  carshenasService.get<TicketMessages>(`/support/${id}`, {})

export const createTicketService = (body: FormData) =>
  carshenasService.post<{
    message: string
    file?: Blob
  }>('/support/', {
    body
  })

export const updateTicketService = (id: number, data: { message: string }) => {
  const formData = new FormData()
  formData.append('message', data.message)
  return carshenasService.put<string>(`/support/${id}/`, {
    body: formData
  })
}
