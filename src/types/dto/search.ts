import type { Vehicle } from "./brands";
import type { Category } from "./category";
import type { Product } from "./product";

export interface SearchApiResponse {
  vehicles: Vehicle[];
  categories: Category[];
  products: Product[];
}
