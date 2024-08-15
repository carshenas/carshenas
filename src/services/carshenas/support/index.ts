import carshenasService from '@/services'
import type { Ticket, TicketMessages } from '@/types/dto/tickets'
import type { Pagination } from '@/types/dto/pagination'

export const getTicketListService = () => carshenasService.get<Pagination<Ticket[]>>('/support/')

export const getTicketService = (id: number) =>
  carshenasService.get<TicketMessages>(`/support/${id}`)

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
