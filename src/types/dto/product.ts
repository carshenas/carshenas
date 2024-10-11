export interface ProductBase {
  id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
  stock: number;
}

export interface ProductWithImage extends ProductBase {
  image: string;
  images?: never; // Explicitly state that this can't coexist with images
}

export interface ProductWithImages extends ProductBase {
  images: string[];
  image?: never; // Explicitly state that this can't coexist with image
}

export type Product = ProductWithImage | ProductWithImages;

export interface ProductFilter {
  title?: string;
}

export interface Variant extends ProductWithImages {
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
