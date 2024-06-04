export interface Ticket {
  id: number
  user: string
  supportEmployee: string
  dateCreated: string
  status: 'approved' | 'rejected' | 'Pending'
  lastMessage: Message
}

export interface Message {
  message: string
  is_answer: boolean
  file?: Blob | null
}
export interface SendMessage extends FormData {
  message: string
  file?: Blob | null
}
