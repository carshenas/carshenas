import type { Nullable } from '../utilities'

export interface Ticket {
  id: number
  user: string
  supportEmployee: string
  dateCreated: string
  status: 'Approved' | 'Rejected' | 'Pending'
  lastMessage: Nullable<Message>
}

export interface TicketMessages {
  id: number
  user: string
  order: string | null
  status: 'Approved' | 'Rejected' | 'Pending'
  messages: Message[] | null
}

export interface Message {
  message: string
  is_answer: boolean
  file?: Blob | null
}
