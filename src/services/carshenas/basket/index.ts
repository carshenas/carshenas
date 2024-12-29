import carshenasService from "@/services";
import type { BasketItem, BasketRequest } from "@/types/dto/basket";

export const addToBasketService = (data: BasketRequest) => {
  const formData = new FormData();
  if (data.variant) formData.append("variant", data.variant.toString());
  if (data.stock) formData.append("stock", data.stock.toString());
  return carshenasService.post("/basket/", {
    body: formData,
  });
};

export const getBasketService = () => {
  return carshenasService.get<BasketItem[]>("/basket/");
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