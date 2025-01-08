import type { Variant } from "./product";

export interface BasketRequest {
  variant?: number;
  stock: number;
}

export interface BasketItem {
  id: number;
  variant: Variant;
  stock: number;
}

