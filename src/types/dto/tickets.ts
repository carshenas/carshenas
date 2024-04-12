export default interface Ticket {
  id: number
  user: string
  supportEmployee: string
  state: 'approved' | 'rejected' | 'doing'
  messages: Message[]
}

interface Message {
  text: string
  sender: 'user' | 'employee'
  time: string
  date: string
}
