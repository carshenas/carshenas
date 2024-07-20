import carshenasService from '@/services'
import type { TicketList } from '@/types/dto/tickets'

export const getTicketList = () => carshenasService.get<TicketList>('/support/')

export const createTicket = (body: FormData) =>
  carshenasService.post<{
    message: string
    file?: Blob
  }>('/support/', {
    body
  })
