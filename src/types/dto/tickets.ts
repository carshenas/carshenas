export interface Ticket {
  id: number
  user: string
  supportEmployee: string
  date_created: string
  status: 'approved' | 'rejected' | 'Pending'
  last_message: Message
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
