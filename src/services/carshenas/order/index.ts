import carshenasService from "@/services";
import type {
  OrderListResponse,
  OrderRequest,
  OrderResponse,
  ShippingResponse,
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

export const getOrderShipping = (id: number) =>
  carshenasService.get<ShippingResponse>(`/order/shipping/${id}/`);
