import carshenasService from "@/services";
import type { OrderRequest } from "@/types/dto/order";

interface OrderResponse {
  url: string;
}


export const createOrderService = (data: OrderRequest) =>
  carshenasService.post<OrderResponse>("/order/", {
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  });
