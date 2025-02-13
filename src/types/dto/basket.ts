import type { Variant } from "./product";

export interface BasketRequest {
  variant?: number;
  quantity: number;
}

export interface BasketItem {
  id: number;
  name?: string;
  variant: Variant;
  quantity: number;
}
