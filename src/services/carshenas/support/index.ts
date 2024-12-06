import carshenasService from '@/services'
import type { Message, Ticket, TicketMessages } from '@/types/dto/tickets'
import type { Pagination } from '@/types/dto/pagination'

export const getTicketListService = (limit: number, offset: number) => {
  const url = `/support/?limit=${limit}&offset=${offset}`
  return carshenasService.get<Pagination<Ticket[]>>(url)
}

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
    return carshenasService.put<{ messages: Message[] }>(`/support/${id}/`, {
      body: formData
    })
  }
  