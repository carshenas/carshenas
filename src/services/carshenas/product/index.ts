import carshenasService from "@/services";
import type { Product, ProductFilter } from "@/types/dto/product";
import type { Pagination } from "@/types/dto/pagination";

export const getProductListService = (parameters?: ProductFilter) =>
  carshenasService.get<Pagination<Product[]>>("/product/", { parameters });

export const getProductDetailsService = (id: number) =>
  carshenasService.get<Product[]>(`/product/${id}/`, {});
