export interface Product {
  id: number;
  images: string[]; // Update to support multiple images
  title: string;
  description: string;
  price: number;
  quantity: number;
  stock: number;
}

export interface ProductFilter {
  title?: string;
}

export interface Variant extends Product {
  is_unlimited: boolean;
  specification: Record<string, any>;
  brand: string;
  warranty: string;
  color: Color;
}

export interface Color {
  name: string;
  code: string;
}

export interface Warranty {
  name: string;
  price: number[];
  color: Color[];
}

export interface Brand {
  name: string;
  warranties: Warranty[];
}
