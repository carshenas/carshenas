import type { Nullable } from "../utilities";

export interface Ticket {
  id: number;
  user: string;
  supportEmployee: string;
  dateCreated: string;
  status: "Approved" | "Closed" | "Pending";
  lastMessage: Nullable<Message>;
}

export interface TicketMessages {
  id: number;
  user: string;
  order: string | null;
  status: "Approved" | "Closed" | "Pending";
  messages: Message[] | null;
}

export interface Message {
  message: string;
  isAnswer: boolean;
  file?: Blob | string | null;
}
