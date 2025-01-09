import carshenasService from "@/services";
import type { BasketItem, BasketRequest } from "@/types/dto/basket";

const credentialsHeader = {
  headers: {
    Credentials: "Include", 
  },
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
      ...credentialsHeader, // Include credentials in headers
    })
    .then((response) => response.data); // Extract the data from the response
};

export const getBasketService = () => {
  return carshenasService.get<BasketItem[]>("/basket/", {
    ...credentialsHeader, // Include credentials in headers
  });
};

export const patchBasketService = (itemId: number, data: BasketRequest) => {
  const formData = new FormData();
  if (data.stock) formData.append("stock", data.stock.toString());

  return carshenasService.patch(`/basket/${itemId}/`, {
    body: formData,
    ...credentialsHeader, // Include credentials in headers
  });
};

export const deleteBasketService = (itemId: number) => {
  return carshenasService.delete(`/basket/${itemId}/`, {
    ...credentialsHeader, // Include credentials in headers
  });
};
