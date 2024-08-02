import carshenasService from '@/services'
import type { Ticket, SendMessage } from '@/types/dto/tickets'

export const getTicketList = () => carshenasService.get<Ticket>(`/support/`)

export const createTicket = (body: SendMessage) =>
  carshenasService.post<{
    message: string
    file?: Blob
  }>('/support/', {
    body
  })
