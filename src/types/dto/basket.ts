import type { Variant } from "./product";

export interface BasketRequest {
  variant?: number;
  stock: number;
}

export interface BasketItem {
  id: number;
  name?: string;
  variant: Variant;
  stock: number;
}
