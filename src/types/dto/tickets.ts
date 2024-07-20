export interface Ticket {
  id: number
  user: string
  supportEmployee: string
  dateCreated: string
  status: 'approved' | 'rejected' | 'Pending'
  lastMessage: Message
}
export interface TicketList {
  result: Ticket[]
}
export interface Message {
  message: string
  is_answer: boolean
  file?: Blob | null
}
