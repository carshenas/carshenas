// basketService.ts
import carshenasService from "@/services";
import type { BasketItem, BasketRequest } from "@/types/dto/basket";

// Credentials config only for GET requests
const getRequestConfig = {
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": "true",
    Credentials: "include",
  },
  withCredentials: true,
  credentials: "include" as RequestCredentials,
};

export const addToBasketService = (
  data: BasketRequest
): Promise<BasketItem> => {
  const formData = new FormData();
  if (data.variant) formData.append("variant", data.variant.toString());
  if (data.stock) formData.append("stock", data.stock.toString());
  return carshenasService
    .post<BasketItem>("/basket/", {
      body: formData,
    })
    .then((response) => response.data);
};

export const getBasketService = () => {
  return carshenasService.get<BasketItem[]>("/basket/", {
    ...getRequestConfig,
  });
};

export const patchBasketService = (itemId: number, data: BasketRequest) => {
  const formData = new FormData();
  if (data.stock) formData.append("stock", data.stock.toString());

  return carshenasService.patch(`/basket/${itemId}/`, {
    body: formData,
  });
};

export const deleteBasketService = (itemId: number) => {
  return carshenasService.delete(`/basket/${itemId}/`);
};
