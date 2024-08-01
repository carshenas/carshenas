import carshenasService from '@/services'
import type { TicketList, TicketMessages } from '@/types/dto/tickets'

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
