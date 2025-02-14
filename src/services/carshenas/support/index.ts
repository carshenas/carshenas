import carshenasService from "@/services";
import type { Ticket, TicketMessages } from "@/types/dto/tickets";
import type { Pagination } from "@/types/dto/pagination";

export const getTicketListService = (limit: number, offset: number) => {
  const url = `/support/?limit=${limit}&offset=${offset}`;
  return carshenasService.get<Pagination<Ticket[]>>(url);
};

export const getTicketService = (id: number) =>
  carshenasService.get<TicketMessages>(`/support/${id}/`);

export const createTicketService = (body: FormData) =>
  carshenasService.post<{
    message: string;
    file?: Blob;
  }>("/support/", {
    body,
  });

export const updateTicketService = (id: number, body: FormData) =>
  carshenasService.put<{
    message: string;
    file?: Blob;
  }>(`/support/${id}/`, {
    body,
  });

export const closeTicketService = (id: number) => {
  return carshenasService.patch(`/support/${id}/close/`);
};
