import carshenasService from "@/services";
import type {
  OrderListResponse,
  OrderRequest,
  OrderResponse,
} from "@/types/dto/order";

export const createOrderService = (data: OrderRequest) =>
  carshenasService.post<OrderResponse>("/order/", {
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  });

export const getOrderList = () =>
  carshenasService.get<[OrderListResponse]>("/order/");

export const getOrderDetail = (id: number) =>
  carshenasService.get<OrderListResponse>(`/order/${id}/`);
