// basketService.ts
import carshenasService from "@/services";
import type { BasketItem, BasketRequest } from "@/types/dto/basket";

// Credentials config only for GET requests
const getRequestConfig = {
  withCredentials: true,
  credentials: "include" as RequestCredentials,
};

export const addToBasketService = (
  data: BasketRequest
): Promise<BasketItem> => {
  const formData = new FormData();
  if (data.variant) formData.append("variant", data.variant.toString());
  if (data.quantity) formData.append("quantity", data.quantity.toString());
  return carshenasService
    .post<BasketItem>("/basket/", {
      body: formData,
      ...getRequestConfig,
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
  if (data.quantity) formData.append("quantity", data.quantity.toString());

  return carshenasService.patch(`/basket/${itemId}/`, {
    body: formData,
    ...getRequestConfig,
  });
};

export const deleteBasketService = (itemId: number) => {
  return carshenasService.delete(`/basket/${itemId}/`), { ...getRequestConfig };
};
