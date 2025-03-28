export interface ProductBase {
  id: number;
  name?: string;
  description?: string;
  price: number;
  quantity: number;
  stock?: number;
  out_of_stock?: boolean;
}

export interface ProductWithImage extends ProductBase {
  image: string;
  images?: never;
}

export interface ProductWithImages extends ProductBase {
  images: string[];
  image?: string | null;
}

export type Product = ProductWithImage | ProductWithImages;

export interface ProductFilter {
  title?: string;
  vehicleName?: string;
}

export interface Variant extends ProductWithImages {
  is_unlimited?: boolean;
  specification?: Record<string, any>;
  brand: string;
  warranty?: string;
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
