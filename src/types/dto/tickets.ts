export interface Ticket {
  id: number
  user: string
  supportEmployee: string
  dateCreated: string
  status: 'approved' | 'rejected' | 'Pending'
  lastMessage: Message | null
}

export interface TicketMessages {
  id: number
  user: string
  order: string | null
  status: 'approved' | 'rejected' | 'Pending'
  messages: Message[] | null
}
export interface TicketList {
  result: Ticket[]
}
export interface Message {
  message: string
  is_answer: boolean
  file?: Blob | null
}
